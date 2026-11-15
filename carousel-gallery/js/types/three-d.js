import { word, hue, CARD_CSS } from "./_shared.js?v=20261116a";

const BACK_CSS = (p) => `.${p}-item > * {
  position: absolute;
  inset: 0;
  backface-visibility: hidden;
}
.${p}-back {
  transform: rotateY(180deg);
  border-radius: 12px;
  background: oklch(0.42 0.06 var(--h));
}`;

const face = (p, i, n, lang, style) =>
  `<div class="${p}-item" style="--h: ${hue(i, n)}; ${style}"><div class="cg-card">${word(i, lang)}</div><div class="${p}-back" aria-hidden="true"></div></div>`;

const SMALL = (s = 1) => `@media (max-width: 600px) {
  .__P__-stage { --s: ${0.55 * s}; }
}`;

const STAGE = (p, height, extra = "") => `.${p}-stage {
  --s: 1;
  display: grid;
  place-items: center;
  min-height: calc(${height}px * var(--s));
  overflow: hidden;
  perspective: 1200px;
}
${SMALL().replace("__P__", p)}
${extra}`;

const REDUCED = (sel) => `@media (prefers-reduced-motion: reduce) {
  ${sel} { animation-play-state: paused; }
}`;

const SPHERE = {
  id: "sphere",
  cat: "3d",
  method: "css",
  thumbZoom: 0.4,
  label: { ja: "球面", en: "Sphere" },
  desc: {
    ja: "カードが球の表面に散らばり、球ごとゆっくり回ります。マウスを乗せると止まります。",
    en: "Cards cover the surface of a sphere that slowly turns. Hover to pause.",
  },
  fields: [
    { key: "n", label: { ja: "枚数", en: "Cards" }, min: 12, max: 40, step: 2, unit: "" },
    { key: "dur", label: { ja: "1周の長さ", en: "Turn length" }, min: 10, max: 60, step: 2, unit: "s" },
    { key: "r", label: { ja: "半径", en: "Radius" }, min: 140, max: 280, step: 10, unit: "px" },
  ],
  defaults: { n: 26, dur: 30, r: 220 },
  build(o, lang) {
    const p = "cg-sphere";
    const golden = Math.PI * (3 - Math.sqrt(5));
    const items = Array.from({ length: o.n }, (_, i) => {
      const y = 1 - ((i + 0.5) / o.n) * 2;
      const lat = Math.round((Math.asin(y) * 180) / Math.PI);
      const lon = Math.round(((i * golden * 180) / Math.PI) % 360);
      return face(p, i, o.n, lang, `--lon: ${lon}deg; --lat: ${lat}deg`);
    }).join("\n      ");
    return {
      html: `<div class="${p}-stage">
  <div class="${p}">
    <div class="${p}-spin">
      ${items}
    </div>
  </div>
</div>`,
      css: `${STAGE(p, o.r * 2 + 160)}
.${p} {
  width: 96px;
  height: 64px;
  transform-style: preserve-3d;
  transform: rotateX(-16deg) scale(var(--s));
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
  transform: rotateY(var(--lon)) rotateX(var(--lat)) translateZ(${o.r}px);
}
.${p}-item .cg-card {
  padding: 6px 8px;
}
@keyframes ${p}-turn {
  to { transform: rotateY(-1turn); }
}
${BACK_CSS(p)}
${REDUCED(`.${p}-spin`)}
${CARD_CSS}`,
      js: "",
    };
  },
};

const SATURN = {
  id: "saturn",
  cat: "3d",
  method: "css",
  thumbZoom: 0.4,
  label: { ja: "土星の輪", en: "Saturn ring" },
  desc: {
    ja: "真ん中の球のまわりを、傾いた輪になったカードが回ります。",
    en: "Cards orbit a central sphere on a tilted ring.",
  },
  fields: [
    { key: "n", label: { ja: "枚数", en: "Cards" }, min: 6, max: 18, step: 1, unit: "" },
    { key: "dur", label: { ja: "1周の長さ", en: "Turn length" }, min: 8, max: 48, step: 2, unit: "s" },
    { key: "tilt", label: { ja: "輪の傾き", en: "Ring tilt" }, min: 0, max: 40, step: 2, unit: "°" },
  ],
  defaults: { n: 12, dur: 24, tilt: 18 },
  build(o, lang) {
    const p = "cg-saturn";
    const items = Array.from({ length: o.n }, (_, i) => face(p, i, o.n, lang, `--a: ${Math.round((360 / o.n) * i)}deg`)).join(
      "\n      "
    );
    return {
      html: `<div class="${p}-stage">
  <div class="${p}">
    <div class="${p}-planet" aria-hidden="true"></div>
    <div class="${p}-ring">
      ${items}
    </div>
  </div>
</div>`,
      css: `${STAGE(p, 520)}
.${p} {
  position: relative;
  width: 120px;
  height: 78px;
  transform-style: preserve-3d;
  transform: rotateX(-14deg) rotateZ(-${o.tilt}deg) scale(var(--s));
}
.${p}-planet {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 190px;
  height: 190px;
  margin: -95px 0 0 -95px;
  border-radius: 50%;
  background: radial-gradient(circle at 35% 30%, #ffe6b0, #e0a458 45%, #8a4f22 100%);
}
.${p}-ring {
  position: absolute;
  inset: 0;
  transform-style: preserve-3d;
  animation: ${p}-turn ${o.dur}s linear infinite;
}
.${p}:hover .${p}-ring {
  animation-play-state: paused;
}
.${p}-item {
  position: absolute;
  inset: 0;
  transform-style: preserve-3d;
  transform: rotateY(var(--a)) translateZ(250px);
}
@keyframes ${p}-turn {
  to { transform: rotateY(1turn); }
}
${BACK_CSS(p)}
${REDUCED(`.${p}-ring`)}
${CARD_CSS}`,
      js: "",
    };
  },
};

const TUNNEL = {
  id: "tunnel",
  cat: "3d",
  method: "css",
  label: { ja: "トンネル", en: "Tunnel" },
  desc: {
    ja: "奥の暗がりから、輪に並んだカードが手前へ飛んできます。トンネルの中を進んでいるように見えます。",
    en: "Cards arranged in a ring fly toward you from deep inside, like traveling through a tunnel.",
  },
  fields: [
    { key: "n", label: { ja: "枚数", en: "Cards" }, min: 8, max: 30, step: 1, unit: "" },
    { key: "dur", label: { ja: "1巡の長さ", en: "Loop length" }, min: 4, max: 30, step: 1, unit: "s" },
    { key: "r", label: { ja: "トンネルの太さ", en: "Tunnel radius" }, min: 100, max: 260, step: 10, unit: "px" },
  ],
  defaults: { n: 18, dur: 10, r: 190 },
  build(o, lang) {
    const p = "cg-tunnel";
    const items = Array.from(
      { length: o.n },
      (_, i) =>
        `<li class="cg-card ${p}-card" style="--h: ${hue(i, o.n)}; --i: ${i}; --a: ${Math.round((i * 137.5) % 360)}deg">${word(i, lang)}</li>`
    ).join("\n  ");
    return {
      html: `<ul class="${p}" style="--n: ${o.n}">
  ${items}
</ul>`,
      css: `.${p} {
  --dur: ${o.dur}s;
  --r: ${o.r}px;
  position: relative;
  height: 480px;
  margin: 0;
  padding: 0;
  list-style: none;
  overflow: hidden;
  perspective: 500px;
  background: radial-gradient(circle, #0c1b1a 0 10%, #13302f 40%, #e9eee8 100%);
}
@media (max-width: 600px) {
  .${p} { --r: calc(${o.r}px * 0.6); }
}
.${p}-card {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 120px;
  aspect-ratio: 4 / 3;
  margin: -45px 0 0 -60px;
  animation: ${p}-fly var(--dur) linear infinite;
  animation-delay: calc(var(--dur) / var(--n) * var(--i) * -1);
}
.${p}:hover .${p}-card {
  animation-play-state: paused;
}
@keyframes ${p}-fly {
  0% { transform: rotate(var(--a)) translateY(var(--r)) translateZ(-1600px) rotate(calc(var(--a) * -1)); opacity: 0; }
  20% { opacity: 1; }
  90% { opacity: 1; }
  100% { transform: rotate(var(--a)) translateY(var(--r)) translateZ(380px) rotate(calc(var(--a) * -1)); opacity: 0; }
}
${REDUCED(`.${p}-card`)}
${CARD_CSS}`,
      js: "",
    };
  },
};

const WAVE_RING = {
  id: "wave-ring",
  cat: "3d",
  method: "css",
  thumbZoom: 0.42,
  label: { ja: "波打つリング", en: "Wavy ring" },
  desc: {
    ja: "輪になったカードが回りながら、1枚ずつ時間差で上下にうねります。",
    en: "A ring of cards turns while each card rises and falls in turn, like a wave.",
  },
  fields: [
    { key: "n", label: { ja: "枚数", en: "Cards" }, min: 8, max: 20, step: 1, unit: "" },
    { key: "dur", label: { ja: "1周の長さ", en: "Turn length" }, min: 8, max: 48, step: 2, unit: "s" },
    { key: "amp", label: { ja: "うねりの大きさ", en: "Wave height" }, min: 10, max: 80, step: 5, unit: "px" },
  ],
  defaults: { n: 14, dur: 24, amp: 50 },
  build(o, lang) {
    const p = "cg-wring";
    const items = Array.from(
      { length: o.n },
      (_, i) =>
        `<div class="${p}-item" style="--h: ${hue(i, o.n)}; --a: ${Math.round((360 / o.n) * i)}deg; --i: ${i}"><div class="${p}-bob"><div class="cg-card">${word(i, lang)}</div><div class="${p}-back" aria-hidden="true"></div></div></div>`
    ).join("\n      ");
    return {
      html: `<div class="${p}-stage">
  <div class="${p}" style="--n: ${o.n}">
    <div class="${p}-spin">
      ${items}
    </div>
  </div>
</div>`,
      css: `${STAGE(p, 460)}
.${p} {
  width: 130px;
  height: 90px;
  transform-style: preserve-3d;
  transform: rotateX(-18deg) scale(var(--s));
}
.${p}-spin {
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  animation: ${p}-turn ${o.dur}s linear infinite;
}
.${p}-item {
  position: absolute;
  inset: 0;
  transform-style: preserve-3d;
  transform: rotateY(var(--a)) translateZ(260px);
}
.${p}-bob {
  position: absolute;
  inset: 0;
  transform-style: preserve-3d;
  animation: ${p}-bob 3s ease-in-out infinite;
  animation-delay: calc(3s / var(--n) * var(--i) * -2);
}
.${p}-bob > * {
  position: absolute;
  inset: 0;
  backface-visibility: hidden;
}
.${p}-back {
  transform: rotateY(180deg);
  border-radius: 12px;
  background: oklch(0.42 0.06 var(--h));
}
.${p}:hover .${p}-spin,
.${p}:hover .${p}-bob {
  animation-play-state: paused;
}
@keyframes ${p}-turn {
  to { transform: rotateY(-1turn); }
}
@keyframes ${p}-bob {
  0%, 100% { transform: translateY(${o.amp}px); }
  50% { transform: translateY(-${o.amp}px); }
}
${REDUCED(`.${p}-spin, .${p}-bob`)}
${CARD_CSS}`,
      js: "",
    };
  },
};

const ARCH = {
  id: "arch",
  cat: "3d",
  method: "css",
  label: { ja: "アーチ", en: "Arch" },
  desc: {
    ja: "カードが虹のような半円を描いて、左から右へ流れていきます。",
    en: "Cards travel across a rainbow-shaped arch from left to right.",
  },
  fields: [
    { key: "n", label: { ja: "枚数", en: "Cards" }, min: 5, max: 16, step: 1, unit: "" },
    { key: "dur", label: { ja: "1巡の長さ", en: "Loop length" }, min: 8, max: 40, step: 2, unit: "s" },
    { key: "r", label: { ja: "アーチの大きさ", en: "Arch radius" }, min: 160, max: 340, step: 10, unit: "px" },
  ],
  defaults: { n: 10, dur: 20, r: 280 },
  build(o, lang) {
    const p = "cg-arch";
    const items = Array.from(
      { length: o.n },
      (_, i) => `<li class="cg-card ${p}-card" style="--h: ${hue(i, o.n)}; --i: ${i}">${word(i, lang)}</li>`
    ).join("\n  ");
    return {
      html: `<ul class="${p}" style="--n: ${o.n}">
  ${items}
</ul>`,
      css: `.${p} {
  --dur: ${o.dur}s;
  --r: ${o.r}px;
  position: relative;
  height: calc(var(--r) + 140px);
  margin: 0;
  padding: 0;
  list-style: none;
  overflow: hidden;
}
@media (max-width: 600px) {
  .${p} { --r: calc(${o.r}px * 0.55); }
}
.${p}-card {
  position: absolute;
  left: 50%;
  bottom: 20px;
  width: 120px;
  aspect-ratio: 4 / 3;
  margin-left: -60px;
  transform-origin: 50% 100%;
  animation: ${p}-move var(--dur) linear infinite;
  animation-delay: calc(var(--dur) / var(--n) * var(--i) * -1);
}
.${p}:hover .${p}-card {
  animation-play-state: paused;
}
@keyframes ${p}-move {
  0% { transform: rotate(-100deg) translateY(calc(var(--r) * -1)); opacity: 0; }
  10% { opacity: 1; }
  90% { opacity: 1; }
  100% { transform: rotate(100deg) translateY(calc(var(--r) * -1)); opacity: 0; }
}
${REDUCED(`.${p}-card`)}
${CARD_CSS}`,
      js: "",
    };
  },
};

const FLIP = {
  id: "flip-board",
  cat: "3d",
  method: "css",
  label: { ja: "パタパタ", en: "Flip board" },
  desc: {
    ja: "並んだ板が左から順にくるりとめくれて、裏の絵に切り替わります。駅の案内板のような動きです。",
    en: "A row of panels flips over one after another to reveal the other side, like a station board.",
  },
  fields: [
    { key: "n", label: { ja: "枚数", en: "Panels" }, min: 3, max: 8, step: 1, unit: "" },
    { key: "dur", label: { ja: "1巡の長さ", en: "Loop length" }, min: 4, max: 16, step: 1, unit: "s" },
  ],
  defaults: { n: 5, dur: 8 },
  build(o, lang) {
    const p = "cg-flip";
    const items = Array.from(
      { length: o.n },
      (_, i) =>
        `<li class="${p}-item" style="--i: ${i}"><div class="cg-card ${p}-front" style="--h: ${hue(i, o.n * 2)}">${word(i, lang)}</div><div class="cg-card ${p}-back" style="--h: ${hue(i + o.n, o.n * 2)}">${word(i + o.n, lang)}</div></li>`
    ).join("\n  ");
    return {
      html: `<ul class="${p}">
  ${items}
</ul>`,
      css: `.${p} {
  display: grid;
  grid-template-columns: repeat(${o.n}, 1fr);
  gap: 12px;
  width: min(900px, 94%);
  margin: 0 auto;
  padding: 0;
  list-style: none;
  perspective: 900px;
}
.${p}-item {
  position: relative;
  aspect-ratio: 3 / 4;
  transform-style: preserve-3d;
  animation: ${p}-turn ${o.dur}s cubic-bezier(0.6, 0, 0.3, 1) infinite;
  animation-delay: calc(var(--i) * 0.12s);
}
.${p}-item > * {
  position: absolute;
  inset: 0;
  backface-visibility: hidden;
}
.${p}-back {
  transform: rotateX(180deg);
}
.${p}:hover .${p}-item {
  animation-play-state: paused;
}
@keyframes ${p}-turn {
  0%, 40% { transform: rotateX(0deg); }
  50%, 90% { transform: rotateX(180deg); }
  100% { transform: rotateX(360deg); }
}
${REDUCED(`.${p}-item`)}
${CARD_CSS}`,
      js: "",
    };
  },
};

export const THREE_D = [SPHERE, SATURN, TUNNEL, WAVE_RING, ARCH, FLIP];
