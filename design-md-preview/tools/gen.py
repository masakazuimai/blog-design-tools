import io

T = [
 dict(id='washi-minimal', name='Washi Minimal',
   desc='和紙のような温かい下地に、余白と細い罫線で構造を見せる静かなトーン。',
   surface='#FBF8F1', sc='#F2EDE1', on='#2A2620', onv='#5B5347', outline='#C9BFA9',
   primary='#7A5C3E', onp='#FFFFFF', secondary='#4A5D4E', ons='#FFFFFF', error='#8B2E2E', one='#FFFFFF',
   head='Zen Old Mincho, Noto Serif JP', body='Noto Serif JP', label='Zen Old Mincho, Noto Serif JP',
   hsize='44px', hweight='500', hls='0.01em', bsize='17px', blh='2.0',
   radius=('2px', '4px', '8px', '9999px'), space=('4px', '8px', '16px', '32px', '64px', '28px'),
   overview='余白と紙の質感で語る。装飾を足すのではなく、引いた結果として品を出す。想定読者は落ち着いた読み物や工芸・飲食の紹介ページを見に来た人で、UIは静かで、急かさない。',
   colors_prose='生成りの下地に濃い墨色の文字を置き、差し色は焦茶ひとつに絞る。緑は副次的な導線にだけ使い、赤は警告以外に出さない。',
   type_prose='明朝で通す。見出しはウェイトを上げずにサイズだけで差をつけ、本文は行間を広く取って読み疲れを避ける。',
   layout_prose='1カラムを基本とし、本文幅は42文字前後で止める。余白は8pxの倍数で刻み、セクション間は64pxを標準にする。',
   elev_prose='影は使わない。階層は下地の濃淡と細い罫線だけで表す。カードは surface-container に置き、輪郭は outline の1pxで示す。',
   shape_prose='角丸は最小限。カードは4px、入力欄は2px。丸みで柔らかさを出すのではなく、余白で出す。',
   dos=['Do 余白を削るより要素を減らす', 'Do 差し色は1画面に1箇所', "Don't 影で階層を作らない", "Don't 見出しを太字にしない"]),

 dict(id='terminal-dark', name='Terminal Dark',
   desc='端末の配色をそのまま持ち込んだ開発者向けのダークテーマ。等幅を主役に据える。',
   surface='#0D1117', sc='#161B22', on='#E6EDF3', onv='#9DA7B3', outline='#30363D',
   primary='#2EA043', onp='#06140A', secondary='#316DCA', ons='#FFFFFF', error='#F85149', one='#1B0B0A',
   head='JetBrains Mono, Noto Sans JP', body='Noto Sans JP', label='JetBrains Mono, Noto Sans JP',
   hsize='40px', hweight='700', hls='-0.02em', bsize='16px', blh='1.8',
   radius=('4px', '6px', '10px', '9999px'), space=('4px', '8px', '16px', '24px', '48px', '20px'),
   overview='開発者が一日中開いても疲れない画面を狙う。装飾より情報密度、アニメーションより即時性。想定読者はドキュメントやダッシュボードを読みに来たエンジニアで、コードが主役になる。',
   colors_prose='背景は純黒を避けた濃紺寄りの黒。緑を実行系の主アクション、青を参照系のリンク、赤を失敗にだけ割り当て、色に意味を固定する。',
   type_prose='見出しとラベルは等幅、本文は日本語ゴシック。等幅を混ぜることでコードとの地続き感を出す。',
   layout_prose='最大幅960pxの1カラム。行の高さは1.8を守り、コードブロックの前後は24pxを空ける。',
   elev_prose='影ではなく背景の明度差で層を作る。最前面ほど明るくし、罫線は outline で最小限に留める。',
   shape_prose='角丸は6pxを基準に、ボタンとタグだけ10px。丸すぎるとターミナルの緊張感が消える。',
   dos=['Do 色に意味を固定する', 'Do コードは surface-container に置く', "Don't 純黒を背景にしない", "Don't 緑を装飾に使わない"]),

 dict(id='corporate-trust', name='Corporate Trust',
   desc='受託制作やBtoBサイトで最も選ばれる、青を軸にした堅実で読みやすいトーン。',
   surface='#FFFFFF', sc='#F1F5F9', on='#0F172A', onv='#475569', outline='#CBD5E1',
   primary='#1D4ED8', onp='#FFFFFF', secondary='#0F766E', ons='#FFFFFF', error='#B91C1C', one='#FFFFFF',
   head='Inter, Noto Sans JP', body='Noto Sans JP', label='Inter, Noto Sans JP',
   hsize='40px', hweight='700', hls='-0.02em', bsize='16px', blh='1.9',
   radius=('4px', '8px', '12px', '9999px'), space=('4px', '8px', '16px', '24px', '56px', '24px'),
   overview='信頼と読みやすさを最優先する。奇をてらわず、初見の担当者が迷わないことを基準にする。想定読者は発注を検討している事業会社の担当者で、判断材料を探している。',
   colors_prose='白地に濃紺の文字。主アクションは青ひとつに絞り、実績や補足の見出しに深緑を使う。赤はエラー表示だけに限定する。',
   type_prose='ゴシックで統一し、見出しは太さで差をつける。本文は16pxを下限とし、行間1.9で長文でも読める状態を保つ。',
   layout_prose='最大幅1200pxのグリッド。カードは3カラムを基本に、狭い画面では1カラムへ落とす。セクション間は56px。',
   elev_prose='影は弱く1段階だけ。カードは surface-container の面と1pxの罫線で表し、浮かせすぎない。',
   shape_prose='角丸8pxを標準に、ボタンは12px。全体を通して同じ半径を使い回し、形のばらつきを作らない。',
   dos=['Do 主アクションは1画面に1つ', 'Do 数値には出典を添える', "Don't 青を装飾で使い回さない", "Don't 影を重ねて立体にしない"]),

 dict(id='editorial-serif', name='Editorial Serif',
   desc='読み物のための明朝とセリフ。長文を最後まで読ませることに全振りしたトーン。',
   surface='#FCFBF9', sc='#F0EEE9', on='#1B1A17', onv='#56534C', outline='#D6D2C8',
   primary='#8C2F1E', onp='#FFFFFF', secondary='#33475B', ons='#FFFFFF', error='#A3211B', one='#FFFFFF',
   head='Newsreader, Noto Serif JP', body='Noto Serif JP', label='Newsreader, Noto Serif JP',
   hsize='46px', hweight='600', hls='-0.01em', bsize='18px', blh='2.05',
   radius=('0px', '2px', '4px', '9999px'), space=('4px', '8px', '16px', '40px', '72px', '32px'),
   overview='雑誌の記事ページを紙からそのまま持ってくる。写真より文字、動きより静けさ。想定読者は腰を据えて読みに来た人で、スクロールの速度が遅いことを前提にする。',
   colors_prose='わずかに温かい白の紙面に、黒に近い墨。差し色は煉瓦色ひとつで、引用や補足には藍を使う。',
   type_prose='見出しも本文もセリフで通す。本文は18px・行間2.05まで開き、1行あたり40文字前後で改行させる。',
   layout_prose='本文は680pxの1カラム。図版だけ本文幅を超えて配置してよい。セクション間は72pxと大きく取る。',
   elev_prose='影を使わない。紙面に層は存在しないという前提で、区切りは罫線と余白だけで表現する。',
   shape_prose='角丸は原則0。写真と引用ブロックだけ2pxを許す。紙の直線的な佇まいを崩さない。',
   dos=['Do 1行40文字前後で改行させる', 'Do 引用は藍で示す', "Don't 角丸を大きくしない", "Don't 本文を16px未満にしない"]),

 dict(id='pop-bold', name='Pop Bold',
   desc='高彩度と太字で勢いを出す、SaaSやキャンペーンLP向けの明るいトーン。',
   surface='#FFFDF7', sc='#FFF1D6', on='#1A1300', onv='#5A4B23', outline='#E2C98A',
   primary='#D93F00', onp='#FFFFFF', secondary='#5B2BD9', ons='#FFFFFF', error='#B3001B', one='#FFFFFF',
   head='Plus Jakarta Sans, Zen Kaku Gothic New', body='Zen Kaku Gothic New', label='Plus Jakarta Sans, Zen Kaku Gothic New',
   hsize='52px', hweight='800', hls='-0.03em', bsize='17px', blh='1.85',
   radius=('8px', '12px', '20px', '9999px'), space=('4px', '8px', '16px', '28px', '64px', '24px'),
   overview='第一印象で足を止めさせる。明るい下地に大きな見出しを置き、行動を促す色を1つだけ強く出す。想定読者は広告やSNSから流入した初見の人で、滞在時間は短い。',
   colors_prose='クリーム色の下地に朱色の主アクション。紫は補助的な訴求に回し、濃い側の面 surface-container は強調ブロックに使う。',
   type_prose='見出しは800ウェイトで詰め気味に。本文は角丸のあるゴシックで、見出しとの太さの差を大きく取る。',
   layout_prose='最大幅1120px。ヒーローは上下64pxを空け、カードは3カラム。要素の間隔は詰めすぎない。',
   elev_prose='影は色付きで柔らかく1段階。主ボタンにだけ影を許し、それ以外は面の色で階層を示す。',
   shape_prose='角丸を大きく取る。カードは20px、ボタンは全円。丸みで親しみやすさを作る。',
   dos=['Do 主アクションは朱色だけ', 'Do 見出しは短く言い切る', "Don't 彩度の高い色を3色以上出さない", "Don't 本文まで太字にしない"]),

 dict(id='neutral-gray', name='Neutral Gray',
   desc='装飾を削り、データを読ませることに徹した管理画面向けのニュートラルなトーン。',
   surface='#FFFFFF', sc='#F5F5F5', on='#1F1F1F', onv='#4F4F4F', outline='#D4D4D4',
   primary='#3F3F46', onp='#FFFFFF', secondary='#0E7490', ons='#FFFFFF', error='#9F1239', one='#FFFFFF',
   head='Public Sans, Noto Sans JP', body='Noto Sans JP', label='Public Sans, Noto Sans JP',
   hsize='32px', hweight='600', hls='-0.01em', bsize='16px', blh='1.7',
   radius=('2px', '4px', '6px', '9999px'), space=('4px', '8px', '12px', '20px', '40px', '16px'),
   overview='数字と表が主役。色はほぼ無彩色に寄せ、意味のある箇所にだけ色を差す。想定読者は毎日この画面を開く運用担当者で、慣れによる速度を最優先する。',
   colors_prose='白とグレーで構成し、主アクションは濃いグレー。青緑は選択中や進行中の状態にだけ使い、赤は破壊的操作に限定する。',
   type_prose='ゴシックで統一し、見出しは32pxまでに抑える。表の可読性を優先し、行間は1.7と詰め気味にする。',
   layout_prose='サイドバーと主領域の2カラム。余白は4pxの倍数で細かく刻み、1画面に入る情報量を優先する。',
   elev_prose='影は使わず、罫線と背景色で領域を分ける。固定ヘッダーだけ1pxの境界線で分離する。',
   shape_prose='角丸4pxを標準にし、表のセルは角丸なし。装飾的な丸みは付けない。',
   dos=['Do 色は状態を表すときだけ使う', 'Do 余白は4pxの倍数で刻む', "Don't 破壊的操作を主アクションの色にしない", "Don't 装飾のためのアイコンを置かない"]),
]

TPL = '''---
version: alpha
name: {name}
description: {desc}
colors:
  surface: "{surface}"
  surface-container: "{sc}"
  on-surface: "{on}"
  on-surface-variant: "{onv}"
  outline: "{outline}"
  primary: "{primary}"
  on-primary: "{onp}"
  secondary: "{secondary}"
  on-secondary: "{ons}"
  error: "{error}"
  on-error: "{one}"
typography:
  headline-lg:
    fontFamily: {head}
    fontSize: {hsize}
    fontWeight: {hweight}
    lineHeight: 1.2
    letterSpacing: {hls}
  headline-md:
    fontFamily: {head}
    fontSize: 24px
    fontWeight: {hweight}
    lineHeight: 1.4
  body-md:
    fontFamily: {body}
    fontSize: {bsize}
    fontWeight: 400
    lineHeight: {blh}
  body-sm:
    fontFamily: {body}
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.7
  label-md:
    fontFamily: {label}
    fontSize: 16px
    fontWeight: 500
    letterSpacing: 0.06em
spacing:
  xs: {sp0}
  sm: {sp1}
  md: {sp2}
  lg: {sp3}
  xl: {sp4}
  gutter: {sp5}
rounded:
  sm: {r0}
  md: {r1}
  lg: {r2}
  full: {r3}
components:
  page:
    backgroundColor: "{{colors.surface}}"
    textColor: "{{colors.on-surface}}"
    typography: "{{typography.body-md}}"
  card:
    backgroundColor: "{{colors.surface-container}}"
    textColor: "{{colors.on-surface}}"
    rounded: "{{rounded.md}}"
    padding: "{{spacing.gutter}}"
  caption:
    backgroundColor: "{{colors.surface}}"
    textColor: "{{colors.on-surface-variant}}"
    typography: "{{typography.body-sm}}"
  divider:
    backgroundColor: "{{colors.outline}}"
    height: 1px
  button-primary:
    backgroundColor: "{{colors.primary}}"
    textColor: "{{colors.on-primary}}"
    typography: "{{typography.label-md}}"
    rounded: "{{rounded.md}}"
    padding: "{{spacing.md}}"
  button-secondary:
    backgroundColor: "{{colors.secondary}}"
    textColor: "{{colors.on-secondary}}"
    typography: "{{typography.label-md}}"
    rounded: "{{rounded.md}}"
    padding: "{{spacing.md}}"
  alert-error:
    backgroundColor: "{{colors.error}}"
    textColor: "{{colors.on-error}}"
    rounded: "{{rounded.sm}}"
    padding: "{{spacing.sm}}"
---

# {name}

## Overview

{overview}

## Colors

{colors_prose}

- **Primary ({primary}):** 主アクション。1画面につき1箇所に絞る
- **Secondary ({secondary}):** 補助的な導線と状態表示
- **Surface ({surface}) / Surface Container ({sc}):** 下地と、その上に置く面
- **Outline ({outline}):** 罫線と枠。文字には使わない
- **Error ({error}):** 失敗と破壊的操作にだけ使う

## Typography

{type_prose}

- **Headline:** {head}
- **Body:** {body}
- **Label:** {label}

## Layout

{layout_prose}

## Elevation & Depth

{elev_prose}

## Shapes

{shape_prose}

## Components

- **Button:** primary と secondary の2種類。同一画面で primary は1つ
- **Card:** surface-container の面に置き、角丸は rounded.md
- **Divider:** outline の1px。余白で足りるなら引かない
- **Alert:** error の面に on-error の文字

## Do's and Don'ts

{dos_text}
'''

for t in T:
    p = dict(t)
    r = p.pop('radius')
    s = p.pop('space')
    dos = p.pop('dos')
    p.pop('id')
    body = TPL.format(
        **p,
        r0=r[0], r1=r[1], r2=r[2], r3=r[3],
        sp0=s[0], sp1=s[1], sp2=s[2], sp3=s[3], sp4=s[4], sp5=s[5],
        dos_text="\n".join('- ' + d for d in dos),
    )
    io.open(t['id'] + '.md', 'w', encoding='utf-8').write(body)
    print(f"  {t['id']}.md  {len(body)}字  name={t['name']}")
