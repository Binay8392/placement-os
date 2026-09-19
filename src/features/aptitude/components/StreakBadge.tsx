import { cn } from '@/lib/utils';
import { Flame } from 'lucide-react';

interface StreakBadgeProps {
  streak: number;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function StreakBadge({ streak, className, size = 'md' }: StreakBadgeProps) {
  if (streak === 0) return null;
  return (
    <div
      className={cn(
        'inline-flex items-center gap-1 rounded-full font-bold',
        streak >= 7 ? 'text-orange-500' : 'text-warning',
        size === 'sm' && 'px-2 py-0.5 text-xs',
        size === 'md' && 'px-3 py-1 text-sm',
        size === 'lg' && 'px-4 py-1.5 text-base',
        streak >= 7 ? 'bg-orange-500/10' : 'bg-warning/10',
        className
      )}
    >
      <Flame className={cn(
        'shrink-0',
        size === 'sm' && 'h-3 w-3',
        size === 'md' && 'h-4 w-4',
        size === 'lg' && 'h-5 w-5',
        streak >= 7 && 'text-orange-500',
      )} />
      {streak} day{streak !== 1 ? 's' : ''}
    </div>
  );
}
