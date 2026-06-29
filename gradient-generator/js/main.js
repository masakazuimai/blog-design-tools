import { t, LANG } from "./i18n.js?v=20260629c";
import { gradientValue, buildCss, buildTailwind, paintGradient, sortedStops } from "./gradient.js?v=20260629a";
import { ALL_PRESETS } from "./presets.js?v=20260629o";
import { buildSwatchPanel } from "./swatch.js?v=20260629b";

// ===== 状態（編集中グラデーション） =====
let uid = 0;
const newId = () => `s${++uid}`;

const DEFAULT_STOPS = [
  { color: "#b7282e", pos: 0 },
  { color: "#f6d8a8", pos: 100 },
];

const state = {
  type: "linear",
  angle: 135,
  radialShape: "circle",
  stops: [],
  selectedId: null,
};

let format = "css";

// ===== DOM =====
const $ = (id) => document.getElementById(id);
const grid = $("grid");
const countEl = $("count");
const searchEl = $("search");
const modal = $("modal");
const previewBox = $("preview-box");
const bar = $("gradient-bar");
const barFill = $("bar-fill");
const angleRow = $("angle-row");
const angleLabel = $("angle-label");
const angleInput = $("angle");
const angleVal = $("angle-val");
const radialRow = $("radial-row");
const stopColor = $("stop-color");
const stopHex = $("stop-hex");
const stopPos = $("stop-pos");
const delStop = $("del-stop");
const swatchToggle = $("swatch-toggle");
const swatchPanel = $("swatch-panel");
const output = $("output");
const toastEl = $("toast");

const ANGLE_LABEL = {
  ja: { linear: "角度", conic: "開始角度" },
  en: { linear: "Angle", conic: "Start angle" },
};
const TYPE_LABEL = { linear: t.typeLinear, radial: t.typeRadial, conic: t.typeConic };

// 色相チップ（color-dictionary と同じキー・ドット色）
const HUE_GROUPS = [
  { key: "all", labelJa: "すべて", labelEn: "All", dot: "" },
  { key: "red", labelJa: "赤", labelEn: "Red", dot: "#c0392b" },
  { key: "orange", labelJa: "橙", labelEn: "Orange", dot: "#e07b39" },
  { key: "yellow", labelJa: "黄", labelEn: "Yellow", dot: "#e6b422" },
  { key: "green", labelJa: "緑", labelEn: "Green", dot: "#4a8b53" },
  { key: "blue", labelJa: "青", labelEn: "Blue", dot: "#2a6f97" },
  { key: "purple", labelJa: "紫", labelEn: "Purple", dot: "#7d5ba6" },
  { key: "pink", labelJa: "桃", labelEn: "Pink", dot: "#d4849b" },
  { key: "brown", labelJa: "茶", labelEn: "Brown", dot: "#8a5a3c" },
  { key: "neutral", labelJa: "白黒灰", labelEn: "Neutral", dot: "#9c9488" },
];
let curCat = "all";

// ===== 色ユーティリティ（ストップ追加時の補間用） =====
function hexToRgb(hex) {
  const h = hex.replace("#", "");
  const f = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  return [parseInt(f.slice(0, 2), 16), parseInt(f.slice(2, 4), 16), parseInt(f.slice(4, 6), 16)];
}
function rgbToHex(r, g, b) {
  const c = (n) => Math.round(n).toString(16).padStart(2, "0");
  return `#${c(r)}${c(g)}${c(b)}`;
}
function colorAt(pos) {
  const s = sortedStops(state.stops);
  if (pos <= s[0].pos) return s[0].color;
  if (pos >= s[s.length - 1].pos) return s[s.length - 1].color;
  for (let i = 0; i < s.length - 1; i++) {
    if (pos >= s[i].pos && pos <= s[i + 1].pos) {
      const span = s[i + 1].pos - s[i].pos || 1;
      const ratio = (pos - s[i].pos) / span;
      const a = hexToRgb(s[i].color);
      const b = hexToRgb(s[i + 1].color);
      return rgbToHex(a[0] + (b[0] - a[0]) * ratio, a[1] + (b[1] - a[1]) * ratio, a[2] + (b[2] - a[2]) * ratio);
    }
  }
  return s[0].color;
}
const isHex = (v) => /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(v);
const expandHex = (hex) =>
  hex.length === 4 ? `#${hex.slice(1).split("").map((c) => c + c).join("")}` : hex;

// ===== 一覧（ギャラリー） =====
function presetGradient(p) {
  return gradientValue({
    type: p.type || "linear",
    angle: p.angle ?? 135,
    radialShape: p.radialShape || "circle",
    stops: p.stops,
  });
}

function buildGrid() {
  const frag = document.createDocumentFragment();

  // 新規作成カード
  const nw = document.createElement("button");
  nw.type = "button";
  nw.className = "chip new";
  nw.dataset.new = "1";
  nw.innerHTML = `<span class="plus">＋</span><span class="new-name">${t.newCreate}</span><span class="new-desc">${t.newDesc}</span>`;
  nw.addEventListener("click", () => openEditor(null));
  frag.appendChild(nw);

  for (const p of ALL_PRESETS) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "chip";
    btn.dataset.id = p.id;
    btn.dataset.cat = p.cat;
    btn.dataset.search = `${p.name} ${p.reading || ""} ${p.name_en}`.toLowerCase();

    const sw = document.createElement("span");
    sw.className = "swatch";
    sw.style.background = presetGradient(p);

    const meta = document.createElement("span");
    meta.className = "meta";
    const typeKey = p.type || "linear";
    const angleTxt = typeKey === "radial" ? "" : ` ${p.angle ?? 135}°`;
    meta.innerHTML =
      `<span class="name">${LANG === "en" ? p.name_en : p.name}</span>` +
      (LANG !== "en" && p.reading ? `<span class="reading">${p.reading}</span>` : "") +
      `<span class="type">${TYPE_LABEL[typeKey]}${angleTxt}</span>`;

    btn.append(sw, meta);
    btn.addEventListener("click", () => openEditor(p));
    frag.appendChild(btn);
  }

  grid.replaceChildren(frag);
  applyFilter();
}

function applyFilter() {
  const q = searchEl.value.trim().toLowerCase();
  let shown = 0;
  grid.querySelectorAll(".chip").forEach((chip) => {
    if (chip.dataset.new) return; // 新規カードは常に表示
    const okCat = curCat === "all" || chip.dataset.cat === curCat;
    const okQ = !q || chip.dataset.search.includes(q);
    const visible = okCat && okQ;
    chip.classList.toggle("hidden", !visible);
    if (visible) shown++;
  });
  countEl.innerHTML = `<b>${shown}</b>${t.countSuffix}`;
}

// 色相チップの描画と絞り込み
function renderHueChips() {
  const box = $("hue-chips");
  box.innerHTML = HUE_GROUPS.map((g) => {
    const label = g.key === "all" ? t.catAll : LANG === "en" ? g.labelEn : g.labelJa;
    const dot = g.dot ? `<span class="dot" style="background:${g.dot}"></span>` : "";
    return `<button type="button" class="hue-chip${g.key === curCat ? " active" : ""}" data-cat="${g.key}">${dot}${label}</button>`;
  }).join("");
}
$("hue-chips").addEventListener("click", (e) => {
  const b = e.target.closest(".hue-chip");
  if (!b) return;
  curCat = b.dataset.cat;
  $("hue-chips").querySelectorAll(".hue-chip").forEach((x) => x.classList.toggle("active", x.dataset.cat === curCat));
  applyFilter();
});

// ===== モーダルを開く／閉じる =====
function openEditor(preset) {
  if (preset) {
    state.type = preset.type || "linear";
    state.angle = preset.angle ?? 135;
    state.radialShape = preset.radialShape || "circle";
    state.stops = preset.stops.map((s) => ({ id: newId(), color: s.color, pos: s.pos }));
  } else {
    state.type = "linear";
    state.angle = 135;
    state.radialShape = "circle";
    state.stops = DEFAULT_STOPS.map((s) => ({ id: newId(), color: s.color, pos: s.pos }));
  }
  state.selectedId = state.stops[0].id;
  format = "css";
  renderEditor();
  modal.classList.add("open");
}
function closeEditor() {
  modal.classList.remove("open");
}
modal.addEventListener("click", (e) => {
  if (e.target === modal) closeEditor();
});
$("editor-close").addEventListener("click", closeEditor);
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && modal.classList.contains("open")) closeEditor();
});

// ===== エディタのレンダリング =====
function selected() {
  return state.stops.find((s) => s.id === state.selectedId) || state.stops[0];
}
function renderPreview() {
  previewBox.style.background = gradientValue(state);
}
function renderBar() {
  barFill.style.background = `linear-gradient(90deg, ${sortedStops(state.stops)
    .map((s) => `${s.color} ${Math.round(s.pos)}%`)
    .join(", ")})`;
  bar.querySelectorAll(".stop-handle").forEach((h) => h.remove());
  for (const s of state.stops) {
    const h = document.createElement("button");
    h.type = "button";
    h.className = "stop-handle" + (s.id === state.selectedId ? " active" : "");
    h.style.left = `${s.pos}%`;
    h.style.setProperty("--handle-color", s.color);
    h.dataset.id = s.id;
    h.setAttribute("aria-label", `stop ${Math.round(s.pos)}%`);
    bar.appendChild(h);
  }
}
function renderControls() {
  document.querySelectorAll("#type-seg button").forEach((b) =>
    b.classList.toggle("active", b.dataset.type === state.type)
  );
  const showAngle = state.type === "linear" || state.type === "conic";
  angleRow.classList.toggle("hidden", !showAngle);
  radialRow.classList.toggle("hidden", state.type !== "radial");
  if (showAngle) {
    angleLabel.textContent = ANGLE_LABEL[LANG][state.type === "conic" ? "conic" : "linear"];
    angleInput.value = state.angle;
    angleVal.textContent = `${state.angle}°`;
  }
  document.querySelectorAll("#radial-shape button").forEach((b) =>
    b.classList.toggle("active", b.dataset.shape === state.radialShape)
  );

  const sel = selected();
  stopColor.value = expandHex(sel.color);
  stopHex.value = sel.color.toUpperCase();
  stopPos.value = Math.round(sel.pos);
  delStop.disabled = state.stops.length <= 2;
}
function renderOutput() {
  output.value = format === "tailwind" ? buildTailwind(state) : buildCss(state);
  document.querySelectorAll("#format-seg button").forEach((b) =>
    b.classList.toggle("active", b.dataset.fmt === format)
  );
}
function renderEditor() {
  renderPreview();
  renderBar();
  renderControls();
  renderOutput();
}

// ===== トースト =====
let toastTimer = null;
function toast(msg) {
  toastEl.textContent = msg;
  toastEl.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.remove("show"), 1800);
}

// ===== エディタのイベント（初期化時に1度だけ束ねる） =====
$("type-seg").addEventListener("click", (e) => {
  const b = e.target.closest("button");
  if (!b) return;
  state.type = b.dataset.type;
  renderEditor();
});
$("radial-shape").addEventListener("click", (e) => {
  const b = e.target.closest("button");
  if (!b) return;
  state.radialShape = b.dataset.shape;
  renderPreview();
  renderControls();
  renderOutput();
});
angleInput.addEventListener("input", () => {
  state.angle = parseInt(angleInput.value, 10);
  angleVal.textContent = `${state.angle}°`;
  renderPreview();
  renderOutput();
});

function updateSelectedColor(hex) {
  selected().color = hex;
  renderEditor();
}
stopColor.addEventListener("input", () => updateSelectedColor(stopColor.value));
stopHex.addEventListener("change", () => {
  let v = stopHex.value.trim();
  if (!v.startsWith("#")) v = "#" + v;
  if (isHex(v)) updateSelectedColor(v.toLowerCase());
  else stopHex.value = selected().color.toUpperCase();
});
stopPos.addEventListener("input", () => {
  let p = parseInt(stopPos.value, 10);
  if (Number.isNaN(p)) return;
  selected().pos = Math.min(100, Math.max(0, p));
  renderPreview();
  renderBar();
  renderOutput();
});
delStop.addEventListener("click", () => {
  if (state.stops.length <= 2) return;
  state.stops = state.stops.filter((s) => s.id !== state.selectedId);
  state.selectedId = state.stops[0].id;
  renderEditor();
});

// グラデーションバー
function posFromEvent(clientX) {
  const r = bar.getBoundingClientRect();
  return Math.min(100, Math.max(0, ((clientX - r.left) / r.width) * 100));
}
bar.addEventListener("click", (e) => {
  if (e.target.closest(".stop-handle")) return;
  const pos = posFromEvent(e.clientX);
  const stop = { id: newId(), color: colorAt(pos), pos };
  state.stops.push(stop);
  state.selectedId = stop.id;
  renderEditor();
});
let dragId = null;
bar.addEventListener("pointerdown", (e) => {
  const h = e.target.closest(".stop-handle");
  if (!h) return;
  dragId = h.dataset.id;
  state.selectedId = dragId;
  h.setPointerCapture(e.pointerId);
  renderBar();
  renderControls();
});
bar.addEventListener("pointermove", (e) => {
  if (!dragId) return;
  const stop = state.stops.find((s) => s.id === dragId);
  if (!stop) return;
  stop.pos = Math.round(posFromEvent(e.clientX));
  renderPreview();
  renderBar();
  renderControls();
  renderOutput();
});
bar.addEventListener("pointerup", () => (dragId = null));
bar.addEventListener("dblclick", (e) => {
  const h = e.target.closest(".stop-handle");
  if (!h || state.stops.length <= 2) return;
  state.stops = state.stops.filter((s) => s.id !== h.dataset.id);
  state.selectedId = state.stops[0].id;
  renderEditor();
});

// 色の辞書スウォッチ
let swatchBuilt = false;
swatchToggle.addEventListener("click", async () => {
  const nowHidden = swatchPanel.classList.toggle("hidden");
  if (!nowHidden && !swatchBuilt) {
    swatchBuilt = true;
    await buildSwatchPanel(swatchPanel, (hex) => updateSelectedColor(hex));
  }
});

// 出力フォーマット
$("format-seg").addEventListener("click", (e) => {
  const b = e.target.closest("button");
  if (!b) return;
  format = b.dataset.fmt;
  renderOutput();
});

// コピー
$("copy-btn").addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(output.value);
  } catch {
    output.select();
    document.execCommand("copy");
  }
  toast(t.copyDone);
});

// PNG書き出し
$("png-btn").addEventListener("click", () => {
  const w = 1600;
  const h = 1000;
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  paintGradient(ctx, w, h, state);
  canvas.toBlob((blob) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "gradient.png";
    a.click();
    URL.revokeObjectURL(url);
    toast(t.pngSaved);
  }, "image/png");
});

// ===== 一覧の絞り込み（検索） =====
searchEl.addEventListener("input", applyFilter);

// ===== 初期化 =====
renderHueChips();
buildGrid();
