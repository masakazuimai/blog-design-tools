// 単色背景の透過化
// 外周の不透明ピクセルから背景色を推定し、外周と色がつながっている範囲だけを
// フラッドフィルで透過にする（ロゴ内部の同色部分は残る）

const OPAQUE_ALPHA = 200
const NEAR_TRANSPARENT = 16

export function removeBackground(imageData, tolerance) {
  const { width: w, height: h } = imageData
  const src = imageData.data
  const bg = estimateBackgroundColor(src, w, h)
  if (!bg) return imageData

  // 許容値0〜100を色距離（RGB空間ユークリッド距離、最大441）のしきい値に変換
  const threshold = (tolerance / 100) * 250

  const out = new Uint8ClampedArray(src)
  const visited = new Uint8Array(w * h)
  const stack = []

  const isBackground = (idx) => {
    const p = idx * 4
    if (src[p + 3] < NEAR_TRANSPARENT) return true
    const dr = src[p] - bg.r
    const dg = src[p + 1] - bg.g
    const db = src[p + 2] - bg.b
    return Math.sqrt(dr * dr + dg * dg + db * db) <= threshold
  }

  // 外周の全ピクセルを起点にする
  for (let x = 0; x < w; x += 1) {
    stack.push(x, (h - 1) * w + x)
  }
  for (let y = 0; y < h; y += 1) {
    stack.push(y * w, y * w + w - 1)
  }

  while (stack.length > 0) {
    const idx = stack.pop()
    if (visited[idx] || !isBackground(idx)) continue
    visited[idx] = 1
    out[idx * 4 + 3] = 0

    const x = idx % w
    const y = (idx - x) / w
    if (x > 0) stack.push(idx - 1)
    if (x < w - 1) stack.push(idx + 1)
    if (y > 0) stack.push(idx - w)
    if (y < h - 1) stack.push(idx + w)
  }

  return new ImageData(out, w, h)
}

// 外周の不透明ピクセルの平均色を背景色とみなす（全て透過なら推定不可）
function estimateBackgroundColor(data, w, h) {
  let r = 0
  let g = 0
  let b = 0
  let count = 0

  const sample = (x, y) => {
    const p = (y * w + x) * 4
    if (data[p + 3] < OPAQUE_ALPHA) return
    r += data[p]
    g += data[p + 1]
    b += data[p + 2]
    count += 1
  }

  for (let x = 0; x < w; x += 1) {
    sample(x, 0)
    sample(x, h - 1)
  }
  for (let y = 1; y < h - 1; y += 1) {
    sample(0, y)
    sample(w - 1, y)
  }

  if (count === 0) return null
  return { r: r / count, g: g / count, b: b / count }
}
