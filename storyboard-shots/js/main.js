// 画面の配線（ショット一覧／絵コンテの切り替え）
import { initGallery } from "./gallery.js?v=20261006l";
import { initDetail } from "./detail.js?v=20261006l";
import { initBoardView } from "./board-view.js?v=20261006l";
import { track } from "./ui.js?v=20261006l";

const openDetail = initDetail();
initBoardView();
initGallery({ onOpen: openDetail });

const tabs = document.querySelectorAll(".view-tab");
const showView = (view) => {
  tabs.forEach((t) => t.setAttribute("aria-selected", String(t.dataset.view === view)));
  document.getElementById("view-gallery").hidden = view !== "gallery";
  document.getElementById("view-board").hidden = view !== "board";
  if (view === "board") track("view_board");
};
tabs.forEach((t) => t.addEventListener("click", () => showView(t.dataset.view)));
