// 用途テンプレート。キャンバスサイズと紙・ペン・組み方をまとめて設定する
// text は入れない（利用者が入力した文章を勝手に置き換えないため）
export const TEMPLATES = [
  { id: "free",     label: { ja: "フリー（自動サイズ）", en: "Free (auto size)" }, w: 0,    h: 0,
    dir: "h", paper: "rule",   pen: "ballpoint", size: 64, lh: 16, pad: 40, tilt: 10, wave: 8 },

  { id: "ogp",      label: { ja: "ブログのアイキャッチ 1200×630", en: "Blog cover 1200×630" }, w: 1200, h: 630,
    dir: "h", paper: "plain",  pen: "sign",      size: 96, lh: 18, pad: 80, tilt: 8,  wave: 6 },

  { id: "youtube",  label: { ja: "YouTubeサムネイル 1280×720", en: "YouTube thumbnail 1280×720" }, w: 1280, h: 720,
    dir: "h", paper: "plain",  pen: "marker",    size: 120, lh: 17, pad: 70, tilt: 12, wave: 8 },

  { id: "square",   label: { ja: "SNS正方形 1080×1080", en: "Social square 1080×1080" }, w: 1080, h: 1080,
    dir: "h", paper: "grid",   pen: "ballpoint", size: 88, lh: 20, pad: 90, tilt: 10, wave: 8 },

  { id: "quote",    label: { ja: "縦書きの引用 800×1200", en: "Vertical quote 800×1200" }, w: 800,  h: 1200,
    dir: "v", paper: "genko",  pen: "fountain",  size: 64, lh: 14, pad: 60, tilt: 6,  wave: 5 },

  { id: "thanks",   label: { ja: "サンクスカード 1050×600", en: "Thank-you card 1050×600" }, w: 1050, h: 600,
    dir: "h", paper: "plain",  pen: "fountain",  size: 72, lh: 19, pad: 70, tilt: 12, wave: 10 },

  { id: "sticky",   label: { ja: "付箋メモ 600×600", en: "Sticky memo 600×600" }, w: 600,  h: 600,
    dir: "h", paper: "sticky", pen: "marker",    size: 64, lh: 17, pad: 60, tilt: 14, wave: 12 },

  { id: "notebook", label: { ja: "ノートのメモ 1000×700", en: "Notebook memo 1000×700" }, w: 1000, h: 700,
    dir: "h", paper: "report", pen: "pencil",    size: 60, lh: 18, pad: 60, tilt: 12, wave: 10 },

  { id: "nameplate",label: { ja: "名札・見出し 600×300", en: "Name tag 600×300" }, w: 600,  h: 300,
    dir: "h", paper: "none",   pen: "sign",      size: 80, lh: 16, pad: 40, tilt: 6,  wave: 4 }
];

export function findTemplate(id) {
  return TEMPLATES.filter(function (t) { return t.id === id; })[0] || TEMPLATES[0];
}
