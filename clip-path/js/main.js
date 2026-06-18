import { SHAPES } from "./shapes.js?v=20260618f";

// ===== 状態 =====
const state = {
  type: "polygon", // polygon | circle | ellipse | inset
  points: regularPolygon(6), // 初期表示は正多角形スライダー既定の6角
  activeShape: null,
  fillRule: null, // 市松などは "evenodd"
  stripeVertical: false, // ストライプの向き（本数スライダーが参照）
  circle: { r: 50, cx: 50, cy: 50 },
  ellipse: { rx: 50, ry: 35, cx: 50, cy: 50 },
  inset: { top: 10, right: 10, bottom: 10, left: 10, round: 0 },
  animate: false,
};

function clonePoints(pts) {
  return pts.map((p) => [p[0], p[1]]);
}
function round(n) {
  return Math.round(n);
}
function clamp(n) {
  return Math.max(0, Math.min(100, n));
}

// ===== DOM =====
const wrap = document.getElementById("preview-wrap");
const clipBox = document.getElementById("clip-box");
const handles = document.getElementById("handles");
const output = document.getElementById("output");
const typeRow = document.getElementById("type-row");
const shapeGrid = document.getElementById("shape-grid");

// ===== clip-path 値の生成 =====
function buildValue() {
  if (state.type === "polygon") {
    const pts = state.points.map(([x, y]) => `${round(x)}% ${round(y)}%`).join(", ");
    return `polygon(${state.fillRule ? state.fillRule + ", " : ""}${pts})`;
  }
  if (state.type === "circle") {
    const c = state.circle;
    return `circle(${round(c.r)}% at ${round(c.cx)}% ${round(c.cy)}%)`;
  }
  if (state.type === "ellipse") {
    const e = state.ellipse;
    return `ellipse(${round(e.rx)}% ${round(e.ry)}% at ${round(e.cx)}% ${round(e.cy)}%)`;
  }
  const i = state.inset;
  const base = `inset(${round(i.top)}% ${round(i.right)}% ${round(i.bottom)}% ${round(i.left)}%`;
  return i.round > 0 ? `${base} round ${round(i.round)}%)` : `${base})`;
}

// ===== 反映 =====
function applyClip() {
  const value = buildValue();
  clipBox.style.clipPath = value;
  clipBox.style.webkitClipPath = value;
  renderOutput(value);
}

function renderOutput(value) {
  let css = `.clip-path {\n  clip-path: ${value};\n  -webkit-clip-path: ${value};`;
  if (state.animate) {
    css += `\n  transition: clip-path 0.4s ease, -webkit-clip-path 0.4s ease;`;
  }
  css += `\n}`;
  if (state.animate) {
    css += `\n\n/* ホバーで切り抜きを解除して全体を表示 */\n.clip-path:hover {\n  clip-path: inset(0);\n  -webkit-clip-path: inset(0);\n}`;
  }
  output.value = css;
}

// ===== ハンドル（polygon のみ） =====
function renderHandles() {
  handles.innerHTML = "";
  if (state.type !== "polygon") return;
  state.points.forEach(([x, y], idx) => {
    const h = document.createElement("div");
    h.className = "handle";
    h.style.left = `${x}%`;
    h.style.top = `${y}%`;
    h.dataset.index = String(idx);
    h.title = "ドラッグで移動 / ダブルクリックで削除";
    handles.appendChild(h);
  });
}

// ドラッグ
let dragIndex = -1;
function pointerPercent(e) {
  const rect = wrap.getBoundingClientRect();
  return {
    x: clamp(((e.clientX - rect.left) / rect.width) * 100),
    y: clamp(((e.clientY - rect.top) / rect.height) * 100),
  };
}
handles.addEventListener("pointerdown", (e) => {
  const target = e.target.closest(".handle");
  if (!target) return;
  dragIndex = Number(target.dataset.index);
  target.classList.add("active");
  target.setPointerCapture(e.pointerId);
});
handles.addEventListener("pointermove", (e) => {
  if (dragIndex < 0) return;
  const { x, y } = pointerPercent(e);
  state.points[dragIndex] = [x, y];
  state.activeShape = null;
  syncShapeButtons();
  const h = handles.children[dragIndex];
  if (h) {
    h.style.left = `${x}%`;
    h.style.top = `${y}%`;
  }
  applyClip();
});
handles.addEventListener("pointerup", (e) => {
  if (dragIndex >= 0) {
    const h = handles.children[dragIndex];
    if (h) h.classList.remove("active");
  }
  dragIndex = -1;
});
// 頂点の削除（ダブルクリック）
handles.addEventListener("dblclick", (e) => {
  const target = e.target.closest(".handle");
  if (!target) return;
  e.stopPropagation();
  if (state.points.length <= 3) return;
  state.points.splice(Number(target.dataset.index), 1);
  state.activeShape = null;
  syncShapeButtons();
  renderHandles();
  applyClip();
});
// 頂点の追加（プレビュー上のダブルクリック）
wrap.addEventListener("dblclick", (e) => {
  if (state.type !== "polygon") return;
  if (e.target.closest(".handle")) return;
  const { x, y } = pointerPercent(e);
  const insertAt = nearestEdgeIndex(x, y);
  state.points.splice(insertAt, 0, [x, y]);
  state.activeShape = null;
  syncShapeButtons();
  renderHandles();
  applyClip();
});
// クリック地点に最も近い辺の「後ろ」に挿入する位置を返す
function nearestEdgeIndex(px, py) {
  const pts = state.points;
  let best = pts.length;
  let bestDist = Infinity;
  for (let i = 0; i < pts.length; i++) {
    const a = pts[i];
    const b = pts[(i + 1) % pts.length];
    const d = segDist(px, py, a[0], a[1], b[0], b[1]);
    if (d < bestDist) {
      bestDist = d;
      best = i + 1;
    }
  }
  return best;
}
function segDist(px, py, x1, y1, x2, y2) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len2 = dx * dx + dy * dy || 1;
  let t = ((px - x1) * dx + (py - y1) * dy) / len2;
  t = Math.max(0, Math.min(1, t));
  const cx = x1 + t * dx;
  const cy = y1 + t * dy;
  return Math.hypot(px - cx, py - cy);
}

// ===== 形状タイプ切替 =====
typeRow.addEventListener("click", (e) => {
  const btn = e.target.closest(".type-btn");
  if (!btn) return;
  state.type = btn.dataset.type;
  [...typeRow.children].forEach((b) => b.classList.toggle("active", b === btn));
  document.querySelectorAll("[data-card]").forEach((c) => {
    c.classList.toggle("hidden", c.dataset.card !== state.type);
  });
  renderHandles();
  applyClip();
});

// ===== 定番形状（polygon） =====
SHAPES.forEach((shape) => {
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "shape-btn";
  btn.dataset.shape = shape.key;
  btn.textContent = shape.label;
  shapeGrid.appendChild(btn);
});
shapeGrid.addEventListener("click", (e) => {
  const btn = e.target.closest(".shape-btn");
  if (!btn) return;
  const shape = SHAPES.find((s) => s.key === btn.dataset.shape);
  if (shape.parametric === "stripe") {
    state.stripeVertical = !!shape.vertical;
    state.points = stripePolygon(shape.n, state.stripeVertical);
    state.fillRule = null;
    stripes.value = shape.n;
    stripesLabel.textContent = `${shape.n}`;
  } else if (shape.parametric === "checker") {
    state.points = checkerPolygon(shape.n);
    state.fillRule = "evenodd";
    cells.value = shape.n;
    cellsLabel.textContent = `${shape.n}`;
  } else {
    state.points = clonePoints(shape.points);
    state.fillRule = null;
  }
  state.activeShape = shape.key;
  syncShapeButtons();
  renderHandles();
  applyClip();
});
function syncShapeButtons() {
  shapeGrid.querySelectorAll(".shape-btn").forEach((b) => {
    b.classList.toggle("active", b.dataset.shape === state.activeShape);
  });
  updateSliders();
}

// ===== スライダー（circle / ellipse / inset） =====
function bindSlider(id, apply) {
  const el = document.getElementById(id);
  if (!el) return;
  const label = document.querySelector(`[data-val="${id}"]`);
  const update = () => {
    apply(Number(el.value));
    if (label) label.textContent = `${el.value}%`;
    applyClip();
  };
  el.addEventListener("input", update);
  if (label) label.textContent = `${el.value}%`;
}
bindSlider("circle-r", (v) => (state.circle.r = v));
bindSlider("circle-cx", (v) => (state.circle.cx = v));
bindSlider("circle-cy", (v) => (state.circle.cy = v));
bindSlider("ellipse-rx", (v) => (state.ellipse.rx = v));
bindSlider("ellipse-ry", (v) => (state.ellipse.ry = v));
bindSlider("ellipse-cx", (v) => (state.ellipse.cx = v));
bindSlider("ellipse-cy", (v) => (state.ellipse.cy = v));
bindSlider("inset-top", (v) => (state.inset.top = v));
bindSlider("inset-right", (v) => (state.inset.right = v));
bindSlider("inset-bottom", (v) => (state.inset.bottom = v));
bindSlider("inset-left", (v) => (state.inset.left = v));
bindSlider("inset-round", (v) => (state.inset.round = v));

// ===== プレビューの縦横比切替 =====
const aspectBar = document.getElementById("aspect-bar");
aspectBar.addEventListener("click", (e) => {
  const btn = e.target.closest(".mini-btn");
  if (!btn) return;
  wrap.style.aspectRatio = btn.dataset.aspect;
  [...aspectBar.children].forEach((b) => b.classList.toggle("active", b === btn));
});

// ===== 正多角形スライダー（3〜12角） =====
const ngon = document.getElementById("ngon");
const ngonLabel = document.querySelector('[data-val="ngon"]');
function regularPolygon(n) {
  const pts = [];
  for (let i = 0; i < n; i++) {
    const a = ((-90 + (360 / n) * i) * Math.PI) / 180;
    pts.push([clamp(50 + 50 * Math.cos(a)), clamp(50 + 50 * Math.sin(a))]);
  }
  return pts;
}
ngon.addEventListener("input", () => {
  const n = Number(ngon.value);
  ngonLabel.textContent = `${n}角`;
  state.points = regularPolygon(n);
  state.activeShape = null;
  state.fillRule = null;
  syncShapeButtons();
  renderHandles();
  applyClip();
});
ngonLabel.textContent = `${ngon.value}角`;

// ===== バーストのトゲ数スライダー（5〜20） =====
const spikes = document.getElementById("spikes");
const spikesLabel = document.querySelector('[data-val="spikes"]');
function burstPolygon(n, outer = 50, inner = 38) {
  const pts = [];
  for (let i = 0; i < n * 2; i++) {
    const r = i % 2 === 0 ? outer : inner;
    const a = ((-90 + (180 / n) * i) * Math.PI) / 180;
    pts.push([clamp(50 + r * Math.cos(a)), clamp(50 + r * Math.sin(a))]);
  }
  return pts;
}
spikes.addEventListener("input", () => {
  const n = Number(spikes.value);
  spikesLabel.textContent = `${n}`;
  state.points = burstPolygon(n);
  state.activeShape = "burst";
  state.fillRule = null;
  syncShapeButtons();
  renderHandles();
  applyClip();
});
spikesLabel.textContent = `${spikes.value}`;

// ===== ストライプ／市松（蛇行パスの裏ワザで点数を可変生成） =====
function stripePolygon(n, vertical) {
  // n本のストライプ（等間隔・nonzero）。横は左辺、縦は上辺のブリッジで1本のパスに繋ぐ
  const s = 100 / (2 * n);
  const p = [];
  for (let i = 0; i < n; i++) {
    const a = 2 * i * s;
    const b = a + s;
    if (!vertical) p.push([0, a], [100, a], [100, b], [0, b]);
    else p.push([a, 0], [a, 100], [b, 100], [b, 0]);
  }
  return p;
}
function comb(n, vertical) {
  // 偶数番のバンドだけ塗る櫛状パス（横 or 縦）
  const c = 100 / n;
  const p = [];
  for (let i = 0; i < n; i += 2) {
    const a = i * c;
    const b = Math.min((i + 1) * c, 100);
    if (!vertical) p.push([0, a], [100, a], [100, b], [0, b]);
    else p.push([a, 0], [a, 100], [b, 100], [b, 0]);
  }
  return p;
}
function checkerPolygon(n) {
  // 横櫛＋縦櫛を連結し even-odd で重なりを抜く＝市松
  return comb(n, false).concat(comb(n, true));
}
const stripes = document.getElementById("stripes");
const stripesLabel = document.querySelector('[data-val="stripes"]');
stripes.addEventListener("input", () => {
  const n = Number(stripes.value);
  stripesLabel.textContent = `${n}`;
  state.points = stripePolygon(n, state.stripeVertical);
  state.fillRule = null;
  state.activeShape = state.stripeVertical ? "stripe-v" : "stripe";
  syncShapeButtons();
  renderHandles();
  applyClip();
});
stripesLabel.textContent = `${stripes.value}`;

const cells = document.getElementById("cells");
const cellsLabel = document.querySelector('[data-val="cells"]');
cells.addEventListener("input", () => {
  const n = Number(cells.value);
  cellsLabel.textContent = `${n}`;
  state.points = checkerPolygon(n);
  state.fillRule = "evenodd";
  state.activeShape = "checkerboard";
  syncShapeButtons();
  renderHandles();
  applyClip();
});
cellsLabel.textContent = `${cells.value}`;

// ===== スライダーは該当する形のものだけ表示 =====
const sliderRows = {
  ngon: document.getElementById("ngon-row"),
  spikes: document.getElementById("spikes-row"),
  stripes: document.getElementById("stripes-row"),
  cells: document.getElementById("cells-row"),
};
function updateSliders() {
  const a = state.activeShape;
  const mode =
    a === "burst" ? "spikes" : a === "stripe" || a === "stripe-v" ? "stripes" : a === "checkerboard" ? "cells" : "ngon";
  Object.entries(sliderRows).forEach(([key, row]) => {
    if (row) row.classList.toggle("hidden", key !== mode);
  });
}

// ===== 反転 =====
// circle/ellipse/inset の state 値をスライダーUIへ反映
function syncSliders() {
  const map = {
    "circle-r": state.circle.r,
    "circle-cx": state.circle.cx,
    "circle-cy": state.circle.cy,
    "ellipse-rx": state.ellipse.rx,
    "ellipse-ry": state.ellipse.ry,
    "ellipse-cx": state.ellipse.cx,
    "ellipse-cy": state.ellipse.cy,
    "inset-top": state.inset.top,
    "inset-right": state.inset.right,
    "inset-bottom": state.inset.bottom,
    "inset-left": state.inset.left,
    "inset-round": state.inset.round,
  };
  Object.entries(map).forEach(([id, val]) => {
    const el = document.getElementById(id);
    if (el) el.value = val;
    const label = document.querySelector(`[data-val="${id}"]`);
    if (label) label.textContent = `${round(val)}%`;
  });
}
function flip(horizontal) {
  if (state.type === "polygon") {
    state.points = state.points.map(([x, y]) => (horizontal ? [100 - x, y] : [x, 100 - y]));
    state.activeShape = null;
    syncShapeButtons();
    renderHandles();
  } else if (state.type === "circle") {
    if (horizontal) state.circle.cx = 100 - state.circle.cx;
    else state.circle.cy = 100 - state.circle.cy;
    syncSliders();
  } else if (state.type === "ellipse") {
    if (horizontal) state.ellipse.cx = 100 - state.ellipse.cx;
    else state.ellipse.cy = 100 - state.ellipse.cy;
    syncSliders();
  } else if (state.type === "inset") {
    if (horizontal) {
      [state.inset.left, state.inset.right] = [state.inset.right, state.inset.left];
    } else {
      [state.inset.top, state.inset.bottom] = [state.inset.bottom, state.inset.top];
    }
    syncSliders();
  }
  applyClip();
}
document.getElementById("flip-h").addEventListener("click", () => flip(true));
document.getElementById("flip-v").addEventListener("click", () => flip(false));

// ===== 出力オプション =====
document.getElementById("animate").addEventListener("change", (e) => {
  state.animate = e.target.checked;
  applyClip();
});

// ===== プレビュー操作（背景） =====
document.getElementById("bg-upload").addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const url = URL.createObjectURL(file);
  clipBox.style.setProperty("--clip-image", `url("${url}")`);
  clipBox.classList.add("show-image");
});
document.getElementById("bg-reset").addEventListener("click", () => {
  clipBox.classList.remove("show-image");
});

// ===== コピー =====
const copyBtn = document.getElementById("copy-btn");
copyBtn.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(output.value);
  } catch {
    output.select();
    document.execCommand("copy");
  }
  const span = copyBtn.querySelector("span");
  const original = span.textContent;
  copyBtn.classList.add("copied");
  span.textContent = "コピーしました";
  setTimeout(() => {
    copyBtn.classList.remove("copied");
    span.textContent = original;
  }, 1600);
});

// ===== 初期化 =====
syncShapeButtons();
renderHandles();
applyClip();
