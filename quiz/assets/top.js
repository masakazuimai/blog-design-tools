import { load, tally } from "./store.js?v=20261109a";
import { setupAppLinks } from "./app-link.js?v=20261109a";

function paint(row) {
  const count = Number(row.dataset.count) || 0;
  const { results } = load(row.dataset.deckId);
  const { ok, ng, done } = tally(results, Object.keys(results));
  const shown = Math.min(done, count);
  if (shown === 0 || count === 0) return;
  const meter = row.querySelector("[data-meter]");
  const status = row.querySelector("[data-status]");
  if (meter) meter.style.width = Math.round((shown / count) * 100) + "%";
  if (status) status.textContent = shown + " / " + count + "問 解いた（正解 " + ok + "・間違い " + ng + "）";
  row.classList.add("is-started");
}

document.querySelectorAll(".deck[data-deck-id]").forEach(paint);
setupAppLinks();
