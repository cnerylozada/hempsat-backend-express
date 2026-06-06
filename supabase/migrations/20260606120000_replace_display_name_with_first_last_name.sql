ALTER TABLE public.users
  DROP COLUMN IF EXISTS display_name,
  ADD COLUMN IF NOT EXISTS first_name text,
  ADD COLUMN IF NOT EXISTS last_name text;
