---
version: alpha
name: Editorial Serif
description: 読み物のための明朝とセリフ。長文を最後まで読ませることに全振りしたトーン。
colors:
  surface: "#FCFBF9"
  surface-container: "#F0EEE9"
  on-surface: "#1B1A17"
  on-surface-variant: "#56534C"
  outline: "#D6D2C8"
  primary: "#8C2F1E"
  on-primary: "#FFFFFF"
  secondary: "#33475B"
  on-secondary: "#FFFFFF"
  error: "#A3211B"
  on-error: "#FFFFFF"
typography:
  headline-lg:
    fontFamily: Newsreader, Noto Serif JP
    fontSize: 46px
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Newsreader, Noto Serif JP
    fontSize: 24px
    fontWeight: 600
    lineHeight: 1.4
  body-md:
    fontFamily: Noto Serif JP
    fontSize: 18px
    fontWeight: 400
    lineHeight: 2.05
  body-sm:
    fontFamily: Noto Serif JP
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.7
  label-md:
    fontFamily: Newsreader, Noto Serif JP
    fontSize: 16px
    fontWeight: 500
    letterSpacing: 0.06em
spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 40px
  xl: 72px
  gutter: 32px
rounded:
  sm: 0px
  md: 2px
  lg: 4px
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

# Editorial Serif

## Overview

雑誌の記事ページを紙からそのまま持ってくる。写真より文字、動きより静けさ。想定読者は腰を据えて読みに来た人で、スクロールの速度が遅いことを前提にする。

## Colors

わずかに温かい白の紙面に、黒に近い墨。差し色は煉瓦色ひとつで、引用や補足には藍を使う。

- **Primary (#8C2F1E):** 主アクション。1画面につき1箇所に絞る
- **Secondary (#33475B):** 補助的な導線と状態表示
- **Surface (#FCFBF9) / Surface Container (#F0EEE9):** 下地と、その上に置く面
- **Outline (#D6D2C8):** 罫線と枠。文字には使わない
- **Error (#A3211B):** 失敗と破壊的操作にだけ使う

## Typography

見出しも本文もセリフで通す。本文は18px・行間2.05まで開き、1行あたり40文字前後で改行させる。

- **Headline:** Newsreader, Noto Serif JP
- **Body:** Noto Serif JP
- **Label:** Newsreader, Noto Serif JP

## Layout

本文は680pxの1カラム。図版だけ本文幅を超えて配置してよい。セクション間は72pxと大きく取る。

## Elevation & Depth

影を使わない。紙面に層は存在しないという前提で、区切りは罫線と余白だけで表現する。

## Shapes

角丸は原則0。写真と引用ブロックだけ2pxを許す。紙の直線的な佇まいを崩さない。

## Components

- **Button:** primary と secondary の2種類。同一画面で primary は1つ
- **Card:** surface-container の面に置き、角丸は rounded.md
- **Divider:** outline の1px。余白で足りるなら引かない
- **Alert:** error の面に on-error の文字

## Do's and Don'ts

- Do 1行40文字前後で改行させる
- Do 引用は藍で示す
- Don't 角丸を大きくしない
- Don't 本文を16px未満にしない
