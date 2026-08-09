// UI文言とコピー用コード内テキストの対訳。/ と /en/ は同一のcss/jsを共有し、
// document.documentElement.lang で言語を切り替える。
export const LANG = document.documentElement.lang === "en" ? "en" : "ja";

export const t = (key) => UI[key][LANG];

const UI = {
  codePreviewTitle: { ja: "📋 コードプレビュー", en: "📋 Code preview" },
  colorTitle: { ja: "🎨 色の設定", en: "🎨 Colors" },
  accentLabel: { ja: "アクセント色", en: "Accent color" },
  subLabel: { ja: "サブ色", en: "Sub color" },
  resetColors: { ja: "↺ 色をデフォルトに戻す", en: "↺ Reset colors" },
  copyThis: { ja: "📋 このコードをコピー", en: "📋 Copy this code" },
  copyNote: {
    ja: "CDNの読み込みを含む完全版です。HTMLに貼るだけで動きます。",
    en: "A complete snippet including the CDN. Paste it into your HTML and it runs.",
  },
  replay: { ja: "▶ もう一度", en: "▶ Replay" },
  copyCode: { ja: "📋 コードをコピー", en: "📋 Copy code" },
  copied: { ja: "コピーしました", en: "Copied" },
  copyFailed: { ja: "コピーできませんでした", en: "Could not copy" },
  searchPlaceholder: { ja: "サンプル名で検索", en: "Search samples" },
  noResult: { ja: "該当するサンプルがありません", en: "No samples matched" },
  countNote: { ja: (a, b) => `表示中: ${a}種 / 全${b}種`, en: (a, b) => `Showing ${a} of ${b}` },
};

/** countNote など引数を取る文言用 */
export const tf = (key, ...args) => UI[key][LANG](...args);

/**
 * デモ台（stage）とコピー用コード（code）に含まれる日本語の対訳。
 * キーはコメント記号（// や / * * /）を含めず「中身の文字列」だけを書く。
 * こうしておくと同じ文言がJSコメントでもCSSコメントでもHTML本文でも一律に置換でき、
 * 記号の書き分けによる訳し漏れが起きない。
 */
export const CODE_TEXT_EN = {
  // ---- 全角記号（英語ページでは半角・中黒相当へ置き換える） ----
  "GSAP ・ ScrollTrigger ・ Timeline ・ Stagger ・": "GSAP · ScrollTrigger · Timeline · Stagger ·",
  "COPY &amp; PASTE ・ GSAP ・": "COPY &amp; PASTE · GSAP ·",
  "SCROLL ・ GSAP ・ MARQUEE ・": "SCROLL · GSAP · MARQUEE ·",
  "GSAP ・ ScrollTrigger ・": "GSAP · ScrollTrigger ·",
  "SCROLL ・ GSAP ・": "SCROLL · GSAP ·",
  "＋": "+",

  // ---- デモ台（カード内に表示される文言） ----
  "高さを直接アニメーションさせず、autoの実寸を測ってから動かします。":
    "Instead of animating the height directly, it measures the real auto height first.",
  "点線の枠は拡大しないので、差が分かります": "The dashed frame never scales, so the difference is clear",
  "start / end の線が見えます": "You can see the start / end lines",
  "縞模様のズレ方で速度差が分かります": "The shifting stripes reveal the difference in speed",
  "閉じる時は reverse() で": "Closing uses reverse() to",
  "範囲に入るとクラスが付きます": "A class is added once it enters the range",
  "（戻っても再生されません）": "(scrolling back will not replay it)",
  "穴が広がって中身が現れます": "The hole widens and reveals what is behind",
  "コピペで試せるサンプル集": "Examples you can copy and paste",
  "記事ページの読了率表示に": "Useful as a reading-progress bar",
  "下スクロールで隠れる ↑": "Scroll down to hide it ↑",
  "GSAPで動きをつける": "Add motion with GSAP",
  "出入りのたびに動きます": "It runs every time it enters or leaves",
  "スクロール量に合わせて": "In step with how far you scroll",
  "この中でマウスを動かす": "Move the mouse inside this area",
  "同じ動きを巻き戻します": "play the same motion backwards",
  "長文の導入に有効です": "Effective for long-form introductions",
  "空のまま送信してみる": "Try submitting it empty",
  "離すと巻き戻ります": "Move away and it rewinds",
  "上のバーが伸びます": "the bar above grows",
  "実装したサンプル数": "Examples included",
  "つかんで動かせます": "Grab it and drag",
  "上下にスクロール": "Scroll up and down",
  "そのまま使えます": "and works as-is",
  "濃く表示されます": "is shown in a stronger color",
  "月間ページビュー": "Monthly page views",
  "C（Bと同時）": "C (in sync with B)",
  "マウスを乗せる": "Hover over me",
  "下にスクロール": "Scroll down",
  "背景はゆっくり": "Background: slower",
  "セクション ": "Section ",
  "奥ほどゆっくり": "Further back moves slower",
  "前景は等速": "Foreground: normal speed",
  "GSAPは": "GSAP is",
  "今月の売上": "Revenue this month",
  "はじめる": "Get started",
  "再生位置": "Playback position",
  "本文 ": "Body ",
  "質問 ": "Question ",
  "待機中": "Idle",
  "被写体": "Subject",
  "状態:": "State:",
  "閉じる": "Close",
  "入力欄": "Input field",
  "正確": "Precise",
  "メニュー項目 ": "Menu item ",

  // ---- 基本トゥイーン ----
  "from() は「今の見た目」をゴールにして、指定した状態から動かす":
    "from() treats the current look as the goal and animates from the values you pass",
  "64px下から": "from 64px below",
  "透明から": "from transparent",
  "行き過ぎて戻る＝弾む印象になる": "overshoots then settles back for a springy feel",
  "grid を渡すと「中央から波紋状に」など2次元の順番が指定できる":
    "passing grid lets you order the stagger in 2D, e.g. rippling out from the center",
  "stagger に数値を渡すだけで「1件あたり◯秒ずらす」になる":
    "a plain number means 'offset each item by this many seconds'",
  "メニュー項目 1": "Menu item 1",
  "メニュー項目 2": "Menu item 2",
  "メニュー項目 3": "Menu item 3",
  "fromTo() は開始値と終了値の両方を明示する書き方":
    "fromTo() states both the start and the end values explicitly",
  "主な ease: power1〜4.out / back.out(2) / elastic.out(1, 0.4) / bounce.out / none":
    "common eases: power1-4.out / back.out(2) / elastic.out(1, 0.4) / bounce.out / none",
  "度数で指定（CSSのdeg不要）": "plain degrees (no CSS deg unit needed)",
  "左端を軸にして開く": "open around the left edge",
  "-1 で無限ループ": "-1 means loop forever",
  "折り返して戻る": "play back in reverse each cycle",
  "ローディングインジケーターなどに使える無限往復":
    "an endless bounce, handy for loading indicators",
  "1つのトゥイーンで多段の動きを書ける。timelineを組むまでもない時に便利":
    "multiple steps in a single tween — useful when a full timeline is overkill",

  // ---- タイムライン ----
  "timeline は「順番に並べる箱」。第3引数の位置指定で重ね方を調整する":
    "a timeline is a container that plays things in order; the 3rd argument controls the overlap",
  "要素を少し重ねて再生": "Overlap each element slightly",
  "詳しく見る": "Learn more",
  "0.3秒前倒しで重ねる": "start 0.3s earlier so it overlaps",
  "この時点に名前を付ける": "give this point in time a name",
  "ラベル位置から開始": "start at the label",
  "Bと完全に同時": "exactly in sync with B",
  '位置指定の書き方: "together" / "together+=0.2" / "<"(直前と同時) / ">"(直前の直後)':
    'position formats: "together" / "together+=0.2" / "<" (with previous) / ">" (after previous)',
  '"<" は「直前のトゥイーンと同じ時刻」。"<0.15" で0.15秒だけ遅らせて重ねる':
    '"<" means the same time as the previous tween; "<0.15" nudges it 0.15s later',
  "timeline 側に repeat: -1 を書けば、中身をまとめて無限ループできる":
    "putting repeat: -1 on the timeline loops everything inside it",
  "0 = 先頭から同時": "0 = start together from the beginning",
  "paused: true で作っておき、あとから好きなタイミングで操作する":
    "build it paused, then drive it whenever you like",
  "部品ごとに timeline を関数で作り、親 timeline に add() で組み込む":
    "build a timeline per part in a function, then add() it to the parent timeline",
  "前のグループに少し重ねる": "overlap slightly with the previous group",
  "timeScale は再生中でも即座に効く。1が等速、0.5で半分、2で倍速":
    "timeScale applies instantly, even mid-playback: 1 is normal, 0.5 half speed, 2 double",
  "gsap.globalTimeline.timeScale(0.2) にすればページ全体をスローにできる（デバッグ用）":
    "gsap.globalTimeline.timeScale(0.2) slows the whole page down — handy while debugging",
  "ホバーのたびに新しいトゥイーンを作らず、1本を play/reverse で使い回すのがコツ":
    "reuse one timeline with play/reverse instead of creating a tween on every hover",

  // ---- ScrollTrigger ----
  "トリガーは「まとまり」に1つだけ置き、中身は stagger でずらす":
    "put one trigger on the group and let stagger handle the items",
  "scrub でスクロール位置に直結させると、スクロールを止めた分だけ途中で止まる":
    "with scrub the animation is tied to scroll position, so it stops exactly where you stop",
  "要素の上端が画面下端に来たら開始": "start when the element's top reaches the bottom of the viewport",
  "上端が画面の55%位置まで来たら完了": "finish once the top reaches 55% up the viewport",
  "scrub と併用するとき、stagger は秒数ではなくスクロール範囲の配分として効く":
    "combined with scrub, stagger distributes across the scroll range rather than seconds",
  "覆いは box-shadow だけが担当する。親に背景を敷くと穴が塗り潰されて何も見えない":
    "only the box-shadow covers things; a background on the parent would fill the hole and hide everything",
  "画面の対角線を覆いきる倍率まで拡げる（46px の円なら 9倍で約414px）":
    "scale until it clears the viewport diagonal (a 46px circle at 9× is about 414px)",
  "一度再生したらトリガーを破棄する（登場演出はこれが基本）":
    "kill the trigger after one run — the default choice for entrance animations",
  "順に onEnter / onLeave / onEnterBack / onLeaveBack の挙動を指定する":
    "sets onEnter / onLeave / onEnterBack / onLeaveBack, in that order",
  "指定できる値: play, pause, resume, reverse, restart, reset, complete, none":
    "allowed values: play, pause, resume, reverse, restart, reset, complete, none",
  "scrub を付けると「再生」ではなく「スクロール位置＝再生位置」になる":
    "with scrub, the scroll position *is* the playhead — nothing plays on its own",
  "scrub では none にしないと二重に緩急がつく":
    "use none, or the easing gets applied on top of the scroll easing",
  "数値(例: 0.5)にすると少し遅れて追従して滑らかになる":
    "a number (e.g. 0.5) makes it lag slightly behind, which reads as smoother",
  "前景（等速で流れる）": "Foreground (scrolls at normal speed)",
  "動かす分だけ上下にはみ出させておくのがポイント":
    "let it overflow vertically by however much you plan to move it",
  "画面に入った瞬間から出ていくまでを丸ごと使うと、動く距離が確保できる":
    "spanning from 'enters the viewport' to 'leaves it' gives the layer room to travel",
  "拡大しても隙間が出ないよう、親で刈り取って object-fit: cover を敷く":
    "clip with the parent and use object-fit: cover so no gap appears when it scales",
  "拡大側から等倍へ戻すと「引いていく」印象になる":
    "starting zoomed in and settling at 1 reads as the camera pulling back",
  "... 記事本文 ...": "... article body ...",
  "width ではなく scaleX を動かすとレイアウト計算が走らず滑らかに動く":
    "animating scaleX instead of width avoids layout work and stays smooth",
  "親で隠して、中身を下から押し上げる。文字が「せり上がる」定番表現":
    "clip with the parent and push the child up — the classic text reveal",
  "要素数が多いとき、1件ずつトリガーを作らず「同時に入ってきた分をまとめて」動かす":
    "with many elements, batch the ones that enter together instead of one trigger each",
  "self.direction は下スクロールで 1、上スクロールで -1":
    "self.direction is 1 when scrolling down and -1 when scrolling up",
  "開発中だけ true にして start/end の位置を目視で確認する":
    "turn it on during development to see exactly where start/end sit",

  // ---- スクロール演出 ----
  "高さ = パネル数ぶんの縦スクロール量を確保する":
    "height = the vertical scroll distance the panels need",
  "position:sticky で固定しておけば pin なしでも横スクロールが作れる":
    "with position:sticky you can build horizontal scroll without ScrollTrigger's pin",
  "パネル3枚なら -66.6666（= -100 × (枚数-1) / 枚数）":
    "-66.6666 for 3 panels (= -100 × (count - 1) / count)",
  "重ねて置き、透明度で入れ替える": "stack them and cross-fade",
  "速い": "Fast",
  "軽い": "Light",
  "滑らか": "Smooth",
  "ただの箱をトゥイーンして、その値を表示に反映する":
    "tween a plain object and mirror its value into the DOM",
  "onToggle は範囲に入った時と出た時の両方で呼ばれる。isActive で入った時だけ拾う":
    "onToggle fires on both enter and leave — use isActive to catch only the enter",
  "sticky で重ねる。GSAPは「奥に下がる」表現だけを担当する":
    "sticky does the stacking; GSAP only handles pushing cards back",
  "「次のカード」の位置を基準にして、今のカードを奥へ下げる":
    "use the *next* card as the trigger to push the current one back",
  "Apple公式サイト風の「スクロールでコマ送り」。連番画像の添字をトゥイーンする":
    "Apple-style scroll-driven frame sequence: tween the index of numbered images",
  "整数にスナップしてコマ落ちを防ぐ": "snap to integers so frames never land half-way",
  "timeline 自体に scrollTrigger を渡すと、複数段の動きを1本のスクロールに割り当てられる":
    "giving the timeline a scrollTrigger maps several steps onto one scroll",
  "scrub では duration が「配分の比率」になる":
    "under scrub, duration becomes the share of the scroll each step gets",

  // ---- テキスト・数値 ----
  "transform を効かせるために必須": "required so transforms apply",
  "1文字ずつ span に分解する（有料プラグイン SplitText なしでOK）":
    "split into one span per character (no paid SplitText plugin needed)",
  "小さな動きが 読み心地を 大きく変える": "Small motions change how it reads",
  "単語単位なら分解が軽く、日本語でも読みやすさを保てる":
    "splitting by word is lighter and keeps text readable",
  "文字数は整数でないと1文字が半分だけ出る":
    "the count must be an integer, or a character renders half-typed",
  "カーソルの点滅は steps(1) で「パッと切り替わる」動きにする":
    "steps(1) makes the caret snap on and off instead of fading",
  "stagger 側にも repeat を書くと波が途切れない":
    "repeating inside stagger too keeps the wave seamless",
  "コピペで試せる": "Copy, paste, done",
  "GSAPサンプル集": "GSAP examples",
  "親で刈り取り、子を下から押し上げる。行単位の登場演出の定番":
    "clip with the parent, push the child up — the standard line reveal",
  "100より少し大きくすると下端が見切れない": "slightly over 100 so descenders never peek out",
  "等幅にすると幅が暴れない": "a monospace font keeps the width steady",
  "有料の ScrambleTextPlugin と同等の表現を、確定した文字数をトゥイーンして作る":
    "same effect as the paid ScrambleTextPlugin, by tweening how many chars are settled",
  "桁が動いても幅がガタつかないようにする": "keeps the width stable as digits change",
  "動かす分だけ横に伸ばしておく": "stretch it by however much you plan to slide it",
  "文字に切り抜いた背景の位置をずらすことで、色が流れて見える":
    "sliding the background behind the clipped text makes the color appear to flow",

  // ---- SVG ----
  "有料の DrawSVGPlugin を使わず、dasharray / dashoffset で同じ表現ができる":
    "dasharray / dashoffset gives the same result without the paid DrawSVGPlugin",
  "破線1本分を線の外に逃がして「消えた」状態にする":
    "push one dash past the end of the line so it starts out invisible",
  "送信完了・保存完了のフィードバックに使えるチェックマーク":
    "a checkmark for 'sent' and 'saved' feedback",
  "12時の位置から始めるため": "so the arc starts at 12 o'clock",
  "有料の MorphSVGPlugin なしでも、頂点の数が同じ polygon 同士なら attr で補間できる":
    "no MorphSVGPlugin needed: attr interpolates between polygons with matching point counts",
  "1周期ぶん（この例では200）ちょうど動かすと、継ぎ目なく無限ループする":
    "moving exactly one period (200 here) makes the loop seamless",
  "実際は同じ波形を横に2つ並べて幅を2倍にしておくと途切れない":
    "in production, place two copies side by side at double width so it never gaps",
  "速度差で奥行きが出る": "different speeds create a sense of depth",

  // ---- インタラクション ----
  "quickTo は毎フレーム呼んでも軽い、追従アニメ専用のショートカット":
    "quickTo is a cheap shortcut built for per-frame follow animations",
  "0.4 = 引っ張られる強さ": "0.4 = how strongly it is pulled",
  "追従速度に差をつけると、リングが遅れて付いてくる質感が出る":
    "different follow speeds make the ring trail behind the dot",
  "3D回転には親の perspective が必要": "3D rotation needs perspective on the parent",
  "3D回転は親に perspective が必要": "3D rotation needs perspective on the parent",
  "カード中心からのズレを -1〜1 に正規化して、最大34度まで傾ける":
    "normalize the offset from the card center to -1..1, then tilt up to 34 degrees",
  "クリックしてみる": "Click me",
  "クリックした位置から広がる": "expands from wherever you clicked",
  "使い終わった要素は onComplete で必ず削除する（放置するとDOMが増え続ける）":
    "always remove the element in onComplete, or the DOM keeps growing",
  "スマホでスクロールに奪われないように":
    "stops mobile browsers from stealing the gesture for scrolling",
  "親からはみ出さないように制限する": "keep it inside the parent",
  "質問": "Question",
  "本文": "Body text",
  'GSAPは height: "auto" を扱える（実寸を測ってから数値でアニメーションしてくれる）':
    'GSAP handles height: "auto" — it measures the real height, then animates numerically',
  "モーダルを開く": "Open modal",
  "開閉で2本作らず、1本を play / reverse する。visibility は set() で先に切り替える":
    "one timeline played and reversed; flip visibility up front with set()",
  "面が開ききる少し前から項目を出すと、待たされる感じが消える":
    "starting the items just before the panel finishes opening removes the sense of waiting",
  "ハンドルの x は中心を0とした相対値。0〜1の比率に直して clip-path に渡す":
    "the handle's x is relative to the center; convert it to a 0-1 ratio for clip-path",
  "ラベルは中央に置かない。境界線がラベルを分断して読めなくなるため左右の端へ寄せる":
    "keep the labels off-center — the divider would cut them in half; pin them to the edges",
  "送信": "Submit",
  "repeat + yoyo の短いトゥイーンでシェイクになる。":
    "a short tween with repeat + yoyo is all a shake needs.",
  "clearProps でインラインの transform を消しておくと、後続のCSSと衝突しない":
    "clearProps removes the inline transform afterwards so it cannot clash with your CSS",
  "📋 コピー": "📋 Copy",
  "✓ コピーしました": "✓ Copied",
  "空のトゥイーンは「何もしない間」を作るための定番の書き方":
    "an empty tween is the standard way to insert a pause that does nothing",
  "コピーしたい文字列": "the text you want to copy",

  // ---- 追加分: 基本トゥイーン ----
  "filter も文字列のまま渡せる。ぼかしは重いので対象は小さく絞る":
    "filter can be passed as a plain string; blur is expensive, so keep the target small",
  "skewX を初期値だけに入れると「勢いで歪んで、止まると直る」ように見える":
    "skewing only the start value reads as 'distorted by speed, straight once it stops'",
  "値を関数で渡すと要素ごとに評価される＝1件ずつ違う乱数を割り当てられる":
    "a function is evaluated per element, so every item gets its own random value",
  "clip-path も補間できる。inset の4辺は「上 右 下 左」の順":
    "clip-path interpolates too; inset takes top, right, bottom, left in that order",
  "右側を100%削った＝幅ゼロの状態から": "from 100% clipped on the right, i.e. zero width",
  "横は等速、縦だけ上がって落ちる。2本重ねるだけで放物線になる":
    "constant speed across, up-and-down vertically — two tweens make an arc",
  'from には "start" "center" "end" "edges" "random" が指定できる':
    'from accepts "start", "center", "end", "edges" and "random"',

  // ---- 追加分: タイムライン ----
  "コールバック内の this はそのタイムライン自身を指す（アロー関数だと this が変わるので注意）":
    "inside a callback, this is the timeline itself (an arrow function would change that)",
  "開始": "started",
  "完了": "finished",
  "progress() は 0〜1。引数なしで呼ぶと現在位置の取得になる":
    "progress() takes 0-1; calling it with no argument returns the current position",
  "同じ内容を2つ並べ、1セット分ちょうど動かして戻す＝継ぎ目が見えない":
    "duplicate the content and move exactly one set, so the seam never shows",
  "repeatDelay を入れると「繰り返しの間に一拍置く」＝しつこさが消える":
    "repeatDelay puts a beat between repeats, which stops it feeling nagging",

  // ---- 追加分: ScrollTrigger ----
  "軸を左下に置くと「めくれ上がる」ような入り方になる":
    "anchoring at the bottom-left makes it look like it peels up into place",
  "inset の4辺は「上 右 下 左」。上を100%削ると下から開く":
    "inset is top, right, bottom, left; clipping 100% off the top opens it upward",
  "添字の偶奇で向きを変えるだけ。CSS側の並びと揃えるのを忘れずに":
    "just flip the direction on odd indexes — keep it in sync with your CSS layout",
  "アニメーションをGSAPで書かず、CSSのtransitionに任せたい時はこれが一番手軽":
    "the simplest option when you want CSS transitions to do the animating",
  "snapTo は「進捗のどの間隔で止めるか」。3セクションなら 1/2（区切りは2つ）":
    "snapTo is the interval of progress to land on: 1/2 for three sections (two gaps)",
  "手前ほど大きく動かすと奥行きが出る。同じ設定オブジェクトを使い回せる":
    "move nearer layers further for depth; the same config object can be reused",

  // ---- 追加分: スクロール演出 ----
  "重ねてから左右へ開く": "stack them first, then fan out left and right",
  "スクロールに合わせて": "As you scroll",
  "読んでいる行だけが": "only the line you are reading",
  "行数ぶん to() を並べれば、スクロール量が自動で等分される":
    "one to() per line splits the scroll distance evenly for you",
  "中央のセルを集合点にする": "use the center cell as the meeting point",
  "関数で渡すと (index, element) を受け取れる＝要素ごとに移動量を計算できる":
    "a function receives (index, element), so you can compute the distance per element",
  "巨大な box-shadow で穴の外側を塗りつぶす＝穴が広がると中身が現れる":
    "a huge box-shadow fills everything outside the hole, so widening it reveals the content",
  "下スクロールで正方向、上スクロールで逆方向に流す":
    "run it forwards when scrolling down and backwards when scrolling up",
  "下端を軸にしないと真ん中から伸びる":
    "without a bottom origin it grows from the middle",
  "画面の中央付近を判定線にすると、現在地の切り替わりが自然に見える":
    "putting the boundary near the middle of the viewport makes the switch feel natural",

  // ---- 追加分: テキスト ----
  "最後は先頭に戻す": "wrap back to the first one at the end",
  "同じ文字を2枚重ね、上の塗り版を clip-path で削っておく":
    "stack two copies and clip the filled one on top",
  "桁区切りや通貨記号は Intl.NumberFormat に任せると、ロケール違いにも耐える":
    "leave separators and currency symbols to Intl.NumberFormat so other locales still work",
  "同じ文字を3枚重ね、色ズレした2枚だけを揺らす":
    "stack three copies and jitter only the two color-offset layers",
  "繰り返しのたびに関数を再評価する＝毎回違う乱数になる":
    "re-evaluates the functions on every repeat, so the randomness changes each time",

  // ---- 追加分: SVG ----
  "線と矢じりを別パスにしておくと、描かれる順番を制御できる":
    "keeping the shaft and the head as separate paths lets you control the drawing order",
  "path の d も、コマンドの並びが同じなら attr で補間できる（C の数と順序を揃えるのがコツ）":
    "attr can interpolate a path's d as long as the command sequence matches (same count and order of C)",
  "SVG内で transform-origin を効かせるには transform-box: fill-box が必要":
    "transform-origin only works inside SVG with transform-box: fill-box",
  "線を描き始めた少し後から点を出すと、線に沿って現れるように見える":
    "revealing the dots slightly after the line starts makes them appear to follow it",
  "1本の連続したパスにしておくと、ペンで書いたように順番どおり描かれる":
    "a single continuous path draws in order, like a pen stroke",
  "MotionPathPlugin を使わずとも、getPointAtLength で座標を拾えばパス上を動かせる":
    "getPointAtLength gives you the coordinates, so you can follow a path without MotionPathPlugin",
};

// 短い語が長い語の一部を壊さないよう、必ず長いキーから置換する（例:「記事本文」→「本文」の順）
const SORTED_ENTRIES = Object.entries(CODE_TEXT_EN).sort((a, b) => b[0].length - a[0].length);

/** 英語ページのとき、コピー用コード内の日本語を英訳に差し替える */
export const localizeCode = (code) => {
  if (LANG === "ja") return code;
  return SORTED_ENTRIES.reduce((acc, [ja, en]) => acc.replaceAll(ja, en), code);
};
