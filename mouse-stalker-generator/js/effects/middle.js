import { GUARD, HIDE_JS, hideCss, ease, half, BASE_CSS, TRACK_JS, FADE_CSS, hexToRgb } from "./_shared.js?v=20261113b";

function wrap(o, body) {
  return `(() => {
${GUARD}
  const el = document.querySelector(".stalker");
${o.hide ? HIDE_JS + "\n" : ""}${body}
})();`;
}

const CONTAINER_HTML = `<div class="stalker" aria-hidden="true"></div>`;

function spawnJs(o, { gap, make }) {
  return `  let lastX = -999, lastY = -999;
  addEventListener("pointermove", (e) => {
    const x = e.clientX, y = e.clientY;
    if (Math.hypot(x - lastX, y - lastY) < ${gap}) return;
    lastX = x;
    lastY = y;
    const p = document.createElement("span");
${make}
    p.style.left = x + "px";
    p.style.top = y + "px";
    p.addEventListener("animationend", () => p.remove());
    el.appendChild(p);
  });`;
}

const tail = {
  id: "tail",
  label: "トレイル",
  aka: "しっぽ",
  desc: "点が列になって、しっぽのように後を追いかけます。",
  uses: ["color", "size", "lag", "hide"],
  defaults: { size: 18, lag: 45 },
  build(o) {
    const e = Math.max(0.25, Number(ease(o))).toFixed(2);
    return {
      html: CONTAINER_HTML,
      css: `.stalker {
${BASE_CSS}
${FADE_CSS}
}
.stalker-dot {
  position: absolute;
  top: 0;
  left: 0;
  border-radius: 50%;
  background: ${o.color};
}
${hideCss(o)}`,
      js: wrap(o, `  const N = 14;
  const SIZE = ${o.size};
  const dots = Array.from({ length: N }, (_, i) => {
    const d = document.createElement("span");
    const s = SIZE * (1 - (i / N) * 0.8);
    d.className = "stalker-dot";
    d.style.width = d.style.height = s + "px";
    d.style.margin = \`-\${s / 2}px 0 0 -\${s / 2}px\`;
    d.style.opacity = 1 - i / N;
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
  (function loop() {
    let px = mx, py = my;
    dots.forEach((p) => {
      p.x += (px - p.x) * ${e};
      p.y += (py - p.y) * ${e};
      p.el.style.transform = \`translate3d(\${p.x}px, \${p.y}px, 0)\`;
      px = p.x;
      py = p.y;
    });
    requestAnimationFrame(loop);
  })();`),
    };
  },
};

const sparkle = {
  id: "sparkle",
  label: "キラキラ",
  desc: "動かした跡に星の粒が散って消えていきます。",
  uses: ["color", "size", "hide"],
  defaults: { size: 22 },
  build(o) {
    return {
      html: CONTAINER_HTML,
      css: `.stalker {
${BASE_CSS}
}
.stalker-star {
  position: absolute;
  color: ${o.color};
  font-size: var(--s);
  line-height: 1;
  text-shadow: 0 0 8px ${o.color};
  animation: stalker-sparkle 0.9s ease-out forwards;
}
@keyframes stalker-sparkle {
  from {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1) rotate(0deg);
  }
  to {
    opacity: 0;
    transform: translate(calc(-50% + var(--dx)), calc(-50% + var(--dy))) scale(0.2) rotate(180deg);
  }
}
${hideCss(o)}`,
      js: wrap(o, spawnJs(o, {
        gap: 14,
        make: `    p.className = "stalker-star";
    p.textContent = "✦";
    p.style.setProperty("--s", ${half(o.size)} + Math.random() * ${half(o.size)} + "px");
    p.style.setProperty("--dx", (Math.random() - 0.5) * 60 + "px");
    p.style.setProperty("--dy", (Math.random() - 0.2) * 50 + "px");`,
      })),
    };
  },
};

const hearts = {
  id: "hearts",
  label: "ハートが残る",
  desc: "動かすとハートがふわっと浮かんで消えます。かわいい雰囲気のサイトに。",
  uses: ["color", "size", "hide"],
  defaults: { size: 24, color: "#f472b6" },
  build(o) {
    return {
      html: CONTAINER_HTML,
      css: `.stalker {
${BASE_CSS}
}
.stalker-heart {
  position: absolute;
  color: ${o.color};
  font-size: var(--s);
  line-height: 1;
  animation: stalker-heart 1.2s ease-out forwards;
}
@keyframes stalker-heart {
  from {
    opacity: 1;
    transform: translate(-50%, -50%) scale(0.4);
  }
  30% {
    transform: translate(-50%, -80%) scale(1);
  }
  to {
    opacity: 0;
    transform: translate(calc(-50% + var(--dx)), -400%) scale(0.8);
  }
}
${hideCss(o)}`,
      js: wrap(o, spawnJs(o, {
        gap: 28,
        make: `    p.className = "stalker-heart";
    p.textContent = "♥";
    p.style.setProperty("--s", ${half(o.size)} + Math.random() * ${half(o.size)} + "px");
    p.style.setProperty("--dx", (Math.random() - 0.5) * 80 + "%");`,
      })),
    };
  },
};

const ripple = {
  id: "ripple",
  label: "リップル",
  aka: "クリックで波紋",
  desc: "ふだんは丸が付いてきて、クリックした所に輪が広がります。",
  uses: ["color", "size", "lag", "hide"],
  defaults: { size: 20, lag: 65 },
  build(o) {
    return {
      html: `<div class="stalker" aria-hidden="true">
  <span class="stalker-circle"></span>
</div>`,
      css: `.stalker {
${BASE_CSS}
${FADE_CSS}
}
.stalker-circle {
  position: absolute;
  top: 0;
  left: 0;
  width: ${o.size}px;
  height: ${o.size}px;
  margin: -${half(o.size)}px 0 0 -${half(o.size)}px;
  border-radius: 50%;
  background: ${o.color};
}
.stalker-ripple {
  position: absolute;
  width: ${o.size * 4}px;
  height: ${o.size * 4}px;
  margin: -${o.size * 2}px 0 0 -${o.size * 2}px;
  border: 2px solid ${o.color};
  border-radius: 50%;
  animation: stalker-ripple 0.7s ease-out forwards;
}
@keyframes stalker-ripple {
  from {
    opacity: 1;
    transform: scale(0.1);
  }
  to {
    opacity: 0;
    transform: scale(1);
  }
}
${hideCss(o)}`,
      js: wrap(o, `  const circle = el.querySelector(".stalker-circle");
${TRACK_JS}
  addEventListener("pointerdown", (e) => {
    const r = document.createElement("span");
    r.className = "stalker-ripple";
    r.style.left = e.clientX + "px";
    r.style.top = e.clientY + "px";
    r.addEventListener("animationend", () => r.remove());
    el.appendChild(r);
  });
  (function loop() {
    x += (mx - x) * ${ease(o)};
    y += (my - y) * ${ease(o)};
    circle.style.transform = \`translate3d(\${x}px, \${y}px, 0)\`;
    requestAnimationFrame(loop);
  })();`),
    };
  },
};

const stretch = {
  id: "stretch",
  label: "ストレッチ",
  aka: "速さで伸びる",
  desc: "速く動かすほど進む向きに伸びて、止まると丸に戻ります。",
  uses: ["color", "size", "lag", "hide"],
  defaults: { size: 28, lag: 70 },
  build(o) {
    return {
      html: `<div class="stalker" aria-hidden="true">
  <span class="stalker-blob"></span>
</div>`,
      css: `.stalker {
${BASE_CSS}
${FADE_CSS}
}
.stalker-blob {
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
      js: wrap(o, `  const blob = el.querySelector(".stalker-blob");
${TRACK_JS}
  (function loop() {
    const dx = (mx - x) * ${ease(o)};
    const dy = (my - y) * ${ease(o)};
    x += dx;
    y += dy;
    const v = Math.min(Math.hypot(dx, dy) / 30, 1);
    const angle = Math.atan2(dy, dx) * 180 / Math.PI;
    blob.style.transform = \`translate3d(\${x}px, \${y}px, 0) rotate(\${angle}deg) scale(\${1 + v * 0.8}, \${1 - v * 0.4})\`;
    requestAnimationFrame(loop);
  })();`),
    };
  },
};

const spotlight = {
  id: "spotlight",
  label: "スポットライト",
  desc: "画面を暗くして、マウスの周りだけを照らします。色は暗くする側の色です。",
  uses: ["color", "size", "lag", "hide"],
  defaults: { size: 140, lag: 60, color: "#0f172a" },
  range: { size: [60, 280] },
  build(o) {
    return {
      html: CONTAINER_HTML,
      css: `.stalker {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 9999;
  background: radial-gradient(circle at var(--x, -999px) var(--y, -999px), transparent 0, transparent ${o.size}px, rgba(${hexToRgb(o.color)}, 0.85) ${Math.round(o.size * 1.8)}px);
  opacity: 0;
  transition: opacity 0.4s;
}
.stalker.is-active {
  opacity: 1;
}
${hideCss(o)}`,
      js: wrap(o, `${TRACK_JS}
  (function loop() {
    x += (mx - x) * ${ease(o)};
    y += (my - y) * ${ease(o)};
    el.style.setProperty("--x", x + "px");
    el.style.setProperty("--y", y + "px");
    requestAnimationFrame(loop);
  })();`),
    };
  },
};

export const MIDDLE = [tail, sparkle, hearts, ripple, stretch, spotlight];
