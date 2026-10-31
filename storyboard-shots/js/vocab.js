import { SHOTS as SIZES, ANGLES, MOVES, LIGHTS } from "../../video-scenario-maker/js/vocab.js?v=20260928b";
import { LANG, t } from "./i18n.js?v=20261030e";

const find = (list, v) => list.find((o) => o.v === v);

export const VOCAB = [
  { key: "shot", list: SIZES },
  { key: "angle", list: ANGLES },
  { key: "move", list: MOVES },
  { key: "light", list: LIGHTS },
].map((x) => ({ ...x, label: t("vocabLabels")[x.key] }));

export const vocabLabel = (key, v) => find(VOCAB.find((x) => x.key === key).list, v)?.[LANG === "en" ? "el" : "ja"] ?? "";

export const vocabEn = (key, v) => find(VOCAB.find((x) => x.key === key).list, v)?.en ?? "";
