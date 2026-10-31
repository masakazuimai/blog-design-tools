
export const DRAW = { pathLength: 1, "stroke-dasharray": 1 };

const offset = (value) => Math.min(1, Math.max(0, value));

export const drawKeys = (from, to) => [
  { at: 0, "stroke-dashoffset": 1 },
  { at: from, "stroke-dashoffset": 1 },
  { at: to, "stroke-dashoffset": 0 },
  { at: 1, "stroke-dashoffset": 0 },
];

export const spinKeys = () => [
  { at: 0, transform: "rotate(0deg)" },
  { at: 1, transform: "rotate(360deg)" },
];

export const pulseKeys = (scale = 1.15) => [
  { at: 0, transform: "scale(1)" },
  { at: 0.2, transform: `scale(${scale})` },
  { at: 0.45, transform: "scale(0.96)" },
  { at: 0.7, transform: "scale(1)" },
  { at: 1, transform: "scale(1)" },
];

export const swingKeys = (deg = 12) => [
  { at: 0, transform: "rotate(0deg)" },
  { at: 0.15, transform: `rotate(${deg}deg)` },
  { at: 0.4, transform: `rotate(${-deg * 0.8}deg)` },
  { at: 0.62, transform: `rotate(${deg * 0.5}deg)` },
  { at: 0.82, transform: `rotate(${-deg * 0.3}deg)` },
  { at: 1, transform: "rotate(0deg)" },
];

export const bounceKeys = (axis = "Y", distance = -4) => [
  { at: 0, transform: `translate${axis}(0)` },
  { at: 0.3, transform: `translate${axis}(${distance}px)` },
  { at: 0.6, transform: `translate${axis}(${distance * 0.3}px)` },
  { at: 1, transform: `translate${axis}(0)` },
];

export const blinkKeys = (start = 0) => [
  { at: 0, opacity: 0 },
  { at: offset(start), opacity: 0 },
  { at: offset(start + 0.1), opacity: 1 },
  { at: offset(start + 0.25), opacity: 0.2 },
  { at: offset(start + 0.4), opacity: 1 },
  { at: 1, opacity: 1 },
];

export const popInKeys = (delay = 0) => [
  { at: 0, transform: "scale(0.3)", opacity: 0 },
  { at: offset(delay), transform: "scale(0.3)", opacity: 0 },
  { at: offset(delay + 0.2), transform: "scale(1.12)", opacity: 1 },
  { at: offset(delay + 0.3), transform: "scale(1)", opacity: 1 },
  { at: 1, transform: "scale(1)", opacity: 1 },
];

export const slideKeys = (axis = "X", distance = 8) => [
  { at: 0, transform: `translate${axis}(0)`, opacity: 1 },
  { at: 0.45, transform: `translate${axis}(${distance}px)`, opacity: 0 },
  { at: 0.55, transform: `translate${axis}(${-distance}px)`, opacity: 0 },
  { at: 1, transform: `translate${axis}(0)`, opacity: 1 },
];
