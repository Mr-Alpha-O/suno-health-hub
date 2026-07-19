
-- Phase 5: replace WITH CHECK (true) on visitor_feedback with explicit validation.
DROP POLICY IF EXISTS "Anyone can submit feedback" ON public.visitor_feedback;

CREATE POLICY "Anyone can submit feedback"
  ON public.visitor_feedback FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    (rating IS NULL OR (rating BETWEEN 1 AND 5))
    AND (name IS NULL OR length(name) <= 100)
    AND (comment IS NULL OR length(comment) <= 2000)
    AND (requested_product IS NULL OR length(requested_product) <= 300)
    AND (page_url IS NULL OR length(page_url) <= 500)
    AND (user_agent IS NULL OR length(user_agent) <= 500)
    AND (device_type IS NULL OR length(device_type) <= 40)
    AND (
      rating IS NOT NULL
      OR (comment IS NOT NULL AND length(btrim(comment)) >= 2)
      OR (requested_product IS NOT NULL AND length(btrim(requested_product)) >= 2)
    )
  );
