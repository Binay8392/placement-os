import { useEffect, useCallback, useRef } from 'react';
import { useStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import { Play, Pause, Square, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

const categories = [
  { id: 'dsa' as const, label: 'DSA', color: 'bg-primary' },
  { id: 'aptitude' as const, label: 'Aptitude', color: 'bg-success' },
  { id: 'core-cs' as const, label: 'Core CS', color: 'bg-warning' },
  { id: 'development' as const, label: 'Dev', color: 'bg-destructive' },
];

function formatTime(seconds: number): string {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
  if (hrs > 0) {
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export default function StudyTimer() {
  const activeTimer = useStore((state) => state.activeTimer);
  const startTimer = useStore((state) => state.startTimer);
  const pauseTimer = useStore((state) => state.pauseTimer);
  const resumeTimer = useStore((state) => state.resumeTimer);
  const stopTimer = useStore((state) => state.stopTimer);
  const resetTimer = useStore((state) => state.resetTimer);
  const updateElapsed = useStore((state) => state.updateElapsed);
  const studySessions = useStore((state) => state.studySessions);
  
  const intervalRef = useRef<number | null>(null);
  const today = new Date().toISOString().split('T')[0];
  const todaySessions = studySessions.filter((s) => s.date === today);
  const todayTotal = todaySessions.reduce((acc, s) => acc + s.duration, 0);

  // Timer tick effect
  useEffect(() => {
    if (activeTimer.isRunning && activeTimer.startTime) {
      intervalRef.current = window.setInterval(() => {
        const elapsed = Math.floor((Date.now() - activeTimer.startTime!) / 1000);
        updateElapsed(elapsed);
      }, 100);
    } else {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
    
    return () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
      }
    };
  }, [activeTimer.isRunning, activeTimer.startTime, updateElapsed]);

  const handleStart = useCallback((category: typeof categories[number]['id']) => {
    startTimer(category);
  }, [startTimer]);

  const handleToggle = useCallback(() => {
    if (activeTimer.isRunning) {
      pauseTimer();
    } else if (activeTimer.startTime) {
      resumeTimer();
    }
  }, [activeTimer.isRunning, activeTimer.startTime, pauseTimer, resumeTimer]);

  const handleStop = useCallback(() => {
    stopTimer();
  }, [stopTimer]);

  const handleReset = useCallback(() => {
    resetTimer();
  }, [resetTimer]);

  const currentCategory = categories.find((c) => c.id === activeTimer.category);
  const hasActiveSession = activeTimer.startTime !== null || activeTimer.elapsed > 0;

  return (
    <div className="min-h-screen pb-24 md:pb-8">
      <header className="px-4 pt-6 pb-4 safe-top">
        <h1 className="text-2xl font-bold">Study Timer</h1>
        <p className="text-muted-foreground text-sm">Track your learning sessions</p>
      </header>

      <main className="px-4 space-y-6">
        {/* Timer Display */}
        <section className="flex flex-col items-center py-8">
          <div className={cn(
            "relative w-64 h-64 rounded-full flex items-center justify-center",
            "bg-gradient-to-br from-card to-muted border-4 border-border",
            activeTimer.isRunning && "shadow-glow animate-pulse-ring"
          )}>
            {/* Inner circle */}
            <div className="absolute inset-4 rounded-full bg-background flex flex-col items-center justify-center">
              <span className="text-5xl font-bold font-mono tracking-tight">
                {formatTime(activeTimer.elapsed)}
              </span>
              {hasActiveSession && currentCategory && (
                <span className={cn(
                  "mt-2 px-3 py-1 rounded-full text-xs font-medium",
                  currentCategory.color,
                  "text-primary-foreground"
                )}>
                  {currentCategory.label}
                </span>
              )}
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-4 mt-8">
            {hasActiveSession ? (
              <>
                <Button
                  variant="outline"
                  size="icon"
                  className="w-14 h-14 rounded-full"
                  onClick={handleStop}
                >
                  <Square className="w-6 h-6" />
                </Button>
                <Button
                  size="icon"
                  className="w-16 h-16 rounded-full gradient-primary shadow-glow"
                  onClick={handleToggle}
                >
                  {activeTimer.isRunning ? (
                    <Pause className="w-7 h-7 text-primary-foreground" />
                  ) : (
                    <Play className="w-7 h-7 text-primary-foreground ml-1" />
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="w-14 h-14 rounded-full"
                  onClick={handleReset}
                >
                  <RotateCcw className="w-5 h-5" />
                </Button>
              </>
            ) : (
              <p className="text-muted-foreground text-sm">Select a category to start</p>
            )}
          </div>
        </section>

        {/* Category Selection */}
        {!hasActiveSession && (
          <section>
            <h2 className="font-semibold mb-3">What are you studying?</h2>
            <div className="grid grid-cols-2 gap-3">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleStart(cat.id)}
                  className={cn(
                    "p-4 rounded-2xl border-2 border-transparent transition-all duration-200",
                    "bg-card hover:border-primary/50 active:scale-95",
                    "flex flex-col items-center gap-2"
                  )}
                >
                  <div className={cn("w-4 h-4 rounded-full", cat.color)} />
                  <span className="font-medium">{cat.label}</span>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Today's Summary */}
        <section className="bg-card border border-border rounded-2xl p-4">
          <h2 className="font-semibold mb-3">Today's Sessions</h2>
          {todaySessions.length === 0 ? (
            <p className="text-muted-foreground text-sm">No sessions recorded today</p>
          ) : (
            <div className="space-y-2">
              {todaySessions.slice(-5).reverse().map((session) => {
                const cat = categories.find((c) => c.id === session.category);
                return (
                  <div key={session.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                    <div className="flex items-center gap-2">
                      <div className={cn("w-2 h-2 rounded-full", cat?.color)} />
                      <span className="text-sm">{cat?.label}</span>
                    </div>
                    <span className="text-sm font-mono text-muted-foreground">
                      {formatTime(session.duration)}
                    </span>
                  </div>
                );
              })}
              <div className="flex items-center justify-between pt-2 font-medium">
                <span>Total</span>
                <span className="font-mono text-primary">{formatTime(todayTotal)}</span>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
