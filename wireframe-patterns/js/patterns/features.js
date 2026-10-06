// 特長・メリットのパターン
const HEAD = `<div class="wf-head">
      <span class="wf-label">FEATURES</span>
      <h2 class="wf-h2">選ばれる理由</h2>
    </div>`;

export default [
  {
    id: "fa01",
    cat: "features",
    name: "アイコン＋見出し＋説明の3カラム",
    use: "サービスサイト・LPの特長紹介の基本形",
    intent: "特長を3つに絞って横に並べ、一目で全体像をつかませる。アイコン・短い見出し・2行程度の説明の順にそろえ、流し読みでも違いが伝わるようにする。",
    parts: ["見出し", "特長カード 3枚（アイコン・見出し・説明）"],
    html: `<section class="wf-section fa01">
  <div class="wf-inner">
    ${HEAD}
    <ul class="wf-list fa01__grid">
      <li><span class="wf-icon"></span><h3 class="wf-h3">特長の見出し1</h3><p class="wf-text">特長の説明が入ります。2行程度で具体的に書きます。</p></li>
      <li><span class="wf-icon"></span><h3 class="wf-h3">特長の見出し2</h3><p class="wf-text">特長の説明が入ります。2行程度で具体的に書きます。</p></li>
      <li><span class="wf-icon"></span><h3 class="wf-h3">特長の見出し3</h3><p class="wf-text">特長の説明が入ります。2行程度で具体的に書きます。</p></li>
    </ul>
  </div>
</section>`,
    css: `.fa01__grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 32px; }
.fa01__grid li { display: flex; flex-direction: column; align-items: center; gap: 12px; text-align: center; }
@container (max-width: 640px) {
  .fa01__grid { grid-template-columns: 1fr; gap: 40px; }
}`,
  },
  {
    id: "fa02",
    cat: "features",
    name: "画像とテキストを左右交互に",
    use: "機能を1つずつ丁寧に見せたいプロダクト紹介",
    intent: "1つの特長に画像と説明をセットで割り当て、左右を入れ替えながら縦に並べる。交互にすることで単調にならず、スクロールしながら1つずつ理解が進む。",
    parts: ["見出し", "特長ブロック 3つ（番号・見出し・説明・画像）", "画像の位置を左右交互に"],
    html: `<section class="wf-section fa02">
  <div class="wf-inner">
    ${HEAD}
    <div class="fa02__rows">
      <div class="fa02__row">
        <div class="fa02__body"><span class="wf-label">01</span><h3 class="wf-h3">特長の見出し1</h3><p class="wf-text">特長の説明が入ります。どんな場面で役に立つのかを、画像と合わせて伝えます。</p></div>
        <div class="wf-img fa02__img"></div>
      </div>
      <div class="fa02__row">
        <div class="fa02__body"><span class="wf-label">02</span><h3 class="wf-h3">特長の見出し2</h3><p class="wf-text">特長の説明が入ります。どんな場面で役に立つのかを、画像と合わせて伝えます。</p></div>
        <div class="wf-img fa02__img"></div>
      </div>
      <div class="fa02__row">
        <div class="fa02__body"><span class="wf-label">03</span><h3 class="wf-h3">特長の見出し3</h3><p class="wf-text">特長の説明が入ります。どんな場面で役に立つのかを、画像と合わせて伝えます。</p></div>
        <div class="wf-img fa02__img"></div>
      </div>
    </div>
  </div>
</section>`,
    css: `.fa02__rows { display: grid; gap: clamp(40px, 7cqi, 72px); }
.fa02__row { display: grid; grid-template-columns: 1fr 1fr; align-items: center; gap: 48px; }
.fa02__row:nth-child(even) .fa02__img { order: -1; }
.fa02__body { display: flex; flex-direction: column; gap: 12px; }
.fa02__img { aspect-ratio: 4 / 3; }
@container (max-width: 640px) {
  .fa02__row { grid-template-columns: 1fr; gap: 20px; }
  .fa02__row .fa02__img { order: -1; }
}`,
  },
  {
    id: "fa03",
    cat: "features",
    name: "悩み → 解決の対比",
    use: "課題解決型のサービス・BtoB商材",
    intent: "読み手の悩みを先に並べて「自分のことだ」と思わせ、その下で1対1に解決策を示す。共感から入るので、特長を羅列するより自分ごととして読まれやすい。",
    parts: ["見出し", "左：よくある悩み 3つ", "右：それぞれの解決策 3つ", "間に矢印"],
    html: `<section class="wf-section fa03 wf-muted-bg">
  <div class="wf-inner">
    <div class="wf-head"><h2 class="wf-h2">こんなお悩みはありませんか？</h2></div>
    <div class="fa03__table">
      <ul class="wf-list wf-box fa03__col">
        <li class="fa03__ttl">よくあるお悩み</li>
        <li>悩み1が入ります</li><li>悩み2が入ります</li><li>悩み3が入ります</li>
      </ul>
      <span class="fa03__arrow" aria-hidden="true"><span class="fa03__pc">→</span><span class="fa03__sp">↓</span></span>
      <ul class="wf-list wf-box fa03__col fa03__col--ans">
        <li class="fa03__ttl">サービス名なら</li>
        <li>解決策1が入ります</li><li>解決策2が入ります</li><li>解決策3が入ります</li>
      </ul>
    </div>
  </div>
</section>`,
    css: `.fa03__table { display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; gap: 24px; }
.fa03__col { display: grid; gap: 0; padding: 8px 24px; }
.fa03__col li { padding: 14px 0; border-bottom: 1px solid #ddd; }
.fa03__col li:last-child { border-bottom: 0; }
.fa03__ttl { font-weight: 700; font-size: 18px; }
.fa03__col--ans { border-color: #444; border-width: 3px; }
.fa03__arrow { font-size: 32px; font-weight: 700; color: #777; }
.fa03__sp { display: none; }
@container (max-width: 640px) {
  .fa03__table { grid-template-columns: 1fr; gap: 12px; }
  .fa03__arrow { justify-self: center; }
  .fa03__pc { display: none; }
  .fa03__sp { display: inline; }
}`,
  },
  {
    id: "fa04",
    cat: "features",
    name: "大きな番号つきの縦リスト（POINT形式）",
    use: "スクール・士業・コンサルなど説明が長くなるサービス",
    intent: "特長ごとに大きな番号を振り、1つずつ区切って縦に読ませる。番号があると「全部で3つ」と全体量が分かり、説明が長くても最後まで読まれやすい。",
    parts: ["見出し", "特長 3つ（大きな番号・見出し・説明）", "区切り線"],
    html: `<section class="wf-section fa04">
  <div class="wf-inner fa04__inner">
    <div class="wf-head"><span class="wf-label">POINT</span><h2 class="wf-h2">〇〇が選ばれる3つの理由</h2></div>
    <ol class="wf-list fa04__list">
      <li><span class="fa04__no">01</span><div class="fa04__body"><h3 class="wf-h3">理由の見出し1</h3><p class="wf-text">理由の説明が入ります。根拠となる事実や数字を添えて、3〜4行程度で具体的に書きます。</p></div></li>
      <li><span class="fa04__no">02</span><div class="fa04__body"><h3 class="wf-h3">理由の見出し2</h3><p class="wf-text">理由の説明が入ります。根拠となる事実や数字を添えて、3〜4行程度で具体的に書きます。</p></div></li>
      <li><span class="fa04__no">03</span><div class="fa04__body"><h3 class="wf-h3">理由の見出し3</h3><p class="wf-text">理由の説明が入ります。根拠となる事実や数字を添えて、3〜4行程度で具体的に書きます。</p></div></li>
    </ol>
  </div>
</section>`,
    css: `.fa04__inner { max-width: 860px; }
.fa04__list li { display: grid; grid-template-columns: auto 1fr; gap: clamp(20px, 4cqi, 40px); padding: 32px 0; border-top: 1px solid #ccc; }
.fa04__list li:last-child { border-bottom: 1px solid #ccc; }
.fa04__no { font-size: clamp(40px, 7cqi, 64px); font-weight: 700; line-height: 1; color: #bbb; }
.fa04__body { display: flex; flex-direction: column; gap: 10px; }`,
  },
  {
    id: "fa05",
    cat: "features",
    name: "数字で見る（実績の数字グリッド）",
    use: "会社紹介・採用サイト・実績を数字で示せるサービス",
    intent: "言葉で説明するより、数字を大きく並べて規模や実績を一瞬で伝える。数字の下には「何の数字か」を短く添え、必要なら時点や出典を注記する。",
    parts: ["見出し", "数字のブロック 4つ（大きな数字・単位・ラベル）", "注記（〇年〇月時点など）"],
    html: `<section class="wf-section fa05 wf-muted-bg">
  <div class="wf-inner">
    <div class="wf-head"><span class="wf-label">NUMBERS</span><h2 class="wf-h2">数字で見る〇〇</h2></div>
    <ul class="wf-list fa05__grid">
      <li class="wf-box"><span class="wf-text">導入社数</span><strong>0,000<small>社</small></strong></li>
      <li class="wf-box"><span class="wf-text">継続率</span><strong>00.0<small>%</small></strong></li>
      <li class="wf-box"><span class="wf-text">対応エリア</span><strong>00<small>都道府県</small></strong></li>
      <li class="wf-box"><span class="wf-text">創業</span><strong>00<small>年</small></strong></li>
    </ul>
    <p class="wf-text fa05__note">※ 2026年00月時点</p>
  </div>
</section>`,
    css: `.fa05__grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
.fa05__grid li { display: flex; flex-direction: column; align-items: center; gap: 4px; padding: 28px 12px; text-align: center; }
.fa05__grid strong { font-size: clamp(32px, 5cqi, 48px); line-height: 1.2; }
.fa05__grid small { margin-left: 4px; font-size: 18px; }
.fa05__note { margin-top: 16px; text-align: right; }
@container (max-width: 760px) {
  .fa05__grid { grid-template-columns: 1fr 1fr; }
}`,
  },
  {
    id: "fa06",
    cat: "features",
    name: "メリット6つの小さなカード（2列×3段）",
    use: "機能が多いSaaS・ツール・会員特典",
    intent: "細かなメリットが多いときは、アイコンと短い文を小さなカードに収めて格子状に並べる。1つ1つを短くし、全体を「できることの一覧」として眺めてもらう。",
    parts: ["見出し", "カード 6枚（左にアイコン・右に見出しと一文）"],
    html: `<section class="wf-section fa06">
  <div class="wf-inner">
    <div class="wf-head"><h2 class="wf-h2">〇〇でできること</h2></div>
    <ul class="wf-list fa06__grid">
      <li class="wf-box"><span class="wf-icon"></span><div><h3 class="wf-h3">メリット1</h3><p class="wf-text">一文で説明が入ります。</p></div></li>
      <li class="wf-box"><span class="wf-icon"></span><div><h3 class="wf-h3">メリット2</h3><p class="wf-text">一文で説明が入ります。</p></div></li>
      <li class="wf-box"><span class="wf-icon"></span><div><h3 class="wf-h3">メリット3</h3><p class="wf-text">一文で説明が入ります。</p></div></li>
      <li class="wf-box"><span class="wf-icon"></span><div><h3 class="wf-h3">メリット4</h3><p class="wf-text">一文で説明が入ります。</p></div></li>
      <li class="wf-box"><span class="wf-icon"></span><div><h3 class="wf-h3">メリット5</h3><p class="wf-text">一文で説明が入ります。</p></div></li>
      <li class="wf-box"><span class="wf-icon"></span><div><h3 class="wf-h3">メリット6</h3><p class="wf-text">一文で説明が入ります。</p></div></li>
    </ul>
  </div>
</section>`,
    css: `.fa06__grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
.fa06__grid li { display: flex; align-items: flex-start; gap: 16px; padding: 20px; }
.fa06__grid li div { display: flex; flex-direction: column; gap: 4px; }
@container (max-width: 860px) {
  .fa06__grid { grid-template-columns: 1fr 1fr; }
}
@container (max-width: 560px) {
  .fa06__grid { grid-template-columns: 1fr; }
}`,
  },
];
