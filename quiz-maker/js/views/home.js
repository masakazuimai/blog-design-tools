// ① 初回（未読み込み）と ② ホーム
import { h, today, shortDate } from '../util.js?v=20261003a';
import { setState } from '../store.js?v=20261003a';
import { deckStats, MAX_LEVEL } from '../srs.js?v=20261003a';
import { newDeck, openDeck, loadSample, downloadTemplate, startQuiz, deckTitle } from '../actions.js?v=20261003a';

const CSV_EXAMPLE = [
  '問題,正解,誤答1,誤答2,誤答3,解説,習熟度,次回出題日,正解回数,不正解回数',
  '光の三原色に含まれない色は？,黄,赤,緑,青,光の三原色は赤・緑・青（RGB）,,,,',
  '補色の関係にある組み合わせは？,赤と青緑,赤と橙,青と紫,黄と黄緑,色相環で向かい合う色,,,,',
].join('\n');

export function renderStart() {
  return h('div', { class: 'card empty' },
    h('h2', { text: '問題集を作って、覚えるまで解こう' }),
    h('p', { text: 'まずは新しく作るか、手元のCSV／JSONファイルを開いてください（ファイルをここへドラッグしてもOK）。' }),
    h('div', { class: 'btns' },
      h('button', { class: 'btn btn--primary btn--big', type: 'button', onclick: newDeck, text: '＋ 新しい問題集を作る' }),
      h('button', { class: 'btn btn--big', type: 'button', onclick: openDeck, text: 'ファイルを開く' }),
      h('button', { class: 'btn btn--big', type: 'button', onclick: loadSample, text: 'サンプルで試す' }),
    ),
    h('details', { class: 'csv-sample' },
      h('summary', { text: 'Excelで作る場合のCSVの書き方' }),
      h('pre', { text: CSV_EXAMPLE }),
      h('p', {},
        '1行目は見出しです。「習熟度」より右の列は空欄でOK（読み込むと全問すぐ出題されます）。Excelでは「CSV UTF-8」で保存してください。 ',
        h('button', { class: 'linklike', type: 'button', onclick: downloadTemplate, text: 'ひな形CSVをダウンロード' }),
      ),
    ),
  );
}

function levelRows(levels) {
  const max = Math.max(1, ...levels);
  return levels.map((count, lv) =>
    h('div', { class: `levels__row${lv === MAX_LEVEL ? ' levels__row--max' : ''}` },
      h('span', { text: lv === MAX_LEVEL ? `Lv${lv} ✅` : `Lv${lv}` }),
      h('div', { class: 'levels__bar' }, h('i', { style: `width:${(count / max) * 100}%` })),
      h('span', { text: String(count) }),
    ));
}

function stat(label, num, mod = '') {
  return h('div', { class: `stat ${mod}` },
    h('div', { class: 'stat__label', text: label }),
    h('div', { class: 'stat__num', text: String(num) }),
  );
}

export function renderHome(state) {
  const s = deckStats(state.questions, today());
  const goEdit = () => setState({ view: 'edit', editId: state.questions[0]?.id || 'new' });
  const goAdd = () => setState({ view: 'edit', editId: 'new', addedCount: 0 });

  if (!s.total) {
    return h('div', { class: 'card empty' },
      h('h2', { text: deckTitle() }),
      h('p', { text: 'まだ問題がありません。最初の問題を追加しましょう。' }),
      h('div', { class: 'btns' },
        h('button', { class: 'btn btn--primary btn--big', type: 'button', onclick: goAdd, text: '＋ 問題を追加する' }),
      ),
    );
  }

  const countSelect = h('select', { 'aria-label': '出題数' },
    [10, 20, 50, 0].map(n => h('option', { value: String(n), selected: n === 20, text: n ? `${n}問` : '全部' })));
  const dueLabel = s.due
    ? `▶ 今日の復習を始める（${s.due}問）`
    : `今日の復習はありません${s.nextDate ? `（次は ${shortDate(s.nextDate)}）` : ''}`;

  return h('div', { class: 'card' },
    h('h2', { text: deckTitle() }),
    h('div', { class: 'stats' },
      stat('全問題', s.total),
      stat('今日の復習', s.due, 'stat--due'),
      stat('✅ 覚えた', s.mastered, 'stat--done'),
    ),
    h('div', { class: 'levels' }, levelRows(s.levels)),
    h('div', { class: 'home-actions' },
      h('div', {},
        h('button', {
          class: 'btn btn--primary btn--big', type: 'button', disabled: !s.due,
          onclick: () => startQuiz('due'), text: dueLabel,
        }),
      ),
      h('div', { class: 'home-actions__row' },
        h('button', {
          class: 'btn', type: 'button', text: '全問から出題',
          onclick: () => startQuiz('all', { count: Number(countSelect.value) }),
        }),
        h('label', { class: 'muted' }, '出題数 ', countSelect),
      ),
      h('div', { class: 'btns' },
        h('button', { class: 'btn', type: 'button', onclick: goAdd, text: '＋ 問題を追加' }),
        h('button', { class: 'btn', type: 'button', onclick: goEdit, text: '✏ 問題を編集' }),
      ),
    ),
  );
}
