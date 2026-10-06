// ショットの絵コンテ1コマを SVG で描く（16:9・viewBox 160×90）
// 被写体の大きさ（size）・アングル（angle）・カメラの動き（move）の組み合わせで絵を作り、絵柄は THEMES で切り替える

const W = 160;
const H = 90;

// 人物は顔を描かない塗りつぶしのシルエット。足元が原点、身長は約97
// 脚は身長の約45%（股＝-44）。腕は太ももの中ほどまで
const BODY = "M-3.5 -81 L-3.5 -78 C-8 -77.5 -13 -76.5 -15 -74 C-17 -68 -17.5 -58 -17.5 -50 L-16.5 -42 L-13 -42 L-13.2 -56 L-11.5 -61 L-10.5 -52 L-11.5 -46 L-8.5 0 L-3 0 L-1 -44 L1 -44 L3 0 L8.5 0 L11.5 -46 L10.5 -52 L11.5 -61 L13.2 -56 L13 -42 L16.5 -42 L17.5 -50 C17.5 -58 17 -68 15 -74 C13 -76.5 8 -77.5 3.5 -78 L3.5 -81 Z";

// 絵柄ごとの色と効果。uid は1コマごとに振る（defs の id を衝突させないため）
export const THEMES = {
  clean: {
    label: "クリーン",
    bg: () => `<rect width="${W}" height="${H}" fill="#fafafa"/>`,
    figure: "#8a8a8a", fg: "#3f3f3f", edge: "none", line: "#9a9a9a", guide: "#d6d6d6", ink: "#2b2b2b",
    face: "#9c9c9c", faceDark: "#4a4a4a", panel: "#fff", accent: "#e4572e", frame: "#2b2b2b",
    landFill: "none", groupAttr: () => "", bars: false,
  },
  cinema: {
    label: "シネマ",
    defs: (u) => `<linearGradient id="${u}sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#0d1320"/><stop offset="0.45" stop-color="#2b3552"/>
      <stop offset="0.66" stop-color="#d9824a"/><stop offset="0.68" stop-color="#1a130f"/><stop offset="1" stop-color="#0b0908"/></linearGradient>
      <radialGradient id="${u}sun" cx="0.62" cy="0.64" r="0.35"><stop offset="0" stop-color="#ffd49a" stop-opacity="0.85"/><stop offset="1" stop-color="#ffd49a" stop-opacity="0"/></radialGradient>`,
    bg: (u) => `<rect width="${W}" height="${H}" fill="url(#${u}sky)"/><rect width="${W}" height="${H}" fill="url(#${u}sun)"/>`,
    figure: "#080808", fg: "#000", edge: "rgba(255,190,130,0.75)", line: "rgba(255,200,150,0.55)", guide: "rgba(255,255,255,0.10)", ink: "#e9e2d6",
    face: "#121212", faceDark: "#000", panel: "rgba(0,0,0,0.6)", accent: "#ff8a3d", frame: "#000",
    landFill: "#0e0c0b", groupAttr: () => "", bars: true,
  },
  sketch: {
    label: "鉛筆スケッチ",
    defs: (u) => `<filter id="${u}rough" x="-5%" y="-5%" width="110%" height="110%">
      <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="3"/>
      <feDisplacementMap in="SourceGraphic" scale="1.1"/></filter>
      <pattern id="${u}hatch" width="3" height="3" patternUnits="userSpaceOnUse" patternTransform="rotate(40)">
      <line x1="0" y1="0" x2="0" y2="3" stroke="#6d675e" stroke-width="0.7"/></pattern>`,
    bg: () => `<rect width="${W}" height="${H}" fill="#f3eee4"/>`,
    figure: (u) => `url(#${u}hatch)`, fg: "#4a453e", edge: "#3a3631", line: "#6d675e", guide: "rgba(80,70,60,0.18)", ink: "#3a3631",
    face: "#e6dfd2", faceDark: "#3a3631", panel: "#f3eee4", accent: "#c0392b", frame: "#3a3631",
    landFill: "none", groupAttr: (u) => `filter="url(#${u}rough)"`, bars: false,
  },
};

// 描画中の絵柄とコマの id（frameSvg の中だけで差し替える）
let T = THEMES.clean;
let U = "";
const col = (v) => (typeof v === "function" ? v(U) : v);

const personShape = (fill) => {
  const f = fill ?? col(T.figure);
  const edge = T.edge === "none" ? "" : `stroke="${T.edge}" stroke-width="${T === THEMES.sketch ? 1 : 0.8}" vector-effect="non-scaling-stroke"`;
  return `<g class="pf" fill="${f}" ${edge}><ellipse cx="0" cy="-89" rx="6.5" ry="8"/><path d="${BODY}" stroke-linejoin="round"/></g>`;
};

// 被写体の大きさ → 人物の拡大率と足元の位置（はみ出した部分は枠で切れる）
const SIZE = {
  ews: { s: 0.11, x: 92, y: 66 },
  ws: { s: 0.28, x: 96, y: 72 },
  fs: { s: 0.76, x: 80, y: 84 },
  ms: { s: 1.45, x: 80, y: 158 },
  cu: { s: 2.6, x: 80, y: 268 },
};

// 見下ろしは人物を小さく、見上げは大きく描いて角度の印象を出す
const ANGLE_SIZE = { high: { s: 0.55, x: 80, y: 76 }, low: { s: 1, x: 80, y: 99 } };

const person = (size, x, angle, fill) => {
  const p = (size === "fs" && ANGLE_SIZE[angle]) || SIZE[size] || SIZE.fs;
  return `<g transform="translate(${x ?? p.x} ${p.y}) scale(${p.s})">${personShape(fill)}</g>`;
};

// 背景：地平線と山（引きの画で使う）
const landscape = (horizon = 58) => {
  const ridge = `-40,${horizon} 10,${horizon - 16} 34,${horizon - 6} 62,${horizon - 22} 96,${horizon - 4} 128,${horizon - 14} 200,${horizon}`;
  const fill = T.landFill === "none" ? "" : `<polygon points="${ridge} 200,${H + 20} -40,${H + 20}" fill="${T.landFill}"/>`;
  return `<g class="bg">${fill}
  <line x1="-40" y1="${horizon}" x2="${W + 40}" y2="${horizon}" stroke="${T.line}" stroke-width="1"/>
  <polyline points="${ridge}" fill="none" stroke="${T.line}" stroke-width="1"/>
</g>`;
};

// 超アップ（目元）：画面いっぱいの顔の上に、濃い目と眉だけを置く
const eyes = () => `<g>
  <rect width="${W}" height="${H}" fill="${T.face}"/>
  <path d="M28 48 Q52 32 76 48 Q52 60 28 48 Z" fill="${T.faceDark}" stroke="${T.edge === "none" ? "none" : T.edge}" stroke-width="0.8"/>
  <path d="M84 48 Q108 32 132 48 Q108 60 84 48 Z" fill="${T.faceDark}" stroke="${T.edge === "none" ? "none" : T.edge}" stroke-width="0.8"/>
  <circle cx="56" cy="44" r="2.2" fill="#fff" opacity="${T === THEMES.cinema ? 0.9 : 0}"/><circle cx="112" cy="44" r="2.2" fill="#fff" opacity="${T === THEMES.cinema ? 0.9 : 0}"/>
  <path d="M26 30 Q52 20 78 28 L78 32 Q52 25 26 34 Z M82 28 Q108 20 134 30 L134 34 Q108 25 82 32 Z" fill="${T.faceDark}"/>
</g>`;

// 肩越し：手前に相手の後ろ姿（濃い色・大きく・左端で切れる）、奥に人物
const overShoulder = () => `<g>${person("fs", 106)}${person("ms", 8, undefined, T.fg)}</g>`;

// 2ショット：向き合う2人
const twoShot = () => `<g>${person("fs", 56)}${person("fs", 106)}</g>`;

// 主観：画面下に自分の両手（人物と同じ塗り）
const pov = () => `<g>${landscape(46)}${person("ws", 104)}
  <path d="M24 90 Q28 72 42 66 Q54 62 58 70 Q60 78 52 90 Z" fill="${col(T.figure)}" stroke="${T.edge === "none" ? "none" : T.edge}" stroke-width="0.8"/>
  <path d="M136 90 Q132 72 118 66 Q106 62 102 70 Q100 78 108 90 Z" fill="${col(T.figure)}" stroke="${T.edge === "none" ? "none" : T.edge}" stroke-width="0.8"/>
</g>`;

// 真上から：テーブル（枠）に向かう人物を上から見た形（肩と頭）
const topView = () => `<g>
  <rect x="34" y="14" width="92" height="40" rx="2" fill="none" stroke="${T.line}" stroke-width="1"/>
  <ellipse cx="80" cy="64" rx="22" ry="10" fill="${col(T.figure)}" stroke="${T.edge === "none" ? "none" : T.edge}" stroke-width="0.8"/>
  <ellipse cx="80" cy="62" rx="9" ry="9" fill="${T === THEMES.clean ? "#6f6f6f" : T.fg}"/>
</g>`;

// 物のアップ（テーブルの上の小物）
const object = () => `<g>
  <line x1="0" y1="66" x2="${W}" y2="66" stroke="${T.line}" stroke-width="1"/>
  <rect x="62" y="34" width="36" height="32" rx="4" fill="${col(T.figure)}" stroke="${T.ink}" stroke-width="1.2"/>
</g>`;

// 見下ろし・見上げは、地面の見え方（パース線）で表す
const ground = (angle) => {
  if (angle === "high") {
    return `<g class="bg"><path d="M-20 90 L52 20 M180 90 L108 20 M20 90 L68 20 M140 90 L92 20" stroke="${T.line}" stroke-width="0.8" opacity="0.6"/></g>`;
  }
  if (angle === "low") {
    return `<g class="bg"><line x1="-20" y1="84" x2="180" y2="84" stroke="${T.line}" stroke-width="1"/><path d="M10 84 L80 120 M150 84 L80 120" stroke="${T.line}" stroke-width="0.8" opacity="0.6"/></g>`;
  }
  return "";
};

// 被写体の組み立て
const subject = (f) => {
  switch (f.subject) {
    case "eyes": return eyes();
    case "object": return object();
    case "ots": return overShoulder();
    case "two": return twoShot();
    case "pov": return pov();
    case "top": return topView();
    case "landscape": return `${landscape(f.horizon ?? 58)}${person(f.size ?? "ews")}`;
    default: return `${ground(f.angle)}${person(f.size ?? "fs", undefined, f.angle)}`;
  }
};

// 右下の小さな側面図：人物（棒）とカメラの位置
const CAM_POS = { high: [26, 4], low: [26, 22], bird: [12, 2], ots: [22, 14], pov: [16, 12] };
const angleInset = (angle) => {
  const pos = CAM_POS[angle];
  if (!pos) return "";
  const [cx, cy] = pos;
  return `<g transform="translate(118 58)">
  <rect width="38" height="28" rx="3" fill="${T.panel}" stroke="${T.guide}"/>
  <line x1="4" y1="24" x2="34" y2="24" stroke="${T.line}" stroke-width="0.8"/>
  <circle cx="10" cy="10" r="2.2" fill="none" stroke="${T.ink}" stroke-width="0.9"/>
  <line x1="10" y1="12" x2="10" y2="24" stroke="${T.ink}" stroke-width="0.9"/>
  <path d="M${cx} ${cy} l5 -3 l0 6 z" fill="${T.accent}" transform="rotate(${Math.atan2(10 - cy, 10 - cx) * 57.3 + 180} ${cx} ${cy})"/>
</g>`;
};

// カメラの動き：枠の中（.cam）を CSS アニメで動かし、左上に矢印のアイコンを出す
const MOVE_ANIM = {
  in: "@keyframes mv{from{transform:scale(1)}to{transform:scale(1.4)}}",
  out: "@keyframes mv{from{transform:scale(1.4)}to{transform:scale(1)}}",
  pan: "@keyframes mv{from{transform:translateX(18px)}to{transform:translateX(-18px)}}",
  tilt: "@keyframes mv{from{transform:translateY(14px)}to{transform:translateY(-14px)}}",
  track: "@keyframes mv{from{transform:translateX(20px)}to{transform:translateX(-20px)}}",
  orbit: "@keyframes mv{0%{transform:scaleX(1)}50%{transform:scaleX(-1)}100%{transform:scaleX(1)}}",
  hand: "@keyframes mv{0%{transform:translate(0,0) rotate(0)}25%{transform:translate(1.5px,-1px) rotate(.6deg)}50%{transform:translate(-1px,1px) rotate(-.4deg)}75%{transform:translate(1px,1.5px) rotate(.3deg)}100%{transform:translate(0,0) rotate(0)}}",
  drone: "@keyframes mv{from{transform:translate(10px,10px) scale(1.15)}to{transform:translate(-10px,-6px) scale(1)}}",
};
const MOVE_ICON = {
  in: "M8 8 L16 16 M16 10 L16 16 L10 16",
  out: "M16 16 L8 8 M8 14 L8 8 L14 8",
  pan: "M6 12 L18 12 M14 8 L18 12 L14 16",
  tilt: "M12 18 L12 6 M8 10 L12 6 L16 10",
  track: "M6 12 L18 12 M14 8 L18 12 L14 16 M6 8 L6 16",
  orbit: "M6 12 A6 4 0 1 0 18 12 M15 9 L18 12 L21 9",
  hand: "M6 12 Q9 8 12 12 T18 12",
  drone: "M6 16 L18 8 M13 8 L18 8 L18 13",
};

const moveLayer = (move, uid) => {
  if (!MOVE_ANIM[move]) return { style: "", icon: "" };
  const dur = move === "hand" ? "0.9s" : "3.2s";
  const dir = move === "hand" || move === "orbit" ? "infinite" : "infinite alternate";
  // 追いかける（track）は人物を止めたまま背景だけを流す
  const target = move === "track" ? ".bg" : ".cam";
  return {
    // ページ内に複数のコマが並ぶので、keyframes 名はコマごとに分ける
    style: `<style>#${uid} ${target}{transform-box:view-box;transform-origin:50% 50%;animation:${uid}mv ${dur} ease-in-out ${dir}}${MOVE_ANIM[move].replace("@keyframes mv", `@keyframes ${uid}mv`)}@media (prefers-reduced-motion: reduce){#${uid} ${target}{animation:none}}</style>`,
    icon: `<g transform="translate(4 ${T.bars ? 10 : 4})"><rect width="24" height="24" rx="4" fill="${T.panel}" stroke="${T.guide}"/><path d="${MOVE_ICON[move]}" fill="none" stroke="${T.accent}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></g>`,
  };
};

let seq = 0;

// shot.frame と shot.vocab から SVG 文字列を作る。animate=false で静止画（書き出し用）
// attrs は外側の svg に付ける位置・サイズ（シートに埋め込むときに x/y/width/height を渡す）
export const frameSvg = (shot, { animate = true, attrs = 'width="100%"', theme = "clean" } = {}) => {
  T = THEMES[theme] ?? THEMES.clean;
  U = `fr${(seq += 1)}`;
  const f = shot.frame ?? {};
  const move = shot.vocab?.move;
  const layer = moveLayer(move, U);
  const style = animate ? layer.style : "";
  // シネマは上下に黒帯（シネスコ風）を入れる
  const bars = T.bars ? `<rect width="${W}" height="7" fill="#000"/><rect y="${H - 7}" width="${W}" height="7" fill="#000"/>` : "";
  return `<svg id="${U}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" ${attrs} role="img" aria-label="${shot.name}">
${style}
<defs><clipPath id="${U}c"><rect width="${W}" height="${H}"/></clipPath>${T.defs ? T.defs(U) : ""}</defs>
${T.bg(U)}
<g clip-path="url(#${U}c)">
  <g class="cam" ${T.groupAttr(U)}>${subject({ ...f, angle: shot.vocab?.angle })}</g>
  <path d="M${W / 3} 0 V${H} M${(W * 2) / 3} 0 V${H} M0 ${H / 3} H${W} M0 ${(H * 2) / 3} H${W}" stroke="${T.guide}" stroke-width="0.5" stroke-dasharray="2 2"/>
  ${bars}
</g>
${angleInset(shot.vocab?.angle)}
${layer.icon}
<rect x="0.5" y="0.5" width="${W - 1}" height="${H - 1}" fill="none" stroke="${T.frame}" stroke-width="1" ${T.groupAttr(U)}/>
</svg>`;
};

// ===== 写真のあるショット =====
// 写真の上に重ねるもの（カメラ位置の側面図・動きの矢印・枠線）だけを SVG で描く
const overlaySvg = (shot) => {
  T = THEMES.clean;
  U = `fr${(seq += 1)}`;
  return `<svg class="photo-frame__overlay" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" aria-hidden="true">
${angleInset(shot.vocab?.angle)}
${moveLayer(shot.vocab?.move, U).icon}
</svg>`;
};

// 画面表示用：写真があれば <img>（遅延読み込み）＋重ね描き、無ければ SVG の絵
export const frameHtml = (shot, { eager = false } = {}) => {
  if (!shot.image) return frameSvg(shot);
  const move = shot.vocab?.move || "static";
  return `<div class="photo-frame mv-${move}">
  <img class="photo-frame__img" src="${shot.image}?v=20261006a" alt="${shot.name}" width="1280" height="720" ${eager ? "" : 'loading="lazy"'} decoding="async">
  ${overlaySvg(shot)}
</div>`;
};

// 書き出し用：写真を data URL で埋め込んだ SVG（PNG に変換すると写真も写る）
export const frameSvgWithPhoto = (shot, dataUrl, attrs) => {
  T = THEMES.clean;
  U = `fr${(seq += 1)}`;
  return `<svg id="${U}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" ${attrs}>
<image href="${dataUrl}" width="${W}" height="${H}" preserveAspectRatio="xMidYMid slice"/>
${angleInset(shot.vocab?.angle)}
${moveLayer(shot.vocab?.move, U).icon}
<rect x="0.5" y="0.5" width="${W - 1}" height="${H - 1}" fill="none" stroke="#2b2b2b" stroke-width="1"/>
</svg>`;
};
