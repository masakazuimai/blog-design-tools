import { word, hue, CARD_CSS } from "./_shared.js?v=20261116a";

const SUPPORT = {
  ja: "CSS のスクロール連動（animation-timeline: view()）は Chrome・Edge が対応しています。対応していないブラウザでは、動きの無いスクロールスナップとして動きます。",
  en: "CSS view timelines (animation-timeline: view()) work in Chrome and Edge. Other browsers show a plain scroll-snap carousel without the effect.",
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
      js: "",
    };
  },
};

const COVERFLOW = {
  id: "coverflow",
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
      js: "",
    };
  },
};

export const SCROLL = [CENTER, COVERFLOW];
