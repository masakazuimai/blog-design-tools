// 状態管理・ライブプレビュー・出力束ね
import { DEFAULT_PARAMS, SHAPE_PRESETS, buildDisplacementMap, buildFilterSvg, buildGlassCss } from "./glass.js?v=20260619";
import { generateSnippet } from "./export.js?v=20260619";
import { I18N, getLang } from "./i18n.js?v=20260619";

const PREVIEW_FILTER_ID = "liquid-glass-filter";
const lang = getLang();
const t = I18N[lang];

const state = { ...DEFAULT_PARAMS };

const $ = (sel) => document.querySelector(sel);
const filterHost = $("#filter-host");
const previewEl = $("#lg-preview");
const outHtml = $("#output-html");
const outCss = $("#output-css");

// ライブ屈折はChromium(Chrome/Edge)のみ。UAで判定し注記を出す。
function isRefractionSupported() {
  const ua = navigator.userAgent;
  return /chrome|chromium|crios|edg/i.test(ua) && !/firefox|fxios/i.test(ua);
}

// 中核: マップ再生成 → フィルタ注入 → プレビュー適用 → 出力更新
function updateAll() {
  const mapDataUri = buildDisplacementMap(state);
  filterHost.innerHTML = buildFilterSvg(PREVIEW_FILTER_ID, state, mapDataUri);
  applyPreview();
  syncOutput();
}

function applyPreview() {
  const { radius, decls } = buildGlassCss(state, PREVIEW_FILTER_ID);
  const base = [
    "display: inline-flex",
    "align-items: center",
    "justify-content: center",
    "text-decoration: none",
    "font-weight: 700",
    "cursor: pointer",
  ];
  const hit = [`-webkit-clip-path: inset(0 round ${radius})`, `clip-path: inset(0 round ${radius})`];
  previewEl.style.cssText = [...base, ...decls, ...hit].join("; ");
  previewEl.textContent = state.text;
  previewEl.setAttribute("href", state.linkUrl || "#");
}

function syncOutput() {
  const { html, css } = generateSnippet(state, lang);
  outHtml.value = html;
  outCss.value = css;
}

// ===== コントロール束ね =====
function bindParams() {
  document.querySelectorAll("[data-param]").forEach((el) => {
    const key = el.dataset.param;
    const evt = el.type === "range" || el.type === "color" ? "input" : "input";
    el.addEventListener(evt, () => {
      const raw = el.value;
      state[key] = el.type === "range" ? parseFloat(raw) : raw;
      const out = el.parentElement.querySelector(".val");
      if (out) out.textContent = el.type === "range" ? raw : "";
      updateAll();
    });
  });
}

function bindShapes() {
  document.querySelectorAll("[data-shape]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const shape = btn.dataset.shape;
      const preset = SHAPE_PRESETS[shape];
      if (!preset) return;
      state.shape = shape;
      state.w = preset.w;
      state.h = preset.h;
      state.radius = preset.radius;
      document.querySelectorAll("[data-shape]").forEach((b) => b.classList.toggle("active", b === btn));
      syncSliders();
      updateAll();
    });
  });
}

function bindBackgrounds() {
  const track = $("#preview-track");
  document.querySelectorAll("[data-bg]").forEach((btn) => {
    btn.addEventListener("click", () => {
      track.className = `preview-track bg-${btn.dataset.bg}`;
      document.querySelectorAll("[data-bg]").forEach((b) => b.classList.toggle("active", b === btn));
    });
  });
}

// shapeプリセット適用後、スライダーUIを状態に同期
function syncSliders() {
  document.querySelectorAll("input[type=range][data-param]").forEach((el) => {
    const key = el.dataset.param;
    if (state[key] === undefined) return;
    const v = key === "radius" && state[key] >= 999 ? el.max : state[key];
    el.value = v;
    const out = el.parentElement.querySelector(".val");
    if (out) out.textContent = el.value;
  });
}

function bindCopy() {
  [["#copy-html", outHtml, t.copyHtml], ["#copy-css", outCss, t.copyCss]].forEach(([sel, area, label]) => {
    const btn = $(sel);
    btn.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(area.value);
      } catch (err) {
        area.select();
        document.execCommand("copy");
      }
      btn.textContent = t.copied;
      setTimeout(() => (btn.textContent = label), 1400);
    });
  });
}

function initSupportNotice() {
  const notice = $("#support-notice");
  if (!notice) return;
  const ok = isRefractionSupported();
  notice.textContent = ok ? t.supported : t.fallback;
  notice.classList.add(ok ? "ok" : "warn");
}

function init() {
  // 初期スライダー値を状態へ反映
  document.querySelectorAll("input[type=range][data-param], input[type=color][data-param], input[type=text][data-param]").forEach((el) => {
    const key = el.dataset.param;
    if (state[key] === undefined) return;
    if (el.type === "range") {
      el.value = key === "radius" && state[key] >= 999 ? el.max : state[key];
      const out = el.parentElement.querySelector(".val");
      if (out) out.textContent = el.value;
    } else {
      el.value = state[key];
    }
  });
  document.querySelector(`[data-shape="${state.shape}"]`)?.classList.add("active");
  bindParams();
  bindShapes();
  bindBackgrounds();
  bindCopy();
  initSupportNotice();
  updateAll();
}

init();
