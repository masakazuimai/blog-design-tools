// 選択肢の語彙。ja=画面表示／en=プロンプトへ出力する英語表現
// en が空文字のものは「指定なし」＝プロンプトに出力しない

export const ASPECTS = [
  { v: "16:9", ja: "16:9 横長", en: "16:9 widescreen" },
  { v: "9:16", ja: "9:16 縦長", en: "9:16 vertical" },
  { v: "1:1", ja: "1:1 正方形", en: "1:1 square" },
  { v: "4:5", ja: "4:5 縦長フィード", en: "4:5 portrait" },
];

export const STYLES = [
  { v: "photo", ja: "実写", en: "photorealistic live-action footage" },
  { v: "cinematic", ja: "シネマティック", en: "cinematic film look, shallow depth of field" },
  { v: "documentary", ja: "ドキュメンタリー", en: "documentary style, natural and candid" },
  { v: "anime", ja: "アニメ", en: "Japanese anime style, cel-shaded" },
  { v: "3d", ja: "3DCG", en: "stylized 3D animation" },
  { v: "illust", ja: "イラスト", en: "hand-drawn illustration style" },
  { v: "motion", ja: "モーショングラフィックス", en: "flat 2D motion graphics" },
];

export const MOODS = [
  { v: "", ja: "指定なし", en: "" },
  { v: "warm", ja: "あたたかい", en: "warm and inviting" },
  { v: "bright", ja: "明るく爽やか", en: "bright and airy" },
  { v: "vivid", ja: "鮮やか", en: "vibrant, saturated colors" },
  { v: "calm", ja: "落ち着いた", en: "calm, muted tones" },
  { v: "dark", ja: "暗く重厚", en: "dark and moody" },
  { v: "nostalgic", ja: "ノスタルジック", en: "nostalgic, film grain" },
];

export const SHOTS = [
  { v: "", ja: "指定なし", en: "" },
  { v: "ews", ja: "超ロング", en: "extreme wide shot" },
  { v: "ws", ja: "ロング", en: "wide shot" },
  { v: "fs", ja: "全身", en: "full shot" },
  { v: "ms", ja: "バストアップ", en: "medium shot" },
  { v: "cu", ja: "アップ", en: "close-up" },
  { v: "ecu", ja: "超アップ", en: "extreme close-up" },
];

export const ANGLES = [
  { v: "", ja: "指定なし", en: "" },
  { v: "eye", ja: "目線の高さ", en: "eye-level angle" },
  { v: "high", ja: "見下ろし", en: "high angle" },
  { v: "low", ja: "見上げ", en: "low angle" },
  { v: "bird", ja: "真上から", en: "bird's-eye view" },
  { v: "ots", ja: "肩越し", en: "over-the-shoulder shot" },
  { v: "pov", ja: "主観", en: "first-person POV" },
];

export const MOVES = [
  { v: "", ja: "指定なし", en: "" },
  { v: "static", ja: "固定", en: "static camera" },
  { v: "pan", ja: "左右に振る", en: "slow pan" },
  { v: "tilt", ja: "上下に振る", en: "slow tilt" },
  { v: "in", ja: "寄っていく", en: "slow dolly-in" },
  { v: "out", ja: "引いていく", en: "slow dolly-out" },
  { v: "track", ja: "追いかける", en: "tracking shot following the subject" },
  { v: "orbit", ja: "周りを回る", en: "orbiting around the subject" },
  { v: "hand", ja: "手持ち", en: "handheld camera" },
  { v: "drone", ja: "空撮", en: "aerial drone shot" },
];

export const LIGHTS = [
  { v: "", ja: "指定なし", en: "" },
  { v: "day", ja: "自然光", en: "natural daylight" },
  { v: "golden", ja: "夕暮れ", en: "golden hour sunlight" },
  { v: "night", ja: "夜", en: "night, low light" },
  { v: "neon", ja: "ネオン", en: "neon lighting" },
  { v: "studio", ja: "スタジオ", en: "soft studio lighting" },
  { v: "back", ja: "逆光", en: "backlit silhouette" },
];

export const TRANSITIONS = [
  { v: "cut", ja: "カット", en: "hard cut" },
  { v: "fade", ja: "フェード", en: "fade to black" },
  { v: "dissolve", ja: "ディゾルブ", en: "cross-dissolve" },
  { v: "whip", ja: "素早いパン", en: "whip pan" },
];

export const SPEECH_LANGS = [
  { v: "ja", ja: "日本語", en: "Japanese" },
  { v: "en", ja: "英語", en: "English" },
];

export const DIALOGUE_MODES = [
  { v: "speak", ja: "声で話す", en: "" },
  { v: "none", ja: "プロンプトに含めない", en: "" },
];

// 声（話者ごと）。年代は英語で voice の前に置ける形容詞にしている
export const VOICE_GENDERS = [
  { v: "", ja: "指定なし", en: "" },
  { v: "male", ja: "男性", en: "male" },
  { v: "female", ja: "女性", en: "female" },
  { v: "neutral", ja: "中性的", en: "androgynous" },
];

export const VOICE_AGES = [
  { v: "", ja: "指定なし", en: "" },
  { v: "child", ja: "子ども", en: "young child's" },
  { v: "teen", ja: "10代", en: "teenage" },
  { v: "young", ja: "20代", en: "young adult" },
  { v: "adult", ja: "30代", en: "adult" },
  { v: "middle", ja: "40〜50代", en: "middle-aged" },
  { v: "senior", ja: "60代以上", en: "elderly" },
];

export const VOICE_TONES = [
  { v: "", ja: "指定なし", en: "" },
  { v: "bright", ja: "明るい", en: "bright, cheerful" },
  { v: "energetic", ja: "元気", en: "energetic" },
  { v: "calm", ja: "落ち着いた", en: "calm" },
  { v: "gentle", ja: "優しい", en: "gentle, warm" },
  { v: "cool", ja: "クール", en: "cool, composed" },
  { v: "deep", ja: "低く渋い", en: "deep, husky" },
  { v: "cute", ja: "かわいい", en: "cute, high-pitched" },
  { v: "powerful", ja: "力強い", en: "powerful" },
  { v: "serious", ja: "真剣", en: "serious" },
  { v: "whisper", ja: "ささやき", en: "soft, whispering" },
];

export const VOICE_SPEEDS = [
  { v: "", ja: "指定なし", en: "" },
  { v: "slow", ja: "ゆっくり", en: "speaking slowly" },
  { v: "fast", ja: "速め", en: "speaking quickly" },
];

export const BGM_GENRES = [
  { v: "lofi", ja: "Lo-fi", en: "lo-fi hip hop" },
  { v: "orch", ja: "オーケストラ", en: "cinematic orchestral" },
  { v: "piano", ja: "ピアノ", en: "solo piano" },
  { v: "acoustic", ja: "アコースティック", en: "acoustic guitar" },
  { v: "electronic", ja: "エレクトロ", en: "electronic" },
  { v: "ambient", ja: "アンビエント", en: "ambient" },
  { v: "pop", ja: "J-POP", en: "upbeat J-pop" },
  { v: "rock", ja: "ロック", en: "rock" },
  { v: "jazz", ja: "ジャズ", en: "jazz" },
];

export const BGM_MOODS = [
  { v: "uplift", ja: "前向き", en: "uplifting" },
  { v: "calm", ja: "穏やか", en: "calm" },
  { v: "emo", ja: "エモい", en: "emotional" },
  { v: "tense", ja: "緊張感", en: "tense" },
  { v: "fun", ja: "楽しい", en: "playful" },
  { v: "epic", ja: "壮大", en: "epic" },
];

// v から語彙を引く（見つからなければ先頭）
export const pick = (list, v) => list.find((o) => o.v === v) || list[0];
