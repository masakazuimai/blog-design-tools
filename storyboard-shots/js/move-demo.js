// カメラの動きの見本動画（Blenderで作った粘土風のループ）。一覧のホバーと詳細画面で使う
// 動画はショットごとに、写真と同じ場面・向き・画の大きさで作っている

// 見本があるショット（カメラが動くショットと、応用のカメラワーク・つなぎ・編集の全部。sz04 は目元の写真をそのまま拡大する方が伝わるので除く）
const DEMO_SHOTS = new Set([
  "es01", "ag04", "mv01", "mv02", "mv03", "rl04", "mv04", "mv05", "mv06", "mv07", "mv08",
  "pr01", "pr02", "pr03", "pr04", "pr05", "pr06", "pr07", "pr08", "pr09", "pr10", "pr11", "pr12",
  "pr13", "pr14", "pr15", "pr16", "pr17",
  // つなぎ・編集は、Blenderの素材カットを After Effects でつないだもの
  "ed01", "ed02", "ed03", "ed04", "ed05", "ed06",
]);
const DEMO_VER = "20261030b";
const demoUrl = (file) => new URL(`../video/${file}?v=${DEMO_VER}`, import.meta.url).href;

export const hasDemo = (shot) => DEMO_SHOTS.has(shot?.id);

export const demoPoster = (shot) => demoUrl(`shot-${shot.id}-poster.webp`);

// Safari 等で webm が再生できない場合に備えて mp4 も並べる
export const demoSources = (shot) =>
  `<source src="${demoUrl(`shot-${shot.id}.webm`)}" type="video/webm"><source src="${demoUrl(`shot-${shot.id}.mp4`)}" type="video/mp4">`;

export const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
