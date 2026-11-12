import { hideCss, ease, half, BASE_CSS, TRACK_JS, FADE_CSS, hexToRgb } from "./_shared.js?v=20261113b";
import { wrap, DIV, rootCss, particle, canvasFx } from "./middle-2.js?v=20261113b";

function shade(hex, f) {
  const n = parseInt(hex.slice(1), 16);
  const c = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => Math.round(v * f));
  return `rgb(${c.join(", ")})`;
}

function followerCss(o, cls, rest) {
  return `.stalker {
${BASE_CSS}
${FADE_CSS}
}
.${cls} {
  position: absolute;
  top: 0;
  left: 0;
${rest}
}`;
}

const pen = canvasFx({
  id: "pen",
  label: "ペンで描いて消える",
  desc: "マウスの通った所にペンの線が描かれ、しっぽの側から消えていきます。遅れで線の長さが変わります。",
  uses: ["color", "size", "lag", "hide"],
  defaults: { size: 6, lag: 60, color: "#2563eb" },
  range: { size: [2, 24] },
  code: (o) => ({
    setup: `  const RGB = "${hexToRgb(o.color)}";
  const LIFE = ${200 + o.lag * 10};
  const LW = ${o.size};`,
    first: `      parts.length = 0;`,
    move: `    const last = parts[parts.length - 1];
    if (!last || Math.hypot(mx - last.x, my - last.y) > 1.5) parts.push({ x: mx, y: my, t: performance.now() });`,
    step: `    const now = performance.now();
    while (parts.length && now - parts[0].t > LIFE) parts.shift();
    const n = parts.length;
    ctx.lineCap = "round";
    ctx.strokeStyle = "rgb(" + RGB + ")";
    for (let i = 1; i < n - 1; i++) {
      const a = parts[i - 1], b = parts[i], c = parts[i + 1];
      ctx.lineWidth = LW * (0.2 + (0.8 * i) / n);
      ctx.beginPath();
      ctx.moveTo((a.x + b.x) / 2, (a.y + b.y) / 2);
      ctx.quadraticCurveTo(b.x, b.y, (b.x + c.x) / 2, (b.y + c.y) / 2);
      ctx.stroke();
    }
    if (n > 1) {
      const a = parts[n - 2], b = parts[n - 1];
      ctx.lineWidth = LW;
      ctx.beginPath();
      ctx.moveTo((a.x + b.x) / 2, (a.y + b.y) / 2);
      ctx.lineTo(b.x, b.y);
      ctx.stroke();
    }`,
  }),
});

const fireflies = canvasFx({
  id: "fireflies",
  label: "蛍",
  desc: "ぼんやり光る蛍が、マウスの近くをふわふわと飛び回ります。",
  uses: ["color", "size", "hide"],
  defaults: { size: 30, color: "#eab308" },
  range: { size: [10, 80] },
  code: (o) => ({
    setup: `  const RGB = "${hexToRgb(o.color)}";
  const SPREAD = ${o.size};
  const K = 0.08 / SPREAD;
  const G = 12;
  const flies = Array.from({ length: 14 }, () => ({
    x: -100, y: -100, vx: 0, vy: 0,
    a: Math.random() * 6.3,
    f: 0.002 + Math.random() * 0.003,
    ph: Math.random() * 6.3,
  }));
  let cx = -100, cy = -100, fade = 0;`,
    first: `      cx = mx;
      cy = my;
      flies.forEach((f) => {
        f.x = mx + (Math.random() - 0.5) * SPREAD * 3;
        f.y = my + (Math.random() - 0.5) * SPREAD * 3;
      });`,
    step: `    fade += ((active ? 1 : 0) - fade) * 0.05;
    cx += (mx - cx) * 0.15;
    cy += (my - cy) * 0.15;
    for (const f of flies) {
      f.a += (Math.random() - 0.5) * 0.5;
      f.vx = (f.vx + Math.cos(f.a) * 0.12 + (cx - f.x) * K) * 0.93;
      f.vy = (f.vy + Math.sin(f.a) * 0.12 + (cy - f.y) * K) * 0.93;
      f.x += f.vx;
      f.y += f.vy;
      const b = fade * (0.25 + 0.75 * Math.max(0, Math.sin(t * f.f + f.ph)));
      if (b < 0.02) continue;
      const g = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, G);
      g.addColorStop(0, "rgba(255, 255, 230, " + b + ")");
      g.addColorStop(0.25, "rgba(" + RGB + ", " + b * 0.9 + ")");
      g.addColorStop(1, "rgba(" + RGB + ", 0)");
      ctx.fillStyle = g;
      ctx.fillRect(f.x - G, f.y - G, G * 2, G * 2);
    }
    keep = active || fade > 0.01;`,
  }),
});

const soapBubbles = particle({
  id: "soap-bubbles",
  label: "シャボン玉",
  desc: "虹色に光るシャボン玉がゆらゆら浮かんで、ぱちんと割れます。",
  uses: ["size", "hide"],
  defaults: { size: 40 },
  range: { size: [16, 90] },
  gap: 46,
  cap: 30,
  css: () => `.stalker-soap {
  position: absolute;
  width: var(--s);
  height: var(--s);
  margin: calc(var(--s) / -2) 0 0 calc(var(--s) / -2);
  border: 1px solid rgba(140, 170, 255, 0.55);
  border-radius: 50%;
  background:
    radial-gradient(circle at 30% 28%, rgba(255, 255, 255, 0.95) 0 7%, rgba(255, 255, 255, 0) 14%),
    radial-gradient(circle at 70% 76%, rgba(255, 255, 255, 0.6) 0 4%, rgba(255, 255, 255, 0) 9%),
    conic-gradient(from var(--h), rgba(255, 110, 199, 0.5), rgba(110, 200, 255, 0.5), rgba(150, 255, 170, 0.45), rgba(255, 230, 120, 0.5), rgba(255, 110, 199, 0.5));
  -webkit-mask: radial-gradient(circle, rgba(0, 0, 0, 0.25) 52%, #000 72%);
  mask: radial-gradient(circle, rgba(0, 0, 0, 0.25) 52%, #000 72%);
  animation: stalker-soap var(--t) ease-in-out forwards;
}
@keyframes stalker-soap {
  0% { opacity: 0; transform: translate(0, 0) scale(0.3); }
  10% { opacity: 1; transform: translate(0, -8px) scale(1); }
  35% { transform: translate(calc(var(--dx) * 0.4), -45px) scale(1.05, 0.95); }
  65% { transform: translate(calc(var(--dx) * -0.2), -95px) scale(0.95, 1.05); }
  92% { opacity: 1; transform: translate(var(--dx), -140px) scale(1); }
  100% { opacity: 0; transform: translate(var(--dx), -146px) scale(1.4); }
}`,
  make: (o) => `    p.className = "stalker-soap";
    p.style.setProperty("--s", ${half(o.size)} + Math.random() * ${half(o.size)} + "px");
    p.style.setProperty("--h", Math.random() * 360 + "deg");
    p.style.setProperty("--dx", (Math.random() - 0.5) * 80 + "px");
    p.style.setProperty("--t", 2.4 + Math.random() * 1.2 + "s");`,
});

const notes = particle({
  id: "notes",
  label: "音符",
  desc: "動かすと音符がゆれながら、ふわりと上へ浮かんでいきます。",
  defaults: { size: 26, color: "#7c3aed" },
  gap: 30,
  css: (o) => `.stalker-note {
  position: absolute;
  color: ${o.color};
  font-size: var(--s);
  line-height: 1;
  animation: stalker-note var(--t) ease-out forwards;
}
@keyframes stalker-note {
  0% { opacity: 0; transform: translate(-50%, -50%) rotate(-10deg) scale(0.6); }
  15% { opacity: 1; transform: translate(-50%, -60%) rotate(0deg) scale(1); }
  50% { transform: translate(calc(-50% + var(--dx)), calc(-50% - 45px)) rotate(14deg); }
  100% { opacity: 0; transform: translate(calc(-50% - var(--dx) * 0.5), calc(-50% - 100px)) rotate(-12deg); }
}`,
  make: (o) => `    p.className = "stalker-note";
    p.textContent = "♪♫♬♩"[Math.floor(Math.random() * 4)];
    p.style.setProperty("--s", ${half(o.size)} + Math.random() * ${half(o.size)} + "px");
    p.style.setProperty("--dx", 10 + Math.random() * 20 + "px");
    p.style.setProperty("--t", 1.4 + Math.random() * 0.8 + "s");`,
});

const footprints = {
  id: "footprints",
  label: "足あと",
  desc: "進む向きに合わせて、右・左と交互に足あとが残って消えていきます。",
  uses: ["color", "size", "hide"],
  defaults: { size: 22, color: "#78716c" },
  range: { size: [12, 60] },
  build(o) {
    return {
      html: DIV,
      css: rootCss(o, `.stalker-foot {
  position: absolute;
  width: ${Math.round(o.size * 0.55)}px;
  height: ${o.size}px;
  color: ${o.color};
  transform: translate(-50%, -50%) rotate(var(--r)) scaleX(var(--m));
  animation: stalker-foot 2s ease-out forwards;
}
.stalker-foot svg {
  display: block;
  width: 100%;
  height: 100%;
  fill: currentColor;
}
@keyframes stalker-foot {
  0% { opacity: 0; }
  10% { opacity: 0.85; }
  60% { opacity: 0.85; }
  100% { opacity: 0; }
}`),
      js: wrap(o, `  const FOOT = '<svg viewBox="0 0 24 44"><path d="M11 1C5 1 2 7 3 14c1 6 4 9 4 13h10c0-5 4-8 4-14C21 6 17 1 11 1z"/><path d="M7 30h10c0 6-1 12-5 12s-5-6-5-12z"/></svg>';
  const GAP = ${Math.round(o.size * 1.4)}, OFF = ${(o.size * 0.3).toFixed(1)};
  let lastX = -999, lastY = -999, side = 1;
  addEventListener("pointermove", (e) => {
    const x = e.clientX, y = e.clientY;
    if (lastX === -999) {
      lastX = x;
      lastY = y;
      return;
    }
    const dx = x - lastX, dy = y - lastY, d = Math.hypot(dx, dy);
    if (d < GAP) return;
    lastX = x;
    lastY = y;
    if (el.childElementCount >= 40) return;
    side = -side;
    const p = document.createElement("span");
    p.className = "stalker-foot";
    p.innerHTML = FOOT;
    p.style.left = x + (-dy / d) * side * OFF + "px";
    p.style.top = y + (dx / d) * side * OFF + "px";
    p.style.setProperty("--r", (Math.atan2(dy, dx) * 180) / Math.PI + 90 + "deg");
    p.style.setProperty("--m", side);
    p.addEventListener("animationend", () => p.remove());
    el.appendChild(p);
  });
  document.documentElement.addEventListener("mouseleave", () => {
    lastX = -999;
  });`),
    };
  },
};

const leaves = particle({
  id: "leaves",
  label: "葉っぱ",
  desc: "葉っぱが左右にゆらゆら揺れながら、ゆっくり落ちていきます。",
  defaults: { size: 24, color: "#65a30d" },
  range: { size: [12, 60] },
  gap: 34,
  cap: 40,
  css: (o) => `.stalker-leaf {
  position: absolute;
  width: calc(var(--s) * 0.65);
  height: var(--s);
  color: ${o.color};
  filter: brightness(var(--b));
  animation: stalker-leaf var(--t) ease-in-out forwards;
}
.stalker-leaf svg {
  display: block;
  width: 100%;
  height: 100%;
  fill: currentColor;
}
@keyframes stalker-leaf {
  0% { opacity: 0; transform: translate(-50%, -50%) rotate(-30deg); }
  10% { opacity: 1; }
  25% { transform: translate(calc(-50% + var(--dx)), calc(-50% + 30px)) rotate(35deg); }
  50% { transform: translate(calc(-50% - var(--dx)), calc(-50% + 70px)) rotate(-30deg); }
  75% { opacity: 1; transform: translate(calc(-50% + var(--dx)), calc(-50% + 110px)) rotate(30deg); }
  100% { opacity: 0; transform: translate(-50%, calc(-50% + 150px)) rotate(-20deg); }
}`,
  pre: () => `  const LEAF = '<svg viewBox="0 0 20 32"><path d="M10 0C19 8 19 22 10 30 1 22 1 8 10 0z"/><path d="M10 4v27" fill="none" stroke="rgba(255, 255, 255, 0.55)" stroke-width="1.2"/></svg>';`,
  make: (o) => `    p.className = "stalker-leaf";
    p.innerHTML = LEAF;
    p.style.setProperty("--s", ${half(o.size)} + Math.random() * ${half(o.size)} + "px");
    p.style.setProperty("--dx", 14 + Math.random() * 22 + "px");
    p.style.setProperty("--b", 0.8 + Math.random() * 0.45);
    p.style.setProperty("--t", 2.6 + Math.random() * 0.9 + "s");`,
});

const coins = particle({
  id: "coins",
  label: "コイン",
  desc: "動かすとくるくる回るコインが、ぴょんと飛び出して落ちていきます。",
  defaults: { size: 26, color: "#fbbf24" },
  range: { size: [14, 60] },
  gap: 40,
  cap: 30,
  css: (o) => `.stalker-coin {
  position: absolute;
  width: ${o.size}px;
  height: ${o.size}px;
  margin: -${half(o.size)}px 0 0 -${half(o.size)}px;
  animation: stalker-coin var(--t) forwards;
}
.stalker-coin i {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  border: 2px solid ${shade(o.color, 0.7)};
  border-radius: 50%;
  background: radial-gradient(circle at 35% 30%, #fff7d1 0 12%, ${o.color} 45%, ${shade(o.color, 0.75)} 100%);
  color: ${shade(o.color, 0.55)};
  font: normal 700 ${Math.round(o.size * 0.55)}px/1 sans-serif;
  animation: stalker-flip 0.6s linear infinite;
}
@keyframes stalker-coin {
  0% { opacity: 0; transform: translate(0, 0) scale(0.5); animation-timing-function: ease-out; }
  15% { opacity: 1; transform: translate(calc(var(--dx) * 0.3), -30px) scale(1); }
  45% { opacity: 1; transform: translate(calc(var(--dx) * 0.7), -56px) scale(1); animation-timing-function: ease-in; }
  100% { opacity: 0; transform: translate(var(--dx), 24px) scale(0.9); }
}
@keyframes stalker-flip {
  to { transform: rotateY(360deg); }
}`,
  make: () => `    p.className = "stalker-coin";
    p.innerHTML = "<i>¥</i>";
    p.style.setProperty("--dx", (Math.random() - 0.5) * 70 + "px");
    p.style.setProperty("--t", 1 + Math.random() * 0.4 + "s");`,
});

const magnifier = {
  id: "magnifier",
  label: "虫眼鏡",
  desc: "丸いレンズが付いてきて、レンズの中だけページが2倍に大きく見えます。",
  uses: ["color", "size", "lag", "hide"],
  defaults: { size: 160, lag: 40, color: "#334155", hide: true },
  range: { size: [80, 300] },
  build(o) {
    return {
      html: `<div class="stalker" aria-hidden="true">
  <div class="stalker-lens"><div class="stalker-view"></div></div>
</div>`,
      css: `${followerCss(o, "stalker-lens", `  box-sizing: border-box;
  width: ${o.size}px;
  height: ${o.size}px;
  margin: -${half(o.size)}px 0 0 -${half(o.size)}px;
  overflow: hidden;
  border: 3px solid ${o.color};
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);`)}
.stalker-lens::after {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: radial-gradient(circle at 30% 25%, rgba(255, 255, 255, 0.35), transparent 40%);
}
.stalker-view {
  position: absolute;
  top: 0;
  left: 0;
  transform-origin: 0 0;
}
${hideCss(o)}`,
      js: wrap(o, `  const lens = el.querySelector(".stalker-lens");
  const view = el.querySelector(".stalker-view");
  const Z = 2, C = ${half(o.size) - 3};
  view.inert = true;
  function snap() {
    const copy = document.body.cloneNode(true);
    copy.querySelectorAll(".stalker, script").forEach((n) => n.remove());
    copy.querySelectorAll("[id]").forEach((n) => n.removeAttribute("id"));
    copy.removeAttribute("id");
    view.style.width = document.documentElement.clientWidth + "px";
    view.replaceChildren(copy);
    const bg = [document.body, document.documentElement]
      .map((n) => getComputedStyle(n).backgroundColor)
      .find((c) => c !== "rgba(0, 0, 0, 0)" && c !== "transparent");
    if (bg) lens.style.backgroundColor = bg;
  }
  snap();
  addEventListener("resize", snap);
  addEventListener("load", snap);
${TRACK_JS}
  (function loop() {
    x += (mx - x) * ${ease(o)};
    y += (my - y) * ${ease(o)};
    lens.style.transform = "translate3d(" + x + "px, " + y + "px, 0)";
    view.style.transform = "translate(" + (C - (x + scrollX) * Z) + "px, " + (C - (y + scrollY) * Z) + "px) scale(" + Z + ")";
    requestAnimationFrame(loop);
  })();`),
    };
  },
};

const dotsAvoid = canvasFx({
  id: "dots-avoid",
  label: "ドットグリッド",
  aka: "背景の点が避ける",
  desc: "画面に並んだ点が、マウスが近づくとよけて、離れるとばねのように戻ります。",
  uses: ["color", "size", "hide"],
  defaults: { size: 30, color: "#6366f1" },
  range: { size: [12, 80] },
  code: (o) => ({
    setup: `  const RGB = "${hexToRgb(o.color)}";
  const R = ${o.size * 3}, GAP = 26;
  let dots = [];`,
    resize: `    dots = [];
    for (let gy = GAP / 2; gy < H; gy += GAP) {
      for (let gx = GAP / 2; gx < W; gx += GAP) dots.push({ hx: gx, hy: gy, x: gx, y: gy, vx: 0, vy: 0 });
    }`,
    step: `    const base = new Path2D(), near = new Path2D();
    for (const d of dots) {
      let fx = (d.hx - d.x) * 0.08, fy = (d.hy - d.y) * 0.08;
      if (active) {
        const dx = d.x - mx, dy = d.y - my, dist = Math.hypot(dx, dy);
        if (dist < R && dist > 0.01) {
          const f = (1 - dist / R) * 6;
          fx += (dx / dist) * f;
          fy += (dy / dist) * f;
        }
      }
      d.vx = (d.vx + fx) * 0.78;
      d.vy = (d.vy + fy) * 0.78;
      d.x += d.vx;
      d.y += d.vy;
      const off = Math.abs(d.x - d.hx) + Math.abs(d.y - d.hy);
      if (Math.abs(d.vx) + Math.abs(d.vy) > 0.02 || off > 0.3) keep = true;
      const path = off > 1 ? near : base;
      const r = 1.6 + Math.min(off / 12, 2.4);
      path.moveTo(d.x + r, d.y);
      path.arc(d.x, d.y, r, 0, Math.PI * 2);
    }
    ctx.fillStyle = "rgba(" + RGB + ", 0.35)";
    ctx.fill(base);
    ctx.fillStyle = "rgba(" + RGB + ", 0.9)";
    ctx.fill(near);`,
  }),
});

const textFlee = {
  id: "text-flee",
  label: "文字が逃げる",
  desc: "見出しの文字が1文字ずつ、近づいたマウスから逃げて、離れると元に戻ります。",
  uses: ["color", "size", "lag", "hide"],
  defaults: { size: 16, lag: 50 },
  range: { size: [8, 60] },
  build(o) {
    return {
      html: `<div class="stalker" aria-hidden="true">
  <span class="stalker-ring"></span>
</div>`,
      css: `${followerCss(o, "stalker-ring", `  width: ${o.size}px;
  height: ${o.size}px;
  margin: -${half(o.size)}px 0 0 -${half(o.size)}px;
  border: 2px solid ${o.color};
  border-radius: 50%;`)}
.stalker-char {
  display: inline-block;
}
${hideCss(o)}`,
      js: wrap(o, `  const ring = el.querySelector(".stalker-ring");
  const R = 110, PUSH = 46;
  const letters = [];
  onStop(() => letters.forEach((l) => (l.el.style.transform = "")));
  document.querySelectorAll("h1, h2").forEach((h) => {
    if (h.closest(".stalker")) return;
    h.setAttribute("aria-label", h.textContent.trim());
    const walker = document.createTreeWalker(h, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach((n) => {
      const frag = document.createDocumentFragment();
      for (const ch of n.textContent) {
        if (!ch.trim()) {
          frag.appendChild(document.createTextNode(ch));
          continue;
        }
        const prev = frag.lastChild;
        if (prev && prev.className === "stalker-char" && /[、。，．！？!?,.」』）)]/.test(ch)) {
          prev.textContent += ch;
          continue;
        }
        const s = document.createElement("span");
        s.className = "stalker-char";
        s.setAttribute("aria-hidden", "true");
        s.textContent = ch;
        frag.appendChild(s);
        letters.push({ el: s, cx: 0, cy: 0, x: 0, y: 0 });
      }
      n.replaceWith(frag);
    });
  });
  function measure() {
    letters.forEach((l) => {
      l.el.style.transform = "";
      l.x = l.y = 0;
    });
    letters.forEach((l) => {
      const r = l.el.getBoundingClientRect();
      l.cx = r.left + r.width / 2 + scrollX;
      l.cy = r.top + r.height / 2 + scrollY;
    });
  }
  measure();
  addEventListener("resize", measure);
  addEventListener("load", measure);
  if (document.fonts) document.fonts.ready.then(measure);
${TRACK_JS}
  (function loop() {
    x += (mx - x) * ${ease(o)};
    y += (my - y) * ${ease(o)};
    ring.style.transform = "translate3d(" + x + "px, " + y + "px, 0)";
    const px = mx + scrollX, py = my + scrollY;
    letters.forEach((l) => {
      let tx = 0, ty = 0;
      const dx = l.cx - px, dy = l.cy - py, d = Math.hypot(dx, dy);
      if (active && d < R && d > 0.1) {
        const f = (1 - d / R) * PUSH;
        tx = (dx / d) * f;
        ty = (dy / d) * f;
      }
      const nx = l.x + (tx - l.x) * 0.18, ny = l.y + (ty - l.y) * 0.18;
      if (Math.abs(nx - l.x) + Math.abs(ny - l.y) < 0.01) return;
      l.x = nx;
      l.y = ny;
      l.el.style.transform = "translate(" + nx + "px, " + ny + "px) rotate(" + nx * 0.6 + "deg)";
    });
    requestAnimationFrame(loop);
  })();`),
    };
  },
};

function gearPath(teeth, rp, hole) {
  const step = (Math.PI * 2) / teeth;
  const c = rp + 5;
  const pt = (r, a) => `${(c + Math.cos(a) * r).toFixed(2)} ${(c + Math.sin(a) * r).toFixed(2)}`;
  let d = "";
  for (let i = 0; i < teeth; i++) {
    const a = i * step;
    d += `${i ? "L" : "M"}${pt(rp - 5, a - step * 0.32)}L${pt(rp + 5, a - step * 0.18)}L${pt(rp + 5, a + step * 0.18)}L${pt(rp - 5, a + step * 0.32)}`;
  }
  d += `ZM${c + hole} ${c}a${hole} ${hole} 0 1 0 ${-2 * hole} 0a${hole} ${hole} 0 1 0 ${2 * hole} 0Z`;
  return { d, box: (c * 2).toFixed(1) };
}

const gear = {
  id: "gear",
  label: "歯車",
  desc: "かみ合った2つの歯車が付いてきて、動かした距離のぶんだけ回ります。",
  uses: ["color", "size", "lag", "hide"],
  defaults: { size: 48, lag: 55, color: "#475569" },
  range: { size: [24, 120] },
  build(o) {
    const big = gearPath(10, 43, 14);
    const small = gearPath(6, 25.8, 8);
    const u = o.size / 96;
    const s = Math.round(61.6 * u);
    const off = Math.round(49.5 * u);
    return {
      html: `<div class="stalker" aria-hidden="true">
  <span class="stalker-gear">
    <svg class="stalker-big" viewBox="0 0 ${big.box} ${big.box}"><path d="${big.d}"/></svg>
    <svg class="stalker-small" viewBox="0 0 ${small.box} ${small.box}"><path d="${small.d}"/></svg>
  </span>
</div>`,
      css: `${followerCss(o, "stalker-gear", "")}
.stalker-gear svg {
  position: absolute;
  fill: ${o.color};
  fill-rule: evenodd;
}
.stalker-big {
  top: -${half(o.size)}px;
  left: -${half(o.size)}px;
  width: ${o.size}px;
  height: ${o.size}px;
}
.stalker-small {
  top: ${off - half(s)}px;
  left: ${off - half(s)}px;
  width: ${s}px;
  height: ${s}px;
  opacity: 0.7;
}
${hideCss(o)}`,
      js: wrap(o, `  const g = el.querySelector(".stalker-gear");
  const big = el.querySelector(".stalker-big");
  const small = el.querySelector(".stalker-small");
  const K = ${(360 / (Math.PI * 86 * u)).toFixed(3)};
  let angle = 0;
${TRACK_JS}
  (function loop() {
    const dx = (mx - x) * ${ease(o)};
    const dy = (my - y) * ${ease(o)};
    x += dx;
    y += dy;
    const d = Math.hypot(dx, dy);
    if (d > 0.01) angle += (Math.abs(dx) >= Math.abs(dy) ? Math.sign(dx) : Math.sign(dy)) * d * K;
    g.style.transform = "translate3d(" + x + "px, " + y + "px, 0)";
    big.style.transform = "rotate(" + angle + "deg)";
    small.style.transform = "rotate(" + (30 - (angle * 10) / 6) + "deg)";
    requestAnimationFrame(loop);
  })();`),
    };
  },
};

const aurora = {
  id: "aurora",
  label: "オーロラ",
  desc: "大きくぼかした光のかたまりが、文字のうしろでゆっくり追いかけてきます。",
  uses: ["color", "size", "lag", "hide"],
  defaults: { size: 320, lag: 85, color: "#22d3ee" },
  range: { size: [120, 520] },
  build(o) {
    const rgb = hexToRgb(o.color);
    const e = Number(ease(o));
    return {
      html: `<div class="stalker" aria-hidden="true">
  <span class="stalker-blob"><i></i></span>
  <span class="stalker-blob"><i></i></span>
  <span class="stalker-blob"><i></i></span>
</div>`,
      css: `.stalker {
  position: fixed;
  top: 0;
  left: 0;
  pointer-events: none;
  z-index: -1;
  opacity: 0;
  transition: opacity 0.8s;
}
.stalker.is-active {
  opacity: 1;
}
.stalker-blob {
  position: absolute;
  top: 0;
  left: 0;
}
.stalker-blob i {
  --h: 0deg;
  display: block;
  width: ${o.size}px;
  height: ${Math.round(o.size * 0.7)}px;
  margin: -${Math.round(o.size * 0.35)}px 0 0 -${half(o.size)}px;
  border-radius: 50%;
  background: radial-gradient(closest-side, rgba(${rgb}, 0.75), rgba(${rgb}, 0));
  filter: blur(30px) hue-rotate(var(--h));
  animation: stalker-aurora 7s ease-in-out infinite alternate;
}
.stalker-blob:nth-child(2) i { --h: 70deg; animation-duration: 9s; }
.stalker-blob:nth-child(3) i { --h: 150deg; animation-duration: 11s; }
@keyframes stalker-aurora {
  from { transform: rotate(-20deg) scale(1, 0.8); }
  to { transform: rotate(25deg) scale(1.3, 1); }
}
${hideCss(o)}`,
      js: wrap(o, `  const blobs = [...el.querySelectorAll(".stalker-blob")].map((b, i) => ({
    el: b,
    e: [${e.toFixed(3)}, ${(e * 0.6).toFixed(3)}, ${(e * 0.35).toFixed(3)}][i],
    ox: [0, ${Math.round(o.size * -0.3)}, ${Math.round(o.size * 0.3)}][i],
    oy: [0, ${Math.round(o.size * 0.2)}, ${Math.round(o.size * -0.15)}][i],
    x: -999,
    y: -999,
  }));
${TRACK_JS.replace("active = true;", "active = true;\n      blobs.forEach((b) => { b.x = mx + b.ox; b.y = my + b.oy; });")}
  (function loop() {
    blobs.forEach((b) => {
      b.x += (mx + b.ox - b.x) * b.e;
      b.y += (my + b.oy - b.y) * b.e;
      b.el.style.transform = "translate3d(" + b.x + "px, " + b.y + "px, 0)";
    });
    requestAnimationFrame(loop);
  })();`),
    };
  },
};

const heartbeat = canvasFx({
  id: "heartbeat",
  label: "心電図の線",
  desc: "心電図のような線が後ろに引かれ、速く動かすほど大きく波打ちます。",
  uses: ["color", "size", "hide"],
  defaults: { size: 40, color: "#16a34a" },
  range: { size: [16, 100] },
  code: (o) => ({
    setup: `  const RGB = "${hexToRgb(o.color)}";
  const MAX = ${o.size}, BEAT = 140;
  let lx = -100, ly = -100, ph = 0, amp = 0, gap = true;
  function wave(p) {
    if (p < 0.1 || (p > 0.2 && p < 0.26) || (p > 0.4 && p < 0.52) || p > 0.68) return 0;
    if (p < 0.2) return Math.sin(((p - 0.1) / 0.1) * Math.PI) * 0.12;
    if (p < 0.29) return (-(p - 0.26) / 0.03) * 0.15;
    if (p < 0.33) return -0.15 + ((p - 0.29) / 0.04) * 1.15;
    if (p < 0.37) return 1 - ((p - 0.33) / 0.04) * 1.3;
    if (p < 0.4) return -0.3 + ((p - 0.37) / 0.03) * 0.3;
    return Math.sin(((p - 0.52) / 0.16) * Math.PI) * 0.22;
  }`,
    first: `      lx = mx;
      ly = my;
      gap = true;`,
    step: `    const ddx = mx - lx, ddy = my - ly, d = Math.hypot(ddx, ddy);
    amp += (Math.min(MAX, 4 + d * 1.6) - amp) * 0.3;
    if (active && d > 0.5) {
      const nx = ddy / d, ny = -ddx / d, n = Math.ceil(d / 3);
      for (let i = 1; i <= n; i++) {
        ph = (ph + d / n / BEAT) % 1;
        const w = wave(ph) * amp;
        parts.push({ x: lx + (ddx * i) / n + nx * w, y: ly + (ddy * i) / n + ny * w, life: 1, brk: gap });
        gap = false;
      }
      lx = mx;
      ly = my;
      keep = true;
      if (parts.length > 500) parts.splice(0, parts.length - 500);
    }
    for (let i = parts.length - 1; i >= 0; i--) {
      parts[i].life -= 0.02;
      if (parts[i].life <= 0) parts.splice(i, 1);
    }
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    for (let i = 1; i < parts.length; i++) {
      const a = parts[i - 1], b = parts[i];
      if (b.brk) continue;
      ctx.strokeStyle = "rgba(" + RGB + ", " + b.life + ")";
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.stroke();
    }
    const head = parts[parts.length - 1];
    if (active && head) {
      ctx.shadowColor = "rgb(" + RGB + ")";
      ctx.shadowBlur = 12;
      ctx.fillStyle = "rgb(" + RGB + ")";
      ctx.beginPath();
      ctx.arc(head.x, head.y, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    }`,
  }),
});

const arrowFlock = canvasFx({
  id: "arrow-flock",
  label: "矢印の群れ",
  desc: "画面に並んだ小さな矢印が、みんなでマウスのほうへ向きを変えます。",
  uses: ["color", "size", "hide"],
  defaults: { size: 14, color: "#6366f1" },
  range: { size: [8, 32] },
  code: (o) => ({
    setup: `  const RGB = "${hexToRgb(o.color)}";
  const LEN = ${o.size}, SP = ${Math.round(o.size * 3.2)};
  let arrows = [];`,
    resize: `    arrows = [];
    for (let gy = SP / 2; gy < H; gy += SP) {
      for (let gx = SP / 2; gx < W; gx += SP) arrows.push({ x: gx, y: gy, r: 0 });
    }`,
    step: `    if (mx !== -100) {
      ctx.fillStyle = "rgb(" + RGB + ")";
      for (const a of arrows) {
        let d = Math.atan2(my - a.y, mx - a.x) - a.r;
        d = Math.atan2(Math.sin(d), Math.cos(d));
        a.r += d * 0.16;
        if (Math.abs(d) > 0.003) keep = true;
        const k = Math.max(0, 1 - Math.hypot(mx - a.x, my - a.y) / 420);
        const L = LEN * (0.7 + k * 0.6);
        ctx.globalAlpha = 0.2 + k * 0.7;
        ctx.save();
        ctx.translate(a.x, a.y);
        ctx.rotate(a.r);
        ctx.beginPath();
        ctx.moveTo(L * 0.5, 0);
        ctx.lineTo(-L * 0.5, -L * 0.34);
        ctx.lineTo(-L * 0.22, 0);
        ctx.lineTo(-L * 0.5, L * 0.34);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }
      ctx.globalAlpha = 1;
    }`,
  }),
});

export const MIDDLE_3 = [pen, fireflies, soapBubbles, notes, footprints, leaves, coins, magnifier, dotsAvoid, textFlee, gear, aurora, heartbeat, arrowFlock];
