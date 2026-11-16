import { word, hue, CARD_CSS } from "./_shared.js?v=20261116a";

const FACES = (p) => `.${p}-item > * {
  position: absolute;
  inset: 0;
  backface-visibility: hidden;
}
.${p}-back {
  transform: rotateY(180deg);
  border-radius: 10px;
  background: oklch(0.42 0.06 var(--h));
}`;

const face = (p, i, n, lang, style) =>
  `<div class="${p}-item" style="--h: ${hue(i, n)}; ${style}"><div class="cg-card">${word(i, lang)}</div><div class="${p}-back" aria-hidden="true"></div></div>`;

const WAVE_FLOOR = {
  id: "wave-floor",
  cat: "3d",
  method: "css",
  thumbZoom: 0.45,
  label: { ja: "波打つ床", en: "Wavy floor" },
  desc: {
    ja: "床のように寝かせたカードの面が、斜めに波打ち続けます。キャンペーンの背景や作品の一覧に向いています。",
    en: "A grid of cards laid flat like a floor ripples in a diagonal wave. Good for campaign backdrops and portfolios.",
  },
  fields: [
    { key: "cols", label: { ja: "横の枚数", en: "Columns" }, min: 3, max: 8, step: 1, unit: "" },
    { key: "rows", label: { ja: "奥の枚数", en: "Rows" }, min: 2, max: 6, step: 1, unit: "" },
    { key: "amp", label: { ja: "波の高さ", en: "Wave height" }, min: 10, max: 80, step: 5, unit: "px" },
  ],
  defaults: { cols: 6, rows: 4, amp: 40 },
  build(o, lang) {
    const p = "cg-wfloor";
    const n = o.cols * o.rows;
    const items = Array.from({ length: n }, (_, i) => {
      const c = i % o.cols;
      const r = Math.floor(i / o.cols);
      return `<li class="cg-card ${p}-card" style="--h: ${hue(i, n)}; --d: ${c + r}">${word(i, lang)}</li>`;
    }).join("\n    ");
    return {
      html: `<div class="${p}-stage">
  <ul class="${p}" style="--cols: ${o.cols}">
    ${items}
  </ul>
</div>`,
      css: `.${p}-stage {
  --s: 1;
  display: grid;
  place-items: center;
  min-height: 520px;
  overflow: hidden;
  perspective: 1100px;
}
@media (max-width: 600px) {
  .${p}-stage { --s: 0.55; }
}
.${p} {
  display: grid;
  grid-template-columns: repeat(var(--cols), 88px);
  gap: 10px;
  margin: 0;
  padding: 0;
  list-style: none;
  transform-style: preserve-3d;
  transform: scale(var(--s)) rotateX(58deg) rotateZ(-28deg);
}
.${p}-card {
  aspect-ratio: 4 / 3;
  padding: 6px 8px;
  animation: ${p}-wave 3.2s ease-in-out infinite;
  animation-delay: calc(var(--d) * -0.25s);
  box-shadow: 0 18px 24px rgb(19 48 47 / 0.18);
}
.${p}:hover .${p}-card {
  animation-play-state: paused;
}
@keyframes ${p}-wave {
  0%, 100% { transform: translateZ(0); }
  50% { transform: translateZ(${o.amp}px); }
}
@media (prefers-reduced-motion: reduce) {
  .${p}-card { animation-play-state: paused; }
}
${CARD_CSS}`,
      js: "",
    };
  },
};

const MOBIUS = {
  id: "mobius",
  cat: "3d",
  method: "css",
  thumbZoom: 0.4,
  label: { ja: "メビウスの輪", en: "Möbius ring" },
  desc: {
    ja: "カードが半回転ねじれた輪に並び、輪ごとゆっくり回ります。表と裏がつながって見える不思議な形です。",
    en: "Cards line a ring with a half twist, and the whole ring slowly turns, so front and back seem to join.",
  },
  fields: [
    { key: "n", label: { ja: "枚数", en: "Cards" }, min: 12, max: 36, step: 2, unit: "" },
    { key: "dur", label: { ja: "1周の長さ", en: "Turn length" }, min: 10, max: 60, step: 2, unit: "s" },
    { key: "r", label: { ja: "半径", en: "Radius" }, min: 160, max: 300, step: 10, unit: "px" },
  ],
  defaults: { n: 24, dur: 30, r: 240 },
  build(o, lang) {
    const p = "cg-mobius";
    const items = Array.from({ length: o.n }, (_, i) => {
      const a = (360 / o.n) * i;
      return face(p, i, o.n, lang, `--a: ${a.toFixed(2)}deg; --tw: ${(a / 2).toFixed(2)}deg`);
    }).join("\n      ");
    return {
      html: `<div class="${p}-stage">
  <div class="${p}">
    <div class="${p}-spin">
      ${items}
    </div>
  </div>
</div>`,
      css: `.${p}-stage {
  --s: 1;
  display: grid;
  place-items: center;
  min-height: 520px;
  overflow: hidden;
  perspective: 1200px;
}
@media (max-width: 600px) {
  .${p}-stage { --s: 0.55; }
}
.${p} {
  width: 70px;
  height: 110px;
  transform-style: preserve-3d;
  transform: scale(var(--s)) rotateX(-24deg) rotateZ(-10deg);
}
.${p}-spin {
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  animation: ${p}-turn ${o.dur}s linear infinite;
}
.${p}:hover .${p}-spin {
  animation-play-state: paused;
}
.${p}-item {
  position: absolute;
  inset: 0;
  transform-style: preserve-3d;
  transform: rotateY(var(--a)) translateZ(${o.r}px) rotateX(var(--tw));
}
.${p}-item .cg-card {
  padding: 6px;
  writing-mode: vertical-rl;
  align-content: center;
  justify-content: center;
}
@keyframes ${p}-turn {
  to { transform: rotateY(-1turn); }
}
${FACES(p)}
@media (prefers-reduced-motion: reduce) {
  .${p}-spin { animation-play-state: paused; }
}
${CARD_CSS}`,
      js: "",
    };
  },
};

const PANORAMA = {
  id: "panorama",
  cat: "3d",
  method: "css",
  label: { ja: "パノラマ", en: "Panorama" },
  desc: {
    ja: "大きな円柱の内側にカードが貼られ、中から見回すように回ります。部屋の中に立っているような見え方です。",
    en: "Cards line the inside of a huge cylinder that turns around you, like standing inside a room.",
  },
  fields: [
    { key: "n", label: { ja: "枚数", en: "Cards" }, min: 8, max: 20, step: 1, unit: "" },
    { key: "dur", label: { ja: "1周の長さ", en: "Turn length" }, min: 10, max: 80, step: 2, unit: "s" },
  ],
  defaults: { n: 12, dur: 40 },
  build(o, lang) {
    const p = "cg-pano";
    const r = Math.round(150 / Math.tan(Math.PI / o.n));
    const items = Array.from(
      { length: o.n },
      (_, i) => `<div class="${p}-item" style="--h: ${hue(i, o.n)}; --a: ${((360 / o.n) * i).toFixed(2)}deg"><div class="cg-card">${word(i, lang)}</div></div>`
    ).join("\n      ");
    return {
      html: `<div class="${p}-stage">
  <div class="${p}">
    <div class="${p}-spin">
      ${items}
    </div>
  </div>
</div>`,
      css: `.${p}-stage {
  display: grid;
  place-items: center;
  height: 460px;
  overflow: hidden;
  perspective: 900px;
  perspective-origin: 50% 45%;
}
.${p} {
  width: 280px;
  height: 200px;
  transform-style: preserve-3d;
  transform: translateZ(${Math.round(r * 0.3)}px);
}
.${p}-spin {
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  animation: ${p}-turn ${o.dur}s linear infinite;
}
.${p}:hover .${p}-spin {
  animation-play-state: paused;
}
.${p}-item {
  position: absolute;
  inset: 0;
  transform-style: preserve-3d;
  transform: rotateY(var(--a)) translateZ(-${r}px);
}
.${p}-item .cg-card {
  position: absolute;
  inset: 0;
  font-size: 18px;
  backface-visibility: hidden;
}
@keyframes ${p}-turn {
  to { transform: rotateY(1turn); }
}
@media (prefers-reduced-motion: reduce) {
  .${p}-spin { animation-play-state: paused; }
}
${CARD_CSS}`,
      js: "",
    };
  },
};

export const THREE_D_3 = [WAVE_FLOOR, MOBIUS, PANORAMA];
