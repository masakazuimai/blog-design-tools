
import { t } from './i18n.js?v=20260614'

const CDN_URL = 'https://cdn.jsdelivr.net/npm/@imgly/background-removal@1.7.0/+esm'

let modulePromise = null

function loadModule() {
  if (!modulePromise) modulePromise = import(CDN_URL)
  return modulePromise
}

export async function preloadModel(onProgress) {
  const { preload } = await loadModule()
  await preload({ progress: buildProgressHandler(onProgress) })
}

export async function cutoutSubject(file, onProgress) {
  try {
    const { removeBackground } = await loadModule()
    return await removeBackground(file, {
      progress: buildProgressHandler(onProgress),
      output: { format: 'image/png' },
    })
  } catch (error) {
    console.error('AI被写体切り抜きに失敗:', error)
    throw new Error(t.cutoutFailed)
  }
}

function buildProgressHandler(onProgress) {
  if (!onProgress) return undefined
  const perAsset = {}
  return (key, current, total) => {
    if (!key.startsWith('fetch:')) return
    perAsset[key] = { current, total }
    const sum = Object.values(perAsset).reduce(
      (acc, item) => ({ current: acc.current + item.current, total: acc.total + item.total }),
      { current: 0, total: 0 },
    )
    if (sum.total > 0) onProgress(sum.current / sum.total)
  }
}
