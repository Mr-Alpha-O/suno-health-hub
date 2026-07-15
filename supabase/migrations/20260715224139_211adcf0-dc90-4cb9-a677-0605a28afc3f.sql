
-- 1) contact_phones
CREATE TABLE IF NOT EXISTS public.contact_phones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  label text,
  value text NOT NULL,
  value_intl text,
  notes text,
  is_primary boolean NOT NULL DEFAULT false,
  is_visible boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.contact_phones TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.contact_phones TO authenticated;
GRANT ALL ON public.contact_phones TO service_role;
ALTER TABLE public.contact_phones ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read contact_phones" ON public.contact_phones FOR SELECT TO anon, authenticated USING (is_visible OR public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "admin write contact_phones" ON public.contact_phones FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));
CREATE TRIGGER tg_contact_phones_updated BEFORE UPDATE ON public.contact_phones FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- 2) contact_whatsapps
CREATE TABLE IF NOT EXISTS public.contact_whatsapps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  label text,
  value text NOT NULL,
  notes text,
  is_primary boolean NOT NULL DEFAULT false,
  is_visible boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.contact_whatsapps TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.contact_whatsapps TO authenticated;
GRANT ALL ON public.contact_whatsapps TO service_role;
ALTER TABLE public.contact_whatsapps ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read contact_whatsapps" ON public.contact_whatsapps FOR SELECT TO anon, authenticated USING (is_visible OR public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "admin write contact_whatsapps" ON public.contact_whatsapps FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));
CREATE TRIGGER tg_contact_whatsapps_updated BEFORE UPDATE ON public.contact_whatsapps FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- 3) contact_emails
CREATE TABLE IF NOT EXISTS public.contact_emails (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  label text,
  value text NOT NULL,
  notes text,
  is_primary boolean NOT NULL DEFAULT false,
  is_visible boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.contact_emails TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.contact_emails TO authenticated;
GRANT ALL ON public.contact_emails TO service_role;
ALTER TABLE public.contact_emails ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read contact_emails" ON public.contact_emails FOR SELECT TO anon, authenticated USING (is_visible OR public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "admin write contact_emails" ON public.contact_emails FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));
CREATE TRIGGER tg_contact_emails_updated BEFORE UPDATE ON public.contact_emails FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- 4) contact_branches
CREATE TABLE IF NOT EXISTS public.contact_branches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text,
  address text NOT NULL,
  phone text,
  hours text,
  map_embed text,
  notes text,
  is_primary boolean NOT NULL DEFAULT false,
  is_visible boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.contact_branches TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.contact_branches TO authenticated;
GRANT ALL ON public.contact_branches TO service_role;
ALTER TABLE public.contact_branches ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read contact_branches" ON public.contact_branches FOR SELECT TO anon, authenticated USING (is_visible OR public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "admin write contact_branches" ON public.contact_branches FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));
CREATE TRIGGER tg_contact_branches_updated BEFORE UPDATE ON public.contact_branches FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- 5) Seed from existing contact_info (only if empty)
INSERT INTO public.contact_phones (label, value, value_intl, is_primary, is_visible, sort_order)
SELECT 'رئيسي', ci.phone, ci.phone_intl, true, true, 0
FROM public.contact_info ci
WHERE ci.phone IS NOT NULL AND ci.phone <> ''
  AND NOT EXISTS (SELECT 1 FROM public.contact_phones);

INSERT INTO public.contact_whatsapps (label, value, is_primary, is_visible, sort_order)
SELECT 'رئيسي', ci.whatsapp, true, true, 0
FROM public.contact_info ci
WHERE ci.whatsapp IS NOT NULL AND ci.whatsapp <> ''
  AND NOT EXISTS (SELECT 1 FROM public.contact_whatsapps);

INSERT INTO public.contact_emails (label, value, is_primary, is_visible, sort_order)
SELECT 'رئيسي', ci.email, true, true, 0
FROM public.contact_info ci
WHERE ci.email IS NOT NULL AND ci.email <> ''
  AND NOT EXISTS (SELECT 1 FROM public.contact_emails);

INSERT INTO public.contact_branches (name, address, hours, map_embed, is_primary, is_visible, sort_order)
SELECT 'الفرع الرئيسي', COALESCE(NULLIF(ci.address, ''), 'القاهرة الكبرى'), NULLIF(ci.hours, ''), NULLIF(ci.map_embed, ''), true, true, 0
FROM public.contact_info ci
WHERE (ci.address IS NOT NULL AND ci.address <> '') OR (ci.hours IS NOT NULL AND ci.hours <> '') OR (ci.map_embed IS NOT NULL AND ci.map_embed <> '')
  AND NOT EXISTS (SELECT 1 FROM public.contact_branches);

-- 6) Make products.slug optional (auto-generated in handler when missing)
ALTER TABLE public.products ALTER COLUMN slug DROP NOT NULL;
