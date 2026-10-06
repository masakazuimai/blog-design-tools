// 会社概要・アクセスのパターン
export default [
  {
    id: "co01",
    cat: "company",
    name: "会社概要の表",
    use: "コーポレートサイトの会社情報ページ",
    intent: "社名・所在地・設立・代表者など、取引前に確かめられる基本情報を表にまとめる。項目名の列幅をそろえ、読み比べやすくする。",
    parts: ["見出し", "表：会社名・所在地・設立・代表者・資本金・従業員数・事業内容・取引銀行"],
    html: `<section class="wf-section co01">
  <div class="wf-inner co01__inner">
    <div class="wf-head"><span class="wf-label">COMPANY</span><h2 class="wf-h2">会社概要</h2></div>
    <dl class="co01__list">
      <div><dt>会社名</dt><dd>株式会社〇〇</dd></div>
      <div><dt>所在地</dt><dd>〒000-0000 〇〇県〇〇市〇〇 0-0-0 〇〇ビル0F</dd></div>
      <div><dt>設立</dt><dd>0000年0月0日</dd></div>
      <div><dt>代表者</dt><dd>代表取締役 氏名</dd></div>
      <div><dt>資本金</dt><dd>0,000万円</dd></div>
      <div><dt>従業員数</dt><dd>00名（2026年0月時点）</dd></div>
      <div><dt>事業内容</dt><dd>事業内容1<br>事業内容2<br>事業内容3</dd></div>
      <div><dt>取引銀行</dt><dd>〇〇銀行 〇〇支店</dd></div>
    </dl>
  </div>
</section>`,
    css: `.co01__inner { max-width: 860px; }
.co01__list { margin: 0; border-top: 2px solid #444; }
.co01__list div { display: grid; grid-template-columns: 12em 1fr; gap: 24px; padding: 18px 8px; border-bottom: 1px solid #ccc; }
.co01__list dt { font-weight: 700; }
.co01__list dd { margin: 0; color: #555; }
@container (max-width: 640px) {
  .co01__list div { grid-template-columns: 1fr; gap: 4px; }
}`,
  },
  {
    id: "co02",
    cat: "company",
    name: "地図とアクセス情報",
    use: "店舗・オフィス・施設のアクセスページ",
    intent: "地図だけでは道順が分からない人のために、最寄り駅からの道順と所要時間を文章で添える。電車・車の両方の情報を並べ、来る手段ごとに読ませる。",
    parts: ["左：地図（大きく）", "右：住所・最寄り駅からの道順・駐車場の有無", "Googleマップで開くリンク"],
    html: `<section class="wf-section co02">
  <div class="wf-inner">
    <div class="wf-head"><span class="wf-label">ACCESS</span><h2 class="wf-h2">アクセス</h2></div>
    <div class="co02__grid">
      <div class="wf-img co02__map"></div>
      <div class="co02__info">
        <p class="wf-h3">〇〇ビル 0F</p>
        <p class="wf-text">〒000-0000 〇〇県〇〇市〇〇 0-0-0</p>
        <div class="co02__way"><p class="co02__ttl">電車でお越しの方</p><p class="wf-text">〇〇線「〇〇駅」〇番出口から徒歩0分。出口を出て右へ進み、〇〇の角を左に曲がります。</p></div>
        <div class="co02__way"><p class="co02__ttl">お車でお越しの方</p><p class="wf-text">専用駐車場はありません。近隣のコインパーキングをご利用ください。</p></div>
        <a class="wf-btn" href="#">Googleマップで開く</a>
      </div>
    </div>
  </div>
</section>`,
    css: `.co02__grid { display: grid; grid-template-columns: 1.3fr 1fr; gap: 40px; align-items: stretch; }
.co02__map { min-height: 380px; height: 100%; }
.co02__info { display: flex; flex-direction: column; align-items: flex-start; gap: 14px; }
.co02__way { display: grid; gap: 4px; padding: 14px 0; border-top: 1px solid #ddd; }
.co02__ttl { margin: 0; font-weight: 700; }
@container (max-width: 760px) {
  .co02__grid { grid-template-columns: 1fr; gap: 24px; }
  .co02__map { min-height: 260px; }
}`,
  },
  {
    id: "co03",
    cat: "company",
    name: "代表メッセージ",
    use: "会社紹介・採用サイト・士業や医院の院長挨拶",
    intent: "顔写真と本人の言葉で「誰がやっている会社か」を伝える。冒頭に一文の大きな見出しを置き、本文は3〜4段落で事業への想いを語る。最後に署名を添える。",
    parts: ["左：代表者の写真", "右：一文の見出し・本文 3段落・肩書きと署名"],
    html: `<section class="wf-section co03">
  <div class="wf-inner co03__grid">
    <div class="wf-img co03__photo"></div>
    <div class="co03__body">
      <span class="wf-label">MESSAGE</span>
      <h2 class="wf-h2">想いを一文で伝える見出しが入ります</h2>
      <p class="wf-text">本文の1段落目が入ります。会社を立ち上げたきっかけや、事業を通じて解決したいことを書きます。</p>
      <p class="wf-text">本文の2段落目が入ります。大切にしている考え方や、お客様との向き合い方を書きます。</p>
      <p class="wf-text">本文の3段落目が入ります。これから目指すことと、読み手への呼びかけで締めます。</p>
      <p class="co03__sign"><span class="wf-text">株式会社〇〇 代表取締役</span><strong>氏名</strong></p>
    </div>
  </div>
</section>`,
    css: `.co03__grid { display: grid; grid-template-columns: 0.8fr 1.2fr; gap: 56px; align-items: start; }
.co03__photo { aspect-ratio: 3 / 4; }
.co03__body { display: flex; flex-direction: column; gap: 16px; }
.co03__sign { display: flex; flex-direction: column; align-items: flex-end; gap: 2px; margin: 16px 0 0; }
.co03__sign strong { font-size: 24px; }
@container (max-width: 760px) {
  .co03__grid { grid-template-columns: 1fr; gap: 28px; }
  .co03__photo { max-width: 320px; }
}`,
  },
  {
    id: "co04",
    cat: "company",
    name: "沿革（年表）",
    use: "会社情報・ブランドの歩み・周年サイト",
    intent: "年と出来事を左右に分けて縦に並べ、積み重ねてきた歴史を一覧で見せる。年は左に固定幅でそろえ、出来事は1行で言い切る。",
    parts: ["見出し", "年表 6行（年・月・出来事）", "年の列を縦線でつなぐ"],
    html: `<section class="wf-section co04">
  <div class="wf-inner co04__inner">
    <div class="wf-head"><span class="wf-label">HISTORY</span><h2 class="wf-h2">沿革</h2></div>
    <ol class="wf-list co04__list">
      <li><span class="co04__year">0000年</span><span class="co04__line" aria-hidden="true"></span><span class="co04__dot"></span><p class="wf-text">〇〇県〇〇市にて創業</p></li>
      <li><span class="co04__year">0000年</span><span class="co04__line" aria-hidden="true"></span><span class="co04__dot"></span><p class="wf-text">株式会社〇〇を設立</p></li>
      <li><span class="co04__year">0000年</span><span class="co04__line" aria-hidden="true"></span><span class="co04__dot"></span><p class="wf-text">〇〇事業を開始</p></li>
      <li><span class="co04__year">0000年</span><span class="co04__line" aria-hidden="true"></span><span class="co04__dot"></span><p class="wf-text">本社を〇〇へ移転</p></li>
      <li><span class="co04__year">0000年</span><span class="co04__line" aria-hidden="true"></span><span class="co04__dot"></span><p class="wf-text">〇〇支店を開設</p></li>
      <li><span class="co04__year">2026年</span><span class="co04__line" aria-hidden="true"></span><span class="co04__dot"></span><p class="wf-text">創業〇〇周年を迎える</p></li>
    </ol>
  </div>
</section>`,
    css: `.co04__inner { max-width: 760px; }
.co04__list { display: grid; }
.co04__list li { position: relative; display: grid; grid-template-columns: 7em 24px 1fr; align-items: center; gap: 16px; padding: 14px 0; }
.co04__year { grid-column: 1; grid-row: 1; font-weight: 700; }
.co04__dot { position: relative; z-index: 1; grid-column: 2; grid-row: 1; width: 16px; height: 16px; justify-self: center; border: 3px solid #444; border-radius: 50%; background: #fff; }
/* 縦線は行ごとに引き、最初の行は点から下・最後の行は点から上だけにする */
.co04__line { grid-column: 2; grid-row: 1; justify-self: center; align-self: stretch; width: 2px; margin-block: -14px; background: #c4c4c4; }
.co04__list li:first-child .co04__line { margin-top: 0; align-self: end; height: 50%; }
.co04__list li:last-child .co04__line { margin-bottom: 0; align-self: start; height: 50%; }
.co04__list li .wf-text { grid-column: 3; grid-row: 1; }`,
  },
];
