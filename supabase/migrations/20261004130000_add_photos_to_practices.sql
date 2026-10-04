-- storage object paths of the practice's photos (private bucket, so paths rather than URLs: signed URLs expire)
ALTER TABLE public.practices
  ADD COLUMN photos text[] NOT NULL DEFAULT '{}';
