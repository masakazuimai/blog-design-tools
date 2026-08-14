# \_src — ビルドが必要なツールのソース

このディレクトリはデプロイ対象ではありません。GitHub Actions の `deploy.yml` は
**トップレベルで `index.html` を持つディレクトリ**だけを `/generator/<名前>/` へ配信します。
`_src/` は直下に `index.html` を持たないため、配信されません。

ビルド成果物はリポジトリ直下の各ツールディレクトリへ出力され、そちらが配信されます。

## todo-app

`/generator/todo-app/` のソース（React 19 + @hello-pangea/dnd + Vite）。

```bash
cd _src/todo-app
npm install
npm run build     # → リポジトリ直下の todo-app/ へ出力
npm run dev       # ローカル確認（http://localhost:5173/generator/todo-app/）
```

- `vite.config.js` の `base` は `/generator/todo-app/`。本番URLと同じパスでないと
  アセットの参照が壊れるため変更しないこと
- `emptyOutDir: false`。`todo-app/` には favicon・logo・manifest.json を手で置いており、
  ビルドで消さないようにしてある
- **ビルドせずに `todo-app/` を直接編集しない**。次のビルドで上書きされる
- 変更したら必ず `npm run build` を実行し、`todo-app/` の差分ごとコミットする
  （CIにビルド工程は無く、コミットされた成果物がそのまま配信される）

### 経緯

旧実装は Create React App のビルドで、リポジトリに残っていた `masakazuimai/todo-app` は
CRA の初期テンプレートのままだった（本番と別物）。実ソースは本番に残っていた sourcemap から
復元し、2026-08-14 に Vite で作り直した。復元した元ソースは
`~/.claude/projects/<slug>/docs/todo-app-recovered-src/` に保管してある。
