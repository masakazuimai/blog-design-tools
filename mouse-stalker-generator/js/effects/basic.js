import { GUARD, HIDE_JS, hideCss, ease, half, BASE_CSS, TRACK_JS, FADE_CSS, escText } from "./_shared.js?v=20261112a";

const HOVER_SEL = 'a, button, [data-stalker]';

function loopJs(o, target = "el") {
  return `  (function loop() {
    x += (mx - x) * ${ease(o)};
    y += (my - y) * ${ease(o)};
    ${target}.style.transform = \`translate3d(\${x}px, \${y}px, 0)\`;
    requestAnimationFrame(loop);
  })();`;
}

function hoverJs() {
  return `  document.addEventListener("pointerover", (e) => {
    el.classList.toggle("is-hover", !!e.target.closest("${HOVER_SEL}"));
  });`;
}

function wrap(o, body) {
  return `(() => {
${GUARD}
  const el = document.querySelector(".stalker");
${o.hide ? HIDE_JS + "\n" : ""}${body}
})();`;
}

const circle = {
  id: "circle",
  label: "基本の丸",
  desc: "丸が少し遅れて付いてくる、いちばん基本の形です。",
  uses: ["color", "size", "lag", "hide"],
  defaults: { size: 24, lag: 70 },
  build(o) {
    return {
      html: `<div class="stalker" aria-hidden="true"></div>`,
      css: `.stalker {
${BASE_CSS}
  width: ${o.size}px;
  height: ${o.size}px;
  margin: -${half(o.size)}px 0 0 -${half(o.size)}px;
  border-radius: 50%;
  background: ${o.color};
${FADE_CSS}
}
${hideCss(o)}`,
      js: wrap(o, `${TRACK_JS}
${loopJs(o)}`),
    };
  },
};

const dotRing = {
  id: "dot-ring",
  label: "点＋リング",
  desc: "点はマウスにぴったり、リングは遅れて付いてくる二重のカーソルです。",
  uses: ["color", "size", "lag", "hide"],
  defaults: { size: 40, lag: 75, hide: true },
  build(o) {
    return {
      html: `<div class="stalker" aria-hidden="true">
  <span class="stalker-dot"></span>
  <span class="stalker-ring"></span>
</div>`,
      css: `.stalker {
${BASE_CSS}
${FADE_CSS}
}
.stalker-dot,
.stalker-ring {
  position: absolute;
  top: 0;
  left: 0;
  border-radius: 50%;
}
.stalker-dot {
  width: 8px;
  height: 8px;
  margin: -4px 0 0 -4px;
  background: ${o.color};
}
.stalker-ring {
  width: ${o.size}px;
  height: ${o.size}px;
  margin: -${half(o.size)}px 0 0 -${half(o.size)}px;
  border: 2px solid ${o.color};
  box-sizing: border-box;
}
${hideCss(o)}`,
      js: wrap(o, `  const dot = el.querySelector(".stalker-dot");
  const ring = el.querySelector(".stalker-ring");
${TRACK_JS}
  (function loop() {
    x += (mx - x) * ${ease(o)};
    y += (my - y) * ${ease(o)};
    dot.style.transform = \`translate3d(\${mx}px, \${my}px, 0)\`;
    ring.style.transform = \`translate3d(\${x}px, \${y}px, 0)\`;
    requestAnimationFrame(loop);
  })();`),
    };
  },
};

const invert = {
  id: "invert",
  label: "下の色を反転",
  desc: "重なった所の色が反転します（mix-blend-mode: difference）。色は白で固定です。",
  uses: ["size", "lag", "hide"],
  defaults: { size: 56, lag: 60 },
  build(o) {
    return {
      html: `<div class="stalker" aria-hidden="true"></div>`,
      css: `.stalker {
${BASE_CSS}
  width: ${o.size}px;
  height: ${o.size}px;
  margin: -${half(o.size)}px 0 0 -${half(o.size)}px;
  border-radius: 50%;
  background: #fff;
  mix-blend-mode: difference;
${FADE_CSS}
}
${hideCss(o)}`,
      js: wrap(o, `${TRACK_JS}
${loopJs(o)}`),
    };
  },
};

const grow = {
  id: "grow",
  label: "リンクで膨らむ",
  desc: "リンクやボタンに乗ると大きく薄くなり、押せる場所だと伝えます。",
  uses: ["color", "size", "lag", "hide"],
  defaults: { size: 20, lag: 70 },
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
  transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.3s;
}
.stalker.is-hover .stalker-circle {
  transform: scale(3);
  opacity: 0.35;
}
${hideCss(o)}`,
      js: wrap(o, `  const circle = el.querySelector(".stalker-circle");
${TRACK_JS}
${hoverJs()}
${loopJs(o, "circle")}`),
    };
  },
};

const label = {
  id: "label",
  label: "文字入りの円",
  desc: "ふだんは小さな点。リンクに乗ると円が広がって文字が出ます。",
  uses: ["color", "size", "lag", "hide", "text"],
  defaults: { size: 88, lag: 75, text: "VIEW" },
  build(o) {
    const t = escText(o.text || "VIEW");
    return {
      html: `<div class="stalker" aria-hidden="true">
  <span class="stalker-label">${t}</span>
</div>`,
      css: `.stalker {
${BASE_CSS}
${FADE_CSS}
}
.stalker-label {
  position: absolute;
  top: 0;
  left: 0;
  display: grid;
  place-items: center;
  width: ${o.size}px;
  height: ${o.size}px;
  margin: -${half(o.size)}px 0 0 -${half(o.size)}px;
  border-radius: 50%;
  background: ${o.color};
  color: #fff;
  font-size: 16px;
  font-weight: 700;
  letter-spacing: 0.08em;
  transform: scale(0.12);
  transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1);
}
.stalker:not(.is-hover) .stalker-label {
  color: transparent;
}
.stalker.is-hover .stalker-label {
  transform: scale(1);
}
${hideCss(o)}`,
      js: wrap(o, `  const label = el.querySelector(".stalker-label");
${TRACK_JS}
${hoverJs()}
${loopJs(o, "label")}`),
    };
  },
};

const emoji = {
  id: "emoji",
  label: "絵文字・画像",
  desc: "好きな絵文字が付いてきます。<img> に替えれば画像でも同じように動きます。",
  uses: ["size", "lag", "hide", "emoji"],
  defaults: { size: 40, lag: 80, emoji: "🐾" },
  build(o) {
    const e = escText(o.emoji || "🐾");
    return {
      html: `<div class="stalker" aria-hidden="true">
  <span class="stalker-emoji">${e}</span>
</div>`,
      css: `.stalker {
${BASE_CSS}
${FADE_CSS}
}
.stalker-emoji {
  position: absolute;
  top: 0;
  left: 0;
  font-size: ${o.size}px;
  line-height: 1;
  margin: 8px 0 0 8px;
}
${hideCss(o)}`,
      js: wrap(o, `  const icon = el.querySelector(".stalker-emoji");
${TRACK_JS}
  let tilt = 0;
  (function loop() {
    const dx = mx - x;
    x += dx * ${ease(o)};
    y += (my - y) * ${ease(o)};
    tilt += (Math.max(-30, Math.min(30, dx * 0.4)) - tilt) * 0.2;
    icon.style.transform = \`translate3d(\${x}px, \${y}px, 0) rotate(\${tilt}deg)\`;
    requestAnimationFrame(loop);
  })();`),
    };
  },
};

export const BASIC = [circle, dotRing, invert, grow, label, emoji];
