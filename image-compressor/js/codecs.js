
import { t } from './i18n.js?v=20260614'

const CDN_MODULES = {
  jpeg: 'https://esm.sh/@jsquash/jpeg@1',
  webp: 'https://esm.sh/@jsquash/webp@1',
  avif: 'https://esm.sh/@jsquash/avif@2',
}

const moduleCache = {}

function loadModule(kind) {
  if (!moduleCache[kind]) {
    moduleCache[kind] = import(CDN_MODULES[kind])
  }
  return moduleCache[kind]
}

export const EXT_MAP = { jpeg: 'jpg', png: 'png', webp: 'webp', avif: 'avif', svg: 'svg' }

export function detectFormat(mimeType) {
  if (mimeType === 'image/jpeg') return 'jpeg'
  if (mimeType === 'image/webp') return 'webp'
  if (mimeType === 'image/avif') return 'avif'
  return 'png'
}

export async function decodeToBitmap(file) {
  try {
    if (file.type === 'image/svg+xml') return await decodeSvg(file)
    return await createImageBitmap(file)
  } catch (error) {
    console.error('画像のデコードに失敗:', error)
    throw new Error(t.decodeFailed)
  }
}

async function decodeSvg(file) {
  const text = await file.text()
  const { w, h, explicit } = svgIntrinsicSize(text)
  const url = URL.createObjectURL(new Blob([text], { type: 'image/svg+xml' }))
  try {
    const img = await loadImage(url)
    const canvas = document.createElement('canvas')
    canvas.width = explicit ? img.naturalWidth || w : w
    canvas.height = explicit ? img.naturalHeight || h : h
    const ctx = canvas.getContext('2d')
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
    return await createImageBitmap(canvas)
  } finally {
    URL.revokeObjectURL(url)
  }
}

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
    img.onerror = () => reject(new Error(t.svgLoadFailed))
    img.src = url
  })
}

export function renderImageData(bitmap, plan, format) {
  const canvas = document.createElement('canvas')
  canvas.width = plan.outW
  canvas.height = plan.outH
  const ctx = canvas.getContext('2d')

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
    ctx.globalCompositeOperation = 'destination-in'
    ctx.beginPath()
    ctx.ellipse(plan.outW / 2, plan.outH / 2, plan.outW / 2, plan.outH / 2, 0, 0, Math.PI * 2)
    ctx.fill()
    ctx.globalCompositeOperation = 'source-over'

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
  if (format === 'avif') return encodeWithWasm('avif', 'image/avif', imageData, quality, { speed: 7 })
  if (format === 'png') return encodePng(imageData, quality)
  if (format === 'svg') return encodeSvg(imageData, quality)
  throw new Error(t.unsupportedFormat(format))
}

function encodeSvg(imageData, quality) {
  try {
    const numberofcolors = quality >= 80 ? 16 : quality >= 60 ? 8 : quality >= 40 ? 6 : 4
    const svg = window.ImageTracer.imagedataToSVG(imageData, {
      numberofcolors,
      pathomit: 8,
      blurradius: 0,
    })
    return Promise.resolve(new Blob([svg], { type: 'image/svg+xml' }))
  } catch (error) {
    console.error('SVGベクタライズに失敗:', error)
    return Promise.reject(new Error(t.svgConvertFailed))
  }
}

async function encodeWithWasm(kind, mimeType, imageData, quality, extraOptions = {}) {
  try {
    const { encode } = await loadModule(kind)
    const buffer = await encode(imageData, { quality, ...extraOptions })
    return new Blob([buffer], { type: mimeType })
  } catch (error) {
    if (kind === 'avif') {
      console.error('AVIFのWASMエンコードに失敗:', error)
      throw new Error(t.avifFailed)
    }
    console.error(`${kind}のWASMエンコードに失敗したためCanvasにフォールバック:`, error)
    return canvasEncode(imageData, mimeType, quality / 100)
  }
}

function encodePng(imageData, quality) {
  try {
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
          reject(new Error(t.encodeFailed))
        }
      },
      mimeType,
      quality,
    )
  })
}
