// Liquid Glass の見た目を作る WebGL シェーダー本体。
// ランタイムプレビューと「コードをコピー」出力の両方がこの文字列を共有する（ズレ防止）。

// 頂点シェーダー: 画面全体を覆う三角形に uv を渡すだけ
export const VERTEX_SHADER = /* glsl */ `
  attribute vec2 uv;
  attribute vec2 position;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

// フラグメントシェーダー: 背景を cover 配置し、角丸矩形のガラス領域だけ
// 屈折・色収差・フロスト（すりガラス）・スペキュラ・ティントを合成する。
export const FRAGMENT_SHADER = /* glsl */ `
  precision highp float;

  uniform sampler2D uTexture;
  uniform vec2 uResolution;        // 実ピクセル解像度（css px * dpr）
  uniform vec2 uImageResolution;   // 背景画像の自然サイズ
  uniform vec2 uGlassCenter;       // ガラス中心（実ピクセル, y上向き）
  uniform vec2 uGlassHalf;         // ガラス半径（実ピクセル）
  uniform float uRadius;           // 角丸（実ピクセル）
  uniform float uEdge;             // 縁のベベル幅（実ピクセル）
  uniform float uRefraction;       // 屈折強度
  uniform float uBlur;             // すりガラスのぼかし量（実ピクセル）
  uniform float uSpecular;         // 縁のスペキュラ強度
  uniform float uAberration;       // 色収差
  uniform vec3 uTint;              // ティント色
  uniform float uTintOpacity;      // ティント濃度

  varying vec2 vUv;

  // 背景を object-fit: cover 相当で配置するための uv 変換
  vec2 coverUv(vec2 fragPx) {
    vec2 uv = fragPx / uResolution;
    float canvasAspect = uResolution.x / uResolution.y;
    float imageAspect = uImageResolution.x / uImageResolution.y;
    vec2 scale = canvasAspect > imageAspect
      ? vec2(1.0, imageAspect / canvasAspect)
      : vec2(canvasAspect / imageAspect, 1.0);
    return (uv - 0.5) * scale + 0.5;
  }

  // 角丸矩形の符号付き距離（内側で負）
  float sdRoundRect(vec2 p, vec2 b, float r) {
    vec2 q = abs(p) - b + r;
    return min(max(q.x, q.y), 0.0) + length(max(q, 0.0)) - r;
  }

  // フロスト（すりガラス）用の多点ぼかしサンプリング
  vec3 sampleBlur(vec2 fragPx, float radiusPx) {
    vec2 baseUv = coverUv(fragPx);
    if (radiusPx < 0.5) return texture2D(uTexture, baseUv).rgb;
    // 12方向 + 中心の固定カーネル
    const int TAPS = 12;
    vec2 dirs[TAPS];
    dirs[0]  = vec2( 1.0,  0.0); dirs[1]  = vec2(-1.0,  0.0);
    dirs[2]  = vec2( 0.0,  1.0); dirs[3]  = vec2( 0.0, -1.0);
    dirs[4]  = vec2( 0.7,  0.7); dirs[5]  = vec2(-0.7,  0.7);
    dirs[6]  = vec2( 0.7, -0.7); dirs[7]  = vec2(-0.7, -0.7);
    dirs[8]  = vec2( 0.5,  0.0); dirs[9]  = vec2(-0.5,  0.0);
    dirs[10] = vec2( 0.0,  0.5); dirs[11] = vec2( 0.0, -0.5);
    vec3 sum = texture2D(uTexture, baseUv).rgb;
    float wsum = 1.0;
    for (int i = 0; i < TAPS; i++) {
      vec2 off = dirs[i] * radiusPx / uResolution;
      sum += texture2D(uTexture, baseUv + off).rgb;
      wsum += 1.0;
    }
    return sum / wsum;
  }

  void main() {
    vec2 fragPx = vUv * uResolution;
    vec2 p = fragPx - uGlassCenter;

    float d = sdRoundRect(p, uGlassHalf, uRadius);

    // ガラス外は背景そのまま
    vec3 bgColor = texture2D(uTexture, coverUv(fragPx)).rgb;

    // 距離場の勾配（外向き法線）を数値微分で求める
    float e = 1.5;
    vec2 grad = vec2(
      sdRoundRect(p + vec2(e, 0.0), uGlassHalf, uRadius) - sdRoundRect(p - vec2(e, 0.0), uGlassHalf, uRadius),
      sdRoundRect(p + vec2(0.0, e), uGlassHalf, uRadius) - sdRoundRect(p - vec2(0.0, e), uGlassHalf, uRadius)
    );
    grad = normalize(grad + 1e-6);

    // 縁からの入り込み具合（0=縁, 1=内側の平坦部）
    float band = clamp(-d / max(uEdge, 1.0), 0.0, 1.0);
    // 縁で強く曲がるレンズ曲率
    float curve = pow(1.0 - band, 1.6);

    // 屈折: 縁ほど背景を外側から引き込む
    float maxDisp = uEdge * 0.9;
    vec2 disp = grad * curve * uRefraction * maxDisp;

    // 色収差: 屈折方向に沿って RGB をずらす
    vec2 caOff = grad * curve * uAberration * 14.0;

    vec3 glassColor;
    glassColor.r = sampleBlur(fragPx + disp + caOff, uBlur).r;
    glassColor.g = sampleBlur(fragPx + disp,         uBlur).g;
    glassColor.b = sampleBlur(fragPx + disp - caOff, uBlur).b;

    // ティント（わずかに色を乗せる）
    glassColor = mix(glassColor, uTint, uTintOpacity);

    // スペキュラ: 縁の鏡面ハイライト（左上から光が当たる想定）
    vec3 n = normalize(vec3(grad * curve, 0.6));
    vec3 lightDir = normalize(vec3(-0.6, 0.75, 0.55));
    float spec = pow(max(dot(n, lightDir), 0.0), 12.0);
    float rim = smoothstep(0.0, 0.9, curve);
    glassColor += spec * uSpecular * rim * 1.4;

    // 内側のごく薄い縁取り（厚みの表現）
    float innerLine = smoothstep(0.0, 0.5, curve) * (1.0 - smoothstep(0.5, 1.0, curve));
    glassColor += innerLine * uSpecular * 0.15;

    // 縁を 1px でアンチエイリアス合成
    float coverage = 1.0 - smoothstep(-1.0, 1.0, d);
    gl_FragColor = vec4(mix(bgColor, glassColor, coverage), 1.0);
  }
`;

// 形状プリセット。サイズ（半径ではなく実寸の半分=half）と角丸の既定値を持つ
export const SHAPE_PRESETS = {
  button: { label: "button", halfW: 130, halfH: 46, radius: 46 },
  card: { label: "card", halfW: 200, halfH: 140, radius: 36 },
  pill: { label: "pill", halfW: 150, halfH: 40, radius: 40 },
  circle: { label: "circle", halfW: 90, halfH: 90, radius: 90 },
};

// スライダー初期値（Liquid Glass らしい既定）
export const DEFAULT_PARAMS = {
  shape: "button",
  refraction: 1.5,
  blur: 0,
  specular: 1.5,
  aberration: 1,
  edge: 60,
  radius: 46,
  tint: "#00ff00",
  tintOpacity: 0.12,
};
