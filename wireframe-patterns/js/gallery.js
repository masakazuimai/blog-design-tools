// パターン一覧（カテゴリ絞り込み＋カード）
import { CATEGORIES, PATTERNS, categoryName } from "./patterns/index.js?v=20261006e";
import { createPreview } from "./preview.js?v=20261006e";
import { addItem } from "./builder.js?v=20261006e";
import { toast, track } from "./ui.js?v=20261006e";

const renderChips = (wrap, onSelect) => {
  const all = [{ id: "all", name: "すべて", count: PATTERNS.length }]
    .concat(CATEGORIES.map((c) => ({ ...c, count: PATTERNS.filter((p) => p.cat === c.id).length })));
  wrap.innerHTML = all
    .map((c, i) => `<button class="chip" type="button" data-cat="${c.id}" aria-pressed="${i === 0}">${c.name}<span>${c.count}</span></button>`)
    .join("");
  wrap.addEventListener("click", (e) => {
    const chip = e.target.closest(".chip");
    if (!chip) return;
    wrap.querySelectorAll(".chip").forEach((c) => c.setAttribute("aria-pressed", String(c === chip)));
    onSelect(chip.dataset.cat);
  });
};

const cardHtml = (p) => `<article class="card" data-cat="${p.cat}">
  <button class="card__thumb" type="button" data-open="${p.id}" aria-label="${p.name}を詳しく見る">
    <div class="frame"><div class="frame__stage"></div></div>
  </button>
  <div class="card__body">
    <span class="card__id">${p.id.toUpperCase()} · ${categoryName(p.cat)}</span>
    <h2 class="card__name">${p.name}</h2>
    <p class="card__use">${p.use}</p>
  </div>
  <div class="card__actions">
    <button class="btn btn--ghost" type="button" data-open="${p.id}">詳しく見る</button>
    <button class="btn" type="button" data-add="${p.id}">＋ページに追加</button>
  </div>
</article>`;

export const initGallery = ({ onOpen }) => {
  const grid = document.getElementById("pattern-grid");
  grid.innerHTML = PATTERNS.map(cardHtml).join("");
  grid.querySelectorAll(".card").forEach((card, i) => {
    const preview = createPreview(card.querySelector(".frame"), card.querySelector(".frame__stage"));
    preview.setPatterns([PATTERNS[i]]);
  });

  grid.addEventListener("click", (e) => {
    const open = e.target.closest("[data-open]");
    if (open) return onOpen(open.dataset.open);
    const add = e.target.closest("[data-add]");
    if (add) {
      addItem(add.dataset.add);
      track("add", { from: "card", pattern_id: add.dataset.add });
      toast("ページに追加しました");
    }
  });

  renderChips(document.getElementById("cat-chips"), (cat) => {
    grid.querySelectorAll(".card").forEach((card) => {
      card.hidden = cat !== "all" && card.dataset.cat !== cat;
    });
  });
};
