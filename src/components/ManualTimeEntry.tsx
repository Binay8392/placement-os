import { useState } from 'react';
import { useStore, StudySession } from '@/lib/store';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { CalendarIcon, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { toast } from '@/hooks/use-toast';

const categories: { id: StudySession['category']; label: string; color: string }[] = [
  { id: 'dsa', label: 'DSA', color: 'bg-primary' },
  { id: 'aptitude', label: 'Aptitude', color: 'bg-success' },
  { id: 'core-cs', label: 'Core CS', color: 'bg-warning' },
  { id: 'development', label: 'Development', color: 'bg-destructive' },
];

interface ManualTimeEntryProps {
  trigger?: React.ReactNode;
}

export function ManualTimeEntry({ trigger }: ManualTimeEntryProps) {
  const addStudySession = useStore((state) => state.addStudySession);
  
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState<StudySession['category']>('dsa');
  const [hours, setHours] = useState('0');
  const [minutes, setMinutes] = useState('30');
  const [date, setDate] = useState<Date>(new Date());
  const [notes, setNotes] = useState('');

  const resetForm = () => {
    setCategory('dsa');
    setHours('0');
    setMinutes('30');
    setDate(new Date());
    setNotes('');
  };

  const handleSubmit = () => {
    const totalSeconds = (parseInt(hours) || 0) * 3600 + (parseInt(minutes) || 0) * 60;
    
    if (totalSeconds < 60) {
      toast({
        title: "Invalid duration",
        description: "Please enter at least 1 minute.",
        variant: "destructive",
      });
      return;
    }

    const session: StudySession = {
      id: Date.now().toString(),
      category,
      duration: totalSeconds,
      date: format(date, 'yyyy-MM-dd'),
      notes: notes.trim() || undefined,
    };

    addStudySession(session);
    
    toast({
      title: "Session logged! 📝",
      description: `Added ${hours}h ${minutes}m of ${categories.find(c => c.id === category)?.label} study time.`,
    });

    resetForm();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      setOpen(isOpen);
      if (!isOpen) resetForm();
    }}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm" className="gap-2">
            <Plus className="w-4 h-4" />
            Log Time
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Log Study Time</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 pt-2">
          {/* Category Selection */}
          <div>
            <Label className="text-sm text-muted-foreground mb-2 block">Category</Label>
            <div className="grid grid-cols-2 gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.id)}
                  className={cn(
                    "flex items-center gap-2 p-3 rounded-xl border-2 transition-all",
                    category === cat.id
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50"
                  )}
                >
                  <div className={cn("w-3 h-3 rounded-full", cat.color)} />
                  <span className="text-sm font-medium">{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Duration */}
          <div>
            <Label className="text-sm text-muted-foreground mb-2 block">Duration</Label>
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <div className="relative">
                  <Input
                    type="number"
                    min="0"
                    max="23"
                    value={hours}
                    onChange={(e) => setHours(e.target.value)}
                    className="pr-8"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">h</span>
                </div>
              </div>
              <span className="text-muted-foreground">:</span>
              <div className="flex-1">
                <div className="relative">
                  <Input
                    type="number"
                    min="0"
                    max="59"
                    value={minutes}
                    onChange={(e) => setMinutes(e.target.value)}
                    className="pr-8"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">m</span>
                </div>
              </div>
            </div>
          </div>

          {/* Date */}
          <div>
            <Label className="text-sm text-muted-foreground mb-2 block">Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(d) => d && setDate(d)}
                  disabled={(d) => d > new Date()}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Notes */}
          <div>
            <Label className="text-sm text-muted-foreground mb-2 block">Notes (optional)</Label>
            <Textarea
              placeholder="What did you work on?"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
            />
          </div>

          {/* Submit */}
          <Button onClick={handleSubmit} className="w-full gradient-primary">
            Log Session
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
