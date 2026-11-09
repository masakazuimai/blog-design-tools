#!/usr/bin/env python3
"""quiz/ の問題集ページを、ジャンルごとの CSV（と、あれば decks.json）から作る。

使い方:
    python3 _src/quiz/build.py                   各ジャンルの既定のフォルダ（GENRES の src）から作る
    python3 _src/quiz/build.py <フォルダ>         decks.json のあるフォルダ。そこに載っているジャンルだけ差し替える
    python3 _src/quiz/build.py <ジャンル>=<フォルダ>  ジャンルを指定して差し替える（いくつでも並べてよい）
    アプリの案内の QR を作り直すときは _src/quiz で npm install のあと npm run qr

decks.json の無いフォルダは、GENRES の decks の順と title で作る（アプリより先にページを作るとき）。
出力はリポジトリ直下の quiz/<ジャンル>/ 以下（手で編集しない）。
"""
import csv
import html
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
TEMPLATES = Path(__file__).resolve().parent / "templates"
RESEARCH = Path.home() / ".claude/projects/-Users-orectic-Projects/docs/research"
SITE = "https://codequest.work"
ASSET_VER = "20261109a"
COLUMNS = ["問題ID", "問題", "正解", "誤答1", "誤答2", "誤答3", "解説"]

EGOV = '<a href="https://laws.e-gov.go.jp/" target="_blank" rel="noopener">e-Gov 法令検索</a>'
EXAM_OR_JP = ("安全衛生技術試験協会「第一種・第二種衛生管理者の紹介」", "https://www.exam.or.jp/introduction/h_shokai502")

GENRES = {
    "otsu4": {
        "src": Path.home() / "Projects/ios-apps/quiz-maker/content/official",
        "title": "危険物乙4",
        "h1": "危険物乙4 一問一答（無料の4択問題集）",
        "exam_name": "危険物取扱者試験 乙種第4類",
        "about": "危険物取扱者 乙種第4類",
        "top_title_tail": "法令・物理化学・性質消火",
        "top_desc": "危険物乙4（危険物取扱者 乙種第4類）の一問一答。法令・物理化学・性質消火の3科目を4択で解き、その場で正誤と出典つきの解説を確かめられます。間違えた問題だけの解き直しもでき、登録不要・無料です。",
        "hero_lead": "危険物取扱者 乙種第4類の試験に出る3科目を、全{total}問の4択で解けます。答えるとすぐに正誤と解説が出て、間違えた問題だけを解き直せます。登録はいりません。",
        "decks_note": "本番は3科目で35問。科目ごとに60%以上の正解で合格です。",
        "howto_first": "法令・物理化学・性質消火から1つ選びます。最初は問題数の多い法令がおすすめです。",
        "about_html": f'問題と解説は、消防法、危険物の規制に関する政令・規則（{EGOV}）と公的機関の資料をもとに作り、解説ごとに出典を書いています。本番の試験問題そのものではありません。試験の科目と問題数は<a href="https://www.shoubo-shiken.or.jp/kikenbutsu/annai/subject.html" target="_blank" rel="noopener">消防試験研究センター</a>の案内に合わせています。',
        "plate": "火気厳禁",
        "pass_ratio": 0.6,
        "pass_label": "本番の合格ライン（各科目60%）",
        "app_pack": "本番形式の模試3回と追加の150問が入った「危険物乙4 実力テストパック」は、アプリで解けます。",
        "faq": [
            ("危険物乙4の試験は、どの科目が何問出ますか？",
             "危険物取扱者試験の乙種第4類は、危険物に関する法令が15問、基礎的な物理学及び基礎的な化学が10問、危険物の性質並びにその火災予防及び消火の方法が10問の、計35問で、どの問題も5つの選択肢から1つを選ぶ形式です。試験時間は2時間です。",
             ("消防試験研究センター「危険物取扱者試験 乙種第4類 過去に出題された問題」（PDF）", "https://www.shoubo-shiken.or.jp/content/kikenbutsu_otsu4.pdf")),
            ("合格の基準は？",
             "試験科目ごとの成績が、それぞれ60%以上で合格です。3科目のうち1つでも60%に届かないと不合格になるため、この問題集も冊ごとに正解率を出しています。", None),
            ("問題は何をもとに作っていますか？",
             "消防法、危険物の規制に関する政令・規則などの条文（e-Gov 法令検索）と、公的機関の資料をもとに作り、解説の下に出典を書いています。本番の試験問題そのものではありません。", None),
            ("解いた結果はどこに保存されますか？",
             "お使いのブラウザの中（localStorage）にだけ保存されます。サーバーには送りません。同じ端末・同じブラウザなら、閉じても続きから解けます。", None),
            ("お金はかかりますか？",
             "無料です。登録もいりません。", None),
        ],
        "decks": {
            "otsu4-hoki": {
                "slug": "hoki",
                "subject": "法令",
                "exam": 15,
                "lead": "消防法と危険物の規制に関する政令・規則から、指定数量、製造所等の区分、許可と届出、保安講習、貯蔵・取扱い・運搬の基準までを4択で確かめます。",
                "teaches": "危険物に関する法令（消防法・危険物の規制に関する政令・規則）",
            },
            "otsu4-butsuri": {
                "slug": "butsuri",
                "subject": "物理・化学",
                "exam": 10,
                "lead": "燃焼の三要素、引火点と発火点、静電気、比熱や沸点、酸化と還元など、基礎的な物理学と化学の要点を4択で確かめます。",
                "teaches": "基礎的な物理学及び基礎的な化学（燃焼・消火の理論を含む）",
            },
            "otsu4-seishitsu": {
                "slug": "seishitsu",
                "subject": "性質・消火",
                "exam": 10,
                "lead": "特殊引火物から動植物油類まで、第4類の危険物それぞれの性質と、火災予防と消火の方法を4択で確かめます。",
                "teaches": "第4類の危険物の性質並びにその火災予防及び消火の方法",
            },
        },
    },
    "eisei2": {
        "src": RESEARCH / "eisei2/free",
        "title": "第二種衛生管理者",
        "h1": "第二種衛生管理者 一問一答（無料の4択問題集）",
        "exam_name": "第二種衛生管理者免許試験",
        "about": "第二種衛生管理者",
        "top_title_tail": "関係法令",
        "top_desc": "第二種衛生管理者の一問一答。関係法令の問題を4択で解き、その場で正誤と出典つきの解説を確かめられます。間違えた問題だけの解き直しもでき、登録不要・無料です。",
        "hero_lead": "第二種衛生管理者の試験に出る関係法令を、全{total}問の4択で解けます。答えるとすぐに正誤と解説が出て、間違えた問題だけを解き直せます。登録はいりません。",
        "decks_note": "本番は関係法令・労働衛生・労働生理の3科目で30問。科目ごとに40%以上、かつ合計で60%以上の正解で合格です。",
        "howto_first": "いまは関係法令の冊を解けます。労働衛生と労働生理の冊は準備しています。",
        "about_html": f'問題と解説は、労働安全衛生法、労働安全衛生規則、事務所衛生基準規則、労働基準法などの条文（{EGOV}）と公的機関の資料をもとに作り、解説ごとに出典を書いています。本番の試験問題そのものではありません。試験の科目と問題数は<a href="{EXAM_OR_JP[1]}" target="_blank" rel="noopener">安全衛生技術試験協会</a>の案内に合わせています。',
        "plate": "衛生管理者",
        "pass_ratio": 0.6,
        "pass_label": "合格の目安（合計60%）",
        "app_pack": "第二種衛生管理者の模試と追加の問題は、アプリで解けます。",
        "faq": [
            ("第二種衛生管理者の試験は、どの科目が何問出ますか？",
             "関係法令（有害業務に係るものを除く）、労働衛生（有害業務に係るものを除く）、労働生理の3科目が10問ずつ、計30問です。試験時間は3時間です。",
             EXAM_OR_JP),
            ("合格の基準は？",
             "科目ごとの得点が40%以上で、かつ合計が60%以上で合格です。合計が60%を超えていても、1科目でも40%に届かないと不合格になります。",
             EXAM_OR_JP),
            ("第二種衛生管理者の免許で、どの業種の衛生管理者になれますか？",
             "農林畜水産業、鉱業、建設業、製造業、電気業、ガス業、水道業、熱供給業、運送業、自動車整備業、機械修理業、医療業、清掃業を除く業種の事業場で、衛生管理者に選ばれることができます。除かれた業種の事業場では、第一種衛生管理者免許などが必要です。",
             ("労働安全衛生規則 第7条第1項第3号（e-Gov 法令検索）", "https://laws.e-gov.go.jp/law/347M50002000032")),
            ("問題は何をもとに作っていますか？",
             "労働安全衛生法、労働安全衛生規則、事務所衛生基準規則、労働基準法などの条文（e-Gov 法令検索）と、公的機関の資料をもとに作り、解説の下に出典を書いています。本番の試験問題そのものではありません。", None),
            ("解いた結果はどこに保存されますか？",
             "お使いのブラウザの中（localStorage）にだけ保存されます。サーバーには送りません。同じ端末・同じブラウザなら、閉じても続きから解けます。", None),
            ("お金はかかりますか？",
             "無料です。登録もいりません。", None),
        ],
        "decks": {
            "eisei2-hourei": {
                "title": "第二種衛生管理者 関係法令",
                "slug": "hourei",
                "subject": "関係法令",
                "exam": 10,
                "lead": "労働安全衛生法と労働安全衛生規則、事務所衛生基準規則、労働基準法から、衛生管理者・産業医の選任、衛生委員会、健康診断、事務所の衛生基準、労働時間と休暇までを4択で確かめます。",
                "teaches": "関係法令（有害業務に係るものを除く）",
            },
        },
    },
}


SHELF = [
    {"genre": "otsu4", "name": "危険物乙4", "note": "危険物取扱者 乙種第4類。法令・物理化学・性質消火の3科目を4択で。"},
    {"genre": "eisei2", "name": "第二種衛生管理者", "note": "第二種衛生管理者免許試験。いまは関係法令の冊を4択で。"},
]


SHELF_NAME = "無料の問題集"
SHELF_URL = f"{SITE}/quiz/"


def fail(message):
    sys.stderr.write(f"build.py: {message}\n")
    sys.exit(1)


def read_deck(path):
    if not path.exists():
        fail(f"{path} が見つかりません")
    with path.open(encoding="utf-8-sig", newline="") as f:
        rows = list(csv.reader(f))
    if not rows or rows[0] != COLUMNS:
        fail(f"{path.name} の見出しが {','.join(COLUMNS)} ではありません")
    questions = []
    seen = set()
    for n, row in enumerate(rows[1:], start=2):
        if len(row) != len(COLUMNS):
            fail(f"{path.name} {n}行目の列の数が {len(row)} です")
        qid, text, answer, w1, w2, w3, note = (c.strip() for c in row)
        if not all([qid, text, answer, w1, w2, w3, note]):
            fail(f"{path.name} {n}行目に空の列があります")
        if qid in seen:
            fail(f"{path.name} の問題ID {qid} が重複しています")
        if len({answer, w1, w2, w3}) != 4:
            fail(f"{path.name} の {qid} に同じ選択肢があります")
        seen.add(qid)
        parts = note.split("出典：")
        sources = [p.strip().strip("／").strip() for p in parts[1:] if p.strip().strip("／").strip()]
        questions.append({
            "id": qid,
            "q": text,
            "a": answer,
            "w": [w1, w2, w3],
            "note": parts[0].strip(),
            "src": sources,
        })
    return questions


def render(name, values):
    text = (TEMPLATES / name).read_text(encoding="utf-8")
    for key, value in values.items():
        text = text.replace("{{" + key + "}}", value)
    if "{{" in text:
        fail(f"{name} に埋まっていない差し込みがあります")
    return text


def app_cta(genre, deck_id, placement):
    return render("app-cta.html", {
        "deck_id": deck_id,
        "placement": placement,
        "pack": html.escape(genre["app_pack"]),
        "ver": ASSET_VER,
    })


def ld(obj):
    return json.dumps(obj, ensure_ascii=False, indent=2).replace("</", "<\\/")


def provider():
    return {"@type": "Organization", "name": "CodeQuest.work", "url": f"{SITE}/"}


def deck_entries(gid, genre, src_dir):
    manifest_path = src_dir / "decks.json"
    if not manifest_path.exists():
        return [{"id": deck_id, "title": meta["title"]} for deck_id, meta in genre["decks"].items()]
    manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
    entries = sorted((d for d in manifest if d["genre"] == gid), key=lambda d: d["order"])
    if [d["id"] for d in entries] != list(genre["decks"].keys()):
        fail(f"{manifest_path} の {gid} の冊と build.py の設定が合いません")
    return entries


def build_genre(gid, genre, src_dir):
    out_dir = ROOT / "quiz" / gid
    top_url = f"{SITE}/quiz/{gid}/"

    decks = []
    for entry in deck_entries(gid, genre, src_dir):
        meta = genre["decks"][entry["id"]]
        questions = read_deck(src_dir / f"{entry['id']}.csv")
        decks.append({**meta, **entry, "questions": questions, "url": f"{top_url}{meta['slug']}/"})

    total = sum(len(d["questions"]) for d in decks)
    deck_links = [
        {"id": d["id"], "subject": d["subject"], "count": len(d["questions"]), "url": f"/quiz/{gid}/{d['slug']}/"}
        for d in decks
    ]

    for d in decks:
        count = len(d["questions"])
        title = f"{d['title']} 一問一答｜無料の4択問題（全{count}問）| CodeQuest.work"
        desc = f"{d['title']}の一問一答。{d['lead']}その場で正誤と解説が出て、間違えた問題だけを解き直せます。登録不要・無料。"
        others = "".join(
            f'<li><a href="{html.escape(o["url"])}">{html.escape(genre["title"])} {html.escape(o["subject"])}<span class="others__count">{o["count"]}問</span></a></li>'
            for o in deck_links if o["id"] != d["id"]
        )
        qlist = "".join(f"<li>{html.escape(q['q'])}</li>" for q in d["questions"])
        payload = {
            "deckId": d["id"],
            "title": d["title"],
            "subject": d["subject"],
            "passRatio": genre["pass_ratio"],
            "passLabel": genre["pass_label"],
            "questions": d["questions"],
        }
        schema = {
            "@context": "https://schema.org",
            "@graph": [
                {
                    "@type": "LearningResource",
                    "name": f"{d['title']} 一問一答",
                    "description": desc,
                    "url": d["url"],
                    "inLanguage": "ja",
                    "learningResourceType": "練習問題",
                    "educationalLevel": genre["exam_name"],
                    "teaches": d["teaches"],
                    "about": {"@type": "Thing", "name": genre["about"]},
                    "isAccessibleForFree": True,
                    "interactivityType": "active",
                    "isPartOf": {"@type": "LearningResource", "name": genre["h1"], "url": top_url},
                    "provider": provider(),
                },
                {
                    "@type": "BreadcrumbList",
                    "itemListElement": [
                        {"@type": "ListItem", "position": 1, "name": "ホーム", "item": f"{SITE}/"},
                        {"@type": "ListItem", "position": 2, "name": SHELF_NAME, "item": SHELF_URL},
                        {"@type": "ListItem", "position": 3, "name": genre["h1"], "item": top_url},
                        {"@type": "ListItem", "position": 4, "name": d["subject"], "item": d["url"]},
                    ],
                },
            ],
        }
        page = render("deck.html", {
            "title": html.escape(title),
            "desc": html.escape(desc),
            "url": d["url"],
            "og_image": f"{top_url}og.png?v={ASSET_VER}",
            "jsonld": ld(schema),
            "genre_title": html.escape(genre["title"]),
            "genre_h1": html.escape(genre["h1"]),
            "subject": html.escape(d["subject"]),
            "deck_title": html.escape(d["title"]),
            "deck_id": d["id"],
            "count": str(count),
            "exam": str(d["exam"]),
            "lead": html.escape(d["lead"]),
            "others": others,
            "app_cta": app_cta(genre, d["id"], "complete"),
            "qlist": qlist,
            "data": json.dumps(payload, ensure_ascii=False).replace("</", "<\\/"),
            "ver": ASSET_VER,
        })
        target = out_dir / d["slug"] / "index.html"
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_text(page, encoding="utf-8")

    rows = "".join(
        render("deck-row.html", {
            "deck_id": d["id"],
            "href": f"{d['slug']}/",
            "subject": html.escape(d["subject"]),
            "count": str(len(d["questions"])),
            "exam": str(d["exam"]),
            "lead": html.escape(d["lead"]),
        })
        for d in decks
    )
    faq = genre["faq"]

    def faq_answer_html(a, src):
        if not src:
            return html.escape(a)
        return f'{html.escape(a)}出典：<a href="{html.escape(src[1])}" target="_blank" rel="noopener">{html.escape(src[0])}</a>'

    def faq_answer_text(a, src):
        return f"{a}出典：{src[0]} {src[1]}" if src else a

    faq_html = "".join(
        f'<details class="faq__item"><summary>{html.escape(q)}</summary><p>{faq_answer_html(a, src)}</p></details>'
        for q, a, src in faq
    )
    top_desc = genre["top_desc"]
    schema = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "LearningResource",
                "name": genre["h1"],
                "description": top_desc,
                "url": top_url,
                "inLanguage": "ja",
                "learningResourceType": "練習問題",
                "educationalLevel": genre["exam_name"],
                "about": {"@type": "Thing", "name": genre["about"]},
                "isAccessibleForFree": True,
                "hasPart": [
                    {"@type": "LearningResource", "name": f"{d['title']} 一問一答", "url": d["url"]}
                    for d in decks
                ],
                "provider": provider(),
            },
            {
                "@type": "BreadcrumbList",
                "itemListElement": [
                    {"@type": "ListItem", "position": 1, "name": "ホーム", "item": f"{SITE}/"},
                    {"@type": "ListItem", "position": 2, "name": SHELF_NAME, "item": SHELF_URL},
                    {"@type": "ListItem", "position": 3, "name": genre["h1"], "item": top_url},
                ],
            },
            {
                "@type": "FAQPage",
                "mainEntity": [
                    {"@type": "Question", "name": q, "acceptedAnswer": {"@type": "Answer", "text": faq_answer_text(a, src)}}
                    for q, a, src in faq
                ],
            },
        ],
    }
    page = render("top.html", {
        "title": html.escape(f"{genre['h1']}｜{genre['top_title_tail']} 全{total}問 | CodeQuest.work"),
        "desc": html.escape(top_desc),
        "url": top_url,
        "og_image": f"{top_url}og.png?v={ASSET_VER}",
        "jsonld": ld(schema),
        "h1": html.escape(genre["h1"]),
        "genre_id": gid,
        "genre_title": html.escape(genre["title"]),
        "plate": html.escape(genre["plate"]),
        "hero_lead": html.escape(genre["hero_lead"].format(total=total)),
        "decks_note": html.escape(genre["decks_note"]),
        "howto_first": html.escape(genre["howto_first"]),
        "about_html": genre["about_html"],
        "rows": rows,
        "faq": faq_html,
        "app_cta": app_cta(genre, decks[0]["id"], "top"),
        "ver": ASSET_VER,
    })
    out_dir.mkdir(parents=True, exist_ok=True)
    (out_dir / "index.html").write_text(page, encoding="utf-8")
    print(f"{gid}: {len(decks)}冊・{total}問 ← {src_dir} → {out_dir.relative_to(ROOT)}/")
    return total


def build_shelf(totals):
    url = f"{SITE}/quiz/"
    items = "".join(
        render("shelf-row.html", {
            "href": f"{item['genre']}/",
            "name": html.escape(item["name"]),
            "note": html.escape(item["note"]),
            "count": str(totals[item["genre"]]),
        })
        for item in SHELF
    )
    schema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {"@type": "ListItem", "position": 1, "name": "ホーム", "item": f"{SITE}/"},
            {"@type": "ListItem", "position": 2, "name": SHELF_NAME, "item": url},
        ],
    }
    desc = "資格試験の一問一答を、ブラウザでそのまま解ける無料の問題集です。4択で答えるとすぐに正誤と出典つきの解説が出て、間違えた問題だけを解き直せます。登録不要。"
    page = render("shelf.html", {
        "title": "無料の問題集｜資格試験の一問一答を4択で | CodeQuest.work",
        "desc": html.escape(desc),
        "url": url,
        "og_image": f"{SITE}/quiz/otsu4/og.png?v={ASSET_VER}",
        "jsonld": ld(schema),
        "items": items,
        "ver": ASSET_VER,
    })
    (ROOT / "quiz" / "index.html").write_text(page, encoding="utf-8")
    print(f"棚: {len(SHELF)}件 → quiz/index.html")


def source_dirs(args):
    dirs = {gid: genre["src"] for gid, genre in GENRES.items()}
    for arg in args:
        if "=" in arg:
            gid, path = arg.split("=", 1)
            if gid not in GENRES:
                fail(f"GENRES に無いジャンル: {gid}")
            dirs[gid] = Path(path).expanduser()
            continue
        folder = Path(arg).expanduser()
        manifest_path = folder / "decks.json"
        if not manifest_path.exists():
            fail(f"{manifest_path} が見つかりません（decks.json の無いフォルダは <ジャンル>=<フォルダ> で渡す）")
        listed = {d["genre"] for d in json.loads(manifest_path.read_text(encoding="utf-8"))}
        for gid in listed & set(GENRES):
            dirs[gid] = folder
    return dirs


def main():
    dirs = source_dirs(sys.argv[1:])
    totals = {gid: build_genre(gid, genre, dirs[gid]) for gid, genre in GENRES.items()}
    missing = [item["genre"] for item in SHELF if item["genre"] not in totals]
    if missing:
        fail(f"SHELF にあるのに GENRES に無いジャンル: {', '.join(missing)}")
    build_shelf(totals)


if __name__ == "__main__":
    main()
