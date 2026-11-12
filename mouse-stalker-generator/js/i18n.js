export const UI = {
  ja: {
    tiers: {
      basic: ["初級", "CSS と数行の JavaScript。貼るだけで動きます。"],
      middle: ["中級", "素の JavaScript で粒や形を動かします。ライブラリは要りません。"],
      advanced: ["上級", "GSAP を使います。読み込みの1行もコードに入っています。"],
      pro: ["上級＋", "Three.js（WebGL）で画面や画像そのものを動かします。読み込みの1行もコードに入っています。"],
      chara: ["キャラ", "Blender で描いた立体のキャラや小物が、歩いたり跳ねたりして付いてきます。画像をダウンロードして images フォルダに置いてください。"],
    },
    hits: (q, n) => `「${q}」に合う動き: ${n}種`,
    noHits: "合う動きがありません。別のことばで探してください。",
    download: (n) => (n > 1 ? `素材をダウンロード（${n}つ）` : "素材をダウンロード"),
    lag: ["ほぼなし", "少し", "ふつう", "ゆったり"],
    paste: {
      all: "まとめて </body> の直前に貼れば動きます。",
      html: "</body> の直前に貼ります。",
      css: "サイトの CSS ファイルの最後に足します。",
      js: "HTML の後ろの <script> の中か、JS ファイルに足します。",
    },
    assets: (files) => ` 素材（${files.join("・")}）は、貼ったページから見て images フォルダの中に置きます。`,
    copied: "コードをコピーしました",
  },
  en: {
    tiers: {
      basic: ["Basic", "CSS plus a few lines of JavaScript. Paste it and it works."],
      middle: ["Intermediate", "Plain JavaScript that moves particles and shapes. No libraries needed."],
      advanced: ["Advanced", "Uses GSAP. The line that loads it is included in the code."],
      pro: ["Advanced+", "Uses Three.js (WebGL) to move the screen and the images themselves. The line that loads it is included."],
      chara: ["Characters", "3D characters and objects rendered in Blender walk, hop and fly after the cursor. Download the image and put it in your images folder."],
    },
    hits: (q, n) => `${n} effects match "${q}"`,
    noHits: "No effects match. Try another word.",
    download: (n) => (n > 1 ? `Download assets (${n})` : "Download asset"),
    lag: ["None", "Slight", "Normal", "Relaxed"],
    paste: {
      all: "Paste it all right before </body> and it works.",
      html: "Paste right before </body>.",
      css: "Add to the end of your CSS file.",
      js: "Add inside a <script> after the HTML, or to your JS file.",
    },
    assets: (files) => ` Put the asset (${files.join(", ")}) in an images folder next to the page.`,
    copied: "Code copied",
  },
};
