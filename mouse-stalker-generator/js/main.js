import { BASIC } from "./effects/basic.js?v=20261112a";
import { MIDDLE } from "./effects/middle.js?v=20261112a";
import { ADVANCED } from "./effects/advanced.js?v=20261112a";
import { PRO } from "./effects/pro.js?v=20261112a";
import { GSAP_CDN } from "./effects/_shared.js?v=20261112a";
import { stageDoc } from "./stage.js?v=20261112a";

const TIERS = [
  { id: "basic", label: "初級", note: "CSS と数行の JavaScript。貼るだけで動きます。", items: BASIC },
  { id: "middle", label: "中級", note: "素の JavaScript で粒や形を動かします。ライブラリは要りません。", items: MIDDLE },
  { id: "advanced", label: "上級", note: "GSAP を使います。読み込みの1行もコードに入っています。", items: ADVANCED },
  {
    id: "pro",
    label: "プロ",
    note: "Blender で描いた立体の画像を、動きに合わせて切り替えます。画像をダウンロードして images フォルダに置いてください。",
    items: PRO,
  },
];

const ALL = TIERS.flatMap((t) => t.items.map((fx) => ({ ...fx, tier: t.id })));
const BASE = { color: "#6366f1", size: 24, lag: 60, hide: false, text: "VIEW", emoji: "🐾" };
const SIZE_RANGE = [8, 120];

const $ = (id) => document.getElementById(id);
const els = {
  tabs: $("tierTabs"),
  note: $("tierNote"),
  list: $("fxList"),
  frame: $("stageFrame"),
  themes: $("themes"),
  fxName: $("fxName"),
  fxDesc: $("fxDesc"),
  color: $("optColor"),
  colorVal: $("optColorVal"),
  size: $("optSize"),
  sizeVal: $("optSizeVal"),
  lag: $("optLag"),
  lagVal: $("optLagVal"),
  hide: $("optHide"),
  text: $("optText"),
  emoji: $("optEmoji"),
  reset: $("resetOpts"),
  codeTabs: $("codeTabs"),
  code: $("codeOut"),
  copy: $("copyCode"),
  download: $("downloadSprite"),
  pasteNote: $("pasteNote"),
  toast: $("toast"),
};

const state = { fx: ALL[0], opts: { ...BASE, ...ALL[0].defaults }, theme: "light", codeTab: "all" };

function fromHash() {
  const id = new URLSearchParams(location.hash.slice(1)).get("fx");
  return ALL.find((f) => f.id === id);
}

function optsFor(fx, keepColor) {
  const color = fx.defaults.color || keepColor || BASE.color;
  return { ...BASE, ...fx.defaults, color, text: state.opts.text, emoji: state.opts.emoji };
}

function renderTabs() {
  els.tabs.innerHTML = TIERS.map(
    (t) =>
      `<button type="button" role="tab" class="tier-tab" data-tier="${t.id}" aria-selected="${t.id === state.fx.tier}">${t.label}<span>${t.items.length}</span></button>`
  ).join("");
}

function renderList() {
  const tier = TIERS.find((t) => t.id === state.fx.tier);
  els.note.textContent = tier.note;
  els.list.innerHTML = tier.items
    .map(
      (fx) =>
        `<button type="button" class="fx-item" data-fx="${fx.id}" aria-pressed="${fx.id === state.fx.id}">${fx.label}</button>`
    )
    .join("");
}

function renderControls() {
  const { fx, opts } = state;
  const [min, max] = (fx.range && fx.range.size) || SIZE_RANGE;
  els.size.min = min;
  els.size.max = max;
  els.color.value = opts.color;
  els.colorVal.textContent = opts.color;
  els.size.value = opts.size;
  els.sizeVal.textContent = `${opts.size}px`;
  els.lag.value = opts.lag;
  els.lagVal.textContent = lagLabel(opts.lag);
  els.hide.checked = !!opts.hide;
  els.text.value = opts.text;
  els.emoji.value = opts.emoji;
  document.querySelectorAll("[data-use]").forEach((f) => {
    f.hidden = !fx.uses.includes(f.dataset.use);
  });
  els.fxName.textContent = fx.label;
  els.fxDesc.textContent = fx.desc;
  els.download.hidden = !fx.sprite;
  if (fx.sprite) {
    els.download.href = `images/${fx.sprite}`;
    els.download.setAttribute("download", fx.sprite);
  }
}

function lagLabel(v) {
  if (v < 20) return "ほぼなし";
  if (v < 50) return "少し";
  if (v < 80) return "ふつう";
  return "ゆったり";
}

function currentCode() {
  return state.fx.build(state.opts);
}

function bundle(code) {
  const parts = [`<style>\n${code.css.trim()}\n</style>`, code.html];
  if (state.fx.gsap) parts.push(GSAP_CDN);
  parts.push(`<script>\n${code.js}\n</script>`);
  return parts.join("\n\n");
}

function codeText(code) {
  if (state.codeTab === "html") return state.fx.gsap ? `${code.html}\n\n${GSAP_CDN}` : code.html;
  if (state.codeTab === "css") return code.css.trim();
  if (state.codeTab === "js") return code.js;
  return bundle(code);
}

const PASTE_NOTES = {
  all: "まとめて </body> の直前に貼れば動きます。",
  html: "</body> の直前に貼ります。",
  css: "サイトの CSS ファイルの最後に足します。",
  js: "HTML の後ろの <script> の中か、JS ファイルに足します。",
};

function renderCode(code) {
  els.code.textContent = codeText(code);
  els.pasteNote.textContent =
    PASTE_NOTES[state.codeTab] + (state.fx.sprite ? " 画像は、貼ったページから見て images フォルダの中に置きます。" : "");
  els.codeTabs.querySelectorAll("button").forEach((b) => {
    b.setAttribute("aria-selected", String(b.dataset.tab === state.codeTab));
  });
}

let frameTimer = 0;
function renderStage(code) {
  clearTimeout(frameTimer);
  frameTimer = setTimeout(() => {
    els.frame.srcdoc = stageDoc(code, state.theme, !!state.fx.gsap);
  }, 120);
}

function render() {
  const code = currentCode();
  renderCode(code);
  renderStage(code);
}

function selectFx(fx) {
  state.fx = fx;
  state.opts = optsFor(fx, state.opts.color);
  history.replaceState(null, "", `#fx=${fx.id}`);
  renderTabs();
  renderList();
  renderControls();
  render();
}

function setOpt(key, value) {
  state.opts = { ...state.opts, [key]: value };
  renderControls();
  render();
}

function showToast(msg) {
  els.toast.textContent = msg;
  els.toast.classList.add("is-visible");
  clearTimeout(showToast.t);
  showToast.t = setTimeout(() => els.toast.classList.remove("is-visible"), 1800);
}

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    ta.remove();
  }
}

function bind() {
  els.tabs.addEventListener("click", (e) => {
    const b = e.target.closest("[data-tier]");
    if (!b) return;
    const tier = TIERS.find((t) => t.id === b.dataset.tier);
    selectFx({ ...tier.items[0], tier: tier.id });
  });
  els.list.addEventListener("click", (e) => {
    const b = e.target.closest("[data-fx]");
    if (b) selectFx(ALL.find((f) => f.id === b.dataset.fx));
  });
  els.themes.addEventListener("click", (e) => {
    const b = e.target.closest("[data-theme]");
    if (!b) return;
    state.theme = b.dataset.theme;
    els.themes.querySelectorAll("button").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
    renderStage(currentCode());
  });
  els.color.addEventListener("input", () => setOpt("color", els.color.value));
  els.size.addEventListener("input", () => setOpt("size", Number(els.size.value)));
  els.lag.addEventListener("input", () => setOpt("lag", Number(els.lag.value)));
  els.hide.addEventListener("change", () => setOpt("hide", els.hide.checked));
  els.text.addEventListener("input", () => setOpt("text", els.text.value.slice(0, 12)));
  els.emoji.addEventListener("input", () => setOpt("emoji", els.emoji.value.slice(0, 8)));
  els.reset.addEventListener("click", () => {
    state.opts = { ...BASE, ...state.fx.defaults };
    renderControls();
    render();
  });
  els.codeTabs.addEventListener("click", (e) => {
    const b = e.target.closest("[data-tab]");
    if (!b) return;
    state.codeTab = b.dataset.tab;
    renderCode(currentCode());
  });
  els.copy.addEventListener("click", async () => {
    await copyText(els.code.textContent);
    showToast("コードをコピーしました");
  });
  addEventListener("hashchange", () => {
    const fx = fromHash();
    if (fx && fx.id !== state.fx.id) selectFx(fx);
  });
}

function init() {
  bind();
  selectFx(fromHash() || ALL[0]);
}

init();
