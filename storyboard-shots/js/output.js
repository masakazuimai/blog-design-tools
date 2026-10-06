// 書き出し：動画生成AI向けプロンプト・絵コンテPNG・video-scenario-maker 用JSON
import { getShot, categoryName } from "./shots/index.js?v=20261006l";
import { frameSvg, frameSvgWithPhoto } from "./frame.js?v=20261006l";
import { vocabEn } from "./vocab.js?v=20261006l";
import { t } from "./i18n.js?v=20261006l";

const sentence = (s) => (s ? `${s.replace(/[.\s]+$/, "")}.` : "");
const camera = (v) => ["shot", "angle", "move"].map((k) => vocabEn(k, v[k])).filter(Boolean).join(", ");

// 1ショット分のプロンプト
export const shotPrompt = (shot, desc = shot.desc) => [
  sentence(desc),
  camera(shot.vocab) ? sentence(`Camera: ${camera(shot.vocab)}`) : "",
  vocabEn("light", shot.vocab.light) ? sentence(`Lighting: ${vocabEn("light", shot.vocab.light)}`) : "",
].filter(Boolean).join(" ");

const fmt = (sec) => `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, "0")}`;

// 絵コンテ全体を、時間つきの1本のプロンプトにする
export const boardPrompt = (items) => {
  let t = 0;
  const lines = items.map((it, i) => {
    const shot = getShot(it.id);
    const range = `${fmt(t)}–${fmt(t + it.dur)}`;
    t += it.dur;
    return `[${range}] Shot ${i + 1}: ${shotPrompt(shot, it.desc)}`;
  });
  return [
    `A ${t}-second video made of ${items.length} shots, in this order.`,
    "Keep the characters, setting, and visual style consistent across all shots.",
    "",
    ...lines,
  ].join("\n");
};

// video-scenario-maker の「JSONを開く」で読み込める形
export const scenarioJson = (items, title) => JSON.stringify({
  title,
  aspect: "16:9",
  style: "cinematic",
  scenes: items.map((it) => {
    const shot = getShot(it.id);
    return {
      dur: it.dur,
      desc: it.desc,
      shot: shot.vocab.shot,
      angle: shot.vocab.angle,
      move: shot.vocab.move,
      light: shot.vocab.light,
      trans: "cut",
    };
  }),
}, null, 2);

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// 文字を指定幅で折り返す（SVG の text は自動で折り返さないため）。英文は単語の区切りで折る
const wrap = (text, max) => {
  const tokens = /\s/.test(text) ? text.split(/(\s+)/) : [...text];
  const out = [];
  let line = "";
  for (const tk of tokens) {
    if (line && (line + tk).trimEnd().length > max) {
      out.push(line.trim());
      line = tk.trimStart();
    } else {
      line += tk;
    }
  }
  if (line.trim()) out.push(line.trim());
  return out.slice(0, 3);
};

// 写真を data URL にする（SVG を画像として描くと外部ファイルは読み込まれないため、埋め込む）
const toDataUrl = async (url) => {
  const blob = await (await fetch(url)).blob();
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result);
    r.onerror = () => reject(new Error(`画像を読み込めませんでした: ${url}`));
    r.readAsDataURL(blob);
  });
};

// 絵コンテのシート（3列）を1枚のSVGにする。PNG書き出しに使う
export const sheetSvg = async (items) => {
  const photos = Object.fromEntries(await Promise.all(
    [...new Set(items.map((it) => getShot(it.id)).filter((s) => s.image).map((s) => s.image))]
      .map(async (src) => [src, await toDataUrl(src)]),
  ));
  const COLS = 3;
  const CW = 400;
  const FH = 225;
  const CH = FH + 96;
  const GAP = 24;
  const PAD = 32;
  const rows = Math.ceil(items.length / COLS);
  const width = PAD * 2 + COLS * CW + (COLS - 1) * GAP;
  const height = PAD * 2 + rows * CH + (rows - 1) * GAP;
  let sec = 0;
  const cells = items.map((it, i) => {
    const shot = getShot(it.id);
    const x = PAD + (i % COLS) * (CW + GAP);
    const y = PAD + Math.floor(i / COLS) * (CH + GAP);
    const range = `${fmt(sec)}–${fmt(sec + it.dur)}`;
    sec += it.dur;
    const attrs = `x="${x}" y="${y}" width="${CW}" height="${FH}"`;
    const frame = shot.image ? frameSvgWithPhoto(shot, photos[shot.image], attrs) : frameSvg(shot, { animate: false, attrs });
    // 英文は1行約52字、日本語は全角なので約27字で折る
    const desc = wrap(it.desc, /\s/.test(it.desc) ? 52 : 27).map((l, k) => `<text x="${x}" y="${y + FH + 62 + k * 18}" font-size="14" fill="#555">${esc(l)}</text>`).join("");
    return `${frame}
<text x="${x}" y="${y + FH + 26}" font-size="18" font-weight="700" fill="#111">${String(i + 1).padStart(2, "0")}${t("sheetSep")}${esc(shot.name)}</text>
<text x="${x}" y="${y + FH + 44}" font-size="13" fill="#999">${esc(t("sheetTime")(range, it.dur, categoryName(shot.cat)))}</text>${desc}`;
  }).join("\n");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" font-family="'Hiragino Sans','Noto Sans JP',sans-serif">
<rect width="${width}" height="${height}" fill="#fff"/>
${cells}
</svg>`;
  return { svg, width, height };
};
