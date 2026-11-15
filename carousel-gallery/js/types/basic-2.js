import { word, hue, CARD_CSS } from "./_shared.js?v=20261116a";

const radios = (p, n, lang) =>
  Array.from(
    { length: n },
    (_, i) =>
      `<input class="${p}-radio" type="radio" name="${p}" id="${p}-${i + 1}"${i === 0 ? " checked" : ""} aria-label="${lang === "en" ? `Slide ${i + 1}` : `${i + 1}枚目`}" />`
  ).join("\n  ");

const slides = (p, n, lang) =>
  Array.from({ length: n }, (_, i) => `<li class="cg-card ${p}-slide" style="--h: ${hue(i, n)}">${word(i, lang)}</li>`).join(
    "\n    "
  );

const perSlide = (n, rule) => Array.from({ length: n }, (_, i) => rule(i + 1)).join("\n");

const THUMBS = {
  id: "thumbnails",
  cat: "basic",
  method: "css",
  label: { ja: "サムネイル付き", en: "With thumbnails" },
  desc: {
    ja: "大きな1枚の下に小さなサムネイルが並び、押すと切り替わります。ラジオボタンと :has() だけで動きます。",
    en: "Small thumbnails sit under the main slide and switch it on click. Built with radio buttons and :has().",
  },
  fields: [{ key: "n", label: { ja: "枚数", en: "Slides" }, min: 3, max: 8, step: 1, unit: "" }],
  defaults: { n: 5 },
  build(o, lang) {
    const p = "cg-thumbs";
    const thumbs = Array.from(
      { length: o.n },
      (_, i) => `<label class="cg-card ${p}-thumb" for="${p}-${i + 1}" style="--h: ${hue(i, o.n)}"></label>`
    ).join("\n    ");
    return {
      html: `<div class="${p}">
  ${radios(p, o.n, lang)}
  <ul class="${p}-main">
    ${slides(p, o.n, lang)}
  </ul>
  <div class="${p}-row">
    ${thumbs}
  </div>
</div>`,
      css: `.${p} {
  width: min(640px, 92%);
  margin: 0 auto;
}
.${p}-radio {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}
.${p}-main {
  position: relative;
  aspect-ratio: 16 / 9;
  margin: 0 0 12px;
  padding: 0;
  list-style: none;
}
.${p}-slide {
  position: absolute;
  inset: 0;
  opacity: 0;
  transition: opacity 0.5s;
}
.${p}-row {
  display: grid;
  grid-template-columns: repeat(${o.n}, 1fr);
  gap: 10px;
}
.${p}-thumb {
  aspect-ratio: 4 / 3;
  padding: 0;
  opacity: 0.5;
  cursor: pointer;
  transition: opacity 0.3s;
}
.${p}:has(.${p}-radio:focus-visible) .${p}-row {
  outline: 3px solid #4b2fe0;
  outline-offset: 4px;
}
${perSlide(
  o.n,
  (k) => `.${p}:has(#${p}-${k}:checked) .${p}-slide:nth-child(${k}),
.${p}:has(#${p}-${k}:checked) .${p}-thumb:nth-child(${k}) { opacity: 1; }`
)}
@media (prefers-reduced-motion: reduce) {
  .${p}-slide, .${p}-thumb { transition: none; }
}
${CARD_CSS}`,
      js: "",
    };
  },
};

const RADIO = {
  id: "radio-slide",
  cat: "basic",
  method: "css",
  label: { ja: "点で切り替えるスライド", en: "Dot-controlled slides" },
  desc: {
    ja: "下の点を押すと、横にすべって1枚ずつ切り替わります。ラジオボタンの選択を :has() で読んで動かします。",
    en: "Click a dot and the row slides to that card. Radio buttons and :has() drive the movement.",
  },
  fields: [{ key: "n", label: { ja: "枚数", en: "Slides" }, min: 3, max: 8, step: 1, unit: "" }],
  defaults: { n: 5 },
  build(o, lang) {
    const p = "cg-radio";
    const dots = Array.from(
      { length: o.n },
      (_, i) => `<label class="${p}-dot" for="${p}-${i + 1}"></label>`
    ).join("\n    ");
    return {
      html: `<div class="${p}">
  ${radios(p, o.n, lang)}
  <div class="${p}-view">
    <ul class="${p}-track">
    ${slides(p, o.n, lang)}
    </ul>
  </div>
  <div class="${p}-dots">
    ${dots}
  </div>
</div>`,
      css: `.${p} {
  width: min(640px, 92%);
  margin: 0 auto;
}
.${p}-radio {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}
.${p}-view {
  overflow: hidden;
  border-radius: 12px;
}
.${p}-track {
  display: flex;
  margin: 0;
  padding: 0;
  list-style: none;
  transition: transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1);
}
.${p}-slide {
  flex: 0 0 100%;
  aspect-ratio: 16 / 9;
  border-radius: 0;
}
.${p}-dots {
  display: flex;
  justify-content: center;
  gap: 10px;
  padding-top: 14px;
}
.${p}-dot {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: #c7d1c8;
  cursor: pointer;
}
.${p}:has(.${p}-radio:focus-visible) .${p}-dots {
  outline: 3px solid #4b2fe0;
  outline-offset: 4px;
}
${perSlide(
  o.n,
  (k) => `.${p}:has(#${p}-${k}:checked) .${p}-track { transform: translateX(-${(k - 1) * 100}%); }
.${p}:has(#${p}-${k}:checked) .${p}-dot:nth-child(${k}) { background: #13302f; }`
)}
@media (prefers-reduced-motion: reduce) {
  .${p}-track { transition: none; }
}
${CARD_CSS}`,
      js: "",
    };
  },
};

const fadeKeys = (name, n, from, to) => {
  const seg = 100 / n;
  const fade = Math.min(seg / 4, 4);
  return `@keyframes ${name} {
  0% { opacity: 0; ${from} }
  ${fade.toFixed(2)}% { opacity: 1; }
  ${(seg).toFixed(2)}% { opacity: 1; }
  ${(seg + fade).toFixed(2)}% { opacity: 0; ${to} }
  100% { opacity: 0; ${to} }
}`;
};

const AUTOPLAY = {
  id: "autoplay-progress",
  cat: "basic",
  method: "css",
  label: { ja: "自動再生と進み具合のバー", en: "Autoplay with progress bars" },
  desc: {
    ja: "一定の間隔で自動で切り替わり、下のバーがいまの1枚の残り時間を示します。乗せると止まります。",
    en: "Slides change on a timer, and the bars below show how long the current slide has left. Hover to pause.",
  },
  fields: [
    { key: "n", label: { ja: "枚数", en: "Slides" }, min: 3, max: 8, step: 1, unit: "" },
    { key: "sec", label: { ja: "1枚の長さ", en: "Seconds per slide" }, min: 2, max: 10, step: 1, unit: "s" },
  ],
  defaults: { n: 4, sec: 4 },
  build(o, lang) {
    const p = "cg-auto";
    const total = o.n * o.sec;
    const seg = (100 / o.n).toFixed(2);
    const bars = Array.from({ length: o.n }, (_, i) => `<span class="${p}-bar" style="--i: ${i}"></span>`).join("\n    ");
    const items = Array.from(
      { length: o.n },
      (_, i) => `<li class="cg-card ${p}-slide" style="--h: ${hue(i, o.n)}; --i: ${i}">${word(i, lang)}</li>`
    ).join("\n    ");
    return {
      html: `<div class="${p}">
  <ul class="${p}-view">
    ${items}
  </ul>
  <div class="${p}-bars" aria-hidden="true">
    ${bars}
  </div>
</div>`,
      css: `.${p} {
  --dur: ${total}s;
  --step: ${o.sec}s;
  width: min(640px, 92%);
  margin: 0 auto;
}
.${p}-view {
  position: relative;
  aspect-ratio: 16 / 9;
  margin: 0 0 12px;
  padding: 0;
  list-style: none;
}
.${p}-slide {
  position: absolute;
  inset: 0;
  opacity: 0;
  animation: ${p}-show var(--dur) linear infinite;
  animation-delay: calc(var(--i) * var(--step));
}
.${p}-slide:first-child {
  opacity: 1;
}
.${p}-bars {
  display: flex;
  gap: 8px;
}
.${p}-bar {
  flex: 1;
  height: 6px;
  border-radius: 3px;
  background: #c7d1c8;
  overflow: hidden;
}
.${p}-bar::before {
  content: "";
  display: block;
  height: 100%;
  background: #13302f;
  transform-origin: left;
  transform: scaleX(0);
  animation: ${p}-fill var(--dur) linear infinite;
  animation-delay: calc(var(--i) * var(--step));
}
.${p}:hover .${p}-slide,
.${p}:hover .${p}-bar::before {
  animation-play-state: paused;
}
${fadeKeys(`${p}-show`, o.n, "", "")}
@keyframes ${p}-fill {
  0% { transform: scaleX(0); }
  ${seg}% { transform: scaleX(1); }
  ${(Number(seg) + 0.01).toFixed(2)}%, 100% { transform: scaleX(0); }
}
@media (prefers-reduced-motion: reduce) {
  .${p}-slide, .${p}-bar::before { animation: none; }
}
${CARD_CSS}`,
      js: "",
    };
  },
};

const KENBURNS = {
  id: "fullscreen-fade",
  cat: "switch",
  method: "css",
  label: { ja: "画面いっぱいのフェード", en: "Full-width fade" },
  desc: {
    ja: "画面の幅いっぱいの1枚が、少しずつ寄りながら次の1枚へふわっと切り替わります。トップページの大きな写真に向いています。",
    en: "A full-width slide slowly zooms in, then cross-fades to the next. Suits big hero photos.",
  },
  fields: [
    { key: "n", label: { ja: "枚数", en: "Slides" }, min: 3, max: 6, step: 1, unit: "" },
    { key: "sec", label: { ja: "1枚の長さ", en: "Seconds per slide" }, min: 3, max: 10, step: 1, unit: "s" },
  ],
  defaults: { n: 4, sec: 5 },
  build(o, lang) {
    const p = "cg-hero";
    const items = Array.from(
      { length: o.n },
      (_, i) => `<li class="cg-card ${p}-slide" style="--h: ${hue(i, o.n)}; --i: ${i}"><span>${word(i, lang)}</span></li>`
    ).join("\n  ");
    return {
      html: `<ul class="${p}">
  ${items}
</ul>`,
      css: `.${p} {
  --dur: ${o.n * o.sec}s;
  --step: ${o.sec}s;
  position: relative;
  height: clamp(280px, 56vw, 520px);
  margin: 0;
  padding: 0;
  list-style: none;
  overflow: hidden;
}
.${p}-slide {
  position: absolute;
  inset: 0;
  border-radius: 0;
  padding: 32px;
  font-size: clamp(20px, 3vw, 32px);
  opacity: 0;
  animation: ${p}-show var(--dur) linear infinite;
  animation-delay: calc(var(--i) * var(--step));
}
.${p}-slide:first-child {
  opacity: 1;
}
${fadeKeys(`${p}-show`, o.n, "transform: scale(1);", "transform: scale(1.12);")}
@media (prefers-reduced-motion: reduce) {
  .${p}-slide { animation: none; }
}
${CARD_CSS}`,
      js: "",
    };
  },
};

export const BASIC_2 = [THUMBS, RADIO, AUTOPLAY];
export const SWITCH = [KENBURNS];
