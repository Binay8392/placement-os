import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { DailyTask, TaskPriority } from '@/hooks/useDailyTasks';

interface AddTaskModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (task: Omit<DailyTask, 'id' | 'completed' | 'order'>) => void;
  editTask?: DailyTask | null;
  onSaveEdit?: (id: string, updates: Partial<DailyTask>) => void;
}

export function AddTaskModal({ open, onOpenChange, onAdd, editTask, onSaveEdit }: AddTaskModalProps) {
  const [title, setTitle] = useState(editTask?.title || '');
  const [description, setDescription] = useState(editTask?.description || '');
  const [time, setTime] = useState(editTask?.time || '');
  const [priority, setPriority] = useState<TaskPriority>(editTask?.priority || 'medium');

  // Reset form when editTask changes
  useState(() => {
    if (editTask) {
      setTitle(editTask.title);
      setDescription(editTask.description || '');
      setTime(editTask.time || '');
      setPriority(editTask.priority);
    } else {
      setTitle('');
      setDescription('');
      setTime('');
      setPriority('medium');
    }
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;

    if (editTask && onSaveEdit) {
      onSaveEdit(editTask.id, { title: title.trim(), description: description.trim() || undefined, time: time || undefined, priority });
    } else {
      onAdd({ title: title.trim(), description: description.trim() || undefined, time: time || undefined, priority });
    }

    setTitle('');
    setDescription('');
    setTime('');
    setPriority('medium');
    onOpenChange(false);
  }

  return (
    <>
      {/* FAB */}
      {!open && (
        <motion.button
          onClick={() => onOpenChange(true)}
          className="fixed bottom-20 md:bottom-8 right-6 z-40 p-4 rounded-full gradient-primary text-primary-foreground shadow-glow"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
          <Plus className="w-6 h-6" />
        </motion.button>
      )}

      {/* Modal */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-background/60 backdrop-blur-sm"
              onClick={() => onOpenChange(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 100, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 100, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed bottom-0 left-0 right-0 md:bottom-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 z-50 w-full md:max-w-md"
            >
              <div className="bg-card/95 backdrop-blur-xl border border-border/50 rounded-t-2xl md:rounded-2xl p-6 shadow-lg">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-lg font-semibold text-foreground">
                    {editTask ? 'Edit Task' : 'Add Task'}
                  </h2>
                  <button onClick={() => onOpenChange(false)} className="p-1.5 rounded-lg hover:bg-muted transition-colors">
                    <X className="w-5 h-5 text-muted-foreground" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label className="text-xs text-muted-foreground">Title *</Label>
                    <Input
                      value={title}
                      onChange={e => setTitle(e.target.value)}
                      placeholder="What needs to be done?"
                      className="mt-1 bg-muted/30 border-border/50"
                      autoFocus
                    />
                  </div>

                  <div>
                    <Label className="text-xs text-muted-foreground">Description</Label>
                    <Textarea
                      value={description}
                      onChange={e => setDescription(e.target.value)}
                      placeholder="Optional details..."
                      className="mt-1 bg-muted/30 border-border/50 min-h-[60px]"
                      rows={2}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-xs text-muted-foreground">Time</Label>
                      <Input
                        type="time"
                        value={time}
                        onChange={e => setTime(e.target.value)}
                        className="mt-1 bg-muted/30 border-border/50"
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Priority</Label>
                      <Select value={priority} onValueChange={(v) => setPriority(v as TaskPriority)}>
                        <SelectTrigger className="mt-1 bg-muted/30 border-border/50">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Button type="submit" className="w-full gradient-primary text-primary-foreground" disabled={!title.trim()}>
                    {editTask ? 'Save Changes' : 'Add Task'}
                  </Button>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
