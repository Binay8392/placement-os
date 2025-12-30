import { useState } from 'react';
import { useStore, getTodayString } from '@/lib/store';
import { cn } from '@/lib/utils';
import { Check, Plus, Trash2, Flame, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export default function HabitsPage() {
  const { habits, addHabit, toggleHabitCompletion, deleteHabit } = useStore();
  const today = getTodayString();
  const [isOpen, setIsOpen] = useState(false);
  const [newHabitName, setNewHabitName] = useState('');
  const [newHabitType, setNewHabitType] = useState<'good' | 'bad'>('good');

  const goodHabits = habits.filter((h) => h.type === 'good');
  const badHabits = habits.filter((h) => h.type === 'bad');

  const handleAddHabit = () => {
    if (newHabitName.trim()) {
      addHabit({ name: newHabitName.trim(), type: newHabitType });
      setNewHabitName('');
      setIsOpen(false);
    }
  };

  const completedGood = goodHabits.filter((h) => h.completedDates.includes(today)).length;
  const avoidedBad = badHabits.filter((h) => !h.completedDates.includes(today)).length;

  return (
    <div className="min-h-screen pb-24 md:pb-8">
      <header className="px-4 pt-6 pb-4 safe-top">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Habits</h1>
            <p className="text-muted-foreground text-sm">Build consistency every day</p>
          </div>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button size="icon" className="rounded-full gradient-primary">
                <Plus className="w-5 h-5" />
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
                      "flex-1 py-2 rounded-xl border-2 transition-all",
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
                      "flex-1 py-2 rounded-xl border-2 transition-all",
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
      </header>

      <main className="px-4 space-y-6">
        {/* Summary */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-success/10 border border-success/30 rounded-2xl p-4 text-center">
            <p className="text-3xl font-bold text-success">{completedGood}/{goodHabits.length}</p>
            <p className="text-xs text-muted-foreground mt-1">Good habits done</p>
          </div>
          <div className="bg-destructive/10 border border-destructive/30 rounded-2xl p-4 text-center">
            <p className="text-3xl font-bold text-destructive">{avoidedBad}/{badHabits.length}</p>
            <p className="text-xs text-muted-foreground mt-1">Bad habits avoided</p>
          </div>
        </div>

        {/* Good Habits */}
        <section>
          <h2 className="font-semibold mb-3 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-success" />
            Good Habits
          </h2>
          <div className="space-y-2">
            {goodHabits.map((habit) => {
              const isCompleted = habit.completedDates.includes(today);
              return (
                <div
                  key={habit.id}
                  className={cn(
                    "flex items-center gap-3 p-4 rounded-2xl border transition-all",
                    isCompleted
                      ? "bg-success/10 border-success/30"
                      : "bg-card border-border"
                  )}
                >
                  <button
                    onClick={() => toggleHabitCompletion(habit.id, today)}
                    className={cn(
                      "w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all",
                      isCompleted
                        ? "bg-success border-success"
                        : "border-muted-foreground/30 hover:border-success"
                    )}
                  >
                    {isCompleted && <Check className="w-4 h-4 text-success-foreground" />}
                  </button>
                  <div className="flex-1">
                    <p className={cn(
                      "font-medium",
                      isCompleted && "line-through text-muted-foreground"
                    )}>
                      {habit.name}
                    </p>
                    {habit.streak > 0 && (
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                        <Flame className="w-3 h-3 text-warning" />
                        {habit.streak} day streak
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => deleteHabit(habit.id)}
                    className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
            {goodHabits.length === 0 && (
              <p className="text-muted-foreground text-sm text-center py-4">
                No good habits added yet
              </p>
            )}
          </div>
        </section>

        {/* Bad Habits */}
        <section>
          <h2 className="font-semibold mb-3 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-destructive" />
            Bad Habits to Avoid
          </h2>
          <div className="space-y-2">
            {badHabits.map((habit) => {
              const didIt = habit.completedDates.includes(today);
              return (
                <div
                  key={habit.id}
                  className={cn(
                    "flex items-center gap-3 p-4 rounded-2xl border transition-all",
                    didIt
                      ? "bg-destructive/10 border-destructive/30"
                      : "bg-card border-border"
                  )}
                >
                  <button
                    onClick={() => toggleHabitCompletion(habit.id, today)}
                    className={cn(
                      "w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all",
                      didIt
                        ? "bg-destructive border-destructive"
                        : "border-muted-foreground/30 hover:border-destructive"
                    )}
                  >
                    {didIt && <X className="w-4 h-4 text-destructive-foreground" />}
                  </button>
                  <div className="flex-1">
                    <p className="font-medium">{habit.name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {didIt ? "Slipped today" : "Avoided today ✓"}
                    </p>
                  </div>
                  <button
                    onClick={() => deleteHabit(habit.id)}
                    className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
            {badHabits.length === 0 && (
              <p className="text-muted-foreground text-sm text-center py-4">
                No bad habits tracked
              </p>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
