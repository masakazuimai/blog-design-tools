// 全カテゴリのエフェクト定義を集約する（計42種）
// ?v= はキャッシュバスティング用。effects配下を更新したら日付を揃えて上げる

import { CURTAIN_MOVE } from "./curtain-move.js?v=20260725b";
import { CURTAIN_SHAPE } from "./curtain-shape.js?v=20260725b";
import { TRANSITION_EFFECTS } from "./transition.js?v=20260725b";
import { LOADING_EFFECTS } from "./loading.js?v=20260725b";

// 表示順＝フィルタチップの並び順
export const CATEGORIES = ["curtain", "transition", "loading"];

export const EFFECTS = [...CURTAIN_MOVE, ...CURTAIN_SHAPE, ...TRANSITION_EFFECTS, ...LOADING_EFFECTS];
