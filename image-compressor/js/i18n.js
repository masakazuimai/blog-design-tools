// UI文字列の多言語辞書。<html lang> で言語を切り替える
// 文字列をこの1ファイルに集約し、/ と /en/ で同じJSを共有する（重複コードを避けるため）

const dict = {
  ja: {
    runButton: '変換・圧縮を実行',
    processing: '処理中…',
    addImage: '画像を追加',
    cropAdjust: '位置調整',
    cropAdjustAria: (name) => `${name} のトリミング位置を調整`,
    removeAria: (name) => `${name} を削除`,
    download: 'ダウンロード',
    dims: (w, h) => `（${w}×${h}）`,
    summary: (count, orig, neww, sign) =>
      `${count}枚を処理: ${orig} → ${neww} <strong>${sign}</strong>`,
    // エラー（結果リストに表示される）
    decodeFailed: 'この画像は読み込めませんでした。対応形式か確認してください。',
    svgLoadFailed: 'SVGの読み込みに失敗しました。',
    unsupportedFormat: (format) => `未対応の出力形式です: ${format}`,
    svgConvertFailed: 'SVGへの変換に失敗しました。画像サイズを小さくして再試行してください。',
    avifFailed: 'AVIFへの変換に失敗しました。通信環境を確認して再試行してください。',
    encodeFailed: '画像のエンコードに失敗しました。',
    // トリミングモーダル
    cropHintImage: '画像をドラッグして、切り抜く位置を調整します。',
    cropHintRegion:
      '画像の上をドラッグして範囲を選択します（Shiftで正方形・正円）。枠の中をドラッグすると移動、右下のハンドルで微調整できます。',
    // テンプレートサイズ（select）
    tplGroupBlog: 'ブログ・OGP',
    tplGroupSns: 'SNS',
    tplGroupAd: '広告バナー',
    tplOgp: 'OGP画像（1200×630）',
    tplEyecatch: 'アイキャッチ 16:9（1280×720）',
    tplXPost: 'X投稿（1600×900）',
    tplXHeader: 'Xヘッダー（1500×500）',
    tplIgPost: 'Instagram投稿（1080×1080）',
    tplIgStory: 'ストーリー（1080×1920）',
    tplYtThumb: 'YouTubeサムネイル（1280×720）',
    tplRectangle: 'レクタングル（300×250）',
    tplLeaderboard: 'リーダーボード（728×90）',
    tplMobileBanner: 'モバイルバナー（320×100）',
    tplSkyscraper: 'スカイスクレイパー（160×600）',
  },
  en: {
    runButton: 'Convert & compress',
    processing: 'Processing…',
    addImage: 'Add image',
    cropAdjust: 'Adjust position',
    cropAdjustAria: (name) => `Adjust the crop position for ${name}`,
    removeAria: (name) => `Remove ${name}`,
    download: 'Download',
    dims: (w, h) => ` (${w}×${h})`,
    summary: (count, orig, neww, sign) =>
      `Processed ${count} ${count === 1 ? 'image' : 'images'}: ${orig} → ${neww} <strong>${sign}</strong>`,
    // errors (shown in the result list)
    decodeFailed: 'This image could not be loaded. Please check that the format is supported.',
    svgLoadFailed: 'Failed to load the SVG.',
    unsupportedFormat: (format) => `Unsupported output format: ${format}`,
    svgConvertFailed: 'Failed to convert to SVG. Try again with a smaller image.',
    avifFailed: 'Failed to convert to AVIF. Check your connection and try again.',
    encodeFailed: 'Failed to encode the image.',
    // crop modal
    cropHintImage: 'Drag the image to adjust the crop position.',
    cropHintRegion:
      'Drag on the image to select an area (hold Shift for a square / circle). Drag inside the box to move it, and use the bottom-right handle to fine-tune.',
    // template sizes (select)
    tplGroupBlog: 'Blog / OGP',
    tplGroupSns: 'Social',
    tplGroupAd: 'Ad banners',
    tplOgp: 'OGP image (1200×630)',
    tplEyecatch: 'Featured image 16:9 (1280×720)',
    tplXPost: 'X post (1600×900)',
    tplXHeader: 'X header (1500×500)',
    tplIgPost: 'Instagram post (1080×1080)',
    tplIgStory: 'Story (1080×1920)',
    tplYtThumb: 'YouTube thumbnail (1280×720)',
    tplRectangle: 'Rectangle (300×250)',
    tplLeaderboard: 'Leaderboard (728×90)',
    tplMobileBanner: 'Mobile banner (320×100)',
    tplSkyscraper: 'Skyscraper (160×600)',
  },
}

const lang = document.documentElement.lang === 'en' ? 'en' : 'ja'

export const t = dict[lang]
