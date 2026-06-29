// ダウンロード処理（個別・ZIP一括）

export function downloadBlob(blob, fileName) {
  if (!blob) return
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = fileName
  link.rel = 'noopener'
  // 一部ブラウザはDOMに無いアンカーのclickを無視するため追加してから発火
  document.body.appendChild(link)
  link.click()
  // clickが処理される前にURLを破棄するとDLがキャンセルされるため遅延解放
  setTimeout(() => {
    link.remove()
    URL.revokeObjectURL(url)
  }, 1000)
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
  downloadBlob(blob, 'bg-removed-images.zip')
}
