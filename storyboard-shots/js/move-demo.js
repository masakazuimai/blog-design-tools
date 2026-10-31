
const DEMO_SHOTS = new Set([
  "es01", "ag04", "mv01", "mv02", "mv03", "rl04", "mv04", "mv05", "mv06", "mv07", "mv08",
  "pr01", "pr02", "pr03", "pr04", "pr05", "pr06", "pr07", "pr08", "pr09", "pr10", "pr11", "pr12",
  "pr13", "pr14", "pr15", "pr16", "pr17",
  "rl07", "rl08",
  "pr18", "pr19", "pr20", "pr21", "pr23", "pr24", "pr25", "pr26", "pr27", "pr28", "pr29", "pr30",
  "ed01", "ed02", "ed03", "ed04", "ed05", "ed06",
]);
const DEMO_VER = "20261030e";
const demoUrl = (file) => new URL(`../video/${file}?v=${DEMO_VER}`, import.meta.url).href;

export const hasDemo = (shot) => DEMO_SHOTS.has(shot?.id);

export const demoPoster = (shot) => demoUrl(`shot-${shot.id}-poster.webp`);

export const demoSources = (shot) =>
  `<source src="${demoUrl(`shot-${shot.id}.webm`)}" type="video/webm"><source src="${demoUrl(`shot-${shot.id}.mp4`)}" type="video/mp4">`;

export const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
