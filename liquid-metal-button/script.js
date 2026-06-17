// シェーダーは必ずバージョンをピン留めする（@latest は仕様変更で壊れる）
import {
  liquidMetalFragmentShader,
  ShaderMount,
} from "https://esm.sh/@paper-design/shaders@0.0.76";

document.querySelectorAll(".lm").forEach((el) => {
  new ShaderMount(
    el,
    liquidMetalFragmentShader,
    {
      // 0.0.76 で必須になった色・モード指定
      u_colorBack: "#000000", // 背景色
      u_colorTint: "#ffffff", // メタルの色味（白＝シルバー）
      u_isImage: false,       // 画像モードOFF（全面描画）
      // 質感パラメータ（rep / angle はカードごとに data 属性で切替）
      u_repetition: parseFloat(el.dataset.rep),
      u_softness: 0.45,
      u_shiftRed: 0.2,
      u_shiftBlue: 0.2,
      u_distortion: 0,
      u_contour: 0,
      u_angle: parseFloat(el.dataset.ang),
      u_scale: 1.5,
      u_shape: 0,             // 0 = 全面描画（長方形を埋める）
      u_offsetX: 0.1,
      u_offsetY: -0.1,
    },
    undefined,
    1 // アニメーション速度（5番目の位置引数）
  );
});
