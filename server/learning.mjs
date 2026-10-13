export const EXAM_DATE = Date.parse('2026-10-18T14:00:00+09:00');
export const defaultSettings = { theme: 'light', dailyGoal: 10, generalMode: false };
export function updateProgress(previous, { conceptId, correct, rating, now = Date.now(), generalMode = false }) {
  const p = previous || { conceptId, correct: 0, incorrect: 0, streak: 0, rating: null, mastery: 0 };
  const isAnswer = typeof correct === 'boolean';
  const success = isAnswer ? correct : rating >= 2;
  const streak = success ? p.streak + 1 : 0;
  const totalCorrect = p.correct + (isAnswer && correct ? 1 : 0);
  const totalIncorrect = p.incorrect + (isAnswer && !correct ? 1 : 0);
  // Self-assessment schedules practice; only checked answers establish mastery.
  const mastery = isAnswer ? Math.max(0, Math.min(100, p.mastery + (correct ? 20 : -30))) : p.mastery;
  const grade = isAnswer ? (correct ? 2 : 0) : rating;
  const intervals = [10 * 60_000, 60 * 60_000, Math.min(7, 2 ** Math.max(0, streak - 1)) * 86400_000, Math.min(14, 3 * 2 ** Math.max(0, streak - 1)) * 86400_000];
  let interval = intervals[grade];
  const remaining = EXAM_DATE - now;
  if (!generalMode && remaining > 0 && remaining <= 5 * 86400_000) interval = Math.min(interval, Math.max(10 * 60_000, Math.min(12 * 3600_000, remaining / 3)));
  return { conceptId, correct: totalCorrect, incorrect: totalIncorrect, streak, rating: isAnswer ? p.rating : rating, mastery, lastStudied: new Date(now).toISOString(), nextReview: new Date(now + interval).toISOString() };
}
export function selectExamQuestions(questions, mode, random = Math.random) {
  const count = mode === 'A' ? 20 : 16;
  const pool = questions.filter(q => mode === 'A' ? q.type === 'recall' : q.type === 'application');
  const shuffle = array => array.map(item => ({ item, order: random() })).sort((a,b) => a.order - b.order).map(x => x.item);
  // Round-robin across domains, with no repeated concept per exam.
  const groups = new Map();
  for (const q of shuffle(pool)) { if (!groups.has(q.category)) groups.set(q.category, []); groups.get(q.category).push(q); }
  const selected = [], seen = new Set();
  while (selected.length < count) {
    let added = false;
    for (const category of shuffle([...groups.keys()])) {
      const group = groups.get(category);
      let q;
      while (group.length && !q) { const next = group.pop(); if (!seen.has(next.conceptId)) q = next; }
      if (q && selected.length < count) { selected.push(q); seen.add(q.conceptId); added = true; }
    }
    if (!added) break;
  }
  if (selected.length !== count) throw new Error(`시험 ${mode}에 필요한 문항이 부족합니다.`);
  return shuffle(selected);
}
