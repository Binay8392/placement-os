import { cn } from '@/lib/utils';
import { CheckCircle2, Lightbulb, Zap, BookOpen } from 'lucide-react';
import type { AptitudeQuestion } from '../types';

interface ExplanationPanelProps {
  question: AptitudeQuestion;
  selected: string | null;
  className?: string;
}

export function ExplanationPanel({ question, selected, className }: ExplanationPanelProps) {
  const isCorrect = selected === question.correctAnswer;
  const correctOption = question.options.find((o) => o.id === question.correctAnswer);

  return (
    <div className={cn('space-y-3 rounded-xl border p-4', isCorrect ? 'border-success/30 bg-success/5' : 'border-destructive/30 bg-destructive/5', className)}>
      {/* Result indicator */}
      <div className={cn('flex items-center gap-2 font-semibold', isCorrect ? 'text-success' : 'text-destructive')}>
        <CheckCircle2 className="h-5 w-5" />
        {isCorrect ? 'Correct!' : 'Incorrect'}
      </div>

      {/* Correct answer */}
      {!isCorrect && correctOption && (
        <div className="rounded-lg bg-success/10 px-3 py-2 text-sm">
          <span className="text-xs font-semibold text-success uppercase tracking-wide">Correct Answer</span>
          <p className="mt-0.5 text-foreground">{correctOption.text}</p>
        </div>
      )}

      {/* Explanation */}
      <div className="space-y-1">
        <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          <BookOpen className="h-3.5 w-3.5" />
          Explanation
        </div>
        <p className="text-sm leading-relaxed text-foreground">{question.explanation}</p>
      </div>

      {/* Shortcut */}
      {question.shortcut && (
        <div className="rounded-lg border border-warning/30 bg-warning/5 px-3 py-2 space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-warning">
            <Zap className="h-3.5 w-3.5" />
            Shortcut / Trick
          </div>
          <p className="text-sm text-foreground">{question.shortcut}</p>
        </div>
      )}

      {/* Concept */}
      {question.concept && (
        <div className="rounded-lg border border-primary/20 bg-primary/5 px-3 py-2 space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-primary">
            <Lightbulb className="h-3.5 w-3.5" />
            Concept
          </div>
          <p className="text-sm text-foreground">{question.concept}</p>
        </div>
      )}
    </div>
  );
}
