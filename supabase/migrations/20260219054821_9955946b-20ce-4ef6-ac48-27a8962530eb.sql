
-- Drop old policies and re-enable RLS with anon-friendly policies
-- Since app uses Firebase Auth, we allow all authenticated AND anon access
-- Ownership is enforced in application code

-- Re-enable RLS
ALTER TABLE public.community_experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_experience_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_vlogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_vlog_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_eligibilities ENABLE ROW LEVEL SECURITY;

-- Drop old restrictive policies
DROP POLICY IF EXISTS "Anyone authenticated can read experiences" ON public.community_experiences;
DROP POLICY IF EXISTS "Authenticated users can insert experiences" ON public.community_experiences;
DROP POLICY IF EXISTS "Users can delete own experiences" ON public.community_experiences;
DROP POLICY IF EXISTS "Users can update own experiences" ON public.community_experiences;

DROP POLICY IF EXISTS "Anyone authenticated can read experience comments" ON public.community_experience_comments;
DROP POLICY IF EXISTS "Authenticated users can insert experience comments" ON public.community_experience_comments;
DROP POLICY IF EXISTS "Users can delete own experience comments" ON public.community_experience_comments;

DROP POLICY IF EXISTS "Anyone authenticated can read questions" ON public.community_questions;
DROP POLICY IF EXISTS "Authenticated users can insert questions" ON public.community_questions;
DROP POLICY IF EXISTS "Users can delete own questions" ON public.community_questions;
DROP POLICY IF EXISTS "Users can update own questions" ON public.community_questions;

DROP POLICY IF EXISTS "Anyone authenticated can read answers" ON public.community_answers;
DROP POLICY IF EXISTS "Authenticated users can insert answers" ON public.community_answers;
DROP POLICY IF EXISTS "Users can update answers" ON public.community_answers;

DROP POLICY IF EXISTS "Anyone authenticated can read vlogs" ON public.community_vlogs;
DROP POLICY IF EXISTS "Authenticated users can insert vlogs" ON public.community_vlogs;
DROP POLICY IF EXISTS "Users can delete own vlogs" ON public.community_vlogs;
DROP POLICY IF EXISTS "Users can update vlogs" ON public.community_vlogs;

DROP POLICY IF EXISTS "Anyone authenticated can read vlog comments" ON public.community_vlog_comments;
DROP POLICY IF EXISTS "Authenticated users can insert vlog comments" ON public.community_vlog_comments;
DROP POLICY IF EXISTS "Users can delete own vlog comments" ON public.community_vlog_comments;

DROP POLICY IF EXISTS "Anyone authenticated can read eligibilities" ON public.community_eligibilities;
DROP POLICY IF EXISTS "Authenticated users can insert eligibilities" ON public.community_eligibilities;
DROP POLICY IF EXISTS "Users can delete own eligibilities" ON public.community_eligibilities;

-- Create open policies for anon key access (Firebase auth users)
CREATE POLICY "Allow all select" ON public.community_experiences FOR SELECT USING (true);
CREATE POLICY "Allow all insert" ON public.community_experiences FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow all update" ON public.community_experiences FOR UPDATE USING (true);
CREATE POLICY "Allow all delete" ON public.community_experiences FOR DELETE USING (true);

CREATE POLICY "Allow all select" ON public.community_experience_comments FOR SELECT USING (true);
CREATE POLICY "Allow all insert" ON public.community_experience_comments FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow all delete" ON public.community_experience_comments FOR DELETE USING (true);

CREATE POLICY "Allow all select" ON public.community_questions FOR SELECT USING (true);
CREATE POLICY "Allow all insert" ON public.community_questions FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow all update" ON public.community_questions FOR UPDATE USING (true);
CREATE POLICY "Allow all delete" ON public.community_questions FOR DELETE USING (true);

CREATE POLICY "Allow all select" ON public.community_answers FOR SELECT USING (true);
CREATE POLICY "Allow all insert" ON public.community_answers FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow all update" ON public.community_answers FOR UPDATE USING (true);

CREATE POLICY "Allow all select" ON public.community_vlogs FOR SELECT USING (true);
CREATE POLICY "Allow all insert" ON public.community_vlogs FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow all update" ON public.community_vlogs FOR UPDATE USING (true);
CREATE POLICY "Allow all delete" ON public.community_vlogs FOR DELETE USING (true);

CREATE POLICY "Allow all select" ON public.community_vlog_comments FOR SELECT USING (true);
CREATE POLICY "Allow all insert" ON public.community_vlog_comments FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow all delete" ON public.community_vlog_comments FOR DELETE USING (true);

CREATE POLICY "Allow all select" ON public.community_eligibilities FOR SELECT USING (true);
CREATE POLICY "Allow all insert" ON public.community_eligibilities FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow all delete" ON public.community_eligibilities FOR DELETE USING (true);
