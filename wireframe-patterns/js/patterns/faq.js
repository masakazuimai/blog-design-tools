// FAQ のパターン
const QA = (n, open = false) => `<details class="fq01__item"${open ? " open" : ""}>
        <summary><span class="fq01__q">Q</span><span class="fq01__ttl">よくある質問${n}が入ります</span><span class="fq01__mark" aria-hidden="true"><span class="fq01__plus">＋</span><span class="fq01__minus">−</span></span></summary>
        <div class="fq01__a"><span class="fq01__q fq01__q--a">A</span><p class="wf-text">回答が入ります。結論を先に書き、必要なら補足を続けます。</p></div>
      </details>`;

const PAIR = (n) => `<div class="fq02__item">
          <dt>Q. よくある質問${n}が入ります</dt>
          <dd class="wf-text">回答が入ります。結論を先に書き、必要なら補足を続けます。</dd>
        </div>`;

export default [
  {
    id: "fq01",
    cat: "faq",
    name: "開閉式（アコーディオン）",
    use: "質問数が多いFAQ・申し込み前の不安解消",
    intent: "質問だけを並べて一覧性を上げ、気になるものだけ開いて読ませる。details 要素を使うのでJavaScript不要で開閉でき、閉じた状態の回答も検索エンジンに読まれる。",
    parts: ["見出し", "質問 5つ（Q・質問文・開閉マーク）", "開いた質問の下に回答（A）"],
    html: `<section class="wf-section fq01">
  <div class="wf-inner fq01__inner">
    <div class="wf-head"><span class="wf-label">FAQ</span><h2 class="wf-h2">よくある質問</h2></div>
    <div class="fq01__list">
      ${QA(1, true)}
      ${QA(2)}
      ${QA(3)}
      ${QA(4)}
      ${QA(5)}
    </div>
  </div>
</section>`,
    css: `.fq01__inner { max-width: 860px; }
.fq01__list { border-top: 1px solid #ccc; }
.fq01__item { border-bottom: 1px solid #ccc; }
.fq01__item summary { display: flex; align-items: center; gap: 16px; padding: 20px 4px; cursor: pointer; list-style: none; font-weight: 700; }
.fq01__item summary::-webkit-details-marker { display: none; }
.fq01__ttl { flex: 1; }
.fq01__q { display: grid; place-items: center; flex: 0 0 auto; width: 36px; height: 36px; border-radius: 50%; background: #444; color: #fff; font-weight: 700; }
.fq01__q--a { background: #fff; color: #444; border: 2px solid #444; }
.fq01__mark { font-size: 22px; color: #777; }
.fq01__minus, .fq01__item[open] .fq01__plus { display: none; }
.fq01__item[open] .fq01__minus { display: inline; }
.fq01__a { display: flex; align-items: flex-start; gap: 16px; padding: 0 4px 24px; }
.fq01__a .wf-text { padding-top: 4px; }`,
  },
  {
    id: "fq02",
    cat: "faq",
    name: "質問と回答を2カラムで全部見せる",
    use: "質問が6つ前後の少ないFAQ・LPの終盤",
    intent: "開閉させず、全部の回答を最初から見せる。質問数が少ないなら、クリックの手間をなくして流し読みで疑問を解消できる方が離脱が少ない。",
    parts: ["左：見出しと問い合わせへの導線", "右：質問と回答 4組をすべて表示"],
    html: `<section class="wf-section fq02 wf-muted-bg">
  <div class="wf-inner fq02__inner">
    <div class="fq02__side">
      <h2 class="wf-h2">よくある質問</h2>
      <p class="wf-text">ここにない質問は、お気軽にお問い合わせください。</p>
      <a class="wf-btn" href="#">お問い合わせ</a>
    </div>
    <dl class="fq02__list">
      ${PAIR(1)}
      ${PAIR(2)}
      ${PAIR(3)}
      ${PAIR(4)}
    </dl>
  </div>
</section>`,
    css: `.fq02__inner { display: grid; grid-template-columns: 1fr 2fr; gap: 48px; }
.fq02__side { display: flex; flex-direction: column; align-items: flex-start; gap: 16px; }
.fq02__list { display: grid; gap: 16px; margin: 0; }
.fq02__item { padding: 20px 24px; border: 2px solid #b5b5b5; border-radius: 8px; background: #fff; }
.fq02__item dt { font-weight: 700; margin-bottom: 8px; }
.fq02__item dd { margin: 0; }
@container (max-width: 760px) {
  .fq02__inner { grid-template-columns: 1fr; gap: 28px; }
}`,
  },
  {
    id: "fq03",
    cat: "faq",
    name: "カテゴリのタブで切り替え",
    use: "質問が20件を超えるサービス・EC",
    intent: "質問をカテゴリで分け、タブで切り替えて表示する。全部を並べると目的の質問が埋もれるので、まず「どの種類の質問か」を選ばせて候補を減らす。",
    parts: ["見出し", "カテゴリタブ 4つ（料金・使い方・契約・その他）", "選んだタブの質問一覧（開閉式）"],
    html: `<section class="wf-section fq03">
  <div class="wf-inner fq03__inner">
    <div class="wf-head"><h2 class="wf-h2">よくある質問</h2></div>
    <div class="fq03__tabs" role="tablist">
      <span class="fq03__tab is-on" role="tab">料金について</span>
      <span class="fq03__tab" role="tab">使い方</span>
      <span class="fq03__tab" role="tab">契約・解約</span>
      <span class="fq03__tab" role="tab">その他</span>
    </div>
    <ul class="wf-list fq03__list">
      <li><span>Q. 料金についての質問1が入ります</span><span aria-hidden="true">＋</span></li>
      <li><span>Q. 料金についての質問2が入ります</span><span aria-hidden="true">＋</span></li>
      <li><span>Q. 料金についての質問3が入ります</span><span aria-hidden="true">＋</span></li>
      <li><span>Q. 料金についての質問4が入ります</span><span aria-hidden="true">＋</span></li>
    </ul>
  </div>
</section>`,
    css: `.fq03__inner { max-width: 860px; }
.fq03__tabs { display: flex; gap: 8px; overflow-x: auto; margin-bottom: 24px; padding-bottom: 4px; }
.fq03__tab { flex: 0 0 auto; padding: 10px 20px; border: 2px solid #c4c4c4; border-radius: 999px; font-weight: 700; color: #666; }
.fq03__tab.is-on { background: #444; border-color: #444; color: #fff; }
.fq03__list { border-top: 1px solid #ccc; }
.fq03__list li { display: flex; justify-content: space-between; gap: 16px; padding: 18px 4px; border-bottom: 1px solid #ccc; font-weight: 700; }
.fq03__list li span:last-child { color: #777; font-size: 22px; line-height: 1; }`,
  },
  {
    id: "fq04",
    cat: "faq",
    name: "検索窓つきのヘルプセンター入口",
    use: "SaaS・会員サービスのサポートページ",
    intent: "困っている人は言葉で探したいので、検索窓を一番上に置く。その下にカテゴリのカードと、よく見られている質問を並べ、検索しない人の入口も用意する。",
    parts: ["見出し＋検索窓", "カテゴリカード 6枚（アイコン・名前・件数）", "よく見られている質問 4件", "解決しない場合の問い合わせ導線"],
    html: `<section class="wf-section fq04">
  <div class="fq04__top wf-muted-bg">
    <div class="wf-inner fq04__search">
      <h2 class="wf-h2">何かお困りですか？</h2>
      <form class="fq04__form"><span class="fq04__input">キーワードで質問を探す</span><span class="wf-btn wf-btn--primary">検索</span></form>
    </div>
  </div>
  <div class="wf-inner">
    <ul class="wf-list fq04__cats">
      <li class="wf-box"><span class="wf-icon"></span><p class="wf-h3">はじめての方へ</p><span class="wf-text">00件</span></li>
      <li class="wf-box"><span class="wf-icon"></span><p class="wf-h3">アカウント</p><span class="wf-text">00件</span></li>
      <li class="wf-box"><span class="wf-icon"></span><p class="wf-h3">料金・お支払い</p><span class="wf-text">00件</span></li>
      <li class="wf-box"><span class="wf-icon"></span><p class="wf-h3">機能の使い方</p><span class="wf-text">00件</span></li>
      <li class="wf-box"><span class="wf-icon"></span><p class="wf-h3">トラブル</p><span class="wf-text">00件</span></li>
      <li class="wf-box"><span class="wf-icon"></span><p class="wf-h3">解約</p><span class="wf-text">00件</span></li>
    </ul>
    <h3 class="wf-h3 fq04__sub">よく見られている質問</h3>
    <ul class="wf-list fq04__popular">
      <li><a class="wf-link" href="#">よく見られている質問1が入ります</a></li>
      <li><a class="wf-link" href="#">よく見られている質問2が入ります</a></li>
      <li><a class="wf-link" href="#">よく見られている質問3が入ります</a></li>
      <li><a class="wf-link" href="#">よく見られている質問4が入ります</a></li>
    </ul>
    <p class="fq04__contact">解決しない場合は <a class="wf-btn" href="#">お問い合わせ</a></p>
  </div>
</section>`,
    css: `.fq04__search { display: flex; flex-direction: column; align-items: center; gap: 20px; text-align: center; }
.fq04__form { display: flex; gap: 8px; width: 100%; max-width: 640px; margin: 0; }
.fq04__input { flex: 1; display: flex; align-items: center; min-height: 52px; padding: 0 16px; border: 2px solid #c4c4c4; border-radius: 6px; background: #fff; color: #999; text-align: left; }
.fq04__cats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
.fq04__cats li { display: grid; grid-template-columns: auto 1fr auto; align-items: center; gap: 16px; padding: 20px; }
.fq04__sub { margin: 40px 0 12px; }
.fq04__popular { display: grid; grid-template-columns: 1fr 1fr; gap: 0 32px; }
.fq04__popular li { padding: 12px 0; border-bottom: 1px solid #ddd; }
.fq04__contact { display: flex; align-items: center; justify-content: center; gap: 16px; margin: 40px 0 0; }
@container (max-width: 760px) {
  .fq04__cats { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .fq04__cats li { grid-template-columns: 1fr; justify-items: start; gap: 8px; min-width: 0; overflow-wrap: anywhere; }
  .fq04__popular { grid-template-columns: 1fr; }
  .fq04__contact { flex-direction: column; }
}
@container (max-width: 480px) {
  .fq04__form { flex-direction: column; }
}`,
  },
];
