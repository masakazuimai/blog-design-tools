// 言語判定と、JSで生成する文字列だけの辞書。
// HTML静的テキストは各シェル（index.html / en/index.html）に直書きする。
export const LANG = document.documentElement.lang === "en" ? "en" : "ja";

const DICT = {
  ja: { copyDone: "コピーしました", copyLabel: "コードをコピー", loading: "読み込み中…" },
  en: { copyDone: "Copied!", copyLabel: "Copy code", loading: "Loading…" },
};

export const t = DICT[LANG];
