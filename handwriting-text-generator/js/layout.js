// テキストを1文字ずつパス化して配置する。PNG/JPG/SVGはすべてこの結果から描く

// seed固定で同じ揺らぎを再現するための疑似乱数
export function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// パスの座標を「中心(cx,cy)まわりに回転・拡縮してから平行移動」する
function transformPath(path, cx, cy, angle, scale, dx, dy) {
  const cos = Math.cos(angle), sin = Math.sin(angle);
  const map = function (x, y) {
    const nx = (x - cx) * scale, ny = (y - cy) * scale;
    return [cx + nx * cos - ny * sin + dx, cy + nx * sin + ny * cos + dy];
  };
  path.commands.forEach(function (c) {
    if (c.x !== undefined) { const p = map(c.x, c.y); c.x = p[0]; c.y = p[1]; }
    if (c.x1 !== undefined) { const p = map(c.x1, c.y1); c.x1 = p[0]; c.y1 = p[1]; }
    if (c.x2 !== undefined) { const p = map(c.x2, c.y2); c.x2 = p[0]; c.y2 = p[1]; }
  });
  return path;
}

function translateAll(paths, dx, dy) {
  if (!dx && !dy) return;
  paths.forEach(function (p) { transformPath(p, 0, 0, 0, 1, dx, dy); });
}

export function buildLayout(font, o, paper, pen) {
  const upm = font.unitsPerEm;
  const asc = font.ascender * o.size / upm;
  const desc = -font.descender * o.size / upm;
  const lines = o.text.replace(/\r/g, "").split("\n");
  const rnd = mulberry32(o.seed * 7919);
  const mono = !!paper.mono;          // 原稿用紙は1マス1文字＝等幅で組む
  const step = o.size * (1 + o.ls);   // 文字送り（等幅時）
  const lineStep = o.size * o.lh;
  const paths = [];
  const meta = [];                    // ペンによる字ごとの太さ・濃さ
  let cells = [];
  let minOff = 0, maxOff = 0;         // 行のうねりで基準線からはみ出す量
  let w, h;

  let maxLen = 1;
  lines.forEach(function (l) { maxLen = Math.max(maxLen, l.length); });

  // 行ごとに「全体の傾き」と「うねりの波」を決める
  function lineFlow() {
    return {
      slope: (rnd() - 0.5) * 2 * o.tilt,
      amp: o.wave * o.size * (0.6 + rnd() * 0.8),
      len: o.size * (4 + rnd() * 3),
      phase: rnd() * Math.PI * 2
    };
  }
  // 行頭から距離tでの「基準線のずれ」と「接線の角度」
  function flowAt(f, t) {
    const k = 2 * Math.PI / f.len;
    const slopeTan = Math.tan(f.slope);
    const off = t * slopeTan + f.amp * Math.sin(k * t + f.phase);
    if (off < minOff) minOff = off;
    if (off > maxOff) maxOff = off;
    return { off: off, ang: Math.atan(slopeTan + f.amp * k * Math.cos(k * t + f.phase)) };
  }
  // ペンの「字ごとのムラ」。canvasとSVGで同じ値を使うためここで確定させる
  function penStroke() {
    const base = pen.w * o.size / 64;
    const jitter = base * pen.wVar * (rnd() - 0.5) * 2;
    return {
      lw: Math.max(0, base + jitter + o.weight),
      a: 1 - pen.aVar * rnd()
    };
  }

  if (o.dir === "h") {
    const widths = [];
    lines.forEach(function (line, li) {
      const f = lineFlow();
      const baseY = o.pad + asc + li * lineStep;
      let pen0 = o.pad;
      let prev = null;
      for (let i = 0; i < line.length; i++) {
        const ch = line[i];
        const glyph = font.charToGlyph(ch);
        if (prev && !mono) pen0 += font.getKerningValue(prev, glyph) * o.size / upm;
        const adv = mono ? o.size : glyph.advanceWidth * o.size / upm;
        const inset = mono ? (o.size - glyph.advanceWidth * o.size / upm) / 2 : 0;
        if (ch !== " " && ch !== "　") {
          const fl = flowAt(f, pen0 - o.pad + adv / 2);
          const y = baseY + fl.off;
          const p = glyph.getPath(pen0 + inset, y, o.size);
          transformPath(p, pen0 + adv / 2, y - o.size * 0.3,
            fl.ang + (rnd() - 0.5) * 2 * o.jitA,
            1 + (rnd() - 0.5) * 2 * o.jitS,
            (rnd() - 0.5) * 2 * o.jitP * o.size,
            (rnd() - 0.5) * 2 * o.jitP * o.size);
          paths.push(p);
          meta.push(penStroke());
        } else { rnd(); rnd(); rnd(); rnd(); rnd(); rnd(); }
        pen0 += mono ? step : adv + o.ls * o.size;
        prev = glyph;
      }
      widths.push(pen0 - o.ls * o.size);
    });
    w = Math.max.apply(null, widths.concat([o.pad * 2 + o.size])) + o.pad;
    h = o.pad * 2 + asc + desc + (lines.length - 1) * lineStep + (maxOff - minOff);
    translateAll(paths, 0, -minOff);
    if (paper.rule === "cells") {
      for (let li = 0; li < lines.length; li++) {
        const top = o.pad + asc + li * lineStep - o.size * 0.88 - minOff;
        for (let i = 0; i < maxLen; i++) cells.push([o.pad + i * step, top, o.size, o.size]);
      }
    }
  } else {
    // 縦書き：行＝列として右から左へ積む。うねりは左右方向に出る
    const colW = o.size * o.lh;
    const w0 = o.pad * 2 + lines.length * colW;
    h = o.pad * 2 + maxLen * step - o.size * o.ls;
    lines.forEach(function (line, li) {
      const f = lineFlow();
      const colCx = w0 - o.pad - colW * li - colW / 2;
      for (let i = 0; i < line.length; i++) {
        const ch = line[i];
        if (ch === " " || ch === "　") { rnd(); rnd(); rnd(); rnd(); rnd(); rnd(); continue; }
        const glyph = font.charToGlyph(ch);
        const adv = glyph.advanceWidth * o.size / upm;
        const cy = o.pad + step * i + o.size / 2;
        const fl = flowAt(f, cy - o.pad);
        const cx = colCx + fl.off;
        const p = glyph.getPath(cx - adv / 2, cy + o.size * 0.35, o.size);
        transformPath(p, cx, cy,
          fl.ang + (rnd() - 0.5) * 2 * o.jitA,
          1 + (rnd() - 0.5) * 2 * o.jitS,
          (rnd() - 0.5) * 2 * o.jitP * o.size,
          (rnd() - 0.5) * 2 * o.jitP * o.size);
        paths.push(p);
        meta.push(penStroke());
      }
    });
    w = w0 + (maxOff - minOff);
    translateAll(paths, -minOff, 0);
    if (paper.rule === "cells") {
      for (let li = 0; li < lines.length; li++) {
        const cx = w0 - o.pad - colW * li - colW / 2 - minOff;
        for (let i = 0; i < maxLen; i++) {
          cells.push([cx - o.size / 2, o.pad + step * i, o.size, o.size]);
        }
      }
    }
  }

  // 固定キャンバス指定があれば、中身を中央へ寄せてキャンバスサイズを差し替える
  let ox = 0, oy = 0;
  let overflow = false;
  const cw = Math.ceil(w), ch = Math.ceil(h);   // 中身の実サイズ
  if (o.fixedW > 0 && o.fixedH > 0) {
    ox = Math.round((o.fixedW - w) / 2);
    oy = Math.round((o.fixedH - h) / 2);
    overflow = w > o.fixedW || h > o.fixedH;
    translateAll(paths, ox, oy);
    cells = cells.map(function (c) { return [c[0] + ox, c[1] + oy, c[2], c[3]]; });
    w = o.fixedW;
    h = o.fixedH;
  }

  return {
    items: paths.map(function (p, i) {
      return { d: p.toPathData(2), lw: meta[i].lw, a: meta[i].a };
    }),
    cells: cells,
    w: Math.ceil(w),
    h: Math.ceil(h),
    ox: ox,
    oy: oy,
    overflow: overflow,
    cw: cw,
    ch: ch,
    lineStep: lineStep
  };
}
