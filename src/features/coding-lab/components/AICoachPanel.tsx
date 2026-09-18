import React, { useState } from "react";
import {
  DebuggingProblem,
  Language,
  AssessmentMode,
  AICoachAction,
  AICoachResponse,
  TestCaseResult,
} from "../types";
import { aiCoachService } from "../services/aiCoachService";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  Lightbulb,
  Bug,
  CheckSquare,
  Zap,
  BookOpen,
  Gauge,
  FlaskConical,
  Lock,
  RotateCcw,
} from "lucide-react";
import ReactMarkdown from "react-markdown";

interface AICoachPanelProps {
  problem: DebuggingProblem;
  code: string;
  language: Language;
  mode: AssessmentMode;
  compilerOutput?: string;
  failedTest?: TestCaseResult;
  onOpenGenerateModal?: () => void;
}

export const AICoachPanel: React.FC<AICoachPanelProps> = ({
  problem,
  code,
  language,
  mode,
  compilerOutput,
  failedTest,
  onOpenGenerateModal,
}) => {
  const [loadingAction, setLoadingAction] = useState<AICoachAction | null>(null);
  const [response, setResponse] = useState<AICoachResponse | null>(null);
  const [hintLevel, setHintLevel] = useState<number>(1);

  const isAssessment = mode === "assessment";

  const handleAction = async (action: AICoachAction) => {
    if (isAssessment) return;

    if (action === "generate" && onOpenGenerateModal) {
      onOpenGenerateModal();
      return;
    }

    setLoadingAction(action);
    try {
      const currentLevel = action === "hint" ? hintLevel : undefined;
      const res = await aiCoachService.requestAdvice({
        action,
        problem,
        code,
        language,
        mode,
        hintLevel: currentLevel,
        compilerOutput,
        failedTest,
      });

      setResponse(res);

      if (action === "hint") {
        setHintLevel((prev) => (prev >= 3 ? 1 : prev + 1));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingAction(null);
    }
  };

  const handleResetHints = () => {
    setHintLevel(1);
    setResponse(null);
  };

  return (
    <div className="flex flex-col h-full bg-card border-l border-border/40 text-foreground overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-border/40 bg-muted/20 select-none">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-md bg-primary/10 text-primary">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-semibold">PrepTrack AI Coding Coach</div>
            <div className="text-[10px] text-muted-foreground">
              {isAssessment
                ? "Disabled in Assessment"
                : mode === "interview"
                ? "Interview Assistance Mode"
                : "Real-time Guided Learning"}
            </div>
          </div>
        </div>

        {hintLevel > 1 && !isAssessment && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleResetHints}
            className="h-6 px-2 text-[10px] text-muted-foreground"
            title="Reset hint counter"
          >
            <RotateCcw className="w-3 h-3 mr-1" />
            Reset Hints
          </Button>
        )}
      </div>

      {/* Assessment Mode Notice */}
      {isAssessment ? (
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-muted-foreground space-y-3">
          <div className="w-12 h-12 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-500">
            <Lock className="w-6 h-6" />
          </div>
          <h4 className="font-semibold text-foreground text-sm">
            AI Assistance Disabled
          </h4>
          <p className="text-xs max-w-xs text-muted-foreground/80 leading-relaxed">
            PrepTrack AI Coding Coach is locked during Assessment Mode to maintain examination
            integrity and simulate real technical interviews.
          </p>
          <div className="px-3 py-1.5 rounded bg-muted/40 text-[11px] font-mono border border-border/40">
            Policy: Strict Proctor Simulation
          </div>
        </div>
      ) : (
        <>
          {/* Action Buttons Grid */}
          <div className="p-3 border-b border-border/40 grid grid-cols-2 sm:grid-cols-4 gap-1.5 bg-background/50">
            <Button
              variant="outline"
              size="sm"
              disabled={Boolean(loadingAction)}
              onClick={() => handleAction("hint")}
              className="h-8 text-xs font-medium justify-start px-2 bg-card hover:bg-accent"
            >
              <Lightbulb className="w-3.5 h-3.5 mr-1.5 text-amber-500 shrink-0" />
              <span>Hint {hintLevel <= 3 ? `(${hintLevel}/3)` : ""}</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              disabled={Boolean(loadingAction)}
              onClick={() => handleAction("debug")}
              className="h-8 text-xs font-medium justify-start px-2 bg-card hover:bg-accent"
            >
              <Bug className="w-3.5 h-3.5 mr-1.5 text-rose-500 shrink-0" />
              <span>Debug</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              disabled={Boolean(loadingAction)}
              onClick={() => handleAction("review")}
              className="h-8 text-xs font-medium justify-start px-2 bg-card hover:bg-accent"
            >
              <CheckSquare className="w-3.5 h-3.5 mr-1.5 text-emerald-500 shrink-0" />
              <span>Review</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              disabled={Boolean(loadingAction)}
              onClick={() => handleAction("optimize")}
              className="h-8 text-xs font-medium justify-start px-2 bg-card hover:bg-accent"
            >
              <Zap className="w-3.5 h-3.5 mr-1.5 text-cyan-500 shrink-0" />
              <span>Optimize</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              disabled={Boolean(loadingAction)}
              onClick={() => handleAction("explain")}
              className="h-8 text-xs font-medium justify-start px-2 bg-card hover:bg-accent"
            >
              <BookOpen className="w-3.5 h-3.5 mr-1.5 text-blue-500 shrink-0" />
              <span>Explain</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              disabled={Boolean(loadingAction)}
              onClick={() => handleAction("complexity")}
              className="h-8 text-xs font-medium justify-start px-2 bg-card hover:bg-accent"
            >
              <Gauge className="w-3.5 h-3.5 mr-1.5 text-indigo-500 shrink-0" />
              <span>Complexity</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              disabled={Boolean(loadingAction)}
              onClick={() => handleAction("testcases")}
              className="h-8 text-xs font-medium justify-start px-2 bg-card hover:bg-accent"
            >
              <FlaskConical className="w-3.5 h-3.5 mr-1.5 text-violet-500 shrink-0" />
              <span>Test Cases</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              disabled={Boolean(loadingAction)}
              onClick={() => handleAction("generate")}
              className="h-8 text-xs font-medium justify-start px-2 bg-primary/10 text-primary border-primary/30 hover:bg-primary/20"
            >
              <Sparkles className="w-3.5 h-3.5 mr-1.5 shrink-0" />
              <span>Generate</span>
            </Button>
          </div>

          {/* Response / Markdown Display Area */}
          <div className="flex-1 overflow-y-auto p-3 text-xs leading-relaxed">
            {loadingAction ? (
              <div className="flex flex-col items-center justify-center h-48 text-muted-foreground gap-2">
                <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                <span className="font-mono text-[11px]">
                  Analyzing {problem.title} with AI Coach...
                </span>
              </div>
            ) : response ? (
              <div className="prose prose-xs dark:prose-invert max-w-none text-xs space-y-2">
                <ReactMarkdown>{response.content}</ReactMarkdown>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-48 text-muted-foreground text-center p-4">
                <Sparkles className="w-8 h-8 text-muted-foreground/30 mb-2" />
                <p className="font-medium text-foreground text-xs">Ready to assist your coding session</p>
                <p className="text-[11px] text-muted-foreground mt-1 max-w-xs">
                  Ask for a progressive hint, diagnose a bug, review complexity, or generate edge cases without spoiling the solution.
                </p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};
