// パターンを Shadow DOM に描画する（ツール側のCSSとパターンのCSSを互いに干渉させない）
import { buildCss, buildHtml } from "./code.js?v=20261006f";

const HOST_CSS = `:host { display: block; }
a, button { pointer-events: none; }`;

// host 要素に patterns を描画し、shadowRoot を返す
export const mountPatterns = (host, patterns) => {
  const root = host.shadowRoot ?? host.attachShadow({ mode: "open" });
  root.innerHTML = `<style>${HOST_CSS}\n${buildCss(patterns)}</style>${buildHtml(patterns)}`;
  return root;
};

// 幅 width で描画したものを、表示枠の幅に合わせて縮小する
export const fitToFrame = (frame, stage, width) => {
  const apply = () => {
    // 非表示の枠（幅0）では縮小率を決められないので、表示されてから計算する
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
