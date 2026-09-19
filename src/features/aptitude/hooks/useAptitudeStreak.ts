import { useState, useEffect, useCallback } from 'react';
import { getAptitudeMeta, recordPracticeDate, calculateStreak } from '../utils/aptitudeFirebase';

export function useAptitudeStreak(uid: string | undefined) {
  const [streak, setStreak] = useState(0);
  const [practiceDates, setPracticeDates] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchMeta = useCallback(async () => {
    if (!uid) return;
    setLoading(true);
    try {
      const meta = await getAptitudeMeta(uid);
      if (meta) {
        setPracticeDates(meta.practiceDates);
        setStreak(calculateStreak(meta.practiceDates));
      }
    } finally {
      setLoading(false);
    }
  }, [uid]);

  useEffect(() => { void fetchMeta(); }, [fetchMeta]);

  const recordToday = useCallback(async () => {
    if (!uid) return;
    const today = new Date().toISOString().split('T')[0];
    await recordPracticeDate(uid, today);
    setPracticeDates((prev) => {
      if (prev.includes(today)) return prev;
      const updated = [...prev, today];
      setStreak(calculateStreak(updated));
      return updated;
    });
  }, [uid]);

  return { streak, practiceDates, loading, recordToday, refetch: fetchMeta };
}
