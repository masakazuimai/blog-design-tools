import { BASIC } from "./effects/basic.js?v=20261113b";
import { MIDDLE } from "./effects/middle.js?v=20261113b";
import { ADVANCED } from "./effects/advanced.js?v=20261113b";
import { BASIC_2 } from "./effects/basic-2.js?v=20261113b";
import { MIDDLE_2 } from "./effects/middle-2.js?v=20261113b";
import { MIDDLE_3 } from "./effects/middle-3.js?v=20261113b";
import { ADVANCED_2 } from "./effects/advanced-2.js?v=20261113b";
import { ADVANCED_3 } from "./effects/advanced-3.js?v=20261113b";
import { PRO } from "./effects/pro.js?v=20261113b";
import { PRO_2 } from "./effects/pro-2.js?v=20261113b";
import { PRO_WEBGL } from "./effects/webgl.js?v=20261113b";
import { GSAP_CDN, finish } from "./effects/_shared.js?v=20261113b";
import { stageDoc } from "./stage.js?v=20261113b";
import { UI } from "./i18n.js?v=20261113a";
import { EN } from "./i18n-en.js?v=20261113a";

const LANG = document.documentElement.lang === "en" ? "en" : "ja";
const T = UI[LANG];
const ROOT = new URL("../", import.meta.url).href;

const localize = (list) =>
  LANG === "en"
    ? list.map((fx) => (EN[fx.id] ? { ...fx, aka: `${fx.label} ${fx.aka || ""}`, label: EN[fx.id][0], desc: EN[fx.id][1] } : fx))
    : list;

const GROUPS = {
  basic: [...BASIC, ...BASIC_2],
  middle: [...MIDDLE, ...MIDDLE_2, ...MIDDLE_3],
  advanced: [...ADVANCED, ...ADVANCED_2, ...ADVANCED_3],
  pro: PRO_WEBGL,
  chara: [...PRO, ...PRO_2],
};

const TIERS = Object.entries(GROUPS).map(([id, items]) => ({
  id,
  label: T.tiers[id][0],
  note: T.tiers[id][1],
  items: localize(items),
}));

const ALL = TIERS.flatMap((t) => t.items.map((fx) => ({ ...fx, tier: t.id })));
const BASE = { color: "#6366f1", size: 24, lag: 60, hide: false, text: "VIEW", emoji: "🐾", brush: "ink" };
const SIZE_RANGE = [8, 120];

const $ = (id) => document.getElementById(id);
const els = {
  tabs: $("tierTabs"),
  note: $("tierNote"),
  list: $("fxList"),
  search: $("fxSearch"),
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
  brush: $("optBrush"),
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

function itemButton(fx, tierLabel) {
  const badge = tierLabel ? `<small>${tierLabel}</small>` : "";
  return `<button type="button" class="fx-item" data-fx="${fx.id}" aria-pressed="${fx.id === state.fx.id}">${fx.label}${badge}</button>`;
}

function renderList() {
  const q = els.search.value.trim().toLowerCase();
  if (q) {
    const hits = ALL.filter((fx) => `${fx.label} ${fx.aka || ""} ${fx.desc} ${fx.id}`.toLowerCase().includes(q));
    els.note.textContent = hits.length ? T.hits(els.search.value.trim(), hits.length) : T.noHits;
    els.list.innerHTML = hits.map((fx) => itemButton(fx, TIERS.find((t) => t.id === fx.tier).label)).join("");
    return;
  }
  const tier = TIERS.find((t) => t.id === state.fx.tier);
  els.note.textContent = tier.note;
  els.list.innerHTML = tier.items.map((fx) => itemButton(fx)).join("");
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
  els.brush.value = opts.brush;
  document.querySelectorAll("[data-use]").forEach((f) => {
    f.hidden = !fx.uses.includes(f.dataset.use);
  });
  els.fxName.textContent = fx.label;
  els.fxDesc.textContent = fx.desc;
  const files = assetFiles(fx);
  els.download.hidden = !files.length;
  els.download.textContent = T.download(files.length);
}

function assetFiles(fx) {
  if (typeof fx.files === "function") return fx.files(state.opts);
  return fx.files || (fx.sprite ? [fx.sprite] : []);
}

function downloadAssets() {
  assetFiles(state.fx).forEach((file, i) => {
    setTimeout(() => {
      const a = document.createElement("a");
      a.href = `${ROOT}images/${file}`;
      a.download = file;
      document.body.appendChild(a);
      a.click();
      setTimeout(() => a.remove(), 1000);
    }, i * 400);
  });
}

function lagLabel(v) {
  return T.lag[v < 20 ? 0 : v < 50 ? 1 : v < 80 ? 2 : 3];
}

function currentCode() {
  const code = state.fx.build(state.opts);
  return { ...code, js: finish(code.js) };
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

function renderCode(code) {
  els.code.textContent = codeText(code);
  const files = assetFiles(state.fx);
  els.pasteNote.textContent = T.paste[state.codeTab] + (files.length ? T.assets(files) : "");
  els.codeTabs.querySelectorAll("button").forEach((b) => {
    b.setAttribute("aria-selected", String(b.dataset.tab === state.codeTab));
  });
}

let frameTimer = 0;
function renderStage(code) {
  clearTimeout(frameTimer);
  frameTimer = setTimeout(() => {
    els.frame.srcdoc = stageDoc(code, state.theme, !!state.fx.gsap, LANG, ROOT);
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
    els.search.value = "";
    selectFx({ ...tier.items[0], tier: tier.id });
  });
  els.search.addEventListener("input", renderList);
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
  els.brush.addEventListener("change", () => setOpt("brush", els.brush.value));
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
  els.download.addEventListener("click", (e) => {
    e.preventDefault();
    downloadAssets();
  });
  els.copy.addEventListener("click", async () => {
    await copyText(els.code.textContent);
    showToast(T.copied);
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
