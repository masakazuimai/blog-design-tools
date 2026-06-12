// エントリーポイント: 設定の読み取り・イベント配線・変換パイプラインの実行

import { TEMPLATES, findTemplate, computeRenderPlan } from './resize.js'
import { detectFormat, decodeToBitmap, renderImageData, encodeImage, EXT_MAP } from './codecs.js'
import { renderResults, renderSummary } from './ui.js'
import { downloadBlob, downloadZip } from './download.js'
import { openCropEditor, openRegionEditor } from './crop-editor.js'
import { removeBackground } from './bg-remove.js'

const dom = {
  dropZone: document.getElementById('drop-zone'),
  dropPlaceholder: document.getElementById('drop-placeholder'),
  dropPreviews: document.getElementById('drop-previews'),
  fileInput: document.getElementById('file-input'),
  quality: document.getElementById('quality'),
  qualityValue: document.getElementById('quality-value'),
  bgRemove: document.getElementById('bg-remove'),
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
  circleCropRow: document.getElementById('circle-crop-row'),
  circleCrop: document.getElementById('circle-crop'),
  circleHint: document.getElementById('circle-hint'),
  keepRatio: document.getElementById('keep-ratio'),
  noUpscale: document.getElementById('no-upscale'),
  svgHint: document.getElementById('svg-hint'),
  runButton: document.getElementById('run-button'),
  resultList: document.getElementById('result-list'),
  summaryBar: document.getElementById('summary-bar'),
  summaryText: document.getElementById('summary-text'),
  zipButton: document.getElementById('zip-button'),
}

let selectedFiles = [] // {file, url, focus} の配列（urlはプレビュー用Object URL、focusは切り抜き位置0〜1）
let results = []

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
  dom.circleCrop.addEventListener('change', updateResizePanels)
  dom.bgTransparent.addEventListener('change', updateResizePanels)
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
  // 正円切り抜きはテンプレート以外（リサイズしない・縮小・切り抜き）で利用可能
  dom.circleCropRow.hidden = mode === 'template'
  dom.circleHint.hidden = mode === 'template' || !dom.circleCrop.checked
  // 切り抜き系の設定時のみ位置調整ボタンを出すため再描画する
  renderDropPreviews()
}

// 位置調整が意味を持つ設定か
// template: カバー切り抜き / free-crop: 指定サイズ切り抜き / circle: 正円のみ（リサイズしない・縮小）
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
  return dom.circleCrop.checked ? 'circle' : null
}

function addFiles(files) {
  if (files.length === 0) return
  selectedFiles = [
    ...selectedFiles,
    ...files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
      focus: { x: 0.5, y: 0.5 },
    })),
  ]
  dom.runButton.disabled = false
  renderDropPreviews()
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
        const onApply = (focus) => {
          selectedFiles = selectedFiles.map((e, i) => (i === index ? { ...e, focus } : e))
          renderDropPreviews()
        }
        if (editorKind === 'template') {
          openCropEditor({
            url: entry.url,
            template: findTemplate(dom.templateSelect.value),
            focus: entry.focus,
            onApply,
          })
        } else if (editorKind === 'free-crop') {
          openRegionEditor({
            url: entry.url,
            cropW: Number(dom.freeWidth.value) || 0,
            cropH: Number(dom.freeHeight.value) || 0,
            circle: dom.circleCrop.checked,
            focus: entry.focus,
            onApply,
          })
        } else {
          // 正円のみ（リサイズしない・縮小）: 直径は画像の短辺
          openRegionEditor({
            url: entry.url,
            cropW: 0,
            cropH: 0,
            circle: true,
            focus: entry.focus,
            onApply,
          })
        }
      })
      tile.appendChild(crop)
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
  const bgRemove = {
    enabled: dom.bgRemove.checked,
    tolerance: Number(dom.bgTolerance.value),
  }
  const mode = document.querySelector('input[name="resize-mode"]:checked').value

  if (mode === 'free') {
    return {
      format,
      quality,
      bgRemove,
      resize: {
        mode,
        freeMode: document.querySelector('input[name="free-mode"]:checked').value,
        circle: dom.circleCrop.checked,
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
  return { format, quality, bgRemove, resize: { mode, circle: dom.circleCrop.checked } }
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
  const resized = resize.mode !== 'none' || resize.circle
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
