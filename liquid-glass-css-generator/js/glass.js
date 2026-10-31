
export const SHAPE_PRESETS = {
  button: { w: 220, h: 64, radius: 18 },
  pill: { w: 240, h: 64, radius: 999 },
  circle: { w: 140, h: 140, radius: 999 },
  card: { w: 320, h: 200, radius: 28 },
};

export const DEFAULT_PARAMS = {
  shape: "circle",
  w: 140,
  h: 140,
  radius: 999,
  scale: 80,
  blur: 0,
  edge: 30,
  saturate: 1.6,
  tint: "#ff0000",
  tintAlpha: 0.12,
  highlight: 0.6,
  border: 0.4,
  text: "Get Started",
  textColor: "#ffffff",
  fontSize: 18,
  linkUrl: "",
};

const clamp8 = (v) => (v < 0 ? 0 : v > 255 ? 255 : v | 0);
const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);

function roundedRectSDF(px, py, w, h, r) {
  const cx = w / 2;
  const cy = h / 2;
  const rr = Math.min(r, cx, cy);
  const qx = Math.abs(px - cx) - (w / 2 - rr);
  const qy = Math.abs(py - cy) - (h / 2 - rr);
  const ax = Math.max(qx, 0);
  const ay = Math.max(qy, 0);
  const outside = Math.hypot(ax, ay);
  const inside = Math.min(Math.max(qx, qy), 0);
  const dist = outside + inside - rr;

  const sx = px < cx ? -1 : 1;
  const sy = py < cy ? -1 : 1;
  let nx;
  let ny;
  if (qx > 0 && qy > 0) {
    const len = Math.hypot(ax, ay) || 1;
    nx = (sx * ax) / len;
    ny = (sy * ay) / len;
  } else if (qx > qy) {
    nx = sx;
    ny = 0;
  } else {
    nx = 0;
    ny = sy;
  }
  return { dist, nx, ny };
}

export function buildDisplacementMap({ w, h, radius, edge }) {
  const c = document.createElement("canvas");
  c.width = Math.max(1, Math.round(w));
  c.height = Math.max(1, Math.round(h));
  const ctx = c.getContext("2d");
  const img = ctx.createImageData(c.width, c.height);
  const d = img.data;
  const band = Math.max(1, edge);

  for (let y = 0; y < c.height; y++) {
    for (let x = 0; x < c.width; x++) {
      const { dist, nx, ny } = roundedRectSDF(x + 0.5, y + 0.5, c.width, c.height, radius);
      let t = 0;
      if (dist <= 0 && dist > -band) {
        const k = clamp01((dist + band) / band);
        t = k * k * (3 - 2 * k);
      }
      const i = (y * c.width + x) * 4;
      d[i] = clamp8(128 + nx * t * 127);
      d[i + 1] = clamp8(128 + ny * t * 127);
      d[i + 2] = 128;
      d[i + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  return c.toDataURL("image/png");
}

export function buildFilterSvg(filterId, params, mapDataUri) {
  const w = Math.round(params.w);
  const h = Math.round(params.h);
  return `<svg class="lg-filter-svg" width="0" height="0" aria-hidden="true" style="position:absolute;overflow:hidden">
  <filter id="${filterId}" x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB" filterUnits="objectBoundingBox" primitiveUnits="userSpaceOnUse">
    <feImage href="${mapDataUri}" x="0" y="0" width="${w}" height="${h}" preserveAspectRatio="none" result="map"/>
    <feDisplacementMap in="SourceGraphic" in2="map" scale="${params.scale}" xChannelSelector="R" yChannelSelector="G"/>
  </filter>
</svg>`;
}

export function hexToRgb(hex) {
  const m = /^#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(hex || "");
  if (!m) return "255, 255, 255";
  return `${parseInt(m[1], 16)}, ${parseInt(m[2], 16)}, ${parseInt(m[3], 16)}`;
}

export function buildGlassCss(params, filterId) {
  const tintRgb = hexToRgb(params.tint);
  const radius = params.radius >= 999 ? `${Math.round(Math.min(params.w, params.h) / 2)}px` : `${params.radius}px`;
  const hi = clamp01(params.highlight);
  const filterValue = `blur(${params.blur}px) saturate(${params.saturate}) url(#${filterId})`;
  return {
    radius,
    decls: [
      `width: ${Math.round(params.w)}px`,
      `height: ${Math.round(params.h)}px`,
      `border-radius: ${radius}`,
      `-webkit-backdrop-filter: ${filterValue}`,
      `backdrop-filter: ${filterValue}`,
      `background: rgba(${tintRgb}, ${params.tintAlpha})`,
      `border: 1px solid rgba(255, 255, 255, ${clamp01(params.border)})`,
      `box-shadow: inset 0 1px 1px rgba(255, 255, 255, ${hi}), inset 0 -1px 1px rgba(0, 0, 0, ${hi * 0.4}), 0 8px 32px rgba(0, 0, 0, 0.18)`,
      `color: ${params.textColor}`,
      `font-size: ${params.fontSize}px`,
    ],
  };
}
