// 手書き系フォント定義（すべてOFLライセンス＝商用利用・再配布可）
const GF = "https://cdn.jsdelivr.net/gh/google/fonts@main/";

export const FONTS = [
  { id: "yomogi",    name: { ja: "Yomogi（ゆる手書き・日本語）", en: "Yomogi (casual, Japanese)" },     file: "ofl/yomogi/Yomogi-Regular.ttf" },
  { id: "kurenaido", name: { ja: "Zen Kurenaido（ペン字風・日本語）", en: "Zen Kurenaido (pen style, Japanese)" }, file: "ofl/zenkurenaido/ZenKurenaido-Regular.ttf" },
  { id: "yusei",     name: { ja: "Yusei Magic（マジック風・日本語）", en: "Yusei Magic (marker, Japanese)" }, file: "ofl/yuseimagic/YuseiMagic-Regular.ttf" },
  { id: "hachimaru", name: { ja: "Hachi Maru Pop（丸文字・日本語）", en: "Hachi Maru Pop (round, Japanese)" },  file: "ofl/hachimarupop/HachiMaruPop-Regular.ttf" },
  { id: "klee",      name: { ja: "Klee One（硬筆・楷書・日本語）", en: "Klee One (upright, Japanese)" },    file: "ofl/kleeone/KleeOne-Regular.ttf" },
  { id: "caveat",    name: { ja: "Caveat（英字）", en: "Caveat (Latin)" },                    file: "ofl/caveat/Caveat%5Bwght%5D.ttf" },
  { id: "indie",     name: { ja: "Indie Flower（英字）", en: "Indie Flower (Latin)" },              file: "ofl/indieflower/IndieFlower-Regular.ttf" },
  { id: "patrick",   name: { ja: "Patrick Hand（英字）", en: "Patrick Hand (Latin)" },              file: "ofl/patrickhand/PatrickHand-Regular.ttf" },
  { id: "architect", name: { ja: "Architects Daughter（英字）", en: "Architects Daughter (Latin)" },       file: "ofl/architectsdaughter/ArchitectsDaughter-Regular.ttf" },
  { id: "kalam",     name: { ja: "Kalam（英字）", en: "Kalam (Latin)" },                     file: "ofl/kalam/Kalam-Regular.ttf" }
];

const cache = {};

export function findFont(id) {
  return FONTS.filter(function (f) { return f.id === id; })[0] || FONTS[0];
}

// TTFを取得してopentype.jsでパースする（同じ書体は2回目以降キャッシュ）
export async function loadFont(id) {
  if (cache[id]) return cache[id];
  const meta = findFont(id);
  const res = await fetch(GF + meta.file);
  if (!res.ok) throw new Error("HTTP " + res.status);
  const buf = await res.arrayBuffer();
  cache[id] = window.opentype.parse(buf);
  return cache[id];
}
