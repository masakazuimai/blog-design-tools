// 画面共通の小物（トースト・コピー・セグメント切り替え・書き出し）
import { buildSvg } from "./svg-export.js?v=20261006e";
import { downloadSvgAsPng, downloadText } from "./download.js?v=20261006e";

// GA4計測：GTM の dataLayer へイベントを送る（GTM側でカスタムイベントとしてGA4へ転送）
export const track = (event, params = {}) => {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: `wireframe_patterns_${event}`, ...params });
};

let toastTimer = 0;
export const toast = (message) => {
  const el = document.getElementById("toast");
  el.textContent = message;
  el.classList.add("is-on");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove("is-on"), 1800);
};

export const copyText = async (text, label = "コピーしました") => {
  try {
    await navigator.clipboard.writeText(text);
    toast(label);
  } catch (err) {
    console.error("コピーに失敗:", err);
    toast("コピーできませんでした。コードを選択してコピーしてください");
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
    toast("SVGを書き出せませんでした");
  }
};

export const exportPng = async (patterns, width, name) => {
  try {
    const { svg, height } = buildSvg(patterns, width);
    await downloadSvgAsPng(svg, width, height, `${name}.png`);
  } catch (err) {
    console.error("PNG書き出しに失敗:", err);
    toast("PNGを書き出せませんでした");
  }
};
