// 共通の小さなヘルパー

// #rrggbb → [r, g, b]（0..1）。不正値は白を返す
export function hexToRgb(hex) {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim())
  if (!m) return [1, 1, 1]
  const n = parseInt(m[1], 16)
  return [(n >> 16 & 255) / 255, (n >> 8 & 255) / 255, (n & 255) / 255]
}

export function clamp(v, min, max) {
  return Math.min(max, Math.max(min, v))
}
