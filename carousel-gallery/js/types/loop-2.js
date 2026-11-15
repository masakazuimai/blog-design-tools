import { word, hue, CARD_CSS } from "./_shared.js?v=20261116a";

const track = (p, n, lang) => {
  const cards = (hidden) =>
    Array.from({ length: n }, (_, i) => {
      const aria = hidden ? ' aria-hidden="true"' : "";
      return `<li class="cg-card ${p}-card" style="--h: ${hue(i, n)}; --i: ${hidden ? i + n : i}"${aria}>${word(i, lang)}</li>`;
    }).join("\n    ");
  return `<ul class="${p}-track">
    ${cards(false)}
    ${cards(true)}
  </ul>`;
};

const FIELDS = [
  { key: "n", label: { ja: "枚数", en: "Cards" }, min: 4, max: 12, step: 1, unit: "" },
  { key: "dur", label: { ja: "1巡の長さ", en: "Loop length" }, min: 8, max: 60, step: 2, unit: "s" },
];

const PAUSE = (p) => `.${p}:hover .${p}-track,
.${p}:hover .${p}-card {
  animation-play-state: paused;
}
@media (prefers-reduced-motion: reduce) {
  .${p}-track, .${p}-card { animation-play-state: paused; }
}`;

const VERTICAL = {
  id: "vertical-loop",
  cat: "loop",
  method: "css",
  label: { ja: "縦の無限ループ", en: "Vertical loop" },
  desc: {
    ja: "カードが下から上へ途切れずに流れ続けます。サイドバーやお知らせの欄に向いています。",
    en: "Cards flow upward without a seam. Good for sidebars and news panels.",
  },
  fields: [...FIELDS, { key: "h", label: { ja: "表示の高さ", en: "Visible height" }, min: 240, max: 520, step: 20, unit: "px" }],
  defaults: { n: 6, dur: 24, h: 400 },
  build(o, lang) {
    const p = "cg-vloop";
    return {
      html: `<div class="${p}">
  ${track(p, o.n, lang)}
</div>`,
      css: `.${p} {
  --gap: 14px;
  width: min(320px, 90%);
  height: ${o.h}px;
  margin: 0 auto;
  overflow: hidden;
  mask-image: linear-gradient(transparent, #000 10%, #000 90%, transparent);
}
.${p}-track {
  display: flex;
  flex-direction: column;
  gap: var(--gap);
  margin: 0;
  padding: 0;
  list-style: none;
  animation: ${p}-flow ${o.dur}s linear infinite;
}
.${p}-card {
  aspect-ratio: 16 / 9;
}
@keyframes ${p}-flow {
  to { transform: translateY(calc(-50% - var(--gap) / 2)); }
}
${PAUSE(p)}
${CARD_CSS}`,
      js: "",
    };
  },
};

const DIAGONAL = {
  id: "diagonal-loop",
  cat: "loop",
  method: "css",
  label: { ja: "斜めの無限ループ", en: "Diagonal loop" },
  desc: {
    ja: "傾けた帯の上をカードが流れ続けます。ページの区切りや見出しの下に置くと目を引きます。",
    en: "Cards stream along a tilted band. Eye-catching between page sections.",
  },
  fields: [...FIELDS, { key: "angle", label: { ja: "傾き", en: "Tilt" }, min: 2, max: 16, step: 1, unit: "°" }],
  defaults: { n: 8, dur: 30, angle: 7 },
  build(o, lang) {
    const p = "cg-dloop";
    return {
      html: `<div class="${p}">
  <div class="${p}-band">
  ${track(p, o.n, lang)}
  </div>
</div>`,
      css: `.${p} {
  overflow: hidden;
  padding: 80px 0;
}
.${p}-band {
  --gap: 14px;
  width: 130%;
  margin-left: -15%;
  padding: 16px 0;
  background: #13302f;
  transform: rotate(-${o.angle}deg);
}
.${p}-track {
  display: flex;
  gap: var(--gap);
  width: max-content;
  margin: 0;
  padding: 0;
  list-style: none;
  animation: ${p}-flow ${o.dur}s linear infinite;
}
.${p}-card {
  flex: 0 0 180px;
  aspect-ratio: 4 / 3;
}
@keyframes ${p}-flow {
  to { transform: translateX(calc(-50% - var(--gap) / 2)); }
}
${PAUSE(p)}
${CARD_CSS}`,
      js: "",
    };
  },
};

const WAVE = {
  id: "wave-loop",
  cat: "loop",
  method: "css",
  label: { ja: "ウェーブ", en: "Wave" },
  desc: {
    ja: "横へ流れながら、カードが1枚ずつ時間差で上下に揺れて、波のように見えます。",
    en: "Cards flow sideways while bobbing up and down one after another, like a wave.",
  },
  fields: [...FIELDS, { key: "amp", label: { ja: "揺れの大きさ", en: "Wave height" }, min: 8, max: 60, step: 4, unit: "px" }],
  defaults: { n: 8, dur: 30, amp: 28 },
  build(o, lang) {
    const p = "cg-wave";
    return {
      html: `<div class="${p}">
  ${track(p, o.n, lang)}
</div>`,
      css: `.${p} {
  --gap: 14px;
  overflow: hidden;
  padding: ${o.amp + 24}px 0;
  mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent);
}
.${p}-track {
  display: flex;
  gap: var(--gap);
  width: max-content;
  margin: 0;
  padding: 0;
  list-style: none;
  animation: ${p}-flow ${o.dur}s linear infinite;
}
.${p}-card {
  flex: 0 0 170px;
  aspect-ratio: 3 / 4;
  animation: ${p}-bob ${(o.n * 0.3).toFixed(1)}s ease-in-out infinite;
  animation-delay: calc(var(--i) * -0.3s);
}
@keyframes ${p}-flow {
  to { transform: translateX(calc(-50% - var(--gap) / 2)); }
}
@keyframes ${p}-bob {
  0%, 100% { transform: translateY(${o.amp}px); }
  50% { transform: translateY(-${o.amp}px); }
}
${PAUSE(p)}
${CARD_CSS}`,
      js: "",
    };
  },
};

export const LOOP_2 = [VERTICAL, DIAGONAL, WAVE];
