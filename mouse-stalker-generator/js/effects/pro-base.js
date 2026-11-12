import { GUARD, HIDE_JS, hideCss, ease, half, TRACK_JS } from "./_shared.js?v=20261113b";

export const USES = ["size", "lag", "hide"];
export const RANGE = { size: [32, 160] };

export function wrap(o, body) {
  return `(() => {
${GUARD}
  const el = document.querySelector(".stalker");
${o.hide ? HIDE_JS + "\n" : ""}${body}
})();`;
}

export function spriteHtml(count = 1) {
  const items = Array.from({ length: count }, () => `  <div class="stalker-sprite"></div>`).join("\n");
  return `<div class="stalker" aria-hidden="true">
${items}
</div>`;
}

export function spriteCss(o, file, cols, rows, extra = "") {
  return `.stalker {
  position: fixed;
  top: 0;
  left: 0;
  pointer-events: none;
  z-index: 9999;
  opacity: 0;
  transition: opacity 0.3s;
}
.stalker.is-active {
  opacity: 1;
}
.stalker-sprite {
  position: absolute;
  top: 0;
  left: 0;
  width: ${o.size}px;
  height: ${o.size}px;
  margin: -${half(o.size)}px 0 0 -${half(o.size)}px;
  background: url("images/${file}") 0 0 / ${o.size * cols}px ${o.size * rows}px no-repeat;
}
${extra}${hideCss(o)}`;
}

export const PUFF_JS = `  function puff(cls, px, py, vars, text) {
    if (el.childElementCount > 60) return;
    const p = document.createElement("span");
    p.className = cls;
    if (text) p.textContent = text;
    p.style.left = px + "px";
    p.style.top = py + "px";
    Object.entries(vars || {}).forEach(([k, v]) => p.style.setProperty(k, v));
    p.addEventListener("animationend", () => p.remove());
    el.appendChild(p);
  }`;

export const DIR_JS = `  const dirRow = (dx, dy) => ((Math.round(Math.atan2(-dy, dx) / (Math.PI / 4)) % 8) + 8) % 8;`;

export function head(o, cols) {
  return `  const sprite = el.querySelector(".stalker-sprite");
  const SIZE = ${o.size};
  const COLS = ${cols};
  const E = ${ease(o)};
  const show = (s, col, row) => {
    s.style.backgroundPosition = \`\${-col * SIZE}px \${-row * SIZE}px\`;
  };
${TRACK_JS}`;
}

export function particleCss(cls, body, keyframes) {
  return `.${cls} {
  position: absolute;
  pointer-events: none;
${body}
}
@keyframes ${cls} {
${keyframes}
}
`;
}

export function def(meta, file, cols, rows, defaults, build) {
  return {
    ...meta,
    uses: USES,
    defaults,
    range: RANGE,
    sprite: file,
    build(o) {
      return build(o, file, cols, rows);
    },
  };
}
