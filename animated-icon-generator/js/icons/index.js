
import { STATUS_ICONS } from "./status.js?v=20260815c";
import { ACTION_ICONS } from "./action.js?v=20260815c";
import { NAV_ICONS } from "./nav.js?v=20260815c";
import { MEDIA_ICONS } from "./media.js?v=20260815c";
import { FILE_ICONS } from "./file.js?v=20260815c";
import { COMM_ICONS } from "./comm.js?v=20260815c";
import { UI_ICONS } from "./ui.js?v=20260815c";
import { WEATHER_ICONS } from "./weather.js?v=20260815c";
import { COMMERCE_ICONS } from "./commerce.js?v=20260815c";
import { DEV_ICONS } from "./dev.js?v=20260815c";
import { DEVICE_ICONS } from "./device.js?v=20260815c";
import { BODY_ICONS } from "./body.js?v=20260815c";
import { STATUS_ICONS_2 } from "./status-2.js?v=20260815c";
import { ACTION_ICONS_2 } from "./action-2.js?v=20260815c";
import { NAV_ICONS_2 } from "./nav-2.js?v=20260815c";
import { MEDIA_ICONS_2 } from "./media-2.js?v=20260815c";
import { FILE_ICONS_2 } from "./file-2.js?v=20260815c";
import { COMM_ICONS_2 } from "./comm-2.js?v=20260815c";
import { UI_ICONS_2 } from "./ui-2.js?v=20260815c";
import { WEATHER_ICONS_2 } from "./weather-2.js?v=20260815c";


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

export const CATEGORIES = CATEGORY_ORDER.filter((cat) => ICONS.some((icon) => icon.cat === cat));
