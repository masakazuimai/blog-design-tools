// UI文字列の多言語辞書。<html lang> で言語を切り替える
// 文字列をこの1ファイルに集約し、/ と /en/ で同じJSを共有する（重複コードを避けるため）

const dict = {
  ja: {
    runButton: '背景を透過にする',
    processing: '処理中…',
    addImage: '画像を追加',
    badgeCutoutPreview: '切り抜きプレビュー',
    badgeCutoutFailed: '切り抜き失敗',
    cutting: '切り抜き中…',
    revert: '戻す',
    check: '確認',
    edit: '編集',
    removeAria: (name) => `${name} を削除`,
    modelDownloading: (percent) => `AIモデルをダウンロード中… ${percent}%（初回のみ・約40MB）`,
    modelReady: '✓ AIモデルの準備が完了しました',
    modelPreloadFailed: 'AIモデルの事前読み込みに失敗しました（実行時に再試行します）',
    exportFailed: '画像の書き出しに失敗しました。',
    cutoutFailed: '切り抜きに失敗しました。通信環境を確認して再試行してください。',
    statusCutting: 'AIが切り抜き中…',
    download: 'ダウンロード',
    summary: (count) => `<strong>${count}枚</strong>の背景を透過にしました`,
    // エディタ
    editorErase: '消去',
    editorRestore: '復元',
    editorAutoSelect: '自動選択',
    editorBrush: 'ブラシ',
    editorTolerance: '許容値',
    editorZoomOut: '縮小',
    editorZoomIn: '拡大',
    editorPan: '移動',
    editorResetZoomTitle: 'クリックで等倍に戻す',
    editorUndo: 'やり直し',
    editorResetToAI: 'AI結果に戻す',
    editorCancel: 'キャンセル',
    editorApply: '適用',
    editorHint:
      '消去＝余分な背景を消す / 復元＝消えすぎた被写体を塗り戻す / 自動選択＝似た色の範囲をクリックで一括 / ホイール（ピンチ）で拡大・Spaceドラッグで移動（Ctrl+Z でやり直し）',
  },
  en: {
    runButton: 'Remove background',
    processing: 'Processing…',
    addImage: 'Add image',
    badgeCutoutPreview: 'Cutout preview',
    badgeCutoutFailed: 'Cutout failed',
    cutting: 'Cutting out…',
    revert: 'Original',
    check: 'Preview',
    edit: 'Edit',
    removeAria: (name) => `Remove ${name}`,
    modelDownloading: (percent) => `Downloading AI model… ${percent}% (first time only · ~40MB)`,
    modelReady: '✓ AI model ready',
    modelPreloadFailed: 'Failed to preload the AI model (it will retry when you run it)',
    exportFailed: 'Failed to export the image.',
    cutoutFailed: 'Background removal failed. Check your connection and try again.',
    statusCutting: 'AI is removing the background…',
    download: 'Download',
    summary: (count) =>
      `Removed the background from <strong>${count}</strong> ${count === 1 ? 'image' : 'images'}`,
    // editor
    editorErase: 'Erase',
    editorRestore: 'Restore',
    editorAutoSelect: 'Auto-select',
    editorBrush: 'Brush',
    editorTolerance: 'Tolerance',
    editorZoomOut: 'Zoom out',
    editorZoomIn: 'Zoom in',
    editorPan: 'Move',
    editorResetZoomTitle: 'Click to reset to 100%',
    editorUndo: 'Undo',
    editorResetToAI: 'Reset to AI result',
    editorCancel: 'Cancel',
    editorApply: 'Apply',
    editorHint:
      'Erase = remove extra background / Restore = paint back an over-erased subject / Auto-select = click to select a similar-colored area / Scroll (pinch) to zoom · drag with Space to pan (Ctrl+Z to undo)',
  },
}

const lang = document.documentElement.lang === 'en' ? 'en' : 'ja'

export const t = dict[lang]
