// JSが生成する文字列だけをここに集約する
// （HTMLに直接書かれた静的テキストは各シェル側 = index.html / en/index.html に持たせる）

export const LANG = document.documentElement.lang === "en" ? "en" : "ja";

const DICT = {
  ja: {
    all: "すべて",
    count: (shown, total) => `${total}種中 ${shown}種を表示中`,
    downloaded: "ダウンロードしました",
    buildFailed: "ファイルの生成に失敗しました",
    pngFailed: "PNGの生成に失敗しました。時間をおいて再度お試しください",
  },
  en: {
    all: "All",
    count: (shown, total) => `Showing ${shown} of ${total} icons`,
    downloaded: "Downloaded",
    buildFailed: "Could not create the file",
    pngFailed: "Could not create the PNG. Please try again in a moment",
  },
};

export function t(key, ...args) {
  const value = DICT[LANG][key];
  return typeof value === "function" ? value(...args) : value;
}
