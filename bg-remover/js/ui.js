// 結果リスト・サマリーのDOM描画

import { t } from './i18n.js?v=20260614'

export function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

export function renderResults(listEl, results, onDownload) {
  listEl.replaceChildren()
  results.forEach((result) => {
    listEl.appendChild(buildResultItem(result, onDownload))
  })
}

function buildResultItem(result, onDownload) {
  const li = document.createElement('li')
  li.className = 'result-item'

  const thumb = document.createElement('img')
  thumb.className = 'result-thumb'
  thumb.alt = ''
  if (result.previewUrl) thumb.src = result.previewUrl
  li.appendChild(thumb)

  const info = document.createElement('div')
  const name = document.createElement('div')
  name.className = 'result-name'
  name.textContent = result.outputName ?? result.file.name
  info.appendChild(name)

  if (result.status === 'done') {
    const meta = document.createElement('div')
    meta.className = 'result-meta'
    // 透過PNGは元のJPGよりサイズが増えることが多いため、削減率ではなくサイズと寸法のみ示す
    meta.textContent =
      `${formatBytes(result.origSize)} → ${formatBytes(result.newSize)}` +
      `（${result.outW}×${result.outH}）`
    info.appendChild(meta)
  } else {
    const status = document.createElement('div')
    status.className = `result-status${result.status === 'error' ? ' error' : ''}`
    status.textContent = result.status === 'error' ? result.errorMessage : t.statusCutting
    info.appendChild(status)
  }
  li.appendChild(info)

  if (result.status === 'done') {
    const actions = document.createElement('div')
    actions.className = 'result-actions'
    const button = document.createElement('button')
    button.className = 'dl-button'
    button.textContent = t.download
    button.addEventListener('click', () => onDownload(result))
    actions.appendChild(button)
    li.appendChild(actions)
  }

  return li
}

export function renderSummary(barEl, textEl, results) {
  const done = results.filter((r) => r.status === 'done')
  if (done.length === 0) {
    barEl.hidden = true
    return
  }
  textEl.innerHTML = t.summary(done.length)
  barEl.hidden = false
}
