import { GUARD, HIDE_JS, hideCss, ease, dur, half, BASE_CSS } from "./_shared.js?v=20261113b";

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

function rootCss(base) {
  return `.stalker {
${base}
${SHOW_CSS}
}`;
}

function dotCss(o) {
  return `.stalker {
${BASE_CSS}
  width: ${o.size}px;
  height: ${o.size}px;
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

const textScatter = {
  id: "text-scatter",
  label: "文字が散る",
  desc: "見出しの上を通ると文字がマウスをよけて散り、離れるとばねのように元の位置へ戻ります。",
  uses: ["color", "size", "lag", "hide"],
  defaults: { size: 14, lag: 30 },
  gsap: true,
  build(o) {
    return {
      html: `<div class="stalker" aria-hidden="true"></div>`,
      css: `${dotCss(o)}
.stalker-char {
  display: inline-block;
  white-space: pre;
}
${hideCss(o)}`,
      js: wrap(o, `${followJs(o)}
  const R = ${Math.round(70 + o.size * 2)};
  const split = new Map();
  let current = null;
  onStop(() => split.forEach((st, h) => { clearTimeout(st.timer); h.textContent = st.text; }));
  function prepare(h) {
    const text = h.textContent;
    const parts = [...text].reduce((a, c) => (a.length && /[、。，．！？」』）,.!?)]/.test(c) ? a.slice(0, -1).concat(a[a.length - 1] + c) : a.concat(c)), []);
    const spans = parts.map((c) => {
      const s = document.createElement("span");
      s.className = "stalker-char";
      s.textContent = c;
      return s;
    });
    h.replaceChildren(...spans);
    const items = spans.map((s) => {
      const r = s.getBoundingClientRect();
      const opt = { duration: 1.1, ease: "elastic.out(1, 0.35)" };
      const q = (p) => gsap.quickTo(s, p, opt);
      return { cx: r.left + r.width / 2 + scrollX, cy: r.top + r.height / 2 + scrollY, x: q("x"), y: q("y"), r: q("rotation"), pushed: false };
    });
    return { text, items, timer: null };
  }
  const home = (it) => { it.x(0); it.y(0); it.r(0); it.pushed = false; };
  function release(h) {
    const st = split.get(h);
    if (!st) return;
    st.items.forEach(home);
    st.timer = setTimeout(() => {
      if (current === h) return;
      h.textContent = st.text;
      split.delete(h);
    }, 1300);
  }
  function push(h, px, py) {
    split.get(h).items.forEach((it) => {
      const dx = it.cx - px;
      const dy = it.cy - py;
      const d = Math.hypot(dx, dy) || 1;
      if (d < R) {
        const f = 1 - d / R;
        it.x((dx / d) * f * R * 0.45);
        it.y((dy / d) * f * R * 0.45);
        it.r((dx / d) * f * 40);
        it.pushed = true;
      } else if (it.pushed) {
        home(it);
      }
    });
  }
  addEventListener("pointermove", (e) => {
    xTo(e.clientX);
    yTo(e.clientY);
    const hit = e.target.closest && e.target.closest("h1, h2");
    const h = hit && (split.has(hit) || hit.children.length === 0) ? hit : null;
    if (h !== current) {
      if (current) release(current);
      current = h;
      if (h) {
        if (split.has(h)) clearTimeout(split.get(h).timer);
        else split.set(h, prepare(h));
      }
    }
    if (current) push(current, e.clientX + scrollX, e.clientY + scrollY);
  });
  document.documentElement.addEventListener("mouseleave", () => {
    if (current) release(current);
    current = null;
  });`),
    };
  },
};

const imageReveal = {
  id: "image-reveal",
  label: "ホバープレビュー", aka: "画像を見せる窓",
  desc: "リンクやカードに乗ると小さな窓が開いて遅れて付いてきて、動かす速さで少し傾きます。",
  uses: ["color", "size", "lag", "hide"],
  defaults: { size: 220, lag: 45 },
  range: { size: [120, 360] },
  gsap: true,
  build(o) {
    const w = o.size;
    const h = Math.round(o.size * 0.7);
    return {
      html: `<div class="stalker" aria-hidden="true">
  <div class="stalker-win"><span></span></div>
  <div class="stalker-dot"></div>
</div>`,
      css: `${rootCss(BASE_CSS)}
.stalker-win {
  position: absolute;
  top: 0;
  left: 0;
  width: ${w}px;
  height: ${h}px;
  display: flex;
  align-items: flex-end;
  border-radius: 14px;
  overflow: hidden;
  background-size: cover;
  background-position: center;
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.28);
}
.stalker-win span {
  padding: 10px 14px;
  color: #fff;
  font-size: 18px;
  font-weight: 700;
  text-shadow: 0 1px 6px rgba(0, 0, 0, 0.45);
}
.stalker-dot {
  position: absolute;
  top: 0;
  left: 0;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: ${o.color};
}
${hideCss(o)}`,
      js: wrap(o, `  const win = el.querySelector(".stalker-win");
  const label = win.querySelector("span");
  const dot = el.querySelector(".stalker-dot");
  const W = ${w}, H = ${h};
  const FALLBACK = ["linear-gradient(135deg, ${o.color}, #f59e0b)", "linear-gradient(135deg, #ec4899, ${o.color})", "linear-gradient(135deg, #10b981, ${o.color})"];
  gsap.set(dot, { xPercent: -50, yPercent: -50, x: -100, y: -100 });
  gsap.set(win, { x: -400, y: -400, scale: 0.6, autoAlpha: 0, transformOrigin: "0% 0%" });
  const wx = gsap.quickTo(win, "x", { duration: ${(Number(dur(o)) + 0.25).toFixed(2)}, ease: "power3" });
  const wy = gsap.quickTo(win, "y", { duration: ${(Number(dur(o)) + 0.25).toFixed(2)}, ease: "power3" });
  const wr = gsap.quickTo(win, "rotation", { duration: 0.4, ease: "power3" });
  const dx = gsap.quickTo(dot, "x", { duration: 0.12, ease: "power3" });
  const dy = gsap.quickTo(dot, "y", { duration: 0.12, ease: "power3" });
  let lastX = null, vel = 0, target = null, count = 0;
${showJs("dot")}
  function place(x, y) {
    wx(Math.min(x + 24, innerWidth - W - 8));
    wy(Math.min(y + 24, innerHeight - H - 8));
  }
  addEventListener("pointermove", (e) => {
    if (lastX === null) gsap.set(win, { x: e.clientX + 24, y: e.clientY + 24 });
    else vel = e.clientX - lastX;
    lastX = e.clientX;
    dx(e.clientX);
    dy(e.clientY);
    place(e.clientX, e.clientY);
  });
  gsap.ticker.add(() => {
    vel *= 0.85;
    wr(gsap.utils.clamp(-14, 14, vel * 0.7));
  });
  function picture(t) {
    const src = t.getAttribute("data-stalker-img");
    if (src) return "url(" + JSON.stringify(src) + ")";
    const img = t.querySelector("img");
    if (img && img.currentSrc) return "url(" + JSON.stringify(img.currentSrc) + ")";
    const kid = [...t.querySelectorAll("*")].find((k) => getComputedStyle(k).backgroundImage !== "none");
    if (kid) return getComputedStyle(kid).backgroundImage;
    return FALLBACK[count++ % FALLBACK.length];
  }
  document.addEventListener("pointerover", (e) => {
    const t = e.target.closest("${HOVER_SEL}, [data-stalker-img]");
    if (t === target) return;
    target = t;
    if (t) {
      win.style.backgroundImage = picture(t);
      label.textContent = (t.getAttribute("aria-label") || t.textContent).trim().slice(0, 24);
      gsap.to(win, { scale: 1, autoAlpha: 1, duration: 0.4, ease: "back.out(1.6)", overwrite: "auto" });
      gsap.to(dot, { scale: 0.5, duration: 0.3 });
    } else {
      gsap.to(win, { scale: 0.6, autoAlpha: 0, duration: 0.25, ease: "power2.in", overwrite: "auto" });
      gsap.to(dot, { scale: 1, duration: 0.3 });
    }
  });`),
    };
  },
};

const spring = {
  id: "spring",
  label: "スプリング", aka: "ばねで揺れる",
  desc: "玉がばねでつながったように付いてきて、止めると行き過ぎてからびよんびよんと揺れて止まります。",
  uses: ["color", "size", "lag", "hide"],
  defaults: { size: 26, lag: 40 },
  gsap: true,
  build(o) {
    return {
      html: `<svg class="stalker" aria-hidden="true">
  <line />
  <circle class="ball" r="${half(o.size)}" />
  <circle class="tip" r="3" />
</svg>`,
      css: `${rootCss(FULL_CSS)}
.stalker line {
  stroke: ${o.color};
  stroke-width: 2;
  stroke-dasharray: 4 4;
  opacity: 0.6;
}
.stalker .ball,
.stalker .tip {
  fill: ${o.color};
}
${hideCss(o)}`,
      js: wrap(o, `  const line = el.querySelector("line");
  const ball = el.querySelector(".ball");
  const tip = el.querySelector(".tip");
  const p = { x: -100, y: -100 };
  const m = { x: -100, y: -100 };
  const xTo = gsap.quickTo(p, "x", { duration: ${(Number(dur(o)) + 0.8).toFixed(2)}, ease: "elastic.out(1, 0.3)" });
  const yTo = gsap.quickTo(p, "y", { duration: ${(Number(dur(o)) + 0.8).toFixed(2)}, ease: "elastic.out(1, 0.3)" });
  let started = false;
${SHOW_JS}
  addEventListener("pointermove", (e) => {
    m.x = e.clientX;
    m.y = e.clientY;
    if (!started) Object.assign(p, m);
    started = true;
    xTo(m.x);
    yTo(m.y);
  });
  const put = (n, a, b, q) => {
    n.setAttribute(a, q.x.toFixed(1));
    n.setAttribute(b, q.y.toFixed(1));
  };
  gsap.ticker.add(() => {
    put(line, "x1", "y1", m);
    put(line, "x2", "y2", p);
    put(ball, "cx", "cy", p);
    put(tip, "cx", "cy", m);
  });`),
    };
  },
};

const jelly = {
  id: "jelly",
  label: "ジェリー", aka: "ゼリーのように揺れる",
  desc: "動かす速さに合わせて丸がつぶれたり伸びたりして、止めるとぷるぷる揺れながら丸に戻ります。",
  uses: ["color", "size", "lag", "hide"],
  defaults: { size: 36, lag: 35 },
  gsap: true,
  build(o) {
    return {
      html: `<div class="stalker" aria-hidden="true"><span></span></div>`,
      css: `.stalker {
${BASE_CSS}
  width: ${o.size}px;
  height: ${o.size}px;
${SHOW_CSS}
}
.stalker span {
  display: block;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: ${o.color};
}
${hideCss(o)}`,
      js: wrap(o, `  const blob = el.querySelector("span");
${followJs(o)}
  const sx = gsap.quickTo(blob, "scaleX", { duration: 0.9, ease: "elastic.out(1, 0.3)" });
  const sy = gsap.quickTo(blob, "scaleY", { duration: 0.9, ease: "elastic.out(1, 0.3)" });
  let px = null, py = 0, last = 0;
  addEventListener("pointermove", (e) => {
    xTo(e.clientX);
    yTo(e.clientY);
  });
  gsap.ticker.add(() => {
    const x = gsap.getProperty(el, "x");
    const y = gsap.getProperty(el, "y");
    if (px !== null) {
      const vx = x - px;
      const vy = y - py;
      const v = Math.hypot(vx, vy);
      const s = Math.round(Math.min(v * 0.035, 0.7) * 20) / 20;
      if (Math.abs(s - last) > 0.04) {
        last = s;
        sx(1 + s);
        sy(1 - s * 0.5);
      }
      if (v > 1) gsap.set(blob, { rotation: Math.atan2(vy, vx) * 180 / Math.PI });
    }
    px = x;
    py = y;
  });`),
    };
  },
};

const magneticText = {
  id: "magnetic-text",
  label: "マグネットテキスト", aka: "ボタンの文字が吸い付く",
  desc: "ボタンやリンクに乗ると、枠はそのままで中の文字だけがマウスのほうへ引き寄せられます。",
  uses: ["color", "size", "lag", "hide"],
  defaults: { size: 34, lag: 25, hide: true },
  gsap: true,
  build(o) {
    return {
      html: `<div class="stalker" aria-hidden="true"></div>`,
      css: `.stalker {
${BASE_CSS}
  width: ${o.size}px;
  height: ${o.size}px;
  border: 2px solid ${o.color};
  border-radius: 50%;
  box-sizing: border-box;
${SHOW_CSS}
}
.stalker-inner {
  display: inline-block;
}
${hideCss(o)}`,
      js: wrap(o, `${followJs(o)}
  const held = new Map();
  let current = null;
  onStop(() => held.forEach((st) => {
    gsap.set(st.inner, { clearProps: "transform", overwrite: true });
    if (st.wrapper) st.wrapper.replaceWith(...st.wrapper.childNodes); }));
  function grab(t) {
    if (held.has(t)) return held.get(t);
    const texts = [...t.children].filter((c) => c.textContent.trim());
    let inner = texts.length ? texts : [...t.children];
    let wrapper = null;
    if (!inner.length) {
      wrapper = document.createElement("span");
      wrapper.className = "stalker-inner";
      wrapper.append(...t.childNodes);
      t.append(wrapper);
      inner = [wrapper];
    }
    const st = { t, inner, wrapper };
    held.set(t, st);
    return st;
  }
  function release(st) {
    gsap.to(st.inner, { x: 0, y: 0, duration: 0.9, ease: "elastic.out(1, 0.35)", overwrite: true, onComplete: () => {
      if (current === st) return;
      gsap.set(st.inner, { clearProps: "transform" });
      if (st.wrapper) st.wrapper.replaceWith(...st.wrapper.childNodes);
      held.delete(st.t);
    } });
  }
  addEventListener("pointermove", (e) => {
    xTo(e.clientX);
    yTo(e.clientY);
    if (!current) return;
    const r = current.t.getBoundingClientRect();
    const dx = e.clientX - (r.left + r.width / 2);
    const dy = e.clientY - (r.top + r.height / 2);
    gsap.to(current.inner, { x: dx * 0.4, y: dy * 0.5, duration: 0.4, ease: "power3", overwrite: true });
  });
  document.addEventListener("pointerover", (e) => {
    const t = e.target.closest("${HOVER_SEL}");
    if ((current && current.t) === t || (!current && !t)) return;
    if (current) release(current);
    current = t ? grab(t) : null;
    gsap.to(el, { scale: t ? 1.8 : 1, duration: 0.35, ease: "power3" });
  });`),
    };
  },
};

const underlineFollow = {
  id: "underline-follow",
  label: "マジックライン", aka: "下線が付いてくる",
  desc: "ふだんは小さな点で、メニューのリンクに乗るとその文字の幅の下線になって横へすべります。",
  uses: ["color", "size", "lag", "hide"],
  defaults: { size: 10, lag: 30 },
  range: { size: [6, 40] },
  gsap: true,
  build(o) {
    return {
      html: `<div class="stalker" aria-hidden="true"></div>`,
      css: `.stalker {
${BASE_CSS}
  width: ${o.size}px;
  height: ${o.size}px;
  border-radius: ${half(o.size)}px;
  background: ${o.color};
${SHOW_CSS}
}
${hideCss(o)}`,
      js: wrap(o, `  const S = ${o.size};
  gsap.set(el, { x: -100, y: -100 });
  const xTo = gsap.quickTo(el, "x", { duration: ${dur(o)}, ease: "power3" });
  const yTo = gsap.quickTo(el, "y", { duration: ${dur(o)}, ease: "power3" });
  let link = null, back = null, mx = 0, my = 0;
${showJs("el")}
  addEventListener("pointermove", (e) => {
    mx = e.clientX;
    my = e.clientY;
    if (!link) {
      xTo(mx - S / 2);
      yTo(my - S / 2);
    }
  });
  function toDot() {
    link = null;
    xTo(mx - S / 2);
    yTo(my - S / 2);
    gsap.to(el, { width: S, height: S, borderRadius: S / 2, duration: 0.35, ease: "power3" });
  }
  document.addEventListener("pointerover", (e) => {
    const t = e.target.closest("nav a, header a, [data-stalker-underline]");
    if (t === link) return;
    if (back) back.kill();
    back = null;
    if (t) {
      link = t;
      const r = t.getBoundingClientRect();
      xTo(r.left);
      yTo(r.bottom + 4);
      gsap.to(el, { width: r.width, height: 3, borderRadius: 2, duration: 0.4, ease: "power3" });
    } else if (link) {
      back = gsap.delayedCall(0.15, toDot);
    }
  });`),
    };
  },
};

const arrowPoint = {
  id: "arrow-point",
  label: "矢印が向きを指す",
  desc: "矢印が付いてきて、動かした向きへなめらかに向きを変えます。",
  uses: ["color", "size", "lag", "hide"],
  defaults: { size: 32, lag: 30 },
  gsap: true,
  build(o) {
    return {
      html: `<div class="stalker" aria-hidden="true">
  <svg viewBox="0 0 24 24"><path d="M2 9h11V4l9 8-9 8v-5H2z" /></svg>
</div>`,
      css: `.stalker {
${BASE_CSS}
  width: ${o.size}px;
  height: ${o.size}px;
${SHOW_CSS}
}
.stalker svg {
  display: block;
  width: 100%;
  height: 100%;
}
.stalker path {
  fill: ${o.color};
}
${hideCss(o)}`,
      js: wrap(o, `${followJs(o)}
  const rTo = gsap.quickTo(el, "rotation", { duration: 0.5, ease: "power3" });
  let lx = null, ly = 0, angle = 0;
  addEventListener("pointermove", (e) => {
    xTo(e.clientX);
    yTo(e.clientY);
    const dx = e.clientX - (lx === null ? e.clientX : lx);
    const dy = e.clientY - (lx === null ? e.clientY : ly);
    if (lx !== null && Math.hypot(dx, dy) < 4) return;
    const a = Math.atan2(dy, dx) * 180 / Math.PI;
    angle += ((a - angle) % 360 + 540) % 360 - 180;
    rTo(angle);
    lx = e.clientX;
    ly = e.clientY;
  });`),
    };
  },
};

const ribbon = {
  id: "ribbon",
  label: "リボン",
  desc: "グラデーションの帯がリボンのようにねじれながら後を追います。大きさは帯の幅です。",
  uses: ["color", "size", "lag", "hide"],
  defaults: { size: 34, lag: 40 },
  range: { size: [6, 60] },
  gsap: true,
  build(o) {
    const e = Math.max(0.2, 0.7 - o.lag / 200).toFixed(2);
    return {
      html: `<svg class="stalker" aria-hidden="true">
  <defs>
    <linearGradient id="stalker-ribbon" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${o.color}" />
      <stop offset="0.5" stop-color="#ec4899" />
      <stop offset="1" stop-color="#f59e0b" />
    </linearGradient>
  </defs>
  <path fill="url(#stalker-ribbon)" />
</svg>`,
      css: `${rootCss(FULL_CSS)}
.stalker path {
  opacity: 0.9;
}
${hideCss(o)}`,
      js: wrap(o, `  const path = el.querySelector("path");
  const N = 36;
  const W = ${half(o.size)};
  const pts = Array.from({ length: N }, () => ({ x: -100, y: -100 }));
  const mouse = { x: -100, y: -100 };
  let started = false;
${SHOW_JS}
  addEventListener("pointermove", (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    if (!started) {
      pts.forEach((p) => { p.x = mouse.x; p.y = mouse.y; });
      started = true;
    }
  });
  gsap.ticker.add(() => {
    let prev = mouse;
    pts.forEach((p) => {
      p.x = gsap.utils.interpolate(p.x, prev.x, ${e});
      p.y = gsap.utils.interpolate(p.y, prev.y, ${e});
      prev = p;
    });
    const t = gsap.ticker.time;
    const left = [];
    const right = [];
    for (let i = 0; i < N; i++) {
      const a = pts[Math.max(i - 1, 0)];
      const b = pts[Math.min(i + 1, N - 1)];
      const tx = b.x - a.x;
      const ty = b.y - a.y;
      const len = Math.hypot(tx, ty);
      const w = len < 0.5 ? 0 : W * (1 - i / N) * Math.cos(i * 0.3 - t * 3);
      const nx = len ? -ty / len : 0;
      const ny = len ? tx / len : 0;
      const p = pts[i];
      left.push((p.x + nx * w).toFixed(1) + "," + (p.y + ny * w).toFixed(1));
      right.push((p.x - nx * w).toFixed(1) + "," + (p.y - ny * w).toFixed(1));
    }
    path.setAttribute("d", "M" + left.join("L") + "L" + right.reverse().join("L") + "Z");
  });`),
    };
  },
};

const rope = {
  id: "rope",
  label: "ロープ",
  desc: "マウスからロープが垂れ下がり、動かすと重りが振り子のように揺れます。大きさは重りの大きさです。",
  uses: ["color", "size", "lag", "hide"],
  defaults: { size: 18, lag: 20 },
  range: { size: [6, 48] },
  gsap: true,
  build(o) {
    return {
      html: `<svg class="stalker" aria-hidden="true">
  <polyline fill="none" />
  <circle class="top" r="4" />
  <circle class="weight" r="${half(o.size)}" />
</svg>`,
      css: `${rootCss(FULL_CSS)}
.stalker polyline {
  stroke: ${o.color};
  stroke-width: 3;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.stalker circle {
  fill: ${o.color};
}
${hideCss(o)}`,
      js: wrap(o, `  const line = el.querySelector("polyline");
  const top = el.querySelector(".top");
  const weight = el.querySelector(".weight");
  const N = 16;
  const L = 9;
  const pts = Array.from({ length: N }, () => ({ x: -100, y: -100, ox: -100, oy: -100 }));
  const mouse = { x: -100, y: -100 };
  let started = false;
${SHOW_JS}
  addEventListener("pointermove", (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    if (!started) {
      pts.forEach((p, i) => Object.assign(p, { x: mouse.x, ox: mouse.x, y: mouse.y + i * L, oy: mouse.y + i * L }));
      started = true;
    }
  });
  gsap.ticker.add(() => {
    if (!started) return;
    const head = pts[0];
    head.x = gsap.utils.interpolate(head.x, mouse.x, ${ease(o)});
    head.y = gsap.utils.interpolate(head.y, mouse.y, ${ease(o)});
    for (let i = 1; i < N; i++) {
      const p = pts[i];
      const vx = (p.x - p.ox) * 0.97;
      const vy = (p.y - p.oy) * 0.97 + 0.6;
      p.ox = p.x;
      p.oy = p.y;
      p.x += vx;
      p.y += vy;
    }
    for (let k = 0; k < 5; k++) {
      for (let i = 1; i < N; i++) {
        const a = pts[i - 1];
        const b = pts[i];
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const d = Math.hypot(dx, dy) || 0.001;
        const diff = (d - L) / d;
        if (i === 1) {
          b.x -= dx * diff;
          b.y -= dy * diff;
        } else {
          a.x += dx * diff * 0.5;
          a.y += dy * diff * 0.5;
          b.x -= dx * diff * 0.5;
          b.y -= dy * diff * 0.5;
        }
      }
    }
    line.setAttribute("points", pts.map((p) => p.x.toFixed(1) + "," + p.y.toFixed(1)).join(" "));
    [[top, head], [weight, pts[N - 1]]].forEach(([c, q]) => {
      c.setAttribute("cx", q.x.toFixed(1));
      c.setAttribute("cy", q.y.toFixed(1));
    });
  });`),
    };
  },
};

const snake = {
  id: "snake",
  label: "蛇",
  desc: "頭がマウスを追い、つながった体がくねくねと波打ちながら後に続きます。",
  uses: ["color", "size", "lag", "hide"],
  defaults: { size: 22, lag: 35 },
  range: { size: [10, 60] },
  gsap: true,
  build(o) {
    const N = 16;
    const segs = Array.from({ length: N }, (_, i) => {
      const s = Math.round(o.size * (1 - (i / N) * 0.65));
      return `  <span${i === 0 ? ' class="head"' : ""} style="width: ${s}px; height: ${s}px; z-index: ${N - i}; opacity: ${(1 - (i / N) * 0.5).toFixed(2)}"></span>`;
    });
    return {
      html: `<div class="stalker" aria-hidden="true">
${segs.join("\n")}
</div>`,
      css: `${rootCss(BASE_CSS)}
.stalker span {
  position: absolute;
  top: 0;
  left: 0;
  border-radius: 50%;
  background: ${o.color};
}
.stalker .head::before,
.stalker .head::after {
  content: "";
  position: absolute;
  left: 52%;
  width: 22%;
  height: 22%;
  border-radius: 50%;
  background: #fff;
}
.stalker .head::before { top: 18%; }
.stalker .head::after { bottom: 18%; }
${hideCss(o)}`,
      js: wrap(o, `  const segs = [...el.querySelectorAll("span")];
  const N = segs.length;
  const S = ${o.size};
  const GAP = Math.max(4, S * 0.4);
  const head = { x: -100, y: -100 };
  const pts = segs.map(() => ({ x: -100, y: -100 }));
  const setX = segs.map((s) => gsap.quickSetter(s, "x", "px"));
  const setY = segs.map((s) => gsap.quickSetter(s, "y", "px"));
  gsap.set(segs, { xPercent: -50, yPercent: -50 });
  const xTo = gsap.quickTo(head, "x", { duration: ${dur(o)}, ease: "power3" });
  const yTo = gsap.quickTo(head, "y", { duration: ${dur(o)}, ease: "power3" });
  let started = false, speed = 0, phase = 0;
${SHOW_JS}
  addEventListener("pointermove", (e) => {
    if (!started) {
      Object.assign(head, { x: e.clientX, y: e.clientY });
      pts.forEach((p, i) => { p.x = e.clientX - i * GAP; p.y = e.clientY; });
      started = true;
    }
    xTo(e.clientX);
    yTo(e.clientY);
  });
  gsap.ticker.add(() => {
    if (!started) return;
    const v = Math.hypot(head.x - pts[0].x, head.y - pts[0].y);
    speed = speed * 0.9 + v * 0.1;
    phase += 0.05 + speed * 0.06;
    pts[0].x = head.x;
    pts[0].y = head.y;
    for (let i = 1; i < N; i++) {
      const a = pts[i - 1];
      const b = pts[i];
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const d = Math.hypot(dx, dy) || 1;
      if (d > GAP) {
        b.x = a.x + (dx / d) * GAP;
        b.y = a.y + (dy / d) * GAP;
      }
    }
    const amp = Math.min(1, speed / 5) * S * 0.45;
    for (let i = 0; i < N; i++) {
      const a = pts[Math.max(i - 1, 0)];
      const b = pts[Math.max(i, 1)];
      const tx = a.x - b.x;
      const ty = a.y - b.y;
      const len = Math.hypot(tx, ty) || 1;
      const off = Math.sin(phase - i * 0.7) * amp * Math.min(1, i / 3);
      setX[i](pts[i].x - (ty / len) * off);
      setY[i](pts[i].y + (tx / len) * off);
      if (i === 0 && len > 1) gsap.set(segs[0], { rotation: Math.atan2(ty, tx) * 180 / Math.PI });
    }
  });`),
    };
  },
};

export const ADVANCED_2 = [textScatter, imageReveal, spring, jelly, magneticText, underlineFollow, arrowPoint, ribbon, rope, snake];
