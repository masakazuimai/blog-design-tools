import { GUARD, HIDE_JS, hideCss, ease, half, BASE_CSS, TRACK_JS, FADE_CSS } from "./_shared.js?v=20261112a";

function wrap(o, body) {
  return `(() => {
${GUARD}
  const el = document.querySelector(".stalker");
${o.hide ? HIDE_JS + "\n" : ""}${body}
})();`;
}

function spriteCss(o, file) {
  return `.stalker {
${BASE_CSS}
  width: ${o.size}px;
  height: ${o.size}px;
  margin: -${half(o.size)}px 0 0 -${half(o.size)}px;
  background: url("images/${file}") 0 0 / ${o.size * 16}px ${o.size}px no-repeat;
${FADE_CSS}
}
${hideCss(o)}`;
}

function spriteJs(o, vars, step) {
  return wrap(o, `  const N = 16;
  const SIZE = ${o.size};
${vars}
${TRACK_JS}
  (function loop() {
    const dx = (mx - x) * ${ease(o)};
    const dy = (my - y) * ${ease(o)};
    x += dx;
    y += dy;
${step}
    el.style.backgroundPosition = \`\${-frame * SIZE}px 0\`;
    requestAnimationFrame(loop);
  })();`);
}

const orb = {
  id: "orb",
  label: "光る球",
  desc: "動いた距離だけ球が転がり、表面の模様が流れます。",
  uses: ["size", "lag", "hide"],
  defaults: { size: 72, lag: 80 },
  range: { size: [32, 192] },
  sprite: "stalker-orb.webp",
  build(o) {
    return {
      html: `<div class="stalker" aria-hidden="true"></div>`,
      css: spriteCss(o, this.sprite),
      js: spriteJs(
        o,
        `  let frame = 0, roll = 0;`,
        `    roll += Math.hypot(dx, dy);
    frame = Math.floor(roll / ${Math.max(4, Math.round(o.size / 8))}) % N;
    el.style.transform = \`translate3d(\${x}px, \${y}px, 0)\`;`
      ),
    };
  },
};

const ring = {
  id: "ring",
  label: "金色のリング",
  desc: "速く動かすほど速く回り、止めるとゆっくり回り続けます。",
  uses: ["size", "lag", "hide"],
  defaults: { size: 72, lag: 70 },
  range: { size: [32, 192] },
  sprite: "stalker-ring.webp",
  build(o) {
    return {
      html: `<div class="stalker" aria-hidden="true"></div>`,
      css: spriteCss(o, this.sprite),
      js: spriteJs(
        o,
        `  let frame = 0, spin = 0;`,
        `    spin += 0.12 + Math.hypot(dx, dy) * 0.12;
    frame = Math.floor(spin) % N;
    el.style.transform = \`translate3d(\${x}px, \${y}px, 0)\`;`
      ),
    };
  },
};

const critter = {
  id: "critter",
  label: "小さなキャラ",
  desc: "進む向きに顔を向けて跳ねながら付いてきて、止まるとこちらを向きます。",
  uses: ["size", "lag", "hide"],
  defaults: { size: 80, lag: 85 },
  range: { size: [32, 192] },
  sprite: "stalker-critter.webp",
  build(o) {
    return {
      html: `<div class="stalker" aria-hidden="true"></div>`,
      css: spriteCss(o, this.sprite),
      js: spriteJs(
        o,
        `  const FRONT = 12;
  let frame = FRONT, still = 0, t = 0;`,
        `    t += 1;
    let lift = 0;
    if (Math.hypot(dx, dy) > 0.6) {
      const a = Math.atan2(-dy, dx);
      frame = ((Math.round(a / (Math.PI * 2 / N)) % N) + N) % N;
      still = 0;
      lift = -Math.abs(Math.sin(t * 0.35)) * SIZE * 0.08;
    } else if (++still > 30) {
      frame = FRONT;
    }
    el.style.transform = \`translate3d(\${x}px, \${y + lift}px, 0)\`;`
      ),
    };
  },
};

export const PRO = [orb, ring, critter];
