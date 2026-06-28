// Excel テンプレート
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
      { cat: "basic", label: "セルを編集" },
      { cat: "format", label: "セルの書式設定" },
      { cat: "format", label: "太字" },
      { cat: "basic", label: "検索" },
      { cat: "move", label: "先頭セル（A1）へ移動" },
    ],
  },
  {
    id: "table",
    name: "表作成・書式",
    desc: "罫線・表示形式・テーブル",
    items: [
      { cat: "format", label: "セルの書式設定" },
      { cat: "format", label: "外枠罫線をつける" },
      { cat: "format", label: "桁区切りスタイル" },
      { cat: "format", label: "通貨表示形式" },
      { cat: "format", label: "太字" },
      { cat: "rowcol", label: "セル・行・列を挿入" },
      { cat: "formula", label: "テーブルを作成" },
    ],
  },
  {
    id: "data",
    name: "データ集計",
    desc: "フィルター・参照・グラフ",
    items: [
      { cat: "formula", label: "フィルターのオン／オフ" },
      { cat: "formula", label: "テーブルを作成" },
      { cat: "formula", label: "参照の絶対／相対を切り替え" },
      { cat: "move", label: "データの下端へ移動" },
      { cat: "move", label: "下端まで選択" },
      { cat: "formula", label: "グラフを作成（同じシート）" },
    ],
  },
  {
    id: "input",
    name: "入力効率化",
    desc: "高速入力・日付・コピー",
    items: [
      { cat: "basic", label: "セルを編集" },
      { cat: "basic", label: "選択範囲に一括入力" },
      { cat: "basic", label: "セル内で改行" },
      { cat: "basic", label: "今日の日付を入力" },
      { cat: "basic", label: "上のセルの内容をコピー" },
      { cat: "basic", label: "左のセルの内容をコピー" },
    ],
  },
];
