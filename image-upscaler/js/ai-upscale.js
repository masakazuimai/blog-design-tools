
const LIB_URL = 'https://cdn.jsdelivr.net/npm/@huggingface/transformers@4.2.0';

export const AI_MODELS = {
  2: { id: 'Xenova/swin2SR-lightweight-x2-64', scale: 2, sizeMB: 7.7, msPerInputMP: 24000 },
  4: { id: 'Xenova/swin2SR-realworld-sr-x4-64-bsrgan-psnr', scale: 4, sizeMB: 50.3, msPerInputMP: 90000 }
};

export const AI_SCALES = [2, 4];

const TILE = 256;
const OVERLAP = 16;

export function webgpuAvailable() {
  return typeof navigator !== 'undefined' && 'gpu' in navigator;
}

let libPromise = null;
function loadLib() {
  if (!libPromise) libPromise = import( LIB_URL);
  return libPromise;
}

const pipelines = new Map();

async function getPipeline(scale, onDownload) {
  if (pipelines.has(scale)) return pipelines.get(scale);
  const lib = await loadLib();
  const model = AI_MODELS[scale];
  const p = await lib.pipeline('image-to-image', model.id, {
    device: 'webgpu',
    dtype: 'fp32',
    progress_callback: (info) => {
      if (onDownload && info.status === 'progress' && info.file && info.file.endsWith('.onnx')) {
        onDownload(Math.min(1, (info.progress || 0) / 100));
      }
    }
  });
  pipelines.set(scale, p);
  return p;
}

export function isModelLoaded(scale) {
  return pipelines.has(scale);
}

export function estimateSeconds(srcW, srcH, scale) {
  const mp = (srcW * srcH) / 1000000;
  return (mp * AI_MODELS[scale].msPerInputMP) / 1000;
}

function cropImageData(src, srcW, x0, y0, w, h) {
  const out = new Uint8ClampedArray(w * h * 4);
  for (let y = 0; y < h; y++) {
    const s = ((y0 + y) * srcW + x0) * 4;
    out.set(src.subarray(s, s + w * 4), y * w * 4);
  }
  return out;
}

export async function aiUpscale({ data, width, height, scale, onProgress }) {
  if (!webgpuAvailable()) throw new Error('WEBGPU_UNAVAILABLE');
  const model = AI_MODELS[scale];
  if (!model) throw new Error('UNSUPPORTED_SCALE');

  const lib = await loadLib();
  const pipe = await getPipeline(scale, (r) => onProgress && onProgress('download', r));

  const outW = width * scale;
  const outH = height * scale;
  const out = new Uint8ClampedArray(outW * outH * 4);
  out.fill(255);

  const cols = Math.ceil(width / TILE);
  const rows = Math.ceil(height / TILE);
  const total = cols * rows;
  let done = 0;

  for (let ty = 0; ty < rows; ty++) {
    for (let tx = 0; tx < cols; tx++) {
      const x = tx * TILE;
      const y = ty * TILE;
      const sx0 = Math.max(0, x - OVERLAP);
      const sy0 = Math.max(0, y - OVERLAP);
      const sx1 = Math.min(width, x + TILE + OVERLAP);
      const sy1 = Math.min(height, y + TILE + OVERLAP);
      const cw = sx1 - sx0;
      const ch = sy1 - sy0;

      const tileRGBA = cropImageData(data, width, sx0, sy0, cw, ch);
      const rawTile = new lib.RawImage(tileRGBA, cw, ch, 4).rgb();
      const res = await pipe(rawTile);
      const resRGBA = res.rgba();

      const rW = res.width;

      const ox = (x - sx0) * scale;
      const oy = (y - sy0) * scale;
      const ow = Math.min(TILE, width - x) * scale;
      const oh = Math.min(TILE, height - y) * scale;

      for (let row = 0; row < oh; row++) {
        const s = ((oy + row) * rW + ox) * 4;
        const d = ((y * scale + row) * outW + x * scale) * 4;
        out.set(resRGBA.data.subarray(s, s + ow * 4), d);
      }

      done++;
      if (onProgress) onProgress('infer', done / total);
      await new Promise((r) => setTimeout(r, 0));
    }
  }

  return { data: out, width: outW, height: outH };
}
