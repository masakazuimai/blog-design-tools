
import { CURTAIN_MOVE } from "./curtain-move.js?v=20260725b";
import { CURTAIN_SHAPE } from "./curtain-shape.js?v=20260725b";
import { TRANSITION_EFFECTS } from "./transition.js?v=20260725b";
import { LOADING_EFFECTS } from "./loading.js?v=20260725b";

export const CATEGORIES = ["curtain", "transition", "loading"];

export const EFFECTS = [...CURTAIN_MOVE, ...CURTAIN_SHAPE, ...TRANSITION_EFFECTS, ...LOADING_EFFECTS];
