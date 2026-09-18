import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { PROBLEM_BANK } from "@/features/coding-lab/data/problemBank";
import { DebuggingProblem, Language, ExecutionResult, ProblemCategory } from "@/features/coding-lab/types";
import { getExecutionProvider } from "@/features/coding-lab/services/executionProvider";
import { CodeEditor } from "@/features/coding-lab/components/CodeEditor";
import { TestResultsPanel } from "@/features/coding-lab/components/TestResultsPanel";
import { AICoachPanel } from "@/features/coding-lab/components/AICoachPanel";
import { GenerateCodeModal } from "@/features/coding-lab/components/GenerateCodeModal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  ArrowLeft,
  Bug,
  Code2,
  Play,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  BookOpen,
  Terminal,
  Sparkles,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useStore } from "@/lib/store";

export default function CodingLabWorkspacePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isDebugging = location.pathname.includes("/debugging");

  // Filter problems if category query param is present
  const searchParams = new URLSearchParams(location.search);
  const categoryFilter = searchParams.get("category") as ProblemCategory | null;

  const problemList = React.useMemo(() => {
    if (categoryFilter) {
      const filtered = PROBLEM_BANK.filter((p) => p.category === categoryFilter);
      return filtered.length > 0 ? filtered : PROBLEM_BANK;
    }
    return PROBLEM_BANK;
  }, [categoryFilter]);

  const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
  const currentProblem: DebuggingProblem = problemList[currentProblemIndex] || problemList[0];

  const [code, setCode] = useState(currentProblem.buggyCode);
  const [language, setLanguage] = useState<Language>(currentProblem.language);
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [executionResult, setExecutionResult] = useState<ExecutionResult | null>(null);
  const [generateModalOpen, setGenerateModalOpen] = useState(false);
  const [mobileActiveTab, setMobileActiveTab] = useState("problem");

  // Sync code when problem changes
  useEffect(() => {
    setCode(currentProblem.buggyCode);
    setLanguage(currentProblem.language);
    setExecutionResult(null);
  }, [currentProblem.id, currentProblem.buggyCode, currentProblem.language]);

  const executionProvider = getExecutionProvider();

  const handleRun = async () => {
    setIsRunning(true);
    try {
      const res = await executionProvider.run({
        problemId: currentProblem.id,
        code,
        language,
        testCases: currentProblem.publicTests,
      });
      setExecutionResult(res);
      setMobileActiveTab("tests");
      if (res.status === "ACCEPTED") {
        toast({
          title: "Public Tests Passed!",
          description: "All public test cases passed. Ready for submission.",
        });
      } else {
        toast({
          title: "Test Cases Failed",
          description: `${res.passedTests}/${res.totalTests} public tests passed. Check test details.`,
          variant: "destructive",
        });
      }
    } catch (err) {
      toast({
        title: "Execution Error",
        description: "Failed to execute code in sandbox.",
        variant: "destructive",
      });
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const res = await executionProvider.submit({
        problemId: currentProblem.id,
        code,
        language,
      });
      setExecutionResult(res);
      setMobileActiveTab("tests");

      if (res.status === "ACCEPTED") {
        toast({
          title: "Accepted! 🎉",
          description: "All public and hidden test cases passed successfully.",
        });
      } else {
        toast({
          title: "Submission Status: " + res.status,
          description: `Passed ${res.passedTests} of ${res.totalTests} test suites.`,
          variant: "destructive",
        });
      }
    } catch (err) {
      toast({
        title: "Submission failed",
        description: "Unable to process submission.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setCode(currentProblem.buggyCode);
    setExecutionResult(null);
    toast({ title: "Code Reset to original buggy snippet" });
  };

  const handleInsertGeneratedCode = (newCode: string) => {
    setCode(newCode);
  };

  const getDifficultyBadge = (diff: string) => {
    switch (diff) {
      case "Easy":
        return <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/30">Easy</Badge>;
      case "Medium":
        return <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/30">Medium</Badge>;
      case "Hard":
        return <Badge className="bg-rose-500/10 text-rose-500 border-rose-500/30">Hard</Badge>;
      default:
        return <Badge variant="outline">{diff}</Badge>;
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-background overflow-hidden select-none">
      {/* Top Workspace Bar */}
      <header className="flex items-center justify-between px-4 py-2 bg-card border-b border-border/50 shrink-0">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/coding-lab")}
            className="h-8 px-2 text-xs text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            <span className="hidden sm:inline">Back to Coding Lab</span>
          </Button>

          <div className="h-4 w-px bg-border/60" />

          {/* Problem Selector Dropdown */}
          <Select
            value={currentProblem.id}
            onValueChange={(val) => {
              const idx = problemList.findIndex((p) => p.id === val);
              if (idx !== -1) setCurrentProblemIndex(idx);
            }}
          >
            <SelectTrigger className="h-8 max-w-[220px] sm:max-w-[320px] text-xs font-medium bg-background border-border/60 truncate">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {problemList.map((p, idx) => (
                <SelectItem key={p.id} value={p.id} className="text-xs">
                  {idx + 1}. {p.title} ({p.difficulty})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {getDifficultyBadge(currentProblem.difficulty)}
          <Badge variant="outline" className="hidden md:inline-flex text-[10px] capitalize">
            {currentProblem.category}
          </Badge>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleRun}
            disabled={isRunning || isSubmitting}
            className="h-8 px-3 text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-medium"
          >
            <Play className="w-3.5 h-3.5 mr-1 fill-current" />
            <span>{isRunning ? "Running..." : "Run Code"}</span>
          </Button>

          <Button
            variant="default"
            size="sm"
            onClick={handleSubmit}
            disabled={isRunning || isSubmitting}
            className="h-8 px-3.5 text-xs font-semibold"
          >
            <span>{isSubmitting ? "Submitting..." : "Submit"}</span>
          </Button>
        </div>
      </header>

      {/* Mobile Tab Switcher */}
      <div className="lg:hidden border-b border-border/50 bg-muted/20 px-2">
        <Tabs value={mobileActiveTab} onValueChange={setMobileActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 h-9 bg-transparent">
            <TabsTrigger value="problem" className="text-xs">Problem</TabsTrigger>
            <TabsTrigger value="code" className="text-xs">Code</TabsTrigger>
            <TabsTrigger value="tests" className="text-xs">Tests</TabsTrigger>
            <TabsTrigger value="coach" className="text-xs">AI Coach</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Main Workspace Layout (Desktop 3-Column Split) */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Column: Problem Statement & Constraints */}
        <div
          className={`w-full lg:w-[32%] xl:w-[28%] flex flex-col bg-card border-r border-border/50 overflow-y-auto ${
            mobileActiveTab === "problem" ? "flex" : "hidden lg:flex"
          }`}
        >
          <div className="p-4 space-y-4 text-xs select-text">
            <div>
              <div className="flex items-center gap-2 text-muted-foreground text-[11px] mb-1">
                <span className="font-mono uppercase">{currentProblem.language}</span>
                <span>•</span>
                <span className="capitalize">{currentProblem.category} Category</span>
              </div>
              <h2 className="text-lg font-bold text-foreground">
                {currentProblem.title}
              </h2>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <h3 className="font-semibold text-foreground text-xs uppercase tracking-wider text-muted-foreground">
                Problem Statement
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {currentProblem.description}
              </p>
            </div>

            {/* Expected Behavior */}
            <div className="p-3 bg-muted/30 rounded-lg border border-border/40 space-y-1">
              <h4 className="font-semibold text-foreground text-[11px] flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>Expected Behavior</span>
              </h4>
              <p className="text-muted-foreground text-[11px] leading-relaxed">
                {currentProblem.expectedBehavior}
              </p>
            </div>

            {/* Constraints */}
            <div className="space-y-1.5">
              <h4 className="font-semibold text-foreground text-xs uppercase tracking-wider text-muted-foreground">
                Constraints
              </h4>
              <ul className="space-y-1 list-disc list-inside font-mono text-[11px] text-muted-foreground">
                {currentProblem.constraints.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            </div>

            {/* Public Test Cases Preview */}
            <div className="space-y-2">
              <h4 className="font-semibold text-foreground text-xs uppercase tracking-wider text-muted-foreground">
                Sample Test Cases
              </h4>
              <div className="space-y-2">
                {currentProblem.publicTests.map((t, idx) => (
                  <div
                    key={t.id}
                    className="p-2.5 bg-background border border-border/40 rounded font-mono text-[11px] space-y-1"
                  >
                    <div className="text-muted-foreground text-[10px] font-sans">
                      Example {idx + 1}:
                    </div>
                    <div>
                      <span className="text-muted-foreground">Input: </span>
                      <span className="text-foreground">{t.input}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Expected: </span>
                      <span className="text-emerald-500 font-semibold">{t.expectedOutput}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div className="pt-2 flex flex-wrap gap-1.5">
              {currentProblem.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-[10px] font-normal">
                  #{tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Middle Column: Monaco Code Editor & Test Results */}
        <div
          className={`flex-1 flex flex-col min-w-0 bg-[#1e1e1e] overflow-hidden ${
            mobileActiveTab === "code" || mobileActiveTab === "tests" ? "flex" : "hidden lg:flex"
          }`}
        >
          {/* Top Half: Code Editor */}
          <div
            className={`flex-1 min-h-[300px] ${
              mobileActiveTab === "tests" ? "hidden lg:block lg:h-[60%]" : "h-full lg:h-[60%]"
            }`}
          >
            <CodeEditor
              code={code}
              onChange={setCode}
              language={language}
              onLanguageChange={setLanguage}
              onRun={handleRun}
              onSubmit={handleSubmit}
              onReset={handleReset}
              onOpenAIGenerate={() => setGenerateModalOpen(true)}
              isRunning={isRunning}
              isSubmitting={isSubmitting}
            />
          </div>

          {/* Bottom Half: Test Results & Console */}
          <div
            className={`h-[40%] min-h-[200px] border-t border-border/40 ${
              mobileActiveTab === "code" ? "hidden lg:block" : "block"
            }`}
          >
            <TestResultsPanel result={executionResult} isRunning={isRunning || isSubmitting} />
          </div>
        </div>

        {/* Right Column: AI Coding Coach Panel */}
        <div
          className={`w-full lg:w-[28%] xl:w-[26%] flex flex-col bg-card border-l border-border/50 ${
            mobileActiveTab === "coach" ? "flex" : "hidden lg:flex"
          }`}
        >
          <AICoachPanel
            problem={currentProblem}
            code={code}
            language={language}
            mode="practice"
            compilerOutput={executionResult?.compileOutput}
            failedTest={executionResult?.testResults.find((t) => !t.passed)}
            onOpenGenerateModal={() => setGenerateModalOpen(true)}
          />
        </div>
      </div>

      {/* AI Code Generation Modal */}
      <GenerateCodeModal
        open={generateModalOpen}
        onOpenChange={setGenerateModalOpen}
        problem={currentProblem}
        currentLanguage={language}
        onInsertCode={handleInsertGeneratedCode}
      />
    </div>
  );
}
