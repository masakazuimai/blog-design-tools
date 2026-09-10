/* AIコーディングエージェントへ渡すプロンプトの生成 */
const REPO = 'https://github.com/google-labs-code/design.md';
const RAW  = 'https://raw.githubusercontent.com/google-labs-code/design.md/main';

export function buildPrompt(preset){
  if(preset.group === 'codequest'){
    return [
      `次のデザイン方針でUIを作ってください。`,
      ``,
      `テーマ名: ${preset.name}`,
      `${preset.desc || ''}`,
      ``,
      `このページで表示しているトークン（色・書体・余白・角丸）を DESIGN.md として`,
      `リポジトリ直下に保存し、それを正本として使ってください。`,
      `DESIGN.md の書式は Google Labs の公式仕様に従います。`,
      ``,
      `${REPO}`,
      ``,
      `色・書体・余白・角丸は、そのファイルで定義されたトークンだけを使うこと。`,
      `定義がない場面は Overview 節の方針から判断してください。`
    ].join('\n');
  }
  return [
    `Google Labs の DESIGN.md 公式リポジトリにある`,
    `${preset.path}（name: ${preset.name}）を`,
    `デザインの正本として使ってください。`,
    ``,
    `${REPO}/blob/main/${preset.path}`,
    ``,
    `色・書体・余白・角丸は、このファイルで定義されたトークンだけを使うこと。`,
    `トークンが定義されていない場面は Brand & Style 節の方針から判断してください。`,
    ``,
    `# ファイルを取得できない場合は、リポジトリ直下でこれを実行してから始めてください`,
    `curl -o DESIGN.md ${RAW}/${preset.path}`
  ].join('\n');
}
