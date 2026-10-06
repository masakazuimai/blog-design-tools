// ビルダー画面（構成リスト＋ページ全体のプレビュー＋書き出し）
import { CATEGORIES, PATTERNS, categoryName, getPattern } from "./patterns/index.js?v=20261006h";
import { createPreview } from "./preview.js?v=20261006h";
import { buildCss, buildDocument, buildHtml } from "./code.js?v=20261006h";
import { buildPrompt } from "./prompt.js?v=20261006h";
import * as store from "./builder.js?v=20261006h";
import { bindSeg, copyText, exportPng, exportSvg, toast, track } from "./ui.js?v=20261006h";
import { downloadText } from "./download.js?v=20261006h";
import { t } from "./i18n.js?v=20261006h";

const $ = (id) => document.getElementById(id);
const SEED = ["hd01", "fv02", "fa01", "cs01", "st01", "pr01", "fq01", "ft03"];

const optionsFor = (cat, selected) => PATTERNS.filter((p) => p.cat === cat)
  .map((p) => `<option value="${p.id}"${p.id === selected ? " selected" : ""}>${p.id.toUpperCase()} ${p.name}</option>`)
  .join("");

const rowHtml = (item, i, total) => {
  const p = getPattern(item.id);
  return `<li data-uid="${item.uid}">
    <span class="stack__no">${String(i + 1).padStart(2, "0")}</span>
    <div class="stack__main">
      <span class="stack__cat">${categoryName(p.cat)}</span>
      <select data-swap aria-label="${t("patternOf")(categoryName(p.cat))}">${optionsFor(p.cat, p.id)}</select>
    </div>
    <div class="stack__ops">
      <button type="button" data-move="-1" aria-label="${t("moveUp")}"${i === 0 ? " disabled" : ""}>▲</button>
      <button type="button" data-move="1" aria-label="${t("moveDown")}"${i === total - 1 ? " disabled" : ""}>▼</button>
      <button type="button" data-remove aria-label="${t("remove")}">×</button>
    </div>
  </li>`;
};

const fillAddSelect = (select) => {
  select.innerHTML = CATEGORIES.map((c) => `<optgroup label="${c.name}">${optionsFor(c.id)}</optgroup>`).join("");
};

export const initBuilderView = () => {
  const stack = $("stack");
  const preview = createPreview($("builder-frame"), $("builder-stage"));

  const render = (items) => {
    stack.innerHTML = items.map((item, i) => rowHtml(item, i, items.length)).join("");
    $("stack-empty").hidden = items.length > 0;
    $("builder-count").textContent = String(items.length);
    preview.setPatterns(store.getBuilderPatterns());
  };

  stack.addEventListener("click", (e) => {
    const li = e.target.closest("li[data-uid]");
    if (!li) return;
    const move = e.target.closest("[data-move]");
    if (move) store.moveItem(li.dataset.uid, Number(move.dataset.move));
    if (e.target.closest("[data-remove]")) store.removeItem(li.dataset.uid);
  });
  stack.addEventListener("change", (e) => {
    const li = e.target.closest("li[data-uid]");
    if (li && e.target.matches("[data-swap]")) store.swapItem(li.dataset.uid, e.target.value);
  });

  fillAddSelect($("add-select"));
  $("add-btn").addEventListener("click", () => store.addItem($("add-select").value));
  $("seed-btn").addEventListener("click", () => {
    store.replaceItems(SEED);
    track("seed");
  });
  $("clear-btn").addEventListener("click", () => store.clearItems());
  bindSeg($("builder-device"), (w) => preview.setWidth(w));

  const exporters = {
    html: (ps) => copyText(buildHtml(ps), t("copiedHtml")),
    css: (ps) => copyText(buildCss(ps), t("copiedCss")),
    prompt: (ps) => copyText(buildPrompt(ps), t("copiedPrompt")),
    svg: (ps) => exportSvg(ps, preview.getWidth(), "wireframe-page"),
    png: (ps) => exportPng(ps, preview.getWidth(), "wireframe-page"),
    file: (ps) => downloadText(buildDocument(ps), "wireframe.html", "text/html"),
  };
  document.querySelector("#view-builder .toolbar__actions").addEventListener("click", (e) => {
    const btn = e.target.closest("[data-export]");
    if (!btn) return;
    const ps = store.getBuilderPatterns();
    if (ps.length === 0) return toast(t("addFirst"));
    exporters[btn.dataset.export](ps);
    track(["html", "css", "prompt"].includes(btn.dataset.export) ? "copy" : "export", {
      scope: "page",
      format: btn.dataset.export,
      section_count: ps.length,
    });
  });

  store.subscribe(render);
  return {
    // 非表示の間は枠幅が0なので、表示に切り替えたときに描き直す
    show: () => render(store.getItems()),
    refreshCount: () => { $("builder-count").textContent = String(store.getItems().length); },
  };
};
