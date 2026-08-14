// アニメーション定義（構造化データ）から CSS を生成する
//
// ⚠️ 設計上の制約: キーフレームは必ず tracks[].keys の構造化データで保持し、
//    生のCSS文字列では持たないこと。任意の時刻 t の値を計算できる形を維持しておかないと、
//    将来のGIF書き出し（コマ単位のサンプリング）が後付けできなくなる。

// アニメ終了後に最終キーフレームの状態で静止させる
const FILL_MODE = "both";

// at（0〜1）をキーフレームの % 表記へ
function toPercent(at) {
  return `${+(at * 100).toFixed(3)}%`;
}

// キーフレーム1件分の宣言。at 以外のキーはすべてCSSプロパティとして扱う
function declarationsOf(key) {
  return Object.keys(key)
    .filter((name) => name !== "at")
    .map((name) => `${name}: ${key[name]};`)
    .join(" ");
}

// track.part は文字列または文字列配列（複数パーツを同じ動きで回すケース）
function partsOf(track) {
  return Array.isArray(track.part) ? track.part : [track.part];
}

function keyframeName(icon, track) {
  return `kf-${icon.id}-${partsOf(track)[0]}`;
}

// @keyframes 定義。速度やループ回数に依存しないため、1アイコンにつき1回だけ出力すればよい
export function buildKeyframes(icon) {
  if (!icon.anim) return "";
  return icon.anim.tracks
    .map((track) => {
      const body = track.keys
        .map((key) => `  ${toPercent(key.at)} { ${declarationsOf(key)} }`)
        .join("\n");
      return `@keyframes ${keyframeName(icon, track)} {\n${body}\n}`;
    })
    .join("\n");
}

// animation プロパティ側のルール。scope を変えれば同じアイコンを別条件で再生できる
// （一覧カード＝3回固定 / 設定パネル＝ユーザー指定のループ回数）
export function buildRules(icon, { speed = 1, loop = "infinite", scope = "" } = {}) {
  if (!icon.anim) return "";
  const duration = (icon.anim.duration * speed).toFixed(2);
  const easing = icon.anim.easing || "ease-in-out";

  return icon.anim.tracks
    .map((track) => {
      const selector = partsOf(track)
        .map((part) => `${scope}.p-${part}`)
        .join(", ");

      // SVG要素は transform-origin の基準ボックスが既定でユーザー座標系の原点になるため、
      // transform-box を明示しないと回転・拡縮の軸が意図しない位置へずれる。
      // view-box を使うと origin を viewBox 座標で書けて、複数パーツで同じ軸を共有できる
      const origin = track.origin
        ? `\n  transform-box: view-box;\n  transform-origin: ${track.origin};`
        : "";

      return `${selector} {${origin}\n  animation: ${keyframeName(icon, track)} ${duration}s ${easing} ${loop} ${FILL_MODE};\n}`;
    })
    .join("\n");
}

// 書き出すSVGファイルに埋め込む用（ルールとキーフレームを1つにまとめる）
export function buildInlineCss(icon, options) {
  return [buildRules(icon, { ...options, scope: "" }), buildKeyframes(icon)]
    .filter(Boolean)
    .join("\n");
}
