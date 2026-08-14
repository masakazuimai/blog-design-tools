// ファイルのダウンロード共通処理
//
// アンカーをDOMに挿入してからclickし、revokeObjectURL は遅延させる。
// 未挿入のclickや同期revokeは一部環境でダウンロードが発火しない／中断されるため。

import { t } from "./i18n.js?v=20260814f";

export function downloadBlob(blob, filename) {
  if (!blob) throw new Error(t("buildFailed"));

  // SVGやPNGは本来のMIMEのまま渡すとブラウザが「表示できる形式」と判断し、
  // 保存ではなくインライン表示に回して download 属性のファイル名（＝拡張子）を捨てる環境がある。
  // 中身を解釈させないよう octet-stream で渡し、ファイル名は download 属性に委ねる
  const url = URL.createObjectURL(new Blob([blob], { type: "application/octet-stream" }));
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.rel = "noopener";
  anchor.style.display = "none";
  document.body.appendChild(anchor);
  anchor.click();

  setTimeout(() => {
    anchor.remove();
    URL.revokeObjectURL(url);
  }, 1000);
}

export function downloadText(text, filename) {
  downloadBlob(new Blob([text]), filename);
}
