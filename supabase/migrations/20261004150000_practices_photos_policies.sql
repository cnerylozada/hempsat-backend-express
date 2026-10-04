CREATE POLICY "users can upload own practice photos"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'practices_photos'
    AND (storage.foldername(name))[1] = (auth.jwt() ->> 'sub')
  );

CREATE POLICY "users can read own practice photos"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'practices_photos'
    AND (storage.foldername(name))[1] = (auth.jwt() ->> 'sub')
  );
