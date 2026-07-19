
-- Allow anon & authenticated to read objects in the 'media' bucket so the app
-- can generate fresh signed URLs on public reads. Storage RLS still restricts
-- writes to authenticated admins via existing policies.
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='storage' AND tablename='objects' AND policyname='Public read media bucket'
  ) THEN
    CREATE POLICY "Public read media bucket" ON storage.objects
      FOR SELECT TO anon, authenticated
      USING (bucket_id = 'media');
  END IF;
END $$;
