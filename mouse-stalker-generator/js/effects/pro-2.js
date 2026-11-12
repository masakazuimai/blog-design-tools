import { wrap, spriteHtml, spriteCss, PUFF_JS, DIR_JS, head, particleCss, def } from "./pro-base.js?v=20261112c";

const HOVER_SEL = "a, button, [data-stalker]";

const rise = (cls, dur, dy) =>
  particleCss(
    cls,
    `  transform: translate(-50%, -50%);
  animation: ${cls} ${dur}s ease-out forwards;`,
    `  from {
    opacity: 1;
    transform: translate(-50%, -50%) scale(0.6);
  }
  to {
    opacity: 0;
    transform: translate(calc(-50% + var(--dx, 0px)), calc(-50% - ${dy}px)) scale(1.2);
  }`
  );

function walkStep(sleep) {
  return `    if (v > 0.5) {
      row = dirRow(dx, dy);
      walk += 0.12 + v * 0.06;
      col = Math.floor(walk) % 8;
      still = 0;
    } else {
      still += 1;
      if (still > 20) {
        row = 6;
        col = 0;
      }${sleep}
    }`;
}

function frameLoop(body) {
  return `  (function loop() {
    t += 1;
${body}
    requestAnimationFrame(loop);
  })();`;
}

const MOVE = `    const dx = (mx - x) * E;
    const dy = (my - y) * E;
    x += dx;
    y += dy;
    const v = Math.hypot(dx, dy);`;

const cat = def(
  { id: "cat", label: "ねこ", desc: "ねこが足を動かして歩いて付いてきて、しばらく止めると目を閉じて眠り、動かすと起きます。" },
  "stalker-cat.webp",
  9,
  8,
  { size: 80, lag: 85 },
  (o, file, cols, rows) => ({
    html: spriteHtml(),
    css: spriteCss(
      o,
      file,
      cols,
      rows,
      `${rise("stalker-z", 1.6, 50)}.stalker-z {
  color: #64748b;
  font-size: 20px;
  font-weight: 700;
  line-height: 1;
}
`
    ),
    js: wrap(
      o,
      `${head(o, cols)}
${DIR_JS}
${PUFF_JS}
  let row = 6, col = 0, walk = 0, still = 0, t = 0;
${frameLoop(`${MOVE}
${walkStep(`
      if (still > 150) {
        col = 8;
        if (t % 45 === 0) puff("stalker-z", x + SIZE * 0.35, y - SIZE * 0.35, { "--dx": "16px" }, "z");
      }`)}
    sprite.style.transform = \`translate3d(\${x}px, \${y}px, 0)\`;
    show(sprite, col, row);`)}`
    ),
  })
);

const dog = def(
  { id: "dog", label: "いぬ", desc: "いぬが歩いて付いてきて、リンクやボタンに乗るとこちらを向いてしっぽを振り、跳ねて喜びます。" },
  "stalker-dog.webp",
  9,
  8,
  { size: 80, lag: 85 },
  (o, file, cols, rows) => ({
    html: spriteHtml(),
    css: spriteCss(
      o,
      file,
      cols,
      rows,
      `${rise("stalker-heart", 1.2, 46)}.stalker-heart {
  color: #f472b6;
  font-size: 20px;
  line-height: 1;
}
`
    ),
    js: wrap(
      o,
      `${head(o, cols)}
${DIR_JS}
${PUFF_JS}
  let row = 6, col = 0, walk = 0, still = 0, t = 0, target = null;
  document.addEventListener("pointerover", (e) => {
    target = e.target.closest("${HOVER_SEL}");
  });
${frameLoop(`${MOVE}
    let lift = 0;
    if (target && v < 3) {
      row = 6;
      col = Math.floor(t * 0.45) % 8;
      lift = Math.abs(Math.sin(t * 0.3)) * SIZE * 0.12;
      if (t % 20 === 0) puff("stalker-heart", x + (Math.random() - 0.5) * SIZE * 0.6, y - SIZE * 0.45, {}, "♥");
    } else {
${walkStep("")}
    }
    sprite.style.transform = \`translate3d(\${x}px, \${y - lift}px, 0)\`;
    show(sprite, col, row);`)}`
    ),
  })
);

const rabbit = def(
  { id: "rabbit", label: "うさぎ", desc: "うさぎが大きく弧を描いてぴょんぴょん跳び、マウスを追いかけます。" },
  "stalker-rabbit.webp",
  9,
  8,
  { size: 80, lag: 60 },
  (o, file, cols, rows) => ({
    html: spriteHtml(),
    css: spriteCss(o, file, cols, rows),
    js: wrap(
      o,
      `${head(o, cols)}
${DIR_JS}
  const HOP = ${Math.round(12 + o.lag / 6)};
  let row = 6, col = 0, still = 0, t = 0;
  let hop = null;
${frameLoop(`    let h = 0;
    if (!hop && active) {
      const d = Math.hypot(mx - x, my - y);
      if (d > SIZE * 0.5) {
        const k = Math.min(1, (SIZE * 2.2) / d);
        hop = { sx: x, sy: y, tx: x + (mx - x) * k, ty: y + (my - y) * k, p: 0 };
        row = dirRow(hop.tx - x, hop.ty - y);
        still = 0;
      } else if (++still > 40) {
        row = 6;
      }
    }
    if (hop) {
      hop.p = Math.min(1, hop.p + 1 / HOP);
      x = hop.sx + (hop.tx - hop.sx) * hop.p;
      y = hop.sy + (hop.ty - hop.sy) * hop.p;
      h = Math.sin(hop.p * Math.PI) * SIZE * 0.5;
      col = Math.min(7, Math.floor(hop.p * 8));
      if (hop.p >= 1) {
        hop = null;
        col = 0;
      }
    }
    sprite.style.transform = \`translate3d(\${x}px, \${y - h}px, 0)\`;
    show(sprite, col, row);`)}`
    ),
  })
);

const penguin = def(
  { id: "penguin", label: "ペンギン", desc: "3羽のペンギンが行列になって、よちよち歩いて付いてきます。" },
  "stalker-penguin.webp",
  9,
  8,
  { size: 72, lag: 85 },
  (o, file, cols, rows) => ({
    html: spriteHtml(3),
    css: spriteCss(o, file, cols, rows),
    js: wrap(
      o,
      `${head(o, cols)}
${DIR_JS}
  const birds = [...el.querySelectorAll(".stalker-sprite")].map((s, i) => ({ s, x: -200, y: -200, row: 6, col: 0, walk: i * 3, still: 0, k: 1 - i * 0.15 }));
  let t = 0, ready = false;
${frameLoop(`    if (active && !ready) {
      birds.forEach((b, i) => {
        b.x = mx - i * SIZE * 0.6;
        b.y = my;
      });
      ready = true;
    }
    let px = mx, py = my;
    birds.forEach((b, i) => {
      const gap = i === 0 ? 0 : SIZE * 0.7 * b.k;
      const ddx = px - b.x;
      const ddy = py - b.y;
      const d = Math.hypot(ddx, ddy);
      let step = 0;
      if (d > gap + 0.5) {
        step = (d - gap) * E;
        b.x += (ddx / d) * step;
        b.y += (ddy / d) * step;
      }
      if (step > 0.4) {
        b.row = dirRow(ddx, ddy);
        b.walk += 0.15 + step * 0.05;
        b.col = Math.floor(b.walk) % 8;
        b.still = 0;
      } else if (++b.still > 20) {
        b.row = 6;
        b.col = 0;
      }
      b.s.style.transform = \`translate3d(\${b.x}px, \${b.y}px, 0) scale(\${b.k})\`;
      b.s.style.zIndex = String(3 - i);
      show(b.s, b.col, b.row);
      px = b.x;
      py = b.y;
    });`)}`
    ),
  })
);

const plane = def(
  { id: "plane", label: "紙飛行機", desc: "紙飛行機が曲がるたびに機体を傾けて飛び、止めるとマウスの周りをくるくる旋回します。" },
  "stalker-plane.webp",
  8,
  8,
  { size: 72, lag: 80 },
  (o, file, cols, rows) => ({
    html: spriteHtml(),
    css: spriteCss(o, file, cols, rows),
    js: wrap(
      o,
      `${head(o, cols)}
  let ang = 0, bank = 3.5, still = 0, orbit = 0, lastX = 0, lastY = 0, t = 0;
${frameLoop(`    still = Math.hypot(mx - lastX, my - lastY) < 0.5 ? still + 1 : 0;
    lastX = mx;
    lastY = my;
    let tx = mx, ty = my;
    if (still > 40) {
      orbit += 0.03;
      tx = mx + Math.cos(orbit) * SIZE * 1.3;
      ty = my + Math.sin(orbit) * SIZE * 0.9;
    } else {
      orbit = Math.atan2(y - my, x - mx);
    }
    const dx = (tx - x) * E;
    const dy = (ty - y) * E;
    x += dx;
    y += dy;
    let turn = 0;
    if (Math.hypot(dx, dy) > 0.3) {
      let d = Math.atan2(-dy, dx) - ang;
      d = Math.atan2(Math.sin(d), Math.cos(d));
      ang += d * 0.25;
      turn = d;
    }
    bank += (Math.max(0, Math.min(7, 3.5 - turn * 14)) - bank) * 0.2;
    const row = ((Math.round(ang / (Math.PI / 4)) % 8) + 8) % 8;
    sprite.style.transform = \`translate3d(\${x}px, \${y}px, 0)\`;
    show(sprite, Math.round(bank), row);`)}`
    ),
  })
);

const rocket = def(
  { id: "rocket", label: "ロケット", desc: "ロケットが炎をゆらしながら進む向きに飛び、速く動かすと煙を吐いて加速します。" },
  "stalker-rocket.webp",
  8,
  8,
  { size: 72, lag: 80 },
  (o, file, cols, rows) => ({
    html: spriteHtml(),
    css: spriteCss(
      o,
      file,
      cols,
      rows,
      `${rise("stalker-smoke", 0.9, 10)}.stalker-smoke {
  width: ${Math.round(o.size * 0.25)}px;
  height: ${Math.round(o.size * 0.25)}px;
  border-radius: 50%;
  background: rgba(148, 163, 184, 0.6);
}
`
    ),
    js: wrap(
      o,
      `${head(o, cols)}
${DIR_JS}
${PUFF_JS}
  let row = 0, t = 0;
${frameLoop(`${MOVE}
    if (v > 0.5) row = dirRow(dx, dy);
    if (v > 4 && t % 2 === 0) {
      puff("stalker-smoke", x - (dx / v) * SIZE * 0.55, y - (dy / v) * SIZE * 0.55, { "--dx": (Math.random() - 0.5) * 16 + "px" });
    }
    const boost = Math.min(v / 12, 0.25);
    sprite.style.transform = \`translate3d(\${x}px, \${y}px, 0) scale(\${1 + boost})\`;
    show(sprite, Math.floor(t * 0.5) % 8, row);`)}`
    ),
  })
);

const fish = def(
  { id: "fish", label: "金魚", desc: "金魚が尾びれを振って波うつように泳ぎ、ときどき泡を出します。" },
  "stalker-fish.webp",
  8,
  8,
  { size: 72, lag: 85 },
  (o, file, cols, rows) => ({
    html: spriteHtml(),
    css: spriteCss(
      o,
      file,
      cols,
      rows,
      `${rise("stalker-bubble", 1.6, 70)}.stalker-bubble {
  width: 12px;
  height: 12px;
  border: 2px solid rgba(56, 189, 248, 0.7);
  border-radius: 50%;
}
`
    ),
    js: wrap(
      o,
      `${head(o, cols)}
${DIR_JS}
${PUFF_JS}
  let row = 0, swim = 0, t = 0, nx = 0, ny = 0;
${frameLoop(`${MOVE}
    if (v > 0.4) {
      row = dirRow(dx, dy);
      nx = -dy / v;
      ny = dx / v;
    }
    const wave = Math.sin(t * 0.15) * Math.min(v * 4, SIZE * 0.25);
    swim += 0.12 + v * 0.06;
    if (t % 40 === 0 && active) puff("stalker-bubble", x, y - SIZE * 0.25, { "--dx": (Math.random() - 0.5) * 20 + "px" });
    sprite.style.transform = \`translate3d(\${x + nx * wave}px, \${y + ny * wave}px, 0)\`;
    show(sprite, Math.floor(swim) % 8, row);`)}`
    ),
  })
);

const bee = def(
  { id: "bee", label: "蜂", desc: "蜂が羽をはばたかせて、マウスの周りをぶんぶん飛び回ります。" },
  "stalker-bee.webp",
  8,
  8,
  { size: 64, lag: 75 },
  (o, file, cols, rows) => ({
    html: spriteHtml(),
    css: spriteCss(o, file, cols, rows),
    js: wrap(
      o,
      `${head(o, cols)}
${DIR_JS}
  let row = 0, t = 0;
${frameLoop(`    const tx = mx + Math.cos(t * 0.07) * SIZE * 0.9 + Math.sin(t * 0.23) * SIZE * 0.25;
    const ty = my + Math.sin(t * 0.11) * SIZE * 0.6 + Math.cos(t * 0.19) * SIZE * 0.2;
    const dx = (tx - x) * E;
    const dy = (ty - y) * E;
    x += dx;
    y += dy;
    if (Math.hypot(dx, dy) > 0.3) row = dirRow(dx, dy);
    sprite.style.transform = \`translate3d(\${x}px, \${y}px, 0)\`;
    show(sprite, Math.floor(t * 0.8) % 8, row);`)}`
    ),
  })
);

export const PRO_2 = [cat, dog, rabbit, penguin, plane, rocket, fish, bee];
