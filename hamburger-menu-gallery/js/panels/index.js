
import { DRAWER_PANELS } from "./drawer.js?v=20260725b";
import { FULLSCREEN_PANELS } from "./fullscreen.js?v=20260725b";
import { ITEM_PANELS } from "./items.js?v=20260725b";
import { DROPDOWN_PANELS } from "./dropdown.js?v=20260725b";
import { SPECIAL_PANELS } from "./special.js?v=20260725b";

export const PANEL_CATEGORIES = ["drawer", "fullscreen", "items", "dropdown", "special"];

export const PANEL_EFFECTS = [
  ...DRAWER_PANELS,
  ...FULLSCREEN_PANELS,
  ...ITEM_PANELS,
  ...DROPDOWN_PANELS,
  ...SPECIAL_PANELS,
];
