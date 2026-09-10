# DESIGN.md プレビュー

公開URL: https://codequest.work/generator/design-md-preview/

DESIGN.md（Google Labs のオープン仕様）のテーマを切り替えて、簡易ランディングページで
配色・書体・余白・角丸を確認し、選んだテーマを AI コーディングエージェントへ渡す
プロンプトをコピーできる静的ツール。依存ライブラリなし。

## ファイル

配信されるのは `design-md-preview/` 側だけ。ソースはこの `_src/` 側に置く（[_src/README.md](../README.md)）。

| パス | 役割 | 配信 |
|---|---|---|
| `design-md-preview/index.html` | 本体。14テーマを埋め込み済みの1ファイル | ✅ |
| `design-md-preview/assets/og.png` | OGP画像 1200×630 | ✅ |
| `_src/design-md-preview/themes/*.md` | CodeQuest製テーマ6本の元ファイル（日本語書体つき） | ― |
| `_src/design-md-preview/tools/gen.py` | `themes/*.md` を生成するスクリプト | ― |

## テーマの出どころ

- **公式サンプル / 公式リンター素材**（8本）: [google-labs-code/design.md](https://github.com/google-labs-code/design.md)（Apache-2.0）に含まれるファイルをそのまま収録
- **CodeQuest製**（6本）: `themes/` にある自作。公式CLI `npx @google/design.md lint` で E0 W0 を確認済み

## テーマを直すとき

1. `_src/design-md-preview/themes/<name>.md` を編集（または `tools/gen.py` を編集して再生成）
2. `npx @google/design.md lint _src/design-md-preview/themes/<name>.md` で E0 W0 を確認
3. `design-md-preview/index.html` の `const PRESETS = [...]` にある該当テーマの `text` を更新

⚠️ 現状 `index.html` へのテーマ反映は手作業。頻繁に触るなら埋め込みスクリプトを用意すること。

## デプロイ

リポジトリ直下の `.github/workflows/deploy.yml` が、変更のあったツールディレクトリを
`/generator/<ディレクトリ名>/` へ配信する。このツールは `design-md-preview` が対象名。
