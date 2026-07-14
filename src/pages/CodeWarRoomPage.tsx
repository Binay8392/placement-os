import { useEffect, useMemo, useState } from 'react';
import {
  AlertCircle,
  BookOpenCheck,
  Building2,
  CheckCircle2,
  Eye,
  EyeOff,
  Filter,
  Loader2,
  LockKeyhole,
  Play,
  RotateCcw,
  Search,
  Send,
  ShieldCheck,
  Swords,
  TerminalSquare,
  TestTube2,
  XCircle,
} from 'lucide-react';
import {
  CODE_WAR_ROOM_CATEGORIES,
  CODE_WAR_ROOM_COMPANIES,
  CODE_WAR_ROOM_PROBLEMS,
  CODE_WAR_ROOM_TOTALS,
  type CodeWarRoomDifficulty,
  type CodeWarRoomProblem,
  type CodeWarRoomTestCase,
} from '@/data/codeWarRoom';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const difficultyStyles: Record<CodeWarRoomDifficulty, string> = {
  Easy: 'border-success/30 bg-success/10 text-success',
  Medium: 'border-warning/30 bg-warning/10 text-warning',
  Hard: 'border-destructive/30 bg-destructive/10 text-destructive',
};

type CodeEditorLanguage = 'javascript' | 'typescript' | 'python' | 'java' | 'cpp' | 'c';

const CODE_EDITOR_LANGUAGES: Array<{
  id: CodeEditorLanguage;
  label: string;
  runnable: boolean;
}> = [
  { id: 'javascript', label: 'JavaScript', runnable: true },
  { id: 'typescript', label: 'TypeScript', runnable: false },
  { id: 'python', label: 'Python', runnable: false },
  { id: 'java', label: 'Java', runnable: false },
  { id: 'cpp', label: 'C++', runnable: false },
  { id: 'c', label: 'C', runnable: false },
];

type RunScope = 'public' | 'submit';
type RunStatus = 'passed' | 'failed' | 'error' | 'review';

interface CaseRunResult {
  id: string;
  name: string;
  visibility: CodeWarRoomTestCase['visibility'];
  status: RunStatus;
  input: string;
  expected: string;
  actual: string;
  durationMs: number;
  error?: string;
  logs: string[];
}

interface RunSummary {
  scope: RunScope;
  total: number;
  passed: number;
  failed: number;
  errors: number;
  review: number;
  durationMs: number;
  results: CaseRunResult[];
}

interface ParsedAssignments {
  args: unknown[];
  names: string[];
}

interface WorkerSuccessPayload {
  ok: true;
  result: unknown;
  argsAfter: unknown[];
  logs: string[];
  durationMs: number;
}

interface WorkerErrorPayload {
  ok: false;
  error: string;
  logs: string[];
  durationMs: number;
}

type WorkerPayload = WorkerSuccessPayload | WorkerErrorPayload;

type ExpectedPattern =
  | { kind: 'exact'; values: unknown[] }
  | { kind: 'prefix'; length: number; prefix: unknown[] }
  | { kind: 'node-value'; value: unknown }
  | { kind: 'solutions'; count: number }
  | { kind: 'assignments'; values: Record<string, unknown> }
  | { kind: 'manual' };

const AUTO_RUN_TIMEOUT_MS = 2200;

const toSnakeCase = (value: string) =>
  value
    .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
    .replace(/[^a-zA-Z0-9]+/g, '_')
    .toLowerCase();

const buildLanguageStarterCode = (problem: CodeWarRoomProblem, language: CodeEditorLanguage) => {
  const params = problem.parameters.join(', ');
  const typedParams = problem.parameters.map((param) => `${param}: unknown`).join(', ');
  const snakeName = toSnakeCase(problem.functionName);
  const javaParams = problem.parameters.map((param) => `Object ${param}`).join(', ');
  const cParams = problem.parameters.map((param) => `void* ${param}`).join(', ');
  const cppParams = problem.parameters.map((param) => `auto ${param}`).join(', ');

  if (language === 'javascript') return problem.starterCode;

  if (language === 'typescript') {
    return `function ${problem.functionName}(${typedParams}): unknown {
  // Write your solution here
  return null;
}`;
  }

  if (language === 'python') {
    return `def ${snakeName}(${params}):
    # Write your solution here
    return None`;
  }

  if (language === 'java') {
    return `class Solution {
    public Object ${problem.functionName}(${javaParams}) {
        // Write your solution here
        return null;
    }
}`;
  }

  if (language === 'cpp') {
    return `class Solution {
public:
    auto ${problem.functionName}(${cppParams}) {
        // Write your solution here
        return nullptr;
    }
};`;
  }

  return `void* ${problem.functionName}(${cParams}) {
    // Write your solution here
    return 0;
}`;
};

const splitTopLevel = (value: string, delimiter = ',') => {
  const parts: string[] = [];
  let current = '';
  let depth = 0;
  let quote: string | null = null;
  let escaping = false;

  for (const char of value) {
    if (quote) {
      current += char;
      if (escaping) {
        escaping = false;
      } else if (char === '\\') {
        escaping = true;
      } else if (char === quote) {
        quote = null;
      }
      continue;
    }

    if (char === '"' || char === "'" || char === '`') {
      quote = char;
      current += char;
      continue;
    }

    if (char === '[' || char === '{' || char === '(') depth += 1;
    if (char === ']' || char === '}' || char === ')') depth = Math.max(0, depth - 1);

    if (char === delimiter && depth === 0) {
      parts.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }

  if (current.trim()) parts.push(current.trim());
  return parts;
};

const splitExpectedAlternatives = (value: string) => {
  const parts: string[] = [];
  let current = '';
  let depth = 0;
  let quote: string | null = null;
  let escaping = false;

  for (let index = 0; index < value.length; index += 1) {
    const char = value[index];

    if (quote) {
      current += char;
      if (escaping) {
        escaping = false;
      } else if (char === '\\') {
        escaping = true;
      } else if (char === quote) {
        quote = null;
      }
      continue;
    }

    if (char === '"' || char === "'" || char === '`') {
      quote = char;
      current += char;
      continue;
    }

    if (char === '[' || char === '{' || char === '(') depth += 1;
    if (char === ']' || char === '}' || char === ')') depth = Math.max(0, depth - 1);

    if (depth === 0 && value.slice(index, index + 4) === ' or ') {
      parts.push(current.trim());
      current = '';
      index += 3;
    } else {
      current += char;
    }
  }

  if (current.trim()) parts.push(current.trim());
  return parts;
};

const evaluateLiteral = (expression: string): unknown => {
  const trimmed = expression.trim();

  if (/^[01]{8,}$/.test(trimmed)) {
    return Number.parseInt(trimmed, 2);
  }

  const tupleSafeExpression =
    trimmed.startsWith('[') && trimmed.includes('(')
      ? trimmed.replace(/\(([^()[\]]+,[^()[\]]+)\)/g, '[$1]')
      : trimmed;

  return Function(`"use strict"; return (${tupleSafeExpression});`)();
};

const parseAssignments = (input: string): ParsedAssignments => {
  const names: string[] = [];
  const args: unknown[] = [];
  const parts = splitTopLevel(input);

  for (const part of parts) {
    const match = part.match(/^\s*([A-Za-z_$][\w$]*)\s*=\s*([\s\S]+)$/);

    if (!match) {
      throw new Error(`Could not parse input assignment: ${part}`);
    }

    names.push(match[1]);
    args.push(evaluateLiteral(match[2]));
  }

  return { args, names };
};

const parseExpected = (output: string): ExpectedPattern => {
  const trimmed = output.trim();
  const prefixMatch = trimmed.match(/^length\s*=\s*(\d+),\s*[^=]*prefix\s*=\s*([\s\S]+)$/i);
  if (prefixMatch) {
    return {
      kind: 'prefix',
      length: Number(prefixMatch[1]),
      prefix: evaluateLiteral(prefixMatch[2]) as unknown[],
    };
  }

  const nodeMatch = trimmed.match(/^node with value\s+(.+)$/i);
  if (nodeMatch) {
    return { kind: 'node-value', value: evaluateLiteral(nodeMatch[1]) };
  }

  const solutionsMatch = trimmed.match(/^(\d+)\s+solutions?$/i);
  if (solutionsMatch) {
    return { kind: 'solutions', count: Number(solutionsMatch[1]) };
  }

  const assignmentParts = splitTopLevel(trimmed);
  if (assignmentParts.length > 1 && assignmentParts.every((part) => /^\s*[A-Za-z_$][\w$]*\s*=/.test(part))) {
    return {
      kind: 'assignments',
      values: Object.fromEntries(
        assignmentParts.map((part) => {
          const [, name, expression] = part.match(/^\s*([A-Za-z_$][\w$]*)\s*=\s*([\s\S]+)$/) || [];
          return [name, evaluateLiteral(expression)];
        }),
      ),
    };
  }

  const exactValues: unknown[] = [];
  for (const alternative of splitExpectedAlternatives(trimmed)) {
    try {
      exactValues.push(evaluateLiteral(alternative));
    } catch {
      // Text-only expectations are shown as manual review.
    }
  }

  return exactValues.length > 0 ? { kind: 'exact', values: exactValues } : { kind: 'manual' };
};

const stableStringify = (value: unknown): string => {
  if (value === undefined) return 'undefined';
  if (typeof value === 'number' && Number.isNaN(value)) return 'NaN';
  if (value === Infinity) return 'Infinity';
  if (value === -Infinity) return '-Infinity';
  if (typeof value !== 'object' || value === null) return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map((item) => stableStringify(item)).join(',')}]`;

  const record = value as Record<string, unknown>;
  return `{${Object.keys(record)
    .sort()
    .map((key) => `${JSON.stringify(key)}:${stableStringify(record[key])}`)
    .join(',')}}`;
};

const formatValue = (value: unknown) => {
  const formatted = stableStringify(value);
  return formatted === undefined ? String(value) : formatted;
};

const valuesEqual = (left: unknown, right: unknown) => stableStringify(left) === stableStringify(right);

const getObjectValue = (value: unknown, key: string) => {
  if (!value || typeof value !== 'object') return undefined;
  return (value as Record<string, unknown>)[key];
};

const compareResult = (
  expected: ExpectedPattern,
  result: unknown,
  argsAfter: unknown[],
): { status: RunStatus; actual: string } => {
  const firstArg = argsAfter[0];
  const candidates = [result, firstArg, argsAfter];

  if (expected.kind === 'manual') {
    return { status: 'review', actual: formatValue(result) };
  }

  if (expected.kind === 'exact') {
    const passed = expected.values.some((expectedValue) =>
      candidates.some((candidate) => valuesEqual(candidate, expectedValue)),
    );
    return { status: passed ? 'passed' : 'failed', actual: formatValue(result) };
  }

  if (expected.kind === 'prefix') {
    const mutatedPrefixMatches =
      Array.isArray(firstArg) &&
      firstArg.slice(0, expected.length).every((item, index) => valuesEqual(item, expected.prefix[index]));
    const lengthMatches = valuesEqual(result, expected.length) || valuesEqual(getObjectValue(result, 'length'), expected.length);
    const resultPrefix = getObjectValue(result, 'prefix');
    const objectPrefixMatches =
      Array.isArray(resultPrefix) && resultPrefix.every((item, index) => valuesEqual(item, expected.prefix[index]));
    const arrayPrefixMatches =
      Array.isArray(result) && result.slice(0, expected.length).every((item, index) => valuesEqual(item, expected.prefix[index]));

    return {
      status: (lengthMatches && mutatedPrefixMatches) || objectPrefixMatches || arrayPrefixMatches ? 'passed' : 'failed',
      actual: formatValue(result),
    };
  }

  if (expected.kind === 'node-value') {
    const passed =
      valuesEqual(result, expected.value) ||
      valuesEqual(getObjectValue(result, 'val'), expected.value) ||
      valuesEqual(getObjectValue(result, 'value'), expected.value);

    return { status: passed ? 'passed' : 'failed', actual: formatValue(result) };
  }

  if (expected.kind === 'solutions') {
    const passed =
      valuesEqual(result, expected.count) ||
      (Array.isArray(result) && result.length === expected.count) ||
      valuesEqual(getObjectValue(result, 'count'), expected.count);

    return { status: passed ? 'passed' : 'failed', actual: formatValue(result) };
  }

  const resultRecord = result && typeof result === 'object' ? (result as Record<string, unknown>) : null;
  const expectedValues = Object.values(expected.values);
  const passed =
    (resultRecord && Object.entries(expected.values).every(([key, value]) => valuesEqual(resultRecord[key], value))) ||
    (Array.isArray(result) && expectedValues.every((value, index) => valuesEqual(result[index], value)));

  return { status: passed ? 'passed' : 'failed', actual: formatValue(result) };
};

const extractRunnableName = (code: string, fallback: string) => {
  const functionMatch = code.match(/function\s+([A-Za-z_$][\w$]*)\s*\(/);
  if (functionMatch) return functionMatch[1];

  const assignmentMatch = code.match(/(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=/);
  if (assignmentMatch) return assignmentMatch[1];

  return fallback;
};

const runCodeInWorker = (code: string, functionName: string, args: unknown[]): Promise<WorkerPayload> => {
  const workerSource = `
    const formatForLog = (value) => {
      if (typeof value === 'string') return value;
      try { return JSON.stringify(value); } catch { return String(value); }
    };

    self.onmessage = async (event) => {
      const started = performance.now();
      const { code, functionName, args } = event.data;
      const logs = [];
      const capturedConsole = {
        log: (...items) => logs.push(items.map(formatForLog).join(' ')),
        warn: (...items) => logs.push(items.map(formatForLog).join(' ')),
        error: (...items) => logs.push(items.map(formatForLog).join(' ')),
      };

      try {
        const module = { exports: {} };
        const exports = module.exports;
        const factory = new Function(
          'module',
          'exports',
          'console',
          '__functionName',
          code + "\\n; const __candidate = (() => { try { return eval(__functionName); } catch (_) { return undefined; } })(); return typeof __candidate === 'function' ? __candidate : (typeof module.exports === 'function' ? module.exports : module.exports.default);"
        );
        const fn = factory(module, exports, capturedConsole, functionName);

        if (typeof fn !== 'function') {
          throw new Error('No runnable function found. Keep the starter function name or export a function.');
        }

        const result = await fn(...args);
        self.postMessage({ ok: true, result, argsAfter: args, logs, durationMs: Math.round(performance.now() - started) });
      } catch (error) {
        self.postMessage({
          ok: false,
          error: error instanceof Error ? error.message : String(error),
          logs,
          durationMs: Math.round(performance.now() - started),
        });
      }
    };
  `;

  const blobUrl = URL.createObjectURL(new Blob([workerSource], { type: 'application/javascript' }));
  const worker = new Worker(blobUrl);

  return new Promise((resolve) => {
    const timeoutId = window.setTimeout(() => {
      worker.terminate();
      URL.revokeObjectURL(blobUrl);
      resolve({
        ok: false,
        error: `Time Limit Exceeded after ${AUTO_RUN_TIMEOUT_MS}ms`,
        logs: [],
        durationMs: AUTO_RUN_TIMEOUT_MS,
      });
    }, AUTO_RUN_TIMEOUT_MS);

    worker.onmessage = (event: MessageEvent<WorkerPayload>) => {
      window.clearTimeout(timeoutId);
      worker.terminate();
      URL.revokeObjectURL(blobUrl);
      resolve(event.data);
    };

    worker.onerror = (event) => {
      window.clearTimeout(timeoutId);
      worker.terminate();
      URL.revokeObjectURL(blobUrl);
      resolve({
        ok: false,
        error: event.message || 'Runtime error',
        logs: [],
        durationMs: 0,
      });
    };

    worker.postMessage({ code, functionName, args });
  });
};

async function executeCase(
  code: string,
  functionName: string,
  testCase: CodeWarRoomTestCase,
): Promise<CaseRunResult> {
  const started = performance.now();

  try {
    const parsedInput = parseAssignments(testCase.input);
    const expected = parseExpected(testCase.output);
    const payload = await runCodeInWorker(code, functionName, structuredClone(parsedInput.args));

    if (!payload.ok) {
      return {
        id: testCase.id,
        name: testCase.name,
        visibility: testCase.visibility,
        status: 'error',
        input: testCase.input,
        expected: testCase.output,
        actual: 'Runtime error',
        durationMs: payload.durationMs || Math.round(performance.now() - started),
        error: payload.error,
        logs: payload.logs,
      };
    }

    const verdict = compareResult(expected, payload.result, payload.argsAfter);

    return {
      id: testCase.id,
      name: testCase.name,
      visibility: testCase.visibility,
      status: verdict.status,
      input: testCase.input,
      expected: testCase.output,
      actual: verdict.actual,
      durationMs: payload.durationMs,
      logs: payload.logs,
    };
  } catch (error) {
    return {
      id: testCase.id,
      name: testCase.name,
      visibility: testCase.visibility,
      status: 'error',
      input: testCase.input,
      expected: testCase.output,
      actual: 'Could not run case',
      durationMs: Math.round(performance.now() - started),
      error: error instanceof Error ? error.message : String(error),
      logs: [],
    };
  }
}

function RunResultsPanel({ summary }: { summary: RunSummary | null }) {
  if (!summary) return null;

  const accepted = summary.passed === summary.total && summary.review === 0 && summary.errors === 0 && summary.failed === 0;
  const hasReviewOnly = summary.review > 0 && summary.failed === 0 && summary.errors === 0;

  return (
    <section className="rounded-lg border border-border bg-background/60">
      <div className="flex flex-col gap-3 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span
            className={cn(
              'flex h-10 w-10 items-center justify-center rounded-lg',
              accepted
                ? 'bg-success/10 text-success'
                : hasReviewOnly
                  ? 'bg-warning/10 text-warning'
                  : 'bg-destructive/10 text-destructive',
            )}
          >
            {accepted ? <CheckCircle2 className="h-5 w-5" /> : hasReviewOnly ? <AlertCircle className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
          </span>
          <div>
            <p className="font-semibold">
              {accepted ? 'Accepted' : hasReviewOnly ? 'Needs Manual Review' : 'Wrong Answer'}
            </p>
            <p className="text-xs text-muted-foreground">
              {summary.scope === 'submit' ? 'Public + private tests' : 'Public tests'} completed in {summary.durationMs}ms
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="border-success/30 bg-success/10 text-success">
            Passed {summary.passed}
          </Badge>
          <Badge variant="outline" className="border-destructive/30 bg-destructive/10 text-destructive">
            Failed {summary.failed}
          </Badge>
          <Badge variant="outline" className="border-warning/30 bg-warning/10 text-warning">
            Review {summary.review}
          </Badge>
        </div>
      </div>

      <div className="space-y-3 p-4">
        {summary.results.map((result) => (
          <div key={result.id} className="rounded-lg border border-border bg-card">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-3 py-2">
              <div className="flex items-center gap-2">
                {result.status === 'passed' ? (
                  <CheckCircle2 className="h-4 w-4 text-success" />
                ) : result.status === 'review' ? (
                  <AlertCircle className="h-4 w-4 text-warning" />
                ) : (
                  <XCircle className="h-4 w-4 text-destructive" />
                )}
                <span className="text-sm font-semibold">{result.name}</span>
                <Badge variant="outline" className="capitalize">
                  {result.visibility}
                </Badge>
              </div>
              <span className="text-xs text-muted-foreground">{result.durationMs}ms</span>
            </div>
            <div className="grid gap-0 lg:grid-cols-3">
              <div className="border-b border-border p-3 lg:border-b-0 lg:border-r">
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Input</p>
                <pre className="whitespace-pre-wrap break-words text-xs leading-relaxed">{result.input}</pre>
              </div>
              <div className="border-b border-border p-3 lg:border-b-0 lg:border-r">
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Expected</p>
                <pre className="whitespace-pre-wrap break-words text-xs leading-relaxed">{result.expected}</pre>
              </div>
              <div className="p-3">
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Your Output</p>
                <pre className="whitespace-pre-wrap break-words text-xs leading-relaxed">
                  {result.error || result.actual}
                </pre>
                {result.logs.length > 0 && (
                  <div className="mt-3 rounded-md bg-muted/50 p-2">
                    <p className="mb-1 text-xs font-semibold text-muted-foreground">Console</p>
                    <pre className="whitespace-pre-wrap break-words text-xs">{result.logs.join('\n')}</pre>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function TestCaseBlock({ cases }: { cases: CodeWarRoomTestCase[] }) {
  return (
    <div className="space-y-3">
      {cases.map((testCase) => (
        <div key={testCase.id} className="rounded-lg border border-border bg-muted/20">
          <div className="flex items-center justify-between border-b border-border px-3 py-2">
            <div className="flex items-center gap-2">
              <TestTube2 className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold">{testCase.name}</span>
            </div>
            <Badge variant="outline" className="capitalize">
              {testCase.visibility}
            </Badge>
          </div>
          <div className="grid gap-0 md:grid-cols-2">
            <div className="border-b border-border p-3 md:border-b-0 md:border-r">
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Input</p>
              <pre className="whitespace-pre-wrap break-words rounded-md bg-background p-3 text-xs leading-relaxed text-foreground">
                {testCase.input}
              </pre>
            </div>
            <div className="p-3">
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Output</p>
              <pre className="whitespace-pre-wrap break-words rounded-md bg-background p-3 text-xs leading-relaxed text-foreground">
                {testCase.output}
              </pre>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function ProblemListItem({
  problem,
  active,
  onSelect,
}: {
  problem: CodeWarRoomProblem;
  active: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        'w-full border-b border-border px-4 py-3 text-left transition-colors last:border-b-0 hover:bg-muted/50',
        active && 'bg-primary/10',
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">
            {problem.order}. {problem.title}
          </p>
          <p className="mt-1 truncate text-xs text-muted-foreground">
            {problem.categoryTitle} - {problem.companyTags[0]}
          </p>
        </div>
        <Badge variant="outline" className={cn('shrink-0', difficultyStyles[problem.difficulty])}>
          {problem.difficulty}
        </Badge>
      </div>
    </button>
  );
}

export default function CodeWarRoomPage() {
  const [query, setQuery] = useState('');
  const [categoryId, setCategoryId] = useState('all');
  const [companyId, setCompanyId] = useState('all');
  const [difficulty, setDifficulty] = useState<'all' | CodeWarRoomDifficulty>('all');
  const [selectedId, setSelectedId] = useState(CODE_WAR_ROOM_PROBLEMS[0]?.id || '');
  const [selectedLanguage, setSelectedLanguage] = useState<CodeEditorLanguage>('javascript');
  const [revealPrivate, setRevealPrivate] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [runSummary, setRunSummary] = useState<RunSummary | null>(null);

  const filteredProblems = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return CODE_WAR_ROOM_PROBLEMS.filter((problem) => {
      const matchesCategory = categoryId === 'all' || problem.categoryId === categoryId;
      const selectedCompany = CODE_WAR_ROOM_COMPANIES.find((company) => company.id === companyId);
      const matchesCompany = companyId === 'all' || Boolean(selectedCompany && problem.companyTags.includes(selectedCompany.label));
      const matchesDifficulty = difficulty === 'all' || problem.difficulty === difficulty;
      const matchesQuery =
        !normalizedQuery ||
        problem.title.toLowerCase().includes(normalizedQuery) ||
        problem.categoryTitle.toLowerCase().includes(normalizedQuery) ||
        problem.tags.some((tag) => tag.toLowerCase().includes(normalizedQuery)) ||
        problem.companyTags.some((tag) => tag.toLowerCase().includes(normalizedQuery));

      return matchesCategory && matchesCompany && matchesDifficulty && matchesQuery;
    });
  }, [categoryId, companyId, difficulty, query]);

  const selectedProblem = useMemo(() => {
    return (
      CODE_WAR_ROOM_PROBLEMS.find((problem) => problem.id === selectedId) ||
      filteredProblems[0] ||
      CODE_WAR_ROOM_PROBLEMS[0]
    );
  }, [filteredProblems, selectedId]);

  const selectedLanguageConfig = CODE_EDITOR_LANGUAGES.find((language) => language.id === selectedLanguage) || CODE_EDITOR_LANGUAGES[0];
  const currentStarterCode = buildLanguageStarterCode(selectedProblem, selectedLanguage);
  const canRunSelectedLanguage = selectedLanguageConfig.runnable;

  const [code, setCode] = useState(currentStarterCode);

  useEffect(() => {
    if (filteredProblems.length > 0 && !filteredProblems.some((problem) => problem.id === selectedId)) {
      setSelectedId(filteredProblems[0].id);
    }
  }, [filteredProblems, selectedId]);

  useEffect(() => {
    setCode(currentStarterCode);
    setRevealPrivate(false);
    setRunSummary(null);
  }, [currentStarterCode, selectedProblem.id]);

  const difficultyCounts = useMemo(() => {
    return CODE_WAR_ROOM_PROBLEMS.reduce(
      (counts, problem) => {
        counts[problem.difficulty] += 1;
        return counts;
      },
      { Easy: 0, Medium: 0, Hard: 0 } as Record<CodeWarRoomDifficulty, number>,
    );
  }, []);

  const handleRun = async (scope: RunScope) => {
    if (isRunning || !canRunSelectedLanguage) return;

    setIsRunning(true);
    setRunSummary(null);

    const started = performance.now();
    const runnableName = extractRunnableName(code, selectedProblem.functionName);
    const cases =
      scope === 'submit'
        ? [...selectedProblem.publicTestCases, ...selectedProblem.privateTestCases]
        : selectedProblem.publicTestCases;
    const results: CaseRunResult[] = [];

    for (const testCase of cases) {
      results.push(await executeCase(code, runnableName, testCase));
    }

    setRunSummary({
      scope,
      total: results.length,
      passed: results.filter((result) => result.status === 'passed').length,
      failed: results.filter((result) => result.status === 'failed').length,
      errors: results.filter((result) => result.status === 'error').length,
      review: results.filter((result) => result.status === 'review').length,
      durationMs: Math.round(performance.now() - started),
      results,
    });
    setIsRunning(false);
  };

  return (
    <div className="min-h-screen pb-24 md:pb-10">
      <header className="border-b border-border bg-card/40 px-4 py-5 backdrop-blur sm:px-6 xl:px-8">
        <div className="mx-auto flex max-w-[1600px] flex-col gap-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Swords className="h-5 w-5" />
                </span>
                <div>
                  <h1 className="text-2xl font-bold tracking-normal">Code War Room</h1>
                  <p className="text-sm text-muted-foreground">LeetCode-style placement practice</p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-5 lg:min-w-[680px]">
              <div className="rounded-lg border border-border bg-background/60 p-3">
                <p className="text-xl font-bold">{CODE_WAR_ROOM_TOTALS.questions}</p>
                <p className="text-xs text-muted-foreground">Questions</p>
              </div>
              <div className="rounded-lg border border-border bg-background/60 p-3">
                <p className="text-xl font-bold">{CODE_WAR_ROOM_TOTALS.categories}</p>
                <p className="text-xs text-muted-foreground">Topics</p>
              </div>
              <div className="rounded-lg border border-border bg-background/60 p-3">
                <p className="text-xl font-bold text-primary">{CODE_WAR_ROOM_TOTALS.companies}</p>
                <p className="text-xs text-muted-foreground">Company PYQ</p>
              </div>
              <div className="rounded-lg border border-border bg-background/60 p-3">
                <p className="text-xl font-bold text-success">{CODE_WAR_ROOM_TOTALS.publicCases}</p>
                <p className="text-xs text-muted-foreground">Public Tests</p>
              </div>
              <div className="rounded-lg border border-border bg-background/60 p-3">
                <p className="text-xl font-bold text-warning">{CODE_WAR_ROOM_TOTALS.privateCases}</p>
                <p className="text-xs text-muted-foreground">Private Tests</p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className={cn('border-success/30 bg-success/10 text-success')}>
              Easy {difficultyCounts.Easy}
            </Badge>
            <Badge variant="outline" className={cn('border-warning/30 bg-warning/10 text-warning')}>
              Medium {difficultyCounts.Medium}
            </Badge>
            <Badge variant="outline" className={cn('border-destructive/30 bg-destructive/10 text-destructive')}>
              Hard {difficultyCounts.Hard}
            </Badge>
            {CODE_WAR_ROOM_COMPANIES.slice(0, 6).map((company) => (
              <Badge key={company.id} variant="secondary">
                {company.label}
              </Badge>
            ))}
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-[1600px] gap-4 px-4 py-4 sm:px-6 xl:grid-cols-[380px_minmax(0,1fr)] xl:px-8">
        <aside className="min-w-0 space-y-3 xl:sticky xl:top-20 xl:h-[calc(100vh-6rem)]">
          <section className="rounded-lg border border-border bg-card">
            <div className="space-y-3 border-b border-border p-3">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search problems"
                  className="pl-9"
                />
              </div>
              <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-1">
                <Select value={categoryId} onValueChange={setCategoryId}>
                  <SelectTrigger aria-label="Filter by topic">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Topics</SelectItem>
                    {CODE_WAR_ROOM_CATEGORIES.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.title} ({category.questions.length})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={companyId} onValueChange={setCompanyId}>
                  <SelectTrigger aria-label="Filter by company previous year set">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Company PYQs</SelectItem>
                    {CODE_WAR_ROOM_COMPANIES.map((company) => (
                      <SelectItem key={company.id} value={company.id}>
                        {company.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={difficulty} onValueChange={(value) => setDifficulty(value as 'all' | CodeWarRoomDifficulty)}>
                  <SelectTrigger aria-label="Filter by difficulty">
                    <ShieldCheck className="h-4 w-4 text-muted-foreground" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Difficulties</SelectItem>
                    <SelectItem value="Easy">Easy</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center justify-between border-b border-border px-4 py-2">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Question Bank</p>
              <Badge variant="secondary">{filteredProblems.length}</Badge>
            </div>

            <div className="max-h-[420px] overflow-y-auto xl:max-h-[calc(100vh-18rem)]">
              {filteredProblems.length > 0 ? (
                filteredProblems.map((problem) => (
                  <ProblemListItem
                    key={problem.id}
                    problem={problem}
                    active={problem.id === selectedProblem.id}
                    onSelect={() => setSelectedId(problem.id)}
                  />
                ))
              ) : (
                <div className="p-6 text-center text-sm text-muted-foreground">No matching problems</div>
              )}
            </div>
          </section>
        </aside>

        <section className="min-w-0 rounded-lg border border-border bg-card">
          <div className="border-b border-border p-4 sm:p-5">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
              <div className="min-w-0">
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <Badge variant="outline">{selectedProblem.categoryTitle}</Badge>
                  <Badge variant="outline" className={cn(difficultyStyles[selectedProblem.difficulty])}>
                    {selectedProblem.difficulty}
                  </Badge>
                  <Badge variant="secondary">
                    #{selectedProblem.order}
                  </Badge>
                  {selectedProblem.companyTags.slice(0, 3).map((companyTag) => (
                    <Badge key={companyTag} variant="outline" className="border-primary/30 bg-primary/10 text-primary">
                      {companyTag}
                    </Badge>
                  ))}
                </div>
                <h2 className="break-words text-xl font-bold tracking-normal sm:text-2xl">{selectedProblem.title}</h2>
              </div>
              <div className="grid grid-cols-2 gap-2 sm:min-w-64">
                <div className="rounded-lg border border-border bg-background/70 p-3">
                  <p className="text-lg font-bold">{selectedProblem.publicTestCases.length}</p>
                  <p className="text-xs text-muted-foreground">Public</p>
                </div>
                <div className="rounded-lg border border-border bg-background/70 p-3">
                  <p className="text-lg font-bold">{selectedProblem.privateTestCases.length}</p>
                  <p className="text-xs text-muted-foreground">Private</p>
                </div>
              </div>
            </div>
          </div>

          <Tabs defaultValue="description" className="min-w-0">
            <div className="border-b border-border px-4 pt-4 sm:px-5">
              <TabsList className="grid h-auto w-full grid-cols-3 sm:w-[420px]">
                <TabsTrigger value="description" className="gap-2">
                  <BookOpenCheck className="h-4 w-4" />
                  Statement
                </TabsTrigger>
                <TabsTrigger value="tests" className="gap-2">
                  <TestTube2 className="h-4 w-4" />
                  Tests
                </TabsTrigger>
                <TabsTrigger value="code" className="gap-2">
                  <TerminalSquare className="h-4 w-4" />
                  Code
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="description" className="m-0 p-4 sm:p-5">
              <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
                <div className="space-y-4">
                  <section className="rounded-lg border border-border bg-background/60 p-4">
                    <h3 className="mb-2 text-sm font-semibold">Problem</h3>
                    <p className="text-sm leading-6 text-muted-foreground">{selectedProblem.prompt}</p>
                    <div className="mt-4 rounded-md border border-border bg-card p-3">
                      <p className="mb-1 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                        Function Signature
                      </p>
                      <code className="break-words text-sm">
                        {selectedProblem.functionName}({selectedProblem.parameters.join(', ')})
                      </code>
                    </div>
                  </section>

                  <section className="rounded-lg border border-border bg-background/60 p-4">
                    <h3 className="mb-3 text-sm font-semibold">Constraints</h3>
                    <ul className="space-y-2">
                      {selectedProblem.constraints.map((constraint) => (
                        <li key={constraint} className="flex gap-2 text-sm leading-6 text-muted-foreground">
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                          <span>{constraint}</span>
                        </li>
                      ))}
                    </ul>
                  </section>
                </div>

                <section className="rounded-lg border border-border bg-background/60 p-4">
                  <h3 className="mb-3 text-sm font-semibold">Topic Snapshot</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Track</p>
                      <p className="mt-1 text-sm font-medium">{selectedProblem.categoryTitle}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Difficulty</p>
                      <p className="mt-1 text-sm font-medium">{selectedProblem.difficulty}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Tags</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {selectedProblem.tags.map((tag) => (
                          <Badge key={tag} variant="secondary">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Company PYQ Sets</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {selectedProblem.companyTags.map((companyTag) => (
                          <Badge key={companyTag} variant="outline" className="border-primary/30 bg-primary/10 text-primary">
                            {companyTag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            </TabsContent>

            <TabsContent value="tests" className="m-0 p-4 sm:p-5">
              <div className="grid gap-4 xl:grid-cols-2">
                <section className="min-w-0">
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="text-sm font-semibold">Public Test Cases</h3>
                    <Badge variant="outline">{selectedProblem.publicTestCases.length}</Badge>
                  </div>
                  <TestCaseBlock cases={selectedProblem.publicTestCases} />
                </section>

                <section className="min-w-0">
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="text-sm font-semibold">Private Test Cases</h3>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setRevealPrivate((value) => !value)}
                    >
                      {revealPrivate ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      {revealPrivate ? 'Hide' : 'Reveal'}
                    </Button>
                  </div>

                  {revealPrivate ? (
                    <TestCaseBlock cases={selectedProblem.privateTestCases} />
                  ) : (
                    <div className="flex min-h-52 flex-col items-center justify-center rounded-lg border border-dashed border-border bg-muted/20 p-6 text-center">
                      <LockKeyhole className="mb-3 h-8 w-8 text-muted-foreground" />
                      <p className="text-sm font-semibold">Private case locked</p>
                      <p className="mt-1 max-w-sm text-xs leading-5 text-muted-foreground">
                        {selectedProblem.privateTestCases.length} hardcoded hidden case is attached to this problem.
                      </p>
                    </div>
                  )}
                </section>
              </div>
            </TabsContent>

            <TabsContent value="code" className="m-0 p-4 sm:p-5">
              <div className="space-y-4">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <h3 className="text-sm font-semibold">Starter Code</h3>
                    <p className="text-xs text-muted-foreground">
                      {selectedProblem.functionName}({selectedProblem.parameters.join(', ')})
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-end sm:justify-end">
                    <div className="w-full sm:w-48">
                      <p className="mb-1.5 text-xs font-semibold text-muted-foreground">Choose language</p>
                      <Select
                        value={selectedLanguage}
                        onValueChange={(value) => setSelectedLanguage(value as CodeEditorLanguage)}
                      >
                        <SelectTrigger aria-label="Choose language">
                          <TerminalSquare className="h-4 w-4 text-muted-foreground" />
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {CODE_EDITOR_LANGUAGES.map((language) => (
                            <SelectItem key={language.id} value={language.id}>
                              {language.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => void handleRun('public')}
                      disabled={isRunning || !canRunSelectedLanguage}
                    >
                      {isRunning ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
                      Run Public
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => void handleRun('submit')}
                      disabled={isRunning || !canRunSelectedLanguage}
                    >
                      {isRunning ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                      Submit
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setCode(currentStarterCode);
                        setRunSummary(null);
                      }}
                      disabled={isRunning}
                    >
                      <RotateCcw className="h-4 w-4" />
                      Reset
                    </Button>
                  </div>
                </div>
                <Textarea
                  value={code}
                  onChange={(event) => setCode(event.target.value)}
                  spellCheck={false}
                  className="min-h-[360px] resize-y font-mono text-sm leading-6"
                />
                {!canRunSelectedLanguage && (
                  <div className="rounded-lg border border-warning/30 bg-warning/10 p-3 text-sm text-warning">
                    Browser runner is available for JavaScript. {selectedLanguageConfig.label} is provided as a starter template.
                  </div>
                )}
                <RunResultsPanel summary={runSummary} />
              </div>
            </TabsContent>
          </Tabs>
        </section>
      </main>
    </div>
  );
}
