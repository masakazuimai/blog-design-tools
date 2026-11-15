import { word, hue, CARD_CSS } from "./_shared.js?v=20261116a";

const POLAROID = {
  id: "polaroid",
  cat: "stack",
  method: "css",
  label: { ja: "散らばった写真", en: "Scattered photos" },
  desc: {
    ja: "白いふちの写真が机の上に散らばったように重なり、マウスを乗せた1枚がまっすぐになって前に出ます。",
    en: "White-framed photos lie scattered on a table. The one you hover straightens and comes to the front.",
  },
  fields: [
    { key: "n", label: { ja: "枚数", en: "Photos" }, min: 3, max: 9, step: 1, unit: "" },
    { key: "spread", label: { ja: "散らばり", en: "Scatter" }, min: 4, max: 20, step: 1, unit: "°" },
  ],
  defaults: { n: 6, spread: 12 },
  build(o, lang) {
    const p = "cg-polaroid";
    const mid = (o.n - 1) / 2;
    const items = Array.from({ length: o.n }, (_, i) => {
      const k = i - mid;
      const rot = Math.round(((i * 37) % 21) - 10);
      return `<li class="${p}-photo" style="--k: ${k}; --r: ${rot}" tabindex="0"><span class="cg-card" style="--h: ${hue(i, o.n)}"></span><span class="${p}-caption">${word(i, lang)}</span></li>`;
    }).join("\n  ");
    return {
      html: `<ul class="${p}">
  ${items}
</ul>`,
      css: `.${p} {
  --spread: ${o.spread};
  position: relative;
  height: 380px;
  margin: 0;
  padding: 0;
  list-style: none;
}
.${p}-photo {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 180px;
  margin: -110px 0 0 -90px;
  padding: 10px 10px 0;
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 10px 24px rgb(0 0 0 / 0.18);
  transform: translateX(calc(var(--k) * 70px)) rotate(calc(var(--r) / 10 * var(--spread) * 1deg));
  transition: transform 0.35s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.35s;
  cursor: pointer;
}
.${p}-photo .cg-card {
  display: block;
  aspect-ratio: 1;
  border-radius: 2px;
}
.${p}-caption {
  display: block;
  padding: 8px 2px 10px;
  color: #13302f;
  font-weight: 700;
  font-size: 16px;
  text-align: center;
}
.${p}-photo:hover,
.${p}-photo:focus-visible {
  z-index: 1;
  box-shadow: 0 20px 40px rgb(0 0 0 / 0.25);
  transform: translateX(calc(var(--k) * 70px)) translateY(-16px) rotate(0deg) scale(1.08);
}
@media (max-width: 600px) {
  .${p}-photo { width: 130px; margin: -85px 0 0 -65px; }
  .${p}-photo { transform: translateX(calc(var(--k) * 34px)) rotate(calc(var(--r) / 10 * var(--spread) * 1deg)); }
}
@media (prefers-reduced-motion: reduce) {
  .${p}-photo { transition: none; }
}
${CARD_CSS}`,
      js: "",
    };
  },
};

const slotKeys = (name, n, visible) => {
  const pct = (x) => `${((x / n) * 100).toFixed(3)}%`;
  const slot = (s) => {
    const d = Math.min(s, visible);
    return `transform: translateY(${-d * 18}px) scale(${(1 - d * 0.06).toFixed(2)}); opacity: ${s > visible ? 0 : 1}; z-index: ${n - s};`;
  };
  const ease = "animation-timing-function: cubic-bezier(0.6, 0, 0.3, 1);";
  const lines = [
    `  0%, ${pct(0.7)} { ${slot(0)} ${ease} }`,
    `  ${pct(0.95)} { transform: translateX(-120%) rotate(-10deg); opacity: 0; z-index: ${n + 1}; }`,
  ];
  for (let k = 1; k < n; k += 1) {
    lines.push(`  ${pct(k)}, ${pct(k + 0.7)} { ${slot(n - k)} ${ease} }`);
  }
  lines.push(`  100% { ${slot(0)} }`);
  return `@keyframes ${name} {\n${lines.join("\n")}\n}`;
};

const STACK_BACK = {
  id: "stack-cycle",
  cat: "stack",
  method: "css",
  label: { ja: "重ねて送る", en: "Card stack cycle" },
  desc: {
    ja: "重なったカードの一番上が横へ抜けて、次のカードが前に出ます。抜けたカードは一番うしろへ回ります。",
    en: "The top card of a stack slides away and the next one moves forward. The card that left goes to the back.",
  },
  fields: [
    { key: "n", label: { ja: "枚数", en: "Cards" }, min: 3, max: 8, step: 1, unit: "" },
    { key: "sec", label: { ja: "1枚の長さ", en: "Seconds per card" }, min: 1, max: 6, step: 0.5, unit: "s" },
  ],
  defaults: { n: 5, sec: 2.5 },
  build(o, lang) {
    const p = "cg-stack";
    const items = Array.from(
      { length: o.n },
      (_, i) => `<li class="cg-card ${p}-card" style="--h: ${hue(i, o.n)}; --i: ${i}">${word(i, lang)}</li>`
    ).join("\n  ");
    return {
      html: `<ul class="${p}" style="--n: ${o.n}">
  ${items}
</ul>`,
      css: `.${p} {
  --step: ${o.sec}s;
  position: relative;
  width: min(320px, 80%);
  aspect-ratio: 4 / 3;
  margin: 60px auto 30px;
  padding: 0;
  list-style: none;
}
.${p}-card {
  position: absolute;
  inset: 0;
  box-shadow: 0 10px 24px rgb(0 0 0 / 0.15);
  animation: ${p}-cycle calc(var(--step) * var(--n)) linear infinite;
  animation-delay: calc(var(--step) * var(--i) * -1);
}
.${p}:hover .${p}-card {
  animation-play-state: paused;
}
${slotKeys(`${p}-cycle`, o.n, 2)}
@media (prefers-reduced-motion: reduce) {
  .${p}-card { animation-play-state: paused; }
}
${CARD_CSS}`,
      js: "",
    };
  },
};

export const STACK = [POLAROID, STACK_BACK];
