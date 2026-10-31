
const VIEW_H = 120;
const MARGIN = 14;

const panel = document.querySelector(".panel");
const patternsGrid = document.querySelector(".patterns__grid");
const btnEl = document.querySelector(".rim-btn");
const svgEl = document.querySelector(".rim-btn__svg");
const labelEl = document.querySelector(".rim-btn__label");
const outHtmlArea = document.getElementById("outHtml");
const outCssArea = document.getElementById("outCss");
const spinBtn = document.getElementById("spin");

const LANG = document.documentElement.lang === "en" ? "en" : "ja";
const T = {
  ja: {
    copyHtml: "HTMLをコピー",
    copyCss: "CSSをコピー",
    copied: "コピーしました",
    spinOn: "自動回転：ON",
    spinOff: "自動回転：OFF",
    cmt: {
      pulseBlur: "縁の発光を脈動させる",
      tri: "3灯を120°差で回転",
      breath: "縁の発光をゆっくり明滅(ブリージング)させる",
      flicker: "ネオン管のようにランダムに明滅させる",
      gradient: "グラデーションを回転させる",
      chase: "光の帯を縁に沿って走らせる",
      distant: "縁の光源角度(azimuth)を回してリムを回転発光させる",
      point: "光の点をリムに沿って周回させる",
      arcshine: "円弧状のツヤ光を縁の一部に乗せて周回させる",
      beamglow: "焦点を持つ光だまりを縁の一点に集めて周回させる",
      glossshine: "ガラスのような対角の艶反射を縁に走らせる",
      dual: "対向2灯を180°差で回転",
      speedNote: "1フレームあたりの角度（大きいほど速い）",
    },
  },
  en: {
    copyHtml: "Copy HTML",
    copyCss: "Copy CSS",
    copied: "Copied!",
    spinOn: "Auto-animate: ON",
    spinOff: "Auto-animate: OFF",
    cmt: {
      pulseBlur: "Pulse the rim glow",
      tri: "Rotate three lights 120 degrees apart",
      breath: "Slowly breathe the rim glow",
      flicker: "Flicker randomly like a neon tube",
      gradient: "Rotate the gradient",
      chase: "Run a band of light along the rim",
      distant: "Rotate the light azimuth to sweep the glowing rim",
      point: "Orbit the light point along the rim",
      arcshine: "Orbit a glossy arc of light along part of the rim",
      beamglow: "Orbit a focused pool of light along the rim",
      glossshine: "Sweep a glass-like diagonal sheen across the rim",
      dual: "Rotate two opposing lights 180 degrees apart",
      speedNote: "degrees per frame (higher is faster)",
    },
  },
}[LANG];

let state = {};
document.querySelectorAll("[data-key]").forEach((el) => {
  state[el.dataset.key] = el.type === "range" ? Number(el.value) : el.value;
});
state.pattern =
  document.querySelector("[data-pattern-btn].is-active")?.dataset.patternBtn ?? "distant";

const escapeHtml = (s) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const specAttrs = (s) =>
  `surfaceScale="${s.surfaceScale}" specularConstant="${s.constant}" specularExponent="${s.exponent}"`;

function buildGlowFilter(s, offsetY) {
  const gi = s.glowIntensity;
  const bl = (s.blur * 3 + 3).toFixed(2);
  return `<feFlood flood-color="${s.glowColor}" result="tint" />
        <feGaussianBlur in="SourceAlpha" stdDeviation="${bl}" result="bl0" />
        <feOffset in="bl0" dx="0" dy="${offsetY}" result="bl" />
        <feComposite in="tint" in2="bl" operator="in" result="glow" />
        <feComponentTransfer in="glow" result="g"><feFuncA class="rim-btn__breath" type="linear" slope="${(gi * 5).toFixed(2)}" /></feComponentTransfer>
        <feFlood flood-color="${s.glowColor}" result="coreFlood" />
        <feComposite in="coreFlood" in2="SourceAlpha" operator="in" result="core" />
        <feMerge><feMergeNode in="g" /><feMergeNode in="core" /></feMerge>`;
}

function buildFilterMarkup(s, w) {
  switch (s.pattern) {
    case "distant":
      return `<feGaussianBlur in="SourceAlpha" stdDeviation="${s.blur}" result="height" />
        <feSpecularLighting in="height" ${specAttrs(s)} lighting-color="${s.lightColor}" result="spec">
          <feDistantLight class="rim-btn__light" azimuth="${Math.round(s.azimuth)}" elevation="${s.elevation}" />
        </feSpecularLighting>
        <feComposite in="spec" in2="SourceAlpha" operator="in" />`;

    case "neon": {
      const b = s.blur;
      const gi = s.glowIntensity;
      const slope = (m) => (gi * m).toFixed(2);
      return `<feFlood flood-color="${s.glowColor}" result="tint" />
        <feGaussianBlur class="rim-btn__pulse" in="SourceAlpha" stdDeviation="${b}" result="bl1" />
        <feGaussianBlur in="SourceAlpha" stdDeviation="${(b * 2 + 2).toFixed(2)}" result="bl2" />
        <feGaussianBlur in="SourceAlpha" stdDeviation="${(b * 4 + 4).toFixed(2)}" result="bl3" />
        <feComposite in="tint" in2="bl1" operator="in" result="c1" />
        <feComposite in="tint" in2="bl2" operator="in" result="c2" />
        <feComposite in="tint" in2="bl3" operator="in" result="c3" />
        <feComponentTransfer in="c1" result="g1"><feFuncA type="linear" slope="${slope(2)}" /></feComponentTransfer>
        <feComponentTransfer in="c2" result="g2"><feFuncA type="linear" slope="${slope(4)}" /></feComponentTransfer>
        <feComponentTransfer in="c3" result="g3"><feFuncA type="linear" slope="${slope(6)}" /></feComponentTransfer>
        <feFlood flood-color="${s.glowColor}" result="coreFlood" />
        <feComposite in="coreFlood" in2="SourceAlpha" operator="in" result="core" />
        <feMerge>
          <feMergeNode in="g3" />
          <feMergeNode in="g2" />
          <feMergeNode in="g1" />
          <feMergeNode in="core" />
        </feMerge>`;
    }

    case "dual":
      return `<feGaussianBlur in="SourceAlpha" stdDeviation="${s.blur}" result="height" />
        <feSpecularLighting in="height" ${specAttrs(s)} lighting-color="${s.leftColor}" result="spec1">
          <feDistantLight class="rim-btn__light rim-btn__light--a" azimuth="${Math.round(s.azimuth)}" elevation="${s.elevation}" />
        </feSpecularLighting>
        <feSpecularLighting in="height" ${specAttrs(s)} lighting-color="${s.rightColor}" result="spec2">
          <feDistantLight class="rim-btn__light rim-btn__light--b" azimuth="${Math.round(s.azimuth + 180) % 360}" elevation="${s.elevation}" />
        </feSpecularLighting>
        <feComposite in="spec1" in2="SourceAlpha" operator="in" result="r1" />
        <feComposite in="spec2" in2="SourceAlpha" operator="in" result="r2" />
        <feMerge>
          <feMergeNode in="r1" />
          <feMergeNode in="r2" />
        </feMerge>`;

    case "tri": {
      const d = Math.round(s.azimuth);
      return `<feGaussianBlur in="SourceAlpha" stdDeviation="${s.blur}" result="height" />
        <feSpecularLighting in="height" ${specAttrs(s)} lighting-color="${s.leftColor}" result="t1">
          <feDistantLight class="rim-btn__light rim-btn__light--a" azimuth="${d}" elevation="${s.elevation}" />
        </feSpecularLighting>
        <feSpecularLighting in="height" ${specAttrs(s)} lighting-color="${s.rightColor}" result="t2">
          <feDistantLight class="rim-btn__light rim-btn__light--b" azimuth="${(d + 120) % 360}" elevation="${s.elevation}" />
        </feSpecularLighting>
        <feSpecularLighting in="height" ${specAttrs(s)} lighting-color="${s.thirdColor}" result="t3">
          <feDistantLight class="rim-btn__light rim-btn__light--c" azimuth="${(d + 240) % 360}" elevation="${s.elevation}" />
        </feSpecularLighting>
        <feComposite in="t1" in2="SourceAlpha" operator="in" result="r1" />
        <feComposite in="t2" in2="SourceAlpha" operator="in" result="r2" />
        <feComposite in="t3" in2="SourceAlpha" operator="in" result="r3" />
        <feMerge>
          <feMergeNode in="r1" />
          <feMergeNode in="r2" />
          <feMergeNode in="r3" />
        </feMerge>`;
    }

    case "pulse":
    case "flicker":
      return buildGlowFilter(s, 0);

    case "under":
      return buildGlowFilter(s, (s.thickness * 0.6 + 8).toFixed(1));

    default:
      return "";
  }
}

function buildPointRim(s) {
  const w = s.width;
  const rectW = w - MARGIN * 2;
  const cx = (s.pointXPct / 100 * w).toFixed(1);
  const cy = (s.pointYPct / 100 * VIEW_H).toFixed(1);
  const r = (s.pointZ * 2 + s.thickness).toFixed(1);
  return `
      <defs>
        <radialGradient id="rimPtGrad" class="rim-btn__ptgrad" gradientUnits="userSpaceOnUse" cx="${cx}" cy="${cy}" r="${r}">
          <stop offset="0" stop-color="${s.lightColor}" stop-opacity="1" />
          <stop offset="0.5" stop-color="${s.lightColor}" stop-opacity="0.35" />
          <stop offset="1" stop-color="${s.lightColor}" stop-opacity="0" />
        </radialGradient>
        <filter id="rimGlow" x="-50%" y="-50%" width="200%" height="200%" color-interpolation-filters="linearRGB">
          <feGaussianBlur in="SourceGraphic" stdDeviation="${s.blur}" result="glow" />
          <feMerge>
            <feMergeNode in="glow" />
            <feMergeNode in="glow" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <rect x="${MARGIN}" y="14" width="${rectW}" height="92" rx="${s.radius}" fill="${s.fillColor}" fill-opacity="${s.fillOpacity}" />
      <g filter="url(#rimGlow)">
        <rect x="${MARGIN}" y="14" width="${rectW}" height="92" rx="${s.radius}" fill="none" stroke="url(#rimPtGrad)" stroke-width="${s.thickness}" />
      </g>`;
}

function buildSpecularRim(s) {
  const w = s.width;
  const rectW = w - MARGIN * 2;
  const glowPatterns = ["neon", "pulse", "flicker", "under"];
  const region = glowPatterns.includes(s.pattern)
    ? `x="-120%" y="-120%" width="340%" height="340%"`
    : `x="-50%" y="-50%" width="200%" height="200%"`;
  return `
      <defs>
        <filter id="rimGlow" ${region} color-interpolation-filters="linearRGB">
        ${buildFilterMarkup(s, w)}
        </filter>
      </defs>
      <rect x="${MARGIN}" y="14" width="${rectW}" height="92" rx="${s.radius}" fill="${s.fillColor}" fill-opacity="${s.fillOpacity}" />
      <g filter="url(#rimGlow)">
        <rect x="${MARGIN}" y="14" width="${rectW}" height="92" rx="${s.radius}" fill="none" stroke="#ffffff" stroke-width="${s.thickness}" />
      </g>`;
}

function buildArcShineRim(s) {
  const w = s.width;
  const rectW = w - MARGIN * 2;
  const perim = 2 * (rectW + 92);
  const th = s.orbitAngle * Math.PI / 180;
  const cx = (w / 2 + (rectW / 2) * Math.cos(th)).toFixed(1);
  const cy = (VIEW_H / 2 + 46 * Math.sin(th)).toFixed(1);
  const r = (s.thickness + (s.arcLen / 100) * perim * 0.5).toFixed(1);
  return `
      <defs>
        <radialGradient id="rimArcGrad" class="rim-btn__arc" gradientUnits="userSpaceOnUse" cx="${cx}" cy="${cy}" r="${r}">
          <stop offset="0" stop-color="${s.lightColor}" stop-opacity="1" />
          <stop offset="0.35" stop-color="${s.lightColor}" stop-opacity="0.55" />
          <stop offset="1" stop-color="${s.lightColor}" stop-opacity="0" />
        </radialGradient>
        <filter id="rimGlow" x="-60%" y="-60%" width="220%" height="220%" color-interpolation-filters="linearRGB">
          <feGaussianBlur in="SourceGraphic" stdDeviation="${Math.max(0.8, s.blur).toFixed(2)}" result="glow" />
          <feMerge><feMergeNode in="glow" /><feMergeNode in="glow" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <rect x="${MARGIN}" y="14" width="${rectW}" height="92" rx="${s.radius}" fill="${s.fillColor}" fill-opacity="${s.fillOpacity}" />
      <g filter="url(#rimGlow)">
        <rect x="${MARGIN}" y="14" width="${rectW}" height="92" rx="${s.radius}" fill="none" stroke="${s.lightColor}" stroke-width="${s.thickness}" stroke-opacity="0.08" />
        <rect x="${MARGIN}" y="14" width="${rectW}" height="92" rx="${s.radius}" fill="none" stroke="url(#rimArcGrad)" stroke-width="${s.thickness}" />
      </g>`;
}

function buildBeamGlowRim(s) {
  const w = s.width;
  const rectW = w - MARGIN * 2;
  const th = s.orbitAngle * Math.PI / 180;
  const cx = (w / 2 + (rectW / 2) * Math.cos(th)).toFixed(1);
  const cy = (VIEW_H / 2 + 46 * Math.sin(th)).toFixed(1);
  const r = (s.pointZ * 2 + s.thickness).toFixed(1);
  return `
      <defs>
        <radialGradient id="rimBeamGrad" class="rim-btn__beam" gradientUnits="userSpaceOnUse" cx="${cx}" cy="${cy}" r="${r}">
          <stop offset="0" stop-color="${s.lightColor}" stop-opacity="1" />
          <stop offset="0.5" stop-color="${s.lightColor}" stop-opacity="0.4" />
          <stop offset="1" stop-color="${s.lightColor}" stop-opacity="0" />
        </radialGradient>
        <filter id="rimGlow" x="-50%" y="-50%" width="200%" height="200%" color-interpolation-filters="linearRGB">
          <feGaussianBlur in="SourceGraphic" stdDeviation="${s.blur}" result="glow" />
          <feMerge><feMergeNode in="glow" /><feMergeNode in="glow" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <rect x="${MARGIN}" y="14" width="${rectW}" height="92" rx="${s.radius}" fill="${s.fillColor}" fill-opacity="${s.fillOpacity}" />
      <g filter="url(#rimGlow)">
        <rect x="${MARGIN}" y="14" width="${rectW}" height="92" rx="${s.radius}" fill="none" stroke="url(#rimBeamGrad)" stroke-width="${s.thickness}" />
      </g>`;
}

function buildGlossShineRim(s) {
  const w = s.width;
  const rectW = w - MARGIN * 2;
  const hw = Math.max(0.02, Math.min(0.18, s.glossWidth / 100));
  const c = s.lightColor;
  const stop = (o, op) => `<stop offset="${o.toFixed(3)}" stop-color="${c}" stop-opacity="${op}" />`;
  const p1 = 0.3, p2 = 0.72, dim = 0.12;
  const stops = [
    stop(0, dim), stop(p1 - hw, dim), stop(p1, 1), stop(p1 + hw, dim),
    stop(p2 - hw, dim), stop(p2, 1), stop(p2 + hw, dim), stop(1, dim),
  ].join("");
  return `
      <defs>
        <linearGradient id="rimGlossGrad" class="rim-btn__gloss" x1="0" y1="0" x2="1" y2="0" gradientTransform="rotate(${Math.round(s.glossAngle)} 0.5 0.5)">
          ${stops}
        </linearGradient>
        <filter id="rimGlow" x="-50%" y="-50%" width="200%" height="200%" color-interpolation-filters="linearRGB">
          <feGaussianBlur in="SourceGraphic" stdDeviation="${s.blur}" result="glow" />
          <feMerge><feMergeNode in="glow" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <rect x="${MARGIN}" y="14" width="${rectW}" height="92" rx="${s.radius}" fill="${s.fillColor}" fill-opacity="${s.fillOpacity}" />
      <g filter="url(#rimGlow)">
        <rect x="${MARGIN}" y="14" width="${rectW}" height="92" rx="${s.radius}" fill="none" stroke="url(#rimGlossGrad)" stroke-width="${s.thickness}" />
      </g>`;
}

function buildGradientRim(s) {
  const w = s.width;
  const rectW = w - MARGIN * 2;
  return `
      <defs>
        <linearGradient id="rimGrad" class="rim-btn__gradient" x1="0" y1="0" x2="1" y2="0" gradientTransform="rotate(0 0.5 0.5)">
          <stop offset="0" stop-color="${s.leftColor}" />
          <stop offset="0.5" stop-color="${s.rightColor}" />
          <stop offset="1" stop-color="${s.leftColor}" />
        </linearGradient>
        <filter id="rimGlow" x="-50%" y="-50%" width="200%" height="200%" color-interpolation-filters="linearRGB">
          <feGaussianBlur in="SourceGraphic" stdDeviation="${s.blur}" result="glow" />
          <feMerge><feMergeNode in="glow" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <rect x="${MARGIN}" y="14" width="${rectW}" height="92" rx="${s.radius}" fill="${s.fillColor}" fill-opacity="${s.fillOpacity}" />
      <g filter="url(#rimGlow)">
        <rect x="${MARGIN}" y="14" width="${rectW}" height="92" rx="${s.radius}" fill="none" stroke="url(#rimGrad)" stroke-width="${s.thickness}" />
      </g>`;
}

function buildDoubleRim(s) {
  const w = s.width;
  const rectW = w - MARGIN * 2;
  const inset = Math.min(20, s.thickness + 4);
  const innerW = Math.max(2, rectW - inset * 2);
  const innerH = Math.max(2, 92 - inset * 2);
  const sw = Math.max(1, s.thickness * 0.55).toFixed(1);
  return `
      <defs>
        <filter id="rimGlow" x="-60%" y="-60%" width="220%" height="220%" color-interpolation-filters="linearRGB">
          <feGaussianBlur class="rim-btn__pulse" in="SourceGraphic" stdDeviation="${s.blur}" result="glow" />
          <feMerge><feMergeNode in="glow" /><feMergeNode in="glow" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <rect x="${MARGIN}" y="14" width="${rectW}" height="92" rx="${s.radius}" fill="${s.fillColor}" fill-opacity="${s.fillOpacity}" />
      <g filter="url(#rimGlow)">
        <rect x="${MARGIN}" y="14" width="${rectW}" height="92" rx="${s.radius}" fill="none" stroke="${s.lightColor}" stroke-width="${sw}" />
        <rect x="${MARGIN + inset}" y="${14 + inset}" width="${innerW}" height="${innerH}" rx="${Math.max(0, s.radius - inset)}" fill="none" stroke="${s.glowColor}" stroke-width="${sw}" />
      </g>`;
}

function buildCornerRim(s) {
  const w = s.width;
  const rectW = w - MARGIN * 2;
  const x0 = MARGIN, y0 = 14, x1 = MARGIN + rectW, y1 = 14 + 92;
  const gi = s.glowIntensity;
  const inner = Math.min(1, gi).toFixed(2);
  const mid = Math.min(1, gi * 0.55).toFixed(2);
  const rimOp = (gi * 0.32).toFixed(2);
  const r = (s.thickness * 2 + 14 + gi * 20).toFixed(1);
  const corner = (cx, cy) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#cornerGrad)" />`;
  return `
      <defs>
        <radialGradient id="cornerGrad">
          <stop offset="0" stop-color="${s.lightColor}" stop-opacity="${inner}" />
          <stop offset="0.55" stop-color="${s.lightColor}" stop-opacity="${mid}" />
          <stop offset="1" stop-color="${s.lightColor}" stop-opacity="0" />
        </radialGradient>
        <clipPath id="rimClip"><rect x="${x0}" y="${y0}" width="${rectW}" height="92" rx="${s.radius}" /></clipPath>
        <filter id="rimGlow" x="-60%" y="-60%" width="220%" height="220%" color-interpolation-filters="linearRGB">
          <feGaussianBlur class="rim-btn__pulse" in="SourceGraphic" stdDeviation="${s.blur}" result="glow" />
          <feMerge><feMergeNode in="glow" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <rect x="${x0}" y="${y0}" width="${rectW}" height="92" rx="${s.radius}" fill="${s.fillColor}" fill-opacity="${s.fillOpacity}" />
      <g filter="url(#rimGlow)">
        <rect x="${x0}" y="${y0}" width="${rectW}" height="92" rx="${s.radius}" fill="none" stroke="${s.lightColor}" stroke-width="${s.thickness}" stroke-opacity="${rimOp}" />
        <g clip-path="url(#rimClip)">${corner(x0, y0)}${corner(x1, y0)}${corner(x0, y1)}${corner(x1, y1)}</g>
      </g>`;
}

function buildChaseRim(s) {
  const w = s.width;
  const rectW = w - MARGIN * 2;
  const perim = 2 * (rectW + 92);
  const seg = Math.max(28, perim * 0.16);
  const gap = perim - seg;
  return `
      <defs>
        <filter id="rimGlow" x="-50%" y="-50%" width="200%" height="200%" color-interpolation-filters="linearRGB">
          <feGaussianBlur in="SourceGraphic" stdDeviation="${Math.max(1, s.blur)}" result="glow" />
          <feMerge><feMergeNode in="glow" /><feMergeNode in="glow" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <rect x="${MARGIN}" y="14" width="${rectW}" height="92" rx="${s.radius}" fill="${s.fillColor}" fill-opacity="${s.fillOpacity}" />
      <g filter="url(#rimGlow)">
        <rect x="${MARGIN}" y="14" width="${rectW}" height="92" rx="${s.radius}" fill="none" stroke="${s.lightColor}" stroke-width="${s.thickness}" stroke-opacity="0.16" />
        <rect class="rim-btn__chase" x="${MARGIN}" y="14" width="${rectW}" height="92" rx="${s.radius}" fill="none" stroke="${s.lightColor}" stroke-width="${s.thickness}" stroke-linecap="round" stroke-dasharray="${seg.toFixed(1)} ${gap.toFixed(1)}" stroke-dashoffset="0" />
      </g>`;
}

function buildSvgInner(s) {
  switch (s.pattern) {
    case "point":
      return buildPointRim(s);
    case "arcshine":
      return buildArcShineRim(s);
    case "beamglow":
      return buildBeamGlowRim(s);
    case "glossshine":
      return buildGlossShineRim(s);
    case "gradient":
      return buildGradientRim(s);
    case "double":
      return buildDoubleRim(s);
    case "corner":
      return buildCornerRim(s);
    case "chase":
      return buildChaseRim(s);
    default:
      return buildSpecularRim(s);
  }
}

function applyLive() {
  const w = state.width;
  btnEl.style.width = `${w}px`;
  svgEl.setAttribute("viewBox", `0 0 ${w} ${VIEW_H}`);
  svgEl.setAttribute("width", String(w));
  svgEl.setAttribute("height", String(VIEW_H));

  const doc = new DOMParser().parseFromString(
    `<svg xmlns="http://www.w3.org/2000/svg">${buildSvgInner(state)}</svg>`,
    "image/svg+xml"
  );
  if (doc.querySelector("parsererror")) {
    console.error("SVGの解析に失敗しました");
    return;
  }
  while (svgEl.firstChild) svgEl.removeChild(svgEl.firstChild);
  [...doc.documentElement.childNodes].forEach((n) =>
    svgEl.appendChild(document.importNode(n, true))
  );

  labelEl.textContent = state.label;
  if (spinning) cacheTargets();
}

function syncControlVisibility(pattern) {
  document.querySelectorAll(".field[data-pattern]").forEach((field) => {
    const patterns = field.dataset.pattern.split(/\s+/);
    field.hidden = !patterns.includes(pattern);
  });
}

function updateReadout(key) {
  const out = document.querySelector(`[data-out="${key}"]`);
  if (!out) return;
  const el = document.querySelector(`[data-key="${key}"]`);
  const unit = el?.dataset.unit ?? "";
  const v = el?.dataset.round ? Math.round(Number(state[key])) : state[key];
  out.textContent = `${v}${unit}`;
}

function syncSlider(key) {
  const el = document.querySelector(`[data-key="${key}"]`);
  if (el) el.value = state[key];
  updateReadout(key);
}

function buildSpinScript(s) {
  const w = s.width;
  if (s.pattern === "neon" || s.pattern === "double" || s.pattern === "corner") {
    return `\n<script>
  // ${T.cmt.pulseBlur}
  document.querySelectorAll(".rim-btn .rim-btn__pulse").forEach((blur) => {
    const base = ${s.blur}, amp = ${Math.max(1, s.blur * 0.6).toFixed(1)};
    let t = 0;
    const speed = ${(s.speed * 0.04).toFixed(4)};
    (function tick() {
      t += speed;
      blur.setAttribute("stdDeviation", (base + amp * (0.5 + 0.5 * Math.sin(t))).toFixed(2));
      requestAnimationFrame(tick);
    })();
  });
<\/script>`;
  }
  if (s.pattern === "point") {
    return `\n<script>
  // ${T.cmt.point}
  document.querySelectorAll(".rim-btn .rim-btn__ptgrad").forEach((grad) => {
    const cx = ${w / 2}, cy = ${VIEW_H / 2}, rx = ${(w * 0.4).toFixed(1)}, ry = 40;
    let t = ${pointStartT(s).toFixed(4)};
    const speed = ${(s.speed * Math.PI / 180).toFixed(4)};
    (function tick() {
      t += speed;
      grad.setAttribute("cx", (cx + rx * Math.cos(t)).toFixed(1));
      grad.setAttribute("cy", (cy + ry * Math.sin(t)).toFixed(1));
      requestAnimationFrame(tick);
    })();
  });
<\/script>`;
  }
  if (s.pattern === "arcshine") {
    return `\n<script>
  // ${T.cmt.arcshine}
  document.querySelectorAll(".rim-btn .rim-btn__arc").forEach((grad) => {
    const cx = ${w / 2}, cy = ${VIEW_H / 2}, rx = ${((w - MARGIN * 2) / 2).toFixed(1)}, ry = 46;
    let deg = ${Math.round(s.orbitAngle)};
    const speed = ${s.speed};
    (function tick() {
      deg = (deg + speed) % 360;
      const t = deg * Math.PI / 180;
      grad.setAttribute("cx", (cx + rx * Math.cos(t)).toFixed(1));
      grad.setAttribute("cy", (cy + ry * Math.sin(t)).toFixed(1));
      requestAnimationFrame(tick);
    })();
  });
<\/script>`;
  }
  if (s.pattern === "beamglow") {
    return `\n<script>
  // ${T.cmt.beamglow}
  document.querySelectorAll(".rim-btn .rim-btn__beam").forEach((grad) => {
    const cx = ${w / 2}, cy = ${VIEW_H / 2}, rx = ${((w - MARGIN * 2) / 2).toFixed(1)}, ry = 46;
    let deg = ${Math.round(s.orbitAngle)};
    const speed = ${s.speed};
    (function tick() {
      deg = (deg + speed) % 360;
      const t = deg * Math.PI / 180;
      grad.setAttribute("cx", (cx + rx * Math.cos(t)).toFixed(1));
      grad.setAttribute("cy", (cy + ry * Math.sin(t)).toFixed(1));
      requestAnimationFrame(tick);
    })();
  });
<\/script>`;
  }
  if (s.pattern === "glossshine") {
    return `\n<script>
  // ${T.cmt.glossshine}
  document.querySelectorAll(".rim-btn .rim-btn__gloss").forEach((g) => {
    let deg = ${Math.round(s.glossAngle)};
    const speed = ${s.speed};
    (function tick() {
      deg = (deg + speed) % 360;
      g.setAttribute("gradientTransform", "rotate(" + deg + " 0.5 0.5)");
      requestAnimationFrame(tick);
    })();
  });
<\/script>`;
  }
  if (s.pattern === "dual") {
    return `\n<script>
  // ${T.cmt.dual}
  document.querySelectorAll(".rim-btn").forEach((btn) => {
    const a = btn.querySelector(".rim-btn__light--a");
    const b = btn.querySelector(".rim-btn__light--b");
    let deg = ${Math.round(s.azimuth)};
    const speed = ${s.speed};
    (function tick() {
      deg = (deg + speed) % 360;
      if (a) a.setAttribute("azimuth", deg);
      if (b) b.setAttribute("azimuth", (deg + 180) % 360);
      requestAnimationFrame(tick);
    })();
  });
<\/script>`;
  }
  if (s.pattern === "tri") {
    return `\n<script>
  // ${T.cmt.tri}
  document.querySelectorAll(".rim-btn").forEach((btn) => {
    const a = btn.querySelector(".rim-btn__light--a");
    const b = btn.querySelector(".rim-btn__light--b");
    const c = btn.querySelector(".rim-btn__light--c");
    let deg = ${Math.round(s.azimuth)};
    const speed = ${s.speed};
    (function tick() {
      deg = (deg + speed) % 360;
      if (a) a.setAttribute("azimuth", deg);
      if (b) b.setAttribute("azimuth", (deg + 120) % 360);
      if (c) c.setAttribute("azimuth", (deg + 240) % 360);
      requestAnimationFrame(tick);
    })();
  });
<\/script>`;
  }
  if (s.pattern === "pulse" || s.pattern === "under") {
    return `\n<script>
  // ${T.cmt.breath}
  document.querySelectorAll(".rim-btn .rim-btn__breath").forEach((fn) => {
    const peak = ${(s.glowIntensity * 5).toFixed(2)};
    let t = 0;
    const speed = ${(s.speed * 0.05).toFixed(4)};
    (function tick() {
      t += speed;
      fn.setAttribute("slope", (peak * (0.3 + 0.7 * (0.5 + 0.5 * Math.sin(t)))).toFixed(2));
      requestAnimationFrame(tick);
    })();
  });
<\/script>`;
  }
  if (s.pattern === "flicker") {
    return `\n<script>
  // ${T.cmt.flicker}
  document.querySelectorAll(".rim-btn .rim-btn__breath").forEach((fn) => {
    const peak = ${(s.glowIntensity * 5).toFixed(2)};
    (function tick() {
      fn.setAttribute("slope", (peak * (0.15 + 0.85 * Math.random())).toFixed(2));
      setTimeout(() => requestAnimationFrame(tick), 40 + Math.random() * 120);
    })();
  });
<\/script>`;
  }
  if (s.pattern === "gradient") {
    return `\n<script>
  // ${T.cmt.gradient}
  document.querySelectorAll(".rim-btn .rim-btn__gradient").forEach((g) => {
    let deg = 0;
    const speed = ${s.speed};
    (function tick() {
      deg = (deg + speed) % 360;
      g.setAttribute("gradientTransform", "rotate(" + deg + " 0.5 0.5)");
      requestAnimationFrame(tick);
    })();
  });
<\/script>`;
  }
  if (s.pattern === "chase") {
    return `\n<script>
  // ${T.cmt.chase}
  document.querySelectorAll(".rim-btn .rim-btn__chase").forEach((seg) => {
    let pos = 0;
    const speed = ${(s.speed * 4).toFixed(1)};
    (function tick() {
      pos += speed;
      seg.setAttribute("stroke-dashoffset", String(-Math.round(pos)));
      requestAnimationFrame(tick);
    })();
  });
<\/script>`;
  }
  return `\n<script>
  // ${T.cmt.distant}
  document.querySelectorAll(".rim-btn .rim-btn__light").forEach((light) => {
    let deg = ${Math.round(s.azimuth)};
    const speed = ${s.speed}; // ${T.cmt.speedNote}
    (function tick() {
      deg = (deg + speed) % 360;
      light.setAttribute("azimuth", deg);
      requestAnimationFrame(tick);
    })();
  });
<\/script>`;
}

function buildCss(w) {
  return `.rim-btn {
  position: relative;
  width: ${w}px;
  height: ${VIEW_H}px;
  padding: 0;
  border: 0;
  background: none;
  cursor: pointer;
}

.rim-btn .rim-btn__svg {
  position: absolute;
  top: 0;
  left: 0;
  display: block;
  overflow: visible;
}

.rim-btn__label {
  position: absolute;
  inset: 0;
  display: grid;
  place-content: center;
  font-size: 24px;
  font-weight: 700;
  letter-spacing: 0.28em;
  text-indent: 0.28em;
  color: #cfd4de;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.6);
  pointer-events: none;
}`;
}

function updateOutput() {
  const w = state.width;
  const script = spinning ? buildSpinScript(state) : "";
  outHtmlArea.value = `<button class="rim-btn" type="button">
  <svg class="rim-btn__svg" viewBox="0 0 ${w} ${VIEW_H}" width="${w}" height="${VIEW_H}" aria-hidden="true">${buildSvgInner(state)}
  </svg>
  <span class="rim-btn__label">${escapeHtml(state.label)}</span>
</button>${script}`;
  outCssArea.value = buildCss(w);
}

let spinning = false;
let rafId = 0;
let spinT = 0;
let targets = {};

function pointStartT(s) {
  const w = s.width;
  const cx = w / 2, cy = VIEW_H / 2, rx = w * 0.4, ry = 40;
  const x = s.pointXPct / 100 * w, y = s.pointYPct / 100 * VIEW_H;
  return Math.atan2((y - cy) / ry, (x - cx) / rx);
}

function cacheTargets() {
  targets = {
    light: svgEl.querySelector(".rim-btn__light"),
    a: svgEl.querySelector(".rim-btn__light--a"),
    b: svgEl.querySelector(".rim-btn__light--b"),
    c: svgEl.querySelector(".rim-btn__light--c"),
    pulse: svgEl.querySelector(".rim-btn__pulse"),
    grad: svgEl.querySelector(".rim-btn__ptgrad"),
    breath: svgEl.querySelector(".rim-btn__breath"),
    gradient: svgEl.querySelector(".rim-btn__gradient"),
    chase: svgEl.querySelector(".rim-btn__chase"),
    arc: svgEl.querySelector(".rim-btn__arc"),
    beam: svgEl.querySelector(".rim-btn__beam"),
    gloss: svgEl.querySelector(".rim-btn__gloss"),
  };
}

function tick() {
  const sp = state.speed;
  switch (state.pattern) {
    case "distant": {
      state = { ...state, azimuth: (state.azimuth + sp) % 360 };
      targets.light?.setAttribute("azimuth", String(Math.round(state.azimuth)));
      syncSlider("azimuth");
      break;
    }
    case "dual": {
      state = { ...state, azimuth: (state.azimuth + sp) % 360 };
      const deg = Math.round(state.azimuth);
      targets.a?.setAttribute("azimuth", String(deg));
      targets.b?.setAttribute("azimuth", String((deg + 180) % 360));
      syncSlider("azimuth");
      break;
    }
    case "tri": {
      state = { ...state, azimuth: (state.azimuth + sp) % 360 };
      const deg = Math.round(state.azimuth);
      targets.a?.setAttribute("azimuth", String(deg));
      targets.b?.setAttribute("azimuth", String((deg + 120) % 360));
      targets.c?.setAttribute("azimuth", String((deg + 240) % 360));
      syncSlider("azimuth");
      break;
    }
    case "point": {
      spinT += sp * Math.PI / 180;
      const w = state.width;
      const x = w / 2 + w * 0.4 * Math.cos(spinT);
      const y = VIEW_H / 2 + 40 * Math.sin(spinT);
      targets.grad?.setAttribute("cx", x.toFixed(1));
      targets.grad?.setAttribute("cy", y.toFixed(1));
      state = { ...state, pointXPct: +(x / w * 100).toFixed(1), pointYPct: +(y / VIEW_H * 100).toFixed(1) };
      syncSlider("pointXPct");
      syncSlider("pointYPct");
      break;
    }
    case "arcshine": {
      state = { ...state, orbitAngle: (state.orbitAngle + sp) % 360 };
      const w = state.width, rectW = w - MARGIN * 2, th = state.orbitAngle * Math.PI / 180;
      targets.arc?.setAttribute("cx", (w / 2 + (rectW / 2) * Math.cos(th)).toFixed(1));
      targets.arc?.setAttribute("cy", (VIEW_H / 2 + 46 * Math.sin(th)).toFixed(1));
      syncSlider("orbitAngle");
      break;
    }
    case "beamglow": {
      state = { ...state, orbitAngle: (state.orbitAngle + sp) % 360 };
      const w = state.width, rectW = w - MARGIN * 2, th = state.orbitAngle * Math.PI / 180;
      targets.beam?.setAttribute("cx", (w / 2 + (rectW / 2) * Math.cos(th)).toFixed(1));
      targets.beam?.setAttribute("cy", (VIEW_H / 2 + 46 * Math.sin(th)).toFixed(1));
      syncSlider("orbitAngle");
      break;
    }
    case "glossshine": {
      state = { ...state, glossAngle: (state.glossAngle + sp) % 360 };
      targets.gloss?.setAttribute("gradientTransform", `rotate(${Math.round(state.glossAngle)} 0.5 0.5)`);
      syncSlider("glossAngle");
      break;
    }
    case "neon":
    case "double":
    case "corner": {
      spinT += sp * 0.04;
      const base = state.blur, amp = Math.max(1, state.blur * 0.6);
      targets.pulse?.setAttribute("stdDeviation", (base + amp * (0.5 + 0.5 * Math.sin(spinT))).toFixed(2));
      break;
    }
    case "pulse":
    case "under": {
      spinT += sp * 0.05;
      const peak = state.glowIntensity * 5;
      targets.breath?.setAttribute("slope", (peak * (0.3 + 0.7 * (0.5 + 0.5 * Math.sin(spinT)))).toFixed(2));
      break;
    }
    case "flicker": {
      spinT += sp;
      if (spinT >= 2) {
        spinT = 0;
        const peak = state.glowIntensity * 5;
        targets.breath?.setAttribute("slope", (peak * (0.15 + 0.85 * Math.random())).toFixed(2));
      }
      break;
    }
    case "gradient": {
      state = { ...state, gradAngle: ((state.gradAngle || 0) + sp) % 360 };
      targets.gradient?.setAttribute("gradientTransform", `rotate(${Math.round(state.gradAngle)} 0.5 0.5)`);
      break;
    }
    case "chase": {
      state = { ...state, dashPos: (state.dashPos || 0) + sp * 4 };
      targets.chase?.setAttribute("stroke-dashoffset", String(-Math.round(state.dashPos)));
      break;
    }
  }
  rafId = requestAnimationFrame(tick);
}

function startSpin() {
  cancelAnimationFrame(rafId);
  spinning = true;
  spinBtn.textContent = T.spinOn;
  spinBtn.setAttribute("aria-pressed", "true");
  applyLive();
  cacheTargets();
  spinT = state.pattern === "point" ? pointStartT(state) : 0;
  updateOutput();
  tick();
}

function stopSpin() {
  if (!spinning) return;
  spinning = false;
  spinBtn.textContent = T.spinOff;
  spinBtn.setAttribute("aria-pressed", "false");
  cancelAnimationFrame(rafId);
  applyLive();
  updateOutput();
}

spinBtn.addEventListener("click", () => {
  if (spinning) stopSpin();
  else startSpin();
});

const PATTERN_DEFAULTS = {
  point: { thickness: 1, pointZ: 30, blur: 0 },
  neon: { thickness: 4, blur: 1 },
  arcshine: { thickness: 10, blur: 2 },
  beamglow: { thickness: 14, blur: 3, pointZ: 24 },
  glossshine: { thickness: 12, blur: 2 },
  dual: { constant: 1.5, thickness: 15 },
  gradient: { thickness: 8, blur: 2 },
  tri: { thickness: 14, constant: 1.5 },
  pulse: { thickness: 4, blur: 2, glowIntensity: 0.5 },
  chase: { thickness: 6, blur: 2 },
  flicker: { thickness: 4, blur: 1, glowIntensity: 0.4 },
  double: { thickness: 8, blur: 2 },
  under: { thickness: 8, blur: 4, glowIntensity: 0.5 },
  corner: { thickness: 8, blur: 3, glowIntensity: 0.9 },
};

function applyPatternDefaults(pattern) {
  const defs = PATTERN_DEFAULTS[pattern];
  if (!defs) return;
  state = { ...state, ...defs };
  Object.keys(defs).forEach((k) => {
    const inp = document.querySelector(`[data-key="${k}"]`);
    if (inp) inp.value = state[k];
    updateReadout(k);
  });
}

function selectPattern(pattern) {
  if (pattern === state.pattern) return;
  state = { ...state, pattern };
  patternsGrid.querySelectorAll("[data-pattern-btn]").forEach((b) =>
    b.classList.toggle("is-active", b.dataset.patternBtn === pattern)
  );
  applyPatternDefaults(pattern);
  syncControlVisibility(pattern);
  if (spinning) startSpin();
  else {
    applyLive();
    updateOutput();
  }
}

patternsGrid.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-pattern-btn]");
  if (btn) selectPattern(btn.dataset.patternBtn);
});

panel.addEventListener("input", (e) => {
  const el = e.target;
  const key = el.dataset.key;
  if (!key) return;
  state = { ...state, [key]: el.type === "range" ? Number(el.value) : el.value };
  applyLive();
  updateOutput();
  updateReadout(key);
});

document.getElementById("reset").addEventListener("click", () => {
  stopSpin();
  document.querySelectorAll("[data-key]").forEach((el) => {
    if (el.tagName === "SELECT") return;
    el.value = el.defaultValue;
    state[el.dataset.key] = el.type === "range" ? Number(el.value) : el.value;
  });
  state = { ...state };
  applyPatternDefaults(state.pattern);
  syncControlVisibility(state.pattern);
  applyLive();
  document.querySelectorAll("[data-out]").forEach((o) => updateReadout(o.dataset.out));
  startSpin();
});

const bindCopy = (btnId, area, label) => {
  const btn = document.getElementById(btnId);
  btn.textContent = label;
  btn.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(area.value);
    } catch {
      area.select();
      document.execCommand("copy");
    }
    btn.textContent = T.copied;
    setTimeout(() => (btn.textContent = label), 1400);
  });
};
bindCopy("copyHtml", outHtmlArea, T.copyHtml);
bindCopy("copyCss", outCssArea, T.copyCss);

syncControlVisibility(state.pattern);
applyLive();
document.querySelectorAll("[data-out]").forEach((o) => updateReadout(o.dataset.out));
updateOutput();
startSpin();
