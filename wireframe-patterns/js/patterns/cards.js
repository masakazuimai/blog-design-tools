// カード一覧（記事・商品）のパターン
const POST = `<li class="wf-box cd01__card">
        <div class="wf-img cd01__img"></div>
        <div class="cd01__body">
          <p class="cd01__meta"><span class="cd01__tag">カテゴリ</span><span>2026.00.00</span></p>
          <p class="wf-h3">記事タイトルが入ります。2行までに収める</p>
        </div>
      </li>`;

const ITEM = `<li class="cd02__item">
        <div class="wf-img cd02__img"></div>
        <p class="cd02__name">商品名が入ります</p>
        <p class="cd02__price">¥0,000<span>（税込）</span></p>
      </li>`;

export default [
  {
    id: "cd01",
    cat: "cards",
    name: "記事カードの3列グリッド",
    use: "ブログ・お知らせ・コラム一覧",
    intent: "サムネイル・カテゴリ・日付・タイトルの順に並べ、読む記事を見た目と新しさで選べるようにする。タイトルは2行までにそろえ、カードの高さを均一に保つ。",
    parts: ["見出し＋一覧へのリンク", "記事カード 6枚（画像・カテゴリ・日付・タイトル）"],
    html: `<section class="wf-section cd01">
  <div class="wf-inner">
    <div class="cd01__head"><h2 class="wf-h2">新着記事</h2><a class="wf-link" href="#">すべて見る →</a></div>
    <ul class="wf-list cd01__grid">
      ${POST}
      ${POST}
      ${POST}
      ${POST}
      ${POST}
      ${POST}
    </ul>
  </div>
</section>`,
    css: `.cd01__head { display: flex; align-items: baseline; justify-content: space-between; gap: 16px; margin-bottom: 32px; }
.cd01__grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
.cd01__card { overflow: hidden; }
.cd01__img { aspect-ratio: 16 / 9; border: 0; border-bottom: 2px solid #b5b5b5; border-radius: 0; }
.cd01__body { display: flex; flex-direction: column; gap: 8px; padding: 16px 18px 20px; }
.cd01__meta { display: flex; align-items: center; gap: 12px; margin: 0; color: #777; }
.cd01__tag { padding: 0 10px; border: 1px solid #aaa; border-radius: 999px; }
@container (max-width: 760px) {
  .cd01__grid { grid-template-columns: 1fr 1fr; gap: 16px; }
}
@container (max-width: 480px) {
  .cd01__grid { grid-template-columns: 1fr; }
}`,
  },
  {
    id: "cd02",
    cat: "cards",
    name: "商品の横スクロール",
    use: "ECのおすすめ・関連商品・ランキング",
    intent: "画面幅より多い商品を横に流し、縦の長さを使わずにたくさん見せる。端のカードを少し見切らせて「まだ続く」ことを伝え、スワイプを促す。",
    parts: ["見出し＋前後ボタン", "商品カード 6枚（画像・商品名・価格）を横スクロール"],
    html: `<section class="wf-section cd02">
  <div class="wf-inner">
    <div class="cd02__head">
      <h2 class="wf-h2">おすすめ商品</h2>
      <div class="cd02__nav"><button class="wf-btn" type="button" aria-label="前へ">←</button><button class="wf-btn" type="button" aria-label="次へ">→</button></div>
    </div>
    <ul class="wf-list cd02__track">
      ${ITEM}
      ${ITEM}
      ${ITEM}
      ${ITEM}
      ${ITEM}
      ${ITEM}
    </ul>
  </div>
</section>`,
    css: `.cd02 { overflow: hidden; }
.cd02__head { display: flex; align-items: center; justify-content: space-between; gap: 16px; margin-bottom: 24px; }
.cd02__nav { display: flex; gap: 8px; }
.cd02__nav .wf-btn { width: 48px; padding: 0; }
.cd02__track { display: flex; gap: 20px; overflow-x: auto; scroll-snap-type: x mandatory; margin-right: -20px; padding-bottom: 8px; }
.cd02__item { flex: 0 0 calc((100% - 60px) / 3.5); display: flex; flex-direction: column; gap: 8px; scroll-snap-align: start; }
.cd02__img { aspect-ratio: 1; }
.cd02__name, .cd02__price { margin: 0; }
.cd02__price { font-weight: 700; }
.cd02__price span { font-weight: 400; color: #777; }
@container (max-width: 640px) {
  .cd02__nav { display: none; }
  .cd02__item { flex-basis: 62%; }
}`,
  },
  {
    id: "cd03",
    cat: "cards",
    name: "サムネイル左・テキスト右のリスト",
    use: "ブログの記事一覧・検索結果・ニュース",
    intent: "1行に1件ずつ並べ、タイトルと抜粋を広く見せる。グリッドより情報量が多く、文章で選ぶ記事一覧や検索結果に向く。",
    parts: ["記事 4件（左にサムネイル・右にカテゴリ・日付・タイトル・抜粋）", "下にページ送り"],
    html: `<section class="wf-section cd03">
  <div class="wf-inner cd03__inner">
    <h2 class="wf-h2 cd03__ttl">記事一覧</h2>
    <ul class="wf-list cd03__list">
      <li><div class="wf-img cd03__img"></div><div class="cd03__body"><p class="cd03__meta"><span class="cd03__tag">カテゴリ</span><span>2026.00.00</span></p><p class="wf-h3">記事タイトルが入ります</p><p class="wf-text">記事の抜粋が入ります。最初の2行ほどを表示して、続きは記事ページで読ませます。</p></div></li>
      <li><div class="wf-img cd03__img"></div><div class="cd03__body"><p class="cd03__meta"><span class="cd03__tag">カテゴリ</span><span>2026.00.00</span></p><p class="wf-h3">記事タイトルが入ります</p><p class="wf-text">記事の抜粋が入ります。最初の2行ほどを表示して、続きは記事ページで読ませます。</p></div></li>
      <li><div class="wf-img cd03__img"></div><div class="cd03__body"><p class="cd03__meta"><span class="cd03__tag">カテゴリ</span><span>2026.00.00</span></p><p class="wf-h3">記事タイトルが入ります</p><p class="wf-text">記事の抜粋が入ります。最初の2行ほどを表示して、続きは記事ページで読ませます。</p></div></li>
      <li><div class="wf-img cd03__img"></div><div class="cd03__body"><p class="cd03__meta"><span class="cd03__tag">カテゴリ</span><span>2026.00.00</span></p><p class="wf-h3">記事タイトルが入ります</p><p class="wf-text">記事の抜粋が入ります。最初の2行ほどを表示して、続きは記事ページで読ませます。</p></div></li>
    </ul>
    <nav class="cd03__pager"><span class="is-on">1</span><span>2</span><span>3</span><span>…</span><span>10</span><span>次へ →</span></nav>
  </div>
</section>`,
    css: `.cd03__inner { max-width: 900px; }
.cd03__ttl { margin-bottom: 24px; }
.cd03__list li { display: grid; grid-template-columns: 240px 1fr; gap: 24px; padding: 24px 0; border-bottom: 1px solid #ddd; }
.cd03__list li:first-child { border-top: 1px solid #ddd; }
.cd03__img { aspect-ratio: 16 / 10; }
.cd03__body { display: flex; flex-direction: column; gap: 8px; }
.cd03__meta { display: flex; align-items: center; gap: 12px; margin: 0; color: #777; }
.cd03__tag { padding: 0 10px; border: 1px solid #aaa; border-radius: 999px; }
.cd03__pager { display: flex; justify-content: center; flex-wrap: wrap; gap: 8px; margin-top: 32px; }
.cd03__pager span { display: grid; place-items: center; min-width: 44px; height: 44px; padding: 0 12px; border: 1px solid #c4c4c4; border-radius: 6px; }
.cd03__pager .is-on { background: #444; border-color: #444; color: #fff; }
@container (max-width: 640px) {
  .cd03__list li { grid-template-columns: 120px 1fr; gap: 14px; }
  .cd03__list .wf-text { display: none; }
}`,
  },
  {
    id: "cd04",
    cat: "cards",
    name: "大きな1件＋小さな4件",
    use: "メディアのトップ・特集・ニュースのピックアップ",
    intent: "一番読ませたい記事を大きく、残りを小さく並べて優先度を見た目で示す。全件同じ大きさのグリッドよりも、どれから読めばいいかが伝わる。",
    parts: ["左：大きな記事カード（画像・カテゴリ・タイトル・抜粋）", "右：小さな記事 4件（サムネイル・タイトル）"],
    html: `<section class="wf-section cd04">
  <div class="wf-inner">
    <h2 class="wf-h2 cd04__ttl">ピックアップ</h2>
    <div class="cd04__grid">
      <article class="cd04__main">
        <div class="wf-img cd04__img"></div>
        <span class="wf-label">特集</span>
        <p class="wf-h2">一番読ませたい記事のタイトルが入ります</p>
        <p class="wf-text">記事の抜粋が入ります。大きなカードでは2〜3行の抜粋を見せます。</p>
      </article>
      <ul class="wf-list cd04__subs">
        <li><div class="wf-img"></div><p>記事タイトルが入ります。2行までに収めます</p></li>
        <li><div class="wf-img"></div><p>記事タイトルが入ります。2行までに収めます</p></li>
        <li><div class="wf-img"></div><p>記事タイトルが入ります。2行までに収めます</p></li>
        <li><div class="wf-img"></div><p>記事タイトルが入ります。2行までに収めます</p></li>
      </ul>
    </div>
  </div>
</section>`,
    css: `.cd04__ttl { margin-bottom: 24px; }
.cd04__grid { display: grid; grid-template-columns: 1.4fr 1fr; gap: 32px; }
.cd04__main { display: flex; flex-direction: column; align-items: flex-start; gap: 12px; }
.cd04__img { aspect-ratio: 16 / 9; }
.cd04__subs { display: grid; gap: 16px; align-content: start; }
.cd04__subs li { display: grid; grid-template-columns: 140px 1fr; align-items: center; gap: 16px; }
.cd04__subs .wf-img { aspect-ratio: 16 / 10; }
.cd04__subs p { margin: 0; font-weight: 700; }
@container (max-width: 760px) {
  .cd04__grid { grid-template-columns: 1fr; }
  .cd04__subs li { grid-template-columns: 112px 1fr; }
}`,
  },
  {
    id: "cd05",
    cat: "cards",
    name: "商品グリッド（バッジ・お気に入りつき）",
    use: "ECの商品一覧・カテゴリページ",
    intent: "商品画像を主役に4列で並べ、価格・評価・バッジ（新着・セール）を決まった位置に置いて比べやすくする。お気に入りボタンで「あとで買う」の受け皿も作る。",
    parts: ["上：件数と並び替え", "商品カード 8枚（画像・バッジ・お気に入り・商品名・価格・評価）"],
    html: `<section class="wf-section cd05">
  <div class="wf-inner">
    <div class="cd05__bar"><span class="wf-text">000件</span><span class="cd05__sort">おすすめ順 ▾</span></div>
    <ul class="wf-list cd05__grid">
      <li><div class="cd05__thumb"><div class="wf-img"></div><span class="cd05__badge">NEW</span><span class="cd05__fav">♡</span></div><p class="cd05__name">商品名が入ります</p><p class="cd05__price">¥0,000</p><p class="cd05__rate">★★★★☆ (00)</p></li>
      <li><div class="cd05__thumb"><div class="wf-img"></div><span class="cd05__badge">SALE</span><span class="cd05__fav">♡</span></div><p class="cd05__name">商品名が入ります</p><p class="cd05__price">¥0,000</p><p class="cd05__rate">★★★★★ (00)</p></li>
      <li><div class="cd05__thumb"><div class="wf-img"></div><span class="cd05__fav">♡</span></div><p class="cd05__name">商品名が入ります</p><p class="cd05__price">¥0,000</p><p class="cd05__rate">★★★★☆ (00)</p></li>
      <li><div class="cd05__thumb"><div class="wf-img"></div><span class="cd05__fav">♡</span></div><p class="cd05__name">商品名が入ります</p><p class="cd05__price">¥0,000</p><p class="cd05__rate">★★★☆☆ (00)</p></li>
      <li><div class="cd05__thumb"><div class="wf-img"></div><span class="cd05__fav">♡</span></div><p class="cd05__name">商品名が入ります</p><p class="cd05__price">¥0,000</p><p class="cd05__rate">★★★★☆ (00)</p></li>
      <li><div class="cd05__thumb"><div class="wf-img"></div><span class="cd05__badge">NEW</span><span class="cd05__fav">♡</span></div><p class="cd05__name">商品名が入ります</p><p class="cd05__price">¥0,000</p><p class="cd05__rate">★★★★★ (00)</p></li>
      <li><div class="cd05__thumb"><div class="wf-img"></div><span class="cd05__fav">♡</span></div><p class="cd05__name">商品名が入ります</p><p class="cd05__price">¥0,000</p><p class="cd05__rate">★★★★☆ (00)</p></li>
      <li><div class="cd05__thumb"><div class="wf-img"></div><span class="cd05__fav">♡</span></div><p class="cd05__name">商品名が入ります</p><p class="cd05__price">¥0,000</p><p class="cd05__rate">★★★★☆ (00)</p></li>
    </ul>
  </div>
</section>`,
    css: `.cd05__bar { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
.cd05__sort { padding: 8px 14px; border: 2px solid #c4c4c4; border-radius: 6px; }
.cd05__grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 28px 20px; }
.cd05__grid li { display: flex; flex-direction: column; gap: 4px; }
.cd05__grid p { margin: 0; }
.cd05__thumb { position: relative; margin-bottom: 6px; }
.cd05__thumb .wf-img { aspect-ratio: 1; }
.cd05__badge { position: absolute; left: 8px; top: 8px; padding: 0 8px; border-radius: 4px; background: #444; color: #fff; font-weight: 700; }
.cd05__fav { position: absolute; right: 8px; top: 8px; display: grid; place-items: center; width: 36px; height: 36px; border: 2px solid #999; border-radius: 50%; background: #fff; color: #777; }
.cd05__price { font-weight: 700; }
.cd05__rate { color: #777; }
@container (max-width: 760px) {
  .cd05__grid { grid-template-columns: repeat(2, 1fr); gap: 24px 12px; }
}`,
  },
  {
    id: "cd06",
    cat: "cards",
    name: "お知らせの行リスト",
    use: "コーポレートサイトのお知らせ・プレスリリース",
    intent: "画像を使わず、日付・カテゴリ・タイトルを1行に並べて件数を多く見せる。更新の頻度と新しさが一目で分かり、サイトが動いている印象を与える。",
    parts: ["見出し＋一覧へのリンク", "お知らせ 5件（日付・カテゴリ・タイトル）", "行全体がリンク"],
    html: `<section class="wf-section cd06">
  <div class="wf-inner cd06__inner">
    <div class="cd06__head"><h2 class="wf-h2">お知らせ</h2><a class="wf-link" href="#">一覧を見る →</a></div>
    <ul class="wf-list cd06__list">
      <li><a href="#"><time>2026.00.00</time><span class="cd06__tag">お知らせ</span><span class="cd06__title">お知らせのタイトルが入ります</span></a></li>
      <li><a href="#"><time>2026.00.00</time><span class="cd06__tag">プレスリリース</span><span class="cd06__title">お知らせのタイトルが入ります。長い場合は折り返します</span></a></li>
      <li><a href="#"><time>2026.00.00</time><span class="cd06__tag">メディア掲載</span><span class="cd06__title">お知らせのタイトルが入ります</span></a></li>
      <li><a href="#"><time>2026.00.00</time><span class="cd06__tag">お知らせ</span><span class="cd06__title">お知らせのタイトルが入ります</span></a></li>
      <li><a href="#"><time>2026.00.00</time><span class="cd06__tag">イベント</span><span class="cd06__title">お知らせのタイトルが入ります</span></a></li>
    </ul>
  </div>
</section>`,
    css: `.cd06__inner { max-width: 900px; }
.cd06__head { display: flex; align-items: baseline; justify-content: space-between; gap: 16px; margin-bottom: 20px; }
.cd06__list { border-top: 1px solid #ccc; }
.cd06__list a { display: grid; grid-template-columns: 7em 9em 1fr; align-items: center; gap: 16px; padding: 18px 4px; border-bottom: 1px solid #ccc; color: #333; text-decoration: none; }
.cd06__list time { color: #777; }
.cd06__tag { justify-self: start; padding: 0 10px; border: 1px solid #aaa; border-radius: 4px; color: #666; }
@container (max-width: 640px) {
  .cd06__list a { grid-template-columns: auto 1fr; gap: 6px 12px; }
  .cd06__title { grid-column: 1 / -1; }
}`,
  },
];
