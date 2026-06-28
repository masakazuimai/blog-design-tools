// VS Code テンプレート
// 各項目は { cat: カテゴリID, label: data.js のラベル完全一致 }。

export const TEMPLATES = [
  {
    id: "staples",
    name: "定番セット",
    desc: "毎日使う基本",
    items: [
      { cat: "general", label: "コマンドパレットを開く" },
      { cat: "general", label: "ファイルへ移動（クイックオープン）" },
      { cat: "general", label: "サイドバーの表示／非表示" },
      { cat: "file", label: "保存" },
      { cat: "search", label: "検索" },
      { cat: "editing", label: "行コメントの切替" },
      { cat: "editing", label: "ドキュメントの整形（フォーマット）" },
    ],
  },
  {
    id: "fastedit",
    name: "爆速編集",
    desc: "行操作中心",
    items: [
      { cat: "editing", label: "行を下へ移動" },
      { cat: "editing", label: "行を上へ移動" },
      { cat: "editing", label: "行を下へ複製" },
      { cat: "editing", label: "行を削除" },
      { cat: "editing", label: "行コメントの切替" },
      { cat: "editing", label: "ドキュメントの整形（フォーマット）" },
    ],
  },
  {
    id: "multicursor",
    name: "マルチカーソル",
    desc: "複数選択・一括編集",
    items: [
      { cat: "cursor", label: "カーソルを追加" },
      { cat: "cursor", label: "上にカーソルを追加" },
      { cat: "cursor", label: "下にカーソルを追加" },
      { cat: "cursor", label: "次の同じ語を選択に追加" },
      { cat: "cursor", label: "同じ語をすべて選択" },
      { cat: "cursor", label: "現在の行を選択" },
    ],
  },
  {
    id: "reading",
    name: "コードを読む",
    desc: "移動・定義ジャンプ中心",
    items: [
      { cat: "general", label: "ファイルへ移動（クイックオープン）" },
      { cat: "navigation", label: "ファイル内のシンボルへ移動" },
      { cat: "navigation", label: "定義へ移動" },
      { cat: "navigation", label: "定義をその場で表示（Peek）" },
      { cat: "navigation", label: "参照を表示" },
      { cat: "search", label: "フォルダ全体を検索" },
    ],
  },
];
