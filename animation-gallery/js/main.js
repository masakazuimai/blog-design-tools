      "use strict";

      import { t } from "./i18n.js?v=20260615";

      // 各アニメーションのメタ情報。
      // origin: transform-origin が必要なもの / flip: backface-visibility: visible が必要なもの
      const ANIMATIONS = [
        // Attention seekers（注目）
        { key: "bounce", cat: "注目", origin: "center bottom" },
        { key: "flash", cat: "注目" },
        { key: "pulse", cat: "注目" },
        { key: "rubberBand", cat: "注目" },
        { key: "shakeX", cat: "注目" },
        { key: "shakeY", cat: "注目" },
        { key: "headShake", cat: "注目" },
        { key: "swing", cat: "注目", origin: "top center" },
        { key: "tada", cat: "注目" },
        { key: "wobble", cat: "注目" },
        { key: "jello", cat: "注目", origin: "center" },
        { key: "heartBeat", cat: "注目" },
        // Fade
        { key: "fadeIn", cat: "フェード" },
        { key: "fadeInDown", cat: "フェード" },
        { key: "fadeInUp", cat: "フェード" },
        { key: "fadeInLeft", cat: "フェード" },
        { key: "fadeInRight", cat: "フェード" },
        { key: "fadeInDownBig", cat: "フェード" },
        { key: "fadeInUpBig", cat: "フェード" },
        { key: "fadeOut", cat: "フェード" },
        { key: "fadeOutDown", cat: "フェード" },
        { key: "fadeOutUp", cat: "フェード" },
        { key: "fadeOutLeft", cat: "フェード" },
        { key: "fadeOutRight", cat: "フェード" },
        // Bounce
        { key: "bounceIn", cat: "バウンド" },
        { key: "bounceInDown", cat: "バウンド" },
        { key: "bounceInUp", cat: "バウンド" },
        { key: "bounceInLeft", cat: "バウンド" },
        { key: "bounceInRight", cat: "バウンド" },
        { key: "bounceOut", cat: "バウンド" },
        // Zoom
        { key: "zoomIn", cat: "ズーム" },
        { key: "zoomOut", cat: "ズーム" },
        { key: "zoomInDown", cat: "ズーム" },
        { key: "zoomInUp", cat: "ズーム" },
        { key: "zoomInLeft", cat: "ズーム" },
        { key: "zoomInRight", cat: "ズーム" },
        { key: "zoomOutDown", cat: "ズーム", origin: "center bottom" },
        // Slide
        { key: "slideInDown", cat: "スライド" },
        { key: "slideInUp", cat: "スライド" },
        { key: "slideInLeft", cat: "スライド" },
        { key: "slideInRight", cat: "スライド" },
        { key: "slideOutDown", cat: "スライド" },
        { key: "slideOutUp", cat: "スライド" },
        { key: "slideOutLeft", cat: "スライド" },
        // Flip
        { key: "flip", cat: "フリップ", flip: true },
        { key: "flipInX", cat: "フリップ", flip: true },
        { key: "flipInY", cat: "フリップ", flip: true },
        { key: "flipOutX", cat: "フリップ", flip: true },
        { key: "flipOutY", cat: "フリップ", flip: true },
        // Rotate
        { key: "rotateIn", cat: "回転", origin: "center" },
        { key: "rotateInDownLeft", cat: "回転", origin: "left bottom" },
        { key: "rotateInUpRight", cat: "回転", origin: "right bottom" },
        { key: "rotateInUpLeft", cat: "回転", origin: "left bottom" },
        { key: "rotateInDownRight", cat: "回転", origin: "right bottom" },
        { key: "rotateOut", cat: "回転", origin: "center" },
        // Back
        { key: "backInDown", cat: "バック" },
        { key: "backInUp", cat: "バック" },
        { key: "backInLeft", cat: "バック" },
        { key: "backInRight", cat: "バック" },
        { key: "backOutDown", cat: "バック" },
        { key: "backOutUp", cat: "バック" },
        // Light speed
        { key: "lightSpeedInRight", cat: "スピード" },
        { key: "lightSpeedInLeft", cat: "スピード" },
        { key: "lightSpeedOutRight", cat: "スピード" },
        // Special
        { key: "rollIn", cat: "特殊" },
        { key: "rollOut", cat: "特殊" },
        { key: "hinge", cat: "特殊", origin: "top left" },
        { key: "jackInTheBox", cat: "特殊" },
        // 3D（単一要素）
        { key: "spin3DX", cat: "3D" },
        { key: "spin3DY", cat: "3D" },
        { key: "spin3DZ", cat: "3D" },
        { key: "swing3D", cat: "3D" },
        { key: "tilt3D", cat: "3D" },
        { key: "pop3DIn", cat: "3D" },
        { key: "flipDownIn", cat: "3D", origin: "top center" },
        { key: "flipUpIn", cat: "3D", origin: "bottom center" },
        { key: "rotateY3DIn", cat: "3D" },
        { key: "vortexIn", cat: "3D" },
        { key: "flipDownOut", cat: "3D", origin: "top center" },
        { key: "flipUpOut", cat: "3D", origin: "bottom center" },
        { key: "flipLeftIn", cat: "3D", origin: "left center" },
        { key: "flipRightIn", cat: "3D", origin: "right center" },
        { key: "swing3DX", cat: "3D", origin: "top center" },
        { key: "tumble3D", cat: "3D" },
        { key: "coinFlip", cat: "3D" },
        { key: "spiral3DIn", cat: "3D" },
        { key: "doorOpenLeft", cat: "3D", origin: "left center" },
        { key: "depthPop", cat: "3D" },
        { key: "flip3DDiagonal", cat: "3D" },
        { key: "wobble3D", cat: "3D" },
        { key: "helixIn", cat: "3D" },
        { key: "popOut3D", cat: "3D" },
        // エフェクト
        { key: "glitch", cat: "エフェクト" },
        { key: "neonFlicker", cat: "エフェクト" },
        { key: "float", cat: "エフェクト" },
        { key: "blurIn", cat: "エフェクト" },
        { key: "blurOut", cat: "エフェクト" },
        { key: "popRotateIn", cat: "エフェクト" },
        { key: "elasticIn", cat: "エフェクト" },
        { key: "swirlOut", cat: "エフェクト" },
      ];

      // @keyframes の本文を <style> から読み出してコピー用に整形する
      const keyframeCache = {};
      function getKeyframes(key) {
        if (keyframeCache[key] !== undefined) return keyframeCache[key];
        let body = "";
        for (const sheet of document.styleSheets) {
          let rules;
          try {
            rules = sheet.cssRules;
          } catch (e) {
            continue;
          }
          if (!rules) continue;
          for (const rule of rules) {
            if (rule.type === CSSRule.KEYFRAMES_RULE && rule.name === key) {
              const lines = [];
              for (const kf of rule.cssRules) {
                lines.push("  " + kf.cssText);
              }
              body = lines.join("\n");
            }
          }
        }
        keyframeCache[key] = body;
        return body;
      }

      const els = {
        grid: document.getElementById("grid"),
        filters: document.getElementById("filters"),
        demoType: document.getElementById("demoType"),
        duration: document.getElementById("duration"),
        durVal: document.getElementById("durVal"),
        easing: document.getElementById("easing"),
        iteration: document.getElementById("iteration"),
        playAll: document.getElementById("playAll"),
        hoverPlay: document.getElementById("hoverPlay"),
        autoPlayMode: document.getElementById("autoPlayMode"),
        resetSettings: document.getElementById("resetSettings"),
        countNote: document.getElementById("countNote"),
        toast: document.getElementById("toast"),
        codePreview: document.getElementById("codePreview"),
        fmtToggle: document.getElementById("fmtToggle"),
        copyPreview: document.getElementById("copyPreview"),
      };

      // 設定の永続化（localStorage）
      const SETTINGS_KEY = "animation-gallery-settings";
      // デフォルト値（HTMLの初期値と一致させる）
      const DEFAULT_SETTINGS = {
        demoType: "text",
        duration: "1",
        easing: "ease",
        iteration: "1",
        hoverPlay: true,
        autoPlayMode: "off",
      };

      // 現在の設定値を localStorage へ保存する
      function saveSettings() {
        try {
          const data = {
            demoType: els.demoType.value,
            duration: els.duration.value,
            easing: els.easing.value,
            iteration: els.iteration.value,
            hoverPlay: els.hoverPlay.checked,
            autoPlayMode: els.autoPlayMode.value,
          };
          localStorage.setItem(SETTINGS_KEY, JSON.stringify(data));
        } catch (error) {
          console.error("設定の保存に失敗しました:", error);
        }
      }

      // localStorage から設定を読み込んで各 input/select へ反映する
      function applySettings(data) {
        if (typeof data.demoType === "string") els.demoType.value = data.demoType;
        if (typeof data.duration === "string") els.duration.value = data.duration;
        if (typeof data.easing === "string") els.easing.value = data.easing;
        if (typeof data.iteration === "string") els.iteration.value = data.iteration;
        if (typeof data.hoverPlay === "boolean") els.hoverPlay.checked = data.hoverPlay;
        if (typeof data.autoPlayMode === "string") els.autoPlayMode.value = data.autoPlayMode;
        els.durVal.textContent = parseFloat(els.duration.value).toFixed(1) + "s";
      }

      // 起動時に保存済み設定を復元する（無効な値は無視してデフォルトのまま）
      function restoreSettings() {
        try {
          const raw = localStorage.getItem(SETTINGS_KEY);
          if (!raw) return;
          applySettings(JSON.parse(raw));
        } catch (error) {
          console.error("設定の読み込みに失敗しました:", error);
        }
      }

      // 設定をデフォルトへ戻し、保存内容も消す
      function resetSettings() {
        try {
          localStorage.removeItem(SETTINGS_KEY);
        } catch (error) {
          console.error("設定のリセットに失敗しました:", error);
        }
        applySettings(DEFAULT_SETTINGS);
        renderAll();
        updatePreview();
      }

      // 選択状態とコードプレビュー
      let selected = null; // { kind: 'anim'|'flip'|'cube'|'mg', data? }
      let previewFormat = "css"; // anim のとき CSS / HTML+CSS を切替

      function getSelectedCode() {
        if (!selected) return "";
        switch (selected.kind) {
          case "anim":
            return previewFormat === "css" ? buildCSS(selected.data) : buildFullCode(selected.data);
          case "flip":
            return buildFlipCode(selected.data);
          case "cube":
            return buildCubeCode();
          case "mg":
            return buildCarouselCode();
          case "fade":
            return buildFadeSliderCode();
          case "scroll":
            return buildScrollCarouselCode();
          case "snap":
            return buildSnapCarouselCode();
          case "marquee":
            return buildMarqueeCode();
          case "cover":
            return buildCoverflowCode();
          case "hover":
            return buildHoverCode(selected.data);
          default:
            return "";
        }
      }

      function markSelected(el) {
        document.querySelectorAll(".card.selected, .showcase-item.selected").forEach((n) => n.classList.remove("selected"));
        if (el) el.classList.add("selected");
      }

      function updatePreview() {
        // フォーマット切替は anim のときだけ表示
        els.fmtToggle.classList.toggle("hidden", !selected || selected.kind !== "anim");
        els.copyPreview.disabled = !selected;
        els.codePreview.textContent = getSelectedCode();
        els.fmtToggle.querySelectorAll(".fmt-btn").forEach((b) => b.classList.toggle("active", b.dataset.fmt === previewFormat));
      }

      function selectAnim(anim, el) {
        selected = { kind: "anim", data: anim };
        markSelected(el);
        updatePreview();
      }
      function selectFlip(v, el) {
        selected = { kind: "flip", data: v };
        markSelected(el);
        updatePreview();
      }
      function selectCube(el) {
        selected = { kind: "cube" };
        markSelected(el);
        updatePreview();
      }
      function selectCarousel(el) {
        selected = { kind: "mg" };
        markSelected(el);
        updatePreview();
      }
      function selectSlider(kind, el) {
        selected = { kind };
        markSelected(el);
        updatePreview();
      }
      function selectHover(effect, el) {
        selected = { kind: "hover", data: effect };
        markSelected(el);
        updatePreview();
      }

      function setFormat(fmt) {
        previewFormat = fmt;
        updatePreview();
      }

      function getSettings() {
        return {
          dur: parseFloat(els.duration.value),
          easing: els.easing.value,
          iter: els.iteration.value,
        };
      }

      const demoMarkup = {
        text: '<span class="demo-text">' + t.demoSample + "</span>",
        box: '<div class="demo-box"></div>',
        button: '<span class="demo-button">' + t.demoButton + "</span>",
        image: '<div class="demo-image">🎁</div>',
      };

      function demoInner() {
        return demoMarkup[els.demoType.value] || demoMarkup.text;
      }

      // 対象要素にアニメーションを適用して再生
      function playAnim(target, anim) {
        const s = getSettings();
        target.style.animation = "none";
        // reflow を強制してアニメーションをリスタート
        void target.offsetWidth;
        target.style.transformOrigin = anim.origin || "";
        target.style.backfaceVisibility = anim.flip ? "visible" : "";
        target.style.animation = anim.key + " " + s.dur + "s " + s.easing + " " + s.iter + " both";
      }

      // コピー用 CSS を生成
      function buildCSS(anim) {
        const s = getSettings();
        const cls = "animate-" + anim.key;
        const extra = [];
        if (anim.origin) extra.push("  transform-origin: " + anim.origin + ";");
        if (anim.flip) extra.push("  backface-visibility: visible;");
        const extraStr = extra.length ? "\n" + extra.join("\n") : "";
        return "." + cls + " {\n" + "  animation: " + anim.key + " " + s.dur + "s " + s.easing + " " + s.iter + " both;" + extraStr + "\n}\n\n" + "@keyframes " + anim.key + " {\n" + getKeyframes(anim.key) + "\n}";
      }

      // コピー用 HTML+CSS 一式を生成
      function buildFullCode(anim) {
        const cls = "animate-" + anim.key;
        return "<style>\n" + buildCSS(anim) + "\n</style>\n\n" + '<div class="' + cls + '">' + t.demoSampleText + "</div>";
      }

      let toastTimer = null;
      function showToast(msg) {
        els.toast.textContent = msg;
        els.toast.classList.add("show");
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => els.toast.classList.remove("show"), 1600);
      }

      async function copyText(text, btn, label) {
        try {
          await navigator.clipboard.writeText(text);
          btn.classList.add("copied");
          const original = btn.textContent;
          btn.textContent = t.copied;
          setTimeout(() => {
            btn.classList.remove("copied");
            btn.textContent = original;
          }, 1200);
          showToast(t.copiedToast(label));
        } catch (e) {
          console.error("コピーに失敗しました:", e);
          showToast(t.copyFailed);
        }
      }

      let activeCat = "すべて";

      function renderFilters() {
        const cats = ["すべて", ...new Set(ANIMATIONS.map((a) => a.cat))];
        els.filters.innerHTML = "";
        for (const cat of cats) {
          const chip = document.createElement("button");
          chip.className = "chip" + (cat === activeCat ? " active" : "");
          chip.textContent = t.categories[cat] || cat;
          chip.addEventListener("click", () => {
            activeCat = cat;
            renderFilters();
            renderGrid();
          });
          els.filters.appendChild(chip);
        }
      }

      function renderGrid() {
        const list = activeCat === "すべて" ? ANIMATIONS : ANIMATIONS.filter((a) => a.cat === activeCat);

        els.grid.innerHTML = "";
        els.countNote.textContent = t.countNote(ANIMATIONS.length, list.length);

        for (const anim of list) {
          const card = document.createElement("div");
          card.className = "card";

          const stage = document.createElement("div");
          stage.className = "stage";
          stage.innerHTML = demoInner();
          const target = stage.firstElementChild;

          stage.addEventListener("click", () => {
            playAnim(target, anim);
            selectAnim(anim, card);
          });
          if (els.hoverPlay.checked) {
            stage.addEventListener("mouseenter", () => playAnim(target, anim));
          }

          const info = document.createElement("div");
          info.className = "card-info";
          info.innerHTML = '<div class="card-cat">' + (t.categories[anim.cat] || anim.cat) + "</div>" + '<div class="card-name">' + anim.key + "</div>" + '<div class="btn-group">' + '<button class="copy-btn" data-act="css">CSS</button>' + '<button class="copy-btn" data-act="full">HTML+CSS</button>' + "</div>";

          info.querySelector('[data-act="css"]').addEventListener("click", (e) => {
            selectAnim(anim, card);
            setFormat("css");
            copyText(buildCSS(anim), e.currentTarget, "CSS");
          });
          info.querySelector('[data-act="full"]').addEventListener("click", (e) => {
            selectAnim(anim, card);
            setFormat("full");
            copyText(buildFullCode(anim), e.currentTarget, "HTML+CSS");
          });

          card.appendChild(stage);
          card.appendChild(info);
          els.grid.appendChild(card);
        }
      }

      // すべて再生（表示中のカードを順番に少しずつずらして再生）
      function playAllVisible() {
        const stages = els.grid.querySelectorAll(".stage");
        const visible = activeCat === "すべて" ? ANIMATIONS : ANIMATIONS.filter((a) => a.cat === activeCat);
        stages.forEach((stage, i) => {
          const target = stage.firstElementChild;
          setTimeout(() => playAnim(target, visible[i]), i * 60);
        });
      }

      // ---- 3Dフリップカード ----
      const FLIP_CARDS = [
        { id: "flip-h", label: t.flipH, axis: "Y" },
        { id: "flip-v", label: t.flipV, axis: "X" },
      ];

      function renderFlipCards() {
        const row = document.getElementById("flipRow");
        row.innerHTML = "";
        const dur = getSettings().dur;
        for (const v of FLIP_CARDS) {
          const item = document.createElement("div");
          item.className = "showcase-item";

          const card = document.createElement("div");
          card.className = "flip-card " + v.id;
          const inner = document.createElement("div");
          inner.className = "flip-card-inner";
          inner.style.transition = "transform " + dur + "s";
          inner.innerHTML = '<div class="flip-card-front">' + t.flipFront + "</div>" + '<div class="flip-card-back">' + t.flipBack + "</div>" + '<div class="flip-edge flip-edge-right"></div>' + '<div class="flip-edge flip-edge-left"></div>' + '<div class="flip-edge flip-edge-top"></div>' + '<div class="flip-edge flip-edge-bottom"></div>';
          card.appendChild(inner);

          // ライブデモは JS でフリップ（タップにも対応）。コピーコードは :hover 版。
          const flipT = v.axis === "Y" ? "rotateY(180deg)" : "rotateX(180deg)";
          card.addEventListener("mouseenter", () => {
            inner.style.transform = flipT;
          });
          card.addEventListener("mouseleave", () => {
            inner.style.transform = "";
          });
          card.addEventListener("click", () => {
            inner.style.transform = inner.style.transform ? "" : flipT;
            selectFlip(v, item);
          });

          const label = document.createElement("div");
          label.className = "label";
          label.textContent = v.label;

          const btn = document.createElement("button");
          btn.className = "copy-btn";
          btn.textContent = "HTML+CSS";
          btn.addEventListener("click", (e) => {
            selectFlip(v, item);
            copyText(buildFlipCode(v), e.currentTarget, t.labelFlipCard);
          });

          item.appendChild(card);
          item.appendChild(label);
          item.appendChild(btn);
          row.appendChild(item);
        }
      }

      function buildFlipCode(v) {
        const dur = getSettings().dur;
        const isY = v.axis === "Y";
        const t = isY ? "rotateY(180deg)" : "rotateX(180deg)";
        const backT = isY ? "rotateY(180deg) translateZ(10px)" : "rotateX(180deg) translateZ(10px)";
        return [
          "<style>",
          ".flip-card { width: 220px; height: 140px; perspective: 1400px; }",
          ".flip-card-inner {",
          "  position: relative; width: 100%; height: 100%;",
          "  transition: transform " + dur + "s; transform-style: preserve-3d;",
          "}",
          ".flip-card:hover .flip-card-inner { transform: " + t + "; }",
          ".flip-card-front, .flip-card-back {",
          "  position: absolute; inset: 0; backface-visibility: hidden;",
          "  display: flex; align-items: center; justify-content: center;",
          "  color: #fff; font-weight: 700;",
          "}",
          "/* 厚み 20px のスラブ */",
          ".flip-card-front { background: linear-gradient(135deg, #3b82f6, #6366f1); transform: translateZ(10px); }",
          ".flip-card-back  { background: linear-gradient(135deg, #8b5cf6, #ec4899); transform: " + backT + "; }",
          "/* 側面（厚みの面）*/",
          ".flip-edge { position: absolute; left: 50%; top: 50%; background: #4338ca; }",
          ".flip-edge-left, .flip-edge-right { width: 20px; height: 140px; margin: -70px 0 0 -10px; }",
          ".flip-edge-top, .flip-edge-bottom { width: 220px; height: 20px; margin: -10px 0 0 -110px; }",
          ".flip-edge-right  { transform: rotateY(90deg) translateZ(110px); }",
          ".flip-edge-left   { transform: rotateY(-90deg) translateZ(110px); }",
          ".flip-edge-top    { transform: rotateX(90deg) translateZ(70px); }",
          ".flip-edge-bottom { transform: rotateX(-90deg) translateZ(70px); }",
          "</style>",
          "",
          '<div class="flip-card">',
          '  <div class="flip-card-inner">',
          '    <div class="flip-card-front">' + t.flipFront + "</div>",
          '    <div class="flip-card-back">' + t.flipBack + "</div>",
          '    <div class="flip-edge flip-edge-right"></div>',
          '    <div class="flip-edge flip-edge-left"></div>',
          '    <div class="flip-edge flip-edge-top"></div>',
          '    <div class="flip-edge flip-edge-bottom"></div>',
          "  </div>",
          "</div>",
        ].join("\n");
      }

      // ---- 3Dキューブ ----
      function cubeDuration() {
        return (getSettings().dur * 4).toFixed(1);
      }

      function renderCube() {
        const row = document.getElementById("cubeRow");
        row.innerHTML = "";
        const item = document.createElement("div");
        item.className = "showcase-item";

        const scene = document.createElement("div");
        scene.className = "cube-scene";
        const cube = document.createElement("div");
        cube.className = "cube";
        const faces = [
          ["cube-front", "1"],
          ["cube-back", "2"],
          ["cube-right", "3"],
          ["cube-left", "4"],
          ["cube-top", "5"],
          ["cube-bottom", "6"],
        ];
        cube.innerHTML = faces.map((f) => '<div class="cube-face ' + f[0] + '">' + f[1] + "</div>").join("");
        // animation-play-state はインラインで指定せず、CSSの :hover で一時停止できるようにする
        cube.style.animationName = "cubeSpin";
        cube.style.animationDuration = cubeDuration() + "s";
        cube.style.animationTimingFunction = "linear";
        cube.style.animationIterationCount = "infinite";
        scene.appendChild(cube);
        scene.style.cursor = "pointer";
        scene.addEventListener("click", () => selectCube(item));

        const label = document.createElement("div");
        label.className = "label";
        label.textContent = t.cubeLabel(cubeDuration());

        const btn = document.createElement("button");
        btn.className = "copy-btn";
        btn.textContent = "HTML+CSS";
        btn.addEventListener("click", (e) => {
          selectCube(item);
          copyText(buildCubeCode(), e.currentTarget, t.labelCube);
        });

        item.appendChild(scene);
        item.appendChild(label);
        item.appendChild(btn);
        row.appendChild(item);
      }

      function buildCubeCode() {
        const dur = cubeDuration();
        return [
          "<style>",
          ".cube-scene {",
          "  width: 220px; height: 220px; perspective: 600px;",
          "  display: flex; align-items: center; justify-content: center;",
          "}",
          ".cube {",
          "  position: relative; width: 120px; height: 120px;",
          "  transform-style: preserve-3d;",
          "  animation: cubeSpin " + dur + "s infinite linear;",
          "}",
          "/* マウスを乗せたら回転を一時停止 */",
          ".cube-scene:hover .cube { animation-play-state: paused; }",
          ".cube-face {",
          "  position: absolute; width: 120px; height: 120px;",
          "  display: flex; align-items: center; justify-content: center;",
          "  font-size: 2rem; font-weight: 700; color: #fff;",
          "  border: 2px solid rgba(255,255,255,0.5); box-sizing: border-box;",
          "}",
          ".cube-front  { background: rgba(59,130,246,0.85);  transform: rotateY(0deg) translateZ(60px); }",
          ".cube-back   { background: rgba(139,92,246,0.85);  transform: rotateY(180deg) translateZ(60px); }",
          ".cube-right  { background: rgba(236,72,153,0.85);  transform: rotateY(90deg) translateZ(60px); }",
          ".cube-left   { background: rgba(16,185,129,0.85);  transform: rotateY(-90deg) translateZ(60px); }",
          ".cube-top    { background: rgba(245,158,11,0.85);  transform: rotateX(90deg) translateZ(60px); }",
          ".cube-bottom { background: rgba(239,68,68,0.85);   transform: rotateX(-90deg) translateZ(60px); }",
          "@keyframes cubeSpin {",
          "  from { transform: rotateX(0) rotateY(0); }",
          "  to   { transform: rotateX(360deg) rotateY(360deg); }",
          "}",
          "</style>",
          "",
          '<div class="cube-scene">',
          '  <div class="cube">',
          '    <div class="cube-face cube-front">1</div>',
          '    <div class="cube-face cube-back">2</div>',
          '    <div class="cube-face cube-right">3</div>',
          '    <div class="cube-face cube-left">4</div>',
          '    <div class="cube-face cube-top">5</div>',
          '    <div class="cube-face cube-bottom">6</div>',
          "  </div>",
          "</div>",
        ].join("\n");
      }

      // ---- 3Dメリーゴーランド ----
      const MG_PANELS = ["#3b82f6", "#6366f1", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981"];
      const MG_RADIUS = 120;
      function mgDuration() {
        return (getSettings().dur * 6).toFixed(1);
      }

      function renderCarousel() {
        const row = document.getElementById("mgRow");
        row.innerHTML = "";
        const item = document.createElement("div");
        item.className = "showcase-item";

        const scene = document.createElement("div");
        scene.className = "mg-scene";
        const ring = document.createElement("div");
        ring.className = "mg-ring";
        // animation-play-state はインラインで指定せず、CSSの :hover で一時停止できるようにする
        ring.style.animationName = "mgSpin";
        ring.style.animationDuration = mgDuration() + "s";
        ring.style.animationTimingFunction = "linear";
        ring.style.animationIterationCount = "infinite";
        ring.innerHTML = MG_PANELS.map((bg, i) => '<div class="mg-panel" style="background:' + bg + ";transform:rotateY(" + i * 60 + "deg) translateZ(" + MG_RADIUS + 'px)">' + (i + 1) + "</div>").join("");
        scene.appendChild(ring);
        scene.style.cursor = "pointer";
        scene.addEventListener("click", () => selectCarousel(item));

        const label = document.createElement("div");
        label.className = "label";
        label.textContent = t.carouselLabel(mgDuration());

        const btn = document.createElement("button");
        btn.className = "copy-btn";
        btn.textContent = "HTML+CSS";
        btn.addEventListener("click", (e) => {
          selectCarousel(item);
          copyText(buildCarouselCode(), e.currentTarget, t.labelCarousel);
        });

        item.appendChild(scene);
        item.appendChild(label);
        item.appendChild(btn);
        row.appendChild(item);
      }

      function buildCarouselCode() {
        const dur = mgDuration();
        const panelRules = MG_PANELS.map((bg, i) => ".mg-panel:nth-child(" + (i + 1) + ") { background: " + bg + "; transform: rotateY(" + i * 60 + "deg) translateZ(" + MG_RADIUS + "px); }");
        const panelHTML = MG_PANELS.map((_, i) => '    <div class="mg-panel">' + (i + 1) + "</div>");
        return ["<style>", ".mg-scene { width: 360px; height: 170px; perspective: 1000px; }", ".mg-ring {", "  position: relative; width: 100%; height: 100%;", "  transform-style: preserve-3d;", "  animation: mgSpin " + dur + "s infinite linear;", "}", "/* マウスを乗せたら回転を一時停止 */", ".mg-scene:hover .mg-ring { animation-play-state: paused; }", ".mg-panel {", "  position: absolute; width: 120px; height: 90px; left: 120px; top: 40px;", "  display: flex; align-items: center; justify-content: center;", "  border-radius: 12px; color: #fff; font-size: 2rem; font-weight: 700;", "  box-shadow: inset 0 0 0 2px rgba(255,255,255,0.35);", "}"].concat(panelRules).concat(["@keyframes mgSpin {", "  from { transform: rotateX(-12deg) rotateY(0); }", "  to   { transform: rotateX(-12deg) rotateY(360deg); }", "}", "</style>", "", '<div class="mg-scene">', '  <div class="mg-ring">']).concat(panelHTML).concat(["  </div>", "</div>"]).join("\n");
      }

      // ---- スライダー・カルーセル共通 ----
      const SLIDE_COLORS = ["#3b82f6", "#6366f1", "#8b5cf6", "#ec4899", "#f59e0b"];
      const MARQUEE_LOGOS = ["★ BRAND", "◆ STUDIO", "● LABS", "▲ WORKS", "■ DESIGN"];

      // ---- フェードスライダー ----
      function fadeTotal() {
        return (getSettings().dur * 8).toFixed(1);
      }
      function renderFadeSlider() {
        const row = document.getElementById("fadeRow");
        row.innerHTML = "";
        const item = document.createElement("div");
        item.className = "showcase-item";

        const slider = document.createElement("div");
        slider.className = "fade-slider";
        const total = fadeTotal();
        slider.innerHTML = SLIDE_COLORS.map((bg, i) => '<div class="fade-slide" style="background:' + bg + ";animation:fadeSlider " + total + "s infinite;animation-delay:" + ((total / SLIDE_COLORS.length) * i).toFixed(2) + 's">' + (i + 1) + "</div>").join("");
        slider.style.cursor = "pointer";
        slider.addEventListener("click", () => selectSlider("fade", item));

        const label = document.createElement("div");
        label.className = "label";
        label.textContent = t.fadeLabel(total);

        const btn = document.createElement("button");
        btn.className = "copy-btn";
        btn.textContent = "HTML+CSS";
        btn.addEventListener("click", (e) => {
          selectSlider("fade", item);
          copyText(buildFadeSliderCode(), e.currentTarget, t.labelFade);
        });

        item.appendChild(slider);
        item.appendChild(label);
        item.appendChild(btn);
        row.appendChild(item);
      }
      function buildFadeSliderCode() {
        const total = fadeTotal();
        const n = SLIDE_COLORS.length;
        const slideRules = SLIDE_COLORS.map((bg, i) => ".fade-slide:nth-child(" + (i + 1) + ") { background: " + bg + "; animation-delay: " + ((total / n) * i).toFixed(2) + "s; }");
        const slideHTML = SLIDE_COLORS.map((_, i) => '  <div class="fade-slide">' + (i + 1) + "</div>");
        return ["<style>", ".fade-slider {", "  position: relative; width: 320px; height: 180px;", "  border-radius: 12px; overflow: hidden;", "}", ".fade-slide {", "  position: absolute; inset: 0;", "  display: flex; align-items: center; justify-content: center;", "  color: #fff; font-size: 2rem; font-weight: 700;", "  opacity: 0; animation: fadeSlider " + total + "s infinite;", "}"].concat(slideRules).concat(["@keyframes fadeSlider {", "  0%   { opacity: 0; }", "  9%   { opacity: 1; }", "  11%  { opacity: 1; }", "  20%  { opacity: 0; }", "  100% { opacity: 0; }", "}", "</style>", "", '<div class="fade-slider">']).concat(slideHTML).concat(["</div>"]).join("\n");
      }

      // ---- 自動スクロールカルーセル ----
      function scrollDuration() {
        return (getSettings().dur * 8).toFixed(1);
      }
      function renderScrollCarousel() {
        const row = document.getElementById("scrollRow");
        row.innerHTML = "";
        const item = document.createElement("div");
        item.className = "showcase-item";

        const wrap = document.createElement("div");
        wrap.className = "scroll-carousel";
        const track = document.createElement("div");
        track.className = "scroll-track";
        const dur = scrollDuration();
        // animation-play-state はインラインで指定せず、CSSの :hover で一時停止できるようにする
        track.style.animationName = "scrollCarousel";
        track.style.animationDuration = dur + "s";
        track.style.animationTimingFunction = "linear";
        track.style.animationIterationCount = "infinite";
        const items = SLIDE_COLORS.concat(SLIDE_COLORS);
        track.innerHTML = items.map((bg, i) => '<div class="scroll-item" style="background:' + bg + '">' + ((i % SLIDE_COLORS.length) + 1) + "</div>").join("");
        wrap.appendChild(track);
        wrap.style.cursor = "pointer";
        wrap.addEventListener("click", () => selectSlider("scroll", item));

        const label = document.createElement("div");
        label.className = "label";
        label.textContent = t.scrollLabel(dur);

        const btn = document.createElement("button");
        btn.className = "copy-btn";
        btn.textContent = "HTML+CSS";
        btn.addEventListener("click", (e) => {
          selectSlider("scroll", item);
          copyText(buildScrollCarouselCode(), e.currentTarget, t.labelScroll);
        });

        item.appendChild(wrap);
        item.appendChild(label);
        item.appendChild(btn);
        row.appendChild(item);
      }
      function buildScrollCarouselCode() {
        const dur = scrollDuration();
        const itemHTML = SLIDE_COLORS.concat(SLIDE_COLORS).map((bg, i) => '    <div class="scroll-item" style="background: ' + bg + '">' + ((i % SLIDE_COLORS.length) + 1) + "</div>");
        return ["<style>", ".scroll-carousel { width: 360px; overflow: hidden; border-radius: 12px; }", ".scroll-track {", "  display: flex; gap: 16px; width: max-content;", "  animation: scrollCarousel " + dur + "s linear infinite;", "}", "/* マウスを乗せたら一時停止 */", ".scroll-track:hover { animation-play-state: paused; }", ".scroll-item {", "  flex: none; width: 150px; height: 120px; border-radius: 12px;", "  display: flex; align-items: center; justify-content: center;", "  color: #fff; font-size: 1.8rem; font-weight: 700;", "}", "/* gap 16px の半分(8px)を引いて継ぎ目をなくす */", "@keyframes scrollCarousel {", "  from { transform: translateX(0); }", "  to   { transform: translateX(calc(-50% - 8px)); }", "}", "</style>", "", '<div class="scroll-carousel">', '  <!-- 同じ並びを2回置いてシームレスにループ -->', '  <div class="scroll-track">'].concat(itemHTML).concat(["  </div>", "</div>"]).join("\n");
      }

      // ---- ドットナビ カルーセル / カバーフロー 共通（純CSS・ラジオボタン制御） ----
      // ラジオの :checked 状態に応じた transform 等のルールを生成する。
      // ライブデモへの注入とコピーコード生成で同じ生成器を使う。
      function ccStateRules() {
        const n = SLIDE_COLORS.length;
        const rules = [];
        for (let i = 0; i < n; i++) {
          rules.push(".cc-r" + (i + 1) + ":checked ~ .cc-track { transform: translateX(-" + i * 100 + "%); }");
        }
        for (let i = 0; i < n; i++) {
          rules.push(".cc-r" + (i + 1) + ":checked ~ .cc-dots label:nth-child(" + (i + 1) + ") { background: #fff; }");
        }
        return rules;
      }
      function cfStateRules() {
        const n = SLIDE_COLORS.length;
        const rules = [];
        for (let a = 0; a < n; a++) {
          for (let i = 0; i < n; i++) {
            const d = i - a;
            let t, z, op;
            if (d === 0) {
              t = "translateX(0) rotateY(0deg) scale(1)";
              z = n + 1;
              op = "1";
            } else if (d < 0) {
              t = "translateX(" + (d * 52 - 28) + "px) rotateY(42deg) scale(0.78)";
              z = n - Math.abs(d);
              op = "0.65";
            } else {
              t = "translateX(" + (d * 52 + 28) + "px) rotateY(-42deg) scale(0.78)";
              z = n - Math.abs(d);
              op = "0.65";
            }
            rules.push(".cf-r" + (a + 1) + ":checked ~ .cf-stage .cf-item:nth-child(" + (i + 1) + ") { transform: " + t + "; z-index: " + z + "; opacity: " + op + "; }");
          }
        }
        for (let a = 0; a < n; a++) {
          rules.push(".cf-r" + (a + 1) + ":checked ~ .cf-dots label:nth-child(" + (a + 1) + ") { background: #6366f1; }");
        }
        return rules;
      }
      // 状態ルールはdurに依存しないので一度だけ<style>に注入する
      let sliderStylesInjected = false;
      function injectSliderStateStyles() {
        if (sliderStylesInjected) return;
        const style = document.createElement("style");
        style.textContent = ccStateRules().concat(cfStateRules()).join("\n");
        document.head.appendChild(style);
        sliderStylesInjected = true;
      }

      // ---- ドットナビ カルーセル ----
      function renderSnapCarousel() {
        injectSliderStateStyles();
        const row = document.getElementById("snapRow");
        row.innerHTML = "";
        const item = document.createElement("div");
        item.className = "showcase-item";

        const wrap = document.createElement("div");
        wrap.className = "css-carousel";
        const inputs = SLIDE_COLORS.map((_, i) => '<input class="cc-r' + (i + 1) + '" type="radio" name="ccDemo" id="ccDemo' + (i + 1) + '"' + (i === 0 ? " checked" : "") + ">").join("");
        const slides = SLIDE_COLORS.map((bg, i) => '<div class="cc-slide" style="background:' + bg + '">' + (i + 1) + "</div>").join("");
        const dots = SLIDE_COLORS.map((_, i) => '<label for="ccDemo' + (i + 1) + '"></label>').join("");
        wrap.innerHTML = inputs + '<div class="cc-track">' + slides + "</div>" + '<div class="cc-dots">' + dots + "</div>";
        wrap.querySelector(".cc-track").style.cursor = "pointer";
        wrap.querySelector(".cc-track").addEventListener("click", () => selectSlider("snap", item));

        const label = document.createElement("div");
        label.className = "label";
        label.textContent = t.snapLabel;

        const btn = document.createElement("button");
        btn.className = "copy-btn";
        btn.textContent = "HTML+CSS";
        btn.addEventListener("click", (e) => {
          selectSlider("snap", item);
          copyText(buildSnapCarouselCode(), e.currentTarget, t.labelSnap);
        });

        item.appendChild(wrap);
        item.appendChild(label);
        item.appendChild(btn);
        row.appendChild(item);
      }
      function buildSnapCarouselCode() {
        const base = ["<style>", ".css-carousel { position: relative; width: 360px; overflow: hidden; border-radius: 12px; }", ".css-carousel > input { position: absolute; opacity: 0; pointer-events: none; }", ".cc-track { display: flex; transition: transform 0.5s ease; }", ".cc-slide {", "  flex: 0 0 100%; height: 180px;", "  display: flex; align-items: center; justify-content: center;", "  color: #fff; font-size: 2rem; font-weight: 700;", "}", ".cc-dots {", "  position: absolute; left: 0; right: 0; bottom: 12px;", "  display: flex; justify-content: center; gap: 8px;", "}", ".cc-dots label {", "  width: 10px; height: 10px; border-radius: 50%;", "  background: rgba(255,255,255,0.5); cursor: pointer; transition: background 0.2s;", "}", "/* ラジオの選択状態でトラックを移動・ドットを強調 */"];
        const inputs = SLIDE_COLORS.map((_, i) => '  <input class="cc-r' + (i + 1) + '" type="radio" name="cc" id="cc' + (i + 1) + '"' + (i === 0 ? " checked" : "") + ">");
        const slides = SLIDE_COLORS.map((bg, i) => '    <div class="cc-slide" style="background: ' + bg + '">' + (i + 1) + "</div>");
        const dots = SLIDE_COLORS.map((_, i) => '    <label for="cc' + (i + 1) + '"></label>');
        return base
          .concat(ccStateRules())
          .concat(["</style>", "", '<div class="css-carousel">'])
          .concat(inputs)
          .concat(['  <div class="cc-track">'])
          .concat(slides)
          .concat(["  </div>", '  <div class="cc-dots">'])
          .concat(dots)
          .concat(["  </div>", "</div>"])
          .join("\n");
      }

      // ---- ロゴマーキー ----
      function marqueeDuration() {
        return (getSettings().dur * 12).toFixed(1);
      }
      function renderMarquee() {
        const row = document.getElementById("marqueeRow");
        row.innerHTML = "";
        const item = document.createElement("div");
        item.className = "showcase-item";

        const wrap = document.createElement("div");
        wrap.className = "marquee";
        const track = document.createElement("div");
        track.className = "marquee-track";
        const dur = marqueeDuration();
        // animation-play-state はインラインで指定せず、CSSの :hover で一時停止できるようにする
        track.style.animationName = "marquee";
        track.style.animationDuration = dur + "s";
        track.style.animationTimingFunction = "linear";
        track.style.animationIterationCount = "infinite";
        track.innerHTML = MARQUEE_LOGOS.concat(MARQUEE_LOGOS)
          .map((t) => '<div class="marquee-item">' + t + "</div>")
          .join("");
        wrap.appendChild(track);
        wrap.style.cursor = "pointer";
        wrap.addEventListener("click", () => selectSlider("marquee", item));

        const label = document.createElement("div");
        label.className = "label";
        label.textContent = t.marqueeLabel(dur);

        const btn = document.createElement("button");
        btn.className = "copy-btn";
        btn.textContent = "HTML+CSS";
        btn.addEventListener("click", (e) => {
          selectSlider("marquee", item);
          copyText(buildMarqueeCode(), e.currentTarget, t.labelMarquee);
        });

        item.appendChild(wrap);
        item.appendChild(label);
        item.appendChild(btn);
        row.appendChild(item);
      }
      function buildMarqueeCode() {
        const dur = marqueeDuration();
        const itemHTML = MARQUEE_LOGOS.concat(MARQUEE_LOGOS).map((t) => '    <div class="marquee-item">' + t + "</div>");
        return ["<style>", ".marquee {", "  width: 360px; overflow: hidden;", "  -webkit-mask-image: linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent);", "  mask-image: linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent);", "}", ".marquee-track {", "  display: flex; align-items: center; gap: 36px; width: max-content;", "  animation: marquee " + dur + "s linear infinite;", "}", ".marquee-track:hover { animation-play-state: paused; }", ".marquee-item {", "  flex: none; font-size: 1.4rem; font-weight: 800;", "  color: #475569; white-space: nowrap;", "}", "/* gap 36px の半分(18px)を引いて継ぎ目をなくす */", "@keyframes marquee {", "  from { transform: translateX(0); }", "  to   { transform: translateX(calc(-50% - 18px)); }", "}", "</style>", "", '<div class="marquee">', '  <!-- 同じ並びを2回置いてシームレスにループ -->', '  <div class="marquee-track">'].concat(itemHTML).concat(["  </div>", "</div>"]).join("\n");
      }

      // ---- カバーフロー ----
      function coverflowDefaultIndex() {
        return Math.floor(SLIDE_COLORS.length / 2);
      }
      function renderCoverflow() {
        injectSliderStateStyles();
        const row = document.getElementById("coverRow");
        row.innerHTML = "";
        const item = document.createElement("div");
        item.className = "showcase-item";
        const def = coverflowDefaultIndex();

        const wrap = document.createElement("div");
        wrap.className = "cf";
        const inputs = SLIDE_COLORS.map((_, i) => '<input class="cf-r' + (i + 1) + '" type="radio" name="cfDemo" id="cfDemo' + (i + 1) + '"' + (i === def ? " checked" : "") + ">").join("");
        const items = SLIDE_COLORS.map((bg, i) => '<div class="cf-item" style="background:' + bg + '">' + (i + 1) + "</div>").join("");
        const dots = SLIDE_COLORS.map((_, i) => '<label for="cfDemo' + (i + 1) + '"></label>').join("");
        wrap.innerHTML = inputs + '<div class="cf-stage">' + items + "</div>" + '<div class="cf-dots">' + dots + "</div>";
        wrap.querySelector(".cf-stage").style.cursor = "pointer";
        wrap.querySelector(".cf-stage").addEventListener("click", () => selectSlider("cover", item));

        const label = document.createElement("div");
        label.className = "label";
        label.textContent = t.coverLabel;

        const btn = document.createElement("button");
        btn.className = "copy-btn";
        btn.textContent = "HTML+CSS";
        btn.addEventListener("click", (e) => {
          selectSlider("cover", item);
          copyText(buildCoverflowCode(), e.currentTarget, t.labelCover);
        });

        item.appendChild(wrap);
        item.appendChild(label);
        item.appendChild(btn);
        row.appendChild(item);
      }
      function buildCoverflowCode() {
        const def = coverflowDefaultIndex();
        const base = ["<style>", ".cf { position: relative; width: 360px; height: 200px; perspective: 1000px; overflow: hidden; border-radius: 12px; }", ".cf > input { position: absolute; opacity: 0; pointer-events: none; }", ".cf-stage { position: relative; width: 100%; height: 160px; margin-top: 12px; transform-style: preserve-3d; }", ".cf-item {", "  position: absolute; top: 0; left: 50%; width: 140px; height: 160px; margin-left: -70px;", "  border-radius: 14px;", "  display: flex; align-items: center; justify-content: center;", "  color: #fff; font-size: 2.2rem; font-weight: 700;", "  transition: transform 0.5s ease, opacity 0.5s ease;", "}", ".cf-dots {", "  position: absolute; left: 0; right: 0; bottom: 12px; z-index: 10;", "  display: flex; justify-content: center; gap: 8px;", "}", ".cf-dots label {", "  width: 10px; height: 10px; border-radius: 50%;", "  background: rgba(0,0,0,0.18); cursor: pointer; transition: background 0.2s;", "}", "/* ラジオの選択状態で各カードの3D位置とドットを切替 */"];
        const inputs = SLIDE_COLORS.map((_, i) => '  <input class="cf-r' + (i + 1) + '" type="radio" name="cf" id="cf' + (i + 1) + '"' + (i === def ? " checked" : "") + ">");
        const items = SLIDE_COLORS.map((bg, i) => '    <div class="cf-item" style="background: ' + bg + '">' + (i + 1) + "</div>");
        const dots = SLIDE_COLORS.map((_, i) => '    <label for="cf' + (i + 1) + '"></label>');
        return base
          .concat(cfStateRules())
          .concat(["</style>", "", '<div class="cf">'])
          .concat(inputs)
          .concat(['  <div class="cf-stage">'])
          .concat(items)
          .concat(["  </div>", '  <div class="cf-dots">'])
          .concat(dots)
          .concat(["  </div>", "</div>"])
          .join("\n");
      }

      // ---- ホバーエフェクト（すべて :hover + transition のみ・JS不要） ----
      // 各エフェクトは self-contained（baseの見た目 + transition + :hover）でコピー可能。
      const HOVER_EFFECTS = [
        // ボタン系
        {
          key: "grow",
          group: t.groupButton,
          label: t.hvLabels.grow,
          html: '<button class="hv-grow">' + t.hvButton + "</button>",
          css: [".hv-grow {", "  display: inline-flex; align-items: center; justify-content: center;", "  padding: 12px 28px; border: none; border-radius: 8px;", "  background: #6366f1; color: #fff; font-size: 1rem; font-weight: 700; cursor: pointer;", "  transition: transform 0.25s ease;", "}", ".hv-grow:hover { transform: scale(1.08); }"],
        },
        {
          key: "btnlift",
          group: t.groupButton,
          label: t.hvLabels.btnlift,
          html: '<button class="hv-btnlift">' + t.hvButton + "</button>",
          css: [".hv-btnlift {", "  display: inline-flex; align-items: center; justify-content: center;", "  padding: 12px 28px; border: none; border-radius: 8px;", "  background: #6366f1; color: #fff; font-size: 1rem; font-weight: 700; cursor: pointer;", "  transition: transform 0.25s ease, box-shadow 0.25s ease;", "}", ".hv-btnlift:hover { transform: translateY(-4px); box-shadow: 0 12px 22px rgba(99,102,241,0.45); }"],
        },
        {
          key: "fill",
          group: t.groupButton,
          label: t.hvLabels.fill,
          html: '<button class="hv-fill">' + t.hvButton + "</button>",
          css: [".hv-fill {", "  position: relative; overflow: hidden; z-index: 0;", "  display: inline-flex; align-items: center; justify-content: center;", "  padding: 12px 28px; border: none; border-radius: 8px;", "  background: #6366f1; color: #fff; font-size: 1rem; font-weight: 700; cursor: pointer;", "}", ".hv-fill::before {", '  content: ""; position: absolute; inset: 0; z-index: -1;', "  background: #ec4899; transform: scaleX(0); transform-origin: left;", "  transition: transform 0.3s ease;", "}", ".hv-fill:hover::before { transform: scaleX(1); }"],
        },
        {
          key: "shine",
          group: t.groupButton,
          label: t.hvLabels.shine,
          html: '<button class="hv-shine">' + t.hvButton + "</button>",
          css: [".hv-shine {", "  position: relative; overflow: hidden;", "  display: inline-flex; align-items: center; justify-content: center;", "  padding: 12px 28px; border: none; border-radius: 8px;", "  background: #6366f1; color: #fff; font-size: 1rem; font-weight: 700; cursor: pointer;", "}", ".hv-shine::after {", '  content: ""; position: absolute; top: 0; left: -75%; width: 50%; height: 100%;', "  background: linear-gradient(120deg, transparent, rgba(255,255,255,0.6), transparent);", "  transform: skewX(-20deg); transition: left 0.5s ease;", "}", ".hv-shine:hover::after { left: 125%; }"],
        },
        // カード系
        {
          key: "cardlift",
          group: t.groupCard,
          label: t.hvLabels.cardlift,
          html: '<div class="hv-cardlift">' + t.hvCard + "</div>",
          css: [".hv-cardlift {", "  width: 180px; padding: 28px 24px; border-radius: 14px;", "  background: #fff; border: 1px solid #e5e7eb; box-shadow: 0 1px 3px rgba(0,0,0,0.1);", "  color: #1e293b; font-weight: 700; text-align: center;", "  transition: transform 0.25s ease, box-shadow 0.25s ease;", "}", ".hv-cardlift:hover { transform: translateY(-6px); box-shadow: 0 16px 30px rgba(0,0,0,0.15); }"],
        },
        {
          key: "cardzoom",
          group: t.groupCard,
          label: t.hvLabels.cardzoom,
          html: '<div class="hv-cardzoom">' + t.hvCard + "</div>",
          css: [".hv-cardzoom {", "  width: 180px; padding: 28px 24px; border-radius: 14px;", "  background: #fff; border: 1px solid #e5e7eb; box-shadow: 0 1px 3px rgba(0,0,0,0.1);", "  color: #1e293b; font-weight: 700; text-align: center;", "  transition: transform 0.3s ease;", "}", ".hv-cardzoom:hover { transform: scale(1.05); }"],
        },
        {
          key: "cardglow",
          group: t.groupCard,
          label: t.hvLabels.cardglow,
          html: '<div class="hv-cardglow">' + t.hvCard + "</div>",
          css: [".hv-cardglow {", "  width: 180px; padding: 28px 24px; border-radius: 14px;", "  background: #fff; border: 1px solid #e5e7eb; box-shadow: 0 1px 3px rgba(0,0,0,0.1);", "  color: #1e293b; font-weight: 700; text-align: center;", "  transition: box-shadow 0.3s ease;", "}", ".hv-cardglow:hover { box-shadow: 0 0 0 1px #6366f1, 0 0 24px rgba(99,102,241,0.5); }"],
        },
        {
          key: "cardtilt",
          group: t.groupCard,
          label: t.hvLabels.cardtilt,
          html: '<div class="hv-cardtilt">' + t.hvCard + "</div>",
          css: [".hv-cardtilt {", "  width: 180px; padding: 28px 24px; border-radius: 14px;", "  background: #fff; border: 1px solid #e5e7eb; box-shadow: 0 1px 3px rgba(0,0,0,0.1);", "  color: #1e293b; font-weight: 700; text-align: center;", "  transition: transform 0.3s ease;", "  transform: perspective(700px) rotateX(0) rotateY(0);", "}", ".hv-cardtilt:hover { transform: perspective(700px) rotateX(6deg) rotateY(-6deg); }"],
        },
        // 画像系（.ph は画像プレースホルダ。<img> に差し替え可）
        {
          key: "imgzoom",
          group: t.groupImage,
          label: t.hvLabels.imgzoom,
          html: '<div class="hv-imgzoom"><div class="ph">🏞️</div></div>',
          css: [".hv-imgzoom { width: 200px; height: 140px; border-radius: 12px; overflow: hidden; }", ".hv-imgzoom .ph {", "  width: 100%; height: 100%; display: flex; align-items: center; justify-content: center;", "  font-size: 3rem; background: linear-gradient(135deg, #60a5fa, #a78bfa);", "  transition: transform 0.4s ease;", "}", ".hv-imgzoom:hover .ph { transform: scale(1.15); }"],
        },
        {
          key: "imggray",
          group: t.groupImage,
          label: t.hvLabels.imggray,
          html: '<div class="hv-imggray"><div class="ph">🏞️</div></div>',
          css: [".hv-imggray { width: 200px; height: 140px; border-radius: 12px; overflow: hidden; }", ".hv-imggray .ph {", "  width: 100%; height: 100%; display: flex; align-items: center; justify-content: center;", "  font-size: 3rem; background: linear-gradient(135deg, #60a5fa, #a78bfa);", "  filter: grayscale(1); transition: filter 0.4s ease;", "}", ".hv-imggray:hover .ph { filter: grayscale(0); }"],
        },
        {
          key: "imgblur",
          group: t.groupImage,
          label: t.hvLabels.imgblur,
          html: '<div class="hv-imgblur"><div class="ph">🏞️</div></div>',
          css: [".hv-imgblur { width: 200px; height: 140px; border-radius: 12px; overflow: hidden; }", ".hv-imgblur .ph {", "  width: 100%; height: 100%; display: flex; align-items: center; justify-content: center;", "  font-size: 3rem; background: linear-gradient(135deg, #60a5fa, #a78bfa);", "  filter: blur(4px); transition: filter 0.4s ease;", "}", ".hv-imgblur:hover .ph { filter: blur(0); }"],
        },
        {
          key: "imgoverlay",
          group: t.groupImage,
          label: t.hvLabels.imgoverlay,
          html: '<div class="hv-imgoverlay"><div class="ph">🏞️</div><div class="cap">' + t.hvDetail + "</div></div>",
          css: [".hv-imgoverlay { position: relative; width: 200px; height: 140px; border-radius: 12px; overflow: hidden; }", ".hv-imgoverlay .ph {", "  width: 100%; height: 100%; display: flex; align-items: center; justify-content: center;", "  font-size: 3rem; background: linear-gradient(135deg, #60a5fa, #a78bfa);", "}", ".hv-imgoverlay .cap {", "  position: absolute; inset: 0; display: flex; align-items: center; justify-content: center;", "  background: rgba(15,23,42,0.6); color: #fff; font-weight: 700;", "  opacity: 0; transition: opacity 0.3s ease;", "}", ".hv-imgoverlay:hover .cap { opacity: 1; }"],
        },
        // リンク/テキスト系
        {
          key: "underline",
          group: t.groupLink,
          label: t.hvLabels.underline,
          html: '<a href="#" class="hv-underline">' + t.hvLink + "</a>",
          css: [".hv-underline {", "  position: relative; color: #6366f1; font-size: 1.1rem; font-weight: 700; text-decoration: none;", "}", ".hv-underline::after {", '  content: ""; position: absolute; left: 0; bottom: -2px; width: 100%; height: 2px;', "  background: currentColor; transform: scaleX(0); transform-origin: left;", "  transition: transform 0.3s ease;", "}", ".hv-underline:hover::after { transform: scaleX(1); }"],
        },
        {
          key: "underlinecenter",
          group: t.groupLink,
          label: t.hvLabels.underlinecenter,
          html: '<a href="#" class="hv-underlinec">' + t.hvLink + "</a>",
          css: [".hv-underlinec {", "  position: relative; color: #6366f1; font-size: 1.1rem; font-weight: 700; text-decoration: none;", "}", ".hv-underlinec::after {", '  content: ""; position: absolute; left: 0; bottom: -2px; width: 100%; height: 2px;', "  background: currentColor; transform: scaleX(0); transform-origin: center;", "  transition: transform 0.3s ease;", "}", ".hv-underlinec:hover::after { transform: scaleX(1); }"],
        },
        {
          key: "linkcolor",
          group: t.groupLink,
          label: t.hvLabels.linkcolor,
          html: '<a href="#" class="hv-linkcolor">' + t.hvLink + "</a>",
          css: [".hv-linkcolor {", "  color: #1e293b; font-size: 1.1rem; font-weight: 700; text-decoration: none;", "  transition: color 0.25s ease;", "}", ".hv-linkcolor:hover { color: #ec4899; }"],
        },
        {
          key: "linkslide",
          group: t.groupLink,
          label: t.hvLabels.linkslide,
          html: '<a href="#" class="hv-linkslide">' + t.hvMore + '<span class="arrow">→</span></a>',
          css: [".hv-linkslide {", "  display: inline-flex; align-items: center; gap: 6px;", "  color: #6366f1; font-size: 1.1rem; font-weight: 700; text-decoration: none;", "}", ".hv-linkslide .arrow { transition: transform 0.25s ease; }", ".hv-linkslide:hover .arrow { transform: translateX(6px); }"],
        },
      ];

      // 全エフェクトのCSSを一度だけ<style>に注入する
      let hoverStylesInjected = false;
      function injectHoverStyles() {
        if (hoverStylesInjected) return;
        const style = document.createElement("style");
        style.textContent = HOVER_EFFECTS.map((e) => e.css.join("\n")).join("\n");
        document.head.appendChild(style);
        hoverStylesInjected = true;
      }
      function buildHoverCode(effect) {
        return "<style>\n" + effect.css.join("\n") + "\n</style>\n\n" + effect.html;
      }
      function renderHoverEffects() {
        injectHoverStyles();
        const row = document.getElementById("hoverRow");
        row.innerHTML = "";
        for (const effect of HOVER_EFFECTS) {
          const item = document.createElement("div");
          item.className = "showcase-item";

          const stage = document.createElement("div");
          stage.style.minHeight = "140px";
          stage.style.display = "flex";
          stage.style.alignItems = "center";
          stage.style.justifyContent = "center";
          stage.style.cursor = "pointer";
          stage.innerHTML = effect.html;
          // デモのリンクは遷移させない
          stage.querySelectorAll("a").forEach((a) => a.addEventListener("click", (e) => e.preventDefault()));
          stage.addEventListener("click", () => selectHover(effect, item));

          const label = document.createElement("div");
          label.className = "label";
          label.textContent = effect.group + "｜" + effect.label;

          const btn = document.createElement("button");
          btn.className = "copy-btn";
          btn.textContent = "HTML+CSS";
          btn.addEventListener("click", (e) => {
            selectHover(effect, item);
            copyText(buildHoverCode(effect), e.currentTarget, effect.label);
          });

          item.appendChild(stage);
          item.appendChild(label);
          item.appendChild(btn);
          row.appendChild(item);
        }
      }

      // すべてのギャラリーを再描画する（初期化・リセットで共有）
      function renderAll() {
        renderFilters();
        renderGrid();
        renderFlipCards();
        renderCube();
        renderCarousel();
        renderFadeSlider();
        renderScrollCarousel();
        renderSnapCarousel();
        renderMarquee();
        renderCoverflow();
        renderHoverEffects();
      }

      // イベント
      els.demoType.addEventListener("change", () => {
        renderGrid();
        updatePreview();
        saveSettings();
      });
      els.hoverPlay.addEventListener("change", () => {
        renderGrid();
        updatePreview();
        saveSettings();
      });
      els.duration.addEventListener("input", () => {
        els.durVal.textContent = parseFloat(els.duration.value).toFixed(1) + "s";
        renderFlipCards();
        renderCube();
        renderCarousel();
        renderFadeSlider();
        renderScrollCarousel();
        renderMarquee();
        updatePreview();
        saveSettings();
      });
      els.easing.addEventListener("change", () => {
        updatePreview();
        saveSettings();
      });
      els.iteration.addEventListener("change", () => {
        updatePreview();
        saveSettings();
      });
      els.autoPlayMode.addEventListener("change", saveSettings);
      els.playAll.addEventListener("click", playAllVisible);
      els.resetSettings.addEventListener("click", resetSettings);

      // 設定アコーディオン（初期は閉じた状態）
      const settingsCard = document.getElementById("settingsCard");
      const settingsToggle = document.getElementById("settingsToggle");
      settingsToggle.addEventListener("click", () => {
        const collapsed = settingsCard.classList.toggle("collapsed");
        settingsToggle.setAttribute("aria-expanded", String(!collapsed));
      });

      // コードプレビュー操作
      els.fmtToggle.querySelectorAll(".fmt-btn").forEach((b) => b.addEventListener("click", () => setFormat(b.dataset.fmt)));
      els.copyPreview.addEventListener("click", (e) => {
        if (selected) copyText(getSelectedCode(), e.currentTarget, t.labelCode);
      });

      // 初期化（保存済み設定を反映してから描画する）
      restoreSettings();
      renderAll();
      // 初期選択（先頭のアニメーション）
      selectAnim(ANIMATIONS[0], document.querySelector(".grid .card"));
      // 自動再生が「1回再生」なら、初回ペイント直後にすべて再生する
      // （重い初期描画の前に再生するとアニメ冒頭が見えないため rAF 2回で待つ）
      if (els.autoPlayMode.value === "once") {
        requestAnimationFrame(() => requestAnimationFrame(playAllVisible));
      }
