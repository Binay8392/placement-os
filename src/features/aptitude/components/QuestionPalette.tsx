import { cn } from '@/lib/utils';

interface QuestionPaletteProps {
  total: number;
  currentIndex: number;
  answered: Set<number>;
  marked: Set<number>;
  onSelect: (index: number) => void;
}

export function QuestionPalette({
  total,
  currentIndex,
  answered,
  marked,
  onSelect,
}: QuestionPaletteProps) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {Array.from({ length: total }, (_, i) => (
        <button
          key={i}
          type="button"
          onClick={() => onSelect(i)}
          aria-label={`Question ${i + 1}`}
          aria-current={i === currentIndex ? 'step' : undefined}
          className={cn(
            'h-8 w-8 rounded-md text-xs font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
            i === currentIndex && 'ring-2 ring-primary ring-offset-1',
            marked.has(i) && 'border-2 border-warning bg-warning/10 text-warning',
            answered.has(i) && !marked.has(i) && 'bg-success/20 text-success',
            !answered.has(i) && !marked.has(i) && 'bg-muted text-muted-foreground hover:bg-muted/80',
          )}
        >
          {i + 1}
        </button>
      ))}
    </div>
  );
}
