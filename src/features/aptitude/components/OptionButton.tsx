import { cn } from '@/lib/utils';
import { CheckCircle2, XCircle } from 'lucide-react';
import type { AnswerOption } from '../types';

interface OptionButtonProps {
  option: AnswerOption;
  selected: boolean;
  correct?: boolean; // set after answer revealed
  incorrect?: boolean; // set after answer revealed
  disabled?: boolean;
  onSelect: (id: string) => void;
  index: number;
}

const LABELS = ['A', 'B', 'C', 'D', 'E'];

export function OptionButton({
  option,
  selected,
  correct,
  incorrect,
  disabled,
  onSelect,
  index,
}: OptionButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => onSelect(option.id)}
      aria-label={`Option ${LABELS[index]}: ${option.text}`}
      aria-pressed={selected}
      className={cn(
        'w-full flex items-center gap-3 rounded-xl border p-3 text-left text-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
        // Default
        !selected && !correct && !incorrect && 'border-border bg-card hover:border-primary/50 hover:bg-primary/5',
        // Selected (no reveal yet)
        selected && !correct && !incorrect && 'border-primary bg-primary/10 text-primary',
        // Correct
        correct && 'border-success bg-success/10 text-success',
        // Incorrect (user selected this, but it's wrong)
        incorrect && 'border-destructive bg-destructive/10 text-destructive',
        // Disabled without state change
        disabled && !correct && !incorrect && 'cursor-not-allowed opacity-60',
      )}
    >
      <span
        className={cn(
          'flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold',
          !selected && !correct && !incorrect && 'bg-muted',
          selected && !correct && !incorrect && 'bg-primary text-primary-foreground',
          correct && 'bg-success text-success-foreground',
          incorrect && 'bg-destructive text-destructive-foreground',
        )}
      >
        {LABELS[index]}
      </span>
      <span className="flex-1">{option.text}</span>
      {correct && <CheckCircle2 className="h-4 w-4 shrink-0 text-success" />}
      {incorrect && <XCircle className="h-4 w-4 shrink-0 text-destructive" />}
    </button>
  );
}
