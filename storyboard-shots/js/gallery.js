// ショット一覧（カテゴリ絞り込み＋カード）
import { CATEGORIES, SHOTS, categoryName } from "./shots/index.js?v=20261006l";
import { frameHtml } from "./frame.js?v=20261006l";
import { vocabLabel } from "./vocab.js?v=20261006l";
import { addItem } from "./builder.js?v=20261006l";
import { toast, track } from "./ui.js?v=20261006l";
import { t } from "./i18n.js?v=20261006l";

const renderChips = (wrap, onSelect) => {
  const all = [{ id: "all", name: t("all"), count: SHOTS.length }]
    .concat(CATEGORIES.map((c) => ({ ...c, count: SHOTS.filter((s) => s.cat === c.id).length })));
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

// カードに出す設定のタグ（指定なしは出さない）
const tags = (s) => ["shot", "angle", "move"]
  .map((k) => vocabLabel(k, s.vocab[k]))
  .filter((label) => label && label !== t("none"))
  .map((label) => `<span class="tag">${label}</span>`)
  .join("");

const cardHtml = (s) => `<article class="card" data-cat="${s.cat}">
  <button class="card__thumb" type="button" data-open="${s.id}" aria-label="${t("openDetail")(s.name)}">${frameHtml(s)}</button>
  <div class="card__body">
    <span class="card__id">${s.id.toUpperCase()} · ${categoryName(s.cat)}</span>
    <h2 class="card__name">${s.name}</h2>
    <p class="card__use">${s.use}</p>
    <div class="tags">${tags(s)}</div>
  </div>
  <div class="card__actions">
    <button class="btn btn--ghost" type="button" data-open="${s.id}">${t("learnMore")}</button>
    <button class="btn" type="button" data-add="${s.id}">${t("addToBoard")}</button>
  </div>
</article>`;

export const initGallery = ({ onOpen }) => {
  const grid = document.getElementById("shot-grid");
  grid.innerHTML = SHOTS.map(cardHtml).join("");
  grid.addEventListener("click", (e) => {
    const open = e.target.closest("[data-open]");
    if (open) return onOpen(open.dataset.open);
    const add = e.target.closest("[data-add]");
    if (add) {
      addItem(add.dataset.add);
      toast(t("added"));
      track("add", { from: "card", shot_id: add.dataset.add });
    }
  });
  renderChips(document.getElementById("cat-chips"), (cat) => {
    grid.querySelectorAll(".card").forEach((card) => {
      card.hidden = cat !== "all" && card.dataset.cat !== cat;
    });
  });
};
