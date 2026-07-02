// ============================================================
// 書き出し：PNG（canvasへ手描画）/ JSON 保存・読み込み
// ============================================================

const PAD = 48;

// ---- PNG ----
export function exportPng(state, filename = "whiteboard.png") {
  const items = state.items;
  if (!items.length) return false;

  // 全アイテムのバウンディングボックス
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  items.forEach((it) => {
    minX = Math.min(minX, it.x);
    minY = Math.min(minY, it.y);
    maxX = Math.max(maxX, it.x + it.w);
    maxY = Math.max(maxY, it.y + it.h);
  });

  const w = maxX - minX + PAD * 2;
  const h = maxY - minY + PAD * 2;
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(w * dpr);
  canvas.height = Math.round(h * dpr);
  const ctx = canvas.getContext("2d");
  ctx.scale(dpr, dpr);

  // 座標をオフセット（bbox左上をPADへ）
  const ox = -minX + PAD;
  const oy = -minY + PAD;

  // 背景
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, w, h);

  const byId = new Map(items.map((it) => [it.id, it]));

  // コネクタ（背面）
  ctx.strokeStyle = "#64748b";
  ctx.fillStyle = "#64748b";
  ctx.lineWidth = 2;
  const style = state.wireStyle === "straight" ? "straight" : "elbow";
  state.connectors.forEach((c) => {
    const a = byId.get(c.from);
    const b = byId.get(c.to);
    if (!a || !b) return;
    const pts = wirePoints(a, b, style);
    drawWire(ctx, pts, ox, oy, c.ends || "end");
  });

  // アイテム
  items.forEach((it) => drawItem(ctx, it, ox, oy));

  triggerDownload(canvas, filename);
  return true;
}

function drawItem(ctx, it, ox, oy) {
  const x = it.x + ox;
  const y = it.y + oy;
  ctx.save();
  if (it.type === "folder" || it.type === "file") {
    ctx.fillStyle = it.color;
    ctx.strokeStyle = it.type === "folder" ? "#93b4e6" : "#cbd5e1";
    ctx.lineWidth = it.type === "folder" ? 2 : 1;
    roundRect(ctx, x, y, it.w, it.h, 8);
    ctx.fill();
    ctx.stroke();
    // アイコン
    ctx.font = '18px "Apple Color Emoji", system-ui, sans-serif';
    ctx.textBaseline = "middle";
    ctx.textAlign = "left";
    ctx.fillStyle = "#1f2937";
    const icon = it.type === "folder" ? "📁" : "📄";
    ctx.fillText(icon, x + 12, y + it.h / 2);
    // ラベル
    ctx.font = '16px system-ui, "Hiragino Kaku Gothic ProN", "Noto Sans JP", sans-serif';
    const label = it.text || "";
    ctx.fillText(label, x + 40, y + it.h / 2 + 1);
  } else if (it.type === "sticky") {
    ctx.fillStyle = it.color;
    ctx.shadowColor = "rgba(15,23,42,0.18)";
    ctx.shadowBlur = 8;
    ctx.shadowOffsetY = 3;
    roundRect(ctx, x, y, it.w, it.h, 4);
    ctx.fill();
    ctx.shadowColor = "transparent";
    drawText(ctx, it, x, y, "left");
  } else if (it.type === "rect") {
    ctx.fillStyle = it.color;
    ctx.strokeStyle = "rgba(15,23,42,0.32)";
    ctx.lineWidth = 2;
    roundRect(ctx, x, y, it.w, it.h, 8);
    ctx.fill();
    ctx.stroke();
    drawText(ctx, it, x, y, "center");
  } else if (it.type === "ellipse") {
    ctx.fillStyle = it.color;
    ctx.strokeStyle = "rgba(15,23,42,0.32)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(x + it.w / 2, y + it.h / 2, it.w / 2, it.h / 2, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    drawText(ctx, it, x, y, "center");
  } else if (it.type === "diamond") {
    const cx = x + it.w / 2;
    const cy = y + it.h / 2;
    ctx.fillStyle = it.color;
    ctx.strokeStyle = "rgba(15,23,42,0.32)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cx, y);
    ctx.lineTo(x + it.w, cy);
    ctx.lineTo(cx, y + it.h);
    ctx.lineTo(x, cy);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    drawText(ctx, it, x, y, "center");
  }
  ctx.restore();
}

function drawText(ctx, it, x, y, align) {
  if (!it.text) return;
  ctx.save();
  ctx.fillStyle = "#1f2937";
  ctx.font = '16px system-ui, "Hiragino Kaku Gothic ProN", "Noto Sans JP", sans-serif';
  ctx.textBaseline = "top";
  const pad = 12;
  const maxW = it.w - pad * 2;
  const lineH = 22;
  const lines = wrapText(ctx, it.text, maxW);
  const totalH = lines.length * lineH;
  let ty = align === "left" ? y + pad : y + (it.h - totalH) / 2;
  lines.forEach((ln) => {
    if (align === "center") {
      ctx.textAlign = "center";
      ctx.fillText(ln, x + it.w / 2, ty);
    } else {
      ctx.textAlign = "left";
      ctx.fillText(ln, x + pad, ty);
    }
    ty += lineH;
  });
  ctx.restore();
}

// 日本語混在を考慮した文字単位の折り返し
function wrapText(ctx, text, maxW) {
  const out = [];
  text.split("\n").forEach((para) => {
    let line = "";
    for (const ch of para) {
      const test = line + ch;
      if (ctx.measureText(test).width > maxW && line) {
        out.push(line);
        line = ch;
      } else {
        line = test;
      }
    }
    out.push(line);
  });
  return out;
}

// コネクタの折れ点（board.js の elbowD と同じルーティング）
const BUS_GAP = 22;
const ALIGN_SNAP = 16;
function wirePoints(a, b, style) {
  if (style === "straight") {
    const p1 = rectEdge(a, b.x + b.w / 2, b.y + b.h / 2);
    const p2 = rectEdge(b, a.x + a.w / 2, a.y + a.h / 2);
    return [p1, p2];
  }
  const acx = a.x + a.w / 2;
  const bcx = b.x + b.w / 2;
  const acy = a.y + a.h / 2;
  const bcy = b.y + b.h / 2;
  const bottom = a.y + a.h;
  if (b.y > bottom + BUS_GAP + 2) {
    if (Math.abs(acx - bcx) <= ALIGN_SNAP) return [{ x: bcx, y: bottom }, { x: bcx, y: b.y }];
    const busY = bottom + BUS_GAP;
    return [{ x: acx, y: bottom }, { x: acx, y: busY }, { x: bcx, y: busY }, { x: bcx, y: b.y }];
  }
  if (b.y + b.h < a.y - BUS_GAP - 2) {
    if (Math.abs(acx - bcx) <= ALIGN_SNAP) return [{ x: bcx, y: a.y }, { x: bcx, y: b.y + b.h }];
    const busY = a.y - BUS_GAP;
    return [{ x: acx, y: a.y }, { x: acx, y: busY }, { x: bcx, y: busY }, { x: bcx, y: b.y + b.h }];
  }
  if (b.x > a.x + a.w) {
    const x1 = a.x + a.w;
    const x2 = b.x;
    if (Math.abs(acy - bcy) <= ALIGN_SNAP) return [{ x: x1, y: bcy }, { x: x2, y: bcy }];
    const mx = (x1 + x2) / 2;
    return [{ x: x1, y: acy }, { x: mx, y: acy }, { x: mx, y: bcy }, { x: x2, y: bcy }];
  }
  if (b.x + b.w < a.x) {
    const x1 = a.x;
    const x2 = b.x + b.w;
    if (Math.abs(acy - bcy) <= ALIGN_SNAP) return [{ x: x1, y: bcy }, { x: x2, y: bcy }];
    const mx = (x1 + x2) / 2;
    return [{ x: x1, y: acy }, { x: mx, y: acy }, { x: mx, y: bcy }, { x: x2, y: bcy }];
  }
  const p1 = rectEdge(a, bcx, bcy);
  const p2 = rectEdge(b, acx, acy);
  return [p1, p2];
}

// fromPt→toPt の向きに、toPt を頂点とする矢じりを描く
function drawHead(ctx, from, to, ox, oy) {
  const ang = Math.atan2(to.y - from.y, to.x - from.x);
  const len = 10;
  const qx = to.x + ox;
  const qy = to.y + oy;
  ctx.beginPath();
  ctx.moveTo(qx, qy);
  ctx.lineTo(qx - len * Math.cos(ang - Math.PI / 6), qy - len * Math.sin(ang - Math.PI / 6));
  ctx.lineTo(qx - len * Math.cos(ang + Math.PI / 6), qy - len * Math.sin(ang + Math.PI / 6));
  ctx.closePath();
  ctx.fill();
}

function drawWire(ctx, pts, ox, oy, ends) {
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(pts[0].x + ox, pts[0].y + oy);
  for (let i = 1; i < pts.length; i += 1) ctx.lineTo(pts[i].x + ox, pts[i].y + oy);
  ctx.stroke();
  const e = ends || "end";
  if (e === "end" || e === "both") drawHead(ctx, pts[pts.length - 2], pts[pts.length - 1], ox, oy);
  if (e === "both") drawHead(ctx, pts[1], pts[0], ox, oy);
  ctx.restore();
}

function rectEdge(item, tx, ty) {
  const cx = item.x + item.w / 2;
  const cy = item.y + item.h / 2;
  const dx = tx - cx;
  const dy = ty - cy;
  if (dx === 0 && dy === 0) return { x: cx, y: cy };
  const sx = dx !== 0 ? item.w / 2 / Math.abs(dx) : Infinity;
  const sy = dy !== 0 ? item.h / 2 / Math.abs(dy) : Infinity;
  const s = Math.min(sx, sy);
  return { x: cx + dx * s, y: cy + dy * s };
}

function roundRect(ctx, x, y, w, h, r) {
  const rr = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.arcTo(x + w, y, x + w, y + h, rr);
  ctx.arcTo(x + w, y + h, x, y + h, rr);
  ctx.arcTo(x, y + h, x, y, rr);
  ctx.arcTo(x, y, x + w, y, rr);
  ctx.closePath();
}

function triggerDownload(canvas, filename) {
  canvas.toBlob((blob) => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 1000);
  }, "image/png");
}

// ---- JSON 保存 ----
export function exportJson(state, filename = "whiteboard.json") {
  const payload = { items: state.items, connectors: state.connectors };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 1000);
}

// ---- JSON 読み込み ----
export function readJsonFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result);
        resolve(data);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsText(file);
  });
}
