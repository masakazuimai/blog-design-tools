"use strict";

import { t, lang, TEXT_EN } from "./i18n.js?v=20260725b";
import { ICON_EFFECTS, ICON_CATEGORIES } from "./icons/index.js?v=20260725b";
import { PANEL_EFFECTS, PANEL_CATEGORIES } from "./panels/index.js?v=20260725b";

const DEFAULT_ACCENT = "#6366f1";
const DEFAULT_SUB = "#ec4899";
const DEFAULT_ACCENT_RGB = "99,102,241";
const DEFAULT_SUB_RGB = "236,72,153";

const SETTINGS_KEY = "hamburger-menu-gallery-settings";

const MODES = {
  icon: { list: ICON_EFFECTS, cats: ICON_CATEGORIES },
  panel: { list: PANEL_EFFECTS, cats: PANEL_CATEGORIES },
};
const ALL_EFFECTS = [...ICON_EFFECTS, ...PANEL_EFFECTS];

const els = {
  grid: document.getElementById("grid"),
  filters: document.getElementById("filters"),
  modeTabs: document.getElementById("modeTabs"),
  countNote: document.getElementById("countNote"),
  toast: document.getElementById("toast"),
  codePreview: document.getElementById("codePreview"),
  copyPreview: document.getElementById("copyPreview"),
  accentColor: document.getElementById("accentColor"),
  accentVal: document.getElementById("accentVal"),
  subColor: document.getElementById("subColor"),
  subVal: document.getElementById("subVal"),
  resetSettings: document.getElementById("resetSettings"),
  closeAll: document.getElementById("closeAll"),
};

let accent = DEFAULT_ACCENT;
let sub = DEFAULT_SUB;
let mode = "icon";
let activeCat = "all";
let selected = null;

function hexToRgb(hex) {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255].join(",");
}

function applyColors(cssText) {
  return cssText
    .replaceAll(DEFAULT_ACCENT, accent)
    .replaceAll(DEFAULT_SUB, sub)
    .replaceAll(DEFAULT_ACCENT_RGB, hexToRgb(accent))
    .replaceAll(DEFAULT_SUB_RGB, hexToRgb(sub));
}

function saveSettings() {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify({ accent, sub }));
  } catch (error) {
    console.error("設定の保存に失敗しました:", error);
  }
}

function restoreSettings() {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return;
    const data = JSON.parse(raw);
    if (/^#[0-9a-f]{6}$/i.test(data.accent || "")) accent = data.accent;
    if (/^#[0-9a-f]{6}$/i.test(data.sub || "")) sub = data.sub;
  } catch (error) {
    console.error("設定の読み込みに失敗しました:", error);
  }
}

function resetSettings() {
  try {
    localStorage.removeItem(SETTINGS_KEY);
  } catch (error) {
    console.error("設定のリセットに失敗しました:", error);
  }
  accent = DEFAULT_ACCENT;
  sub = DEFAULT_SUB;
  syncColorInputs();
  injectStyles();
  updatePreview();
}

function syncColorInputs() {
  els.accentColor.value = accent;
  els.accentVal.textContent = accent;
  els.subColor.value = sub;
  els.subVal.textContent = sub;
}

let styleEl = null;
function injectStyles() {
  if (!styleEl) {
    styleEl = document.createElement("style");
    document.head.appendChild(styleEl);
  }
  styleEl.textContent = applyColors(ALL_EFFECTS.map((e) => e.css.join("\n")).join("\n"));
}

function localize(text) {
  if (lang !== "en") return text;
  for (const [ja, en] of Object.entries(TEXT_EN)) {
    text = text.replaceAll(ja, en);
  }
  return text;
}

function buttonSelector(effect) {
  return effect.mode === "icon" ? "." + effect.key : "." + effect.key + "__btn";
}

function formatHtml(html) {
  if (!html.startsWith("<div")) return html;
  return html
    .replaceAll("><button", ">\n  <button")
    .replaceAll("><nav", ">\n  <nav")
    .replaceAll("><main", ">\n  <main")
    .replaceAll("><div", ">\n  <div")
    .replace(/<\/div>$/, "\n</div>");
}

function buildCode(effect) {
  const selector = buttonSelector(effect);
  const style = "<style>\n" + localize(applyColors(effect.css.join("\n"))) + "\n</style>";
  const script =
    "<script>\n" +
    "  " +
    localize("// 開閉のトグル（aria-expanded を true / false で切り替えるだけ）") +
    "\n" +
    '  document.querySelectorAll("' +
    selector +
    '").forEach((btn) => {\n' +
    '    btn.addEventListener("click", () => btn.setAttribute("aria-expanded", btn.getAttribute("aria-expanded") !== "true"));\n' +
    "  });\n" +
    "<\/script>";
  return style + "\n\n" + localize(formatHtml(effect.html)) + "\n\n" + script;
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
  } catch (error) {
    console.error("コピーに失敗しました:", error);
    showToast(t.copyFailed);
  }
}

function markSelected(el) {
  document.querySelectorAll(".card.selected").forEach((n) => n.classList.remove("selected"));
  if (el) el.classList.add("selected");
}

function updatePreview() {
  els.copyPreview.disabled = !selected;
  els.codePreview.textContent = selected ? buildCode(selected) : "";
}

function selectEffect(effect, card) {
  selected = effect;
  markSelected(card);
  updatePreview();
}

function toggleButton(btn) {
  btn.setAttribute("aria-expanded", btn.getAttribute("aria-expanded") !== "true" ? "true" : "false");
}

function closeAll() {
  const opened = els.grid.querySelectorAll('button[aria-expanded="true"]');
  opened.forEach((btn) => btn.setAttribute("aria-expanded", "false"));
  showToast(t.closedAll);
}

function renderModeTabs() {
  els.modeTabs.innerHTML = "";
  for (const key of ["icon", "panel"]) {
    const tab = document.createElement("button");
    tab.className = "mode-tab" + (key === mode ? " active" : "");
    tab.innerHTML =
      '<span class="mode-tab__name"></span><span class="mode-tab__count"></span>';
    tab.querySelector(".mode-tab__name").textContent = t.modeLabels[key];
    tab.querySelector(".mode-tab__count").textContent = t.modeCounts[key];
    tab.addEventListener("click", () => {
      if (mode === key) return;
      mode = key;
      activeCat = "all";
      renderModeTabs();
      renderFilters();
      renderGrid();
    });
    els.modeTabs.appendChild(tab);
  }
}

function renderFilters() {
  const cats = ["all", ...MODES[mode].cats];
  els.filters.innerHTML = "";
  for (const cat of cats) {
    const chip = document.createElement("button");
    chip.className = "chip" + (cat === activeCat ? " active" : "");
    chip.textContent = t.catLabels[cat] || cat;
    chip.addEventListener("click", () => {
      activeCat = cat;
      renderFilters();
      renderGrid();
    });
    els.filters.appendChild(chip);
  }
}

function panelViewport(effect) {
  return (
    '<div class="viewport">' +
    '<div class="vp-bar"><span class="vp-logo">LOGO</span></div>' +
    '<div class="vp-body"><i></i><i></i><i></i></div>' +
    effect.html +
    "</div>"
  );
}

function renderGrid() {
  const list = MODES[mode].list;
  const shown = activeCat === "all" ? list : list.filter((e) => e.cat === activeCat);
  els.grid.className = "grid" + (mode === "panel" ? " grid--panel" : "");
  els.grid.innerHTML = "";
  els.countNote.textContent = t.countNote(list.length, shown.length);

  for (const effect of shown) {
    const card = document.createElement("div");
    card.className = "card";

    const stage = document.createElement("div");
    stage.className = "stage" + (effect.dark ? " dark" : "") + (mode === "panel" ? " stage--panel" : "");
    stage.innerHTML = mode === "panel" ? panelViewport(effect) : effect.html;
    stage.addEventListener("click", (event) => {
      const link = event.target.closest("a");
      if (link) event.preventDefault();
      const btn = event.target.closest("button[aria-expanded]");
      if (btn) toggleButton(btn);
      selectEffect(effect, card);
    });

    const info = document.createElement("div");
    info.className = "card-info";
    const meta = document.createElement("div");
    meta.className = "card-meta";
    const cat = document.createElement("span");
    cat.className = "card-cat";
    cat.textContent = t.catLabels[effect.cat] || effect.cat;
    const name = document.createElement("span");
    name.className = "card-name";
    name.textContent = effect.label[lang];
    const btn = document.createElement("button");
    btn.className = "copy-btn";
    btn.textContent = "HTML+CSS+JS";
    btn.addEventListener("click", (event) => {
      event.stopPropagation();
      selectEffect(effect, card);
      copyText(buildCode(effect), event.currentTarget, effect.label[lang]);
    });

    meta.appendChild(cat);
    meta.appendChild(name);
    info.appendChild(meta);
    info.appendChild(btn);
    card.appendChild(stage);
    card.appendChild(info);
    els.grid.appendChild(card);
  }
}

els.accentColor.addEventListener("input", () => {
  accent = els.accentColor.value;
  els.accentVal.textContent = accent;
  injectStyles();
  updatePreview();
  saveSettings();
});
els.subColor.addEventListener("input", () => {
  sub = els.subColor.value;
  els.subVal.textContent = sub;
  injectStyles();
  updatePreview();
  saveSettings();
});
els.resetSettings.addEventListener("click", resetSettings);
els.closeAll.addEventListener("click", closeAll);
els.copyPreview.addEventListener("click", (event) => {
  if (selected) copyText(buildCode(selected), event.currentTarget, t.labelCode);
});

restoreSettings();
syncColorInputs();
injectStyles();
renderModeTabs();
renderFilters();
renderGrid();
