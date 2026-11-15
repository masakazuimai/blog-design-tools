import { word, hue, CARD_CSS } from "./_shared.js?v=20261116a";

const showKeys = (name, n, from, to) => {
  const seg = 100 / n;
  const fade = Math.min(seg / 3, 6);
  return `@keyframes ${name} {
  0% { ${from} }
  ${fade.toFixed(2)}% { ${to} }
  ${seg.toFixed(2)}% { ${to} }
  ${(seg + fade).toFixed(2)}% { ${from} }
  100% { ${from} }
}`;
};

const zoomKeys = (name, n) => {
  const seg = 100 / n;
  const fade = Math.min(seg / 3, 6);
  return `@keyframes ${name} {
  0% { opacity: 0; transform: scale(0.7); }
  ${fade.toFixed(2)}% { opacity: 1; transform: scale(1); }
  ${seg.toFixed(2)}% { opacity: 1; transform: scale(1); }
  ${(seg + fade).toFixed(2)}%, 100% { opacity: 0; transform: scale(1.3); }
}`;
};

const autoSlides = (p, n, lang) =>
  Array.from({ length: n }, (_, i) => `<li class="cg-card ${p}-slide" style="--h: ${hue(i, n)}; --i: ${i}">${word(i, lang)}</li>`).join(
    "\n  "
  );

const AUTO_FIELDS = [
  { key: "n", label: { ja: "枚数", en: "Slides" }, min: 3, max: 6, step: 1, unit: "" },
  { key: "sec", label: { ja: "1枚の長さ", en: "Seconds per slide" }, min: 2, max: 8, step: 1, unit: "s" },
];

const autoCss = (p, o, keys) => `.${p} {
  --step: ${o.sec}s;
  position: relative;
  width: min(640px, 92%);
  aspect-ratio: 16 / 9;
  margin: 0 auto;
  padding: 0;
  list-style: none;
  overflow: hidden;
  border-radius: 12px;
}
.${p}-slide {
  position: absolute;
  inset: 0;
  border-radius: 0;
  font-size: clamp(18px, 3vw, 28px);
  animation: ${p}-show calc(var(--step) * ${o.n}) linear infinite both;
  animation-delay: calc(var(--i) * var(--step));
}
.${p}:hover .${p}-slide {
  animation-play-state: paused;
}
${keys}
@media (prefers-reduced-motion: reduce) {
  .${p}-slide { animation: none; }
  .${p}-slide:not(:first-child) { display: none; }
}
${CARD_CSS}`;

const ZOOM = {
  id: "zoom-switch",
  cat: "switch",
  method: "css",
  label: { ja: "ズームして切り替え", en: "Zoom transition" },
  desc: {
    ja: "次の1枚が奥から大きくなりながら現れ、前の1枚は手前にふくらんで消えます。",
    en: "The next slide grows in from the back while the previous one swells toward you and fades.",
  },
  fields: AUTO_FIELDS,
  defaults: { n: 4, sec: 3 },
  build(o, lang) {
    const p = "cg-zoom-sw";
    return {
      html: `<ul class="${p}">\n  ${autoSlides(p, o.n, lang)}\n</ul>`,
      css: autoCss(p, o, zoomKeys(`${p}-show`, o.n)),
      js: "",
    };
  },
};

const CURTAIN = {
  id: "curtain",
  cat: "switch",
  method: "css",
  label: { ja: "幕を引くように開く", en: "Curtain wipe" },
  desc: {
    ja: "次の1枚が、幕を横へ引くように左から右へ現れます。clip-path の inset を動かしています。",
    en: "Each new slide is revealed left to right like a drawn curtain, by animating clip-path inset.",
  },
  fields: AUTO_FIELDS,
  defaults: { n: 4, sec: 3 },
  build(o, lang) {
    const p = "cg-curtain";
    const seg = 100 / o.n;
    const keys = `@keyframes ${p}-show {
  0% { clip-path: inset(0 100% 0 0); z-index: 2; }
  ${(seg * 0.35).toFixed(2)}% { clip-path: inset(0 0 0 0); z-index: 2; }
  ${(seg * 1.35).toFixed(2)}% { clip-path: inset(0 0 0 0); z-index: 1; }
  ${(seg * 1.36).toFixed(2)}%, 100% { clip-path: inset(0 100% 0 0); z-index: 0; }
}`;
    return {
      html: `<ul class="${p}">\n  ${autoSlides(p, o.n, lang)}\n</ul>`,
      css: autoCss(p, o, keys),
      js: "",
    };
  },
};

const BLUR = {
  id: "blur-switch",
  cat: "switch",
  method: "css",
  label: { ja: "ぼかしからくっきり", en: "Blur to focus" },
  desc: {
    ja: "次の1枚が、ぼやけた状態からピントが合うように現れます。写真の多いページで上品に見えます。",
    en: "Each slide appears out of focus, then sharpens. An elegant fit for photo-heavy pages.",
  },
  fields: AUTO_FIELDS,
  defaults: { n: 4, sec: 3 },
  build(o, lang) {
    const p = "cg-blur";
    return {
      html: `<ul class="${p}">\n  ${autoSlides(p, o.n, lang)}\n</ul>`,
      css: autoCss(p, o, showKeys(`${p}-show`, o.n, "opacity: 0; filter: blur(16px);", "opacity: 1; filter: blur(0);")),
      js: "",
    };
  },
};

const TILES = {
  id: "tile-split",
  cat: "switch",
  method: "css-js",
  label: { ja: "タイルに割れて入れ替わる", en: "Tile flip transition" },
  desc: {
    ja: "1枚の絵が小さなタイルに割れて、左上から順にくるっと裏返り、次の1枚に入れ替わります。",
    en: "The image splits into small tiles that flip over one by one from the top left to reveal the next slide.",
  },
  fields: [
    { key: "cols", label: { ja: "横のタイル数", en: "Columns" }, min: 3, max: 10, step: 1, unit: "" },
    { key: "sec", label: { ja: "切り替えの間隔", en: "Interval" }, min: 2, max: 8, step: 1, unit: "s" },
  ],
  defaults: { cols: 6, sec: 3 },
  build(o, lang) {
    const p = "cg-tiles";
    const rows = Math.round(o.cols * 0.5625);
    const names = [0, 1, 2, 3].map((i) => word(i, lang));
    return {
      html: `<div class="${p}" style="--cols: ${o.cols}; --rows: ${rows}" role="img" aria-label="${names.join(" / ")}"></div>`,
      css: `.${p} {
  display: grid;
  grid-template-columns: repeat(var(--cols), 1fr);
  width: min(640px, 92%);
  aspect-ratio: 16 / 9;
  margin: 0 auto;
  perspective: 800px;
}
.${p}-tile {
  position: relative;
  transform-style: preserve-3d;
  transition: transform 0.6s cubic-bezier(0.6, 0, 0.3, 1);
}
.${p}-tile > span {
  position: absolute;
  inset: 0;
  backface-visibility: hidden;
  background-size: calc(var(--cols) * 100%) calc(var(--rows) * 100%);
}
.${p}-tile > span:last-child {
  transform: rotateY(180deg);
}
@media (prefers-reduced-motion: reduce) {
  .${p}-tile { transition: none; }
}`,
      js: `(() => {
  const box = document.querySelector(".${p}");
  const cols = ${o.cols};
  const rows = ${rows};
  const hues = [0, 90, 180, 270];
  const paint = (h) => "linear-gradient(150deg, oklch(0.74 0.13 " + h + "), oklch(0.5 0.15 " + (h + 40) + "))";
  const tiles = [];
  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < cols; c += 1) {
      const tile = document.createElement("div");
      tile.className = "${p}-tile";
      const pos = (c / (cols - 1)) * 100 + "% " + (r / Math.max(1, rows - 1)) * 100 + "%";
      tile.innerHTML = "<span></span><span></span>";
      [...tile.children].forEach((s) => (s.style.backgroundPosition = pos));
      tile.style.transitionDelay = (c + r) * 45 + "ms";
      box.append(tile);
      tiles.push(tile);
    }
  }
  let i = 0;
  let flipped = false;
  const show = () => {
    const face = flipped ? 0 : 1;
    tiles.forEach((t) => (t.children[face].style.backgroundImage = paint(hues[(i + 1) % hues.length])));
    flipped = !flipped;
    tiles.forEach((t) => (t.style.transform = flipped ? "rotateY(180deg)" : "rotateY(0deg)"));
    i = (i + 1) % hues.length;
  };
  tiles.forEach((t) => (t.children[0].style.backgroundImage = paint(hues[0])));
  if (!matchMedia("(prefers-reduced-motion: reduce)").matches) setInterval(show, ${o.sec * 1000});
})();`,
    };
  },
};

const BG = {
  id: "bg-sync",
  demo: "x",
  cat: "switch",
  method: "css-js",
  label: { ja: "背景の色が合わせて変わる", en: "Background follows the slide" },
  desc: {
    ja: "横に送ると、真ん中のカードの色に合わせて、うしろの背景の色がなめらかに変わります。",
    en: "As you scroll sideways, the background smoothly changes to match the card in the middle.",
  },
  fields: [{ key: "n", label: { ja: "枚数", en: "Cards" }, min: 4, max: 10, step: 1, unit: "" }],
  defaults: { n: 6 },
  build(o, lang) {
    const p = "cg-bgsync";
    const items = Array.from({ length: o.n }, (_, i) => `<li class="cg-card ${p}-card" style="--h: ${hue(i, o.n)}" data-h="${hue(i, o.n)}">${word(i, lang)}</li>`).join(
      "\n    "
    );
    return {
      html: `<div class="${p}" style="--bg: ${hue(0, o.n)}">
  <ul class="${p}-list">
    ${items}
  </ul>
</div>`,
      css: `.${p} {
  padding: 40px 0;
  background: oklch(0.9 0.05 var(--bg));
  transition: background-color 0.6s;
}
.${p}-list {
  display: flex;
  gap: 16px;
  margin: 0;
  padding: 0 calc(50% - 120px);
  list-style: none;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scrollbar-width: none;
}
.${p}-card {
  flex: 0 0 240px;
  aspect-ratio: 3 / 4;
  scroll-snap-align: center;
}
@media (prefers-reduced-motion: reduce) {
  .${p} { transition: none; }
}
${CARD_CSS}`,
      js: `(() => {
  const box = document.querySelector(".${p}");
  const list = box.querySelector(".${p}-list");
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) box.style.setProperty("--bg", e.target.dataset.h);
    });
  }, { root: list, rootMargin: "0px -45% 0px -45%" });
  list.querySelectorAll(".${p}-card").forEach((card) => io.observe(card));
})();`,
    };
  },
};

export const SWITCH_2 = [ZOOM, CURTAIN, BLUR, TILES, BG];
