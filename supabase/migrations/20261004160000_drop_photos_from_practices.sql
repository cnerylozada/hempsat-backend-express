-- practice photos are found through their storage folder ({userId}/{practiceId}), not a column
ALTER TABLE public.practices
  DROP COLUMN photos;
