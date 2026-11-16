import { SPIRAL } from "./spiral.js?v=20261116g";
import { SPIRAL_2 } from "./spiral-2.js?v=20261116c";
import { LOOP } from "./loop.js?v=20261116a";
import { LOOP_2 } from "./loop-2.js?v=20261116c";
import { BASIC } from "./basic.js?v=20261116h";
import { BASIC_2, SWITCH } from "./basic-2.js?v=20261116c";
import { SCROLL } from "./scroll.js?v=20261116g";
import { SCROLL_2 } from "./scroll-2.js?v=20261116g";
import { SHAPE } from "./shape.js?v=20261116a";
import { SPIRAL_3 } from "./spiral-3.js?v=20261116d";
import { THREE_D } from "./three-d.js?v=20261116d";
import { STACK } from "./stack.js?v=20261116d";
import { DRAG, DRAG_LOOP, DRAG_BASIC, DRAG_SHAPE } from "./drag.js?v=20261116e";
import { LOOP_3 } from "./loop-3.js?v=20261116f";
import { SHAPE_2, BASIC_3 } from "./shape-2.js?v=20261116g";
import { SWITCH_2 } from "./switch-2.js?v=20261116g";
import { SCROLL_3, THREE_D_2, DRAG_2 } from "./scroll-3.js?v=20261116g";
import { THREE_D_3 } from "./three-d-3.js?v=20261116i";

export const TYPES = [
  ...SPIRAL,
  ...SPIRAL_2,
  ...SPIRAL_3,
  ...THREE_D,
  ...THREE_D_2,
  ...THREE_D_3,
  ...LOOP,
  ...LOOP_2,
  ...LOOP_3,
  ...DRAG_LOOP,
  ...DRAG,
  ...DRAG_2,
  ...BASIC,
  ...BASIC_2,
  ...BASIC_3,
  ...DRAG_BASIC,
  ...SCROLL,
  ...SCROLL_2,
  ...SCROLL_3,
  ...SHAPE,
  ...SHAPE_2,
  ...DRAG_SHAPE,
  ...STACK,
  ...SWITCH,
  ...SWITCH_2,
];

export const CATS = ["all", "spiral", "3d", "loop", "drag", "basic", "scroll", "shape", "stack", "switch"];
