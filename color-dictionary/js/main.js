// 色の辞書 — メインロジック（検索・絞り込み・カード描画・詳細モーダル・コピー）
import { COLORS, HUE_GROUPS } from "./colors.js?v=20260625d";
import { t, LANG } from "./i18n.js?v=20260625d";
import {
  rgbString,
  hslString,
  contrastRatio,
  readableTextColor,
  wcagGrade,
} from "./color-utils.js?v=20260625d";

const state = { q: "", cat: "all", hue: "all" };

const els = {
  search: document.getElementById("search"),
  cats: document.getElementById("cat-seg"),
  hues: document.getElementById("hue-chips"),
  grid: document.getElementById("grid"),
  count: document.getElementById("count"),
  overlay: document.getElementById("modal"),
  toast: document.getElementById("toast"),
};

// カタカナ→ひらがな（読み検索の表記ゆれ吸収）
const toHira = (s) =>
  s.replace(/[ァ-ヶ]/g, (c) =>
    String.fromCharCode(c.charCodeAt(0) - 0x60)
  );
const norm = (s) => toHira(String(s).toLowerCase().replace(/#/g, "").trim());

function matches(c) {
  if (state.cat !== "all" && c.cat !== state.cat) return false;
  if (state.hue !== "all" && c.hue !== state.hue) return false;
  const q = norm(state.q);
  if (!q) return true;
  return [c.name, c.reading, c.romaji, c.en, c.hex, c.alias]
    .filter(Boolean)
    .some((f) => norm(f).includes(q));
}

// ---- アイコン ----
const ICON_COPY =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/></svg>';
const ICON_CLOSE =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>';

const esc = (s) =>
  String(s).replace(
    /[&<>"]/g,
    (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[m])
  );

// ---- フィルタUIの描画 ----
function renderFilters() {
  els.hues.innerHTML = HUE_GROUPS.map((g) => {
    const label = g.key === "all" ? t.catAll : LANG === "en" ? g.labelEn : g.labelJa;
    return `<button class="hue-chip${g.key === state.hue ? " active" : ""}" data-hue="${g.key}">${
      g.dot ? `<span class="dot" style="background:${g.dot}"></span>` : ""
    }${label}</button>`;
  }).join("");
}

// ---- グリッド描画 ----
function render() {
  const list = COLORS.filter(matches);
  els.count.innerHTML = `<b>${list.length}</b> ${t.resultCount(list.length).replace(/^\d+\s*/, "")}`;

  if (!list.length) {
    els.grid.innerHTML = `<div class="no-result">${t.noResult}</div>`;
    return;
  }
  els.grid.innerHTML = list
    .map((c) => {
      const tag = c.cat === "ja" ? t.catLabelJa : t.catLabelCss;
      const sub =
        c.cat === "ja" ? (LANG === "en" ? c.romaji : c.reading) : c.en;
      return `<div class="chip" data-id="${c.id}" role="button" tabindex="0" aria-label="${esc(c.name)} ${c.hex}">
        <div class="swatch" style="background:${c.hex}">
          <span class="cat-tag">${tag}</span>
          <button class="quick-copy" data-copy="${c.hex}" title="${t.copyHex}" aria-label="${t.copyHex}">${ICON_COPY}</button>
        </div>
        <div class="meta">
          <div class="name">${esc(c.name)}</div>
          <div class="reading">${esc(sub)}</div>
          <div class="hex">${c.hex}</div>
        </div>
      </div>`;
    })
    .join("");
}

// ---- クリップボード ----
async function copy(text) {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    ta.remove();
  }
  showToast(`${text} — ${t.copied}`);
  if (typeof gtag === "function")
    gtag("event", "copy_color", { color_value: text });
}

let toastTimer;
function showToast(msg) {
  els.toast.textContent = msg;
  els.toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => els.toast.classList.remove("show"), 1600);
}

// ---- 詳細モーダル ----
function openModal(id) {
  const c = COLORS.find((x) => x.id === id);
  if (!c) return;
  const txt = readableTextColor(c.hex);
  const rgb = rgbString(c.hex);
  const hsl = hslString(c.hex);
  const crWhite = contrastRatio(c.hex, "#ffffff");
  const crBlack = contrastRatio(c.hex, "#000000");
  const catLabel = c.cat === "ja" ? t.catLabelJa : t.catLabelCss;
  const sub =
    c.cat === "ja"
      ? LANG === "en"
        ? esc(c.romaji)
        : `${esc(c.reading)} ／ ${esc(c.romaji)}`
      : esc(c.reading);
  const origin = LANG === "en" && c.origin_en ? c.origin_en : c.origin;
  const meaning = LANG === "en" && c.meaning_en ? c.meaning_en : c.meaning;

  const valueRow = (k, v) =>
    `<button class="value-row" data-copy="${v}">
      <span class="vk">${k}</span><span class="vv">${v}</span>
      <span class="copy-ico">${ICON_COPY}</span>
    </button>`;

  const pairHtml = c.pair
    .map(
      (p) =>
        `<button class="pair-swatch" data-copy="${p}"><div class="pb" style="background:${p}"></div><div class="pl">${p}</div></button>`
    )
    .join("");

  const contrastCard = (label, bg, ratio) =>
    `<div class="contrast-card">
      <div class="sample" style="background:${bg};color:${c.hex}">${LANG === "en" ? "Aa" : "Aa 文字"}</div>
      <div class="ratio">${ratio.toFixed(2)}</div>
      <div class="grade">${label}・${wcagGrade(ratio)}</div>
    </div>`;

  els.overlay.innerHTML = `<div class="plate" role="dialog" aria-modal="true" aria-label="${esc(c.name)}">
    <div class="plate-field" style="background:${c.hex}">
      <button class="close" data-close aria-label="${t.close}">${ICON_CLOSE}</button>
      <div class="field-hex" style="color:${txt}">${c.hex}</div>
    </div>
    <div class="plate-body">
      <div class="plate-cat">${catLabel}</div>
      <div class="plate-name">${esc(c.name)}</div>
      <div class="plate-reading">${sub}</div>
      ${c.cat === "ja" ? `<div class="plate-en">${esc(c.en)}</div>` : ""}
      ${c.alias ? `<div class="plate-alias">${t.aliasLabel}：<code>${esc(c.alias)}</code></div>` : ""}

      <div class="values">
        ${valueRow("HEX", c.hex.toUpperCase())}
        ${valueRow("RGB", rgb)}
        ${valueRow("HSL", hsl)}
      </div>

      <div class="plate-section">
        <h3>${t.origin}</h3>
        <p class="origin">${esc(origin)}</p>
      </div>
      <div class="plate-section">
        <h3>${t.meaning}</h3>
        <p class="meaning">${esc(meaning)}</p>
      </div>
      <div class="plate-section">
        <h3>${t.pairing}</h3>
        <div class="pair-row">${pairHtml}</div>
      </div>
      <div class="plate-section">
        <h3>${t.contrast}</h3>
        <div class="contrast-row">
          ${contrastCard(t.onWhite, "#ffffff", crWhite)}
          ${contrastCard(t.onBlack, "#000000", crBlack)}
        </div>
      </div>
    </div>
  </div>`;
  els.overlay.classList.add("open");
  document.body.style.overflow = "hidden";
  els.overlay.querySelector("[data-close]").focus();
  if (typeof gtag === "function")
    gtag("event", "open_color", { color_name: c.name, color_hex: c.hex });
}

function closeModal() {
  els.overlay.classList.remove("open");
  els.overlay.innerHTML = "";
  document.body.style.overflow = "";
}

// ---- イベント ----
els.search.addEventListener("input", (e) => {
  state.q = e.target.value;
  render();
});

els.cats.addEventListener("click", (e) => {
  const b = e.target.closest("button[data-cat]");
  if (!b) return;
  state.cat = b.dataset.cat;
  els.cats.querySelectorAll("button").forEach((x) =>
    x.classList.toggle("active", x === b)
  );
  render();
});

els.hues.addEventListener("click", (e) => {
  const b = e.target.closest(".hue-chip");
  if (!b) return;
  state.hue = b.dataset.hue;
  els.hues.querySelectorAll(".hue-chip").forEach((x) =>
    x.classList.toggle("active", x === b)
  );
  render();
});

els.grid.addEventListener("click", (e) => {
  const q = e.target.closest("[data-copy]");
  if (q) {
    e.stopPropagation();
    copy(q.dataset.copy);
    return;
  }
  const chip = e.target.closest(".chip");
  if (chip) openModal(chip.dataset.id);
});

// チップのキーボード操作（Enter / Space で詳細を開く）
els.grid.addEventListener("keydown", (e) => {
  const chip = e.target.closest(".chip");
  if (chip && (e.key === "Enter" || e.key === " ")) {
    e.preventDefault();
    openModal(chip.dataset.id);
  }
});

els.overlay.addEventListener("click", (e) => {
  if (e.target === els.overlay || e.target.closest("[data-close]")) {
    closeModal();
    return;
  }
  const cp = e.target.closest("[data-copy]");
  if (cp) copy(cp.dataset.copy);
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && els.overlay.classList.contains("open")) closeModal();
});

// ---- 初期描画 ----
els.search.placeholder = t.searchPlaceholder;
renderFilters();
render();
