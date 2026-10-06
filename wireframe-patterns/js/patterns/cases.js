// 導入事例・お客様の声のパターン
const VOICE = (n) => `<li class="wf-box cs01__card">
        <p class="cs01__quote">「お客様の声が入ります。導入して何が変わったのかを、具体的な言葉で書きます。」</p>
        <div class="cs01__who"><span class="wf-avatar"></span><p class="wf-text">会社名・役職<br>氏名${n}</p></div>
      </li>`;

export default [
  {
    id: "cs01",
    cat: "cases",
    name: "お客様の声カード 3枚",
    use: "サービスサイト・スクール・店舗",
    intent: "第三者の言葉で良さを語ってもらい、自社の説明だけでは生まれない信頼を足す。顔写真と所属を添えると「実在する人の声」として受け取られやすい。",
    parts: ["見出し", "声のカード 3枚（コメント・顔写真・所属・氏名）"],
    html: `<section class="wf-section cs01">
  <div class="wf-inner">
    <div class="wf-head"><span class="wf-label">VOICE</span><h2 class="wf-h2">お客様の声</h2></div>
    <ul class="wf-list cs01__grid">
      ${VOICE(1)}
      ${VOICE(2)}
      ${VOICE(3)}
    </ul>
  </div>
</section>`,
    css: `.cs01__grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
.cs01__card { display: flex; flex-direction: column; justify-content: space-between; gap: 24px; padding: 28px 24px; }
.cs01__quote { margin: 0; }
.cs01__who { display: flex; align-items: center; gap: 12px; }
@container (max-width: 760px) {
  .cs01__grid { grid-template-columns: 1fr; }
}`,
  },
  {
    id: "cs02",
    cat: "cases",
    name: "導入事例（成果の数字つき）",
    use: "BtoBサービス・コンサル・広告運用",
    intent: "事例ごとに「導入前の課題」と「成果の数字」をセットで見せ、検討者が自社に当てはめて効果を想像できるようにする。数字はカードの中で一番大きく扱う。",
    parts: ["見出し", "事例カード 2枚（画像・業種・社名・成果の数字・課題の一文）", "事例一覧へのリンク"],
    html: `<section class="wf-section cs02">
  <div class="wf-inner">
    <div class="wf-head"><span class="wf-label">CASE STUDY</span><h2 class="wf-h2">導入事例</h2></div>
    <ul class="wf-list cs02__grid">
      <li class="wf-box cs02__card">
        <div class="wf-img cs02__img"></div>
        <div class="cs02__body">
          <span class="wf-label">業種</span>
          <p class="wf-h3">株式会社〇〇 様</p>
          <p class="cs02__num"><strong>00%</strong>削減</p>
          <p class="wf-text">導入前の課題と、どう解決したかの要約が入ります。</p>
        </div>
      </li>
      <li class="wf-box cs02__card">
        <div class="wf-img cs02__img"></div>
        <div class="cs02__body">
          <span class="wf-label">業種</span>
          <p class="wf-h3">株式会社〇〇 様</p>
          <p class="cs02__num"><strong>0倍</strong>に増加</p>
          <p class="wf-text">導入前の課題と、どう解決したかの要約が入ります。</p>
        </div>
      </li>
    </ul>
    <p class="cs02__more"><a class="wf-btn" href="#">事例をもっと見る</a></p>
  </div>
</section>`,
    css: `.cs02__grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
.cs02__card { overflow: hidden; }
.cs02__img { aspect-ratio: 16 / 9; border: 0; border-bottom: 2px solid #b5b5b5; border-radius: 0; }
.cs02__body { display: flex; flex-direction: column; gap: 8px; padding: 24px; }
.cs02__num { margin: 4px 0; font-weight: 700; }
.cs02__num strong { font-size: 40px; line-height: 1.2; margin-right: 4px; }
.cs02__more { margin: 32px 0 0; text-align: center; }
@container (max-width: 640px) {
  .cs02__grid { grid-template-columns: 1fr; }
}`,
  },
  {
    id: "cs03",
    cat: "cases",
    name: "導入企業のロゴ一覧",
    use: "BtoBサービス・実績の社名を出せる企業",
    intent: "知っている会社が使っている、という事実だけで信頼が生まれる。ロゴを同じ大きさの枠に並べて数で見せ、詳しく知りたい人だけ事例ページへ進ませる。",
    parts: ["見出し（導入社数を含める）", "ロゴ 12枠（4列×3段）", "事例一覧へのリンク"],
    html: `<section class="wf-section cs03">
  <div class="wf-inner">
    <div class="wf-head"><h2 class="wf-h2">0,000社以上が導入しています</h2></div>
    <ul class="wf-list cs03__grid">
      <li>LOGO</li><li>LOGO</li><li>LOGO</li><li>LOGO</li>
      <li>LOGO</li><li>LOGO</li><li>LOGO</li><li>LOGO</li>
      <li>LOGO</li><li>LOGO</li><li>LOGO</li><li>LOGO</li>
    </ul>
    <p class="cs03__more"><a class="wf-link" href="#">導入事例を見る →</a></p>
  </div>
</section>`,
    css: `.cs03__grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
.cs03__grid li { display: grid; place-items: center; height: 88px; border: 1px solid #ddd; border-radius: 8px; background: #f6f6f6; color: #aaa; font-weight: 700; letter-spacing: 0.1em; }
.cs03__more { margin: 24px 0 0; text-align: center; }
@container (max-width: 640px) {
  .cs03__grid { grid-template-columns: repeat(2, 1fr); }
  .cs03__grid li { height: 72px; }
}`,
  },
  {
    id: "cs04",
    cat: "cases",
    name: "インタビュー記事への導線（大きな写真＋引用）",
    use: "導入事例・社員インタビュー・卒業生の声",
    intent: "1つの事例を大きな写真と印象的な一言で見せ、詳しい話は記事ページで読ませる。一言は記事の中で一番刺さる発言を抜き出して使う。",
    parts: ["左：大きな写真", "右：引用（一番刺さる一言）・会社名と氏名・記事へのボタン", "下：他の事例への小さなリンク 3つ"],
    html: `<section class="wf-section cs04">
  <div class="wf-inner">
    <div class="wf-head"><span class="wf-label">INTERVIEW</span><h2 class="wf-h2">お客様インタビュー</h2></div>
    <div class="cs04__main">
      <div class="wf-img cs04__img"></div>
      <div class="cs04__body">
        <p class="cs04__quote">「記事の中で一番印象に残る発言を、ここに大きく引用します。」</p>
        <p class="wf-text">株式会社〇〇 部署名<br>氏名 様</p>
        <a class="wf-btn" href="#">インタビューを読む</a>
      </div>
    </div>
    <ul class="wf-list cs04__others">
      <li><div class="wf-img"></div><span>株式会社〇〇 様</span></li>
      <li><div class="wf-img"></div><span>株式会社〇〇 様</span></li>
      <li><div class="wf-img"></div><span>株式会社〇〇 様</span></li>
    </ul>
  </div>
</section>`,
    css: `.cs04__main { display: grid; grid-template-columns: 1.1fr 1fr; align-items: center; gap: 48px; }
.cs04__img { aspect-ratio: 4 / 3; }
.cs04__body { display: flex; flex-direction: column; align-items: flex-start; gap: 20px; }
.cs04__quote { margin: 0; font-size: clamp(20px, 2.6cqi, 26px); font-weight: 700; line-height: 1.6; }
.cs04__others { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-top: 40px; padding-top: 32px; border-top: 1px solid #ddd; }
.cs04__others li { display: flex; align-items: center; gap: 12px; }
.cs04__others .wf-img { width: 96px; flex: 0 0 auto; aspect-ratio: 4 / 3; }
@container (max-width: 760px) {
  .cs04__main { grid-template-columns: 1fr; gap: 24px; }
  .cs04__others { grid-template-columns: 1fr; gap: 12px; }
}`,
  },
  {
    id: "cs05",
    cat: "cases",
    name: "星評価とレビュー",
    use: "EC・アプリ・スクール・飲食店",
    intent: "平均の星と件数で全体の評判を先に示し、その下に個別のレビューを並べる。良い声だけでなく具体的な体験談があると、評価そのものの信頼性が上がる。",
    parts: ["左：平均評価（数字・星）・レビュー件数・星ごとの割合バー", "右：レビューカード 3枚（星・タイトル・本文・投稿者）"],
    html: `<section class="wf-section cs05">
  <div class="wf-inner">
    <div class="wf-head"><h2 class="wf-h2">レビュー</h2></div>
    <div class="cs05__grid">
      <div class="wf-box cs05__sum">
        <p class="cs05__avg">4.6</p>
        <p class="cs05__stars">★★★★★</p>
        <p class="wf-text">000件のレビュー</p>
        <ul class="wf-list cs05__bars">
          <li><span>5</span><span class="cs05__bar"><span style="width: 72%"></span></span></li>
          <li><span>4</span><span class="cs05__bar"><span style="width: 18%"></span></span></li>
          <li><span>3</span><span class="cs05__bar"><span style="width: 6%"></span></span></li>
          <li><span>2</span><span class="cs05__bar"><span style="width: 3%"></span></span></li>
          <li><span>1</span><span class="cs05__bar"><span style="width: 1%"></span></span></li>
        </ul>
      </div>
      <ul class="wf-list cs05__list">
        <li class="cs05__item"><p class="cs05__stars">★★★★★</p><p class="wf-h3">レビューのタイトル</p><p class="wf-text">具体的な体験談が入ります。使った場面と良かった点を書いてもらいます。</p><p class="cs05__who">30代・女性</p></li>
        <li class="cs05__item"><p class="cs05__stars">★★★★☆</p><p class="wf-h3">レビューのタイトル</p><p class="wf-text">具体的な体験談が入ります。使った場面と良かった点を書いてもらいます。</p><p class="cs05__who">40代・男性</p></li>
        <li class="cs05__item"><p class="cs05__stars">★★★★★</p><p class="wf-h3">レビューのタイトル</p><p class="wf-text">具体的な体験談が入ります。使った場面と良かった点を書いてもらいます。</p><p class="cs05__who">20代・女性</p></li>
      </ul>
    </div>
  </div>
</section>`,
    css: `.cs05__grid { display: grid; grid-template-columns: 300px 1fr; gap: 32px; align-items: start; }
.cs05__sum { display: flex; flex-direction: column; align-items: center; gap: 4px; padding: 28px 24px; }
.cs05__avg { margin: 0; font-size: 56px; font-weight: 700; line-height: 1.1; }
.cs05__stars { margin: 0; color: #555; letter-spacing: 0.1em; }
.cs05__bars { display: grid; gap: 6px; width: 100%; margin-top: 12px; }
.cs05__bars li { display: grid; grid-template-columns: 1em 1fr; align-items: center; gap: 10px; color: #777; }
.cs05__bar { display: block; height: 10px; border-radius: 999px; background: #e6e6e6; overflow: hidden; }
.cs05__bar span { display: block; height: 100%; background: #555; }
.cs05__list { display: grid; gap: 0; }
.cs05__item { display: flex; flex-direction: column; gap: 6px; padding: 20px 0; border-bottom: 1px solid #ddd; }
.cs05__item:first-child { padding-top: 0; }
.cs05__item p { margin: 0; }
.cs05__who { color: #888; }
@container (max-width: 760px) {
  .cs05__grid { grid-template-columns: 1fr; }
}`,
  },
];
