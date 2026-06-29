// グラデーションのCSS文字列生成と、PNG書き出し用のcanvas描画（純粋ロジック）。

// ストップを位置順にソート（非破壊）
export function sortedStops(stops) {
  return [...stops].sort((a, b) => a.pos - b.pos);
}

// ストップ列を "color pos%, ..." 形式に
function stopsString(stops) {
  return sortedStops(stops)
    .map((s) => `${s.color} ${Math.round(s.pos)}%`)
    .join(", ");
}

// グラデーション関数文字列（background の値部分）
export function gradientValue(state) {
  const s = stopsString(state.stops);
  if (state.type === "radial") {
    return `radial-gradient(${state.radialShape} at center, ${s})`;
  }
  if (state.type === "conic") {
    return `conic-gradient(from ${state.angle}deg at center, ${s})`;
  }
  return `linear-gradient(${state.angle}deg, ${s})`;
}

// 出力CSS（コピー用）
export function buildCss(state) {
  return `background: ${gradientValue(state)};`;
}

// Tailwind の任意の値（arbitrary value）形式。スペースは "_" に置換する。
export function buildTailwind(state) {
  const v = gradientValue(state).replace(/\s+/g, "_");
  return `bg-[${v}]`;
}

// ===== PNG書き出し用：canvasにグラデーションを描画 =====
export function paintGradient(ctx, w, h, state) {
  const stops = sortedStops(state.stops);
  let grad;

  if (state.type === "radial") {
    const cx = w / 2;
    const cy = h / 2;
    // 既定の farthest-corner 相当（中心から最遠コーナーまで）
    const r = Math.sqrt((w / 2) ** 2 + (h / 2) ** 2);
    grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
  } else if (state.type === "conic" && typeof ctx.createConicGradient === "function") {
    // CSS conic は12時起点で時計回り。canvasは3時起点なので -90deg 補正。
    const start = ((state.angle - 90) * Math.PI) / 180;
    grad = ctx.createConicGradient(start, w / 2, h / 2);
  } else {
    // linear（conic 非対応ブラウザもlinearで代替）
    const rad = (state.angle * Math.PI) / 180;
    const dx = Math.sin(rad);
    const dy = -Math.cos(rad);
    const len = Math.abs(w * dx) + Math.abs(h * dy);
    const cx = w / 2;
    const cy = h / 2;
    grad = ctx.createLinearGradient(
      cx - (dx * len) / 2,
      cy - (dy * len) / 2,
      cx + (dx * len) / 2,
      cy + (dy * len) / 2
    );
  }

  for (const s of stops) {
    grad.addColorStop(Math.min(1, Math.max(0, s.pos / 100)), s.color);
  }
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);
}
