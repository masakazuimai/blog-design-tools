// 料金表のパターン
const PLAN = (name, price, rec = false) => `<li class="wf-box pr-plan${rec ? " is-rec" : ""}">
        ${rec ? `<span class="pr-plan__badge">おすすめ</span>` : ""}
        <p class="wf-h3">${name}</p>
        <p class="pr-plan__price"><strong>${price}</strong><span>/月</span></p>
        <p class="wf-text">このプランが合う人の説明</p>
        <ul class="wf-list pr-plan__feats"><li>機能・特典1</li><li>機能・特典2</li><li>機能・特典3</li></ul>
        <a class="wf-btn${rec ? " wf-btn--primary" : ""}" href="#">このプランにする</a>
      </li>`;

// 3プランのカードで共通に使う見た目（料金表の各パターンで使い回す）
const PLAN_CSS = `.pr-plan { position: relative; display: flex; flex-direction: column; gap: 16px; padding: 28px 24px; }
.pr-plan.is-rec { border-color: #444; border-width: 3px; }
.pr-plan__badge { position: absolute; top: -14px; left: 50%; transform: translateX(-50%); padding: 2px 14px; border-radius: 999px; background: #444; color: #fff; font-weight: 700; }
.pr-plan__price { margin: 0; }
.pr-plan__price strong { font-size: 32px; }
.pr-plan__price span { color: #777; }
.pr-plan__feats { display: grid; gap: 8px; padding-top: 16px; border-top: 1px solid #ddd; }
.pr-plan .wf-btn { margin-top: auto; }`;

const HEAD = (title) => `<div class="pr-head">
      <h2 class="wf-h2">${title}</h2>
      <p class="wf-text">料金についての補足文が入ります。</p>
    </div>`;

const HEAD_CSS = `.pr-head { display: grid; gap: 12px; text-align: center; margin-bottom: 40px; }`;

export default [
  {
    id: "pr01",
    cat: "pricing",
    name: "3プラン横並び・中央がおすすめ",
    use: "SaaS・サブスク・コース販売の基本形",
    intent: "人は3択だと真ん中を選びやすい。売りたいプランを中央に置き、枠線とバッジで強調する。各プランに「合う人」を一文で書き、自分で選べるようにする。",
    parts: ["見出し＋補足文", "プランカード 3枚", "中央に「おすすめ」バッジ", "価格・対象者・機能 3点・ボタン"],
    html: `<section class="wf-section pr01">
  <div class="wf-inner">
    ${HEAD("料金プラン")}
    <ul class="wf-list pr01__plans">
      ${PLAN("ライト", "¥0,000")}
      ${PLAN("スタンダード", "¥0,000", true)}
      ${PLAN("プロ", "¥00,000")}
    </ul>
  </div>
</section>`,
    css: `${HEAD_CSS}
${PLAN_CSS}
.pr01__plans { display: grid; grid-template-columns: repeat(3, 1fr); align-items: stretch; gap: 24px; }
@container (max-width: 760px) {
  .pr01__plans { grid-template-columns: 1fr; gap: 32px; }
  .pr01__plans .is-rec { order: -1; }
}`,
  },
  {
    id: "pr02",
    cat: "pricing",
    name: "月額・年額の切り替え付き",
    use: "年払い割引があるサブスク",
    intent: "切り替えを料金表の真上に置き、年額の割引率をラベルで見せて年払いへ誘導する。初期表示を年額にすると、割引後の安い金額が最初に目に入る。",
    parts: ["見出し", "月額／年額の切り替え（年額に割引ラベル）", "プランカード 3枚"],
    html: `<section class="wf-section pr02">
  <div class="wf-inner">
    ${HEAD("料金プラン")}
    <div class="pr02__switch" role="tablist">
      <span class="pr02__tab" role="tab">月額</span>
      <span class="pr02__tab is-on" role="tab">年額<em>2か月分おトク</em></span>
    </div>
    <ul class="wf-list pr02__plans">
      ${PLAN("ベーシック", "¥0,000")}
      ${PLAN("ビジネス", "¥0,000", true)}
      ${PLAN("エンタープライズ", "要相談")}
    </ul>
  </div>
</section>`,
    css: `${HEAD_CSS}
${PLAN_CSS}
.pr02__switch { display: flex; width: fit-content; margin: -16px auto 40px; padding: 4px; border: 2px solid #c4c4c4; border-radius: 999px; }
.pr02__tab { display: inline-flex; align-items: center; gap: 8px; padding: 8px 22px; border-radius: 999px; font-weight: 700; color: #777; }
.pr02__tab.is-on { background: #444; color: #fff; }
.pr02__tab em { font-style: normal; font-size: 16px; padding: 0 8px; border-radius: 4px; background: #fff; color: #444; }
.pr02__plans { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
@container (max-width: 760px) {
  .pr02__plans { grid-template-columns: 1fr; gap: 32px; }
}`,
  },
  {
    id: "pr03",
    cat: "pricing",
    name: "機能の比較表",
    use: "プランごとに機能差が多いサービス",
    intent: "機能を行、プランを列にした表で違いを一覧にする。カードでは書ききれない細かな差を見比べたい人向け。SPでは表を横スクロールさせ、機能名の列を固定する。",
    parts: ["見出し", "表：列＝プラン 3つ、行＝機能 6項目", "○／−／数値で差を表示", "最下行に各プランのボタン"],
    html: `<section class="wf-section pr03">
  <div class="wf-inner">
    ${HEAD("プラン比較")}
    <div class="pr03__scroll">
      <table class="pr03__table">
        <thead><tr><th></th><th>フリー</th><th class="is-rec">プロ</th><th>チーム</th></tr></thead>
        <tbody>
          <tr><th>月額料金</th><td>¥0</td><td class="is-rec">¥0,000</td><td>¥0,000</td></tr>
          <tr><th>利用人数</th><td>1人</td><td class="is-rec">1人</td><td>10人まで</td></tr>
          <tr><th>保存容量</th><td>0GB</td><td class="is-rec">00GB</td><td>000GB</td></tr>
          <tr><th>機能A</th><td>−</td><td class="is-rec">○</td><td>○</td></tr>
          <tr><th>機能B</th><td>−</td><td class="is-rec">○</td><td>○</td></tr>
          <tr><th>サポート</th><td>メール</td><td class="is-rec">メール</td><td>電話・メール</td></tr>
          <tr><th></th><td><a class="wf-btn" href="#">選ぶ</a></td><td class="is-rec"><a class="wf-btn wf-btn--primary" href="#">選ぶ</a></td><td><a class="wf-btn" href="#">選ぶ</a></td></tr>
        </tbody>
      </table>
    </div>
  </div>
</section>`,
    css: `${HEAD_CSS}
.pr03__scroll { overflow-x: auto; }
.pr03__table { width: 100%; min-width: 600px; border-collapse: collapse; text-align: center; }
.pr03__table th, .pr03__table td { padding: 14px 12px; border-bottom: 1px solid #ddd; }
.pr03__table thead th { font-size: 18px; }
.pr03__table tbody th { text-align: left; font-weight: 600; color: #555; }
.pr03__table .is-rec { background: #f1f1f1; }
.pr03__table thead .is-rec { background: #444; color: #fff; }
@container (max-width: 640px) {
  .pr03__table tbody th, .pr03__table thead th:first-child { position: sticky; left: 0; background: #fff; }
}`,
  },
  {
    id: "pr04",
    cat: "pricing",
    name: "1プランの価格＋含まれるもの",
    use: "単一価格の商品・講座・買い切りツール",
    intent: "選択肢をなくして迷いを消す。価格の隣に「含まれるもの」を全部並べ、価格に対して何が手に入るかで納得してもらう。返金保証などの安心材料をボタンの下に添える。",
    parts: ["見出し", "左：価格・ボタン・保証の一文", "右：含まれるもの 6項目のチェックリスト"],
    html: `<section class="wf-section pr04 wf-muted-bg">
  <div class="wf-inner">
    ${HEAD("料金")}
    <div class="wf-box pr04__card">
      <div class="pr04__price">
        <p class="wf-h3">プラン名</p>
        <p class="pr04__num"><strong>¥00,000</strong><span>（税込）</span></p>
        <a class="wf-btn wf-btn--primary" href="#">申し込む</a>
        <p class="wf-text">30日間の返金保証つき</p>
      </div>
      <ul class="wf-list pr04__items">
        <li><span class="wf-check"></span>含まれるもの1</li><li><span class="wf-check"></span>含まれるもの2</li><li><span class="wf-check"></span>含まれるもの3</li>
        <li><span class="wf-check"></span>含まれるもの4</li><li><span class="wf-check"></span>含まれるもの5</li><li><span class="wf-check"></span>含まれるもの6</li>
      </ul>
    </div>
  </div>
</section>`,
    css: `${HEAD_CSS}
.pr04__card { display: grid; grid-template-columns: 0.9fr 1.1fr; max-width: 880px; margin: 0 auto; }
.pr04__price { display: flex; flex-direction: column; justify-content: center; gap: 16px; padding: 36px; border-right: 1px solid #ddd; text-align: center; }
.pr04__num { margin: 0; }
.pr04__num strong { font-size: 40px; }
.pr04__num span { color: #777; }
.pr04__items { display: grid; grid-template-columns: 1fr 1fr; align-content: center; gap: 16px 24px; padding: 36px; }
.pr04__items li { position: relative; padding-left: 30px; }
@container (max-width: 640px) {
  .pr04__card { grid-template-columns: 1fr; }
  .pr04__price { border-right: 0; border-bottom: 1px solid #ddd; padding: 28px 20px; }
  .pr04__items { grid-template-columns: 1fr; padding: 28px 20px; }
}`,
  },
  {
    id: "pr05",
    cat: "pricing",
    name: "使う量で決まる料金のシミュレーション",
    use: "従量課金のクラウドサービス・API・人数課金のSaaS",
    intent: "単価だけ見せても総額が想像しにくいので、使う量を動かすと月額がその場で出る形にする。「自分の場合はいくらか」が分かると、問い合わせ前の離脱が減る。",
    parts: ["見出し", "左：利用量のスライダー 2本（人数・件数）", "右：月額の合計と内訳", "単価の一覧表へのリンク"],
    html: `<section class="wf-section pr05 wf-muted-bg">
  <div class="wf-inner">
    <div class="wf-head"><h2 class="wf-h2">料金シミュレーション</h2><p class="wf-text">使う量を動かすと、月額の目安がわかります。</p></div>
    <div class="wf-box pr05__box">
      <div class="pr05__inputs">
        <label class="pr05__field"><span>利用人数<strong>10人</strong></span><span class="pr05__range"><span class="pr05__fill"></span><span class="pr05__knob"></span></span></label>
        <label class="pr05__field"><span>月間の処理件数<strong>5,000件</strong></span><span class="pr05__range"><span class="pr05__fill pr05__fill--b"></span><span class="pr05__knob pr05__knob--b"></span></span></label>
      </div>
      <div class="pr05__total">
        <p class="wf-text">月額の目安</p>
        <p class="pr05__sum">¥00,000<span>/月</span></p>
        <dl class="pr05__rows"><div><dt>基本料金</dt><dd>¥0,000</dd></div><div><dt>人数 × 単価</dt><dd>¥0,000</dd></div><div><dt>件数 × 単価</dt><dd>¥0,000</dd></div></dl>
        <a class="wf-btn wf-btn--primary" href="#">この内容で申し込む</a>
      </div>
    </div>
    <p class="pr05__more"><a class="wf-link" href="#">単価の一覧を見る →</a></p>
  </div>
</section>`,
    css: `.pr05__box { display: grid; grid-template-columns: 1.2fr 1fr; max-width: 960px; margin: 0 auto; }
.pr05__inputs { display: flex; flex-direction: column; justify-content: center; gap: 36px; padding: 36px; border-right: 1px solid #ddd; }
.pr05__field { display: grid; gap: 14px; }
.pr05__field > span:first-child { display: flex; justify-content: space-between; font-weight: 600; }
.pr05__range { position: relative; display: block; height: 8px; border-radius: 999px; background: #ddd; }
.pr05__fill { position: absolute; left: 0; top: 0; bottom: 0; width: 35%; border-radius: 999px; background: #444; }
.pr05__fill--b { width: 60%; }
.pr05__knob { position: absolute; left: 35%; top: 50%; width: 24px; height: 24px; margin: -12px 0 0 -12px; border: 3px solid #444; border-radius: 50%; background: #fff; }
.pr05__knob--b { left: 60%; }
.pr05__total { display: flex; flex-direction: column; gap: 12px; padding: 36px; }
.pr05__sum { margin: 0; font-size: 40px; font-weight: 700; line-height: 1.2; }
.pr05__sum span { font-size: 18px; color: #777; }
.pr05__rows { display: grid; gap: 6px; margin: 0 0 8px; color: #666; }
.pr05__rows div { display: flex; justify-content: space-between; }
.pr05__rows dd { margin: 0; }
.pr05__more { margin: 24px 0 0; text-align: center; }
@container (max-width: 760px) {
  .pr05__box { grid-template-columns: 1fr; }
  .pr05__inputs { border-right: 0; border-bottom: 1px solid #ddd; padding: 28px 20px; }
  .pr05__total { padding: 28px 20px; }
}`,
  },
  {
    id: "pr06",
    cat: "pricing",
    name: "基本料金＋オプションの一覧",
    use: "制作・修理・クリーニング・レッスンなどの見積もり型サービス",
    intent: "必ずかかる基本料金を大きく見せ、追加できるオプションは表で一覧にする。合計の作り方が見えるので「結局いくらかかるの？」という不安を先に解消できる。",
    parts: ["見出し", "基本料金のカード（価格・含まれる内容）", "オプションの表（項目・内容・料金）", "注記（税込・出張費など）"],
    html: `<section class="wf-section pr06">
  <div class="wf-inner pr06__inner">
    <div class="wf-head"><h2 class="wf-h2">料金</h2></div>
    <div class="wf-box pr06__base">
      <div><p class="wf-label">基本料金</p><p class="pr06__price">¥00,000<span>〜</span></p></div>
      <p class="wf-text">基本料金に含まれる作業内容の説明が入ります。</p>
    </div>
    <h3 class="wf-h3 pr06__sub">オプション</h3>
    <table class="pr06__table">
      <thead><tr><th>項目</th><th>内容</th><th>料金</th></tr></thead>
      <tbody>
        <tr><td>オプション1</td><td>内容の説明が入ります</td><td>¥0,000</td></tr>
        <tr><td>オプション2</td><td>内容の説明が入ります</td><td>¥0,000</td></tr>
        <tr><td>オプション3</td><td>内容の説明が入ります</td><td>¥0,000</td></tr>
        <tr><td>オプション4</td><td>内容の説明が入ります</td><td>要見積もり</td></tr>
      </tbody>
    </table>
    <p class="wf-text pr06__note">※ 表示価格はすべて税込です。注記が入ります。</p>
  </div>
</section>`,
    css: `.pr06__inner { max-width: 860px; }
.pr06__base { display: grid; grid-template-columns: auto 1fr; align-items: center; gap: 32px; padding: 28px 32px; border-color: #444; border-width: 3px; }
.pr06__price { margin: 4px 0 0; font-size: 40px; font-weight: 700; line-height: 1.2; }
.pr06__price span { font-size: 20px; }
.pr06__sub { margin: 40px 0 12px; }
.pr06__table { width: 100%; border-collapse: collapse; }
.pr06__table th, .pr06__table td { padding: 14px 12px; border-bottom: 1px solid #ddd; text-align: left; }
.pr06__table thead th { background: #f1f1f1; }
.pr06__table td:last-child, .pr06__table th:last-child { text-align: right; white-space: nowrap; font-weight: 700; }
.pr06__note { margin-top: 16px; }
@container (max-width: 640px) {
  .pr06__base { grid-template-columns: 1fr; gap: 12px; padding: 24px 20px; }
  .pr06__table th:nth-child(2), .pr06__table td:nth-child(2) { display: none; }
}`,
  },
];
