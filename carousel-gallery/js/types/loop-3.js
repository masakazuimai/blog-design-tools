import { word, hue, CARD_CSS } from "./_shared.js?v=20261116a";

const doubled = (p, n, lang) => {
  const set = (hidden) =>
    Array.from({ length: n }, (_, i) => `<li class="cg-card ${p}-card" style="--h: ${hue(i, n)}; --i: ${hidden ? i + n : i}"${hidden ? ' aria-hidden="true"' : ""}>${word(i, lang)}</li>`).join(
      "\n    "
    );
  return `<ul class="${p}-track">
    ${set(false)}
    ${set(true)}
  </ul>`;
};

const TRACK = (p, dur) => `.${p}-track {
  display: flex;
  gap: var(--gap);
  width: max-content;
  margin: 0;
  padding: 0;
  list-style: none;
  animation: ${p}-flow ${dur}s linear infinite;
}
@keyframes ${p}-flow {
  to { transform: translateX(calc(-50% - var(--gap) / 2)); }
}
.${p}:hover .${p}-track,
.${p}:hover .${p}-card {
  animation-play-state: paused;
}
@media (prefers-reduced-motion: reduce) {
  .${p}-track, .${p}-card { animation-play-state: paused; }
}`;

const FIELDS = [
  { key: "n", label: { ja: "枚数", en: "Cards" }, min: 4, max: 12, step: 1, unit: "" },
  { key: "dur", label: { ja: "1巡の長さ", en: "Loop length" }, min: 8, max: 60, step: 2, unit: "s" },
];

const DEPTH = {
  id: "depth-band",
  cat: "loop",
  method: "css",
  label: { ja: "奥行きのある帯", en: "Perspective band" },
  desc: {
    ja: "斜めから見た帯の上を、カードが奥から手前へ流れてきます。手前ほど大きく見えます。",
    en: "Cards stream along a band seen at an angle, growing larger as they come toward you.",
  },
  fields: [...FIELDS, { key: "angle", label: { ja: "帯の角度", en: "Band angle" }, min: 10, max: 60, step: 5, unit: "°" }],
  defaults: { n: 8, dur: 30, angle: 35 },
  build(o, lang) {
    const p = "cg-depth";
    return {
      html: `<div class="${p}">
  <div class="${p}-band">
  ${doubled(p, o.n, lang)}
  </div>
</div>`,
      css: `.${p} {
  --gap: 16px;
  overflow: hidden;
  padding: 40px 0;
  perspective: 900px;
}
.${p}-band {
  transform: rotateY(-${o.angle}deg);
  transform-origin: 30% 50%;
}
.${p}-card {
  flex: 0 0 200px;
  aspect-ratio: 3 / 4;
}
${TRACK(p, o.dur)}
${CARD_CSS}`,
      js: "",
    };
  },
};

const ORBIT = {
  id: "circle-loop",
  cat: "loop",
  method: "css",
  label: { ja: "円周を回るループ", en: "Circular orbit" },
  desc: {
    ja: "カードがまっすぐ立ったまま、大きな円の縁を回り続けます。真ん中に見出しやロゴを置けます。",
    en: "Upright cards travel around the rim of a large circle. You can put a heading or logo in the middle.",
  },
  fields: [
    { key: "n", label: { ja: "枚数", en: "Cards" }, min: 4, max: 12, step: 1, unit: "" },
    { key: "dur", label: { ja: "1周の長さ", en: "Loop length" }, min: 8, max: 60, step: 2, unit: "s" },
    { key: "r", label: { ja: "円の大きさ", en: "Radius" }, min: 120, max: 240, step: 10, unit: "px" },
  ],
  defaults: { n: 8, dur: 30, r: 190 },
  build(o, lang) {
    const p = "cg-orbit";
    const items = Array.from(
      { length: o.n },
      (_, i) => `<li class="cg-card ${p}-card" style="--h: ${hue(i, o.n)}; --i: ${i}">${word(i, lang)}</li>`
    ).join("\n  ");
    return {
      html: `<ul class="${p}" style="--n: ${o.n}">
  <li class="${p}-center">${lang === "en" ? "Your heading" : "ここに見出し"}</li>
  ${items}
</ul>`,
      css: `.${p} {
  --r: ${o.r}px;
  --dur: ${o.dur}s;
  position: relative;
  height: calc(var(--r) * 2 + 140px);
  margin: 0;
  padding: 0;
  list-style: none;
}
@media (max-width: 600px) {
  .${p} { --r: calc(${o.r}px * 0.6); }
}
.${p}-center {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  color: #13302f;
  font-weight: 800;
  font-size: clamp(18px, 3vw, 28px);
}
.${p}-card {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 110px;
  aspect-ratio: 4 / 3;
  margin: -41px 0 0 -55px;
  animation: ${p}-spin var(--dur) linear infinite;
  animation-delay: calc(var(--dur) / var(--n) * var(--i) * -1);
}
.${p}:hover .${p}-card {
  animation-play-state: paused;
}
@keyframes ${p}-spin {
  from { transform: rotate(0turn) translateY(calc(var(--r) * -1)) rotate(0turn); }
  to { transform: rotate(1turn) translateY(calc(var(--r) * -1)) rotate(-1turn); }
}
@media (prefers-reduced-motion: reduce) {
  .${p}-card { animation-play-state: paused; }
}
${CARD_CSS}`,
      js: "",
    };
  },
};

const ZIGZAG = {
  id: "zigzag-loop",
  cat: "loop",
  method: "css",
  label: { ja: "互い違いのループ", en: "Zigzag loop" },
  desc: {
    ja: "カードが上下互い違いに並んだまま、横へ流れ続けます。写真の多いページでリズムが出ます。",
    en: "Cards alternate high and low as they flow sideways, adding rhythm to photo-heavy pages.",
  },
  fields: [...FIELDS, { key: "offset", label: { ja: "上下のずれ", en: "Offset" }, min: 10, max: 80, step: 5, unit: "px" }],
  defaults: { n: 8, dur: 30, offset: 40 },
  build(o, lang) {
    const p = "cg-zigzag";
    const n = o.n % 2 ? o.n + 1 : o.n;
    return {
      html: `<div class="${p}">
  ${doubled(p, n, lang)}
</div>`,
      css: `.${p} {
  --gap: 14px;
  overflow: hidden;
  padding: ${o.offset + 24}px 0;
  mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent);
}
.${p}-card {
  flex: 0 0 170px;
  aspect-ratio: 3 / 4;
}
.${p}-card:nth-child(odd) {
  transform: translateY(-${o.offset}px);
}
.${p}-card:nth-child(even) {
  transform: translateY(${o.offset}px);
}
${TRACK(p, o.dur)}
${CARD_CSS}`,
      js: "",
    };
  },
};

export const LOOP_3 = [DEPTH, ORBIT, ZIGZAG];
