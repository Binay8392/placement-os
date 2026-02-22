import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useStore, getTodayString } from '@/lib/store';
import { cn } from '@/lib/utils';
import { Check, Plus, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { ProgressBar } from './ProgressBar';

const DAY_LABELS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function formatDateKey(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

export function HabitTrackerGrid() {
  const { habits, addHabit, toggleHabitCompletion, deleteHabit } = useStore();
  const today = getTodayString();
  const todayDate = new Date();

  const [monthOffset, setMonthOffset] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [newHabitName, setNewHabitName] = useState('');
  const [newHabitType, setNewHabitType] = useState<'good' | 'bad'>('good');

  const viewDate = useMemo(() => {
    const d = new Date(todayDate.getFullYear(), todayDate.getMonth() + monthOffset, 1);
    return d;
  }, [monthOffset]);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const monthName = viewDate.toLocaleString('default', { month: 'long' });

  // All habits (good only for tracking grid)
  const goodHabits = habits.filter(h => h.type === 'good');

  // Build day columns
  const days = useMemo(() => {
    return Array.from({ length: daysInMonth }, (_, i) => {
      const day = i + 1;
      const dateKey = formatDateKey(year, month, day);
      const dayOfWeek = new Date(year, month, day).getDay();
      return { day, dateKey, dayLabel: DAY_LABELS[dayOfWeek] };
    });
  }, [year, month, daysInMonth]);

  // Daily progress data
  const dailyProgress = useMemo(() => {
    if (goodHabits.length === 0) return days.map(d => ({ day: d.day, progress: 0 }));
    return days.map(d => {
      const completed = goodHabits.filter(h => h.completedDates.includes(d.dateKey)).length;
      const progress = Math.round((completed / goodHabits.length) * 100);
      return { day: d.day, progress };
    });
  }, [goodHabits, days]);

  // Total completed this month
  const totalCompleted = useMemo(() => {
    return goodHabits.reduce((sum, h) => {
      return sum + h.completedDates.filter(d => d.startsWith(`${year}-${String(month + 1).padStart(2, '0')}`)).length;
    }, 0);
  }, [goodHabits, year, month]);

  const totalPossible = goodHabits.length * daysInMonth;
  const overallProgress = totalPossible > 0 ? Math.round((totalCompleted / totalPossible) * 100) : 0;

  const handleAddHabit = () => {
    if (newHabitName.trim()) {
      addHabit({ name: newHabitName.trim(), type: newHabitType });
      setNewHabitName('');
      setIsOpen(false);
    }
  };

  const isCurrentMonth = monthOffset === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="space-y-5"
    >
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">Habit Tracker</h2>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button size="sm" variant="outline" className="gap-1.5 text-xs">
              <Plus className="w-3.5 h-3.5" /> Add Habit
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Habit</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <Input
                placeholder="Habit name..."
                value={newHabitName}
                onChange={(e) => setNewHabitName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddHabit()}
              />
              <div className="flex gap-2">
                <button
                  onClick={() => setNewHabitType('good')}
                  className={cn(
                    "flex-1 py-2 rounded-xl border-2 text-sm transition-all",
                    newHabitType === 'good'
                      ? "border-success bg-success/10 text-success"
                      : "border-border text-muted-foreground"
                  )}
                >
                  Good Habit
                </button>
                <button
                  onClick={() => setNewHabitType('bad')}
                  className={cn(
                    "flex-1 py-2 rounded-xl border-2 text-sm transition-all",
                    newHabitType === 'bad'
                      ? "border-destructive bg-destructive/10 text-destructive"
                      : "border-border text-muted-foreground"
                  )}
                >
                  Bad Habit
                </button>
              </div>
              <Button onClick={handleAddHabit} className="w-full gradient-primary">
                Add Habit
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Month Navigation + Stats */}
      <div className="rounded-2xl border border-border/50 bg-card/50 backdrop-blur-xl p-4 space-y-4">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="icon" onClick={() => setMonthOffset(m => m - 1)} className="h-8 w-8">
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <div className="text-center">
            <p className="font-semibold text-foreground">{monthName} {year}</p>
          </div>
          <Button
            variant="ghost" size="icon"
            onClick={() => setMonthOffset(m => m + 1)}
            disabled={isCurrentMonth}
            className="h-8 w-8"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        {/* Summary row */}
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="rounded-xl bg-muted/30 p-2.5">
            <p className="text-xs text-muted-foreground">Habits</p>
            <p className="text-lg font-bold text-foreground">{goodHabits.length}</p>
          </div>
          <div className="rounded-xl bg-muted/30 p-2.5">
            <p className="text-xs text-muted-foreground">Completed</p>
            <p className="text-lg font-bold text-success">{totalCompleted}</p>
          </div>
          <div className="rounded-xl bg-muted/30 p-2.5">
            <p className="text-xs text-muted-foreground">Progress</p>
            <div className="mt-1">
              <ProgressBar percent={overallProgress} />
            </div>
          </div>
        </div>

        {/* Grid */}
        {goodHabits.length > 0 ? (
          <div className="overflow-x-auto no-scrollbar -mx-2 px-2">
            <table className="w-full text-xs border-collapse min-w-[600px]">
              <thead>
                <tr>
                  <th className="text-left py-1.5 pr-3 text-muted-foreground font-medium sticky left-0 bg-card/80 backdrop-blur-sm z-10 min-w-[120px]">
                    My Habits
                  </th>
                  {days.map(d => {
                    const isToday = d.dateKey === today;
                    return (
                      <th
                        key={d.day}
                        className={cn(
                          "text-center py-1.5 px-0.5 font-normal min-w-[28px]",
                          isToday ? "text-primary font-semibold" : "text-muted-foreground"
                        )}
                      >
                        <div className="leading-tight">{d.dayLabel}</div>
                        <div className={cn("leading-tight", isToday && "bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center mx-auto")}>
                          {d.day}
                        </div>
                      </th>
                    );
                  })}
                  <th className="w-8" />
                </tr>
              </thead>
              <tbody>
                {goodHabits.map(habit => (
                  <tr key={habit.id} className="group">
                    <td className="py-1 pr-3 font-medium text-foreground sticky left-0 bg-card/80 backdrop-blur-sm z-10 truncate max-w-[120px]">
                      {habit.name}
                    </td>
                    {days.map(d => {
                      const checked = habit.completedDates.includes(d.dateKey);
                      const isFuture = d.dateKey > today;
                      return (
                        <td key={d.day} className="text-center py-1 px-0.5">
                          <button
                            disabled={isFuture}
                            onClick={() => toggleHabitCompletion(habit.id, d.dateKey)}
                            className={cn(
                              "w-5 h-5 rounded border inline-flex items-center justify-center transition-all duration-150",
                              checked
                                ? "bg-success border-success text-success-foreground"
                                : isFuture
                                  ? "border-border/30 cursor-not-allowed opacity-30"
                                  : "border-border/50 hover:border-primary/50 hover:bg-primary/5"
                            )}
                          >
                            {checked && <Check className="w-3 h-3" />}
                          </button>
                        </td>
                      );
                    })}
                    <td className="py-1 pl-1">
                      <button
                        onClick={() => deleteHabit(habit.id)}
                        className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all p-0.5"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                ))}
                {/* Daily Progress Row */}
                <tr className="border-t border-border/30">
                  <td className="py-1.5 pr-3 text-muted-foreground font-medium sticky left-0 bg-card/80 backdrop-blur-sm z-10">
                    Progress
                  </td>
                  {dailyProgress.map(d => (
                    <td key={d.day} className={cn(
                      "text-center py-1.5 px-0.5 font-medium",
                      d.progress === 100 ? "text-success" : d.progress > 0 ? "text-warning" : "text-muted-foreground/40"
                    )}>
                      {d.progress}%
                    </td>
                  ))}
                  <td />
                </tr>
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground text-sm">
            No habits yet. Add one to start tracking!
          </div>
        )}
      </div>

      {/* Area Chart */}
      {goodHabits.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="rounded-2xl border border-border/50 bg-card/50 backdrop-blur-xl p-4"
        >
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">Daily Completion Rate</p>
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={dailyProgress} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
              <defs>
                <linearGradient id="habitGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--success))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--success))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="day"
                tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                axisLine={false}
                tickLine={false}
                interval="preserveStartEnd"
              />
              <YAxis
                tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                axisLine={false}
                tickLine={false}
                domain={[0, 100]}
                tickFormatter={v => `${v}%`}
              />
              <Tooltip
                contentStyle={{
                  background: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
                formatter={(value: number) => [`${value}%`, 'Progress']}
                labelFormatter={(label) => `Day ${label}`}
              />
              <Area
                type="monotone"
                dataKey="progress"
                stroke="hsl(var(--success))"
                strokeWidth={2}
                fill="url(#habitGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>
      )}
    </motion.div>
  );
}
