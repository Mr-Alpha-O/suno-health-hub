
-- Phase 3: replace the overly-permissive doctors SELECT policy for authenticated users.
DROP POLICY IF EXISTS "doctors auth read" ON public.doctors;
DROP POLICY IF EXISTS "doctors public read" ON public.doctors;

CREATE POLICY "doctors public read"
  ON public.doctors FOR SELECT
  TO anon, authenticated
  USING (is_visible = true OR public.has_role(auth.uid(), 'admin'::public.app_role));
