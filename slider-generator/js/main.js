// コントロール配線・タブ切替・コード出力・ライブプレビューの統合。
import { defaultState } from "./config.js?v=20260623e";
import { fullCode } from "./generators.js?v=20260623e";
import { renderPreview } from "./preview.js?v=20260623e";
import { t } from "./i18n.js?v=20260623e";

const state = { ...defaultState };
let activeLib = "swiper";

const host = document.getElementById("preview-host");
const output = document.getElementById("output");
const copyBtn = document.getElementById("copy-btn");
const slickWarn = document.getElementById("slick-warn");

// 各ライブラリが対応するエフェクト（非対応はタブ切替時にslideへ戻す）
const EFFECTS_BY_LIB = {
  swiper: ["slide", "fade", "coverflow", "cube", "flip", "cards", "marquee"],
  splide: ["slide", "fade", "marquee"],
  slick: ["slide", "fade", "marquee"],
};
// 1枚表示が前提のエフェクト（表示枚数をロック）
const SINGLE_VIEW_EFFECTS = ["fade", "cube", "flip", "cards"];

// ===== レンジ入力（数値）=====
const ranges = ["slideCount", "perView", "perViewMobile", "gap", "speed", "autoplayDelay", "centerPadding"];
ranges.forEach((id) => {
  const el = document.getElementById(id);
  if (!el) return;
  el.addEventListener("input", () => {
    state[id] = Number(el.value);
    updateValueLabel(id);
    refresh();
  });
});

function setPerView(value) {
  const el = document.getElementById("perView");
  el.value = String(value);
  state.perView = value;
  updateValueLabel("perView");
}

function updateValueLabel(id) {
  const label = document.querySelector(`[data-val="${id}"]`);
  if (!label) return;
  const el = document.getElementById(id);
  const suffix = id === "gap" || id === "centerPadding" ? "px" : id === "speed" || id === "autoplayDelay" ? "ms" : "枚";
  label.textContent = `${el.value}${suffix}`;
}

// ===== 切替ボタン（effect / direction）=====
document.querySelectorAll("[data-group]").forEach((group) => {
  const key = group.dataset.group;
  group.querySelectorAll("button").forEach((btn) => {
    btn.addEventListener("click", () => {
      group.querySelectorAll("button").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      state[key] = btn.dataset.value;
      if (key === "effect") {
        applyEffectLock();
        // カバーフローは両隣が見えてこそなので、1枚表示なら3枚に引き上げる
        if (btn.dataset.value === "coverflow" && state.perView < 2) setPerView(3);
        // 無限スクロールはサムネイルと併用しない
        if (btn.dataset.value === "marquee") {
          const tn = document.getElementById("thumbnail");
          if (tn && tn.checked) {
            tn.checked = false;
            state.thumbnail = false;
          }
        }
      }
      refresh();
    });
  });
});

// ===== チェックボックス =====
const checkboxes = [
  "loop",
  "centered",
  "autoplay",
  "pauseOnHover",
  "arrows",
  "pagination",
  "thumbnail",
  "grabCursor",
  "mousewheel",
  "keyboard",
  "rewind",
  "dragFree",
  "adaptiveHeight",
];
checkboxes.forEach((id) => {
  const el = document.getElementById(id);
  if (!el) return;
  el.addEventListener("change", () => {
    state[id] = el.checked;
    if (id === "autoplay") toggleRow("autoplayDelay-row", el.checked);
    // サムネイルと無限スクロール（エフェクト）は併用しない
    if (id === "thumbnail" && el.checked && state.effect === "marquee") setEffect("slide");
    refresh();
  });
});

function toggleRow(rowId, show) {
  const row = document.getElementById(rowId);
  if (row) row.classList.toggle("hidden", !show);
}

// 1枚表示エフェクト（fade/cube/flip/cards）のときは表示枚数・センター寄せを無効化
function applyEffectLock() {
  const locked = SINGLE_VIEW_EFFECTS.includes(state.effect);
  ["perView", "perViewMobile"].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.disabled = locked;
    el?.closest(".slider-row")?.classList.toggle("is-disabled", locked);
  });
  const centered = document.getElementById("centered");
  if (centered) {
    centered.disabled = locked;
    centered.closest(".check-row")?.classList.toggle("is-disabled", locked);
  }
}

// data-libs を持つ要素を、選択中ライブラリが対応する場合だけ表示
function applyLibVisibility() {
  document.querySelectorAll("[data-libs]").forEach((el) => {
    const libs = el.dataset.libs.split(/\s+/);
    el.classList.toggle("hidden", !libs.includes(activeLib));
  });
}

// エフェクトを設定し、ボタンの選択状態とロックを更新
function setEffect(value) {
  state.effect = value;
  document.querySelectorAll('[data-group="effect"] button').forEach((b) => {
    b.classList.toggle("active", b.dataset.value === value);
  });
  applyEffectLock();
}

// ===== ライブラリタブ =====
document.querySelectorAll(".lib-tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".lib-tab").forEach((t) => t.classList.remove("active"));
    tab.classList.add("active");
    activeLib = tab.dataset.lib;
    // 選択中エフェクトが新ライブラリで非対応ならslideに戻す
    if (!EFFECTS_BY_LIB[activeLib].includes(state.effect)) setEffect("slide");
    applyLibVisibility();
    refresh();
  });
});

// ===== コピー =====
copyBtn.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(output.value);
    const span = copyBtn.querySelector("span");
    const original = t.copyLabel;
    span.textContent = t.copyDone;
    copyBtn.classList.add("copied");
    setTimeout(() => {
      span.textContent = original;
      copyBtn.classList.remove("copied");
    }, 1600);
  } catch (e) {
    console.error("コピーに失敗しました:", e);
  }
});

// ===== 反映 =====
function refresh() {
  output.value = fullCode(activeLib, state);
  slickWarn.classList.toggle("hidden", activeLib !== "slick");
  document.getElementById("marquee-hint")?.classList.toggle("hidden", state.effect !== "marquee");
  renderPreview(activeLib, state, host);
}

// 初期化
ranges.forEach(updateValueLabel);
applyEffectLock();
applyLibVisibility();
refresh();
