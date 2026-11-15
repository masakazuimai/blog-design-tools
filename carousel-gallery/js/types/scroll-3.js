import { word, hue, CARD_CSS } from "./_shared.js?v=20261116a";

const EDGE = {
  id: "edge-blur",
  cat: "scroll",
  method: "css-new",
  label: { ja: "端でぼける", en: "Blur at the edges" },
  desc: {
    ja: "横に送ると、両端に近いカードほどぼやけて薄くなり、真ん中のカードに目が行きます。",
    en: "As you scroll sideways, cards near the edges blur and fade so the eye goes to the middle.",
  },
  support: {
    ja: "CSS のスクロール連動（animation-timeline: view()）は Chrome・Edge が対応しています。対応していないブラウザでは、ぼかしの無いスクロールスナップとして動きます。",
    en: "CSS view timelines work in Chrome and Edge. Other browsers show a plain scroll-snap row without the blur.",
  },
  fields: [
    { key: "n", label: { ja: "枚数", en: "Cards" }, min: 4, max: 12, step: 1, unit: "" },
    { key: "blur", label: { ja: "ぼかしの強さ", en: "Blur" }, min: 2, max: 16, step: 1, unit: "px" },
  ],
  defaults: { n: 8, blur: 6 },
  build(o, lang) {
    const p = "cg-edge";
    const items = Array.from({ length: o.n }, (_, i) => `<li class="cg-card ${p}-card" style="--h: ${hue(i, o.n)}">${word(i, lang)}</li>`).join(
      "\n  "
    );
    return {
      html: `<ul class="${p}">
  ${items}
</ul>`,
      css: `.${p} {
  display: flex;
  gap: 16px;
  margin: 0;
  padding: 32px calc(50% - 100px);
  list-style: none;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scrollbar-width: none;
}
.${p}-card {
  flex: 0 0 200px;
  aspect-ratio: 3 / 4;
  scroll-snap-align: center;
}
@supports (animation-timeline: view()) {
  .${p}-card {
    animation: ${p}-focus linear both;
    animation-timeline: view(inline);
  }
}
@keyframes ${p}-focus {
  0%, 100% { filter: blur(${o.blur}px); opacity: 0.35; }
  40%, 60% { filter: blur(0); opacity: 1; }
}
${CARD_CSS}`,
      js: "",
    };
  },
};

const SCROLL_DIAL = {
  id: "scroll-dial",
  cat: "scroll",
  method: "css-js",
  scroll: true,
  label: { ja: "スクロールで回るダイヤル", en: "Scroll-driven dial" },
  desc: {
    ja: "ページを下へ送ると、画面に固定された大きな円が回り、カードが次々と正面に来ます。見本の中を下へスクロールして試してください。",
    en: "Scrolling down turns a large pinned wheel, bringing each card to the front. Scroll down inside the preview to try it.",
  },
  support: {
    ja: "CSS のスクロール連動（animation-timeline: scroll()）は Chrome・Edge が対応しています。対応していないブラウザでは、コードの中の短い JS が同じ動きをします。",
    en: "CSS scroll timelines work in Chrome and Edge. In other browsers, the short JS in the code does the same job.",
  },
  fields: [
    { key: "n", label: { ja: "枚数", en: "Cards" }, min: 6, max: 14, step: 1, unit: "" },
    { key: "r", label: { ja: "円の大きさ", en: "Radius" }, min: 160, max: 320, step: 10, unit: "px" },
  ],
  defaults: { n: 10, r: 260 },
  build(o, lang) {
    const p = "cg-sdial";
    const items = Array.from(
      { length: o.n },
      (_, i) => `<li class="cg-card ${p}-card" style="--h: ${hue(i, o.n)}; --i: ${i}">${word(i, lang)}</li>`
    ).join("\n        ");
    return {
      html: `<div class="${p}">
  <div class="${p}-sticky">
    <ul class="${p}-wheel" style="--n: ${o.n}">
        ${items}
    </ul>
  </div>
</div>`,
      css: `.${p} {
  height: 400vh;
}
.${p}-sticky {
  position: sticky;
  top: 0;
  height: 100vh;
  overflow: hidden;
}
.${p}-wheel {
  --r: ${o.r}px;
  position: absolute;
  left: 50%;
  top: calc(100% + var(--r) * 0.35);
  width: 0;
  height: 0;
  margin: 0;
  padding: 0;
  list-style: none;
}
@media (max-width: 600px) {
  .${p}-wheel { --r: calc(${o.r}px * 0.6); }
}
.${p}-card {
  position: absolute;
  width: 150px;
  aspect-ratio: 3 / 4;
  margin: -100px 0 0 -75px;
  transform: rotate(calc(var(--i) * 360deg / var(--n))) translateY(calc(var(--r) * -1));
}
@supports (animation-timeline: scroll()) {
  .${p}-wheel {
    animation: ${p}-turn linear both;
    animation-timeline: scroll(root);
  }
}
@keyframes ${p}-turn {
  to { transform: rotate(calc(-360deg + 360deg / var(--n))); }
}
${CARD_CSS}`,
      js: `if (!CSS.supports("animation-timeline: scroll()")) {
  const wheel = document.querySelector(".${p}-wheel");
  const update = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    const t = max > 0 ? scrollY / max : 0;
    wheel.style.transform = "rotate(" + t * (-360 + 360 / ${o.n}) + "deg)";
  };
  addEventListener("scroll", update, { passive: true });
  update();
}`,
    };
  },
};

const BOOK = {
  id: "book",
  cat: "3d",
  method: "css",
  label: { ja: "本のページめくり", en: "Page turn" },
  desc: {
    ja: "開いた本のページが、右から左へ1枚ずつめくれていきます。カタログや作品集に向いています。",
    en: "Pages of an open book turn from right to left one at a time. Suits catalogs and portfolios.",
  },
  fields: [
    { key: "n", label: { ja: "ページ数", en: "Pages" }, min: 3, max: 8, step: 1, unit: "" },
    { key: "sec", label: { ja: "1枚の長さ", en: "Seconds per page" }, min: 1, max: 5, step: 0.5, unit: "s" },
  ],
  defaults: { n: 5, sec: 2 },
  build(o, lang) {
    const p = "cg-book";
    const total = o.n * o.sec * 2;
    const seg = 100 / (o.n * 2);
    const pc = (x) => `${(x * seg).toFixed(2)}%`;
    const keys = Array.from({ length: o.n }, (_, i) => {
      const back = 2 * o.n - 1 - i;
      return `@keyframes ${p}-turn-${i} {
  0%, ${pc(i)} { transform: rotateY(0deg); z-index: ${2 * o.n - i}; }
  ${pc(i + 0.5)} { z-index: ${3 * o.n}; }
  ${pc(i + 1)}, ${pc(back)} { transform: rotateY(-180deg); z-index: ${o.n + i}; }
  ${pc(back + 0.5)} { z-index: ${3 * o.n}; }
  ${pc(back + 1)}, 100% { transform: rotateY(0deg); z-index: ${2 * o.n - i}; }
}`;
    }).join("\n");
    const names = Array.from({ length: o.n }, (_, i) => `.${p}-page:nth-child(${i + 1}) { animation-name: ${p}-turn-${i}; }`).join("\n");
    const pages = Array.from(
      { length: o.n },
      (_, i) =>
        `<li class="${p}-page" style="--i: ${i}"><span class="cg-card ${p}-front" style="--h: ${hue(i * 2, o.n * 2)}">${word(i * 2, lang)}</span><span class="cg-card ${p}-back" style="--h: ${hue(i * 2 + 1, o.n * 2)}">${word(i * 2 + 1, lang)}</span></li>`
    ).join("\n  ");
    return {
      html: `<ul class="${p}" style="--n: ${o.n}">
  ${pages}
</ul>`,
      css: `.${p} {
  position: relative;
  width: min(640px, 92%);
  aspect-ratio: 2 / 1.3;
  margin: 24px auto;
  padding: 0;
  list-style: none;
  perspective: 1600px;
  background: linear-gradient(90deg, #d8ddd6 0 50%, #eef1ec 50%);
  border-radius: 6px;
}
.${p}-page {
  position: absolute;
  left: 50%;
  top: 0;
  width: 50%;
  height: 100%;
  transform-origin: 0 50%;
  transform-style: preserve-3d;
  z-index: calc(var(--n) * 2 - var(--i));
  animation-duration: ${total}s;
  animation-timing-function: cubic-bezier(0.5, 0, 0.3, 1);
  animation-iteration-count: infinite;
}
${names}
.${p}-page > * {
  position: absolute;
  inset: 0;
  border-radius: 0 6px 6px 0;
  backface-visibility: hidden;
}
.${p}-back {
  transform: rotateY(180deg);
  border-radius: 6px 0 0 6px;
}
.${p}:hover .${p}-page {
  animation-play-state: paused;
}
${keys}
@media (prefers-reduced-motion: reduce) {
  .${p}-page { animation-play-state: paused; }
}
${CARD_CSS}`,
      js: "",
    };
  },
};

const STRETCH = {
  id: "stretch-drag",
  cat: "drag",
  method: "css-js",
  label: { ja: "引っぱると伸びる", en: "Stretchy drag" },
  desc: {
    ja: "横に引っぱると、カードの列がゴムのように引き伸ばされ、離すとぷるんと戻ります。",
    en: "Drag sideways and the row stretches like rubber, then springs back when you let go.",
  },
  fields: [
    { key: "n", label: { ja: "枚数", en: "Cards" }, min: 3, max: 8, step: 1, unit: "" },
    { key: "max", label: { ja: "伸びる量", en: "Stretch" }, min: 10, max: 60, step: 5, unit: "%" },
  ],
  defaults: { n: 5, max: 30 },
  build(o, lang) {
    const p = "cg-stretch";
    const items = Array.from({ length: o.n }, (_, i) => `<li class="cg-card ${p}-card" style="--h: ${hue(i, o.n)}">${word(i, lang)}</li>`).join(
      "\n    "
    );
    return {
      html: `<div class="${p}" aria-label="${lang === "en" ? "Drag sideways to stretch" : "横に引っぱると伸びます"}">
  <ul class="${p}-row">
    ${items}
  </ul>
</div>`,
      css: `.${p} {
  padding: 40px 16px;
  cursor: grab;
  touch-action: pan-y;
  user-select: none;
}
.${p}-row {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin: 0;
  padding: 0;
  list-style: none;
  transform-origin: 50% 50%;
}
.${p}-card {
  flex: 0 1 150px;
  aspect-ratio: 3 / 4;
}
${CARD_CSS}`,
      js: `(() => {
  const box = document.querySelector(".${p}");
  const row = box.querySelector(".${p}-row");
  let start = 0;
  let pull = 0;
  let v = 0;
  let down = false;
  let raf = 0;
  const render = () => {
    const s = 1 + Math.abs(pull) / box.clientWidth * ${o.max / 50};
    row.style.transformOrigin = pull > 0 ? "0 50%" : "100% 50%";
    row.style.transform = "scaleX(" + s + ") scaleY(" + (1 / Math.sqrt(s)) + ")";
  };
  const spring = () => {
    v = v * 0.8 - pull * 0.18;
    pull += v;
    render();
    if (Math.abs(pull) > 0.3 || Math.abs(v) > 0.3) raf = requestAnimationFrame(spring);
    else { pull = 0; render(); }
  };
  box.addEventListener("pointerdown", (e) => {
    down = true;
    cancelAnimationFrame(raf);
    box.setPointerCapture(e.pointerId);
    start = e.clientX;
  });
  box.addEventListener("pointermove", (e) => {
    if (!down) return;
    const dx = e.clientX - start;
    pull = Math.sign(dx) * Math.min(Math.abs(dx), box.clientWidth / 2) * 0.6;
    render();
  });
  const up = () => {
    if (!down) return;
    down = false;
    v = 0;
    raf = requestAnimationFrame(spring);
  };
  box.addEventListener("pointerup", up);
  box.addEventListener("pointercancel", up);
})();`,
    };
  },
};

export const SCROLL_3 = [EDGE, SCROLL_DIAL];
export const THREE_D_2 = [BOOK];
export const DRAG_2 = [STRETCH];
