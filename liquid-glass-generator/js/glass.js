
export const VERTEX_SHADER = `
  attribute vec2 uv;
  attribute vec2 position;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

export const FRAGMENT_SHADER = `
  precision highp float;

  uniform sampler2D uTexture;
  uniform vec2 uResolution;
  uniform vec2 uImageResolution;
  uniform vec2 uGlassCenter;
  uniform vec2 uGlassHalf;
  uniform float uRadius;
  uniform float uEdge;
  uniform float uRefraction;
  uniform float uBlur;
  uniform float uSpecular;
  uniform float uAberration;
  uniform vec3 uTint;
  uniform float uTintOpacity;

  varying vec2 vUv;

  vec2 coverUv(vec2 fragPx) {
    vec2 uv = fragPx / uResolution;
    float canvasAspect = uResolution.x / uResolution.y;
    float imageAspect = uImageResolution.x / uImageResolution.y;
    vec2 scale = canvasAspect > imageAspect
      ? vec2(1.0, imageAspect / canvasAspect)
      : vec2(canvasAspect / imageAspect, 1.0);
    return (uv - 0.5) * scale + 0.5;
  }

  float sdRoundRect(vec2 p, vec2 b, float r) {
    vec2 q = abs(p) - b + r;
    return min(max(q.x, q.y), 0.0) + length(max(q, 0.0)) - r;
  }

  vec3 sampleBlur(vec2 fragPx, float radiusPx) {
    vec2 baseUv = coverUv(fragPx);
    if (radiusPx < 0.5) return texture2D(uTexture, baseUv).rgb;
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

    vec3 bgColor = texture2D(uTexture, coverUv(fragPx)).rgb;

    float e = 1.5;
    vec2 grad = vec2(
      sdRoundRect(p + vec2(e, 0.0), uGlassHalf, uRadius) - sdRoundRect(p - vec2(e, 0.0), uGlassHalf, uRadius),
      sdRoundRect(p + vec2(0.0, e), uGlassHalf, uRadius) - sdRoundRect(p - vec2(0.0, e), uGlassHalf, uRadius)
    );
    grad = normalize(grad + 1e-6);

    float band = clamp(-d / max(uEdge, 1.0), 0.0, 1.0);
    float curve = pow(1.0 - band, 1.6);

    float maxDisp = uEdge * 0.9;
    vec2 disp = grad * curve * uRefraction * maxDisp;

    vec2 caOff = grad * curve * uAberration * 14.0;

    vec3 glassColor;
    glassColor.r = sampleBlur(fragPx + disp + caOff, uBlur).r;
    glassColor.g = sampleBlur(fragPx + disp,         uBlur).g;
    glassColor.b = sampleBlur(fragPx + disp - caOff, uBlur).b;

    glassColor = mix(glassColor, uTint, uTintOpacity);

    vec3 n = normalize(vec3(grad * curve, 0.6));
    vec3 lightDir = normalize(vec3(-0.6, 0.75, 0.55));
    float spec = pow(max(dot(n, lightDir), 0.0), 12.0);
    float rim = smoothstep(0.0, 0.9, curve);
    glassColor += spec * uSpecular * rim * 1.4;

    float innerLine = smoothstep(0.0, 0.5, curve) * (1.0 - smoothstep(0.5, 1.0, curve));
    glassColor += innerLine * uSpecular * 0.15;

    float coverage = 1.0 - smoothstep(-1.0, 1.0, d);
    gl_FragColor = vec4(mix(bgColor, glassColor, coverage), 1.0);
  }
`;

export const SHAPE_PRESETS = {
  button: { label: "button", halfW: 130, halfH: 46, radius: 46 },
  card: { label: "card", halfW: 200, halfH: 140, radius: 36 },
  pill: { label: "pill", halfW: 150, halfH: 40, radius: 40 },
  circle: { label: "circle", halfW: 90, halfH: 90, radius: 90 },
};

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
