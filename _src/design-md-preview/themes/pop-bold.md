---
version: alpha
name: Pop Bold
description: 高彩度と太字で勢いを出す、SaaSやキャンペーンLP向けの明るいトーン。
colors:
  surface: "#FFFDF7"
  surface-container: "#FFF1D6"
  on-surface: "#1A1300"
  on-surface-variant: "#5A4B23"
  outline: "#E2C98A"
  primary: "#D93F00"
  on-primary: "#FFFFFF"
  secondary: "#5B2BD9"
  on-secondary: "#FFFFFF"
  error: "#B3001B"
  on-error: "#FFFFFF"
typography:
  headline-lg:
    fontFamily: Plus Jakarta Sans, Zen Kaku Gothic New
    fontSize: 52px
    fontWeight: 800
    lineHeight: 1.2
    letterSpacing: -0.03em
  headline-md:
    fontFamily: Plus Jakarta Sans, Zen Kaku Gothic New
    fontSize: 24px
    fontWeight: 800
    lineHeight: 1.4
  body-md:
    fontFamily: Zen Kaku Gothic New
    fontSize: 17px
    fontWeight: 400
    lineHeight: 1.85
  body-sm:
    fontFamily: Zen Kaku Gothic New
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.7
  label-md:
    fontFamily: Plus Jakarta Sans, Zen Kaku Gothic New
    fontSize: 16px
    fontWeight: 500
    letterSpacing: 0.06em
spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 28px
  xl: 64px
  gutter: 24px
rounded:
  sm: 8px
  md: 12px
  lg: 20px
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

# Pop Bold

## Overview

第一印象で足を止めさせる。明るい下地に大きな見出しを置き、行動を促す色を1つだけ強く出す。想定読者は広告やSNSから流入した初見の人で、滞在時間は短い。

## Colors

クリーム色の下地に朱色の主アクション。紫は補助的な訴求に回し、濃い側の面 surface-container は強調ブロックに使う。

- **Primary (#D93F00):** 主アクション。1画面につき1箇所に絞る
- **Secondary (#5B2BD9):** 補助的な導線と状態表示
- **Surface (#FFFDF7) / Surface Container (#FFF1D6):** 下地と、その上に置く面
- **Outline (#E2C98A):** 罫線と枠。文字には使わない
- **Error (#B3001B):** 失敗と破壊的操作にだけ使う

## Typography

見出しは800ウェイトで詰め気味に。本文は角丸のあるゴシックで、見出しとの太さの差を大きく取る。

- **Headline:** Plus Jakarta Sans, Zen Kaku Gothic New
- **Body:** Zen Kaku Gothic New
- **Label:** Plus Jakarta Sans, Zen Kaku Gothic New

## Layout

最大幅1120px。ヒーローは上下64pxを空け、カードは3カラム。要素の間隔は詰めすぎない。

## Elevation & Depth

影は色付きで柔らかく1段階。主ボタンにだけ影を許し、それ以外は面の色で階層を示す。

## Shapes

角丸を大きく取る。カードは20px、ボタンは全円。丸みで親しみやすさを作る。

## Components

- **Button:** primary と secondary の2種類。同一画面で primary は1つ
- **Card:** surface-container の面に置き、角丸は rounded.md
- **Divider:** outline の1px。余白で足りるなら引かない
- **Alert:** error の面に on-error の文字

## Do's and Don'ts

- Do 主アクションは朱色だけ
- Do 見出しは短く言い切る
- Don't 彩度の高い色を3色以上出さない
- Don't 本文まで太字にしない
