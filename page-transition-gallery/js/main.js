"use strict";

import { t, lang, TEXT_EN } from "./i18n.js?v=20260725b";
import { EFFECTS, CATEGORIES } from "./effects/index.js?v=20260725b";

const DEFAULT_ACCENT = "#6366f1";
const DEFAULT_SUB = "#ec4899";
const DEFAULT_ACCENT_RGB = "99,102,241";
const DEFAULT_SUB_RGB = "236,72,153";

const SETTINGS_KEY = "page-transition-gallery-settings";

const LOADING_HOLD = 1700;

const els = {
  grid: document.getElementById("grid"),
  filters: document.getElementById("filters"),
  countNote: document.getElementById("countNote"),
  toast: document.getElementById("toast"),
  codePreview: document.getElementById("codePreview"),
  copyPreview: document.getElementById("copyPreview"),
  accentColor: document.getElementById("accentColor"),
  accentVal: document.getElementById("accentVal"),
  subColor: document.getElementById("subColor"),
  subVal: document.getElementById("subVal"),
  resetSettings: document.getElementById("resetSettings"),
  playAll: document.getElementById("playAll"),
};

let accent = DEFAULT_ACCENT;
let sub = DEFAULT_SUB;
let activeCat = "all";
let selected = null;

const playing = new Set();

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
  styleEl.textContent = applyColors(EFFECTS.map((e) => e.css.join("\n")).join("\n"));
}

function localize(text) {
  if (lang !== "en") return text;
  for (const [ja, en] of Object.entries(TEXT_EN)) {
    text = text.replaceAll(ja, en);
  }
  return text;
}

function buildScript(effect) {
  if (effect.cat === "loading") {
    return (
      "<script>\n" +
      "  " +
      localize("// 読み込み完了でローディング画面を閉じる") +
      "\n" +
      '  window.addEventListener("load", () => {\n' +
      '    document.querySelector(".' +
      effect.key +
      '").classList.add("is-done");\n' +
      "  });\n" +
      "<\/script>"
    );
  }
  return (
    "<script>\n" +
    "  " +
    localize("// 読み込み直後に幕を開き、内部リンクのクリックで幕を閉じてから遷移する") +
    "\n" +
    '  const veil = document.querySelector(".' +
    effect.key +
    '");\n' +
    '  requestAnimationFrame(() => veil.classList.add("is-open"));\n' +
    "  document.querySelectorAll('a[href^=\"/\"]').forEach((a) => {\n" +
    '    a.addEventListener("click", (e) => {\n' +
    "      e.preventDefault();\n" +
    '      veil.classList.remove("is-open");\n' +
    "      setTimeout(() => (location.href = a.href), " +
    effect.ms +
    ");\n" +
    "    });\n" +
    "  });\n" +
    "<\/script>"
  );
}

function buildCode(effect) {
  const style = "<style>\n" + localize(applyColors(effect.css.join("\n"))) + "\n</style>";
  const noscript = "<noscript><style>." + effect.key + " { display: none; }</style></noscript>";
  return style + "\n\n" + localize(effect.html) + "\n" + noscript + "\n\n" + buildScript(effect);
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

function mountIdle(card, effect) {
  const holder = card.querySelector(".vp-fx");
  const box = document.createElement("div");
  box.innerHTML = effect.html;
  const el = box.firstElementChild;
  el.classList.add(effect.cat === "loading" ? "is-done" : "is-open");
  holder.innerHTML = "";
  holder.appendChild(el);
}

function swapPage(card) {
  const label = card.querySelector(".vp-page");
  label.textContent = label.textContent === "Page 1" ? "Page 2" : "Page 1";
}

function playCard(card, effect) {
  if (playing.has(card)) return;
  playing.add(card);
  const btn = card.querySelector(".play-btn");
  const original = t.play;
  btn.textContent = t.playing;
  btn.disabled = true;

  const finish = (wait) =>
    setTimeout(() => {
      playing.delete(card);
      btn.textContent = original;
      btn.disabled = false;
    }, wait);

  if (effect.cat === "loading") {
    const holder = card.querySelector(".vp-fx");
    holder.innerHTML = effect.html;
    const el = holder.firstElementChild;
    setTimeout(() => el.classList.add("is-done"), LOADING_HOLD);
    finish(LOADING_HOLD + effect.ms);
    return;
  }

  const el = card.querySelector(".vp-fx").firstElementChild;
  el.classList.remove("is-open");
  setTimeout(() => {
    swapPage(card);
    el.classList.add("is-open");
  }, effect.ms + 150);
  finish(effect.ms * 2 + 300);
}

function renderFilters() {
  const cats = ["all", ...CATEGORIES];
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

function renderGrid() {
  const shown = activeCat === "all" ? EFFECTS : EFFECTS.filter((e) => e.cat === activeCat);
  els.grid.innerHTML = "";
  playing.clear();
  els.countNote.textContent = t.countNote(EFFECTS.length, shown.length);

  for (const effect of shown) {
    const card = document.createElement("div");
    card.className = "card";

    const stage = document.createElement("div");
    stage.className = "stage";
    stage.innerHTML =
      '<div class="viewport">' +
      '<div class="vp-bar"><span class="vp-logo">LOGO</span><span class="vp-page">Page 1</span></div>' +
      '<div class="vp-body"><i></i><i></i><i></i></div>' +
      '<div class="vp-fx"></div>' +
      "</div>";
    stage.addEventListener("click", () => {
      selectEffect(effect, card);
      playCard(card, effect);
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

    const actions = document.createElement("div");
    actions.className = "card-actions";
    const playBtn = document.createElement("button");
    playBtn.className = "play-btn";
    playBtn.textContent = t.play;
    playBtn.addEventListener("click", (event) => {
      event.stopPropagation();
      selectEffect(effect, card);
      playCard(card, effect);
    });
    const copyBtn = document.createElement("button");
    copyBtn.className = "copy-btn";
    copyBtn.textContent = "HTML+CSS+JS";
    copyBtn.addEventListener("click", (event) => {
      event.stopPropagation();
      selectEffect(effect, card);
      copyText(buildCode(effect), event.currentTarget, effect.label[lang]);
    });

    meta.appendChild(cat);
    meta.appendChild(name);
    actions.appendChild(playBtn);
    actions.appendChild(copyBtn);
    info.appendChild(meta);
    info.appendChild(actions);
    card.appendChild(stage);
    card.appendChild(info);
    els.grid.appendChild(card);

    mountIdle(card, effect);
  }
}

function playAllShown() {
  const shown = activeCat === "all" ? EFFECTS : EFFECTS.filter((e) => e.cat === activeCat);
  const cards = [...els.grid.querySelectorAll(".card")];
  cards.forEach((card, i) => setTimeout(() => playCard(card, shown[i]), i * 220));
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
els.playAll.addEventListener("click", playAllShown);
els.copyPreview.addEventListener("click", (event) => {
  if (selected) copyText(buildCode(selected), event.currentTarget, t.labelCode);
});

restoreSettings();
syncColorInputs();
injectStyles();
renderFilters();
renderGrid();
