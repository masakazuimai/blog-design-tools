// Visual Studio Code ショートカットキー データ（VS Code 既定キー準拠）
// keys: トークン配列。'mod'=⌘/Ctrl, 'alt'=⌥/Alt, 'shift'=⇧/Shift、それ以外はそのまま表示。
// ⌃（Control）が Mac/Win で構造的に異なるもの（ターミナル切替 ⌃` 等）は混乱を避けるため割愛。

export const CATEGORIES = [
  {
    id: "general",
    name: "全般",
    items: [
      { keys: ["mod", "shift", "P"], label: "コマンドパレットを開く" },
      { keys: ["mod", "P"], label: "ファイルへ移動（クイックオープン）" },
      { keys: ["mod", ","], label: "設定を開く" },
      { keys: ["mod", "B"], label: "サイドバーの表示／非表示" },
      { keys: ["mod", "J"], label: "パネルの表示／非表示" },
      { keys: ["mod", "shift", "N"], label: "新しいウィンドウ" },
    ],
  },
  {
    id: "editing",
    name: "編集",
    items: [
      { keys: ["mod", "X"], label: "行を切り取り（未選択時）" },
      { keys: ["mod", "C"], label: "行をコピー（未選択時）" },
      { keys: ["alt", "↓"], label: "行を下へ移動" },
      { keys: ["alt", "↑"], label: "行を上へ移動" },
      { keys: ["shift", "alt", "↓"], label: "行を下へ複製" },
      { keys: ["shift", "alt", "↑"], label: "行を上へ複製" },
      { keys: ["mod", "shift", "K"], label: "行を削除" },
      { keys: ["mod", "Enter"], label: "下に行を挿入" },
      { keys: ["mod", "shift", "Enter"], label: "上に行を挿入" },
      { keys: ["mod", "/"], label: "行コメントの切替" },
      { keys: ["shift", "alt", "A"], label: "ブロックコメントの切替" },
      { keys: ["mod", "]"], label: "インデント" },
      { keys: ["mod", "["], label: "インデント解除" },
      { keys: ["shift", "alt", "F"], label: "ドキュメントの整形（フォーマット）" },
    ],
  },
  {
    id: "cursor",
    name: "カーソル・選択",
    items: [
      { keys: ["alt", "click"], label: "カーソルを追加" },
      { keys: ["mod", "alt", "↑"], label: "上にカーソルを追加" },
      { keys: ["mod", "alt", "↓"], label: "下にカーソルを追加" },
      { keys: ["mod", "D"], label: "次の同じ語を選択に追加" },
      { keys: ["mod", "shift", "L"], label: "同じ語をすべて選択" },
      { keys: ["mod", "L"], label: "現在の行を選択" },
      { keys: ["mod", "A"], label: "すべてを選択" },
      { keys: ["mod", "U"], label: "最後のカーソル操作を取り消し" },
    ],
  },
  {
    id: "navigation",
    name: "コード移動",
    items: [
      { keys: ["mod", "shift", "O"], label: "ファイル内のシンボルへ移動" },
      { keys: ["mod", "T"], label: "ワークスペースのシンボルを検索" },
      { keys: ["F12"], label: "定義へ移動" },
      { keys: ["alt", "F12"], label: "定義をその場で表示（Peek）" },
      { keys: ["shift", "F12"], label: "参照を表示" },
      { keys: ["mod", "shift", "M"], label: "問題パネルを表示" },
    ],
  },
  {
    id: "search",
    name: "検索・置換",
    items: [
      { keys: ["mod", "F"], label: "検索" },
      { keys: ["mod", "shift", "F"], label: "フォルダ全体を検索" },
      { keys: ["mod", "shift", "H"], label: "フォルダ全体を置換" },
    ],
  },
  {
    id: "file",
    name: "ファイル・エディタ",
    items: [
      { keys: ["mod", "N"], label: "新規ファイル" },
      { keys: ["mod", "S"], label: "保存" },
      { keys: ["mod", "shift", "S"], label: "名前を付けて保存" },
      { keys: ["mod", "W"], label: "エディタを閉じる" },
      { keys: ["mod", "shift", "T"], label: "閉じたエディタを再度開く" },
      { keys: ["mod", "1"], label: "エディタグループ1へ" },
      { keys: ["mod", "2"], label: "エディタグループ2へ" },
    ],
  },
  {
    id: "display",
    name: "表示",
    items: [
      { keys: ["mod", "shift", "E"], label: "エクスプローラー" },
      { keys: ["mod", "shift", "X"], label: "拡張機能" },
      { keys: ["mod", "="], label: "ズームイン" },
      { keys: ["mod", "-"], label: "ズームアウト" },
      { keys: ["alt", "Z"], label: "折り返しの切替（Word Wrap）" },
    ],
  },
];
