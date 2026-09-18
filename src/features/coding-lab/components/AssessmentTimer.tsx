import React, { useEffect, useState, useRef } from "react";
import { Clock, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AssessmentTimerProps {
  attemptId: string;
  durationMinutes: number;
  onTimeExpired: () => void;
  onTick?: (remainingSeconds: number) => void;
  isCompleted?: boolean;
}

export const AssessmentTimer: React.FC<AssessmentTimerProps> = ({
  attemptId,
  durationMinutes,
  onTimeExpired,
  onTick,
  isCompleted = false,
}) => {
  const { toast } = useToast();
  const storageKey = `preptrack_timer_${attemptId}`;

  // Initialize or restore end time from localStorage
  const [remainingSeconds, setRemainingSeconds] = useState<number>(() => {
    const saved = localStorage.getItem(storageKey);
    const now = Date.now();
    if (saved) {
      const endTime = parseInt(saved, 10);
      const remaining = Math.max(0, Math.floor((endTime - now) / 1000));
      return remaining;
    } else {
      const durationSecs = durationMinutes * 60;
      const endTime = now + durationSecs * 1000;
      localStorage.setItem(storageKey, endTime.toString());
      return durationSecs;
    }
  });

  const warned10MinRef = useRef(false);
  const warned5MinRef = useRef(false);
  const expiredRef = useRef(false);

  useEffect(() => {
    if (isCompleted) return;

    const interval = setInterval(() => {
      const saved = localStorage.getItem(storageKey);
      const now = Date.now();
      let remaining = 0;

      if (saved) {
        const endTime = parseInt(saved, 10);
        remaining = Math.max(0, Math.floor((endTime - now) / 1000));
      }

      setRemainingSeconds(remaining);
      onTick?.(remaining);

      // Warning at 10 minutes
      if (remaining <= 600 && remaining > 300 && !warned10MinRef.current) {
        warned10MinRef.current = true;
        toast({
          title: "⏳ 10 Minutes Remaining",
          description: "Keep track of time! Review your open questions.",
          variant: "default",
        });
      }

      // Warning at 5 minutes
      if (remaining <= 300 && remaining > 0 && !warned5MinRef.current) {
        warned5MinRef.current = true;
        toast({
          title: "⚠️ 5 Minutes Remaining!",
          description: "Assessment will automatically submit when time expires.",
          variant: "destructive",
        });
      }

      // Time expired
      if (remaining <= 0 && !expiredRef.current) {
        expiredRef.current = true;
        clearInterval(interval);
        toast({
          title: "Time Expired!",
          description: "Submitting your assessment now...",
          variant: "destructive",
        });
        onTimeExpired();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [attemptId, isCompleted, onTimeExpired, onTick, storageKey, toast]);

  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  const timeFormatted = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  const isCritical = remainingSeconds <= 300; // < 5 min
  const isWarning = remainingSeconds <= 600 && !isCritical; // < 10 min

  return (
    <div
      className={`flex items-center gap-2 px-3 py-1 rounded-md font-mono text-sm border transition-colors ${
        isCritical
          ? "bg-rose-500/10 text-rose-500 border-rose-500/40 animate-pulse font-bold"
          : isWarning
          ? "bg-amber-500/10 text-amber-500 border-amber-500/40 font-semibold"
          : "bg-muted/50 text-foreground border-border/50"
      }`}
    >
      {isCritical ? (
        <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0" />
      ) : (
        <Clock className="w-4 h-4 text-muted-foreground shrink-0" />
      )}
      <span>{timeFormatted}</span>
      {isCritical && (
        <span className="hidden md:inline text-[10px] uppercase font-sans tracking-wide">
          Auto-submitting soon
        </span>
      )}
    </div>
  );
};
