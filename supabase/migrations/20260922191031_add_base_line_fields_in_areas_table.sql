create type tillage_practice as enum (
  'conventional', 'reduced', 'no_till', 'native_fallow'
);

ALTER TABLE public.areas ADD COLUMN tillage_practice tillage_practice NOT NULL;
ALTER TABLE public.areas ADD COLUMN current_crop text NOT NULL;
ALTER TABLE public.areas ADD COLUMN attestation_signature text NOT NULL;
ALTER TABLE public.areas ADD COLUMN months_under_practice integer NOT NULL;

