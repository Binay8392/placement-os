import { motion } from 'framer-motion';

interface ProgressBarProps {
  percent: number;
}

export function ProgressBar({ percent }: ProgressBarProps) {
  return (
    <div className="relative w-full h-2.5 rounded-full bg-muted/50 overflow-hidden">
      <motion.div
        className="absolute inset-y-0 left-0 rounded-full"
        style={{
          background: 'linear-gradient(90deg, hsl(var(--primary)), hsl(270 80% 60%))',
        }}
        initial={{ width: 0 }}
        animate={{ width: `${percent}%` }}
        transition={{ type: 'spring', stiffness: 80, damping: 20 }}
      />
      {/* Glow edge */}
      {percent > 0 && percent < 100 && (
        <motion.div
          className="absolute inset-y-0 w-4 rounded-full blur-sm"
          style={{
            background: 'hsl(var(--primary) / 0.6)',
            left: `calc(${percent}% - 8px)`,
          }}
          animate={{ opacity: [0.4, 0.8, 0.4] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        />
      )}
    </div>
  );
}
