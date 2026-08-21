import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, RotateCcw, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { AnswerOption, GameQuestion, VisualToken } from '../types';
import { VisualTokenView } from './VisualToken';

type SubmittedAnswer = string | string[] | null;

function MultipleChoice({
  question,
  locked,
  onSubmit,
}: {
  question: GameQuestion;
  locked: boolean;
  onSubmit: (answer: SubmittedAnswer) => void;
}) {
  const metadata = question.metadata as {
    rules?: Array<{ from: VisualToken; to: VisualToken }>;
    sequence?: VisualToken[];
    matrix?: Array<VisualToken | null>;
  };

  return (
    <div className="space-y-5">
      {metadata.rules && (
        <div className="grid gap-2 rounded-xl border border-border bg-muted/30 p-3 sm:grid-cols-2">
          {metadata.rules.map((rule) => (
            <div key={`${rule.from.label}-${rule.to.label}`} className="flex items-center justify-center gap-3 rounded-lg bg-background/70 p-2">
              <VisualTokenView token={rule.from} />
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
              <VisualTokenView token={rule.to} />
            </div>
          ))}
        </div>
      )}

      {metadata.sequence && (
        <div className="flex flex-wrap items-center justify-center gap-2 rounded-xl border border-border bg-muted/30 p-3">
          {metadata.sequence.map((token, index) => (
            <div key={`${token.label}-${index}`} className="flex items-center gap-2">
              <VisualTokenView token={token} className="bg-background/80" />
              {index < metadata.sequence.length - 1 && <ArrowRight className="h-4 w-4 text-muted-foreground" />}
            </div>
          ))}
          <span className="flex h-10 min-w-10 items-center justify-center rounded-lg border border-dashed border-border bg-background/70 text-lg font-semibold text-muted-foreground">
            ?
          </span>
        </div>
      )}

      {metadata.matrix && metadata.matrix.length > 0 && (
        <div className="mx-auto grid max-w-[260px] grid-cols-3 gap-2 rounded-xl border border-border bg-muted/30 p-3">
          {metadata.matrix.map((token, index) => (
            <div key={index} className="flex aspect-square items-center justify-center rounded-lg bg-background/80">
              {token ? (
                <VisualTokenView token={token} />
              ) : (
                <span className="text-2xl font-semibold text-muted-foreground">?</span>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        {(question.options || []).map((option: AnswerOption) => (
          <Button
            key={option.id}
            type="button"
            variant="outline"
            disabled={locked}
            onClick={() => onSubmit(option.value)}
            className="min-h-14 justify-center gap-3 rounded-xl border-border/80 bg-card px-4 text-base hover:bg-primary/10 hover:text-foreground"
            aria-label={option.description || `Choose ${option.label}`}
          >
            {option.token && <VisualTokenView token={option.token} />}
            <span className="font-medium">{option.label}</span>
          </Button>
        ))}
      </div>
    </div>
  );
}

function GridMemory({
  question,
  locked,
  onSubmit,
}: {
  question: GameQuestion;
  locked: boolean;
  onSubmit: (answer: SubmittedAnswer) => void;
}) {
  const metadata = question.metadata as {
    gridSize: number;
    highlightedCells: string[];
    exposureMs: number;
  };
  const [recallMode, setRecallMode] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const highlighted = useMemo(() => new Set(metadata.highlightedCells), [metadata.highlightedCells]);

  useEffect(() => {
    setRecallMode(false);
    setSelected([]);
    const timeout = window.setTimeout(() => setRecallMode(true), metadata.exposureMs);
    return () => window.clearTimeout(timeout);
  }, [metadata.exposureMs, question.id]);

  const toggleCell = (cell: string) => {
    if (!recallMode || locked) return;
    setSelected((current) =>
      current.includes(cell) ? current.filter((value) => value !== cell) : [...current, cell],
    );
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border bg-muted/25 p-3 text-center text-sm text-muted-foreground">
        {recallMode ? 'Select every cell you remember.' : 'Memorize the pattern before it hides.'}
      </div>
      <div
        className="mx-auto grid w-full max-w-[min(88vw,440px)] gap-1.5"
        style={{ gridTemplateColumns: `repeat(${metadata.gridSize}, minmax(0, 1fr))` }}
      >
        {Array.from({ length: metadata.gridSize * metadata.gridSize }, (_, index) => {
          const id = index.toString();
          const isHighlighted = !recallMode && highlighted.has(id);
          const isSelected = selected.includes(id);
          return (
            <button
              key={id}
              type="button"
              disabled={!recallMode || locked}
              onClick={() => toggleCell(id)}
              className={cn(
                'aspect-square min-h-11 rounded-lg border text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                isHighlighted && 'border-primary bg-primary text-primary-foreground shadow-glow',
                recallMode && !isSelected && 'border-border bg-card hover:bg-muted',
                isSelected && 'border-primary bg-primary/15 text-primary',
              )}
              aria-pressed={isSelected}
              aria-label={`Grid cell ${index + 1}`}
            />
          );
        })}
      </div>
      <Button
        type="button"
        disabled={!recallMode || locked}
        onClick={() => onSubmit(selected.sort((a, b) => Number(a) - Number(b)))}
        className="min-h-12 w-full"
      >
        Confirm Pattern
      </Button>
    </div>
  );
}

function GeoSudo({
  question,
  locked,
  onSubmit,
}: {
  question: GameQuestion;
  locked: boolean;
  onSubmit: (answer: SubmittedAnswer) => void;
}) {
  const metadata = question.metadata as {
    gridSize: number;
    symbols: VisualToken[];
    puzzle: Array<string | null>;
  };
  const [board, setBoard] = useState<Array<string | null>>(metadata.puzzle);
  const [selectedCell, setSelectedCell] = useState<number | null>(null);

  useEffect(() => {
    setBoard(metadata.puzzle);
    setSelectedCell(null);
  }, [metadata.puzzle, question.id]);

  const fillCell = (symbol: string) => {
    if (selectedCell === null || metadata.puzzle[selectedCell] !== null || locked) return;
    setBoard((current) => current.map((value, index) => (index === selectedCell ? symbol : value)));
  };

  const symbolFor = (label: string | null) => metadata.symbols.find((symbol) => symbol.label === label);
  const complete = board.every(Boolean);

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border bg-muted/25 p-3 text-sm text-muted-foreground">
        Each row and column must contain every symbol exactly once.
      </div>
      <div
        className="mx-auto grid w-full max-w-[min(90vw,460px)] gap-1.5"
        style={{ gridTemplateColumns: `repeat(${metadata.gridSize}, minmax(0, 1fr))` }}
      >
        {board.map((cell, index) => {
          const given = metadata.puzzle[index] !== null;
          const token = symbolFor(cell);
          const selected = selectedCell === index;
          return (
            <button
              key={index}
              type="button"
              disabled={given || locked}
              onClick={() => setSelectedCell(index)}
              className={cn(
                'flex aspect-square min-h-11 items-center justify-center rounded-lg border bg-card transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                given && 'border-border bg-muted/60',
                !given && 'hover:bg-primary/10',
                selected && 'border-primary ring-2 ring-primary/30',
              )}
              aria-label={given ? `Given ${cell}` : `Blank cell ${index + 1}`}
            >
              {token ? <VisualTokenView token={token} /> : <span className="text-muted-foreground">.</span>}
            </button>
          );
        })}
      </div>
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
        {metadata.symbols.map((symbol) => (
          <Button
            key={symbol.label}
            type="button"
            variant="outline"
            disabled={locked || selectedCell === null}
            onClick={() => fillCell(symbol.label || '')}
            className="min-h-12 rounded-xl"
            aria-label={`Place ${symbol.label}`}
          >
            <VisualTokenView token={symbol} />
          </Button>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-2">
        <Button
          type="button"
          variant="outline"
          disabled={locked || selectedCell === null || metadata.puzzle[selectedCell] !== null}
          onClick={() => {
            if (selectedCell === null) return;
            setBoard((current) => current.map((value, index) => (index === selectedCell ? null : value)));
          }}
          className="min-h-12"
        >
          <X className="h-4 w-4" />
          Clear
        </Button>
        <Button
          type="button"
          disabled={locked || !complete}
          onClick={() => onSubmit(board.map((cell) => cell || ''))}
          className="min-h-12"
        >
          Confirm Grid
        </Button>
      </div>
    </div>
  );
}

function MotionPath({
  question,
  locked,
  onSubmit,
}: {
  question: GameQuestion;
  locked: boolean;
  onSubmit: (answer: SubmittedAnswer) => void;
}) {
  const metadata = question.metadata as {
    gridSize: number;
    start: number;
    target: number;
    obstacles: number[];
    optimalPath: string[];
    maxMoves: number;
  };
  const [position, setPosition] = useState(metadata.start);
  const [path, setPath] = useState<string[]>([]);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const submittedRef = useRef(false);
  const obstacles = useMemo(() => new Set(metadata.obstacles), [metadata.obstacles]);

  useEffect(() => {
    setPosition(metadata.start);
    setPath([]);
    submittedRef.current = false;
  }, [metadata.start, question.id]);

  const submitPath = (nextPath: string[]) => {
    if (submittedRef.current) return;
    submittedRef.current = true;
    onSubmit(nextPath);
  };

  const move = (direction: string) => {
    if (locked || submittedRef.current) return;
    const row = Math.floor(position / metadata.gridSize);
    const col = position % metadata.gridSize;
    let next = position;
    if (direction === 'up' && row > 0) next -= metadata.gridSize;
    if (direction === 'down' && row < metadata.gridSize - 1) next += metadata.gridSize;
    if (direction === 'left' && col > 0) next -= 1;
    if (direction === 'right' && col < metadata.gridSize - 1) next += 1;
    if (next === position || obstacles.has(next)) return;

    const nextPath = [...path, direction];
    setPosition(next);
    setPath(nextPath);
    if (next === metadata.target || nextPath.length >= metadata.maxMoves) {
      window.setTimeout(() => submitPath(nextPath), 120);
    }
  };

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const map: Record<string, string> = {
        ArrowUp: 'up',
        ArrowDown: 'down',
        ArrowLeft: 'left',
        ArrowRight: 'right',
      };
      if (map[event.key]) {
        event.preventDefault();
        move(map[event.key]);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  });

  const handleTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
    if (!touchStart.current) return;
    const touch = event.changedTouches[0];
    const dx = touch.clientX - touchStart.current.x;
    const dy = touch.clientY - touchStart.current.y;
    touchStart.current = null;
    if (Math.max(Math.abs(dx), Math.abs(dy)) < 28) return;
    move(Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : dy > 0 ? 'down' : 'up');
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-2 text-center text-xs text-muted-foreground">
        <Badge variant="outline" className="justify-center rounded-lg py-2">Moves {path.length}/{metadata.maxMoves}</Badge>
        <Badge variant="outline" className="justify-center rounded-lg py-2">Optimal {metadata.optimalPath.length}</Badge>
        <Badge variant="outline" className="justify-center rounded-lg py-2">Target</Badge>
      </div>
      <div
        className="mx-auto grid w-full max-w-[min(88vw,470px)] gap-1.5 rounded-xl border border-border bg-muted/25 p-2 touch-none"
        style={{ gridTemplateColumns: `repeat(${metadata.gridSize}, minmax(0, 1fr))` }}
        onTouchStart={(event) => {
          const touch = event.touches[0];
          touchStart.current = { x: touch.clientX, y: touch.clientY };
        }}
        onTouchEnd={handleTouchEnd}
      >
        {Array.from({ length: metadata.gridSize * metadata.gridSize }, (_, index) => {
          const isStart = index === metadata.start;
          const isTarget = index === metadata.target;
          const isObstacle = obstacles.has(index);
          const isCurrent = index === position;
          return (
            <div
              key={index}
              className={cn(
                'flex aspect-square min-h-10 items-center justify-center rounded-lg border text-xs font-semibold',
                isObstacle && 'border-border bg-muted text-muted-foreground',
                !isObstacle && 'border-border/70 bg-card',
                isStart && 'text-primary',
                isTarget && 'border-success/50 bg-success/10 text-success',
                isCurrent && 'border-primary bg-primary text-primary-foreground shadow-glow',
              )}
            >
              {isObstacle ? 'X' : isCurrent ? 'M' : isTarget ? 'T' : isStart ? 'S' : ''}
            </div>
          );
        })}
      </div>
      <div className="mx-auto grid max-w-[260px] grid-cols-3 gap-2">
        <span />
        <Button type="button" variant="outline" disabled={locked} onClick={() => move('up')} className="min-h-12" aria-label="Move up">
          <ArrowUp className="h-5 w-5" />
        </Button>
        <span />
        <Button type="button" variant="outline" disabled={locked} onClick={() => move('left')} className="min-h-12" aria-label="Move left">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <Button type="button" variant="outline" disabled={locked} onClick={() => {
          setPosition(metadata.start);
          setPath([]);
          submittedRef.current = false;
        }} className="min-h-12" aria-label="Reset path">
          <RotateCcw className="h-5 w-5" />
        </Button>
        <Button type="button" variant="outline" disabled={locked} onClick={() => move('right')} className="min-h-12" aria-label="Move right">
          <ArrowRight className="h-5 w-5" />
        </Button>
        <span />
        <Button type="button" variant="outline" disabled={locked} onClick={() => move('down')} className="min-h-12" aria-label="Move down">
          <ArrowDown className="h-5 w-5" />
        </Button>
        <span />
      </div>
    </div>
  );
}

function OddoGrid({
  question,
  locked,
  onSubmit,
}: {
  question: GameQuestion;
  locked: boolean;
  onSubmit: (answer: SubmittedAnswer) => void;
}) {
  const metadata = question.metadata as { items: VisualToken[] };

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {metadata.items.map((item, index) => (
        <button
          key={`${item.label}-${index}`}
          type="button"
          disabled={locked}
          onClick={() => onSubmit(index.toString())}
          className="flex min-h-24 flex-col items-center justify-center gap-2 rounded-xl border border-border bg-card p-3 transition-colors hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label={`Select item ${index + 1}`}
        >
          <VisualTokenView token={item} />
          <span className="text-xs text-muted-foreground">Item {index + 1}</span>
        </button>
      ))}
    </div>
  );
}

export function QuestionRenderer({
  question,
  locked,
  onSubmit,
}: {
  question: GameQuestion;
  locked: boolean;
  onSubmit: (answer: SubmittedAnswer) => void;
}) {
  if (question.kind === 'grid-memory') {
    return <GridMemory question={question} locked={locked} onSubmit={onSubmit} />;
  }

  if (question.kind === 'geo-sudo') {
    return <GeoSudo question={question} locked={locked} onSubmit={onSubmit} />;
  }

  if (question.kind === 'motion-path') {
    return <MotionPath question={question} locked={locked} onSubmit={onSubmit} />;
  }

  if (question.kind === 'oddo-grid') {
    return <OddoGrid question={question} locked={locked} onSubmit={onSubmit} />;
  }

  return <MultipleChoice question={question} locked={locked} onSubmit={onSubmit} />;
}
