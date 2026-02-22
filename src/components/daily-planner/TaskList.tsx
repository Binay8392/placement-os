import { useState, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, arrayMove,
} from '@dnd-kit/sortable';
import { TaskItem } from './TaskItem';
import { Button } from '@/components/ui/button';
import { ListFilter, Trash2 } from 'lucide-react';
import type { DailyTask } from '@/hooks/useDailyTasks';

type Filter = 'all' | 'active' | 'completed';

interface TaskListProps {
  tasks: DailyTask[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
  onClearCompleted: () => void;
  onReorder: (tasks: DailyTask[]) => void;
}

export function TaskList({ tasks, onToggle, onDelete, onEdit, onClearCompleted, onReorder }: TaskListProps) {
  const [filter, setFilter] = useState<Filter>('all');

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const filtered = useMemo(() => {
    if (filter === 'active') return tasks.filter(t => !t.completed);
    if (filter === 'completed') return tasks.filter(t => t.completed);
    return tasks;
  }, [tasks, filter]);

  const completedCount = tasks.filter(t => t.completed).length;

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = tasks.findIndex(t => t.id === active.id);
      const newIndex = tasks.findIndex(t => t.id === over.id);
      onReorder(arrayMove(tasks, oldIndex, newIndex));
    }
  }

  const filters: { key: Filter; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'active', label: 'Active' },
    { key: 'completed', label: 'Done' },
  ];

  return (
    <div className="space-y-3">
      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 p-0.5 bg-muted/50 rounded-lg">
          {filters.map(f => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200 ${
                filter === f.key
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        {completedCount > 0 && (
          <Button variant="ghost" size="sm" onClick={onClearCompleted} className="text-xs text-muted-foreground hover:text-destructive">
            <Trash2 className="w-3.5 h-3.5 mr-1" /> Clear Done
          </Button>
        )}
      </div>

      {/* Task list */}
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={filtered.map(t => t.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-2">
            <AnimatePresence mode="popLayout">
              {filtered.map(task => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggle={onToggle}
                  onDelete={onDelete}
                  onEdit={onEdit}
                />
              ))}
            </AnimatePresence>
            {filtered.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12 text-muted-foreground"
              >
                <ListFilter className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p className="text-sm">
                  {filter === 'all' ? 'No tasks yet. Add one to get started!' : `No ${filter} tasks.`}
                </p>
              </motion.div>
            )}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
