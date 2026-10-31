import { t } from "./i18n.js?v=20261030e";

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

const TRACK_KEYS = ["scope", "format", "shot_id", "shot_count", "from"];
export const track = (event, params = {}) => {
  window.dataLayer = window.dataLayer || [];
  const reset = Object.fromEntries(TRACK_KEYS.map((key) => [key, undefined]));
  window.dataLayer.push({ event: `storyboard_shots_${event}`, ...reset, ...params });
};
