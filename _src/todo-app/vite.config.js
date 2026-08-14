import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";

// 本番は https://codequest.work/generator/todo-app/ に置かれる。
// ビルド成果物はリポジトリ直下の todo-app/ へ出力し、そのディレクトリが
// blog-design-tools のデプロイ対象（index.html を持つトップレベル）になる。
export default defineConfig({
  base: "/generator/todo-app/",
  plugins: [react()],
  build: {
    outDir: fileURLToPath(new URL("../../todo-app", import.meta.url)),
    // favicon や manifest など手置きのファイルを消さないため空にしない
    emptyOutDir: false,
  },
});
