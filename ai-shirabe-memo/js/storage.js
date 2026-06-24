// localStorage の薄いラッパー。JSONのシリアライズとエラー処理を1か所に集約する。

export function loadJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    if (raw === null) return fallback
    return JSON.parse(raw)
  } catch (error) {
    console.error("ストレージ読み込みに失敗:", key, error)
    return fallback
  }
}

export function saveJson(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch (error) {
    console.error("ストレージ保存に失敗:", key, error)
    return false
  }
}
