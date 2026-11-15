import { SPIRAL } from "./spiral.js?v=20261116b";
import { SPIRAL_2 } from "./spiral-2.js?v=20261116c";
import { LOOP } from "./loop.js?v=20261116a";
import { LOOP_2 } from "./loop-2.js?v=20261116c";
import { BASIC } from "./basic.js?v=20261116a";
import { BASIC_2, SWITCH } from "./basic-2.js?v=20261116c";
import { SCROLL } from "./scroll.js?v=20261116a";
import { SCROLL_2 } from "./scroll-2.js?v=20261116c";
import { SHAPE } from "./shape.js?v=20261116a";
import { SPIRAL_3 } from "./spiral-3.js?v=20261116d";
import { THREE_D } from "./three-d.js?v=20261116d";
import { STACK } from "./stack.js?v=20261116d";
import { DRAG, DRAG_LOOP, DRAG_BASIC, DRAG_SHAPE } from "./drag.js?v=20261116e";

export const TYPES = [
  ...SPIRAL,
  ...SPIRAL_2,
  ...SPIRAL_3,
  ...THREE_D,
  ...LOOP,
  ...LOOP_2,
  ...DRAG_LOOP,
  ...DRAG,
  ...BASIC,
  ...BASIC_2,
  ...DRAG_BASIC,
  ...SCROLL,
  ...SCROLL_2,
  ...SHAPE,
  ...DRAG_SHAPE,
  ...STACK,
  ...SWITCH,
];

export const CATS = ["all", "spiral", "3d", "loop", "drag", "basic", "scroll", "shape", "stack", "switch"];
