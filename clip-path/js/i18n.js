export const LANG = document.documentElement.lang === "en" ? "en" : "ja";

const DICT = {
  ja: { copyDone: "コピーしました", ngonSuffix: "角", animComment: "ホバーで切り抜きを解除して全体を表示" },
  en: { copyDone: "Copied!", ngonSuffix: "", animComment: "Reveal fully on hover (remove the clip)" },
};

export const t = DICT[LANG];
