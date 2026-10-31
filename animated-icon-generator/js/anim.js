
const FILL_MODE = "both";

function toPercent(at) {
  return `${+(at * 100).toFixed(3)}%`;
}

function declarationsOf(key) {
  return Object.keys(key)
    .filter((name) => name !== "at")
    .map((name) => `${name}: ${key[name]};`)
    .join(" ");
}

function partsOf(track) {
  return Array.isArray(track.part) ? track.part : [track.part];
}

function keyframeName(icon, track) {
  return `kf-${icon.id}-${partsOf(track)[0]}`;
}

export function buildKeyframes(icon) {
  if (!icon.anim) return "";
  return icon.anim.tracks
    .map((track) => {
      const body = track.keys
        .map((key) => `  ${toPercent(key.at)} { ${declarationsOf(key)} }`)
        .join("\n");
      return `@keyframes ${keyframeName(icon, track)} {\n${body}\n}`;
    })
    .join("\n");
}

export function buildRules(icon, { speed = 1, loop = "infinite", scope = "" } = {}) {
  if (!icon.anim) return "";
  const duration = (icon.anim.duration * speed).toFixed(2);
  const easing = icon.anim.easing || "ease-in-out";

  return icon.anim.tracks
    .map((track) => {
      const selector = partsOf(track)
        .map((part) => `${scope}.p-${part}`)
        .join(", ");

      const origin = track.origin
        ? `\n  transform-box: view-box;\n  transform-origin: ${track.origin};`
        : "";

      return `${selector} {${origin}\n  animation: ${keyframeName(icon, track)} ${duration}s ${easing} ${loop} ${FILL_MODE};\n}`;
    })
    .join("\n");
}

export function buildInlineCss(icon, options) {
  return [buildRules(icon, { ...options, scope: "" }), buildKeyframes(icon)]
    .filter(Boolean)
    .join("\n");
}
