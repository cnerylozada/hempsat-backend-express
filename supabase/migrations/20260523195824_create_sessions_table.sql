CREATE TABLE public.sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz NOT NULL
);

ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users can read own sessions"
  ON public.sessions FOR SELECT
  USING ((auth.jwt() ->> 'sub') = user_id);

CREATE POLICY "users can insert own sessions"
  ON public.sessions FOR INSERT
  WITH CHECK ((auth.jwt() ->> 'sub') = user_id);

CREATE POLICY "users can delete own sessions"
  ON public.sessions FOR DELETE
  USING ((auth.jwt() ->> 'sub') = user_id);
