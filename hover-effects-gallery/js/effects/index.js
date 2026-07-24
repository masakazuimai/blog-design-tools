// 全カテゴリのエフェクト定義を集約する（計100種）
// ?v= はキャッシュバスティング用。effects配下を更新したら日付を揃えて上げる

import { UNDERLINE_EFFECTS } from "./underline.js?v=20260724a";
import { BORDER_EFFECTS } from "./border.js?v=20260724a";
import { BACKGROUND_EFFECTS } from "./background.js?v=20260724a";
import { TEXT_EFFECTS } from "./text.js?v=20260724a";
import { THREED_EFFECTS } from "./threed.js?v=20260724a";
import { NAV_EFFECTS } from "./nav.js?v=20260724a";
import { GLOW_EFFECTS } from "./glow.js?v=20260724a";
import { TRANSFORM_EFFECTS } from "./transform.js?v=20260724a";
import { FX_EFFECTS } from "./fx.js?v=20260724a";

// 表示順＝フィルタチップの並び順
export const CATEGORIES = ["underline", "border", "background", "text", "threed", "nav", "glow", "transform", "fx"];

export const EFFECTS = [
  ...UNDERLINE_EFFECTS,
  ...BORDER_EFFECTS,
  ...BACKGROUND_EFFECTS,
  ...TEXT_EFFECTS,
  ...THREED_EFFECTS,
  ...NAV_EFFECTS,
  ...GLOW_EFFECTS,
  ...TRANSFORM_EFFECTS,
  ...FX_EFFECTS,
];
