import { mountPatterns, fitToFrame } from "./render.js?v=20261006h";

export const createPreview = (frame, stage) => {
  let width = 1200;
  let patterns = [];
  let stopFit = () => {};

  const draw = () => {
    stopFit();
    mountPatterns(stage, patterns);
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
