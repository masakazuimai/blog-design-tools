// 表示枠（.frame）にワイヤーフレームを描画し、枠の幅に合わせて縮小する
import { mountPatterns, fitToFrame } from "./render.js?v=20261006f";

export const createPreview = (frame, stage) => {
  let width = 1200;
  let patterns = [];
  let stopFit = () => {};

  const draw = () => {
    stopFit();
    mountPatterns(stage, patterns);
    // スマホ幅は縮小せず、枠の中央に実寸で置く
    frame.classList.toggle("frame--narrow", width < 600);
    stopFit = fitToFrame(frame, stage, width);
  };

  return {
    setPatterns(next) {
      patterns = next;
      draw();
    },
    setWidth(next) {
      width = next;
      draw();
    },
    getWidth: () => width,
  };
};
