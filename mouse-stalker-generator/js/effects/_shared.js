export const GSAP_CDN = '<script src="https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/gsap.min.js"></script>';

export const GUARD = `  if (!matchMedia("(hover: hover) and (pointer: fine)").matches) return;
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;`;

export const HIDE_JS = `  document.documentElement.classList.add("has-stalker");`;

export function hideCss(o) {
  return o.hide
    ? `
.has-stalker,
.has-stalker * {
  cursor: none !important;
}
`
    : "";
}

export function ease(o) {
  return Math.max(0.06, 1 - o.lag / 105).toFixed(2);
}

export function dur(o) {
  return ((o.lag / 100) * 0.8 + 0.05).toFixed(2);
}

export function half(n) {
  return Math.round(n / 2);
}

export const BASE_CSS = `  position: fixed;
  top: 0;
  left: 0;
  pointer-events: none;
  z-index: 9999;`;

export const TRACK_JS = `  let mx = -100, my = -100, x = -100, y = -100;
  let active = false;
  addEventListener("pointermove", (e) => {
    mx = e.clientX;
    my = e.clientY;
    if (!active) {
      x = mx;
      y = my;
      active = true;
      el.classList.add("is-active");
    }
  });
  document.documentElement.addEventListener("mouseleave", () => {
    active = false;
    el.classList.remove("is-active");
  });`;

export const FADE_CSS = `  opacity: 0;
  transition: opacity 0.3s;
}
.stalker.is-active {
  opacity: 1;`;

export function hexToRgb(hex) {
  const n = parseInt(hex.slice(1), 16);
  return `${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}`;
}

export function escText(s) {
  return String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
}
