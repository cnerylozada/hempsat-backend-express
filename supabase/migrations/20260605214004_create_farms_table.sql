CREATE TABLE public.farms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL REFERENCES public.users(id),
  country text NOT NULL,
  owner_name text NOT NULL,
  location text NOT NULL,
  parcel_id text,
  area text,
  latitude numeric(10, 7) NOT NULL,
  longitude numeric(10, 7) NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.farms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users can read own farms"
  ON public.farms FOR SELECT
  USING ((auth.jwt() ->> 'sub') = user_id);

CREATE POLICY "users can insert own farms"
  ON public.farms FOR INSERT
  WITH CHECK ((auth.jwt() ->> 'sub') = user_id);
