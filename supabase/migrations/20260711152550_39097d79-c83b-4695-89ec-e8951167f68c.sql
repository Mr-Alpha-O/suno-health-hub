
DROP POLICY IF EXISTS "anyone can submit service req" ON public.service_submissions;
CREATE POLICY "anyone can submit service req"
  ON public.service_submissions FOR INSERT TO anon, authenticated
  WITH CHECK (
    length(btrim(name)) BETWEEN 2 AND 100
    AND length(btrim(phone)) BETWEEN 6 AND 30
    AND (notes IS NULL OR length(notes) <= 2000)
  );

DROP POLICY IF EXISTS "anyone can apply" ON public.job_applications;
CREATE POLICY "anyone can apply"
  ON public.job_applications FOR INSERT TO anon, authenticated
  WITH CHECK (
    length(btrim(name)) BETWEEN 2 AND 100
    AND length(btrim(phone)) BETWEEN 6 AND 30
    AND (email IS NULL OR length(email) <= 255)
    AND (notes IS NULL OR length(notes) <= 2000)
  );

DROP POLICY IF EXISTS "anyone can message" ON public.contact_messages;
CREATE POLICY "anyone can message"
  ON public.contact_messages FOR INSERT TO anon, authenticated
  WITH CHECK (
    length(btrim(name)) BETWEEN 2 AND 100
    AND length(btrim(message)) BETWEEN 2 AND 5000
    AND (email IS NULL OR length(email) <= 255)
    AND (phone IS NULL OR length(phone) <= 30)
  );
