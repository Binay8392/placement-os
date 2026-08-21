import { useEffect, useRef, useState } from 'react';

export function useCountdown({
  seconds,
  resetKey,
  active,
  onExpire,
}: {
  seconds: number;
  resetKey: string;
  active: boolean;
  onExpire: () => void;
}) {
  const [remaining, setRemaining] = useState(seconds);
  const deadlineRef = useRef(Date.now() + seconds * 1000);
  const expiredKeyRef = useRef<string | null>(null);
  const onExpireRef = useRef(onExpire);

  useEffect(() => {
    onExpireRef.current = onExpire;
  }, [onExpire]);

  useEffect(() => {
    deadlineRef.current = Date.now() + seconds * 1000;
    expiredKeyRef.current = null;
    setRemaining(seconds);
  }, [resetKey, seconds]);

  useEffect(() => {
    if (!active) return undefined;

    const tick = () => {
      const next = Math.max(0, Math.ceil((deadlineRef.current - Date.now()) / 1000));
      setRemaining(next);
      if (next <= 0 && expiredKeyRef.current !== resetKey) {
        expiredKeyRef.current = resetKey;
        onExpireRef.current();
      }
    };

    tick();
    const intervalId = window.setInterval(tick, 250);
    return () => window.clearInterval(intervalId);
  }, [active, resetKey]);

  return remaining;
}
