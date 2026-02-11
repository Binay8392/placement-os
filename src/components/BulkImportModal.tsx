import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Upload } from 'lucide-react';
import { useStore, type TaskCategory, type TaskDifficulty, type TaskSource, getTodayString } from '@/lib/store';
import { toast } from 'sonner';

const validCategories: TaskCategory[] = ['Coding', 'Aptitude', 'CS Fundamentals', 'Interview', 'Project', 'Other'];
const validDifficulties: TaskDifficulty[] = ['Easy', 'Medium', 'Hard'];
const validSources: TaskSource[] = ['LeetCode', 'HackerRank', 'PrepInsta', 'Custom'];

function matchEnum<T extends string>(value: string, options: T[], fallback: T): T {
  const lower = value.trim().toLowerCase();
  return options.find(o => o.toLowerCase() === lower) ?? fallback;
}

export default function BulkImportModal() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const addTrackedTask = useStore(s => s.addTrackedTask);

  const handleImport = () => {
    const lines = input.split('\n').map(l => l.trim()).filter(Boolean);
    if (lines.length === 0) {
      toast.error('No tasks to import');
      return;
    }

    let count = 0;
    for (const line of lines) {
      const parts = line.split('-').map(p => p.trim()).filter(Boolean);
      const name = parts[0] || line;
      const category = parts[1] ? matchEnum(parts[1], validCategories, 'Coding') : 'Coding';
      const difficulty = parts[2] ? matchEnum(parts[2], validDifficulties, 'Easy') : 'Easy';
      const source = parts[3] ? matchEnum(parts[3], validSources, 'Custom') : 'Custom';

      addTrackedTask({
        name,
        category,
        difficulty,
        source,
        dateAdded: getTodayString(),
        status: 'Pending',
      });
      count++;
    }

    toast.success(`${count} task${count > 1 ? 's' : ''} imported successfully`);
    setInput('');
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="gap-1">
          <Upload className="w-4 h-4" /> Bulk Import
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Bulk Import Tasks</DialogTitle>
        </DialogHeader>
        <p className="text-xs text-muted-foreground">
          Paste one task per line using the format: <span className="font-mono">Name - Category - Difficulty - Source</span>
        </p>
        <Textarea
          rows={8}
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder={`Solve Two Sum - Coding - Easy - LeetCode\nLearn OOPs Concepts - CS Fundamentals - Easy - Custom\nPractice Percentage Problems - Aptitude - Medium - PrepInsta`}
        />
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleImport}>Import Tasks</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
