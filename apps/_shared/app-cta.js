(function () {
  var box = document.getElementById("app-cta");
  if (!box) return;
  if (/Android/i.test(navigator.userAgent)) { box.remove(); return; }
  box.querySelector(".app-cta__btn").addEventListener("click", function () {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: "quiz_maker_app_click", placement: "practice_app", app: box.getAttribute("data-app") || "" });
  });
})();
