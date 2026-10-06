// AIツール（ChatGPT・Claude・v0 など）に渡すプロンプトを作る
import { categoryName } from "./patterns/index.js?v=20261006h";
import { LANG } from "./i18n.js?v=20261006h";

const TEMPLATE = {
  ja: {
    intro: "次の構成で、Webページのワイヤーフレームを HTML と CSS で作ってください。",
    sections: "## セクション構成（上から順に）",
    parts: "構成",
    intent: "狙い",
    sep: "：",
    join: "／",
    rulesTitle: "## 条件",
    rules: [
      "色はグレーの濃淡だけにして、画像は斜線入りの枠で表す",
      "文字はダミーテキストでよい",
      "スマホ幅（640px以下）では1カラムに組み替える",
      "フォントサイズは16px以上にする",
    ],
  },
  en: {
    intro: "Build a wireframe of a web page in HTML and CSS with the following structure.",
    sections: "## Sections (top to bottom)",
    parts: "Structure",
    intent: "Purpose",
    sep: ": ",
    join: " / ",
    rulesTitle: "## Requirements",
    rules: [
      "Use shades of gray only, and show images as boxes with a diagonal cross",
      "Placeholder text is fine",
      "Switch to a single column at mobile widths (640px or less)",
      "Keep font sizes at 16px or larger",
    ],
  },
}[LANG];

const describe = (p, i) => [
  `${i + 1}. ${categoryName(p.cat)}${TEMPLATE.sep}${p.name}`,
  `   - ${TEMPLATE.parts}${TEMPLATE.sep}${p.parts.join(TEMPLATE.join)}`,
  `   - ${TEMPLATE.intent}${TEMPLATE.sep}${p.intent}`,
].join("\n");

export const buildPrompt = (patterns) => `${TEMPLATE.intro}

${TEMPLATE.sections}
${patterns.map(describe).join("\n")}

${TEMPLATE.rulesTitle}
${TEMPLATE.rules.map((r) => `- ${r}`).join("\n")}
`;
