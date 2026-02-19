
-- Disable RLS on community tables since app uses Firebase Auth, not Supabase Auth
-- Ownership checks are handled in application code

ALTER TABLE public.community_experiences DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_experience_comments DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_questions DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_answers DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_vlogs DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_vlog_comments DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_eligibilities DISABLE ROW LEVEL SECURITY;
