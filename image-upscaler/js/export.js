/* 保存形式ごとのエンコード。
   JPEG / PNG / WebP はブラウザ標準の canvas.toBlob で足りる。
   AVIF だけは toBlob が非対応（PNG に化ける）ため、image-compressor と同じ jSquash の WASM を
   選ばれたときにだけ読み込む。 */

const AVIF_MODULE_URL = 'https://esm.sh/@jsquash/avif@2';

export const FORMATS = {
  png:  { mime: 'image/png',  ext: 'png',  quality: undefined },
  jpeg: { mime: 'image/jpeg', ext: 'jpg',  quality: 0.92 },
  webp: { mime: 'image/webp', ext: 'webp', quality: 0.9 },
  avif: { mime: 'image/avif', ext: 'avif', quality: 60 }
};

let avifModulePromise = null;
function loadAvif() {
  if (!avifModulePromise) avifModulePromise = import(/* @vite-ignore */ AVIF_MODULE_URL);
  return avifModulePromise;
}

function canvasToBlob(canvas, mime, quality) {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) return reject(new Error('ENCODE_FAILED'));
      // 未対応形式だと別の MIME で返ってくるので、その場合は失敗として扱う
      if (blob.type !== mime) return reject(new Error('FORMAT_UNSUPPORTED'));
      resolve(blob);
    }, mime, quality);
  });
}

async function encodeAvif(canvas) {
  const { encode } = await loadAvif();
  const ctx = canvas.getContext('2d');
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  // AVIF はエンコードが重いので速度優先（画質への影響は小さい）
  const buffer = await encode(imageData, { quality: FORMATS.avif.quality, speed: 7 });
  return new Blob([buffer], { type: FORMATS.avif.mime });
}

/**
 * canvas を指定形式の Blob にする。
 * @param {HTMLCanvasElement} canvas
 * @param {'png'|'jpeg'|'webp'|'avif'} format
 */
export async function encodeCanvas(canvas, format) {
  const f = FORMATS[format];
  if (!f) throw new Error('FORMAT_UNSUPPORTED');
  if (format === 'avif') return encodeAvif(canvas);
  return canvasToBlob(canvas, f.mime, f.quality);
}

/* 入力ファイルの MIME から既定の保存形式を決める。元と同じ形式で返すのが自然なため */
export function formatFromMime(mime) {
  if (mime === 'image/jpeg') return 'jpeg';
  if (mime === 'image/webp') return 'webp';
  if (mime === 'image/avif') return 'avif';
  return 'png';
}
