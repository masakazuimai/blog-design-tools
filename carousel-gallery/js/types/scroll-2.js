import { word, hue, CARD_CSS } from "./_shared.js?v=20261116a";
import { viewFallback } from "./fallback.js?v=20261116g";

const PARALLAX = {
  id: "parallax",
  demo: "x",
  cat: "scroll",
  method: "css-new",
  label: { ja: "パララックス", en: "Parallax" },
  desc: {
    ja: "横に送ると、カードの中の絵が枠より少し遅れて動き、奥行きが出ます。見本の中を横にスクロールして試してください。",
    en: "As you scroll sideways, the art inside each card lags behind its frame, adding depth. Scroll the preview to try it.",
  },
  support: {
    ja: "動きは CSS のスクロール連動（view-timeline）で作っています。Chrome・Edge は CSS だけで動き、まだ対応していないブラウザではコードの中の短い JS が同じ動きをします。",
    en: "The motion uses CSS view timelines. Chrome and Edge run it with CSS alone, and other browsers use the short JS in the code instead.",
  },
  fields: [
    { key: "n", label: { ja: "枚数", en: "Cards" }, min: 4, max: 10, step: 1, unit: "" },
    { key: "depth", label: { ja: "ずれの大きさ", en: "Depth" }, min: 10, max: 40, step: 5, unit: "%" },
  ],
  defaults: { n: 6, depth: 25 },
  build(o, lang) {
    const p = "cg-parallax";
    const items = Array.from(
      { length: o.n },
      (_, i) =>
        `<li class="${p}-card" style="--h: ${hue(i, o.n)}"><span class="${p}-art" aria-hidden="true"></span><span class="${p}-label">${word(i, lang)}</span></li>`
    ).join("\n  ");
    return {
      html: `<ul class="${p}">
  ${items}
</ul>`,
      css: `.${p} {
  display: flex;
  gap: 16px;
  margin: 0;
  padding: 32px calc(50% - 130px);
  list-style: none;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scrollbar-width: none;
}
.${p}-card {
  position: relative;
  flex: 0 0 260px;
  aspect-ratio: 3 / 4;
  border-radius: 14px;
  overflow: hidden;
  scroll-snap-align: center;
  view-timeline: --${p}-card inline;
}
.${p}-art {
  position: absolute;
  inset: 0 -${o.depth}%;
  background:
    radial-gradient(circle at 20% 30%, oklch(0.9 0.08 var(--h)) 0 10%, transparent 11%),
    radial-gradient(circle at 70% 60%, oklch(0.85 0.1 calc(var(--h) + 60)) 0 14%, transparent 15%),
    radial-gradient(circle at 40% 85%, oklch(0.8 0.1 calc(var(--h) + 120)) 0 8%, transparent 9%),
    linear-gradient(150deg, oklch(0.62 0.14 var(--h)), oklch(0.42 0.14 calc(var(--h) + 40)));
}
.${p}-label {
  position: absolute;
  left: 14px;
  bottom: 12px;
  color: #fff;
  font-weight: 700;
  font-size: 16px;
}
@supports (animation-timeline: view()) {
  .${p}-art {
    animation: ${p}-shift linear both;
    animation-timeline: --${p}-card;
  }
}
@keyframes ${p}-shift {
  from { transform: translateX(-${o.depth / 2}%); }
  to { transform: translateX(${o.depth / 2}%); }
}`,
      js: viewFallback(`.${p}`, `card.firstElementChild.style.transform = "translateX(" + -s * ${o.depth / 2} + "%)";`),
    };
  },
};

const HSCROLL = {
  id: "horizontal-section",
  demo: "y",
  cat: "scroll",
  method: "css-js",
  scroll: true,
  label: { ja: "縦に送ると横に流れる", en: "Scroll down, move sideways" },
  desc: {
    ja: "ページを下へ送ると、画面に固定された列が横へ流れます。見本の中を下へスクロールして試してください。",
    en: "Scrolling down moves a pinned row sideways. Scroll down inside the preview to try it.",
  },
  support: {
    ja: "CSS のスクロール連動（animation-timeline: scroll()）は Chrome・Edge が対応しています。対応していないブラウザでは、コードの中の短い JS が同じ動きをします。",
    en: "CSS scroll timelines work in Chrome and Edge. In other browsers, the short JS in the code does the same job.",
  },
  fields: [
    { key: "n", label: { ja: "枚数", en: "Cards" }, min: 4, max: 12, step: 1, unit: "" },
    { key: "len", label: { ja: "スクロールの長さ", en: "Scroll length" }, min: 200, max: 500, step: 50, unit: "vh" },
  ],
  defaults: { n: 8, len: 300 },
  build(o, lang) {
    const p = "cg-hscroll";
    const items = Array.from(
      { length: o.n },
      (_, i) => `<li class="cg-card ${p}-card" style="--h: ${hue(i, o.n)}">${word(i, lang)}</li>`
    ).join("\n      ");
    return {
      html: `<div class="${p}">
  <div class="${p}-sticky">
    <ul class="${p}-row">
      ${items}
    </ul>
  </div>
</div>`,
      css: `.${p} {
  height: ${o.len}vh;
}
.${p}-sticky {
  position: sticky;
  top: 0;
  height: 100vh;
  display: flex;
  align-items: center;
  overflow: hidden;
}
.${p}-row {
  display: flex;
  gap: 20px;
  width: max-content;
  margin: 0;
  padding: 0 5vw;
  list-style: none;
}
.${p}-card {
  flex: 0 0 min(320px, 70vw);
  aspect-ratio: 4 / 3;
}
@supports (animation-timeline: scroll()) {
  .${p}-row {
    animation: ${p}-move linear both;
    animation-timeline: scroll(root);
  }
}
@keyframes ${p}-move {
  to { transform: translateX(calc(-100% + 100vw)); }
}
${CARD_CSS}`,
      js: `if (!CSS.supports("animation-timeline: scroll()")) {
  const row = document.querySelector(".${p}-row");
  const update = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    const t = max > 0 ? scrollY / max : 0;
    row.style.transform = "translateX(" + -t * (row.scrollWidth - innerWidth) + "px)";
  };
  addEventListener("scroll", update, { passive: true });
  addEventListener("resize", update);
  update();
}`,
    };
  },
};

export const SCROLL_2 = [PARALLAX, HSCROLL];
