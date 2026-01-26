import { useStore, getTodayString, getDailyQuote, getStudyTimeForPeriod } from '@/lib/store';
import { ProgressRing } from '@/components/ProgressRing';
import { StatCard } from '@/components/StatCard';
import { Clock, Target, Flame, BookOpen, Code2, Zap } from 'lucide-react';
import { useMemo } from 'react';
import { useFirebaseAuth } from '@/hooks/useFirebaseAuth';

export default function Dashboard() {
  const { habits, dsaTopics, studySessions } = useStore();
  const { user } = useFirebaseAuth();
  
  // Get user's first name from Firebase auth display name
  const userName = user?.displayName?.split(' ')[0] || 'User';
  const today = getTodayString();
  const quote = useMemo(() => getDailyQuote(), []);

  // Calculate stats
  const todaySessions = studySessions.filter((s) => s.date === today);
  const todayStudyTime = todaySessions.reduce((acc, s) => acc + s.duration, 0);
  const todayStudyHours = Math.floor(todayStudyTime / 3600);
  const todayStudyMins = Math.floor((todayStudyTime % 3600) / 60);

  const weekSessions = getStudyTimeForPeriod(studySessions, 7);
  const weekStudyTime = weekSessions.reduce((acc, s) => acc + s.duration, 0);
  const weekStudyHours = Math.floor(weekStudyTime / 3600);

  // Habit completion
  const goodHabits = habits.filter((h) => h.type === 'good');
  const completedToday = goodHabits.filter((h) => h.completedDates.includes(today)).length;
  const habitProgress = goodHabits.length > 0 ? (completedToday / goodHabits.length) * 100 : 0;

  // DSA progress
  const masteredTopics = dsaTopics.filter((t) => t.status === 'mastered').length;
  const inProgressTopics = dsaTopics.filter((t) => t.status === 'in-progress').length;
  const dsaProgress = (masteredTopics / dsaTopics.length) * 100;
  const totalQuestionsSolved = dsaTopics.reduce((acc, t) => acc + t.questionsSolved, 0);

  // Consistency score (mock calculation based on streaks and activity)
  const maxStreak = Math.max(...habits.map((h) => h.streak), 0);
  const consistencyScore = Math.min(Math.round((maxStreak * 5) + (weekStudyHours * 2) + (habitProgress * 0.5)), 100);

  return (
    <div className="min-h-screen pb-24 md:pb-8">
      {/* Header */}
      <header className="px-4 pt-6 pb-4 safe-top">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-muted-foreground text-sm">Good morning,</p>
            <h1 className="text-2xl font-bold">{userName} 👋</h1>
          </div>
          <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-bold">
            {userName.charAt(0)}
          </div>
        </div>
        
        {/* Quote */}
        <div className="glass-card rounded-2xl p-4 border border-border">
          <p className="text-sm italic text-foreground">"{quote.text}"</p>
          <p className="text-xs text-muted-foreground mt-2">— {quote.author}</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 space-y-6">
        {/* Today's Progress Ring */}
        <section className="flex flex-col items-center py-6">
          <ProgressRing progress={habitProgress} size={160} strokeWidth={12}>
            <div className="text-center">
              <p className="text-3xl font-bold">{Math.round(habitProgress)}%</p>
              <p className="text-xs text-muted-foreground">Today's Goals</p>
            </div>
          </ProgressRing>
          <p className="text-sm text-muted-foreground mt-4">
            {completedToday} of {goodHabits.length} habits completed
          </p>
        </section>

        {/* Stats Grid */}
        <section className="grid grid-cols-2 gap-3">
          <StatCard
            title="Study Today"
            value={`${todayStudyHours}h ${todayStudyMins}m`}
            subtitle="Keep going!"
            icon={<Clock className="w-5 h-5" />}
          />
          <StatCard
            title="This Week"
            value={`${weekStudyHours}h`}
            subtitle="Total study time"
            icon={<Target className="w-5 h-5" />}
          />
          <StatCard
            title="Best Streak"
            value={`${maxStreak} days`}
            subtitle="Stay consistent"
            icon={<Flame className="w-5 h-5" />}
            variant="success"
          />
          <StatCard
            title="Consistency"
            value={`${consistencyScore}%`}
            subtitle="Overall score"
            icon={<Zap className="w-5 h-5" />}
            variant="primary"
          />
        </section>

        {/* DSA Progress */}
        <section className="bg-card border border-border rounded-2xl p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold flex items-center gap-2">
              <Code2 className="w-5 h-5 text-primary" />
              DSA Progress
            </h2>
            <span className="text-sm text-muted-foreground">
              {masteredTopics}/{dsaTopics.length} topics
            </span>
          </div>
          
          {/* Progress bar */}
          <div className="h-3 bg-muted rounded-full overflow-hidden mb-3">
            <div 
              className="h-full gradient-primary rounded-full transition-all duration-500"
              style={{ width: `${dsaProgress}%` }}
            />
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-success" />
                <span className="text-muted-foreground">{masteredTopics} Mastered</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-warning" />
                <span className="text-muted-foreground">{inProgressTopics} In Progress</span>
              </div>
            </div>
            <span className="font-medium text-primary">{totalQuestionsSolved} solved</span>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="grid grid-cols-2 gap-3">
          <a 
            href="/timer" 
            className="bg-card border border-border rounded-2xl p-4 flex items-center gap-3 hover:border-primary/50 transition-colors"
          >
            <div className="p-2 rounded-xl gradient-primary">
              <Clock className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <p className="font-medium text-sm">Start Timer</p>
              <p className="text-xs text-muted-foreground">Track study time</p>
            </div>
          </a>
          
          <a 
            href="/dsa" 
            className="bg-card border border-border rounded-2xl p-4 flex items-center gap-3 hover:border-primary/50 transition-colors"
          >
            <div className="p-2 rounded-xl gradient-success">
              <BookOpen className="w-5 h-5 text-success-foreground" />
            </div>
            <div>
              <p className="font-medium text-sm">DSA Practice</p>
              <p className="text-xs text-muted-foreground">Continue learning</p>
            </div>
          </a>
        </section>
      </main>
    </div>
  );
}
