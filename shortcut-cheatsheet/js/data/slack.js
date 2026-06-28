// Slack ショートカットキー データ（Slack 既定キー準拠）
// keys: トークン配列。'mod'=⌘/Ctrl, 'alt'=⌥/Alt, 'shift'=⇧/Shift、それ以外はそのまま表示。

export const CATEGORIES = [
  {
    id: "navigation",
    name: "移動",
    items: [
      { keys: ["mod", "K"], label: "クイック切替（ジャンプ）" },
      { keys: ["mod", "shift", "K"], label: "ダイレクトメッセージを開く" },
      { keys: ["mod", "shift", "T"], label: "スレッドを開く" },
      { keys: ["mod", "shift", "A"], label: "すべての未読を開く" },
      { keys: ["mod", "shift", "S"], label: "「あとで」（保存済み）を開く" },
      { keys: ["mod", "["], label: "前の画面に戻る" },
      { keys: ["mod", "]"], label: "次の画面に進む" },
      { keys: ["alt", "↑"], label: "前のチャンネルへ" },
      { keys: ["alt", "↓"], label: "次のチャンネルへ" },
      { keys: ["alt", "shift", "↑"], label: "前の未読へ" },
      { keys: ["alt", "shift", "↓"], label: "次の未読へ" },
    ],
  },
  {
    id: "messaging",
    name: "メッセージ",
    items: [
      { keys: ["Enter"], label: "メッセージを送信" },
      { keys: ["shift", "Enter"], label: "改行（送信せず）" },
      { keys: ["↑"], label: "直前の自分のメッセージを編集" },
      { keys: ["mod", "U"], label: "ファイルをアップロード" },
      { keys: ["mod", "shift", "Enter"], label: "スニペットを作成" },
    ],
  },
  {
    id: "format",
    name: "書式",
    items: [
      { keys: ["mod", "B"], label: "太字" },
      { keys: ["mod", "I"], label: "斜体" },
      { keys: ["mod", "shift", "X"], label: "打ち消し線" },
      { keys: ["mod", "shift", "C"], label: "コード（インライン）" },
      { keys: ["mod", "alt", "shift", "C"], label: "コードブロック" },
      { keys: ["mod", "shift", "9"], label: "引用" },
      { keys: ["mod", "shift", "8"], label: "箇条書きリスト" },
      { keys: ["mod", "shift", "7"], label: "番号付きリスト" },
    ],
  },
  {
    id: "read",
    name: "既読・未読",
    items: [
      { keys: ["Esc"], label: "現在のチャンネルを既読にする" },
      { keys: ["shift", "Esc"], label: "すべてを既読にする" },
    ],
  },
  {
    id: "misc",
    name: "その他",
    items: [
      { keys: ["mod", ","], label: "環境設定を開く" },
      { keys: ["mod", "/"], label: "ショートカット一覧を表示" },
      { keys: ["mod", "."], label: "右側のパネルを開閉" },
    ],
  },
];
