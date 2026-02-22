
-- AI credits table to track daily usage
CREATE TABLE public.ai_credits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  firebase_uid TEXT NOT NULL,
  messages_used INTEGER NOT NULL DEFAULT 0,
  usage_date DATE NOT NULL DEFAULT CURRENT_DATE,
  is_pro BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(firebase_uid, usage_date)
);

-- Enable RLS
ALTER TABLE public.ai_credits ENABLE ROW LEVEL SECURITY;

-- Allow anyone to select/insert/update (firebase auth is handled app-side)
CREATE POLICY "Users can view their own credits"
ON public.ai_credits FOR SELECT
USING (true);

CREATE POLICY "Users can insert their own credits"
ON public.ai_credits FOR INSERT
WITH CHECK (true);

CREATE POLICY "Users can update their own credits"
ON public.ai_credits FOR UPDATE
USING (true);
