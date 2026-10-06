// ファイルのダウンロード（アンカーをDOMに追加・revokeを遅らせる・blob未生成のガード）
export const downloadBlob = (blob, filename) => {
  if (!blob) throw new Error("ファイルを作れませんでした");
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.style.display = "none";
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    a.remove();
    URL.revokeObjectURL(url);
  }, 1000);
};

export const downloadText = (text, filename, type) =>
  downloadBlob(new Blob([text], { type: `${type};charset=utf-8` }), filename);

// SVG文字列をPNGに変換して保存する（等倍の2倍で書き出し）
export const downloadSvgAsPng = (svgText, width, height, filename) => new Promise((resolve, reject) => {
  const img = new Image();
  const url = URL.createObjectURL(new Blob([svgText], { type: "image/svg+xml;charset=utf-8" }));
  img.onload = () => {
    const scale = 2;
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(width * scale);
    canvas.height = Math.round(height * scale);
    const ctx = canvas.getContext("2d");
    ctx.scale(scale, scale);
    ctx.drawImage(img, 0, 0, width, height);
    URL.revokeObjectURL(url);
    canvas.toBlob((blob) => {
      try {
        downloadBlob(blob, filename);
        resolve();
      } catch (err) {
        reject(err);
      }
    }, "image/png");
  };
  img.onerror = () => {
    URL.revokeObjectURL(url);
    reject(new Error("PNGに変換できませんでした"));
  };
  img.src = url;
});
