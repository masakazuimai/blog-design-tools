// レイアウト結果を canvas と SVG に描く。両者は同じパス・同じ数値から描く
import { mulberry32 } from "./layout.js";

// start を基準に step 間隔で 0〜max に収まる位置を並べる
function series(start, step, max) {
  const out = [];
  let v = start;
  while (v - step > 0) v -= step;
  for (; v < max; v += step) out.push(v);
  return out;
}

// 紙の罫線・マス目・マージン線を算出する（canvas/SVG共通）
// 罫線は文字の位置を基準に並べるので、キャンバスを固定しても行とズレない
function paperMarks(o, paper, lay) {
  const marks = { lines: [], rects: [], color: paper.lineColor || "#9db6cf" };
  if (paper.rule === "line") {
    if (o.dir === "v") {
      series(lay.ox + o.pad + lay.lineStep, lay.lineStep, lay.w).forEach(function (x) {
        marks.lines.push([x, 0, x, lay.h]);
      });
    } else {
      series(lay.oy + o.pad + lay.lineStep, lay.lineStep, lay.h).forEach(function (y) {
        marks.lines.push([0, y, lay.w, y]);
      });
    }
  } else if (paper.rule === "grid") {
    const g = Math.max(20, o.size / 2);
    series(lay.ox + o.pad, g, lay.w).forEach(function (x) { marks.lines.push([x, 0, x, lay.h]); });
    series(lay.oy + o.pad, g, lay.h).forEach(function (y) { marks.lines.push([0, y, lay.w, y]); });
  } else if (paper.rule === "cells") {
    marks.rects = lay.cells;
  }
  return marks;
}

// 紙を斜めに置くため、回転後の外接サイズを求める
export function outerSize(lay, angle) {
  const c = Math.abs(Math.cos(angle)), s = Math.abs(Math.sin(angle));
  return { W: Math.ceil(lay.w * c + lay.h * s), H: Math.ceil(lay.w * s + lay.h * c) };
}

// 鉛筆の「かすれ」用ノイズ。テキスト層をこれで削る
// 粗い濃淡フィールドで確率を変調し、抜けを塊にする（一様ノイズだと網点に見えるため）
function roughCanvas(w, h, amount, seed) {
  const cv = document.createElement("canvas");
  cv.width = w; cv.height = h;
  const ctx = cv.getContext("2d");
  const img = ctx.createImageData(w, h);
  const rnd = mulberry32(seed);
  const block = 3;
  const cell = 26;
  const fw = Math.ceil(w / cell) + 1, fh = Math.ceil(h / cell) + 1;
  const field = new Float32Array(fw * fh);
  for (let i = 0; i < field.length; i++) field[i] = rnd();
  for (let y = 0; y < h; y += block) {
    const fy = Math.floor(y / cell);
    for (let x = 0; x < w; x += block) {
      const f = field[fy * fw + Math.floor(x / cell)];
      const on = rnd() < amount * (0.15 + f * 1.15) ? 255 : 0;
      if (!on) continue;
      for (let by = 0; by < block && y + by < h; by++) {
        for (let bx = 0; bx < block && x + bx < w; bx++) {
          img.data[((y + by) * w + (x + bx)) * 4 + 3] = 255;
        }
      }
    }
  }
  ctx.putImageData(img, 0, 0);
  return cv;
}

function drawText(ctx, lay, o, pen) {
  ctx.fillStyle = o.ink;
  ctx.strokeStyle = o.ink;
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  lay.items.forEach(function (it) {
    const p = new Path2D(it.d);
    ctx.globalAlpha = it.a;
    ctx.fill(p);
    if (it.lw > 0) { ctx.lineWidth = it.lw; ctx.stroke(p); }
  });
  ctx.globalAlpha = 1;
}

export function drawCanvas(cv, lay, o, paper, pen, scale) {
  const ang = o.skew;
  const outer = outerSize(lay, ang);
  cv.width = outer.W * scale;
  cv.height = outer.H * scale;
  const ctx = cv.getContext("2d");
  ctx.setTransform(scale, 0, 0, scale, 0, 0);
  ctx.clearRect(0, 0, outer.W, outer.H);
  ctx.translate(outer.W / 2, outer.H / 2);
  ctx.rotate(ang);
  ctx.translate(-lay.w / 2, -lay.h / 2);

  if (o.forceFill || paper.fill) {
    ctx.fillStyle = o.paperColor;
    ctx.fillRect(0, 0, lay.w, lay.h);
  }
  const marks = paperMarks(o, paper, lay);
  ctx.strokeStyle = marks.color;
  ctx.lineWidth = 1;
  if (marks.lines.length) {
    ctx.beginPath();
    marks.lines.forEach(function (l) { ctx.moveTo(l[0], l[1]); ctx.lineTo(l[2], l[3]); });
    ctx.stroke();
  }
  if (marks.rects.length) {
    ctx.beginPath();
    marks.rects.forEach(function (r) { ctx.rect(r[0], r[1], r[2], r[3]); });
    ctx.stroke();
  }
  if (paper.margin && o.dir === "h") {
    const x = Math.max(10, lay.ox + o.pad * 0.6);
    ctx.strokeStyle = paper.margin;
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, lay.h); ctx.stroke();
  }
  if (paper.corner) {
    const s = Math.min(lay.w, lay.h) * 0.18;
    const g = ctx.createLinearGradient(lay.w - s, lay.h - s, lay.w, lay.h);
    g.addColorStop(0, "rgba(0,0,0,0)");
    g.addColorStop(1, "rgba(0,0,0,.12)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.moveTo(lay.w, lay.h - s); ctx.lineTo(lay.w, lay.h); ctx.lineTo(lay.w - s, lay.h);
    ctx.closePath(); ctx.fill();
  }

  // にじみ・かすれがあるときは別レイヤーに描いてから合成する
  if (pen.blur > 0 || pen.rough > 0) {
    const layer = document.createElement("canvas");
    layer.width = cv.width; layer.height = cv.height;
    const lctx = layer.getContext("2d");
    lctx.setTransform(scale, 0, 0, scale, 0, 0);
    lctx.translate(outer.W / 2, outer.H / 2);
    lctx.rotate(ang);
    lctx.translate(-lay.w / 2, -lay.h / 2);
    if (pen.blur > 0) lctx.filter = "blur(" + (pen.blur * o.size / 64) + "px)";
    drawText(lctx, lay, o, pen);
    lctx.filter = "none";
    if (pen.rough > 0) {
      lctx.setTransform(1, 0, 0, 1, 0, 0);
      lctx.globalCompositeOperation = "destination-out";
      lctx.drawImage(roughCanvas(layer.width, layer.height, pen.rough, o.seed * 31), 0, 0);
      lctx.globalCompositeOperation = "source-over";
    }
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.drawImage(layer, 0, 0);
  } else {
    drawText(ctx, lay, o, pen);
  }
}

export function buildSVG(lay, o, paper, pen) {
  const ang = o.skew;
  const outer = outerSize(lay, ang);
  const deg = (ang * 180 / Math.PI).toFixed(3);
  const s = [];
  s.push('<svg xmlns="http://www.w3.org/2000/svg" width="' + outer.W + '" height="' + outer.H +
         '" viewBox="0 0 ' + outer.W + ' ' + outer.H + '">');

  // にじみ・かすれはSVGではフィルタで表現する（canvasとは完全一致しない）
  let filterAttr = "";
  if (pen.blur > 0 || pen.rough > 0) {
    const inBlur = pen.blur > 0
      ? '<feGaussianBlur in="SourceGraphic" stdDeviation="' + (pen.blur * o.size / 64).toFixed(2) + '" result="src"/>'
      : '';
    const src = pen.blur > 0 ? "src" : "SourceGraphic";
    let body = inBlur;
    if (pen.rough > 0) {
      const k = (1.25 - pen.rough * 0.6).toFixed(2);
      body += '<feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" seed="' + o.seed + '" result="n"/>' +
              '<feColorMatrix in="n" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 -1.4 ' + k + '" result="m"/>' +
              '<feComposite in="' + src + '" in2="m" operator="in"/>';
    }
    s.push('<defs><filter id="pen" x="-10%" y="-10%" width="120%" height="120%">' + body + '</filter></defs>');
    filterAttr = ' filter="url(#pen)"';
  }

  s.push('<g transform="translate(' + (outer.W / 2) + ',' + (outer.H / 2) + ') rotate(' + deg +
         ') translate(' + (-lay.w / 2) + ',' + (-lay.h / 2) + ')">');
  if (o.forceFill || paper.fill) {
    s.push('<rect x="0" y="0" width="' + lay.w + '" height="' + lay.h + '" fill="' + o.paperColor + '"/>');
  }
  const marks = paperMarks(o, paper, lay);
  if (marks.lines.length || marks.rects.length) {
    s.push('<g fill="none" stroke="' + marks.color + '" stroke-width="1">');
    marks.lines.forEach(function (l) {
      s.push('<line x1="' + l[0] + '" y1="' + l[1] + '" x2="' + l[2] + '" y2="' + l[3] + '"/>');
    });
    marks.rects.forEach(function (r) {
      s.push('<rect x="' + r[0].toFixed(1) + '" y="' + r[1].toFixed(1) + '" width="' + r[2].toFixed(1) + '" height="' + r[3].toFixed(1) + '"/>');
    });
    s.push('</g>');
  }
  if (paper.margin && o.dir === "h") {
    const x = Math.max(10, lay.ox + o.pad * 0.6);
    s.push('<line x1="' + x + '" y1="0" x2="' + x + '" y2="' + lay.h + '" stroke="' + paper.margin + '" stroke-width="1"/>');
  }
  if (paper.corner) {
    const cs = Math.min(lay.w, lay.h) * 0.18;
    s.push('<defs><linearGradient id="corner" x1="0" y1="0" x2="1" y2="1">' +
           '<stop offset="0" stop-color="rgba(0,0,0,0)"/><stop offset="1" stop-color="rgba(0,0,0,.12)"/></linearGradient></defs>');
    s.push('<polygon points="' + lay.w + ',' + (lay.h - cs) + ' ' + lay.w + ',' + lay.h + ' ' + (lay.w - cs) + ',' + lay.h +
           '" fill="url(#corner)"/>');
  }

  s.push('<g' + filterAttr + ' fill="' + o.ink + '" stroke="' + o.ink + '" stroke-linejoin="round" stroke-linecap="round">');
  lay.items.forEach(function (it) {
    const op = it.a < 1 ? ' fill-opacity="' + it.a.toFixed(3) + '" stroke-opacity="' + it.a.toFixed(3) + '"' : '';
    const sw = it.lw > 0 ? ' stroke-width="' + it.lw.toFixed(2) + '"' : ' stroke="none"';
    s.push('<path d="' + it.d + '"' + sw + op + '/>');
  });
  s.push('</g></g></svg>');
  return s.join("");
}
