
import { t, isEN } from './i18n.js?v=20260818c';
import { AI_MODELS, AI_SCALES, webgpuAvailable, isModelLoaded, aiUpscale, estimateSeconds as aiEstimate } from './ai-upscale.js?v=20260818c';
import { FORMATS, encodeCanvas, formatFromMime } from './export.js?v=20260818c';

/* js/ 配下のローカル参照に付けるキャッシュバスティング用の版番号 */
const ASSET_VERSION = '20260818c';

/* サンプル画像は日本語版の直下にだけ置き、/en/ からは1階層上を参照する */
const SAMPLE_BASE = isEN ? '../samples/' : 'samples/';

// 出力上限。逆投影とデコンボリューションが画素あたり約31バイトのFloat32バッファを使うため、
// 24MPだと700MB超になる。（本番ではタイル分割で解除する想定）
const MAX_OUT_PIXELS = 16000000;
const IBP_ITERATIONS = 5;   // 実測で5回以降は頭打ち
const IBP_LAMBDA = 1.0;

const $ = function (id) { return document.getElementById(id); };
const dropzone = $('dropzone');
const fileInput = $('fileInput');
const settings = $('settings');
const resultPanel = $('result');
const metaLine = $('metaLine');
const runBtn = $('runBtn');
const progressWrap = $('progressWrap');
const progressFill = $('progressFill');
const progressLabel = $('progressLabel');
const viewportEl = $('viewport');
const viewCanvas = $('view');
const zoomLabel = $('zoomLabel');

let sourceCanvas = null;   // 元画像
let baselineCanvas = null; // ブラウザ標準拡大
let outputCanvas = null;   // 高画質化結果
let sourceName = 'image';
let worker = null;

let scale = 2;
let deconvIters = 20;
let mode = 'standard';   // 'standard' = 数値計算 / 'ai' = Swin2SR
const view = { zoom: 1, panX: 0, panY: 0, split: 0.5, fit: true };

/* ---------- 入力 ---------- */

dropzone.addEventListener('click', function () { fileInput.click(); });
fileInput.addEventListener('change', function (e) {
  if (e.target.files && e.target.files[0]) loadFile(e.target.files[0]);
});
['dragenter', 'dragover'].forEach(function (ev) {
  dropzone.addEventListener(ev, function (e) {
    e.preventDefault(); dropzone.classList.add('is-over');
  });
});
['dragleave', 'drop'].forEach(function (ev) {
  dropzone.addEventListener(ev, function (e) {
    e.preventDefault(); dropzone.classList.remove('is-over');
  });
});
dropzone.addEventListener('drop', function (e) {
  const f = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
  if (f) loadFile(f);
});

async function loadFile(file) {
  if (!file.type.startsWith('image/')) {
    alert(t.notImage);
    return;
  }
  sourceName = file.name.replace(/\.[^.]+$/, '') || 'image';
  // 元と同じ形式で返すのが自然なので、保存形式の既定を入力に合わせる
  $('dlFormat').value = formatFromMime(file.type);
  try {
    const bitmap = await createImageBitmap(file);
    sourceCanvas = document.createElement('canvas');
    sourceCanvas.width = bitmap.width;
    sourceCanvas.height = bitmap.height;
    sourceCanvas.getContext('2d').drawImage(bitmap, 0, 0);
    bitmap.close();
    settings.hidden = false;
    resultPanel.hidden = true;
    applyAutoRadius();
    updateMeta();
  } catch (err) {
    console.error(err);
    alert(t.loadFailed + err.message);
  }
}

Array.prototype.forEach.call(document.querySelectorAll('.sample-btn'), function (btn) {
  btn.addEventListener('click', async function () {
    const name = btn.dataset.sample;
    try {
      const res = await fetch(SAMPLE_BASE + name + '.jpg');
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const blob = await res.blob();
      loadFile(new File([blob], name + '.jpg', { type: 'image/jpeg' }));
    } catch (err) {
      console.error(err);
      alert(t.sampleFailed + err.message);
    }
  });
});

/* ---------- 設定UI ---------- */

$('scaleSeg').addEventListener('click', function (e) {
  const btn = e.target.closest('button[data-scale]');
  if (!btn) return;
  Array.prototype.forEach.call(this.querySelectorAll('button'), function (b) {
    b.classList.remove('is-active');
  });
  btn.classList.add('is-active');
  scale = parseFloat(btn.dataset.scale);
  applyAutoRadius();
  if (mode === 'ai') $('aiNote').textContent = t.aiNote(AI_MODELS[scale].sizeMB);
  updateMeta();
});

$('modeSeg').addEventListener('click', function (e) {
  const btn = e.target.closest('button[data-mode]');
  if (!btn || btn.disabled) return;
  Array.prototype.forEach.call(this.querySelectorAll('button'), function (b) {
    b.classList.remove('is-active');
  });
  btn.classList.add('is-active');
  mode = btn.dataset.mode;
  applyMode();
  updateMeta();
});

/* AIモードはモデルが固定倍率のため2倍と4倍しか選べない。
   非対応の倍率ボタンを無効化し、選択中なら2倍へ寄せる */
function applyMode() {
  const ai = mode === 'ai';
  document.body.classList.toggle('is-ai-mode', ai);
  Array.prototype.forEach.call($('scaleSeg').querySelectorAll('button'), function (b) {
    const v = parseFloat(b.dataset.scale);
    const ok = !ai || AI_SCALES.indexOf(v) !== -1;
    b.disabled = !ok;
    b.title = ok ? '' : t.aiScaleOnly;
  });
  if (ai && AI_SCALES.indexOf(scale) === -1) {
    const target = $('scaleSeg').querySelector('button[data-scale="2"]');
    Array.prototype.forEach.call($('scaleSeg').querySelectorAll('button'), function (b) { b.classList.remove('is-active'); });
    target.classList.add('is-active');
    scale = 2;
    applyAutoRadius();
  }
  $('aiNote').textContent = ai ? t.aiNote(AI_MODELS[scale] ? AI_MODELS[scale].sizeMB : 0) : '';
}

if (!webgpuAvailable()) {
  // WebGPUが無いとWASM実行になり実測で79秒かかった＝実用にならないため選ばせない
  const aiBtn = $('modeSeg').querySelector('button[data-mode="ai"]');
  aiBtn.disabled = true;
  aiBtn.title = t.aiNoWebGPU;
  $('aiNote').textContent = t.aiNoWebGPU;
}

$('qualitySeg').addEventListener('click', function (e) {
  const btn = e.target.closest('button[data-iters]');
  if (!btn) return;
  Array.prototype.forEach.call(this.querySelectorAll('button'), function (b) {
    b.classList.remove('is-active');
  });
  btn.classList.add('is-active');
  deconvIters = parseInt(btn.dataset.iters, 10);
  updateMeta();
});

/* ボケ補正の目盛りを実際のガウシアンσへ変換する。
   低い側を細かく刻む＝シャープな写真では弱くしか掛からないようにするため。
   実測では、ボケていない写真に強く掛けると PSNR が 24.47 -> 20.59 まで崩れた。 */
function deblurSigma(v) {
  return v <= 0 ? 0 : 0.6 + 2.4 * Math.pow(v / 100, 1.5);
}

function updateDeblurNote() {
  const v = parseInt($('deblur').value, 10);
  const note = $('deblurNote');
  if (v === 0) {
    note.textContent = t.deblurOff;
    note.classList.remove('warn');
  } else if (v <= 40) {
    note.textContent = t.deblurWeak(deblurSigma(v).toFixed(2));
    note.classList.add('warn');
  } else {
    note.textContent = t.deblurStrong(deblurSigma(v).toFixed(2));
    note.classList.add('warn');
  }
}
$('deblur').addEventListener('input', function () {
  updateDeblurNote();
  updateMeta();
});

/* 原本と突き合わせた実測では最適なシャープ半径が倍率にほぼ比例した
   （2倍で σ≒0.6 / 4倍で σ≒1.2）。ユーザーが手で動かすまでは自動追従させる */
let radiusTouched = false;
function applyAutoRadius() {
  if (radiusTouched) return;
  const el = $('radius');
  el.value = Math.min(3, Math.max(0.3, Math.round(scale * 0.3 * 10) / 10));
  el.dispatchEvent(new Event('input'));
}
$('radius').addEventListener('pointerdown', function () { radiusTouched = true; });
$('radius').addEventListener('keydown', function () { radiusTouched = true; });

function bindSlider(id, fmt) {
  const el = $(id);
  const out = $(id + 'Out');
  const sync = function () { out.textContent = fmt(el.value); };
  el.addEventListener('input', sync);
  sync();
}
bindSlider('amount', function (v) { return v + '%'; });
bindSlider('deblur', function (v) { return v; });
bindSlider('radius', function (v) { return parseFloat(v).toFixed(1) + 'px'; });
bindSlider('threshold', function (v) { return v; });
updateDeblurNote();
applyMode();

function targetSize() {
  const sw = sourceCanvas.width, sh = sourceCanvas.height;
  let s = scale;
  // 上限を超える倍率は自動的に切り下げる
  if (sw * sh * s * s > MAX_OUT_PIXELS) {
    s = Math.sqrt(MAX_OUT_PIXELS / (sw * sh));
  }
  return {
    w: Math.max(1, Math.round(sw * s)),
    h: Math.max(1, Math.round(sh * s)),
    scale: s,
    clamped: s < scale - 1e-6
  };
}

function estimateSeconds(megapixels) {
  if (mode === 'ai') {
    // AIは入力画素数で決まる。初回はモデルのダウンロード時間も乗る
    const base = aiEstimate(sourceCanvas.width, sourceCanvas.height, scale);
    return base + (isModelLoaded(scale) ? 0 : AI_MODELS[scale].sizeMB / 2);
  }
  // 実測値から: 拡大＋逆投影が約0.19s/MP、デコンボリューションが約0.034s/MP/反復
  const rl = parseInt($('deblur').value, 10) > 0 ? deconvIters : 0;
  return megapixels * (0.19 + 0.034 * rl);
}

function updateMeta() {
  if (!sourceCanvas) return;
  const tgt = targetSize();
  const mp = tgt.w * tgt.h / 1000000;
  const sec = estimateSeconds(mp);
  let html = t.srcSize + sourceCanvas.width + ' &times; ' + sourceCanvas.height + ' px' +
    ' &nbsp;&rarr;&nbsp; ' + t.outSize + '<strong>' + tgt.w + ' &times; ' + tgt.h + ' px</strong>' +
    ' (' + mp.toFixed(1) + ' MP) &nbsp;/&nbsp; ' + t.estimate +
    (sec < 1 ? t.under1s : Math.round(sec) + t.seconds);
  if (tgt.clamped) {
    html += '<br><span class="warn">' +
      (mode === 'ai' ? t.aiTooLarge(MAX_OUT_PIXELS / 1000000) : t.clamped(tgt.scale.toFixed(2))) +
      '</span>';
  }
  metaLine.innerHTML = html;
}

/* ---------- 実行 ---------- */

runBtn.addEventListener('click', function () {
  if (!sourceCanvas) return;
  const tgt = targetSize();

  // AIモデルは倍率固定（2倍/4倍）で標準モードのように倍率を切り下げられない。
  // 上限を超える場合は走らせず、別の倍率か標準モードを案内する
  if (mode === 'ai' && tgt.clamped) {
    alert(t.aiTooLarge(MAX_OUT_PIXELS / 1000000));
    return;
  }

  runBtn.disabled = true;
  runBtn.textContent = t.runningLabel;
  progressWrap.hidden = false;
  setProgress('resample', 0);

  // 比較用のベースライン（ブラウザ標準の拡大）
  baselineCanvas = document.createElement('canvas');
  baselineCanvas.width = tgt.w;
  baselineCanvas.height = tgt.h;
  const bctx = baselineCanvas.getContext('2d');
  bctx.imageSmoothingEnabled = true;
  bctx.imageSmoothingQuality = 'high';
  bctx.drawImage(sourceCanvas, 0, 0, tgt.w, tgt.h);

  const sctx = sourceCanvas.getContext('2d', { willReadFrequently: true });
  const imgData = sctx.getImageData(0, 0, sourceCanvas.width, sourceCanvas.height);

  if (mode === 'ai') {
    runAI(imgData);
    return;
  }

  if (worker) worker.terminate();
  // ページが / でも /en/ でも同じ js/ を参照できるよう import.meta.url を基準にする
  worker = new Worker(new URL('./upscale-worker.js?v=' + ASSET_VERSION, import.meta.url));

  worker.onmessage = function (e) {
    const d = e.data;
    if (d.type === 'progress') {
      setProgress(d.phase, d.value);
    } else if (d.type === 'done') {
      finish(d);
    } else if (d.type === 'error') {
      fail(d.message);
    }
  };
  worker.onerror = function (err) { fail(err.message || 'Worker error'); };

  worker.postMessage({
    buffer: imgData.data.buffer,
    srcW: sourceCanvas.width,
    srcH: sourceCanvas.height,
    dstW: tgt.w,
    dstH: tgt.h,
    amount: parseFloat($('amount').value) / 100,
    sigma: parseFloat($('radius').value),
    threshold: parseFloat($('threshold').value),
    ibpIters: IBP_ITERATIONS,
    ibpLambda: IBP_LAMBDA,
    deconvIters: parseInt($('deblur').value, 10) > 0 ? deconvIters : 0,
    deconvSigma: deblurSigma(parseInt($('deblur').value, 10))
  }, [imgData.data.buffer]);
});

async function runAI(imgData) {
  const t0 = Date.now();
  try {
    const res = await aiUpscale({
      data: imgData.data,
      width: sourceCanvas.width,
      height: sourceCanvas.height,
      scale: scale,
      onProgress: setProgress
    });
    finish({ buffer: res.data.buffer, w: res.width, h: res.height, ms: Date.now() - t0 });
  } catch (err) {
    fail(err && err.message === 'WEBGPU_UNAVAILABLE' ? t.aiNoWebGPU : String(err && err.message ? err.message : err));
  }
}

function setProgress(phase, value) {
  progressFill.style.width = (value * 100).toFixed(1) + '%';
  progressLabel.textContent = (t.phase[phase] || t.working) + '… ' + Math.round(value * 100) + '%';
}

function fail(msg) {
  console.error(msg);
  progressWrap.hidden = true;
  runBtn.disabled = false;
  runBtn.textContent = t.runLabel;
  alert(t.runFailed + msg);
}

function finish(d) {
  outputCanvas = document.createElement('canvas');
  outputCanvas.width = d.w;
  outputCanvas.height = d.h;
  outputCanvas.getContext('2d').putImageData(
    new ImageData(new Uint8ClampedArray(d.buffer), d.w, d.h), 0, 0
  );

  progressWrap.hidden = true;
  runBtn.disabled = false;
  runBtn.textContent = t.runLabel;
  progressLabel.textContent = '';

  resultPanel.hidden = false;
  view.split = 0.5;
  fitView();
  syncHandle();
  resultPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });

}

/* ---------- 比較ビュー ---------- */

function viewportSize() {
  const dpr = window.devicePixelRatio || 1;
  const rect = viewportEl.getBoundingClientRect();
  return { w: Math.round(rect.width * dpr), h: Math.round(rect.height * dpr), dpr: dpr };
}

function fitView() {
  if (!outputCanvas) return;
  const vs = viewportSize();
  view.zoom = Math.min(vs.w / outputCanvas.width, vs.h / outputCanvas.height);
  view.fit = true;
  centerPan();
  render();
}

function setZoom(z, fit) {
  view.zoom = z;
  view.fit = !!fit;
  clampPan();
  render();
}

function centerPan() {
  const vs = viewportSize();
  view.panX = (vs.w - outputCanvas.width * view.zoom) / 2;
  view.panY = (vs.h - outputCanvas.height * view.zoom) / 2;
}

function clampPan() {
  const vs = viewportSize();
  const dw = outputCanvas.width * view.zoom;
  const dh = outputCanvas.height * view.zoom;
  view.panX = dw <= vs.w ? (vs.w - dw) / 2 : Math.min(0, Math.max(vs.w - dw, view.panX));
  view.panY = dh <= vs.h ? (vs.h - dh) / 2 : Math.min(0, Math.max(vs.h - dh, view.panY));
}

function render() {
  if (!outputCanvas || !baselineCanvas) return;
  const vs = viewportSize();
  if (viewCanvas.width !== vs.w || viewCanvas.height !== vs.h) {
    viewCanvas.width = vs.w;
    viewCanvas.height = vs.h;
  }
  const ctx = viewCanvas.getContext('2d');
  ctx.clearRect(0, 0, vs.w, vs.h);
  // 等倍以上では実ピクセルを見たいので補間を切る
  ctx.imageSmoothingEnabled = view.zoom < 1;

  const dw = outputCanvas.width * view.zoom;
  const dh = outputCanvas.height * view.zoom;
  const splitX = vs.w * view.split;

  ctx.save();
  ctx.beginPath(); ctx.rect(0, 0, splitX, vs.h); ctx.clip();
  ctx.drawImage(baselineCanvas, view.panX, view.panY, dw, dh);
  ctx.restore();

  ctx.save();
  ctx.beginPath(); ctx.rect(splitX, 0, vs.w - splitX, vs.h); ctx.clip();
  ctx.drawImage(outputCanvas, view.panX, view.panY, dw, dh);
  ctx.restore();

  zoomLabel.textContent = t.zoomLabel + Math.round(view.zoom * 100) + '%';
}

/* 仕切りハンドル: GSAP Draggable。読み込めなかった場合は素のポインタ操作へ退避 */
const cpHandle = $('cpHandle');

function syncHandle() {
  const w = viewportEl.clientWidth;
  const x = view.split * w;
  if (window.gsap) gsap.set(cpHandle, { x: x });
  else cpHandle.style.transform = 'translateX(' + x + 'px)';
}

function handleMoved(x) {
  view.split = Math.min(1, Math.max(0, x / viewportEl.clientWidth));
  render();
}

if (window.gsap && window.Draggable) {
  gsap.registerPlugin(Draggable);
  Draggable.create(cpHandle, {
    type: 'x',
    bounds: viewportEl,
    cursor: 'ew-resize',
    onDrag: function () { handleMoved(gsap.getProperty(cpHandle, 'x')); }
  });
} else {
  let hDrag = false;
  cpHandle.addEventListener('pointerdown', function (e) {
    hDrag = true;
    cpHandle.setPointerCapture(e.pointerId);
  });
  cpHandle.addEventListener('pointermove', function (e) {
    if (!hDrag) return;
    const rect = viewportEl.getBoundingClientRect();
    handleMoved(e.clientX - rect.left);
    syncHandle();
  });
  ['pointerup', 'pointercancel'].forEach(function (ev) {
    cpHandle.addEventListener(ev, function () { hDrag = false; });
  });
}

/* ビューポートのドラッグはパン専用（ハンドル上では無視する） */
let drag = null;
viewportEl.addEventListener('pointerdown', function (e) {
  if (!outputCanvas) return;
  if (e.target.closest('.cp-handle')) return;
  drag = { x: e.clientX, y: e.clientY, px: view.panX, py: view.panY };
  viewportEl.setPointerCapture(e.pointerId);
  viewportEl.classList.add('is-grabbing');
});
viewportEl.addEventListener('pointermove', function (e) {
  if (!drag) return;
  const vs = viewportSize();
  view.panX = drag.px + (e.clientX - drag.x) * vs.dpr;
  view.panY = drag.py + (e.clientY - drag.y) * vs.dpr;
  clampPan();
  render();
});
['pointerup', 'pointercancel'].forEach(function (ev) {
  viewportEl.addEventListener(ev, function () {
    drag = null;
    viewportEl.classList.remove('is-grabbing');
  });
});
viewportEl.addEventListener('wheel', function (e) {
  if (!outputCanvas) return;
  e.preventDefault();
  const vs = viewportSize();
  const rect = viewportEl.getBoundingClientRect();
  const cx = (e.clientX - rect.left) * vs.dpr;
  const cy = (e.clientY - rect.top) * vs.dpr;
  // カーソル位置を固定してズームする
  const imgX = (cx - view.panX) / view.zoom;
  const imgY = (cy - view.panY) / view.zoom;
  const next = Math.min(8, Math.max(0.05, view.zoom * (e.deltaY < 0 ? 1.15 : 1 / 1.15)));
  view.zoom = next;
  view.fit = false;
  view.panX = cx - imgX * next;
  view.panY = cy - imgY * next;
  clampPan();
  render();
}, { passive: false });

$('fitBtn').addEventListener('click', fitView);
$('oneToOneBtn').addEventListener('click', function () {
  const vs = viewportSize();
  setZoom(vs.dpr >= 2 ? vs.dpr : 1, false);
  centerPan();
  clampPan();
  render();
});
window.addEventListener('resize', function () {
  if (!outputCanvas) return;
  if (view.fit) fitView(); else { clampPan(); render(); }
  syncHandle();
});

/* ---------- ダウンロード ---------- */

const dlBtn = $('dlBtn');
const dlFormat = $('dlFormat');

function triggerDownload(blob, ext) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = sourceName + '_upscaled_' + outputCanvas.width + 'x' + outputCanvas.height + '.' + ext;
  // 一部環境では DOM に挿入しないと click が効かないため必ず append する。
  // 削除と revoke は同期で行うと一部環境で DL が始まらないため遅らせる
  document.body.appendChild(a);
  a.click();
  setTimeout(function () {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 10000);
}

dlBtn.addEventListener('click', async function () {
  if (!outputCanvas) return;
  const format = dlFormat.value;
  const label = dlBtn.textContent;
  dlBtn.disabled = true;
  // AVIF は WASM の取得とエンコードで数秒かかるので待ち表示にする
  if (format === 'avif') dlBtn.textContent = t.encoding;
  try {
    const blob = await encodeCanvas(outputCanvas, format);
    triggerDownload(blob, FORMATS[format].ext);
  } catch (err) {
    console.error(err);
    alert(err && err.message === 'FORMAT_UNSUPPORTED' ? t.formatUnsupported : t.exportFailed);
  } finally {
    dlBtn.disabled = false;
    dlBtn.textContent = label;
  }
});
