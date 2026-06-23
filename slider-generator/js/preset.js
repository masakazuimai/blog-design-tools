// パターン別ページ用。ページが定義した window.PRESET_STATE を使い、
// 本体と同じエンジンで3ライブラリのコードを出力し、ライブプレビューを描画する。
import { defaultState } from "./config.js?v=20260623k";
import { fullCode } from "./generators.js?v=20260623k";
import { renderPreview } from "./preview.js?v=20260623k";

const state = { ...defaultState, ...(window.PRESET_STATE || {}) };

// 各ライブラリのコードブロックを埋める
["swiper", "splide", "slick"].forEach((name) => {
  const el = document.getElementById(`code-${name}`);
  if (el) el.textContent = fullCode(name, state);
});

// ライブプレビュー（既定はSwiper。ページで window.PRESET_PREVIEW 指定可）
const host = document.getElementById("preview-host");
if (host) renderPreview(window.PRESET_PREVIEW || "swiper", state, host);

// コピーボタン（data-copy にコードブロックのidを指定）
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
