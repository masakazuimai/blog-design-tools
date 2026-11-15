import { word, hue, CARD_CSS } from "./_shared.js?v=20261116a";

const FACE_CSS = (p) => `.${p}-item > * {
  position: absolute;
  inset: 0;
  backface-visibility: hidden;
  animation: ${p}-fade var(--dur) linear infinite;
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
@keyframes ${p}-fade {
  0%, 100% { opacity: 0; }
  8%, 92% { opacity: 1; }
}
@media (prefers-reduced-motion: reduce) {
  .${p}-item, .${p}-item > * { animation-play-state: paused; }
}`;

const item = (p, i, n, lang, extra = "") =>
  `<div class="${p}-item" style="--i: ${i}; --h: ${hue(i, n)}${extra}"><div class="cg-card">${word(i, lang)}</div><div class="${p}-back" aria-hidden="true"></div></div>`;

const stage = (p, inner) => `<div class="${p}-stage">
  ${inner}
</div>`;

const STAGE_CSS = (p, tilt, w, height) => `.${p}-stage {
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
  position: relative;
  width: ${w}px;
  height: ${Math.round(w * 0.64)}px;
  transform-style: preserve-3d;
  transform: rotateX(-${tilt}deg) scale(var(--s));
}
.${p}-item {
  position: absolute;
  inset: 0;
  transform-style: preserve-3d;
  animation: ${p}-climb var(--dur) linear infinite;
}`;

const HELIX = {
  id: "helix",
  cat: "spiral",
  thumbZoom: 0.3,
  method: "css",
  label: { ja: "螺旋（ヘリックス）", en: "Helix" },
  desc: {
    ja: "カードがらせんを描いて、下から上へ昇り続けます。マウスを乗せると止まります。",
    en: "Cards climb a spiral from bottom to top, forever. Hover to pause.",
  },
  fields: [
    { key: "n", label: { ja: "枚数", en: "Cards" }, min: 6, max: 24, step: 1, unit: "" },
    { key: "dur", label: { ja: "1巡の長さ", en: "Loop length" }, min: 8, max: 48, step: 2, unit: "s" },
    { key: "r", label: { ja: "半径", en: "Radius" }, min: 120, max: 320, step: 10, unit: "px" },
    { key: "rise", label: { ja: "高さ", en: "Height" }, min: 120, max: 320, step: 10, unit: "px" },
    { key: "turns", label: { ja: "周回の数", en: "Turns" }, min: 1, max: 4, step: 0.5, unit: "" },
  ],
  defaults: { n: 12, dur: 24, r: 220, rise: 220, turns: 2 },
  build(o, lang) {
    const p = "cg-helix";
    const items = Array.from({ length: o.n }, (_, i) => item(p, i, o.n, lang)).join("\n    ");
    return {
      html: stage(p, `<div class="${p}" style="--n: ${o.n}">\n    ${items}\n  </div>`),
      css: `${STAGE_CSS(p, 14, 150, o.rise * 2 + 140)}
.${p} {
  --r: ${o.r}px;
  --rise: ${o.rise}px;
  --dur: ${o.dur}s;
  --turns: ${o.turns};
}
@keyframes ${p}-climb {
  from { transform: translateY(var(--rise)) rotateY(0turn) translateZ(var(--r)); }
  to { transform: translateY(calc(var(--rise) * -1)) rotateY(calc(var(--turns) * 1turn)) translateZ(var(--r)); }
}
${FACE_CSS(p)}
${CARD_CSS}`,
      js: "",
    };
  },
};

const TORNADO = {
  id: "tornado",
  cat: "spiral",
  thumbZoom: 0.3,
  method: "css",
  label: { ja: "トルネード", en: "Tornado" },
  desc: {
    ja: "下では細く、上へ行くほど大きく広がる輪を描いて巻き上がります。",
    en: "Cards whirl upward on a spiral that widens toward the top.",
  },
  fields: [
    { key: "n", label: { ja: "枚数", en: "Cards" }, min: 8, max: 24, step: 1, unit: "" },
    { key: "dur", label: { ja: "1巡の長さ", en: "Loop length" }, min: 6, max: 40, step: 2, unit: "s" },
    { key: "r0", label: { ja: "下の半径", en: "Bottom radius" }, min: 20, max: 200, step: 10, unit: "px" },
    { key: "r1", label: { ja: "上の半径", en: "Top radius" }, min: 160, max: 360, step: 10, unit: "px" },
    { key: "turns", label: { ja: "周回の数", en: "Turns" }, min: 1, max: 5, step: 0.5, unit: "" },
  ],
  defaults: { n: 16, dur: 24, r0: 80, r1: 270, turns: 3 },
  build(o, lang) {
    const p = "cg-tornado";
    const items = Array.from({ length: o.n }, (_, i) => item(p, i, o.n, lang)).join("\n    ");
    return {
      html: stage(p, `<div class="${p}" style="--n: ${o.n}">\n    ${items}\n  </div>`),
      css: `${STAGE_CSS(p, 24, 130, 600)}
.${p} {
  --r0: ${o.r0}px;
  --r1: ${o.r1}px;
  --rise: 220px;
  --dur: ${o.dur}s;
  --turns: ${o.turns};
}
@keyframes ${p}-climb {
  from { transform: translateY(var(--rise)) rotateY(0turn) translateZ(var(--r0)); }
  to { transform: translateY(calc(var(--rise) * -1)) rotateY(calc(var(--turns) * 1turn)) translateZ(var(--r1)); }
}
${FACE_CSS(p)}
${CARD_CSS}`,
      js: "",
    };
  },
};

const DNA = {
  id: "dna",
  cat: "spiral",
  thumbZoom: 0.3,
  method: "css",
  label: { ja: "二重螺旋", en: "Double helix" },
  desc: {
    ja: "2本のらせんが反対側から絡みながら昇ります。向かい合うカードは線でつながります。",
    en: "Two strands twist around each other as they climb, linked by thin rungs.",
  },
  fields: [
    { key: "n", label: { ja: "1本の枚数", en: "Cards per strand" }, min: 4, max: 14, step: 1, unit: "" },
    { key: "dur", label: { ja: "1巡の長さ", en: "Loop length" }, min: 8, max: 48, step: 2, unit: "s" },
    { key: "r", label: { ja: "半径", en: "Radius" }, min: 100, max: 280, step: 10, unit: "px" },
    { key: "turns", label: { ja: "周回の数", en: "Turns" }, min: 1, max: 4, step: 0.5, unit: "" },
  ],
  defaults: { n: 10, dur: 24, r: 180, turns: 2 },
  build(o, lang) {
    const p = "cg-dna";
    const total = o.n * 2;
    const rows = [];
    for (let i = 0; i < o.n; i += 1) {
      rows.push(item(p, i, total, lang, "; --s: 0").replace(`--h: ${hue(i, total)}`, `--h: ${hue(i * 2, total)}`));
      rows.push(
        item(p, i, total, lang, "; --s: 1")
          .replace(`--h: ${hue(i, total)}`, `--h: ${hue(i * 2 + 1, total)}`)
          .replace(`>${word(i, lang)}<`, `>${word(i + o.n, lang)}<`)
      );
      rows.push(`<div class="${p}-rung" style="--i: ${i}" aria-hidden="true"></div>`);
    }
    return {
      html: stage(p, `<div class="${p}" style="--n: ${o.n}">\n    ${rows.join("\n    ")}\n  </div>`),
      css: `${STAGE_CSS(p, 12, 130, 620)}
.${p} {
  --r: ${o.r}px;
  --rise: 230px;
  --dur: ${o.dur}s;
  --turns: ${o.turns};
}
@keyframes ${p}-climb {
  from { transform: translateY(var(--rise)) rotateY(calc(var(--s) * 0.5turn)) translateZ(var(--r)); }
  to { transform: translateY(calc(var(--rise) * -1)) rotateY(calc(var(--s) * 0.5turn + var(--turns) * 1turn)) translateZ(var(--r)); }
}
.${p}-rung {
  position: absolute;
  left: 50%;
  top: 50%;
  transform-style: preserve-3d;
  animation: ${p}-turn var(--dur) linear infinite;
  animation-delay: calc(var(--dur) / var(--n) * var(--i) * -1);
}
.${p}-rung::before {
  content: "";
  position: absolute;
  left: calc(var(--r) * -1);
  width: calc(var(--r) * 2);
  height: 2px;
  background: rgb(19 48 47 / 0.35);
  transform: rotateY(90deg);
  animation: ${p}-fade var(--dur) linear infinite;
  animation-delay: inherit;
}
.${p}:hover .${p}-rung,
.${p}:hover .${p}-rung::before {
  animation-play-state: paused;
}
@keyframes ${p}-turn {
  from { transform: translateY(var(--rise)) rotateY(0turn); }
  to { transform: translateY(calc(var(--rise) * -1)) rotateY(calc(var(--turns) * 1turn)); }
}
${FACE_CSS(p)}
@media (prefers-reduced-motion: reduce) {
  .${p}-rung, .${p}-rung::before { animation-play-state: paused; }
}
${CARD_CSS}`,
      js: "",
    };
  },
};

const SCROLL_HELIX = {
  id: "scroll-helix",
  cat: "spiral",
  thumbZoom: 0.3,
  method: "css-js",
  scroll: true,
  label: { ja: "スクロールで昇る螺旋", en: "Scroll-driven helix" },
  desc: {
    ja: "ページを下へ送った分だけ、らせんが回ってカードが昇ります。見本の中をスクロールして試してください。",
    en: "The spiral turns and the cards climb as you scroll. Scroll inside the preview to try it.",
  },
  support: {
    ja: "CSS のスクロール連動（animation-timeline）は Chrome・Edge が対応しています。対応していないブラウザでは、コードの中の短い JS が同じ動きをします。",
    en: "CSS scroll timelines (animation-timeline) work in Chrome and Edge. In other browsers, the short JS in the code does the same job.",
  },
  fields: [
    { key: "n", label: { ja: "枚数", en: "Cards" }, min: 8, max: 24, step: 1, unit: "" },
    { key: "r", label: { ja: "半径", en: "Radius" }, min: 120, max: 300, step: 10, unit: "px" },
    { key: "angle", label: { ja: "1枚ごとの角度", en: "Angle per card" }, min: 20, max: 60, step: 5, unit: "°" },
  ],
  defaults: { n: 14, r: 200, angle: 40 },
  build(o, lang) {
    const p = "cg-shelix";
    const step = 34;
    const total = (o.n - 1) * step;
    const k = Math.round(o.n / 2);
    const items = Array.from(
      { length: o.n },
      (_, i) => `<div class="cg-card ${p}-card" style="--i: ${i}; --h: ${hue(i, o.n)}">${word(i, lang)}</div>`
    ).join("\n        ");
    const from = `translateY(${total / 2}px) rotateY(0deg)`;
    return {
      html: `<div class="${p}-track">
  <div class="${p}-sticky">
    <div class="${p}">
      <div class="${p}-spin">
        ${items}
      </div>
    </div>
  </div>
</div>`,
      css: `.${p}-track {
  height: 300vh;
}
.${p}-sticky {
  position: sticky;
  top: 0;
  height: 100vh;
  display: grid;
  place-items: center;
  overflow: hidden;
  perspective: 1100px;
}
.${p} {
  --r: ${o.r}px;
  --step: ${step}px;
  --angle: ${o.angle}deg;
  width: 140px;
  height: 90px;
  transform-style: preserve-3d;
  transform: rotateX(-14deg);
}
@media (max-width: 600px) {
  .${p} { transform: rotateX(-14deg) scale(0.6); }
}
.${p}-spin {
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  transform: ${from};
}
.${p}-card {
  position: absolute;
  inset: 0;
  transform: translateY(calc(var(--i) * var(--step) * -1)) rotateY(calc(var(--i) * var(--angle))) translateZ(var(--r));
}
@supports (animation-timeline: scroll()) {
  .${p}-spin {
    animation: ${p}-screw linear both;
    animation-timeline: scroll(root);
  }
}
@keyframes ${p}-screw {
  from { transform: ${from}; }
  to { transform: translateY(${total / 2 - k * step}px) rotateY(${k * o.angle}deg); }
}
${CARD_CSS}`,
      js: `if (!CSS.supports("animation-timeline: scroll()")) {
  const spin = document.querySelector(".${p}-spin");
  const update = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    const t = max > 0 ? scrollY / max : 0;
    spin.style.transform = "translateY(" + (${total / 2} - t * ${k * step}) + "px) rotateY(" + t * ${k * o.angle} + "deg)";
  };
  addEventListener("scroll", update, { passive: true });
  update();
}`,
    };
  },
};

export const SPIRAL = [TORNADO, HELIX, DNA, SCROLL_HELIX];
