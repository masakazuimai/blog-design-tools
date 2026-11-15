import { word, hue, CARD_CSS } from "./_shared.js?v=20261116a";

const row = (p, n, lang, offset = 0) => {
  const cards = (hidden) =>
    Array.from({ length: n }, (_, i) => {
      const j = i + offset;
      const aria = hidden ? ' aria-hidden="true"' : "";
      return `<li class="cg-card ${p}-card" style="--h: ${hue(j, n * 2)}"${aria}>${word(j, lang)}</li>`;
    }).join("\n      ");
  return `<ul class="${p}-track">
      ${cards(false)}
      ${cards(true)}
    </ul>`;
};

const BASE_CSS = (p, o) => `.${p} {
  --w: ${o.w}px;
  --gap: 16px;
  --dur: ${o.dur}s;
  overflow: hidden;
  padding: 24px 0;
  mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent);
}
.${p}-track {
  display: flex;
  gap: var(--gap);
  width: max-content;
  margin: 0;
  padding: 0;
  list-style: none;
  animation: ${p}-flow var(--dur) linear infinite;
}
.${p}:hover .${p}-track {
  animation-play-state: paused;
}
.${p}-card {
  flex: 0 0 var(--w);
  aspect-ratio: 4 / 3;
}
@keyframes ${p}-flow {
  to { transform: translateX(calc(-50% - var(--gap) / 2)); }
}
@media (prefers-reduced-motion: reduce) {
  .${p}-track { animation-play-state: paused; }
}`;

const FIELDS = [
  { key: "n", label: { ja: "枚数", en: "Cards" }, min: 4, max: 12, step: 1, unit: "" },
  { key: "dur", label: { ja: "1巡の長さ", en: "Loop length" }, min: 8, max: 60, step: 2, unit: "s" },
  { key: "w", label: { ja: "カードの幅", en: "Card width" }, min: 140, max: 320, step: 10, unit: "px" },
];

const MARQUEE = {
  id: "marquee",
  cat: "loop",
  method: "css",
  label: { ja: "無限ループ（マーキー）", en: "Infinite marquee" },
  desc: {
    ja: "カードが横へ途切れずに流れ続けます。同じ並びを2回置き、半分だけ動かしてつなぎ目を消しています。",
    en: "Cards flow sideways without a seam. The set is repeated twice and moved by half its width.",
  },
  fields: FIELDS,
  defaults: { n: 6, dur: 24, w: 200 },
  build(o, lang) {
    const p = "cg-marquee";
    return {
      html: `<div class="${p}">
    ${row(p, o.n, lang)}
</div>`,
      css: `${BASE_CSS(p, o)}
${CARD_CSS}`,
      js: "",
    };
  },
};

const MARQUEE_2 = {
  id: "marquee-2",
  cat: "loop",
  method: "css",
  label: { ja: "2段の逆向きループ", en: "Two-row reverse marquee" },
  desc: {
    ja: "上の段は左へ、下の段は右へ流れます。ロゴや実績の一覧によく使われる形です。",
    en: "The top row flows left and the bottom row flows right. Common for logo walls and showcases.",
  },
  fields: FIELDS,
  defaults: { n: 6, dur: 30, w: 180 },
  build(o, lang) {
    const p = "cg-marquee2";
    return {
      html: `<div class="${p}">
    ${row(p, o.n, lang)}
</div>
<div class="${p} ${p}--reverse">
    ${row(p, o.n, lang, o.n)}
</div>`,
      css: `${BASE_CSS(p, o)}
.${p}--reverse .${p}-track {
  animation-direction: reverse;
}
${CARD_CSS}`,
      js: "",
    };
  },
};

export const LOOP = [MARQUEE, MARQUEE_2];
