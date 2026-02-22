import { useState, useEffect, useCallback, useRef } from 'react';

export function useInterviewTimer(initialSeconds: number) {
  const [timeLeft, setTimeLeft] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const start = useCallback(() => setIsRunning(true), []);
  const pause = useCallback(() => setIsRunning(false), []);
  const reset = useCallback((seconds?: number) => {
    setTimeLeft(seconds ?? initialSeconds);
    setIsRunning(false);
  }, [initialSeconds]);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isRunning, timeLeft]);

  const elapsed = initialSeconds - timeLeft;
  const progress = initialSeconds > 0 ? ((initialSeconds - timeLeft) / initialSeconds) * 100 : 0;

  return { timeLeft, isRunning, start, pause, reset, elapsed, progress };
}
