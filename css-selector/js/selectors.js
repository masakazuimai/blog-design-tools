/* CSSセレクタ辞典 データ定義
   - CATEGORIES: 絞り込みチップ
   - SELECTORS : 44種のセレクタ（sel=セレクタ文字列 / css=サンプル / desc=解説 / note=状態依存の補足）
   - DEMO_HTML : iframe（srcdoc）に流し込むデモ文書。ライブCSSはこの中だけに閉じ込める
*/

export const CATEGORIES = [
  { id: "all", label: "すべて" },
  { id: "basic", label: "基本" },
  { id: "hierarchy", label: "階層・兄弟" },
  { id: "attr", label: "属性" },
  { id: "pseudo", label: "疑似クラス" },
  { id: "element", label: "疑似要素" },
  { id: "form", label: "フォーム状態" },
];

/** 状態依存（マウス・フォーカス）で見た目が変わるセレクタに付ける共通の補足文 */
const STATE_NOTE = "この状態はユーザー操作中だけ発生します。ハイライトは対象要素の位置を示すもので、実際の見た目はデモ内でマウスを乗せる・クリックすると確認できます。";

export const SELECTORS = [
  /* ---------- 基本 ---------- */
  {
    sel: "p",
    cat: "basic",
    label: "要素セレクタ（タグ）",
    css: "p {\n  color: #dc2626;\n}",
    desc: "HTMLのタグ名をそのまま書く、最も基本のセレクタです。ページ内のすべての p が対象になるので、範囲が広くなりすぎないか注意します。",
  },
  {
    sel: ".item",
    cat: "basic",
    label: "クラスセレクタ",
    css: ".item {\n  background: #fef9c3;\n}",
    desc: "class属性の値を「.クラス名」で指定します。同じクラスを何個の要素にも付けられるため、実務でいちばん使う指定方法です。",
  },
  {
    sel: "#header",
    cat: "basic",
    label: "IDセレクタ",
    css: "#header {\n  font-weight: 700;\n}",
    desc: "id属性を「#ID名」で指定します。IDは1ページに1つだけ。詳細度がとても高く後から上書きしづらいので、装飾目的での多用は避けます。",
  },
  {
    sel: "*",
    cat: "basic",
    label: "全称（ユニバーサル）セレクタ",
    css: "* {\n  letter-spacing: 0.04em;\n}",
    desc: "すべての要素にマッチします。リセットCSSなどで使いますが、対象数が多く詳細度は0なので、影響範囲とパフォーマンスに気を配ります。",
  },
  {
    sel: "h1, h2",
    cat: "basic",
    label: "グループ（カンマ区切り）",
    css: "h1,\nh2 {\n  color: #b91c1c;\n}",
    desc: "カンマで区切ると、複数のセレクタに同じスタイルをまとめて当てられます。ひとつでも解釈できない書き方が混ざると、ルール全体が無視される点に注意します。",
  },

  /* ---------- 階層・兄弟 ---------- */
  {
    sel: "div p",
    cat: "hierarchy",
    label: "子孫セレクタ（半角スペース）",
    css: "div p {\n  border-left: 3px solid #2563eb;\n  padding-left: 8px;\n}",
    desc: "「div の中にある p」を、何階層下でも対象にします。孫・ひ孫まで含むため、意図せず広く当たりやすい書き方です。",
  },
  {
    sel: "ul > li",
    cat: "hierarchy",
    label: "子セレクタ（>）",
    css: "ul > li {\n  list-style: square;\n}",
    desc: "直下の子だけを対象にします。子孫セレクタと違って、さらに深い階層の要素には当たりません。",
  },
  {
    sel: "h2 + p",
    cat: "hierarchy",
    label: "隣接兄弟セレクタ（+）",
    css: "h2 + p {\n  color: #15803d;\n}",
    desc: "直後に並ぶ兄弟要素を1つだけ対象にします。「見出しの直後の段落だけ余白を詰める」といった調整に使います。",
  },
  {
    sel: "h2 ~ p",
    cat: "hierarchy",
    label: "一般兄弟セレクタ（~）",
    css: "h2 ~ p {\n  font-style: italic;\n}",
    desc: "同じ親の中で、その要素より後ろにある兄弟すべてを対象にします。直後の1つに限定される + との違いを押さえておきます。",
  },

  /* ---------- 属性 ---------- */
  {
    sel: "a[href]",
    cat: "attr",
    label: "属性セレクタ（属性がある）",
    css: "a[href] {\n  color: #ea580c;\n}",
    desc: "指定した属性を持つ要素にマッチします。値は問いません。href の無い a を除外したいときに使えます。",
  },
  {
    sel: 'input[type="text"]',
    cat: "attr",
    label: "属性セレクタ（完全一致 =）",
    css: 'input[type="text"] {\n  border: 2px solid #db2777;\n}',
    desc: "属性の値が完全に一致する要素だけを対象にします。フォーム部品を種類ごとに装飾するときの定番です。",
  },
  {
    sel: '[title~="flower"]',
    cat: "attr",
    label: "属性セレクタ（単語一致 ~=）",
    css: '[title~="flower"] {\n  background: #dcfce7;\n}',
    desc: "半角スペース区切りの値の中に、その単語がまるごと含まれる場合にマッチします。部分文字列ではなく「単語」単位の判定です。",
  },
  {
    sel: '[lang|="ja"]',
    cat: "attr",
    label: "属性セレクタ（接頭辞 |=）",
    css: '[lang|="ja"] {\n  color: #1e3a8a;\n}',
    desc: "値がその文字列と完全一致するか、ハイフン区切りで始まる場合にマッチします（ja と ja-JP の両方）。言語コード判定のために用意された記法です。",
  },
  {
    sel: 'a[href^="https"]',
    cat: "attr",
    label: "属性セレクタ（前方一致 ^=）",
    css: 'a[href^="https"] {\n  text-decoration: underline wavy;\n}',
    desc: "値がその文字列で始まる要素にマッチします。外部リンクやhttpsリンクの判定に使えます。",
  },
  {
    sel: 'a[href$=".pdf"]',
    cat: "attr",
    label: "属性セレクタ（後方一致 $=）",
    css: 'a[href$=".pdf"] {\n  color: #be123c;\n}',
    desc: "値がその文字列で終わる要素にマッチします。拡張子ごとにファイルアイコンを出し分ける用途が定番です。",
  },
  {
    sel: '[class*="btn"]',
    cat: "attr",
    label: "属性セレクタ（部分一致 *=）",
    css: '[class*="btn"] {\n  border-radius: 999px;\n}',
    desc: "値のどこかにその文字列が含まれていればマッチします。単語単位の ~= より緩いぶん、意図しない要素も拾いやすい点に注意します。",
  },

  /* ---------- 疑似クラス ---------- */
  {
    sel: "a:link",
    cat: "pseudo",
    label: ":link（未訪問リンク）",
    css: "a:link {\n  color: #2563eb;\n}",
    desc: "href を持つ、まだ訪問していないリンクにマッチします。:visited と対で使います。",
    note: STATE_NOTE,
  },
  {
    sel: "a:visited",
    cat: "pseudo",
    label: ":visited（訪問済みリンク）",
    css: "a:visited {\n  color: #7c3aed;\n}",
    desc: "訪問済みのリンクにマッチします。閲覧履歴の漏洩を防ぐため、変更できるプロパティが色など一部に制限されています。",
    note: STATE_NOTE,
  },
  {
    sel: "a:hover",
    cat: "pseudo",
    label: ":hover（マウスが乗っている）",
    css: "a:hover {\n  background: #fde68a;\n}",
    desc: "ポインタが乗っている間だけ適用されます。書く順番は :link → :visited → :hover → :active（LVHA順）が基本です。",
    note: STATE_NOTE,
  },
  {
    sel: "a:active",
    cat: "pseudo",
    label: ":active（押されている間）",
    css: "a:active {\n  color: #dc2626;\n}",
    desc: "クリックして指を離すまでの一瞬だけ適用されます。押した手応えを表現するのに使います。",
    note: STATE_NOTE,
  },
  {
    sel: "li:first-child",
    cat: "pseudo",
    label: ":first-child（最初の子）",
    css: "li:first-child {\n  color: #2563eb;\n}",
    desc: "親から見て最初の子要素にマッチします。タグの種類は問わないため、先頭が別のタグだと当たりません。",
  },
  {
    sel: "li:last-child",
    cat: "pseudo",
    label: ":last-child（最後の子）",
    css: "li:last-child {\n  color: #7c3aed;\n}",
    desc: "親から見て最後の子要素にマッチします。リストの最終行だけ区切り線を消す、といった調整に使います。",
  },
  {
    sel: "li:nth-child(2)",
    cat: "pseudo",
    label: ":nth-child(n)（n番目の子）",
    css: "li:nth-child(2) {\n  font-weight: 700;\n}",
    desc: "何番目の子かで指定します。2n（偶数）・odd・3n+1 のような式も書けるので、ストライプ表示にも使えます。",
  },
  {
    sel: "p:nth-of-type(2)",
    cat: "pseudo",
    label: ":nth-of-type(n)（同じタグのn番目）",
    css: "p:nth-of-type(2) {\n  color: #0f766e;\n}",
    desc: "同じタグの中で何番目かを数えます。間に別のタグが挟まっても数え方が崩れないのが :nth-child との違いです。",
  },
  {
    sel: "p:first-of-type",
    cat: "pseudo",
    label: ":first-of-type（同じタグの最初）",
    css: "p:first-of-type {\n  text-decoration: underline;\n}",
    desc: "同じ親の中で、そのタグとして最初に現れる要素にマッチします。リード文だけ強調したいときなどに便利です。",
  },
  {
    sel: "p:last-of-type",
    cat: "pseudo",
    label: ":last-of-type（同じタグの最後）",
    css: "p:last-of-type {\n  background: #f1f5f9;\n}",
    desc: "同じ親の中で、そのタグとして最後に現れる要素にマッチします。",
  },
  {
    sel: ".only-parent p:only-child",
    cat: "pseudo",
    label: ":only-child（ひとりっ子）",
    css: ".only-parent p:only-child {\n  color: #dc2626;\n}",
    desc: "兄弟が1つも無い、唯一の子要素にマッチします。中身が1件だけのときレイアウトを変える、といった条件分岐に使えます。",
  },
  {
    sel: "div p:only-of-type",
    cat: "pseudo",
    label: ":only-of-type（同じタグが1つだけ）",
    css: "div p:only-of-type {\n  border: 1px solid #dc2626;\n}",
    desc: "同じ親の中に、そのタグが1つしか無い場合にマッチします。他のタグの兄弟がいても構わない点が :only-child との違いです。",
  },
  {
    sel: "p:not(.item)",
    cat: "pseudo",
    label: ":not()（除外）",
    css: "p:not(.item) {\n  color: #15803d;\n}",
    desc: "カッコ内の条件に当てはまらない要素を対象にします。「.item 以外の p」のような書き方ができ、カンマ区切りで複数条件も除外できます。",
  },
  {
    sel: "div:empty",
    cat: "pseudo",
    label: ":empty（中身が空）",
    css: "div:empty {\n  min-height: 24px;\n  background: #e2e8f0;\n}",
    desc: "子要素もテキストも持たない要素にマッチします。半角スペースや改行が入っていると空とはみなされません（HTMLコメントは無視されます）。",
  },

  /* ---------- 疑似要素 ---------- */
  {
    sel: "p::before",
    cat: "element",
    label: "::before（前に差し込む）",
    css: 'p::before {\n  content: "★";\n  margin-right: 0.25em;\n}',
    desc: "要素の内容の直前に、CSSだけで疑似的な中身を差し込みます。content プロパティの指定が必須です。",
  },
  {
    sel: "p::after",
    cat: "element",
    label: "::after（後ろに差し込む）",
    css: 'p::after {\n  content: "☆";\n  margin-left: 0.25em;\n}',
    desc: "要素の内容の直後に中身を差し込みます。装飾目的で使い、読み上げに必要な情報は入れないのが原則です。",
  },
  {
    sel: "p::first-letter",
    cat: "element",
    label: "::first-letter（1文字目）",
    css: "p::first-letter {\n  font-size: 180%;\n  color: #be123c;\n}",
    desc: "ブロック要素の1文字目だけを装飾します。雑誌のようなドロップキャップを作れます。",
  },
  {
    sel: "p::first-line",
    cat: "element",
    label: "::first-line（1行目）",
    css: "p::first-line {\n  font-weight: 700;\n}",
    desc: "表示上の1行目だけを装飾します。幅が変われば対象になる文字数も変わる、レイアウト依存の指定です。",
  },

  /* ---------- フォーム状態 ---------- */
  {
    sel: "input:checked",
    cat: "form",
    label: ":checked（選択済み）",
    css: "input:checked {\n  outline: 2px solid #dc2626;\n}",
    desc: "チェックされたチェックボックス・ラジオボタンにマッチします。隣接兄弟セレクタと組み合わせると、JavaScript無しで表示を切り替えられます。",
  },
  {
    sel: "input:disabled",
    cat: "form",
    label: ":disabled（操作できない）",
    css: "input:disabled {\n  background: #e2e8f0;\n}",
    desc: "disabled 属性が付いて操作できない状態の部品にマッチします。読み上げソフトからも無効として扱われます。",
  },
  {
    sel: "input:enabled",
    cat: "form",
    label: ":enabled（操作できる）",
    css: "input:enabled {\n  background: #ffffff;\n}",
    desc: "操作できる状態の部品にマッチします。:disabled の対になる指定です。",
  },
  {
    sel: "input:focus",
    cat: "form",
    label: ":focus（入力中）",
    css: "input:focus {\n  outline: 3px solid #6366f1;\n}",
    desc: "クリックやTabキーで選択されている間だけ適用されます。アクセシビリティ上、フォーカスの見た目を消さないことが原則です。",
    note: STATE_NOTE,
  },
  {
    sel: "input:required",
    cat: "form",
    label: ":required（必須項目）",
    css: "input:required {\n  border: 2px solid #dc2626;\n}",
    desc: "required 属性が付いた入力欄にマッチします。必須マークを自動で表示する用途に使えます。",
  },
  {
    sel: "input:optional",
    cat: "form",
    label: ":optional（任意項目）",
    css: "input:optional {\n  border: 2px solid #15803d;\n}",
    desc: "required が付いていない入力欄にマッチします。:required の対になる指定です。",
  },
  {
    sel: "input:valid",
    cat: "form",
    label: ":valid（入力内容が妥当）",
    css: "input:valid {\n  background: #dcfce7;\n}",
    desc: "type や pattern の条件を満たしている入力欄にマッチします。制約が何も無い入力欄も常に妥当と判定される点に注意します。",
  },
  {
    sel: "input:invalid",
    cat: "form",
    label: ":invalid（入力内容が不正）",
    css: "input:invalid {\n  background: #fee2e2;\n}",
    desc: "条件を満たしていない入力欄にマッチします。未入力の必須項目も対象になるため、初期表示から赤くなりがちです。操作後だけに限定したいときは :user-invalid を使います。",
  },
  {
    sel: "input:read-only",
    cat: "form",
    label: ":read-only（編集できない）",
    css: "input:read-only {\n  background: #f1f5f9;\n}",
    desc: "readonly 属性が付いた、値は読めるが編集できない入力欄にマッチします。入力欄以外の通常の要素も対象になります。",
  },
  {
    sel: "input:read-write",
    cat: "form",
    label: ":read-write（編集できる）",
    css: "input:read-write {\n  background: #ffffff;\n}",
    desc: "編集可能な入力欄にマッチします。readonly でも disabled でもない通常の入力欄が対象です。",
  },
];

/* デモ文書。ライブCSSとハイライトはこの iframe の中だけで完結する */
export const DEMO_HTML = `<!doctype html>
<html lang="ja">
<head>
<meta charset="utf-8">
<title>CSSセレクタ デモ</title>
<style>
  * { box-sizing: border-box; }
  body {
    margin: 0;
    padding: 16px;
    background: #f8fafc;
    color: #1e293b;
    font-family: "Noto Sans JP", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    font-size: 16px;
    line-height: 1.7;
  }
  .demo-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: 14px;
  }
  .dcard {
    background: #fff;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    padding: 14px;
  }
  .ttl {
    font-size: 16px;
    font-weight: 700;
    color: #475569;
    border-bottom: 1px solid #e2e8f0;
    padding-bottom: 6px;
    margin-bottom: 10px;
  }
  h1 { font-size: 20px; margin: 0 0 8px; }
  h2 { font-size: 17px; margin: 12px 0 6px; }
  p { margin: 6px 0; }
  ul { margin: 6px 0; padding-left: 22px; }
  a { color: #1d4ed8; }
  input { font-size: 16px; padding: 6px 8px; border: 1px solid #cbd5e1; border-radius: 6px; }
  form { display: grid; gap: 8px; }
  label { display: block; }
  .nest, .only-parent { border: 1px dashed #94a3b8; border-radius: 8px; padding: 8px; }
  .btn-primary { display: inline-block; padding: 4px 12px; background: #e0e7ff; }
  .empty-box { border: 1px dashed #cbd5e1; border-radius: 8px; }
  nav ul { list-style: none; padding: 0; display: flex; gap: 12px; flex-wrap: wrap; }
</style>
<style id="hl"></style>
<style id="live"></style>
</head>
<body>
<div class="demo-grid">
  <section class="dcard">
    <div class="ttl">基本（タグ / クラス / ID）</div>
    <h1 id="header">サイトヘッダー（#header）</h1>
    <h2>見出し h2</h2>
    <p class="item">段落 p（.item 付き）</p>
    <p>段落 p（クラスなし）</p>
  </section>

  <section class="dcard">
    <div class="ttl">階層・兄弟</div>
    <div class="nest">
      <p>div の中の p（子孫）</p>
      <ul>
        <li>li-1</li>
        <li>li-2</li>
        <li>li-3</li>
      </ul>
      <h2>兄弟の起点 h2</h2>
      <p>h2 の直後の p（+ の対象）</p>
      <p>さらに後ろの p（~ だけの対象）</p>
    </div>
  </section>

  <section class="dcard">
    <div class="ttl">属性</div>
    <p><a href="https://example.com" title="red flower photo">HTTPSリンク（title に flower）</a></p>
    <p><a href="report.pdf">PDFリンク</a></p>
    <p><input type="text" placeholder="type=&quot;text&quot; の入力欄"></p>
    <p class="btn-primary">class に btn を含む要素</p>
    <div lang="ja-JP">lang="ja-JP" の要素</div>
  </section>

  <section class="dcard">
    <div class="ttl">疑似クラス（構造）</div>
    <ul>
      <li>最初の子</li>
      <li>2番目の子</li>
      <li>最後の子</li>
    </ul>
    <div class="only-parent"><p>唯一の子（:only-child）</p></div>
    <div class="nest">
      <p>同じ型の1番目の段落</p>
      <p>同じ型の2番目の段落</p>
      <p>同じ型の最後の段落</p>
    </div>
    <div class="empty-box"></div>
  </section>

  <section class="dcard">
    <div class="ttl">フォーム状態</div>
    <form>
      <label><input type="checkbox" checked> checked のチェックボックス</label>
      <label><input type="checkbox"> 未チェックのチェックボックス</label>
      <input type="text" value="通常の入力欄">
      <input type="text" value="disabled の入力欄" disabled>
      <input type="text" value="readonly の入力欄" readonly>
      <input type="text" placeholder="必須（未入力なので invalid）" required>
      <input type="email" value="mail@example.com">
    </form>
  </section>

  <section class="dcard">
    <div class="ttl">疑似要素</div>
    <p>疑似要素のテスト段落です。1文字目や1行目の装飾、前後への差し込みを確認できます。折り返しが起きる程度の長さにしてあります。</p>
  </section>

  <section class="dcard">
    <div class="ttl">ナビゲーション（リンク状態）</div>
    <nav>
      <ul>
        <li><a href="#news">News</a></li>
        <li><a href="#articles">Articles</a></li>
        <li><a href="#contact">Contact</a></li>
      </ul>
    </nav>
  </section>
</div>
</body>
</html>`;
