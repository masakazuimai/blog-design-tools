import { word, hue, CARD_CSS } from "./_shared.js?v=20261116a";
import { viewFallback } from "./fallback.js?v=20261116g";

const SUPPORT = {
  ja: "動きは CSS のスクロール連動（animation-timeline: view()）で作っています。Chrome・Edge は CSS だけで動き、まだ対応していないブラウザではコードの中の短い JS が同じ動きをします。",
  en: "The motion uses CSS scroll timelines (animation-timeline: view()). Chrome and Edge run it with CSS alone, and other browsers use the short JS in the code instead.",
};

const list = (p, n, lang) =>
  Array.from({ length: n }, (_, i) => `<li class="cg-card ${p}-card" style="--h: ${hue(i, n)}">${word(i, lang)}</li>`).join(
    "\n  "
  );

const SCROLLER = (p, w) => `.${p} {
  display: flex;
  gap: 12px;
  margin: 0;
  padding: 40px calc(50% - ${w / 2}px);
  list-style: none;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scrollbar-width: none;
}
.${p}-card {
  flex: 0 0 ${w}px;
  aspect-ratio: 3 / 4;
  scroll-snap-align: center;
}`;

const FIELDS = [
  { key: "n", label: { ja: "枚数", en: "Cards" }, min: 4, max: 12, step: 1, unit: "" },
  { key: "w", label: { ja: "カードの幅", en: "Card width" }, min: 140, max: 300, step: 10, unit: "px" },
];

const CENTER = {
  id: "center-zoom",
  demo: "x",
  cat: "scroll",
  method: "css-new",
  label: { ja: "中央が大きくなる", en: "Center zoom" },
  desc: {
    ja: "横に送ると、真ん中に来たカードだけが大きく、はっきりします。見本の中を横にスクロールして試してください。",
    en: "As you scroll sideways, the card in the middle grows and comes into focus. Scroll the preview to try it.",
  },
  support: SUPPORT,
  fields: [...FIELDS, { key: "min", label: { ja: "端の大きさ", en: "Edge scale" }, min: 50, max: 95, step: 5, unit: "%" }],
  defaults: { n: 8, w: 200, min: 75 },
  build(o, lang) {
    const p = "cg-zoom";
    return {
      html: `<ul class="${p}">
  ${list(p, o.n, lang)}
</ul>`,
      css: `${SCROLLER(p, o.w)}
@supports (animation-timeline: view()) {
  .${p}-card {
    animation: ${p}-focus linear both;
    animation-timeline: view(inline);
  }
}
@keyframes ${p}-focus {
  0%, 100% { scale: ${o.min / 100}; opacity: 0.5; }
  50% { scale: 1; opacity: 1; }
}
${CARD_CSS}`,
      js: viewFallback(`.${p}`, `card.style.scale = String(1 - t * ${(1 - o.min / 100).toFixed(2)});
      card.style.opacity = String(1 - t * 0.5);`),
    };
  },
};

const COVERFLOW = {
  id: "coverflow",
  demo: "x",
  cat: "scroll",
  method: "css-new",
  label: { ja: "カバーフロー", en: "Coverflow" },
  desc: {
    ja: "真ん中のカードは正面を向き、左右のカードは奥へ傾きます。横に送ると向きが変わります。",
    en: "The middle card faces you and the side cards tilt away. The angles change as you scroll.",
  },
  support: SUPPORT,
  fields: [...FIELDS, { key: "angle", label: { ja: "傾き", en: "Tilt" }, min: 20, max: 70, step: 5, unit: "°" }],
  defaults: { n: 8, w: 200, angle: 50 },
  build(o, lang) {
    const p = "cg-coverflow";
    return {
      html: `<ul class="${p}">
  ${list(p, o.n, lang)}
</ul>`,
      css: `${SCROLLER(p, o.w)}
@supports (animation-timeline: view()) {
  .${p}-card {
    animation: ${p}-tilt linear both;
    animation-timeline: view(inline);
  }
}
@keyframes ${p}-tilt {
  0% { transform: perspective(800px) rotateY(${o.angle}deg) scale(0.85); filter: brightness(0.7); }
  50% { transform: perspective(800px) rotateY(0deg) scale(1); filter: brightness(1); }
  100% { transform: perspective(800px) rotateY(-${o.angle}deg) scale(0.85); filter: brightness(0.7); }
}
${CARD_CSS}`,
      js: viewFallback(`.${p}`, `card.style.transform = "perspective(800px) rotateY(" + s * ${o.angle} + "deg) scale(" + (1 - t * 0.15) + ")";
      card.style.filter = "brightness(" + (1 - t * 0.3) + ")";`),
    };
  },
};

export const SCROLL = [CENTER, COVERFLOW];
