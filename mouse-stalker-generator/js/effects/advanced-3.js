import { GUARD, HIDE_JS, hideCss, ease, dur, half, BASE_CSS, hexToRgb } from "./_shared.js?v=20261113b";

const HOVER_SEL = "a, button, [data-stalker]";

function wrap(o, body) {
  return `(() => {
${GUARD}
  const el = document.querySelector(".stalker");
${o.hide ? HIDE_JS + "\n" : ""}${body}
})();`;
}

function showJs(targets) {
  return `  addEventListener("pointermove", (e) => {
    gsap.set(${targets}, { x: e.clientX, y: e.clientY });
    el.classList.add("is-active");
  }, { once: true });
  document.documentElement.addEventListener("mouseleave", () => el.classList.remove("is-active"));
  document.documentElement.addEventListener("mouseenter", () => el.classList.add("is-active"));`;
}

const SHOW_JS = `  addEventListener("pointermove", () => el.classList.add("is-active"), { once: true });
  document.documentElement.addEventListener("mouseleave", () => el.classList.remove("is-active"));
  document.documentElement.addEventListener("mouseenter", () => el.classList.add("is-active"));`;

const SHOW_CSS = `  opacity: 0;
  transition: opacity 0.3s;
}
.stalker.is-active {
  opacity: 1;`;

const FULL_CSS = `  position: fixed;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 9999;`;

function dotCss(o, size) {
  return `.stalker {
${BASE_CSS}
  width: ${size}px;
  height: ${size}px;
  border-radius: 50%;
  background: ${o.color};
${SHOW_CSS}
}`;
}

function followJs(o) {
  return `  gsap.set(el, { xPercent: -50, yPercent: -50, x: -100, y: -100 });
  const xTo = gsap.quickTo(el, "x", { duration: ${dur(o)}, ease: "power3" });
  const yTo = gsap.quickTo(el, "y", { duration: ${dur(o)}, ease: "power3" });
${showJs("el")}`;
}

function jsString(s) {
  return JSON.stringify(String(s)).replace(/</g, "\\u003c");
}

const cardTilt = {
  id: "card-tilt",
  label: "3Dチルト",
  aka: "カードが傾く",
  desc: "カードやボタンに乗るとマウスのほうへ立体的に傾いて光が差し、離れると元に戻ります。",
  uses: ["color", "size", "lag", "hide"],
  defaults: { size: 12, lag: 20 },
  range: { size: [6, 40] },
  gsap: true,
  build(o) {
    return {
      html: `<div class="stalker" aria-hidden="true"></div>`,
      css: `${dotCss(o, o.size)}
.stalker-glare {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  pointer-events: none;
  opacity: 0;
  background: radial-gradient(circle at var(--gx, 50%) var(--gy, 50%), rgba(255, 255, 255, 0.55), rgba(255, 255, 255, 0) 60%);
}
${hideCss(o)}`,
      js: wrap(o, `${followJs(o)}
  const orig = new Map();
  let cur = null;
  onStop(() => orig.forEach((pos, t) => {
    gsap.killTweensOf(t);
    gsap.set(t, { clearProps: "transform" });
    t.style.position = pos;
    t.querySelectorAll(".stalker-glare").forEach((g) => g.remove());
  }));
  function grab(t) {
    gsap.killTweensOf(t);
    if (!orig.has(t)) {
      orig.set(t, t.style.position);
      if (getComputedStyle(t).position === "static") t.style.position = "relative";
    }
    const g = document.createElement("span");
    g.className = "stalker-glare";
    t.append(g);
    gsap.to(g, { opacity: 1, duration: 0.3 });
    gsap.set(t, { transformPerspective: 700 });
    const opt = { duration: 0.5, ease: "power3" };
    return { t, g, r: t.getBoundingClientRect(), rx: gsap.quickTo(t, "rotationX", opt), ry: gsap.quickTo(t, "rotationY", opt) };
  }
  function release(c) {
    gsap.to(c.g, { opacity: 0, duration: 0.3, onComplete: () => c.g.remove() });
    gsap.to(c.t, { rotationX: 0, rotationY: 0, duration: 0.6, ease: "power3", overwrite: true, onComplete: () => {
      if (cur && cur.t === c.t) return;
      gsap.set(c.t, { clearProps: "transform" });
      c.t.style.position = orig.get(c.t);
      orig.delete(c.t);
    } });
  }
  addEventListener("pointermove", (e) => {
    xTo(e.clientX);
    yTo(e.clientY);
    if (!cur) return;
    const px = gsap.utils.clamp(0, 1, (e.clientX - cur.r.left) / cur.r.width);
    const py = gsap.utils.clamp(0, 1, (e.clientY - cur.r.top) / cur.r.height);
    cur.ry((px - 0.5) * 22);
    cur.rx((0.5 - py) * 22);
    cur.g.style.setProperty("--gx", (px * 100).toFixed(1) + "%");
    cur.g.style.setProperty("--gy", (py * 100).toFixed(1) + "%");
  });
  document.addEventListener("pointerover", (e) => {
    const t = e.target.closest(".card, button, [data-stalker-tilt]");
    if ((cur && cur.t) === t || (!cur && !t)) return;
    if (cur) release(cur);
    cur = t ? grab(t) : null;
    gsap.to(el, { scale: t ? 0.6 : 1, duration: 0.3 });
  });`),
    };
  },
};

const speedLine = {
  id: "speed-line",
  label: "速さで太さが変わる線",
  desc: "動かした跡に線が残り、速く動かした所ほど太く、ゆっくりの所ほど細くなります。大きさは最大の太さです。",
  uses: ["color", "size", "lag", "hide"],
  defaults: { size: 18, lag: 30 },
  range: { size: [4, 48] },
  gsap: true,
  build(o) {
    return {
      html: `<svg class="stalker" aria-hidden="true">
  <g></g>
</svg>`,
      css: `.stalker {
${FULL_CSS}
${SHOW_CSS}
}
.stalker line {
  stroke: ${o.color};
  stroke-linecap: round;
}
${hideCss(o)}`,
      js: wrap(o, `  const g = el.querySelector("g");
  const N = 28;
  const MAX = ${o.size};
  const lines = Array.from({ length: N - 1 }, () => {
    const l = document.createElementNS("http://www.w3.org/2000/svg", "line");
    g.appendChild(l);
    return l;
  });
  const head = { x: -100, y: -100 };
  const mouse = { x: -100, y: -100 };
  const hist = Array.from({ length: N }, () => ({ x: -100, y: -100, w: 0 }));
  let started = false;
${SHOW_JS}
  addEventListener("pointermove", (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    if (!started) {
      head.x = mouse.x;
      head.y = mouse.y;
      hist.forEach((p) => { p.x = mouse.x; p.y = mouse.y; });
      started = true;
    }
  });
  gsap.ticker.add(() => {
    if (!started) return;
    const px = head.x, py = head.y;
    head.x = gsap.utils.interpolate(head.x, mouse.x, ${ease(o)});
    head.y = gsap.utils.interpolate(head.y, mouse.y, ${ease(o)});
    const v = Math.hypot(head.x - px, head.y - py);
    hist.pop();
    hist.unshift({ x: head.x, y: head.y, w: gsap.utils.clamp(1, MAX, v * 0.8) });
    lines.forEach((l, i) => {
      const a = hist[i];
      const b = hist[i + 1];
      l.setAttribute("x1", a.x.toFixed(1));
      l.setAttribute("y1", a.y.toFixed(1));
      l.setAttribute("x2", b.x.toFixed(1));
      l.setAttribute("y2", b.y.toFixed(1));
      l.setAttribute("stroke-width", (((a.w + b.w) / 2) * (1 - i / N)).toFixed(1));
    });
  });`),
    };
  },
};

const vortex = {
  id: "vortex",
  label: "ボルテックス",
  aka: "渦を巻く粒",
  desc: "粒がマウスの周りをうずを巻いて回り、動かすと広がって、止めると中心へ小さくまとまります。",
  uses: ["color", "size", "lag", "hide"],
  defaults: { size: 30, lag: 40 },
  range: { size: [12, 80] },
  gsap: true,
  build(o) {
    const N = 18;
    const dots = Array.from({ length: N }, (_, i) => {
      const s = Math.max(3, Math.round(3 + (i % 4) * 1.5));
      return `  <span style="width: ${s}px; height: ${s}px"></span>`;
    });
    return {
      html: `<div class="stalker" aria-hidden="true">
${dots.join("\n")}
</div>`,
      css: `.stalker {
${BASE_CSS}
${SHOW_CSS}
}
.stalker span {
  position: absolute;
  top: 0;
  left: 0;
  border-radius: 50%;
  background: ${o.color};
}
${hideCss(o)}`,
      js: wrap(o, `  const parts = [...el.querySelectorAll("span")];
  const N = parts.length;
  const S = ${o.size};
  gsap.set(parts, { xPercent: -50, yPercent: -50 });
  const c = { x: -100, y: -100 };
  const xTo = gsap.quickTo(c, "x", { duration: ${dur(o)}, ease: "power3" });
  const yTo = gsap.quickTo(c, "y", { duration: ${dur(o)}, ease: "power3" });
  const ps = parts.map((p, i) => ({
    a: (i / N) * Math.PI * 2,
    k: 0.35 + (i / N) * 0.65,
    cx: -100,
    cy: -100,
    sx: gsap.quickSetter(p, "x", "px"),
    sy: gsap.quickSetter(p, "y", "px"),
  }));
  let started = false, spread = 0.4, lx = 0, ly = 0;
${SHOW_JS}
  addEventListener("pointermove", (e) => {
    if (!started) {
      c.x = e.clientX;
      c.y = e.clientY;
      ps.forEach((p) => { p.cx = c.x; p.cy = c.y; });
      started = true;
    }
    xTo(e.clientX);
    yTo(e.clientY);
  });
  gsap.ticker.add((time, dt) => {
    if (!started) return;
    const v = Math.hypot(c.x - lx, c.y - ly);
    lx = c.x;
    ly = c.y;
    spread = gsap.utils.interpolate(spread, gsap.utils.clamp(0.6, 2.2, 0.6 + v * 0.12), 0.06);
    ps.forEach((p, i) => {
      const r = S * p.k * spread;
      p.a += (dt / 1000) * (1.5 + 3 / (r / S + 0.3));
      const f = 0.08 + (1 - p.k) * 0.25;
      p.cx = gsap.utils.interpolate(p.cx, c.x, f);
      p.cy = gsap.utils.interpolate(p.cy, c.y, f);
      p.sx(p.cx + Math.cos(p.a) * r);
      p.sy(p.cy + Math.sin(p.a) * r);
    });
  });`),
    };
  },
};

const ringsChase = {
  id: "rings-chase",
  label: "輪が増えて追う",
  desc: "大きさの違う輪がいくつも重なり、外側の輪ほど遅れて追いかけます。リンクに乗ると輪が広がります。",
  uses: ["color", "size", "lag", "hide"],
  defaults: { size: 18, lag: 30 },
  range: { size: [8, 60] },
  gsap: true,
  build(o) {
    const rings = [0, 1, 2, 3, 4].map((i) => {
      const s = Math.round(o.size * (1 + i * 0.7));
      return `  <span style="width: ${s}px; height: ${s}px; opacity: ${(1 - i * 0.17).toFixed(2)}"></span>`;
    });
    return {
      html: `<div class="stalker" aria-hidden="true">
${rings.join("\n")}
</div>`,
      css: `.stalker {
${BASE_CSS}
${SHOW_CSS}
}
.stalker span {
  position: absolute;
  top: 0;
  left: 0;
  border: 2px solid ${o.color};
  border-radius: 50%;
  box-sizing: border-box;
}
${hideCss(o)}`,
      js: wrap(o, `  const rings = [...el.querySelectorAll("span")];
  gsap.set(rings, { xPercent: -50, yPercent: -50, x: -200, y: -200 });
  const movers = rings.map((r, i) => {
    const d = ${dur(o)} + i * 0.14;
    return {
      x: gsap.quickTo(r, "x", { duration: d, ease: "power3" }),
      y: gsap.quickTo(r, "y", { duration: d, ease: "power3" }),
    };
  });
  let target = null;
${showJs("rings")}
  addEventListener("pointermove", (e) => {
    movers.forEach((m) => {
      m.x(e.clientX);
      m.y(e.clientY);
    });
  });
  document.addEventListener("pointerover", (e) => {
    const t = e.target.closest("${HOVER_SEL}");
    if (t === target) return;
    target = t;
    gsap.to(rings, { scale: t ? 1.5 : 1, duration: 0.45, ease: "back.out(2)", stagger: 0.05 });
  });`),
    };
  },
};

const clickBurst = {
  id: "click-burst",
  label: "パーティクルバースト",
  aka: "クリックで弾ける",
  desc: "クリックすると丸がかけらになって飛び散り、またマウスの所へ集まって元の丸に戻ります。",
  uses: ["color", "size", "lag", "hide"],
  defaults: { size: 26, lag: 30 },
  gsap: true,
  build(o) {
    return {
      html: `<div class="stalker" aria-hidden="true"><div class="core"></div></div>`,
      css: `.stalker {
${BASE_CSS}
${SHOW_CSS}
}
.stalker .core,
.stalker .shard {
  position: absolute;
  top: 0;
  left: 0;
  background: ${o.color};
}
.stalker .core {
  width: ${o.size}px;
  height: ${o.size}px;
  border-radius: 50%;
}
.stalker .shard {
  width: ${Math.max(4, Math.round(o.size / 3))}px;
  height: ${Math.max(4, Math.round(o.size / 3))}px;
  border-radius: 2px;
}
${hideCss(o)}`,
      js: wrap(o, `  const core = el.querySelector(".core");
  const S = ${o.size};
  const MAX = 36;
  gsap.set(core, { xPercent: -50, yPercent: -50, x: -100, y: -100 });
  const xTo = gsap.quickTo(core, "x", { duration: ${dur(o)}, ease: "power3" });
  const yTo = gsap.quickTo(core, "y", { duration: ${dur(o)}, ease: "power3" });
  const mouse = { x: -100, y: -100 };
  let alive = 0;
${showJs("core")}
  addEventListener("pointermove", (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    xTo(mouse.x);
    yTo(mouse.y);
  });
  addEventListener("pointerdown", () => {
    if (alive + 12 > MAX) return;
    const ox = gsap.getProperty(core, "x");
    const oy = gsap.getProperty(core, "y");
    gsap.timeline()
      .to(core, { scale: 0, duration: 0.12, ease: "power2.in" })
      .to(core, { scale: 1, duration: 0.5, ease: "elastic.out(1, 0.4)" }, 0.75);
    for (let i = 0; i < 12; i++) {
      const s = document.createElement("div");
      s.className = "shard";
      el.appendChild(s);
      alive++;
      const a = (i / 12) * Math.PI * 2 + Math.random() * 0.4;
      const dist = S * (1.6 + Math.random() * 1.6);
      gsap.set(s, { xPercent: -50, yPercent: -50, x: ox, y: oy, rotation: Math.random() * 360 });
      gsap.timeline({ onComplete: () => { s.remove(); alive--; } })
        .to(s, { x: ox + Math.cos(a) * dist, y: oy + Math.sin(a) * dist, rotation: "+=" + (180 + Math.random() * 180), duration: 0.4, ease: "power3.out" })
        .to(s, { x: () => mouse.x, y: () => mouse.y, scale: 0.3, duration: 0.4, ease: "power3.in" }, 0.45)
        .to(s, { opacity: 0, duration: 0.1 });
    }
  });`),
    };
  },
};

const crossMorph = {
  id: "cross-morph",
  label: "モーフィング",
  aka: "十字から丸に変形",
  desc: "ふだんは細い十字で、リンクやボタンに乗ると十字がくるりと回って塗りつぶしの丸に変わります。",
  uses: ["color", "size", "lag", "hide"],
  defaults: { size: 28, lag: 20, hide: true },
  gsap: true,
  build(o) {
    return {
      html: `<div class="stalker" aria-hidden="true"><span class="h"></span><span class="v"></span></div>`,
      css: `.stalker {
${BASE_CSS}
${SHOW_CSS}
}
.stalker span {
  position: absolute;
  top: 0;
  left: 0;
  background: ${o.color};
}
${hideCss(o)}`,
      js: wrap(o, `  const bh = el.querySelector(".h");
  const bv = el.querySelector(".v");
  const S = ${o.size};
  const BIG = Math.round(S * 1.8);
  const cross = (b, horiz) => ({ width: horiz ? S : 2, height: horiz ? 2 : S, borderRadius: 1, opacity: 1 });
  gsap.set([bh, bv], { xPercent: -50, yPercent: -50 });
  gsap.set(bh, cross(bh, true));
  gsap.set(bv, cross(bv, false));
  gsap.set(el, { x: -100, y: -100 });
  const xTo = gsap.quickTo(el, "x", { duration: ${dur(o)}, ease: "power3" });
  const yTo = gsap.quickTo(el, "y", { duration: ${dur(o)}, ease: "power3" });
  let target = null;
${showJs("el")}
  addEventListener("pointermove", (e) => {
    xTo(e.clientX);
    yTo(e.clientY);
  });
  document.addEventListener("pointerover", (e) => {
    const t = e.target.closest("${HOVER_SEL}");
    if (t === target) return;
    target = t;
    const opt = { duration: 0.45, ease: "power3.inOut", overwrite: "auto" };
    if (t) {
      gsap.to(bh, { ...opt, width: BIG, height: BIG, borderRadius: BIG / 2, opacity: 0.35 });
      gsap.to(bv, { ...opt, width: BIG, height: BIG, borderRadius: BIG / 2, opacity: 0 });
      gsap.to(el, { rotation: 90, duration: 0.45, ease: "power3.inOut" });
    } else {
      gsap.to(bh, { ...opt, ...cross(bh, true) });
      gsap.to(bv, { ...opt, ...cross(bv, false) });
      gsap.to(el, { rotation: 0, duration: 0.45, ease: "power3.inOut" });
    }
  });`),
    };
  },
};

const parallaxBg = {
  id: "parallax-bg",
  label: "パララックス",
  aka: "背景が少し動く",
  desc: "ページの後ろにぼんやりした色の玉を置き、マウスと反対の向きへ少しずつずらして奥行きを出します。",
  uses: ["color", "size", "lag", "hide"],
  defaults: { size: 12, lag: 30 },
  range: { size: [6, 40] },
  gsap: true,
  build(o) {
    const rgb = hexToRgb(o.color);
    return {
      html: `<div class="stalker-bg" aria-hidden="true">
  <span style="left: 8%; top: 12%; width: 42vmax; height: 42vmax; background: radial-gradient(circle, rgba(${rgb}, 0.35), rgba(${rgb}, 0) 65%)"></span>
  <span style="left: 58%; top: 4%; width: 34vmax; height: 34vmax; background: radial-gradient(circle, rgba(236, 72, 153, 0.25), rgba(236, 72, 153, 0) 65%)"></span>
  <span style="left: 38%; top: 52%; width: 38vmax; height: 38vmax; background: radial-gradient(circle, rgba(245, 158, 11, 0.25), rgba(245, 158, 11, 0) 65%)"></span>
</div>
<div class="stalker" aria-hidden="true"></div>`,
      css: `${dotCss(o, o.size)}
.stalker-bg {
  position: fixed;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
  z-index: -1;
}
.stalker-bg span {
  position: absolute;
  border-radius: 50%;
  transform: translate(-50%, -50%);
}
${hideCss(o)}`,
      js: wrap(o, `${followJs(o)}
  const blobs = [...document.querySelectorAll(".stalker-bg span")].map((b, i) => {
    const depth = 30 + i * 25;
    return {
      depth,
      x: gsap.quickTo(b, "x", { duration: 1.4 + i * 0.3, ease: "power2" }),
      y: gsap.quickTo(b, "y", { duration: 1.4 + i * 0.3, ease: "power2" }),
    };
  });
  gsap.set(".stalker-bg span", { xPercent: -50, yPercent: -50 });
  addEventListener("pointermove", (e) => {
    xTo(e.clientX);
    yTo(e.clientY);
    const nx = e.clientX / innerWidth - 0.5;
    const ny = e.clientY / innerHeight - 0.5;
    blobs.forEach((b) => {
      b.x(-nx * b.depth * 2);
      b.y(-ny * b.depth * 2);
    });
  });`),
    };
  },
};

const imageTrail = {
  id: "image-trail",
  label: "イメージトレイル",
  aka: "画像が遅れて追う",
  desc: "動かした道すじに色とりどりのカードがぽんぽんと現れ、少しずつ消えていきます。大きさはカードの幅です。",
  uses: ["color", "size", "lag", "hide"],
  defaults: { size: 90, lag: 30 },
  range: { size: [40, 200] },
  gsap: true,
  build(o) {
    const w = o.size;
    const h = Math.round(o.size * 1.25);
    return {
      html: `<div class="stalker" aria-hidden="true"><div class="dot"></div></div>`,
      css: `.stalker {
${BASE_CSS}
${SHOW_CSS}
}
.stalker .dot,
.stalker .tile {
  position: absolute;
  top: 0;
  left: 0;
}
.stalker .dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: ${o.color};
  z-index: 1;
}
.stalker .tile {
  width: ${w}px;
  height: ${h}px;
  border-radius: 10px;
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.22);
}
${hideCss(o)}`,
      js: wrap(o, `  const dot = el.querySelector(".dot");
  const GAP = ${Math.round(w * 0.7)};
  const MAX = 12;
  const COLORS = [
    "linear-gradient(135deg, ${o.color}, #22d3ee)",
    "linear-gradient(135deg, #f59e0b, #ef4444)",
    "linear-gradient(135deg, #ec4899, #8b5cf6)",
    "linear-gradient(135deg, #10b981, #84cc16)",
    "linear-gradient(135deg, #f472b6, ${o.color})",
  ];
  const tiles = [];
  let lx = null, ly = 0, n = 0;
  gsap.set(dot, { xPercent: -50, yPercent: -50, x: -100, y: -100 });
  const xTo = gsap.quickTo(dot, "x", { duration: ${dur(o)}, ease: "power3" });
  const yTo = gsap.quickTo(dot, "y", { duration: ${dur(o)}, ease: "power3" });
${showJs("dot")}
  function spawn(x, y) {
    if (tiles.length >= MAX) {
      const old = tiles.shift();
      gsap.killTweensOf(old);
      old.remove();
    }
    const t = document.createElement("div");
    t.className = "tile";
    t.style.background = COLORS[n++ % COLORS.length];
    el.insertBefore(t, dot);
    tiles.push(t);
    gsap.set(t, { xPercent: -50, yPercent: -50, x, y, scale: 0.3, rotation: gsap.utils.random(-14, 14) });
    gsap.timeline({ onComplete: () => { t.remove(); tiles.splice(tiles.indexOf(t), 1); } })
      .to(t, { scale: 1, duration: 0.35, ease: "back.out(1.8)" })
      .to(t, { scale: 0.7, opacity: 0, y: y + 30, duration: 0.6, ease: "power2.in" }, 0.6);
  }
  addEventListener("pointermove", (e) => {
    xTo(e.clientX);
    yTo(e.clientY);
    if (lx === null) {
      lx = e.clientX;
      ly = e.clientY;
      return;
    }
    if (Math.hypot(e.clientX - lx, e.clientY - ly) > GAP) {
      lx = e.clientX;
      ly = e.clientY;
      spawn(lx, ly);
    }
  });`),
    };
  },
};

const textSwap = {
  id: "text-swap",
  label: "スクランブルテキスト",
  aka: "文字が入れ替わる",
  desc: "リンクやボタンに乗ると丸が広がり、ばらばらの文字が入れ替わりながら設定した文字に落ち着きます。",
  uses: ["color", "size", "lag", "hide", "text"],
  defaults: { size: 14, lag: 30 },
  range: { size: [8, 40] },
  gsap: true,
  build(o) {
    const big = Math.max(72, Math.round(o.size * 5));
    return {
      html: `<div class="stalker" aria-hidden="true"><span></span></div>`,
      css: `.stalker {
${BASE_CSS}
  width: ${big}px;
  height: ${big}px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: ${o.color};
${SHOW_CSS}
}
.stalker span {
  color: #fff;
  font-size: 16px;
  font-weight: 700;
  letter-spacing: 0.08em;
  white-space: nowrap;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
}
${hideCss(o)}`,
      js: wrap(o, `  const label = el.querySelector("span");
  const TEXT = ${jsString(o.text)};
  const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&*+";
  const SMALL = ${(o.size / big).toFixed(3)};
  gsap.set(el, { xPercent: -50, yPercent: -50, x: -100, y: -100, scale: SMALL });
  gsap.set(label, { opacity: 0 });
  const xTo = gsap.quickTo(el, "x", { duration: ${dur(o)}, ease: "power3" });
  const yTo = gsap.quickTo(el, "y", { duration: ${dur(o)}, ease: "power3" });
  const prog = { p: 0 };
  let target = null, scramble = null;
${showJs("el")}
  function render() {
    const chars = [...TEXT];
    const done = Math.floor(prog.p * chars.length);
    label.textContent = chars.map((c, i) => (i < done || c === " " ? c : CHARS[Math.floor(Math.random() * CHARS.length)])).join("");
  }
  addEventListener("pointermove", (e) => {
    xTo(e.clientX);
    yTo(e.clientY);
  });
  document.addEventListener("pointerover", (e) => {
    const t = e.target.closest("${HOVER_SEL}");
    if (t === target) return;
    target = t;
    if (scramble) scramble.kill();
    if (t) {
      gsap.to(el, { scale: 1, duration: 0.4, ease: "back.out(1.6)" });
      gsap.to(label, { opacity: 1, duration: 0.2, delay: 0.1 });
      prog.p = 0;
      scramble = gsap.to(prog, { p: 1, duration: 0.6, ease: "none", onUpdate: render, onComplete: render });
    } else {
      gsap.to(el, { scale: SMALL, duration: 0.3, ease: "power3" });
      gsap.to(label, { opacity: 0, duration: 0.15 });
    }
  });`),
    };
  },
};

const longShadow = {
  id: "long-shadow",
  label: "ロングシャドウ",
  aka: "影が伸びる",
  desc: "丸から画面の真ん中と反対の向きへ影が伸び、端へ行くほど影が長くなります。",
  uses: ["color", "size", "lag", "hide"],
  defaults: { size: 30, lag: 30 },
  gsap: true,
  build(o) {
    const rgb = hexToRgb(o.color);
    return {
      html: `<div class="stalker" aria-hidden="true"><span class="shadow"></span><span class="ball"></span></div>`,
      css: `.stalker {
${BASE_CSS}
${SHOW_CSS}
}
.stalker span {
  position: absolute;
  top: 0;
  left: 0;
}
.stalker .ball {
  width: ${o.size}px;
  height: ${o.size}px;
  border-radius: 50%;
  background: ${o.color};
}
.stalker .shadow {
  width: 100px;
  height: ${o.size}px;
  border-radius: ${half(o.size)}px;
  background: linear-gradient(90deg, rgba(${rgb}, 0.5), rgba(${rgb}, 0));
}
${hideCss(o)}`,
      js: wrap(o, `  const ball = el.querySelector(".ball");
  const shadow = el.querySelector(".shadow");
  const S = ${o.size};
  gsap.set(el, { x: -100, y: -100 });
  gsap.set(ball, { xPercent: -50, yPercent: -50 });
  gsap.set(shadow, { yPercent: -50, transformOrigin: "0% 50%", scaleX: 0 });
  const xTo = gsap.quickTo(el, "x", { duration: ${dur(o)}, ease: "power3" });
  const yTo = gsap.quickTo(el, "y", { duration: ${dur(o)}, ease: "power3" });
  const rTo = gsap.quickTo(shadow, "rotation", { duration: 0.4, ease: "power3" });
  const lTo = gsap.quickTo(shadow, "scaleX", { duration: 0.4, ease: "power3" });
  let angle = 0;
${showJs("el")}
  addEventListener("pointermove", (e) => {
    xTo(e.clientX);
    yTo(e.clientY);
    const dx = e.clientX - innerWidth / 2;
    const dy = e.clientY - innerHeight / 2;
    const d = Math.hypot(dx, dy);
    const a = Math.atan2(dy, dx) * 180 / Math.PI;
    angle += ((a - angle) % 360 + 540) % 360 - 180;
    rTo(angle);
    lTo((S + d * 0.5) / 100);
  });`),
    };
  },
};

const spotMorph = {
  id: "spot-morph",
  label: "スポットの形が変わる",
  desc: "大きくやわらかな光の円が付いてきて、リンクやボタンに乗るとその形の角丸の四角に変わります。",
  uses: ["color", "size", "lag", "hide"],
  defaults: { size: 140, lag: 40 },
  range: { size: [60, 320] },
  gsap: true,
  build(o) {
    const rgb = hexToRgb(o.color);
    return {
      html: `<div class="stalker" aria-hidden="true"></div>`,
      css: `.stalker {
${BASE_CSS}
  width: ${o.size}px;
  height: ${o.size}px;
  border-radius: ${half(o.size)}px;
  background: rgba(${rgb}, 0.16);
  box-shadow: 0 0 40px 16px rgba(${rgb}, 0.16);
${SHOW_CSS}
}
${hideCss(o)}`,
      js: wrap(o, `  const S = ${o.size};
${followJs(o)}
  let target = null;
  addEventListener("pointermove", (e) => {
    if (target) return;
    xTo(e.clientX);
    yTo(e.clientY);
  });
  document.addEventListener("pointerover", (e) => {
    const t = e.target.closest("${HOVER_SEL}");
    if (t === target) return;
    target = t;
    if (t) {
      const r = t.getBoundingClientRect();
      const br = getComputedStyle(t).borderRadius;
      xTo(r.left + r.width / 2);
      yTo(r.top + r.height / 2);
      gsap.to(el, { width: r.width + 16, height: r.height + 16, borderRadius: br === "0px" ? "10px" : br, duration: 0.45, ease: "power3" });
    } else {
      xTo(e.clientX);
      yTo(e.clientY);
      gsap.to(el, { width: S, height: S, borderRadius: S / 2, duration: 0.45, ease: "power3" });
    }
  });`),
    };
  },
};

export const ADVANCED_3 = [cardTilt, speedLine, vortex, ringsChase, clickBurst, crossMorph, parallaxBg, imageTrail, textSwap, longShadow, spotMorph];
