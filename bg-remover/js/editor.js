// 切り抜き結果を手動レタッチするモーダルエディタ
// 消去ブラシ（被写体を減らす＝alpha→0）と復元ブラシ（元画像から塗り戻して被写体を増やす）を提供する
// runEditor(originalFile, cutoutBlob) → 編集済み透過PNGのBlob / キャンセル時は null

const UNDO_LIMIT = 10 // やり直し履歴の上限（大きい画像のメモリ消費を抑えるため控えめにする）

export async function runEditor(originalFile, cutoutBlob) {
  const [originalBitmap, cutoutBitmap] = await Promise.all([
    createImageBitmap(originalFile),
    createImageBitmap(cutoutBlob),
  ])
  const width = cutoutBitmap.width
  const height = cutoutBitmap.height

  // 復元ブラシ用に、元画像を切り抜きと同じ解像度で保持する
  const originalCanvas = document.createElement('canvas')
  originalCanvas.width = width
  originalCanvas.height = height
  originalCanvas.getContext('2d').drawImage(originalBitmap, 0, 0, width, height)
  originalBitmap.close()

  // 編集対象キャンバス（初期状態は切り抜き結果。出力もこれを使う）
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  canvas.className = 'editor-work'
  const ctx = canvas.getContext('2d')
  ctx.drawImage(cutoutBitmap, 0, 0)
  cutoutBitmap.close()
  // 「AI結果に戻す」用に初期状態を保持する
  const initialImage = ctx.getImageData(0, 0, width, height)

  // 復元モードのガイド表示用レイヤー（表示専用・出力には影響しない）
  // ghost: 元画像を薄く全面表示（originalCanvasを流用） / tint: 現在の被写体を赤くなぞる
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
    let mode = 'erase' // 'erase' | 'restore'
    let brushDisplay = 40 // 表示px基準のブラシ直径（実際の塗り半径は表示倍率に応じて換算）
    let drawing = false
    let last = null

    function close(result) {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
      ui.root.remove()
      resolve(result)
    }

    // 表示倍率（キャンバスの実ピクセル / 画面表示ピクセル）
    function displayScale() {
      const rect = canvas.getBoundingClientRect()
      return canvas.width / rect.width
    }
    function toCanvasPoint(ev) {
      const rect = canvas.getBoundingClientRect()
      const s = canvas.width / rect.width
      return { x: (ev.clientX - rect.left) * s, y: (ev.clientY - rect.top) * s }
    }
    function brushRadius() {
      return (brushDisplay / 2) * displayScale()
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

    // 復元モードのガイド: 現在の被写体（alpha>0の領域）を赤くなぞる
    function renderTint() {
      tintCtx.clearRect(0, 0, width, height)
      tintCtx.globalCompositeOperation = 'source-over'
      tintCtx.drawImage(canvas, 0, 0)
      tintCtx.globalCompositeOperation = 'source-in'
      tintCtx.fillStyle = 'rgba(255, 45, 45, 0.55)'
      tintCtx.fillRect(0, 0, width, height)
      tintCtx.globalCompositeOperation = 'source-over'
    }
    // 描画中はフレーム単位に間引いてガイドを更新する（大画像での負荷を抑える）
    let overlayRaf = 0
    function scheduleOverlay() {
      if (mode !== 'restore' || overlayRaf) return
      overlayRaf = requestAnimationFrame(() => {
        overlayRaf = 0
        renderTint()
      })
    }

    // ブラシの1スタンプ。消去はalphaを削り、復元は元画像を円内にだけ描き戻す
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
    // 直線補間で連続スタンプし、速い動きでも隙間ができないようにする
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

    function moveCursor(ev) {
      ui.cursor.hidden = false
      ui.cursor.style.width = `${brushDisplay}px`
      ui.cursor.style.height = `${brushDisplay}px`
      ui.cursor.style.left = `${ev.clientX}px`
      ui.cursor.style.top = `${ev.clientY}px`
    }

    ui.surface.addEventListener('pointerdown', (ev) => {
      if (ev.button !== 0) return
      drawing = true
      try {
        ui.surface.setPointerCapture(ev.pointerId)
      } catch {
        // 一部環境（合成イベント等）でポインタ捕捉に失敗しても描画は続行する
      }
      pushUndo()
      last = null
      strokeTo(toCanvasPoint(ev))
      scheduleOverlay()
    })
    ui.surface.addEventListener('pointermove', (ev) => {
      moveCursor(ev)
      if (drawing) {
        strokeTo(toCanvasPoint(ev))
        scheduleOverlay()
      }
    })
    ui.surface.addEventListener('pointerup', () => {
      drawing = false
      last = null
      if (mode === 'restore') renderTint()
    })
    ui.surface.addEventListener('pointerleave', () => {
      ui.cursor.hidden = true
    })

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
      }
    }
    document.addEventListener('keydown', onKey)

    setMode('erase')
    ui.size.value = String(brushDisplay)
    ui.sizeValue.textContent = brushDisplay
    ui.undoBtn.disabled = true
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

// モーダルのDOMを構築し、制御に必要な要素参照を返す
// layers: { work, ghost, tint } の3キャンバスを重ねて表示する
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

  const modeErase = makeToolButton(ERASE_ICON, '消去')
  const modeRestore = makeToolButton(RESTORE_ICON, '復元')
  const modes = document.createElement('div')
  modes.className = 'editor-modes'
  modes.append(modeErase, modeRestore)
  toolbar.appendChild(modes)

  const sizeWrap = document.createElement('label')
  sizeWrap.className = 'editor-size'
  const sizeLabel = document.createElement('span')
  sizeLabel.textContent = 'ブラシ'
  const size = document.createElement('input')
  size.type = 'range'
  size.min = '10'
  size.max = '160'
  const sizeValue = document.createElement('span')
  sizeValue.className = 'editor-size-value'
  sizeWrap.append(sizeLabel, size, sizeValue)
  toolbar.appendChild(sizeWrap)

  const undoBtn = makeTextButton('やり直し')
  const resetBtn = makeTextButton('AI結果に戻す')
  const spacer = document.createElement('div')
  spacer.className = 'editor-spacer'
  const cancelBtn = makeTextButton('キャンセル')
  const applyBtn = makeTextButton('適用')
  applyBtn.classList.add('primary')
  toolbar.append(undoBtn, resetBtn, spacer, cancelBtn, applyBtn)

  const stage = document.createElement('div')
  stage.className = 'editor-stage'
  const wrap = document.createElement('div')
  wrap.className = 'editor-canvas-wrap'
  // ghost(背面) → work → tint(前面) の順で重ねる。workが在席してラップの寸法を決める
  wrap.append(layers.ghost, layers.work, layers.tint)
  stage.appendChild(wrap)
  panel.appendChild(stage)

  const hint = document.createElement('p')
  hint.className = 'editor-hint'
  hint.textContent =
    '消去＝余分に残った背景を消す / 復元＝消えすぎた被写体を元画像から塗り戻す（Ctrl+Z でやり直し）'
  panel.appendChild(hint)

  // ブラシ位置を示すリング（画面全体に対する固定配置のためroot直下に置く）
  const cursor = document.createElement('div')
  cursor.className = 'editor-cursor'
  cursor.hidden = true
  root.appendChild(cursor)

  return {
    root,
    backdrop,
    surface: wrap,
    modeErase,
    modeRestore,
    size,
    sizeValue,
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

function makeTextButton(label) {
  const button = document.createElement('button')
  button.className = 'editor-btn'
  button.type = 'button'
  button.textContent = label
  return button
}
