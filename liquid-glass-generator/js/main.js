// Liquid Glass Generator — エントリポイント。
// import先の ?v= はキャッシュバスティング用（サーバーがjsを7日キャッシュするため）。更新時に日付を上げる。
import { Renderer, Triangle, Program, Mesh, Texture } from 'https://cdn.jsdelivr.net/npm/ogl@1.0.11/+esm'
import { VERTEX_SHADER, FRAGMENT_SHADER, SHAPE_PRESETS, DEFAULT_PARAMS } from './glass.js?v=20260615'
import { BACKGROUNDS, backgroundUrl, loadImage } from './backgrounds.js?v=20260615'
import { generateSnippet } from './export.js?v=20260615'
import { hexToRgb, clamp } from './utils.js?v=20260615'
import { t } from './i18n.js?v=20260615'

const lang = document.documentElement.lang === 'en' ? 'en' : 'ja'

// ---- 状態 -----------------------------------------------------------------
const preset = SHAPE_PRESETS[DEFAULT_PARAMS.shape]
const state = {
  ...DEFAULT_PARAMS,
  halfW: preset.halfW,
  halfH: preset.halfH,
  // ガラス中心（CSSピクセル, キャンバス左上原点）。初期値はリサイズ時に中央へ
  cx: 0,
  cy: 0,
  bgFile: BACKGROUNDS.find((bg) => bg.id === 'tree').file, // 組み込み背景の既定ファイル名（カスタム時は null）
  bgIsCustom: false,
  // ボタン内テキスト
  text: 'Button',
  textColor: '#ffffff',
  fontSize: 20,
}

// ---- DOM ------------------------------------------------------------------
const canvas = document.getElementById('preview')
const stage = canvas.parentElement // .canvas-wrap（サイズ基準。canvas自身のclientWidthは描画後のインラインstyleに左右されるため使わない）
const labelEl = document.getElementById('glass-label')
const outputEl = document.getElementById('output')

// ---- WebGL セットアップ -----------------------------------------------------
const renderer = new Renderer({ canvas, dpr: Math.min(window.devicePixelRatio, 2), alpha: false, preserveDrawingBuffer: true })
const gl = renderer.gl
const geometry = new Triangle(gl)
const texture = new Texture(gl, { generateMipmaps: false })

const program = new Program(gl, {
  vertex: VERTEX_SHADER,
  fragment: FRAGMENT_SHADER,
  uniforms: {
    uTexture: { value: texture },
    uResolution: { value: [1, 1] },
    uImageResolution: { value: [1, 1] },
    uGlassCenter: { value: [0, 0] },
    uGlassHalf: { value: [0, 0] },
    uRadius: { value: 0 },
    uEdge: { value: 0 },
    uRefraction: { value: state.refraction },
    uBlur: { value: 0 },
    uSpecular: { value: state.specular },
    uAberration: { value: state.aberration },
    uTint: { value: hexToRgb(state.tint) },
    uTintOpacity: { value: state.tintOpacity },
  },
})
const mesh = new Mesh(gl, { geometry, program })

let imageReady = false

// ---- 描画 ------------------------------------------------------------------
function clampedEdgeRadius() {
  const radius = clamp(state.radius, 0, Math.min(state.halfW, state.halfH))
  const edge = clamp(state.edge, 1, Math.min(state.halfW, state.halfH))
  return { radius, edge }
}

// テキストラベル（DOMオーバーレイ）をガラス中心に追従させる
function updateLabel() {
  labelEl.textContent = state.text
  labelEl.style.display = state.text ? 'block' : 'none'
  labelEl.style.left = `${state.cx}px`
  labelEl.style.top = `${state.cy}px`
  labelEl.style.color = state.textColor
  labelEl.style.fontSize = `${state.fontSize}px`
}

// WebGL本体の描画（＋ラベル位置更新）。ドラッグ中はこれだけ呼ぶ
function render() {
  updateLabel()
  if (!imageReady) return
  const w = stage.clientWidth
  const h = stage.clientHeight
  renderer.setSize(w, h)
  const dpr = renderer.dpr
  const U = program.uniforms
  const { radius, edge } = clampedEdgeRadius()

  U.uResolution.value = [w * dpr, h * dpr]
  // y を上向きに変換（シェーダー側が y上）
  U.uGlassCenter.value = [state.cx * dpr, (h - state.cy) * dpr]
  U.uGlassHalf.value = [state.halfW * dpr, state.halfH * dpr]
  U.uRadius.value = radius * dpr
  U.uEdge.value = edge * dpr
  U.uRefraction.value = state.refraction
  U.uBlur.value = state.blur * dpr
  U.uSpecular.value = state.specular
  U.uAberration.value = state.aberration
  U.uTint.value = hexToRgb(state.tint)
  U.uTintOpacity.value = state.tintOpacity

  renderer.render({ scene: mesh })
}

// 出力コードを再生成する（ガラス位置には依存しないのでドラッグ中は呼ばない）
function syncOutput() {
  const { radius, edge } = clampedEdgeRadius()
  // カスタム背景（blob URL）はコピー先で無効なので差し替えを促すプレースホルダにする
  const bgUrl = state.bgIsCustom
    ? 'YOUR_IMAGE_URL'
    : `https://codequest.work/generator/liquid-glass-generator/assets/${state.bgFile}`
  outputEl.value = generateSnippet({
    halfW: state.halfW,
    halfH: state.halfH,
    radius,
    edge,
    refraction: state.refraction,
    blur: state.blur,
    specular: state.specular,
    aberration: state.aberration,
    tint: state.tint,
    tintOpacity: state.tintOpacity,
    bgUrl,
    text: state.text,
    textColor: state.textColor,
    fontSize: state.fontSize,
  })
}

// 設定変更時のまとめ更新（描画 + 出力同期）
function commit() {
  render()
  syncOutput()
}

async function setBackground(url, file) {
  const img = await loadImage(url)
  texture.image = img
  program.uniforms.uImageResolution.value = [img.naturalWidth, img.naturalHeight]
  state.bgFile = file // カスタム時は null
  state.bgIsCustom = !file
  imageReady = true
  commit()
}

function resize() {
  const w = stage.clientWidth
  const h = stage.clientHeight
  // 中心が未設定/画面外なら中央へ
  if (state.cx === 0 || state.cx > w) state.cx = w / 2
  if (state.cy === 0 || state.cy > h) state.cy = h / 2
  render()
}

// ---- コントロール束ね -------------------------------------------------------
function bindSlider(id, key, format = (v) => v) {
  const el = document.getElementById(id)
  const out = document.querySelector(`[data-val="${id}"]`)
  if (!el) return
  const update = () => {
    state[key] = parseFloat(el.value)
    if (out) out.textContent = format(state[key])
    commit()
  }
  el.addEventListener('input', update)
  update()
}

function bindShapes() {
  const radiusEl = document.getElementById('radius')
  document.querySelectorAll('[data-shape]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const p = SHAPE_PRESETS[btn.dataset.shape]
      if (!p) return
      state.shape = btn.dataset.shape
      state.halfW = p.halfW
      state.halfH = p.halfH
      state.radius = p.radius
      if (radiusEl) {
        radiusEl.max = String(Math.min(p.halfW, p.halfH))
        radiusEl.value = String(p.radius)
        const out = document.querySelector('[data-val="radius"]')
        if (out) out.textContent = p.radius
      }
      document.querySelectorAll('[data-shape]').forEach((b) => b.classList.toggle('active', b === btn))
      commit()
    })
  })
}

function bindBackgrounds() {
  const list = document.getElementById('bg-list')
  BACKGROUNDS.forEach((bg) => {
    const btn = document.createElement('button')
    btn.type = 'button'
    btn.className = 'bg-thumb' + (bg.file === state.bgFile ? ' active' : '')
    btn.style.backgroundImage = `url(${backgroundUrl(bg.file)})`
    btn.title = bg.label[lang]
    btn.setAttribute('aria-label', bg.label[lang])
    btn.addEventListener('click', async () => {
      await setBackground(backgroundUrl(bg.file), bg.file)
      document.querySelectorAll('.bg-thumb').forEach((b) => b.classList.toggle('active', b === btn))
    })
    list.appendChild(btn)
  })

  const upload = document.getElementById('bg-upload')
  upload.addEventListener('change', async () => {
    const file = upload.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      alert(t('uploadInvalid'))
      return
    }
    const url = URL.createObjectURL(file)
    await setBackground(url, null)
    document.querySelectorAll('.bg-thumb').forEach((b) => b.classList.remove('active'))
  })
}

function bindText() {
  const textEl = document.getElementById('label-text')
  const colorEl = document.getElementById('label-color')
  textEl.value = state.text
  textEl.addEventListener('input', () => { state.text = textEl.value; commit() })
  colorEl.addEventListener('input', () => { state.textColor = colorEl.value; commit() })
}

function bindDrag() {
  let dragging = false
  const toLocal = (e) => {
    const rect = canvas.getBoundingClientRect()
    const point = e.touches ? e.touches[0] : e
    return { x: point.clientX - rect.left, y: point.clientY - rect.top }
  }
  const start = (e) => { dragging = true; move(e) }
  const move = (e) => {
    if (!dragging) return
    const { x, y } = toLocal(e)
    state.cx = clamp(x, 0, canvas.clientWidth)
    state.cy = clamp(y, 0, canvas.clientHeight)
    render() // 位置は出力に影響しないので render のみ
    if (e.cancelable) e.preventDefault()
  }
  const end = () => { dragging = false }
  canvas.addEventListener('mousedown', start)
  window.addEventListener('mousemove', move)
  window.addEventListener('mouseup', end)
  canvas.addEventListener('touchstart', start, { passive: false })
  window.addEventListener('touchmove', move, { passive: false })
  window.addEventListener('touchend', end)
}

function bindCopy() {
  const btn = document.getElementById('copy-btn')
  btn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(outputEl.value)
      const label = btn.querySelector('span')
      const prev = label.textContent
      label.textContent = t('copied')
      btn.classList.add('copied')
      setTimeout(() => { label.textContent = prev; btn.classList.remove('copied') }, 1600)
    } catch {
      alert(t('copyFailed'))
    }
  })
}

// ---- 起動 -------------------------------------------------------------------
bindShapes()
bindBackgrounds()
bindText()
bindDrag()
bindSlider('refraction', 'refraction', (v) => v.toFixed(2))
bindSlider('blur', 'blur', (v) => v.toFixed(1))
bindSlider('specular', 'specular', (v) => v.toFixed(2))
bindSlider('aberration', 'aberration', (v) => v.toFixed(2))
bindSlider('edge', 'edge', (v) => Math.round(v))
bindSlider('radius', 'radius', (v) => Math.round(v))
bindSlider('fontSize', 'fontSize', (v) => `${Math.round(v)}px`)
bindSlider('tintOpacity', 'tintOpacity', (v) => v.toFixed(2))
document.getElementById('tint').addEventListener('input', (e) => { state.tint = e.target.value; commit() })
bindCopy()

window.addEventListener('resize', resize)
// レイアウト確定や折返し時に確実に再描画する
new ResizeObserver(resize).observe(stage)
setBackground(backgroundUrl(state.bgFile), state.bgFile).then(resize)
