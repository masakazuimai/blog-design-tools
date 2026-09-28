// 選択肢の語彙。ja=日本語の画面表示（日本語の確認用プロンプトにも使う）／el=英語の画面表示／en=プロンプトへ出力する英語表現
// en が空文字のものは「指定なし」＝プロンプトに出力しない

export const ASPECTS = [
  { v: "16:9", ja: "16:9 横長", el: "16:9 Landscape", en: "16:9 widescreen" },
  { v: "9:16", ja: "9:16 縦長", el: "9:16 Vertical", en: "9:16 vertical" },
  { v: "1:1", ja: "1:1 正方形", el: "1:1 Square", en: "1:1 square" },
  { v: "4:5", ja: "4:5 縦長フィード", el: "4:5 Portrait", en: "4:5 portrait" },
];

export const STYLES = [
  { v: "photo", ja: "実写", el: "Live action", en: "photorealistic live-action footage" },
  { v: "cinematic", ja: "シネマティック", el: "Cinematic", en: "cinematic film look, shallow depth of field" },
  { v: "documentary", ja: "ドキュメンタリー", el: "Documentary", en: "documentary style, natural and candid" },
  { v: "anime", ja: "アニメ", el: "Anime", en: "Japanese anime style, cel-shaded" },
  { v: "3d", ja: "3DCG", el: "3D CG", en: "stylized 3D animation" },
  { v: "illust", ja: "イラスト", el: "Illustration", en: "hand-drawn illustration style" },
  { v: "motion", ja: "モーショングラフィックス", el: "Motion graphics", en: "flat 2D motion graphics" },
];

export const MOODS = [
  { v: "", ja: "指定なし", el: "None", en: "" },
  { v: "warm", ja: "あたたかい", el: "Warm", en: "warm and inviting" },
  { v: "bright", ja: "明るく爽やか", el: "Bright & airy", en: "bright and airy" },
  { v: "vivid", ja: "鮮やか", el: "Vivid", en: "vibrant, saturated colors" },
  { v: "calm", ja: "落ち着いた", el: "Calm", en: "calm, muted tones" },
  { v: "dark", ja: "暗く重厚", el: "Dark & moody", en: "dark and moody" },
  { v: "nostalgic", ja: "ノスタルジック", el: "Nostalgic", en: "nostalgic, film grain" },
];

export const SHOTS = [
  { v: "", ja: "指定なし", el: "None", en: "" },
  { v: "ews", ja: "超ロング", el: "Extreme wide", en: "extreme wide shot" },
  { v: "ws", ja: "ロング", el: "Wide", en: "wide shot" },
  { v: "fs", ja: "全身", el: "Full", en: "full shot" },
  { v: "ms", ja: "バストアップ", el: "Medium", en: "medium shot" },
  { v: "cu", ja: "アップ", el: "Close-up", en: "close-up" },
  { v: "ecu", ja: "超アップ", el: "Extreme close-up", en: "extreme close-up" },
];

export const ANGLES = [
  { v: "", ja: "指定なし", el: "None", en: "" },
  { v: "eye", ja: "目線の高さ", el: "Eye level", en: "eye-level angle" },
  { v: "high", ja: "見下ろし", el: "High angle", en: "high angle" },
  { v: "low", ja: "見上げ", el: "Low angle", en: "low angle" },
  { v: "bird", ja: "真上から", el: "Bird's-eye", en: "bird's-eye view" },
  { v: "ots", ja: "肩越し", el: "Over the shoulder", en: "over-the-shoulder shot" },
  { v: "pov", ja: "主観", el: "POV", en: "first-person POV" },
];

export const MOVES = [
  { v: "", ja: "指定なし", el: "None", en: "" },
  { v: "static", ja: "固定", el: "Static", en: "static camera" },
  { v: "pan", ja: "左右に振る", el: "Pan", en: "slow pan" },
  { v: "tilt", ja: "上下に振る", el: "Tilt", en: "slow tilt" },
  { v: "in", ja: "寄っていく", el: "Dolly in", en: "slow dolly-in" },
  { v: "out", ja: "引いていく", el: "Dolly out", en: "slow dolly-out" },
  { v: "track", ja: "追いかける", el: "Tracking", en: "tracking shot following the subject" },
  { v: "orbit", ja: "周りを回る", el: "Orbit", en: "orbiting around the subject" },
  { v: "hand", ja: "手持ち", el: "Handheld", en: "handheld camera" },
  { v: "drone", ja: "空撮", el: "Drone", en: "aerial drone shot" },
];

export const LIGHTS = [
  { v: "", ja: "指定なし", el: "None", en: "" },
  { v: "day", ja: "自然光", el: "Daylight", en: "natural daylight" },
  { v: "golden", ja: "夕暮れ", el: "Golden hour", en: "golden hour sunlight" },
  { v: "night", ja: "夜", el: "Night", en: "night, low light" },
  { v: "neon", ja: "ネオン", el: "Neon", en: "neon lighting" },
  { v: "studio", ja: "スタジオ", el: "Studio", en: "soft studio lighting" },
  { v: "back", ja: "逆光", el: "Backlit", en: "backlit silhouette" },
];

export const TRANSITIONS = [
  { v: "cut", ja: "カット", el: "Cut", en: "hard cut" },
  { v: "fade", ja: "フェード", el: "Fade", en: "fade to black" },
  { v: "dissolve", ja: "ディゾルブ", el: "Dissolve", en: "cross-dissolve" },
  { v: "whip", ja: "素早いパン", el: "Whip pan", en: "whip pan" },
];

export const SPEECH_LANGS = [
  { v: "ja", ja: "日本語", el: "Japanese", en: "Japanese" },
  { v: "en", ja: "英語", el: "English", en: "English" },
];

export const DIALOGUE_MODES = [
  { v: "speak", ja: "声で話す", el: "Spoken", en: "" },
  { v: "none", ja: "プロンプトに含めない", el: "Leave out", en: "" },
];

// 声（話者ごと）。年代は英語で voice の前に置ける形容詞にしている
export const VOICE_GENDERS = [
  { v: "", ja: "指定なし", el: "None", en: "" },
  { v: "male", ja: "男性", el: "Male", en: "male" },
  { v: "female", ja: "女性", el: "Female", en: "female" },
  { v: "neutral", ja: "中性的", el: "Androgynous", en: "androgynous" },
];

export const VOICE_AGES = [
  { v: "", ja: "指定なし", el: "None", en: "" },
  { v: "child", ja: "子ども", el: "Child", en: "young child's" },
  { v: "teen", ja: "10代", el: "Teens", en: "teenage" },
  { v: "young", ja: "20代", el: "20s", en: "young adult" },
  { v: "adult", ja: "30代", el: "30s", en: "adult" },
  { v: "middle", ja: "40〜50代", el: "40s–50s", en: "middle-aged" },
  { v: "senior", ja: "60代以上", el: "60+", en: "elderly" },
];

export const VOICE_TONES = [
  { v: "", ja: "指定なし", el: "None", en: "" },
  { v: "bright", ja: "明るい", el: "Bright", en: "bright, cheerful" },
  { v: "energetic", ja: "元気", el: "Energetic", en: "energetic" },
  { v: "calm", ja: "落ち着いた", el: "Calm", en: "calm" },
  { v: "gentle", ja: "優しい", el: "Gentle", en: "gentle, warm" },
  { v: "cool", ja: "クール", el: "Cool", en: "cool, composed" },
  { v: "deep", ja: "低く渋い", el: "Deep", en: "deep, husky" },
  { v: "cute", ja: "かわいい", el: "Cute", en: "cute, high-pitched" },
  { v: "powerful", ja: "力強い", el: "Powerful", en: "powerful" },
  { v: "serious", ja: "真剣", el: "Serious", en: "serious" },
  { v: "whisper", ja: "ささやき", el: "Whisper", en: "soft, whispering" },
];

export const VOICE_SPEEDS = [
  { v: "", ja: "指定なし", el: "None", en: "" },
  { v: "slow", ja: "ゆっくり", el: "Slow", en: "speaking slowly" },
  { v: "fast", ja: "速め", el: "Fast", en: "speaking quickly" },
];

export const BGM_GENRES = [
  { v: "lofi", ja: "Lo-fi", el: "Lo-fi", en: "lo-fi hip hop" },
  { v: "orch", ja: "オーケストラ", el: "Orchestral", en: "cinematic orchestral" },
  { v: "piano", ja: "ピアノ", el: "Piano", en: "solo piano" },
  { v: "acoustic", ja: "アコースティック", el: "Acoustic", en: "acoustic guitar" },
  { v: "electronic", ja: "エレクトロ", el: "Electronic", en: "electronic" },
  { v: "ambient", ja: "アンビエント", el: "Ambient", en: "ambient" },
  { v: "pop", ja: "J-POP", el: "J-pop", en: "upbeat J-pop" },
  { v: "rock", ja: "ロック", el: "Rock", en: "rock" },
  { v: "jazz", ja: "ジャズ", el: "Jazz", en: "jazz" },
];

export const BGM_MOODS = [
  { v: "uplift", ja: "前向き", el: "Uplifting", en: "uplifting" },
  { v: "calm", ja: "穏やか", el: "Calm", en: "calm" },
  { v: "emo", ja: "エモい", el: "Emotional", en: "emotional" },
  { v: "tense", ja: "緊張感", el: "Tense", en: "tense" },
  { v: "fun", ja: "楽しい", el: "Playful", en: "playful" },
  { v: "epic", ja: "壮大", el: "Epic", en: "epic" },
];

// v から語彙を引く（見つからなければ先頭）
export const pick = (list, v) => list.find((o) => o.v === v) || list[0];
