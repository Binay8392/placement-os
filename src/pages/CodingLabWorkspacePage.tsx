import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { PROBLEM_BANK } from "@/features/coding-lab/data/problemBank";
import {
  DebuggingProblem,
  Language,
  ExecutionResult,
  ProblemCategory,
  TestCase,
} from "@/features/coding-lab/types";
import { getExecutionProvider } from "@/features/coding-lab/services/executionProvider";
import { CodeEditor } from "@/features/coding-lab/components/CodeEditor";
import { TestResultsPanel } from "@/features/coding-lab/components/TestResultsPanel";
import { AICoachPanel } from "@/features/coding-lab/components/AICoachPanel";
import { GenerateCodeModal } from "@/features/coding-lab/components/GenerateCodeModal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
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
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
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
  ChevronDown,
  ChevronRight,
  ListTodo,
  ShieldCheck,
  Maximize2,
  Minimize2,
  FileText,
  Clock,
  RotateCcw,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useStore } from "@/lib/store";
import { useFirebaseAuth } from "@/hooks/useFirebaseAuth";

const EDGE_CASE_CHECKLIST_ITEMS = [
  { id: "empty", label: "Empty input / 0 length collections" },
  { id: "single", label: "Single element / 1 node / n = 1" },
  { id: "duplicates", label: "Duplicate values & collision entries" },
  { id: "negatives", label: "Negative numbers / negative coordinates" },
  { id: "minmax", label: "Minimum and maximum constraint limits" },
  { id: "sorted", label: "Already sorted or reverse sorted inputs" },
  { id: "overflow", label: "Integer / 32-bit arithmetic overflow" },
  { id: "boundaries", label: "Boundary indices (0, n-1, off-by-one)" },
];

export default function CodingLabWorkspacePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useFirebaseAuth();

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
  const [isFocusMode, setIsFocusMode] = useState(false);

  // Custom Test Cases state
  const [customTests, setCustomTests] = useState<TestCase[]>(() => {
    const saved = localStorage.getItem(`preptrack_custom_tests_${currentProblem.id}`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // ignore
      }
    }
    return [];
  });

  // Structured Notes state
  const [notesOpen, setNotesOpen] = useState(false);
  const [structuredNotes, setStructuredNotes] = useState<Record<string, string>>(() => {
    const saved = localStorage.getItem(`preptrack_notes_${currentProblem.id}`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // ignore
      }
    }
    return {};
  });

  // Edge-case checklist state
  const [checklistOpen, setChecklistOpen] = useState(false);
  const [checkedCases, setCheckedCases] = useState<Record<string, boolean>>(() => {
    const saved = localStorage.getItem(`preptrack_checklist_${currentProblem.id}`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // ignore
      }
    }
    return {};
  });

  // Sync code and stored states when problem changes
  useEffect(() => {
    setCode(currentProblem.buggyCode);
    setLanguage(currentProblem.language);
    setExecutionResult(null);

    // Load custom tests
    const savedTests = localStorage.getItem(`preptrack_custom_tests_${currentProblem.id}`);
    setCustomTests(savedTests ? JSON.parse(savedTests) : []);

    // Load notes
    const savedNotes = localStorage.getItem(`preptrack_notes_${currentProblem.id}`);
    setStructuredNotes(savedNotes ? JSON.parse(savedNotes) : {});

    // Load checklist
    const savedChecklist = localStorage.getItem(`preptrack_checklist_${currentProblem.id}`);
    setCheckedCases(savedChecklist ? JSON.parse(savedChecklist) : {});
  }, [currentProblem.id, currentProblem.buggyCode, currentProblem.language]);

  // Keyboard shortcut: Esc exits focus mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isFocusMode) {
        setIsFocusMode(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFocusMode]);

  const handleAddCustomTest = (test: TestCase) => {
    const updated = [...customTests, test];
    setCustomTests(updated);
    localStorage.setItem(`preptrack_custom_tests_${currentProblem.id}`, JSON.stringify(updated));
    toast({ title: "Custom test added", description: `Test #${updated.length} ready to run.` });
  };

  const handleDeleteCustomTest = (testId: string) => {
    const updated = customTests.filter((t) => t.id !== testId);
    setCustomTests(updated);
    localStorage.setItem(`preptrack_custom_tests_${currentProblem.id}`, JSON.stringify(updated));
  };

  const handleClearCustomTests = () => {
    setCustomTests([]);
    localStorage.removeItem(`preptrack_custom_tests_${currentProblem.id}`);
  };

  const handleNoteChange = (stepKey: string, text: string) => {
    const updated = { ...structuredNotes, [stepKey]: text };
    setStructuredNotes(updated);
    localStorage.setItem(`preptrack_notes_${currentProblem.id}`, JSON.stringify(updated));
  };

  const handleToggleChecklist = (caseId: string) => {
    const updated = { ...checkedCases, [caseId]: !checkedCases[caseId] };
    setCheckedCases(updated);
    localStorage.setItem(`preptrack_checklist_${currentProblem.id}`, JSON.stringify(updated));
  };

  const executionProvider = getExecutionProvider();

  const handleRun = async () => {
    setIsRunning(true);
    try {
      // Run public tests plus any user custom tests
      const testsToRun = [...currentProblem.publicTests, ...customTests];
      const res = await executionProvider.run({
        problemId: currentProblem.id,
        code,
        language,
        testCases: testsToRun,
      });
      setExecutionResult(res);
      setMobileActiveTab("tests");
      if (res.status === "ACCEPTED") {
        toast({
          title: "Public Tests Passed!",
          description: `All ${res.passedTests} test cases passed. Ready for submission.`,
        });
      } else {
        toast({
          title: "Test Cases Failed",
          description: `${res.passedTests}/${res.totalTests} tests passed. Check test details.`,
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
        userId: user?.uid,
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
          title: `Submission: ${res.status}`,
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
    toast({ title: "Code reset to original buggy template" });
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
      {/* Top Workspace Header */}
      <header className="flex items-center justify-between px-4 py-2 bg-card border-b border-border/50 shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/coding-lab")}
            className="h-8 px-2 text-xs text-muted-foreground hover:text-foreground shrink-0"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            <span className="hidden sm:inline">Coding Lab</span>
          </Button>

          <div className="h-4 w-px bg-border/60 shrink-0" />

          {/* Problem Selector Dropdown */}
          <Select
            value={currentProblem.id}
            onValueChange={(val) => {
              const idx = problemList.findIndex((p) => p.id === val);
              if (idx !== -1) setCurrentProblemIndex(idx);
            }}
          >
            <SelectTrigger className="h-8 max-w-[200px] sm:max-w-[300px] text-xs font-medium bg-background border-border/60 truncate">
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

        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsFocusMode(!isFocusMode)}
            className="h-8 px-2 text-xs text-muted-foreground hover:text-foreground hidden sm:flex items-center gap-1"
            title={isFocusMode ? "Exit Focus Mode (Esc)" : "Editor Focus Mode"}
          >
            {isFocusMode ? (
              <>
                <Minimize2 className="w-3.5 h-3.5 text-primary" />
                <span>Exit Focus</span>
              </>
            ) : (
              <>
                <Maximize2 className="w-3.5 h-3.5" />
                <span>Focus Mode</span>
              </>
            )}
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={handleRun}
            disabled={isRunning || isSubmitting}
            className="h-8 px-3 text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-medium"
          >
            <Play className="w-3.5 h-3.5 mr-1 fill-current" />
            <span>{isRunning ? "Running..." : "Run"}</span>
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
      <div className="lg:hidden border-b border-border/50 bg-muted/20 px-2 shrink-0">
        <Tabs value={mobileActiveTab} onValueChange={setMobileActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 h-9 bg-transparent">
            <TabsTrigger value="problem" className="text-xs">Problem</TabsTrigger>
            <TabsTrigger value="code" className="text-xs">Code</TabsTrigger>
            <TabsTrigger value="tests" className="text-xs">Tests</TabsTrigger>
            <TabsTrigger value="coach" className="text-xs">AI Coach</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Main Workspace Layout */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Column: Problem Statement & Structured Problem-Solving Notes */}
        <div
          className={`w-full lg:w-[36%] xl:w-[32%] flex flex-col bg-card border-r border-border/50 overflow-y-auto ${
            mobileActiveTab === "problem" && !isFocusMode ? "flex" : isFocusMode ? "hidden" : "hidden lg:flex"
          }`}
        >
          <div className="p-4 space-y-4 text-xs select-text">
            <div>
              <div className="flex items-center gap-2 text-muted-foreground text-[11px] mb-1">
                <span className="font-mono uppercase">{currentProblem.language}</span>
                <span>•</span>
                <span className="capitalize">{currentProblem.category} Category</span>
                <span>•</span>
                <span>Target: {currentProblem.timeComplexity || "O(n)"}</span>
              </div>
              <h2 className="text-lg font-bold text-foreground">
                {currentProblem.title}
              </h2>
            </div>

            {/* Problem Statement */}
            <div className="space-y-1.5">
              <h3 className="font-semibold text-foreground text-xs uppercase tracking-wider text-muted-foreground">
                Problem Description
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

            {/* Structured Problem-Solving Workflow (Collapsible) */}
            <Collapsible open={notesOpen} onOpenChange={setNotesOpen} className="border border-border/50 rounded-lg bg-background p-3 space-y-2">
              <CollapsibleTrigger className="flex items-center justify-between w-full text-xs font-semibold text-foreground hover:text-primary transition-colors">
                <span className="flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-primary" />
                  <span>Structured Problem-Solving Notes</span>
                </span>
                {notesOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-3 pt-2">
                <p className="text-[11px] text-muted-foreground">
                  Use this structured workflow to plan your algorithm before coding (auto-saved locally):
                </p>
                <div>
                  <label className="text-[10px] uppercase font-semibold text-muted-foreground">1. Understand & I/O</label>
                  <Textarea
                    value={structuredNotes.understand || ""}
                    onChange={(e) => handleNoteChange("understand", e.target.value)}
                    placeholder="Input types, return format, constraints..."
                    className="h-16 text-xs mt-1 bg-card border-border/50"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-semibold text-muted-foreground">2. Brute Force vs Optimal Idea</label>
                  <Textarea
                    value={structuredNotes.approach || ""}
                    onChange={(e) => handleNoteChange("approach", e.target.value)}
                    placeholder="Describe baseline algorithm and optimization strategy..."
                    className="h-16 text-xs mt-1 bg-card border-border/50"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-semibold text-muted-foreground">3. Target Complexity</label>
                  <Textarea
                    value={structuredNotes.complexity || ""}
                    onChange={(e) => handleNoteChange("complexity", e.target.value)}
                    placeholder="Time: O(...) Space: O(...)"
                    className="h-12 text-xs mt-1 bg-card border-border/50"
                  />
                </div>
              </CollapsibleContent>
            </Collapsible>

            {/* Edge-Case Checklist (Collapsible) */}
            <Collapsible open={checklistOpen} onOpenChange={setChecklistOpen} className="border border-border/50 rounded-lg bg-background p-3 space-y-2">
              <CollapsibleTrigger className="flex items-center justify-between w-full text-xs font-semibold text-foreground hover:text-primary transition-colors">
                <span className="flex items-center gap-1.5">
                  <ListTodo className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Placement Edge-Case Checklist</span>
                </span>
                {checklistOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-2 pt-2">
                {EDGE_CASE_CHECKLIST_ITEMS.map((item) => (
                  <label
                    key={item.id}
                    className="flex items-center gap-2 text-[11px] text-muted-foreground hover:text-foreground cursor-pointer"
                  >
                    <Checkbox
                      checked={Boolean(checkedCases[item.id])}
                      onCheckedChange={() => handleToggleChecklist(item.id)}
                      className="h-3.5 w-3.5"
                    />
                    <span>{item.label}</span>
                  </label>
                ))}
              </CollapsibleContent>
            </Collapsible>

            {/* Progressive Hints */}
            {currentProblem.hints && currentProblem.hints.length > 0 && (
              <div className="space-y-1.5 pt-1">
                <h4 className="font-semibold text-foreground text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                  <HelpCircle className="w-3.5 h-3.5 text-amber-500" />
                  <span>Progressive Hints</span>
                </h4>
                <div className="space-y-1.5">
                  {currentProblem.hints.map((hint, i) => (
                    <div key={i} className="p-2 bg-amber-500/5 border border-amber-500/20 rounded text-[11px] text-zinc-300">
                      <span className="font-semibold text-amber-500 mr-1.5">Hint {i + 1}:</span>
                      {hint}
                    </div>
                  ))}
                </div>
              </div>
            )}

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

        {/* Center / Right Column: Monaco Code Editor & Test Results Panel */}
        <div
          className={`flex-1 flex flex-col min-w-0 bg-[#1e1e1e] overflow-hidden ${
            isFocusMode
              ? "absolute inset-0 z-30 flex"
              : mobileActiveTab === "code" || mobileActiveTab === "tests"
              ? "flex"
              : "hidden lg:flex"
          }`}
        >
          {/* Top Half: Code Editor */}
          <div
            className={`flex-1 min-h-[320px] ${
              isFocusMode
                ? "h-[65%]"
                : mobileActiveTab === "tests"
                ? "hidden lg:block lg:h-[60%]"
                : "h-full lg:h-[60%]"
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
              isFocusMode={isFocusMode}
              onToggleFocusMode={() => setIsFocusMode(!isFocusMode)}
              problemTitle={currentProblem.title}
              statusBadge={getDifficultyBadge(currentProblem.difficulty)}
            />
          </div>

          {/* Bottom Half: Test Results, Custom Tests, and Output */}
          <div
            className={`min-h-[220px] border-t border-border/40 ${
              isFocusMode
                ? "h-[35%]"
                : mobileActiveTab === "code"
                ? "hidden lg:block lg:h-[40%]"
                : "block h-[40%]"
            }`}
          >
            <TestResultsPanel
              result={executionResult}
              isRunning={isRunning || isSubmitting}
              customTests={customTests}
              onAddCustomTest={handleAddCustomTest}
              onDeleteCustomTest={handleDeleteCustomTest}
              onClearCustomTests={handleClearCustomTests}
              expectedComplexity={{
                time: currentProblem.timeComplexity,
                space: currentProblem.spaceComplexity,
              }}
            />
          </div>
        </div>

        {/* Right Column: AI Coding Coach Panel */}
        <div
          className={`w-full lg:w-[28%] xl:w-[26%] flex flex-col bg-card border-l border-border/50 ${
            isFocusMode
              ? "hidden"
              : mobileActiveTab === "coach"
              ? "flex"
              : "hidden lg:flex"
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
