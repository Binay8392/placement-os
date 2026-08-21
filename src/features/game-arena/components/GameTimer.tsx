import { Clock3 } from 'lucide-react';
import { cn } from '@/lib/utils';

export function formatSeconds(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

export function GameTimer({
  remaining,
  total,
  label = 'Time Remaining',
}: {
  remaining: number;
  total: number;
  label?: string;
}) {
  const ratio = total > 0 ? remaining / total : 0;
  const tone = ratio <= 0.05 ? 'critical' : ratio <= 0.1 ? 'danger' : ratio <= 0.25 ? 'warning' : 'normal';

  return (
    <div
      className={cn(
        'flex min-h-11 items-center gap-2 rounded-lg border px-3 py-2 font-mono text-sm font-semibold',
        tone === 'normal' && 'border-border bg-card text-foreground',
        tone === 'warning' && 'border-warning/40 bg-warning/10 text-warning',
        tone === 'danger' && 'border-destructive/45 bg-destructive/10 text-destructive',
        tone === 'critical' && 'border-destructive bg-destructive/15 text-destructive',
      )}
      aria-live={tone === 'normal' ? 'off' : 'polite'}
    >
      <Clock3 className="h-4 w-4" />
      <span className="sr-only">{label}</span>
      {formatSeconds(remaining)}
    </div>
  );
}
