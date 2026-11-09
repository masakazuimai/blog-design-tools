import { track } from "./store.js?v=20261109b";

function openApp(deckId, url, scheme) {
  let left = false;
  const onHide = () => {
    left = true;
  };
  document.addEventListener("visibilitychange", onHide, { once: true });
  window.addEventListener("pagehide", onHide, { once: true });
  window.setTimeout(() => {
    document.removeEventListener("visibilitychange", onHide);
    window.removeEventListener("pagehide", onHide);
    if (!left && document.visibilityState === "visible") {
      window.location.href = url;
    }
  }, 1500);
  window.location.href = scheme + encodeURIComponent(deckId);
}

export function setupAppLinks() {
  document.querySelectorAll("[data-app-cta]").forEach((box) => {
    const url = box.dataset.appUrl || "";
    const scheme = box.dataset.appScheme || "";
    const link = box.querySelector("[data-app-link]");
    if (!url || !scheme || !link) return;
    box.hidden = false;
    const deckId = box.dataset.deckId || "";
    link.addEventListener("click", (event) => {
      event.preventDefault();
      track("quiz_app_click", { deck_id: deckId, placement: box.dataset.placement || "" });
      openApp(deckId, url, scheme);
    });
  });
}
