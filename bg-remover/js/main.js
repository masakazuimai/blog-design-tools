// エントリーポイント: ファイル選択・AIモデル準備・切り抜きパイプラインの実行

// import先の ?v= はキャッシュバスティング用（サーバーがjsを7日キャッシュするため）。各ファイル更新時に日付を上げる
import { preloadModel, cutoutSubject } from './cutout.js?v=20260614'
import { renderResults, renderSummary } from './ui.js?v=20260614'
import { downloadBlob, downloadZip } from './download.js?v=20260614'
import { runEditor } from './editor.js?v=20260614'
import { t } from './i18n.js?v=20260614'

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
// entry → { status, blob, url, showing } の切り抜きプレビューキャッシュ。本処理でも再利用する
const cutoutCache = new Map()

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
    dom.modelProgressText.textContent = t.modelPreloadFailed
  }
}

function updateModelProgress(ratio) {
  const percent = Math.min(100, Math.round(ratio * 100))
  dom.modelProgressFill.style.width = `${percent}%`
  dom.modelProgressText.textContent = t.modelDownloading(percent)
  if (percent >= 100) showModelReady()
}

function showModelReady() {
  dom.modelStatus.classList.add('ready')
  dom.modelProgressTrack.hidden = true
  dom.modelProgressText.textContent = t.modelReady
}

function removeFile(index) {
  const entry = selectedFiles[index]
  URL.revokeObjectURL(entry.url)
  const cached = cutoutCache.get(entry)
  if (cached?.url) URL.revokeObjectURL(cached.url)
  cutoutCache.delete(entry)
  selectedFiles = selectedFiles.filter((_, i) => i !== index)
  dom.runButton.disabled = selectedFiles.length === 0
  renderDropPreviews()
}

// その1枚だけAI切り抜きを実行してキャッシュする。生成済みなら即返す
// 戻り値: done状態オブジェクト / 生成失敗・並行実行中・生成中に削除された場合は null
async function ensureCutout(entry) {
  const current = cutoutCache.get(entry)
  if (current?.status === 'done') return current
  if (current?.status === 'loading') return null

  cutoutCache.set(entry, { status: 'loading', blob: null, url: null, showing: false })
  renderDropPreviews()
  try {
    // 進捗ハンドラは渡さない（モデル準備表示を切り抜きプレビューで上書きしないため）
    const blob = await cutoutSubject(entry.file)
    // 生成中に削除された場合はObject URLを作らず破棄する
    if (!selectedFiles.includes(entry)) return null
    const state = { status: 'done', blob, url: URL.createObjectURL(blob), showing: true }
    cutoutCache.set(entry, state)
    renderDropPreviews()
    return state
  } catch (error) {
    console.error(`${entry.file.name} のプレビュー生成に失敗:`, error)
    if (selectedFiles.includes(entry)) {
      cutoutCache.set(entry, { status: 'error', blob: null, url: null, showing: false })
    }
    renderDropPreviews()
    return null
  }
}

// サムネ単位でAI切り抜きプレビューを生成・切り替えする
// 未生成: 切り抜いて被写体プレビューを表示 / 生成済み: 元画像との表示トグル
async function togglePreview(entry) {
  const current = cutoutCache.get(entry)
  if (current?.status === 'done') {
    cutoutCache.set(entry, { ...current, showing: !current.showing })
    renderDropPreviews()
    return
  }
  await ensureCutout(entry)
}

// 切り抜き結果を手動レタッチ（被写体の増減）するモーダルエディタを開く
async function openEditor(entry) {
  const state = (await ensureCutout(entry)) ?? cutoutCache.get(entry)
  if (state?.status !== 'done') return

  const editedBlob = await runEditor(entry.file, state.blob)
  if (!editedBlob) return // キャンセル

  // 生成中の待機などで削除されていないか確認してから差し替える
  if (!selectedFiles.includes(entry)) return
  const old = cutoutCache.get(entry)
  if (old?.url) URL.revokeObjectURL(old.url)
  cutoutCache.set(entry, {
    status: 'done',
    blob: editedBlob,
    url: URL.createObjectURL(editedBlob),
    showing: true,
  })
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
    dom.dropPreviews.appendChild(buildPreviewTile(entry, index))
  })

  const addTile = document.createElement('div')
  addTile.className = 'preview-add'
  addTile.textContent = '＋'
  addTile.title = t.addImage
  dom.dropPreviews.appendChild(addTile)
}

const EYE_ICON =
  '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
  'stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
  '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>'

const PENCIL_ICON =
  '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
  'stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
  '<path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>'

function buildPreviewTile(entry, index) {
  const tile = document.createElement('div')
  tile.className = 'preview-tile'

  const state = cutoutCache.get(entry)
  const showingCutout = state?.status === 'done' && state.showing

  const img = document.createElement('img')
  img.src = showingCutout ? state.url : entry.url
  img.alt = entry.file.name
  img.title = entry.file.name
  tile.appendChild(img)

  // 生成済みなら、ホバー中だけ切り抜きを即表示する（クリックでの固定表示とは別）
  if (state?.status === 'done') {
    tile.addEventListener('mouseenter', () => {
      img.src = state.url
    })
    tile.addEventListener('mouseleave', () => {
      img.src = state.showing ? state.url : entry.url
    })
  }

  if (showingCutout) {
    tile.appendChild(buildBadge(t.badgeCutoutPreview))
  } else if (state?.status === 'error') {
    tile.appendChild(buildBadge(t.badgeCutoutFailed, true))
  }

  if (state?.status === 'loading') {
    tile.classList.add('is-loading')
    const spinner = document.createElement('div')
    spinner.className = 'preview-spinner'
    tile.appendChild(spinner)
  }

  const toolbar = document.createElement('div')
  toolbar.className = 'preview-toolbar'

  const loading = state?.status === 'loading'
  const eyeLabel = loading ? t.cutting : showingCutout ? t.revert : t.check
  const eye = buildTileButton(EYE_ICON, eyeLabel, loading, (event) => {
    event.stopPropagation()
    togglePreview(entry)
  })
  toolbar.appendChild(eye)

  const edit = buildTileButton(PENCIL_ICON, t.edit, loading, (event) => {
    event.stopPropagation()
    openEditor(entry)
  })
  toolbar.appendChild(edit)

  tile.appendChild(toolbar)

  const remove = document.createElement('button')
  remove.className = 'preview-remove'
  remove.type = 'button'
  remove.textContent = '×'
  remove.setAttribute('aria-label', t.removeAria(entry.file.name))
  remove.addEventListener('click', (event) => {
    event.stopPropagation()
    removeFile(index)
  })
  tile.appendChild(remove)

  return tile
}

function buildTileButton(icon, label, disabled, onClick) {
  const button = document.createElement('button')
  button.className = 'preview-tool'
  button.type = 'button'
  button.disabled = disabled
  button.innerHTML = icon
  button.appendChild(document.createTextNode(label))
  button.addEventListener('click', onClick)
  return button
}

function buildBadge(text, isError = false) {
  const badge = document.createElement('span')
  badge.className = `preview-badge${isError ? ' error' : ''}`
  badge.textContent = text
  return badge
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
  dom.runButton.textContent = t.processing
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
  dom.runButton.textContent = t.runButton
}

async function processFile(entry, settings) {
  const { file } = entry
  try {
    // プレビューで生成済みの切り抜きがあれば再利用し、再推論を省く
    const cached = cutoutCache.get(entry)
    const pngBlob =
      cached?.status === 'done' && cached.blob
        ? cached.blob
        : await cutoutSubject(file, updateModelProgress)
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
          reject(new Error(t.exportFailed))
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
