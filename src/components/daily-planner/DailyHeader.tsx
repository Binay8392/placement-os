import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { CalendarDays } from 'lucide-react';
import { useMemo } from 'react';

const quotes = [
  "Small daily improvements lead to stunning results.",
  "Focus on progress, not perfection.",
  "Discipline is choosing between what you want now and what you want most.",
  "The secret of getting ahead is getting started.",
  "Success is the sum of small efforts repeated daily.",
  "Don't watch the clock; do what it does. Keep going.",
  "Your future is created by what you do today.",
  "Consistency beats intensity every single time.",
];

export function DailyHeader() {
  const today = new Date();
  const quote = useMemo(() => {
    const idx = today.getDate() % quotes.length;
    return quotes[idx];
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-2"
    >
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20">
          <CalendarDays className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">
            Daily Planner
          </h1>
          <p className="text-sm text-muted-foreground">
            {format(today, 'EEEE, MMMM d, yyyy')}
          </p>
        </div>
      </div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-sm text-muted-foreground italic pl-1 border-l-2 border-primary/30 ml-1"
      >
        "{quote}"
      </motion.p>
    </motion.div>
  );
}
