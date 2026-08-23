import { cn } from '@/lib/utils';

interface AccuracyRingProps {
  accuracy: number; // 0-100
  size?: number;
  strokeWidth?: number;
  className?: string;
  showLabel?: boolean;
}

export function AccuracyRing({
  accuracy,
  size = 64,
  strokeWidth = 6,
  className,
  showLabel = true,
}: AccuracyRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (accuracy / 100) * circumference;

  const color =
    accuracy >= 80 ? 'text-success' : accuracy >= 60 ? 'text-warning' : accuracy > 0 ? 'text-destructive' : 'text-muted-foreground';

  return (
    <div className={cn('relative inline-flex items-center justify-center', className)} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          className="stroke-muted"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className={cn('transition-all duration-500', color === 'text-success' ? 'stroke-success' : color === 'text-warning' ? 'stroke-warning' : color === 'text-destructive' ? 'stroke-destructive' : 'stroke-muted-foreground')}
        />
      </svg>
      {showLabel && (
        <span className={cn('absolute text-xs font-bold', color)}>{accuracy}%</span>
      )}
    </div>
  );
}
