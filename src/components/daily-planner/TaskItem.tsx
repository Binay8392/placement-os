import { motion, AnimatePresence } from 'framer-motion';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Trash2, Pencil, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import type { DailyTask, TaskPriority } from '@/hooks/useDailyTasks';

interface TaskItemProps {
  task: DailyTask;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
}

const priorityConfig: Record<TaskPriority, { label: string; class: string }> = {
  high: { label: 'High', class: 'bg-destructive/15 text-destructive border-destructive/30' },
  medium: { label: 'Med', class: 'bg-warning/15 text-warning border-warning/30' },
  low: { label: 'Low', class: 'bg-primary/15 text-primary border-primary/30' },
};

export function TaskItem({ task, onToggle, onDelete, onEdit }: TaskItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const prio = priorityConfig[task.priority];

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20, height: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className={cn(
        "group flex items-center gap-3 p-3.5 rounded-xl border transition-all duration-200",
        isDragging
          ? "border-primary/40 bg-primary/5 shadow-glow z-50"
          : "border-border/50 bg-card/30 hover:bg-card/60 hover:border-border",
        task.completed && "opacity-60"
      )}
    >
      {/* Drag Handle */}
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing text-muted-foreground/40 hover:text-muted-foreground transition-colors touch-none"
      >
        <GripVertical className="w-4 h-4" />
      </button>

      {/* Checkbox */}
      <button
        onClick={() => onToggle(task.id)}
        className="relative flex-shrink-0"
      >
        <motion.div
          className={cn(
            "w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors",
            task.completed
              ? "bg-success border-success"
              : "border-muted-foreground/30 hover:border-primary"
          )}
          whileTap={{ scale: 0.85 }}
        >
          <AnimatePresence>
            {task.completed && (
              <motion.svg
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                exit={{ pathLength: 0, opacity: 0 }}
                transition={{ duration: 0.25, type: 'spring' }}
                viewBox="0 0 24 24"
                className="w-3 h-3 text-success-foreground"
                fill="none"
                stroke="currentColor"
                strokeWidth={3}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <motion.path d="M5 13l4 4L19 7" />
              </motion.svg>
            )}
          </AnimatePresence>
        </motion.div>
        {/* Green glow pulse on complete */}
        {task.completed && (
          <motion.div
            className="absolute inset-0 rounded-md bg-success/30"
            initial={{ scale: 1, opacity: 0.5 }}
            animate={{ scale: 2, opacity: 0 }}
            transition={{ duration: 0.6 }}
          />
        )}
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className={cn(
          "text-sm font-medium text-foreground transition-all duration-300",
          task.completed && "line-through text-muted-foreground"
        )}>
          {task.title}
        </p>
        {task.description && (
          <p className="text-xs text-muted-foreground mt-0.5 truncate">{task.description}</p>
        )}
      </div>

      {/* Time */}
      {task.time && (
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Clock className="w-3 h-3" />
          {task.time}
        </div>
      )}

      {/* Priority */}
      <Badge variant="outline" className={cn("text-[10px] px-1.5 py-0", prio.class)}>
        {prio.label}
      </Badge>

      {/* Actions */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={() => onEdit(task.id)} className="p-1 rounded-md hover:bg-muted transition-colors">
          <Pencil className="w-3.5 h-3.5 text-muted-foreground" />
        </button>
        <button onClick={() => onDelete(task.id)} className="p-1 rounded-md hover:bg-destructive/10 transition-colors">
          <Trash2 className="w-3.5 h-3.5 text-destructive/70" />
        </button>
      </div>
    </motion.div>
  );
}
