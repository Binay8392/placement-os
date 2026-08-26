import { FileText, Code2, BookOpen, Puzzle, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface DSAResourcesProps {
  sheetUrl?: string;
  codeUrl?: string;
  notesUrl?: string;
  practiceUrl?: string;
  className?: string;
}

export function DSAResources({
  sheetUrl,
  codeUrl,
  notesUrl,
  practiceUrl,
  className,
}: DSAResourcesProps) {
  const hasAnyResource = Boolean(sheetUrl || codeUrl || notesUrl || practiceUrl);

  return (
    <div className={cn('bg-card border border-border rounded-2xl p-4 md:p-5 space-y-3', className)}>
      <h3 className="font-semibold text-sm md:text-base flex items-center gap-2">
        <FileText className="h-4.5 w-4.5 text-primary" /> Lecture Resources & DSA Sheet
      </h3>

      <div className="grid gap-2 sm:grid-cols-2">
        {/* DSA Sheet */}
        {sheetUrl ? (
          <a
            href={sheetUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-xl border border-border bg-background p-3 text-xs md:text-sm font-medium hover:border-primary/50 hover:bg-primary/5 transition-all group"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <FileText className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="truncate font-semibold text-foreground">Open DSA Sheet</p>
              <p className="text-[11px] text-muted-foreground">Love Babbar 450 DSA Sheet</p>
            </div>
            <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
          </a>
        ) : (
          <div className="flex items-center gap-3 rounded-xl border border-dashed border-border bg-muted/30 p-3 text-xs md:text-sm font-medium opacity-70">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
              <FileText className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="truncate font-medium">DSA Sheet</p>
              <p className="text-[11px] text-muted-foreground">Coming soon</p>
            </div>
          </div>
        )}

        {/* Source Code */}
        {codeUrl ? (
          <a
            href={codeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-xl border border-border bg-background p-3 text-xs md:text-sm font-medium hover:border-success/50 hover:bg-success/5 transition-all group"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-success/10 text-success">
              <Code2 className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="truncate font-semibold text-foreground">Source Code</p>
              <p className="text-[11px] text-muted-foreground">GitHub Code Repository</p>
            </div>
            <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-success transition-colors shrink-0" />
          </a>
        ) : null}

        {/* Practice Problems */}
        {practiceUrl ? (
          <a
            href={practiceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-xl border border-border bg-background p-3 text-xs md:text-sm font-medium hover:border-warning/50 hover:bg-warning/5 transition-all group"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-warning/10 text-warning">
              <Puzzle className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="truncate font-semibold text-foreground">Practice Problem</p>
              <p className="text-[11px] text-muted-foreground">LeetCode / CodeStudio</p>
            </div>
            <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-warning transition-colors shrink-0" />
          </a>
        ) : null}

        {/* Notes */}
        {notesUrl ? (
          <a
            href={notesUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-xl border border-border bg-background p-3 text-xs md:text-sm font-medium hover:border-accent/50 hover:bg-accent/5 transition-all group"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
              <BookOpen className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="truncate font-semibold text-foreground">Lecture Notes</p>
              <p className="text-[11px] text-muted-foreground">Handwritten PDF Notes</p>
            </div>
            <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-accent transition-colors shrink-0" />
          </a>
        ) : null}
      </div>
    </div>
  );
}
