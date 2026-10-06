// ヘッダーのパターン
const BURGER = `<button class="wf-burger" type="button" aria-label="メニュー"><span></span><span></span><span></span></button>`;

export default [
  {
    id: "hd01",
    cat: "header",
    name: "ロゴ左・ナビ右・CTAボタン",
    use: "コーポレートサイト・サービスサイトの標準形",
    intent: "視線は左上から右へ流れるため、ロゴで「どこのサイトか」を伝えてから、ナビとCTAへ誘導する。CTAだけ塗りボタンにして、行動してほしい1つを目立たせる。",
    parts: ["ロゴ（左）", "グローバルナビ 4項目", "CTAボタン（右端）", "SPはナビを隠してハンバーガー"],
    html: `<header class="wf-section hd01">
  <div class="wf-inner wf-inner--slim hd01__inner">
    <a class="wf-logo" href="#"><span class="wf-mark"></span>サービス名</a>
    <nav class="hd01__nav">
      <a class="wf-link" href="#">特長</a>
      <a class="wf-link" href="#">料金</a>
      <a class="wf-link" href="#">導入事例</a>
      <a class="wf-link" href="#">よくある質問</a>
    </nav>
    <a class="wf-btn wf-btn--primary hd01__cta" href="#">無料で試す</a>
    ${BURGER}
  </div>
</header>`,
    css: `.hd01__inner { display: flex; align-items: center; gap: 32px; }
.hd01__nav { display: flex; gap: 28px; margin-left: auto; }
.hd01 .wf-burger { display: none; }
@container (max-width: 640px) {
  .hd01__nav, .hd01__cta { display: none; }
  .hd01 .wf-burger { display: inline-flex; margin-left: auto; }
}`,
  },
  {
    id: "hd02",
    cat: "header",
    name: "ロゴ中央・ナビ下段",
    use: "メディア・ブランドサイト・店舗サイト",
    intent: "ロゴを中央に大きく置いてブランドを主役にする。ナビは下段に分けて横一列に並べ、カテゴリ数が多くても窮屈にならない。",
    parts: ["検索アイコン（左）", "ロゴ（中央）", "ボタン（右）", "下段にカテゴリナビ 6項目"],
    html: `<header class="wf-section hd02">
  <div class="wf-inner wf-inner--slim hd02__top">
    <span class="hd02__icon" aria-label="検索"></span>
    <a class="wf-logo hd02__logo" href="#"><span class="wf-mark"></span>ブランド名</a>
    <a class="wf-btn hd02__btn" href="#">お問い合わせ</a>
  </div>
  <nav class="hd02__nav">
    <a class="wf-link" href="#">ニュース</a>
    <a class="wf-link" href="#">コラム</a>
    <a class="wf-link" href="#">インタビュー</a>
    <a class="wf-link" href="#">イベント</a>
    <a class="wf-link" href="#">ショップ</a>
    <a class="wf-link" href="#">私たちについて</a>
  </nav>
</header>`,
    css: `.hd02__top { display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; gap: 16px; }
.hd02__icon { width: 28px; height: 28px; border: 2px solid #555; border-radius: 50%; }
.hd02__logo { font-size: 24px; }
.hd02__btn { justify-self: end; }
.hd02__nav { display: flex; justify-content: center; flex-wrap: wrap; gap: 8px 32px; padding: 12px 20px; border-top: 1px solid #ddd; }
@container (max-width: 640px) {
  .hd02__btn { display: none; }
  .hd02__nav { justify-content: flex-start; flex-wrap: nowrap; overflow-x: auto; gap: 24px; }
  .hd02__nav a { flex: 0 0 auto; }
}`,
  },
  {
    id: "hd03",
    cat: "header",
    name: "上部に電話番号バー＋メインヘッダー",
    use: "店舗・クリニック・BtoBなど電話で問い合わせが来る業種",
    intent: "電話番号と受付時間を最上段の帯に常設し、どのページからでも連絡先が見える。メインのヘッダーは通常どおりナビとCTAを置き、役割を2段に分ける。",
    parts: ["上段の帯：受付時間・電話番号", "ロゴ", "ナビ 4項目", "予約ボタン", "SPは電話ボタンとハンバーガー"],
    html: `<header class="wf-section hd03">
  <div class="hd03__bar">
    <div class="hd03__bar-inner">
      <span>受付時間 9:00〜18:00（土日祝休み）</span>
      <span class="hd03__tel">TEL 00-0000-0000</span>
    </div>
  </div>
  <div class="wf-inner wf-inner--slim hd03__main">
    <a class="wf-logo" href="#"><span class="wf-mark"></span>店舗名</a>
    <nav class="hd03__nav">
      <a class="wf-link" href="#">診療案内</a>
      <a class="wf-link" href="#">医師紹介</a>
      <a class="wf-link" href="#">アクセス</a>
      <a class="wf-link" href="#">料金</a>
    </nav>
    <a class="wf-btn wf-btn--primary hd03__cta" href="#">WEB予約</a>
    <a class="wf-btn hd03__call" href="#">電話する</a>
    ${BURGER}
  </div>
</header>`,
    css: `.hd03__bar { background: #f0f0f0; border-bottom: 1px solid #ddd; }
.hd03__bar-inner { display: flex; justify-content: flex-end; gap: 24px; max-width: 1080px; margin: 0 auto; padding: 6px 20px; color: #666; }
.hd03__tel { font-weight: 700; color: #333; }
.hd03__main { display: flex; align-items: center; gap: 32px; }
.hd03__nav { display: flex; gap: 28px; margin-left: auto; }
.hd03__call, .hd03 .wf-burger { display: none; }
@container (max-width: 640px) {
  .hd03__bar-inner { justify-content: center; }
  .hd03__bar-inner span:first-child, .hd03__nav, .hd03__cta { display: none; }
  .hd03__main { gap: 8px; }
  .hd03__call { display: inline-flex; margin-left: auto; }
  .hd03 .wf-burger { display: inline-flex; }
}`,
  },
  {
    id: "hd04",
    cat: "header",
    name: "ナビ左寄せ＋ログイン・新規登録",
    use: "SaaS・会員制サービス",
    intent: "既存ユーザーの「ログイン」と新規の「登録」を右端に並べ、どちらの人も迷わず入口に着ける。主目的の登録だけ塗りボタンにして優先度を分ける。",
    parts: ["ロゴ", "ナビ 4項目（ロゴの右隣）", "ログイン（文字リンク）", "新規登録（塗りボタン）"],
    html: `<header class="wf-section hd04">
  <div class="wf-inner wf-inner--slim hd04__inner">
    <a class="wf-logo" href="#"><span class="wf-mark"></span>プロダクト名</a>
    <nav class="hd04__nav">
      <a class="wf-link" href="#">機能</a>
      <a class="wf-link" href="#">料金</a>
      <a class="wf-link" href="#">ブログ</a>
      <a class="wf-link" href="#">ヘルプ</a>
    </nav>
    <div class="hd04__auth">
      <a class="wf-link" href="#">ログイン</a>
      <a class="wf-btn wf-btn--primary" href="#">新規登録</a>
    </div>
    ${BURGER}
  </div>
</header>`,
    css: `.hd04__inner { display: flex; align-items: center; gap: 40px; }
.hd04__nav { display: flex; gap: 28px; }
.hd04__auth { display: flex; align-items: center; gap: 20px; margin-left: auto; }
.hd04 .wf-burger { display: none; }
@container (max-width: 640px) {
  .hd04__nav, .hd04__auth .wf-link { display: none; }
  .hd04__inner { gap: 8px; }
  .hd04 .wf-burger { display: inline-flex; }
}`,
  },
  {
    id: "hd05",
    cat: "header",
    name: "検索窓つき（EC向け）",
    use: "ECサイト・商品数の多い通販",
    intent: "探す目的で来た人のために、検索窓をヘッダーの中央に大きく置く。お気に入り・カートは右端のアイコンにまとめ、下段にカテゴリを並べて「探す」と「眺める」の両方に応える。",
    parts: ["ロゴ", "検索窓（中央・最大幅）", "アイコン：お気に入り・マイページ・カート", "下段にカテゴリナビ", "SPは検索窓を2段目に"],
    html: `<header class="wf-section hd05">
  <div class="wf-inner wf-inner--slim hd05__top">
    <a class="wf-logo" href="#"><span class="wf-mark"></span>ショップ名</a>
    <form class="hd05__search"><span class="hd05__input">キーワードで探す</span><span class="wf-btn wf-btn--primary">検索</span></form>
    <ul class="wf-list hd05__icons">
      <li><span class="hd05__icon"></span><span class="hd05__txt">お気に入り</span></li>
      <li><span class="hd05__icon"></span><span class="hd05__txt">マイページ</span></li>
      <li><span class="hd05__icon"></span><span class="hd05__txt">カート</span></li>
    </ul>
  </div>
  <nav class="hd05__cats">
    <a class="wf-link" href="#">新着</a>
    <a class="wf-link" href="#">カテゴリA</a>
    <a class="wf-link" href="#">カテゴリB</a>
    <a class="wf-link" href="#">カテゴリC</a>
    <a class="wf-link" href="#">セール</a>
    <a class="wf-link" href="#">ランキング</a>
  </nav>
</header>`,
    css: `.hd05__top { display: grid; grid-template-columns: auto 1fr auto; align-items: center; gap: 24px; }
.hd05__search { display: flex; gap: 8px; margin: 0; }
.hd05__input { flex: 1; display: flex; align-items: center; min-height: 48px; padding: 0 16px; border: 2px solid #c4c4c4; border-radius: 6px; color: #999; }
.hd05__icons { display: flex; gap: 16px; }
.hd05__icons li { display: flex; flex-direction: column; align-items: center; gap: 2px; color: #666; }
.hd05__icon { width: 28px; height: 28px; border: 2px solid #555; border-radius: 6px; }
.hd05__cats { display: flex; gap: 8px 28px; flex-wrap: wrap; padding: 12px 20px; border-top: 1px solid #ddd; justify-content: center; }
@container (max-width: 760px) {
  .hd05__top { grid-template-columns: 1fr auto; }
  .hd05__search { grid-column: 1 / -1; order: 3; }
  .hd05__txt { display: none; }
  .hd05__cats { flex-wrap: nowrap; overflow-x: auto; justify-content: flex-start; }
  .hd05__cats a { flex: 0 0 auto; }
}`,
  },
  {
    id: "hd06",
    cat: "header",
    name: "メガメニューを開いた状態",
    use: "製品・サービスの数が多い企業サイト",
    intent: "ナビの1項目にカーソルを乗せると、下に大きなパネルを開いて下層ページを分類ごとに一覧させる。階層を潜らずに目的のページへ直接飛べる。パネル右には注目コンテンツを置く。",
    parts: ["通常のヘッダー（ロゴ・ナビ・CTA）", "開いたパネル：分類見出し＋リンク 3列", "パネル右：注目の画像とリンク"],
    html: `<header class="wf-section hd06">
  <div class="wf-inner wf-inner--slim hd06__bar">
    <a class="wf-logo" href="#"><span class="wf-mark"></span>会社名</a>
    <nav class="hd06__nav">
      <a class="wf-link hd06__open" href="#">製品・サービス ▾</a>
      <a class="wf-link" href="#">導入事例</a>
      <a class="wf-link" href="#">企業情報</a>
      <a class="wf-link" href="#">採用</a>
    </nav>
    <a class="wf-btn wf-btn--primary" href="#">お問い合わせ</a>
  </div>
  <div class="hd06__panel">
    <div class="hd06__panel-inner">
      <div class="hd06__col"><p class="hd06__ttl">分類A</p><a class="wf-link" href="#">製品名1</a><a class="wf-link" href="#">製品名2</a><a class="wf-link" href="#">製品名3</a></div>
      <div class="hd06__col"><p class="hd06__ttl">分類B</p><a class="wf-link" href="#">製品名4</a><a class="wf-link" href="#">製品名5</a><a class="wf-link" href="#">製品名6</a></div>
      <div class="hd06__col"><p class="hd06__ttl">分類C</p><a class="wf-link" href="#">製品名7</a><a class="wf-link" href="#">製品名8</a></div>
      <div class="hd06__pick"><div class="wf-img hd06__img"></div><a class="wf-link" href="#">注目のお知らせ →</a></div>
    </div>
  </div>
</header>`,
    css: `.hd06__bar { display: flex; align-items: center; gap: 32px; }
.hd06__nav { display: flex; gap: 28px; margin-left: auto; }
.hd06__open { font-weight: 700; color: #333; text-decoration: underline; text-underline-offset: 8px; }
.hd06__panel { border-top: 1px solid #ddd; background: #f6f6f6; }
.hd06__panel-inner { display: grid; grid-template-columns: repeat(3, 1fr) 1.4fr; gap: 32px; max-width: 1080px; margin: 0 auto; padding: 28px 20px; }
.hd06__col { display: flex; flex-direction: column; gap: 10px; }
.hd06__ttl { margin: 0 0 4px; font-weight: 700; }
.hd06__pick { display: flex; flex-direction: column; gap: 10px; }
.hd06__img { aspect-ratio: 16 / 9; }
@container (max-width: 760px) {
  .hd06__nav { display: none; }
  .hd06__bar .wf-btn { margin-left: auto; }
  .hd06__panel-inner { grid-template-columns: 1fr 1fr; }
  .hd06__pick { grid-column: 1 / -1; }
}`,
  },
];
