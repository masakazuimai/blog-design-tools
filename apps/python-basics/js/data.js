// 問題データ（Q1-6は記事版 id6349 と同期・Q7-20はアプリ限定ドリル）
const PROBLEMS = [
  {"id":1,"title":"変数と出力","questionHtml":"変数 <code>message</code> に “Hello, Python!” を代入し、<code>print()</code> で表示してください。","answer":"message = \"Hello, Python!\"\nprint(message)"},
  {"id":2,"title":"四則演算","questionHtml":"変数 <code>a</code> に 10、<code>b</code> に 3 を代入し、足し算・引き算・掛け算・割り算の結果をすべて表示してください。","answer":"a = 10\nb = 3\nprint(a + b, a - b, a * b, a / b)"},
  {"id":3,"title":"条件分岐（if / else）","questionHtml":"変数 <code>score</code> が 80 以上なら “合格”、それ未満なら “不合格” と表示してください。","starter":"score = 85\n","answer":"if score >= 80:\n    print(\"合格\")\nelse:\n    print(\"不合格\")"},
  {"id":4,"title":"繰り返し（for と range）","questionHtml":"1 から 5 までの数値を、1行ずつ順に表示してください。<code>range()</code> の終わりの数は含まれない点に注意しましょう。","answer":"for i in range(1, 6):\n    print(i)"},
  {"id":5,"title":"リストの操作","questionHtml":"空のリスト <code>fruits</code> を作り、“apple” “banana” “grape” を <code>append()</code> で追加してから、リスト全体を表示してください。","answer":"fruits = []\nfruits.append(\"apple\")\nfruits.append(\"banana\")\nfruits.append(\"grape\")\nprint(fruits)"},
  {"id":6,"title":"関数を作る","questionHtml":"受け取った数値を2倍にして返す関数 <code>double</code> を <code>def</code> で作り、5 を渡した結果を表示してください。","answer":"def double(x):\n    return x * 2\n\nprint(double(5))"},

  {"id":7,"title":"データ型を調べる","questionHtml":"<code>num</code>・<code>text</code>・<code>flag</code> のそれぞれの型を <code>type()</code> で表示してください。JavaScriptの <code>typeof</code> に当たるものです。","starter":"num = 5\ntext = \"Python\"\nflag = True\n","answer":"print(type(num))\nprint(type(text))\nprint(type(flag))"},
  {"id":8,"title":"文字列の操作","questionHtml":"文字列 <code>email</code> の文字数、すべて大文字にしたもの、「@」を含むかどうか（True / False）の3つを表示してください。要素数は <code>.length</code> ではなく <code>len()</code> です。","starter":"email = \"taro@example.com\"\n","answer":"print(len(email))\nprint(email.upper())\nprint(\"@\" in email)"},
  {"id":9,"title":"f文字列で埋め込む","questionHtml":"変数 <code>user</code> と <code>items</code> を使って「田中さんのカートには3個の商品があります」という文章を f文字列で組み立てて表示してください。JavaScriptのテンプレートリテラルに当たるものです。","starter":"user = \"田中\"\nitems = 3\n","answer":"print(f\"{user}さんのカートには{items}個の商品があります\")"},
  {"id":10,"title":"elif で3分岐","questionHtml":"<code>score</code> が 90 以上なら “優”、80 以上なら “良”、それ未満なら “可” と表示してください。「そうでなければもし」は <code>else if</code> ではなく <code>elif</code> です。","starter":"score = 85\n","answer":"if score >= 90:\n    print(\"優\")\nelif score >= 80:\n    print(\"良\")\nelse:\n    print(\"可\")"},
  {"id":11,"title":"while文","questionHtml":"<code>while</code> を使って 1 から 5 までの数値を順に表示してください。カウンタを1つずつ増やす処理を忘れると無限ループになります。","answer":"i = 1\nwhile i <= 5:\n    print(i)\n    i += 1"},
  {"id":12,"title":"リストをループする","questionHtml":"リスト <code>numbers</code> の中身を順に表示してください。Pythonではインデックスを使わず、要素を直接取り出せます。","starter":"numbers = [1, 2, 3, 4, 5]\n","answer":"for n in numbers:\n    print(n)"},
  {"id":13,"title":"辞書の基本","questionHtml":"辞書 <code>person</code> から名前と年齢を取り出して表示してください。JavaScriptのオブジェクトと違い、ドット記法ではなく角かっことキー名で書きます。","starter":"person = {\"name\": \"太郎\", \"age\": 28}\n","answer":"print(person[\"name\"])\nprint(person[\"age\"])"},
  {"id":14,"title":"辞書をループする","questionHtml":"辞書 <code>person</code> のキーと値をすべて表示してください。<code>items()</code> を使うと、キーと値を同時に受け取れます。","starter":"person = {\"name\": \"太郎\", \"age\": 28, \"city\": \"東京\"}\n","answer":"for key, value in person.items():\n    print(key, value)"},
  {"id":15,"title":"リスト内包表記","questionHtml":"リスト <code>numbers</code> から偶数だけを取り出した新しいリストを作り、表示してください。JavaScriptの <code>filter()</code> に当たる書き方です。","starter":"numbers = [1, 2, 3, 4, 5, 6]\n","answer":"evens = [n for n in numbers if n % 2 == 0]\nprint(evens)"},
  {"id":16,"title":"合計と最大値","questionHtml":"リスト <code>numbers</code> の合計値と最大値を表示してください。どちらも組み込み関数が用意されています。","starter":"numbers = [10, 20, 30, 5, 25]\n","answer":"print(sum(numbers))\nprint(max(numbers))"},
  {"id":17,"title":"重複を取り除く","questionHtml":"リスト <code>numbers</code> から重複を取り除いた値を表示してください。<code>set()</code> を使うと重複が消えます。並び順を保ちたい場合は <code>sorted()</code> と組み合わせます。","starter":"numbers = [1, 2, 2, 3, 4, 4, 5]\n","answer":"unique = sorted(set(numbers))\nprint(unique)"},
  {"id":18,"title":"並び替え","questionHtml":"リスト <code>numbers</code> を昇順に並び替えて表示してください。元のリストを変えずに新しいリストを作る書き方を使いましょう。","starter":"numbers = [5, 2, 8, 1, 3]\n","answer":"print(sorted(numbers))\nprint(numbers)"},
  {"id":19,"title":"例外処理（try / except）","questionHtml":"<code>10 / 0</code> を実行し、エラーが起きたときは “0では割れません” と表示してください。JavaScriptの <code>try...catch</code> に当たります。","answer":"try:\n    print(10 / 0)\nexcept ZeroDivisionError:\n    print(\"0では割れません\")"},
  {"id":20,"title":"総合：送料つき合計金額","questionHtml":"合計金額を受け取り、5000円以上なら送料無料、それ未満なら送料500円として「合計：〇〇円（送料：〇〇円）」と表示する関数 <code>checkout</code> を作ってください。4000 と 6000 の両方で呼び出して確認しましょう。","answer":"def checkout(total):\n    shipping = 0 if total >= 5000 else 500\n    print(f\"合計：{total + shipping}円（送料：{shipping}円）\")\n\ncheckout(4000)\ncheckout(6000)"}
];

const LEVELS = [
  { key: 'all', label: 'すべて (20問)', range: [1, 20] },
  { key: 'basic', label: '基礎 1-6', range: [1, 6] },
  { key: 'mid', label: '文字列・分岐 7-11', range: [7, 11] },
  { key: 'data', label: 'リスト・辞書 12-16', range: [12, 16] },
  { key: 'adv', label: '応用 17-20', range: [17, 20] },
];
