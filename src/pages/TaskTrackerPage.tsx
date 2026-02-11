import { useState, useMemo } from 'react';
import { useStore, type TrackedTask, type TaskCategory, type TaskDifficulty, type TaskSource, type TaskStatus, getTodayString } from '@/lib/store';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Edit3, Check, X, Filter, ArrowUpDown, ListChecks } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

const categories: TaskCategory[] = ['Coding', 'Aptitude', 'CS Fundamentals', 'Interview', 'Project', 'Other'];
const difficulties: TaskDifficulty[] = ['Easy', 'Medium', 'Hard'];
const sources: TaskSource[] = ['LeetCode', 'HackerRank', 'PrepInsta', 'Custom'];

type SortOption = 'newest' | 'oldest' | 'difficulty';

export default function TaskTrackerPage() {
  const { trackedTasks, addTrackedTask, updateTrackedTask, deleteTrackedTask, toggleTaskStatus } = useStore();
  
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<TrackedTask | null>(null);
  const [taskName, setTaskName] = useState('');
  const [category, setCategory] = useState<TaskCategory>('Coding');
  const [difficulty, setDifficulty] = useState<TaskDifficulty>('Easy');
  const [source, setSource] = useState<TaskSource>('LeetCode');
  
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterDifficulty, setFilterDifficulty] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<SortOption>('newest');

  const filteredTasks = useMemo(() => {
    let tasks = [...trackedTasks];
    
    if (filterCategory !== 'all') tasks = tasks.filter(t => t.category === filterCategory);
    if (filterDifficulty !== 'all') tasks = tasks.filter(t => t.difficulty === filterDifficulty);
    if (filterStatus !== 'all') tasks = tasks.filter(t => t.status === filterStatus);
    
    tasks.sort((a, b) => {
      if (sortBy === 'newest') return b.dateAdded.localeCompare(a.dateAdded);
      if (sortBy === 'oldest') return a.dateAdded.localeCompare(b.dateAdded);
      const diffOrder = { Easy: 1, Medium: 2, Hard: 3 };
      return diffOrder[a.difficulty] - diffOrder[b.difficulty];
    });
    
    return tasks;
  }, [trackedTasks, filterCategory, filterDifficulty, filterStatus, sortBy]);

  const stats = useMemo(() => {
    const total = trackedTasks.length;
    const completed = trackedTasks.filter(t => t.status === 'Completed').length;
    const pending = total - completed;
    return { total, completed, pending, percentage: total > 0 ? Math.round((completed / total) * 100) : 0 };
  }, [trackedTasks]);

  const handleSubmit = () => {
    if (!taskName.trim()) return;
    
    if (editingTask) {
      updateTrackedTask(editingTask.id, { name: taskName, category, difficulty, source });
    } else {
      addTrackedTask({
        name: taskName,
        category,
        difficulty,
        source,
        dateAdded: getTodayString(),
        status: 'Pending',
      });
    }
    
    resetForm();
    setDialogOpen(false);
  };

  const resetForm = () => {
    setTaskName('');
    setCategory('Coding');
    setDifficulty('Easy');
    setSource('LeetCode');
    setEditingTask(null);
  };

  const startEdit = (task: TrackedTask) => {
    setEditingTask(task);
    setTaskName(task.name);
    setCategory(task.category);
    setDifficulty(task.difficulty);
    setSource(task.source);
    setDialogOpen(true);
  };

  const difficultyColor = (d: TaskDifficulty) => {
    if (d === 'Easy') return 'bg-success/20 text-success border-success/30';
    if (d === 'Medium') return 'bg-warning/20 text-warning border-warning/30';
    return 'bg-destructive/20 text-destructive border-destructive/30';
  };

  return (
    <div className="min-h-screen pb-24 md:pb-8">
      <header className="px-4 pt-6 pb-4 safe-top">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <ListChecks className="w-6 h-6 text-primary" />
              Task Tracker
            </h1>
            <p className="text-muted-foreground text-sm">Track your placement preparation tasks</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-1">
                <Plus className="w-4 h-4" /> Add Task
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingTask ? 'Edit Task' : 'Add New Task'}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-2">
                <div>
                  <Label>Task Name</Label>
                  <Input value={taskName} onChange={(e) => setTaskName(e.target.value)} placeholder="e.g., Two Sum - LeetCode" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Category</Label>
                    <Select value={category} onValueChange={(v) => setCategory(v as TaskCategory)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Difficulty</Label>
                    <Select value={difficulty} onValueChange={(v) => setDifficulty(v as TaskDifficulty)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {difficulties.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label>Source</Label>
                  <Select value={source} onValueChange={(v) => setSource(v as TaskSource)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {sources.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleSubmit} className="w-full">
                  {editingTask ? 'Update Task' : 'Add Task'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      <main className="px-4 space-y-4">
        {/* Stats Row */}
        <div className="grid grid-cols-4 gap-2">
          {[
            { label: 'Total', value: stats.total, color: 'text-foreground' },
            { label: 'Done', value: stats.completed, color: 'text-success' },
            { label: 'Pending', value: stats.pending, color: 'text-warning' },
            { label: 'Rate', value: `${stats.percentage}%`, color: 'text-primary' },
          ].map(s => (
            <motion.div key={s.label} initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              className="glass-card border border-border rounded-xl p-3 text-center">
              <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{s.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-[130px] h-8 text-xs shrink-0">
              <Filter className="w-3 h-3 mr-1" /><SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={filterDifficulty} onValueChange={setFilterDifficulty}>
            <SelectTrigger className="w-[120px] h-8 text-xs shrink-0">
              <SelectValue placeholder="Difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              {difficulties.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[110px] h-8 text-xs shrink-0">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
            <SelectTrigger className="w-[110px] h-8 text-xs shrink-0">
              <ArrowUpDown className="w-3 h-3 mr-1" /><SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="oldest">Oldest</SelectItem>
              <SelectItem value="difficulty">Difficulty</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Task List */}
        <div className="space-y-2">
          <AnimatePresence>
            {filteredTasks.length === 0 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="text-center py-12 text-muted-foreground">
                <ListChecks className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>No tasks yet. Add your first task!</p>
              </motion.div>
            )}
            {filteredTasks.map((task, i) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ delay: i * 0.03 }}
                className="glass-card border border-border rounded-xl p-3 flex items-start gap-3 group"
              >
                <Checkbox
                  checked={task.status === 'Completed'}
                  onCheckedChange={() => toggleTaskStatus(task.id)}
                  className="mt-1"
                />
                <div className="flex-1 min-w-0">
                  <p className={`font-medium text-sm truncate ${task.status === 'Completed' ? 'line-through text-muted-foreground' : ''}`}>
                    {task.name}
                  </p>
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    <Badge variant="outline" className="text-[10px] px-1.5 py-0">{task.category}</Badge>
                    <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${difficultyColor(task.difficulty)}`}>{task.difficulty}</Badge>
                    <Badge variant="outline" className="text-[10px] px-1.5 py-0">{task.source}</Badge>
                  </div>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                  <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => startEdit(task)}>
                    <Edit3 className="w-3.5 h-3.5" />
                  </Button>
                  <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive" onClick={() => deleteTrackedTask(task.id)}>
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
