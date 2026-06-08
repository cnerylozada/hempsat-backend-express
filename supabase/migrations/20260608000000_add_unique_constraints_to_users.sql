ALTER TABLE public.users ADD CONSTRAINT users_national_id_unique UNIQUE (national_id);
ALTER TABLE public.users ADD CONSTRAINT users_inquiry_id_unique UNIQUE (inquiry_id);
