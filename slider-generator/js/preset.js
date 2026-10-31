import { defaultState } from "./config.js?v=20260623k";
import { fullCode } from "./generators.js?v=20260623k";
import { renderPreview } from "./preview.js?v=20260623k";

const state = { ...defaultState, ...(window.PRESET_STATE || {}) };

["swiper", "splide", "slick"].forEach((name) => {
  const el = document.getElementById(`code-${name}`);
  if (el) el.textContent = fullCode(name, state);
});

const host = document.getElementById("preview-host");
if (host) renderPreview(window.PRESET_PREVIEW || "swiper", state, host);

document.querySelectorAll("[data-copy]").forEach((btn) => {
  btn.addEventListener("click", async () => {
    const pre = document.getElementById(btn.dataset.copy);
    if (!pre) return;
    try {
      await navigator.clipboard.writeText(pre.textContent);
      const span = btn.querySelector("span");
      const original = span.textContent;
      span.textContent = "コピーしました";
      btn.classList.add("copied");
      setTimeout(() => {
        span.textContent = original;
        btn.classList.remove("copied");
      }, 1500);
    } catch (e) {
      console.error("コピーに失敗しました:", e);
    }
  });
});
