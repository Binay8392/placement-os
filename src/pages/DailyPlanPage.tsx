import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useDailyTasks } from '@/hooks/useDailyTasks';
import { DailyHeader } from '@/components/daily-planner/DailyHeader';
import { StatsCards } from '@/components/daily-planner/StatsCards';
import { ProgressBar } from '@/components/daily-planner/ProgressBar';
import { TaskList } from '@/components/daily-planner/TaskList';
import { AddTaskModal } from '@/components/daily-planner/AddTaskModal';
import type { DailyTask } from '@/hooks/useDailyTasks';

export default function DailyPlanPage() {
  const {
    tasks, addTask, toggleTask, deleteTask, editTask, clearCompleted, reorderTasks,
    completedCount, totalCount, progressPercent, focusScore, streak, allCompleted,
  } = useDailyTasks();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<DailyTask | null>(null);
  const [confettiFired, setConfettiFired] = useState(false);

  // Confetti on 100%
  useEffect(() => {
    if (allCompleted && !confettiFired && totalCount > 0) {
      setConfettiFired(true);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#6366f1', '#22c55e', '#f59e0b', '#3b82f6'],
      });
    }
    if (!allCompleted) setConfettiFired(false);
  }, [allCompleted, totalCount]);

  const handleEdit = useCallback((id: string) => {
    const task = tasks.find(t => t.id === id);
    if (task) {
      setEditingTask(task);
      setModalOpen(true);
    }
  }, [tasks]);

  const handleModalClose = useCallback((open: boolean) => {
    setModalOpen(open);
    if (!open) setEditingTask(null);
  }, []);

  return (
    <div className="min-h-screen pb-24 md:pb-8">
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        <DailyHeader />

        <StatsCards
          completedCount={completedCount}
          totalCount={totalCount}
          progressPercent={progressPercent}
          streak={streak}
          focusScore={focusScore}
        />

        {/* Progress bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="space-y-1.5"
        >
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Today's Progress</span>
            <span>{progressPercent}%</span>
          </div>
          <ProgressBar percent={progressPercent} />
        </motion.div>

        {/* Tasks */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <TaskList
            tasks={tasks}
            onToggle={toggleTask}
            onDelete={deleteTask}
            onEdit={handleEdit}
            onClearCompleted={clearCompleted}
            onReorder={reorderTasks}
          />
        </motion.div>
      </div>

      <AddTaskModal
        open={modalOpen}
        onOpenChange={handleModalClose}
        onAdd={addTask}
        editTask={editingTask}
        onSaveEdit={editTask}
      />
    </div>
  );
}
