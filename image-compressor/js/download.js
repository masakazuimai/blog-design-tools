// ダウンロード処理（個別・ZIP一括）

export function downloadBlob(blob, fileName) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = fileName
  link.click()
  URL.revokeObjectURL(url)
}

export async function downloadZip(results) {
  const zip = new window.JSZip()
  const usedNames = new Set()

  results.forEach((result) => {
    // 同名ファイルの衝突を連番で回避する
    let name = result.outputName
    let counter = 2
    while (usedNames.has(name)) {
      const dot = result.outputName.lastIndexOf('.')
      name = `${result.outputName.slice(0, dot)}_${counter}${result.outputName.slice(dot)}`
      counter += 1
    }
    usedNames.add(name)
    zip.file(name, result.blob)
  })

  const blob = await zip.generateAsync({ type: 'blob' })
  downloadBlob(blob, 'compressed-images.zip')
}
