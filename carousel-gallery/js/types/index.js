import { SPIRAL } from "./spiral.js?v=20261116b";
import { LOOP } from "./loop.js?v=20261116a";
import { BASIC } from "./basic.js?v=20261116a";
import { SCROLL } from "./scroll.js?v=20261116a";
import { SHAPE } from "./shape.js?v=20261116a";

export const TYPES = [...SPIRAL, ...LOOP, ...BASIC, ...SCROLL, ...SHAPE];

export const CATS = ["all", "spiral", "loop", "basic", "scroll", "shape"];
