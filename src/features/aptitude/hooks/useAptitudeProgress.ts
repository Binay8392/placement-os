import { useState, useEffect, useCallback } from 'react';
import type { TopicProgress, QuestionSnapshot, AptitudeAttempt } from '../types';
import {
  getAllTopicProgress,
  upsertTopicProgress,
  saveAptitudeAttempt,
  getBookmarks,
  addBookmark as fbAddBookmark,
  removeBookmark as fbRemoveBookmark,
  getWrongAnswers,
  saveWrongAnswer as fbSaveWrongAnswer,
  saveWrongAnswersBatch as fbSaveWrongAnswersBatch,
  removeWrongAnswer as fbRemoveWrongAnswer,
  getRecentAttempts,
} from '../utils/aptitudeFirebase';

export function useAptitudeProgress(uid: string | undefined) {
  const [allProgress, setAllProgress] = useState<Record<string, TopicProgress>>({});
  const [bookmarks, setBookmarks] = useState<(QuestionSnapshot & { bookmarkedAt: string })[]>([]);
  const [wrongAnswers, setWrongAnswers] = useState<(QuestionSnapshot & { selected: string | null; recordedAt: string })[]>([]);
  const [recentAttempts, setRecentAttempts] = useState<AptitudeAttempt[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    if (!uid) return;
    setLoading(true);
    try {
      const [progress, bmarks, wrongs, attempts] = await Promise.all([
        getAllTopicProgress(uid),
        getBookmarks(uid),
        getWrongAnswers(uid),
        getRecentAttempts(uid, 20),
      ]);
      setAllProgress(progress);
      setBookmarks(bmarks);
      setWrongAnswers(wrongs);
      setRecentAttempts(attempts);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load progress');
    } finally {
      setLoading(false);
    }
  }, [uid]);

  useEffect(() => { void fetchAll(); }, [fetchAll]);

  const updateTopicAfterAttempt = useCallback(
    async (topicId: string, attempted: number, correct: number, totalTime: number) => {
      if (!uid) return;
      const existing = allProgress[topicId];
      const updatedProgress: TopicProgress = {
        attempted: (existing?.attempted ?? 0) + attempted,
        correct: (existing?.correct ?? 0) + correct,
        totalTime: (existing?.totalTime ?? 0) + totalTime,
        lastPracticed: new Date().toISOString().split('T')[0],
        recent: [...(existing?.recent ?? []).slice(-9), correct === attempted],
      };
      // Optimistic state update
      setAllProgress((prev) => ({ ...prev, [topicId]: updatedProgress }));
      try {
        await upsertTopicProgress(uid, topicId, updatedProgress);
      } catch (e) {
        console.error('Failed to update topic progress in Firestore:', e);
      }
    },
    [uid, allProgress]
  );

  const saveAttempt = useCallback(
    async (attempt: AptitudeAttempt) => {
      if (!uid) return;
      try {
        await saveAptitudeAttempt(uid, attempt);
        setRecentAttempts((prev) => [attempt, ...prev.slice(0, 19)]);
      } catch (e) {
        console.error('Failed to save attempt in Firestore:', e);
      }
    },
    [uid]
  );

  const addBookmark = useCallback(
    async (question: QuestionSnapshot) => {
      if (!uid) return;
      const newBookmark = { ...question, bookmarkedAt: new Date().toISOString() };
      // Optimistic update
      setBookmarks((prev) => {
        if (prev.some((b) => b.id === question.id)) return prev;
        return [newBookmark, ...prev];
      });
      try {
        await fbAddBookmark(uid, question);
      } catch (e) {
        console.error('Failed to add bookmark in Firestore:', e);
        // Revert on error
        setBookmarks((prev) => prev.filter((b) => b.id !== question.id));
      }
    },
    [uid]
  );

  const removeBookmark = useCallback(
    async (questionId: string) => {
      if (!uid) return;
      const previous = bookmarks;
      // Optimistic update
      setBookmarks((prev) => prev.filter((b) => b.id !== questionId));
      try {
        await fbRemoveBookmark(uid, questionId);
      } catch (e) {
        console.error('Failed to remove bookmark in Firestore:', e);
        setBookmarks(previous);
      }
    },
    [uid, bookmarks]
  );

  const isBookmarked = useCallback(
    (questionId: string) => bookmarks.some((b) => b.id === questionId),
    [bookmarks]
  );

  const addWrongAnswer = useCallback(
    async (question: QuestionSnapshot, selected: string | null) => {
      if (!uid) return;
      const newWrong = { ...question, selected, recordedAt: new Date().toISOString() };
      setWrongAnswers((prev) => {
        const exists = prev.find((w) => w.id === question.id);
        if (exists) return prev.map((w) => w.id === question.id ? { ...w, selected } : w);
        return [newWrong, ...prev];
      });
      try {
        await fbSaveWrongAnswer(uid, question, selected);
      } catch (e) {
        console.error('Failed to save wrong answer in Firestore:', e);
      }
    },
    [uid]
  );

  const addWrongAnswersBatch = useCallback(
    async (items: { question: QuestionSnapshot; selected: string | null }[]) => {
      if (!uid || items.length === 0) return;
      // Optimistic update
      const now = new Date().toISOString();
      setWrongAnswers((prev) => {
        const next = [...prev];
        for (const item of items) {
          const idx = next.findIndex((w) => w.id === item.question.id);
          if (idx >= 0) {
            next[idx] = { ...next[idx], selected: item.selected };
          } else {
            next.unshift({ ...item.question, selected: item.selected, recordedAt: now });
          }
        }
        return next;
      });
      try {
        await fbSaveWrongAnswersBatch(uid, items);
      } catch (e) {
        console.error('Failed to batch save wrong answers in Firestore:', e);
      }
    },
    [uid]
  );

  const removeWrongAnswer = useCallback(
    async (questionId: string) => {
      if (!uid) return;
      const previous = wrongAnswers;
      setWrongAnswers((prev) => prev.filter((w) => w.id !== questionId));
      try {
        await fbRemoveWrongAnswer(uid, questionId);
      } catch (e) {
        console.error('Failed to remove wrong answer in Firestore:', e);
        setWrongAnswers(previous);
      }
    },
    [uid, wrongAnswers]
  );

  return {
    allProgress,
    bookmarks,
    wrongAnswers,
    recentAttempts,
    loading,
    error,
    refetch: fetchAll,
    updateTopicAfterAttempt,
    saveAttempt,
    addBookmark,
    removeBookmark,
    isBookmarked,
    addWrongAnswer,
    addWrongAnswersBatch,
    removeWrongAnswer,
  };
}
