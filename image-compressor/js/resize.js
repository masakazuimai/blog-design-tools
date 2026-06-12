// リサイズ計画の計算（描画はせず、出力サイズと描画パラメータだけを返す）

export const TEMPLATES = [
  {
    group: 'ブログ・OGP',
    items: [
      { id: 'ogp', label: 'OGP画像（1200×630）', w: 1200, h: 630 },
      { id: 'eyecatch', label: 'アイキャッチ 16:9（1280×720）', w: 1280, h: 720 },
    ],
  },
  {
    group: 'SNS',
    items: [
      { id: 'x-post', label: 'X投稿（1600×900）', w: 1600, h: 900 },
      { id: 'x-header', label: 'Xヘッダー（1500×500）', w: 1500, h: 500 },
      { id: 'ig-post', label: 'Instagram投稿（1080×1080）', w: 1080, h: 1080 },
      { id: 'ig-story', label: 'ストーリー（1080×1920）', w: 1080, h: 1920 },
      { id: 'yt-thumb', label: 'YouTubeサムネイル（1280×720）', w: 1280, h: 720 },
    ],
  },
  {
    group: '広告バナー',
    items: [
      { id: 'rectangle', label: 'レクタングル（300×250）', w: 300, h: 250 },
      { id: 'leaderboard', label: 'リーダーボード（728×90）', w: 728, h: 90 },
      { id: 'mobile-banner', label: 'モバイルバナー（320×100）', w: 320, h: 100 },
      { id: 'skyscraper', label: 'スカイスクレイパー（160×600）', w: 160, h: 600 },
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
  const base = fullPlan(srcW, srcH, srcW, srcH)
  return resize.circle ? applyCircle(base, resize.focus) : base
}

function fullPlan(srcW, srcH, outW, outH) {
  return {
    outW,
    outH,
    draw: { sx: 0, sy: 0, sw: srcW, sh: srcH, dx: 0, dy: 0, dw: outW, dh: outH },
    bg: null,
  }
}

// 正円切り抜きの直径（両方指定なら小さい方、片方ならその値、未指定は画像の短辺）
export function circleDiameter(w, h, srcW, srcH) {
  const base = w && h ? Math.min(w, h) : w || h || Math.min(srcW, srcH)
  return Math.min(base, srcW, srcH)
}

function planFree(srcW, srcH, { width, height, keepRatio, noUpscale, freeMode, circle, focus }) {
  const w = width > 0 ? width : null
  const h = height > 0 ? height : null
  if (freeMode === 'crop') return planCrop(srcW, srcH, w, h, focus, circle)
  const base = planScale(srcW, srcH, w, h, keepRatio, noUpscale)
  return circle ? applyCircle(base, focus) : base
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

// 既存プランの出力を短辺の正方形に切り詰め、円形マスク用フラグを立てる
// focusは正方形を出力のどこから取るか（0〜1、0.5が中央）
function applyCircle(plan, focus) {
  const f = focus ?? { x: 0.5, y: 0.5 }
  const d = Math.min(plan.outW, plan.outH)
  return {
    outW: d,
    outH: d,
    draw: {
      ...plan.draw,
      dx: plan.draw.dx - Math.round((plan.outW - d) * f.x),
      dy: plan.draw.dy - Math.round((plan.outH - d) * f.y),
    },
    bg: plan.bg,
    circle: true,
  }
}

// 指定サイズを等倍のまま切り抜く（focusは0〜1の位置、画像を超える指定は画像サイズまで）
// circle時は直径×直径の正方形を切り抜き、描画側で円形マスクをかける
function planCrop(srcW, srcH, w, h, focus, circle) {
  const d = circle ? circleDiameter(w, h, srcW, srcH) : null
  const cropW = circle ? d : Math.min(w ?? srcW, srcW)
  const cropH = circle ? d : Math.min(h ?? srcH, srcH)
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
