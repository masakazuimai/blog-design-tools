// 絵コンテを組む画面（ショットの並び＋シートのプレビュー＋書き出し）
import { CATEGORIES, SHOTS, getShot } from "./shots/index.js?v=20261006l";
import { frameHtml } from "./frame.js?v=20261006l";
import { boardPrompt, scenarioJson, sheetSvg } from "./output.js?v=20261006l";
import * as store from "./builder.js?v=20261006l";
import { copyText, toast, track } from "./ui.js?v=20261006l";
import { downloadSvgAsPng, downloadText } from "./download.js?v=20261006l";
import { t } from "./i18n.js?v=20261006l";

const $ = (id) => document.getElementById(id);
const SEED = ["es01", "es02", "sz02", "rl01", "mv01", "sz03", "mv02"];

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
const fmt = (sec) => `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, "0")}`;

const optionsFor = (selected) => CATEGORIES.map((c) => `<optgroup label="${c.name}">${SHOTS.filter((s) => s.cat === c.id)
  .map((s) => `<option value="${s.id}"${s.id === selected ? " selected" : ""}>${s.name}</option>`).join("")}</optgroup>`).join("");

// 1コマ分：絵・番号・時間・ショットの差し替え・秒数・場面の説明
const cellHtml = (it, i, start, total) => {
  const shot = getShot(it.id);
  return `<li class="cell" data-uid="${it.uid}">
    <div class="cell__frame">${frameHtml(shot)}</div>
    <div class="cell__head">
      <span class="cell__no">${String(i + 1).padStart(2, "0")}</span>
      <span class="cell__time">${fmt(start)}–${fmt(start + it.dur)}</span>
      <div class="cell__ops">
        <button type="button" data-move="-1" aria-label="${t("prev")}"${i === 0 ? " disabled" : ""}>←</button>
        <button type="button" data-move="1" aria-label="${t("next")}"${i === total - 1 ? " disabled" : ""}>→</button>
        <button type="button" data-remove aria-label="${t("remove")}">×</button>
      </div>
    </div>
    <select data-swap aria-label="${t("shot")}">${optionsFor(it.id)}</select>
    <label class="cell__dur">${t("seconds")}<input type="number" min="1" max="60" step="1" value="${it.dur}" data-dur></label>
    <textarea data-desc rows="3" aria-label="${t("descLabel")}">${esc(it.desc)}</textarea>
  </li>`;
};

export const initBoardView = () => {
  const list = $("board");

  const render = (items) => {
    let sec = 0;
    list.innerHTML = items.map((it, i) => {
      const html = cellHtml(it, i, sec, items.length);
      sec += it.dur;
      return html;
    }).join("");
    $("board-empty").hidden = items.length > 0;
    $("board-count").textContent = String(items.length);
    $("board-total").textContent = items.length ? t("total")(items.length, sec) : "";
  };

  list.addEventListener("click", (e) => {
    const cell = e.target.closest(".cell");
    if (!cell) return;
    const move = e.target.closest("[data-move]");
    if (move) store.moveItem(cell.dataset.uid, Number(move.dataset.move));
    if (e.target.closest("[data-remove]")) store.removeItem(cell.dataset.uid);
  });
  list.addEventListener("change", (e) => {
    const cell = e.target.closest(".cell");
    if (!cell) return;
    if (e.target.matches("[data-swap]")) store.swapItem(cell.dataset.uid, e.target.value);
    if (e.target.matches("[data-dur]")) {
      const dur = Math.min(60, Math.max(1, Math.round(Number(e.target.value) || 1)));
      store.updateItem(cell.dataset.uid, { dur });
    }
  });
  // 説明文は入力のたびに描き直すと入力中のカーソルが飛ぶので、フォーカスが外れたときに保存する
  list.addEventListener("focusout", (e) => {
    const cell = e.target.closest(".cell");
    if (cell && e.target.matches("[data-desc]")) store.updateItem(cell.dataset.uid, { desc: e.target.value.trim() });
  });

  $("seed-btn").addEventListener("click", () => {
    store.replaceItems(SEED);
    track("seed");
  });
  $("clear-btn").addEventListener("click", () => store.clearItems());

  const exporters = {
    prompt: (items) => copyText(boardPrompt(items), t("copiedPrompt")),
    png: async (items) => {
      try {
        const { svg, width, height } = await sheetSvg(items);
        await downloadSvgAsPng(svg, width, height, "storyboard.png");
      } catch (err) {
        console.error("PNG書き出しに失敗:", err);
        toast(t("pngFailed"));
      }
    },
    json: (items) => {
      downloadText(scenarioJson(items, t("boardTitle")), "storyboard-scenario.json", "application/json");
      toast(t("jsonSaved"));
    },
  };
  document.querySelector("#view-board .toolbar__actions").addEventListener("click", (e) => {
    const btn = e.target.closest("[data-export]");
    if (!btn) return;
    const items = store.getItems();
    if (items.length === 0) return toast(t("addFirst"));
    exporters[btn.dataset.export](items);
    track(btn.dataset.export === "prompt" ? "copy" : "export", { scope: "board", format: btn.dataset.export, shot_count: items.length });
  });

  store.subscribe(render);
  render(store.getItems());
};
