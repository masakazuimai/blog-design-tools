// UI文字列の多言語辞書。<html lang> で言語を切り替える
// 文字列をこの1ファイルに集約し、/ と /en/ で同じJSを共有する（重複コードを避けるため）

const dict = {
  ja: {
    savedEmpty: '保存されたパレットはありません',
    load: '読込',
    delete: '削除',
    deleted: '削除しました',
    loaded: (name) => `"${name}" を読み込みました`,
    defaultName: (n) => `パレット ${n}`,
    saved: '保存しました',
    copied: 'コピーしました',
    // パレット提案の役割
    rolePrimary: 'プライマリ（CTA・リンク）',
    roleSecondary: 'セカンダリ（補助・ボーダー）',
    roleAccent: 'アクセント（装飾・バッジ）',
    roleText: 'テキスト',
    roleBackground: '背景',
    // 結果カードの見出し
    extractedColors: '抽出カラー（クリックでHEXコピー）',
    suggestedPalette: 'WEBデザイン用パレット提案',
    exportTitle: 'コードをエクスポート',
    cssVarsTab: 'CSS変数',
    previewTitle: 'プレビュー',
    // プレビューデモ
    samplePage: 'サンプルページ',
    sampleSubtitle: '抽出したカラーパレットでデザインするとこんな感じ',
    previewBody:
      'このプレビューは、画像から抽出したカラーパレットを使ったデザインイメージです。プライマリカラーをヘッダーやボタンに、セカンダリカラーをカードの装飾に使用しています。',
    learnMore: '詳しく見る',
    featureA: '機能 A',
    featureADesc: 'セカンダリカラーのボーダーを活用',
    featureB: '機能 B',
    featureBDesc: 'アクセントカラーの背景',
  },
  en: {
    savedEmpty: 'No saved palettes yet',
    load: 'Load',
    delete: 'Delete',
    deleted: 'Deleted',
    loaded: (name) => `Loaded "${name}"`,
    defaultName: (n) => `Palette ${n}`,
    saved: 'Saved',
    copied: 'Copied',
    rolePrimary: 'Primary (CTA / links)',
    roleSecondary: 'Secondary (support / borders)',
    roleAccent: 'Accent (decoration / badges)',
    roleText: 'Text',
    roleBackground: 'Background',
    extractedColors: 'Extracted colors (click to copy HEX)',
    suggestedPalette: 'Suggested web design palette',
    exportTitle: 'Export code',
    cssVarsTab: 'CSS variables',
    previewTitle: 'Preview',
    samplePage: 'Sample page',
    sampleSubtitle: "Here's how a design with the extracted palette could look",
    previewBody:
      'This preview is a design mockup built with the color palette extracted from your image. The primary color is used for the header and buttons, and the secondary color for card accents.',
    learnMore: 'Learn more',
    featureA: 'Feature A',
    featureADesc: 'Uses the secondary color for borders',
    featureB: 'Feature B',
    featureBDesc: 'Accent color background',
  },
}

const lang = document.documentElement.lang === 'en' ? 'en' : 'ja'

export const t = dict[lang]
