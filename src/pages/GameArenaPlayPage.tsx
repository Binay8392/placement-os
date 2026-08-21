import {
  Suspense,
  lazy,
  useMemo,
  useState,
  type ComponentType,
  type LazyExoticComponent,
} from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, BarChart3, Clock3, Gauge, Play, RotateCcw, Sparkles } from 'lucide-react';
import { useFirebaseAuth } from '@/hooks/useFirebaseAuth';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/ui/skeleton';
import { difficultyLabels, practiceModes } from '@/features/game-arena/config';
import { GAME_DEFINITIONS, isGameId } from '@/features/game-arena/gameRegistry';
import { calculateGameStats } from '@/features/game-arena/stats';
import { getArenaConfig, getGameAttempts, syncGameAttempt } from '@/features/game-arena/storage';
import type { ChallengeProps } from '@/features/game-arena/games/challengeTypes';
import type { Difficulty, GameMode, GameResult } from '@/features/game-arena/types';

const challengeComponents: Record<string, LazyExoticComponent<ComponentType<ChallengeProps>>> = {
  digit: lazy(() => import('@/features/game-arena/games/DigitChallenge/DigitChallenge')),
  'geo-sudo': lazy(() => import('@/features/game-arena/games/GeoSudoChallenge/GeoSudoChallenge')),
  grid: lazy(() => import('@/features/game-arena/games/GridChallenge/GridChallenge')),
  motion: lazy(() => import('@/features/game-arena/games/MotionChallenge/MotionChallenge')),
  oddo: lazy(() => import('@/features/game-arena/games/OddoChallenge/OddoChallenge')),
  switch: lazy(() => import('@/features/game-arena/games/SwitchChallenge/SwitchChallenge')),
  inductive: lazy(() => import('@/features/game-arena/games/InductiveChallenge/InductiveChallenge')),
  pattern: lazy(() => import('@/features/game-arena/games/PatternChallenge/PatternChallenge')),
};

function CountdownOverlay({ value }: { value: number }) {
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-background/95 backdrop-blur">
      <div className="text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Starting</p>
        <p className="mt-3 font-mono text-7xl font-semibold tracking-tight text-primary">
          {value > 0 ? value : 'GO'}
        </p>
      </div>
    </div>
  );
}

function ResultPanel({
  result,
  onRestart,
}: {
  result: GameResult;
  onRestart: () => void;
}) {
  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
      <Card className="border-border/70 bg-card/90 shadow-sm">
        <CardHeader className="p-5">
          <Badge variant="secondary" className="mb-3 w-fit rounded-lg bg-success/10 text-success">
            Game complete
          </Badge>
          <CardTitle className="text-2xl">{GAME_DEFINITIONS[result.gameId].name}</CardTitle>
          <p className="text-sm text-muted-foreground">Performance score and practice feedback.</p>
        </CardHeader>
        <CardContent className="space-y-5 p-5 pt-0">
          <div className="grid gap-3 sm:grid-cols-4">
            <div className="rounded-xl border border-border bg-background/70 p-4">
              <p className="text-xs text-muted-foreground">Score</p>
              <p className="mt-1 font-mono text-3xl font-semibold">{result.score}/100</p>
              <p className="mt-1 text-xs text-muted-foreground">Grade {result.scoring.grade}</p>
            </div>
            <div className="rounded-xl border border-border bg-background/70 p-4">
              <p className="text-xs text-muted-foreground">Accuracy</p>
              <p className="mt-1 font-mono text-3xl font-semibold">{result.accuracy}%</p>
              <p className="mt-1 text-xs text-muted-foreground">{result.correct}/{result.totalQuestions} correct</p>
            </div>
            <div className="rounded-xl border border-border bg-background/70 p-4">
              <p className="text-xs text-muted-foreground">Speed</p>
              <p className="mt-1 font-mono text-3xl font-semibold">{result.scoring.speedScore}%</p>
              <p className="mt-1 text-xs text-muted-foreground">{result.averageResponseTime}s avg</p>
            </div>
            <div className="rounded-xl border border-border bg-background/70 p-4">
              <p className="text-xs text-muted-foreground">Efficiency</p>
              <p className="mt-1 font-mono text-3xl font-semibold">{result.scoring.efficiencyScore}%</p>
              <p className="mt-1 text-xs text-muted-foreground">{result.totalTime}s total</p>
            </div>
          </div>

          <div className="space-y-3">
            {[
              ['Accuracy', result.scoring.accuracyScore],
              ['Speed', result.scoring.speedScore],
              ['Difficulty', result.scoring.difficultyScore],
              ['Efficiency', result.scoring.efficiencyScore],
            ].map(([label, value]) => (
              <div key={label.toString()}>
                <div className="mb-1 flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">{label}</span>
                  <span className="font-mono font-medium">{value}%</span>
                </div>
                <Progress value={Number(value)} className="h-2" />
              </div>
            ))}
          </div>

          <div className="grid gap-2 sm:grid-cols-3">
            <Button onClick={onRestart} className="min-h-11">
              <RotateCcw className="h-4 w-4" />
              Practice Again
            </Button>
            <Button asChild variant="outline" className="min-h-11">
              <Link to="/game-arena">Game Arena</Link>
            </Button>
            <Button asChild variant="outline" className="min-h-11">
              <Link to="/game-arena/assessment">Full Assessment</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function GameArenaPlayPage() {
  const { gameId } = useParams();
  const { user } = useFirebaseAuth();
  const [arenaConfig] = useState(() => getArenaConfig());
  const [attempts] = useState(() => getGameAttempts());
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [mode, setMode] = useState<GameMode>('quick');
  const [adaptive, setAdaptive] = useState(true);
  const [started, setStarted] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [result, setResult] = useState<GameResult | null>(null);
  const resolvedGameId = isGameId(gameId) ? gameId : 'digit';
  const definition = GAME_DEFINITIONS[resolvedGameId];
  const Icon = definition.icon;
  const Challenge = challengeComponents[resolvedGameId];
  const gameConfig = { ...arenaConfig.gameConfigs[resolvedGameId], difficulty };
  const selectedMode = practiceModes.find((item) => item.id === mode) || practiceModes[0];
  const stats = useMemo(() => calculateGameStats(attempts, resolvedGameId), [attempts, resolvedGameId]);

  if (!isGameId(gameId)) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10">
        <Card>
          <CardContent className="p-6">
            <p className="font-medium">This game route does not exist.</p>
            <Button asChild className="mt-4">
              <Link to="/game-arena">Back to Game Arena</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const startWithCountdown = () => {
    setResult(null);
    setCountdown(3);
    const interval = window.setInterval(() => {
      setCountdown((current) => {
        if (current === null) return current;
        if (current <= 1) {
          window.clearInterval(interval);
          window.setTimeout(() => {
            setCountdown(null);
            setStarted(true);
          }, 350);
          return 0;
        }
        return current - 1;
      });
    }, 700);
  };

  const handleComplete = async (nextResult: GameResult) => {
    const enriched = { ...nextResult, userId: user?.uid };
    await syncGameAttempt(enriched);
    setResult(enriched);
    setStarted(false);
  };

  if (result) {
    return <ResultPanel result={result} onRestart={startWithCountdown} />;
  }

  if (started) {
    return (
      <Suspense fallback={<div className="p-4"><Skeleton className="h-[420px] rounded-2xl" /></div>}>
        <Challenge
          config={gameConfig}
          mode={mode}
          questionCount={selectedMode.questionCount}
          difficulty={difficulty}
          adaptive={adaptive}
          showExplanations={mode !== 'assessment'}
          scoringWeights={arenaConfig.scoringWeights}
          userId={user?.uid}
          onComplete={handleComplete}
          onAbort={(partial) => {
            if (partial) void handleComplete(partial);
            else setStarted(false);
          }}
        />
      </Suspense>
    );
  }

  return (
    <div className="dashboard-canvas min-h-full pb-24 md:pb-10">
      {countdown !== null && <CountdownOverlay value={countdown} />}
      <div className="mx-auto max-w-5xl space-y-6 px-4 py-5 sm:px-6 sm:py-7">
        <Button asChild variant="ghost" className="min-h-10 px-0 text-muted-foreground hover:bg-transparent">
          <Link to="/game-arena">
            <ArrowLeft className="h-4 w-4" />
            Back to Game Arena
          </Link>
        </Button>

        <section className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <Card className="border-border/70 bg-card/90 shadow-sm">
            <CardContent className="p-5 sm:p-7">
              <div className="mb-5 flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <Badge variant="secondary" className="mb-2 rounded-lg bg-primary/10 text-primary">
                    {definition.purpose}
                  </Badge>
                  <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{definition.name}</h1>
                  <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">{definition.description}</p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-xl border border-border bg-background/70 p-4">
                  <p className="text-xs text-muted-foreground">Best</p>
                  <p className="mt-1 font-mono text-2xl font-semibold">{stats.bestScore}%</p>
                </div>
                <div className="rounded-xl border border-border bg-background/70 p-4">
                  <p className="text-xs text-muted-foreground">Accuracy</p>
                  <p className="mt-1 font-mono text-2xl font-semibold">{stats.accuracy}%</p>
                </div>
                <div className="rounded-xl border border-border bg-background/70 p-4">
                  <p className="text-xs text-muted-foreground">Avg Time</p>
                  <p className="mt-1 font-mono text-2xl font-semibold">{stats.averageTime}s</p>
                </div>
              </div>

              <div className="mt-6 rounded-xl border border-border bg-muted/25 p-4">
                <div className="mb-2 flex items-center gap-2 text-sm font-medium">
                  <Sparkles className="h-4 w-4 text-primary" />
                  Practice rules
                </div>
                <div className="grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
                  <p>Answers lock immediately after submission.</p>
                  <p>Question timers auto-submit on expiry.</p>
                  <p>Practice mode shows explanations after each answer.</p>
                  <p>Adaptive mode changes difficulty gradually.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/70 bg-card/90 shadow-sm">
            <CardHeader className="p-5 pb-2">
              <CardTitle className="text-base">Practice Setup</CardTitle>
              <p className="text-xs text-muted-foreground">Choose mode, difficulty, and timing.</p>
            </CardHeader>
            <CardContent className="space-y-4 p-5 pt-2">
              <div>
                <label className="mb-2 block text-sm font-medium">Mode</label>
                <Select value={mode} onValueChange={(value) => setMode(value as GameMode)}>
                  <SelectTrigger className="min-h-11">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {practiceModes.map((item) => (
                      <SelectItem key={item.id} value={item.id}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">Difficulty</label>
                <Select value={difficulty} onValueChange={(value) => setDifficulty(value as Difficulty)}>
                  <SelectTrigger className="min-h-11">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(difficultyLabels).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between rounded-xl border border-border bg-background/70 p-3">
                <div>
                  <p className="text-sm font-medium">Adaptive difficulty</p>
                  <p className="text-xs text-muted-foreground">3 correct increases, 2 missed reduces.</p>
                </div>
                <Switch checked={adaptive} onCheckedChange={setAdaptive} aria-label="Toggle adaptive difficulty" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-xl border border-border bg-background/70 p-3">
                  <Clock3 className="mb-2 h-4 w-4 text-primary" />
                  <p className="font-mono text-lg font-semibold">{selectedMode.questionCount >= 999 ? 'Endless' : selectedMode.questionCount}</p>
                  <p className="text-xs text-muted-foreground">Questions</p>
                </div>
                <div className="rounded-xl border border-border bg-background/70 p-3">
                  <Gauge className="mb-2 h-4 w-4 text-primary" />
                  <p className="font-mono text-lg font-semibold">{gameConfig.timeLimit}s</p>
                  <p className="text-xs text-muted-foreground">Base timer</p>
                </div>
              </div>
              <Button onClick={startWithCountdown} className="min-h-12 w-full">
                <Play className="h-4 w-4 fill-current" />
                Start
              </Button>
            </CardContent>
          </Card>
        </section>

        <Card className="border-border/70 bg-card/90 shadow-sm">
          <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium">Want the company-style flow?</p>
              <p className="text-xs text-muted-foreground">The full assessment randomizes games and hides explanations until results.</p>
            </div>
            <Button asChild variant="outline" className="min-h-11">
              <Link to="/game-arena/assessment">
                <BarChart3 className="h-4 w-4" />
                Full Assessment
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
