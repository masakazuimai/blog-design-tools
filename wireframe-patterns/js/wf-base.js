// 全パターン共通のワイヤーフレーム用CSS（コピー出力にもそのまま含める）
// 各セクションは自身をコンテナにして、@container でSP幅のレイアウトに切り替える
export const BASE_CSS = `/* ワイヤーフレーム共通 */
.wf-section {
  container-type: inline-size;
  font-family: system-ui, -apple-system, "Hiragino Sans", "Noto Sans JP", sans-serif;
  font-size: 16px;
  line-height: 1.7;
  color: #333;
  background: #fff;
  border-bottom: 1px dashed #c8c8c8;
}
.wf-section *, .wf-section *::before, .wf-section *::after { box-sizing: border-box; }
.wf-section button { font: inherit; color: inherit; }
.wf-inner {
  max-width: 1080px;
  margin: 0 auto;
  padding: clamp(40px, 7cqi, 88px) 20px;
}
.wf-inner--slim { padding-block: 16px; }
.wf-h1 { margin: 0; font-size: clamp(28px, 4.4cqi, 48px); line-height: 1.3; letter-spacing: -0.02em; font-weight: 700; }
.wf-h2 { margin: 0; font-size: clamp(24px, 3.2cqi, 34px); line-height: 1.4; letter-spacing: -0.01em; font-weight: 700; }
.wf-h3 { margin: 0; font-size: 20px; line-height: 1.5; font-weight: 700; }
.wf-text { margin: 0; color: #666; }
.wf-label { display: inline-block; font-size: 16px; font-weight: 600; color: #888; letter-spacing: 0.06em; }
.wf-logo {
  display: inline-flex; align-items: center; gap: 8px;
  font-weight: 700; font-size: 18px; color: #333; text-decoration: none;
}
.wf-mark { flex: 0 0 auto; width: 28px; height: 28px; border: 2px solid #555; border-radius: 6px; }
.wf-check { position: absolute; left: 0; top: 3px; width: 20px; height: 20px; border: 2px solid #555; border-radius: 4px; }
.wf-check--round { border-radius: 50%; }
.wf-icon { flex: 0 0 auto; width: 56px; height: 56px; border: 2px solid #999; border-radius: 12px; background: #f4f4f4; }
.wf-avatar { flex: 0 0 auto; width: 56px; height: 56px; border: 2px solid #999; border-radius: 50%; background: #efefef; }
.wf-head { display: grid; gap: 12px; margin-bottom: clamp(32px, 5cqi, 48px); text-align: center; }
.wf-link { color: #555; text-decoration: none; }
.wf-btn {
  display: inline-flex; align-items: center; justify-content: center;
  min-height: 48px; padding: 10px 24px;
  border: 2px solid #444; border-radius: 6px;
  background: #fff; color: #333; font-weight: 700; text-decoration: none; white-space: nowrap;
}
.wf-btn--primary { background: #444; color: #fff; }
.wf-box { border: 2px solid #b5b5b5; border-radius: 8px; background: #fff; }
.wf-muted-bg { background: #f4f4f4; }
.wf-img {
  display: block; width: 100%;
  border: 2px solid #b5b5b5; border-radius: 8px;
  background:
    linear-gradient(to top right, transparent calc(50% - 1px), #cfcfcf calc(50% - 1px), #cfcfcf calc(50% + 1px), transparent calc(50% + 1px)),
    linear-gradient(to bottom right, transparent calc(50% - 1px), #cfcfcf calc(50% - 1px), #cfcfcf calc(50% + 1px), transparent calc(50% + 1px)),
    #efefef;
}
.wf-list { margin: 0; padding: 0; list-style: none; }
.wf-burger {
  display: inline-flex; flex-direction: column; justify-content: center; gap: 5px;
  width: 44px; height: 44px; padding: 10px; border: 2px solid #444; border-radius: 6px; background: #fff;
}
.wf-burger span { display: block; height: 2px; background: #444; }
`;
