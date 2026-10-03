// 間隔反復（段階式＝ライトナー方式）
// 現在の習熟度で正解したら INTERVALS[習熟度] 日後に出題し、習熟度を1上げる。間違えたら Lv0・翌日
import { addDays } from './util.js?v=20261003a';

export const MAX_LEVEL = 5;
export const INTERVALS = [1, 3, 7, 14, 30, 90];

export function isDue(question, todayYmd) {
  return !question.next || question.next <= todayYmd;
}

export function isMastered(question) {
  return question.level >= MAX_LEVEL;
}

// 回答を反映した新しい問題オブジェクトと、表示用の変化情報を返す
// 出題日が来ていない問題（全問モード）を正解しても、習熟度は先取りで上げない
export function applyAnswer(question, isCorrect, todayYmd) {
  const from = question.level;
  if (!isCorrect) {
    const next = addDays(todayYmd, 1);
    return {
      question: { ...question, level: 0, next, ng: question.ng + 1 },
      info: { from, to: 0, days: 1, advanced: false },
    };
  }
  if (!isDue(question, todayYmd)) {
    return {
      question: { ...question, ok: question.ok + 1 },
      info: { from, to: from, days: null, advanced: false },
    };
  }
  const days = INTERVALS[Math.min(from, MAX_LEVEL)];
  const to = Math.min(from + 1, MAX_LEVEL);
  return {
    question: { ...question, level: to, next: addDays(todayYmd, days), ok: question.ok + 1 },
    info: { from, to, days, advanced: true },
  };
}

export function deckStats(questions, todayYmd) {
  const levels = Array.from({ length: MAX_LEVEL + 1 }, (_, lv) => questions.filter(q => q.level === lv).length);
  const dueList = questions.filter(q => isDue(q, todayYmd));
  const upcoming = questions.map(q => q.next).filter(n => n && n > todayYmd).sort();
  return {
    total: questions.length,
    due: dueList.length,
    mastered: levels[MAX_LEVEL],
    levels,
    nextDate: upcoming[0] || '',
  };
}

// 「◯日後」を読みやすい言葉にする
export function describeDays(days) {
  if (days === 1) return '明日';
  if (days === 7) return '1週間後';
  if (days === 14) return '2週間後';
  if (days === 30) return '1か月後';
  if (days === 90) return '3か月後';
  return `${days}日後`;
}
