// CTA（行動を促す帯）のパターン
export default [
  {
    id: "ct01",
    cat: "cta",
    name: "中央寄せの帯＋ボタン1つ",
    use: "セクションの区切りごと・ページの途中",
    intent: "本文の途中に短い帯を挟み、読み進める中で気持ちが動いた瞬間に行動できるようにする。ボタンは1つだけにして迷わせない。",
    parts: ["見出し", "一文", "ボタン 1つ", "ボタン下に補足（無料・1分など）"],
    html: `<section class="wf-section ct01 wf-muted-bg">
  <div class="wf-inner ct01__inner">
    <h2 class="wf-h2">行動を促す見出しが入ります</h2>
    <p class="wf-text">申し込むと何が得られるのかを一文で伝えます。</p>
    <a class="wf-btn wf-btn--primary ct01__btn" href="#">無料で試してみる</a>
    <p class="wf-text ct01__note">登録1分・クレジットカード不要</p>
  </div>
</section>`,
    css: `.ct01__inner { display: flex; flex-direction: column; align-items: center; gap: 16px; text-align: center; }
.ct01__btn { min-width: 280px; min-height: 56px; margin-top: 8px; }
@container (max-width: 640px) {
  .ct01__btn { width: 100%; min-width: 0; }
}`,
  },
  {
    id: "ct02",
    cat: "cta",
    name: "2択（すぐ申し込む／まず相談する）",
    use: "検討度合いの違う人が混在するBtoB・高額商材",
    intent: "すぐ決めたい人と、まだ迷っている人で入口を分ける。カードを2つ並べて「誰向けか」を書き、迷っている人も取りこぼさない。",
    parts: ["見出し", "左カード：今すぐ申し込む人向け（塗りボタン）", "右カード：相談したい人向け（線ボタン）"],
    html: `<section class="wf-section ct02">
  <div class="wf-inner">
    <div class="wf-head"><h2 class="wf-h2">まずはお気軽にどうぞ</h2></div>
    <div class="ct02__grid">
      <div class="wf-box ct02__card ct02__card--main">
        <span class="wf-label">すぐに始めたい方</span>
        <p class="wf-h3">無料トライアル</p>
        <p class="wf-text">すぐに使い始めたい方向けの説明が入ります。</p>
        <a class="wf-btn wf-btn--primary" href="#">無料で始める</a>
      </div>
      <div class="wf-box ct02__card">
        <span class="wf-label">まずは話を聞きたい方</span>
        <p class="wf-h3">オンライン相談</p>
        <p class="wf-text">導入を検討中の方向けの説明が入ります。</p>
        <a class="wf-btn" href="#">相談を予約する</a>
      </div>
    </div>
  </div>
</section>`,
    css: `.ct02__grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; max-width: 880px; margin: 0 auto; }
.ct02__card { display: flex; flex-direction: column; align-items: flex-start; gap: 12px; padding: 32px 28px; }
.ct02__card .wf-btn { align-self: stretch; margin-top: 8px; }
.ct02__card--main { border-color: #444; border-width: 3px; }
@container (max-width: 640px) {
  .ct02__grid { grid-template-columns: 1fr; }
  .ct02__card { padding: 24px 20px; }
}`,
  },
  {
    id: "ct03",
    cat: "cta",
    name: "画像つき・左右分割の帯",
    use: "資料ダウンロード・ホワイトペーパー・メルマガ登録",
    intent: "渡すもの（資料・特典）の画像を見せ、手に入るものを具体的にイメージさせる。左に画像、右に中身の要点とボタンを置く。",
    parts: ["左：資料・特典の画像", "右：見出し・中身の要点 3つ・ボタン"],
    html: `<section class="wf-section ct03">
  <div class="wf-inner">
    <div class="wf-box wf-muted-bg ct03__box">
      <div class="wf-img ct03__img"></div>
      <div class="ct03__body">
        <span class="wf-label">無料ダウンロード</span>
        <h2 class="wf-h2">資料のタイトルが入ります</h2>
        <ul class="wf-list ct03__points">
          <li><span class="wf-check"></span>資料でわかること1</li>
          <li><span class="wf-check"></span>資料でわかること2</li>
          <li><span class="wf-check"></span>資料でわかること3</li>
        </ul>
        <a class="wf-btn wf-btn--primary" href="#">資料をダウンロード</a>
      </div>
    </div>
  </div>
</section>`,
    css: `.ct03__box { display: grid; grid-template-columns: 0.8fr 1.2fr; align-items: center; gap: 40px; padding: clamp(24px, 5cqi, 48px); }
.ct03__img { aspect-ratio: 3 / 4; max-width: 280px; justify-self: center; }
.ct03__body { display: flex; flex-direction: column; align-items: flex-start; gap: 16px; }
.ct03__points { display: grid; gap: 10px; }
.ct03__points li { position: relative; padding-left: 30px; }
@container (max-width: 640px) {
  .ct03__box { grid-template-columns: 1fr; gap: 24px; }
  .ct03__img { max-width: 180px; }
  .ct03__body .wf-btn { width: 100%; }
}`,
  },
  {
    id: "ct04",
    cat: "cta",
    name: "画面下に固定するCTAバー",
    use: "スマホ中心のLP・予約や電話が主目的の店舗",
    intent: "スクロールしても常に画面下にボタンを出しておき、行動したくなった瞬間に指が届くようにする。ボタンは2つまで、高さは画面を圧迫しない程度に抑える。",
    parts: ["バー：左に一言・右にボタン 2つ（電話・予約など）", "画面下に固定（position: sticky / fixed）", "SPはボタンだけを横幅いっぱいに"],
    html: `<div class="wf-section ct04">
  <div class="ct04__bar">
    <p class="ct04__text">初回限定のご案内などの一言</p>
    <div class="ct04__btns">
      <a class="wf-btn" href="#">電話する</a>
      <a class="wf-btn wf-btn--primary" href="#">WEBで予約</a>
    </div>
  </div>
</div>`,
    css: `/* 実装時は position: fixed; left: 0; right: 0; bottom: 0; でページ下に固定する */
.ct04 { position: sticky; bottom: 0; z-index: 10; background: transparent; }
.ct04__bar { display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 12px 24px; border-top: 2px solid #444; background: #fff; }
.ct04__text { margin: 0; font-weight: 700; }
.ct04__btns { display: flex; gap: 8px; }
@container (max-width: 640px) {
  .ct04__bar { padding: 10px 12px; }
  .ct04__text { display: none; }
  .ct04__btns { flex: 1; }
  .ct04__btns .wf-btn { flex: 1; padding-inline: 8px; }
}`,
  },
  {
    id: "ct05",
    cat: "cta",
    name: "メールアドレスだけの登録フォーム",
    use: "SaaSの無料登録・ウェイティングリスト・メルマガ",
    intent: "入力欄を1つに絞り、帯の中で登録を完結させる。項目が少ないほど離脱は減るので、名前などは登録後に聞けば足りる。",
    parts: ["見出し", "一文", "メールアドレス入力＋登録ボタン（横並び）", "注記（スパムなし・いつでも解除）"],
    html: `<section class="wf-section ct05 wf-muted-bg">
  <div class="wf-inner ct05__inner">
    <h2 class="wf-h2">メールアドレスだけで、今すぐ始められます</h2>
    <p class="wf-text">登録すると何が起きるのかを一文で伝えます。</p>
    <form class="ct05__form"><span class="ct05__input">メールアドレス</span><span class="wf-btn wf-btn--primary">無料で登録</span></form>
    <p class="wf-text">登録は無料・いつでも解約できます</p>
  </div>
</section>`,
    css: `.ct05__inner { display: flex; flex-direction: column; align-items: center; gap: 14px; text-align: center; }
.ct05__form { display: flex; gap: 8px; width: 100%; max-width: 560px; margin: 8px 0 0; }
.ct05__input { flex: 1; display: flex; align-items: center; min-height: 52px; padding: 0 16px; border: 2px solid #c4c4c4; border-radius: 6px; background: #fff; color: #999; text-align: left; }
@container (max-width: 640px) {
  .ct05__form { flex-direction: column; }
}`,
  },
];
