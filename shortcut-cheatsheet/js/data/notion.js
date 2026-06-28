// Notion ショートカットキー データ（Notion 既定キー準拠）
// keys: トークン配列。'mod'=⌘/Ctrl, 'alt'=⌥/Alt, 'shift'=⇧/Shift、それ以外はそのまま表示。

export const CATEGORIES = [
  {
    id: "general",
    name: "基本操作",
    items: [
      { keys: ["mod", "N"], label: "新規ページ（デスクトップ）" },
      { keys: ["mod", "shift", "N"], label: "新しいウィンドウ" },
      { keys: ["mod", "P"], label: "検索／クイック検索" },
      { keys: ["mod", "\\"], label: "サイドバーの開閉" },
      { keys: ["mod", "["], label: "前のページに戻る" },
      { keys: ["mod", "]"], label: "次のページに進む" },
      { keys: ["mod", "shift", "U"], label: "親ページへ移動" },
      { keys: ["mod", "shift", "L"], label: "ダークモード切替" },
    ],
  },
  {
    id: "edit",
    name: "編集",
    items: [
      { keys: ["mod", "Z"], label: "取り消し" },
      { keys: ["mod", "shift", "Z"], label: "やり直し" },
      { keys: ["mod", "X"], label: "切り取り" },
      { keys: ["mod", "C"], label: "コピー" },
      { keys: ["mod", "V"], label: "貼り付け" },
      { keys: ["mod", "D"], label: "ブロックを複製" },
      { keys: ["mod", "A"], label: "ブロック内を全選択（再度で全体）" },
    ],
  },
  {
    id: "blocks",
    name: "ブロック操作",
    items: [
      { keys: ["/"], label: "コマンドメニュー（スラッシュ）" },
      { keys: ["mod", "/"], label: "ブロックを編集（アクションメニュー）" },
      { keys: ["mod", "shift", "↑"], label: "ブロックを上へ移動" },
      { keys: ["mod", "shift", "↓"], label: "ブロックを下へ移動" },
      { keys: ["Tab"], label: "インデント（字下げ）" },
      { keys: ["shift", "Tab"], label: "インデント解除" },
      { keys: ["shift", "Enter"], label: "ブロック内で改行" },
    ],
  },
  {
    id: "format",
    name: "テキスト書式",
    items: [
      { keys: ["mod", "B"], label: "太字" },
      { keys: ["mod", "I"], label: "斜体" },
      { keys: ["mod", "U"], label: "下線" },
      { keys: ["mod", "shift", "S"], label: "打ち消し線" },
      { keys: ["mod", "E"], label: "インラインコード" },
      { keys: ["mod", "K"], label: "リンクを追加" },
      { keys: ["mod", "shift", "H"], label: "ハイライト（直前の色）" },
    ],
  },
  {
    id: "misc",
    name: "コメント・その他",
    items: [
      { keys: ["mod", "shift", "M"], label: "コメントを追加" },
    ],
  },
];
