// リサイズ計画の計算（描画はせず、出力サイズと描画パラメータだけを返す）

import { t } from './i18n.js?v=20260614'

export const TEMPLATES = [
  {
    group: t.tplGroupBlog,
    items: [
      { id: 'ogp', label: t.tplOgp, w: 1200, h: 630 },
      { id: 'eyecatch', label: t.tplEyecatch, w: 1280, h: 720 },
    ],
  },
  {
    group: t.tplGroupSns,
    items: [
      { id: 'x-post', label: t.tplXPost, w: 1600, h: 900 },
      { id: 'x-header', label: t.tplXHeader, w: 1500, h: 500 },
      { id: 'ig-post', label: t.tplIgPost, w: 1080, h: 1080 },
      { id: 'ig-story', label: t.tplIgStory, w: 1080, h: 1920 },
      { id: 'yt-thumb', label: t.tplYtThumb, w: 1280, h: 720 },
    ],
  },
  {
    group: t.tplGroupAd,
    items: [
      { id: 'rectangle', label: t.tplRectangle, w: 300, h: 250 },
      { id: 'leaderboard', label: t.tplLeaderboard, w: 728, h: 90 },
      { id: 'mobile-banner', label: t.tplMobileBanner, w: 320, h: 100 },
      { id: 'skyscraper', label: t.tplSkyscraper, w: 160, h: 600 },
    ],
  },
]

export function findTemplate(id) {
  return TEMPLATES.flatMap((g) => g.items).find((t) => t.id === id) ?? null
}

// 戻り値: { outW, outH, draw: {sx,sy,sw,sh,dx,dy,dw,dh}, bg, circle }
export function computeRenderPlan(srcW, srcH, resize) {
  if (resize.mode === 'free') return planFree(srcW, srcH, resize)
  if (resize.mode === 'template') return planTemplate(srcW, srcH, resize)
  return fullPlan(srcW, srcH, srcW, srcH)
}

function fullPlan(srcW, srcH, outW, outH) {
  return {
    outW,
    outH,
    draw: { sx: 0, sy: 0, sw: srcW, sh: srcH, dx: 0, dy: 0, dw: outW, dh: outH },
    bg: null,
  }
}

function planFree(srcW, srcH, { width, height, keepRatio, noUpscale, freeMode, circle, focus }) {
  const w = width > 0 ? width : null
  const h = height > 0 ? height : null
  if (freeMode === 'crop') return planCrop(srcW, srcH, w, h, focus, circle)
  return planScale(srcW, srcH, w, h, keepRatio, noUpscale)
}

function planScale(srcW, srcH, w, h, keepRatio, noUpscale) {
  if (!w && !h) return fullPlan(srcW, srcH, srcW, srcH)

  if (!keepRatio) {
    // 縦横比を維持しない場合は指定値そのまま（未入力の辺は元サイズ）
    return fullPlan(srcW, srcH, w ?? srcW, h ?? srcH)
  }

  let scale
  if (w && h) {
    scale = Math.min(w / srcW, h / srcH)
  } else {
    scale = w ? w / srcW : h / srcH
  }
  if (noUpscale) scale = Math.min(scale, 1)

  const outW = Math.max(1, Math.round(srcW * scale))
  const outH = Math.max(1, Math.round(srcH * scale))
  return fullPlan(srcW, srcH, outW, outH)
}

// 指定サイズを等倍のまま切り抜く（focusは0〜1の位置、画像を超える指定は画像サイズまで）
// circle時は枠に内接する楕円マスクを描画側でかける（枠が正方形なら正円になる）
function planCrop(srcW, srcH, w, h, focus, circle) {
  const cropW = Math.min(w ?? srcW, srcW)
  const cropH = Math.min(h ?? srcH, srcH)
  const f = focus ?? { x: 0.5, y: 0.5 }
  const sx = Math.round((srcW - cropW) * f.x)
  const sy = Math.round((srcH - cropH) * f.y)
  return {
    outW: cropW,
    outH: cropH,
    draw: { sx, sy, sw: cropW, sh: cropH, dx: 0, dy: 0, dw: cropW, dh: cropH },
    bg: null,
    circle: Boolean(circle),
  }
}

function planTemplate(srcW, srcH, { template, fit, bg, focus }) {
  const { w, h } = template

  if (fit === 'contain') {
    const scale = Math.min(w / srcW, h / srcH)
    const dw = Math.round(srcW * scale)
    const dh = Math.round(srcH * scale)
    return {
      outW: w,
      outH: h,
      draw: {
        sx: 0, sy: 0, sw: srcW, sh: srcH,
        dx: Math.round((w - dw) / 2), dy: Math.round((h - dh) / 2), dw, dh,
      },
      bg,
    }
  }

  // cover: 出力枠を埋めるように元画像を切り抜く（focusは0〜1の切り抜き位置、0.5が中央）
  const f = focus ?? { x: 0.5, y: 0.5 }
  const srcRatio = srcW / srcH
  const targetRatio = w / h
  let sx = 0
  let sy = 0
  let sw = srcW
  let sh = srcH
  if (srcRatio > targetRatio) {
    sw = Math.round(srcH * targetRatio)
    sx = Math.round((srcW - sw) * f.x)
  } else {
    sh = Math.round(srcW / targetRatio)
    sy = Math.round((srcH - sh) * f.y)
  }
  return {
    outW: w,
    outH: h,
    draw: { sx, sy, sw, sh, dx: 0, dy: 0, dw: w, dh: h },
    bg: null,
  }
}
