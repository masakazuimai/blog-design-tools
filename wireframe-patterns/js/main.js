// 画面の配線（一覧／ビルダーの切り替え）
import { initGallery } from "./gallery.js?v=20261006f";
import { initDetail } from "./detail.js?v=20261006f";
import { initBuilderView } from "./builder-view.js?v=20261006f";
import { track } from "./ui.js?v=20261006f";

const openDetail = initDetail();
const builder = initBuilderView();
initGallery({ onOpen: openDetail });
builder.refreshCount();

const tabs = document.querySelectorAll(".view-tab");
const showView = (view) => {
  tabs.forEach((t) => t.setAttribute("aria-selected", String(t.dataset.view === view)));
  document.getElementById("view-gallery").hidden = view !== "gallery";
  document.getElementById("view-builder").hidden = view !== "builder";
  if (view === "builder") {
    builder.show();
    track("view_builder");
  }
};
tabs.forEach((t) => t.addEventListener("click", () => showView(t.dataset.view)));
