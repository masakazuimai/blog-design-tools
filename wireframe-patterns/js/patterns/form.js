// お問い合わせフォームのパターン
// 入力欄は見た目だけの枠（span）で描く。実装時は input / select / textarea に置き換える
const FIELD = (label, { req = false, tall = false, hint = "" } = {}) => `<div class="fm-field">
        <span class="fm-label">${label}${req ? `<span class="fm-req">必須</span>` : `<span class="fm-opt">任意</span>`}</span>
        <span class="fm-input${tall ? " fm-input--tall" : ""}">${hint}</span>
      </div>`;

// フォーム系パターンで共通に使う見た目
const FIELD_CSS = `.fm-field { display: grid; gap: 6px; }
.fm-label { display: flex; align-items: center; gap: 8px; font-weight: 700; }
.fm-req, .fm-opt { padding: 0 8px; border-radius: 4px; font-size: 16px; font-weight: 600; }
.fm-req { background: #444; color: #fff; }
.fm-opt { border: 1px solid #aaa; color: #777; }
.fm-input { display: flex; align-items: center; min-height: 48px; padding: 0 14px; border: 2px solid #c4c4c4; border-radius: 6px; background: #fff; color: #999; }
.fm-input--tall { min-height: 160px; align-items: flex-start; padding-top: 12px; }
.fm-agree { display: flex; align-items: center; justify-content: center; gap: 10px; }
.fm-agree .wf-check { position: static; }`;

export default [
  {
    id: "fm01",
    cat: "form",
    name: "1カラムの基本フォーム",
    use: "コーポレートサイト・サービスサイトのお問い合わせ",
    intent: "入力欄を縦1列に並べ、上から順に埋めるだけにする。必須・任意をラベルの横に明示し、項目は返信に必要な最小限に絞って離脱を減らす。",
    parts: ["見出し＋説明", "お問い合わせ種別（選択）", "お名前・メールアドレス・電話番号（任意）", "お問い合わせ内容（複数行）", "プライバシーポリシーへの同意", "送信ボタン"],
    html: `<section class="wf-section fm01">
  <div class="wf-inner fm01__inner">
    <div class="wf-head"><h2 class="wf-h2">お問い合わせ</h2><p class="wf-text">2営業日以内にご返信します。</p></div>
    <form class="fm01__form">
      ${FIELD("お問い合わせの種類", { req: true, hint: "選択してください ▾" })}
      ${FIELD("お名前", { req: true, hint: "山田 太郎" })}
      ${FIELD("メールアドレス", { req: true, hint: "example@example.com" })}
      ${FIELD("電話番号", { hint: "000-0000-0000" })}
      ${FIELD("お問い合わせ内容", { req: true, tall: true })}
      <p class="fm-agree"><span class="wf-check"></span><span><a class="wf-link" href="#"><u>プライバシーポリシー</u></a>に同意する</span></p>
      <span class="wf-btn wf-btn--primary fm01__submit">送信内容を確認する</span>
    </form>
  </div>
</section>`,
    css: `${FIELD_CSS}
.fm01__inner { max-width: 720px; }
.fm01__form { display: grid; gap: 24px; margin: 0; }
.fm01__submit { justify-self: center; min-width: 280px; min-height: 56px; }
@container (max-width: 640px) {
  .fm01__submit { justify-self: stretch; min-width: 0; }
}`,
  },
  {
    id: "fm02",
    cat: "form",
    name: "左に連絡先・右にフォーム",
    use: "電話でも受け付ける店舗・士業・BtoB",
    intent: "フォームに書く前に「電話の方が早い」人もいるので、電話番号と受付時間を左に並べて選ばせる。よくある質問へのリンクも添え、問い合わせ自体を減らす。",
    parts: ["左：電話番号・受付時間・よくある質問へのリンク", "右：フォーム（お名前・メール・内容・送信）"],
    html: `<section class="wf-section fm02 wf-muted-bg">
  <div class="wf-inner fm02__inner">
    <div class="fm02__side">
      <h2 class="wf-h2">お問い合わせ</h2>
      <div class="wf-box fm02__tel">
        <p class="wf-label">お電話でのお問い合わせ</p>
        <p class="fm02__num">00-0000-0000</p>
        <p class="wf-text">平日 9:00〜18:00</p>
      </div>
      <p class="wf-text">お急ぎでない方は <a class="wf-link" href="#"><u>よくある質問</u></a> もご覧ください。</p>
    </div>
    <form class="wf-box fm02__form">
      ${FIELD("お名前", { req: true })}
      ${FIELD("メールアドレス", { req: true })}
      ${FIELD("お問い合わせ内容", { req: true, tall: true })}
      <span class="wf-btn wf-btn--primary">送信する</span>
    </form>
  </div>
</section>`,
    css: `${FIELD_CSS}
.fm02__inner { display: grid; grid-template-columns: 1fr 1.4fr; gap: 48px; align-items: start; }
.fm02__side { display: flex; flex-direction: column; gap: 20px; }
.fm02__tel { display: grid; gap: 4px; padding: 24px; }
.fm02__tel p { margin: 0; }
.fm02__num { font-size: 32px; font-weight: 700; }
.fm02__form { display: grid; gap: 20px; margin: 0; padding: 28px; }
@container (max-width: 760px) {
  .fm02__inner { grid-template-columns: 1fr; gap: 28px; }
  .fm02__form { padding: 20px; }
}`,
  },
  {
    id: "fm03",
    cat: "form",
    name: "入力内容の確認画面",
    use: "申し込み・予約など送信前に見直してほしいフォーム",
    intent: "送信前に入力内容を一覧で見せ、間違いに気づける機会を作る。「戻って修正」と「送信」を並べ、送信の方だけ塗りボタンにする。",
    parts: ["進捗表示（入力 → 確認 → 完了）", "見出し", "入力内容の一覧（項目名・入力値）", "戻るボタン＋送信ボタン"],
    html: `<section class="wf-section fm03">
  <div class="wf-inner fm03__inner">
    <ol class="wf-list fm03__steps"><li>1. 入力</li><li class="is-on">2. 確認</li><li>3. 完了</li></ol>
    <h2 class="wf-h2">入力内容の確認</h2>
    <p class="wf-text">以下の内容でよろしければ「送信する」を押してください。</p>
    <dl class="fm03__list">
      <div><dt>お問い合わせの種類</dt><dd>サービスについて</dd></div>
      <div><dt>お名前</dt><dd>山田 太郎</dd></div>
      <div><dt>メールアドレス</dt><dd>example@example.com</dd></div>
      <div><dt>電話番号</dt><dd>000-0000-0000</dd></div>
      <div><dt>お問い合わせ内容</dt><dd>入力した内容がそのまま表示されます。</dd></div>
    </dl>
    <div class="fm03__btns"><a class="wf-btn" href="#">戻って修正する</a><a class="wf-btn wf-btn--primary" href="#">送信する</a></div>
  </div>
</section>`,
    css: `.fm03__inner { display: flex; flex-direction: column; gap: 16px; max-width: 760px; }
.fm03__steps { display: flex; gap: 8px; margin-bottom: 16px; }
.fm03__steps li { flex: 1; padding: 8px; border: 2px solid #c4c4c4; border-radius: 6px; text-align: center; color: #888; font-weight: 700; }
.fm03__steps .is-on { background: #444; border-color: #444; color: #fff; }
.fm03__list { margin: 8px 0 0; border-top: 1px solid #ccc; }
.fm03__list div { display: grid; grid-template-columns: 12em 1fr; gap: 16px; padding: 16px 4px; border-bottom: 1px solid #ccc; }
.fm03__list dt { font-weight: 700; }
.fm03__list dd { margin: 0; }
.fm03__btns { display: flex; justify-content: center; gap: 12px; margin-top: 16px; }
@container (max-width: 640px) {
  .fm03__list div { grid-template-columns: 1fr; gap: 4px; }
  .fm03__btns { flex-direction: column-reverse; }
}`,
  },
  {
    id: "fm04",
    cat: "form",
    name: "住所入力つき（2カラムの入力欄）",
    use: "EC・資料の郵送・会員登録",
    intent: "姓と名、郵便番号と住所の自動入力ボタンなど、関係する項目を横に並べて縦の長さを抑える。項目名は入力欄の左に置き、どこまで埋めたかを見渡しやすくする。",
    parts: ["左に項目名・右に入力欄の表形式", "姓・名を横並び", "郵便番号＋住所自動入力ボタン", "都道府県（選択）・市区町村・番地・建物名", "次へボタン"],
    html: `<section class="wf-section fm04">
  <div class="wf-inner fm04__inner">
    <h2 class="wf-h2 fm04__ttl">お届け先の入力</h2>
    <form class="fm04__form">
      <div class="fm04__row"><span class="fm-label">お名前<span class="fm-req">必須</span></span><div class="fm04__pair"><span class="fm-input">姓</span><span class="fm-input">名</span></div></div>
      <div class="fm04__row"><span class="fm-label">フリガナ<span class="fm-req">必須</span></span><div class="fm04__pair"><span class="fm-input">セイ</span><span class="fm-input">メイ</span></div></div>
      <div class="fm04__row"><span class="fm-label">郵便番号<span class="fm-req">必須</span></span><div class="fm04__zip"><span class="fm-input">000-0000</span><span class="wf-btn">住所を自動入力</span></div></div>
      <div class="fm04__row"><span class="fm-label">都道府県<span class="fm-req">必須</span></span><span class="fm-input fm04__short">選択してください ▾</span></div>
      <div class="fm04__row"><span class="fm-label">市区町村・番地<span class="fm-req">必須</span></span><span class="fm-input"></span></div>
      <div class="fm04__row"><span class="fm-label">建物名・部屋番号<span class="fm-opt">任意</span></span><span class="fm-input"></span></div>
      <span class="wf-btn wf-btn--primary fm04__next">次へ進む</span>
    </form>
  </div>
</section>`,
    css: `${FIELD_CSS}
.fm04__inner { max-width: 860px; }
.fm04__ttl { margin-bottom: 24px; }
.fm04__form { margin: 0; border-top: 1px solid #ccc; }
.fm04__row { display: grid; grid-template-columns: 14em 1fr; align-items: center; gap: 16px; padding: 16px 0; border-bottom: 1px solid #ccc; }
.fm04__pair { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.fm04__zip { display: flex; gap: 12px; }
.fm04__zip .fm-input { width: 12em; }
.fm04__short { max-width: 16em; }
.fm04__next { display: flex; width: fit-content; min-width: 280px; margin: 32px auto 0; }
@container (max-width: 640px) {
  .fm04__row { grid-template-columns: 1fr; gap: 8px; }
  .fm04__zip .fm-input { width: auto; flex: 1; }
  .fm04__next { width: 100%; min-width: 0; }
}`,
  },
  {
    id: "fm05",
    cat: "form",
    name: "日付と時間を選ぶ予約フォーム",
    use: "美容室・クリニック・相談会・レッスンの予約",
    intent: "カレンダーで日付を選ぶと、その日の空き時間がボタンで並ぶ形にする。空きのない枠は選べない見た目にして、空いている時間だけを選ばせる。",
    parts: ["左：月のカレンダー（選択日を強調・満席日は薄く）", "右：選んだ日の時間枠ボタン（満席は無効）", "下：お名前・電話番号・予約ボタン"],
    html: `<section class="wf-section fm05">
  <div class="wf-inner">
    <div class="wf-head"><h2 class="wf-h2">ご予約</h2></div>
    <div class="fm05__grid">
      <div class="wf-box fm05__cal">
        <p class="fm05__month"><span>←</span><strong>2026年00月</strong><span>→</span></p>
        <div class="fm05__days">
          <span class="fm05__dow">日</span><span class="fm05__dow">月</span><span class="fm05__dow">火</span><span class="fm05__dow">水</span><span class="fm05__dow">木</span><span class="fm05__dow">金</span><span class="fm05__dow">土</span>
          <span class="is-off"></span><span class="is-off"></span><span>1</span><span>2</span><span>3</span><span class="is-full">4</span><span>5</span>
          <span>6</span><span>7</span><span class="is-full">8</span><span>9</span><span class="is-sel">10</span><span>11</span><span>12</span>
          <span>13</span><span>14</span><span>15</span><span class="is-full">16</span><span>17</span><span>18</span><span>19</span>
          <span>20</span><span>21</span><span>22</span><span>23</span><span>24</span><span class="is-full">25</span><span>26</span>
        </div>
      </div>
      <div class="fm05__times">
        <p class="wf-h3">00月10日（木）の空き時間</p>
        <div class="fm05__slots">
          <span>10:00</span><span class="is-full">11:00</span><span class="is-sel">13:00</span><span>14:00</span>
          <span class="is-full">15:00</span><span>16:00</span><span>17:00</span><span class="is-full">18:00</span>
        </div>
        <p class="wf-text">グレーの時間は満席です。</p>
      </div>
    </div>
    <div class="fm05__form">
      <span class="fm-input">お名前</span><span class="fm-input">電話番号</span><span class="wf-btn wf-btn--primary">この内容で予約する</span>
    </div>
  </div>
</section>`,
    css: `${FIELD_CSS}
.fm05__grid { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; align-items: start; }
.fm05__cal { padding: 20px; }
.fm05__month { display: flex; justify-content: space-between; margin: 0 0 12px; }
.fm05__days { display: grid; grid-template-columns: repeat(7, 1fr); gap: 4px; text-align: center; }
.fm05__days span { display: grid; place-items: center; height: 44px; border-radius: 6px; }
.fm05__dow { color: #888; font-weight: 700; }
.fm05__days .is-full { color: #bbb; text-decoration: line-through; }
.fm05__days .is-sel { background: #444; color: #fff; font-weight: 700; }
.fm05__times { display: flex; flex-direction: column; gap: 16px; }
.fm05__slots { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; }
.fm05__slots span { display: grid; place-items: center; height: 48px; border: 2px solid #444; border-radius: 6px; font-weight: 700; }
.fm05__slots .is-full { border-color: #ddd; background: #f1f1f1; color: #bbb; }
.fm05__slots .is-sel { background: #444; color: #fff; }
.fm05__form { display: grid; grid-template-columns: 1fr 1fr auto; gap: 12px; margin-top: 32px; padding-top: 24px; border-top: 1px solid #ddd; }
@container (max-width: 760px) {
  .fm05__grid { grid-template-columns: 1fr; }
  .fm05__slots { grid-template-columns: repeat(3, 1fr); }
  .fm05__form { grid-template-columns: 1fr; }
}`,
  },
];
