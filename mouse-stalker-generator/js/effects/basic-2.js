import { GUARD, HIDE_JS, hideCss, ease, half, BASE_CSS, TRACK_JS, FADE_CSS, hexToRgb, escText } from "./_shared.js?v=20261112a";

const HOVER_SEL = 'a, button, [data-stalker]';

function wrap(o, body) {
  return `(() => {
${GUARD}
  const el = document.querySelector(".stalker");
${o.hide ? HIDE_JS + "\n" : ""}${body}
})();`;
}

function hoverJs() {
  return `  document.addEventListener("pointerover", (e) => {
    el.classList.toggle("is-hover", !!e.target.closest("${HOVER_SEL}"));
  });`;
}

function loopJs(o) {
  return `  (function loop() {
    x += (mx - x) * ${ease(o)};
    y += (my - y) * ${ease(o)};
    el.style.transform = \`translate3d(\${x}px, \${y}px, 0)\`;
    requestAnimationFrame(loop);
  })();`;
}

function dims(n) {
  return `  width: ${n}px;
  height: ${n}px;
  margin: -${half(n)}px 0 0 -${half(n)}px;`;
}

const ABS = `  position: absolute;
  top: 0;
  left: 0;`;

const SPIN_KF = `@keyframes stalker-spin {
  to {
    transform: rotate(360deg);
  }
}`;

const SPRING = "cubic-bezier(0.22, 1, 0.36, 1)";

function grow(cls, n) {
  return `.stalker.is-hover .${cls} { transform: scale(${n}); }`;
}

function rootCss() {
  return `.stalker {
${BASE_CSS}
${FADE_CSS}
}`;
}

function shiftHue(hex, deg, light = 0) {
  const n = parseInt(hex.slice(1), 16);
  const [r, g, b] = [16, 8, 0].map((k) => ((n >> k) & 255) / 255);
  const [max, min] = [Math.max(r, g, b), Math.min(r, g, b)];
  const l = (max + min) / 2;
  const d = max - min;
  let h = 0, s = 0;
  if (d) {
    s = Math.min(1, d / (1 - Math.abs(2 * l - 1)));
    h = max === r ? ((g - b) / d) % 6 : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
  }
  const lig = Math.round(Math.min(0.92, l + light) * 100);
  return `hsl(${Math.round((h * 60 + deg + 720) % 360)}, ${Math.round(s * 100)}%, ${lig}%)`;
}

function pack(o, inner, css, body) {
  return {
    html: `<div class="stalker" aria-hidden="true">
${inner}
</div>`,
    css: `${rootCss()}
${css}
${hideCss(o)}`,
    js: wrap(o, body),
  };
}

function simple(o, inner, css, extraJs = hoverJs() + "\n") {
  return pack(o, inner, css, `${TRACK_JS}
${extraJs}${loopJs(o)}`);
}

const square = {
  id: "square",
  label: "四角",
  desc: "角の丸い四角が付いてきて、動く向きに少し傾きます。",
  uses: ["color", "size", "lag", "hide"],
  defaults: { size: 28, lag: 65 },
  build(o) {
    return pack(
      o,
      `  <span class="stalker-square"></span>`,
      `.stalker-square {
${ABS}
${dims(o.size)}
  border-radius: 22%;
  background: ${o.color};
  transition: background 0.3s, box-shadow 0.3s;
}
.stalker.is-hover .stalker-square {
  background: transparent;
  box-shadow: inset 0 0 0 2px ${o.color};
}`,
      `${TRACK_JS}
${hoverJs()}
  let tilt = 0;
  (function loop() {
    const dx = mx - x;
    x += dx * ${ease(o)};
    y += (my - y) * ${ease(o)};
    tilt += (Math.max(-25, Math.min(25, dx * 0.5)) - tilt) * 0.2;
    el.style.transform = \`translate3d(\${x}px, \${y}px, 0) rotate(\${tilt}deg)\`;
    requestAnimationFrame(loop);
  })();`
    );
  },
};

const diamond = {
  id: "diamond",
  label: "ひし形",
  desc: "45度回した四角が付いてきます。リンクの上では一回転して大きくなります。",
  uses: ["color", "size", "lag", "hide"],
  defaults: { size: 22, lag: 65 },
  build(o) {
    return simple(
      o,
      `  <span class="stalker-diamond"></span>`,
      `.stalker-diamond {
${ABS}
${dims(o.size)}
  border-radius: 3px;
  background: ${o.color};
  transform: rotate(45deg);
  transition: transform 0.5s ${SPRING}, opacity 0.3s;
}
.stalker.is-hover .stalker-diamond {
  transform: rotate(225deg) scale(1.8);
  opacity: 0.6;
}`
    );
  },
};

const crosshair = {
  id: "crosshair",
  label: "クロスヘア", aka: "十字（照準）",
  desc: "細い線の十字が照準のように付いてきます。リンクの上では斜めに回ります。",
  uses: ["color", "size", "lag", "hide"],
  defaults: { size: 36, lag: 20, hide: true },
  build(o) {
    const arm = Math.max(4, half(o.size) - 5);
    return simple(
      o,
      `  <span class="stalker-cross">
    <i class="arm-top"></i>
    <i class="arm-bottom"></i>
    <i class="arm-left"></i>
    <i class="arm-right"></i>
  </span>`,
      `.stalker-cross {
${ABS}
  transition: transform 0.35s ${SPRING};
}
.stalker-cross i {
  position: absolute;
  background: ${o.color};
}
.arm-top,
.arm-bottom {
  left: -1px;
  width: 2px;
  height: ${arm}px;
}
.arm-top {
  bottom: 5px;
}
.arm-bottom {
  top: 5px;
}
.arm-left,
.arm-right {
  top: -1px;
  width: ${arm}px;
  height: 2px;
}
.arm-left {
  right: 5px;
}
.arm-right {
  left: 5px;
}
.stalker.is-hover .stalker-cross {
  transform: rotate(45deg) scale(1.3);
}`
    );
  },
};

const outline = {
  id: "outline",
  label: "枠だけの丸",
  desc: "中が透けた輪っかが付いてきます。リンクの上では大きくなり、うっすら塗られます。",
  uses: ["color", "size", "lag", "hide"],
  defaults: { size: 36, lag: 70 },
  build(o) {
    return simple(
      o,
      `  <span class="stalker-outline"></span>`,
      `.stalker-outline {
${ABS}
${dims(o.size)}
  border: 2px solid ${o.color};
  border-radius: 50%;
  box-sizing: border-box;
  transition: transform 0.35s ${SPRING}, background 0.3s;
}
.stalker.is-hover .stalker-outline {
  transform: scale(1.8);
  background: rgba(${hexToRgb(o.color)}, 0.15);
}`
    );
  },
};

const doubleOutline = {
  id: "double-outline",
  label: "二重の枠",
  desc: "大きさの違う2つの輪が、違う速さで追いかけてきます。",
  uses: ["color", "size", "lag", "hide"],
  defaults: { size: 44, lag: 70 },
  build(o) {
    const inner = Math.max(8, Math.round(o.size * 0.45));
    const fast = Math.min(1, Number(ease(o)) * 1.8).toFixed(2);
    const slow = Math.max(0.04, Number(ease(o)) * 0.6).toFixed(2);
    return pack(
      o,
      `  <span class="stalker-ring ring-inner"></span>
  <span class="stalker-ring ring-outer"></span>`,
      `.stalker-ring {
${ABS}
  border: 2px solid ${o.color};
  border-radius: 50%;
  box-sizing: border-box;
}
.ring-inner {
${dims(inner)}
}
.ring-outer {
${dims(o.size)}
  opacity: 0.5;
}`,
      `  const inner = el.querySelector(".ring-inner");
  const outer = el.querySelector(".ring-outer");
${TRACK_JS}
  let ox = -100, oy = -100;
  (function loop() {
    x += (mx - x) * ${fast};
    y += (my - y) * ${fast};
    ox += (mx - ox) * ${slow};
    oy += (my - oy) * ${slow};
    inner.style.transform = \`translate3d(\${x}px, \${y}px, 0)\`;
    outer.style.transform = \`translate3d(\${ox}px, \${oy}px, 0)\`;
    requestAnimationFrame(loop);
  })();`
    );
  },
};

const dashedRing = {
  id: "dashed-ring",
  label: "回る点線リング",
  desc: "点線の輪がくるくる回りながら付いてきます。リンクの上では大きくなります。",
  uses: ["color", "size", "lag", "hide"],
  defaults: { size: 44, lag: 65 },
  build(o) {
    return simple(
      o,
      `  <span class="stalker-scale">
    <span class="stalker-dashed"></span>
  </span>
  <span class="stalker-center"></span>`,
      `.stalker-scale {
${ABS}
${dims(o.size)}
  transition: transform 0.4s ${SPRING};
}
.stalker-dashed {
  position: absolute;
  inset: 0;
  border: 2px dashed ${o.color};
  border-radius: 50%;
  animation: stalker-spin 6s linear infinite;
}
.stalker-center {
${ABS}
${dims(6)}
  border-radius: 50%;
  background: ${o.color};
}
${grow("stalker-scale", 1.6)}
${SPIN_KF}`
    );
  },
};

const glow = {
  id: "glow",
  label: "グロー", aka: "ぼかした光の玉",
  desc: "ふちのぼけた光の玉がふわっと付いてきます。暗い背景で映えます。",
  uses: ["color", "size", "lag", "hide"],
  defaults: { size: 80, lag: 75 },
  build(o) {
    const rgb = hexToRgb(o.color);
    return simple(
      o,
      `  <span class="stalker-glow"></span>`,
      `.stalker-glow {
${ABS}
${dims(o.size)}
  border-radius: 50%;
  background: radial-gradient(circle, rgba(${rgb}, 0.95) 0, rgba(${rgb}, 0.5) 35%, rgba(${rgb}, 0) 70%);
  filter: blur(${Math.max(2, Math.round(o.size / 16))}px);
  transition: transform 0.4s ${SPRING};
}
${grow("stalker-glow", 1.5)}`
    );
  },
};

const gradient = {
  id: "gradient",
  label: "グラデーション", aka: "グラデの丸",
  desc: "2色のグラデーションの丸が、ゆっくり回って色を変えながら付いてきます。",
  uses: ["color", "size", "lag", "hide"],
  defaults: { size: 36, lag: 65 },
  build(o) {
    return simple(
      o,
      `  <span class="stalker-gradient"></span>`,
      `.stalker-gradient {
${ABS}
${dims(o.size)}
  border-radius: 50%;
  background: linear-gradient(135deg, ${o.color}, ${shiftHue(o.color, 70, 0.15)});
  animation: stalker-spin 4s linear infinite, stalker-hue 3s ease-in-out infinite alternate;
}
${SPIN_KF}
@keyframes stalker-hue {
  to {
    filter: hue-rotate(50deg);
  }
}`,
      ""
    );
  },
};

const pulse = {
  id: "pulse",
  label: "パルス", aka: "脈打つ丸",
  desc: "丸のまわりに、波紋のような輪がくり返し広がります。",
  uses: ["color", "size", "lag", "hide"],
  defaults: { size: 18, lag: 65 },
  build(o) {
    return simple(
      o,
      `  <span class="stalker-pulse"></span>`,
      `.stalker-pulse {
${ABS}
${dims(o.size)}
  border-radius: 50%;
  background: ${o.color};
  transition: transform 0.35s ${SPRING};
}
.stalker-pulse::after {
  content: "";
  position: absolute;
  inset: 0;
  border: 2px solid ${o.color};
  border-radius: 50%;
  animation: stalker-pulse 1.6s ease-out infinite;
}
${grow("stalker-pulse", 1.5)}
@keyframes stalker-pulse {
  from {
    transform: scale(1);
    opacity: 0.8;
  }
  to {
    transform: scale(2.8);
    opacity: 0;
  }
}`
    );
  },
};

const colorSwap = {
  id: "color-swap",
  label: "リンクで色が変わる",
  desc: "リンクやボタンに乗ると、丸が別の色に変わって少し大きくなります。",
  uses: ["color", "size", "lag", "hide"],
  defaults: { size: 22, lag: 65 },
  build(o) {
    return simple(
      o,
      `  <span class="stalker-swap"></span>`,
      `.stalker-swap {
${ABS}
${dims(o.size)}
  border-radius: 50%;
  background: ${o.color};
  transition: background 0.3s, transform 0.35s ${SPRING};
}
.stalker.is-hover .stalker-swap {
  background: ${shiftHue(o.color, 150, 0.05)};
  transform: scale(1.6);
}`
    );
  },
};

const arrowLink = {
  id: "arrow-link",
  label: "リンクで矢印に",
  desc: "ふだんは小さな丸。リンクに乗ると広がって、中に矢印が出ます。",
  uses: ["color", "size", "lag", "hide"],
  defaults: { size: 14, lag: 70 },
  build(o) {
    const scale = (Math.max(56, o.size * 1.4) / o.size).toFixed(2);
    return simple(
      o,
      `  <span class="stalker-dot"></span>
  <svg class="stalker-arrow" width="24" height="24" viewBox="0 0 24 24">
    <path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" />
  </svg>`,
      `.stalker-dot {
${ABS}
${dims(o.size)}
  border-radius: 50%;
  background: ${o.color};
  transition: transform 0.4s ${SPRING};
}
.stalker-arrow {
${ABS}
  margin: -12px 0 0 -12px;
  opacity: 0;
  transform: translateX(-10px) rotate(-45deg);
  transition: opacity 0.25s, transform 0.4s ${SPRING};
}
.stalker.is-hover .stalker-dot {
  transform: scale(${scale});
}
.stalker.is-hover .stalker-arrow {
  opacity: 1;
  transform: translateX(0) rotate(-45deg);
}`
    );
  },
};

const press = {
  id: "press",
  label: "押すと縮む",
  desc: "マウスを押すとギュッと縮み、離すとばねのように戻ります。",
  uses: ["color", "size", "lag", "hide"],
  defaults: { size: 28, lag: 60 },
  build(o) {
    return simple(
      o,
      `  <span class="stalker-press"></span>`,
      `.stalker-press {
${ABS}
${dims(o.size)}
  border-radius: 50%;
  background: ${o.color};
  transition: transform 0.5s cubic-bezier(0.34, 1.8, 0.64, 1);
}
${grow("stalker-press", 1.4)}
.stalker.is-down .stalker-press {
  transform: scale(0.55);
  transition-duration: 0.12s;
  transition-timing-function: ease-out;
}`,
      `${hoverJs()}
  addEventListener("pointerdown", () => el.classList.add("is-down"));
  addEventListener("pointerup", () => el.classList.remove("is-down"));
  addEventListener("pointercancel", () => el.classList.remove("is-down"));
`
    );
  },
};

const rotatingText = {
  id: "rotating-text",
  label: "サークルテキスト", aka: "文字が回る円",
  desc: "円に沿って並んだ文字が、くるくる回りながら付いてきます。",
  uses: ["color", "size", "lag", "hide", "text"],
  defaults: { size: 120, lag: 75, text: "SCROLL" },
  range: { size: [90, 200] },
  build(o) {
    const s = o.size;
    const r = half(s) - 12;
    const c = half(s);
    const circ = Math.round(2 * Math.PI * r);
    const unit = `${String(o.text || "SCROLL").trim() || "SCROLL"} ・ `;
    const times = Math.max(1, Math.round(circ / (unit.length * 12)));
    const t = escText(unit.repeat(times));
    return simple(
      o,
      `  <svg class="stalker-text" width="${s}" height="${s}" viewBox="0 0 ${s} ${s}">
    <defs>
      <path id="stalker-circle-path" d="M ${c} ${c} m -${r} 0 a ${r} ${r} 0 1 1 ${r * 2} 0 a ${r} ${r} 0 1 1 -${r * 2} 0" />
    </defs>
    <text textLength="${circ - 4}" lengthAdjust="spacing"><textPath href="#stalker-circle-path">${t}</textPath></text>
  </svg>
  <span class="stalker-center"></span>`,
      `.stalker-text {
${ABS}
  margin: -${half(s)}px 0 0 -${half(s)}px;
  overflow: visible;
  animation: stalker-spin 10s linear infinite;
}
.stalker-text text {
  fill: ${o.color};
  font-size: 16px;
  font-weight: 700;
}
.stalker-center {
${ABS}
${dims(8)}
  border-radius: 50%;
  background: ${o.color};
  transition: transform 0.35s ${SPRING};
}
${grow("stalker-center", 3)}
${SPIN_KF}`
    );
  },
};

const textCaret = {
  id: "text-caret",
  label: "Iビーム", aka: "文字の上で縦棒に",
  desc: "見出しや文章の上では、丸が文字の高さの細い縦棒に変わります。",
  uses: ["color", "size", "lag", "hide"],
  defaults: { size: 20, lag: 55 },
  build(o) {
    return simple(
      o,
      `  <span class="stalker-caret"></span>`,
      `.stalker-caret {
${ABS}
  width: ${o.size}px;
  height: ${o.size}px;
  border-radius: ${half(o.size)}px;
  background: ${o.color};
  transform: translate(-50%, -50%);
  transition: width 0.25s ${SPRING}, height 0.25s ${SPRING}, border-radius 0.25s, opacity 0.25s;
}
.stalker.is-text .stalker-caret {
  width: 3px;
  height: var(--bar, 28px);
  border-radius: 2px;
}
.stalker.is-hover .stalker-caret {
  width: ${o.size * 2}px;
  height: ${o.size * 2}px;
  border-radius: ${o.size}px;
  opacity: 0.4;
}`,
      `  document.addEventListener("pointerover", (e) => {
    const link = e.target.closest("${HOVER_SEL}");
    const text = !link && e.target.closest("p, h1, h2, h3, li");
    el.classList.toggle("is-hover", !!link);
    el.classList.toggle("is-text", !!text);
    if (text) {
      const fs = parseFloat(getComputedStyle(text).fontSize);
      el.style.setProperty("--bar", \`\${Math.round(fs * 1.2)}px\`);
    }
  });
`
    );
  },
};

const shadow = {
  id: "shadow",
  label: "影付きの丸",
  desc: "やわらかい影を落とす丸です。動かすと影が反対側へずれて、浮いて見えます。",
  uses: ["color", "size", "lag", "hide"],
  defaults: { size: 32, lag: 65 },
  build(o) {
    return pack(
      o,
      `  <span class="stalker-shadow"></span>
  <span class="stalker-ball"></span>`,
      `.stalker-shadow,
.stalker-ball {
${ABS}
${dims(o.size)}
  border-radius: 50%;
}
.stalker-shadow {
  background: rgba(0, 0, 0, 0.35);
  filter: blur(${Math.max(3, Math.round(o.size / 5))}px);
}
.stalker-ball {
  background: radial-gradient(circle at 35% 30%, rgba(255, 255, 255, 0.45), rgba(255, 255, 255, 0) 55%), ${o.color};
}`,
      `  const sh = el.querySelector(".stalker-shadow");
  const ball = el.querySelector(".stalker-ball");
${TRACK_JS}
  let sx = 0, sy = 0;
  const clamp = (v) => Math.max(-20, Math.min(20, v));
  (function loop() {
    const dx = mx - x;
    const dy = my - y;
    x += dx * ${ease(o)};
    y += dy * ${ease(o)};
    sx += (clamp(-dx * 0.5) + 4 - sx) * 0.2;
    sy += (clamp(-dy * 0.5) + 8 - sy) * 0.2;
    ball.style.transform = \`translate3d(\${x}px, \${y}px, 0)\`;
    sh.style.transform = \`translate3d(\${x + sx}px, \${y + sy}px, 0)\`;
    requestAnimationFrame(loop);
  })();`
    );
  },
};

const neonRing = {
  id: "neon-ring",
  label: "ネオンリング", aka: "ネオンの輪",
  desc: "ネオン管のように光る輪が付いてきます。暗い背景がおすすめです。",
  uses: ["color", "size", "lag", "hide"],
  defaults: { size: 40, lag: 65, color: "#22d3ee" },
  build(o) {
    const rgb = hexToRgb(o.color);
    return simple(
      o,
      `  <span class="stalker-neon"></span>`,
      `.stalker-neon {
${ABS}
${dims(o.size)}
  border: 2px solid ${shiftHue(o.color, 0, 0.25)};
  border-radius: 50%;
  box-sizing: border-box;
  box-shadow: 0 0 4px ${o.color}, 0 0 12px ${o.color}, 0 0 24px rgba(${rgb}, 0.6), inset 0 0 6px ${o.color}, inset 0 0 14px rgba(${rgb}, 0.5);
  animation: stalker-flicker 2.4s ease-in-out infinite;
  transition: transform 0.4s ${SPRING};
}
${grow("stalker-neon", 1.5)}
@keyframes stalker-flicker {
  50% {
    opacity: 0.75;
  }
}`
    );
  },
};

const frosted = {
  id: "frosted",
  label: "グラスモーフィズム", aka: "すりガラス",
  desc: "すりガラスのような丸が付いてきて、重なった文字や絵がぼやけて見えます。",
  uses: ["color", "size", "lag", "hide"],
  defaults: { size: 90, lag: 70 },
  build(o) {
    return simple(
      o,
      `  <span class="stalker-glass"></span>`,
      `.stalker-glass {
${ABS}
${dims(o.size)}
  border-radius: 50%;
  background: rgba(${hexToRgb(o.color)}, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.6);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.7);
  -webkit-backdrop-filter: blur(5px) saturate(1.6);
  backdrop-filter: blur(5px) saturate(1.6);
  transition: transform 0.4s ${SPRING};
}
${grow("stalker-glass", 1.3)}`
    );
  },
};

const nameTag = {
  id: "name-tag",
  label: "名前ラベルが付いてくる",
  desc: "共同編集の画面のように、矢印と名前のラベルが付いてきます。",
  uses: ["color", "lag", "hide", "text"],
  defaults: { lag: 35, hide: true, text: "YOU" },
  build(o) {
    const t = escText(String(o.text || "YOU").trim() || "YOU");
    return simple(
      o,
      `  <svg class="stalker-pointer" width="22" height="22" viewBox="0 0 22 22">
    <path d="M3 2l15 7-6.5 2-2.8 6.5z" fill="${o.color}" stroke="#fff" stroke-width="1.5" stroke-linejoin="round" />
  </svg>
  <span class="stalker-tag">${t}</span>`,
      `.stalker-pointer {
${ABS}
  margin: -2px 0 0 -3px;
}
.stalker-tag {
${ABS}
  margin: 18px 0 0 14px;
  padding: 2px 12px;
  border-radius: 999px;
  background: ${o.color};
  color: #fff;
  font-size: 16px;
  font-weight: 700;
  line-height: 1.6;
  white-space: nowrap;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transform-origin: 0 0;
  transition: transform 0.3s ${SPRING};
}
${grow("stalker-tag", 1.1)}`
    );
  },
};

const threeDots = {
  id: "three-dots",
  label: "点が3つ並んで追う",
  desc: "3つの点が少しずつ遅れて、行列のように付いてきます。",
  uses: ["color", "size", "lag", "hide"],
  defaults: { size: 14, lag: 85 },
  build(o) {
    const sizes = [o.size, Math.max(4, Math.round(o.size * 0.75)), Math.max(3, Math.round(o.size * 0.5))];
    return pack(
      o,
      `  <span class="stalker-dot dot-1"></span>
  <span class="stalker-dot dot-2"></span>
  <span class="stalker-dot dot-3"></span>`,
      `.stalker-dot {
${ABS}
  border-radius: 50%;
  background: ${o.color};
}
.dot-1 {
${dims(sizes[0])}
}
.dot-2 {
${dims(sizes[1])}
  opacity: 0.7;
}
.dot-3 {
${dims(sizes[2])}
  opacity: 0.45;
}`,
      `  const dots = [...el.querySelectorAll(".stalker-dot")].map((d) => ({ d, x: -100, y: -100 }));
${TRACK_JS}
  (function loop() {
    let tx = mx, ty = my;
    dots.forEach((p) => {
      p.x += (tx - p.x) * ${ease(o)};
      p.y += (ty - p.y) * ${ease(o)};
      p.d.style.transform = \`translate3d(\${p.x}px, \${p.y}px, 0)\`;
      tx = p.x;
      ty = p.y;
    });
    requestAnimationFrame(loop);
  })();`
    );
  },
};

export const BASIC_2 = [
  square,
  diamond,
  crosshair,
  outline,
  doubleOutline,
  dashedRing,
  glow,
  gradient,
  pulse,
  colorSwap,
  arrowLink,
  press,
  rotatingText,
  textCaret,
  shadow,
  neonRing,
  frosted,
  nameTag,
  threeDots,
];
