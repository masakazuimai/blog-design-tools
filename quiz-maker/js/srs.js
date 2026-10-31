import { addDays } from './util.js?v=20261003b';
import { t } from './i18n.js?v=20261003b';

export const MAX_LEVEL = 5;
export const INTERVALS = [1, 3, 7, 14, 30, 90];

export function isDue(question, todayYmd) {
  return !question.next || question.next <= todayYmd;
}

export function isMastered(question) {
  return question.level >= MAX_LEVEL;
}

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

export function describeDays(days) {
  return [1, 7, 14, 30, 90].includes(days) ? t(`days${days}`) : t('daysN', { n: days });
}
