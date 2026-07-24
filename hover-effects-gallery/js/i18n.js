// UI文字列の多言語辞書。<html lang> で言語を切り替える
// エフェクト個別のラベルは js/effects/ 内の定義（label: {ja, en}）に持たせ、ここではUI文言のみ扱う

const dict = {
  ja: {
    catLabels: {
      all: "すべて",
      underline: "下線",
      border: "ボーダー",
      background: "背景",
      text: "テキスト",
      threed: "3D",
      nav: "ナビ装飾",
      glow: "発光・影",
      transform: "変形",
      fx: "エフェクト",
    },
    countNote: (total, shown) => "全 " + total + " 種類 / 表示中 " + shown + " 種類",
    copied: "✓ コピー",
    copiedToast: (label) => label + "をコピーしました",
    copyFailed: "コピーに失敗しました",
    labelCode: "コード",
  },
  en: {
    catLabels: {
      all: "All",
      underline: "Underline",
      border: "Border",
      background: "Background",
      text: "Text",
      threed: "3D",
      nav: "Nav accent",
      glow: "Glow & shadow",
      transform: "Transform",
      fx: "Effects",
    },
    countNote: (total, shown) => shown + " of " + total + " shown",
    copied: "✓ Copied",
    copiedToast: (label) => "Copied " + label,
    copyFailed: "Copy failed",
    labelCode: "code",
  },
};

export const lang = document.documentElement.lang === "en" ? "en" : "ja";
export const t = dict[lang];
