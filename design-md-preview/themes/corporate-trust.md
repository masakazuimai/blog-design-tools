---
version: alpha
name: Corporate Trust
description: 受託制作やBtoBサイトで最も選ばれる、青を軸にした堅実で読みやすいトーン。
colors:
  surface: "#FFFFFF"
  surface-container: "#F1F5F9"
  on-surface: "#0F172A"
  on-surface-variant: "#475569"
  outline: "#CBD5E1"
  primary: "#1D4ED8"
  on-primary: "#FFFFFF"
  secondary: "#0F766E"
  on-secondary: "#FFFFFF"
  error: "#B91C1C"
  on-error: "#FFFFFF"
typography:
  headline-lg:
    fontFamily: Inter, Noto Sans JP
    fontSize: 40px
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter, Noto Sans JP
    fontSize: 24px
    fontWeight: 700
    lineHeight: 1.4
  body-md:
    fontFamily: Noto Sans JP
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.9
  body-sm:
    fontFamily: Noto Sans JP
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.7
  label-md:
    fontFamily: Inter, Noto Sans JP
    fontSize: 16px
    fontWeight: 500
    letterSpacing: 0.06em
spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 56px
  gutter: 24px
rounded:
  sm: 4px
  md: 8px
  lg: 12px
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

# Corporate Trust

## Overview

信頼と読みやすさを最優先する。奇をてらわず、初見の担当者が迷わないことを基準にする。想定読者は発注を検討している事業会社の担当者で、判断材料を探している。

## Colors

白地に濃紺の文字。主アクションは青ひとつに絞り、実績や補足の見出しに深緑を使う。赤はエラー表示だけに限定する。

- **Primary (#1D4ED8):** 主アクション。1画面につき1箇所に絞る
- **Secondary (#0F766E):** 補助的な導線と状態表示
- **Surface (#FFFFFF) / Surface Container (#F1F5F9):** 下地と、その上に置く面
- **Outline (#CBD5E1):** 罫線と枠。文字には使わない
- **Error (#B91C1C):** 失敗と破壊的操作にだけ使う

## Typography

ゴシックで統一し、見出しは太さで差をつける。本文は16pxを下限とし、行間1.9で長文でも読める状態を保つ。

- **Headline:** Inter, Noto Sans JP
- **Body:** Noto Sans JP
- **Label:** Inter, Noto Sans JP

## Layout

最大幅1200pxのグリッド。カードは3カラムを基本に、狭い画面では1カラムへ落とす。セクション間は56px。

## Elevation & Depth

影は弱く1段階だけ。カードは surface-container の面と1pxの罫線で表し、浮かせすぎない。

## Shapes

角丸8pxを標準に、ボタンは12px。全体を通して同じ半径を使い回し、形のばらつきを作らない。

## Components

- **Button:** primary と secondary の2種類。同一画面で primary は1つ
- **Card:** surface-container の面に置き、角丸は rounded.md
- **Divider:** outline の1px。余白で足りるなら引かない
- **Alert:** error の面に on-error の文字

## Do's and Don'ts

- Do 主アクションは1画面に1つ
- Do 数値には出典を添える
- Don't 青を装飾で使い回さない
- Don't 影を重ねて立体にしない
