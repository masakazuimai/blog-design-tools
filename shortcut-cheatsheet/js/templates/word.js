// Word テンプレート
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
      { cat: "font", label: "太字" },
      { cat: "basic", label: "検索" },
      { cat: "basic", label: "すべて選択" },
      { cat: "basic", label: "印刷" },
    ],
  },
  {
    id: "decorate",
    name: "文字装飾",
    desc: "太字・サイズ・書式コピー",
    items: [
      { cat: "font", label: "太字" },
      { cat: "font", label: "斜体" },
      { cat: "font", label: "下線" },
      { cat: "font", label: "フォントサイズを大きく" },
      { cat: "font", label: "書式のコピー" },
      { cat: "font", label: "書式の貼り付け" },
      { cat: "font", label: "書式をクリア（標準に戻す）" },
      { cat: "font", label: "大文字／小文字の切り替え" },
    ],
  },
  {
    id: "layout",
    name: "レイアウト・段落",
    desc: "揃える・インデント・改ページ",
    items: [
      { cat: "paragraph", label: "左揃え" },
      { cat: "paragraph", label: "中央揃え" },
      { cat: "paragraph", label: "右揃え" },
      { cat: "paragraph", label: "両端揃え" },
      { cat: "paragraph", label: "インデントを増やす" },
      { cat: "insert", label: "改ページ" },
      { cat: "style", label: "見出し1" },
    ],
  },
  {
    id: "writing",
    name: "文書作成",
    desc: "見出し・リンク・校正",
    items: [
      { cat: "insert", label: "ハイパーリンクを挿入" },
      { cat: "insert", label: "スペルチェック／文章校正" },
      { cat: "insert", label: "改ページ" },
      { cat: "style", label: "見出し1" },
      { cat: "style", label: "見出し2" },
      { cat: "style", label: "箇条書きリスト" },
    ],
  },
];
