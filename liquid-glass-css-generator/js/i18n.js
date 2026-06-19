// JS生成文字列のみ辞書化（静的HTMLテキストは各シェルに直書き）
export const I18N = {
  ja: {
    copied: "コピーしました",
    copyHtml: "HTMLをコピー",
    copyCss: "CSSをコピー",
    supported: "✓ このブラウザはライブ屈折に対応しています（Chrome / Edge）",
    fallback: "ⓘ このブラウザは屈折に非対応のため、ぼかし＋ティント表示に自動で切り替わっています（Safari / Firefox）。崩れません",
  },
  en: {
    copied: "Copied",
    copyHtml: "Copy HTML",
    copyCss: "Copy CSS",
    supported: "✓ This browser supports live refraction (Chrome / Edge)",
    fallback: "ⓘ This browser doesn't support refraction, so it falls back to blur + tint (Safari / Firefox). Nothing breaks",
  },
};

export function getLang() {
  return document.documentElement.lang === "en" ? "en" : "ja";
}
