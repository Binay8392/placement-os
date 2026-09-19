import {
  Suspense,
  lazy,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ComponentType,
  type LazyExoticComponent,
} from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AlertTriangle, WifiOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useFirebaseAuth } from '@/hooks/useFirebaseAuth';
import { defaultAssessmentConfig, mockProfiles } from '@/features/game-arena/config';
import { GAME_DEFINITIONS } from '@/features/game-arena/gameRegistry';
import { createRng, shuffle } from '@/features/game-arena/rng';
import { calculateOverallScore } from '@/features/game-arena/scoring';
import {
  getActiveSession,
  getArenaConfig,
  saveActiveSession,
  syncAssessmentSession,
  syncGameAttempt,
} from '@/features/game-arena/storage';
import { useCountdown } from '@/features/game-arena/hooks/useCountdown';
import { useNetworkStatus } from '@/features/game-arena/hooks/useNetworkStatus';
import { formatSeconds, GameTimer } from '@/features/game-arena/components/GameTimer';
import type { ChallengeProps } from '@/features/game-arena/games/challengeTypes';
import type { AssessmentSession, GameId, GameResult } from '@/features/game-arena/types';

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

function CountdownOverlay({ value, label }: { value: number; label: string }) {
  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-background text-foreground">
      <div className="text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">{label}</p>
        <p className="mt-3 font-mono text-7xl font-semibold tracking-tight text-primary">{value > 0 ? value : 'GO'}</p>
      </div>
    </div>
  );
}

function pickGames(profileId: string, config = defaultAssessmentConfig) {
  const profile = mockProfiles.find((item) => item.id === profileId) || mockProfiles[1];
  const pool: GameId[] =
    profile.id === 'company-simulation'
      ? ['digit', 'grid', 'motion', 'switch', 'geo-sudo', 'oddo']
      : config.gameOrder.filter((gameId) => config.gameConfigs[gameId]?.enabled);
  const rng = createRng(`${profileId}-${Date.now()}`);
  const ordered = config.randomizeGames ? shuffle(rng, pool) : pool;
  return ordered.slice(0, Math.min(profile.games, ordered.length));
}

export default function GameArenaAssessmentRunPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useFirebaseAuth();
  const online = useNetworkStatus();
  const [config] = useState(() => getArenaConfig());
  const profileId = searchParams.get('profile') || 'standard-mock';
  const recover = searchParams.get('recover') === '1';
  const selectedProfile = mockProfiles.find((item) => item.id === profileId) || mockProfiles[1];
  const initializedRef = useRef(false);
  const [countdown, setCountdown] = useState(3);
  const [session, setSession] = useState<AssessmentSession>(() => {
    const active = recover ? getActiveSession() : null;
    if (active && active.status === 'in_progress' && new Date(active.expiresAt).getTime() > Date.now()) {
      return active;
    }
    const now = Date.now();
    const sessionId = `assessment-${now.toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
    const minutes = selectedProfile.minutes || config.totalTimeMinutes;
    return {
      sessionId,
      userId: user?.uid,
      mode: selectedProfile.id,
      profileName: selectedProfile.label,
      games: pickGames(profileId, config),
      currentGameIndex: 0,
      currentQuestionIndex: 0,
      startedAt: new Date(now).toISOString(),
      expiresAt: new Date(now + minutes * 60 * 1000).toISOString(),
      status: 'in_progress',
      results: [],
    };
  });
  const totalSeconds = Math.max(1, Math.round((new Date(session.expiresAt).getTime() - new Date(session.startedAt).getTime()) / 1000));
  const remainingSeconds = useCountdown({
    seconds: Math.max(1, Math.ceil((new Date(session.expiresAt).getTime() - Date.now()) / 1000)),
    resetKey: session.sessionId,
    active: session.status === 'in_progress',
    onExpire: () => void finalize('expired', session.results),
  });

  const currentGameId = session.games[session.currentGameIndex] || session.games[0];
  const currentDefinition = GAME_DEFINITIONS[currentGameId];
  const Challenge = challengeComponents[currentGameId];

  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;
    saveActiveSession(session);
    void syncAssessmentSession(session);
  }, [session]);

  useEffect(() => {
    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = 'Your assessment is currently running. Leaving may end the session.';
    };
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => window.removeEventListener('beforeunload', onBeforeUnload);
  }, []);

  useEffect(() => {
    window.history.pushState(null, '', window.location.href);
    const onPopState = () => {
      window.history.pushState(null, '', window.location.href);
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setCountdown((current) => {
        if (current <= 0) {
          window.clearInterval(interval);
          return 0;
        }
        return current - 1;
      });
    }, 700);
    return () => window.clearInterval(interval);
  }, [session.currentGameIndex]);

  async function finalize(status: 'completed' | 'expired', results: GameResult[]) {
    const overallScore = calculateOverallScore(results);
    const completedSession: AssessmentSession = {
      ...session,
      status,
      results,
      currentGameIndex: Math.min(session.currentGameIndex, session.games.length - 1),
      completedAt: new Date().toISOString(),
      overallScore,
    };
    saveActiveSession(null);
    await syncAssessmentSession(completedSession);
    navigate(`/game-arena/results/${completedSession.sessionId}`, { replace: true });
  }

  const handleGameComplete = async (result: GameResult) => {
    const enriched = { ...result, userId: user?.uid, sessionId: session.sessionId };
    await syncGameAttempt(enriched);
    const nextResults = [...session.results, enriched];
    if (session.currentGameIndex + 1 >= session.games.length) {
      await finalize('completed', nextResults);
      return;
    }

    const nextSession: AssessmentSession = {
      ...session,
      userId: user?.uid,
      results: nextResults,
      currentGameIndex: session.currentGameIndex + 1,
      currentQuestionIndex: 0,
    };
    setCountdown(3);
    setSession(nextSession);
    saveActiveSession(nextSession);
    await syncAssessmentSession(nextSession);
  };

  const requestFullscreen = () => {
    const element = document.documentElement;
    if (element.requestFullscreen) void element.requestFullscreen();
  };

  const header = useMemo(() => (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 px-4 py-3 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Game {session.currentGameIndex + 1}/{session.games.length}
          </p>
          <h1 className="truncate text-sm font-semibold sm:text-base">{currentDefinition.name}</h1>
        </div>
        <div className="flex items-center gap-2">
          {!online && (
            <div className="hidden items-center gap-2 rounded-lg border border-warning/35 bg-warning/10 px-3 py-2 text-xs text-warning sm:flex">
              <WifiOff className="h-4 w-4" />
              Progress preserved
            </div>
          )}
          <GameTimer remaining={remainingSeconds} total={totalSeconds} label="Assessment time remaining" />
        </div>
      </div>
    </header>
  ), [currentDefinition.name, online, remainingSeconds, session.currentGameIndex, session.games.length, totalSeconds]);

  if (!currentGameId) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <Card className="max-w-md">
          <CardContent className="p-6">
            <p className="font-medium">No enabled games are configured for this assessment.</p>
            <Button onClick={() => navigate('/game-arena')} className="mt-4">Back to Game Arena</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {countdown > 0 && <CountdownOverlay value={countdown} label={currentDefinition.name} />}
      {header}
      {!online && (
        <div className="mx-auto mt-3 max-w-6xl px-4">
          <div className="flex items-center gap-2 rounded-xl border border-warning/35 bg-warning/10 p-3 text-sm text-warning">
            <AlertTriangle className="h-4 w-4" />
            Connection interrupted. Your progress is being preserved.
          </div>
        </div>
      )}
      <div className={countdown > 0 ? 'pointer-events-none opacity-40' : undefined}>
        <Suspense fallback={<div className="p-4"><Skeleton className="h-[500px] rounded-2xl" /></div>}>
          <Challenge
            key={`${session.sessionId}-${session.currentGameIndex}`}
            config={{
              ...config.gameConfigs[currentGameId],
              difficulty: selectedProfile.difficulty,
            }}
            mode="assessment"
            difficulty={selectedProfile.difficulty}
            adaptive={config.adaptiveDifficulty}
            showExplanations={config.showAnswersDuringTest}
            scoringWeights={config.scoringWeights}
            sessionId={session.sessionId}
            userId={user?.uid}
            compact
            sessionSeed={`${session.sessionId}-${session.currentGameIndex}`}
            overallSlot={
              <span className="hidden rounded-lg border border-border bg-card px-3 py-2 font-mono text-sm sm:inline-flex">
                Total {formatSeconds(remainingSeconds)}
              </span>
            }
            onComplete={handleGameComplete}
          />
        </Suspense>
      </div>
      <div className="fixed bottom-3 right-3 z-50 hidden sm:block">
        <Button type="button" variant="outline" onClick={requestFullscreen} className="bg-background/90">
          Fullscreen
        </Button>
      </div>
    </div>
  );
}
