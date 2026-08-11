// GSAPアニメーション ギャラリー UI配線
import { EFFECTS, CATEGORIES } from "./effects/index.js?v=20260811a";
import { LANG, t, tf, localizeCode } from "./i18n.js?v=20260811a";

gsap.registerPlugin(ScrollTrigger, Draggable);

const DEFAULT_ACCENT = "#6366f1";
const DEFAULT_SUB = "#ec4899";
const STORAGE_KEY = "gsap-gallery:colors:v1";

const grid = document.getElementById("grid");
const filters = document.getElementById("filters");
const searchInput = document.getElementById("search");
const codePreview = document.getElementById("codePreview");
const copyPreview = document.getElementById("copyPreview");
const toast = document.getElementById("toast");
const countNote = document.getElementById("countNote");
const accentInput = document.getElementById("accentColor");
const subInput = document.getElementById("subColor");
const accentVal = document.getElementById("accentVal");
const subVal = document.getElementById("subVal");
const resetBtn = document.getElementById("resetColors");

let selectedKey = null;
let currentCat = "all";
let keyword = "";

/* ============ 色設定 ============ */

const loadColors = () => {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    accentInput.value = saved.accent || DEFAULT_ACCENT;
    subInput.value = saved.sub || DEFAULT_SUB;
  } catch (error) {
    console.error("色設定の読み込みに失敗:", error);
  }
};

const saveColors = () => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ accent: accentInput.value, sub: subInput.value }));
  } catch (error) {
    console.error("色設定の保存に失敗:", error);
  }
};

/** 定義に書いた既定色を、ユーザーが選んだ色へ差し替える */
const applyColors = (text) =>
  text.replaceAll(DEFAULT_ACCENT, accentInput.value).replaceAll(DEFAULT_SUB, subInput.value);

/** 表示用に整形したコピー用コード（色差し替え＋英語ページなら日本語を英訳） */
const buildCode = (def) => localizeCode(applyColors(def.code));

/** デモ台のHTML（英語ページではカード内に出る文言も英訳する） */
const buildStage = (def) => localizeCode(def.stage);

/* ============ デモCSSの注入 ============ */

const styleTag = document.createElement("style");
document.head.appendChild(styleTag);

const renderStyles = () => {
  styleTag.textContent = applyColors(EFFECTS.map((e) => e.css).join("\n"));
};

/* ============ 共通UI ============ */

const showToast = (msg) => {
  toast.textContent = msg;
  toast.classList.add("is-show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("is-show"), 1600);
};

const copyText = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    showToast(t("copied"));
  } catch (error) {
    console.error("クリップボードへの書き込みに失敗:", error);
    showToast(t("copyFailed"));
  }
};

/* ============ カード ============ */

/**
 * デモを最初から組み直す。
 * ScrollTriggerは要素を作り直すと参照が切れるため、
 * このステージに紐づくインスタンスを先に破棄してから再生成する。
 */
const playDemo = (stage, def) => {
  ScrollTrigger.getAll()
    .filter((st) => st.scroller === stage || stage.contains(st.trigger))
    .forEach((st) => st.kill());

  stage.innerHTML = buildStage(def);
  stage.scrollTop = 0;

  try {
    def.mount(stage);
  } catch (error) {
    console.error(`デモの初期化に失敗しました (${def.key}):`, error);
  }
};

const selectCard = (card, def) => {
  document.querySelectorAll(".card.is-selected").forEach((c) => c.classList.remove("is-selected"));
  card.classList.add("is-selected");
  selectedKey = def.key;
  codePreview.textContent = buildCode(def);
  copyPreview.disabled = false;
};

const buildCard = (def) => {
  const card = document.createElement("article");
  card.className = "card";
  card.dataset.key = def.key;

  card.innerHTML = `
    <div class="card-head">
      <span class="card-cat">${catLabel(def.cat)}</span>
      <h3>${def.label[LANG]}</h3>
    </div>
    <div class="stage fx-${def.key}${def.scroll ? " stage--scroll" : ""}"></div>
    <div class="card-actions">
      <button type="button" class="btn-replay">${t("replay")}</button>
      <button type="button" class="btn-copy">${t("copyCode")}</button>
    </div>`;

  const stage = card.querySelector(".stage");

  card.querySelector(".btn-replay").addEventListener("click", () => {
    playDemo(stage, def);
    selectCard(card, def);
  });
  card.querySelector(".btn-copy").addEventListener("click", () => {
    selectCard(card, def);
    copyText(buildCode(def));
  });
  card.querySelector(".card-head").addEventListener("click", () => selectCard(card, def));

  grid.appendChild(card);
  playDemo(stage, def);
};

const catLabel = (key) => CATEGORIES.find((c) => c.key === key)?.label[LANG] ?? key;

/* ============ 一覧の描画 ============ */

const visibleEffects = () =>
  EFFECTS.filter((e) => currentCat === "all" || e.cat === currentCat).filter((e) => {
    if (!keyword) return true;
    const hay = `${e.label.ja} ${e.label.en} ${e.key}`.toLowerCase();
    return hay.includes(keyword);
  });

const renderGrid = () => {
  // 一覧を作り直す前に、前回のデモが残したScrollTriggerを全て破棄する
  ScrollTrigger.getAll().forEach((st) => st.kill());
  grid.innerHTML = "";

  const list = visibleEffects();
  list.forEach(buildCard);

  if (!list.length) {
    const empty = document.createElement("p");
    empty.className = "empty";
    empty.textContent = t("noResult");
    grid.appendChild(empty);
  }
  countNote.textContent = tf("countNote", list.length, EFFECTS.length);
};

const renderFilters = () => {
  CATEGORIES.forEach((cat) => {
    const chip = document.createElement("button");
    chip.type = "button";
    chip.className = `chip${cat.key === currentCat ? " is-active" : ""}`;
    chip.textContent = cat.label[LANG];
    chip.dataset.cat = cat.key;
    chip.addEventListener("click", () => {
      currentCat = cat.key;
      filters.querySelectorAll(".chip").forEach((c) => c.classList.toggle("is-active", c.dataset.cat === cat.key));
      renderGrid();
    });
    filters.appendChild(chip);
  });
};

/* ============ イベント ============ */

const onColorChange = () => {
  accentVal.textContent = accentInput.value;
  subVal.textContent = subInput.value;
  renderStyles();
  saveColors();
  const def = EFFECTS.find((e) => e.key === selectedKey);
  if (def) codePreview.textContent = buildCode(def);
};

accentInput.addEventListener("input", onColorChange);
subInput.addEventListener("input", onColorChange);

resetBtn.addEventListener("click", () => {
  accentInput.value = DEFAULT_ACCENT;
  subInput.value = DEFAULT_SUB;
  onColorChange();
});

searchInput.addEventListener("input", () => {
  keyword = searchInput.value.trim().toLowerCase();
  renderGrid();
});

copyPreview.addEventListener("click", () => {
  const def = EFFECTS.find((e) => e.key === selectedKey);
  if (def) copyText(buildCode(def));
});

/* ============ 初期化 ============ */

searchInput.placeholder = t("searchPlaceholder");
copyPreview.textContent = t("copyThis");

loadColors();
accentVal.textContent = accentInput.value;
subVal.textContent = subInput.value;
renderStyles();
renderFilters();
renderGrid();
