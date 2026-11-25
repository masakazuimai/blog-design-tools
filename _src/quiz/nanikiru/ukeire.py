#!/usr/bin/env python3
"""何切るの受け入れ当て（/quiz/nanikiru/）の問題を計算で確かめ、ページ用の data.js を書く。

使い方:
    python3 _src/quiz/nanikiru/ukeire.py          計算して quiz/nanikiru/data.js を書く
    python3 _src/quiz/nanikiru/ukeire.py --check  書かずに、計算の結果とアプリの問題との重なりを出す

向聴数は一般形・七対子・国士無双のうち一番小さいもの（何切るドリルと同じ）。
受け入れ＝1枚引くと向聴数が1つ進む牌。残り枚数＝4枚から手にある枚数を引いた数。
"""
import json
import sys
from functools import lru_cache
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
APP_PROBLEMS = Path.home() / "Projects/ios-apps/nanikiru/content/problems.json"
OUT = ROOT / "quiz" / "nanikiru" / "data.js"

SUITS = "mpsz"
NAMES_NUM = "一二三四五六七八九"
SUIT_NAME = {"m": "萬", "p": "筒", "s": "索"}
HONOR_NAME = ["東", "南", "西", "北", "白", "發", "中"]

PROBLEMS = [
    {
        "hand": "234m567p345s99s67m",
        "theme": "両面待ち",
        "note": "六七萬の両面が残ったテンパイです。五萬と八萬で上がれます。両面は2種8枚を待てる、いちばん基本の形です。",
    },
    {
        "hand": "123456m789p2345s",
        "theme": "ノベタン",
        "note": "二三四五索は、二索か五索を引くと雀頭と面子に分かれます。4枚続きの両端で待つ形をノベタンといいます。",
    },
    {
        "hand": "234m567p99s23456s",
        "theme": "三面待ち",
        "note": "二三四五六索は、一索・四索・七索のどれを引いても面子2つになります。5枚続きは3種を待てる強い形です。",
    },
    {
        "hand": "3334m567p789s345s",
        "theme": "暗刻にくっついた形",
        "note": "三三三萬を刻子と見ると四萬の単騎、三三を雀頭と見ると三四萬の両面で二萬・五萬。合わせて二萬・四萬・五萬の3種です。",
    },
    {
        "hand": "11m44m22p77p55s88s1z",
        "theme": "七対子のテンパイ",
        "note": "対子が6組あるので七対子のテンパイです。待ちは東の1種だけで、手にもう1枚あるので残りは3枚です。",
    },
    {
        "hand": "13m45p789p345s4z66z",
        "theme": "嵌張と両面のイーシャンテン",
        "note": "一三萬の嵌張は二萬だけ、四五筒の両面は三筒と六筒を待てます。白の対子が雀頭になるので、北を重ねても前に進みません。",
    },
    {
        "hand": "2245m678p345s79s1z",
        "theme": "雀頭と両面がくっついた形",
        "note": "二二四五萬は、二二が雀頭・四五が両面で、三萬と六萬で面子ができます。七九索の嵌張は八索。二萬を引いて刻子にすると雀頭が無くなるので、受けになりません。",
    },
    {
        "hand": "12m345p678s1155z9s",
        "theme": "辺張とシャンポンのイーシャンテン",
        "note": "一二萬の辺張は三萬だけ。東と白の対子は、どちらかを引いて刻子にすれば、もう一方が雀頭になってテンパイします。九索を重ねても進みません。",
    },
    {
        "hand": "23m67s345p678p999s",
        "theme": "雀頭の無いイーシャンテン",
        "note": "二三萬と六七索の両面で一萬・四萬・五索・八索。雀頭が無いので、二萬・三萬・六索・七索を重ねて雀頭を作ってもテンパイします。8種28枚と受けが広い形です。",
    },
    {
        "hand": "24m3467p567s1188s",
        "theme": "リャンシャンテンの受け",
        "note": "二四萬の嵌張で三萬。三四六七筒は二筒・五筒・八筒で面子ができます。一索と八索の対子は、刻子になる牌も受けです。残りは対子の分だけ少なくなります。",
    },
]


def parse(hand):
    counts = [0] * 34
    digits = []
    for ch in hand:
        if ch.isdigit():
            digits.append(int(ch))
        else:
            base = SUITS.index(ch) * 9
            for d in digits:
                counts[base + d - 1] += 1
            digits = []
    if digits:
        raise ValueError(f"{hand}: 種類の文字がありません")
    return counts


def tile_id(i):
    s = SUITS[i // 9]
    return f"{i % 9 + 1}{s}"


def tile_name(i):
    if i >= 27:
        return HONOR_NAME[i - 27]
    return NAMES_NUM[i % 9] + SUIT_NAME[SUITS[i // 9]]


@lru_cache(maxsize=None)
def suit_blocks(counts, honors):
    """1つの種類の牌から、(面子の数, 塔子の数, 雀頭の有無) の組み合わせを全部返す。"""
    results = set()
    cs = list(counts)

    def rec(i, m, t, p):
        while i < len(cs) and cs[i] == 0:
            i += 1
        if i >= len(cs):
            results.add((m, t, p))
            return
        if cs[i] >= 3:
            cs[i] -= 3
            rec(i, m + 1, t, p)
            cs[i] += 3
        if not honors and i + 2 < len(cs) and cs[i + 1] and cs[i + 2]:
            cs[i] -= 1; cs[i + 1] -= 1; cs[i + 2] -= 1
            rec(i, m + 1, t, p)
            cs[i] += 1; cs[i + 1] += 1; cs[i + 2] += 1
        if cs[i] >= 2:
            cs[i] -= 2
            if not p:
                rec(i, m, t, 1)
            rec(i, m, t + 1, p)
            cs[i] += 2
        if not honors:
            if i + 1 < len(cs) and cs[i + 1]:
                cs[i] -= 1; cs[i + 1] -= 1
                rec(i, m, t + 1, p)
                cs[i] += 1; cs[i + 1] += 1
            if i + 2 < len(cs) and cs[i + 2]:
                cs[i] -= 1; cs[i + 2] -= 1
                rec(i, m, t + 1, p)
                cs[i] += 1; cs[i + 2] += 1
        cs[i] -= 1
        rec(i + 1, m, t, p)
        cs[i] += 1

    rec(0, 0, 0, 0)
    return frozenset(results)


def shanten_standard(counts):
    parts = [
        suit_blocks(tuple(counts[0:9]), False),
        suit_blocks(tuple(counts[9:18]), False),
        suit_blocks(tuple(counts[18:27]), False),
        suit_blocks(tuple(counts[27:34]), True),
    ]
    best = 8
    combos = {(0, 0, 0)}
    for part in parts:
        combos = {(a + m, b + t, min(1, c + p)) for (a, b, c) in combos for (m, t, p) in part if c + p <= 1}
    for m, t, p in combos:
        t2 = min(t, 4 - m)
        best = min(best, 8 - 2 * m - t2 - p)
    return best


def shanten_pairs(counts):
    pairs = sum(1 for c in counts if c >= 2)
    kinds = sum(1 for c in counts if c >= 1)
    return 6 - pairs + max(0, 7 - kinds)


def shanten_orphans(counts):
    yao = [0, 8, 9, 17, 18, 26] + list(range(27, 34))
    kinds = sum(1 for i in yao if counts[i])
    pair = any(counts[i] >= 2 for i in yao)
    return 13 - kinds - (1 if pair else 0)


def shanten(counts):
    return min(shanten_standard(counts), shanten_pairs(counts), shanten_orphans(counts))


def acceptance(counts):
    base = shanten(counts)
    tiles = []
    for i in range(34):
        if counts[i] >= 4:
            continue
        c = list(counts)
        c[i] += 1
        if shanten(c) < base:
            tiles.append(i)
    return base, tiles


def app_hands():
    if not APP_PROBLEMS.exists():
        return None
    data = json.loads(APP_PROBLEMS.read_text(encoding="utf-8"))
    return [(p["id"], parse(p["hand"])) for p in data["problems"]]


def overlaps(counts, hands):
    hits = []
    for pid, h14 in hands:
        if all(counts[i] <= h14[i] for i in range(34)):
            hits.append(pid)
    return hits


def main():
    check_only = "--check" in sys.argv
    hands = app_hands()
    if hands is None:
        sys.stderr.write(f"ukeire.py: {APP_PROBLEMS} が無いので、アプリの問題との重なりは確かめていません\n")
    out = []
    seen = set()
    for n, p in enumerate(PROBLEMS, start=1):
        counts = parse(p["hand"])
        if sum(counts) != 13:
            sys.exit(f"ukeire.py: 第{n}問は {sum(counts)} 枚です（13枚にする）")
        if max(counts) > 4:
            sys.exit(f"ukeire.py: 第{n}問に5枚以上の牌があります")
        key = tuple(counts)
        if key in seen:
            sys.exit(f"ukeire.py: 第{n}問が前の問題と同じ手です")
        seen.add(key)
        base, tiles = acceptance(counts)
        left = sum(4 - counts[i] for i in tiles)
        hits = overlaps(counts, hands) if hands else []
        print(f"第{n}問 {p['hand']} 向聴{base} 受け入れ{len(tiles)}種{left}枚: "
              f"{' '.join(tile_name(i) for i in tiles)}"
              + (f"  ⚠ アプリの問題と重なる: {', '.join(hits)}" if hits else ""))
        if hits:
            sys.exit("ukeire.py: アプリの問題と同じ13枚を含む手があります")
        hand_ids = [tile_id(i) for i in range(34) for _ in range(counts[i])]
        out.append({
            "no": n,
            "theme": p["theme"],
            "hand": hand_ids,
            "shanten": base,
            "answer": [tile_id(i) for i in tiles],
            "left": left,
            "note": p["note"],
        })
    if check_only:
        return
    OUT.parent.mkdir(parents=True, exist_ok=True)
    rows = ",\n".join(json.dumps(o, ensure_ascii=False) for o in out)
    OUT.write_text(f"window.UKEIRE_PROBLEMS = [\n{rows}\n];\n", encoding="utf-8")
    print(f"→ {OUT.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
