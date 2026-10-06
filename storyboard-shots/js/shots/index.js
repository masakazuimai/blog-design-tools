import MORE_SHOTS from "./more.js?v=20261006l";
import { CATEGORY_EN, META_EN } from "./en-meta.js?v=20261006l";
import { LANG } from "../i18n.js?v=20261006l";

// ショットの定義。vocab は video-scenario-maker の語彙コード（shot/angle/move/light）と共通
// desc は動画生成AIに渡す場面の英語説明（video-scenario-maker の scene.desc にもそのまま入る）

const CATEGORIES_JA = [
  { id: "establish", name: "状況説明" },
  { id: "size", name: "人物の大きさ" },
  { id: "relation", name: "関係・会話" },
  { id: "angle", name: "角度・視点" },
  { id: "move", name: "カメラの動き" },
  { id: "effect", name: "演出・つなぎ" },
];

const RAW_SHOTS = [
  {
    id: "es01",
    cat: "establish",
    name: "空撮の超ロング",
    use: "動画の冒頭・場所が変わったとき",
    intent: "どこで起きている話かを一瞬で伝える。人物を小さく置くと、場所の広さと人物の小ささの対比で物語の始まりらしさが出る。",
    tips: "人物は画面の3分の1の線上に小さく置く。被写体を大きくしたい語（close など）を混ぜない。",
    vocab: { shot: "ews", angle: "", move: "drone", light: "day" },
    desc: "An aerial view of a vast green meadow with a single straight road and one small figure standing on it",
    dur: 4,
    frame: { subject: "landscape", size: "ews", horizon: 58 },
  },
  {
    id: "es02",
    cat: "establish",
    name: "固定のロング",
    use: "場面の始まり・人物の置かれた状況を見せる",
    intent: "カメラを動かさず、人物と周りの空間を一緒に見せる。静かな画なので、次のカットで寄ったときの変化が引き立つ。",
    tips: "背景の情報（街・部屋・季節）を1文で書く。動きを入れたくないので static camera を明記する。",
    vocab: { shot: "ws", angle: "eye", move: "static", light: "day" },
    desc: "A wide shot of a man standing in a quiet residential street in the morning",
    dur: 3,
    frame: { subject: "landscape", size: "ws", horizon: 62 },
  },
  {
    id: "sz01",
    cat: "size",
    name: "全身（フルショット）",
    use: "服装・立ち姿・動作の全体を見せる",
    intent: "頭から足先までを入れて、人物の格好と動きを正確に伝える。歩く・踊るなど体全体の動きはこのサイズで撮る。",
    tips: "full body, head to toe を入れると足先が切れにくい。動作は1つに絞る。",
    vocab: { shot: "fs", angle: "eye", move: "static", light: "neon" },
    desc: "A full-body shot of a woman in a beige trench coat standing on a neon-lit street at night",
    dur: 3,
    frame: { subject: "person", size: "fs" },
  },
  {
    id: "sz02",
    cat: "size",
    name: "バストアップ",
    use: "話す・説明する・リアクション",
    intent: "胸から上で表情と手元の両方が見える、会話の基本サイズ。セリフのあるカットはまずこのサイズを基準にする。",
    tips: "セリフを入れるときはこのサイズが口元を崩しにくい。視線の向き（camera / off-screen）を指定する。",
    vocab: { shot: "ms", angle: "eye", move: "static", light: "day" },
    desc: "A medium shot of a man in a white shirt talking to the camera in a bright cafe",
    dur: 4,
    frame: { subject: "person", size: "ms" },
  },
  {
    id: "sz03",
    cat: "size",
    name: "アップ（顔）",
    use: "感情の山場・決意・驚き",
    intent: "顔だけを大きく映し、言葉にしない感情を見せる。前後をバストアップにしておくと、ここで寄ったことが効く。",
    tips: "表情の変化を1つだけ書く（smiles slowly など）。複数の感情を並べると崩れやすい。",
    vocab: { shot: "cu", angle: "eye", move: "static", light: "day" },
    desc: "A close-up of a woman by a rainy window as she slowly starts to smile",
    dur: 3,
    frame: { subject: "person", size: "cu" },
  },
  {
    id: "sz04",
    cat: "size",
    name: "超アップ（目元・物）",
    use: "緊張・気づきの瞬間・商品の質感",
    intent: "目元や物の一部だけを画面いっぱいに映し、見る人の注意を1点に集める。短く入れると緊張感が出る。",
    tips: "物を撮るときは素材（metal, fabric など）と光の当たり方を書くと質感が出る。",
    vocab: { shot: "ecu", angle: "eye", move: "in", light: "studio" },
    desc: "An extreme close-up of a woman's eyes, looking straight ahead with a focused gaze",
    dur: 2,
    frame: { subject: "eyes" },
  },
  {
    id: "rl01",
    cat: "relation",
    name: "肩越し（オーバーショルダー）",
    use: "会話・対面のやり取り",
    intent: "手前に相手の肩を入れて、2人が向き合っている距離感を出す。切り返すと会話の流れが自然につながる。",
    tips: "手前の人物はぼかす（blurred foreground）と、奥の人物にピントが集まる。",
    vocab: { shot: "ms", angle: "ots", move: "static", light: "day" },
    desc: "An over-the-shoulder shot in a bright meeting room, a woman's shoulder in the foreground and a man talking",
    dur: 4,
    frame: { subject: "ots" },
  },
  {
    id: "rl02",
    cat: "relation",
    name: "2ショット",
    use: "2人の関係性・並んで歩く・向き合う",
    intent: "2人を同じ画面に入れて、距離や向きで関係を見せる。近いほど親しく、離れるほど距離のある関係に見える。",
    tips: "2人の位置（left / right）と向きをはっきり書く。人物の見た目は毎カット同じ言い方で書くと揃いやすい。",
    vocab: { shot: "fs", angle: "eye", move: "static", light: "night" },
    desc: "A man and a woman facing each other on a train platform at night",
    dur: 4,
    frame: { subject: "two" },
  },
  {
    id: "ag01",
    cat: "angle",
    name: "見下ろし（ハイアングル）",
    use: "弱さ・孤独・状況に飲まれている",
    intent: "上から見下ろすと人物が小さく弱く見える。落ち込んでいる場面や、大きな状況の中にいる人物に使う。",
    tips: "high angle looking down を入れる。床や地面が広く映るので、床の質感も一言書くと画が締まる。",
    vocab: { shot: "fs", angle: "high", move: "static", light: "night" },
    desc: "A high-angle shot looking down at a man standing alone in a crosswalk on a rainy night",
    dur: 3,
    frame: { subject: "person", size: "fs" },
  },
  {
    id: "ag02",
    cat: "angle",
    name: "見上げ（ローアングル）",
    use: "強さ・自信・ヒーロー感",
    intent: "下から見上げると人物が大きく力強く見える。決意したあとの一歩や、登場の場面に向く。",
    tips: "low angle looking up と空や天井を入れる。逆光（backlit）と組み合わせると印象が強くなる。",
    vocab: { shot: "fs", angle: "low", move: "static", light: "day" },
    desc: "A low-angle shot looking up at a confident woman against a blue sky and skyscrapers",
    dur: 3,
    frame: { subject: "person", size: "fs" },
  },
  {
    id: "ag03",
    cat: "angle",
    name: "真上から（俯瞰）",
    use: "机の上・料理・配置を見せる・不思議さ",
    intent: "真上から見ると、物の並びや人の配置が図のように分かる。日常ではない視点なので、印象に残るカットになる。",
    tips: "top-down view, directly above を入れる。料理や作業の手元は真上の画が一番伝わる。",
    vocab: { shot: "ms", angle: "bird", move: "static", light: "night" },
    desc: "A top-down view of a man writing in a notebook at a wooden desk under a desk lamp",
    dur: 3,
    frame: { subject: "top" },
  },
  {
    id: "ag04",
    cat: "angle",
    name: "主観（POV）",
    use: "体験の疑似体験・ゲームや旅の目線",
    intent: "登場人物の目に見えている景色をそのまま映し、見る人を当事者にする。手元を入れると誰の視点かが分かる。",
    tips: "first-person POV, hands visible in frame。手の動き（reaching out など）を書くと主観らしくなる。",
    vocab: { shot: "ws", angle: "pov", move: "hand", light: "day" },
    desc: "A first-person view on a forest path in the morning, holding hands with a woman who looks back",
    dur: 3,
    frame: { subject: "pov" },
  },
  {
    id: "mv01",
    cat: "move",
    name: "ゆっくり寄る（ドリーイン）",
    use: "気持ちの高まり・気づき・重要な一言の前",
    intent: "被写体にゆっくり近づくと、見る人の注意が少しずつ人物の内面に向かう。セリフの直前に入れると言葉が重くなる。",
    tips: "slow dolly-in と、どこから（medium）どこまで（close-up）寄るかを書く。速さは slow を基本にする。",
    vocab: { shot: "ms", angle: "eye", move: "in", light: "golden" },
    desc: "The camera slowly moves in toward a woman sitting on a park bench at sunset, lost in thought",
    dur: 4,
    frame: { subject: "person", size: "ms" },
  },
  {
    id: "mv02",
    cat: "move",
    name: "ゆっくり引く（ドリーアウト）",
    use: "余韻・孤独・物語の終わり",
    intent: "人物から離れていくと、周りの空間が広がって人物が小さくなる。終わりや取り残された感覚を出せる。",
    tips: "slow dolly-out revealing the surroundings。最後に何が見えてほしいか（the whole room など）を書く。",
    vocab: { shot: "fs", angle: "eye", move: "out", light: "day" },
    desc: "The camera slowly pulls back from a man standing alone in a wide snowy field",
    dur: 4,
    frame: { subject: "landscape", size: "ws", horizon: 62 },
  },
  {
    id: "mv03",
    cat: "move",
    name: "左右に振る（パン）",
    use: "景色の広がり・人物から人物へ視線を移す",
    intent: "カメラを横に振って、画面に入りきらない広さや、離れた2つのものの関係を見せる。",
    tips: "slow pan from left to right と方向を書く。速く振ると流れて崩れやすいので slow にする。",
    vocab: { shot: "ws", angle: "eye", move: "pan", light: "golden" },
    desc: "A slow pan across a wide beach at sunrise with a woman standing by the water",
    dur: 4,
    frame: { subject: "landscape", size: "ws", horizon: 58 },
  },
];

export const CATEGORIES = LANG === "en"
  ? CATEGORIES_JA.map((c) => ({ ...c, name: CATEGORY_EN[c.id] }))
  : CATEGORIES_JA;

// 英語版は名前・使いどころ・伝わること・コツを差し替える（desc は元から英語）
const localize = (s) => (LANG === "en" ? { ...s, ...META_EN[s.id] } : s);

// 各ショットの写真（ChatGPTで生成し、16:9のWebPにしたもの）。/ と /en/ の両方から同じ画像を指すよう、このファイル基準で解決する
const imageUrl = (id) => new URL(`../../img/${id}.webp`, import.meta.url).href;
export const SHOTS = [...RAW_SHOTS, ...MORE_SHOTS].map((s) => ({ ...localize(s), image: imageUrl(s.id) }));

const BY_ID = new Map(SHOTS.map((s) => [s.id, s]));
export const getShot = (id) => BY_ID.get(id);
export const categoryName = (id) => CATEGORIES.find((c) => c.id === id)?.name ?? id;
