-- a practice has exactly one details row in its type's table (1:1), so practice_id must be unique
ALTER TABLE public.mulching_practices
  ADD CONSTRAINT mulching_practices_practice_id_key UNIQUE (practice_id);
