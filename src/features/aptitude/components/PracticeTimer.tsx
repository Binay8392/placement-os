import { cn } from '@/lib/utils';
import { Timer } from 'lucide-react';

interface PracticeTimerProps {
  seconds: number; // remaining seconds
  totalSeconds: number;
  className?: string;
}

function formatTime(s: number): string {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
}

export function PracticeTimer({ seconds, totalSeconds, className }: PracticeTimerProps) {
  const pct = totalSeconds > 0 ? (seconds / totalSeconds) * 100 : 100;
  const isWarning = pct <= 25;
  const isCritical = pct <= 10;

  return (
    <div
      className={cn(
        'flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-mono font-semibold transition-colors',
        isCritical
          ? 'animate-pulse bg-destructive/15 text-destructive'
          : isWarning
          ? 'bg-warning/15 text-warning'
          : 'bg-muted text-foreground',
        className
      )}
    >
      <Timer className="h-4 w-4" />
      {formatTime(seconds)}
    </div>
  );
}
