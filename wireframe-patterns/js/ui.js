// 画面共通の小物（トースト・コピー・セグメント切り替え・書き出し）
import { buildSvg } from "./svg-export.js?v=20261006h";
import { downloadSvgAsPng, downloadText } from "./download.js?v=20261006h";
import { t } from "./i18n.js?v=20261006h";

// GA4計測：GTM の dataLayer へイベントを送る（GTM側でカスタムイベントとしてGA4へ転送）
// データレイヤー変数は前回の値を引き継ぐため、使わないパラメータも毎回 undefined で上書きする
const TRACK_KEYS = ["scope", "format", "pattern_id", "section_count", "from"];
export const track = (event, params = {}) => {
  window.dataLayer = window.dataLayer || [];
  const reset = Object.fromEntries(TRACK_KEYS.map((key) => [key, undefined]));
  window.dataLayer.push({ event: `wireframe_patterns_${event}`, ...reset, ...params });
};

let toastTimer = 0;
export const toast = (message) => {
  const el = document.getElementById("toast");
  el.textContent = message;
  el.classList.add("is-on");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove("is-on"), 1800);
};

export const copyText = async (text, label = t("copied")) => {
  try {
    await navigator.clipboard.writeText(text);
    toast(label);
  } catch (err) {
    console.error("コピーに失敗:", err);
    toast(t("copyFailed"));
  }
};

// aria-pressed のボタン群。選ばれた値を onChange へ渡す
export const bindSeg = (group, onChange) => {
  group.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-width]");
    if (!btn) return;
    group.querySelectorAll("button").forEach((b) => b.setAttribute("aria-pressed", String(b === btn)));
    onChange(Number(btn.dataset.width));
  });
};

export const exportSvg = (patterns, width, name) => {
  try {
    const { svg } = buildSvg(patterns, width);
    downloadText(svg, `${name}.svg`, "image/svg+xml");
  } catch (err) {
    console.error("SVG書き出しに失敗:", err);
    toast(t("svgFailed"));
  }
};

export const exportPng = async (patterns, width, name) => {
  try {
    const { svg, height } = buildSvg(patterns, width);
    await downloadSvgAsPng(svg, width, height, `${name}.png`);
  } catch (err) {
    console.error("PNG書き出しに失敗:", err);
    toast(t("pngFailed"));
  }
};
