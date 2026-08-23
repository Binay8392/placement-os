import { useState, useEffect, useCallback, useRef } from 'react';
import type { AptitudeQuestion, AptitudeAnswer, AptitudeAttempt, ActiveSessionConfig } from '../types';

export interface SessionState {
  config: ActiveSessionConfig;
  questions: AptitudeQuestion[];
  answers: Record<string, { selected: string | null; marked: boolean; timeSpent: number }>;
  currentIndex: number;
  timeRemainingSeconds: number | null;
  isSubmitted: boolean;
  startedAt: number;
}

export function useAptitudeSession() {
  const [session, setSession] = useState<SessionState | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const questionStartRef = useRef<number>(Date.now());

  // Start a session
  const startSession = useCallback((config: ActiveSessionConfig, questions: AptitudeQuestion[]) => {
    const timeRemaining = config.timeLimitMinutes ? config.timeLimitMinutes * 60 : null;
    setSession({
      config,
      questions,
      answers: {},
      currentIndex: 0,
      timeRemainingSeconds: timeRemaining,
      isSubmitted: false,
      startedAt: Date.now(),
    });
    questionStartRef.current = Date.now();
  }, []);

  // Timer countdown
  useEffect(() => {
    if (!session || session.isSubmitted || session.timeRemainingSeconds === null) return;
    timerRef.current = setInterval(() => {
      setSession((prev) => {
        if (!prev || prev.timeRemainingSeconds === null) return prev;
        if (prev.timeRemainingSeconds <= 1) {
          // Auto-submit
          clearInterval(timerRef.current!);
          return { ...prev, timeRemainingSeconds: 0, isSubmitted: true };
        }
        return { ...prev, timeRemainingSeconds: prev.timeRemainingSeconds - 1 };
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [session?.config.timeLimitMinutes, session?.isSubmitted]);

  const selectAnswer = useCallback((questionId: string, optionId: string) => {
    setSession((prev) => {
      if (!prev) return prev;
      const existing = prev.answers[questionId];
      const timeSpent = (Date.now() - questionStartRef.current) / 1000;
      return {
        ...prev,
        answers: {
          ...prev.answers,
          [questionId]: { selected: optionId, marked: existing?.marked ?? false, timeSpent },
        },
      };
    });
  }, []);

  const clearAnswer = useCallback((questionId: string) => {
    setSession((prev) => {
      if (!prev) return prev;
      const existing = prev.answers[questionId];
      return {
        ...prev,
        answers: {
          ...prev.answers,
          [questionId]: { selected: null, marked: existing?.marked ?? false, timeSpent: existing?.timeSpent ?? 0 },
        },
      };
    });
  }, []);

  const toggleMark = useCallback((questionId: string) => {
    setSession((prev) => {
      if (!prev) return prev;
      const existing = prev.answers[questionId];
      return {
        ...prev,
        answers: {
          ...prev.answers,
          [questionId]: { selected: existing?.selected ?? null, marked: !existing?.marked, timeSpent: existing?.timeSpent ?? 0 },
        },
      };
    });
  }, []);

  const goTo = useCallback((index: number) => {
    setSession((prev) => {
      if (!prev) return prev;
      questionStartRef.current = Date.now();
      return { ...prev, currentIndex: index };
    });
  }, []);

  const goNext = useCallback(() => {
    setSession((prev) => {
      if (!prev) return prev;
      const next = Math.min(prev.currentIndex + 1, prev.questions.length - 1);
      questionStartRef.current = Date.now();
      return { ...prev, currentIndex: next };
    });
  }, []);

  const goPrev = useCallback(() => {
    setSession((prev) => {
      if (!prev) return prev;
      const next = Math.max(prev.currentIndex - 1, 0);
      questionStartRef.current = Date.now();
      return { ...prev, currentIndex: next };
    });
  }, []);

  const submitSession = useCallback((): AptitudeAttempt | null => {
    if (!session) return null;
    const timeTaken = Math.round((Date.now() - session.startedAt) / 1000);
    const answers: AptitudeAnswer[] = session.questions.map((q) => {
      const ans = session.answers[q.id];
      const selected = ans?.selected ?? null;
      const isCorrect = selected === q.correctAnswer;
      return {
        questionId: q.id,
        section: q.section,
        topic: q.topic,
        difficulty: q.difficulty,
        selected,
        correctAnswer: q.correctAnswer,
        isCorrect,
        skipped: selected === null,
        marked: ans?.marked ?? false,
        timeSpent: ans?.timeSpent ?? 0,
      };
    });
    const correct = answers.filter((a) => a.isCorrect).length;
    const incorrect = answers.filter((a) => !a.isCorrect && !a.skipped).length;
    const skipped = answers.filter((a) => a.skipped).length;
    const accuracy = session.questions.length > 0 ? Math.round((correct / session.questions.length) * 100) : 0;
    const attempt: AptitudeAttempt = {
      attemptId: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      mode: session.config.mode,
      label: session.config.label,
      section: session.config.section,
      topic: session.config.topic,
      totalQuestions: session.questions.length,
      correct,
      incorrect,
      skipped,
      accuracy,
      score: Math.round((correct / session.questions.length) * 100),
      timeTaken,
      averageTime: timeTaken / session.questions.length,
      answers,
      questions: session.questions.map((q) => ({
        id: q.id,
        section: q.section,
        topic: q.topic,
        question: q.question,
        passage: q.passage,
        options: q.options,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
        difficulty: q.difficulty,
      })),
      completedAt: new Date().toISOString(),
    };
    setSession((prev) => prev ? { ...prev, isSubmitted: true } : prev);
    if (timerRef.current) clearInterval(timerRef.current);
    return attempt;
  }, [session]);

  const clearSession = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setSession(null);
  }, []);

  return {
    session,
    startSession,
    selectAnswer,
    clearAnswer,
    toggleMark,
    goTo,
    goNext,
    goPrev,
    submitSession,
    clearSession,
  };
}
