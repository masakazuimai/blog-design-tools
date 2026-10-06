// フッターのパターン
export default [
  {
    id: "ft01",
    cat: "footer",
    name: "1行のシンプルなフッター",
    use: "LP・ページ数の少ないサイト",
    intent: "LPでは離脱先を増やさないよう、必要なリンク（会社情報・規約・プライバシー）だけを1行にまとめる。情報が少ないぶん、余白を広めにとって終わりを示す。",
    parts: ["ロゴ", "リンク 3つ（会社概要・利用規約・プライバシー）", "コピーライト"],
    html: `<footer class="wf-section ft01">
  <div class="wf-inner wf-inner--slim ft01__inner">
    <a class="wf-logo" href="#"><span class="wf-mark"></span>サービス名</a>
    <nav class="ft01__nav">
      <a class="wf-link" href="#">会社概要</a>
      <a class="wf-link" href="#">利用規約</a>
      <a class="wf-link" href="#">プライバシーポリシー</a>
    </nav>
    <small class="ft01__copy">&copy; 2026 会社名</small>
  </div>
</footer>`,
    css: `.ft01__inner { display: flex; align-items: center; flex-wrap: wrap; gap: 16px 32px; padding-block: 32px; }
.ft01__nav { display: flex; flex-wrap: wrap; gap: 8px 24px; }
.ft01__copy { margin-left: auto; font-size: 16px; color: #777; }
@container (max-width: 640px) {
  .ft01__inner { flex-direction: column; align-items: flex-start; }
  .ft01__copy { margin-left: 0; }
}`,
  },
  {
    id: "ft02",
    cat: "footer",
    name: "ロゴ＋説明＋リンク4列",
    use: "コーポレートサイト・ページ数の多いサイト",
    intent: "サイト全体の目次として、リンクをカテゴリ別の列に分けて並べる。ページの最後まで読んだ人が、次に見るページを見つけられるようにする。",
    parts: ["左：ロゴ・会社の一文紹介・SNSアイコン", "右：リンク 4列（各3〜4項目）", "最下段：コピーライト"],
    html: `<footer class="wf-section ft02 wf-muted-bg">
  <div class="wf-inner ft02__inner">
    <div class="ft02__about">
      <a class="wf-logo" href="#"><span class="wf-mark"></span>会社名</a>
      <p class="wf-text">会社やサービスを一文で紹介するテキストが入ります。</p>
      <ul class="wf-list ft02__sns"><li></li><li></li><li></li></ul>
    </div>
    <nav class="ft02__cols">
      <div><p class="ft02__ttl">サービス</p><a class="wf-link" href="#">リンク</a><a class="wf-link" href="#">リンク</a><a class="wf-link" href="#">リンク</a></div>
      <div><p class="ft02__ttl">会社情報</p><a class="wf-link" href="#">リンク</a><a class="wf-link" href="#">リンク</a><a class="wf-link" href="#">リンク</a></div>
      <div><p class="ft02__ttl">サポート</p><a class="wf-link" href="#">リンク</a><a class="wf-link" href="#">リンク</a><a class="wf-link" href="#">リンク</a></div>
      <div><p class="ft02__ttl">採用</p><a class="wf-link" href="#">リンク</a><a class="wf-link" href="#">リンク</a></div>
    </nav>
  </div>
  <div class="ft02__bottom"><small>&copy; 2026 会社名</small></div>
</footer>`,
    css: `.ft02__inner { display: grid; grid-template-columns: 1fr 2fr; gap: 48px; }
.ft02__about { display: flex; flex-direction: column; align-items: flex-start; gap: 16px; }
.ft02__sns { display: flex; gap: 12px; }
.ft02__sns li { width: 36px; height: 36px; border: 2px solid #999; border-radius: 50%; }
.ft02__cols { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; }
.ft02__cols div { display: flex; flex-direction: column; gap: 10px; }
.ft02__ttl { margin: 0 0 4px; font-weight: 700; }
.ft02__bottom { padding: 16px 20px; border-top: 1px solid #ddd; text-align: center; color: #777; }
.ft02__bottom small { font-size: 16px; }
@container (max-width: 760px) {
  .ft02__inner { grid-template-columns: 1fr; gap: 32px; }
  .ft02__cols { grid-template-columns: 1fr 1fr; gap: 28px 16px; }
}`,
  },
  {
    id: "ft03",
    cat: "footer",
    name: "最後のCTA帯＋フッター",
    use: "サービスサイト・LPの締め",
    intent: "読み終えた人が最後に行動できるよう、フッターの直前に申し込みの帯を置く。本文中のCTAを見逃した人の受け皿になる。",
    parts: ["CTA帯：見出し・一文・ボタン 2つ", "フッター：ロゴ・リンク・コピーライト"],
    html: `<footer class="wf-section ft03">
  <div class="ft03__cta wf-muted-bg">
    <div class="wf-inner ft03__cta-inner">
      <h2 class="wf-h2">まずは無料で試してみませんか</h2>
      <p class="wf-text">最後の背中を押す一文が入ります。</p>
      <div class="ft03__btns">
        <a class="wf-btn wf-btn--primary" href="#">無料ではじめる</a>
        <a class="wf-btn" href="#">お問い合わせ</a>
      </div>
    </div>
  </div>
  <div class="wf-inner wf-inner--slim ft03__foot">
    <a class="wf-logo" href="#"><span class="wf-mark"></span>サービス名</a>
    <nav class="ft03__nav">
      <a class="wf-link" href="#">会社概要</a>
      <a class="wf-link" href="#">利用規約</a>
      <a class="wf-link" href="#">プライバシーポリシー</a>
    </nav>
    <small class="ft03__copy">&copy; 2026 会社名</small>
  </div>
</footer>`,
    css: `.ft03__cta-inner { display: flex; flex-direction: column; align-items: center; gap: 16px; text-align: center; }
.ft03__btns { display: flex; flex-wrap: wrap; justify-content: center; gap: 12px; margin-top: 8px; }
.ft03__foot { display: flex; align-items: center; flex-wrap: wrap; gap: 16px 32px; padding-block: 28px; }
.ft03__nav { display: flex; flex-wrap: wrap; gap: 8px 24px; }
.ft03__copy { margin-left: auto; font-size: 16px; color: #777; }
@container (max-width: 640px) {
  .ft03__btns { flex-direction: column; width: 100%; }
  .ft03__foot { flex-direction: column; align-items: flex-start; }
  .ft03__copy { margin-left: 0; }
}`,
  },
  {
    id: "ft04",
    cat: "footer",
    name: "店舗情報と地図つき",
    use: "飲食店・美容室・クリニックなど来店型の店舗",
    intent: "来店を決めた人が最後に確かめる「場所・営業時間・連絡先」をフッターにまとめ、どのページからでも同じ場所で見つけられるようにする。",
    parts: ["左：ロゴ・住所・営業時間・定休日・電話番号", "右：地図", "最下段：リンクとコピーライト"],
    html: `<footer class="wf-section ft04 wf-muted-bg">
  <div class="wf-inner ft04__inner">
    <div class="ft04__info">
      <a class="wf-logo" href="#"><span class="wf-mark"></span>店舗名</a>
      <dl class="ft04__dl">
        <div><dt>住所</dt><dd>〒000-0000 〇〇県〇〇市〇〇 0-0-0</dd></div>
        <div><dt>営業時間</dt><dd>11:00〜21:00（L.O. 20:30）</dd></div>
        <div><dt>定休日</dt><dd>毎週〇曜日</dd></div>
        <div><dt>電話</dt><dd>00-0000-0000</dd></div>
      </dl>
      <a class="wf-btn wf-btn--primary" href="#">ネット予約</a>
    </div>
    <div class="wf-img ft04__map"></div>
  </div>
  <div class="ft04__bottom">
    <nav class="ft04__nav"><a class="wf-link" href="#">メニュー</a><a class="wf-link" href="#">店舗について</a><a class="wf-link" href="#">プライバシーポリシー</a></nav>
    <small>&copy; 2026 店舗名</small>
  </div>
</footer>`,
    css: `.ft04__inner { display: grid; grid-template-columns: 1fr 1.2fr; gap: 48px; align-items: stretch; }
.ft04__info { display: flex; flex-direction: column; align-items: flex-start; gap: 20px; }
.ft04__dl { display: grid; gap: 10px; margin: 0; }
.ft04__dl div { display: grid; grid-template-columns: 6em 1fr; gap: 12px; }
.ft04__dl dt { font-weight: 700; }
.ft04__dl dd { margin: 0; color: #555; }
.ft04__map { min-height: 280px; height: 100%; }
.ft04__bottom { display: flex; flex-wrap: wrap; justify-content: space-between; gap: 12px 24px; max-width: 1080px; margin: 0 auto; padding: 20px; border-top: 1px solid #ddd; color: #777; }
.ft04__bottom small { font-size: 16px; }
.ft04__nav { display: flex; flex-wrap: wrap; gap: 8px 24px; }
@container (max-width: 760px) {
  .ft04__inner { grid-template-columns: 1fr; gap: 28px; }
  .ft04__map { min-height: 220px; }
}`,
  },
  {
    id: "ft05",
    cat: "footer",
    name: "メルマガ登録とSNSを主役に",
    use: "メディア・個人ブランド・D2Cブランド",
    intent: "記事を読み終えた人をメルマガやSNSのフォロワーに変えて、次の訪問につなげる。登録の入力欄をフッターの一番上に置き、何が届くのかを一文で添える。",
    parts: ["上段：メルマガの見出し・説明・メールアドレス入力・登録ボタン", "SNSアイコン 4つ", "下段：リンクとコピーライト"],
    html: `<footer class="wf-section ft05">
  <div class="wf-inner ft05__inner">
    <div class="ft05__news">
      <h2 class="wf-h2">ニュースレターを受け取る</h2>
      <p class="wf-text">新しい記事やお知らせを週1回お届けします。いつでも解除できます。</p>
      <form class="ft05__form"><span class="ft05__input">メールアドレス</span><span class="wf-btn wf-btn--primary">登録する</span></form>
    </div>
    <ul class="wf-list ft05__sns"><li></li><li></li><li></li><li></li></ul>
  </div>
  <div class="ft05__bottom">
    <a class="wf-logo" href="#"><span class="wf-mark"></span>メディア名</a>
    <nav class="ft05__nav"><a class="wf-link" href="#">運営者情報</a><a class="wf-link" href="#">お問い合わせ</a><a class="wf-link" href="#">プライバシーポリシー</a></nav>
    <small>&copy; 2026 メディア名</small>
  </div>
</footer>`,
    css: `.ft05__inner { display: flex; flex-direction: column; align-items: center; gap: 28px; text-align: center; }
.ft05__news { display: flex; flex-direction: column; align-items: center; gap: 12px; width: 100%; max-width: 640px; }
.ft05__form { display: flex; gap: 8px; width: 100%; margin: 8px 0 0; }
.ft05__input { flex: 1; display: flex; align-items: center; min-height: 48px; padding: 0 16px; border: 2px solid #c4c4c4; border-radius: 6px; color: #999; text-align: left; }
.ft05__sns { display: flex; gap: 16px; }
.ft05__sns li { width: 44px; height: 44px; border: 2px solid #999; border-radius: 50%; }
.ft05__bottom { display: flex; flex-wrap: wrap; align-items: center; gap: 12px 32px; max-width: 1080px; margin: 0 auto; padding: 24px 20px; border-top: 1px solid #ddd; color: #777; }
.ft05__bottom small { margin-left: auto; font-size: 16px; }
.ft05__nav { display: flex; flex-wrap: wrap; gap: 8px 24px; }
@container (max-width: 640px) {
  .ft05__form { flex-direction: column; }
  .ft05__bottom { flex-direction: column; align-items: flex-start; }
  .ft05__bottom small { margin-left: 0; }
}`,
  },
];
