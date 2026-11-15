import { word, hue, CARD_CSS } from "./_shared.js?v=20261116a";

const FAN = {
  id: "fan",
  cat: "shape",
  method: "css",
  label: { ja: "扇形（ファン）", en: "Fan" },
  desc: {
    ja: "トランプのように重なったカードが、マウスを乗せると扇に開きます。乗せたカードは少し前に出ます。",
    en: "Stacked cards spread into a fan on hover, like playing cards. The hovered card lifts a little.",
  },
  fields: [
    { key: "n", label: { ja: "枚数", en: "Cards" }, min: 3, max: 9, step: 1, unit: "" },
    { key: "spread", label: { ja: "開く角度", en: "Spread" }, min: 4, max: 20, step: 1, unit: "°" },
  ],
  defaults: { n: 7, spread: 12 },
  build(o, lang) {
    const p = "cg-fan";
    const mid = (o.n - 1) / 2;
    const items = Array.from(
      { length: o.n },
      (_, i) => `<li class="cg-card ${p}-card" style="--h: ${hue(i, o.n)}; --k: ${i - mid}" tabindex="0">${word(i, lang)}</li>`
    ).join("\n  ");
    return {
      html: `<ul class="${p}">
  ${items}
</ul>`,
      css: `.${p} {
  --spread: ${o.spread}deg;
  position: relative;
  height: 360px;
  margin: 0;
  padding: 0;
  list-style: none;
}
.${p}-card {
  position: absolute;
  left: 50%;
  bottom: 40px;
  width: 150px;
  aspect-ratio: 3 / 4;
  margin-left: -75px;
  transform-origin: 50% 180%;
  transform: rotate(calc(var(--k) * 2deg));
  transition: transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
  box-shadow: 0 8px 20px rgb(0 0 0 / 0.15);
}
.${p}:hover .${p}-card,
.${p}:focus-within .${p}-card {
  transform: rotate(calc(var(--k) * var(--spread)));
}
.${p} .${p}-card:hover,
.${p} .${p}-card:focus-visible {
  transform: rotate(calc(var(--k) * var(--spread))) translateY(-24px);
}
@media (prefers-reduced-motion: reduce) {
  .${p}-card { transition: none; }
}
${CARD_CSS}`,
      js: "",
    };
  },
};

const ACCORDION = {
  id: "accordion",
  cat: "shape",
  method: "css",
  label: { ja: "アコーディオン型", en: "Accordion" },
  desc: {
    ja: "細い帯が横に並び、マウスを乗せた1枚だけが広がります。キーボードで選んでも広がります。",
    en: "Narrow panels sit side by side, and the one you hover or focus widens.",
  },
  fields: [
    { key: "n", label: { ja: "枚数", en: "Panels" }, min: 3, max: 8, step: 1, unit: "" },
    { key: "grow", label: { ja: "広がる大きさ", en: "Grow" }, min: 2, max: 8, step: 1, unit: "×" },
  ],
  defaults: { n: 5, grow: 4 },
  build(o, lang) {
    const p = "cg-accordion";
    const items = Array.from(
      { length: o.n },
      (_, i) => `<li class="cg-card ${p}-card" style="--h: ${hue(i, o.n)}" tabindex="0">${word(i, lang)}</li>`
    ).join("\n  ");
    return {
      html: `<ul class="${p}">
  ${items}
</ul>`,
      css: `.${p} {
  display: flex;
  gap: 10px;
  height: 320px;
  margin: 0;
  padding: 0;
  list-style: none;
}
.${p}-card {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  white-space: nowrap;
  transition: flex-grow 0.5s cubic-bezier(0.2, 0.8, 0.2, 1);
  cursor: pointer;
}
.${p}-card:hover,
.${p}-card:focus-visible {
  flex-grow: ${o.grow};
}
@media (prefers-reduced-motion: reduce) {
  .${p}-card { transition: none; }
}
${CARD_CSS}`,
      js: "",
    };
  },
};

export const SHAPE = [FAN, ACCORDION];
