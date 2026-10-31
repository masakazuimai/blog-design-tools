import { buildCss, buildHtml } from "./code.js?v=20261006h";

const HOST_CSS = `:host { display: block; }
a, button { pointer-events: none; }`;

export const mountPatterns = (host, patterns) => {
  const root = host.shadowRoot ?? host.attachShadow({ mode: "open" });
  root.innerHTML = `<style>${HOST_CSS}\n${buildCss(patterns)}</style>${buildHtml(patterns)}`;
  return root;
};

export const fitToFrame = (frame, stage, width) => {
  const apply = () => {
    if (!frame.clientWidth) return;
    const scale = Math.min(1, frame.clientWidth / width);
    stage.style.width = `${width}px`;
    stage.style.zoom = String(scale);
  };
  apply();
  const ro = new ResizeObserver(apply);
  ro.observe(frame);
  return () => ro.disconnect();
};
