import { GUARD, HIDE_JS, hideCss, dur, BASE_CSS } from "./_shared.js?v=20261112a";

const HOVER_SEL = 'a, button, [data-stalker]';

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

const magnetic = {
  id: "magnetic",
  label: "ボタンに吸い付く",
  desc: "リングがボタンの形に変わって包み込み、ボタンもマウスへ少し引き寄せられます。",
  uses: ["color", "size", "lag", "hide"],
  defaults: { size: 36, lag: 25, hide: true },
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
${hideCss(o)}`,
      js: wrap(o, `  const SIZE = ${o.size};
  gsap.set(el, { xPercent: -50, yPercent: -50, x: -100, y: -100 });
  const xTo = gsap.quickTo(el, "x", { duration: ${dur(o)}, ease: "power3" });
  const yTo = gsap.quickTo(el, "y", { duration: ${dur(o)}, ease: "power3" });
  let target = null;
  let rect = null;
${showJs("el")}
  addEventListener("pointermove", (e) => {
    if (target) {
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      xTo(cx + dx * 0.15);
      yTo(cy + dy * 0.15);
      gsap.to(target, { x: dx * 0.25, y: dy * 0.25, duration: 0.4, ease: "power3" });
    } else {
      xTo(e.clientX);
      yTo(e.clientY);
    }
  });
  document.addEventListener("pointerover", (e) => {
    const t = e.target.closest("${HOVER_SEL}");
    if (t === target) return;
    if (target) {
      gsap.to(target, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1, 0.4)" });
    }
    target = t;
    if (t) {
      rect = t.getBoundingClientRect();
      const r = getComputedStyle(t).borderRadius;
      gsap.to(el, {
        width: rect.width + 12,
        height: rect.height + 12,
        borderRadius: r === "0px" ? "8px" : r,
        duration: 0.35,
        ease: "power3",
      });
    } else {
      gsap.to(el, { width: SIZE, height: SIZE, borderRadius: "50%", duration: 0.35, ease: "power3" });
    }
  });`),
    };
  },
};

const goo = {
  id: "goo",
  label: "液体のようにくっつく",
  desc: "いくつかの丸が少しずつ遅れて付いてきて、液体のようにくっついたり分かれたりします。",
  uses: ["color", "size", "lag", "hide"],
  defaults: { size: 36, lag: 30 },
  gsap: true,
  build(o) {
    const sizes = [1, 0.85, 0.7, 0.58, 0.46].map((k) => Math.round(o.size * k));
    return {
      html: `<svg width="0" height="0" style="position: absolute" aria-hidden="true">
  <filter id="stalker-goo">
    <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="blur" />
    <feColorMatrix in="blur" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -8" />
  </filter>
</svg>
<div class="stalker" aria-hidden="true">
${sizes.map((s) => `  <span style="width: ${s}px; height: ${s}px"></span>`).join("\n")}
</div>`,
      css: `.stalker {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 9999;
  filter: url(#stalker-goo);
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
      js: wrap(o, `  const blobs = [...el.querySelectorAll("span")].map((b, i) => {
    gsap.set(b, { xPercent: -50, yPercent: -50, x: -200, y: -200 });
    const d = ${dur(o)} + i * 0.12;
    return {
      x: gsap.quickTo(b, "x", { duration: d, ease: "power3" }),
      y: gsap.quickTo(b, "y", { duration: d, ease: "power3" }),
    };
  });
${showJs('el.querySelectorAll("span")')}
  addEventListener("pointermove", (e) => {
    blobs.forEach((b) => {
      b.x(e.clientX);
      b.y(e.clientY);
    });
  });`),
    };
  },
};

const spin = {
  id: "spin",
  label: "慣性で回る",
  desc: "動かした距離だけ四角が回り、止めると惰性でゆっくり止まります。",
  uses: ["color", "size", "lag", "hide"],
  defaults: { size: 28, lag: 30 },
  gsap: true,
  build(o) {
    return {
      html: `<div class="stalker" aria-hidden="true"></div>`,
      css: `.stalker {
${BASE_CSS}
  width: ${o.size}px;
  height: ${o.size}px;
  border-radius: ${Math.max(4, Math.round(o.size / 5))}px;
  background: ${o.color};
${SHOW_CSS}
}
${hideCss(o)}`,
      js: wrap(o, `  gsap.set(el, { xPercent: -50, yPercent: -50, x: -100, y: -100 });
  const xTo = gsap.quickTo(el, "x", { duration: ${dur(o)}, ease: "power3" });
  const yTo = gsap.quickTo(el, "y", { duration: ${dur(o)}, ease: "power3" });
  const rotTo = gsap.quickTo(el, "rotation", { duration: 1.2, ease: "power2" });
  let lastX = null, lastY = 0, angle = 0;
${showJs("el")}
  addEventListener("pointermove", (e) => {
    if (lastX !== null) {
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      angle += Math.hypot(dx, dy) * (dx < 0 ? -1.2 : 1.2);
      rotTo(angle);
    }
    lastX = e.clientX;
    lastY = e.clientY;
    xTo(e.clientX);
    yTo(e.clientY);
  });`),
    };
  },
};

const line = {
  id: "line",
  label: "軌跡を線で描く",
  desc: "動かした跡に線が伸びて、止めると先端へ縮んでいきます。大きさは線の太さです。",
  uses: ["color", "size", "lag", "hide"],
  defaults: { size: 8, lag: 40 },
  range: { size: [2, 32] },
  gsap: true,
  build(o) {
    const e = Math.max(0.2, 0.75 - o.lag / 200).toFixed(2);
    return {
      html: `<svg class="stalker" aria-hidden="true">
  <polyline fill="none" />
</svg>`,
      css: `.stalker {
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 9999;
${SHOW_CSS}
}
.stalker polyline {
  stroke: ${o.color};
  stroke-width: ${o.size};
  stroke-linecap: round;
  stroke-linejoin: round;
}
${hideCss(o)}`,
      js: wrap(o, `  const line = el.querySelector("polyline");
  const N = 24;
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
    line.setAttribute("points", pts.map((p) => \`\${p.x.toFixed(1)},\${p.y.toFixed(1)}\`).join(" "));
  });`),
    };
  },
};

export const ADVANCED = [magnetic, goo, spin, line];
