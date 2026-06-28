// Notion テンプレート
// 各項目は { cat: カテゴリID, label: data.js のラベル完全一致 }。

export const TEMPLATES = [
  {
    id: "staples",
    name: "定番セット",
    desc: "毎日使う基本",
    items: [
      { cat: "general", label: "新規ページ（デスクトップ）" },
      { cat: "general", label: "検索／クイック検索" },
      { cat: "blocks", label: "コマンドメニュー（スラッシュ）" },
      { cat: "format", label: "太字" },
      { cat: "format", label: "リンクを追加" },
      { cat: "edit", label: "ブロックを複製" },
    ],
  },
  {
    id: "blocks",
    name: "ブロック操作",
    desc: "並べ替え・字下げ中心",
    items: [
      { cat: "blocks", label: "コマンドメニュー（スラッシュ）" },
      { cat: "blocks", label: "ブロックを編集（アクションメニュー）" },
      { cat: "blocks", label: "ブロックを上へ移動" },
      { cat: "blocks", label: "ブロックを下へ移動" },
      { cat: "blocks", label: "インデント（字下げ）" },
      { cat: "blocks", label: "インデント解除" },
      { cat: "edit", label: "ブロックを複製" },
    ],
  },
  {
    id: "format",
    name: "テキスト書式",
    desc: "装飾・コード・リンク",
    items: [
      { cat: "format", label: "太字" },
      { cat: "format", label: "斜体" },
      { cat: "format", label: "下線" },
      { cat: "format", label: "打ち消し線" },
      { cat: "format", label: "インラインコード" },
      { cat: "format", label: "リンクを追加" },
      { cat: "format", label: "ハイライト（直前の色）" },
    ],
  },
  {
    id: "navigation",
    name: "ページ移動",
    desc: "検索・行き来中心",
    items: [
      { cat: "general", label: "検索／クイック検索" },
      { cat: "general", label: "前のページに戻る" },
      { cat: "general", label: "次のページに進む" },
      { cat: "general", label: "親ページへ移動" },
      { cat: "general", label: "サイドバーの開閉" },
      { cat: "general", label: "ダークモード切替" },
      { cat: "general", label: "新規ページ（デスクトップ）" },
    ],
  },
];
