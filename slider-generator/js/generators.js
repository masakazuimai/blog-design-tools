// 共通設定（state）から Swiper / Splide / Slick それぞれの
// オプションオブジェクト・マークアップ・コピペ用コード文字列を生成する純粋関数群。
// プレビューはオプションオブジェクトを直接使い、出力欄は文字列化したコードを使う。

import { LANG } from "./i18n.js?v=20260623e";

// プレビュー・出力で使うサンプル画像（Unsplash・安定した固定ID）
export const IMAGES = [
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80&auto=format&fit=crop",
];

const img = (i) => `<img src="${IMAGES[i % IMAGES.length]}" alt="${LANG === "en" ? `Slide ${i + 1}` : `スライド${i + 1}`}" />`;

// 出力コード内のコメント（言語別）。enページでは英語コメントを出す。
const CMT =
  LANG === "en"
    ? {
        head: "<!-- 1. Load in <head> -->",
        headSlick: "<!-- 1. Load in <head> (Slick is legacy - prefer Swiper/Splide) -->",
        html: "<!-- 2. HTML -->",
        htmlThumb: "<!-- 2. HTML (main + thumbnails) -->",
        init: "<!-- 3. Load & init just before </body> -->",
        initJq: "<!-- 3. Load & init just before </body> (jQuery required) -->",
        initAutoScroll: "<!-- 3. Load & init just before </body> (auto-scroll extension required) -->",
        marqueeCss: "/* Scroll at a constant speed */",
      }
    : {
        head: "<!-- 1. <head> に読み込み -->",
        headSlick: "<!-- 1. <head> に読み込み（Slickはまず非推奨。可能ならSwiper/Splide推奨） -->",
        html: "<!-- 2. HTML -->",
        htmlThumb: "<!-- 2. HTML（メイン＋サムネイル） -->",
        init: "<!-- 3. </body> 直前に読み込み＆初期化 -->",
        initJq: "<!-- 3. </body> 直前に読み込み＆初期化（jQuery必須） -->",
        initAutoScroll: "<!-- 3. </body> 直前に読み込み＆初期化（auto-scroll拡張が必要） -->",
        marqueeCss: "/* 無限スクロールは等速で流す */",
      };

export const CDN = {
  swiper: {
    css: "https://cdn.jsdelivr.net/npm/swiper@12/swiper-bundle.min.css",
    js: "https://cdn.jsdelivr.net/npm/swiper@12/swiper-bundle.min.js",
  },
  splide: {
    css: "https://cdn.jsdelivr.net/npm/@splidejs/splide@4.1.4/dist/css/splide.min.css",
    js: "https://cdn.jsdelivr.net/npm/@splidejs/splide@4.1.4/dist/js/splide.min.js",
    autoScroll: "https://cdn.jsdelivr.net/npm/@splidejs/splide-extension-auto-scroll@0.5.3/dist/js/splide-extension-auto-scroll.min.js",
  },
  slick: {
    css: "https://cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick.css",
    theme: "https://cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick-theme.css",
    jquery: "https://code.jquery.com/jquery-3.7.1.min.js",
    js: "https://cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick.min.js",
  },
};

// fade/cube/flip/cards は1枚表示が前提のエフェクト（表示枚数を1に固定）
const SINGLE_VIEW_EFFECTS = ["fade", "cube", "flip", "cards"];
const isSingleView = (state) => SINGLE_VIEW_EFFECTS.includes(state.effect);
const perViewOf = (state) => (isSingleView(state) ? 1 : state.perView);
const perViewMobileOf = (state) =>
  isSingleView(state) ? 1 : Math.min(state.perViewMobile, perViewOf(state));

/* ============================================================
 * Swiper v12
 * ============================================================ */
export function swiperOptions(state) {
  const opt = {};
  opt.slidesPerView = perViewMobileOf(state);
  if (state.gap > 0) opt.spaceBetween = state.gap;
  if (state.loop) opt.loop = true;
  if (state.speed !== 300) opt.speed = state.speed;
  if (state.direction === "vertical") opt.direction = "vertical";
  if (state.effect === "fade") {
    opt.effect = "fade";
    opt.fadeEffect = { crossFade: true };
  } else if (state.effect === "cube") {
    opt.effect = "cube";
  } else if (state.effect === "flip") {
    opt.effect = "flip";
  } else if (state.effect === "cards") {
    opt.effect = "cards";
  } else if (state.effect === "coverflow") {
    opt.effect = "coverflow";
    opt.grabCursor = true;
    opt.centeredSlides = true;
    opt.coverflowEffect = { rotate: 30, stretch: 0, depth: 120, modifier: 1, slideShadows: true };
  }
  if (state.centered) opt.centeredSlides = true;
  // Swiper固有オプション
  if (state.grabCursor && state.effect !== "coverflow") opt.grabCursor = true;
  if (state.mousewheel) opt.mousewheel = true;
  if (state.keyboard) opt.keyboard = true;
  if (state.autoplay) {
    opt.autoplay = { delay: state.autoplayDelay, disableOnInteraction: false };
    if (state.pauseOnHover) opt.autoplay.pauseOnMouseEnter = true;
  }
  if (state.pagination) opt.pagination = { el: ".swiper-pagination", clickable: true };
  if (state.arrows) opt.navigation = { nextEl: ".swiper-button-next", prevEl: ".swiper-button-prev" };
  // レスポンシブ：モバイル基準→768px以上で表示枚数を増やす（1枚固定エフェクト時は不要）
  if (!isSingleView(state) && perViewOf(state) !== perViewMobileOf(state)) {
    opt.breakpoints = { 768: { slidesPerView: perViewOf(state) } };
  }
  return opt;
}

export function swiperMarkup(count) {
  const slides = Array.from({ length: count }, (_, i) => `      <div class="swiper-slide">${img(i)}</div>`).join("\n");
  return `<div class="swiper my-slider">
  <div class="swiper-wrapper">
${slides}
  </div>
</div>`;
}

// プレビュー用：ナビ/ページネーション要素を含むフルマークアップ
export function swiperPreviewMarkup(count, state) {
  const slides = Array.from({ length: count }, (_, i) => `<div class="swiper-slide">${img(i)}</div>`).join("");
  const pager = state.pagination ? `<div class="swiper-pagination"></div>` : "";
  const nav = state.arrows ? `<div class="swiper-button-prev"></div><div class="swiper-button-next"></div>` : "";
  return `<div class="swiper my-slider"><div class="swiper-wrapper">${slides}</div>${pager}${nav}</div>`;
}

/* ============================================================
 * Splide v4
 * ============================================================ */
export function splideOptions(state) {
  const opt = {};
  // rewind は type:'slide' と併用（loopとは排他）
  opt.type = state.effect === "fade" ? "fade" : state.rewind ? "slide" : state.loop ? "loop" : "slide";
  if (state.rewind) opt.rewind = true;
  if (perViewOf(state) !== 1) opt.perPage = perViewOf(state);
  if (state.gap > 0) opt.gap = `${state.gap}px`;
  if (state.speed !== 400) opt.speed = state.speed;
  if (state.direction === "vertical") {
    opt.direction = "ttb";
    opt.height = "16rem";
  }
  if (state.centered && perViewOf(state) > 1) opt.focus = "center";
  if (state.dragFree) opt.drag = "free"; // Splide固有：自由ドラッグ
  if (!state.arrows) opt.arrows = false;
  if (!state.pagination) opt.pagination = false;
  if (state.autoplay) {
    opt.autoplay = true;
    opt.interval = state.autoplayDelay;
    if (!state.pauseOnHover) opt.pauseOnHover = false; // Splideの既定はtrue
  }
  if (!isSingleView(state) && perViewMobileOf(state) !== perViewOf(state)) {
    opt.breakpoints = { 768: { perPage: perViewMobileOf(state) } };
  }
  return opt;
}

export function splideMarkup(count) {
  const slides = Array.from({ length: count }, (_, i) => `        <li class="splide__slide">${img(i)}</li>`).join("\n");
  return `<div class="splide my-slider">
  <div class="splide__track">
    <ul class="splide__list">
${slides}
    </ul>
  </div>
</div>`;
}

export function splidePreviewMarkup(count) {
  const slides = Array.from({ length: count }, (_, i) => `<li class="splide__slide">${img(i)}</li>`).join("");
  return `<div class="splide my-slider"><div class="splide__track"><ul class="splide__list">${slides}</ul></div></div>`;
}

/* ============================================================
 * Slick v1.8.1（jQuery依存・保守停止）
 * ============================================================ */
export function slickOptions(state) {
  const opt = {};
  opt.slidesToShow = perViewOf(state);
  opt.slidesToScroll = 1;
  opt.infinite = !!state.loop;
  if (state.speed !== 300) opt.speed = state.speed;
  if (state.effect === "fade") opt.fade = true;
  if (state.direction === "vertical") {
    opt.vertical = true;
    opt.verticalSwiping = true;
  }
  if (state.centered) {
    opt.centerMode = true;
    opt.centerPadding = `${state.centerPadding}px`;
  }
  if (state.adaptiveHeight) opt.adaptiveHeight = true; // Slick固有
  opt.autoplay = !!state.autoplay;
  if (state.autoplay) {
    opt.autoplaySpeed = state.autoplayDelay;
    if (!state.pauseOnHover) opt.pauseOnHover = false; // Slickの既定はtrue
  }
  opt.arrows = !!state.arrows;
  opt.dots = !!state.pagination;
  if (!isSingleView(state) && perViewMobileOf(state) !== perViewOf(state)) {
    opt.responsive = [{ breakpoint: 768, settings: { slidesToShow: perViewMobileOf(state) } }];
  }
  return opt;
}

export function slickMarkup(count) {
  const slides = Array.from({ length: count }, (_, i) => `  <div>${img(i)}</div>`).join("\n");
  return `<div class="my-slider">
${slides}
</div>`;
}

export function slickPreviewMarkup(count) {
  const slides = Array.from({ length: count }, (_, i) => `<div>${img(i)}</div>`).join("");
  return `<div class="my-slider">${slides}</div>`;
}

// Slick は gap オプションを持たないため、余白指定時はCSSで補う
export function slickGapCss(gap) {
  if (gap <= 0) return "";
  return `<style>
  .my-slider .slick-slide { margin: 0 ${gap / 2}px; }
  .my-slider .slick-list { margin: 0 -${gap / 2}px; }
</style>
`;
}

/* ============================================================
 * オプションオブジェクト → JS風文字列
 * ============================================================ */
export function stringifyOptions(obj, indent = 2) {
  const pad = " ".repeat(indent);
  const entries = Object.entries(obj);
  if (entries.length === 0) return "{}";
  const lines = entries.map(([key, value]) => `${pad}${key}: ${formatValue(value, indent)}`);
  return `{\n${lines.join(",\n")}\n${" ".repeat(indent - 2)}}`;
}

function formatValue(value, indent) {
  if (typeof value === "string") return `'${value}'`;
  if (typeof value === "boolean" || typeof value === "number") return String(value);
  if (Array.isArray(value)) {
    const items = value.map((v) => formatValue(v, indent + 2));
    return `[${items.join(", ")}]`;
  }
  if (value && typeof value === "object") return stringifyOptions(value, indent + 2);
  return String(value);
}

/* ============================================================
 * コピペ用フルコード（CDN + HTML + 初期化）
 * ============================================================ */
/* ============================================================
 * サムネイル連動ギャラリー（メイン＋サムネの2スライダー）
 * メインは1枚表示固定。サムネをクリックすると連動。loop/perView等は無効。
 * ============================================================ */
const thumbVisible = (state) => Math.min(state.slideCount, 5);
const swiperSlideList = (count) => Array.from({ length: count }, (_, i) => `      <div class="swiper-slide">${img(i)}</div>`).join("\n");
const splideSlideList = (count) => Array.from({ length: count }, (_, i) => `        <li class="splide__slide">${img(i)}</li>`).join("\n");
const slickSlideList = (count) => Array.from({ length: count }, (_, i) => `  <div>${img(i)}</div>`).join("\n");

// プレビュー用の2スライダー（メイン＋サムネ）マークアップ
export function galleryPreviewMarkup(name, state) {
  const c = state.slideCount;
  if (name === "swiper") {
    const s = Array.from({ length: c }, (_, i) => `<div class="swiper-slide">${img(i)}</div>`).join("");
    const nav = state.arrows ? `<div class="swiper-button-prev"></div><div class="swiper-button-next"></div>` : "";
    return `<div class="gallery"><div class="swiper main-slider"><div class="swiper-wrapper">${s}</div>${nav}</div><div class="swiper thumb-slider"><div class="swiper-wrapper">${s}</div></div></div>`;
  }
  if (name === "splide") {
    const s = Array.from({ length: c }, (_, i) => `<li class="splide__slide">${img(i)}</li>`).join("");
    const track = (cls) => `<div class="splide ${cls}"><div class="splide__track"><ul class="splide__list">${s}</ul></div></div>`;
    return `<div class="gallery">${track("main-slider")}${track("thumb-slider")}</div>`;
  }
  const s = Array.from({ length: c }, (_, i) => `<div>${img(i)}</div>`).join("");
  return `<div class="gallery"><div class="main-slider">${s}</div><div class="thumb-slider">${s}</div></div>`;
}

export const thumbsPerView = (state) => Math.min(state.slideCount, 5);

export function thumbCode(name, state) {
  const count = state.slideCount;
  const per = thumbVisible(state);
  const fade = state.effect === "fade";
  const auto = state.autoplay;

  if (name === "swiper") {
    return `${CMT.head}
<link rel="stylesheet" href="${CDN.swiper.css}" />
<style>
  .thumb-slider { margin-top: 8px; }
  .thumb-slider .swiper-slide { opacity: 0.45; cursor: pointer; }
  .thumb-slider .swiper-slide-thumb-active { opacity: 1; }
  .main-slider img, .thumb-slider img { display: block; width: 100%; }
</style>

${CMT.htmlThumb}
<div class="swiper main-slider">
  <div class="swiper-wrapper">
${swiperSlideList(count)}
  </div>
  <div class="swiper-button-prev"></div>
  <div class="swiper-button-next"></div>
</div>
<div class="swiper thumb-slider">
  <div class="swiper-wrapper">
${swiperSlideList(count)}
  </div>
</div>

${CMT.init}
<script src="${CDN.swiper.js}"></script>
<script>
  const thumbs = new Swiper('.thumb-slider', {
    spaceBetween: 8,
    slidesPerView: ${per},
    freeMode: true,
    watchSlidesProgress: true,
  });
  const main = new Swiper('.main-slider', {
    spaceBetween: 8,${fade ? "\n    effect: 'fade',\n    fadeEffect: { crossFade: true }," : ""}${auto ? `\n    autoplay: { delay: ${state.autoplayDelay} },` : ""}
    navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
    thumbs: { swiper: thumbs },
  });
</script>`;
  }

  if (name === "splide") {
    return `${CMT.head}
<link rel="stylesheet" href="${CDN.splide.css}" />
<style>
  .thumb-slider { margin-top: 8px; }
  .thumb-slider .splide__slide { opacity: 0.45; cursor: pointer; }
  .thumb-slider .splide__slide.is-active { opacity: 1; }
  .main-slider img { display: block; width: 100%; }
</style>

${CMT.htmlThumb}
<div class="splide main-slider">
  <div class="splide__track">
    <ul class="splide__list">
${splideSlideList(count)}
    </ul>
  </div>
</div>
<div class="splide thumb-slider">
  <div class="splide__track">
    <ul class="splide__list">
${splideSlideList(count)}
    </ul>
  </div>
</div>

${CMT.init}
<script src="${CDN.splide.js}"></script>
<script>
  const main = new Splide('.main-slider', {
    type: '${fade ? "fade" : "slide"}',
    rewind: true,
    pagination: false,
    arrows: ${state.arrows},${auto ? `\n    autoplay: true,\n    interval: ${state.autoplayDelay},` : ""}
  });
  const thumbnails = new Splide('.thumb-slider', {
    fixedWidth: 90,
    fixedHeight: 56,
    gap: 8,
    rewind: true,
    pagination: false,
    arrows: false,
    cover: true,
    isNavigation: true,
  });
  main.sync(thumbnails);
  main.mount();
  thumbnails.mount();
</script>`;
  }

  if (name === "slick") {
    return `${CMT.headSlick}
<link rel="stylesheet" href="${CDN.slick.css}" />
<link rel="stylesheet" href="${CDN.slick.theme}" />
<style>
  .thumb-slider .slick-slide { opacity: 0.45; cursor: pointer; padding: 0 4px; }
  .thumb-slider .slick-current { opacity: 1; }
  .main-slider img, .thumb-slider img { display: block; width: 100%; }
</style>

${CMT.htmlThumb}
<div class="main-slider">
${slickSlideList(count)}
</div>
<div class="thumb-slider">
${slickSlideList(count)}
</div>

${CMT.initJq}
<script src="${CDN.slick.jquery}"></script>
<script src="${CDN.slick.js}"></script>
<script>
  $('.main-slider').slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: ${state.arrows},${fade ? "\n    fade: true," : ""}${auto ? `\n    autoplay: true,\n    autoplaySpeed: ${state.autoplayDelay},` : ""}
    asNavFor: '.thumb-slider',
  });
  $('.thumb-slider').slick({
    slidesToShow: ${per},
    slidesToScroll: 1,
    asNavFor: '.main-slider',
    focusOnSelect: true,
    arrows: false,
    dots: false,
  });
</script>`;
  }
  return "";
}

/* ============================================================
 * 無限スクロール（連続・マーキー）
 * 止まらず等速で流し続ける。エフェクト/通常autoplay/矢印/ドットは無効。
 * 速さは「遷移速度」スライダーに連動（値が大きいほど速い）。
 * ============================================================ */
export const marqueeDuration = (state) => Math.min(20000, Math.max(1500, Math.round(2000000 / state.speed)));
export const marqueeSplideSpeed = (state) => Math.min(5, Math.max(0.5, Math.round((state.speed / 300) * 10) / 10));

export function marqueeCode(name, state) {
  const count = state.slideCount;
  const per = state.perView;
  const gap = state.gap;
  const ms = marqueeDuration(state);

  if (name === "swiper") {
    return `${CMT.head}
<link rel="stylesheet" href="${CDN.swiper.css}" />
<style>
  ${CMT.marqueeCss}
  .my-slider .swiper-wrapper { transition-timing-function: linear !important; }
</style>

${CMT.html}
${swiperMarkup(count)}

${CMT.init}
<script src="${CDN.swiper.js}"></script>
<script>
  new Swiper('.my-slider', {
    slidesPerView: ${per},${gap > 0 ? `\n    spaceBetween: ${gap},` : ""}
    loop: true,
    speed: ${ms},
    allowTouchMove: false,
    autoplay: { delay: 0, disableOnInteraction: false },
  });
</script>`;
  }

  if (name === "splide") {
    const sp = marqueeSplideSpeed(state);
    return `${CMT.head}
<link rel="stylesheet" href="${CDN.splide.css}" />

${CMT.html}
${splideMarkup(count)}

${CMT.initAutoScroll}
<script src="${CDN.splide.js}"></script>
<script src="${CDN.splide.autoScroll}"></script>
<script>
  new Splide('.my-slider', {
    type: 'loop',
    perPage: ${per},${gap > 0 ? `\n    gap: '${gap}px',` : ""}
    drag: 'free',
    arrows: false,
    pagination: false,
    autoScroll: { speed: ${sp}, pauseOnHover: ${state.pauseOnHover} },
  }).mount({ AutoScroll: window.splide.Extensions.AutoScroll });
</script>`;
  }

  if (name === "slick") {
    return `${CMT.headSlick}
<link rel="stylesheet" href="${CDN.slick.css}" />
<link rel="stylesheet" href="${CDN.slick.theme}" />
${slickGapCss(gap)}
${CMT.html}
${slickMarkup(count)}

${CMT.initJq}
<script src="${CDN.slick.jquery}"></script>
<script src="${CDN.slick.js}"></script>
<script>
  $('.my-slider').slick({
    slidesToShow: ${per},
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 0,
    speed: ${ms},
    cssEase: 'linear',
    infinite: true,
    arrows: false,
    pauseOnHover: ${state.pauseOnHover},
  });
</script>`;
  }
  return "";
}

export function fullCode(name, state) {
  if (state.thumbnail) return thumbCode(name, state);
  if (state.effect === "marquee") return marqueeCode(name, state);
  const count = state.slideCount;
  if (name === "swiper") {
    return `${CMT.head}
<link rel="stylesheet" href="${CDN.swiper.css}" />

${CMT.html}
${swiperMarkup(count)}

${CMT.init}
<script src="${CDN.swiper.js}"></script>
<script>
  const swiper = new Swiper('.my-slider', ${stringifyOptions(swiperOptions(state))});
</script>`;
  }
  if (name === "splide") {
    return `${CMT.head}
<link rel="stylesheet" href="${CDN.splide.css}" />

${CMT.html}
${splideMarkup(count)}

${CMT.init}
<script src="${CDN.splide.js}"></script>
<script>
  new Splide('.my-slider', ${stringifyOptions(splideOptions(state))}).mount();
</script>`;
  }
  if (name === "slick") {
    return `${CMT.headSlick}
<link rel="stylesheet" href="${CDN.slick.css}" />
<link rel="stylesheet" href="${CDN.slick.theme}" />
${slickGapCss(state.gap)}
${CMT.html}
${slickMarkup(count)}

${CMT.initJq}
<script src="${CDN.slick.jquery}"></script>
<script src="${CDN.slick.js}"></script>
<script>
  $('.my-slider').slick(${stringifyOptions(slickOptions(state))});
</script>`;
  }
  return "";
}
