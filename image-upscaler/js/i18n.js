/* UI文言の辞書。`/` と `/en/` が同じ js/css を共有し、html の lang 属性で切り替える。
   HTMLに直書きされた静的テキストは各シェル側が持ち、ここではJSが生成する文字列だけを扱う。 */

const DICT = {
  ja: {
    notImage: '画像ファイルを選択してください',
    loadFailed: '画像を読み込めませんでした: ',
    sampleFailed: 'サンプル画像を読み込めませんでした: ',
    exportFailed: '画像の書き出しに失敗しました',
    formatUnsupported: 'この形式はお使いのブラウザでは書き出せません。別の形式をお試しください。',
    encoding: '変換中…',
    runFailed: '処理に失敗しました: ',

    runLabel: '高画質化する',
    runningLabel: '処理中…',

    srcSize: '元画像: ',
    outSize: '出力: ',
    estimate: '所要時間の目安: 約',
    under1s: '1秒未満',
    seconds: '秒',
    clamped: (s) => 'メモリ上限のため倍率を ' + s + '× に自動調整しました',

    phase: {
      resample: '拡大中',
      backproject: '細部を復元中',
      deconv: 'ボケ補正中',
      sharpen: 'シャープ処理中',
      download: 'AIモデルを取得中',
      infer: 'AIで復元中'
    },
    working: '処理中',

    aiScaleOnly: 'AIモードは2倍と4倍のみ対応しています',
    aiNote: (mb) =>
      'AIモデル（約' + mb + 'MB）を初回のみ取得します。以降はブラウザに保存され再取得しません。' +
      'きれいな画像の拡大に強く、ボケた写真には標準モードのほうが向いています。',
    aiNoWebGPU: 'この環境ではWebGPUが使えないため、AIモードは利用できません（標準モードをお使いください）。',
    aiTooLarge: (mp) => 'この画像と倍率の組み合わせは出力が上限（' + mp * 100 + '万画素）を超えるため、AIモードでは処理できません。倍率を下げるか、標準モードをお使いください。',

    deblurOff: 'オフ（推奨）。ピントが合っている写真はこのままで十分です。',
    deblurWeak: (sig) => '弱め（強さ ' + sig + '）ボケた写真向け。JPEGのノイズも一緒に強調されるため、ピントが合った写真には使わないでください。',
    deblurStrong: (sig) => '強め（強さ ' + sig + '）はっきりボケた写真向け。元がシャープだと輪郭が不自然になり、ノイズも目立ちます。',

    zoomLabel: '現在の表示倍率: '
  },

  en: {
    notImage: 'Please choose an image file.',
    loadFailed: 'Could not load the image: ',
    sampleFailed: 'Could not load the sample image: ',
    exportFailed: 'Failed to export the image.',
    formatUnsupported: 'Your browser cannot save this format. Please pick another one.',
    encoding: 'Encoding…',
    runFailed: 'Processing failed: ',

    runLabel: 'Enhance',
    runningLabel: 'Working…',

    srcSize: 'Source: ',
    outSize: 'Output: ',
    estimate: 'Estimated time: ',
    under1s: 'under 1 second',
    seconds: ' seconds or so',
    clamped: (s) => 'Scale was reduced to ' + s + '× to stay within the memory limit.',

    phase: {
      resample: 'Enlarging',
      backproject: 'Restoring detail',
      deconv: 'Recovering blur',
      sharpen: 'Sharpening',
      download: 'Fetching the AI model',
      infer: 'Reconstructing with AI'
    },
    working: 'Working',

    aiScaleOnly: 'AI mode supports 2x and 4x only',
    aiNote: (mb) =>
      'The AI model (about ' + mb + ' MB) is downloaded once and then cached by your browser. ' +
      'It excels at enlarging clean images; for blurry photos the standard mode works better.',
    aiNoWebGPU: 'WebGPU is not available here, so AI mode is disabled. Please use the standard mode.',
    aiTooLarge: (mp) => 'This image and scale would exceed the ' + mp + ' megapixel output limit, so AI mode cannot process it. Pick a lower scale or use the standard mode.',

    deblurOff: 'Off (recommended). Photos that are already in focus need nothing more.',
    deblurWeak: (sig) => 'Gentle (strength ' + sig + ') — for soft photos. JPEG noise is amplified too, so avoid it on photos that are already sharp.',
    deblurStrong: (sig) => 'Strong (strength ' + sig + ') — for clearly blurred photos. Sharp originals get unnatural edges and visible noise.',

    zoomLabel: 'Zoom: '
  }
};

export const t = DICT[document.documentElement.lang === 'en' ? 'en' : 'ja'];
export const isEN = document.documentElement.lang === 'en';
