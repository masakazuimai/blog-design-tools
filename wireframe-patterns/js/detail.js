// パターン詳細（モーダル）
import { getPattern, categoryName } from "./patterns/index.js?v=20261006f";
import { createPreview } from "./preview.js?v=20261006f";
import { buildCss } from "./code.js?v=20261006f";
import { buildPrompt } from "./prompt.js?v=20261006f";
import { addItem } from "./builder.js?v=20261006f";
import { bindSeg, copyText, exportPng, exportSvg, toast, track } from "./ui.js?v=20261006f";

const $ = (id) => document.getElementById(id);

export const initDetail = () => {
  const dialog = $("detail");
  const preview = createPreview($("detail-frame"), $("detail-stage"));
  let current = null;
  let tab = "html";

  const codeFor = (p) => ({
    html: p.html,
    css: buildCss([p]),
    prompt: buildPrompt([p]),
  })[tab];

  const showCode = () => {
    $("detail-code").textContent = codeFor(current);
    dialog.querySelectorAll(".code__tabs button").forEach((b) => b.setAttribute("aria-selected", String(b.dataset.code === tab)));
  };

  dialog.querySelector(".code__tabs").addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-code]");
    if (!btn) return;
    tab = btn.dataset.code;
    showCode();
  });

  bindSeg($("detail-device"), (w) => preview.setWidth(w));
  $("detail-close").addEventListener("click", () => dialog.close());
  // 背景（::backdrop）のクリックで閉じる
  dialog.addEventListener("click", (e) => {
    if (e.target === dialog) dialog.close();
  });
  $("detail-copy").addEventListener("click", () => {
    copyText(codeFor(current));
    track("copy", { scope: "pattern", format: tab, pattern_id: current.id });
  });
  $("detail-svg").addEventListener("click", () => {
    exportSvg([current], preview.getWidth(), `wireframe-${current.id}`);
    track("export", { scope: "pattern", format: "svg", pattern_id: current.id });
  });
  $("detail-png").addEventListener("click", () => {
    exportPng([current], preview.getWidth(), `wireframe-${current.id}`);
    track("export", { scope: "pattern", format: "png", pattern_id: current.id });
  });
  $("detail-add").addEventListener("click", () => {
    addItem(current.id);
    track("add", { from: "detail", pattern_id: current.id });
    toast("ページに追加しました");
  });

  return (id) => {
    current = getPattern(id);
    if (!current) return;
    $("detail-cat").textContent = `${current.id.toUpperCase()} · ${categoryName(current.cat)}`;
    $("detail-title").textContent = current.name;
    $("detail-use").textContent = current.use;
    $("detail-intent").textContent = current.intent;
    $("detail-parts").innerHTML = current.parts.map((t) => `<li>${t}</li>`).join("");
    tab = "html";
    showCode();
    dialog.showModal();
    track("open", { pattern_id: current.id });
    // 表示後に枠幅が決まるので、開いてから描画する
    preview.setPatterns([current]);
  };
};
