import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MOCK_ASSESSMENTS, getMockAssessment } from "@/features/coding-lab/data/mockAssessments";
import { DebuggingProblem, ExecutionResult, Language, AssessmentAttempt, ProblemAttempt, SubmissionStatus } from "@/features/coding-lab/types";
import { getExecutionProvider } from "@/features/coding-lab/services/executionProvider";
import { CodeEditor } from "@/features/coding-lab/components/CodeEditor";
import { QuestionNavigator } from "@/features/coding-lab/components/QuestionNavigator";
import { AssessmentTimer } from "@/features/coding-lab/components/AssessmentTimer";
import { TestResultsPanel } from "@/features/coding-lab/components/TestResultsPanel";
import { AICoachPanel } from "@/features/coding-lab/components/AICoachPanel";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Timer,
  ShieldAlert,
  AlertTriangle,
  Play,
  ArrowRight,
  CheckCircle2,
  Lock,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useStore } from "@/lib/store";
import { useFirebaseAuth } from "@/hooks/useFirebaseAuth";
import { saveCodingAttempt } from "@/features/coding-lab/utils/codingLabFirebase";

export default function CodingLabAssessmentPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useFirebaseAuth();
  const { recordCodingAttempt } = useStore();

  const mockData = React.useMemo(() => getMockAssessment("preptrack-debugging-mock-01"), []);
  const preset = mockData?.preset || MOCK_ASSESSMENTS[0];
  const problems: DebuggingProblem[] = React.useMemo(() => mockData?.problems || [], [mockData]);

  // Assessment flow states: "instructions" | "active" | "submitting"
  const [assessmentState, setAssessmentState] = useState<"instructions" | "active" | "submitting">(() => {
    // Check if an active attempt was stored
    const existing = localStorage.getItem(`preptrack_active_assessment_${preset.id}`);
    return existing ? "active" : "instructions";
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const currentProblem = problems[currentIndex] || problems[0];

  // User drafted code per question
  const [answers, setAnswers] = useState<Record<string, string>>(() => {
    const saved = localStorage.getItem(`preptrack_answers_${preset.id}`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // ignore
      }
    }
    const initial: Record<string, string> = {};
    problems.forEach((p) => {
      initial[p.id] = p.buggyCode;
    });
    return initial;
  });

  // Track results and status per question
  const [problemResults, setProblemResults] = useState<Record<string, ExecutionResult>>({});
  const [isRunning, setIsRunning] = useState(false);
  const [remainingSeconds, setRemainingSeconds] = useState(preset.durationMinutes * 60);

  const problemStatuses = React.useMemo(() => {
    const statuses: Record<string, { status: SubmissionStatus | "NOT_STARTED"; passed: boolean }> = {};
    problems.forEach((p) => {
      const res = problemResults[p.id];
      statuses[p.id] = {
        status: (res?.status as SubmissionStatus) || "NOT_STARTED",
        passed: res?.status === "ACCEPTED",
      };
    });
    return statuses;
  }, [problems, problemResults]);

  const executionProvider = getExecutionProvider();

  // Save answers to localStorage on change
  const handleCodeChange = (newCode: string) => {
    const updated = { ...answers, [currentProblem.id]: newCode };
    setAnswers(updated);
    localStorage.setItem(`preptrack_answers_${preset.id}`, JSON.stringify(updated));
  };

  const handleStartAssessment = () => {
    localStorage.setItem(`preptrack_active_assessment_${preset.id}`, "true");
    setAssessmentState("active");
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    try {
      const code = answers[currentProblem.id] || currentProblem.buggyCode;
      const res = await executionProvider.run({
        problemId: currentProblem.id,
        code,
        language: currentProblem.language,
        testCases: currentProblem.publicTests,
      });

      setProblemResults((prev) => ({ ...prev, [currentProblem.id]: res }));

      if (res.status === "ACCEPTED") {
        toast({
          title: "Public Tests Passed!",
          description: "All sample tests passed. Make sure to review edge cases!",
        });
      } else {
        toast({
          title: "Public Tests Failed",
          description: `${res.passedTests}/${res.totalTests} tests passed.`,
          variant: "destructive",
        });
      }
    } catch (err) {
      toast({
        title: "Run Failed",
        description: "Execution error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsRunning(false);
    }
  };

  const handleFinalSubmit = async () => {
    setAssessmentState("submitting");
    toast({
      title: "Submitting Assessment...",
      description: "Evaluating your solutions against both public and hidden test suites.",
    });

    try {
      const attemptId = `attempt-${Date.now()}`;
      const problemAttempts: Record<string, ProblemAttempt> = {};
      let totalPassedProblems = 0;
      let totalExecutionMs = 0;

      // Evaluate each problem against hidden tests
      for (const p of problems) {
        const userCode = answers[p.id] || p.buggyCode;
        const res = await executionProvider.submit({
          problemId: p.id,
          code: userCode,
          language: p.language,
          userId: user?.uid,
          assessmentId: attemptId,
        });

        const isPassed = res.status === "ACCEPTED";
        if (isPassed) totalPassedProblems++;
        totalExecutionMs += res.executionTimeMs;

        problemAttempts[p.id] = {
          problemId: p.id,
          code: userCode,
          language: p.language,
          status: res.status,
          passedTests: res.passedTests,
          totalTests: res.totalTests,
          executionTimeMs: res.executionTimeMs,
          submittedAt: new Date().toISOString(),
          hintsUsed: 0,
        };
      }

      const score = Math.round((totalPassedProblems / problems.length) * 100);
      const accuracy = score;
      const durationSeconds = preset.durationMinutes * 60 - remainingSeconds;

      // Classify weak topics from failed problems
      const weakTopics = problems
        .filter((p) => problemAttempts[p.id]?.status !== "ACCEPTED")
        .map((p) => p.title);

      const strongTopics = problems
        .filter((p) => problemAttempts[p.id]?.status === "ACCEPTED")
        .map((p) => p.title);

      const newAttempt: AssessmentAttempt = {
        id: attemptId,
        userId: user?.uid || "anonymous_student",
        assessmentTitle: preset.title,
        mode: "assessment",
        score,
        totalProblems: problems.length,
        passedProblems: totalPassedProblems,
        accuracy,
        durationSeconds: Math.max(10, durationSeconds),
        timeRemainingSeconds: remainingSeconds,
        createdAt: new Date(Date.now() - durationSeconds * 1000).toISOString(),
        completedAt: new Date().toISOString(),
        problemAttempts,
        weakTopics,
        strongTopics,
        aiFeedback: {
          strongestArea: strongTopics[0] || "Array manipulation",
          mainWeakness: weakTopics[0] || "Binary search boundary conditions",
          nextRecommendation: `2 ${weakTopics[0] || "boundary"} debugging scenarios + 1 medium algorithm practice`,
          debuggingSkill: Math.min(100, Math.round(accuracy * 1.05)),
          algorithmSkill: Math.max(40, Math.round(accuracy * 0.95)),
          edgeCaseSkill: Math.max(30, Math.round(accuracy * 0.85)),
        },
      };

      // Record attempt into Zustand store (which also updates dsaTopics & readiness!)
      recordCodingAttempt(newAttempt);

      // Persist attempt to isolated Firebase Firestore subcollection if authenticated
      if (user?.uid) {
        saveCodingAttempt(user.uid, newAttempt).catch((e) =>
          console.warn("[CodingLab] Background Firestore sync failed:", e)
        );
      }

      // Clean up localStorage for this preset
      localStorage.removeItem(`preptrack_active_assessment_${preset.id}`);
      localStorage.removeItem(`preptrack_answers_${preset.id}`);
      localStorage.removeItem(`preptrack_timer_${preset.id}`);

      // Redirect to detailed results page
      navigate(`/coding-lab/results/${attemptId}`);
    } catch (err) {
      console.error(err);
      toast({
        title: "Submission Error",
        description: "Failed to finalize evaluation.",
        variant: "destructive",
      });
      setAssessmentState("active");
    }
  };

  // INSTRUCTIONS SCREEN
  if (assessmentState === "instructions") {
    return (
      <div className="container max-w-4xl mx-auto py-12 px-4 space-y-6 animate-fade-in">
        <Card className="border-border/60 shadow-lg">
          <CardHeader className="space-y-2 border-b border-border/40 pb-6">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-primary border-primary/30 text-xs">
                Proctor Simulation
              </Badge>
              <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/30 text-xs">
                Timed Assessment
              </Badge>
            </div>
            <CardTitle className="text-2xl md:text-3xl font-bold">
              {preset.title}
            </CardTitle>
            <CardDescription className="text-sm">
              {preset.description}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6 pt-6 text-xs sm:text-sm">
            {/* Quick Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 bg-muted/40 rounded-lg border border-border/30">
                <div className="text-xs text-muted-foreground">Duration</div>
                <div className="text-lg font-bold text-foreground mt-0.5">
                  {preset.durationMinutes} Minutes
                </div>
              </div>
              <div className="p-3 bg-muted/40 rounded-lg border border-border/30">
                <div className="text-xs text-muted-foreground">Questions</div>
                <div className="text-lg font-bold text-foreground mt-0.5">
                  {preset.totalQuestions} Scenarios
                </div>
              </div>
              <div className="p-3 bg-muted/40 rounded-lg border border-border/30">
                <div className="text-xs text-muted-foreground">Languages</div>
                <div className="text-lg font-bold text-foreground mt-0.5">
                  C++ / Java / Python / JS
                </div>
              </div>
              <div className="p-3 bg-muted/40 rounded-lg border border-border/30">
                <div className="text-xs text-muted-foreground">AI Policy</div>
                <div className="text-lg font-bold text-rose-500 mt-0.5 flex items-center gap-1">
                  <Lock className="w-4 h-4" />
                  <span>Strict (Disabled)</span>
                </div>
              </div>
            </div>

            {/* Assessment Instructions */}
            <div className="space-y-2">
              <h4 className="font-semibold text-foreground text-sm uppercase tracking-wider text-muted-foreground">
                Instructions & Format
              </h4>
              <ul className="space-y-2 list-disc list-inside text-muted-foreground text-xs leading-relaxed">
                {preset.instructions.map((inst, idx) => (
                  <li key={idx}>{inst}</li>
                ))}
              </ul>
            </div>

            {/* Rules & Proctor Notice */}
            <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg space-y-2">
              <div className="flex items-center gap-2 font-semibold text-amber-500 text-xs">
                <ShieldAlert className="w-4 h-4" />
                <span>Enterprise Proctor Simulation Rules</span>
              </div>
              <ul className="space-y-1 text-[11px] text-muted-foreground">
                {preset.rules.map((rule, idx) => (
                  <li key={idx}>• {rule}</li>
                ))}
              </ul>
            </div>

            {/* Start Button */}
            <div className="flex items-center justify-between pt-4 border-t border-border/40">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/coding-lab")}
                className="text-xs"
              >
                Cancel & Return
              </Button>

              <Button
                size="lg"
                onClick={handleStartAssessment}
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold gap-2 shadow-md"
              >
                <span>Start Assessment</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ACTIVE ASSESSMENT SCREEN
  const currentCode = answers[currentProblem.id] || currentProblem.buggyCode;
  const currentResult = problemResults[currentProblem.id] || null;

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-background overflow-hidden select-none">
      {/* Top Assessment Navigation Bar */}
      <header className="flex items-center justify-between px-4 py-2 bg-card border-b border-border/50 shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm text-foreground">
              PREPTRACK DEBUGGING LAB
            </span>
            <Badge variant="outline" className="hidden sm:inline-flex text-[10px] text-amber-500 border-amber-500/30">
              Assessment Mode
            </Badge>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Assessment Timer */}
          <AssessmentTimer
            attemptId={preset.id}
            durationMinutes={preset.durationMinutes}
            onTimeExpired={handleFinalSubmit}
            onTick={setRemainingSeconds}
          />

          <Button
            variant="default"
            size="sm"
            onClick={handleFinalSubmit}
            disabled={assessmentState === "submitting"}
            className="h-8 px-4 text-xs font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-xs"
          >
            {assessmentState === "submitting" ? "Grading..." : "Submit Assessment"}
          </Button>
        </div>
      </header>

      {/* Main Assessment Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Column: Question Navigator */}
        <div className="w-56 shrink-0 hidden md:block">
          <QuestionNavigator
            problems={problems}
            currentIndex={currentIndex}
            onSelectProblem={setCurrentIndex}
            problemStatuses={problemStatuses}
            title="Questions"
            isAssessment
          />
        </div>

        {/* Center-Left Column: Problem Statement */}
        <div className="w-full md:w-[32%] xl:w-[28%] flex flex-col bg-card border-r border-border/50 overflow-y-auto select-text">
          <div className="p-4 space-y-4 text-xs">
            <div>
              <div className="flex items-center gap-2 text-muted-foreground text-[11px] mb-1">
                <span>Question {currentIndex + 1} of {problems.length}</span>
                <span>•</span>
                <span className="capitalize">{currentProblem.category}</span>
              </div>
              <h2 className="text-base font-bold text-foreground">
                {currentProblem.title}
              </h2>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <h4 className="font-semibold text-foreground text-xs uppercase tracking-wider text-muted-foreground">
                Problem Statement
              </h4>
              <p className="text-muted-foreground leading-relaxed">
                {currentProblem.description}
              </p>
            </div>

            {/* Expected Behavior */}
            <div className="p-2.5 bg-muted/30 rounded border border-border/40 space-y-1">
              <h5 className="font-semibold text-foreground text-[11px] flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>Expected Behavior</span>
              </h5>
              <p className="text-muted-foreground text-[11px] leading-relaxed">
                {currentProblem.expectedBehavior}
              </p>
            </div>

            {/* Constraints */}
            <div className="space-y-1">
              <h4 className="font-semibold text-foreground text-xs uppercase tracking-wider text-muted-foreground">
                Constraints
              </h4>
              <ul className="space-y-0.5 list-disc list-inside font-mono text-[11px] text-muted-foreground">
                {currentProblem.constraints.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            </div>

            {/* Sample Tests */}
            <div className="space-y-2">
              <h4 className="font-semibold text-foreground text-xs uppercase tracking-wider text-muted-foreground">
                Sample Test Cases
              </h4>
              {currentProblem.publicTests.map((t, idx) => (
                <div
                  key={t.id}
                  className="p-2 bg-background border border-border/40 rounded font-mono text-[11px] space-y-0.5"
                >
                  <div className="text-muted-foreground text-[10px]">Case {idx + 1}:</div>
                  <div>Input: <span className="text-foreground">{t.input}</span></div>
                  <div>Expected: <span className="text-emerald-500">{t.expectedOutput}</span></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Center-Right: Code Editor & Test Cases */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#1e1e1e] overflow-hidden">
          {/* Top Half: Code Editor */}
          <div className="h-[60%] min-h-[250px]">
            <CodeEditor
              code={currentCode}
              onChange={handleCodeChange}
              language={currentProblem.language}
              allowLanguageChange={false}
              onRun={handleRunCode}
              isRunning={isRunning}
              isSubmitting={assessmentState === "submitting"}
              onReset={() => handleCodeChange(currentProblem.buggyCode)}
            />
          </div>

          {/* Bottom Half: Test Cases / Results */}
          <div className="h-[40%] min-h-[180px] border-t border-border/40">
            <TestResultsPanel result={currentResult} isRunning={isRunning} />
          </div>
        </div>

        {/* Right Column: AI Coach Panel (Strictly Gated in Assessment Mode) */}
        <div className="w-64 xl:w-72 shrink-0 hidden lg:block">
          <AICoachPanel
            problem={currentProblem}
            code={currentCode}
            language={currentProblem.language}
            mode="assessment"
          />
        </div>
      </div>
    </div>
  );
}
