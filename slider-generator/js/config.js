// 設定の初期値。共通設定＋各ライブラリ固有設定。
export const defaultState = {
  // 共通
  slideCount: 6, // スライド（画像）枚数。プレビュー・出力コード両方に反映
  perView: 1, // PC表示枚数
  perViewMobile: 1, // スマホ（≤768px）表示枚数
  gap: 0, // スライド間の余白(px)
  speed: 500, // 遷移速度(ms)
  effect: "slide", // slide | fade | coverflow | cube | flip | cards | marquee（coverflow〜cardsはSwiper専用）
  direction: "horizontal", // horizontal | vertical
  loop: true,
  centered: false,
  autoplay: false,
  autoplayDelay: 3000, // 自動再生の間隔(ms)
  pauseOnHover: true, // ホバーで一時停止
  arrows: true,
  pagination: true,
  thumbnail: false, // サムネイル連動ギャラリー（メイン＋サムネの2スライダー）
  // Swiper固有
  grabCursor: false,
  mousewheel: false,
  keyboard: false,
  // Splide固有
  rewind: false, // 末尾→先頭へ戻す（ループの代わり）
  dragFree: false,
  // Slick固有
  adaptiveHeight: false,
  centerPadding: 60, // centerMode時の左右の見切れ幅(px)
};

