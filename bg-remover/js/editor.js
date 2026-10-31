
import { t } from './i18n.js?v=20260614'

const UNDO_LIMIT = 10
const MIN_ZOOM = 1
const MAX_ZOOM = 8

export async function runEditor(originalFile, cutoutBlob) {
  const [originalBitmap, cutoutBitmap] = await Promise.all([
    createImageBitmap(originalFile),
    createImageBitmap(cutoutBlob),
  ])
  const width = cutoutBitmap.width
  const height = cutoutBitmap.height

  const originalCanvas = document.createElement('canvas')
  originalCanvas.width = width
  originalCanvas.height = height
  const originalCtx = originalCanvas.getContext('2d')
  originalCtx.drawImage(originalBitmap, 0, 0, width, height)
  originalBitmap.close()
  const originalData = originalCtx.getImageData(0, 0, width, height)

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  canvas.className = 'editor-work'
  const ctx = canvas.getContext('2d')
  ctx.drawImage(cutoutBitmap, 0, 0)
  cutoutBitmap.close()
  const initialImage = ctx.getImageData(0, 0, width, height)

  originalCanvas.className = 'editor-layer editor-ghost'
  const tintCanvas = document.createElement('canvas')
  tintCanvas.width = width
  tintCanvas.height = height
  tintCanvas.className = 'editor-layer editor-tint'
  const tintCtx = tintCanvas.getContext('2d')

  return new Promise((resolve) => {
    const ui = buildEditorDom({ work: canvas, ghost: originalCanvas, tint: tintCanvas })
    document.body.appendChild(ui.root)
    document.body.style.overflow = 'hidden'

    const undoStack = []
    let mode = 'erase'
    let brushDisplay = 40
    let drawing = false
    let last = null

    let autoSelect = false
    let tolerance = 30

    let zoom = 1
    let panX = 0
    let panY = 0
    const pointers = new Map()
    let panning = false
    let panStart = null
    let pinch = null
    let spaceHeld = false
    let panTool = false

    function close(result) {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('keyup', onKeyUp)
      document.body.style.overflow = ''
      ui.root.remove()
      resolve(result)
    }

    function displayScale() {
      const rect = canvas.getBoundingClientRect()
      return canvas.width / rect.width
    }
    function pointToCanvas(clientX, clientY) {
      const rect = canvas.getBoundingClientRect()
      return {
        x: (clientX - rect.left) * (canvas.width / rect.width),
        y: (clientY - rect.top) * (canvas.height / rect.height),
      }
    }
    function toCanvasPoint(ev) {
      return pointToCanvas(ev.clientX, ev.clientY)
    }
    function brushRadius() {
      return (brushDisplay / 2) * displayScale()
    }

    function clamp(v, lo, hi) {
      return Math.min(hi, Math.max(lo, v))
    }
    function applyTransform() {
      ui.surface.style.transform = `translate(${panX}px, ${panY}px) scale(${zoom})`
    }
    function updateZoomLabel() {
      ui.zoomValue.textContent = `${Math.round(zoom * 100)}%`
      ui.zoomOut.disabled = zoom <= MIN_ZOOM + 0.001
      ui.zoomIn.disabled = zoom >= MAX_ZOOM - 0.001
    }
    function clampPan() {
      const s = ui.stage.getBoundingClientRect()
      const r = canvas.getBoundingClientRect()
      const margin = 40
      let dx = 0
      let dy = 0
      if (r.right < s.left + margin) dx = s.left + margin - r.right
      else if (r.left > s.right - margin) dx = s.right - margin - r.left
      if (r.bottom < s.top + margin) dy = s.top + margin - r.bottom
      else if (r.top > s.bottom - margin) dy = s.bottom - margin - r.top
      if (dx || dy) {
        panX += dx
        panY += dy
        applyTransform()
      }
    }
    function zoomAt(clientX, clientY, target) {
      const next = clamp(target, MIN_ZOOM, MAX_ZOOM)
      if (Math.abs(next - zoom) < 0.0001) return
      const p = pointToCanvas(clientX, clientY)
      zoom = next
      if (zoom === MIN_ZOOM) {
        panX = 0
        panY = 0
        applyTransform()
        updateZoomLabel()
        return
      }
      applyTransform()
      const rect = canvas.getBoundingClientRect()
      const screenX = rect.left + (p.x / canvas.width) * rect.width
      const screenY = rect.top + (p.y / canvas.height) * rect.height
      panX += clientX - screenX
      panY += clientY - screenY
      applyTransform()
      clampPan()
      updateZoomLabel()
    }
    function panBy(dx, dy) {
      if (zoom <= MIN_ZOOM) return
      panX += dx
      panY += dy
      applyTransform()
      clampPan()
    }
    function zoomByButton(factor) {
      const s = ui.stage.getBoundingClientRect()
      zoomAt(s.left + s.width / 2, s.top + s.height / 2, zoom * factor)
    }
    function resetZoom() {
      zoom = 1
      panX = 0
      panY = 0
      applyTransform()
      updateZoomLabel()
    }
    function updatePanCursor() {
      const ready = (panTool || spaceHeld) && !panning
      ui.surface.classList.toggle('pan-ready', ready)
      ui.surface.classList.toggle('panning', panning)
      if (panTool || spaceHeld || panning) ui.cursor.hidden = true
    }

    function pushUndo() {
      undoStack.push(ctx.getImageData(0, 0, width, height))
      if (undoStack.length > UNDO_LIMIT) undoStack.shift()
      ui.undoBtn.disabled = false
    }
    function undo() {
      const snap = undoStack.pop()
      if (!snap) return
      ctx.putImageData(snap, 0, 0)
      ui.undoBtn.disabled = undoStack.length === 0
      if (mode === 'restore') renderTint()
    }

    function renderTint() {
      tintCtx.clearRect(0, 0, width, height)
      tintCtx.globalCompositeOperation = 'source-over'
      tintCtx.drawImage(canvas, 0, 0)
      tintCtx.globalCompositeOperation = 'source-in'
      tintCtx.fillStyle = 'rgba(255, 45, 45, 0.55)'
      tintCtx.fillRect(0, 0, width, height)
      tintCtx.globalCompositeOperation = 'source-over'
    }
    let overlayRaf = 0
    function scheduleOverlay() {
      if (mode !== 'restore' || overlayRaf) return
      overlayRaf = requestAnimationFrame(() => {
        overlayRaf = 0
        renderTint()
      })
    }

    function stamp(x, y, r) {
      if (mode === 'erase') {
        ctx.globalCompositeOperation = 'destination-out'
        ctx.beginPath()
        ctx.arc(x, y, r, 0, Math.PI * 2)
        ctx.fill()
        ctx.globalCompositeOperation = 'source-over'
      } else {
        ctx.save()
        ctx.beginPath()
        ctx.arc(x, y, r, 0, Math.PI * 2)
        ctx.clip()
        ctx.drawImage(originalCanvas, 0, 0)
        ctx.restore()
      }
    }
    function strokeTo(p) {
      const r = brushRadius()
      if (!last) {
        stamp(p.x, p.y, r)
        last = p
        return
      }
      const dist = Math.hypot(p.x - last.x, p.y - last.y)
      const step = Math.max(1, r / 3)
      const n = Math.max(1, Math.ceil(dist / step))
      for (let i = 1; i <= n; i += 1) {
        const t = i / n
        stamp(last.x + (p.x - last.x) * t, last.y + (p.y - last.y) * t, r)
      }
      last = p
    }

    function toleranceThreshold() {
      const dist = tolerance * 1.6
      return dist * dist
    }
    function buildWandMask(seedX, seedY) {
      const sx = Math.floor(seedX)
      const sy = Math.floor(seedY)
      if (sx < 0 || sy < 0 || sx >= width || sy >= height) return null
      const data = originalData.data
      const seed = sy * width + sx
      const tr = data[seed * 4]
      const tg = data[seed * 4 + 1]
      const tb = data[seed * 4 + 2]
      const thr = toleranceThreshold()
      const mask = new Uint8Array(width * height)
      const stack = [seed]
      mask[seed] = 1
      const tryPush = (q) => {
        if (mask[q]) return
        const o = q * 4
        const dr = data[o] - tr
        const dg = data[o + 1] - tg
        const db = data[o + 2] - tb
        if (dr * dr + dg * dg + db * db <= thr) {
          mask[q] = 1
          stack.push(q)
        }
      }
      while (stack.length) {
        const p = stack.pop()
        const x = p % width
        if (x > 0) tryPush(p - 1)
        if (x < width - 1) tryPush(p + 1)
        if (p >= width) tryPush(p - width)
        if (p < width * (height - 1)) tryPush(p + width)
      }
      return mask
    }
    function applyMask(mask) {
      const work = ctx.getImageData(0, 0, width, height)
      const wd = work.data
      if (mode === 'erase') {
        for (let i = 0; i < mask.length; i += 1) {
          if (mask[i]) wd[i * 4 + 3] = 0
        }
      } else {
        const od = originalData.data
        for (let i = 0; i < mask.length; i += 1) {
          if (mask[i]) {
            const o = i * 4
            wd[o] = od[o]
            wd[o + 1] = od[o + 1]
            wd[o + 2] = od[o + 2]
            wd[o + 3] = od[o + 3]
          }
        }
      }
      ctx.putImageData(work, 0, 0)
    }
    function autoSelectAt(ev) {
      const p = toCanvasPoint(ev)
      const mask = buildWandMask(p.x, p.y)
      if (!mask) return
      pushUndo()
      applyMask(mask)
      if (mode === 'restore') renderTint()
    }

    function moveCursor(ev) {
      if (autoSelect || panTool || spaceHeld || panning) {
        ui.cursor.hidden = true
        return
      }
      ui.cursor.hidden = false
      ui.cursor.style.width = `${brushDisplay}px`
      ui.cursor.style.height = `${brushDisplay}px`
      ui.cursor.style.left = `${ev.clientX}px`
      ui.cursor.style.top = `${ev.clientY}px`
    }

    function startPan(ev) {
      panning = true
      panStart = { x: ev.clientX, y: ev.clientY }
      updatePanCursor()
      try {
        ui.surface.setPointerCapture(ev.pointerId)
      } catch {
      }
    }

    ui.surface.addEventListener('pointerdown', (ev) => {
      pointers.set(ev.pointerId, { x: ev.clientX, y: ev.clientY })

      if (ev.pointerType === 'touch' && pointers.size === 2) {
        drawing = false
        last = null
        const pts = [...pointers.values()]
        const dist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y)
        pinch = { dist: dist || 1, zoom }
        return
      }
      if (pinch) return

      if (ev.button === 1 || spaceHeld || panTool) {
        ev.preventDefault()
        startPan(ev)
        return
      }
      if (ev.pointerType !== 'touch' && ev.button !== 0) return

      if (autoSelect) {
        autoSelectAt(ev)
        return
      }

      drawing = true
      try {
        ui.surface.setPointerCapture(ev.pointerId)
      } catch {
      }
      pushUndo()
      last = null
      strokeTo(toCanvasPoint(ev))
      scheduleOverlay()
    })
    ui.surface.addEventListener('pointermove', (ev) => {
      if (pointers.has(ev.pointerId)) pointers.set(ev.pointerId, { x: ev.clientX, y: ev.clientY })

      if (pinch && pointers.size >= 2) {
        const pts = [...pointers.values()]
        const dist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y)
        const midX = (pts[0].x + pts[1].x) / 2
        const midY = (pts[0].y + pts[1].y) / 2
        zoomAt(midX, midY, pinch.zoom * (dist / pinch.dist))
        return
      }
      if (panning) {
        panBy(ev.clientX - panStart.x, ev.clientY - panStart.y)
        panStart = { x: ev.clientX, y: ev.clientY }
        return
      }
      moveCursor(ev)
      if (drawing) {
        strokeTo(toCanvasPoint(ev))
        scheduleOverlay()
      }
    })
    function endPointer(ev) {
      pointers.delete(ev.pointerId)
      if (pinch && pointers.size < 2) pinch = null
      if (panning) {
        panning = false
        updatePanCursor()
      }
      if (drawing) {
        drawing = false
        last = null
        if (mode === 'restore') renderTint()
      }
    }
    ui.surface.addEventListener('pointerup', endPointer)
    ui.surface.addEventListener('pointercancel', endPointer)
    ui.surface.addEventListener('pointerleave', () => {
      ui.cursor.hidden = true
    })

    ui.stage.addEventListener(
      'wheel',
      (ev) => {
        ev.preventDefault()
        const factor = ev.deltaY < 0 ? 1.15 : 1 / 1.15
        zoomAt(ev.clientX, ev.clientY, zoom * factor)
      },
      { passive: false },
    )

    function setMode(next) {
      mode = next
      const restore = next === 'restore'
      ui.modeErase.classList.toggle('active', next === 'erase')
      ui.modeRestore.classList.toggle('active', restore)
      ui.surface.classList.toggle('restore-mode', restore)
      if (restore) renderTint()
    }
    ui.modeErase.addEventListener('click', () => setMode('erase'))
    ui.modeRestore.addEventListener('click', () => setMode('restore'))

    ui.size.addEventListener('input', () => {
      brushDisplay = Number(ui.size.value)
      ui.sizeValue.textContent = brushDisplay
    })

    ui.autoBtn.addEventListener('click', () => {
      autoSelect = !autoSelect
      ui.autoBtn.classList.toggle('active', autoSelect)
      ui.surface.classList.toggle('auto-mode', autoSelect)
      ui.sizeWrap.hidden = autoSelect
      ui.tolWrap.hidden = !autoSelect
      ui.cursor.hidden = true
    })
    ui.tol.addEventListener('input', () => {
      tolerance = Number(ui.tol.value)
      ui.tolValue.textContent = tolerance
    })

    ui.zoomIn.addEventListener('click', () => zoomByButton(1.25))
    ui.zoomOut.addEventListener('click', () => zoomByButton(1 / 1.25))
    ui.zoomValue.addEventListener('click', resetZoom)
    ui.panBtn.addEventListener('click', () => {
      panTool = !panTool
      ui.panBtn.classList.toggle('active', panTool)
      updatePanCursor()
    })

    ui.undoBtn.addEventListener('click', undo)
    ui.resetBtn.addEventListener('click', () => {
      pushUndo()
      ctx.putImageData(initialImage, 0, 0)
      if (mode === 'restore') renderTint()
    })
    ui.cancelBtn.addEventListener('click', () => close(null))
    ui.backdrop.addEventListener('click', () => close(null))
    ui.applyBtn.addEventListener('click', () => {
      canvas.toBlob((blob) => close(blob ?? null), 'image/png')
    })

    function onKey(ev) {
      if (ev.key === 'Escape') {
        close(null)
      } else if ((ev.ctrlKey || ev.metaKey) && ev.key.toLowerCase() === 'z') {
        ev.preventDefault()
        undo()
      } else if (ev.key === ' ' || ev.code === 'Space') {
        ev.preventDefault()
        if (!spaceHeld) {
          spaceHeld = true
          updatePanCursor()
        }
      } else if ((ev.ctrlKey || ev.metaKey) && (ev.key === '+' || ev.key === '=')) {
        ev.preventDefault()
        zoomByButton(1.25)
      } else if ((ev.ctrlKey || ev.metaKey) && ev.key === '-') {
        ev.preventDefault()
        zoomByButton(1 / 1.25)
      } else if ((ev.ctrlKey || ev.metaKey) && ev.key === '0') {
        ev.preventDefault()
        resetZoom()
      }
    }
    function onKeyUp(ev) {
      if (ev.key === ' ' || ev.code === 'Space') {
        spaceHeld = false
        updatePanCursor()
      }
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('keyup', onKeyUp)

    setMode('erase')
    ui.size.value = String(brushDisplay)
    ui.sizeValue.textContent = brushDisplay
    ui.tol.value = String(tolerance)
    ui.tolValue.textContent = tolerance
    ui.tolWrap.hidden = true
    ui.undoBtn.disabled = true
    updateZoomLabel()
  })
}

const ERASE_ICON =
  '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
  'stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
  '<path d="m7 21-4-4a2 2 0 0 1 0-3L14 3a2 2 0 0 1 3 0l4 4a2 2 0 0 1 0 3L11 21Z"/>' +
  '<path d="M8 21h12"/><path d="m6 11 6 6"/></svg>'

const RESTORE_ICON =
  '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
  'stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
  '<path d="M3 7v6h6"/><path d="M3 13a9 9 0 1 0 3-7.7L3 8"/></svg>'

const WAND_ICON =
  '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
  'stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
  '<path d="M15 4V2"/><path d="M15 16v-2"/><path d="M8 9h2"/><path d="M20 9h2"/>' +
  '<path d="M17.8 11.8 19 13"/><path d="M15 9h.01"/><path d="M17.8 6.2 19 5"/>' +
  '<path d="m3 21 9-9"/><path d="M12.2 6.2 11 5"/></svg>'

const HAND_ICON =
  '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
  'stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
  '<path d="M18 11V6a2 2 0 0 0-2-2 2 2 0 0 0-2 2"/>' +
  '<path d="M14 10V4a2 2 0 0 0-2-2 2 2 0 0 0-2 2v2"/>' +
  '<path d="M10 10.5V6a2 2 0 0 0-2-2 2 2 0 0 0-2 2v8"/>' +
  '<path d="M18 8a2 2 0 0 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"/></svg>'

function buildEditorDom(layers) {
  const root = document.createElement('div')
  root.className = 'editor-modal'

  const backdrop = document.createElement('div')
  backdrop.className = 'editor-backdrop'
  root.appendChild(backdrop)

  const panel = document.createElement('div')
  panel.className = 'editor-panel'
  root.appendChild(panel)

  const toolbar = document.createElement('div')
  toolbar.className = 'editor-toolbar'
  panel.appendChild(toolbar)

  const modeErase = makeToolButton(ERASE_ICON, t.editorErase)
  const modeRestore = makeToolButton(RESTORE_ICON, t.editorRestore)
  const modes = document.createElement('div')
  modes.className = 'editor-modes'
  modes.append(modeErase, modeRestore)
  toolbar.appendChild(modes)

  const tools = document.createElement('div')
  tools.className = 'editor-tools'
  const autoBtn = makeToolButton(WAND_ICON, t.editorAutoSelect)
  tools.appendChild(autoBtn)
  toolbar.appendChild(tools)

  const sizeWrap = document.createElement('label')
  sizeWrap.className = 'editor-size'
  const sizeLabel = document.createElement('span')
  sizeLabel.textContent = t.editorBrush
  const size = document.createElement('input')
  size.type = 'range'
  size.min = '10'
  size.max = '160'
  const sizeValue = document.createElement('span')
  sizeValue.className = 'editor-size-value'
  sizeWrap.append(sizeLabel, size, sizeValue)
  toolbar.appendChild(sizeWrap)

  const tolWrap = document.createElement('label')
  tolWrap.className = 'editor-size'
  tolWrap.hidden = true
  const tolLabel = document.createElement('span')
  tolLabel.textContent = t.editorTolerance
  const tol = document.createElement('input')
  tol.type = 'range'
  tol.min = '0'
  tol.max = '100'
  const tolValue = document.createElement('span')
  tolValue.className = 'editor-size-value'
  tolWrap.append(tolLabel, tol, tolValue)
  toolbar.appendChild(tolWrap)

  const zoomWrap = document.createElement('div')
  zoomWrap.className = 'editor-zoom'
  const zoomOut = makeZoomButton('−', t.editorZoomOut)
  const zoomValue = document.createElement('button')
  zoomValue.type = 'button'
  zoomValue.className = 'editor-zoom-value'
  zoomValue.title = t.editorResetZoomTitle
  const zoomIn = makeZoomButton('＋', t.editorZoomIn)
  const panBtn = makeToolButton(HAND_ICON, t.editorPan)
  panBtn.classList.add('editor-pan')
  zoomWrap.append(zoomOut, zoomValue, zoomIn, panBtn)
  toolbar.appendChild(zoomWrap)

  const undoBtn = makeTextButton(t.editorUndo)
  const resetBtn = makeTextButton(t.editorResetToAI)
  const spacer = document.createElement('div')
  spacer.className = 'editor-spacer'
  const cancelBtn = makeTextButton(t.editorCancel)
  const applyBtn = makeTextButton(t.editorApply)
  applyBtn.classList.add('primary')
  toolbar.append(undoBtn, resetBtn, spacer, cancelBtn, applyBtn)

  const stage = document.createElement('div')
  stage.className = 'editor-stage'
  const wrap = document.createElement('div')
  wrap.className = 'editor-canvas-wrap'
  wrap.append(layers.ghost, layers.work, layers.tint)
  stage.appendChild(wrap)
  panel.appendChild(stage)

  const hint = document.createElement('p')
  hint.className = 'editor-hint'
  hint.textContent = t.editorHint
  panel.appendChild(hint)

  const cursor = document.createElement('div')
  cursor.className = 'editor-cursor'
  cursor.hidden = true
  root.appendChild(cursor)

  return {
    root,
    backdrop,
    stage,
    surface: wrap,
    modeErase,
    modeRestore,
    autoBtn,
    sizeWrap,
    size,
    sizeValue,
    tolWrap,
    tol,
    tolValue,
    zoomOut,
    zoomIn,
    zoomValue,
    panBtn,
    undoBtn,
    resetBtn,
    cancelBtn,
    applyBtn,
    cursor,
  }
}

function makeToolButton(icon, label) {
  const button = document.createElement('button')
  button.className = 'editor-mode'
  button.type = 'button'
  button.innerHTML = icon
  button.appendChild(document.createTextNode(label))
  return button
}

function makeZoomButton(symbol, label) {
  const button = document.createElement('button')
  button.className = 'editor-zoom-btn'
  button.type = 'button'
  button.textContent = symbol
  button.setAttribute('aria-label', label)
  button.title = label
  return button
}

function makeTextButton(label) {
  const button = document.createElement('button')
  button.className = 'editor-btn'
  button.type = 'button'
  button.textContent = label
  return button
}
