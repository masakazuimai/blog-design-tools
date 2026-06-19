/* CodeQuest 共通 AdSense ローダー（単一ホスティング）
 *
 * 各ページは広告枠として
 *   <ins class="adsbygoogle" data-ad-client="ca-pub-4871781946658288" data-ad-slot="..."></ins>
 * を置き、ページ末尾で
 *   <script defer src="https://codequest.work/generator/_shared/adsense.js"></script>
 * を読み込むだけ。ページ側の個別 push / adsbygoogle.js 読み込みは不要。
 *
 * 役割:
 *   ① adsbygoogle.js を1度だけ読み込む（async 競合の解消）
 *   ② 枠の幅が確定してから push（availableWidth=0 レースの防止）
 *   ③ 二重 push 防止＋SPA/動的追加への対応（MutationObserver）
 *   no-fill 時は空枠を折りたたむ（display:none）。再 push は一切しない。
 */
(function () {
  var CLIENT = "ca-pub-4871781946658288";
  var SRC =
    "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=" +
    CLIENT;

  // ① adsbygoogle.js を1度だけ読み込む
  function ensureScript() {
    if (
      document.querySelector(
        'script[src^="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"]'
      )
    ) {
      return;
    }
    var s = document.createElement("script");
    s.async = true;
    s.src = SRC;
    s.crossOrigin = "anonymous";
    document.head.appendChild(s);
  }

  // ② 幅が確定するまで待ってから push（1枠1回のみ）
  function fillSlot(ins, tries) {
    // ③ 二重 push 防止（自前の目印）
    if (ins.getAttribute("data-cq-init") === "1") return;
    // すでに AdSense が処理済みの枠は対象外
    if (ins.getAttribute("data-adsbygoogle-status")) {
      ins.setAttribute("data-cq-init", "1");
      return;
    }
    var el = ins.getBoundingClientRect().width ? ins : ins.parentElement;
    var width = el ? el.getBoundingClientRect().width : 0;
    if (!width) {
      // まだ幅が確定していない → 一定回数まで次フレームで再試行（push はしない）。
      // 上限到達後は無限ループを避け、以降の幅変化（レイアウト確定・リサイズ）で一度だけ再試行。
      tries = tries || 0;
      if (tries < 120) {
        requestAnimationFrame(function () {
          fillSlot(ins, tries + 1);
        });
      } else if (typeof ResizeObserver !== "undefined" && el) {
        var ro = new ResizeObserver(function () {
          if ((el.getBoundingClientRect().width || 0) > 0) {
            ro.disconnect();
            fillSlot(ins);
          }
        });
        ro.observe(el);
      }
      return;
    }
    ins.setAttribute("data-cq-init", "1");
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      /* no-op */
    }
    // no-fill 時は空枠を折りたたむ（再リクエストはしない）
    setTimeout(function () {
      if (ins.getAttribute("data-ad-status") === "unfilled") {
        ins.style.display = "none";
      }
    }, 3000);
  }

  function scan() {
    var list = document.querySelectorAll("ins.adsbygoogle");
    for (var i = 0; i < list.length; i++) fillSlot(list[i]);
  }

  function start() {
    ensureScript();
    scan();
    // ③ SPA 遷移・動的挿入された枠にも対応
    if (typeof MutationObserver !== "undefined") {
      new MutationObserver(scan).observe(document.body, {
        childList: true,
        subtree: true,
      });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})();
