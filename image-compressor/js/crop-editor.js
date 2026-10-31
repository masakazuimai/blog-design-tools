
import { t } from './i18n.js?v=20260614'

const dom = {
  modal: document.getElementById('crop-modal'),
  frame: document.getElementById('crop-frame'),
  image: document.getElementById('crop-image'),
  region: document.getElementById('crop-region'),
  regionHandle: document.getElementById('crop-region-handle'),
  hint: document.getElementById('crop-hint'),
  circleRow: document.getElementById('crop-circle-row'),
  circleToggle: document.getElementById('crop-circle-toggle'),
  reset: document.getElementById('crop-reset'),
  apply: document.getElementById('crop-apply'),
  close: document.getElementById('crop-close'),
}

let session = null
let dragStart = null
let resizeStart = null
let marquee = null

const MIN_REGION_PX = 24

export function openCropEditor({ url, template, focus, onApply }) {
  loadImage(url, (img) => setupImageDrag(img, url, template, focus, onApply))
}

export function openRegionEditor({ url, cropW, cropH, circle, focus, onApply }) {
  loadImage(url, (img) => setupRegionDrag(img, url, { cropW, cropH, circle, focus, onApply }))
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

  const maxFrameW = Math.min(440, window.innerWidth - 72)
  const frameScale = Math.min(maxFrameW / template.w, 360 / template.h)
  const frameW = Math.round(template.w * frameScale)
  const frameH = Math.round(template.h * frameScale)
  dom.frame.style.width = `${frameW}px`
  dom.frame.style.height = `${frameH}px`

  const cover = Math.max(frameW / imgW, frameH / imgH)
  const dispW = imgW * cover
  const dispH = imgH * cover
  dom.image.src = url
  dom.image.style.width = `${dispW}px`
  dom.image.style.height = `${dispH}px`
  dom.image.classList.add('draggable')
  dom.image.classList.remove('marquee')
  dom.region.hidden = true
  dom.circleRow.hidden = true
  dom.hint.textContent = t.cropHintImage

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

function setupRegionDrag(img, url, { cropW, cropH, circle, focus, onApply }) {
  const imgW = img.naturalWidth || 1
  const imgH = img.naturalHeight || 1
  const effW = Math.min(cropW > 0 ? cropW : imgW, imgW)
  const effH = Math.min(cropH > 0 ? cropH : imgH, imgH)

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
  dom.image.classList.add('marquee')

  dom.region.classList.toggle('circle', Boolean(circle))
  dom.region.hidden = false
  dom.regionHandle.hidden = false
  dom.circleRow.hidden = false
  dom.circleToggle.checked = Boolean(circle)
  dom.hint.textContent = t.cropHintRegion

  const regionW = Math.max(8, Math.round(effW * scale))
  const regionH = Math.max(8, Math.round(effH * scale))
  session = {
    mode: 'region-drag',
    circle: Boolean(circle),
    focus: { ...focus },
    scale,
    dispW,
    dispH,
    regionW,
    regionH,
    defaultW: regionW,
    defaultH: regionH,
    onApply,
  }
  applyRegionSize()
  applyPosition()
  dom.modal.hidden = false
}

function overflows() {
  if (session.mode === 'image-drag') {
    return { x: session.overflowX, y: session.overflowY }
  }
  return {
    x: Math.max(0, session.dispW - session.regionW),
    y: Math.max(0, session.dispH - session.regionH),
  }
}

function applyRegionSize() {
  dom.region.style.width = `${session.regionW}px`
  dom.region.style.height = `${session.regionH}px`
}

function applyPosition() {
  const o = overflows()
  const x = o.x * session.focus.x
  const y = o.y * session.focus.y
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
  resizeStart = null
  marquee = null
}

function handleDragMove(event, direction) {
  const o = overflows()
  const dx = ((event.clientX - dragStart.x) / (o.x || 1)) * direction
  const dy = ((event.clientY - dragStart.y) / (o.y || 1)) * direction
  const fx = o.x > 0 ? clamp01(dragStart.focus.x + dx) : 0.5
  const fy = o.y > 0 ? clamp01(dragStart.focus.y + dy) : 0.5
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

function framePoint(event) {
  const rect = dom.frame.getBoundingClientRect()
  return {
    x: Math.min(Math.max(event.clientX - rect.left, 0), session.dispW),
    y: Math.min(Math.max(event.clientY - rect.top, 0), session.dispH),
  }
}

function startMarquee(event, el) {
  const p = framePoint(event)
  marquee = {
    x0: p.x,
    y0: p.y,
    captureEl: el,
    prev: { w: session.regionW, h: session.regionH, focus: { ...session.focus } },
  }
  el.setPointerCapture(event.pointerId)
}

function moveMarquee(event) {
  const p = framePoint(event)
  let w = Math.abs(p.x - marquee.x0)
  let h = Math.abs(p.y - marquee.y0)
  if (event.shiftKey) {
    const maxX = p.x >= marquee.x0 ? session.dispW - marquee.x0 : marquee.x0
    const maxY = p.y >= marquee.y0 ? session.dispH - marquee.y0 : marquee.y0
    const side = Math.min(Math.max(w, h), maxX, maxY)
    w = side
    h = side
  }
  const left = p.x >= marquee.x0 ? marquee.x0 : marquee.x0 - w
  const top = p.y >= marquee.y0 ? marquee.y0 : marquee.y0 - h
  resizeRegionTo(Math.max(1, w), Math.max(1, h), left, top)
}

function endMarquee() {
  if (session && (session.regionW < 8 || session.regionH < 8)) {
    const { w, h, focus } = marquee.prev
    session = { ...session, regionW: w, regionH: h, focus }
    applyRegionSize()
    applyPosition()
  }
  marquee = null
}

dom.image.addEventListener('pointerdown', (event) => {
  if (!session || session.mode !== 'region-drag') return
  event.preventDefault()
  startMarquee(event, dom.image)
})

dom.image.addEventListener('pointermove', (event) => {
  if (!marquee || marquee.captureEl !== dom.image || !session) return
  moveMarquee(event)
})

dom.image.addEventListener('pointerup', () => {
  if (marquee && marquee.captureEl === dom.image) endMarquee()
})

dom.region.addEventListener('pointerdown', (event) => {
  if (!session || session.mode !== 'region-drag') return
  event.preventDefault()
  const o = overflows()
  if (o.x === 0 && o.y === 0) {
    startMarquee(event, dom.region)
    return
  }
  dragStart = { x: event.clientX, y: event.clientY, focus: { ...session.focus } }
  dom.region.setPointerCapture(event.pointerId)
})

dom.region.addEventListener('pointermove', (event) => {
  if (!session || session.mode !== 'region-drag') return
  if (marquee && marquee.captureEl === dom.region) {
    moveMarquee(event)
    return
  }
  if (!dragStart) return
  handleDragMove(event, 1)
})

dom.region.addEventListener('pointerup', () => {
  if (marquee && marquee.captureEl === dom.region) {
    endMarquee()
    return
  }
  dragStart = null
})

function resizeRegionTo(w, h, left, top) {
  const ox = Math.max(0, session.dispW - w)
  const oy = Math.max(0, session.dispH - h)
  session = {
    ...session,
    regionW: Math.round(w),
    regionH: Math.round(h),
    focus: {
      x: ox > 0 ? clamp01(left / ox) : 0.5,
      y: oy > 0 ? clamp01(top / oy) : 0.5,
    },
  }
  applyRegionSize()
  applyPosition()
}

dom.regionHandle.addEventListener('pointerdown', (event) => {
  if (!session || session.mode !== 'region-drag') return
  event.preventDefault()
  event.stopPropagation()
  const o = overflows()
  resizeStart = {
    x: event.clientX,
    y: event.clientY,
    w: session.regionW,
    h: session.regionH,
    left: o.x * session.focus.x,
    top: o.y * session.focus.y,
  }
  dom.regionHandle.setPointerCapture(event.pointerId)
})

dom.regionHandle.addEventListener('pointermove', (event) => {
  if (!resizeStart || !session) return
  const dx = event.clientX - resizeStart.x
  const dy = event.clientY - resizeStart.y
  const lockSquare = event.shiftKey

  let w
  let h
  if (lockSquare) {
    const maxD = Math.min(session.dispW - resizeStart.left, session.dispH - resizeStart.top)
    const base = Math.min(resizeStart.w, resizeStart.h)
    w = Math.min(Math.max(base + Math.max(dx, dy), MIN_REGION_PX), maxD)
    h = w
  } else {
    w = Math.min(Math.max(resizeStart.w + dx, MIN_REGION_PX), session.dispW - resizeStart.left)
    h = Math.min(Math.max(resizeStart.h + dy, MIN_REGION_PX), session.dispH - resizeStart.top)
  }
  resizeRegionTo(w, h, resizeStart.left, resizeStart.top)
})

dom.regionHandle.addEventListener('pointerup', () => {
  resizeStart = null
})

dom.circleToggle.addEventListener('change', () => {
  if (!session || session.mode !== 'region-drag') return
  const circle = dom.circleToggle.checked
  session = { ...session, circle }
  dom.region.classList.toggle('circle', circle)
})

dom.reset.addEventListener('click', () => {
  if (!session) return
  session = { ...session, focus: { x: 0.5, y: 0.5 } }
  if (session.mode === 'region-drag') {
    session = { ...session, regionW: session.defaultW, regionH: session.defaultH }
    applyRegionSize()
  }
  applyPosition()
})

dom.apply.addEventListener('click', () => {
  if (!session) return
  if (session.mode === 'region-drag') {
    const area = {
      w: Math.max(1, Math.round(session.regionW / session.scale)),
      h: Math.max(1, Math.round(session.regionH / session.scale)),
    }
    session.onApply({ ...session.focus }, area, session.circle)
  } else {
    session.onApply({ ...session.focus })
  }
  closeModal()
})

dom.close.addEventListener('click', closeModal)

dom.modal.addEventListener('click', (event) => {
  if (event.target === dom.modal) closeModal()
})
