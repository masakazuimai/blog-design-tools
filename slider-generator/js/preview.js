// 選択中ライブラリのCDNを必要時にだけ読み込み、ライブプレビューを描画する。
// jQuery依存のSlickは、Slickタブを開いたときに初めて読み込む。
import {
  CDN,
  swiperOptions,
  swiperPreviewMarkup,
  splideOptions,
  splidePreviewMarkup,
  slickOptions,
  slickPreviewMarkup,
  galleryPreviewMarkup,
  thumbsPerView,
  marqueeDuration,
  marqueeSplideSpeed,
} from "./generators.js?v=20260623f";

const loaded = new Map();

function loadCss(href) {
  if (loaded.has(href)) return loaded.get(href);
  const p = new Promise((resolve, reject) => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = href;
    link.onload = resolve;
    link.onerror = () => reject(new Error(`CSS読み込み失敗: ${href}`));
    document.head.appendChild(link);
  });
  loaded.set(href, p);
  return p;
}

function loadScript(src) {
  if (loaded.has(src)) return loaded.get(src);
  const p = new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = src;
    s.onload = resolve;
    s.onerror = () => reject(new Error(`JS読み込み失敗: ${src}`));
    document.head.appendChild(s);
  });
  loaded.set(src, p);
  return p;
}

async function ensureLibrary(name, state) {
  if (name === "swiper") {
    await Promise.all([loadCss(CDN.swiper.css), loadScript(CDN.swiper.js)]);
  } else if (name === "splide") {
    await Promise.all([loadCss(CDN.splide.css), loadScript(CDN.splide.js)]);
    if (state && state.effect === "marquee") await loadScript(CDN.splide.autoScroll); // 無限スクロール用拡張
  } else if (name === "slick") {
    await Promise.all([loadCss(CDN.slick.css), loadCss(CDN.slick.theme)]);
    await loadScript(CDN.slick.jquery); // slickより先にjQueryを確定
    await loadScript(CDN.slick.js);
  }
}

let current = null; // { name, instances: [], host }（ギャラリーはメイン＋サムネの2つ）

function destroyCurrent() {
  if (!current) return;
  try {
    if (current.name === "swiper") {
      current.instances.forEach((i) => i && i.destroy(true, true));
    } else if (current.name === "splide") {
      current.instances.forEach((i) => i && i.destroy());
    } else if (current.name === "slick" && window.jQuery) {
      [".my-slider", ".main-slider", ".thumb-slider"].forEach((sel) => {
        const $el = window.jQuery(current.host).find(sel);
        if ($el.length && $el.hasClass("slick-initialized")) $el.slick("unslick");
      });
    }
  } catch (e) {
    console.warn("プレビュー破棄でエラー:", e);
  }
  current = null;
}

// Slickの余白用CSSをプレビューにも反映（1つだけ保持）
function applySlickGap(gap) {
  let tag = document.getElementById("slick-gap-style");
  if (!tag) {
    tag = document.createElement("style");
    tag.id = "slick-gap-style";
    document.head.appendChild(tag);
  }
  tag.textContent =
    gap > 0
      ? `#preview-host .my-slider .slick-slide{margin:0 ${gap / 2}px}#preview-host .my-slider .slick-list{margin:0 -${gap / 2}px}`
      : "";
}

export async function renderPreview(name, state, host) {
  destroyCurrent();
  host.innerHTML = `<p class="preview-loading">${name} を読み込み中…</p>`;
  try {
    await ensureLibrary(name, state);
  } catch (e) {
    host.innerHTML = `<p class="preview-error">${e.message}</p>`;
    return;
  }

  if (state.thumbnail) {
    renderGallery(name, state, host);
    return;
  }
  if (state.effect === "marquee") {
    renderMarquee(name, state, host);
    return;
  }

  if (name === "swiper") {
    host.innerHTML = swiperPreviewMarkup(state.slideCount, state);
    const instance = new window.Swiper(host.querySelector(".my-slider"), swiperOptions(state));
    current = { name, instances: [instance], host };
  } else if (name === "splide") {
    host.innerHTML = splidePreviewMarkup(state.slideCount);
    const instance = new window.Splide(host.querySelector(".my-slider"), splideOptions(state)).mount();
    current = { name, instances: [instance], host };
  } else if (name === "slick") {
    applySlickGap(state.gap);
    host.innerHTML = slickPreviewMarkup(state.slideCount);
    window.jQuery(host.querySelector(".my-slider")).slick(slickOptions(state));
    current = { name, instances: [], host };
  }
}

// 無限スクロール（連続・マーキー）のライブプレビュー
function renderMarquee(name, state, host) {
  const plain = { ...state, arrows: false, pagination: false };
  if (name === "swiper") {
    host.innerHTML = swiperPreviewMarkup(state.slideCount, plain);
    const sw = new window.Swiper(host.querySelector(".my-slider"), {
      slidesPerView: state.perView,
      spaceBetween: state.gap,
      loop: true,
      speed: marqueeDuration(state),
      allowTouchMove: false,
      autoplay: { delay: 0, disableOnInteraction: false },
    });
    const wrap = host.querySelector(".swiper-wrapper");
    if (wrap) wrap.style.transitionTimingFunction = "linear";
    current = { name, instances: [sw], host };
  } else if (name === "splide") {
    host.innerHTML = splidePreviewMarkup(state.slideCount);
    const sp = new window.Splide(host.querySelector(".my-slider"), {
      type: "loop",
      perPage: state.perView,
      gap: `${state.gap}px`,
      drag: "free",
      arrows: false,
      pagination: false,
      autoScroll: { speed: marqueeSplideSpeed(state), pauseOnHover: state.pauseOnHover },
    });
    sp.mount({ AutoScroll: window.splide.Extensions.AutoScroll });
    current = { name, instances: [sp], host };
  } else if (name === "slick") {
    applySlickGap(state.gap);
    host.innerHTML = slickPreviewMarkup(state.slideCount);
    window.jQuery(host.querySelector(".my-slider")).slick({
      slidesToShow: state.perView,
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: 0,
      speed: marqueeDuration(state),
      cssEase: "linear",
      infinite: true,
      arrows: false,
      pauseOnHover: state.pauseOnHover,
    });
    current = { name, instances: [], host };
  }
}

// サムネイル連動ギャラリー（メイン＋サムネの2スライダー）のライブプレビュー
function renderGallery(name, state, host) {
  host.innerHTML = galleryPreviewMarkup(name, state);
  const fade = state.effect === "fade";
  const per = thumbsPerView(state);

  if (name === "swiper") {
    const thumbs = new window.Swiper(host.querySelector(".thumb-slider"), {
      spaceBetween: 8,
      slidesPerView: per,
      freeMode: true,
      watchSlidesProgress: true,
    });
    const mainOpt = { spaceBetween: 8, thumbs: { swiper: thumbs } };
    if (fade) {
      mainOpt.effect = "fade";
      mainOpt.fadeEffect = { crossFade: true };
    }
    if (state.autoplay) mainOpt.autoplay = { delay: state.autoplayDelay };
    if (state.arrows) {
      mainOpt.navigation = {
        nextEl: host.querySelector(".main-slider .swiper-button-next"),
        prevEl: host.querySelector(".main-slider .swiper-button-prev"),
      };
    }
    const main = new window.Swiper(host.querySelector(".main-slider"), mainOpt);
    current = { name, instances: [main, thumbs], host };
  } else if (name === "splide") {
    const mainOpt = { type: fade ? "fade" : "slide", rewind: true, pagination: false, arrows: state.arrows };
    if (state.autoplay) {
      mainOpt.autoplay = true;
      mainOpt.interval = state.autoplayDelay;
    }
    const main = new window.Splide(host.querySelector(".main-slider"), mainOpt);
    const thumbs = new window.Splide(host.querySelector(".thumb-slider"), {
      fixedWidth: 90,
      fixedHeight: 56,
      gap: 8,
      rewind: true,
      pagination: false,
      arrows: false,
      cover: true,
      isNavigation: true,
    });
    main.sync(thumbs);
    main.mount();
    thumbs.mount();
    current = { name, instances: [main, thumbs], host };
  } else if (name === "slick") {
    const $ = window.jQuery;
    const mainOpt = {
      slidesToShow: 1,
      slidesToScroll: 1,
      arrows: state.arrows,
      asNavFor: host.querySelector(".thumb-slider"),
    };
    if (fade) mainOpt.fade = true;
    if (state.autoplay) {
      mainOpt.autoplay = true;
      mainOpt.autoplaySpeed = state.autoplayDelay;
    }
    $(host.querySelector(".main-slider")).slick(mainOpt);
    $(host.querySelector(".thumb-slider")).slick({
      slidesToShow: per,
      slidesToScroll: 1,
      asNavFor: host.querySelector(".main-slider"),
      focusOnSelect: true,
      arrows: false,
      dots: false,
    });
    current = { name, instances: [], host };
  }
}
