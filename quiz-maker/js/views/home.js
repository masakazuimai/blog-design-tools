// ① 初回（未読み込み）と ② ホーム
import { h, today, shortDate } from '../util.js?v=20261003b';
import { setState } from '../store.js?v=20261003b';
import { deckStats, MAX_LEVEL } from '../srs.js?v=20261003b';
import { newDeck, openDeck, loadSample, downloadTemplate, startQuiz, deckTitle } from '../actions.js?v=20261003b';
import { t, LANG } from '../i18n.js?v=20261003b';

const CSV_EXAMPLE = (LANG === 'en' ? [
  'Question,Answer,Wrong 1,Wrong 2,Wrong 3,Explanation,Level,Next due,Correct count,Wrong count',
  'Which color is NOT an additive primary color of light?,Yellow,Red,Green,Blue,The additive primaries are red / green / blue (RGB),,,,',
  'Which pair are complementary colors?,Red and cyan,Red and orange,Blue and purple,Yellow and yellow-green,Colors opposite each other on the color wheel,,,,',
] : [
  '問題,正解,誤答1,誤答2,誤答3,解説,習熟度,次回出題日,正解回数,不正解回数',
  '光の三原色に含まれない色は？,黄,赤,緑,青,光の三原色は赤・緑・青（RGB）,,,,',
  '補色の関係にある組み合わせは？,赤と青緑,赤と橙,青と紫,黄と黄緑,色相環で向かい合う色,,,,',
]).join('\n');

export function renderStart() {
  return h('div', { class: 'card empty' },
    h('h2', { text: t('startTitle') }),
    h('p', { text: t('startLead') }),
    h('div', { class: 'btns' },
      h('button', { class: 'btn btn--primary btn--big', type: 'button', onclick: newDeck, text: t('startNew') }),
      h('button', { class: 'btn btn--big', type: 'button', onclick: openDeck, text: t('openFile') }),
      h('button', { class: 'btn btn--big', type: 'button', onclick: loadSample, text: t('startSample') }),
    ),
    h('details', { class: 'csv-sample' },
      h('summary', { text: t('csvHowTitle') }),
      h('pre', { text: CSV_EXAMPLE }),
      h('p', {},
        t('csvHowNote'),
        h('button', { class: 'linklike', type: 'button', onclick: downloadTemplate, text: t('csvTemplate') }),
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
      h('p', { text: t('noQuestionsYet') }),
      h('div', { class: 'btns' },
        h('button', { class: 'btn btn--primary btn--big', type: 'button', onclick: goAdd, text: t('addFirst') }),
      ),
    );
  }

  const countSelect = h('select', { 'aria-label': t('countLabel').trim() },
    [10, 20, 50, 0].map(n => h('option', { value: String(n), selected: n === 20, text: n ? t('countOption', { n }) : t('countAll') })));
  const dueLabel = s.due
    ? t('startDue', { n: s.due })
    : t('noDue') + (s.nextDate ? t('nextOn', { date: shortDate(s.nextDate) }) : '');

  return h('div', { class: 'card' },
    h('h2', { text: deckTitle() }),
    h('div', { class: 'stats' },
      stat(t('statTotal'), s.total),
      stat(t('statDue'), s.due, 'stat--due'),
      stat(t('statMastered'), s.mastered, 'stat--done'),
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
          class: 'btn', type: 'button', text: t('quizAll'),
          onclick: () => startQuiz('all', { count: Number(countSelect.value) }),
        }),
        h('label', { class: 'muted' }, t('countLabel'), countSelect),
      ),
      h('div', { class: 'btns' },
        h('button', { class: 'btn', type: 'button', onclick: goAdd, text: t('addQuestion') }),
        h('button', { class: 'btn', type: 'button', onclick: goEdit, text: t('editQuestions') }),
      ),
    ),
  );
}
