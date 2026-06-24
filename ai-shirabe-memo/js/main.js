// アプリ本体。状態（付箋配列・設定・APIキー）を保持し、ボード操作と会話を配線する。
// 付箋は会話スレッド（messages配列）を持ち、送信のたびに履歴ごとAIへ渡す。

import { PROVIDERS, NOTE_COLORS, NOTE_DEFAULTS, DEFAULT_SETTINGS, STORAGE_KEYS } from "./config.js?v=20260624t"
import { loadJson, saveJson } from "./storage.js?v=20260624t"
import { callAI } from "./ai.js?v=20260624t"
import { processAttachment } from "./image.js?v=20260624t"
import {
  createNoteElement,
  renderThread,
  renderAttachments,
  streamLastAssistant,
  setNoteColor,
  setNoteStatus,
  setNoteSummary,
  setNoteMode,
  flashSaved,
  filesFromDataTransfer,
  colorValue,
} from "./notes.js?v=20260624t"

// --- 状態（更新は常に新しい配列/オブジェクトを作る） ---
let notes = (loadJson(STORAGE_KEYS.board, []) || []).map(migrateNote)
let settings = { ...DEFAULT_SETTINGS, ...loadJson(STORAGE_KEYS.settings, {}) }
let apiKeys = loadJson(STORAGE_KEYS.keys, {})

const elements = new Map() // id -> 付箋DOM
const editing = new Map() // id -> 編集中メッセージindex
let topZ = 1
let activeNoteId = null // 直近に触れた付箋（ペースト先）

// --- DOM参照 ---
const board = document.getElementById("board")
const providerSel = document.getElementById("provider")
const modelSel = document.getElementById("model")
const keyWrap = document.getElementById("apikey-wrap")
const keyInput = document.getElementById("apikey")
const keyLink = document.getElementById("apikey-link")
const addBtn = document.getElementById("add-note")
const clearBtn = document.getElementById("clear-board")

// 旧データ（prompt/answer）を messages 配列へ変換する。
function migrateNote(n) {
  // 旧 images（data URL文字列の配列）を attachments（オブジェクト配列）へ変換
  const attachments = Array.isArray(n.attachments)
    ? n.attachments
    : (n.images || []).map((dataUrl) => ({ name: "画像", type: "image/jpeg", dataUrl }))

  if (Array.isArray(n.messages)) {
    const { images, ...rest } = n
    return { draft: "", summary: "", mode: "ai", memo: "", ...rest, attachments }
  }
  const messages = []
  const hasAnswer = n.answer && String(n.answer).trim()
  if (hasAnswer) {
    if (n.prompt && String(n.prompt).trim()) messages.push({ role: "user", content: n.prompt })
    messages.push({ role: "assistant", content: n.answer })
  }
  const { prompt, answer, images, ...rest } = n
  return {
    ...rest,
    draft: hasAnswer ? "" : prompt || "",
    summary: "",
    mode: "ai",
    memo: "",
    attachments,
    messages,
  }
}

function editingIndex(id) {
  return editing.has(id) ? editing.get(id) : -1
}

// --- 永続化 ---
const persist = debounce(() => saveJson(STORAGE_KEYS.board, notes), 400)
function persistNow() {
  saveJson(STORAGE_KEYS.board, notes)
}
function updateNote(id, patch) {
  notes = notes.map((n) => (n.id === id ? { ...n, ...patch } : n))
  persist()
}

// 確定操作（タイトル/本文/送信/添付）で即時保存し、✔️を表示する。
function commitSave(id) {
  persistNow()
  const el = elements.get(id)
  if (el) flashSaved(el)
}

// --- 付箋の操作ハンドラ ---
const handlers = {
  onDragStart: startDrag,
  onResizeStart: startResize,
  onFocus: focusNote,
  onColorCycle: cycleColor,
  onDelete: deleteNote,
  onSend: sendMessage,
  onSetMode: setMode,
  onAddFiles: addFiles,
  onRemoveAttachment: removeAttachment,
  onSetSummary: setSummaryManual,
  onDraftInput: (id, value) => updateNote(id, { draft: value }),
  onMemoInput: (id, value) => updateNote(id, { memo: value }),
  onMemoCommit: (id) => commitSave(id),
  onMsgEdit: startMsgEdit,
  onMsgEditDone: commitMsgEdit,
  onMsgEditCancel: cancelMsgEdit,
  onMsgDelete: deleteMessage,
  editingIndex,
}

function renderNote(note) {
  const el = createNoteElement(note, handlers)
  board.appendChild(el)
  elements.set(note.id, el)
  bringToFront(el)
}

function nextNotePosition() {
  const n = notes.length
  return { x: 48 + (n % 6) * 36, y: 48 + (n % 6) * 32 }
}

function addNote(pos) {
  const note = {
    id: genId(),
    x: pos.x,
    y: pos.y,
    width: NOTE_DEFAULTS.width,
    height: NOTE_DEFAULTS.height,
    color: NOTE_DEFAULTS.color,
    draft: "",
    summary: "",
    mode: "ai",
    memo: "",
    attachments: [],
    messages: [],
  }
  notes = [...notes, note]
  renderNote(note)
  persistNow()
  updateEmptyState()
}

function deleteNote(id) {
  elements.get(id)?.remove()
  elements.delete(id)
  editing.delete(id)
  notes = notes.filter((n) => n.id !== id)
  persistNow()
  updateEmptyState()
}

function cycleColor(id) {
  const note = notes.find((n) => n.id === id)
  if (!note) return
  const idx = NOTE_COLORS.findIndex((c) => c.id === note.color)
  const next = NOTE_COLORS[(idx + 1) % NOTE_COLORS.length]
  setNoteColor(elements.get(id), next.id)
  updateNote(id, { color: next.id })
}

// 付箋ごとに AI（チャット）/ メモ（素のテキスト）を切り替える。内容は両方保持する。
function setMode(id, mode) {
  setNoteMode(elements.get(id), mode)
  updateNote(id, { mode })
}

// ファイルを付箋に添付する（両モード共通・表示のみ、AIには送らない）。
// 画像は縮小、その他はそのまま（3MBまで）。保存はlocalStorage。
async function addFiles(id, files) {
  const el = elements.get(id)
  const note = notes.find((n) => n.id === id)
  if (!el || !note) return
  try {
    const added = []
    for (const file of files) {
      added.push(await processAttachment(file))
    }
    const attachments = [...(note.attachments || []), ...added]
    updateNote(id, { attachments })
    renderAttachments(el, attachments)
    commitSave(id)
  } catch (error) {
    console.error("添付に失敗:", error)
    setNoteStatus(el, error.message || "添付に失敗しました", "error")
  }
}

function removeAttachment(id, index) {
  const note = notes.find((n) => n.id === id)
  if (!note) return
  const attachments = (note.attachments || []).filter((_, i) => i !== index)
  updateNote(id, { attachments })
  renderAttachments(elements.get(id), attachments)
}

// 見出し（要約）を手動で設定する（タイトルのダブルクリック編集）。
function setSummaryManual(id, text) {
  updateNote(id, { summary: text })
  setNoteSummary(elements.get(id), text)
  commitSave(id)
}

// --- 会話：送信して履歴ごとAIへ渡す ---
async function sendMessage(id) {
  const el = elements.get(id)
  if (!el) return
  const note = notes.find((n) => n.id === id)
  const input = el.querySelector(".note__input")
  const text = input.value.trim()

  if (!text) {
    setNoteStatus(el, "メッセージを入力してください", "error")
    return
  }
  const provider = settings.provider
  const conf = PROVIDERS[provider]
  if (conf.needsKey && !apiKeys[provider]) {
    setNoteStatus(el, "上部でAPIキーを設定してください", "error")
    return
  }

  // ユーザー発言を履歴に追加して入力欄をクリア
  const history = [...note.messages, { role: "user", content: text }]
  updateNote(id, { messages: history, draft: "" })
  input.value = ""

  // AIの返信プレースホルダを表示（保存はまだしない）
  const withPlaceholder = [...history, { role: "assistant", content: "" }]
  notes = notes.map((n) => (n.id === id ? { ...n, messages: withPlaceholder } : n))
  renderThread(el, withPlaceholder, -1)

  const sendBtn = el.querySelector(".note__send")
  sendBtn.disabled = true
  setNoteStatus(el, "生成中…", "loading")

  try {
    const reply = await callAI({
      provider,
      model: settings.model,
      messages: history,
      apiKey: apiKeys[provider],
      onChunk: (partial) => streamLastAssistant(el, partial),
    })
    const finalMessages = [...history, { role: "assistant", content: reply }]
    updateNote(id, { messages: finalMessages })
    streamLastAssistant(el, reply)
    setNoteStatus(el, "", null)
    commitSave(id)
  } catch (error) {
    console.error("AI呼び出しに失敗:", error)
    updateNote(id, { messages: history }) // プレースホルダを除去
    renderThread(el, history, -1)
    setNoteStatus(el, error.message || "エラーが発生しました", "error")
  } finally {
    sendBtn.disabled = false
  }
}

// --- メッセージ単位の編集・削除 ---
function startMsgEdit(id, index) {
  editing.set(id, index)
  const note = notes.find((n) => n.id === id)
  const el = elements.get(id)
  renderThread(el, note.messages, index)
  el.querySelector(`.msg[data-index="${index}"] .msg__editor`)?.focus()
}

function commitMsgEdit(id, index) {
  const el = elements.get(id)
  const editor = el.querySelector(`.msg[data-index="${index}"] .msg__editor`)
  const value = editor ? editor.value : ""
  const note = notes.find((n) => n.id === id)
  const messages = note.messages.map((m, i) => (i === index ? { ...m, content: value } : m))
  editing.delete(id)
  updateNote(id, { messages })
  renderThread(el, messages, -1)
  commitSave(id)
}

function cancelMsgEdit(id) {
  editing.delete(id)
  const note = notes.find((n) => n.id === id)
  renderThread(elements.get(id), note.messages, -1)
}

function deleteMessage(id, index) {
  const note = notes.find((n) => n.id === id)
  const messages = note.messages.filter((_, i) => i !== index)
  editing.delete(id)
  updateNote(id, { messages })
  renderThread(elements.get(id), messages, -1)
}

// --- ドラッグ移動 ---
let drag = null
function startDrag(e, id) {
  const el = elements.get(id)
  bringToFront(el)
  const rect = el.getBoundingClientRect()
  drag = { id, offsetX: e.clientX - rect.left, offsetY: e.clientY - rect.top }
  el.classList.add("is-dragging")
  document.addEventListener("pointermove", onDragMove)
  document.addEventListener("pointerup", onDragEnd)
}
function onDragMove(e) {
  if (!drag) return
  const el = elements.get(drag.id)
  const boardRect = board.getBoundingClientRect()
  const x = Math.max(0, e.clientX - boardRect.left - drag.offsetX + board.scrollLeft)
  const y = Math.max(0, e.clientY - boardRect.top - drag.offsetY + board.scrollTop)
  el.style.left = `${x}px`
  el.style.top = `${y}px`
}
function onDragEnd() {
  if (!drag) return
  const el = elements.get(drag.id)
  el.classList.remove("is-dragging")
  updateNote(drag.id, { x: parseFloat(el.style.left) || 0, y: parseFloat(el.style.top) || 0 })
  document.removeEventListener("pointermove", onDragMove)
  document.removeEventListener("pointerup", onDragEnd)
  drag = null
}

// --- リサイズ ---
let resize = null
function startResize(e, id) {
  e.stopPropagation()
  const el = elements.get(id)
  bringToFront(el)
  const rect = el.getBoundingClientRect()
  resize = { id, startX: e.clientX, startY: e.clientY, startW: rect.width, startH: rect.height }
  document.addEventListener("pointermove", onResizeMove)
  document.addEventListener("pointerup", onResizeEnd)
}
function onResizeMove(e) {
  if (!resize) return
  const el = elements.get(resize.id)
  const w = Math.max(NOTE_DEFAULTS.minWidth, resize.startW + (e.clientX - resize.startX))
  const h = Math.max(NOTE_DEFAULTS.minHeight, resize.startH + (e.clientY - resize.startY))
  el.style.width = `${w}px`
  el.style.height = `${h}px`
}
function onResizeEnd() {
  if (!resize) return
  const el = elements.get(resize.id)
  updateNote(resize.id, { width: parseFloat(el.style.width), height: parseFloat(el.style.height) })
  document.removeEventListener("pointermove", onResizeMove)
  document.removeEventListener("pointerup", onResizeEnd)
  resize = null
}

function bringToFront(el) {
  if (el) el.style.zIndex = String(++topZ)
}

// 付箋にフォーカス（最前面化＋ペースト先として記憶）。
function focusNote(id) {
  activeNoteId = id
  bringToFront(elements.get(id))
}

// --- 設定UI（プロバイダ・モデル・APIキー） ---
function initSettings() {
  Object.entries(PROVIDERS).forEach(([key, conf]) => {
    providerSel.appendChild(makeOption(key, conf.label))
  })
  providerSel.value = settings.provider
  populateModels(settings.provider)
  if (settings.model) modelSel.value = settings.model
  settings = { ...settings, model: modelSel.value }
  applyKeyUi(settings.provider)

  providerSel.addEventListener("change", () => {
    populateModels(providerSel.value)
    settings = { ...settings, provider: providerSel.value, model: modelSel.value }
    applyKeyUi(settings.provider)
    saveJson(STORAGE_KEYS.settings, settings)
  })
  modelSel.addEventListener("change", () => {
    settings = { ...settings, model: modelSel.value }
    saveJson(STORAGE_KEYS.settings, settings)
  })
  keyInput.addEventListener("input", () => {
    apiKeys = { ...apiKeys, [settings.provider]: keyInput.value.trim() }
    saveJson(STORAGE_KEYS.keys, apiKeys)
  })
}

function populateModels(provider) {
  modelSel.innerHTML = ""
  PROVIDERS[provider].models.forEach((m) => modelSel.appendChild(makeOption(m.id, m.label)))
}

function applyKeyUi(provider) {
  const conf = PROVIDERS[provider]
  if (!conf.needsKey) {
    keyWrap.hidden = true
    return
  }
  keyWrap.hidden = false
  keyInput.value = apiKeys[provider] || ""
  keyInput.placeholder = conf.keyHint || "APIキー"
  if (conf.keyUrl) {
    keyLink.href = conf.keyUrl
    keyLink.hidden = false
  } else {
    keyLink.hidden = true
  }
}

function makeOption(value, label) {
  const opt = document.createElement("option")
  opt.value = value
  opt.textContent = label
  return opt
}

function updateEmptyState() {
  document.body.classList.toggle("is-empty", notes.length === 0)
}

// --- ユーティリティ ---
function genId() {
  if (window.crypto?.randomUUID) return crypto.randomUUID()
  return `n${Date.now()}${Math.random().toString(16).slice(2)}`
}
function debounce(fn, wait) {
  let timer
  return (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), wait)
  }
}

// --- 初期化 ---
// ヘッダーのハンバーガーメニュー（AI設定・付箋追加・全消去を格納）
function initMenu() {
  const toggle = document.getElementById("menu-toggle")
  const panel = document.getElementById("menu-panel")

  const isOpen = () => panel.classList.contains("open")
  const setOpen = (open) => {
    panel.classList.toggle("open", open)
    toggle.classList.toggle("open", open)
    toggle.setAttribute("aria-expanded", String(open))
  }

  toggle.addEventListener("click", (e) => {
    e.stopPropagation()
    setOpen(!isOpen())
  })
  document.addEventListener("click", (e) => {
    if (isOpen() && !panel.contains(e.target) && !toggle.contains(e.target)) setOpen(false)
  })
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && isOpen()) setOpen(false)
  })

  setOpen(false) // 初期は必ず閉じた状態に
}

// 付箋のタイトル文字列（見出し優先、無ければ本文/メモの先頭、無題なら既定文言）
function noteTitle(note) {
  if (note.summary && note.summary.trim()) return note.summary.trim()
  const firstMsg = (note.messages || []).find((m) => m.content && m.content.trim())
  if (firstMsg) return firstMsg.content.trim().split("\n")[0].slice(0, 50)
  if (note.memo && note.memo.trim()) return note.memo.trim().split("\n")[0].slice(0, 50)
  return ""
}

// 左ドロワー（付箋タイトル一覧＋検索＋クリックでジャンプ）
function initListDrawer() {
  const toggle = document.getElementById("list-toggle")
  const panel = document.getElementById("list-panel")
  const closeBtn = document.getElementById("list-close")
  const search = document.getElementById("list-search")
  const listEl = document.getElementById("list-items")

  const isOpen = () => panel.classList.contains("open")
  const setOpen = (open) => {
    panel.classList.toggle("open", open)
    toggle.classList.toggle("open", open)
    toggle.setAttribute("aria-expanded", String(open))
    if (open) {
      renderList(search.value)
      search.focus()
    }
  }

  function renderList(filter = "") {
    const q = filter.trim().toLowerCase()
    listEl.innerHTML = ""
    const items = notes
      .map((n) => ({ id: n.id, title: noteTitle(n), color: n.color }))
      .filter((it) => !q || it.title.toLowerCase().includes(q))

    if (!items.length) {
      const empty = document.createElement("p")
      empty.className = "list-empty"
      empty.textContent = notes.length ? "該当する付箋がありません" : "付箋がありません"
      listEl.appendChild(empty)
      return
    }

    items.forEach((it) => {
      const btn = document.createElement("button")
      btn.type = "button"
      btn.className = "list-item" + (it.title ? "" : " is-untitled")
      btn.dataset.id = it.id
      const swatch = document.createElement("span")
      swatch.className = "list-item__swatch"
      swatch.style.background = colorValue(it.color)
      const title = document.createElement("span")
      title.className = "list-item__title"
      title.textContent = it.title || "無題のメモ"
      btn.appendChild(swatch)
      btn.appendChild(title)
      btn.addEventListener("click", () => {
        setOpen(false)
        gotoNote(it.id)
      })
      listEl.appendChild(btn)
    })
  }

  toggle.addEventListener("click", (e) => {
    e.stopPropagation()
    setOpen(!isOpen())
  })
  closeBtn.addEventListener("click", () => setOpen(false))
  search.addEventListener("input", () => renderList(search.value))
  document.addEventListener("click", (e) => {
    if (isOpen() && !panel.contains(e.target) && !toggle.contains(e.target)) setOpen(false)
  })
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && isOpen()) setOpen(false)
  })

  setOpen(false)
}

// 指定した付箋までボードをスクロールし、最前面化＋一瞬ハイライト
function gotoNote(id) {
  const el = elements.get(id)
  const note = notes.find((n) => n.id === id)
  if (!el || !note) return
  focusNote(id)
  board.scrollTo({
    left: Math.max(0, (note.x || 0) - 40),
    top: Math.max(0, (note.y || 0) - 40),
    behavior: "smooth",
  })
  el.classList.add("is-highlight")
  setTimeout(() => el.classList.remove("is-highlight"), 1500)
}

function init() {
  initSettings()
  initMenu()
  initListDrawer()
  notes.forEach(renderNote)
  updateEmptyState()

  addBtn.addEventListener("click", () => addNote(nextNotePosition()))
  clearBtn.addEventListener("click", () => {
    if (!notes.length) return
    if (!window.confirm("すべての付箋を削除します。よろしいですか？")) return
    elements.forEach((el) => el.remove())
    elements.clear()
    editing.clear()
    notes = []
    persistNow()
    updateEmptyState()
  })

  // 空きスペースをダブルクリックでその位置に付箋を追加
  board.addEventListener("dblclick", (e) => {
    if (e.target.closest(".note")) return
    const rect = board.getBoundingClientRect()
    addNote({
      x: e.clientX - rect.left + board.scrollLeft - 20,
      y: e.clientY - rect.top + board.scrollTop - 20,
    })
  })

  // ペーストは付箋がフォーカスされていなくても効くよう、ドキュメント全体で受けて直近の付箋へ貼る
  document.addEventListener("paste", (e) => {
    if (!activeNoteId || !elements.has(activeNoteId)) return
    const files = filesFromDataTransfer(e.clipboardData)
    if (files.length) {
      e.preventDefault()
      addFiles(activeNoteId, files)
    }
  })

  window.addEventListener("beforeunload", persistNow)
}

init()
