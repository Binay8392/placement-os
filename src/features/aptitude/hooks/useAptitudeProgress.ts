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
      setAllProgress((prev) => ({ ...prev, [topicId]: updatedProgress }));
      await upsertTopicProgress(uid, topicId, updatedProgress);
    },
    [uid, allProgress]
  );

  const saveAttempt = useCallback(
    async (attempt: AptitudeAttempt) => {
      if (!uid) return;
      await saveAptitudeAttempt(uid, attempt);
    },
    [uid]
  );

  const addBookmark = useCallback(
    async (question: QuestionSnapshot) => {
      if (!uid) return;
      await fbAddBookmark(uid, question);
      setBookmarks((prev) => {
        const exists = prev.find((b) => b.id === question.id);
        if (exists) return prev;
        return [{ ...question, bookmarkedAt: new Date().toISOString() }, ...prev];
      });
    },
    [uid]
  );

  const removeBookmark = useCallback(
    async (questionId: string) => {
      if (!uid) return;
      await fbRemoveBookmark(uid, questionId);
      setBookmarks((prev) => prev.filter((b) => b.id !== questionId));
    },
    [uid]
  );

  const isBookmarked = useCallback(
    (questionId: string) => bookmarks.some((b) => b.id === questionId),
    [bookmarks]
  );

  const addWrongAnswer = useCallback(
    async (question: QuestionSnapshot, selected: string | null) => {
      if (!uid) return;
      await fbSaveWrongAnswer(uid, question, selected);
      setWrongAnswers((prev) => {
        const exists = prev.find((w) => w.id === question.id);
        if (exists) return prev.map((w) => w.id === question.id ? { ...w, selected } : w);
        return [{ ...question, selected, recordedAt: new Date().toISOString() }, ...prev];
      });
    },
    [uid]
  );

  const removeWrongAnswer = useCallback(
    async (questionId: string) => {
      if (!uid) return;
      await fbRemoveWrongAnswer(uid, questionId);
      setWrongAnswers((prev) => prev.filter((w) => w.id !== questionId));
    },
    [uid]
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
    removeWrongAnswer,
  };
}
