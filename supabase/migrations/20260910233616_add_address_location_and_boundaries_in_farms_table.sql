ALTER TABLE public.farms DROP COLUMN latitude;
ALTER TABLE public.farms DROP COLUMN longitude;

ALTER TABLE public.farms RENAME COLUMN location TO address;

ALTER TABLE public.farms ADD COLUMN location jsonb;
ALTER TABLE public.farms ADD COLUMN boundaries jsonb;
