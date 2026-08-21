import { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { GAME_DEFINITIONS } from '@/features/game-arena/gameRegistry';
import { getAssessmentSession } from '@/features/game-arena/storage';

export default function GameArenaResultsPage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const session = useMemo(() => (sessionId ? getAssessmentSession(sessionId) : undefined), [sessionId]);

  if (!session) {
    return (
      <div className="mx-auto max-w-3xl space-y-4 px-4 py-6 sm:px-6">
        <h1 className="text-2xl font-bold">Results not found</h1>
        <p className="text-muted-foreground">This assessment session is no longer available on this device.</p>
        <Button asChild>
          <Link to="/game-arena">Back to Game Arena</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 py-6 sm:px-6">
      <Button asChild variant="ghost" size="sm" className="-ml-2">
        <Link to="/game-arena">
          <ArrowLeft className="h-4 w-4" /> Game Arena
        </Link>
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="flex flex-wrap items-center gap-3">
            PrepTrack Simulation results
            <Badge variant="secondary">{session.profileName}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-4xl font-bold">{Math.round(session.overallScore ?? 0)}</p>
          <Progress value={session.overallScore ?? 0} />
          <p className="text-sm text-muted-foreground">
            {session.results.length} game{session.results.length === 1 ? '' : 's'} completed
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {session.results.map((result) => {
          const definition = GAME_DEFINITIONS[result.gameId];
          return (
            <Card key={`${result.gameId}-${result.attemptId}`}>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{definition?.name ?? result.gameId}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-1 text-sm text-muted-foreground">
                <p className="text-2xl font-semibold text-foreground">{Math.round(result.score)}</p>
                <p>Accuracy {Math.round(result.accuracy)}%</p>
                <p>
                  {result.correct} correct · {result.incorrect} wrong · {result.skipped} skipped
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
