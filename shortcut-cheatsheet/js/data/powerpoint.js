// PowerPoint ショートカットキー データ（Microsoft 標準ショートカット準拠 / Windows 基準）
// keys: トークン配列。'mod'=⌘/Ctrl, 'alt'=⌥/Alt, 'shift'=⇧/Shift、それ以外はそのまま表示。
// Mac では mod=⌘。一部 Mac 固有の差異あり。

export const CATEGORIES = [
  {
    id: "basic",
    name: "基本・編集",
    items: [
      { keys: ["mod", "N"], label: "新規プレゼンテーション" },
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
      { keys: ["mod", "D"], label: "オブジェクト／スライドを複製" },
    ],
  },
  {
    id: "slide",
    name: "スライド操作",
    items: [
      { keys: ["mod", "M"], label: "新しいスライド" },
      { keys: ["mod", "shift", "D"], label: "スライドを複製" },
      { keys: ["Tab"], label: "次のオブジェクトを選択" },
      { keys: ["shift", "Tab"], label: "前のオブジェクトを選択" },
      { keys: ["Esc"], label: "選択を解除" },
    ],
  },
  {
    id: "font",
    name: "文字・書式",
    items: [
      { keys: ["mod", "B"], label: "太字" },
      { keys: ["mod", "I"], label: "斜体" },
      { keys: ["mod", "U"], label: "下線" },
      { keys: ["mod", "shift", ">"], label: "フォントサイズを大きく" },
      { keys: ["mod", "shift", "<"], label: "フォントサイズを小さく" },
      { keys: ["mod", "shift", "C"], label: "書式のコピー" },
      { keys: ["mod", "shift", "V"], label: "書式の貼り付け" },
      { keys: ["mod", "T"], label: "フォントダイアログを開く" },
    ],
  },
  {
    id: "paragraph",
    name: "段落・整列",
    items: [
      { keys: ["mod", "L"], label: "左揃え" },
      { keys: ["mod", "E"], label: "中央揃え" },
      { keys: ["mod", "R"], label: "右揃え" },
      { keys: ["mod", "J"], label: "両端揃え" },
      { keys: ["Tab"], label: "箇条書きのレベルを下げる" },
      { keys: ["shift", "Tab"], label: "箇条書きのレベルを上げる" },
    ],
  },
  {
    id: "object",
    name: "オブジェクト",
    items: [
      { keys: ["mod", "G"], label: "グループ化" },
      { keys: ["mod", "shift", "G"], label: "グループ解除" },
      { keys: ["F4"], label: "直前の操作を繰り返す" },
      { keys: ["矢印"], label: "オブジェクトを移動（矢印キー）" },
      { keys: ["mod", "矢印"], label: "オブジェクトを少しずつ移動" },
    ],
  },
  {
    id: "show",
    name: "スライドショー",
    items: [
      { keys: ["F5"], label: "スライドショーを最初から開始" },
      { keys: ["shift", "F5"], label: "現在のスライドから開始" },
      { keys: ["Esc"], label: "スライドショーを終了" },
      { keys: ["N"], label: "次のスライドへ進む" },
      { keys: ["P"], label: "前のスライドへ戻る" },
      { keys: ["B"], label: "画面を黒くする" },
      { keys: ["W"], label: "画面を白くする" },
    ],
  },
];
