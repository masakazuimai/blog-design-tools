// AIツール（ChatGPT・Claude・v0 など）に渡すプロンプトを作る
import { categoryName } from "./patterns/index.js?v=20261006e";

const describe = (p, i) => [
  `${i + 1}. ${categoryName(p.cat)}：${p.name}`,
  `   - 構成：${p.parts.join("／")}`,
  `   - 狙い：${p.intent}`,
].join("\n");

export const buildPrompt = (patterns) => `次の構成で、Webページのワイヤーフレームを HTML と CSS で作ってください。

## セクション構成（上から順に）
${patterns.map(describe).join("\n")}

## 条件
- 色はグレーの濃淡だけにして、画像は斜線入りの枠で表す
- 文字はダミーテキストでよい
- スマホ幅（640px以下）では1カラムに組み替える
- フォントサイズは16px以上にする
`;
