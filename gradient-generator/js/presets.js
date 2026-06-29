// プリセット定義（和グラデーション・一覧ギャラリー用）。
// 構成 = ①情景グラデ(SCENE_PRESETS, 手書きの多色/放射/扇形) ＋
//        ②色の辞書の日本の伝統色250色から自動生成した階調グラデ(DICT_PRESETS)。
// 伝統色のHEX・色カテゴリ(hue)は color-dictionary の正規データをそのまま流用する。
import { JA_COLORS } from "../../color-dictionary/js/data-ja.js";

// ===== 情景グラデーション（多色・放射・扇形。単色階調では出せないもの） =====
export const SCENE_PRESETS = [
  { id: "akane-sora", name: "茜の空", reading: "あかねのそら", name_en: "Akane Sky", cat: "orange", angle: 160, stops: [{ color: "#b7282e", pos: 0 }, { color: "#e8743b", pos: 50 }, { color: "#f6d8a8", pos: 100 }] },
  { id: "kure-akane", name: "暮茜", reading: "くれあかね", name_en: "Dusk Akane", cat: "orange", angle: 160, stops: [{ color: "#2c1330", pos: 0 }, { color: "#7e2218", pos: 42 }, { color: "#b9521e", pos: 78 }, { color: "#d97b35", pos: 100 }] },
  { id: "tasogare", name: "黄昏", reading: "たそがれ", name_en: "Twilight", cat: "orange", angle: 170, stops: [{ color: "#e07b54", pos: 0 }, { color: "#9b5a8f", pos: 55 }, { color: "#3a3a5a", pos: 100 }] },
  { id: "akanegumo", name: "茜雲", reading: "あかねぐも", name_en: "Akane Clouds", cat: "orange", angle: 155, stops: [{ color: "#8c3b3f", pos: 0 }, { color: "#d0576b", pos: 45 }, { color: "#fbca4d", pos: 100 }] },
  { id: "momiji", name: "紅葉", reading: "もみじ", name_en: "Autumn Maple", cat: "orange", angle: 150, stops: [{ color: "#c93a40", pos: 0 }, { color: "#ed6d3d", pos: 50 }, { color: "#e6b422", pos: 100 }] },
  { id: "sakura-gasumi", name: "桜霞", reading: "さくらがすみ", name_en: "Cherry Haze", cat: "pink", angle: 135, stops: [{ color: "#fdeff2", pos: 0 }, { color: "#f4b3c2", pos: 60 }, { color: "#e7a6c4", pos: 100 }] },
  { id: "sakura-namiki", name: "桜並木", reading: "さくらなみき", name_en: "Cherry Avenue", cat: "pink", angle: 150, stops: [{ color: "#fde2e4", pos: 0 }, { color: "#f4b3c2", pos: 55 }, { color: "#cdd9b0", pos: 100 }] },
  { id: "yamabuki", name: "山吹日和", reading: "やまぶきびより", name_en: "Marigold Day", cat: "yellow", angle: 120, stops: [{ color: "#f8b500", pos: 0 }, { color: "#e6713b", pos: 60 }, { color: "#d3381c", pos: 100 }] },
  { id: "nanohana", name: "菜の花畑", reading: "なのはなばたけ", name_en: "Rape Blossom Field", cat: "yellow", angle: 150, stops: [{ color: "#ffec47", pos: 0 }, { color: "#c3d825", pos: 60 }, { color: "#69821b", pos: 100 }] },
  { id: "kin-koku", name: "漆黒に金", reading: "しっこくにきん", name_en: "Gold on Black", cat: "yellow", angle: 120, stops: [{ color: "#1a1a1a", pos: 0 }, { color: "#c9a449", pos: 100 }] },
  { id: "shinryoku", name: "新緑", reading: "しんりょく", name_en: "Fresh Verdure", cat: "green", angle: 160, stops: [{ color: "#c3d825", pos: 0 }, { color: "#5b8930", pos: 55 }, { color: "#007b43", pos: 100 }] },
  { id: "maccha", name: "抹茶", reading: "まっちゃ", name_en: "Matcha", cat: "green", angle: 160, stops: [{ color: "#c5c56a", pos: 0 }, { color: "#8c9440", pos: 55 }, { color: "#69821b", pos: 100 }] },
  { id: "aokaede", name: "青楓", reading: "あおかえで", name_en: "Green Maple", cat: "green", angle: 160, stops: [{ color: "#a8bf93", pos: 0 }, { color: "#5b8a72", pos: 55 }, { color: "#3b7960", pos: 100 }] },
  { id: "tokiwa", name: "常磐", reading: "ときわ", name_en: "Evergreen", cat: "green", angle: 170, stops: [{ color: "#3a9d6e", pos: 0 }, { color: "#007b43", pos: 55 }, { color: "#14342b", pos: 100 }] },
  { id: "ruri-umi", name: "瑠璃の海", reading: "るりのうみ", name_en: "Lapis Sea", cat: "blue", angle: 160, stops: [{ color: "#1e50a2", pos: 0 }, { color: "#38a1db", pos: 55 }, { color: "#a2d7dd", pos: 100 }] },
  { id: "gunjo-yoru", name: "群青の夜", reading: "ぐんじょうのよる", name_en: "Ultramarine Night", cat: "blue", angle: 180, stops: [{ color: "#4c6cb3", pos: 0 }, { color: "#1b2a52", pos: 60 }, { color: "#16161d", pos: 100 }] },
  { id: "yozora", name: "夜空", reading: "よぞら", name_en: "Night Sky", cat: "blue", angle: 180, stops: [{ color: "#17184b", pos: 0 }, { color: "#192f60", pos: 55 }, { color: "#6a4c93", pos: 100 }] },
  { id: "ajisai", name: "紫陽花", reading: "あじさい", name_en: "Hydrangea", cat: "blue", angle: 160, stops: [{ color: "#7db9de", pos: 0 }, { color: "#867ba9", pos: 55 }, { color: "#b48ead", pos: 100 }] },
  { id: "fujidana", name: "藤棚", reading: "ふじだな", name_en: "Wisteria Trellis", cat: "purple", angle: 165, stops: [{ color: "#cfc6e6", pos: 0 }, { color: "#a59aca", pos: 50 }, { color: "#674196", pos: 100 }] },
  { id: "kinran", name: "金襴", reading: "きんらん", name_en: "Gold Brocade", cat: "yellow", type: "conic", angle: 0, stops: [{ color: "#e6b422", pos: 0 }, { color: "#c93a40", pos: 33 }, { color: "#316745", pos: 66 }, { color: "#e6b422", pos: 100 }] },
  { id: "wa-rin", name: "和の環", reading: "わのわ", name_en: "Wa Ring", cat: "red", type: "conic", angle: 0, stops: [{ color: "#b7282e", pos: 0 }, { color: "#f8b500", pos: 33 }, { color: "#2f5d3a", pos: 66 }, { color: "#b7282e", pos: 100 }] },
  { id: "hikari-rin", name: "光輪", reading: "こうりん", name_en: "Halo", cat: "red", type: "radial", radialShape: "circle", stops: [{ color: "#f6d8a8", pos: 0 }, { color: "#b14730", pos: 100 }] },
  { id: "asagiri", name: "朝霧", reading: "あさぎり", name_en: "Morning Mist", cat: "neutral", type: "radial", radialShape: "circle", stops: [{ color: "#fffdf7", pos: 0 }, { color: "#c9c9c0", pos: 60 }, { color: "#95989f", pos: 100 }] },
];

// ===== 色ユーティリティ（HSL・混色） =====
function hexToHsl(hex) {
  let h = hex.replace("#", "");
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  const r = parseInt(h.slice(0, 2), 16) / 255;
  const g = parseInt(h.slice(2, 4), 16) / 255;
  const b = parseInt(h.slice(4, 6), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b), d = max - min;
  let hue = 0;
  if (d) {
    if (max === r) hue = (((g - b) / d) % 6 + 6) % 6;
    else if (max === g) hue = (b - r) / d + 2;
    else hue = (r - g) / d + 4;
    hue *= 60;
  }
  const l = (max + min) / 2;
  // 2番目は彩度(chroma=max−min)。淡色を過大評価しないよう HSL彩度ではなく chroma を使う
  return [hue, d, l];
}
function rgbOf(hex) {
  let h = hex.replace("#", "");
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}
function toHex(r, g, b) {
  const c = (n) => Math.round(Math.min(255, Math.max(0, n))).toString(16).padStart(2, "0");
  return `#${c(r)}${c(g)}${c(b)}`;
}
function mix(hex, target, amt) {
  const a = rgbOf(hex), b = rgbOf(target);
  return toHex(a[0] + (b[0] - a[0]) * amt, a[1] + (b[1] - a[1]) * amt, a[2] + (b[2] - a[2]) * amt);
}
// 単色 → 階調グラデ（明るい色は濃→淡、それ以外は色→淡）
function tonalStops(hex) {
  const [, , l] = hexToHsl(hex);
  if (l > 0.82) return [{ color: mix(hex, "#3a3027", 0.16), pos: 0 }, { color: hex, pos: 100 }];
  return [{ color: hex, pos: 0 }, { color: mix(hex, "#ffffff", 0.4), pos: 100 }];
}

// ===== 伝統色250色 → 自動生成（情景グラデと名前が重複するものは除外） =====
const SCENE_NAMES = new Set(SCENE_PRESETS.map((p) => p.name));
const ANGLES = [135, 150, 160, 120];
const DICT_PRESETS = JA_COLORS.filter((c) => !SCENE_NAMES.has(c.name)).map((c, i) => ({
  id: `wa-${c.id}`,
  name: c.name,
  reading: c.reading,
  name_en: c.en,
  cat: c.hue,
  angle: ANGLES[i % ANGLES.length],
  stops: tonalStops(c.hex),
}));

// ===== 並び替え（color-dictionary と同じ：カテゴリ順 → 同カテゴリは明→暗） =====
// 連続色相ソートは紫⇔桃の折り返しで破綻するため、チップと同じ離散カテゴリ順で並べる。
const CAT_RANK = { red: 0, orange: 1, yellow: 2, green: 3, blue: 4, purple: 5, pink: 6, brown: 7, neutral: 8 };
function repLight(p) {
  const cs = p.stops.map((s) => hexToHsl(s.color)).sort((a, b) => b[1] - a[1]);
  return cs[0][2];
}
function compareKey(a, b) {
  const ra = CAT_RANK[a.cat] ?? 9, rb = CAT_RANK[b.cat] ?? 9;
  if (ra !== rb) return ra - rb;
  return repLight(b) - repLight(a); // 同カテゴリは明るい順
}

// 一覧描画用（情景＋伝統色250、カテゴリ順）
export const ALL_PRESETS = [...SCENE_PRESETS, ...DICT_PRESETS].sort(compareKey);
