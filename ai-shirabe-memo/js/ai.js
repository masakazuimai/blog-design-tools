// AIプロバイダの呼び出しを共通インターフェイスに包む。
// callAI({ provider, model, messages, apiKey, onChunk }) -> Promise<string>
// messages は [{ role: "user" | "assistant", content }] の会話履歴。
// onChunk はストリーミング対応プロバイダで途中経過（累積テキスト）を受け取る。

export async function callAI({ provider, model, messages, apiKey, onChunk }) {
  if (!messages?.length) throw new Error("メッセージがありません")

  switch (provider) {
    case "puter":
      return callPuter({ model, messages, onChunk })
    case "gemini":
      return callGemini({ model, messages, apiKey })
    case "groq":
      return callGroq({ model, messages, apiKey })
    case "claude":
      return callClaude({ model, messages, apiKey })
    default:
      throw new Error(`未知のプロバイダ: ${provider}`)
  }
}

// Puter.js（キー不要・ストリーミング）。messages配列をそのまま渡せる。
async function callPuter({ model, messages, onChunk }) {
  const puter = window.puter
  if (!puter?.ai?.chat) {
    throw new Error("Puter.js が読み込まれていません。ネットワークを確認してください")
  }
  const options = { stream: true }
  if (model) options.model = model

  const response = await puter.ai.chat(messages, options)
  let full = ""
  for await (const part of response) {
    const chunk = part?.text ?? ""
    if (chunk) {
      full += chunk
      onChunk?.(full)
    }
  }
  if (!full) throw new Error("空の応答が返りました")
  return full
}

// Google Gemini（BYOK）。roleは user / model に変換して contents で送る。
async function callGemini({ model, messages, apiKey }) {
  if (!apiKey) throw new Error("Gemini の APIキーが未設定です")
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`

  const contents = messages.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }))

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ contents }),
  })
  if (!res.ok) {
    const detail = await res.text()
    throw new Error(`Gemini APIエラー（${res.status}）: ${detail.slice(0, 200)}`)
  }
  const data = await res.json()
  const text = (data?.candidates?.[0]?.content?.parts || [])
    .map((p) => p.text || "")
    .join("")
  if (!text) throw new Error("Gemini: 応答テキストが空です")
  return text
}

// Groq（BYOK・OpenAI互換）。messages配列をそのまま送れる。
async function callGroq({ model, messages, apiKey }) {
  if (!apiKey) throw new Error("Groq の APIキーが未設定です")

  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({ model, messages }),
  })
  if (!res.ok) {
    const detail = await res.text()
    throw new Error(`Groq APIエラー（${res.status}）: ${detail.slice(0, 200)}`)
  }
  const data = await res.json()
  const text = data?.choices?.[0]?.message?.content ?? ""
  if (!text) throw new Error("Groq: 応答テキストが空です")
  return text
}

// Claude（Anthropic・BYOK）。ブラウザ直叩き許可ヘッダ付きで /v1/messages を叩く。
async function callClaude({ model, messages, apiKey }) {
  if (!apiKey) throw new Error("Claude（Anthropic）の APIキーが未設定です")

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true",
    },
    body: JSON.stringify({
      model,
      max_tokens: 4096,
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
    }),
  })
  if (!res.ok) {
    const detail = await res.text()
    throw new Error(`Claude APIエラー（${res.status}）: ${detail.slice(0, 200)}`)
  }
  const data = await res.json()
  const text = (data?.content || [])
    .filter((b) => b.type === "text")
    .map((b) => b.text)
    .join("")
  if (!text) throw new Error("Claude: 応答テキストが空です")
  return text
}
