
const AVIF_MODULE_URL = 'https://esm.sh/@jsquash/avif@2';

export const FORMATS = {
  png:  { mime: 'image/png',  ext: 'png',  quality: undefined },
  jpeg: { mime: 'image/jpeg', ext: 'jpg',  quality: 0.92 },
  webp: { mime: 'image/webp', ext: 'webp', quality: 0.9 },
  avif: { mime: 'image/avif', ext: 'avif', quality: 60 }
};

let avifModulePromise = null;
function loadAvif() {
  if (!avifModulePromise) avifModulePromise = import( AVIF_MODULE_URL);
  return avifModulePromise;
}

function canvasToBlob(canvas, mime, quality) {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) return reject(new Error('ENCODE_FAILED'));
      if (blob.type !== mime) return reject(new Error('FORMAT_UNSUPPORTED'));
      resolve(blob);
    }, mime, quality);
  });
}

async function encodeAvif(canvas) {
  const { encode } = await loadAvif();
  const ctx = canvas.getContext('2d');
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const buffer = await encode(imageData, { quality: FORMATS.avif.quality, speed: 7 });
  return new Blob([buffer], { type: FORMATS.avif.mime });
}

export async function encodeCanvas(canvas, format) {
  const f = FORMATS[format];
  if (!f) throw new Error('FORMAT_UNSUPPORTED');
  if (format === 'avif') return encodeAvif(canvas);
  return canvasToBlob(canvas, f.mime, f.quality);
}

export function formatFromMime(mime) {
  if (mime === 'image/jpeg') return 'jpeg';
  if (mime === 'image/webp') return 'webp';
  if (mime === 'image/avif') return 'avif';
  return 'png';
}
