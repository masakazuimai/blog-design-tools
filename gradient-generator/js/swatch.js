// 「色の辞書」連携：同リポジトリの color-dictionary の色データを動的importし、
// ストップの色をパレットから選べるようにする。読み込み失敗時は安全に劣化する。
import { t, LANG } from "./i18n.js?v=20260629a";

let cache = null;

// color-dictionary の色データを取得（ja / css）。失敗時は null。
async function loadColors() {
  if (cache) return cache;
  try {
    const [ja, css] = await Promise.all([
      import("../../color-dictionary/js/data-ja.js"),
      import("../../color-dictionary/js/data-css.js"),
    ]);
    cache = { ja: ja.JA_COLORS || [], css: css.CSS_COLORS || [] };
    return cache;
  } catch (e) {
    console.warn("color-dictionary のデータを読み込めませんでした", e);
    return null;
  }
}

function matches(c, q) {
  if (!q) return true;
  const hay = `${c.name} ${c.reading || ""} ${c.en || ""} ${c.hex}`.toLowerCase();
  return hay.includes(q);
}

function renderGrid(colors, q) {
  const frag = document.createDocumentFragment();
  for (const c of colors) {
    if (!matches(c, q)) continue;
    const b = document.createElement("button");
    b.type = "button";
    b.className = "dict-swatch";
    b.style.background = c.hex;
    b.dataset.hex = c.hex;
    const label = LANG === "en" ? `${c.en || c.name} ${c.hex}` : `${c.name}（${c.reading || ""}）${c.hex}`;
    b.title = label;
    b.setAttribute("aria-label", label);
    frag.appendChild(b);
  }
  return frag;
}

// パレットパネルを container に構築。onPick(hex) で選択を通知。
export async function buildSwatchPanel(container, onPick) {
  container.innerHTML = `<p class="swatch-group-title">${t.swatchLoading}</p>`;
  const data = await loadColors();
  if (!data) {
    container.innerHTML = `<p class="swatch-group-title">${t.swatchError}</p>`;
    return;
  }

  const search = document.createElement("input");
  search.type = "search";
  search.className = "swatch-search";
  search.placeholder = t.swatchSearch;
  search.autocomplete = "off";

  const jaTitle = document.createElement("p");
  jaTitle.className = "swatch-group-title";
  jaTitle.textContent = t.swatchJa;
  const jaGrid = document.createElement("div");
  jaGrid.className = "swatch-grid";

  const cssTitle = document.createElement("p");
  cssTitle.className = "swatch-group-title";
  cssTitle.textContent = t.swatchCss;
  const cssGrid = document.createElement("div");
  cssGrid.className = "swatch-grid";

  function paint(q) {
    const query = (q || "").trim().toLowerCase();
    jaGrid.replaceChildren(renderGrid(data.ja, query));
    cssGrid.replaceChildren(renderGrid(data.css, query));
    jaTitle.classList.toggle("hidden", !jaGrid.childElementCount);
    cssTitle.classList.toggle("hidden", !cssGrid.childElementCount);
  }
  paint("");

  search.addEventListener("input", () => paint(search.value));
  container.addEventListener("click", (e) => {
    const sw = e.target.closest(".dict-swatch");
    if (sw) onPick(sw.dataset.hex);
  });

  container.replaceChildren(search, jaTitle, jaGrid, cssTitle, cssGrid);
}
