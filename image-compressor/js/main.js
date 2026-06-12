// エントリーポイント: 設定の読み取り・イベント配線・変換パイプラインの実行

// import先の ?v= はキャッシュバスティング用（サーバーがjsを7日キャッシュするため）。各ファイル更新時に日付を上げる
import { TEMPLATES, findTemplate, computeRenderPlan } from './resize.js?v=20260613'
import { detectFormat, decodeToBitmap, renderImageData, encodeImage, EXT_MAP } from './codecs.js?v=20260613'
import { renderResults, renderSummary } from './ui.js?v=20260613'
import { downloadBlob, downloadZip } from './download.js?v=20260613'
import { openCropEditor, openRegionEditor } from './crop-editor.js?v=20260613'
import { removeBackground } from './bg-remove.js?v=20260613'

const dom = {
  dropZone: document.getElementById('drop-zone'),
  dropPlaceholder: document.getElementById('drop-placeholder'),
  dropPreviews: document.getElementById('drop-previews'),
  fileInput: document.getElementById('file-input'),
  quality: document.getElementById('quality'),
  qualityValue: document.getElementById('quality-value'),
  bgRemove: document.getElementById('bg-remove'),
  bgRemoveSection: document.getElementById('bg-remove-section'),
  bgRemoveOptions: document.getElementById('bg-remove-options'),
  bgTolerance: document.getElementById('bg-tolerance'),
  bgToleranceValue: document.getElementById('bg-tolerance-value'),
  panelFree: document.getElementById('panel-free'),
  panelTemplate: document.getElementById('panel-template'),
  templateSelect: document.getElementById('template-select'),
  bgColorRow: document.getElementById('bg-color-row'),
  bgColor: document.getElementById('bg-color'),
  bgTransparentRow: document.getElementById('bg-transparent-row'),
  bgTransparent: document.getElementById('bg-transparent'),
  bgTransparentHint: document.getElementById('bg-transparent-hint'),
  freeWidth: document.getElementById('free-width'),
  freeHeight: document.getElementById('free-height'),
  freeScaleOptions: document.getElementById('free-scale-options'),
  freeCropHint: document.getElementById('free-crop-hint'),
  keepRatio: document.getElementById('keep-ratio'),
  noUpscale: document.getElementById('no-upscale'),
  svgHint: document.getElementById('svg-hint'),
  avifHint: document.getElementById('avif-hint'),
  runButton: document.getElementById('run-button'),
  resultList: document.getElementById('result-list'),
  summaryBar: document.getElementById('summary-bar'),
  summaryText: document.getElementById('summary-text'),
  zipButton: document.getElementById('zip-button'),
}

let selectedFiles = [] // {file, url, focus} の配列（urlはプレビュー用Object URL、focusは切り抜き位置0〜1）
let results = []
// 正円切り抜きの状態（モーダル内トグルで変更され、全画像に適用される）
let cropCircle = false

function init() {
  populateTemplates()
  bindDropZone()
  bindSettings()
  dom.runButton.addEventListener('click', runPipeline)
  dom.zipButton.addEventListener('click', () => {
    downloadZip(results.filter((r) => r.status === 'done'))
  })
}

function populateTemplates() {
  TEMPLATES.forEach((group) => {
    const optgroup = document.createElement('optgroup')
    optgroup.label = group.group
    group.items.forEach((item) => {
      const option = document.createElement('option')
      option.value = item.id
      option.textContent = item.label
      optgroup.appendChild(option)
    })
    dom.templateSelect.appendChild(optgroup)
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
      dom.svgHint.hidden = radio.value !== 'svg'
      dom.avifHint.hidden = radio.value !== 'avif'
    })
  })
  document.querySelectorAll('input[name="resize-mode"]').forEach((radio) => {
    radio.addEventListener('change', updateResizePanels)
  })
  document.querySelectorAll('input[name="fit-mode"]').forEach((radio) => {
    radio.addEventListener('change', updateResizePanels)
  })
  document.querySelectorAll('input[name="free-mode"]').forEach((radio) => {
    radio.addEventListener('change', updateResizePanels)
  })
  dom.bgTransparent.addEventListener('change', updateResizePanels)
  // サイズ設定の変更を縦横比連動とサムネイル下の「変換後サイズ」表示へ即時反映する
  dom.freeWidth.addEventListener('input', () => {
    syncLinkedInput('width')
    renderDropPreviews()
  })
  dom.freeHeight.addEventListener('input', () => {
    syncLinkedInput('height')
    renderDropPreviews()
  })
  dom.keepRatio.addEventListener('change', () => {
    syncLinkedInput('width')
    renderDropPreviews()
  })
  dom.noUpscale.addEventListener('change', renderDropPreviews)
  dom.templateSelect.addEventListener('change', renderDropPreviews)
  dom.bgRemove.addEventListener('change', () => {
    dom.bgRemoveOptions.hidden = !dom.bgRemove.checked
  })
  dom.bgTolerance.addEventListener('input', () => {
    dom.bgToleranceValue.textContent = dom.bgTolerance.value
  })
}

function updateResizePanels() {
  const mode = document.querySelector('input[name="resize-mode"]:checked').value
  dom.panelFree.hidden = mode !== 'free'
  dom.panelTemplate.hidden = mode !== 'template'
  const fit = document.querySelector('input[name="fit-mode"]:checked').value
  const containActive = mode === 'template' && fit === 'contain'
  dom.bgTransparentRow.hidden = !containActive
  dom.bgTransparentHint.hidden = !containActive || !dom.bgTransparent.checked
  dom.bgColorRow.hidden = !containActive || dom.bgTransparent.checked
  const freeMode = document.querySelector('input[name="free-mode"]:checked').value
  dom.freeScaleOptions.hidden = freeMode !== 'scale'
  dom.freeCropHint.hidden = freeMode !== 'crop'
  prefillScaleInputs()
  // 背景透過は切り抜き時とテンプレート時のみ選択できる
  dom.bgRemoveSection.hidden = !(mode === 'template' || (mode === 'free' && freeMode === 'crop'))
  // 切り抜き系の設定時のみ位置調整ボタンを出すため再描画する
  renderDropPreviews()
}

// 位置調整が意味を持つ設定か（template: カバー切り抜き / free-crop: 指定サイズ切り抜き）
function cropEditorKind() {
  const mode = document.querySelector('input[name="resize-mode"]:checked').value
  if (mode === 'template') {
    const fit = document.querySelector('input[name="fit-mode"]:checked').value
    return fit === 'cover' ? 'template' : null
  }
  if (mode === 'free') {
    const freeMode = document.querySelector('input[name="free-mode"]:checked').value
    if (freeMode === 'crop') return 'free-crop'
  }
  return null
}

function addFiles(files) {
  if (files.length === 0) return
  const added = files.map((file) => ({
    file,
    url: URL.createObjectURL(file),
    focus: { x: 0.5, y: 0.5 },
  }))
  selectedFiles = [...selectedFiles, ...added]
  dom.runButton.disabled = false
  renderDropPreviews()
  added.forEach(loadDimensions)
}

// サムネイル下のサイズ表示用に画像の実寸を取得する（取得後に再描画）
async function loadDimensions(entry) {
  try {
    const bitmap = await decodeToBitmap(entry.file)
    const { width, height } = bitmap
    bitmap.close()
    selectedFiles = selectedFiles.map((e) =>
      e.file === entry.file ? { ...e, srcW: width, srcH: height } : e,
    )
    prefillScaleInputs()
    renderDropPreviews()
  } catch (error) {
    console.error(`${entry.file.name} のサイズ取得に失敗:`, error)
  }
}

// サイズ計算の基準になる画像（実寸が取得できた最初の1枚）
function referenceDims() {
  const entry = selectedFiles.find((e) => e.srcW)
  return entry ? { w: entry.srcW, h: entry.srcH } : null
}

function isScaleMode() {
  return (
    document.querySelector('input[name="resize-mode"]:checked').value === 'free' &&
    document.querySelector('input[name="free-mode"]:checked').value === 'scale'
  )
}

// 縮小モードで入力が空なら、1枚目の画像サイズを初期値として入れる
function prefillScaleInputs() {
  if (!isScaleMode()) return
  const ref = referenceDims()
  if (!ref) return
  if (dom.freeWidth.value === '' && dom.freeHeight.value === '') {
    dom.freeWidth.value = ref.w
    dom.freeHeight.value = ref.h
  }
}

// 縦横比を維持中は、片方の入力からもう片方を自動計算する（基準は1枚目の画像）
function syncLinkedInput(changed) {
  if (!isScaleMode() || !dom.keepRatio.checked) return
  const ref = referenceDims()
  if (!ref) return
  if (changed === 'width') {
    const w = Number(dom.freeWidth.value)
    if (w > 0) dom.freeHeight.value = Math.max(1, Math.round((w * ref.h) / ref.w))
  } else {
    const h = Number(dom.freeHeight.value)
    if (h > 0) dom.freeWidth.value = Math.max(1, Math.round((h * ref.w) / ref.h))
  }
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

    // ボタン類の配置基準になるサムネイル枠（下のサイズ表示とは分離）
    const thumb = document.createElement('div')
    thumb.className = 'preview-thumb'
    tile.appendChild(thumb)

    const img = document.createElement('img')
    img.src = entry.url
    img.alt = entry.file.name
    img.title = entry.file.name
    thumb.appendChild(img)

    const remove = document.createElement('button')
    remove.className = 'preview-remove'
    remove.type = 'button'
    remove.textContent = '×'
    remove.setAttribute('aria-label', `${entry.file.name} を削除`)
    remove.addEventListener('click', (event) => {
      event.stopPropagation()
      removeFile(index)
    })
    thumb.appendChild(remove)

    // 元サイズと変換後サイズの表示（実寸取得後のみ）
    if (entry.srcW) {
      const caption = document.createElement('div')
      caption.className = 'preview-size'
      const plan = computeRenderPlan(entry.srcW, entry.srcH, {
        ...readSettings().resize,
        focus: entry.focus,
      })
      caption.textContent =
        plan.outW !== entry.srcW || plan.outH !== entry.srcH
          ? `${entry.srcW}×${entry.srcH} → ${plan.outW}×${plan.outH}`
          : `${entry.srcW}×${entry.srcH}`
      tile.appendChild(caption)
    }

    const editorKind = cropEditorKind()
    if (editorKind) {
      const adjusted = entry.focus.x !== 0.5 || entry.focus.y !== 0.5
      const crop = document.createElement('button')
      crop.className = `preview-crop${adjusted ? ' adjusted' : ''}`
      crop.type = 'button'
      crop.textContent = '位置調整'
      crop.setAttribute('aria-label', `${entry.file.name} のトリミング位置を調整`)
      crop.addEventListener('click', (event) => {
        event.stopPropagation()
        const onApply = (focus, area, circle) => {
          selectedFiles = selectedFiles.map((e, i) => (i === index ? { ...e, focus } : e))
          // ドラッグで選んだ範囲を幅・高さ入力と正円状態に反映する
          if (area) {
            dom.freeWidth.value = area.w
            dom.freeHeight.value = area.h
            cropCircle = Boolean(circle)
          }
          renderDropPreviews()
        }
        if (editorKind === 'template') {
          openCropEditor({
            url: entry.url,
            template: findTemplate(dom.templateSelect.value),
            focus: entry.focus,
            onApply,
          })
        } else {
          openRegionEditor({
            url: entry.url,
            cropW: Number(dom.freeWidth.value) || 0,
            cropH: Number(dom.freeHeight.value) || 0,
            circle: cropCircle,
            focus: entry.focus,
            onApply,
          })
        }
      })
      thumb.appendChild(crop)
    }

    dom.dropPreviews.appendChild(tile)
  })

  const addTile = document.createElement('div')
  addTile.className = 'preview-add'
  addTile.textContent = '＋'
  addTile.title = '画像を追加'
  dom.dropPreviews.appendChild(addTile)
}

function readSettings() {
  const format = document.querySelector('input[name="format"]:checked').value
  const quality = Number(dom.quality.value)
  const mode = document.querySelector('input[name="resize-mode"]:checked').value
  // 背景透過はチェックボックスが表示されている文脈（切り抜き・テンプレート）でのみ有効
  const freeMode = document.querySelector('input[name="free-mode"]:checked').value
  const bgRemove = {
    enabled:
      dom.bgRemove.checked && (mode === 'template' || (mode === 'free' && freeMode === 'crop')),
    tolerance: Number(dom.bgTolerance.value),
  }

  if (mode === 'free') {
    return {
      format,
      quality,
      bgRemove,
      resize: {
        mode,
        freeMode,
        circle: cropCircle,
        width: Number(dom.freeWidth.value) || 0,
        height: Number(dom.freeHeight.value) || 0,
        keepRatio: dom.keepRatio.checked,
        noUpscale: dom.noUpscale.checked,
      },
    }
  }
  if (mode === 'template') {
    return {
      format,
      quality,
      bgRemove,
      resize: {
        mode,
        template: findTemplate(dom.templateSelect.value),
        fit: document.querySelector('input[name="fit-mode"]:checked').value,
        // 透過指定時はnull（JPG出力時のみ描画側で白が入る）
        bg: dom.bgTransparent.checked ? null : dom.bgColor.value,
      },
    }
  }
  return { format, quality, bgRemove, resize: { mode } }
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

  results = await Promise.all(selectedFiles.map((entry) => processFile(entry, settings)))
  refreshView()

  dom.runButton.disabled = false
  dom.runButton.textContent = '変換・圧縮を実行'
}

async function processFile(entry, settings) {
  const { file } = entry
  try {
    const bitmap = await decodeToBitmap(file)
    // 画像ごとのトリミング位置を反映する（切り抜きを伴わないモードでは無視される）
    const resize = { ...settings.resize, focus: entry.focus }
    const plan = computeRenderPlan(bitmap.width, bitmap.height, resize)
    const format = settings.format === 'same' ? detectFormat(file.type) : settings.format
    let imageData = renderImageData(bitmap, plan, format)
    bitmap.close()

    // 単色背景の透過化（JPGは透過を保持できないためスキップ）
    if (settings.bgRemove.enabled && format !== 'jpeg') {
      imageData = removeBackground(imageData, settings.bgRemove.tolerance)
    }

    const blob = await encodeImage(format, imageData, settings.quality)
    return {
      file,
      status: 'done',
      blob,
      previewUrl: URL.createObjectURL(blob),
      outputName: buildOutputName(file.name, format, settings.resize, plan),
      origSize: file.size,
      newSize: blob.size,
      outW: plan.outW,
      outH: plan.outH,
    }
  } catch (error) {
    console.error(`${file.name} の処理に失敗:`, error)
    return { file, status: 'error', errorMessage: error.message }
  }
}

function buildOutputName(originalName, format, resize, plan) {
  const dot = originalName.lastIndexOf('.')
  const base = dot > 0 ? originalName.slice(0, dot) : originalName
  const resized = resize.mode !== 'none'
  const suffix = resized ? `_${plan.outW}x${plan.outH}` : ''
  return `${base}${suffix}.${EXT_MAP[format]}`
}

function refreshView() {
  renderResults(dom.resultList, results, (result) => {
    downloadBlob(result.blob, result.outputName)
  })
  renderSummary(dom.summaryBar, dom.summaryText, results)
}

init()
