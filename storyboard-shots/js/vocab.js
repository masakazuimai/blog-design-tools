// 選択肢の語彙は video-scenario-maker と共通（受け渡しのコードと表記をずらさないため、同じファイルを読む）
import { SHOTS as SIZES, ANGLES, MOVES, LIGHTS } from "../../video-scenario-maker/js/vocab.js?v=20260928b";
import { LANG, t } from "./i18n.js?v=20261006l";

const find = (list, v) => list.find((o) => o.v === v);

export const VOCAB = [
  { key: "shot", list: SIZES },
  { key: "angle", list: ANGLES },
  { key: "move", list: MOVES },
  { key: "light", list: LIGHTS },
].map((x) => ({ ...x, label: t("vocabLabels")[x.key] }));

// 画面表示用（日本語版は ja、英語版は el の短い表記）
export const vocabLabel = (key, v) => find(VOCAB.find((x) => x.key === key).list, v)?.[LANG === "en" ? "el" : "ja"] ?? "";

// プロンプト用（英語）。指定なしは空文字
export const vocabEn = (key, v) => find(VOCAB.find((x) => x.key === key).list, v)?.en ?? "";
