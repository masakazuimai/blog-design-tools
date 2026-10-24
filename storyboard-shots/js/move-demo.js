// カメラの動きの見本動画（Blenderで作った粘土風のループ）。一覧のホバーと詳細画面で使う

// 見本がある動き（固定・指定なしは出さない）
const MOVE_DEMOS = ["pan", "tilt", "in", "out", "track", "orbit", "hand", "drone"];
const DEMO_VER = "20261024a";
const demoUrl = (file) => new URL(`../video/${file}?v=${DEMO_VER}`, import.meta.url).href;

// ショットの動きに見本があればその動きを、無ければ null を返す
export const demoMove = (shot) => (MOVE_DEMOS.includes(shot?.vocab?.move) ? shot.vocab.move : null);

export const demoPoster = (move) => demoUrl(`move-${move}-poster.webp`);

// Safari 等で webm が再生できない場合に備えて mp4 も並べる
export const demoSources = (move) =>
  `<source src="${demoUrl(`move-${move}.webm`)}" type="video/webm"><source src="${demoUrl(`move-${move}.mp4`)}" type="video/mp4">`;

export const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
