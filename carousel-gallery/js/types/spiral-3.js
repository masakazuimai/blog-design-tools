import { word, hue, CARD_CSS } from "./_shared.js?v=20261116a";

const pos = (o, t) =>
  `translateY(${Math.round(o.rise - 2 * o.rise * t)}px) rotateY(${(o.turns * t).toFixed(4)}turn) translateZ(${Math.round(
    o.r0 + (o.r1 - o.r0) * t
  )}px)`;

const steppedKeys = (name, o) => {
  const lines = [];
  for (let k = 0; k < o.n; k += 1) {
    const a = ((k / o.n) * 100).toFixed(3);
    const b = (((k + 0.55) / o.n) * 100).toFixed(3);
    lines.push(`  ${a}%, ${b}% { transform: ${pos(o, k / o.n)}; animation-timing-function: cubic-bezier(0.6, 0, 0.3, 1); }`);
  }
  lines.push(`  100% { transform: ${pos(o, 1)}; }`);
  return `@keyframes ${name} {\n${lines.join("\n")}\n}`;
};

const fadeKeys = (name, n) => `@keyframes ${name} {
  0% { opacity: 0; }
  ${((1 / n) * 100).toFixed(3)}% { opacity: 1; }
  ${(((n - 1) / n) * 100).toFixed(3)}% { opacity: 1; }
  100% { opacity: 0; }
}`;

const smoothKeys = (name, o) => `@keyframes ${name} {
  from { transform: ${pos(o, 0)}; }
  to { transform: ${pos(o, 1)}; }
}
@keyframes ${name}-fade {
  0%, 100% { opacity: 0; }
  8%, 92% { opacity: 1; }
}`;

const build = (p, o, lang, keys, fade, tilt, height) => {
  const items = Array.from(
    { length: o.n },
    (_, i) =>
      `<div class="${p}-item" style="--i: ${i}; --h: ${hue(i, o.n)}"><div class="cg-card">${word(i, lang)}</div><div class="${p}-back" aria-hidden="true"></div></div>`
  ).join("\n    ");
  return {
    html: `<div class="${p}-stage">
  <div class="${p}" style="--n: ${o.n}">
    ${items}
  </div>
</div>`,
    css: `.${p}-stage {
  --s: 1;
  display: grid;
  place-items: center;
  min-height: calc(${height}px * var(--s));
  overflow: hidden;
  perspective: 1100px;
}
@media (max-width: 600px) {
  .${p}-stage { --s: 0.5; }
}
.${p} {
  --dur: ${o.dur}s;
  position: relative;
  width: 140px;
  height: 90px;
  transform-style: preserve-3d;
  transform: rotateX(-${tilt}deg) scale(var(--s));
}
.${p}-item {
  position: absolute;
  inset: 0;
  transform-style: preserve-3d;
  animation: ${p}-climb var(--dur) linear infinite;
}
.${p}-item > * {
  position: absolute;
  inset: 0;
  backface-visibility: hidden;
  animation: ${fade} var(--dur) linear infinite;
}
.${p}-item, .${p}-item > * {
  animation-delay: calc(var(--dur) / var(--n) * var(--i) * -1);
}
.${p}-back {
  transform: rotateY(180deg);
  border-radius: 12px;
  background: oklch(0.42 0.06 var(--h));
}
.${p}:hover .${p}-item,
.${p}:hover .${p}-item > * {
  animation-play-state: paused;
}
${keys}
@media (prefers-reduced-motion: reduce) {
  .${p}-item, .${p}-item > * { animation-play-state: paused; }
}
${CARD_CSS}`,
    js: "",
  };
};

const STAIRS = {
  id: "spiral-stairs",
  cat: "spiral",
  method: "css",
  thumbZoom: 0.32,
  label: { ja: "螺旋階段", en: "Spiral staircase" },
  desc: {
    ja: "カードが螺旋の上を1段ずつ止まりながら昇ります。止まるたびに正面のカードが読めます。",
    en: "Cards climb a spiral one step at a time, pausing so the front card can be read.",
  },
  fields: [
    { key: "n", label: { ja: "枚数", en: "Cards" }, min: 6, max: 16, step: 1, unit: "" },
    { key: "dur", label: { ja: "1巡の長さ", en: "Loop length" }, min: 8, max: 48, step: 2, unit: "s" },
    { key: "turns", label: { ja: "周回の数", en: "Turns" }, min: 1, max: 3, step: 0.5, unit: "" },
  ],
  defaults: { n: 10, dur: 20, turns: 2 },
  build(o, lang) {
    const cfg = { ...o, r0: 220, r1: 220, rise: 220 };
    const p = "cg-stairs";
    return build(p, o, lang, `${steppedKeys(`${p}-climb`, cfg)}\n${fadeKeys(`${p}-fade`, o.n)}`, `${p}-fade`, 16, 580);
  },
};

const CONE = {
  id: "cone",
  cat: "spiral",
  method: "css",
  thumbZoom: 0.32,
  label: { ja: "円錐", en: "Cone" },
  desc: {
    ja: "下では大きく広がり、上へ行くほどすぼまる円錐の形で、カードが回りながら昇ります。",
    en: "Cards spin upward along a cone that is wide at the bottom and narrow at the top.",
  },
  fields: [
    { key: "n", label: { ja: "枚数", en: "Cards" }, min: 8, max: 24, step: 1, unit: "" },
    { key: "dur", label: { ja: "1巡の長さ", en: "Loop length" }, min: 8, max: 48, step: 2, unit: "s" },
    { key: "r0", label: { ja: "下の半径", en: "Bottom radius" }, min: 160, max: 340, step: 10, unit: "px" },
    { key: "turns", label: { ja: "周回の数", en: "Turns" }, min: 1, max: 5, step: 0.5, unit: "" },
  ],
  defaults: { n: 16, dur: 24, r0: 280, turns: 3 },
  build(o, lang) {
    const cfg = { ...o, r1: 30, rise: 220 };
    const p = "cg-cone";
    return build(p, o, lang, smoothKeys(`${p}-climb`, cfg), `${p}-climb-fade`, 10, 580);
  },
};

export const SPIRAL_3 = [STAIRS, CONE];
