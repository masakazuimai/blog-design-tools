---
version: alpha
name: Neutral Gray
description: 装飾を削り、データを読ませることに徹した管理画面向けのニュートラルなトーン。
colors:
  surface: "#FFFFFF"
  surface-container: "#F5F5F5"
  on-surface: "#1F1F1F"
  on-surface-variant: "#4F4F4F"
  outline: "#D4D4D4"
  primary: "#3F3F46"
  on-primary: "#FFFFFF"
  secondary: "#0E7490"
  on-secondary: "#FFFFFF"
  error: "#9F1239"
  on-error: "#FFFFFF"
typography:
  headline-lg:
    fontFamily: Public Sans, Noto Sans JP
    fontSize: 32px
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Public Sans, Noto Sans JP
    fontSize: 24px
    fontWeight: 600
    lineHeight: 1.4
  body-md:
    fontFamily: Noto Sans JP
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.7
  body-sm:
    fontFamily: Noto Sans JP
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.7
  label-md:
    fontFamily: Public Sans, Noto Sans JP
    fontSize: 16px
    fontWeight: 500
    letterSpacing: 0.06em
spacing:
  xs: 4px
  sm: 8px
  md: 12px
  lg: 20px
  xl: 40px
  gutter: 16px
rounded:
  sm: 2px
  md: 4px
  lg: 6px
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

# Neutral Gray

## Overview

数字と表が主役。色はほぼ無彩色に寄せ、意味のある箇所にだけ色を差す。想定読者は毎日この画面を開く運用担当者で、慣れによる速度を最優先する。

## Colors

白とグレーで構成し、主アクションは濃いグレー。青緑は選択中や進行中の状態にだけ使い、赤は破壊的操作に限定する。

- **Primary (#3F3F46):** 主アクション。1画面につき1箇所に絞る
- **Secondary (#0E7490):** 補助的な導線と状態表示
- **Surface (#FFFFFF) / Surface Container (#F5F5F5):** 下地と、その上に置く面
- **Outline (#D4D4D4):** 罫線と枠。文字には使わない
- **Error (#9F1239):** 失敗と破壊的操作にだけ使う

## Typography

ゴシックで統一し、見出しは32pxまでに抑える。表の可読性を優先し、行間は1.7と詰め気味にする。

- **Headline:** Public Sans, Noto Sans JP
- **Body:** Noto Sans JP
- **Label:** Public Sans, Noto Sans JP

## Layout

サイドバーと主領域の2カラム。余白は4pxの倍数で細かく刻み、1画面に入る情報量を優先する。

## Elevation & Depth

影は使わず、罫線と背景色で領域を分ける。固定ヘッダーだけ1pxの境界線で分離する。

## Shapes

角丸4pxを標準にし、表のセルは角丸なし。装飾的な丸みは付けない。

## Components

- **Button:** primary と secondary の2種類。同一画面で primary は1つ
- **Card:** surface-container の面に置き、角丸は rounded.md
- **Divider:** outline の1px。余白で足りるなら引かない
- **Alert:** error の面に on-error の文字

## Do's and Don'ts

- Do 色は状態を表すときだけ使う
- Do 余白は4pxの倍数で刻む
- Don't 破壊的操作を主アクションの色にしない
- Don't 装飾のためのアイコンを置かない
