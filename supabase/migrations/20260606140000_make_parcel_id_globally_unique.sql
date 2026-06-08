DROP INDEX IF EXISTS public.farms_user_id_parcel_id_unique;
ALTER TABLE public.farms ADD CONSTRAINT farms_parcel_id_unique UNIQUE (parcel_id);
