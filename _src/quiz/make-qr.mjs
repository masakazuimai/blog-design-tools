import { writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import QRCode from "qrcode";

const APP_URL = "https://codequest.work/app/quizmaker/article";
const out = fileURLToPath(new URL("../../quiz/assets/qr-app.svg", import.meta.url));

const svg = await QRCode.toString(APP_URL, {
  type: "svg",
  errorCorrectionLevel: "M",
  margin: 2,
  color: { dark: "#15181dff", light: "#ffffffff" },
});
await writeFile(out, svg.replace(/<!--[\s\S]*?-->/g, ""), "utf8");
console.log("QR → quiz/assets/qr-app.svg (" + APP_URL + ")");
