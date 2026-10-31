
const MAX_FILE_BYTES = 3 * 1024 * 1024

export async function processAttachment(file) {
  if (file.type && file.type.startsWith("image/")) {
    const dataUrl = await fileToScaledDataUrl(file)
    return { name: file.name || "image", type: file.type, dataUrl }
  }
  if (file.size > MAX_FILE_BYTES) {
    throw new Error(`「${file.name || "ファイル"}」は大きすぎます（3MBまで）`)
  }
  const dataUrl = await readFileAsDataUrl(file)
  return { name: file.name || "file", type: file.type || "application/octet-stream", dataUrl }
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = () => reject(new Error("ファイルの読み込みに失敗しました"))
    reader.onload = () => resolve(reader.result)
    reader.readAsDataURL(file)
  })
}

export function fileToScaledDataUrl(file, maxDim = 1024, quality = 0.8) {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith("image/")) {
      reject(new Error("画像ファイルではありません"))
      return
    }
    const reader = new FileReader()
    reader.onerror = () => reject(new Error("画像の読み込みに失敗しました"))
    reader.onload = () => {
      const img = new Image()
      img.onerror = () => reject(new Error("画像のデコードに失敗しました"))
      img.onload = () => {
        try {
          const scale = Math.min(1, maxDim / Math.max(img.width, img.height))
          const w = Math.max(1, Math.round(img.width * scale))
          const h = Math.max(1, Math.round(img.height * scale))
          const canvas = document.createElement("canvas")
          canvas.width = w
          canvas.height = h
          const ctx = canvas.getContext("2d")
          ctx.drawImage(img, 0, 0, w, h)
          resolve(canvas.toDataURL("image/jpeg", quality))
        } catch (error) {
          reject(new Error("画像の縮小に失敗しました"))
        }
      }
      img.src = reader.result
    }
    reader.readAsDataURL(file)
  })
}
