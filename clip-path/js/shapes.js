// 定番の clip-path 形状プリセット。座標はパーセント（0〜100）の [x, y] 配列。
// polygon 形状はここから読み込み、本体ツールでドラッグ編集できる。
// label=日本語 / labelEn=英語（/en/ で使用）。

export const SHAPES = [
  { key: "triangle", label: "三角形", labelEn: "Triangle", points: [[50, 0], [0, 100], [100, 100]] },
  { key: "trapezoid", label: "台形", labelEn: "Trapezoid", points: [[20, 0], [80, 0], [100, 100], [0, 100]] },
  { key: "parallelogram", label: "平行四辺形", labelEn: "Parallelogram", points: [[25, 0], [100, 0], [75, 100], [0, 100]] },
  { key: "rhombus", label: "ひし形", labelEn: "Rhombus", points: [[50, 0], [100, 50], [50, 100], [0, 50]] },
  { key: "pentagon", label: "五角形", labelEn: "Pentagon", points: [[50, 0], [100, 38], [82, 100], [18, 100], [0, 38]] },
  { key: "bevel", label: "ベベル", labelEn: "Bevel", points: [[20, 0], [80, 0], [100, 20], [100, 80], [80, 100], [20, 100], [0, 80], [0, 20]] },
  { key: "right-arrow", label: "右矢印", labelEn: "Right arrow", points: [[0, 20], [60, 20], [60, 0], [100, 50], [60, 100], [60, 80], [0, 80]] },
  { key: "left-arrow", label: "左矢印", labelEn: "Left arrow", points: [[40, 0], [40, 20], [100, 20], [100, 80], [40, 80], [40, 100], [0, 50]] },
  { key: "right-point", label: "右ポイント", labelEn: "Right point", points: [[0, 0], [75, 0], [100, 50], [75, 100], [0, 100]] },
  { key: "left-point", label: "左ポイント", labelEn: "Left point", points: [[25, 0], [100, 0], [100, 100], [25, 100], [0, 50]] },
  { key: "chevron", label: "シェブロン", labelEn: "Chevron", points: [[75, 0], [100, 50], [75, 100], [0, 100], [25, 50], [0, 0]] },
  { key: "star", label: "星", labelEn: "Star", points: [[50, 0], [61, 35], [98, 35], [68, 57], [79, 91], [50, 70], [21, 91], [32, 57], [2, 35], [39, 35]] },
  { key: "hexagram", label: "六芒星", labelEn: "Hexagram", points: [[50, 0], [63, 25], [100, 25], [75, 50], [100, 75], [63, 75], [50, 100], [37, 75], [0, 75], [25, 50], [0, 25], [37, 25]] },
  { key: "burst", label: "バースト", labelEn: "Burst", points: [[50, 0], [60, 13], [75, 7], [77, 23], [93, 25], [87, 40], [100, 50], [87, 60], [93, 75], [77, 77], [75, 93], [60, 87], [50, 100], [40, 87], [25, 93], [23, 77], [7, 75], [13, 60], [0, 50], [13, 40], [7, 25], [23, 23], [25, 7], [40, 13]] },
  { key: "cross", label: "十字", labelEn: "Cross", points: [[35, 0], [65, 0], [65, 35], [100, 35], [100, 65], [65, 65], [65, 100], [35, 100], [35, 65], [0, 65], [0, 35], [35, 35]] },
  { key: "message", label: "吹き出し", labelEn: "Bubble", points: [[0, 0], [100, 0], [100, 75], [75, 75], [75, 100], [50, 75], [0, 75]] },
  { key: "frame", label: "フレーム", labelEn: "Frame", points: [[0, 0], [100, 0], [100, 100], [0, 100], [0, 80], [80, 80], [80, 20], [20, 20], [20, 80], [0, 80]] },
  // 蛇行パスの裏ワザで生成する形（点数はスライダーで可変）。points は持たず main.js で生成する
  { key: "stripe", label: "横ストライプ", labelEn: "Stripes H", parametric: "stripe", n: 5 },
  { key: "stripe-v", label: "縦ストライプ", labelEn: "Stripes V", parametric: "stripe", n: 5, vertical: true },
  { key: "checkerboard", label: "チェック", labelEn: "Checker", parametric: "checker", n: 4, fillRule: "evenodd" },
];
