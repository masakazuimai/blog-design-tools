"use strict";

// ?v= はキャッシュバスティング用。js更新時は index.html・en/index.html の参照とここを揃えて上げる
import { t, lang } from "./i18n.js?v=20260724a";
import { EFFECTS, CATEGORIES } from "./effects/index.js?v=20260724a";

// デフォルトのアクセント色（エフェクト定義内のリテラルと一致させる）
const DEFAULT_ACCENT = "#6366f1";
const DEFAULT_SUB = "#ec4899";
const DEFAULT_ACCENT_RGB = "99,102,241";
const DEFAULT_SUB_RGB = "236,72,153";

const SETTINGS_KEY = "hover-effects-gallery-settings";

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
};

let accent = DEFAULT_ACCENT;
let sub = DEFAULT_SUB;
let activeCat = "all";
let selected = null;

// ---- 色の置換 ----
// #rrggbb → "r,g,b"（rgba() 内の置換用）
function hexToRgb(hex) {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255].join(",");
}

// エフェクト定義内のデフォルト色を現在の設定色に置き換える
function applyColors(cssText) {
  return cssText
    .replaceAll(DEFAULT_ACCENT, accent)
    .replaceAll(DEFAULT_SUB, sub)
    .replaceAll(DEFAULT_ACCENT_RGB, hexToRgb(accent))
    .replaceAll(DEFAULT_SUB_RGB, hexToRgb(sub));
}

// ---- 設定の永続化 ----
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

// ---- エフェクトCSSの注入 ----
// 全エフェクトのCSSを1つの<style>にまとめて注入する（色変更時は差し替え）
let styleEl = null;
function injectStyles() {
  if (!styleEl) {
    styleEl = document.createElement("style");
    document.head.appendChild(styleEl);
  }
  styleEl.textContent = applyColors(EFFECTS.map((e) => e.css.join("\n")).join("\n"));
}

// ---- コード生成・コピー ----
function buildCode(effect) {
  return "<style>\n" + applyColors(effect.css.join("\n")) + "\n</style>\n\n" + effect.html;
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

// ---- 選択とプレビュー ----
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

// ---- フィルタとグリッド ----
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
  const list = activeCat === "all" ? EFFECTS : EFFECTS.filter((e) => e.cat === activeCat);
  els.grid.innerHTML = "";
  els.countNote.textContent = t.countNote(EFFECTS.length, list.length);

  for (const effect of list) {
    const card = document.createElement("div");
    card.className = "card";

    const stage = document.createElement("div");
    stage.className = "stage" + (effect.dark ? " dark" : "");
    stage.innerHTML = effect.html;
    // デモのリンクは遷移させず、クリックで選択する
    stage.querySelectorAll("a").forEach((a) => a.addEventListener("click", (e) => e.preventDefault()));
    stage.addEventListener("click", () => selectEffect(effect, card));

    const info = document.createElement("div");
    info.className = "card-info";
    // 1段目＝タグ＋タイトル、2段目＝コピーボタン
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
    btn.textContent = "HTML+CSS";
    btn.addEventListener("click", (e) => {
      selectEffect(effect, card);
      copyText(buildCode(effect), e.currentTarget, effect.label[lang]);
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

// ---- イベント ----
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
els.copyPreview.addEventListener("click", (e) => {
  if (selected) copyText(buildCode(selected), e.currentTarget, t.labelCode);
});

// ---- 初期化 ----
restoreSettings();
syncColorInputs();
injectStyles();
renderFilters();
renderGrid();
