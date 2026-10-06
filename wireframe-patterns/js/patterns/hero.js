// ファーストビューのパターン
export default [
  {
    id: "fv01",
    cat: "hero",
    name: "中央寄せの見出し＋2つのボタン",
    use: "サービス紹介LP・アプリのトップ",
    intent: "画像に頼らず、見出しと一文で価値を言い切る。ボタンは主（申し込み）と副（資料・詳細）の2つに絞り、決めきれない人の逃げ道も用意する。",
    parts: ["小見出し（ラベル）", "大見出し", "説明文 1〜2行", "主ボタン＋副ボタン", "下に画面イメージ"],
    html: `<section class="wf-section fv01">
  <div class="wf-inner fv01__inner">
    <span class="wf-label">ラベルテキスト</span>
    <h1 class="wf-h1">サービスの価値をひとことで<br>伝える見出し</h1>
    <p class="wf-text fv01__lead">誰の、どんな悩みを、どう解決するのかを1〜2行で説明する文章が入ります。</p>
    <div class="fv01__btns">
      <a class="wf-btn wf-btn--primary" href="#">無料ではじめる</a>
      <a class="wf-btn" href="#">資料をダウンロード</a>
    </div>
    <div class="wf-img fv01__img"></div>
  </div>
</section>`,
    css: `.fv01__inner { display: flex; flex-direction: column; align-items: center; gap: 20px; text-align: center; }
.fv01__lead { max-width: 640px; }
.fv01__btns { display: flex; flex-wrap: wrap; justify-content: center; gap: 12px; margin-top: 8px; }
.fv01__img { max-width: 880px; aspect-ratio: 16 / 9; margin-top: 24px; }
@container (max-width: 640px) {
  .fv01__btns { flex-direction: column; width: 100%; }
}`,
  },
  {
    id: "fv02",
    cat: "hero",
    name: "左にテキスト・右に画像",
    use: "サービスサイト・プロダクト紹介の定番",
    intent: "左から読むテキストと右の画像で「何ができるか」と「どう見えるか」を同時に伝える。SPでは画像を下に回し、見出しを最初に読ませる。",
    parts: ["見出し", "説明文", "CTAボタン", "補足の一文（無料・カード不要など）", "画像（右）"],
    html: `<section class="wf-section fv02">
  <div class="wf-inner fv02__inner">
    <div class="fv02__body">
      <h1 class="wf-h1">見出しが入ります。<br>2行程度に収める</h1>
      <p class="wf-text">サービスの説明文が入ります。誰に向けた、どんな価値のものなのかを具体的に書きます。</p>
      <a class="wf-btn wf-btn--primary" href="#">今すぐ申し込む</a>
      <p class="wf-text fv02__note">※ 補足のテキスト（無料・登録1分など）</p>
    </div>
    <div class="wf-img fv02__img"></div>
  </div>
</section>`,
    css: `.fv02__inner { display: grid; grid-template-columns: 1fr 1fr; align-items: center; gap: 48px; }
.fv02__body { display: flex; flex-direction: column; align-items: flex-start; gap: 20px; }
.fv02__img { aspect-ratio: 4 / 3; }
@container (max-width: 640px) {
  .fv02__inner { grid-template-columns: 1fr; gap: 32px; }
  .fv02__body .wf-btn { width: 100%; }
}`,
  },
  {
    id: "fv03",
    cat: "hero",
    name: "全面背景画像＋重ねたテキスト",
    use: "ブランドサイト・採用サイト・旅館や飲食店",
    intent: "写真の世界観で第一印象を作る。文字は画像の上に重ねるため、暗めの帯（オーバーレイ）を敷いて読みやすさを確保する。",
    parts: ["背景画像（全面）", "暗めのオーバーレイ", "キャッチコピー（左下）", "サブコピー", "ボタン 1つ"],
    html: `<section class="wf-section fv03">
  <div class="wf-img fv03__bg"></div>
  <div class="wf-inner fv03__inner">
    <h1 class="wf-h1">世界観を伝える<br>キャッチコピー</h1>
    <p class="fv03__sub">サブコピーが入ります。短く、余韻を残す一文。</p>
    <a class="wf-btn" href="#">詳しく見る</a>
  </div>
</section>`,
    css: `.fv03 { position: relative; overflow: hidden; }
/* 文字を読ませるため、背景画像の枠は暗いグレーにしておく（実装時は画像＋暗いオーバーレイ） */
.fv03__bg { position: absolute; inset: 0; height: 100%; border: 0; border-radius: 0; background-color: #8a8a8a; }
.fv03__inner { position: relative; display: flex; flex-direction: column; align-items: flex-start; gap: 20px; min-height: 520px; justify-content: flex-end; }
.fv03 .wf-h1, .fv03__sub { color: #fff; margin: 0; }
@container (max-width: 640px) {
  .fv03__inner { min-height: 440px; }
}`,
  },
  {
    id: "fv04",
    cat: "hero",
    name: "左に訴求・右に入力フォーム",
    use: "資料請求・無料相談などのリード獲得LP",
    intent: "スクロールせずにフォームまで見せて、申し込みの手間を1画面に収める。左の訴求で「申し込む理由」を、右のフォームで「すぐできる」を同時に伝える。",
    parts: ["見出し", "メリット 3点（箇条書き）", "フォーム：名前・メール・会社名", "送信ボタン", "個人情報の注記"],
    html: `<section class="wf-section fv04 wf-muted-bg">
  <div class="wf-inner fv04__inner">
    <div class="fv04__body">
      <h1 class="wf-h1">資料請求で得られることを伝える見出し</h1>
      <ul class="wf-list fv04__points">
        <li><span class="wf-check wf-check--round"></span>メリット1が入ります</li>
        <li><span class="wf-check wf-check--round"></span>メリット2が入ります</li>
        <li><span class="wf-check wf-check--round"></span>メリット3が入ります</li>
      </ul>
    </div>
    <form class="wf-box fv04__form">
      <p class="wf-h3">無料で資料をもらう</p>
      <label class="fv04__field"><span>お名前</span><span class="fv04__input"></span></label>
      <label class="fv04__field"><span>メールアドレス</span><span class="fv04__input"></span></label>
      <label class="fv04__field"><span>会社名</span><span class="fv04__input"></span></label>
      <span class="wf-btn wf-btn--primary">送信する</span>
      <p class="wf-text">個人情報の取り扱いについての注記</p>
    </form>
  </div>
</section>`,
    css: `.fv04__inner { display: grid; grid-template-columns: 1.1fr 0.9fr; align-items: center; gap: 48px; }
.fv04__body { display: flex; flex-direction: column; gap: 24px; }
.fv04__points { display: grid; gap: 12px; }
.fv04__points li { padding-left: 32px; position: relative; }
.fv04__form { display: flex; flex-direction: column; gap: 16px; padding: 28px; margin: 0; }
.fv04__field { display: grid; gap: 6px; }
.fv04__input { display: block; height: 48px; border: 2px solid #c4c4c4; border-radius: 6px; background: #fff; }
@container (max-width: 640px) {
  .fv04__inner { grid-template-columns: 1fr; gap: 32px; }
  .fv04__form { padding: 20px; }
}`,
  },
  {
    id: "fv05",
    cat: "hero",
    name: "見出し＋実績の数字＋導入企業ロゴ",
    use: "BtoBサービス・実績で選ばれる商材",
    intent: "「どれだけ使われているか」を数字とロゴで最初に見せ、初見の不安を先回りして消す。数字は3つまでに絞り、一番強いものを左に置く。",
    parts: ["見出し", "説明文", "CTAボタン", "実績の数字 3つ", "導入企業ロゴ 6社"],
    html: `<section class="wf-section fv05">
  <div class="wf-inner fv05__inner">
    <h1 class="wf-h1">実績で選ばれていることを<br>伝える見出し</h1>
    <p class="wf-text">サービスの説明文が入ります。</p>
    <a class="wf-btn wf-btn--primary" href="#">導入の相談をする</a>
    <ul class="wf-list fv05__stats">
      <li><strong>0,000社</strong><span>導入企業数</span></li>
      <li><strong>00%</strong><span>継続率</span></li>
      <li><strong>No.1</strong><span>満足度</span></li>
    </ul>
    <ul class="wf-list fv05__logos">
      <li></li><li></li><li></li><li></li><li></li><li></li>
    </ul>
  </div>
</section>`,
    css: `.fv05__inner { display: flex; flex-direction: column; align-items: center; gap: 20px; text-align: center; }
.fv05__stats { display: grid; grid-template-columns: repeat(3, 1fr); width: 100%; max-width: 720px; margin-top: 24px; border-block: 1px solid #ddd; }
.fv05__stats li { display: grid; gap: 4px; padding: 20px 8px; }
.fv05__stats li + li { border-left: 1px solid #ddd; }
.fv05__stats strong { font-size: clamp(24px, 3.6cqi, 36px); line-height: 1.2; }
.fv05__stats span { color: #777; }
.fv05__logos { display: grid; grid-template-columns: repeat(6, 1fr); gap: 16px; width: 100%; margin-top: 8px; }
.fv05__logos li { height: 40px; border-radius: 6px; background: #e6e6e6; }
@container (max-width: 640px) {
  .fv05__stats { grid-template-columns: 1fr; }
  .fv05__stats li + li { border-left: 0; border-top: 1px solid #ddd; }
  .fv05__logos { grid-template-columns: repeat(3, 1fr); }
}`,
  },
  {
    id: "fv06",
    cat: "hero",
    name: "画面を左右に二分割",
    use: "アパレル・美容・ポートフォリオなど写真で魅せる業種",
    intent: "画面の半分を写真に、半分を文字にあて、写真の存在感と読みやすさを両立する。余白のある文字側に要素を絞って置き、上品な印象をつくる。",
    parts: ["左半分：画像（画面端まで）", "右半分：ラベル・見出し・説明・ボタン", "SPは画像を上に"],
    html: `<section class="wf-section fv06">
  <div class="fv06__grid">
    <div class="wf-img fv06__img"></div>
    <div class="fv06__body">
      <span class="wf-label">NEW COLLECTION</span>
      <h1 class="wf-h1">短く印象的な<br>見出し</h1>
      <p class="wf-text">ブランドやコレクションの説明が入ります。余白を活かして短めに。</p>
      <a class="wf-btn" href="#">コレクションを見る</a>
    </div>
  </div>
</section>`,
    css: `.fv06__grid { display: grid; grid-template-columns: 1fr 1fr; min-height: 560px; }
.fv06__img { height: 100%; border: 0; border-radius: 0; }
.fv06__body { display: flex; flex-direction: column; justify-content: center; align-items: flex-start; gap: 20px; padding: clamp(32px, 7cqi, 96px); }
@container (max-width: 640px) {
  .fv06__grid { grid-template-columns: 1fr; min-height: 0; }
  .fv06__img { aspect-ratio: 4 / 3; }
  .fv06__body { padding: 32px 20px 48px; }
}`,
  },
  {
    id: "fv07",
    cat: "hero",
    name: "スライダー（複数の訴求を切り替え）",
    use: "キャンペーンが複数ある通販・施設・自治体",
    intent: "訴求したい内容が複数あるとき、1枚ずつ切り替えて見せる。ただし2枚目以降は見られにくいので、一番伝えたいものを1枚目にし、枚数は3〜5枚に抑える。",
    parts: ["スライド画像（文字を重ねる）", "左右の矢印", "下に枚数ドット", "スライドごとのボタン"],
    html: `<section class="wf-section fv07">
  <div class="fv07__slide">
    <div class="wf-img fv07__img"></div>
    <div class="fv07__text">
      <span class="wf-label fv07__label">CAMPAIGN</span>
      <h1 class="wf-h1">キャンペーンの見出し</h1>
      <a class="wf-btn" href="#">詳しく見る</a>
    </div>
    <button class="fv07__arrow fv07__arrow--prev" type="button" aria-label="前へ">←</button>
    <button class="fv07__arrow fv07__arrow--next" type="button" aria-label="次へ">→</button>
  </div>
  <div class="fv07__dots"><span class="is-on"></span><span></span><span></span><span></span></div>
</section>`,
    css: `.fv07 { padding: 24px 20px 32px; }
.fv07__slide { position: relative; max-width: 1200px; margin: 0 auto; }
.fv07__img { aspect-ratio: 21 / 9; background-color: #9a9a9a; }
.fv07__text { position: absolute; left: clamp(20px, 6cqi, 72px); bottom: clamp(20px, 6cqi, 64px); display: flex; flex-direction: column; align-items: flex-start; gap: 16px; }
.fv07__text .wf-h1, .fv07__label { color: #fff; }
.fv07__arrow { position: absolute; top: 50%; translate: 0 -50%; width: 48px; height: 48px; border: 2px solid #444; border-radius: 50%; background: #fff; font-weight: 700; }
.fv07__arrow--prev { left: -16px; }
.fv07__arrow--next { right: -16px; }
.fv07__dots { display: flex; justify-content: center; gap: 10px; margin-top: 16px; }
.fv07__dots span { width: 12px; height: 12px; border: 2px solid #777; border-radius: 50%; }
.fv07__dots .is-on { background: #444; border-color: #444; }
@container (max-width: 640px) {
  .fv07 { padding: 16px 0 24px; }
  .fv07__img { aspect-ratio: 4 / 5; border-radius: 0; border-inline: 0; }
  .fv07__arrow { display: none; }
}`,
  },
  {
    id: "fv08",
    cat: "hero",
    name: "検索フォームが主役",
    use: "不動産・求人・旅行予約などの検索サイト",
    intent: "訪問者の目的が「探すこと」なので、ファーストビューで検索条件をそのまま入力させる。条件は2〜3項目に絞り、細かい条件は検索結果側で絞り込ませる。",
    parts: ["背景画像", "見出し", "検索パネル：エリア・種別（選択）・キーワード・検索ボタン", "下に人気の検索キーワード"],
    html: `<section class="wf-section fv08">
  <div class="wf-img fv08__bg"></div>
  <div class="wf-inner fv08__inner">
    <h1 class="wf-h1">あなたにぴったりの〇〇を探そう</h1>
    <form class="wf-box fv08__form">
      <label class="fv08__field"><span>エリア</span><span class="fv08__select">選択してください ▾</span></label>
      <label class="fv08__field"><span>種別</span><span class="fv08__select">選択してください ▾</span></label>
      <label class="fv08__field"><span>キーワード</span><span class="fv08__select">駅名・特徴など</span></label>
      <span class="wf-btn wf-btn--primary fv08__btn">検索する</span>
    </form>
    <p class="fv08__tags">人気：<a class="wf-link" href="#">キーワード1</a><a class="wf-link" href="#">キーワード2</a><a class="wf-link" href="#">キーワード3</a></p>
  </div>
</section>`,
    css: `.fv08 { position: relative; }
.fv08__bg { position: absolute; inset: 0; height: 100%; border: 0; border-radius: 0; background-color: #8a8a8a; }
.fv08__inner { position: relative; display: flex; flex-direction: column; align-items: center; gap: 24px; text-align: center; }
.fv08 .wf-h1 { color: #fff; }
.fv08__form { display: grid; grid-template-columns: repeat(3, 1fr) auto; align-items: end; gap: 16px; width: 100%; max-width: 960px; margin: 0; padding: 20px; text-align: left; }
.fv08__field { display: grid; gap: 6px; font-weight: 600; }
.fv08__select { display: flex; align-items: center; min-height: 48px; padding: 0 14px; border: 2px solid #c4c4c4; border-radius: 6px; font-weight: 400; color: #888; }
.fv08__tags { display: flex; flex-wrap: wrap; justify-content: center; gap: 8px 16px; margin: 0; color: #fff; }
.fv08__tags .wf-link { color: #fff; text-decoration: underline; }
@container (max-width: 760px) {
  .fv08__form { grid-template-columns: 1fr; }
}`,
  },
];
