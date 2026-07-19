
-- 1) Convert stored Supabase Storage URLs (public or signed) to plain paths.
-- App will sign fresh long-lived URLs on every read.
UPDATE public.products
   SET image = substring(image FROM '/storage/v1/object/(?:sign|public)/media/([^?#]+)')
 WHERE image IS NOT NULL AND image ~ '/storage/v1/object/(?:sign|public)/media/';

UPDATE public.product_images
   SET url = substring(url FROM '/storage/v1/object/(?:sign|public)/media/([^?#]+)')
 WHERE url ~ '/storage/v1/object/(?:sign|public)/media/';

-- 2) product_badges: unlimited custom badges per product
CREATE TABLE public.product_badges (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id     uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  text           text NOT NULL CHECK (char_length(btrim(text)) BETWEEN 1 AND 50),
  color_variant  text NOT NULL DEFAULT 'gray'
                 CHECK (color_variant IN ('green','blue','orange','purple','red','gray','gold')),
  sort_order     int NOT NULL DEFAULT 0,
  is_visible     boolean NOT NULL DEFAULT true,
  created_at     timestamptz NOT NULL DEFAULT now(),
  updated_at     timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX product_badges_product_idx ON public.product_badges(product_id, sort_order);

GRANT SELECT ON public.product_badges TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.product_badges TO authenticated;
GRANT ALL ON public.product_badges TO service_role;

ALTER TABLE public.product_badges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public reads visible badges of visible products" ON public.product_badges
  FOR SELECT TO anon, authenticated
  USING (
    is_visible = true
    AND EXISTS (SELECT 1 FROM public.products p WHERE p.id = product_id AND p.is_visible = true)
  );

CREATE POLICY "Admins full access badges" ON public.product_badges
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER trg_product_badges_updated
  BEFORE UPDATE ON public.product_badges
  FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- 3) Seed backward-compat badges from existing flags (skip nulls & duplicates)
INSERT INTO public.product_badges (product_id, text, color_variant, sort_order)
SELECT id, 'للبيع فقط', 'green', 0
  FROM public.products
 WHERE COALESCE(available_for_sale, true) = true AND COALESCE(available_for_rent, true) = false;

INSERT INTO public.product_badges (product_id, text, color_variant, sort_order)
SELECT id, 'للإيجار فقط', 'blue', 0
  FROM public.products
 WHERE COALESCE(available_for_rent, true) = true AND COALESCE(available_for_sale, true) = false;

INSERT INTO public.product_badges (product_id, text, color_variant, sort_order)
SELECT id, 'قابل للتفاوض', 'orange', 1
  FROM public.products
 WHERE rental_unit = 'negotiable';

-- 4) visitor_feedback: anonymous public submissions
CREATE TABLE public.visitor_feedback (
  id                 uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at         timestamptz NOT NULL DEFAULT now(),
  rating             int CHECK (rating BETWEEN 1 AND 5),
  name               text,
  comment            text,
  requested_product  text,
  page_url           text,
  user_agent         text,
  device_type        text,
  is_reviewed        boolean NOT NULL DEFAULT false
);
CREATE INDEX visitor_feedback_created_idx ON public.visitor_feedback(created_at DESC);

GRANT INSERT ON public.visitor_feedback TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.visitor_feedback TO authenticated;
GRANT ALL ON public.visitor_feedback TO service_role;

ALTER TABLE public.visitor_feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit feedback" ON public.visitor_feedback
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admins read/manage feedback" ON public.visitor_feedback
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
