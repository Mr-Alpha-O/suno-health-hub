ALTER TABLE public.visitor_feedback ADD COLUMN IF NOT EXISTS is_published boolean NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS visitor_feedback_published_idx ON public.visitor_feedback (is_published, created_at DESC);
GRANT SELECT ON public.visitor_feedback TO anon;
DROP POLICY IF EXISTS "Public can read published reviews" ON public.visitor_feedback;
CREATE POLICY "Public can read published reviews" ON public.visitor_feedback FOR SELECT TO anon, authenticated USING (is_published = true);
INSERT INTO public.homepage_sections (key, label, sort_order, is_visible)
SELECT 'reviews', 'آراء عملائنا', COALESCE((SELECT max(sort_order) FROM public.homepage_sections), 0) + 1, true
WHERE NOT EXISTS (SELECT 1 FROM public.homepage_sections WHERE key = 'reviews');