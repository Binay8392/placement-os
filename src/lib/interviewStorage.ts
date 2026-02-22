import { InterviewResult } from './interviewTypes';

const STORAGE_KEY = 'preptrack_interview_results';
const STREAK_KEY = 'preptrack_interview_streak';
const XP_KEY = 'preptrack_interview_xp';

export function getInterviewResults(): InterviewResult[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch { return []; }
}

export function saveInterviewResult(result: InterviewResult): void {
  const results = getInterviewResults();
  results.unshift(result);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(results));
  updateStreak();
  addXP(result.scores.overall);
}

function updateStreak(): void {
  const data = JSON.parse(localStorage.getItem(STREAK_KEY) || '{"count":0,"lastDate":""}');
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

  if (data.lastDate === today) return;
  if (data.lastDate === yesterday) {
    data.count += 1;
  } else {
    data.count = 1;
  }
  data.lastDate = today;
  localStorage.setItem(STREAK_KEY, JSON.stringify(data));
}

export function getStreak(): number {
  try {
    const data = JSON.parse(localStorage.getItem(STREAK_KEY) || '{"count":0}');
    return data.count;
  } catch { return 0; }
}

function addXP(score: number): void {
  const xp = getXP();
  localStorage.setItem(XP_KEY, String(xp + Math.round(score * 1.5)));
}

export function getXP(): number {
  return parseInt(localStorage.getItem(XP_KEY) || '0', 10);
}

export function getBadges(results: InterviewResult[]): { name: string; icon: string; earned: boolean }[] {
  return [
    { name: 'First Interview', icon: '🎯', earned: results.length >= 1 },
    { name: '5 Interviews', icon: '🔥', earned: results.length >= 5 },
    { name: '10 Interviews', icon: '💎', earned: results.length >= 10 },
    { name: 'Score 90+', icon: '🏆', earned: results.some(r => r.scores.overall >= 90) },
    { name: 'All Types', icon: '🌟', earned: new Set(results.map(r => r.config.type)).size >= 4 },
    { name: 'Hard Mode', icon: '⚔️', earned: results.some(r => r.config.difficulty === 'hard') },
  ];
}
