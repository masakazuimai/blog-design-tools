const WORDS = {
  ja: [
    "朝の港", "森の小道", "夕焼けの丘", "雨の街角", "雪の駅", "花の市場",
    "夜の灯台", "青い湖", "砂の道", "星の空", "秋の並木", "霧の橋",
    "春の川", "風の草原", "古い本屋", "海辺のカフェ", "山の小屋", "月の庭",
    "灯りの路地", "白い灯台", "麦の畑", "氷の湖", "南の島", "朝焼けの空",
  ],
  en: [
    "Harbor at dawn", "Forest path", "Sunset hill", "Rainy corner", "Snowy station", "Flower market",
    "Night lighthouse", "Blue lake", "Sand road", "Starry sky", "Autumn trees", "Misty bridge",
    "Spring river", "Windy meadow", "Old bookshop", "Seaside cafe", "Mountain hut", "Moon garden",
    "Lantern alley", "White lighthouse", "Wheat field", "Frozen lake", "Southern island", "Morning sky",
  ],
};

export const word = (i, lang) => {
  const list = WORDS[lang] || WORDS.ja;
  return list[i % list.length];
};

export const hue = (i, n) => Math.round((i * 360) / n);

export const CARD_CSS = `.cg-card {
  display: grid;
  align-content: end;
  padding: 12px 14px;
  border-radius: 12px;
  color: #fff;
  font-weight: 700;
  font-size: 16px;
  line-height: 1.35;
  background: linear-gradient(150deg, oklch(0.74 0.13 var(--h)), oklch(0.5 0.15 calc(var(--h) + 40)));
}`;
