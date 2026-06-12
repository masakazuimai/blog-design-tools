// AI被写体切り抜き（@imgly/background-removal）
// ONNXモデルによる被写体検出をすべてブラウザ内で実行する（画像は外部送信されない）
// モデル・WASM（合計約40MB）は初回のみCDNから取得され、以降はブラウザキャッシュが使われる

const CDN_URL = 'https://cdn.jsdelivr.net/npm/@imgly/background-removal@1.7.0/+esm'

let modulePromise = null

function loadModule() {
  if (!modulePromise) modulePromise = import(CDN_URL)
  return modulePromise
}

// モデル・WASMを事前ダウンロードする（実行ボタンを押す前に済ませて待ち時間を隠す）
export async function preloadModel(onProgress) {
  const { preload } = await loadModule()
  await preload({ progress: buildProgressHandler(onProgress) })
}

// 被写体だけを残した透過PNGのBlobを返す
export async function cutoutSubject(file, onProgress) {
  try {
    const { removeBackground } = await loadModule()
    return await removeBackground(file, {
      progress: buildProgressHandler(onProgress),
      output: { format: 'image/png' },
    })
  } catch (error) {
    console.error('AI被写体切り抜きに失敗:', error)
    throw new Error('切り抜きに失敗しました。通信環境を確認して再試行してください。')
  }
}

// アセット単位の進捗通知を全体の割合（0〜1）にまとめる
function buildProgressHandler(onProgress) {
  if (!onProgress) return undefined
  const perAsset = {}
  return (key, current, total) => {
    // ダウンロード進捗（fetch:〜）のみ対象にする（推論中の通知は除外）
    if (!key.startsWith('fetch:')) return
    perAsset[key] = { current, total }
    const sum = Object.values(perAsset).reduce(
      (acc, item) => ({ current: acc.current + item.current, total: acc.total + item.total }),
      { current: 0, total: 0 },
    )
    if (sum.total > 0) onProgress(sum.current / sum.total)
  }
}
