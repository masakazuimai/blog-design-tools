// 付箋DOMの生成と更新ヘルパー。付箋＝会話スレッドとして描画する。
// 状態管理はmain.jsが持ち、ここは描画とイベント委譲に専念する。

import { NOTE_COLORS } from "./config.js?v=20260624x"

const ROLE_LABEL = { user: "あなた", assistant: "AI" }

export function colorValue(colorId) {
  const found = NOTE_COLORS.find((c) => c.id === colorId)
  return found ? found.value : NOTE_COLORS[0].value
}

function applyGeometry(el, note) {
  el.style.left = `${note.x || 0}px`
  el.style.top = `${note.y || 0}px`
  el.style.width = `${note.width || 320}px`
  el.style.height = `${note.height || 380}px`
}

// 付箋1枚のDOMを生成。handlers に各操作のコールバックを渡す。
export function createNoteElement(note, handlers) {
  const el = document.createElement("div")
  el.className = "note"
  el.dataset.id = note.id
  applyGeometry(el, note)
  el.style.background = colorValue(note.color)

  el.innerHTML = `
    <div class="note__bar">
      <button class="note__color" type="button" title="クリックで色を変更" aria-label="色を変更"></button>
      <span class="note__mode" role="group" aria-label="モード切替">
        <button type="button" data-mode="ai" title="AIチャットとして使う">AI</button>
        <button type="button" data-mode="memo" title="ふつうのメモとして使う">メモ</button>
      </span>
      <span class="note__title">⠿ <span class="note__titletext">ドラッグで移動</span><input class="note__title-edit" type="text" hidden /></span>
      <button class="note__delete" type="button" title="この付箋を削除" aria-label="削除">×</button>
    </div>
    <div class="note__attachments" hidden></div>
    <div class="note__thread"></div>
    <textarea class="note__input" placeholder="AIへのメッセージ…（送信で会話を続ける）"></textarea>
    <textarea class="note__memo" placeholder="メモを入力…"></textarea>
    <div class="note__actions">
      <button class="note__send" type="button">送信</button>
      <span class="note__attach" title="ファイルを選んで貼る" aria-label="ファイルを貼る">📎
        <input class="note__file" type="file" multiple />
      </span>
      <span class="note__status" role="status"></span>
      <span class="note__saved" role="status" aria-label="保存済み"></span>
    </div>
    <span class="note__resize" title="ドラッグでサイズ変更"></span>
  `

  const input = el.querySelector(".note__input")
  input.value = note.draft || ""
  const memo = el.querySelector(".note__memo")
  memo.value = note.memo || ""
  setNoteSummary(el, note.summary)
  setNoteMode(el, note.mode || "ai")
  renderAttachments(el, note.attachments || [])
  renderThread(el, note.messages || [], handlers.editingIndex(note.id))

  // バー＝ドラッグハンドル（色・モード・削除・見出し編集の上では発火させない）
  el.querySelector(".note__bar").addEventListener("pointerdown", (e) => {
    if (e.target.closest(".note__delete, .note__color, .note__mode, .note__title-edit")) return
    handlers.onDragStart(e, note.id)
  })
  el.addEventListener("pointerdown", () => handlers.onFocus(note.id))
  el.querySelector(".note__color").addEventListener("click", () => handlers.onColorCycle(note.id))
  el.querySelector(".note__mode").addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-mode]")
    if (btn) handlers.onSetMode(note.id, btn.dataset.mode)
  })
  el.querySelector(".note__delete").addEventListener("click", () => handlers.onDelete(note.id))
  el.querySelector(".note__send").addEventListener("click", () => handlers.onSend(note.id))
  input.addEventListener("input", () => handlers.onDraftInput(note.id, input.value))
  memo.addEventListener("input", () => handlers.onMemoInput(note.id, memo.value))
  memo.addEventListener("blur", () => handlers.onMemoCommit(note.id))

  // ファイルの貼り付け（📎=透明入力をボタン全面に重ねている / ペースト / ドラッグ＆ドロップ）
  // 入力そのものをクリックさせるので .click() に依存せずダイアログが確実に開く
  const fileInput = el.querySelector(".note__file")
  fileInput.addEventListener("change", () => {
    const files = [...(fileInput.files || [])]
    if (files.length) handlers.onAddFiles(note.id, files)
    fileInput.value = ""
  })
  el.querySelector(".note__attachments").addEventListener("click", (e) => {
    const wrap = e.target.closest(".note__att")
    if (wrap && e.target.closest(".note__att-del")) {
      e.preventDefault()
      handlers.onRemoveAttachment(note.id, Number(wrap.dataset.index))
    }
  })

  // 見出し（要約）をダブルクリックで手動編集
  const titleText = el.querySelector(".note__titletext")
  const titleEdit = el.querySelector(".note__title-edit")
  el.querySelector(".note__title").addEventListener("dblclick", (e) => {
    e.stopPropagation()
    titleEdit.value = el.classList.contains("has-summary") ? titleText.textContent : ""
    titleEdit.hidden = false
    titleText.hidden = true
    titleEdit.focus()
    titleEdit.select()
  })
  titleEdit.addEventListener("pointerdown", (e) => e.stopPropagation())
  titleEdit.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault()
      titleEdit.blur()
    } else if (e.key === "Escape") {
      titleEdit.dataset.cancel = "1"
      titleEdit.blur()
    }
  })
  titleEdit.addEventListener("blur", () => {
    const cancelled = titleEdit.dataset.cancel === "1"
    delete titleEdit.dataset.cancel
    titleEdit.hidden = true
    titleText.hidden = false
    if (!cancelled) handlers.onSetSummary(note.id, titleEdit.value.trim())
  })

  el.addEventListener("dragover", (e) => {
    if (dataTransferHasFile(e.dataTransfer)) {
      e.preventDefault()
      el.classList.add("is-dropping")
    }
  })
  el.addEventListener("dragleave", (e) => {
    if (e.target === el) el.classList.remove("is-dropping")
  })
  el.addEventListener("drop", (e) => {
    const files = filesFromDataTransfer(e.dataTransfer)
    el.classList.remove("is-dropping")
    if (files.length) {
      e.preventDefault()
      handlers.onAddFiles(note.id, files)
    }
  })
  el.querySelector(".note__resize").addEventListener("pointerdown", (e) => handlers.onResizeStart(e, note.id))

  // スレッド内メッセージの編集／削除／完了／キャンセルをイベント委譲で処理
  el.querySelector(".note__thread").addEventListener("click", (e) => {
    const msgEl = e.target.closest(".msg")
    if (!msgEl) return
    const index = Number(msgEl.dataset.index)
    if (e.target.closest(".msg__edit")) handlers.onMsgEdit(note.id, index)
    else if (e.target.closest(".msg__del")) handlers.onMsgDelete(note.id, index)
    else if (e.target.closest(".msg__done")) handlers.onMsgEditDone(note.id, index)
    else if (e.target.closest(".msg__cancel")) handlers.onMsgEditCancel(note.id, index)
  })

  return el
}

// スレッド全体を messages から再構築する。editingIndex のメッセージは編集UIで描画。
export function renderThread(noteEl, messages, editingIndex = -1) {
  const thread = noteEl.querySelector(".note__thread")
  thread.innerHTML = ""

  if (!messages.length) {
    const hint = document.createElement("p")
    hint.className = "note__empty"
    hint.textContent = "メッセージを入力して「送信」すると会話がここに表示されます。"
    thread.appendChild(hint)
    return
  }

  messages.forEach((m, i) => {
    thread.appendChild(
      i === editingIndex ? buildEditMessage(m, i) : buildMessage(m, i)
    )
  })
  thread.scrollTop = thread.scrollHeight
}

function buildMessage(message, index) {
  const msg = document.createElement("div")
  msg.className = `msg msg--${message.role}`
  msg.dataset.index = String(index)
  msg.innerHTML = `
    <div class="msg__head">
      <span class="msg__role">${ROLE_LABEL[message.role] || message.role}</span>
      <span class="msg__tools">
        <button class="msg__edit" type="button">編集</button>
        <button class="msg__del" type="button" title="削除">×</button>
      </span>
    </div>
    <div class="msg__body"></div>
  `
  setMsgBody(msg.querySelector(".msg__body"), message.role, message.content)
  return msg
}

function buildEditMessage(message, index) {
  const msg = document.createElement("div")
  msg.className = `msg msg--${message.role} is-editing`
  msg.dataset.index = String(index)
  msg.innerHTML = `
    <div class="msg__head"><span class="msg__role">${ROLE_LABEL[message.role] || message.role}</span></div>
    <textarea class="msg__editor"></textarea>
    <div class="msg__editbtns">
      <button class="msg__done" type="button">完了</button>
      <button class="msg__cancel" type="button">キャンセル</button>
    </div>
  `
  msg.querySelector(".msg__editor").value = message.content || ""
  return msg
}

// ストリーミング中、最後のAIメッセージ本文だけを更新する。
export function streamLastAssistant(noteEl, text) {
  const bodies = noteEl.querySelectorAll(".msg--assistant .msg__body")
  const last = bodies[bodies.length - 1]
  if (!last) return
  setMsgBody(last, "assistant", text)
  const thread = noteEl.querySelector(".note__thread")
  thread.scrollTop = thread.scrollHeight
}

// AIの発言はmarkdownをサニタイズして描画、ユーザー発言はプレーンテキスト。
function setMsgBody(bodyEl, role, content) {
  if (role === "assistant") {
    const html = window.marked ? window.marked.parse(content || "") : escapeHtml(content || "")
    bodyEl.innerHTML = window.DOMPurify ? window.DOMPurify.sanitize(html) : html
  } else {
    bodyEl.innerHTML = escapeHtml(content || "")
  }
}

export function setNoteColor(noteEl, colorId) {
  noteEl.style.background = colorValue(colorId)
}

// 付箋の添付ファイルを再構築する。画像はサムネ、その他はファイルチップ。空なら非表示。
export function renderAttachments(noteEl, attachments) {
  const strip = noteEl.querySelector(".note__attachments")
  strip.innerHTML = ""
  if (!attachments || !attachments.length) {
    strip.hidden = true
    return
  }
  strip.hidden = false
  attachments.forEach((att, i) => {
    const wrap = document.createElement("div")
    wrap.className = "note__att"
    wrap.dataset.index = String(i)

    if (att.type && att.type.startsWith("image/")) {
      const img = document.createElement("img")
      img.src = att.dataUrl
      img.alt = att.name || "画像"
      wrap.appendChild(img)
    } else {
      const chip = document.createElement("a")
      chip.className = "note__att-file"
      chip.href = att.dataUrl
      chip.download = att.name || "file"
      chip.title = `${att.name || "ファイル"}（クリックでダウンロード）`
      chip.textContent = `📄 ${att.name || "ファイル"}`
      wrap.appendChild(chip)
    }

    const del = document.createElement("button")
    del.type = "button"
    del.className = "note__att-del"
    del.title = "削除"
    del.setAttribute("aria-label", "添付を削除")
    del.textContent = "×"
    wrap.appendChild(del)
    strip.appendChild(wrap)
  })
}

// クリップボード/ドロップからファイルを取り出す（種類問わず）。
export function filesFromDataTransfer(dt) {
  if (!dt) return []
  const out = []
  if (dt.items && dt.items.length) {
    for (const item of dt.items) {
      if (item.kind === "file") {
        const file = item.getAsFile()
        if (file) out.push(file)
      }
    }
  } else if (dt.files) {
    for (const file of dt.files) out.push(file)
  }
  return out
}

// dragover時にファイルドロップを受け付けるか判定（この時点では実体は取れない）。
function dataTransferHasFile(dt) {
  if (!dt) return false
  if (dt.items && dt.items.length) {
    for (const item of dt.items) {
      if (item.kind === "file") return true
    }
    return false
  }
  return Array.from(dt.types || []).includes("Files")
}

// 付箋のモード（ai / memo）を切り替える。CSSの mode-memo クラスで表示を出し分ける。
export function setNoteMode(noteEl, mode) {
  const isMemo = mode === "memo"
  noteEl.classList.toggle("mode-memo", isMemo)
  noteEl.querySelectorAll(".note__mode button").forEach((b) => {
    b.classList.toggle("is-active", b.dataset.mode === mode)
  })
}

// 付箋の見出し（バー）に1行要約を表示する。空なら操作ヒントに戻す。
export function setNoteSummary(noteEl, summary) {
  const hasSummary = !!(summary && summary.trim())
  noteEl.querySelector(".note__titletext").textContent = hasSummary ? summary : "ドラッグで移動"
  noteEl.classList.toggle("has-summary", hasSummary)
  noteEl.querySelector(".note__title").title = hasSummary
    ? `${summary}（ダブルクリックで編集）`
    : "ダブルクリックで見出しを編集"
}

// ステータス表示。成功(ok)は ✔️ を出して3秒後に自動で消す。loading/error は残す。
const statusTimers = new WeakMap()

export function setNoteStatus(noteEl, text, type) {
  const status = noteEl.querySelector(".note__status")
  const prevTimer = statusTimers.get(noteEl)
  if (prevTimer) {
    clearTimeout(prevTimer)
    statusTimers.delete(noteEl)
  }

  if (type === "ok") {
    status.textContent = "✔️"
    status.className = "note__status is-ok"
    const timer = setTimeout(() => {
      status.textContent = ""
      status.className = "note__status"
      statusTimers.delete(noteEl)
    }, 3000)
    statusTimers.set(noteEl, timer)
    return
  }

  status.textContent = text || ""
  status.className = "note__status" + (type ? ` is-${type}` : "")
}

// 「✔️ 保存済」を一定時間だけ表示する（自動保存の確認・両モードで見える操作行に出す）。
const savedTimers = new WeakMap()

export function flashSaved(noteEl) {
  const saved = noteEl.querySelector(".note__saved")
  if (!saved) return
  const prevTimer = savedTimers.get(noteEl)
  if (prevTimer) clearTimeout(prevTimer)
  saved.textContent = "✔️"
  saved.classList.add("is-on")
  const timer = setTimeout(() => {
    saved.textContent = ""
    saved.classList.remove("is-on")
    savedTimers.delete(noteEl)
  }, 2500)
  savedTimers.set(noteEl, timer)
}

function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\n/g, "<br>")
}
