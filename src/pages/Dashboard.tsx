import { useStore, getTodayString, getDailyQuote, getStudyTimeForPeriod, calculateStreak } from '@/lib/store';
import { ProgressRing } from '@/components/ProgressRing';
import { StatCard } from '@/components/StatCard';
import { Clock, Target, Flame, BookOpen, Code2, Zap, ListChecks, Building2, Terminal } from 'lucide-react';
import { useMemo } from 'react';
import { useFirebaseAuth } from '@/hooks/useFirebaseAuth';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Dashboard() {
  const { habits, dsaTopics, studySessions, trackedTasks, leetCodeProgress, dailyActivities, aptitudeTopics } = useStore();
  const { user } = useFirebaseAuth();
  
  const userName = user?.displayName?.split(' ')[0] || 'User';
  const today = getTodayString();
  const quote = useMemo(() => getDailyQuote(), []);

  const todaySessions = studySessions.filter((s) => s.date === today);
  const todayStudyTime = todaySessions.reduce((acc, s) => acc + s.duration, 0);
  const todayStudyHours = Math.floor(todayStudyTime / 3600);
  const todayStudyMins = Math.floor((todayStudyTime % 3600) / 60);

  const weekSessions = getStudyTimeForPeriod(studySessions, 7);
  const weekStudyTime = weekSessions.reduce((acc, s) => acc + s.duration, 0);
  const weekStudyHours = Math.floor(weekStudyTime / 3600);

  const goodHabits = habits.filter((h) => h.type === 'good');
  const completedToday = goodHabits.filter((h) => h.completedDates.includes(today)).length;
  const habitProgress = goodHabits.length > 0 ? (completedToday / goodHabits.length) * 100 : 0;

  const masteredTopics = dsaTopics.filter((t) => t.status === 'mastered').length;
  const inProgressTopics = dsaTopics.filter((t) => t.status === 'in-progress').length;
  const dsaProgress = (masteredTopics / dsaTopics.length) * 100;
  const totalQuestionsSolved = dsaTopics.reduce((acc, t) => acc + t.questionsSolved, 0);

  const streak = useMemo(() => calculateStreak(dailyActivities), [dailyActivities]);

  // Quick readiness score
  const readinessScore = useMemo(() => {
    const codingTasks = trackedTasks.filter(t => t.status === 'Completed' && t.category === 'Coding');
    const codingPoints = codingTasks.reduce((acc, t) => acc + (t.difficulty === 'Easy' ? 1 : t.difficulty === 'Medium' ? 2 : 3), 0);
    const lcPoints = leetCodeProgress.easySolved + leetCodeProgress.mediumSolved * 2 + leetCodeProgress.hardSolved * 3;
    const codingScore = Math.min(((codingPoints + lcPoints) / 100) * 100, 100);
    const totalAttempted = aptitudeTopics.reduce((acc, t) => acc + t.attempted, 0);
    const totalCorrect = aptitudeTopics.reduce((acc, t) => acc + t.correct, 0);
    const aptitudeScore = totalAttempted > 0 ? (totalCorrect / totalAttempted) * 100 : 0;
    const csTasks = trackedTasks.filter(t => t.status === 'Completed' && t.category === 'CS Fundamentals');
    const csScore = Math.min(csTasks.length * 8, 100);
    const consistencyScore = Math.min(streak.current * 10, 100);
    const interviewTasks = trackedTasks.filter(t => t.status === 'Completed' && t.category === 'Interview');
    const interviewScore = Math.min(interviewTasks.length * 10, 100);
    return Math.round(codingScore * 0.4 + aptitudeScore * 0.2 + csScore * 0.2 + consistencyScore * 0.1 + interviewScore * 0.1);
  }, [trackedTasks, leetCodeProgress, aptitudeTopics, streak]);

  const taskStats = useMemo(() => {
    const total = trackedTasks.length;
    const completed = trackedTasks.filter(t => t.status === 'Completed').length;
    return { total, completed };
  }, [trackedTasks]);

  return (
    <div className="min-h-screen pb-24 md:pb-8">
      <header className="px-4 pt-6 pb-4 safe-top">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-muted-foreground text-sm">Good morning,</p>
            <h1 className="text-2xl font-bold">{userName} 👋</h1>
          </div>
          <Link to="/profile"
            className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-bold overflow-hidden hover:ring-2 hover:ring-primary/50 transition-all">
            {user?.photoURL ? (
              <img src={user.photoURL} alt={userName} className="w-full h-full object-cover" />
            ) : (
              userName.charAt(0)
            )}
          </Link>
        </div>
        <div className="glass-card rounded-2xl p-4 border border-border">
          <p className="text-sm italic text-foreground">"{quote.text}"</p>
          <p className="text-xs text-muted-foreground mt-2">— {quote.author}</p>
        </div>
      </header>

      <main className="px-4 space-y-6">
        {/* Readiness Score + Today's Progress */}
        <section className="flex flex-col items-center py-4">
          <ProgressRing progress={readinessScore} size={160} strokeWidth={12}>
            <div className="text-center">
              <motion.p className="text-3xl font-bold"
                key={readinessScore}
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring' }}
              >
                {readinessScore}%
              </motion.p>
              <p className="text-xs text-muted-foreground">Placement Ready</p>
            </div>
          </ProgressRing>
          <p className="text-sm text-muted-foreground mt-3">
            {completedToday} of {goodHabits.length} habits completed
          </p>
        </section>

        {/* Stats Grid */}
        <section className="grid grid-cols-2 gap-3">
          <StatCard title="Study Today" value={`${todayStudyHours}h ${todayStudyMins}m`} subtitle="Keep going!" icon={<Clock className="w-5 h-5" />} />
          <StatCard title="Streak" value={`${streak.current} days`} subtitle={`Best: ${streak.longest}`} icon={<Flame className="w-5 h-5" />} variant="success" />
          <StatCard title="Tasks Done" value={`${taskStats.completed}/${taskStats.total}`} subtitle="Total tasks" icon={<ListChecks className="w-5 h-5" />} />
          <StatCard title="Readiness" value={`${readinessScore}%`} subtitle="Placement score" icon={<Zap className="w-5 h-5" />} variant="primary" />
        </section>

        {/* DSA Progress */}
        <section className="bg-card border border-border rounded-2xl p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold flex items-center gap-2">
              <Code2 className="w-5 h-5 text-primary" />
              DSA Progress
            </h2>
            <span className="text-sm text-muted-foreground">{masteredTopics}/{dsaTopics.length} topics</span>
          </div>
          <div className="h-3 bg-muted rounded-full overflow-hidden mb-3">
            <div className="h-full gradient-primary rounded-full transition-all duration-500" style={{ width: `${dsaProgress}%` }} />
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
          <Link to="/tasks" className="bg-card border border-border rounded-2xl p-4 flex items-center gap-3 hover:border-primary/50 transition-colors">
            <div className="p-2 rounded-xl gradient-primary"><ListChecks className="w-5 h-5 text-primary-foreground" /></div>
            <div><p className="font-medium text-sm">Tasks</p><p className="text-xs text-muted-foreground">Track tasks</p></div>
          </Link>
          <Link to="/leetcode" className="bg-card border border-border rounded-2xl p-4 flex items-center gap-3 hover:border-primary/50 transition-colors">
            <div className="p-2 rounded-xl gradient-success"><Terminal className="w-5 h-5 text-success-foreground" /></div>
            <div><p className="font-medium text-sm">LeetCode</p><p className="text-xs text-muted-foreground">Track progress</p></div>
          </Link>
          <Link to="/company-readiness" className="bg-card border border-border rounded-2xl p-4 flex items-center gap-3 hover:border-primary/50 transition-colors">
            <div className="p-2 rounded-xl bg-warning/20"><Building2 className="w-5 h-5 text-warning" /></div>
            <div><p className="font-medium text-sm">Companies</p><p className="text-xs text-muted-foreground">Readiness</p></div>
          </Link>
          <Link to="/timer" className="bg-card border border-border rounded-2xl p-4 flex items-center gap-3 hover:border-primary/50 transition-colors">
            <div className="p-2 rounded-xl bg-destructive/20"><Clock className="w-5 h-5 text-destructive" /></div>
            <div><p className="font-medium text-sm">Timer</p><p className="text-xs text-muted-foreground">Study time</p></div>
          </Link>
        </section>
      </main>
    </div>
  );
}
