// アイコン定義で使い回す共通パーツ
//
// 動きの語彙を draw / spin / pulse / swing / bounce / blink / slide に絞り、
// ここに用意したヘルパー経由で書くことで、種類が増えても見た目の統一感が崩れないようにする。

// 線を描くアニメの下地属性。pathLength で長さを1に正規化し、実際のパス長を測らずに済ませる
export const DRAW = { pathLength: 1, "stroke-dasharray": 1 };

// at は 0〜1 の範囲でなければキーフレームとして成立しないため、遅延指定を安全側に丸める。
// （delay を大きくしすぎると at が 1 を超えて壊れるのを、呼び出し側で気にせず済むようにする）
const offset = (value) => Math.min(1, Math.max(0, value));

// from〜to の区間で線を描く。前後は値を保持して待たせる（複数パーツの順番待ちに使う）
export const drawKeys = (from, to) => [
  { at: 0, "stroke-dashoffset": 1 },
  { at: from, "stroke-dashoffset": 1 },
  { at: to, "stroke-dashoffset": 0 },
  { at: 1, "stroke-dashoffset": 0 },
];

// くるっと1回転
export const spinKeys = () => [
  { at: 0, transform: "rotate(0deg)" },
  { at: 1, transform: "rotate(360deg)" },
];

// とんと弾む
export const pulseKeys = (scale = 1.15) => [
  { at: 0, transform: "scale(1)" },
  { at: 0.2, transform: `scale(${scale})` },
  { at: 0.45, transform: "scale(0.96)" },
  { at: 0.7, transform: "scale(1)" },
  { at: 1, transform: "scale(1)" },
];

// 左右に揺れて収まる
export const swingKeys = (deg = 12) => [
  { at: 0, transform: "rotate(0deg)" },
  { at: 0.15, transform: `rotate(${deg}deg)` },
  { at: 0.4, transform: `rotate(${-deg * 0.8}deg)` },
  { at: 0.62, transform: `rotate(${deg * 0.5}deg)` },
  { at: 0.82, transform: `rotate(${-deg * 0.3}deg)` },
  { at: 1, transform: "rotate(0deg)" },
];

// 指定方向へ跳ねて戻る（矢印やアップロード/ダウンロード系）
export const bounceKeys = (axis = "Y", distance = -4) => [
  { at: 0, transform: `translate${axis}(0)` },
  { at: 0.3, transform: `translate${axis}(${distance}px)` },
  { at: 0.6, transform: `translate${axis}(${distance * 0.3}px)` },
  { at: 1, transform: `translate${axis}(0)` },
];

// 点滅（注意喚起・信号系）
export const blinkKeys = (start = 0) => [
  { at: 0, opacity: 0 },
  { at: offset(start), opacity: 0 },
  { at: offset(start + 0.1), opacity: 1 },
  { at: offset(start + 0.25), opacity: 0.2 },
  { at: offset(start + 0.4), opacity: 1 },
  { at: 1, opacity: 1 },
];

// delay ぶん待ってから跳ねて現れる（複数パーツを順に出す用）
export const popInKeys = (delay = 0) => [
  { at: 0, transform: "scale(0.3)", opacity: 0 },
  { at: offset(delay), transform: "scale(0.3)", opacity: 0 },
  { at: offset(delay + 0.2), transform: "scale(1.12)", opacity: 1 },
  { at: offset(delay + 0.3), transform: "scale(1)", opacity: 1 },
  { at: 1, transform: "scale(1)", opacity: 1 },
];

// 流れて出入りする（送信・共有系）
export const slideKeys = (axis = "X", distance = 8) => [
  { at: 0, transform: `translate${axis}(0)`, opacity: 1 },
  { at: 0.45, transform: `translate${axis}(${distance}px)`, opacity: 0 },
  { at: 0.55, transform: `translate${axis}(${-distance}px)`, opacity: 0 },
  { at: 1, transform: `translate${axis}(0)`, opacity: 1 },
];
