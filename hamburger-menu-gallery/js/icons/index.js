// アイコン変形のエフェクト定義を集約する（計60種）
// ?v= はキャッシュバスティング用。icons配下を更新したら日付を揃えて上げる

import { BASIC_ICONS } from "./basic.js?v=20260725b";
import { SPIN_ICONS } from "./spin.js?v=20260725b";
import { SLIDE_ICONS } from "./slide.js?v=20260725b";
import { SYMBOL_ICONS } from "./symbol.js?v=20260725b";
import { FRAME_ICONS } from "./frame.js?v=20260725b";
import { UNIQUE_ICONS } from "./unique.js?v=20260725b";

// 表示順＝フィルタチップの並び順
export const ICON_CATEGORIES = ["basic", "spin", "slide", "symbol", "frame", "unique"];

export const ICON_EFFECTS = [
  ...BASIC_ICONS,
  ...SPIN_ICONS,
  ...SLIDE_ICONS,
  ...SYMBOL_ICONS,
  ...FRAME_ICONS,
  ...UNIQUE_ICONS,
];
