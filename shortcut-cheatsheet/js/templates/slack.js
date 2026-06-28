// Slack テンプレート
// 各項目は { cat: カテゴリID, label: data.js のラベル完全一致 }。

export const TEMPLATES = [
  {
    id: "staples",
    name: "定番セット",
    desc: "毎日使う基本",
    items: [
      { cat: "navigation", label: "クイック切替（ジャンプ）" },
      { cat: "navigation", label: "ダイレクトメッセージを開く" },
      { cat: "messaging", label: "メッセージを送信" },
      { cat: "messaging", label: "改行（送信せず）" },
      { cat: "format", label: "太字" },
      { cat: "read", label: "すべてを既読にする" },
    ],
  },
  {
    id: "navigation",
    name: "サクサク移動",
    desc: "切替・未読チェック中心",
    items: [
      { cat: "navigation", label: "クイック切替（ジャンプ）" },
      { cat: "navigation", label: "ダイレクトメッセージを開く" },
      { cat: "navigation", label: "スレッドを開く" },
      { cat: "navigation", label: "すべての未読を開く" },
      { cat: "navigation", label: "前の未読へ" },
      { cat: "navigation", label: "次の未読へ" },
      { cat: "navigation", label: "前のチャンネルへ" },
      { cat: "navigation", label: "次のチャンネルへ" },
    ],
  },
  {
    id: "format",
    name: "書式を整える",
    desc: "装飾・リスト・コード",
    items: [
      { cat: "format", label: "太字" },
      { cat: "format", label: "斜体" },
      { cat: "format", label: "打ち消し線" },
      { cat: "format", label: "コード（インライン）" },
      { cat: "format", label: "コードブロック" },
      { cat: "format", label: "引用" },
      { cat: "format", label: "箇条書きリスト" },
      { cat: "format", label: "番号付きリスト" },
    ],
  },
  {
    id: "writing",
    name: "書き込み",
    desc: "送信・編集・添付",
    items: [
      { cat: "messaging", label: "メッセージを送信" },
      { cat: "messaging", label: "改行（送信せず）" },
      { cat: "messaging", label: "直前の自分のメッセージを編集" },
      { cat: "messaging", label: "ファイルをアップロード" },
      { cat: "messaging", label: "スニペットを作成" },
      { cat: "format", label: "コードブロック" },
    ],
  },
];
