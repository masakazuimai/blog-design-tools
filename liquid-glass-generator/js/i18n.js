// UI文字列の多言語辞書。<html lang> で言語を切り替え、/ と /en/ で同じJSを共有する。
// HTMLの静的テキストは各シェルに直書きし、ここではJS生成文字列のみ集約する。

const dict = {
  ja: {
    copy: 'コードをコピー',
    copied: 'コピーしました',
    copyFailed: 'コピーに失敗しました',
    uploadInvalid: '画像ファイルを選んでください',
    dragHint: 'プレビュー上でドラッグするとガラスを移動できます',
    bgUpload: '画像をアップロード',
    snippetNote: '※ background のURLをご自身の画像に差し替えてください。',
  },
  en: {
    copy: 'Copy code',
    copied: 'Copied',
    copyFailed: 'Copy failed',
    uploadInvalid: 'Please choose an image file',
    dragHint: 'Drag on the preview to move the glass',
    bgUpload: 'Upload image',
    snippetNote: '※ Replace the background URL with your own image.',
  },
}

const lang = document.documentElement.lang === 'en' ? 'en' : 'ja'

export function t(key) {
  return dict[lang][key] ?? dict.ja[key] ?? key
}
