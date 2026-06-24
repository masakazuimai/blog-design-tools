// アプリ全体の設定値（プロバイダ定義・付箋の色・既定値・ストレージキー）を集約する。

export const STORAGE_KEYS = {
  board: "ai-sticky-board:notes",
  settings: "ai-sticky-board:settings",
  keys: "ai-sticky-board:apikeys",
}

// 無料で使えるAIプロバイダ。Puterはキー不要、Gemini/Groqはユーザー自身の無料キー（BYOK）。
export const PROVIDERS = {
  puter: {
    label: "Puter（キー不要）",
    needsKey: false,
    models: [
      { id: "", label: "自動（おまかせ）" },
      { id: "gpt-5.4-nano", label: "GPT（gpt-5.4-nano）" },
      { id: "claude-sonnet-4", label: "Claude（sonnet-4）" },
      { id: "gemini-2.5-flash-lite", label: "Gemini（2.5-flash-lite）" },
    ],
  },
  gemini: {
    label: "Google Gemini（自分のキー）",
    needsKey: true,
    keyHint: "Google AI Studio の無料APIキー",
    keyUrl: "https://aistudio.google.com/apikey",
    models: [
      { id: "gemini-2.5-flash", label: "gemini-2.5-flash" },
      { id: "gemini-2.0-flash", label: "gemini-2.0-flash" },
    ],
  },
  groq: {
    label: "Groq（自分のキー）",
    needsKey: true,
    keyHint: "Groq Console の無料APIキー",
    keyUrl: "https://console.groq.com/keys",
    models: [
      { id: "llama-3.3-70b-versatile", label: "llama-3.3-70b-versatile" },
      { id: "llama-3.1-8b-instant", label: "llama-3.1-8b-instant" },
    ],
  },
  claude: {
    label: "Claude（自分のキー）",
    needsKey: true,
    keyHint: "Anthropic Console の APIキー",
    keyUrl: "https://console.anthropic.com/settings/keys",
    models: [
      { id: "claude-opus-4-8", label: "claude-opus-4-8" },
      { id: "claude-sonnet-4-6", label: "claude-sonnet-4-6" },
      { id: "claude-haiku-4-5", label: "claude-haiku-4-5" },
    ],
  },
}

export const NOTE_COLORS = [
  { id: "yellow", label: "イエロー", value: "#fde68a" },
  { id: "pink", label: "ピンク", value: "#fbcfe8" },
  { id: "green", label: "グリーン", value: "#bbf7d0" },
  { id: "blue", label: "ブルー", value: "#bfdbfe" },
  { id: "purple", label: "パープル", value: "#ddd6fe" },
  { id: "orange", label: "オレンジ", value: "#fed7aa" },
]

export const DEFAULT_SETTINGS = {
  provider: "puter",
  model: "",
}

export const NOTE_DEFAULTS = {
  width: 320,
  height: 380,
  minWidth: 220,
  minHeight: 240,
  color: "yellow",
}
