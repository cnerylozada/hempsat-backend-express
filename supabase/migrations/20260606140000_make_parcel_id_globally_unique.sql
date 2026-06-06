DROP INDEX IF EXISTS public.farms_user_id_parcel_id_unique;
CREATE UNIQUE INDEX farms_parcel_id_unique ON public.farms (parcel_id) WHERE parcel_id IS NOT NULL;
