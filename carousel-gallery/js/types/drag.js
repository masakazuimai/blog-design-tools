import { word, hue, CARD_CSS } from "./_shared.js?v=20261116a";

const cards = (p, n, lang, extra = "") =>
  Array.from({ length: n }, (_, i) => `<li class="cg-card ${p}-card" style="--h: ${hue(i, n)}${extra ? `; ${extra(i)}` : ""}">${word(i, lang)}</li>`).join(
    "\n    "
  );

const ROW_CSS = (p) => `.${p} {
  overflow: hidden;
  padding: 32px 0;
  cursor: grab;
  touch-action: pan-y;
  user-select: none;
}
.${p}.is-dragging {
  cursor: grabbing;
}
.${p}-track {
  display: flex;
  gap: 16px;
  width: max-content;
  margin: 0;
  padding: 0 24px;
  list-style: none;
  will-change: transform;
}
.${p}-card {
  flex: 0 0 220px;
  aspect-ratio: 3 / 4;
}`;

const ROW_HTML = (p, n, lang) => `<div class="${p}" aria-label="${lang === "en" ? "Drag sideways" : "横にドラッグできます"}">
  <ul class="${p}-track">
    ${cards(p, n, lang)}
  </ul>
</div>`;

const dragJs = (p, { friction, rubber, skew, snap }) => `(() => {
  const box = document.querySelector(".${p}");
  const track = box.querySelector(".${p}-track");
  let x = 0;
  let v = 0;
  let last = 0;
  let lastT = 0;
  let down = false;
  let raf = 0;
  const min = () => Math.min(0, box.clientWidth - track.scrollWidth);
  const render = () => {
    track.style.transform = "translateX(" + x + "px)${skew ? ` skewX(" + Math.max(-12, Math.min(12, -v * ${skew})) + "deg)` : ""}";
  };
  const step = () => {
    if (down) return;
    const lo = min();
    const out = x > 0 ? -x : x < lo ? lo - x : 0;
    ${
      rubber
        ? `if (out !== 0) {
      v = v * 0.7 + out * 0.08;
    } else {
      v *= ${friction};
    }`
        : `v *= ${friction};
    if (out !== 0) { x += out; v = 0; }`
    }
    x += v;
    render();
    if (Math.abs(v) > 0.1 || (out !== 0 && Math.abs(out) > 0.5)) {
      raf = requestAnimationFrame(step);
    } else {
      ${snap ? `const w = track.firstElementChild.getBoundingClientRect().width + 16;
      const target = Math.max(lo, Math.min(0, Math.round(x / w) * w));
      if (Math.abs(target - x) > 0.5) { v = (target - x) * 0.2; raf = requestAnimationFrame(step); return; }
      x = target; v = 0; render();` : "v = 0; render();"}
    }
  };
  box.addEventListener("pointerdown", (e) => {
    down = true;
    cancelAnimationFrame(raf);
    box.setPointerCapture(e.pointerId);
    box.classList.add("is-dragging");
    last = e.clientX;
    lastT = performance.now();
    v = 0;
  });
  box.addEventListener("pointermove", (e) => {
    if (!down) return;
    const dx = e.clientX - last;
    const now = performance.now();
    const lo = min();
    const outside = x > 0 || x < lo;
    x += ${rubber ? "outside ? dx * 0.35 : dx" : "dx"};
    v = dx / Math.max(1, now - lastT) * 16;
    last = e.clientX;
    lastT = now;
    render();
  });
  const up = () => {
    if (!down) return;
    down = false;
    box.classList.remove("is-dragging");
    raf = requestAnimationFrame(step);
  };
  box.addEventListener("pointerup", up);
  box.addEventListener("pointercancel", up);
})();`;

const INERTIA = {
  id: "inertia-drag",
  cat: "drag",
  method: "css-js",
  label: { ja: "慣性つきドラッグ", en: "Inertia drag" },
  desc: {
    ja: "マウスや指で横に引っぱって送れます。勢いよく離すと、少し滑ってから止まります。",
    en: "Drag sideways with a mouse or finger. Let go quickly and it glides before stopping.",
  },
  fields: [
    { key: "n", label: { ja: "枚数", en: "Cards" }, min: 4, max: 14, step: 1, unit: "" },
    { key: "friction", label: { ja: "すべりやすさ", en: "Glide" }, min: 80, max: 98, step: 1, unit: "%" },
  ],
  defaults: { n: 8, friction: 94 },
  build(o, lang) {
    const p = "cg-inertia";
    return {
      html: ROW_HTML(p, o.n, lang),
      css: `${ROW_CSS(p)}\n${CARD_CSS}`,
      js: dragJs(p, { friction: o.friction / 100, rubber: false, skew: 0, snap: false }),
    };
  },
};

const BOUNCE = {
  id: "bounce-snap",
  cat: "drag",
  method: "css-js",
  label: { ja: "弾んで止まる", en: "Bounce and snap" },
  desc: {
    ja: "端を越えて引っぱるとゴムのように重くなり、離すと弾んで戻ります。止まるときはカードの切れ目に合わせます。",
    en: "Pull past the edge and it stretches like rubber, then bounces back. It always settles on a card edge.",
  },
  fields: [{ key: "n", label: { ja: "枚数", en: "Cards" }, min: 4, max: 14, step: 1, unit: "" }],
  defaults: { n: 8 },
  build(o, lang) {
    const p = "cg-bounce";
    return {
      html: ROW_HTML(p, o.n, lang),
      css: `${ROW_CSS(p)}\n${CARD_CSS}`,
      js: dragJs(p, { friction: 0.9, rubber: true, skew: 0, snap: true }),
    };
  },
};

const SKEW = {
  id: "skew-drag",
  cat: "drag",
  method: "css-js",
  label: { ja: "速さで傾く", en: "Skew on speed" },
  desc: {
    ja: "速く送るほどカードの列が斜めに傾き、止まるとまっすぐに戻ります。",
    en: "The faster you drag, the more the row leans. It straightens as it stops.",
  },
  fields: [
    { key: "n", label: { ja: "枚数", en: "Cards" }, min: 4, max: 14, step: 1, unit: "" },
    { key: "skew", label: { ja: "傾きやすさ", en: "Lean" }, min: 2, max: 20, step: 1, unit: "" },
  ],
  defaults: { n: 8, skew: 8 },
  build(o, lang) {
    const p = "cg-skew";
    return {
      html: ROW_HTML(p, o.n, lang),
      css: `${ROW_CSS(p)}\n${CARD_CSS}`,
      js: dragJs(p, { friction: 0.93, rubber: false, skew: o.skew / 10, snap: false }),
    };
  },
};

const DRAG_HELIX = {
  id: "drag-helix",
  cat: "drag",
  method: "css-js",
  thumbZoom: 0.32,
  label: { ja: "ドラッグで回す螺旋", en: "Drag-to-spin helix" },
  desc: {
    ja: "螺旋を左右にドラッグすると、ねじのように回りながら上下に動きます。離すと少し回り続けます。",
    en: "Drag the helix sideways to turn it like a screw. It keeps spinning a little after you let go.",
  },
  fields: [
    { key: "n", label: { ja: "枚数", en: "Cards" }, min: 8, max: 24, step: 1, unit: "" },
    { key: "r", label: { ja: "半径", en: "Radius" }, min: 140, max: 280, step: 10, unit: "px" },
  ],
  defaults: { n: 16, r: 210 },
  build(o, lang) {
    const p = "cg-dhelix";
    const angle = 40;
    const stepY = 30;
    const total = (o.n - 1) * stepY;
    const items = Array.from(
      { length: o.n },
      (_, i) =>
        `<div class="${p}-item" style="--i: ${i}; --h: ${hue(i, o.n)}"><div class="cg-card">${word(i, lang)}</div><div class="${p}-back" aria-hidden="true"></div></div>`
    ).join("\n      ");
    return {
      html: `<div class="${p}-stage" aria-label="${lang === "en" ? "Drag sideways to spin" : "横にドラッグすると回ります"}">
  <div class="${p}">
    <div class="${p}-spin">
      ${items}
    </div>
  </div>
</div>`,
      css: `.${p}-stage {
  --s: 1;
  display: grid;
  place-items: center;
  min-height: calc(${total + 260}px * var(--s));
  overflow: hidden;
  perspective: 1100px;
  cursor: grab;
  touch-action: pan-y;
  user-select: none;
}
@media (max-width: 600px) {
  .${p}-stage { --s: 0.55; }
}
.${p} {
  width: 130px;
  height: 84px;
  transform-style: preserve-3d;
  transform: rotateX(-14deg) scale(var(--s));
}
.${p}-spin {
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  transform: translateY(${total / 2}px);
}
.${p}-item {
  position: absolute;
  inset: 0;
  transform-style: preserve-3d;
  transform: translateY(calc(var(--i) * ${-stepY}px)) rotateY(calc(var(--i) * ${angle}deg)) translateZ(${o.r}px);
}
.${p}-item > * {
  position: absolute;
  inset: 0;
  backface-visibility: hidden;
}
.${p}-back {
  transform: rotateY(180deg);
  border-radius: 12px;
  background: oklch(0.42 0.06 var(--h));
}
${CARD_CSS}`,
      js: `(() => {
  const stage = document.querySelector(".${p}-stage");
  const spin = stage.querySelector(".${p}-spin");
  const half = ${total / 2};
  let a = 0;
  let v = 0;
  let last = 0;
  let down = false;
  let raf = 0;
  const render = () => {
    const y = Math.max(-half, Math.min(half, (a / ${angle}) * ${stepY}));
    spin.style.transform = "translateY(" + (half + y) + "px) rotateY(" + -a + "deg)";
  };
  const glide = () => {
    v *= 0.95;
    a += v;
    render();
    if (Math.abs(v) > 0.05) raf = requestAnimationFrame(glide);
  };
  stage.addEventListener("pointerdown", (e) => {
    down = true;
    cancelAnimationFrame(raf);
    stage.setPointerCapture(e.pointerId);
    last = e.clientX;
  });
  stage.addEventListener("pointermove", (e) => {
    if (!down) return;
    v = (e.clientX - last) * -0.4;
    a += v;
    last = e.clientX;
    render();
  });
  const up = () => {
    if (!down) return;
    down = false;
    raf = requestAnimationFrame(glide);
  };
  stage.addEventListener("pointerup", up);
  stage.addEventListener("pointercancel", up);
})();`,
    };
  },
};

const SWIPE = {
  id: "swipe-cards",
  cat: "drag",
  method: "css-js",
  label: { ja: "スワイプで送るカード", en: "Swipe card stack" },
  desc: {
    ja: "一番上のカードを左右に払うと飛んでいき、一番うしろに回ります。矢印キーでも送れます。",
    en: "Flick the top card left or right to send it to the back of the stack. Arrow keys work too.",
  },
  fields: [{ key: "n", label: { ja: "枚数", en: "Cards" }, min: 3, max: 8, step: 1, unit: "" }],
  defaults: { n: 5 },
  build(o, lang) {
    const p = "cg-swipe";
    return {
      html: `<ul class="${p}" tabindex="0" aria-label="${lang === "en" ? "Swipe or use arrow keys" : "左右に払うか、矢印キーで送れます"}">
    ${cards(p, o.n, lang)}
</ul>`,
      css: `.${p} {
  position: relative;
  width: min(240px, 70%);
  aspect-ratio: 3 / 4;
  margin: 48px auto 24px;
  padding: 0;
  list-style: none;
  touch-action: pan-y;
  user-select: none;
}
.${p}-card {
  position: absolute;
  inset: 0;
  box-shadow: 0 12px 28px rgb(0 0 0 / 0.18);
  transition: transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.4s;
  cursor: grab;
}
.${p}-card.is-dragging {
  transition: none;
  cursor: grabbing;
}
@media (prefers-reduced-motion: reduce) {
  .${p}-card { transition: none; }
}
${CARD_CSS}`,
      js: `(() => {
  const list = document.querySelector(".${p}");
  const layout = () => {
    [...list.children].forEach((card, i, all) => {
      const depth = all.length - 1 - i;
      card.style.zIndex = String(i);
      card.style.transform = "translateY(" + depth * -12 + "px) scale(" + (1 - depth * 0.05) + ")";
      card.style.opacity = depth > 3 ? "0" : "1";
    });
  };
  const send = (card, dir) => {
    card.style.transform = "translateX(" + dir * 140 + "%) rotate(" + dir * 24 + "deg)";
    card.style.opacity = "0";
    setTimeout(() => {
      list.prepend(card);
      layout();
    }, 300);
  };
  let start = 0;
  let dx = 0;
  let card = null;
  list.addEventListener("pointerdown", (e) => {
    card = list.lastElementChild;
    if (!card.contains(e.target)) { card = null; return; }
    start = e.clientX;
    dx = 0;
    card.setPointerCapture(e.pointerId);
    card.classList.add("is-dragging");
  });
  list.addEventListener("pointermove", (e) => {
    if (!card) return;
    dx = e.clientX - start;
    card.style.transform = "translateX(" + dx + "px) rotate(" + dx / 12 + "deg)";
  });
  const up = () => {
    if (!card) return;
    card.classList.remove("is-dragging");
    if (Math.abs(dx) > 90) send(card, Math.sign(dx));
    else layout();
    card = null;
  };
  list.addEventListener("pointerup", up);
  list.addEventListener("pointercancel", up);
  list.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
      e.preventDefault();
      send(list.lastElementChild, e.key === "ArrowLeft" ? -1 : 1);
    }
  });
  layout();
})();`,
    };
  },
};

const SLOWDOWN = {
  id: "slowdown-loop",
  cat: "loop",
  method: "css-js",
  label: { ja: "乗せると減速するループ", en: "Slow-on-hover loop" },
  desc: {
    ja: "流れ続けるカードが、マウスを乗せるとぴたっと止まらずに、ゆっくり減速します。離すとまた速さが戻ります。",
    en: "Instead of stopping dead on hover, the loop eases down to a crawl, then speeds back up when you leave.",
  },
  fields: [
    { key: "n", label: { ja: "枚数", en: "Cards" }, min: 4, max: 12, step: 1, unit: "" },
    { key: "dur", label: { ja: "1巡の長さ", en: "Loop length" }, min: 8, max: 60, step: 2, unit: "s" },
    { key: "slow", label: { ja: "乗せたときの速さ", en: "Hover speed" }, min: 0, max: 50, step: 5, unit: "%" },
  ],
  defaults: { n: 6, dur: 20, slow: 15 },
  build(o, lang) {
    const p = "cg-slow";
    const half = (hidden) =>
      Array.from({ length: o.n }, (_, i) => `<li class="cg-card ${p}-card" style="--h: ${hue(i, o.n)}"${hidden ? ' aria-hidden="true"' : ""}>${word(i, lang)}</li>`).join(
        "\n    "
      );
    return {
      html: `<div class="${p}">
  <ul class="${p}-track">
    ${half(false)}
    ${half(true)}
  </ul>
</div>`,
      css: `.${p} {
  --gap: 16px;
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
  animation: ${p}-flow ${o.dur}s linear infinite;
}
.${p}-card {
  flex: 0 0 200px;
  aspect-ratio: 4 / 3;
}
@keyframes ${p}-flow {
  to { transform: translateX(calc(-50% - var(--gap) / 2)); }
}
@media (prefers-reduced-motion: reduce) {
  .${p}-track { animation-play-state: paused; }
}
${CARD_CSS}`,
      js: `(() => {
  const box = document.querySelector(".${p}");
  const anim = box.querySelector(".${p}-track").getAnimations()[0];
  if (!anim) return;
  let target = 1;
  let raf = 0;
  const ease = () => {
    anim.playbackRate += (target - anim.playbackRate) * 0.08;
    if (Math.abs(target - anim.playbackRate) > 0.01) raf = requestAnimationFrame(ease);
    else anim.playbackRate = target;
  };
  const go = (rate) => {
    target = rate;
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(ease);
  };
  box.addEventListener("pointerenter", () => go(${o.slow / 100}));
  box.addEventListener("pointerleave", () => go(1));
})();`,
    };
  },
};

const COUNTER = {
  id: "numbered",
  cat: "basic",
  method: "css-js",
  label: { ja: "番号つき（3 / 8）", en: "Numbered (3 / 8)" },
  desc: {
    ja: "前後のボタンで1枚ずつ送り、「3 / 8」のようにいまの位置を数字で示します。指で横に送っても数字が変わります。",
    en: "Prev and next buttons move one card at a time, and a counter like 3 / 8 shows where you are. Swiping updates it too.",
  },
  fields: [{ key: "n", label: { ja: "枚数", en: "Cards" }, min: 3, max: 12, step: 1, unit: "" }],
  defaults: { n: 8 },
  build(o, lang) {
    const p = "cg-count";
    const prev = lang === "en" ? "Previous" : "前へ";
    const next = lang === "en" ? "Next" : "次へ";
    return {
      html: `<div class="${p}">
  <ul class="${p}-list">
    ${cards(p, o.n, lang)}
  </ul>
  <div class="${p}-bar">
    <button class="${p}-btn" type="button" data-dir="-1" aria-label="${prev}">←</button>
    <span class="${p}-num" aria-live="polite"><b>1</b> / ${o.n}</span>
    <button class="${p}-btn" type="button" data-dir="1" aria-label="${next}">→</button>
  </div>
</div>`,
      css: `.${p} {
  width: min(560px, 92%);
  margin: 0 auto;
}
.${p}-list {
  display: flex;
  margin: 0;
  padding: 0;
  list-style: none;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scroll-behavior: smooth;
  scrollbar-width: none;
  border-radius: 12px;
}
.${p}-card {
  flex: 0 0 100%;
  aspect-ratio: 16 / 9;
  border-radius: 0;
  scroll-snap-align: start;
}
.${p}-bar {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding-top: 14px;
  font-size: 18px;
  font-variant-numeric: tabular-nums;
}
.${p}-btn {
  width: 44px;
  height: 44px;
  border: 1px solid #13302f;
  border-radius: 50%;
  background: transparent;
  color: #13302f;
  font-size: 18px;
  cursor: pointer;
}
@media (prefers-reduced-motion: reduce) {
  .${p}-list { scroll-behavior: auto; }
}
${CARD_CSS}`,
      js: `(() => {
  const box = document.querySelector(".${p}");
  const list = box.querySelector(".${p}-list");
  const num = box.querySelector(".${p}-num b");
  const index = () => Math.round(list.scrollLeft / list.clientWidth);
  box.querySelectorAll(".${p}-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const i = Math.max(0, Math.min(${o.n - 1}, index() + Number(btn.dataset.dir)));
      list.scrollTo({ left: i * list.clientWidth });
    });
  });
  list.addEventListener("scroll", () => {
    num.textContent = String(index() + 1);
  }, { passive: true });
})();`,
    };
  },
};

const DIAL = {
  id: "dial",
  cat: "shape",
  method: "css-js",
  label: { ja: "ダイヤル", en: "Dial" },
  desc: {
    ja: "円の上に並んだカードを、ボタンで1つずつ回します。一番上に来たカードが大きくなります。",
    en: "Cards sit around a circle. Turn it one step at a time with the buttons, and the card at the top grows.",
  },
  fields: [
    { key: "n", label: { ja: "枚数", en: "Cards" }, min: 5, max: 14, step: 1, unit: "" },
    { key: "r", label: { ja: "円の大きさ", en: "Radius" }, min: 120, max: 240, step: 10, unit: "px" },
  ],
  defaults: { n: 9, r: 190 },
  build(o, lang) {
    const p = "cg-dial";
    const prev = lang === "en" ? "Turn left" : "左へ回す";
    const next = lang === "en" ? "Turn right" : "右へ回す";
    return {
      html: `<div class="${p}" style="--n: ${o.n}; --step: 0">
  <ul class="${p}-wheel">
    ${cards(p, o.n, lang, (i) => `--i: ${i}`)}
  </ul>
  <div class="${p}-bar">
    <button class="${p}-btn" type="button" data-dir="-1" aria-label="${prev}">↺</button>
    <button class="${p}-btn" type="button" data-dir="1" aria-label="${next}">↻</button>
  </div>
</div>`,
      css: `.${p} {
  --r: ${o.r}px;
  --s: 1;
  position: relative;
  width: calc((var(--r) * 2 + 160px) * var(--s));
  margin: 0 auto;
  padding-top: 20px;
}
@media (max-width: 600px) {
  .${p} { --s: 0.65; }
}
.${p}-wheel {
  position: relative;
  height: calc((var(--r) * 2 + 140px) * var(--s));
  margin: 0;
  padding: 0;
  list-style: none;
  transform: rotate(calc(var(--step) * -360deg / var(--n)));
  transition: transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1);
}
.${p}-card {
  position: absolute;
  left: 50%;
  top: 50%;
  width: calc(110px * var(--s));
  aspect-ratio: 4 / 3;
  margin: calc(-41px * var(--s)) 0 0 calc(-55px * var(--s));
  transform: rotate(calc(var(--i) * 360deg / var(--n))) translateY(calc(var(--r) * -1 * var(--s))) scale(0.85);
  transition: transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1), filter 0.6s;
  filter: saturate(0.6);
}
.${p}-card.is-active {
  transform: rotate(calc(var(--i) * 360deg / var(--n))) translateY(calc(var(--r) * -1 * var(--s))) scale(1.2);
  filter: none;
}
.${p}-bar {
  display: flex;
  justify-content: center;
  gap: 16px;
}
.${p}-btn {
  width: 48px;
  height: 48px;
  border: 1px solid #13302f;
  border-radius: 50%;
  background: transparent;
  color: #13302f;
  font-size: 20px;
  cursor: pointer;
}
@media (prefers-reduced-motion: reduce) {
  .${p}-wheel, .${p}-card { transition: none; }
}
${CARD_CSS}`,
      js: `(() => {
  const box = document.querySelector(".${p}");
  const items = [...box.querySelectorAll(".${p}-card")];
  let step = 0;
  const render = () => {
    box.style.setProperty("--step", String(step));
    const active = ((step % ${o.n}) + ${o.n}) % ${o.n};
    items.forEach((card, i) => card.classList.toggle("is-active", i === active));
  };
  box.querySelectorAll(".${p}-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      step += Number(btn.dataset.dir);
      render();
    });
  });
  render();
})();`,
    };
  },
};

export const DRAG = [INERTIA, BOUNCE, SKEW, DRAG_HELIX, SWIPE];
export const DRAG_LOOP = [SLOWDOWN];
export const DRAG_BASIC = [COUNTER];
export const DRAG_SHAPE = [DIAL];
