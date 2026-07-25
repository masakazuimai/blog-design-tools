// 開閉パターンのエフェクト定義を集約する（計30種）
// ?v= はキャッシュバスティング用。panels配下を更新したら日付を揃えて上げる

import { DRAWER_PANELS } from "./drawer.js?v=20260725b";
import { FULLSCREEN_PANELS } from "./fullscreen.js?v=20260725b";
import { ITEM_PANELS } from "./items.js?v=20260725b";
import { DROPDOWN_PANELS } from "./dropdown.js?v=20260725b";
import { SPECIAL_PANELS } from "./special.js?v=20260725b";

// 表示順＝フィルタチップの並び順
export const PANEL_CATEGORIES = ["drawer", "fullscreen", "items", "dropdown", "special"];

export const PANEL_EFFECTS = [
  ...DRAWER_PANELS,
  ...FULLSCREEN_PANELS,
  ...ITEM_PANELS,
  ...DROPDOWN_PANELS,
  ...SPECIAL_PANELS,
];
