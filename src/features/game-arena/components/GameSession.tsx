import { useCallback, useMemo, useRef, useState, type ReactNode } from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { difficultyLabels } from '../config';
import { GAME_DEFINITIONS, GAME_GENERATORS } from '../gameRegistry';
import { useCountdown } from '../hooks/useCountdown';
import {
  adjustDifficulty,
  calculateAnswerEfficiency,
  calculateGameResult,
  validateAnswer,
} from '../scoring';
import type {
  AnswerRecord,
  Difficulty,
  GameConfig,
  GameMode,
  GameQuestion,
  GameResult,
  ScoringWeights,
} from '../types';
import { GameTimer } from './GameTimer';
import { QuestionRenderer } from './QuestionRenderer';

type SubmittedAnswer = string | string[] | null;

export function GameSession({
  config,
  mode,
  questionCount,
  difficulty,
  adaptive,
  showExplanations,
  scoringWeights,
  sessionId,
  userId,
  sessionSeed,
  compact = false,
  overallSlot,
  onComplete,
  onAbort,
}: {
  config: GameConfig;
  mode: GameMode;
  questionCount?: number;
  difficulty?: Difficulty;
  adaptive?: boolean;
  showExplanations?: boolean;
  scoringWeights?: ScoringWeights;
  sessionId?: string;
  userId?: string;
  sessionSeed?: string;
  compact?: boolean;
  overallSlot?: ReactNode;
  onComplete: (result: GameResult) => void;
  onAbort?: (result: GameResult | null) => void;
}) {
  const initialDifficulty = difficulty || config.difficulty;
  const totalQuestions = questionCount || config.questionCount;
  const seedRef = useRef(sessionSeed || `${config.id}-${Date.now()}`);
  const startedAtRef = useRef(Date.now());
  const questionStartedAtRef = useRef(Date.now());
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentDifficulty, setCurrentDifficulty] = useState<Difficulty>(initialDifficulty);
  const [answers, setAnswers] = useState<AnswerRecord[]>([]);
  const [locked, setLocked] = useState(false);
  const [feedback, setFeedback] = useState<AnswerRecord | null>(null);
  const [streaks, setStreaks] = useState({ correct: 0, incorrect: 0 });
  const [question, setQuestion] = useState<GameQuestion>(() =>
    GAME_GENERATORS[config.id](initialDifficulty, `${seedRef.current}-0-${initialDifficulty}`),
  );
  const definition = GAME_DEFINITIONS[config.id];
  const Icon = definition.icon;
  const strictTimer = mode === 'assessment' || mode === 'timed';

  const progress = useMemo(
    () => Math.round(((currentIndex + 1) / Math.max(totalQuestions, 1)) * 100),
    [currentIndex, totalQuestions],
  );

  const finish = useCallback((nextAnswers: AnswerRecord[]) => {
    const completedAt = Date.now();
    const result = calculateGameResult({
      answers: nextAnswers,
      gameId: config.id,
      difficulty: initialDifficulty,
      mode,
      startedAt: startedAtRef.current,
      completedAt,
      weights: scoringWeights,
      sessionId,
      userId,
    });
    onComplete(result);
  }, [config.id, initialDifficulty, mode, onComplete, scoringWeights, sessionId, userId]);

  const goNext = useCallback((nextAnswers: AnswerRecord[], nextDifficulty: Difficulty) => {
    if (currentIndex + 1 >= totalQuestions) {
      finish(nextAnswers);
      return;
    }

    const nextIndex = currentIndex + 1;
    const nextQuestion = GAME_GENERATORS[config.id](nextDifficulty, `${seedRef.current}-${nextIndex}-${nextDifficulty}`);
    questionStartedAtRef.current = Date.now();
    setQuestion(nextQuestion);
    setCurrentIndex(nextIndex);
    setCurrentDifficulty(nextDifficulty);
    setLocked(false);
    setFeedback(null);
  }, [config.id, currentIndex, finish, totalQuestions]);

  const submitAnswer = useCallback((answer: SubmittedAnswer, skipped = false) => {
    if (locked) return;
    setLocked(true);
    const isCorrect = !skipped && validateAnswer(question, answer);
    const responseTime = Date.now() - questionStartedAtRef.current;
    const record: AnswerRecord = {
      questionId: question.id,
      gameId: config.id,
      difficulty: currentDifficulty,
      answer,
      correctAnswer: question.correctAnswer,
      isCorrect,
      skipped,
      responseTime,
      efficiency: calculateAnswerEfficiency(question, answer),
      explanation: question.explanation,
    };
    const nextAnswers = [...answers, record];
    setAnswers(nextAnswers);
    setFeedback(record);

    if (typeof navigator !== 'undefined' && 'vibrate' in navigator && mode !== 'assessment') {
      navigator.vibrate(isCorrect ? 20 : [20, 30, 20]);
    }

    const nextStreaks = {
      correct: isCorrect ? streaks.correct + 1 : 0,
      incorrect: !isCorrect ? streaks.incorrect + 1 : 0,
    };
    const adjustedDifficulty = adaptive
      ? adjustDifficulty(currentDifficulty, nextStreaks.correct, nextStreaks.incorrect)
      : currentDifficulty;
    setStreaks(adjustedDifficulty === currentDifficulty ? nextStreaks : { correct: 0, incorrect: 0 });

    const delay = showExplanations ? 1200 : 320;
    window.setTimeout(() => goNext(nextAnswers, adjustedDifficulty), delay);
  }, [
    adaptive,
    answers,
    config.id,
    currentDifficulty,
    goNext,
    locked,
    mode,
    question,
    showExplanations,
    streaks.correct,
    streaks.incorrect,
  ]);

  const handleAbort = () => {
    if (!onAbort) return;
    if (answers.length === 0) {
      onAbort(null);
      return;
    }
    const result = calculateGameResult({
      answers,
      gameId: config.id,
      difficulty: initialDifficulty,
      mode,
      startedAt: startedAtRef.current,
      completedAt: Date.now(),
      weights: scoringWeights,
      sessionId,
      userId,
    });
    onAbort(result);
  };

  const remaining = useCountdown({
    seconds: question.timeLimit || config.timeLimit,
    resetKey: question.id,
    active: !locked,
    onExpire: () => submitAnswer(null, true),
  });

  return (
    <section className={cn('mx-auto w-full max-w-5xl space-y-4', compact ? 'p-3 sm:p-4' : 'px-4 py-5 sm:px-6 sm:py-7')}>
      <div className="rounded-2xl border border-border bg-card/90 shadow-sm">
        <div className="space-y-4 border-b border-border p-4 sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Icon className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{definition.name}</p>
                <p className="text-xs text-muted-foreground">
                  Question {currentIndex + 1}{totalQuestions >= 999 ? '' : `/${totalQuestions}`} - {difficultyLabels[currentDifficulty]}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {overallSlot}
              <GameTimer remaining={remaining} total={question.timeLimit || config.timeLimit} />
            </div>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <div className="space-y-5 p-4 sm:p-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary" className="rounded-lg">
                PrepTrack Simulation Timing
              </Badge>
              {strictTimer && (
                <Badge variant="outline" className="rounded-lg border-warning/40 text-warning">
                  Strict timer
                </Badge>
              )}
            </div>
            <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">{question.prompt}</h1>
            <p className="text-sm leading-relaxed text-muted-foreground">{question.instruction}</p>
          </div>

          <QuestionRenderer question={question} locked={locked} onSubmit={submitAnswer} />

          {showExplanations && feedback && (
            <div
              className={cn(
                'rounded-xl border p-4 text-sm',
                feedback.isCorrect
                  ? 'border-success/35 bg-success/10 text-success'
                  : 'border-destructive/35 bg-destructive/10 text-destructive',
              )}
              aria-live="polite"
            >
              <div className="mb-1 flex items-center gap-2 font-semibold">
                {feedback.isCorrect ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                {feedback.isCorrect ? 'Correct' : feedback.skipped ? 'Time expired' : 'Incorrect'}
              </div>
              <p className="text-foreground">{feedback.explanation}</p>
            </div>
          )}

          {onAbort && mode !== 'assessment' && (
            <Button type="button" variant="ghost" onClick={handleAbort} className="min-h-11 w-full text-muted-foreground">
              End practice and view score
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}
