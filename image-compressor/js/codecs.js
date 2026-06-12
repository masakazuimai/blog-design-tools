// 画像のデコード・描画・エンコード処理
// JPG/WebPはjSquash（WASM）優先、読み込み失敗時はCanvasにフォールバック
// PNGはUPNG.jsの減色圧縮を使用

const CDN_MODULES = {
  jpeg: 'https://esm.sh/@jsquash/jpeg@1',
  webp: 'https://esm.sh/@jsquash/webp@1',
}

const moduleCache = {}

function loadModule(kind) {
  if (!moduleCache[kind]) {
    moduleCache[kind] = import(CDN_MODULES[kind])
  }
  return moduleCache[kind]
}

export const EXT_MAP = { jpeg: 'jpg', png: 'png', webp: 'webp', svg: 'svg' }

export function detectFormat(mimeType) {
  if (mimeType === 'image/jpeg') return 'jpeg'
  if (mimeType === 'image/webp') return 'webp'
  // PNG以外の未対応形式（GIF・AVIF等）はPNGとして出力する
  return 'png'
}

export async function decodeToBitmap(file) {
  try {
    if (file.type === 'image/svg+xml') return await decodeSvg(file)
    return await createImageBitmap(file)
  } catch (error) {
    console.error('画像のデコードに失敗:', error)
    throw new Error('この画像は読み込めませんでした。対応形式か確認してください。')
  }
}

// SVGはcreateImageBitmap非対応のため、Image経由でCanvasにラスタライズする
async function decodeSvg(file) {
  const text = await file.text()
  const { w, h, explicit } = svgIntrinsicSize(text)
  const url = URL.createObjectURL(new Blob([text], { type: 'image/svg+xml' }))
  try {
    const img = await loadImage(url)
    const canvas = document.createElement('canvas')
    // サイズ属性のないSVGはブラウザ既定値（300×150等）になるため、viewBox基準の計算値を優先する
    canvas.width = explicit ? img.naturalWidth || w : w
    canvas.height = explicit ? img.naturalHeight || h : h
    const ctx = canvas.getContext('2d')
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
    return await createImageBitmap(canvas)
  } finally {
    URL.revokeObjectURL(url)
  }
}

// width/height属性 → viewBox（長辺1024pxに拡大） → 既定1024px の順でサイズを決める
function svgIntrinsicSize(text) {
  const width = text.match(/<svg[^>]*\swidth="(\d+(?:\.\d+)?)(?:px)?"/i)
  const height = text.match(/<svg[^>]*\sheight="(\d+(?:\.\d+)?)(?:px)?"/i)
  if (width && height) {
    return { w: Math.round(Number(width[1])), h: Math.round(Number(height[1])), explicit: true }
  }
  const viewBox = text.match(/<svg[^>]*\sviewBox="[\d.\s-]*?([\d.]+)\s+([\d.]+)"/i)
  if (viewBox) {
    const vw = Number(viewBox[1])
    const vh = Number(viewBox[2])
    const scale = 1024 / Math.max(vw, vh)
    return {
      w: Math.max(1, Math.round(vw * scale)),
      h: Math.max(1, Math.round(vh * scale)),
      explicit: false,
    }
  }
  return { w: 1024, h: 1024, explicit: false }
}

function loadImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error('SVGの読み込みに失敗しました。'))
    img.src = url
  })
}

// リサイズ計画に沿ってCanvasへ描画し、ImageDataを返す
export function renderImageData(bitmap, plan, format) {
  const canvas = document.createElement('canvas')
  canvas.width = plan.outW
  canvas.height = plan.outH
  const ctx = canvas.getContext('2d')

  // JPGは透過を持てないため白で下塗りする（円形マスク時は最後に白合成する）
  const bg = plan.bg ?? (format === 'jpeg' && !plan.circle ? '#ffffff' : null)
  if (bg) {
    ctx.fillStyle = bg
    ctx.fillRect(0, 0, plan.outW, plan.outH)
  }

  ctx.imageSmoothingEnabled = true
  ctx.imageSmoothingQuality = 'high'
  const d = plan.draw
  ctx.drawImage(bitmap, d.sx, d.sy, d.sw, d.sh, d.dx, d.dy, d.dw, d.dh)

  if (plan.circle) {
    // 出力枠に内接する楕円（正方形なら正円）の外側を透過にする
    ctx.globalCompositeOperation = 'destination-in'
    ctx.beginPath()
    ctx.ellipse(plan.outW / 2, plan.outH / 2, plan.outW / 2, plan.outH / 2, 0, 0, Math.PI * 2)
    ctx.fill()
    ctx.globalCompositeOperation = 'source-over'

    // JPGはアルファを持てないため白背景に合成し直す
    if (format === 'jpeg') {
      const flat = document.createElement('canvas')
      flat.width = plan.outW
      flat.height = plan.outH
      const flatCtx = flat.getContext('2d')
      flatCtx.fillStyle = '#ffffff'
      flatCtx.fillRect(0, 0, plan.outW, plan.outH)
      flatCtx.drawImage(canvas, 0, 0)
      return flatCtx.getImageData(0, 0, plan.outW, plan.outH)
    }
  }

  return ctx.getImageData(0, 0, plan.outW, plan.outH)
}

export async function encodeImage(format, imageData, quality) {
  if (format === 'jpeg') return encodeWithWasm('jpeg', 'image/jpeg', imageData, quality)
  if (format === 'webp') return encodeWithWasm('webp', 'image/webp', imageData, quality)
  if (format === 'png') return encodePng(imageData, quality)
  if (format === 'svg') return encodeSvg(imageData, quality)
  throw new Error(`未対応の出力形式です: ${format}`)
}

function encodeSvg(imageData, quality) {
  try {
    // 品質を色数に変換してベクタライズ（ロゴ・イラスト向き）
    const numberofcolors = quality >= 80 ? 16 : quality >= 60 ? 8 : quality >= 40 ? 6 : 4
    const svg = window.ImageTracer.imagedataToSVG(imageData, {
      numberofcolors,
      pathomit: 8,
      blurradius: 0,
    })
    return Promise.resolve(new Blob([svg], { type: 'image/svg+xml' }))
  } catch (error) {
    console.error('SVGベクタライズに失敗:', error)
    return Promise.reject(new Error('SVGへの変換に失敗しました。画像サイズを小さくして再試行してください。'))
  }
}

async function encodeWithWasm(kind, mimeType, imageData, quality) {
  try {
    const { encode } = await loadModule(kind)
    const buffer = await encode(imageData, { quality })
    return new Blob([buffer], { type: mimeType })
  } catch (error) {
    console.error(`${kind}のWASMエンコードに失敗したためCanvasにフォールバック:`, error)
    return canvasEncode(imageData, mimeType, quality / 100)
  }
}

function encodePng(imageData, quality) {
  try {
    // 品質を色数に変換して減色圧縮（90以上はロスレス）
    const cnum = quality >= 90 ? 0 : quality >= 70 ? 256 : quality >= 40 ? 128 : 64
    const buffer = window.UPNG.encode(
      [imageData.data.buffer],
      imageData.width,
      imageData.height,
      cnum,
    )
    return Promise.resolve(new Blob([buffer], { type: 'image/png' }))
  } catch (error) {
    console.error('PNGの減色圧縮に失敗したためCanvasにフォールバック:', error)
    return canvasEncode(imageData, 'image/png', 1)
  }
}

function canvasEncode(imageData, mimeType, quality) {
  const canvas = document.createElement('canvas')
  canvas.width = imageData.width
  canvas.height = imageData.height
  canvas.getContext('2d').putImageData(imageData, 0, 0)
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob)
        } else {
          reject(new Error('画像のエンコードに失敗しました。'))
        }
      },
      mimeType,
      quality,
    )
  })
}
