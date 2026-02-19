
-- Community Experiences
CREATE TABLE public.community_experiences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  username TEXT NOT NULL,
  company TEXT NOT NULL,
  role TEXT NOT NULL,
  interview_date TEXT DEFAULT '',
  difficulty TEXT NOT NULL DEFAULT 'Medium',
  rounds TEXT DEFAULT '',
  questions TEXT DEFAULT '',
  tips TEXT DEFAULT '',
  likes INTEGER NOT NULL DEFAULT 0,
  liked_by TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.community_experiences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone authenticated can read experiences" ON public.community_experiences FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert experiences" ON public.community_experiences FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Users can delete own experiences" ON public.community_experiences FOR DELETE TO authenticated USING (user_id = auth.uid()::text);
CREATE POLICY "Users can update own experiences" ON public.community_experiences FOR UPDATE TO authenticated USING (true);

-- Community Experience Comments
CREATE TABLE public.community_experience_comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  experience_id UUID NOT NULL REFERENCES public.community_experiences(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  username TEXT NOT NULL,
  text TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.community_experience_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone authenticated can read experience comments" ON public.community_experience_comments FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert experience comments" ON public.community_experience_comments FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Users can delete own experience comments" ON public.community_experience_comments FOR DELETE TO authenticated USING (user_id = auth.uid()::text);

-- Community Questions
CREATE TABLE public.community_questions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  username TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  company TEXT NOT NULL,
  best_answer_id UUID,
  likes INTEGER NOT NULL DEFAULT 0,
  liked_by TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.community_questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone authenticated can read questions" ON public.community_questions FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert questions" ON public.community_questions FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Users can delete own questions" ON public.community_questions FOR DELETE TO authenticated USING (user_id = auth.uid()::text);
CREATE POLICY "Users can update own questions" ON public.community_questions FOR UPDATE TO authenticated USING (true);

-- Community Answers
CREATE TABLE public.community_answers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  question_id UUID NOT NULL REFERENCES public.community_questions(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  username TEXT NOT NULL,
  answer_text TEXT NOT NULL,
  upvotes INTEGER NOT NULL DEFAULT 0,
  upvoted_by TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.community_answers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone authenticated can read answers" ON public.community_answers FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert answers" ON public.community_answers FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Users can update answers" ON public.community_answers FOR UPDATE TO authenticated USING (true);

-- Community Vlogs
CREATE TABLE public.community_vlogs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  username TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  company TEXT NOT NULL,
  video_url TEXT DEFAULT '',
  type TEXT NOT NULL DEFAULT 'youtube',
  text_content TEXT DEFAULT '',
  likes INTEGER NOT NULL DEFAULT 0,
  liked_by TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.community_vlogs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone authenticated can read vlogs" ON public.community_vlogs FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert vlogs" ON public.community_vlogs FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Users can delete own vlogs" ON public.community_vlogs FOR DELETE TO authenticated USING (user_id = auth.uid()::text);
CREATE POLICY "Users can update vlogs" ON public.community_vlogs FOR UPDATE TO authenticated USING (true);

-- Community Vlog Comments
CREATE TABLE public.community_vlog_comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  vlog_id UUID NOT NULL REFERENCES public.community_vlogs(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  username TEXT NOT NULL,
  text TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.community_vlog_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone authenticated can read vlog comments" ON public.community_vlog_comments FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert vlog comments" ON public.community_vlog_comments FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Users can delete own vlog comments" ON public.community_vlog_comments FOR DELETE TO authenticated USING (user_id = auth.uid()::text);

-- Community Eligibility
CREATE TABLE public.community_eligibilities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  username TEXT NOT NULL,
  company TEXT NOT NULL,
  min_cgpa TEXT NOT NULL,
  backlogs TEXT DEFAULT '',
  branches TEXT DEFAULT '',
  additional_info TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.community_eligibilities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone authenticated can read eligibilities" ON public.community_eligibilities FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert eligibilities" ON public.community_eligibilities FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Users can delete own eligibilities" ON public.community_eligibilities FOR DELETE TO authenticated USING (user_id = auth.uid()::text);
