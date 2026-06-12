// エントリーポイント: ファイル選択・AIモデル準備・切り抜きパイプラインの実行

// import先の ?v= はキャッシュバスティング用（サーバーがjsを7日キャッシュするため）。各ファイル更新時に日付を上げる
import { preloadModel, cutoutSubject } from './cutout.js?v=20260613'
import { renderResults, renderSummary } from './ui.js?v=20260613'
import { downloadBlob, downloadZip } from './download.js?v=20260613'

const dom = {
  dropZone: document.getElementById('drop-zone'),
  dropPlaceholder: document.getElementById('drop-placeholder'),
  dropPreviews: document.getElementById('drop-previews'),
  fileInput: document.getElementById('file-input'),
  quality: document.getElementById('quality'),
  qualityValue: document.getElementById('quality-value'),
  qualityRow: document.getElementById('quality-row'),
  modelStatus: document.getElementById('model-status'),
  modelProgressTrack: document.getElementById('model-progress-track'),
  modelProgressFill: document.getElementById('model-progress-fill'),
  modelProgressText: document.getElementById('model-progress-text'),
  runButton: document.getElementById('run-button'),
  resultList: document.getElementById('result-list'),
  summaryBar: document.getElementById('summary-bar'),
  summaryText: document.getElementById('summary-text'),
  zipButton: document.getElementById('zip-button'),
}

let selectedFiles = [] // {file, url} の配列（urlはプレビュー用Object URL）
let results = []
let preloadStarted = false

function init() {
  bindDropZone()
  bindSettings()
  dom.runButton.addEventListener('click', runPipeline)
  dom.zipButton.addEventListener('click', () => {
    downloadZip(results.filter((r) => r.status === 'done'))
  })
}

function bindDropZone() {
  dom.dropZone.addEventListener('click', () => dom.fileInput.click())
  dom.fileInput.addEventListener('change', () => {
    addFiles([...dom.fileInput.files])
    dom.fileInput.value = ''
  })
  dom.dropZone.addEventListener('dragover', (event) => {
    event.preventDefault()
    dom.dropZone.classList.add('dragover')
  })
  dom.dropZone.addEventListener('dragleave', () => {
    dom.dropZone.classList.remove('dragover')
  })
  dom.dropZone.addEventListener('drop', (event) => {
    event.preventDefault()
    dom.dropZone.classList.remove('dragover')
    const files = [...event.dataTransfer.files].filter((f) => f.type.startsWith('image/'))
    addFiles(files)
  })
}

function bindSettings() {
  dom.quality.addEventListener('input', () => {
    dom.qualityValue.textContent = dom.quality.value
  })
  document.querySelectorAll('input[name="format"]').forEach((radio) => {
    radio.addEventListener('change', () => {
      // 品質スライダーはWebP/JPG出力時のみ意味を持つ（PNGは可逆圧縮）
      dom.qualityRow.hidden = radio.value === 'png'
    })
  })
}

function addFiles(files) {
  if (files.length === 0) return
  const added = files.map((file) => ({ file, url: URL.createObjectURL(file) }))
  selectedFiles = [...selectedFiles, ...added]
  dom.runButton.disabled = false
  renderDropPreviews()
  startPreload()
}

// 最初のファイル選択をきっかけにAIモデルを先読みし、実行時の待ち時間を隠す
async function startPreload() {
  if (preloadStarted) return
  preloadStarted = true
  dom.modelStatus.hidden = false
  try {
    await preloadModel(updateModelProgress)
    showModelReady()
  } catch (error) {
    console.error('AIモデルの事前読み込みに失敗:', error)
    dom.modelProgressTrack.hidden = true
    dom.modelProgressText.textContent =
      'AIモデルの事前読み込みに失敗しました（実行時に再試行します）'
  }
}

function updateModelProgress(ratio) {
  const percent = Math.min(100, Math.round(ratio * 100))
  dom.modelProgressFill.style.width = `${percent}%`
  dom.modelProgressText.textContent = `AIモデルをダウンロード中… ${percent}%（初回のみ・約40MB）`
  if (percent >= 100) showModelReady()
}

function showModelReady() {
  dom.modelStatus.classList.add('ready')
  dom.modelProgressTrack.hidden = true
  dom.modelProgressText.textContent = '✓ AIモデルの準備が完了しました'
}

function removeFile(index) {
  URL.revokeObjectURL(selectedFiles[index].url)
  selectedFiles = selectedFiles.filter((_, i) => i !== index)
  dom.runButton.disabled = selectedFiles.length === 0
  renderDropPreviews()
}

// ドロップゾーン内に選択済みファイルのサムネイルを表示する
function renderDropPreviews() {
  const hasFiles = selectedFiles.length > 0
  dom.dropZone.classList.toggle('has-files', hasFiles)
  dom.dropPlaceholder.hidden = hasFiles
  dom.dropPreviews.hidden = !hasFiles
  dom.dropPreviews.replaceChildren()
  if (!hasFiles) return

  selectedFiles.forEach((entry, index) => {
    const tile = document.createElement('div')
    tile.className = 'preview-tile'

    const img = document.createElement('img')
    img.src = entry.url
    img.alt = entry.file.name
    img.title = entry.file.name
    tile.appendChild(img)

    const remove = document.createElement('button')
    remove.className = 'preview-remove'
    remove.type = 'button'
    remove.textContent = '×'
    remove.setAttribute('aria-label', `${entry.file.name} を削除`)
    remove.addEventListener('click', (event) => {
      event.stopPropagation()
      removeFile(index)
    })
    tile.appendChild(remove)

    dom.dropPreviews.appendChild(tile)
  })

  const addTile = document.createElement('div')
  addTile.className = 'preview-add'
  addTile.textContent = '＋'
  addTile.title = '画像を追加'
  dom.dropPreviews.appendChild(addTile)
}

function readSettings() {
  return {
    format: document.querySelector('input[name="format"]:checked').value,
    quality: Number(dom.quality.value),
  }
}

async function runPipeline() {
  if (selectedFiles.length === 0) return
  const settings = readSettings()

  dom.runButton.disabled = true
  dom.runButton.textContent = '処理中…'
  results = selectedFiles.map((entry) => ({
    file: entry.file,
    status: 'processing',
    previewUrl: entry.url,
  }))
  refreshView()

  // AI推論はメモリ消費が大きいため、並列にせず1枚ずつ処理する
  for (let i = 0; i < selectedFiles.length; i += 1) {
    const result = await processFile(selectedFiles[i], settings)
    results = results.map((r, j) => (j === i ? result : r))
    refreshView()
  }

  dom.runButton.disabled = false
  dom.runButton.textContent = '背景を透過にする'
}

async function processFile(entry, settings) {
  const { file } = entry
  try {
    const pngBlob = await cutoutSubject(file, updateModelProgress)
    const { blob, width, height } = await finalizeOutput(pngBlob, settings)
    return {
      file,
      status: 'done',
      blob,
      previewUrl: URL.createObjectURL(blob),
      outputName: buildOutputName(file.name, blob.type),
      origSize: file.size,
      newSize: blob.size,
      outW: width,
      outH: height,
    }
  } catch (error) {
    console.error(`${file.name} の処理に失敗:`, error)
    return { file, status: 'error', errorMessage: error.message }
  }
}

// 切り抜き結果（透過PNG）を選択された出力形式に変換する
async function finalizeOutput(pngBlob, settings) {
  const bitmap = await createImageBitmap(pngBlob)
  const { width, height } = bitmap

  if (settings.format === 'png') {
    bitmap.close()
    return { blob: pngBlob, width, height }
  }

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  // JPGは透過を持てないため白で下塗りする
  if (settings.format === 'jpeg') {
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, width, height)
  }
  ctx.drawImage(bitmap, 0, 0)
  bitmap.close()

  const mimeType = settings.format === 'jpeg' ? 'image/jpeg' : 'image/webp'
  const blob = await canvasToBlob(canvas, mimeType, settings.quality / 100)
  // WebPエンコード非対応ブラウザ（古いSafari等）ではPNGのまま返す
  if (settings.format === 'webp' && blob.type !== 'image/webp') {
    return { blob: pngBlob, width, height }
  }
  return { blob, width, height }
}

function canvasToBlob(canvas, mimeType, quality) {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob)
        } else {
          reject(new Error('画像の書き出しに失敗しました。'))
        }
      },
      mimeType,
      quality,
    )
  })
}

function buildOutputName(originalName, mimeType) {
  const dot = originalName.lastIndexOf('.')
  const base = dot > 0 ? originalName.slice(0, dot) : originalName
  const ext = mimeType === 'image/jpeg' ? 'jpg' : mimeType === 'image/webp' ? 'webp' : 'png'
  return `${base}_nobg.${ext}`
}

function refreshView() {
  renderResults(dom.resultList, results, (result) => {
    downloadBlob(result.blob, result.outputName)
  })
  renderSummary(dom.summaryBar, dom.summaryText, results)
}

init()
