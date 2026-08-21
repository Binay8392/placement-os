import { useMemo, useState, type ElementType } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  BarChart3,
  Clock3,
  Flame,
  Gauge,
  Medal,
  Play,
  ShieldCheck,
  Sparkles,
  Trophy,
} from 'lucide-react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useFirebaseAuth } from '@/hooks/useFirebaseAuth';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import { GAME_DEFINITIONS, GAME_ORDER } from '@/features/game-arena/gameRegistry';
import {
  calculateArenaStats,
  calculateGameStats,
  getDailyChallenge,
  getWeakestGames,
  getWeeklyPerformance,
  readinessSummary,
} from '@/features/game-arena/stats';
import {
  getGameAttempts,
  getLeaderboardPrivacy,
  setLeaderboardPrivacy,
} from '@/features/game-arena/storage';

const accentClasses = {
  primary: 'bg-primary/10 text-primary',
  success: 'bg-success/10 text-success',
  warning: 'bg-warning/10 text-warning',
  destructive: 'bg-destructive/10 text-destructive',
  sky: 'bg-sky-500/10 text-sky-500',
  violet: 'bg-violet-500/10 text-violet-500',
  slate: 'bg-muted text-muted-foreground',
};

function StatTile({
  label,
  value,
  detail,
  icon: Icon,
}: {
  label: string;
  value: string;
  detail: string;
  icon: ElementType;
}) {
  return (
    <Card className="border-border/70 bg-card/80 shadow-sm">
      <CardContent className="p-4">
        <div className="mb-3 flex items-center justify-between gap-3">
          <p className="text-xs font-medium text-muted-foreground">{label}</p>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Icon className="h-4 w-4" />
          </div>
        </div>
        <p className="font-mono text-2xl font-semibold tracking-tight">{value}</p>
        <p className="mt-1 text-xs text-muted-foreground">{detail}</p>
      </CardContent>
    </Card>
  );
}

export default function GameArenaPage() {
  const { user } = useFirebaseAuth();
  const [attempts] = useState(() => getGameAttempts());
  const [hideLeaderboard, setHideLeaderboard] = useState(() => getLeaderboardPrivacy());
  const arenaStats = useMemo(() => calculateArenaStats(attempts), [attempts]);
  const dailyChallenge = useMemo(() => getDailyChallenge(), []);
  const weeklyPerformance = useMemo(() => getWeeklyPerformance(attempts), [attempts]);
  const weakestGames = useMemo(() => getWeakestGames(attempts), [attempts]);
  const readiness = readinessSummary(arenaStats.readiness);
  const leaderboard = useMemo(() => [...attempts].sort((a, b) => b.score - a.score).slice(0, 5), [attempts]);

  const togglePrivacy = (value: boolean) => {
    setHideLeaderboard(value);
    setLeaderboardPrivacy(value);
  };

  return (
    <div className="dashboard-canvas min-h-full pb-24 md:pb-10">
      <div className="mx-auto max-w-[1600px] space-y-6 px-4 py-5 sm:px-6 sm:py-7 xl:px-8">
        <motion.section
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="grid gap-5 xl:grid-cols-[1.4fr_0.8fr]"
        >
          <div className="rounded-2xl border border-border/70 bg-card/85 p-5 shadow-sm sm:p-7">
            <Badge variant="secondary" className="mb-4 gap-2 rounded-lg bg-primary/10 text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              Corporate cognitive practice
            </Badge>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">GAME ARENA</h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              Train your brain. Beat the clock. Crack the assessment.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl border border-border bg-background/70 p-4">
                <p className="text-xs text-muted-foreground">Overall Readiness</p>
                <p className="mt-1 font-mono text-3xl font-semibold">{arenaStats.readiness}%</p>
                <p className="mt-1 text-xs text-muted-foreground">{readiness.label}</p>
              </div>
              <div className="rounded-xl border border-border bg-background/70 p-4">
                <p className="text-xs text-muted-foreground">Accuracy</p>
                <p className="mt-1 font-mono text-3xl font-semibold">{arenaStats.averageAccuracy}%</p>
                <p className="mt-1 text-xs text-muted-foreground">Average across attempts</p>
              </div>
              <div className="rounded-xl border border-border bg-background/70 p-4">
                <p className="text-xs text-muted-foreground">Avg. Speed</p>
                <p className="mt-1 font-mono text-3xl font-semibold">{arenaStats.averageResponseTime}s</p>
                <p className="mt-1 text-xs text-muted-foreground">Per question</p>
              </div>
            </div>
            <div className="mt-5 flex flex-col gap-2 sm:flex-row">
              <Button asChild className="min-h-11">
                <Link to="/game-arena/assessment">
                  <Play className="h-4 w-4 fill-current" />
                  Start Full Assessment
                </Link>
              </Button>
              <Button asChild variant="outline" className="min-h-11">
                <Link to={`/game-arena/${dailyChallenge.gameId}`}>
                  Today's Game
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>

          <Card className="border-border/70 bg-card/85 shadow-sm">
            <CardHeader className="p-5 pb-2">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <CardTitle className="text-base">Full Assessment</CardTitle>
                  <p className="mt-1 text-xs text-muted-foreground">Randomized PrepTrack Simulation</p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-success/10 text-success">
                  <ShieldCheck className="h-5 w-5" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 p-5 pt-2">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="rounded-xl border border-border bg-background/70 p-3">
                  <p className="font-mono text-lg font-semibold">4</p>
                  <p className="text-xs text-muted-foreground">Game blocks</p>
                </div>
                <div className="rounded-xl border border-border bg-background/70 p-3">
                  <p className="font-mono text-lg font-semibold">24m</p>
                  <p className="text-xs text-muted-foreground">Default window</p>
                </div>
              </div>
              <p className="text-xs leading-relaxed text-muted-foreground">
                Simulations are original PrepTrack practice experiences and are not official company tests.
              </p>
              <Button asChild className="min-h-11 w-full">
                <Link to="/game-arena/assessment">Start Assessment</Link>
              </Button>
            </CardContent>
          </Card>
        </motion.section>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Game Arena metrics">
          <StatTile label="Overall Game Score" value={`${arenaStats.overallScore}%`} detail="Score blend across games" icon={Gauge} />
          <StatTile label="Games Completed" value={arenaStats.gamesCompleted.toString()} detail={`${arenaStats.totalXp} XP earned`} icon={Trophy} />
          <StatTile label="Current Streak" value={`${arenaStats.currentStreak}d`} detail="Daily game practice" icon={Flame} />
          <StatTile label="Best Score" value={`${arenaStats.bestScore}%`} detail="Personal best attempt" icon={Medal} />
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.5fr_0.8fr]">
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold tracking-tight">Game Library</h2>
                <p className="text-sm text-muted-foreground">Eight playable cognitive games with generated questions.</p>
              </div>
              <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
                <Link to="/admin/game-arena">Admin config</Link>
              </Button>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {GAME_ORDER.map((gameId) => {
                const definition = GAME_DEFINITIONS[gameId];
                const stats = calculateGameStats(attempts, gameId);
                const Icon = definition.icon;
                return (
                  <Card key={gameId} className="border-border/70 bg-card/85 shadow-sm">
                    <CardContent className="flex h-full flex-col p-4">
                      <div className="mb-4 flex items-start justify-between gap-3">
                        <div className={cn('flex h-10 w-10 items-center justify-center rounded-xl', accentClasses[definition.accent])}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <Badge variant="outline" className="rounded-lg text-[10px]">
                          {stats.attempts || 0} attempts
                        </Badge>
                      </div>
                      <h3 className="text-sm font-semibold">{definition.name}</h3>
                      <p className="mt-1 min-h-10 text-xs leading-relaxed text-muted-foreground">{definition.description}</p>
                      <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
                        <div className="rounded-lg bg-muted/50 p-2">
                          <p className="font-mono font-semibold">{stats.bestScore}%</p>
                          <p className="text-muted-foreground">Best</p>
                        </div>
                        <div className="rounded-lg bg-muted/50 p-2">
                          <p className="font-mono font-semibold">{stats.accuracy}%</p>
                          <p className="text-muted-foreground">Acc</p>
                        </div>
                        <div className="rounded-lg bg-muted/50 p-2">
                          <p className="font-mono font-semibold">{stats.averageTime}s</p>
                          <p className="text-muted-foreground">Avg</p>
                        </div>
                      </div>
                      <Button asChild className="mt-4 min-h-11 w-full">
                        <Link to={definition.route}>Start</Link>
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          <div className="space-y-4">
            <Card className="border-border/70 bg-card/85 shadow-sm">
              <CardHeader className="p-5 pb-2">
                <CardTitle className="text-base">Today's Game</CardTitle>
                <p className="text-xs text-muted-foreground">Can you beat your previous score?</p>
              </CardHeader>
              <CardContent className="space-y-4 p-5 pt-2">
                <div className="rounded-xl border border-border bg-background/70 p-4">
                  <p className="text-xs text-muted-foreground">Today's Challenge</p>
                  <p className="mt-1 font-semibold">{dailyChallenge.title}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {dailyChallenge.questions} questions - {dailyChallenge.minutes} minutes - +{dailyChallenge.rewardXp} XP
                  </p>
                </div>
                <Button asChild variant="outline" className="min-h-11 w-full">
                  <Link to={`/game-arena/${dailyChallenge.gameId}`}>Open Challenge</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="border-border/70 bg-card/85 shadow-sm">
              <CardHeader className="p-5 pb-2">
                <CardTitle className="text-base">7-Day Performance</CardTitle>
              </CardHeader>
              <CardContent className="h-48 p-3 pt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={weeklyPerformance} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                    <CartesianGrid vertical={false} stroke="hsl(var(--border))" strokeDasharray="3 6" />
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                    <YAxis hide domain={[0, 100]} />
                    <Tooltip
                      contentStyle={{
                        background: 'hsl(var(--popover))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '10px',
                        color: 'hsl(var(--popover-foreground))',
                        fontSize: '12px',
                      }}
                    />
                    <Area type="monotone" dataKey="score" stroke="hsl(var(--primary))" fill="hsl(var(--primary) / 0.18)" strokeWidth={2.5} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="border-border/70 bg-card/85 shadow-sm">
              <CardHeader className="p-5 pb-2">
                <CardTitle className="text-base">Focus Areas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 p-5 pt-2">
                {weakestGames.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-border bg-muted/25 p-4 text-sm text-muted-foreground">
                    Your Game Arena journey starts here.
                  </div>
                ) : (
                  weakestGames.map((item) => (
                    <div key={item.gameId} className="rounded-xl border border-border bg-background/70 p-3">
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-sm font-medium">{GAME_DEFINITIONS[item.gameId].shortName}</p>
                        <span className="font-mono text-sm">{item.stats.accuracy}%</span>
                      </div>
                      <Progress value={item.stats.accuracy} className="mt-2 h-1.5" />
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-2">
          <Card className="border-border/70 bg-card/85 shadow-sm">
            <CardHeader className="flex-row items-start justify-between space-y-0 p-5 pb-2">
              <div>
                <CardTitle className="text-base">Leaderboard</CardTitle>
                <p className="mt-1 text-xs text-muted-foreground">Local score table with privacy control.</p>
              </div>
              <BarChart3 className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent className="space-y-4 p-5 pt-2">
              <div className="flex items-center justify-between rounded-xl border border-border bg-background/70 p-3">
                <div>
                  <p className="text-sm font-medium">Hide my profile</p>
                  <p className="text-xs text-muted-foreground">Show scores as private learner.</p>
                </div>
                <Switch checked={hideLeaderboard} onCheckedChange={togglePrivacy} aria-label="Hide profile from leaderboard" />
              </div>
              {leaderboard.length === 0 ? (
                <div className="rounded-xl border border-dashed border-border bg-muted/25 p-4 text-sm text-muted-foreground">
                  Be the first to set the score.
                </div>
              ) : (
                <div className="divide-y divide-border rounded-xl border border-border">
                  {leaderboard.map((attempt, index) => (
                    <div key={attempt.attemptId} className="grid grid-cols-[44px_1fr_auto] items-center gap-3 p-3 text-sm">
                      <span className="font-mono text-muted-foreground">#{index + 1}</span>
                      <div className="min-w-0">
                        <p className="truncate font-medium">{hideLeaderboard ? 'Private learner' : user?.displayName || 'PrepTrack learner'}</p>
                        <p className="text-xs text-muted-foreground">{GAME_DEFINITIONS[attempt.gameId].shortName} - {attempt.accuracy}% accuracy</p>
                      </div>
                      <span className="font-mono font-semibold">{attempt.score}</span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-border/70 bg-card/85 shadow-sm">
            <CardHeader className="p-5 pb-2">
              <CardTitle className="text-base">Assessment Readiness</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 p-5 pt-2">
              <div className="rounded-xl border border-border bg-background/70 p-4">
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Game Readiness Score</span>
                  <span className="font-mono font-semibold">{arenaStats.readiness}%</span>
                </div>
                <Progress value={arenaStats.readiness} className="h-2" />
                <p className="mt-3 text-sm font-medium">{readiness.label}</p>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{readiness.note}</p>
              </div>
              <Button asChild variant="outline" className="min-h-11 w-full">
                <Link to="/game-arena/assessment">
                  Run assessment check
                  <Clock3 className="h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
