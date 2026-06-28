// PowerPoint テンプレート
// 各項目は { cat: カテゴリID, label: data.js のラベル完全一致 }。

export const TEMPLATES = [
  {
    id: "staples",
    name: "定番セット",
    desc: "どの作業でも使う基本",
    items: [
      { cat: "basic", label: "コピー" },
      { cat: "basic", label: "貼り付け" },
      { cat: "basic", label: "元に戻す" },
      { cat: "basic", label: "上書き保存" },
      { cat: "basic", label: "オブジェクト／スライドを複製" },
      { cat: "slide", label: "新しいスライド" },
      { cat: "font", label: "太字" },
      { cat: "show", label: "スライドショーを最初から開始" },
    ],
  },
  {
    id: "create",
    name: "スライド作成",
    desc: "スライド追加・文字・複製",
    items: [
      { cat: "slide", label: "新しいスライド" },
      { cat: "slide", label: "スライドを複製" },
      { cat: "basic", label: "オブジェクト／スライドを複製" },
      { cat: "font", label: "太字" },
      { cat: "font", label: "フォントサイズを大きく" },
      { cat: "paragraph", label: "中央揃え" },
      { cat: "object", label: "グループ化" },
    ],
  },
  {
    id: "shapes",
    name: "図形・レイアウト",
    desc: "グループ・整列・複製",
    items: [
      { cat: "object", label: "グループ化" },
      { cat: "object", label: "グループ解除" },
      { cat: "basic", label: "オブジェクト／スライドを複製" },
      { cat: "paragraph", label: "左揃え" },
      { cat: "paragraph", label: "中央揃え" },
      { cat: "paragraph", label: "右揃え" },
    ],
  },
  {
    id: "present",
    name: "発表・スライドショー",
    desc: "開始・移動・黒画面",
    items: [
      { cat: "show", label: "スライドショーを最初から開始" },
      { cat: "show", label: "現在のスライドから開始" },
      { cat: "show", label: "次のスライドへ進む" },
      { cat: "show", label: "前のスライドへ戻る" },
      { cat: "show", label: "画面を黒くする" },
      { cat: "show", label: "スライドショーを終了" },
    ],
  },
];
