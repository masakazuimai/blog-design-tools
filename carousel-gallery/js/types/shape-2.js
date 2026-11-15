import { word, hue, CARD_CSS } from "./_shared.js?v=20261116a";

const BENTO = {
  id: "bento-loop",
  cat: "shape",
  method: "css",
  label: { ja: "タイル", en: "Bento tiles" },
  desc: {
    ja: "大きさの違うマスを組んだタイルが、横へ流れ続けます。作品やサービスを一度にたくさん見せられます。",
    en: "A grid of tiles in mixed sizes flows sideways, showing many works or services at once.",
  },
  fields: [{ key: "dur", label: { ja: "1巡の長さ", en: "Loop length" }, min: 10, max: 80, step: 2, unit: "s" }],
  defaults: { dur: 40 },
  build(o, lang) {
    const p = "cg-bento";
    const spans = ["c2 r2", "", "", "c2", "r2", "", "c2", ""];
    const tiles = (hidden) =>
      spans
        .map((s, i) => `<li class="cg-card ${p}-tile ${s.split(" ").filter(Boolean).map((x) => `${p}-${x}`).join(" ")}" style="--h: ${hue(i, spans.length)}"${hidden ? ' aria-hidden="true"' : ""}>${word(i, lang)}</li>`)
        .join("\n      ");
    return {
      html: `<div class="${p}">
  <div class="${p}-track">
    <ul class="${p}-grid">
      ${tiles(false)}
    </ul>
    <ul class="${p}-grid" aria-hidden="true">
      ${tiles(true)}
    </ul>
  </div>
</div>`,
      css: `.${p} {
  --gap: 12px;
  overflow: hidden;
  padding: 24px 0;
}
.${p}-track {
  display: flex;
  gap: var(--gap);
  width: max-content;
  animation: ${p}-flow ${o.dur}s linear infinite;
}
.${p}-grid {
  display: grid;
  grid-auto-flow: column dense;
  grid-template-rows: repeat(2, 120px);
  grid-auto-columns: 120px;
  gap: var(--gap);
  margin: 0;
  padding: 0;
  list-style: none;
}
.${p}-c2 { grid-column: span 2; }
.${p}-r2 { grid-row: span 2; }
.${p}:hover .${p}-track {
  animation-play-state: paused;
}
@keyframes ${p}-flow {
  to { transform: translateX(calc(-50% - var(--gap) / 2)); }
}
@media (prefers-reduced-motion: reduce) {
  .${p}-track { animation-play-state: paused; }
}
${CARD_CSS}`,
      js: "",
    };
  },
};

const SLANT = {
  id: "slanted",
  cat: "shape",
  method: "css",
  label: { ja: "斜めに切った帯", en: "Slanted panels" },
  desc: {
    ja: "平行四辺形に切ったパネルが並び、マウスを乗せた1枚が広がります。スポーツやゲームのサイトでよく見る形です。",
    en: "Parallelogram panels sit side by side, and the one you hover widens. Common on sports and game sites.",
  },
  fields: [
    { key: "n", label: { ja: "枚数", en: "Panels" }, min: 3, max: 7, step: 1, unit: "" },
    { key: "slant", label: { ja: "斜めの量", en: "Slant" }, min: 20, max: 80, step: 5, unit: "px" },
  ],
  defaults: { n: 5, slant: 50 },
  build(o, lang) {
    const p = "cg-slant";
    const items = Array.from(
      { length: o.n },
      (_, i) => `<li class="cg-card ${p}-panel" style="--h: ${hue(i, o.n)}" tabindex="0">${word(i, lang)}</li>`
    ).join("\n  ");
    return {
      html: `<ul class="${p}">
  ${items}
</ul>`,
      css: `.${p} {
  --cut: ${o.slant}px;
  display: flex;
  height: 320px;
  margin: 0;
  padding: 0 calc(var(--cut) / 2);
  list-style: none;
}
.${p}-panel {
  flex: 1;
  min-width: 0;
  margin: 0 calc(var(--cut) / -2);
  padding: 16px calc(var(--cut) + 8px);
  border-radius: 0;
  white-space: nowrap;
  clip-path: polygon(var(--cut) 0, 100% 0, calc(100% - var(--cut)) 100%, 0 100%);
  transition: flex-grow 0.5s cubic-bezier(0.2, 0.8, 0.2, 1);
  cursor: pointer;
}
.${p}-panel:hover,
.${p}-panel:focus-visible {
  flex-grow: 3;
  outline: none;
}
@media (prefers-reduced-motion: reduce) {
  .${p}-panel { transition: none; }
}
${CARD_CSS}`,
      js: "",
    };
  },
};

const HEX = {
  id: "hexagon",
  cat: "shape",
  method: "css",
  label: { ja: "六角形", en: "Hexagons" },
  desc: {
    ja: "六角形のカードがハチの巣のように並び、横へゆっくり流れます。マウスを乗せた1枚が浮き上がります。",
    en: "Hexagon cards form a honeycomb that drifts sideways. The one you hover lifts up.",
  },
  fields: [{ key: "dur", label: { ja: "1巡の長さ", en: "Loop length" }, min: 10, max: 80, step: 2, unit: "s" }],
  defaults: { dur: 40 },
  build(o, lang) {
    const p = "cg-hex";
    const col = (k, hidden) =>
      `<li class="${p}-col">${[0, 1]
        .map((r) => {
          const i = k * 2 + r;
          return `<span class="cg-card ${p}-cell" style="--h: ${hue(i, 12)}"${hidden ? ' aria-hidden="true"' : ""}>${word(i, lang)}</span>`;
        })
        .join("")}</li>`;
    const cols = (hidden) => Array.from({ length: 6 }, (_, k) => col(k, hidden)).join("\n    ");
    return {
      html: `<div class="${p}">
  <ul class="${p}-track">
    ${cols(false)}
    ${cols(true)}
  </ul>
</div>`,
      css: `.${p} {
  overflow: hidden;
  padding: 24px 0;
}
.${p}-track {
  display: flex;
  width: max-content;
  margin: 0;
  padding: 0;
  list-style: none;
  animation: ${p}-flow ${o.dur}s linear infinite;
}
.${p}-col {
  display: grid;
  gap: 8px;
  width: 132px;
  margin-right: -14px;
}
.${p}-col:nth-child(even) {
  padding-top: 76px;
}
.${p}-cell {
  width: 150px;
  aspect-ratio: 1 / 1.1547;
  place-content: center;
  text-align: center;
  border-radius: 0;
  clip-path: polygon(50% 0, 100% 25%, 100% 75%, 50% 100%, 0 75%, 0 25%);
  transition: transform 0.3s, filter 0.3s;
}
.${p}-cell:hover {
  transform: translateY(-8px) scale(1.04);
  filter: brightness(1.1);
}
.${p}:hover .${p}-track {
  animation-play-state: paused;
}
@keyframes ${p}-flow {
  to { transform: translateX(-50%); }
}
@media (prefers-reduced-motion: reduce) {
  .${p}-track { animation-play-state: paused; }
  .${p}-cell { transition: none; }
}
${CARD_CSS}`,
      js: "",
    };
  },
};

const HANG = {
  id: "hanging",
  cat: "shape",
  method: "css",
  label: { ja: "吊り下げ", en: "Hanging cards" },
  desc: {
    ja: "ひもで吊られたカードが、時間差でゆらゆら揺れます。マウスを乗せると大きく揺れます。",
    en: "Cards hang on strings and sway one after another. Hover to make one swing harder.",
  },
  fields: [
    { key: "n", label: { ja: "枚数", en: "Cards" }, min: 3, max: 8, step: 1, unit: "" },
    { key: "swing", label: { ja: "揺れの大きさ", en: "Swing" }, min: 2, max: 14, step: 1, unit: "°" },
  ],
  defaults: { n: 5, swing: 6 },
  build(o, lang) {
    const p = "cg-hang";
    const items = Array.from(
      { length: o.n },
      (_, i) =>
        `<li class="${p}-item" style="--i: ${i}; --len: ${60 + ((i * 47) % 90)}px"><span class="cg-card ${p}-card" style="--h: ${hue(i, o.n)}">${word(i, lang)}</span></li>`
    ).join("\n  ");
    return {
      html: `<ul class="${p}">
  ${items}
</ul>`,
      css: `.${p} {
  display: flex;
  justify-content: center;
  gap: 18px;
  height: 380px;
  margin: 0;
  padding: 0;
  list-style: none;
  border-top: 3px solid #13302f;
}
.${p}-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 130px;
  transform-origin: 50% 0;
  animation: ${p}-sway 3.2s ease-in-out infinite alternate;
  animation-delay: calc(var(--i) * -0.7s);
}
.${p}-item::before {
  content: "";
  width: 2px;
  height: var(--len);
  background: #13302f;
}
.${p}-card {
  width: 100%;
  aspect-ratio: 3 / 4;
  box-shadow: 0 10px 20px rgb(0 0 0 / 0.15);
}
.${p}-item:hover {
  animation-duration: 1s;
}
@keyframes ${p}-sway {
  from { transform: rotate(-${o.swing}deg); }
  to { transform: rotate(${o.swing}deg); }
}
@media (max-width: 600px) {
  .${p}-item { width: 80px; }
}
@media (prefers-reduced-motion: reduce) {
  .${p}-item { animation: none; }
}
${CARD_CSS}`,
      js: "",
    };
  },
};

const RESPONSIVE = {
  id: "responsive-count",
  demo: "x",
  cat: "basic",
  method: "css",
  label: { ja: "幅で枚数が変わる", en: "Responsive card count" },
  desc: {
    ja: "置いた場所の幅に合わせて、1度に見える枚数が1枚・2枚・3枚・4枚と変わります。コンテナクエリで切り替えています。",
    en: "Shows 1, 2, 3 or 4 cards at a time depending on the width of its container, using container queries.",
  },
  fields: [{ key: "n", label: { ja: "枚数", en: "Cards" }, min: 4, max: 12, step: 1, unit: "" }],
  defaults: { n: 8 },
  build(o, lang) {
    const p = "cg-resp";
    const items = Array.from({ length: o.n }, (_, i) => `<li class="cg-card ${p}-card" style="--h: ${hue(i, o.n)}">${word(i, lang)}</li>`).join(
      "\n    "
    );
    return {
      html: `<div class="${p}">
  <ul class="${p}-list">
    ${items}
  </ul>
</div>`,
      css: `.${p} {
  container-type: inline-size;
  width: min(1100px, 96%);
  margin: 0 auto;
}
.${p}-list {
  --per: 1;
  --gap: 14px;
  display: flex;
  gap: var(--gap);
  margin: 0;
  padding: 16px 0;
  list-style: none;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
}
.${p}-card {
  flex: 0 0 calc((100% - var(--gap) * (var(--per) - 1)) / var(--per));
  aspect-ratio: 4 / 3;
  scroll-snap-align: start;
}
@container (min-width: 480px) {
  .${p}-list { --per: 2; }
}
@container (min-width: 720px) {
  .${p}-list { --per: 3; }
}
@container (min-width: 960px) {
  .${p}-list { --per: 4; }
}
${CARD_CSS}`,
      js: "",
    };
  },
};

export const SHAPE_2 = [BENTO, SLANT, HEX, HANG];
export const BASIC_3 = [RESPONSIVE];
