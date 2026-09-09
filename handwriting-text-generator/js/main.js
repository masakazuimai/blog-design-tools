import { FONTS, findFont, loadFont } from "./fonts.js?v=20260910a";
import { buildLayout } from "./layout.js?v=20260910a";
import { PAPERS, PENS, findPaper, findPen } from "./presets.js?v=20260910a";
import { drawCanvas, buildSVG } from "./render.js?v=20260910a";
import { TEMPLATES, findTemplate } from "./templates.js?v=20260910a";
import { T, L } from "./i18n.js?v=20260910a";

const $ = function (id) { return document.getElementById(id); };
let currentFont = null;
let lastLayout = null;

function pressed(wrapId) {
  const el = $(wrapId).querySelector('[aria-pressed="true"]');
  return el ? el.dataset.v : "";
}

function opts() {
  return {
    text: $("text").value,
    size: +$("size").value,
    lh: +$("lh").value / 10,
    ls: +$("ls").value / 100,
    pad: +$("pad").value,
    jitA: (+$("jitA").value / 10) * Math.PI / 180,
    jitP: +$("jitP").value / 1000,
    jitS: +$("jitS").value / 100,
    tilt: (+$("tilt").value / 10) * Math.PI / 180,
    wave: +$("wave").value / 100,
    weight: +$("weight").value / 10,
    skew: (+$("skew").value / 10) * Math.PI / 180,
    dir: pressed("dir"),
    ink: $("ink").value,
    paperColor: $("paper").value,
    seed: +$("seed").value,
    fixedW: $("canvasSize").hidden ? 0 : +$("cw").value,
    fixedH: $("canvasSize").hidden ? 0 : +$("ch").value,
    forceFill: false
  };
}

function setStatus(msg) { $("status").textContent = msg; }

function render() {
  if (!currentFont) return;
  const o = opts();
  const paper = findPaper(pressed("paperSel"));
  const pen = findPen(pressed("penSel"));
  try {
    const preview = window.devicePixelRatio > 1 ? 2 : 1;
    lastLayout = buildLayout(currentFont, o, paper, pen);
    // 固定キャンバスからはみ出したら、文字サイズと余白を縮めて入るまで組み直す
    if ($("fit").checked) {
      for (let i = 0; i < 3 && lastLayout.overflow; i++) {
        const k = Math.min(o.fixedW / lastLayout.cw, o.fixedH / lastLayout.ch) * 0.98;
        o.size = Math.max(16, o.size * k);
        o.pad = o.pad * k;
        lastLayout = buildLayout(currentFont, o, paper, pen);
      }
    }
    drawCanvas($("cv"), lastLayout, o, paper, pen, preview);
    const outW = $("cv").width / preview, outH = $("cv").height / preview;
    $("cv").style.width = Math.min(outW, 1000) + "px";
    const sc = +$("scale").value;
    setStatus(T.preview(outW, outH, lastLayout.items.length)
      + T.exportSize(sc, outW * sc, outH * sc)
      + (lastLayout.overflow ? T.overflow : "")
      + (o.size !== +$("size").value ? T.shrunk(Math.round(o.size)) : ""));
    ["dlPng", "dlJpg", "dlSvg"].forEach(function (id) { $(id).disabled = false; });
  } catch (e) {
    console.error("描画に失敗:", e);
    setStatus(T.drawFailed(e.message));
  }
}

async function selectFont(id) {
  const meta = findFont(id);
  ["dlPng", "dlJpg", "dlSvg"].forEach(function (i) { $(i).disabled = true; });
  setStatus(T.loading(L(meta.name)));
  try {
    currentFont = await loadFont(id);
    render();
  } catch (e) {
    console.error("フォント読み込み失敗:", e);
    setStatus(T.loadFailed(e.message));
  }
}

// Blobダウンロード（アンカーをDOMに入れてclick→遅延revoke）
function save(blob, filename) {
  if (!blob) { setStatus(T.saveFailed); return; }
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
}

function exportRaster(type, ext, quality) {
  const o = opts();
  if (type === "image/jpeg") o.forceFill = true;   // JPGは透過を持てないので紙色で塗る
  const paper = findPaper(pressed("paperSel"));
  const pen = findPen(pressed("penSel"));
  const cv = document.createElement("canvas");
  drawCanvas(cv, lastLayout, o, paper, pen, +$("scale").value);
  cv.toBlob(function (b) { save(b, "handwriting." + ext); }, type, quality);
}

// にじみ・かすれを使うペンは、SVGがフィルタ表現になることを知らせる
function updatePenNote() {
  const pen = findPen(pressed("penSel"));
  $("penNote").hidden = !(pen.rough > 0 || pen.blur > 0);
}

// ── テンプレート適用 ───────────────────────────────────────────────
function setChip(wrapId, id) {
  Array.prototype.forEach.call($(wrapId).querySelectorAll(".chip"), function (c) {
    c.setAttribute("aria-pressed", String(c.dataset.v === id));
  });
}
function setSlider(id, value) {
  $(id).value = value;
  const out = $(id + "V");
  if (out && VIEW[id]) out.textContent = VIEW[id](+value);
}
function applyTemplate(id) {
  const t = findTemplate(id);
  setChip("dir", t.dir);
  setChip("paperSel", t.paper);
  setChip("penSel", t.pen);
  const paper = findPaper(t.paper);
  if (paper.fill) $("paper").value = paper.fill;
  ["size", "lh", "pad", "tilt", "wave"].forEach(function (k) { setSlider(k, t[k]); });
  const fixed = t.w > 0 && t.h > 0;
  $("canvasSize").hidden = !fixed;
  $("fitField").hidden = !fixed;
  if (fixed) { $("cw").value = t.w; $("ch").value = t.h; }
  updatePenNote();
  render();
}

// ── チップUIの生成 ─────────────────────────────────────────────────
function buildChips(wrapId, list, activeId) {
  const wrap = $(wrapId);
  list.forEach(function (item) {
    const b = document.createElement("button");
    b.className = "chip";
    b.type = "button";
    b.dataset.v = item.id;
    b.textContent = L(item.label);
    b.setAttribute("aria-pressed", String(item.id === activeId));
    wrap.appendChild(b);
  });
  wrap.addEventListener("click", function (ev) {
    const btn = ev.target.closest(".chip");
    if (!btn) return;
    Array.prototype.forEach.call(wrap.querySelectorAll(".chip"), function (c) {
      c.setAttribute("aria-pressed", String(c === btn));
    });
    if (wrapId === "tplSel") { applyTemplate(btn.dataset.v); return; }
    // 紙を選んだら紙色の既定値も追従させる
    if (wrapId === "paperSel") {
      const p = findPaper(btn.dataset.v);
      if (p.fill) $("paper").value = p.fill;
    }
    updatePenNote();
    render();
  });
}

// ── 初期化 ─────────────────────────────────────────────────────────
const sel = $("font");
FONTS.forEach(function (f) {
  const op = document.createElement("option");
  op.value = f.id;
  op.textContent = L(f.name);
  sel.appendChild(op);
});
sel.addEventListener("change", function () { selectFont(sel.value); });

buildChips("tplSel", TEMPLATES, "free");
buildChips("paperSel", PAPERS, "rule");
buildChips("penSel", PENS, "ballpoint");
$("paper").value = findPaper("rule").fill;
updatePenNote();

const VIEW = {
  size: function (v) { return v; },
  lh: function (v) { return (v / 10).toFixed(1); },
  ls: function (v) { return v; },
  pad: function (v) { return v; },
  jitA: function (v) { return (v / 10).toFixed(1) + "°"; },
  jitP: function (v) { return (v / 10).toFixed(1) + "%"; },
  jitS: function (v) { return v + "%"; },
  weight: function (v) { return (v / 10).toFixed(1); },
  tilt: function (v) { return (v / 10).toFixed(1) + "°"; },
  wave: function (v) { return v + "%"; },
  skew: function (v) { return (v / 10).toFixed(1) + "°"; },
  seed: function (v) { return v; }
};
Object.keys(VIEW).forEach(function (id) {
  const el = $(id), out = $(id + "V");
  el.addEventListener("input", function () {
    if (out) out.textContent = VIEW[id](+el.value);
    render();
  });
  if (out) out.textContent = VIEW[id](+el.value);
});
["text", "ink", "paper"].forEach(function (id) { $(id).addEventListener("input", render); });
$("scale").addEventListener("change", render);
["cw", "ch"].forEach(function (id) { $(id).addEventListener("input", render); });
$("fit").addEventListener("change", render);

$("dir").addEventListener("click", function (ev) {
  const btn = ev.target.closest(".chip");
  if (!btn) return;
  Array.prototype.forEach.call(this.querySelectorAll(".chip"), function (c) {
    c.setAttribute("aria-pressed", String(c === btn));
  });
  render();
});

$("dlPng").addEventListener("click", function () { exportRaster("image/png", "png"); });
$("dlJpg").addEventListener("click", function () { exportRaster("image/jpeg", "jpg", 0.92); });
$("dlSvg").addEventListener("click", function () {
  const svg = buildSVG(lastLayout, opts(), findPaper(pressed("paperSel")), findPen(pressed("penSel")));
  save(new Blob([svg], { type: "image/svg+xml" }), "handwriting.svg");
});

selectFont(sel.value || FONTS[0].id);
