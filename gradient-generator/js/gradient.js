
export function sortedStops(stops) {
  return [...stops].sort((a, b) => a.pos - b.pos);
}

function stopsString(stops) {
  return sortedStops(stops)
    .map((s) => `${s.color} ${Math.round(s.pos)}%`)
    .join(", ");
}

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

function escapeHtml(s) {
  return s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
}

export function buildCss(state, { text = "", font = null } = {}) {
  const v = gradientValue(state);
  if (state.target !== "text") return `background: ${v};`;

  const lines = [];
  if (font?.href) lines.push(`<link rel="stylesheet" href="${font.href}" />`, ``);
  lines.push(`<h2 class="gradient-text">${escapeHtml(text)}</h2>`, ``, `<style>`, `.gradient-text {`);
  if (font?.stack) lines.push(`  font-family: ${font.stack};`, `  font-weight: 700;`);
  lines.push(
    `  background-image: ${v};`,
    `  -webkit-background-clip: text;`,
    `  background-clip: text;`,
    `  -webkit-text-fill-color: transparent;`,
    `}`,
    `</style>`
  );
  return lines.join("\n");
}

export function buildTailwind(state, { text = "", font = null } = {}) {
  const v = gradientValue(state).replace(/\s+/g, "_");
  if (state.target !== "text") return `bg-[${v}]`;

  const cls = [];
  if (font?.tailwind) cls.push(font.tailwind, "font-bold");
  cls.push(`bg-[${v}]`, "bg-clip-text", "text-transparent");

  const lines = [];
  if (font?.href) lines.push(`<link rel="stylesheet" href="${font.href}" />`, ``);
  lines.push(`<h2 class="${cls.join(" ")}">${escapeHtml(text)}</h2>`);
  return lines.join("\n");
}

export function createGradient(ctx, w, h, state) {
  const stops = sortedStops(state.stops);
  let grad;

  if (state.type === "radial") {
    const cx = w / 2;
    const cy = h / 2;
    const r = Math.sqrt((w / 2) ** 2 + (h / 2) ** 2);
    grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
  } else if (state.type === "conic" && typeof ctx.createConicGradient === "function") {
    const start = ((state.angle - 90) * Math.PI) / 180;
    grad = ctx.createConicGradient(start, w / 2, h / 2);
  } else {
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
  return grad;
}

export function paintGradient(ctx, w, h, state) {
  ctx.fillStyle = createGradient(ctx, w, h, state);
  ctx.fillRect(0, 0, w, h);
}

export function paintGradientText(ctx, w, h, state, text, font) {
  ctx.font = font;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = createGradient(ctx, w, h, state);
  ctx.fillText(text, w / 2, h / 2);
}

export function measureTextBox(ctx, text, font, padding) {
  ctx.font = font;
  const m = ctx.measureText(text);
  const ascent = m.actualBoundingBoxAscent || 0;
  const descent = m.actualBoundingBoxDescent || 0;
  const rawW = m.actualBoundingBoxLeft + m.actualBoundingBoxRight || m.width;
  return {
    width: Math.max(1, Math.ceil(rawW)) + padding * 2,
    height: Math.max(1, Math.ceil(ascent + descent)) + padding * 2,
  };
}
