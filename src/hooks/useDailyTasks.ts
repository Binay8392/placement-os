import { useState, useEffect, useCallback, useMemo } from 'react';

export type TaskPriority = 'low' | 'medium' | 'high';

export interface DailyTask {
  id: string;
  title: string;
  description?: string;
  time?: string;
  priority: TaskPriority;
  completed: boolean;
  completedAt?: number;
  order: number;
}

interface DailyData {
  tasks: DailyTask[];
  streak: number;
  lastCompletedDate: string | null;
}

const STORAGE_KEY = 'preptrack-daily-planner';
const STREAK_KEY = 'preptrack-daily-streak';

function getTodayKey(): string {
  return new Date().toISOString().split('T')[0];
}

function loadData(dateKey: string): DailyTask[] {
  try {
    const raw = localStorage.getItem(`${STORAGE_KEY}-${dateKey}`);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function saveData(dateKey: string, tasks: DailyTask[]) {
  localStorage.setItem(`${STORAGE_KEY}-${dateKey}`, JSON.stringify(tasks));
}

function loadStreak(): { streak: number; lastCompletedDate: string | null } {
  try {
    const raw = localStorage.getItem(STREAK_KEY);
    return raw ? JSON.parse(raw) : { streak: 0, lastCompletedDate: null };
  } catch { return { streak: 0, lastCompletedDate: null }; }
}

function saveStreak(streak: number, lastCompletedDate: string | null) {
  localStorage.setItem(STREAK_KEY, JSON.stringify({ streak, lastCompletedDate }));
}

export function useDailyTasks() {
  const todayKey = getTodayKey();
  const [tasks, setTasks] = useState<DailyTask[]>(() => loadData(todayKey));
  const [streakData, setStreakData] = useState(loadStreak);

  // Persist tasks
  useEffect(() => {
    saveData(todayKey, tasks);
  }, [tasks, todayKey]);

  // Compute streak on mount — check if yesterday was completed
  useEffect(() => {
    const { streak, lastCompletedDate } = streakData;
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayKey = yesterday.toISOString().split('T')[0];

    if (lastCompletedDate && lastCompletedDate !== todayKey && lastCompletedDate !== yesterdayKey && streak > 0) {
      // Streak broken
      setStreakData({ streak: 0, lastCompletedDate: null });
      saveStreak(0, null);
    }
  }, []);

  const completedCount = useMemo(() => tasks.filter(t => t.completed).length, [tasks]);
  const totalCount = tasks.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Focus score: based on completion % + speed bonus
  const focusScore = useMemo(() => {
    if (totalCount === 0) return 0;
    const completionScore = (completedCount / totalCount) * 80;
    const completedTasks = tasks.filter(t => t.completed && t.completedAt);
    const speedBonus = completedTasks.length > 0 ? Math.min(20, completedTasks.length * 4) : 0;
    return Math.round(Math.min(100, completionScore + speedBonus));
  }, [tasks, completedCount, totalCount]);

  // Check if all tasks completed and update streak
  useEffect(() => {
    if (totalCount > 0 && completedCount === totalCount) {
      const { lastCompletedDate, streak } = streakData;
      if (lastCompletedDate !== todayKey) {
        const newStreak = streak + 1;
        setStreakData({ streak: newStreak, lastCompletedDate: todayKey });
        saveStreak(newStreak, todayKey);
      }
    }
  }, [completedCount, totalCount]);

  const addTask = useCallback((task: Omit<DailyTask, 'id' | 'completed' | 'order'>) => {
    setTasks(prev => [...prev, {
      ...task,
      id: crypto.randomUUID(),
      completed: false,
      order: prev.length,
    }]);
  }, []);

  const toggleTask = useCallback((id: string) => {
    setTasks(prev => prev.map(t =>
      t.id === id ? { ...t, completed: !t.completed, completedAt: !t.completed ? Date.now() : undefined } : t
    ));
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  }, []);

  const editTask = useCallback((id: string, updates: Partial<DailyTask>) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  }, []);

  const clearCompleted = useCallback(() => {
    setTasks(prev => prev.filter(t => !t.completed));
  }, []);

  const reorderTasks = useCallback((newTasks: DailyTask[]) => {
    setTasks(newTasks);
  }, []);

  return {
    tasks,
    addTask,
    toggleTask,
    deleteTask,
    editTask,
    clearCompleted,
    reorderTasks,
    completedCount,
    totalCount,
    progressPercent,
    focusScore,
    streak: streakData.streak,
    allCompleted: totalCount > 0 && completedCount === totalCount,
  };
}
