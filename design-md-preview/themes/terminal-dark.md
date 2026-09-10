---
version: alpha
name: Terminal Dark
description: 端末の配色をそのまま持ち込んだ開発者向けのダークテーマ。等幅を主役に据える。
colors:
  surface: "#0D1117"
  surface-container: "#161B22"
  on-surface: "#E6EDF3"
  on-surface-variant: "#9DA7B3"
  outline: "#30363D"
  primary: "#2EA043"
  on-primary: "#06140A"
  secondary: "#316DCA"
  on-secondary: "#FFFFFF"
  error: "#F85149"
  on-error: "#1B0B0A"
typography:
  headline-lg:
    fontFamily: JetBrains Mono, Noto Sans JP
    fontSize: 40px
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: -0.02em
  headline-md:
    fontFamily: JetBrains Mono, Noto Sans JP
    fontSize: 24px
    fontWeight: 700
    lineHeight: 1.4
  body-md:
    fontFamily: Noto Sans JP
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.8
  body-sm:
    fontFamily: Noto Sans JP
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.7
  label-md:
    fontFamily: JetBrains Mono, Noto Sans JP
    fontSize: 16px
    fontWeight: 500
    letterSpacing: 0.06em
spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 48px
  gutter: 20px
rounded:
  sm: 4px
  md: 6px
  lg: 10px
  full: 9999px
components:
  page:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    typography: "{typography.body-md}"
  card:
    backgroundColor: "{colors.surface-container}"
    textColor: "{colors.on-surface}"
    rounded: "{rounded.md}"
    padding: "{spacing.gutter}"
  caption:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface-variant}"
    typography: "{typography.body-sm}"
  divider:
    backgroundColor: "{colors.outline}"
    height: 1px
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.label-md}"
    rounded: "{rounded.md}"
    padding: "{spacing.md}"
  button-secondary:
    backgroundColor: "{colors.secondary}"
    textColor: "{colors.on-secondary}"
    typography: "{typography.label-md}"
    rounded: "{rounded.md}"
    padding: "{spacing.md}"
  alert-error:
    backgroundColor: "{colors.error}"
    textColor: "{colors.on-error}"
    rounded: "{rounded.sm}"
    padding: "{spacing.sm}"
---

# Terminal Dark

## Overview

開発者が一日中開いても疲れない画面を狙う。装飾より情報密度、アニメーションより即時性。想定読者はドキュメントやダッシュボードを読みに来たエンジニアで、コードが主役になる。

## Colors

背景は純黒を避けた濃紺寄りの黒。緑を実行系の主アクション、青を参照系のリンク、赤を失敗にだけ割り当て、色に意味を固定する。

- **Primary (#2EA043):** 主アクション。1画面につき1箇所に絞る
- **Secondary (#316DCA):** 補助的な導線と状態表示
- **Surface (#0D1117) / Surface Container (#161B22):** 下地と、その上に置く面
- **Outline (#30363D):** 罫線と枠。文字には使わない
- **Error (#F85149):** 失敗と破壊的操作にだけ使う

## Typography

見出しとラベルは等幅、本文は日本語ゴシック。等幅を混ぜることでコードとの地続き感を出す。

- **Headline:** JetBrains Mono, Noto Sans JP
- **Body:** Noto Sans JP
- **Label:** JetBrains Mono, Noto Sans JP

## Layout

最大幅960pxの1カラム。行の高さは1.8を守り、コードブロックの前後は24pxを空ける。

## Elevation & Depth

影ではなく背景の明度差で層を作る。最前面ほど明るくし、罫線は outline で最小限に留める。

## Shapes

角丸は6pxを基準に、ボタンとタグだけ10px。丸すぎるとターミナルの緊張感が消える。

## Components

- **Button:** primary と secondary の2種類。同一画面で primary は1つ
- **Card:** surface-container の面に置き、角丸は rounded.md
- **Divider:** outline の1px。余白で足りるなら引かない
- **Alert:** error の面に on-error の文字

## Do's and Don'ts

- Do 色に意味を固定する
- Do コードは surface-container に置く
- Don't 純黒を背景にしない
- Don't 緑を装飾に使わない
