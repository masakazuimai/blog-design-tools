#!/usr/bin/env python3
"""quiz/ の問題集ページを、iOS アプリの公式の問題集（CSV と decks.json）から作る。

使い方:
    python3 _src/quiz/build.py [公式の問題集のフォルダ]
    アプリの案内の QR を作り直すときは _src/quiz で npm install のあと npm run qr

既定のフォルダは ~/Projects/ios-apps/quiz-maker/content/official/。
出力はリポジトリ直下の quiz/<ジャンル>/ 以下（手で編集しない）。
"""
import csv
import html
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
TEMPLATES = Path(__file__).resolve().parent / "templates"
DEFAULT_SRC = Path.home() / "Projects/ios-apps/quiz-maker/content/official"
SITE = "https://codequest.work"
ASSET_VER = "20261108a"
COLUMNS = ["問題ID", "問題", "正解", "誤答1", "誤答2", "誤答3", "解説"]

GENRES = {
    "otsu4": {
        "title": "危険物乙4",
        "h1": "危険物乙4 一問一答（無料の4択問題集）",
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
    }
}


SHELF = [
    {"genre": "otsu4", "name": "危険物乙4", "note": "危険物取扱者 乙種第4類。法令・物理化学・性質消火の3科目を4択で。"},
]


def fail(message):
    sys.stderr.write(f"build.py: {message}\n")
    sys.exit(1)


def read_deck(path):
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


def app_cta(deck_id, placement):
    return render("app-cta.html", {"deck_id": deck_id, "placement": placement, "ver": ASSET_VER})


def ld(obj):
    return json.dumps(obj, ensure_ascii=False, indent=2).replace("</", "<\\/")


def provider():
    return {"@type": "Organization", "name": "CodeQuest.work", "url": f"{SITE}/"}


def build_genre(gid, genre, src_dir, manifest):
    out_dir = ROOT / "quiz" / gid
    top_url = f"{SITE}/quiz/{gid}/"
    entries = sorted((d for d in manifest if d["genre"] == gid), key=lambda d: d["order"])
    if [d["id"] for d in entries] != list(genre["decks"].keys()):
        fail(f"decks.json の {gid} の冊と build.py の設定が合いません")

    decks = []
    for entry in entries:
        meta = genre["decks"][entry["id"]]
        questions = read_deck(src_dir / f"{entry['id']}.csv")
        decks.append({**entry, **meta, "questions": questions, "url": f"{top_url}{meta['slug']}/"})

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
        payload = {"deckId": d["id"], "title": d["title"], "subject": d["subject"], "questions": d["questions"]}
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
                    "educationalLevel": "危険物取扱者試験 乙種第4類",
                    "teaches": d["teaches"],
                    "about": {"@type": "Thing", "name": "危険物取扱者 乙種第4類"},
                    "isAccessibleForFree": True,
                    "interactivityType": "active",
                    "numberOfItems": count,
                    "isPartOf": {"@type": "LearningResource", "name": genre["h1"], "url": top_url},
                    "provider": provider(),
                },
                {
                    "@type": "BreadcrumbList",
                    "itemListElement": [
                        {"@type": "ListItem", "position": 1, "name": "ホーム", "item": f"{SITE}/"},
                        {"@type": "ListItem", "position": 2, "name": genre["h1"], "item": top_url},
                        {"@type": "ListItem", "position": 3, "name": d["subject"], "item": d["url"]},
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
            "app_cta": app_cta(d["id"], "complete"),
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
    faq = [
        ("危険物乙4の試験は、どの科目が何問出ますか？",
         "危険物取扱者試験の乙種第4類は、危険物に関する法令が15問、基礎的な物理学及び基礎的な化学が10問、危険物の性質並びにその火災予防及び消火の方法が10問の、計35問の5肢択一式です。試験時間は2時間です。"),
        ("合格の基準は？",
         "試験科目ごとの成績が、それぞれ60%以上で合格です。3科目のうち1つでも60%に届かないと不合格になるため、この問題集も冊ごとに正解率を出しています。"),
        ("問題は何をもとに作っていますか？",
         "消防法、危険物の規制に関する政令・規則などの条文（e-Gov 法令検索）と、公的機関の資料をもとに作り、解説の下に出典を書いています。本番の試験問題そのものではありません。"),
        ("解いた結果はどこに保存されますか？",
         "お使いのブラウザの中（localStorage）にだけ保存されます。サーバーには送りません。同じ端末・同じブラウザなら、閉じても続きから解けます。"),
        ("お金はかかりますか？",
         "無料です。登録もいりません。"),
    ]
    faq_html = "".join(
        f'<details class="faq__item"><summary>{html.escape(q)}</summary><p>{html.escape(a)}</p></details>'
        for q, a in faq
    )
    top_desc = "危険物乙4（危険物取扱者 乙種第4類）の一問一答。法令・物理化学・性質消火の3科目を4択で解き、その場で正誤と出典つきの解説を確かめられます。間違えた問題だけの解き直しもでき、登録不要・無料です。"
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
                "educationalLevel": "危険物取扱者試験 乙種第4類",
                "about": {"@type": "Thing", "name": "危険物取扱者 乙種第4類"},
                "isAccessibleForFree": True,
                "numberOfItems": total,
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
                    {"@type": "ListItem", "position": 2, "name": genre["h1"], "item": top_url},
                ],
            },
            {
                "@type": "FAQPage",
                "mainEntity": [
                    {"@type": "Question", "name": q, "acceptedAnswer": {"@type": "Answer", "text": a}}
                    for q, a in faq
                ],
            },
        ],
    }
    page = render("top.html", {
        "title": html.escape(f"{genre['h1']}｜法令・物理化学・性質消火 全{total}問 | CodeQuest.work"),
        "desc": html.escape(top_desc),
        "url": top_url,
        "og_image": f"{top_url}og.png?v={ASSET_VER}",
        "jsonld": ld(schema),
        "h1": html.escape(genre["h1"]),
        "genre_title": html.escape(genre["title"]),
        "total": str(total),
        "rows": rows,
        "faq": faq_html,
        "app_cta": app_cta(decks[0]["id"], "top"),
        "ver": ASSET_VER,
    })
    out_dir.mkdir(parents=True, exist_ok=True)
    (out_dir / "index.html").write_text(page, encoding="utf-8")
    print(f"{gid}: {len(decks)}冊・{total}問 → {out_dir.relative_to(ROOT)}/")
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
            {"@type": "ListItem", "position": 2, "name": "無料の問題集", "item": url},
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


def main():
    src_dir = Path(sys.argv[1]).expanduser() if len(sys.argv) > 1 else DEFAULT_SRC
    manifest_path = src_dir / "decks.json"
    if not manifest_path.exists():
        fail(f"{manifest_path} が見つかりません")
    manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
    totals = {gid: build_genre(gid, genre, src_dir, manifest) for gid, genre in GENRES.items()}
    missing = [item["genre"] for item in SHELF if item["genre"] not in totals]
    if missing:
        fail(f"SHELF にあるのに GENRES に無いジャンル: {', '.join(missing)}")
    build_shelf(totals)


if __name__ == "__main__":
    main()
