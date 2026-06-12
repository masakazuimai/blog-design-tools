// トリミング位置調整モーダル
// - template用: 固定枠の中で画像をドラッグ（カバー切り抜き）
// - 自由サイズ切り抜き用: 元画像全体を表示し、切り抜き枠（矩形・正円）をドラッグ

import { circleDiameter } from './resize.js'

const dom = {
  modal: document.getElementById('crop-modal'),
  frame: document.getElementById('crop-frame'),
  image: document.getElementById('crop-image'),
  region: document.getElementById('crop-region'),
  hint: document.getElementById('crop-hint'),
  reset: document.getElementById('crop-reset'),
  apply: document.getElementById('crop-apply'),
  close: document.getElementById('crop-close'),
}

let session = null // { mode, focus, overflowX, overflowY, regionW, regionH, onApply }
let dragStart = null

// テンプレート用: 枠の中で画像をドラッグして切り抜き位置を決める
export function openCropEditor({ url, template, focus, onApply }) {
  loadImage(url, (img) => setupImageDrag(img, url, template, focus, onApply))
}

// 自由サイズ切り抜き用: 元画像のプレビュー上で切り抜き枠をドラッグする
export function openRegionEditor({ url, cropW, cropH, circle, focus, onApply }) {
  loadImage(url, (img) => setupRegionDrag(img, url, cropW, cropH, circle, focus, onApply))
}

function loadImage(url, onLoad) {
  const img = new Image()
  img.onload = () => onLoad(img)
  img.onerror = () => console.error('トリミング調整用の画像読み込みに失敗:', url)
  img.src = url
}

function setupImageDrag(img, url, template, focus, onApply) {
  const imgW = img.naturalWidth || 1
  const imgH = img.naturalHeight || 1

  // フレームはテンプレートの縦横比を保ったまま最大440×360px（小画面では画面幅）に収める
  const maxFrameW = Math.min(440, window.innerWidth - 72)
  const frameScale = Math.min(maxFrameW / template.w, 360 / template.h)
  const frameW = Math.round(template.w * frameScale)
  const frameH = Math.round(template.h * frameScale)
  dom.frame.style.width = `${frameW}px`
  dom.frame.style.height = `${frameH}px`

  // カバー配置（フレームを埋める倍率）ではみ出した分がドラッグ可能量になる
  const cover = Math.max(frameW / imgW, frameH / imgH)
  const dispW = imgW * cover
  const dispH = imgH * cover
  dom.image.src = url
  dom.image.style.width = `${dispW}px`
  dom.image.style.height = `${dispH}px`
  dom.image.classList.add('draggable')
  dom.region.hidden = true
  dom.hint.textContent = '画像をドラッグして、切り抜く位置を調整します。'

  session = {
    mode: 'image-drag',
    focus: { ...focus },
    overflowX: Math.max(0, dispW - frameW),
    overflowY: Math.max(0, dispH - frameH),
    onApply,
  }
  applyPosition()
  dom.modal.hidden = false
}

function setupRegionDrag(img, url, cropW, cropH, circle, focus, onApply) {
  const imgW = img.naturalWidth || 1
  const imgH = img.naturalHeight || 1
  // 未入力・画像超えの指定は画像サイズまでに丸める（処理側のplanFreeと同じ扱い）
  // 正円時は直径×直径の正方形を枠にする
  const d = circle ? circleDiameter(cropW || null, cropH || null, imgW, imgH) : null
  const effectiveW = circle ? d : Math.min(cropW > 0 ? cropW : imgW, imgW)
  const effectiveH = circle ? d : Math.min(cropH > 0 ? cropH : imgH, imgH)

  // 元画像全体を最大440×360px（小画面では画面幅）に収めて表示する
  const maxFrameW = Math.min(440, window.innerWidth - 72)
  const scale = Math.min(maxFrameW / imgW, 360 / imgH)
  const dispW = Math.round(imgW * scale)
  const dispH = Math.round(imgH * scale)
  dom.frame.style.width = `${dispW}px`
  dom.frame.style.height = `${dispH}px`
  dom.image.src = url
  dom.image.style.width = `${dispW}px`
  dom.image.style.height = `${dispH}px`
  dom.image.style.transform = 'none'
  dom.image.classList.remove('draggable')

  const regionW = Math.max(8, Math.round(effectiveW * scale))
  const regionH = Math.max(8, Math.round(effectiveH * scale))
  dom.region.style.width = `${regionW}px`
  dom.region.style.height = `${regionH}px`
  dom.region.classList.toggle('circle', Boolean(circle))
  dom.region.hidden = false
  dom.hint.textContent = circle
    ? '円の枠をドラッグして、切り抜く位置を調整します。'
    : '枠をドラッグして、切り抜く位置を調整します。'

  session = {
    mode: 'region-drag',
    focus: { ...focus },
    overflowX: Math.max(0, dispW - regionW),
    overflowY: Math.max(0, dispH - regionH),
    onApply,
  }
  applyPosition()
  dom.modal.hidden = false
}

function applyPosition() {
  const x = session.overflowX * session.focus.x
  const y = session.overflowY * session.focus.y
  if (session.mode === 'image-drag') {
    dom.image.style.transform = `translate(${-x}px, ${-y}px)`
  } else {
    dom.region.style.left = `${x}px`
    dom.region.style.top = `${y}px`
  }
}

function clamp01(value) {
  return Math.min(1, Math.max(0, value))
}

function closeModal() {
  dom.modal.hidden = true
  session = null
  dragStart = null
}

// ドラッグの向き: 画像ドラッグは画像の移動＝focusの逆方向、枠ドラッグはfocusと同方向
function handleDragMove(event, direction) {
  const dx = ((event.clientX - dragStart.x) / (session.overflowX || 1)) * direction
  const dy = ((event.clientY - dragStart.y) / (session.overflowY || 1)) * direction
  const fx = session.overflowX > 0 ? clamp01(dragStart.focus.x + dx) : 0.5
  const fy = session.overflowY > 0 ? clamp01(dragStart.focus.y + dy) : 0.5
  session = { ...session, focus: { x: fx, y: fy } }
  applyPosition()
}

function bindDragHandlers(el, direction, activeMode) {
  el.addEventListener('pointerdown', (event) => {
    if (!session || session.mode !== activeMode) return
    event.preventDefault()
    dragStart = { x: event.clientX, y: event.clientY, focus: { ...session.focus } }
    el.setPointerCapture(event.pointerId)
  })
  el.addEventListener('pointermove', (event) => {
    if (!dragStart || !session || session.mode !== activeMode) return
    handleDragMove(event, direction)
  })
  el.addEventListener('pointerup', () => {
    dragStart = null
  })
}

bindDragHandlers(dom.image, -1, 'image-drag')
bindDragHandlers(dom.region, 1, 'region-drag')

dom.reset.addEventListener('click', () => {
  if (!session) return
  session = { ...session, focus: { x: 0.5, y: 0.5 } }
  applyPosition()
})

dom.apply.addEventListener('click', () => {
  if (!session) return
  session.onApply({ ...session.focus })
  closeModal()
})

dom.close.addEventListener('click', closeModal)

dom.modal.addEventListener('click', (event) => {
  if (event.target === dom.modal) closeModal()
})
