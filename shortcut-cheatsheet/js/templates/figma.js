// Figma デザイナーテンプレート
// 各項目は { cat: カテゴリID, label: data.js のラベル完全一致 }。

export const TEMPLATES = [
  {
    id: "staples",
    name: "定番セット",
    desc: "どの作業でも使う基本",
    items: [
      { cat: "tools", label: "移動ツール" },
      { cat: "tools", label: "フレームツール" },
      { cat: "tools", label: "長方形" },
      { cat: "tools", label: "テキスト" },
      { cat: "arrange", label: "グループ化" },
      { cat: "edit", label: "複製" },
      { cat: "edit", label: "取り消し" },
      { cat: "arrange", label: "最前面へ" },
      { cat: "view", label: "UIの表示／非表示" },
      { cat: "view", label: "全体をズーム（Zoom to fit）" },
    ],
  },
  {
    id: "uidesign",
    name: "UIデザイン",
    desc: "フレーム・コンポーネント中心",
    items: [
      { cat: "tools", label: "フレームツール" },
      { cat: "tools", label: "長方形" },
      { cat: "tools", label: "テキスト" },
      { cat: "arrange", label: "フレーム化（選択範囲をフレーム）" },
      { cat: "align", label: "左揃え" },
      { cat: "align", label: "水平方向中央揃え" },
      { cat: "component", label: "コンポーネントを作成" },
      { cat: "component", label: "インスタンスをデタッチ" },
      { cat: "arrange", label: "ロック／ロック解除" },
    ],
  },
  {
    id: "alignment",
    name: "整列・配置",
    desc: "そろえる・重ね順中心",
    items: [
      { cat: "align", label: "左揃え" },
      { cat: "align", label: "右揃え" },
      { cat: "align", label: "水平方向中央揃え" },
      { cat: "align", label: "上揃え" },
      { cat: "align", label: "下揃え" },
      { cat: "align", label: "垂直方向中央揃え" },
      { cat: "arrange", label: "前面へ" },
      { cat: "arrange", label: "背面へ" },
    ],
  },
  {
    id: "vector",
    name: "作図・ベクター",
    desc: "ペン・パス中心",
    items: [
      { cat: "tools", label: "ペンツール" },
      { cat: "tools", label: "鉛筆ツール" },
      { cat: "tools", label: "直線" },
      { cat: "arrange", label: "結合／フラット化" },
      { cat: "arrange", label: "アウトライン化（線をアウトライン）" },
      { cat: "tools", label: "拡大・縮小ツール" },
      { cat: "arrange", label: "グループ化" },
    ],
  },
];
