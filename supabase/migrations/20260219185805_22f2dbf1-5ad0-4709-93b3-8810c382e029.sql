-- Fix RLS policies for tables that use auth.uid() but app uses Firebase Auth (text UIDs)
-- These tables were completely inaccessible to Firebase users

-- ── study_sessions ──
-- Drop old Supabase-auth-based policies
DROP POLICY IF EXISTS "Users can view their own sessions" ON public.study_sessions;
DROP POLICY IF EXISTS "Users can insert their own sessions" ON public.study_sessions;
DROP POLICY IF EXISTS "Users can delete their own sessions" ON public.study_sessions;

-- Allow open access (Firebase app-level auth enforces ownership)
CREATE POLICY "Allow all select on study_sessions" ON public.study_sessions FOR SELECT USING (true);
CREATE POLICY "Allow all insert on study_sessions" ON public.study_sessions FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow all update on study_sessions" ON public.study_sessions FOR UPDATE USING (true);
CREATE POLICY "Allow all delete on study_sessions" ON public.study_sessions FOR DELETE USING (true);

-- ── habits ──
DROP POLICY IF EXISTS "Users can view their own habits" ON public.habits;
DROP POLICY IF EXISTS "Users can insert their own habits" ON public.habits;
DROP POLICY IF EXISTS "Users can update their own habits" ON public.habits;
DROP POLICY IF EXISTS "Users can delete their own habits" ON public.habits;

CREATE POLICY "Allow all select on habits" ON public.habits FOR SELECT USING (true);
CREATE POLICY "Allow all insert on habits" ON public.habits FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow all update on habits" ON public.habits FOR UPDATE USING (true);
CREATE POLICY "Allow all delete on habits" ON public.habits FOR DELETE USING (true);

-- ── profiles ──
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

CREATE POLICY "Allow all select on profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Allow all insert on profiles" ON public.profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow all update on profiles" ON public.profiles FOR UPDATE USING (true);
CREATE POLICY "Allow all delete on profiles" ON public.profiles FOR DELETE USING (true);

-- ── community_answers: add missing DELETE policy ──
CREATE POLICY "Allow all delete on community_answers" ON public.community_answers FOR DELETE USING (true);

-- ── community_eligibilities: add missing UPDATE policy ──
CREATE POLICY "Allow all update on community_eligibilities" ON public.community_eligibilities FOR UPDATE USING (true);

-- ── community_experience_comments: add missing UPDATE policy ──
CREATE POLICY "Allow all update on community_experience_comments" ON public.community_experience_comments FOR UPDATE USING (true);

-- ── community_vlog_comments: add missing UPDATE policy ──
CREATE POLICY "Allow all update on community_vlog_comments" ON public.community_vlog_comments FOR UPDATE USING (true);