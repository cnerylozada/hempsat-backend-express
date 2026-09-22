CREATE TABLE public.areas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  farm_id uuid NOT NULL REFERENCES public.farms(id),
  name text NOT NULL,
  description text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.areas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users can read own areas"
  ON public.areas FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.farms
      WHERE farms.id = areas.farm_id
      AND farms.user_id = (auth.jwt() ->> 'sub')
    )
  );

CREATE POLICY "users can insert own areas"
  ON public.areas FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.farms
      WHERE farms.id = areas.farm_id
      AND farms.user_id = (auth.jwt() ->> 'sub')
    )
  );
