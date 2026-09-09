// UI文言の辞書。/ と /en/ は同じcss/jsを共有し、htmlのlang属性で切り替える
export const lang = document.documentElement.lang === "en" ? "en" : "ja";

// {ja, en} 形式のラベルから現在の言語を取り出す
export function L(obj) { return (obj && obj[lang]) || (obj && obj.ja) || ""; }

const DICT = {
  ja: {
    loading: function (name, mb) { return name + " を読み込み中…（" + mb + "）"; },
    loadFailed: function (msg) { return "フォントの読み込みに失敗しました（" + msg + "）"; },
    drawFailed: function (msg) { return "描画に失敗しました：" + msg; },
    saveFailed: "書き出しに失敗しました",
    preview: function (w, h, n) { return "プレビュー：" + w + " × " + h + " px（" + n + "文字）"; },
    exportSize: function (scale, w, h) { return "／書き出し " + scale + "倍で " + w + " × " + h + " px"; },
    overflow: " ⚠ 文字がキャンバスからはみ出しています",
    shrunk: function (size) { return "／自動縮小: 文字サイズ " + size; }
  },
  en: {
    loading: function (name, mb) { return "Loading " + name + "… (" + mb + ")"; },
    loadFailed: function (msg) { return "Failed to load the font (" + msg + ")"; },
    drawFailed: function (msg) { return "Failed to render: " + msg; },
    saveFailed: "Failed to export the image",
    preview: function (w, h, n) { return "Preview: " + w + " × " + h + " px (" + n + " characters)"; },
    exportSize: function (scale, w, h) { return " / Export at " + scale + "×: " + w + " × " + h + " px"; },
    overflow: " ⚠ The text overflows the canvas",
    shrunk: function (size) { return " / Auto-shrink: font size " + size; }
  }
};

export const T = DICT[lang];
