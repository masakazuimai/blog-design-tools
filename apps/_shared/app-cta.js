(function () {
  var line = document.querySelector(".app-line");
  if (!line) return;
  if (/Android/i.test(navigator.userAgent)) { line.remove(); return; }
  line.querySelector("a").addEventListener("click", function () {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: "app_link_click", app: "programming-drill", placement: "practice_app_complete", page: location.pathname });
  });
})();
(function () {
  var box = document.getElementById("app-cta");
  if (!box) return;
  var chip = document.querySelector(".app-chip");
  if (/Android/i.test(navigator.userAgent)) { box.remove(); if (chip) chip.remove(); return; }
  if (chip) {
    chip.addEventListener("click", function (e) {
      e.preventDefault();
      var still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      box.scrollIntoView({ behavior: still ? "auto" : "smooth", block: "center" });
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ event: "quiz_maker_app_chip", app: box.getAttribute("data-app") || "" });
    });
  }
  box.querySelector(".app-cta__btn").addEventListener("click", function () {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: "quiz_maker_app_click", placement: "practice_app", app: box.getAttribute("data-app") || "" });
  });
})();
