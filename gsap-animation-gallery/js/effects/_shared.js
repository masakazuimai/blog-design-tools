// エフェクト定義から共通で使う CDN スニペット。
// コピー用コードは「貼れば動く完全版」にするため、必要なファイルだけを都度含める。
const V = "3.13.0";

export const CDN = `<script src="https://cdn.jsdelivr.net/npm/gsap@${V}/dist/gsap.min.js"><\/script>`;

export const CDN_ST = `<script src="https://cdn.jsdelivr.net/npm/gsap@${V}/dist/gsap.min.js"><\/script>
<script src="https://cdn.jsdelivr.net/npm/gsap@${V}/dist/ScrollTrigger.min.js"><\/script>`;

export const CDN_DRAG = `<script src="https://cdn.jsdelivr.net/npm/gsap@${V}/dist/gsap.min.js"><\/script>
<script src="https://cdn.jsdelivr.net/npm/gsap@${V}/dist/Draggable.min.js"><\/script>`;

/** 同じ要素を n 個並べたHTMLを作る（デモ台のマークアップ用） */
export const repeat = (n, fn) => Array.from({ length: n }, (_, i) => fn(i)).join("");
