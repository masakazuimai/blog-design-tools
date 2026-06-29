// 言語判定と、JSで生成する文字列だけの辞書。
// HTML静的テキストは各シェル（index.html / en/index.html）に直書きする。
export const LANG = document.documentElement.lang === "en" ? "en" : "ja";

const DICT = {
  ja: {
    copyDone: "CSSをコピーしました",
    pngSaved: "PNG画像を書き出しました",
    swatchJa: "日本の伝統色",
    swatchCss: "CSS名前付き色",
    swatchSearch: "色名・読み・HEX で検索",
    swatchLoading: "色の辞書を読み込み中…",
    swatchError: "色データを読み込めませんでした",
    catAll: "すべて",
    typeLinear: "線形",
    typeRadial: "放射",
    typeConic: "扇形",
    newCreate: "新規作成",
    newDesc: "白紙から作る",
    countSuffix: "件のプリセット",
    noResult: "該当するプリセットがありません",
  },
  en: {
    copyDone: "CSS copied",
    pngSaved: "PNG image exported",
    swatchJa: "Japanese traditional colors",
    swatchCss: "CSS named colors",
    swatchSearch: "Search by name or HEX",
    swatchLoading: "Loading Color Dictionary…",
    swatchError: "Could not load color data",
    catAll: "All",
    typeLinear: "Linear",
    typeRadial: "Radial",
    typeConic: "Conic",
    newCreate: "New gradient",
    newDesc: "Start from scratch",
    countSuffix: " presets",
    noResult: "No matching presets",
  },
};

export const t = DICT[LANG];
