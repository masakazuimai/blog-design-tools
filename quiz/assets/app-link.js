import { APP_LIVE, APP_FALLBACK_URL, APP_SCHEME } from "./config.js?v=20261109a";
import { track } from "./store.js?v=20261109a";

function openApp(deckId) {
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
      window.location.href = APP_FALLBACK_URL;
    }
  }, 1500);
  window.location.href = APP_SCHEME + encodeURIComponent(deckId);
}

export function setupAppLinks() {
  document.querySelectorAll("[data-app-cta]").forEach((box) => {
    if (!APP_LIVE) {
      box.hidden = true;
      return;
    }
    box.hidden = false;
    const link = box.querySelector("[data-app-link]");
    if (!link) return;
    const deckId = box.dataset.deckId || "";
    link.href = APP_FALLBACK_URL;
    link.addEventListener("click", (event) => {
      event.preventDefault();
      track("quiz_app_click", { deck_id: deckId, placement: box.dataset.placement || "" });
      openApp(deckId);
    });
  });
}
