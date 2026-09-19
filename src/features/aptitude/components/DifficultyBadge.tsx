import { cn } from '@/lib/utils';
import type { Difficulty } from '../types';

interface DifficultyBadgeProps {
  difficulty: Difficulty;
  className?: string;
}

const CONFIG: Record<Difficulty, { label: string; classes: string }> = {
  easy: { label: 'Easy', classes: 'bg-success/15 text-success border-success/30' },
  medium: { label: 'Medium', classes: 'bg-warning/15 text-warning border-warning/30' },
  hard: { label: 'Hard', classes: 'bg-destructive/15 text-destructive border-destructive/30' },
};

export function DifficultyBadge({ difficulty, className }: DifficultyBadgeProps) {
  const config = CONFIG[difficulty];
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-semibold',
        config.classes,
        className
      )}
    >
      {config.label}
    </span>
  );
}
