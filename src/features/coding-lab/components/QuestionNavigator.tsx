import React from "react";
import { DebuggingProblem, ExecutionStatus } from "../types";
import { CheckCircle2, Circle, XCircle, ChevronRight, HelpCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export type QuestionStatus = "not_started" | "current" | "passed" | "failed" | "attempted";

interface QuestionNavigatorProps {
  problems: DebuggingProblem[];
  currentIndex: number;
  onSelectProblem: (index: number) => void;
  problemStatuses: Record<string, { status: ExecutionStatus; passed: boolean }>;
  title?: string;
  isAssessment?: boolean;
}

export const QuestionNavigator: React.FC<QuestionNavigatorProps> = ({
  problems,
  currentIndex,
  onSelectProblem,
  problemStatuses,
  title = "Questions",
  isAssessment = false,
}) => {
  const passedCount = problems.filter(
    (p) => problemStatuses[p.id]?.passed
  ).length;

  const getStatus = (problem: DebuggingProblem, index: number): QuestionStatus => {
    if (index === currentIndex) return "current";
    const result = problemStatuses[problem.id];
    if (!result) return "not_started";
    if (result.passed) return "passed";
    return "failed";
  };

  const renderStatusIcon = (status: QuestionStatus) => {
    switch (status) {
      case "current":
        return (
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
          </span>
        );
      case "passed":
        return <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />;
      case "failed":
        return <XCircle className="w-4 h-4 text-rose-500 shrink-0" />;
      case "not_started":
      default:
        return <Circle className="w-4 h-4 text-muted-foreground/40 shrink-0" />;
    }
  };

  return (
    <div className="flex flex-col h-full bg-card border-r border-border/50 select-none">
      {/* Header */}
      <div className="p-3 border-b border-border/40">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {title}
          </span>
          <span className="text-xs font-mono font-medium text-primary bg-primary/10 px-2 py-0.5 rounded">
            {passedCount} / {problems.length}
          </span>
        </div>
        {/* Visual Progress Bar */}
        <div className="w-full bg-muted/60 h-1.5 rounded-full mt-2 overflow-hidden">
          <div
            className="bg-primary h-full transition-all duration-300"
            style={{
              width: `${problems.length > 0 ? (passedCount / problems.length) * 100 : 0}%`,
            }}
          />
        </div>
      </div>

      {/* Problem list */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
        {problems.map((problem, index) => {
          const status = getStatus(problem, index);
          const isSelected = index === currentIndex;

          return (
            <button
              key={problem.id}
              onClick={() => onSelectProblem(index)}
              className={`w-full flex items-center justify-between p-2.5 rounded-md text-left transition-all border text-xs ${
                isSelected
                  ? "bg-accent/80 border-primary/40 text-foreground font-medium shadow-xs"
                  : "bg-background/40 hover:bg-muted/50 border-transparent text-muted-foreground"
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-4 flex items-center justify-center">
                  {renderStatusIcon(status)}
                </div>
                <div className="truncate">
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-muted-foreground text-[11px]">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="truncate font-medium text-foreground">
                      {problem.title}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-0.5 text-[10px] text-muted-foreground">
                    <span className="capitalize">{problem.category}</span>
                    <span>•</span>
                    <span
                      className={`font-semibold ${
                        problem.difficulty === "Easy"
                          ? "text-emerald-500"
                          : problem.difficulty === "Medium"
                          ? "text-amber-500"
                          : "text-rose-500"
                      }`}
                    >
                      {problem.difficulty}
                    </span>
                  </div>
                </div>
              </div>

              <ChevronRight
                className={`w-3.5 h-3.5 shrink-0 transition-transform ${
                  isSelected ? "text-primary translate-x-0.5" : "text-muted-foreground/30"
                }`}
              />
            </button>
          );
        })}
      </div>

      {/* Footer Info */}
      <div className="p-3 border-t border-border/40 text-[11px] text-muted-foreground bg-muted/20">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1">
            <HelpCircle className="w-3 h-3 text-muted-foreground/60" />
            <span>Shortcuts</span>
          </span>
          <kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px] font-mono border">
            Ctrl + Enter
          </kbd>
        </div>
      </div>
    </div>
  );
};
