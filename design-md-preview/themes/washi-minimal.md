---
version: alpha
name: Washi Minimal
description: 和紙のような温かい下地に、余白と細い罫線で構造を見せる静かなトーン。
colors:
  surface: "#FBF8F1"
  surface-container: "#F2EDE1"
  on-surface: "#2A2620"
  on-surface-variant: "#5B5347"
  outline: "#C9BFA9"
  primary: "#7A5C3E"
  on-primary: "#FFFFFF"
  secondary: "#4A5D4E"
  on-secondary: "#FFFFFF"
  error: "#8B2E2E"
  on-error: "#FFFFFF"
typography:
  headline-lg:
    fontFamily: Zen Old Mincho, Noto Serif JP
    fontSize: 44px
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: 0.01em
  headline-md:
    fontFamily: Zen Old Mincho, Noto Serif JP
    fontSize: 24px
    fontWeight: 500
    lineHeight: 1.4
  body-md:
    fontFamily: Noto Serif JP
    fontSize: 17px
    fontWeight: 400
    lineHeight: 2.0
  body-sm:
    fontFamily: Noto Serif JP
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.7
  label-md:
    fontFamily: Zen Old Mincho, Noto Serif JP
    fontSize: 16px
    fontWeight: 500
    letterSpacing: 0.06em
spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 32px
  xl: 64px
  gutter: 28px
rounded:
  sm: 2px
  md: 4px
  lg: 8px
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

# Washi Minimal

## Overview

余白と紙の質感で語る。装飾を足すのではなく、引いた結果として品を出す。想定読者は落ち着いた読み物や工芸・飲食の紹介ページを見に来た人で、UIは静かで、急かさない。

## Colors

生成りの下地に濃い墨色の文字を置き、差し色は焦茶ひとつに絞る。緑は副次的な導線にだけ使い、赤は警告以外に出さない。

- **Primary (#7A5C3E):** 主アクション。1画面につき1箇所に絞る
- **Secondary (#4A5D4E):** 補助的な導線と状態表示
- **Surface (#FBF8F1) / Surface Container (#F2EDE1):** 下地と、その上に置く面
- **Outline (#C9BFA9):** 罫線と枠。文字には使わない
- **Error (#8B2E2E):** 失敗と破壊的操作にだけ使う

## Typography

明朝で通す。見出しはウェイトを上げずにサイズだけで差をつけ、本文は行間を広く取って読み疲れを避ける。

- **Headline:** Zen Old Mincho, Noto Serif JP
- **Body:** Noto Serif JP
- **Label:** Zen Old Mincho, Noto Serif JP

## Layout

1カラムを基本とし、本文幅は42文字前後で止める。余白は8pxの倍数で刻み、セクション間は64pxを標準にする。

## Elevation & Depth

影は使わない。階層は下地の濃淡と細い罫線だけで表す。カードは surface-container に置き、輪郭は outline の1pxで示す。

## Shapes

角丸は最小限。カードは4px、入力欄は2px。丸みで柔らかさを出すのではなく、余白で出す。

## Components

- **Button:** primary と secondary の2種類。同一画面で primary は1つ
- **Card:** surface-container の面に置き、角丸は rounded.md
- **Divider:** outline の1px。余白で足りるなら引かない
- **Alert:** error の面に on-error の文字

## Do's and Don'ts

- Do 余白を削るより要素を減らす
- Do 差し色は1画面に1箇所
- Don't 影で階層を作らない
- Don't 見出しを太字にしない
