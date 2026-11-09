import { writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import QRCode from "qrcode";

const [genre, url] = process.argv.slice(2);
if (!/^[a-z0-9-]+$/.test(genre || "") || !/^https:\/\/codequest\.work\/app\/[a-z0-9-]+\/[a-z]+$/.test(url || "")) {
  console.error("使い方: npm run qr -- <ジャンル> https://codequest.work/app/<アプリ>/<場所>（作る前に curl で 302→200 を確かめる）");
  process.exit(1);
}
const out = fileURLToPath(new URL(`../../quiz/assets/qr-${genre}.svg`, import.meta.url));

const svg = await QRCode.toString(url, {
  type: "svg",
  errorCorrectionLevel: "M",
  margin: 2,
  color: { dark: "#15181dff", light: "#ffffffff" },
});
await writeFile(out, svg.replace(/<!--[\s\S]*?-->/g, ""), "utf8");
console.log(`QR → quiz/assets/qr-${genre}.svg (${url})`);
