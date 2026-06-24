// JSで生成する文字列の多言語辞書。HTMLの静的テキストは各シェルに直書きする。
const DICT = {
  ja: {
    searchPlaceholder: "色名・読み・HEX で検索（例：茜、あかね、#dc143c、crimson）",
    catAll: "すべて",
    catJa: "日本の伝統色",
    catCss: "CSS名",
    resultCount: (n) => `${n} 色`,
    noResult: "該当する色が見つかりませんでした。検索語や絞り込みを変えてお試しください。",
    copyHex: "HEXをコピー",
    copied: "コピーしました",
    origin: "名前の由来",
    meaning: "色の意味・使いどころ",
    pairing: "相性のよい配色",
    contrast: "白／黒とのコントラスト",
    onWhite: "白背景",
    onBlack: "黒背景",
    catLabelJa: "伝統色",
    catLabelCss: "CSS",
    close: "閉じる",
    copyValue: "クリックでコピー",
    aliasLabel: "別名（英綴り）",
  },
  en: {
    searchPlaceholder: "Search by name or HEX (e.g. crimson, #dc143c, akane)",
    catAll: "All",
    catJa: "Japanese",
    catCss: "CSS names",
    resultCount: (n) => `${n} colors`,
    noResult: "No colors matched. Try a different keyword or filter.",
    copyHex: "Copy HEX",
    copied: "Copied",
    origin: "Origin of the name",
    meaning: "Meaning & usage",
    pairing: "Suggested pairing",
    contrast: "Contrast vs white / black",
    onWhite: "On white",
    onBlack: "On black",
    catLabelJa: "Traditional",
    catLabelCss: "CSS",
    close: "Close",
    copyValue: "Click to copy",
    aliasLabel: "Also spelled",
  },
};

const lang = document.documentElement.lang === "en" ? "en" : "ja";
export const t = DICT[lang];
export const LANG = lang;
