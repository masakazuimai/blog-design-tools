// ファイル・データカテゴリの追加分（共通ルールは status.js のヘッダーを参照）

import { DRAW, drawKeys, pulseKeys, bounceKeys, popInKeys, blinkKeys } from "./_shared.js?v=20260815b";

// ファイル本体の共通シルエット（折り返し付き）
const FILE_D = "M13.6 3.4H6.4a2 2 0 0 0-2 2v13.2a2 2 0 0 0 2 2h11.2a2 2 0 0 0 2-2V9.4z M13.6 3.4v6h6";

export const FILE_ICONS_2 = [
  {
    id: "file-add",
    cat: "file",
    label: { ja: "ファイル追加", en: "Add file" },
    parts: [
      { tag: "path", part: "body", attrs: { d: FILE_D } },
      { tag: "path", part: "plus", attrs: { d: "M12 12.4v5.2 M9.4 15h5.2" }, animAttrs: DRAW },
    ],
    anim: { duration: 1.3, easing: "ease-out", tracks: [
        // 小さな＋の描画だけでは変化が見えないため、本体も跳ねさせる
        { part: "body", origin: "12px 12px", keys: bounceKeys("Y", -1.6) },
        { part: "plus", keys: drawKeys(0.25, 0.75) },
      ],
    },
  },
  {
    id: "file-check",
    cat: "file",
    label: { ja: "ファイル確認済み", en: "File checked" },
    parts: [
      { tag: "path", part: "body", attrs: { d: FILE_D } },
      { tag: "path", part: "tick", attrs: { d: "M8.6 15 L10.8 17.2 L15.4 12.6" }, animAttrs: DRAW },
    ],
    anim: { duration: 1.3, easing: "ease-out", tracks: [
        { part: "body", origin: "12px 12px", keys: pulseKeys(1.1) },
        { part: "tick", keys: drawKeys(0.25, 0.8) },
      ],
    },
  },
  {
    id: "file-download",
    cat: "file",
    label: { ja: "ファイル保存", en: "Download file" },
    parts: [
      { tag: "path", part: "body", attrs: { d: FILE_D } },
      { tag: "path", part: "arrow", attrs: { d: "M12 12v4.6 M9.6 14.4 L12 16.8 L14.4 14.4" } },
    ],
    anim: { duration: 1.3, easing: "ease-in-out", tracks: [
        { part: "body", origin: "12px 12px", keys: pulseKeys(1.08) },
        { part: "arrow", origin: "12px 14px", keys: bounceKeys("Y", 2.2) },
      ],
    },
  },
  {
    id: "folder-add",
    cat: "file",
    label: { ja: "フォルダ追加", en: "New folder" },
    parts: [
      { tag: "path", part: "body", attrs: { d: "M3.4 6.4a2 2 0 0 1 2-2h4.2l2 2.6h7a2 2 0 0 1 2 2v9.6a2 2 0 0 1-2 2H5.4a2 2 0 0 1-2-2z" } },
      { tag: "path", part: "plus", attrs: { d: "M12 10.4v5.2 M9.4 13h5.2" }, animAttrs: DRAW },
    ],
    anim: { duration: 1.3, easing: "ease-out", tracks: [
        { part: "body", origin: "12px 12px", keys: bounceKeys("Y", -1.6) },
        { part: "plus", keys: drawKeys(0.25, 0.75) },
      ],
    },
  },
  {
    id: "pdf",
    cat: "file",
    label: { ja: "PDF", en: "PDF" },
    parts: [
      { tag: "path", part: "body", attrs: { d: FILE_D } },
      { tag: "path", part: "mark", attrs: { d: "M8.4 17.6v-4.4h1.6a1.4 1.4 0 0 1 0 2.8H8.4 M12.6 17.6v-4.4h1.2a2.2 2.2 0 0 1 0 4.4z" }, animAttrs: DRAW },
    ],
    anim: { duration: 1.5, easing: "ease-out", tracks: [{ part: "mark", keys: drawKeys(0.2, 0.8) }] },
  },
  {
    id: "zip",
    cat: "file",
    label: { ja: "ZIP", en: "ZIP" },
    parts: [
      { tag: "path", part: "body", attrs: { d: FILE_D } },
      { tag: "path", part: "teeth", attrs: { d: "M10.4 4h1.6 M10.4 6.4h1.6 M10.4 8.8h1.6 M10.4 11.2h1.6" } },
      { tag: "rect", part: "lock", attrs: { x: 9.6, y: 13.4, width: 3.2, height: 4, rx: 0.8 } },
    ],
    anim: {
      duration: 1.6,
      easing: "ease-out",
      tracks: [
        { part: "teeth", keys: blinkKeys(0.1) },
        { part: "lock", origin: "11.2px 15.4px", keys: popInKeys(0.45) },
      ],
    },
  },
  {
    id: "table",
    cat: "file",
    label: { ja: "テーブル", en: "Table" },
    parts: [
      { tag: "rect", part: "frame", attrs: { x: 3.4, y: 4.4, width: 17.2, height: 15.2, rx: 2 } },
      { tag: "path", part: "rows", attrs: { d: "M3.4 9.4h17.2 M3.4 14.6h17.2" }, animAttrs: DRAW },
      { tag: "path", part: "cols", attrs: { d: "M9.4 4.4v15.2 M15.4 4.4v15.2" }, animAttrs: DRAW },
    ],
    anim: {
      duration: 1.6,
      easing: "ease-out",
      tracks: [
        { part: "rows", keys: drawKeys(0.05, 0.5) },
        { part: "cols", keys: drawKeys(0.35, 0.8) },
      ],
    },
  },
  {
    id: "tag",
    cat: "file",
    label: { ja: "タグ", en: "Tag" },
    parts: [
      { tag: "path", part: "body", attrs: { d: "M11.4 3.6H4.6a1 1 0 0 0-1 1v6.8l9 9a1.4 1.4 0 0 0 2 0l6.4-6.4a1.4 1.4 0 0 0 0-2z" } },
      { tag: "path", part: "hole", attrs: { d: "M7.8 7.8 L7.8 7.81" } },
    ],
    anim: { duration: 1.3, easing: "ease-out", tracks: [{ part: ["body", "hole"], origin: "12px 12px", keys: pulseKeys(1.08) }] },
  },
  {
    id: "book",
    cat: "file",
    label: { ja: "本", en: "Book" },
    parts: [
      { tag: "path", part: "cover", attrs: { d: "M4.4 5.4a2 2 0 0 1 2-2H19v15.2H6.4a2 2 0 0 0-2 2z" } },
      { tag: "path", part: "pages", attrs: { d: "M19 18.6v2H6.4" } },
      { tag: "path", part: "line", attrs: { d: "M8.4 8h7.2 M8.4 11.4h5.2" }, animAttrs: DRAW },
    ],
    anim: { duration: 1.6, easing: "ease-out", tracks: [
        // ページがめくれるように表紙を傾ける
        {
          part: ["cover", "pages"],
          origin: "5.4px 12px",
          keys: [
            { at: 0, transform: "skewY(0deg)" },
            { at: 0.4, transform: "skewY(-3.5deg)" },
            { at: 0.8, transform: "skewY(0deg)" },
            { at: 1, transform: "skewY(0deg)" },
          ],
        },
        { part: "line", keys: drawKeys(0.25, 0.75) },
      ],
    },
  },
  {
    id: "notebook",
    cat: "file",
    label: { ja: "ノート", en: "Notebook" },
    parts: [
      { tag: "rect", part: "body", attrs: { x: 6.4, y: 3.4, width: 13.2, height: 17.2, rx: 2 } },
      { tag: "path", part: "rings", attrs: { d: "M4.4 7.4h4 M4.4 12h4 M4.4 16.6h4" } },
      { tag: "path", part: "lines", attrs: { d: "M11.4 8.6h5.2 M11.4 12h5.2 M11.4 15.4h3.2" }, animAttrs: DRAW },
    ],
    anim: { duration: 1.6, easing: "ease-out", tracks: [{ part: "lines", keys: drawKeys(0.2, 0.75) }] },
  },
  {
    id: "sticky",
    cat: "file",
    label: { ja: "付箋", en: "Sticky note" },
    parts: [
      { tag: "path", part: "body", attrs: { d: "M4.4 5.4a2 2 0 0 1 2-2h11.2a2 2 0 0 1 2 2v8.2l-6 6H6.4a2 2 0 0 1-2-2z" } },
      { tag: "path", part: "fold", attrs: { d: "M19.6 13.6h-4a2 2 0 0 0-2 2v4" } },
      { tag: "path", part: "lines", attrs: { d: "M8 8.4h8 M8 11.6h5.6" }, animAttrs: DRAW },
    ],
    anim: { duration: 1.5, easing: "ease-out", tracks: [{ part: "lines", keys: drawKeys(0.25, 0.75) }] },
  },
  {
    id: "cloud-upload",
    cat: "file",
    label: { ja: "クラウド保存", en: "Cloud upload" },
    parts: [
      { tag: "path", part: "cloud", attrs: { d: "M7.4 17.6a3.9 3.9 0 0 1 .4-7.8 6 6 0 0 1 11.2 1.2 3.4 3.4 0 0 1-.6 6.6" } },
      { tag: "path", part: "arrow", attrs: { d: "M12 20.4v-6.8 M9.6 15.8 L12 13.4 L14.4 15.8" } },
    ],
    anim: { duration: 1.3, easing: "ease-in-out", tracks: [{ part: "arrow", origin: "12px 17px", keys: bounceKeys("Y", -1.6) }] },
  },
  {
    id: "cloud-download",
    cat: "file",
    label: { ja: "クラウドから取得", en: "Cloud download" },
    parts: [
      { tag: "path", part: "cloud", attrs: { d: "M7.4 17.6a3.9 3.9 0 0 1 .4-7.8 6 6 0 0 1 11.2 1.2 3.4 3.4 0 0 1-.6 6.6" } },
      { tag: "path", part: "arrow", attrs: { d: "M12 13.4v6.8 M9.6 17.8 L12 20.2 L14.4 17.8" } },
    ],
    anim: { duration: 1.3, easing: "ease-in-out", tracks: [
        { part: "cloud", origin: "12px 12px", keys: bounceKeys("Y", -1.4) },
        { part: "arrow", origin: "12px 17px", keys: bounceKeys("Y", 2.2) },
      ],
    },
  },
  {
    id: "backup",
    cat: "file",
    label: { ja: "バックアップ", en: "Backup" },
    parts: [
      { tag: "ellipse", part: "top", attrs: { cx: 12, cy: 6.4, rx: 7, ry: 2.6 } },
      { tag: "path", part: "side", attrs: { d: "M5 6.4v10.4c0 1.4 3.1 2.6 7 2.6" } },
      { tag: "path", part: "arc", attrs: { d: "M19 6.4v5" } },
      { tag: "path", part: "refresh", attrs: { d: "M19.6 17.4a3.4 3.4 0 1 1-1-2.4" } },
      { tag: "path", part: "head", attrs: { d: "M19.6 12.6v2.6H17" } },
    ],
    anim: {
      duration: 1.6,
      easing: "ease-in-out",
      tracks: [{ part: ["refresh", "head"], origin: "17.6px 17px", keys: [
        { at: 0, transform: "rotate(0deg)" },
        { at: 1, transform: "rotate(360deg)" },
      ] }],
    },
  },
  {
    id: "history",
    cat: "file",
    label: { ja: "履歴", en: "History" },
    parts: [
      { tag: "path", part: "arc", attrs: { d: "M4.6 12a7.4 7.4 0 1 0 2.2-5.2" } },
      { tag: "path", part: "head", attrs: { d: "M4 4.4v3.6h3.6" } },
      { tag: "path", part: "hand", attrs: { d: "M12 8v4.4l3 1.8" } },
    ],
    anim: {
      duration: 1.8,
      easing: "ease-in-out",
      tracks: [
        {
          part: "hand",
          origin: "12px 12px",
          keys: [
            { at: 0, transform: "rotate(0deg)" },
            { at: 1, transform: "rotate(-360deg)" },
          ],
        },
      ],
    },
  },
  {
    id: "scan",
    cat: "file",
    label: { ja: "スキャン", en: "Scan" },
    parts: [
      { tag: "path", part: "corners", attrs: { d: "M3.6 8.4V5.4a1.8 1.8 0 0 1 1.8-1.8h3 M15.6 3.6h3a1.8 1.8 0 0 1 1.8 1.8v3 M20.4 15.6v3a1.8 1.8 0 0 1-1.8 1.8h-3 M8.4 20.4h-3a1.8 1.8 0 0 1-1.8-1.8v-3" } },
      { tag: "path", part: "beam", attrs: { d: "M5.4 12h13.2" } },
    ],
    anim: {
      duration: 1.8,
      easing: "ease-in-out",
      tracks: [
        {
          part: "beam",
          keys: [
            { at: 0, transform: "translateY(-4.4px)" },
            { at: 0.5, transform: "translateY(4.4px)" },
            { at: 1, transform: "translateY(-4.4px)" },
          ],
        },
      ],
    },
  },
];
