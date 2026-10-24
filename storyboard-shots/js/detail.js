// ショット詳細（モーダル）
import { getShot, categoryName } from "./shots/index.js?v=20261024b";
import { frameHtml } from "./frame.js?v=20261024b";
import { VOCAB, vocabLabel } from "./vocab.js?v=20261024b";
import { shotPrompt } from "./output.js?v=20261024b";
import { addItem } from "./builder.js?v=20261024b";
import { copyText, toast, track } from "./ui.js?v=20261024b";
import { t } from "./i18n.js?v=20261024b";
import { hasDemo, demoPoster, demoSources, reducedMotion } from "./move-demo.js?v=20261024b";

const $ = (id) => document.getElementById(id);

// 開いたショットの動きに合わせて見本を差し替える（動画は開いたときだけ読み込む）
const showMoveDemo = (shot) => {
  const box = $("detail-move");
  const video = $("detail-move-video");
  if (!hasDemo(shot)) {
    stopMoveDemo();
    box.hidden = true;
    return;
  }
  video.poster = demoPoster(shot);
  video.innerHTML = demoSources(shot);
  video.load();
  // 応用のカメラワークは動きを語彙で持たないので、ショット名を出す
  $("detail-move-cap").textContent = t("moveDemo")(shot.vocab?.move ? vocabLabel("move", shot.vocab.move) : shot.name);
  box.hidden = false;
  if (!reducedMotion()) video.play().catch(() => {});
};

const stopMoveDemo = () => {
  const video = $("detail-move-video");
  video.pause();
  video.innerHTML = "";
  video.removeAttribute("poster");
  video.load();
};

export const initDetail = () => {
  const dialog = $("detail");
  let current = null;

  $("detail-close").addEventListener("click", () => dialog.close());
  // close は後から届くので、その間に次のショットを開いていたら止めない
  dialog.addEventListener("close", () => {
    if (!dialog.open) stopMoveDemo();
  });
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
    // 応用のカメラワークは動きを語彙でなくプロンプトの説明文で指定している
    const inDesc = (key) => key === "move" && current.cat === "advanced" && !current.vocab.move;
    $("detail-vocab").innerHTML = VOCAB
      .map((v) => `<tr><th>${v.label}</th><td>${inDesc(v.key) ? t("moveInDesc") : vocabLabel(v.key, current.vocab[v.key]) || t("none")}</td></tr>`)
      .join("");
    $("detail-prompt").textContent = shotPrompt(current);
    dialog.showModal();
    showMoveDemo(current);
    track("open", { shot_id: current.id });
  };
};
