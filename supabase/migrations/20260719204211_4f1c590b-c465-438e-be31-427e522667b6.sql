
-- Phase 2: RLS on storage.objects for the new "job-applications" private bucket.
-- Applicants (anon or authenticated) may INSERT into the "cvs/" prefix with sane
-- content-type + size limits. Nobody except admins can SELECT/UPDATE/DELETE.

-- Public upload (anon + authenticated), constrained
CREATE POLICY "job-applications public upload"
  ON storage.objects FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    bucket_id = 'job-applications'
    AND (storage.foldername(name))[1] = 'cvs'
    AND coalesce((metadata->>'size')::bigint, 0) <= 10 * 1024 * 1024
    AND coalesce(metadata->>'mimetype', '') IN (
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/jpeg',
      'image/png'
    )
  );

-- Admin-only read
CREATE POLICY "job-applications admin read"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'job-applications'
    AND public.has_role(auth.uid(), 'admin'::public.app_role)
  );

-- Admin-only update
CREATE POLICY "job-applications admin update"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'job-applications'
    AND public.has_role(auth.uid(), 'admin'::public.app_role)
  )
  WITH CHECK (
    bucket_id = 'job-applications'
    AND public.has_role(auth.uid(), 'admin'::public.app_role)
  );

-- Admin-only delete
CREATE POLICY "job-applications admin delete"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'job-applications'
    AND public.has_role(auth.uid(), 'admin'::public.app_role)
  );
