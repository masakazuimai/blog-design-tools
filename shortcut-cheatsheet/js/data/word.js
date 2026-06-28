// Word ショートカットキー データ（Microsoft 標準ショートカット準拠 / Windows 基準）
// keys: トークン配列。'mod'=⌘/Ctrl, 'alt'=⌥/Alt, 'shift'=⇧/Shift、それ以外はそのまま表示。
// Mac では mod=⌘。一部 Mac 固有の差異あり。

export const CATEGORIES = [
  {
    id: "basic",
    name: "基本・編集",
    items: [
      { keys: ["mod", "N"], label: "新規文書" },
      { keys: ["mod", "O"], label: "開く" },
      { keys: ["mod", "S"], label: "上書き保存" },
      { keys: ["mod", "P"], label: "印刷" },
      { keys: ["mod", "Z"], label: "元に戻す" },
      { keys: ["mod", "Y"], label: "繰り返し／やり直し" },
      { keys: ["mod", "C"], label: "コピー" },
      { keys: ["mod", "X"], label: "切り取り" },
      { keys: ["mod", "V"], label: "貼り付け" },
      { keys: ["mod", "alt", "V"], label: "形式を選択して貼り付け" },
      { keys: ["mod", "A"], label: "すべて選択" },
      { keys: ["mod", "F"], label: "検索" },
      { keys: ["mod", "H"], label: "置換" },
      { keys: ["mod", "G"], label: "指定ページへジャンプ" },
    ],
  },
  {
    id: "font",
    name: "文字書式",
    items: [
      { keys: ["mod", "B"], label: "太字" },
      { keys: ["mod", "I"], label: "斜体" },
      { keys: ["mod", "U"], label: "下線" },
      { keys: ["mod", "shift", "D"], label: "二重下線" },
      { keys: ["mod", "shift", ">"], label: "フォントサイズを大きく" },
      { keys: ["mod", "shift", "<"], label: "フォントサイズを小さく" },
      { keys: ["mod", "shift", "C"], label: "書式のコピー" },
      { keys: ["mod", "shift", "V"], label: "書式の貼り付け" },
      { keys: ["mod", "Space"], label: "書式をクリア（標準に戻す）" },
      { keys: ["shift", "F3"], label: "大文字／小文字の切り替え" },
      { keys: ["mod", "="], label: "下付き文字" },
      { keys: ["mod", "shift", "="], label: "上付き文字" },
    ],
  },
  {
    id: "paragraph",
    name: "段落",
    items: [
      { keys: ["mod", "L"], label: "左揃え" },
      { keys: ["mod", "E"], label: "中央揃え" },
      { keys: ["mod", "R"], label: "右揃え" },
      { keys: ["mod", "J"], label: "両端揃え" },
      { keys: ["mod", "1"], label: "行間を1行に" },
      { keys: ["mod", "2"], label: "行間を2行に" },
      { keys: ["mod", "5"], label: "行間を1.5行に" },
      { keys: ["mod", "M"], label: "インデントを増やす" },
      { keys: ["mod", "shift", "M"], label: "インデントを減らす" },
      { keys: ["mod", "Q"], label: "段落書式をクリア" },
    ],
  },
  {
    id: "style",
    name: "スタイル・見出し",
    items: [
      { keys: ["mod", "alt", "1"], label: "見出し1" },
      { keys: ["mod", "alt", "2"], label: "見出し2" },
      { keys: ["mod", "alt", "3"], label: "見出し3" },
      { keys: ["mod", "shift", "N"], label: "標準スタイル" },
      { keys: ["mod", "shift", "L"], label: "箇条書きリスト" },
    ],
  },
  {
    id: "insert",
    name: "挿入・校正",
    items: [
      { keys: ["mod", "K"], label: "ハイパーリンクを挿入" },
      { keys: ["mod", "Enter"], label: "改ページ" },
      { keys: ["shift", "Enter"], label: "段落内改行" },
      { keys: ["alt", "shift", "D"], label: "日付を挿入" },
      { keys: ["F7"], label: "スペルチェック／文章校正" },
      { keys: ["shift", "F7"], label: "類義語辞典" },
    ],
  },
  {
    id: "move",
    name: "移動・選択",
    items: [
      { keys: ["mod", "Home"], label: "文書の先頭へ移動" },
      { keys: ["mod", "End"], label: "文書の末尾へ移動" },
      { keys: ["mod", "→"], label: "単語単位で右へ移動" },
      { keys: ["mod", "←"], label: "単語単位で左へ移動" },
      { keys: ["mod", "shift", "→"], label: "単語単位で選択" },
    ],
  },
];
