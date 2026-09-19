import React, { useState } from "react";
import { ExecutionResult, TestCaseResult, TestCase } from "../types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  CheckCircle2,
  XCircle,
  AlertCircle,
  Terminal,
  Cpu,
  Clock,
  ShieldCheck,
  Plus,
  Trash2,
  ListPlus,
  Activity,
  Layers,
} from "lucide-react";

interface TestResultsPanelProps {
  result: ExecutionResult | null;
  isRunning?: boolean;
  customTests?: TestCase[];
  onAddCustomTest?: (test: TestCase) => void;
  onDeleteCustomTest?: (testId: string) => void;
  onClearCustomTests?: () => void;
  expectedComplexity?: { time?: string; space?: string };
}

export const TestResultsPanel: React.FC<TestResultsPanelProps> = ({
  result,
  isRunning = false,
  customTests = [],
  onAddCustomTest,
  onDeleteCustomTest,
  onClearCustomTests,
  expectedComplexity,
}) => {
  const [selectedTab, setSelectedTab] = useState<number>(0);
  const [activeView, setActiveView] = useState<"tests" | "custom" | "console" | "complexity">("tests");

  // Custom test inputs state
  const [customInput, setCustomInput] = useState("");
  const [customExpected, setCustomExpected] = useState("");

  const handleCreateCustomTest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customInput.trim()) return;
    const newTest: TestCase = {
      id: `custom-${Date.now()}`,
      input: customInput.trim(),
      expectedOutput: customExpected.trim() || "[Custom Validation]",
      explanation: "User-defined custom test case",
    };
    onAddCustomTest?.(newTest);
    setCustomInput("");
    setCustomExpected("");
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ACCEPTED":
        return <Badge className="bg-emerald-600 hover:bg-emerald-600 text-white font-mono">ACCEPTED</Badge>;
      case "PARTIAL":
        return <Badge className="bg-amber-600 hover:bg-amber-600 text-white font-mono">PARTIAL PASS</Badge>;
      case "WRONG_ANSWER":
        return <Badge className="bg-rose-600 hover:bg-rose-600 text-white font-mono">WRONG ANSWER</Badge>;
      case "COMPILE_ERROR":
        return <Badge className="bg-rose-600 hover:bg-rose-600 text-white font-mono">COMPILE ERROR</Badge>;
      case "RUNTIME_ERROR":
        return <Badge className="bg-rose-600 hover:bg-rose-600 text-white font-mono">RUNTIME ERROR</Badge>;
      case "TIMEOUT":
        return <Badge className="bg-amber-600 hover:bg-amber-600 text-white font-mono">TIME LIMIT EXCEEDED</Badge>;
      case "MEMORY_ERROR":
        return <Badge className="bg-rose-600 hover:bg-rose-600 text-white font-mono">MEMORY LIMIT EXCEEDED</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (isRunning) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-muted-foreground gap-3 bg-[#18181b]">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        <span className="text-xs font-mono">Running test cases through execution sandbox...</span>
      </div>
    );
  }

  const publicResults = result?.testResults.filter((t) => !t.isHidden) || [];
  const hiddenResults = result?.testResults.filter((t) => t.isHidden) || [];
  const hiddenPassed = hiddenResults.filter((t) => t.passed).length;
  const currentTestCase: TestCaseResult | undefined = publicResults[selectedTab] || publicResults[0];

  return (
    <div className="flex flex-col h-full bg-[#18181b] border-t border-border/50 text-foreground overflow-hidden">
      {/* Panel Top Navigation Bar */}
      <div className="flex items-center justify-between px-3 py-2 bg-[#202023] border-b border-[#2e2e32] select-none text-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <button
            onClick={() => setActiveView("tests")}
            className={`px-2.5 py-1 rounded font-medium transition-colors ${
              activeView === "tests"
                ? "bg-[#2d2d31] text-foreground border border-border/40"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Test Cases {result ? `(${result.passedTests}/${result.totalTests})` : ""}
          </button>

          <button
            onClick={() => setActiveView("custom")}
            className={`px-2.5 py-1 rounded font-medium transition-colors flex items-center gap-1 ${
              activeView === "custom"
                ? "bg-[#2d2d31] text-foreground border border-border/40"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <ListPlus className="w-3.5 h-3.5" />
            <span>Custom Tests ({customTests.length})</span>
          </button>

          <button
            onClick={() => setActiveView("console")}
            className={`px-2.5 py-1 rounded font-medium transition-colors flex items-center gap-1 ${
              activeView === "console"
                ? "bg-[#2d2d31] text-foreground border border-border/40"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Console</span>
          </button>

          <button
            onClick={() => setActiveView("complexity")}
            className={`px-2.5 py-1 rounded font-medium transition-colors flex items-center gap-1 ${
              activeView === "complexity"
                ? "bg-[#2d2d31] text-foreground border border-border/40"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Complexity</span>
          </button>
        </div>

        {result && (
          <div className="flex items-center gap-3 shrink-0">
            <div className="flex items-center gap-1 text-[11px] text-muted-foreground font-mono">
              <Clock className="w-3 h-3 text-muted-foreground/70" />
              <span>{result.executionTimeMs} ms</span>
            </div>
            {result.memoryKb && (
              <div className="hidden sm:flex items-center gap-1 text-[11px] text-muted-foreground font-mono">
                <Cpu className="w-3 h-3 text-muted-foreground/70" />
                <span>{(result.memoryKb / 1024).toFixed(1)} MB</span>
              </div>
            )}
            {getStatusBadge(result.status)}
          </div>
        )}
      </div>

      {/* Main View Area */}
      <div className="flex-1 overflow-y-auto p-3 text-xs">
        {activeView === "custom" ? (
          <div className="space-y-4 font-sans">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-foreground text-xs">Custom Test Cases</h4>
                <p className="text-[11px] text-muted-foreground">
                  Add edge-case inputs to test and validate your algorithm before submission.
                </p>
              </div>
              {customTests.length > 0 && onClearCustomTests && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClearCustomTests}
                  className="h-7 text-xs text-muted-foreground hover:text-rose-400"
                >
                  Clear All
                </Button>
              )}
            </div>

            {/* Add Custom Test Form */}
            {onAddCustomTest && (
              <form onSubmit={handleCreateCustomTest} className="p-3 bg-[#121214] border border-[#2d2d31] rounded-lg space-y-2.5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono">
                  <div>
                    <label className="text-[10px] text-muted-foreground uppercase font-sans">Test Input</label>
                    <Input
                      value={customInput}
                      onChange={(e) => setCustomInput(e.target.value)}
                      placeholder='e.g., nums = [-5, 0, 8], target = 0'
                      className="h-8 text-xs bg-[#18181b] border-[#2e2e32] text-foreground font-mono mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-muted-foreground uppercase font-sans">Expected Output (optional)</label>
                    <Input
                      value={customExpected}
                      onChange={(e) => setCustomExpected(e.target.value)}
                      placeholder='e.g., 1'
                      className="h-8 text-xs bg-[#18181b] border-[#2e2e32] text-foreground font-mono mt-1"
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button
                    type="submit"
                    size="sm"
                    disabled={!customInput.trim()}
                    className="h-7 px-3 text-xs bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
                  >
                    <Plus className="w-3.5 h-3.5 mr-1" />
                    <span>Add Custom Test</span>
                  </Button>
                </div>
              </form>
            )}

            {/* List of Custom Tests */}
            <div className="space-y-2 font-mono">
              {customTests.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground text-xs border border-dashed border-[#2d2d31] rounded">
                  No custom test cases added yet. Add boundary or edge cases above to test your code.
                </div>
              ) : (
                customTests.map((ct, idx) => (
                  <div
                    key={ct.id}
                    className="flex items-center justify-between p-2.5 bg-[#121214] border border-[#2d2d31] rounded text-[11px]"
                  >
                    <div className="space-y-0.5 truncate mr-3">
                      <div className="text-[10px] font-sans text-muted-foreground">Custom Case #{idx + 1}</div>
                      <div className="truncate text-foreground">
                        <span className="text-muted-foreground">Input: </span>
                        {ct.input}
                      </div>
                      <div className="truncate text-emerald-400">
                        <span className="text-muted-foreground">Expected: </span>
                        {ct.expectedOutput}
                      </div>
                    </div>
                    {onDeleteCustomTest && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDeleteCustomTest(ct.id)}
                        className="h-7 w-7 text-muted-foreground hover:text-rose-400 shrink-0"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        ) : activeView === "console" ? (
          <div className="space-y-3 font-mono">
            {result?.compileOutput && (
              <div>
                <div className="text-muted-foreground text-[11px] mb-1">Compiler Output:</div>
                <pre className="p-2.5 bg-[#121214] border border-[#2d2d31] rounded text-[11px] text-emerald-400 whitespace-pre-wrap">
                  {result.compileOutput}
                </pre>
              </div>
            )}
            {result?.stdout && (
              <div>
                <div className="text-muted-foreground text-[11px] mb-1">Standard Output (stdout):</div>
                <pre className="p-2.5 bg-[#121214] border border-[#2d2d31] rounded text-[11px] text-zinc-300 whitespace-pre-wrap">
                  {result.stdout}
                </pre>
              </div>
            )}
            {result?.stderr && (
              <div>
                <div className="text-rose-400 text-[11px] mb-1">Error Output (stderr):</div>
                <pre className="p-2.5 bg-rose-950/20 border border-rose-800/40 rounded text-[11px] text-rose-300 whitespace-pre-wrap">
                  {result.stderr}
                </pre>
              </div>
            )}
            {!result?.stdout && !result?.stderr && !result?.compileOutput && (
              <div className="text-muted-foreground text-center py-6">
                No console output generated. Use standard output commands (e.g. console.log, print, cout) to inspect variables.
              </div>
            )}
          </div>
        ) : activeView === "complexity" ? (
          <div className="space-y-3 font-sans">
            <div className="p-3 bg-[#121214] border border-[#2d2d31] rounded-lg space-y-2">
              <h4 className="font-semibold text-foreground text-xs flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-primary" />
                <span>Complexity Benchmarks</span>
              </h4>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-2 bg-[#18181b] border border-[#2e2e32] rounded">
                  <div className="text-muted-foreground text-[10px] uppercase">Target Time Complexity</div>
                  <div className="text-foreground font-mono font-bold mt-0.5">
                    {expectedComplexity?.time || "O(n) or O(log n)"}
                  </div>
                </div>
                <div className="p-2 bg-[#18181b] border border-[#2e2e32] rounded">
                  <div className="text-muted-foreground text-[10px] uppercase">Target Space Complexity</div>
                  <div className="text-foreground font-mono font-bold mt-0.5">
                    {expectedComplexity?.space || "O(1) auxiliary"}
                  </div>
                </div>
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed pt-1">
                Placement assessments prioritize optimal Big-O bounds. In addition to passing public test cases, check for recursive call stack limits and unnecessary collections that increase memory overhead.
              </p>
            </div>
          </div>
        ) : (
          /* Active Tests View */
          <div className="space-y-3">
            {!result ? (
              <div className="flex flex-col items-center justify-center py-8 text-muted-foreground/60 text-center gap-2">
                <Terminal className="w-8 h-8 opacity-40" />
                <p className="text-xs font-medium">Run code to see test case outputs and execution details.</p>
                <span className="text-[11px] text-muted-foreground/50">
                  Shortcut: Press <kbd className="px-1 py-0.5 bg-muted rounded font-mono text-[10px]">Ctrl+Enter</kbd> to run
                </span>
              </div>
            ) : (
              <>
                {/* Public Test Case Selector Tabs */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-[#2d2d31]">
                  {publicResults.map((tc, idx) => (
                    <button
                      key={tc.testCaseId}
                      onClick={() => setSelectedTab(idx)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs transition-all font-mono ${
                        selectedTab === idx
                          ? "bg-[#2d2d31] text-foreground font-semibold border border-border/40"
                          : "bg-[#18181b] text-muted-foreground hover:bg-[#232327]"
                      }`}
                    >
                      {tc.passed ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      ) : (
                        <XCircle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                      )}
                      <span>Case {idx + 1}</span>
                    </button>
                  ))}

                  {/* Hidden Test Case Indicator */}
                  {hiddenResults.length > 0 && (
                    <div className="ml-auto flex items-center gap-1.5 px-2.5 py-1 rounded bg-primary/10 border border-primary/20 text-primary text-[11px] font-mono">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>
                        {hiddenPassed}/{hiddenResults.length} Hidden Tests Passed
                      </span>
                    </div>
                  )}
                </div>

                {/* Active Test Case Details */}
                {currentTestCase ? (
                  <div className="space-y-2.5 font-mono">
                    <div>
                      <div className="text-muted-foreground text-[11px] mb-1 font-sans">Input:</div>
                      <div className="p-2 bg-[#121214] border border-[#2d2d31] rounded text-[11px] text-zinc-300 whitespace-pre-wrap">
                        {currentTestCase.input}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <div className="text-muted-foreground text-[11px] mb-1 font-sans">Expected Output:</div>
                        <div className="p-2 bg-[#121214] border border-[#2d2d31] rounded text-[11px] text-emerald-400 whitespace-pre-wrap">
                          {currentTestCase.expectedOutput}
                        </div>
                      </div>

                      <div>
                        <div className="text-muted-foreground text-[11px] mb-1 font-sans">Actual Output:</div>
                        <div
                          className={`p-2 bg-[#121214] border rounded text-[11px] whitespace-pre-wrap ${
                            currentTestCase.passed
                              ? "border-[#2d2d31] text-emerald-400"
                              : "border-rose-800/40 text-rose-400"
                          }`}
                        >
                          {currentTestCase.actualOutput || "(none)"}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1">
                      <span>Execution: {currentTestCase.executionTimeMs} ms</span>
                      <span className={currentTestCase.passed ? "text-emerald-400 font-medium" : "text-rose-400 font-semibold"}>
                        {currentTestCase.passed ? "Passed" : "Wrong Answer"}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="text-muted-foreground">No test cases executed.</div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
