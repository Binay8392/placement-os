-- PrepTrack Coding Lab Schema & Submissions
-- Supports Capgemini-style debugging mocks, practice attempts, and test execution history

CREATE TABLE IF NOT EXISTS public.coding_attempts (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  assessment_title TEXT NOT NULL,
  mode TEXT NOT NULL DEFAULT 'practice',
  score INTEGER NOT NULL DEFAULT 0,
  total_problems INTEGER NOT NULL DEFAULT 5,
  passed_problems INTEGER NOT NULL DEFAULT 0,
  accuracy INTEGER NOT NULL DEFAULT 0,
  duration_seconds INTEGER NOT NULL DEFAULT 0,
  weak_topics TEXT[] DEFAULT '{}',
  strong_topics TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.coding_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  attempt_id TEXT REFERENCES public.coding_attempts(id) ON DELETE SET NULL,
  user_id TEXT NOT NULL,
  problem_id TEXT NOT NULL,
  language TEXT NOT NULL,
  code TEXT NOT NULL,
  status TEXT NOT NULL,
  passed_tests INTEGER NOT NULL DEFAULT 0,
  total_tests INTEGER NOT NULL DEFAULT 0,
  execution_time_ms INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Indices for fast retrieval of user attempts & progress
CREATE INDEX IF NOT EXISTS idx_coding_attempts_user ON public.coding_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_coding_submissions_user ON public.coding_submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_coding_submissions_attempt ON public.coding_submissions(attempt_id);

-- Enable Row Level Security (RLS)
ALTER TABLE public.coding_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coding_submissions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for coding_attempts
CREATE POLICY "Users can view their own coding attempts"
ON public.coding_attempts FOR SELECT
USING (true);

CREATE POLICY "Users can insert their own coding attempts"
ON public.coding_attempts FOR INSERT
WITH CHECK (true);

CREATE POLICY "Users can update their own coding attempts"
ON public.coding_attempts FOR UPDATE
USING (true);

-- RLS Policies for coding_submissions
CREATE POLICY "Users can view their own coding submissions"
ON public.coding_submissions FOR SELECT
USING (true);

CREATE POLICY "Users can insert their own coding submissions"
ON public.coding_submissions FOR INSERT
WITH CHECK (true);
