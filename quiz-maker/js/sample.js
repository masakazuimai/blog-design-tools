import { LANG } from './i18n.js?v=20261003b';

// 「サンプルで試す」用の問題（Web制作の基礎）
const SAMPLE_JA = [
  { q: '光の三原色に含まれない色はどれ？', correct: '黄', wrong: ['赤', '緑', '青'], explain: '光の三原色は赤・緑・青（RGB）。画面の色はこの3色の光を混ぜて表現します。黄は色料の三原色（シアン・マゼンタ・イエロー）のひとつです。' },
  { q: 'HTMLで、ページ内で最も大きな見出しを表すタグは？', correct: '<h1>', wrong: ['<h6>', '<head>', '<title>'], explain: '見出しは h1〜h6 の6段階で、h1 が最上位です。<title> はブラウザのタブや検索結果に出るページ名で、本文の見出しではありません。' },
  { q: 'CSSで文字の色を指定するプロパティは？', correct: 'color', wrong: ['font-color', 'text-color', 'background-color'], explain: '文字色は color で指定します。font-color や text-color というプロパティは存在しません。' },
  { q: 'Webページの色指定「#ffffff」は何色？', correct: '白', wrong: ['黒', '赤', '灰色'], explain: '16進数のカラーコードは赤・緑・青を 00〜ff で表します。すべて最大の ff なので白になります。黒は #000000 です。' },
  { q: '画像を表示する <img> タグで、画像の内容を説明する代替テキストの属性は？', correct: 'alt', wrong: ['title', 'src', 'name'], explain: 'alt は画像が表示できないときや、読み上げソフトで内容を伝えるためのテキストです。src は画像ファイルの場所を指定します。' },
  { q: '色相環で向かい合う位置にある色どうしの関係を何という？', correct: '補色', wrong: ['類似色', '同系色', '中間色'], explain: '補色は色相環の反対側にある色の組み合わせで、並べると互いを引き立て合います。例：赤と青緑。' },
];

const SAMPLE_EN = [
  { q: 'Which color is NOT one of the additive primary colors of light?', correct: 'Yellow', wrong: ['Red', 'Green', 'Blue'], explain: 'The additive primaries of light are red, green and blue (RGB). Screens mix these three lights to show every color. Yellow is one of the subtractive primaries (cyan, magenta, yellow).' },
  { q: 'Which HTML tag marks the top-level heading of a page?', correct: '<h1>', wrong: ['<h6>', '<head>', '<title>'], explain: 'Headings go from h1 to h6, with h1 at the top. <title> is the page name shown in the browser tab and search results, not a heading in the body.' },
  { q: 'Which CSS property sets the text color?', correct: 'color', wrong: ['font-color', 'text-color', 'background-color'], explain: 'Text color is set with color. There are no properties called font-color or text-color.' },
  { q: 'What color is the hex code #ffffff?', correct: 'White', wrong: ['Black', 'Red', 'Gray'], explain: 'Hex color codes give red, green and blue from 00 to ff. All three at the maximum ff make white. Black is #000000.' },
  { q: 'Which <img> attribute holds the text alternative that describes the image?', correct: 'alt', wrong: ['title', 'src', 'name'], explain: 'alt describes the image when it can\'t be shown and for screen readers. src points to the image file.' },
  { q: 'What do you call two colors that sit opposite each other on the color wheel?', correct: 'Complementary colors', wrong: ['Analogous colors', 'Monochromatic colors', 'Neutral colors'], explain: 'Complementary colors sit across the color wheel and make each other stand out, e.g. red and cyan.' },
];

// 「サンプルで試す」用の問題（ページの言語に合わせる）
export const SAMPLE_QUESTIONS = LANG === 'en' ? SAMPLE_EN : SAMPLE_JA;
