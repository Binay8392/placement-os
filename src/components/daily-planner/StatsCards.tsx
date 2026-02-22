import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { Flame, Zap, CheckCircle2 } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { ProgressRing } from '@/components/ProgressRing';

interface StatsCardsProps {
  completedCount: number;
  totalCount: number;
  progressPercent: number;
  streak: number;
  focusScore: number;
}

function AnimatedCounter({ value, duration = 0.8 }: { value: number; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const prev = useRef(0);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const from = prev.current;
    const to = value;
    prev.current = value;

    const start = performance.now();
    const step = (now: number) => {
      const elapsed = Math.min((now - start) / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - elapsed, 3);
      node.textContent = Math.round(from + (to - from) * eased).toString();
      if (elapsed < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [value, duration]);

  return <span ref={ref}>0</span>;
}

const cardClass =
  "relative overflow-hidden rounded-2xl border border-border/50 bg-card/50 backdrop-blur-xl p-5 shadow-md hover:shadow-glow transition-all duration-300 group";

export function StatsCards({ completedCount, totalCount, progressPercent, streak, focusScore }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {/* Progress Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className={cardClass}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="flex items-center gap-4">
          <ProgressRing progress={progressPercent} size={72} strokeWidth={6}>
            <div className="text-center">
              <span className="text-lg font-bold text-foreground">
                <AnimatedCounter value={progressPercent} />
              </span>
              <span className="text-xs text-muted-foreground">%</span>
            </div>
          </ProgressRing>
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Progress</p>
            <p className="text-lg font-semibold text-foreground">
              {completedCount} / {totalCount}
            </p>
            <p className="text-xs text-muted-foreground">Tasks Done</p>
          </div>
        </div>
      </motion.div>

      {/* Streak Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className={cardClass}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-warning/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="flex items-center gap-4">
          <div className="relative">
            <motion.div
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
              className="p-3 rounded-2xl bg-warning/10 border border-warning/20"
            >
              <Flame className="w-8 h-8 text-warning" />
            </motion.div>
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Streak</p>
            <p className="text-2xl font-bold text-foreground">
              <AnimatedCounter value={streak} />
            </p>
            <p className="text-xs text-muted-foreground">Day{streak !== 1 ? 's' : ''} Strong</p>
          </div>
        </div>
      </motion.div>

      {/* Focus Score Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className={cardClass}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-success/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-success/10 border border-success/20">
            <Zap className="w-8 h-8 text-success" />
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Focus Score</p>
            <p className="text-2xl font-bold text-foreground">
              <AnimatedCounter value={focusScore} />
            </p>
            <p className="text-xs text-muted-foreground">/ 100</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
