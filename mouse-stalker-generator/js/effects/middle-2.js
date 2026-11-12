import { GUARD, HIDE_JS, hideCss, ease, half, BASE_CSS, TRACK_JS, FADE_CSS, hexToRgb } from "./_shared.js?v=20261113b";

export function wrap(o, body) {
  return `(() => {
${GUARD}
  const el = document.querySelector(".stalker");
${o.hide ? HIDE_JS + "\n" : ""}${body}
})();`;
}

export const DIV = `<div class="stalker" aria-hidden="true"></div>`;
export const CANVAS = `<canvas class="stalker" aria-hidden="true"></canvas>`;

export function rootCss(o, rest) {
  return `.stalker {
${BASE_CSS}
}
${rest}
${hideCss(o)}`;
}

export function canvasCss(o) {
  return `.stalker {
${BASE_CSS}
  width: 100%;
  height: 100%;
${FADE_CSS}
}
${hideCss(o)}`;
}

export function spawn({ gap, cap = 60, make }) {
  return `  let lastX = -999, lastY = -999;
  addEventListener("pointermove", (e) => {
    const x = e.clientX, y = e.clientY;
    if (Math.hypot(x - lastX, y - lastY) < ${gap}) return;
    lastX = x;
    lastY = y;
    if (el.childElementCount >= ${cap}) return;
    const p = document.createElement("span");
${make}
    p.style.left = x + "px";
    p.style.top = y + "px";
    p.addEventListener("animationend", (ev) => ev.target === p && p.remove());
    el.appendChild(p);
  });`;
}

export function particle(spec) {
  return {
    ...spec,
    uses: spec.uses || ["color", "size", "hide"],
    build(o) {
      return {
        html: DIV,
        css: rootCss(o, spec.css(o)),
        js: wrap(o, (spec.pre ? spec.pre(o) + "\n" : "") + spawn({ gap: spec.gap, cap: spec.cap, make: spec.make(o) })),
      };
    },
  };
}

export function canvasJs({ setup = "", first = "", move = "", down = "", resize = "", step }) {
  const downJs = down
    ? `  addEventListener("pointerdown", (e) => {
    mx = e.clientX;
    my = e.clientY;
${down}
    kick();
  });
`
    : "";
  return `  const ctx = el.getContext("2d");
  const parts = [];
  let W = 0, H = 0, mx = -100, my = -100, active = false, running = false;
  function kick() {
    if (running) return;
    running = true;
    requestAnimationFrame(frame);
  }
${setup}
  function resize() {
    const r = Math.min(devicePixelRatio || 1, 2);
    W = innerWidth;
    H = innerHeight;
    el.width = Math.round(W * r);
    el.height = Math.round(H * r);
    ctx.setTransform(r, 0, 0, r, 0, 0);
${resize}
    kick();
  }
  resize();
  addEventListener("resize", resize);
  addEventListener("pointermove", (e) => {
    mx = e.clientX;
    my = e.clientY;
    if (!active) {
      active = true;
      el.classList.add("is-active");
${first}
    }
${move}
    kick();
  });
${downJs}  document.documentElement.addEventListener("mouseleave", () => {
    active = false;
    el.classList.remove("is-active");
    kick();
  });
  function frame(t) {
    ctx.clearRect(0, 0, W, H);
    let keep = false;
${step}
    if (keep || parts.length) requestAnimationFrame(frame);
    else running = false;
  }`;
}

export function canvasFx(spec) {
  return {
    ...spec,
    build(o) {
      return { html: CANVAS, css: canvasCss(o), js: wrap(o, canvasJs(spec.code(o))) };
    },
  };
}

const sizeVar = (o) => `    p.style.setProperty("--s", ${half(o.size)} + Math.random() * ${half(o.size)} + "px");`;

const snow = particle({
  id: "snow",
  label: "雪",
  desc: "動かした跡から雪の結晶がひらひらと降っていきます。",
  defaults: { size: 20, color: "#60a5fa" },
  gap: 18,
  css: (o) => `.stalker-snow {
  position: absolute;
  color: ${o.color};
  font-size: var(--s);
  line-height: 1;
  text-shadow: 0 0 6px rgba(${hexToRgb(o.color)}, 0.6);
  animation: stalker-snow var(--t) linear forwards;
}
@keyframes stalker-snow {
  0% { opacity: 0; transform: translate(-50%, -50%) rotate(0deg); }
  10% { opacity: 1; }
  50% { transform: translate(calc(-50% + var(--dx)), calc(-50% + 70px)) rotate(120deg); }
  100% { opacity: 0; transform: translate(-50%, calc(-50% + 150px)) rotate(240deg); }
}`,
  make: (o) => `    p.className = "stalker-snow";
    p.textContent = "❄❅❆"[Math.floor(Math.random() * 3)];
${sizeVar(o)}
    p.style.setProperty("--dx", (Math.random() - 0.5) * 60 + "px");
    p.style.setProperty("--t", 1.6 + Math.random() * 1.2 + "s");`,
});

const sakura = particle({
  id: "sakura",
  label: "桜",
  desc: "花びらがくるくる回りながら、ななめに舞い落ちます。",
  defaults: { size: 22, color: "#f9a8c9" },
  gap: 24,
  css: (o) => `.stalker-petal {
  position: absolute;
  width: var(--s);
  height: calc(var(--s) * 1.2);
  color: ${o.color};
  animation: stalker-petal var(--t) ease-in-out forwards;
}
.stalker-petal svg {
  display: block;
  width: 100%;
  height: 100%;
  fill: currentColor;
}
@keyframes stalker-petal {
  0% { opacity: 0; transform: translate(-50%, -50%) rotate(var(--r)) rotateX(0deg); }
  15% { opacity: 0.95; }
  100% { opacity: 0; transform: translate(calc(-50% + var(--dx)), calc(-50% + 130px)) rotate(calc(var(--r) + 240deg)) rotateX(420deg); }
}`,
  pre: () => `  const PETAL = '<svg viewBox="0 0 20 24"><path d="M10 5 7 0C2 4 0 12 4 19c3 5 9 5 12 0 4-7 2-15-3-19z"/></svg>';`,
  make: (o) => `    p.className = "stalker-petal";
    p.innerHTML = PETAL;
${sizeVar(o)}
    p.style.setProperty("--dx", 40 + Math.random() * 80 + "px");
    p.style.setProperty("--r", Math.random() * 360 + "deg");
    p.style.setProperty("--t", 2.2 + Math.random() * 1.2 + "s");`,
});

const bubbles = particle({
  id: "bubbles",
  label: "泡",
  desc: "小さな泡がぷくぷくと上がっていき、最後にはじけます。",
  defaults: { size: 18, color: "#38bdf8" },
  gap: 16,
  css: (o) => `.stalker-bubble {
  position: absolute;
  width: var(--s);
  height: var(--s);
  border: 2px solid rgba(${hexToRgb(o.color)}, 0.75);
  border-radius: 50%;
  background: radial-gradient(circle at 32% 30%, rgba(255, 255, 255, 0.9) 0 16%, rgba(${hexToRgb(o.color)}, 0.18) 20%);
  animation: stalker-bubble var(--t) ease-out forwards;
}
@keyframes stalker-bubble {
  0% { opacity: 0; transform: translate(-50%, -50%) scale(0.4); }
  15% { opacity: 1; transform: translate(-50%, -60%) scale(1); }
  85% { opacity: 1; transform: translate(calc(-50% + var(--dx)), calc(-50% - 90px)) scale(1); }
  100% { opacity: 0; transform: translate(calc(-50% + var(--dx)), calc(-50% - 96px)) scale(1.7); }
}`,
  make: (o) => `    p.className = "stalker-bubble";
${sizeVar(o)}
    p.style.setProperty("--dx", (Math.random() - 0.5) * 40 + "px");
    p.style.setProperty("--t", 1.1 + Math.random() * 0.8 + "s");`,
});

const confetti = particle({
  id: "confetti",
  label: "紙吹雪",
  desc: "動かすと色とりどりの紙吹雪がはじけ飛んで、ひらひら落ちます。",
  uses: ["size", "hide"],
  defaults: { size: 14 },
  range: { size: [6, 40] },
  gap: 10,
  css: () => `.stalker-paper {
  position: absolute;
  width: calc(var(--s) * 0.5);
  height: var(--s);
  border-radius: 2px;
  background: var(--c);
  animation: stalker-paper var(--t) cubic-bezier(0.2, 0.6, 0.4, 1) forwards;
}
@keyframes stalker-paper {
  0% { opacity: 1; transform: translate(-50%, -50%) rotate(0deg) rotateY(0deg); }
  30% { opacity: 1; transform: translate(calc(-50% + var(--dx)), calc(-50% + var(--dy))) rotate(var(--r)) rotateY(180deg); }
  100% { opacity: 0; transform: translate(calc(-50% + var(--dx) * 1.5), calc(-50% + 110px)) rotate(calc(var(--r) * 2)) rotateY(720deg); }
}`,
  make: (o) => `    p.className = "stalker-paper";
${sizeVar(o)}
    p.style.setProperty("--c", "hsl(" + Math.floor(Math.random() * 360) + ", 90%, 60%)");
    p.style.setProperty("--dx", (Math.random() - 0.5) * 90 + "px");
    p.style.setProperty("--dy", -20 - Math.random() * 50 + "px");
    p.style.setProperty("--r", (Math.random() - 0.5) * 360 + "deg");
    p.style.setProperty("--t", 1.2 + Math.random() * 0.8 + "s");`,
});

const fireworks = {
  id: "fireworks",
  label: "クリックで花火",
  desc: "ふだんは点が付いてきて、クリックした所で花火がぱっと開きます。",
  uses: ["color", "size", "lag", "hide"],
  defaults: { size: 12, lag: 55, color: "#f43f5e" },
  build(o) {
    return {
      html: `<div class="stalker" aria-hidden="true">
  <span class="stalker-dot"></span>
</div>`,
      css: `.stalker {
${BASE_CSS}
${FADE_CSS}
}
.stalker-dot {
  position: absolute;
  top: 0;
  left: 0;
  width: ${o.size}px;
  height: ${o.size}px;
  margin: -${half(o.size)}px 0 0 -${half(o.size)}px;
  border-radius: 50%;
  background: ${o.color};
  box-shadow: 0 0 10px ${o.color};
}
.stalker-spark {
  position: absolute;
  width: 14px;
  height: 3px;
  margin-top: -1.5px;
  border-radius: 2px;
  background: var(--c);
  box-shadow: 0 0 6px var(--c);
  transform-origin: 0 50%;
  animation: stalker-spark 0.9s cubic-bezier(0.15, 0.7, 0.3, 1) forwards;
}
.stalker-flash {
  position: absolute;
  width: 40px;
  height: 40px;
  margin: -20px 0 0 -20px;
  border-radius: 50%;
  background: radial-gradient(circle, #fff 0, var(--c) 40%, transparent 70%);
  animation: stalker-flash 0.4s ease-out forwards;
}
@keyframes stalker-spark {
  0% { opacity: 1; transform: rotate(var(--a)) translateX(0) scaleX(0.3); }
  30% { opacity: 1; transform: rotate(var(--a)) translateX(calc(var(--d) * 0.7)) scaleX(1); }
  100% { opacity: 0; transform: rotate(var(--a)) translateX(var(--d)) scaleX(0.2); }
}
@keyframes stalker-flash {
  from { opacity: 1; transform: scale(0.3); }
  to { opacity: 0; transform: scale(1.4); }
}
${hideCss(o)}`,
      js: wrap(o, `  const dot = el.querySelector(".stalker-dot");
${TRACK_JS}
  function add(cls, cx, cy, vars) {
    const s = document.createElement("span");
    s.className = cls;
    s.style.left = cx + "px";
    s.style.top = cy + "px";
    Object.keys(vars).forEach((k) => s.style.setProperty(k, vars[k]));
    s.addEventListener("animationend", () => s.remove());
    el.appendChild(s);
  }
  addEventListener("pointerdown", (e) => {
    if (el.childElementCount > 100) return;
    const hue = Math.random() * 360;
    add("stalker-flash", e.clientX, e.clientY, { "--c": "hsl(" + hue + ", 95%, 65%)" });
    for (let i = 0; i < 22; i++) {
      add("stalker-spark", e.clientX, e.clientY, {
        "--a": i * (360 / 22) + Math.random() * 8 + "deg",
        "--d": ${40 + o.size * 2} + Math.random() * 40 + "px",
        "--c": "hsl(" + (hue + Math.random() * 60) + ", 95%, 60%)",
      });
    }
  });
  (function loop() {
    x += (mx - x) * ${ease(o)};
    y += (my - y) * ${ease(o)};
    dot.style.transform = "translate3d(" + x + "px, " + y + "px, 0)";
    requestAnimationFrame(loop);
  })();`),
    };
  },
};

const paint = canvasFx({
  id: "paint",
  label: "絵の具のにじみ",
  desc: "やわらかい筆で描いたような跡が、にじみながら薄れていきます。",
  uses: ["color", "size", "hide"],
  defaults: { size: 22, color: "#8b5cf6" },
  range: { size: [6, 60] },
  code: (o) => ({
    setup: `  const RGB = "${hexToRgb(o.color)}";
  let lx = -100, ly = -100;`,
    first: `      lx = mx;
      ly = my;`,
    move: `    if (Math.hypot(mx - lx, my - ly) > 3) {
      parts.push({ x1: lx, y1: ly, x2: mx, y2: my, w: ${o.size} * (0.7 + Math.random() * 0.5), life: 1 });
      if (parts.length > 260) parts.shift();
      lx = mx;
      ly = my;
    }`,
    step: `    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    parts.forEach((s) => { s.life -= 0.012; });
    while (parts.length && parts[0].life <= 0) parts.shift();
    for (let i = 0; i < parts.length; i += 6) {
      const s = parts[i];
      ctx.beginPath();
      ctx.moveTo(s.x1, s.y1);
      for (let j = i; j < Math.min(i + 7, parts.length); j++) {
        if (j > i && parts[j].x1 !== parts[j - 1].x2) ctx.moveTo(parts[j].x1, parts[j].y1);
        ctx.lineTo(parts[j].x2, parts[j].y2);
      }
      ctx.strokeStyle = "rgba(" + RGB + ", " + s.life * 0.1 + ")";
      ctx.lineWidth = s.w * (2.2 - s.life);
      ctx.stroke();
      ctx.strokeStyle = "rgba(" + RGB + ", " + s.life * 0.3 + ")";
      ctx.lineWidth = s.w * 0.7;
      ctx.stroke();
    }`,
  }),
});

const rainbowTail = {
  id: "rainbow-tail",
  label: "レインボートレイル", aka: "虹色のしっぽ",
  desc: "点の列が虹のように色を変えながら、しっぽになって付いてきます。",
  uses: ["size", "lag", "hide"],
  defaults: { size: 18, lag: 45 },
  build(o) {
    const e = Math.max(0.25, Number(ease(o))).toFixed(2);
    return {
      html: DIV,
      css: `.stalker {
${BASE_CSS}
${FADE_CSS}
}
.stalker-dot {
  position: absolute;
  top: 0;
  left: 0;
  border-radius: 50%;
}
${hideCss(o)}`,
      js: wrap(o, `  const N = 16;
  const SIZE = ${o.size};
  const dots = Array.from({ length: N }, (_, i) => {
    const d = document.createElement("span");
    const s = SIZE * (1 - (i / N) * 0.7);
    d.className = "stalker-dot";
    d.style.width = d.style.height = s + "px";
    d.style.margin = -s / 2 + "px 0 0 " + -s / 2 + "px";
    el.appendChild(d);
    return { el: d, x: -100, y: -100 };
  });
  let mx = -100, my = -100, active = false;
  addEventListener("pointermove", (e) => {
    mx = e.clientX;
    my = e.clientY;
    if (!active) {
      dots.forEach((p) => { p.x = mx; p.y = my; });
      active = true;
      el.classList.add("is-active");
    }
  });
  document.documentElement.addEventListener("mouseleave", () => {
    active = false;
    el.classList.remove("is-active");
  });
  function loop(t) {
    let px = mx, py = my;
    dots.forEach((p, i) => {
      p.x += (px - p.x) * ${e};
      p.y += (py - p.y) * ${e};
      p.el.style.transform = "translate3d(" + p.x + "px, " + p.y + "px, 0)";
      p.el.style.background = "hsl(" + ((t / 6 + i * 22) % 360) + ", 90%, 60%)";
      px = p.x;
      py = p.y;
    });
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);`),
    };
  },
};

const constellation = canvasFx({
  id: "constellation",
  label: "パーティクルネットワーク", aka: "星座の線",
  desc: "通った所に星が残り、近くの星どうしが細い線でつながって消えていきます。",
  uses: ["color", "size", "hide"],
  defaults: { size: 24, color: "#6366f1" },
  range: { size: [10, 60] },
  code: (o) => ({
    setup: `  const RGB = "${hexToRgb(o.color)}";
  const LINK = ${o.size * 4};
  let lx = -999, ly = -999;`,
    move: `    if (Math.hypot(mx - lx, my - ly) > 26) {
      lx = mx;
      ly = my;
      parts.push({ x: mx + (Math.random() - 0.5) * 36, y: my + (Math.random() - 0.5) * 36, life: 1 });
      if (parts.length > 60) parts.shift();
    }`,
    step: `    for (let i = parts.length - 1; i >= 0; i--) {
      parts[i].life -= 0.008;
      if (parts[i].life <= 0) parts.splice(i, 1);
    }
    ctx.lineWidth = 1;
    for (let i = 0; i < parts.length; i++) {
      const a = parts[i];
      for (let j = i + 1; j < parts.length; j++) {
        const b = parts[j];
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d > LINK) continue;
        ctx.strokeStyle = "rgba(" + RGB + ", " + Math.min(a.life, b.life) * (1 - d / LINK) * 0.8 + ")";
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
    }
    for (const a of parts) {
      ctx.fillStyle = "rgba(" + RGB + ", " + a.life + ")";
      ctx.beginPath();
      ctx.arc(a.x, a.y, 1.5 + a.life * 1.5, 0, Math.PI * 2);
      ctx.fill();
    }`,
  }),
});

const gather = canvasFx({
  id: "gather",
  label: "スウォーム", aka: "粒が集まる",
  desc: "画面に散らばった粒が集まってきて、マウスの周りをぐるぐる回ります。",
  uses: ["color", "size", "lag", "hide"],
  defaults: { size: 40, lag: 50, color: "#6366f1" },
  range: { size: [16, 100] },
  code: (o) => ({
    setup: `  const RGB = "${hexToRgb(o.color)}";
  const E = ${ease(o)};
  const swarm = Array.from({ length: 40 }, () => ({
    a: Math.random() * Math.PI * 2,
    r: ${o.size} * (0.3 + Math.random()),
    s: (Math.random() < 0.5 ? -1 : 1) * (0.01 + Math.random() * 0.03),
    k: 0.04 + Math.random() * 0.1,
    z: 1.2 + Math.random() * 2,
    x: 0, y: 0,
  }));
  let cx = -100, cy = -100, fade = 0;`,
    first: `      cx = mx;
      cy = my;
      swarm.forEach((p) => {
        p.x = Math.random() * W;
        p.y = Math.random() * H;
      });`,
    step: `    cx += (mx - cx) * E;
    cy += (my - cy) * E;
    fade += ((active ? 1 : 0) - fade) * 0.08;
    ctx.globalAlpha = fade;
    ctx.fillStyle = "rgb(" + RGB + ")";
    ctx.beginPath();
    for (const p of swarm) {
      p.a += p.s;
      p.x += (cx + Math.cos(p.a) * p.r - p.x) * p.k;
      p.y += (cy + Math.sin(p.a) * p.r - p.y) * p.k;
      ctx.moveTo(p.x + p.z, p.y);
      ctx.arc(p.x, p.y, p.z, 0, Math.PI * 2);
    }
    ctx.fill();
    ctx.globalAlpha = 1;
    keep = active || fade > 0.01;`,
  }),
});

const ripplesLoop = {
  id: "ripples-loop",
  label: "リップル（連続）", aka: "波紋が出続ける",
  desc: "付いてくる丸から、輪が次々と広がり続けます。",
  uses: ["color", "size", "lag", "hide"],
  defaults: { size: 14, lag: 60, color: "#0ea5e9" },
  range: { size: [6, 60] },
  build(o) {
    return {
      html: `<div class="stalker" aria-hidden="true">
  <span class="stalker-core"><i></i><i></i><i></i></span>
</div>`,
      css: `.stalker {
${BASE_CSS}
${FADE_CSS}
}
.stalker-core {
  position: absolute;
  top: 0;
  left: 0;
  width: ${o.size}px;
  height: ${o.size}px;
  margin: -${half(o.size)}px 0 0 -${half(o.size)}px;
  border-radius: 50%;
  background: ${o.color};
}
.stalker-core i {
  position: absolute;
  inset: 0;
  border: 2px solid ${o.color};
  border-radius: 50%;
  animation: stalker-wave 1.8s ease-out infinite;
}
.stalker-core i:nth-child(2) { animation-delay: -0.6s; }
.stalker-core i:nth-child(3) { animation-delay: -1.2s; }
@keyframes stalker-wave {
  from { opacity: 0.8; transform: scale(1); }
  to { opacity: 0; transform: scale(4); }
}
${hideCss(o)}`,
      js: wrap(o, `  const core = el.querySelector(".stalker-core");
${TRACK_JS}
  (function loop() {
    x += (mx - x) * ${ease(o)};
    y += (my - y) * ${ease(o)};
    core.style.transform = "translate3d(" + x + "px, " + y + "px, 0)";
    requestAnimationFrame(loop);
  })();`),
    };
  },
};

const afterimage = {
  id: "afterimage",
  label: "残像",
  desc: "丸のうしろに、だんだん薄くなる残像がいくつも重なって付いてきます。",
  uses: ["color", "size", "lag", "hide"],
  defaults: { size: 26, lag: 40 },
  build(o) {
    const n = 7;
    const ghosts = Array.from({ length: n }, (_, k) => {
      const i = n - 1 - k;
      return `  <span class="stalker-ghost" style="opacity: ${(1 - (i / n) * 0.9).toFixed(2)}"></span>`;
    }).join("\n");
    return {
      html: `<div class="stalker" aria-hidden="true">
${ghosts}
</div>`,
      css: `.stalker {
${BASE_CSS}
${FADE_CSS}
}
.stalker-ghost {
  position: absolute;
  top: 0;
  left: 0;
  width: ${o.size}px;
  height: ${o.size}px;
  margin: -${half(o.size)}px 0 0 -${half(o.size)}px;
  border-radius: 50%;
  background: ${o.color};
}
${hideCss(o)}`,
      js: wrap(o, `  const N = ${n}, GAP = 3;
  const ghosts = [...el.querySelectorAll(".stalker-ghost")].reverse();
  const trail = [];
${TRACK_JS}
  (function loop() {
    x += (mx - x) * ${ease(o)};
    y += (my - y) * ${ease(o)};
    if (active) {
      trail.unshift({ x, y });
      if (trail.length > N * GAP) trail.pop();
    } else trail.length = 0;
    ghosts.forEach((g, i) => {
      const p = trail[Math.min(i * GAP, trail.length - 1)] || { x, y };
      g.style.transform = "translate3d(" + p.x + "px, " + p.y + "px, 0)";
    });
    requestAnimationFrame(loop);
  })();`),
    };
  },
};

const shootingStar = canvasFx({
  id: "shooting-star",
  label: "流れ星",
  desc: "星がマウスに付いてきて、すばやく動かすと光の尾を引きます。",
  uses: ["color", "size", "hide"],
  defaults: { size: 20, color: "#f59e0b" },
  range: { size: [10, 48] },
  code: (o) => ({
    setup: `  const RGB = "${hexToRgb(o.color)}";
  const R = ${half(o.size)};
  function star(cx, cy, r) {
    ctx.beginPath();
    for (let i = 0; i < 10; i++) {
      const a = (i * Math.PI) / 5 - Math.PI / 2;
      const rr = i % 2 ? r * 0.45 : r;
      ctx.lineTo(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr);
    }
    ctx.closePath();
    ctx.fill();
  }`,
    move: `    parts.push({ x: mx, y: my, life: 1 });
    if (parts.length > 80) parts.shift();`,
    step: `    for (let i = parts.length - 1; i >= 0; i--) {
      parts[i].life -= 0.06;
      if (parts[i].life <= 0) parts.splice(i, 1);
    }
    ctx.lineCap = "round";
    for (let i = 1; i < parts.length; i++) {
      const a = parts[i - 1], b = parts[i];
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.strokeStyle = "rgba(" + RGB + ", " + b.life * 0.85 + ")";
      ctx.lineWidth = Math.max(0.5, b.life * R * 0.7);
      ctx.stroke();
      ctx.strokeStyle = "rgba(255, 255, 255, " + b.life * 0.8 + ")";
      ctx.lineWidth = Math.max(0.5, b.life * R * 0.25);
      ctx.stroke();
    }
    if (active) {
      ctx.shadowColor = "rgb(" + RGB + ")";
      ctx.shadowBlur = 14;
      ctx.fillStyle = "rgb(" + RGB + ")";
      star(mx, my, R);
      ctx.shadowBlur = 0;
      ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
      star(mx, my, R * 0.45);
    }`,
  }),
});

const embers = particle({
  id: "embers",
  label: "火の粉",
  desc: "オレンジ色の火の粉がちらちら光りながら、上へ舞い上がります。",
  defaults: { size: 10, color: "#f97316" },
  range: { size: [4, 28] },
  gap: 12,
  css: (o) => `.stalker-ember {
  position: absolute;
  width: var(--s);
  height: var(--s);
  margin: calc(var(--s) / -2) 0 0 calc(var(--s) / -2);
  border-radius: 50%;
  background: radial-gradient(circle, #fff3c4 0 25%, ${o.color} 55%, rgba(${hexToRgb(o.color)}, 0) 72%);
  box-shadow: 0 0 var(--s) rgba(${hexToRgb(o.color)}, 0.7);
  animation: stalker-ember var(--t) ease-out forwards, stalker-flicker 0.18s steps(2) infinite;
}
@keyframes stalker-ember {
  0% { opacity: 1; transform: translate(0, 0) scale(1); }
  50% { transform: translate(var(--dx), calc(var(--h) * -0.5)) scale(0.9); }
  100% { opacity: 0; transform: translate(calc(var(--dx) * -0.6), calc(var(--h) * -1)) scale(0.3); }
}
@keyframes stalker-flicker {
  50% { filter: brightness(1.7); }
}`,
  make: (o) => `    p.className = "stalker-ember";
    p.style.setProperty("--s", ${o.size} * (0.5 + Math.random() * 0.6) + "px");
    p.style.setProperty("--dx", (Math.random() - 0.5) * 40 + "px");
    p.style.setProperty("--h", 70 + Math.random() * 80 + "px");
    p.style.setProperty("--t", 0.9 + Math.random() * 0.8 + "s");`,
});

const smoke = particle({
  id: "smoke",
  label: "煙",
  desc: "ぼんやりした煙のかたまりが、ふくらみながら消えていきます。",
  defaults: { size: 36, color: "#94a3b8" },
  range: { size: [16, 90] },
  gap: 16,
  cap: 40,
  css: (o) => `.stalker-smoke {
  position: absolute;
  width: ${o.size}px;
  height: ${o.size}px;
  margin: -${half(o.size)}px 0 0 -${half(o.size)}px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(${hexToRgb(o.color)}, 0.55), rgba(${hexToRgb(o.color)}, 0) 70%);
  filter: blur(4px);
  animation: stalker-smoke var(--t) ease-out forwards;
}
@keyframes stalker-smoke {
  from { opacity: 0.9; transform: translate(0, 0) scale(0.3) rotate(0deg); }
  to { opacity: 0; transform: translate(var(--dx), -60px) scale(2.6) rotate(var(--r)); }
}`,
  make: () => `    p.className = "stalker-smoke";
    p.style.setProperty("--dx", (Math.random() - 0.5) * 50 + "px");
    p.style.setProperty("--r", (Math.random() - 0.5) * 120 + "deg");
    p.style.setProperty("--t", 1.3 + Math.random() * 0.8 + "s");`,
});

const splash = canvasFx({
  id: "splash",
  label: "水しぶき",
  desc: "ふだんは水色の丸が付いてきて、クリックすると水しぶきが飛び散って落ちます。",
  uses: ["color", "size", "lag", "hide"],
  defaults: { size: 14, lag: 55, color: "#0ea5e9" },
  range: { size: [6, 48] },
  code: (o) => ({
    setup: `  const RGB = "${hexToRgb(o.color)}";
  const E = ${ease(o)};
  const DROP = ${(o.size / 14).toFixed(2)};
  let fx = -100, fy = -100;`,
    first: `      fx = mx;
      fy = my;`,
    down: `    if (parts.length > 200) return;
    parts.push({ ring: true, x: mx, y: my, r: 4, life: 1 });
    for (let i = 0; i < 16; i++) {
      const a = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 0.9;
      const sp = 3 + Math.random() * 5;
      parts.push({ x: mx, y: my, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, r: (1.5 + Math.random() * 3) * DROP, life: 1 });
    }`,
    step: `    fx += (mx - fx) * E;
    fy += (my - fy) * E;
    if (Math.abs(mx - fx) + Math.abs(my - fy) > 0.3) keep = true;
    for (let i = parts.length - 1; i >= 0; i--) {
      const p = parts[i];
      p.life -= p.ring ? 0.04 : 0.012;
      if (p.life <= 0 || p.y > H + 20) { parts.splice(i, 1); continue; }
      ctx.beginPath();
      if (p.ring) {
        p.r += 2.2;
        ctx.strokeStyle = "rgba(" + RGB + ", " + p.life * 0.8 + ")";
        ctx.lineWidth = 2;
        ctx.ellipse(p.x, p.y, p.r, p.r * 0.45, 0, 0, Math.PI * 2);
        ctx.stroke();
        continue;
      }
      p.vy += 0.32;
      p.x += p.vx;
      p.y += p.vy;
      const sp = Math.hypot(p.vx, p.vy);
      ctx.fillStyle = "rgba(" + RGB + ", " + Math.min(1, p.life * 1.5) + ")";
      ctx.ellipse(p.x, p.y, p.r * (1 + sp * 0.12), p.r, Math.atan2(p.vy, p.vx), 0, Math.PI * 2);
      ctx.fill();
    }
    if (active) {
      ctx.fillStyle = "rgb(" + RGB + ")";
      ctx.beginPath();
      ctx.arc(fx, fy, ${half(o.size)}, 0, Math.PI * 2);
      ctx.fill();
    }`,
  }),
});

export const MIDDLE_2 = [snow, sakura, bubbles, confetti, fireworks, paint, rainbowTail, constellation, gather, ripplesLoop, afterimage, shootingStar, embers, smoke, splash];
