// 全カテゴリのアイコン定義を集約する
// ?v= はキャッシュバスティング用。icons配下を更新したら日付を揃えて上げる

import { STATUS_ICONS } from "./status.js?v=20260814f";
import { ACTION_ICONS } from "./action.js?v=20260814f";
import { NAV_ICONS } from "./nav.js?v=20260814f";
import { MEDIA_ICONS } from "./media.js?v=20260814f";
import { FILE_ICONS } from "./file.js?v=20260814f";
import { COMM_ICONS } from "./comm.js?v=20260814f";
import { UI_ICONS } from "./ui.js?v=20260814f";
import { WEATHER_ICONS } from "./weather.js?v=20260814f";
import { COMMERCE_ICONS } from "./commerce.js?v=20260814f";
import { DEV_ICONS } from "./dev.js?v=20260814f";
import { DEVICE_ICONS } from "./device.js?v=20260814f";
import { BODY_ICONS } from "./body.js?v=20260814f";
// 各カテゴリの追加分。1ファイル800行の上限に収めるため -2 として分けている
import { STATUS_ICONS_2 } from "./status-2.js?v=20260814f";
import { ACTION_ICONS_2 } from "./action-2.js?v=20260814f";
import { NAV_ICONS_2 } from "./nav-2.js?v=20260814f";
import { MEDIA_ICONS_2 } from "./media-2.js?v=20260814f";
import { FILE_ICONS_2 } from "./file-2.js?v=20260814f";
import { COMM_ICONS_2 } from "./comm-2.js?v=20260814f";
import { UI_ICONS_2 } from "./ui-2.js?v=20260814f";
import { WEATHER_ICONS_2 } from "./weather-2.js?v=20260814f";

// アイコン定義スキーマ
// {
//   id:    "check",                       ファイル名・CSSクラス・キーフレーム名の元になる一意キー
//   cat:   "status",                      CATEGORY_ORDER のいずれか
//   label: { ja: "チェック", en: "Check" },
//   parts: [                              アニメを適用していない完成形。静止SVG/PNGはこれを書き出す
//     {
//       tag: "circle",
//       part: "ring",
//       attrs: { cx: 12, cy: 12, r: 9 },              常に出力する属性
//       animAttrs: { pathLength: 1, "stroke-dasharray": 1 },  アニメ版だけに足す下地属性
//     },
//   ],
//   anim: {
//     duration: 1.1,                      秒。速度設定はこの値への倍率として掛かる
//     easing: "ease-in-out",
//     tracks: [
//       {
//         part: "ring",                   文字列 or 配列（複数パーツを同じ動きで回す場合）
//         origin: "12px 5.5px",           任意。transform を使うトラックのみ。viewBox座標で指定する
//         keys: [                         at は 0〜1。at 以外のキーはすべてCSSプロパティ
//           { at: 0, "stroke-dashoffset": 1 },
//           { at: 1, "stroke-dashoffset": 0 },
//         ],
//       },
//     ],
//   },
// }

// カテゴリの表示順（フィルタチップの並び順）
const CATEGORY_ORDER = ["status", "action", "nav", "media", "file", "comm", "ui", "weather", "commerce", "dev", "device", "body"];

export const CATEGORY_LABELS = {
  status: { ja: "状態・通知", en: "Status" },
  action: { ja: "操作", en: "Action" },
  nav: { ja: "ナビ", en: "Navigation" },
  media: { ja: "メディア", en: "Media" },
  file: { ja: "ファイル・データ", en: "File & data" },
  comm: { ja: "コミュニケーション", en: "Communication" },
  ui: { ja: "UI・装飾", en: "UI & decoration" },
  weather: { ja: "天気・自然", en: "Weather" },
  commerce: { ja: "EC・お金", en: "Commerce" },
  dev: { ja: "開発・技術", en: "Development" },
  device: { ja: "デバイス", en: "Devices" },
  body: { ja: "人・体・健康", en: "People & health" },
};

export const ICONS = [
  ...STATUS_ICONS,
  ...STATUS_ICONS_2,
  ...ACTION_ICONS,
  ...ACTION_ICONS_2,
  ...NAV_ICONS,
  ...NAV_ICONS_2,
  ...MEDIA_ICONS,
  ...MEDIA_ICONS_2,
  ...FILE_ICONS,
  ...FILE_ICONS_2,
  ...COMM_ICONS,
  ...COMM_ICONS_2,
  ...UI_ICONS,
  ...UI_ICONS_2,
  ...WEATHER_ICONS,
  ...WEATHER_ICONS_2,
  ...COMMERCE_ICONS,
  ...DEV_ICONS,
  ...DEVICE_ICONS,
  ...BODY_ICONS,
];

// 実際にアイコンを持つカテゴリだけをCATEGORY_ORDER順で返す（空のチップを出さない）
export const CATEGORIES = CATEGORY_ORDER.filter((cat) => ICONS.some((icon) => icon.cat === cat));
