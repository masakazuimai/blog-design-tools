// ショット詳細（モーダル）
import { getShot, categoryName } from "./shots/index.js?v=20261006l";
import { frameHtml } from "./frame.js?v=20261006l";
import { VOCAB, vocabLabel } from "./vocab.js?v=20261006l";
import { shotPrompt } from "./output.js?v=20261006l";
import { addItem } from "./builder.js?v=20261006l";
import { copyText, toast, track } from "./ui.js?v=20261006l";
import { t } from "./i18n.js?v=20261006l";

const $ = (id) => document.getElementById(id);

export const initDetail = () => {
  const dialog = $("detail");
  let current = null;

  $("detail-close").addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (e) => {
    if (e.target === dialog) dialog.close();
  });
  $("detail-copy").addEventListener("click", () => {
    copyText(shotPrompt(current), t("copiedPrompt"));
    track("copy", { scope: "shot", format: "prompt", shot_id: current.id });
  });
  $("detail-add").addEventListener("click", () => {
    addItem(current.id);
    toast(t("added"));
    track("add", { from: "detail", shot_id: current.id });
  });

  return (id) => {
    current = getShot(id);
    if (!current) return;
    $("detail-cat").textContent = `${current.id.toUpperCase()} · ${categoryName(current.cat)}`;
    $("detail-title").textContent = current.name;
    $("detail-frame").innerHTML = frameHtml(current, { eager: true });
    $("detail-use").textContent = current.use;
    $("detail-intent").textContent = current.intent;
    $("detail-tips").textContent = current.tips;
    $("detail-vocab").innerHTML = VOCAB
      .map((v) => `<tr><th>${v.label}</th><td>${vocabLabel(v.key, current.vocab[v.key]) || t("none")}</td></tr>`)
      .join("");
    $("detail-prompt").textContent = shotPrompt(current);
    dialog.showModal();
    track("open", { shot_id: current.id });
  };
};
