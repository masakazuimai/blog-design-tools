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

// コピーコード・プレビュー内のCSSコメント対訳。
// エフェクト定義（js/effects/）は日本語コメントで共有し、enページでは main.js がこの表で差し替える
export const CSS_COMMENT_EN = {
  "/* 左から入って、外すと右へ抜ける */": "/* Slides in from the left, exits to the right */",
  "/* グレー下線が右へ抜け、アクセント下線が左から入る */": "/* The gray underline exits right while the accent underline slides in from the left */",
  "/* 上線は左から・下線は右から伸びる */": "/* Top line grows from the left, bottom line from the right */",
  "/* ::before が上→右、::after が下→左の順に描く */": "/* ::before draws top then right, ::after draws bottom then left */",
  "/* @property 対応ブラウザ（Chrome/Edge/Safari/Firefox 最新）で動作 */": "/* Requires @property support (recent Chrome / Edge / Safari / Firefox) */",
  "/* 上線は左から・下線は右から＝すれ違うように現れる */": "/* Top line from the left, bottom from the right — they cross as they appear */",
  "/* @property 対応ブラウザで動作 */": "/* Requires @property support */",
  "/* 12px*2/sin(45deg)＝1周期分 */": "/* 12px*2/sin(45deg) = one stripe cycle */",
  "/* data-text 属性の複製テキストが下に控えていて、ホバーで一緒にせり上がる */": "/* A duplicate from the data-text attribute waits below and rolls up on hover */",
  "/* 暗い背景向け */": "/* For dark backgrounds */",
  "/* 可変フォント（variable font）読み込み時に太さが滑らかに変化する */": "/* Weight animates smoothly when a variable font is loaded */",
  "/* data-text の複製がアクセント色で重なり、斜めのクリップで塗り替わる */": "/* An accent-colored duplicate (data-text) is revealed by a diagonal clip-path */",
  "/* box-shadow の複数指定で粒を配置し、ホバーで一斉に飛び散らせる */": "/* Particles are placed with multiple box-shadows and burst out on hover */",
};

export const lang = document.documentElement.lang === "en" ? "en" : "ja";
export const t = dict[lang];
