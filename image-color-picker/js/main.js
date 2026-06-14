    import { t } from './i18n.js?v=20260615';

    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');
    const previewWrap = document.getElementById('previewWrap');
    const previewImg = document.getElementById('previewImg');
    const fileName = document.getElementById('fileName');
    const colorCount = document.getElementById('colorCount');
    const colorCountVal = document.getElementById('colorCountVal');
    const btnExtract = document.getElementById('btnExtract');
    const mainArea = document.getElementById('mainArea');
    const emptyState = document.getElementById('emptyState');
    const copiedToast = document.getElementById('copiedToast');
    const hiddenCanvas = document.getElementById('hiddenCanvas');

    const savedList = document.getElementById('savedList');
    const btnSave = document.getElementById('btnSave');
    const saveInputRow = document.getElementById('saveInputRow');
    const saveName = document.getElementById('saveName');
    const btnSaveConfirm = document.getElementById('btnSaveConfirm');

    let loadedImage = null;
    let currentClusters = null;
    let currentTotalPixels = 0;

    const STORAGE_KEY = 'image-color-picker-palettes';

    function loadSavedPalettes() {
      try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
      } catch {
        return [];
      }
    }

    function savePalettes(palettes) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(palettes));
    }

    function renderSavedList() {
      const palettes = loadSavedPalettes();
      if (palettes.length === 0) {
        savedList.innerHTML = `<div class="saved-empty">${t.savedEmpty}</div>`;
        return;
      }
      savedList.innerHTML = '';
      palettes.forEach((p, idx) => {
        const item = document.createElement('div');
        item.className = 'saved-item';
        const colorsHtml = p.colors.map(hex => `<span style="background:${hex}"></span>`).join('');
        item.innerHTML = `
          <div class="saved-colors">${colorsHtml}</div>
          <div class="saved-meta">
            <span class="saved-name">${escapeHtml(p.name)}</span>
            <span class="saved-date">${p.date}</span>
            <div class="saved-actions">
              <button class="load-btn" data-idx="${idx}">${t.load}</button>
              <button class="delete-btn" data-idx="${idx}">${t.delete}</button>
            </div>
          </div>`;
        savedList.appendChild(item);
      });

      savedList.querySelectorAll('.load-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const p = loadSavedPalettes()[parseInt(btn.dataset.idx)];
          if (p) loadPalette(p);
        });
      });

      savedList.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const palettes = loadSavedPalettes();
          palettes.splice(parseInt(btn.dataset.idx), 1);
          savePalettes(palettes);
          renderSavedList();
          showToast(t.deleted);
        });
      });
    }

    function loadPalette(p) {
      const clusters = p.colors.map((hex, i) => ({
        rgb: hexToRgb(hex),
        count: p.counts ? p.counts[i] : 1
      }));
      const total = clusters.reduce((sum, c) => sum + c.count, 0);
      currentClusters = clusters;
      currentTotalPixels = total;
      btnSave.disabled = false;
      renderResults(clusters, total);
      showToast(t.loaded(p.name));
    }

    function hexToRgb(hex) {
      const h = hex.replace('#', '');
      return [parseInt(h.substring(0, 2), 16), parseInt(h.substring(2, 4), 16), parseInt(h.substring(4, 6), 16)];
    }

    btnSave.addEventListener('click', () => {
      saveInputRow.classList.add('active');
      saveName.value = '';
      saveName.focus();
    });

    btnSaveConfirm.addEventListener('click', confirmSave);
    saveName.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') confirmSave();
    });

    function confirmSave() {
      if (!currentClusters) return;
      const name = saveName.value.trim() || t.defaultName(loadSavedPalettes().length + 1);
      const now = new Date();
      const date = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
      const palettes = loadSavedPalettes();
      palettes.unshift({
        name,
        date,
        colors: currentClusters.map(c => rgbToHex(...c.rgb)),
        counts: currentClusters.map(c => c.count)
      });
      savePalettes(palettes);
      saveInputRow.classList.remove('active');
      renderSavedList();
      showToast(t.saved);
    }

    renderSavedList();

    colorCount.addEventListener('input', () => {
      colorCountVal.textContent = colorCount.value;
    });

    dropZone.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropZone.classList.add('dragover');
    });

    dropZone.addEventListener('dragleave', () => {
      dropZone.classList.remove('dragover');
    });

    dropZone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropZone.classList.remove('dragover');
      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith('image/')) {
        handleFile(file);
      }
    });

    fileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        handleFile(file);
      }
    });

    function handleFile(file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          loadedImage = img;
          previewImg.src = e.target.result;
          fileName.textContent = file.name;
          previewWrap.classList.add('active');
          btnExtract.disabled = false;
          extractColors();
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }

    btnExtract.addEventListener('click', extractColors);

    function extractColors() {
      if (!loadedImage) return;

      const ctx = hiddenCanvas.getContext('2d', { willReadFrequently: true });
      const maxSize = 200;
      const scale = Math.min(maxSize / loadedImage.width, maxSize / loadedImage.height, 1);
      const w = Math.floor(loadedImage.width * scale);
      const h = Math.floor(loadedImage.height * scale);
      hiddenCanvas.width = w;
      hiddenCanvas.height = h;
      ctx.drawImage(loadedImage, 0, 0, w, h);

      const imageData = ctx.getImageData(0, 0, w, h);
      const pixels = [];
      for (let i = 0; i < imageData.data.length; i += 4) {
        const r = imageData.data[i];
        const g = imageData.data[i + 1];
        const b = imageData.data[i + 2];
        const a = imageData.data[i + 3];
        if (a < 128) continue;
        pixels.push([r, g, b]);
      }

      const k = parseInt(colorCount.value);
      const clusters = kMeans(pixels, k, 20);
      clusters.sort((a, b) => b.count - a.count);

      currentClusters = clusters;
      currentTotalPixels = pixels.length;
      btnSave.disabled = false;
      renderResults(clusters, pixels.length);
    }

    function kMeans(pixels, k, maxIter) {
      const centroids = initCentroids(pixels, k);

      for (let iter = 0; iter < maxIter; iter++) {
        const assignments = new Array(pixels.length);
        for (let i = 0; i < pixels.length; i++) {
          let minDist = Infinity;
          let best = 0;
          for (let j = 0; j < centroids.length; j++) {
            const d = colorDist(pixels[i], centroids[j]);
            if (d < minDist) {
              minDist = d;
              best = j;
            }
          }
          assignments[i] = best;
        }

        const sums = centroids.map(() => [0, 0, 0]);
        const counts = new Array(centroids.length).fill(0);

        for (let i = 0; i < pixels.length; i++) {
          const c = assignments[i];
          sums[c][0] += pixels[i][0];
          sums[c][1] += pixels[i][1];
          sums[c][2] += pixels[i][2];
          counts[c]++;
        }

        let converged = true;
        for (let j = 0; j < centroids.length; j++) {
          if (counts[j] === 0) continue;
          const newR = Math.round(sums[j][0] / counts[j]);
          const newG = Math.round(sums[j][1] / counts[j]);
          const newB = Math.round(sums[j][2] / counts[j]);
          if (newR !== centroids[j][0] || newG !== centroids[j][1] || newB !== centroids[j][2]) {
            converged = false;
          }
          centroids[j] = [newR, newG, newB];
        }

        if (converged) break;
      }

      const finalCounts = new Array(centroids.length).fill(0);
      for (let i = 0; i < pixels.length; i++) {
        let minDist = Infinity;
        let best = 0;
        for (let j = 0; j < centroids.length; j++) {
          const d = colorDist(pixels[i], centroids[j]);
          if (d < minDist) {
            minDist = d;
            best = j;
          }
        }
        finalCounts[best]++;
      }

      return centroids.map((c, i) => ({
        rgb: c,
        count: finalCounts[i]
      }));
    }

    function initCentroids(pixels, k) {
      const centroids = [];
      const idx = Math.floor(Math.random() * pixels.length);
      centroids.push([...pixels[idx]]);

      for (let i = 1; i < k; i++) {
        const dists = pixels.map(p => {
          let minD = Infinity;
          for (const c of centroids) {
            minD = Math.min(minD, colorDist(p, c));
          }
          return minD;
        });
        const total = dists.reduce((a, b) => a + b, 0);
        let r = Math.random() * total;
        for (let j = 0; j < pixels.length; j++) {
          r -= dists[j];
          if (r <= 0) {
            centroids.push([...pixels[j]]);
            break;
          }
        }
      }
      return centroids;
    }

    function colorDist(a, b) {
      const dr = a[0] - b[0];
      const dg = a[1] - b[1];
      const db = a[2] - b[2];
      return dr * dr + dg * dg + db * db;
    }

    function rgbToHex(r, g, b) {
      return '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('');
    }

    function rgbToHsl(r, g, b) {
      r /= 255; g /= 255; b /= 255;
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      const l = (max + min) / 2;
      if (max === min) return [0, 0, l];
      const d = max - min;
      const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      let h;
      if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
      else if (max === g) h = ((b - r) / d + 2) / 6;
      else h = ((r - g) / d + 4) / 6;
      return [h, s, l];
    }

    function relativeLuminance(r, g, b) {
      const [rs, gs, bs] = [r, g, b].map(v => {
        v /= 255;
        return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
      });
      return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
    }

    function contrastRatio(rgb1, rgb2) {
      const l1 = relativeLuminance(...rgb1);
      const l2 = relativeLuminance(...rgb2);
      const lighter = Math.max(l1, l2);
      const darker = Math.min(l1, l2);
      return (lighter + 0.05) / (darker + 0.05);
    }

    function suggestPalette(clusters) {
      const sorted = [...clusters].sort((a, b) => {
        const [, , lA] = rgbToHsl(...a.rgb);
        const [, , lB] = rgbToHsl(...b.rgb);
        return lA - lB;
      });

      const darkest = sorted[0];
      const lightest = sorted[sorted.length - 1];

      const [, , darkL] = rgbToHsl(...darkest.rgb);
      const [, , lightL] = rgbToHsl(...lightest.rgb);

      const textColor = darkL < 0.3 ? darkest : { rgb: [30, 41, 59] };
      const bgColor = lightL > 0.85 ? lightest : { rgb: [248, 250, 252] };

      const midColors = sorted.filter(c => {
        const [, s, l] = rgbToHsl(...c.rgb);
        return l > 0.2 && l < 0.8 && s > 0.15;
      });

      const primary = midColors.length > 0
        ? midColors.reduce((best, c) => {
            const [, sB] = rgbToHsl(...best.rgb);
            const [, sC] = rgbToHsl(...c.rgb);
            return sC > sB ? c : best;
          })
        : sorted[Math.floor(sorted.length / 2)];

      const primaryHsl = rgbToHsl(...primary.rgb);
      let secondary = midColors.find(c => {
        if (c === primary) return false;
        const [h] = rgbToHsl(...c.rgb);
        const hDiff = Math.abs(h - primaryHsl[0]);
        return hDiff > 0.08 || hDiff < -0.08;
      });

      if (!secondary) {
        secondary = sorted.find(c => c !== primary && c !== textColor && c !== bgColor) || primary;
      }

      const accentCandidates = sorted.filter(c => {
        const [, s] = rgbToHsl(...c.rgb);
        return s > 0.3 && c !== primary && c !== secondary;
      });
      const accent = accentCandidates.length > 0 ? accentCandidates[0] : secondary;

      return {
        primary: { role: t.rolePrimary, rgb: primary.rgb },
        secondary: { role: t.roleSecondary, rgb: secondary.rgb },
        accent: { role: t.roleAccent, rgb: accent.rgb },
        text: { role: t.roleText, rgb: textColor.rgb },
        background: { role: t.roleBackground, rgb: bgColor.rgb }
      };
    }

    function showToast(msg) {
      copiedToast.textContent = msg || t.copied;
      copiedToast.classList.add('show');
      setTimeout(() => copiedToast.classList.remove('show'), 1500);
    }

    function copyText(text) {
      navigator.clipboard.writeText(text).then(() => showToast());
    }

    function renderResults(clusters, totalPixels) {
      emptyState.style.display = 'none';

      const existing = mainArea.querySelectorAll('.card');
      existing.forEach(el => el.remove());

      const paletteCard = document.createElement('div');
      paletteCard.className = 'card';
      paletteCard.innerHTML = `<h2 class="card-title">${t.extractedColors}</h2><div class="palette-grid" id="paletteGrid"></div>`;
      mainArea.appendChild(paletteCard);

      const grid = paletteCard.querySelector('#paletteGrid');
      clusters.forEach(c => {
        const hex = rgbToHex(...c.rgb);
        const pct = ((c.count / totalPixels) * 100).toFixed(1);
        const item = document.createElement('div');
        item.className = 'palette-item';
        item.innerHTML = `
          <div class="palette-swatch" style="background:${hex}">
            <span class="palette-percent">${pct}%</span>
          </div>
          <div class="palette-info">
            <div class="palette-hex">${hex.toUpperCase()}</div>
            <div class="palette-rgb">rgb(${c.rgb.join(', ')})</div>
          </div>`;
        item.addEventListener('click', () => copyText(hex.toUpperCase()));
        grid.appendChild(item);
      });

      const palette = suggestPalette(clusters);
      const suggestionCard = document.createElement('div');
      suggestionCard.className = 'card';
      let suggestionHTML = `<h2 class="card-title">${t.suggestedPalette}</h2><div class="suggestion-section">`;

      for (const [key, val] of Object.entries(palette)) {
        const hex = rgbToHex(...val.rgb).toUpperCase();
        const bgForContrast = key === 'text' ? palette.background.rgb : palette.text.rgb;
        const cr = contrastRatio(val.rgb, bgForContrast);
        const passAA = cr >= 4.5;
        const contrastLabel = key === 'background'
          ? `vs Text ${cr.toFixed(1)}:1`
          : key === 'text'
            ? `vs BG ${cr.toFixed(1)}:1`
            : `vs BG ${contrastRatio(val.rgb, palette.background.rgb).toFixed(1)}:1`;
        const contrastClass = (key === 'text' || key === 'background') ? (passAA ? 'contrast-pass' : 'contrast-fail') : (contrastRatio(val.rgb, palette.background.rgb) >= 3 ? 'contrast-pass' : 'contrast-fail');

        suggestionHTML += `
          <div class="suggestion-row" data-hex="${hex}">
            <div class="suggestion-swatch" style="background:${hex}"></div>
            <div class="suggestion-detail">
              <div class="suggestion-role">${val.role}</div>
              <div class="suggestion-hex">${hex}</div>
            </div>
            <span class="suggestion-contrast ${contrastClass}">${contrastLabel}</span>
          </div>`;
      }
      suggestionHTML += '</div>';
      suggestionCard.innerHTML = suggestionHTML;
      mainArea.appendChild(suggestionCard);

      suggestionCard.querySelectorAll('.suggestion-row').forEach(row => {
        row.addEventListener('click', () => copyText(row.dataset.hex));
      });

      const exportCard = document.createElement('div');
      exportCard.className = 'card';

      const cssVars = generateCSS(palette, 'css');
      const tailwind = generateCSS(palette, 'tailwind');
      const scss = generateCSS(palette, 'scss');

      exportCard.innerHTML = `
        <h2 class="card-title">${t.exportTitle}</h2>
        <div class="export-section">
          <div class="export-tabs">
            <button class="export-tab active" data-format="css">${t.cssVarsTab}</button>
            <button class="export-tab" data-format="tailwind">Tailwind</button>
            <button class="export-tab" data-format="scss">SCSS</button>
          </div>
          <div class="export-code" id="exportCode"><button class="btn-copy-code" id="btnCopyCode">Copy</button>${escapeHtml(cssVars)}</div>
        </div>`;
      mainArea.appendChild(exportCard);

      const codeFormats = { css: cssVars, tailwind, scss };
      const exportCode = exportCard.querySelector('#exportCode');
      const btnCopyCode = exportCard.querySelector('#btnCopyCode');

      exportCard.querySelectorAll('.export-tab').forEach(tab => {
        tab.addEventListener('click', () => {
          exportCard.querySelectorAll('.export-tab').forEach(t => t.classList.remove('active'));
          tab.classList.add('active');
          exportCode.innerHTML = `<button class="btn-copy-code" id="btnCopyCode">Copy</button>${escapeHtml(codeFormats[tab.dataset.format])}`;
          exportCode.querySelector('#btnCopyCode').addEventListener('click', () => {
            copyText(codeFormats[tab.dataset.format]);
          });
        });
      });

      btnCopyCode.addEventListener('click', () => {
        const activeTab = exportCard.querySelector('.export-tab.active');
        copyText(codeFormats[activeTab.dataset.format]);
      });

      const previewCard = document.createElement('div');
      previewCard.className = 'card';
      const p = palette;
      const primaryHex = rgbToHex(...p.primary.rgb);
      const secondaryHex = rgbToHex(...p.secondary.rgb);
      const accentHex = rgbToHex(...p.accent.rgb);
      const textHex = rgbToHex(...p.text.rgb);
      const bgHex = rgbToHex(...p.background.rgb);
      const primaryTextColor = relativeLuminance(...p.primary.rgb) > 0.5 ? textHex : '#fff';
      const accentTextColor = relativeLuminance(...p.accent.rgb) > 0.5 ? textHex : '#fff';

      previewCard.innerHTML = `
        <h2 class="card-title">${t.previewTitle}</h2>
        <div class="preview-section">
          <div class="preview-demo">
            <div class="preview-header" style="background:${primaryHex};color:${primaryTextColor}">
              <h3>${t.samplePage}</h3>
              <p>${t.sampleSubtitle}</p>
            </div>
            <div class="preview-body" style="background:${bgHex};color:${textHex}">
              <p>${t.previewBody}</p>
              <div class="preview-btn" style="background:${primaryHex};color:${primaryTextColor}">${t.learnMore}</div>
              <div class="preview-card-row">
                <div class="preview-mini-card" style="background:${bgHex};border:2px solid ${secondaryHex}">
                  <h4 style="color:${primaryHex}">${t.featureA}</h4>
                  <p style="color:${textHex}">${t.featureADesc}</p>
                </div>
                <div class="preview-mini-card" style="background:${accentHex};color:${accentTextColor}">
                  <h4>${t.featureB}</h4>
                  <p>${t.featureBDesc}</p>
                </div>
              </div>
            </div>
          </div>
        </div>`;
      mainArea.appendChild(previewCard);
    }

    function generateCSS(palette, format) {
      const entries = Object.entries(palette);
      if (format === 'css') {
        let code = ':root {\n';
        for (const [key, val] of entries) {
          const hex = rgbToHex(...val.rgb).toLowerCase();
          code += `  --color-${key}: ${hex};\n`;
        }
        code += '}';
        return code;
      }
      if (format === 'tailwind') {
        let code = 'module.exports = {\n  theme: {\n    extend: {\n      colors: {\n';
        for (const [key, val] of entries) {
          const hex = rgbToHex(...val.rgb).toLowerCase();
          code += `        '${key}': '${hex}',\n`;
        }
        code += '      },\n    },\n  },\n};';
        return code;
      }
      if (format === 'scss') {
        let code = '';
        for (const [key, val] of entries) {
          const hex = rgbToHex(...val.rgb).toLowerCase();
          code += `$color-${key}: ${hex};\n`;
        }
        return code.trimEnd();
      }
      return '';
    }

    function escapeHtml(str) {
      return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }
