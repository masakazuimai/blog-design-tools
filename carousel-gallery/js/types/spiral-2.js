import { word, hue, CARD_CSS } from "./_shared.js?v=20261116a";

const SWIRL = {
  id: "swirl",
  cat: "spiral",
  method: "css",
  thumbZoom: 0.45,
  label: { ja: "渦巻き", en: "Swirl" },
  desc: {
    ja: "カードが中心から渦を描いて外へ広がり、大きくなりながら消えていきます。平面の螺旋です。",
    en: "Cards spiral out from the center, growing as they go, then fade away. A flat spiral.",
  },
  fields: [
    { key: "n", label: { ja: "枚数", en: "Cards" }, min: 6, max: 20, step: 1, unit: "" },
    { key: "dur", label: { ja: "1巡の長さ", en: "Loop length" }, min: 8, max: 40, step: 2, unit: "s" },
    { key: "r", label: { ja: "広がる大きさ", en: "Spread" }, min: 120, max: 300, step: 10, unit: "px" },
    { key: "turns", label: { ja: "回る数", en: "Turns" }, min: 0.5, max: 3, step: 0.5, unit: "" },
  ],
  defaults: { n: 12, dur: 18, r: 240, turns: 1.5 },
  build(o, lang) {
    const p = "cg-swirl";
    const items = Array.from(
      { length: o.n },
      (_, i) => `<li class="cg-card ${p}-card" style="--i: ${i}; --h: ${hue(i, o.n)}">${word(i, lang)}</li>`
    ).join("\n  ");
    return {
      html: `<ul class="${p}" style="--n: ${o.n}">
  ${items}
</ul>`,
      css: `.${p} {
  --dur: ${o.dur}s;
  --s: 1;
  position: relative;
  height: calc(${o.r * 2 + 120}px * var(--s));
  margin: 0;
  padding: 0;
  list-style: none;
  overflow: hidden;
}
@media (max-width: 600px) {
  .${p} { --s: 0.6; }
}
.${p}-card {
  position: absolute;
  left: 50%;
  top: 50%;
  width: calc(130px * var(--s));
  aspect-ratio: 4 / 3;
  margin: calc(-49px * var(--s)) 0 0 calc(-65px * var(--s));
  animation: ${p}-out var(--dur) linear infinite;
  animation-delay: calc(var(--dur) / var(--n) * var(--i) * -1);
}
.${p}:hover .${p}-card {
  animation-play-state: paused;
}
@keyframes ${p}-out {
  0% { transform: rotate(0turn) translateX(0px) rotate(0turn) scale(0.2); opacity: 0; }
  10% { opacity: 1; }
  85% { opacity: 1; }
  100% { transform: rotate(${o.turns}turn) translateX(calc(${o.r}px * var(--s))) rotate(-${o.turns}turn) scale(1); opacity: 0; }
}
@media (prefers-reduced-motion: reduce) {
  .${p}-card { animation-play-state: paused; }
}
${CARD_CSS}`,
      js: "",
    };
  },
};

export const SPIRAL_2 = [SWIRL];
