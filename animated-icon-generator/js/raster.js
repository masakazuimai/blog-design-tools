// SVG文字列を PNG（透過）へラスタライズする
//
// アイコンは外部リソースもテキストも含まないため、data URI 経由で読み込んでも
// canvas は汚染されず toBlob() がそのまま使える。

import { t } from "./i18n.js?v=20260815a";

export async function renderPng(svgText, size) {
  const image = new Image();
  image.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgText)}`;

  try {
    await image.decode();
  } catch (error) {
    console.error("SVGの読み込みに失敗しました:", error);
    throw new Error(t("pngFailed"));
  }

  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  canvas.getContext("2d").drawImage(image, 0, 0, size, size);

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error(t("pngFailed")));
    }, "image/png");
  });
}
