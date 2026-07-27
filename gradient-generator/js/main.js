import { t, LANG } from "./i18n.js?v=20260629c";
import {
  gradientValue,
  buildCss,
  buildTailwind,
  paintGradient,
  paintGradientText,
  measureTextBox,
  sortedStops,
} from "./gradient.js?v=20260727d";
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
  target: "bg", // "bg" = 背景に適用 / "text" = 文字に適用（background-clip）
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
const previewTextRow = $("preview-text-row");
const previewTextInput = $("preview-text");
const previewTextOut = $("preview-text-out");
const pngBtn = $("png-btn");
const fontRow = $("font-row");
const fontSelect = $("text-font");

// 文字モードで選べるフォント（Google Fonts）。
// href は「コピーしたコードをそのまま動かす」ために出力へ含める。
// 太字の見出し用途なので weight は 700 に固定する。
const FONTS = [
  // preloaded: ページ本体の<link>で既に読み込んでいるため追加読み込みしない
  { id: "noto-serif-jp", family: "Noto Serif JP", stack: '"Noto Serif JP", serif', preloaded: true },
  { id: "noto-sans-jp", family: "Noto Sans JP", stack: '"Noto Sans JP", sans-serif' },
  { id: "shippori-mincho", family: "Shippori Mincho", stack: '"Shippori Mincho", serif' },
  { id: "zen-maru-gothic", family: "Zen Maru Gothic", stack: '"Zen Maru Gothic", sans-serif' },
  { id: "mplus-rounded", family: "M PLUS Rounded 1c", stack: '"M PLUS Rounded 1c", sans-serif' },
  { id: "rocknroll-one", family: "RocknRoll One", stack: '"RocknRoll One", sans-serif' },
  { id: "playfair-display", family: "Playfair Display", stack: '"Playfair Display", serif' },
  { id: "montserrat", family: "Montserrat", stack: '"Montserrat", sans-serif' },
].map((f) => ({
  ...f,
  href: `https://fonts.googleapis.com/css2?family=${f.family.replace(/ /g, "+")}:wght@700&display=swap`,
  tailwind: `font-['${f.family.replace(/ /g, "_")}']`,
}));

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
  state.target = "bg";
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
function previewText() {
  return previewTextInput.value.trim() || previewTextInput.defaultValue;
}
function currentFont() {
  return FONTS.find((f) => f.id === fontSelect.value) || FONTS[0];
}
// 選ばれたフォントだけを後から読み込む（初期表示を重くしないため）
const loadedFonts = new Set();
function ensureFontLoaded(font) {
  if (font.preloaded || loadedFonts.has(font.id)) return;
  loadedFonts.add(font.id);
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = font.href;
  document.head.appendChild(link);
}
function renderPreview() {
  const isText = state.target === "text";
  previewBox.classList.toggle("is-text", isText);
  if (!isText) {
    previewBox.style.background = gradientValue(state);
    return;
  }
  // 文字モードはボックス自体を透明にして、字面だけをグラデーションで塗る
  const font = currentFont();
  ensureFontLoaded(font);
  previewBox.style.background = "none";
  previewTextOut.style.fontFamily = font.stack;
  previewTextOut.textContent = previewText();
  previewTextOut.style.backgroundImage = gradientValue(state);
  previewTextOut.style.webkitBackgroundClip = "text";
  previewTextOut.style.backgroundClip = "text";
  previewTextOut.style.webkitTextFillColor = "transparent";
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
  document.querySelectorAll("#target-seg button").forEach((b) =>
    b.classList.toggle("active", b.dataset.target === state.target)
  );
  previewTextRow.classList.toggle("hidden", state.target !== "text");
  fontRow.classList.toggle("hidden", state.target !== "text");
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
  // 文字モードは当てる要素とフォント読み込みが分からないと動かないため、
  // HTMLもまとめて出す（background-clip は単体のCSS宣言だけでは使えない）
  const ctx = state.target === "text" ? { text: previewText(), font: currentFont() } : {};
  output.value = format === "tailwind" ? buildTailwind(state, ctx) : buildCss(state, ctx);
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
$("target-seg").addEventListener("click", (e) => {
  const b = e.target.closest("button");
  if (!b) return;
  state.target = b.dataset.target;
  renderEditor();
});
previewTextInput.addEventListener("input", () => {
  renderPreview();
  renderOutput(); // 出力HTMLに文言が入るため追従させる
});
fontSelect.addEventListener("change", () => {
  renderPreview();
  renderOutput();
});
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

// PNG書き出し。文字モードは字面だけを塗った透過PNGを出す
const TEXT_PNG_FONT_SIZE = 220;
const TEXT_PNG_PADDING = 40;

pngBtn.addEventListener("click", async () => {
  const isText = state.target === "text";
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  let w = 1600;
  let h = 1000;
  let filename = "gradient.png";

  if (isText) {
    const font = `700 ${TEXT_PNG_FONT_SIZE}px ${currentFont().stack}`;
    // Webフォントの読み込み前に描くと代替フォントで焼き込まれるため待つ
    try {
      await document.fonts.load(font, previewText());
    } catch {
      /* 読めなくても代替フォントで書き出しは続行する */
    }
    // 実測にも同じctxを使う（fontを跨いで測ると寸法がずれるため）
    const box = measureTextBox(ctx, previewText(), font, TEXT_PNG_PADDING);
    w = box.width;
    h = box.height;
    canvas.width = w;
    canvas.height = h;
    paintGradientText(ctx, w, h, state, previewText(), font);
    filename = "gradient-text.png";
  } else {
    canvas.width = w;
    canvas.height = h;
    paintGradient(ctx, w, h, state);
  }

  canvas.toBlob((blob) => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.rel = "noopener";
    // 一部ブラウザはDOMに無いアンカーのclickを無視するため追加してから発火
    document.body.appendChild(a);
    a.click();
    // clickが処理される前にURLを破棄するとDLがキャンセルされるため遅延解放
    setTimeout(() => {
      a.remove();
      URL.revokeObjectURL(url);
    }, 1000);
    toast(t.pngSaved);
  }, "image/png");
});

// ===== 一覧の絞り込み（検索） =====
searchEl.addEventListener("input", applyFilter);

// ===== 初期化 =====
renderHueChips();
buildGrid();
