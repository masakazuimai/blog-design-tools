import { wrap, spriteHtml, spriteCss, PUFF_JS, head, particleCss, def } from "./pro-base.js?v=20261112c";

const HOVER_SEL = "a, button, [data-stalker]";

const burst = (cls) =>
  particleCss(
    cls,
    `  transform: translate(-50%, -50%);
  animation: ${cls} 0.9s ease-out forwards;`,
    `  from {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
  to {
    opacity: 0;
    transform: translate(calc(-50% + var(--dx)), calc(-50% + var(--dy))) scale(0.3);
  }`
  );

const fall = (cls, dur) =>
  particleCss(
    cls,
    `  transform: translate(-50%, -50%);
  animation: ${cls} ${dur}s linear forwards;`,
    `  from {
    opacity: 1;
    transform: translate(-50%, -50%) rotate(0deg);
  }
  to {
    opacity: 0;
    transform: translate(calc(-50% + var(--dx, 0px)), calc(-50% + var(--dy, 60px))) rotate(var(--r, 0deg));
  }`
  );

function loop(body) {
  return `  (function loop() {
    const dx = (mx - x) * E;
    const dy = (my - y) * E;
    x += dx;
    y += dy;
    t += 1;
    const v = Math.hypot(dx, dy);
${body}
    requestAnimationFrame(loop);
  })();`;
}

const orb = def(
  { id: "orb", label: "光る球", desc: "動いた距離だけ転がって付いてきて、止まると光の粒をふわっと放ちます。" },
  "stalker-orb.webp",
  16,
  1,
  { size: 72, lag: 80 },
  (o, file, cols, rows) => ({
    html: spriteHtml(),
    css: spriteCss(
      o,
      file,
      cols,
      rows,
      `${burst("stalker-glint")}.stalker-glint {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #a5f3fc;
  box-shadow: 0 0 10px #22d3ee;
}
`
    ),
    js: wrap(
      o,
      `${head(o, cols)}
${PUFF_JS}
  let roll = 0, still = 0, t = 0;
${loop(`    roll += v;
    still = v < 0.3 ? still + 1 : 0;
    if (active && still > 40 && t % 10 === 0) {
      const a = Math.random() * Math.PI * 2;
      puff("stalker-glint", x, y, { "--dx": Math.cos(a) * SIZE + "px", "--dy": Math.sin(a) * SIZE + "px" });
    }
    sprite.style.transform = \`translate3d(\${x}px, \${y}px, 0)\`;
    show(sprite, Math.floor(roll / ${Math.max(4, Math.round(o.size / 8))}) % COLS, 0);`)}`
    ),
  })
);

const ring = def(
  { id: "ring", label: "金色のリング", desc: "くるくる回りながら付いてきて、リンクやボタンに乗るとその上で大きくなって囲みます。" },
  "stalker-ring.webp",
  16,
  1,
  { size: 64, lag: 70 },
  (o, file, cols, rows) => ({
    html: spriteHtml(),
    css: spriteCss(o, file, cols, rows),
    js: wrap(
      o,
      `${head(o, cols)}
  let spin = 0, t = 0, k = 1, target = null;
  document.addEventListener("pointerover", (e) => {
    target = e.target.closest("${HOVER_SEL}");
  });
${loop(`    let px = x, py = y, goal = 1;
    if (target) {
      const r = target.getBoundingClientRect();
      px = r.left + r.width / 2;
      py = r.top + r.height / 2;
      goal = Math.max(r.width, r.height) / SIZE * 1.25;
    }
    k += (goal - k) * 0.15;
    spin += 0.15 + v * 0.1 + (target ? 0.25 : 0);
    sprite.style.transform = \`translate3d(\${px}px, \${py}px, 0) scale(\${k})\`;
    show(sprite, Math.floor(spin) % COLS, 0);`)}`
    ),
  })
);

const critter = def(
  { id: "critter", label: "小さなキャラ", desc: "進む向きに顔を向けて付いてきて、クリックするとジャンプし、着地で影ごとむにっとつぶれます。" },
  "stalker-critter.webp",
  16,
  1,
  { size: 80, lag: 85 },
  (o, file, cols, rows) => ({
    html: `<div class="stalker" aria-hidden="true">
  <div class="stalker-shadow"></div>
  <div class="stalker-sprite"></div>
</div>`,
    css: spriteCss(
      o,
      file,
      cols,
      rows,
      `.stalker-shadow {
  position: absolute;
  top: 0;
  left: 0;
  width: ${Math.round(o.size * 0.7)}px;
  height: ${Math.round(o.size * 0.18)}px;
  margin: -${Math.round(o.size * 0.09)}px 0 0 -${Math.round(o.size * 0.35)}px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.18);
}
`
    ),
    js: wrap(
      o,
      `${head(o, cols)}
  const shadow = el.querySelector(".stalker-shadow");
  let frame = 12, still = 0, t = 0, h = 0, vh = 0, squash = 0;
  addEventListener("pointerdown", () => {
    if (h === 0) vh = SIZE * 0.22;
  });
${loop(`    if (v > 0.6) {
      frame = ((Math.round(Math.atan2(-dy, dx) / (Math.PI / 8)) % 16) + 16) % 16;
      still = 0;
    } else if (++still > 30) {
      frame = 12;
    }
    if (h > 0 || vh > 0) {
      vh -= SIZE * 0.018;
      h += vh;
      if (h <= 0) {
        h = 0;
        vh = 0;
        squash = 1;
      }
    }
    squash *= 0.85;
    const sx = 1 + squash * 0.25;
    const sy = 1 - squash * 0.25;
    sprite.style.transform = \`translate3d(\${x}px, \${y - h}px, 0) scale(\${sx}, \${sy})\`;
    shadow.style.transform = \`translate3d(\${x}px, \${y + SIZE * 0.42}px, 0) scale(\${1 - h / (SIZE * 2)})\`;
    show(sprite, frame, 0);`)}`
    ),
  })
);

const gem = def(
  { id: "gem", label: "宝石", desc: "宝石が回りながら付いてきて、動いた跡にキラッと光る粒を落とします。" },
  "stalker-gem.webp",
  16,
  1,
  { size: 64, lag: 70 },
  (o, file, cols, rows) => ({
    html: spriteHtml(),
    css: spriteCss(
      o,
      file,
      cols,
      rows,
      `${fall("stalker-glitter", 1.1)}.stalker-glitter {
  color: #67e8f9;
  font-size: 18px;
  line-height: 1;
  text-shadow: 0 0 8px #22d3ee;
}
`
    ),
    js: wrap(
      o,
      `${head(o, cols)}
${PUFF_JS}
  let spin = 0, t = 0, dist = 0;
${loop(`    spin += 0.12 + v * 0.12;
    dist += v;
    if (dist > 18) {
      dist = 0;
      puff("stalker-glitter", x + (Math.random() - 0.5) * SIZE * 0.6, y + SIZE * 0.2, { "--dx": (Math.random() - 0.5) * 30 + "px", "--dy": 40 + Math.random() * 40 + "px", "--r": "180deg" }, "✦");
    }
    sprite.style.transform = \`translate3d(\${x}px, \${y}px, 0)\`;
    show(sprite, Math.floor(spin) % COLS, 0);`)}`
    ),
  })
);

const snowman = def(
  { id: "snowman", label: "雪だるま", desc: "雪だるまがゆっくり回りながら付いてきて、周りにずっと雪が降ります。" },
  "stalker-snowman.webp",
  16,
  1,
  { size: 80, lag: 85 },
  (o, file, cols, rows) => ({
    html: spriteHtml(),
    css: spriteCss(
      o,
      file,
      cols,
      rows,
      `${fall("stalker-snow", 2.2)}.stalker-snow {
  color: #e0f2fe;
  font-size: 16px;
  line-height: 1;
  text-shadow: 0 0 4px #7dd3fc;
}
`
    ),
    js: wrap(
      o,
      `${head(o, cols)}
${PUFF_JS}
  let spin = 0, t = 0;
${loop(`    spin += 0.08 + v * 0.05;
    if (active && t % 7 === 0) {
      puff("stalker-snow", x + (Math.random() - 0.5) * SIZE * 1.8, y - SIZE * 0.9, { "--dx": (Math.random() - 0.5) * 30 + "px", "--dy": SIZE * 1.6 + "px", "--r": "160deg" }, "❄");
    }
    sprite.style.transform = \`translate3d(\${x}px, \${y}px, 0)\`;
    show(sprite, Math.floor(spin) % COLS, 0);`)}`
    ),
  })
);

const pumpkin = def(
  { id: "pumpkin", label: "かぼちゃ", desc: "かぼちゃがぴょんぴょん弾んで追いかけ、着地のたびにむにっとつぶれます。" },
  "stalker-pumpkin.webp",
  16,
  1,
  { size: 72, lag: 85 },
  (o, file, cols, rows) => ({
    html: spriteHtml(),
    css: spriteCss(o, file, cols, rows),
    js: wrap(
      o,
      `${head(o, cols)}
  let spin = 0, t = 0, squash = 0, hopT = 0;
${loop(`    if (v > 0.4 || hopT % 26 !== 0) {
      hopT += 1;
      if (hopT % 26 === 0) squash = 1;
    }
    const hop = Math.sin(((hopT % 26) / 26) * Math.PI);
    squash *= 0.82;
    spin += v * 0.08;
    const sx = 1 + squash * 0.3;
    const sy = 1 - squash * 0.3;
    sprite.style.transform = \`translate3d(\${x}px, \${y - hop * SIZE * 0.45}px, 0) scale(\${sx}, \${sy})\`;
    show(sprite, Math.floor(spin) % COLS, 0);`)}`
    ),
  })
);

const wand = def(
  { id: "wand", label: "星の杖", desc: "星の杖が回りながら付いてきて、すばやく振ると星が飛び散ります。" },
  "stalker-wand.webp",
  16,
  1,
  { size: 72, lag: 60 },
  (o, file, cols, rows) => ({
    html: spriteHtml(),
    css: spriteCss(
      o,
      file,
      cols,
      rows,
      `${burst("stalker-star")}.stalker-star {
  color: #fbbf24;
  font-size: 20px;
  line-height: 1;
  text-shadow: 0 0 8px #fde68a;
}
`
    ),
    js: wrap(
      o,
      `${head(o, cols)}
${PUFF_JS}
  let spin = 0, t = 0;
${loop(`    spin += 0.1 + v * 0.15;
    if (v > 6 && t % 2 === 0) {
      const a = Math.random() * Math.PI * 2;
      const r = SIZE * (0.6 + Math.random() * 0.8);
      puff("stalker-star", x, y - SIZE * 0.3, { "--dx": Math.cos(a) * r + "px", "--dy": Math.sin(a) * r + "px" }, "★");
    }
    sprite.style.transform = \`translate3d(\${x}px, \${y}px, 0)\`;
    show(sprite, Math.floor(spin) % COLS, 0);`)}`
    ),
  })
);

export const PRO = [orb, ring, critter, gem, snowman, pumpkin, wand];
