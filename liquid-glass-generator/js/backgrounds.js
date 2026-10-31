
const assetBase = location.pathname.includes('/en/') ? '../assets/' : 'assets/'

export const BACKGROUNDS = [
  { id: 'gradient', file: 'gradient.jpg', label: { ja: 'グラデ', en: 'Gradient' } },
  { id: 'city', file: 'city.jpg', label: { ja: '都市', en: 'City' } },
  { id: 'mountains', file: 'mountains.jpg', label: { ja: '山', en: 'Mountains' } },
  { id: 'tree', file: 'tree.jpg', label: { ja: '草原', en: 'Meadow' } },
  { id: 'aurora', file: 'aurora.jpg', label: { ja: 'パステル', en: 'Aurora' } },
]

export function backgroundUrl(file) {
  return assetBase + file
}

export function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error(`画像の読み込みに失敗しました: ${src}`))
    img.src = src
  })
}
