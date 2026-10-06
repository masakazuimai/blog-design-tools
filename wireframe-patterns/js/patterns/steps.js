// 流れ・ステップのパターン
const STEP = (n, title) => `<li class="st01__step">
        ${n > 1 ? `<span class="st01__arrow" aria-hidden="true"><span class="st01__pc">→</span><span class="st01__sp">↓</span></span>` : ""}
        <span class="st01__no">STEP ${n}</span>
        <span class="wf-icon"></span>
        <h3 class="wf-h3">${title}</h3>
        <p class="wf-text">このステップで何をするかの説明が入ります。</p>
      </li>`;

const ROW = (n, title, time, last = false) => `<li class="st02__item">
        ${last ? "" : `<span class="st02__line" aria-hidden="true"></span>`}
        <span class="st02__dot">${n}</span>
        <div class="st02__body">
          <p class="st02__time">${time}</p>
          <h3 class="wf-h3">${title}</h3>
          <p class="wf-text">このステップの内容と、お客様にしていただくことの説明が入ります。</p>
        </div>
      </li>`;

export default [
  {
    id: "st01",
    cat: "steps",
    name: "横並びのステップ（矢印つなぎ）",
    use: "申し込み・利用開始までの流れ",
    intent: "手順を4つ以内に分けて横に並べ、「これだけで始められる」と感じさせる。番号とアイコンで順番を示し、ステップ間の矢印で流れを強調する。",
    parts: ["見出し", "ステップ 4つ（番号・アイコン・見出し・説明）", "ステップ間に矢印"],
    html: `<section class="wf-section st01">
  <div class="wf-inner">
    <div class="wf-head"><span class="wf-label">FLOW</span><h2 class="wf-h2">ご利用の流れ</h2></div>
    <ol class="wf-list st01__list">
      ${STEP(1, "お申し込み")}
      ${STEP(2, "ヒアリング")}
      ${STEP(3, "ご提案")}
      ${STEP(4, "ご利用開始")}
    </ol>
  </div>
</section>`,
    css: `.st01__list { display: grid; grid-template-columns: repeat(4, 1fr); gap: 40px; }
.st01__step { position: relative; display: flex; flex-direction: column; align-items: center; gap: 10px; padding: 24px 16px; border: 2px solid #b5b5b5; border-radius: 8px; text-align: center; }
.st01__arrow { position: absolute; left: -32px; top: 50%; transform: translateY(-50%); font-size: 24px; font-weight: 700; color: #888; }
.st01__sp { display: none; }
.st01__no { font-weight: 700; color: #777; letter-spacing: 0.06em; }
@container (max-width: 760px) {
  .st01__list { grid-template-columns: 1fr; gap: 32px; }
  .st01__arrow { left: 50%; top: -34px; transform: translateX(-50%); }
  .st01__pc { display: none; }
  .st01__sp { display: inline; }
}`,
  },
  {
    id: "st02",
    cat: "steps",
    name: "縦のタイムライン",
    use: "納品までの工程・サービスの進め方",
    intent: "1本の縦線に工程を並べ、各工程にかかる期間を添える。全体の所要期間とお客様側の作業が見え、依頼前の不安（いつ・何をすればいいか）を減らせる。",
    parts: ["見出し", "工程 4つ（番号・期間の目安・見出し・説明）", "左に縦線でつなぐ"],
    html: `<section class="wf-section st02">
  <div class="wf-inner st02__inner">
    <div class="wf-head"><h2 class="wf-h2">制作の進め方</h2></div>
    <ol class="wf-list st02__list">
      ${ROW(1, "お問い合わせ・ヒアリング", "1〜2日")}
      ${ROW(2, "お見積もり・ご契約", "3日〜1週間")}
      ${ROW(3, "制作・確認", "1〜2か月")}
      ${ROW(4, "公開・運用サポート", "公開後", true)}
    </ol>
  </div>
</section>`,
    css: `.st02__inner { max-width: 760px; }
.st02__list { position: relative; display: grid; gap: 32px; }
.st02__item { display: grid; grid-template-columns: 48px 1fr; gap: 20px; position: relative; }
.st02__dot { position: relative; z-index: 1; display: grid; place-items: center; width: 48px; height: 48px; border: 2px solid #444; border-radius: 50%; background: #fff; font-weight: 700; }
.st02__line { position: absolute; left: 23px; top: 48px; bottom: -32px; width: 2px; background: #c4c4c4; }
.st02__body { display: flex; flex-direction: column; gap: 6px; padding-top: 4px; }
.st02__time { margin: 0; font-weight: 700; color: #777; }`,
  },
  {
    id: "st03",
    cat: "steps",
    name: "画面キャプチャつきの手順",
    use: "アプリの使い方・設定方法・申し込み手順の解説",
    intent: "手順ごとに実際の画面を並べ、読み手が自分の画面と見比べながら進められるようにする。番号・見出し・説明・画像を毎回同じ並びにして、迷わせない。",
    parts: ["見出し", "手順 3つ（番号・見出し・説明・画面画像）", "画像は右・SPは説明の下"],
    html: `<section class="wf-section st03">
  <div class="wf-inner st03__inner">
    <div class="wf-head"><h2 class="wf-h2">使い方</h2></div>
    <ol class="wf-list st03__list">
      <li><div class="st03__body"><span class="st03__no">1</span><div><h3 class="wf-h3">手順1の見出し</h3><p class="wf-text">この手順で押すボタンや入力する内容を、画面と対応づけて説明します。</p></div></div><div class="wf-img st03__img"></div></li>
      <li><div class="st03__body"><span class="st03__no">2</span><div><h3 class="wf-h3">手順2の見出し</h3><p class="wf-text">この手順で押すボタンや入力する内容を、画面と対応づけて説明します。</p></div></div><div class="wf-img st03__img"></div></li>
      <li><div class="st03__body"><span class="st03__no">3</span><div><h3 class="wf-h3">手順3の見出し</h3><p class="wf-text">この手順で押すボタンや入力する内容を、画面と対応づけて説明します。</p></div></div><div class="wf-img st03__img"></div></li>
    </ol>
  </div>
</section>`,
    css: `.st03__inner { max-width: 960px; }
.st03__list { display: grid; gap: 24px; }
.st03__list li { display: grid; grid-template-columns: 1fr 1fr; align-items: center; gap: 32px; padding: 24px; border: 2px solid #ddd; border-radius: 8px; }
.st03__body { display: flex; align-items: flex-start; gap: 16px; }
.st03__body > div { display: flex; flex-direction: column; gap: 8px; }
.st03__no { display: grid; place-items: center; flex: 0 0 auto; width: 44px; height: 44px; border-radius: 50%; background: #444; color: #fff; font-weight: 700; font-size: 20px; }
.st03__img { aspect-ratio: 16 / 10; }
@container (max-width: 640px) {
  .st03__list li { grid-template-columns: 1fr; gap: 16px; padding: 18px; }
}`,
  },
  {
    id: "st04",
    cat: "steps",
    name: "フォーム上部の進捗表示",
    use: "申し込み・購入・会員登録など複数画面のフォーム",
    intent: "今どこにいて、あと何画面で終わるのかを示し、途中離脱を減らす。現在のステップだけ塗り、終わったステップにはチェックを付ける。",
    parts: ["ステップ 4つ（番号・名前）を横一列", "完了済み・現在・未着手で見た目を分ける", "ステップ間を線でつなぐ"],
    html: `<div class="wf-section st04">
  <div class="wf-inner wf-inner--slim">
    <ol class="wf-list st04__list">
      <li class="is-done"><span class="st04__dot">✓</span><span class="st04__name">プラン選択</span></li>
      <li class="is-current"><span class="st04__line" aria-hidden="true"></span><span class="st04__dot">2</span><span class="st04__name">お客様情報</span></li>
      <li><span class="st04__line" aria-hidden="true"></span><span class="st04__dot">3</span><span class="st04__name">内容の確認</span></li>
      <li><span class="st04__line" aria-hidden="true"></span><span class="st04__dot">4</span><span class="st04__name">完了</span></li>
    </ol>
  </div>
</div>`,
    css: `.st04 .wf-inner { padding-block: 32px; }
.st04__list { display: grid; grid-template-columns: repeat(4, 1fr); max-width: 760px; margin: 0 auto; }
.st04__list li { position: relative; display: flex; flex-direction: column; align-items: center; gap: 8px; text-align: center; color: #888; }
.st04__line { position: absolute; top: 21px; right: 50%; width: 100%; height: 2px; background: #c4c4c4; }
.st04__list .is-current .st04__line { background: #444; }
.st04__dot { position: relative; z-index: 1; display: grid; place-items: center; width: 44px; height: 44px; border: 2px solid #c4c4c4; border-radius: 50%; background: #fff; font-weight: 700; }
.st04__list .is-done { color: #555; }
.st04__list .is-done .st04__dot { border-color: #444; color: #444; }
.st04__list .is-current { color: #222; font-weight: 700; }
.st04__list .is-current .st04__dot { border-color: #444; background: #444; color: #fff; }
@container (max-width: 480px) {
  .st04__name { display: none; }
  .st04__list .is-current .st04__name { display: block; position: absolute; top: 52px; white-space: nowrap; }
  .st04 .wf-inner { padding-bottom: 56px; }
}`,
  },
];
