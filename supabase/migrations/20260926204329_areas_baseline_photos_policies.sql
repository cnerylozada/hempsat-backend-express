CREATE POLICY "users can upload own area photos"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'areas_baseline_photos'
    AND (storage.foldername(name))[1] = (auth.jwt() ->> 'sub')
  );

CREATE POLICY "users can read own area photos"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'areas_baseline_photos'
    AND (storage.foldername(name))[1] = (auth.jwt() ->> 'sub')
  );