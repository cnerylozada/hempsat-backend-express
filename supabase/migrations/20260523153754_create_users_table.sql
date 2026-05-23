 CREATE TABLE public.users (
    id text PRIMARY KEY,
    display_name text,
    avatar_url text,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
  );

  ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

  CREATE POLICY "users can read own record"
    ON public.users FOR SELECT
    USING ((auth.jwt() ->> 'sub') = id);

  CREATE POLICY "users can update own record"
    ON public.users FOR UPDATE
    USING ((auth.jwt() ->> 'sub') = id);