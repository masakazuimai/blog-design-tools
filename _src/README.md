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

## design-md-preview

`/generator/design-md-preview/` のテーマ素材。**ビルドは不要**で、ここにあるのは
公開する必要のない元ファイルだけ（配信対象から外すためにこの下へ置いている）。

- `themes/*.md` — CodeQuest製テーマ6本の元ファイル（日本語書体つき）
- `tools/gen.py` — `themes/*.md` を生成するスクリプト。**カレントディレクトリへ書き出す**ので
  `themes/` の中で実行すること

```bash
cd _src/design-md-preview/themes
python3 ../tools/gen.py                    # themes/*.md を再生成
npx @google/design.md lint <name>.md       # E0 W0 を確認
```

テーマを直したら、`design-md-preview/js/presets.js` の `PRESETS` にある該当テーマの
`text` を手で更新し、`index.html` と `js/*.js` の `?v=` を上げる（本番はjs/cssを7日キャッシュする）。

### 経緯

当初はツール直下に `themes/` `tools/` を置いていたが、`design-md-preview/` ごと
rsyncされるため本番で公開されていた（2026-09-10にサーバー上の実ファイルを削除）。
`_src/` へ移して配信対象から外した。**`index.html` はツール直下に残すこと**＝
ツールごと `_src/` へ移すと配信対象から外れて公開が止まる（2026-09-10に一度発生し revert 済み）。
