
-- Doctors
CREATE TABLE public.doctors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  specialty text,
  description text,
  qualifications text,
  experience text,
  photo_url text,
  phone text,
  whatsapp text,
  is_available boolean NOT NULL DEFAULT true,
  sort_order int NOT NULL DEFAULT 0,
  is_visible boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.doctors TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.doctors TO authenticated;
GRANT ALL ON public.doctors TO service_role;
ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;
CREATE POLICY "doctors public read" ON public.doctors FOR SELECT TO anon USING (is_visible = true);
CREATE POLICY "doctors auth read" ON public.doctors FOR SELECT TO authenticated USING (true);
CREATE POLICY "doctors admin write" ON public.doctors FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER doctors_updated_at BEFORE UPDATE ON public.doctors
  FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();
CREATE INDEX doctors_sort_idx ON public.doctors (sort_order) WHERE is_visible;

-- Homepage Sections
CREATE TABLE public.homepage_sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text NOT NULL UNIQUE,
  label text NOT NULL,
  sort_order int NOT NULL DEFAULT 0,
  is_visible boolean NOT NULL DEFAULT true,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.homepage_sections TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.homepage_sections TO authenticated;
GRANT ALL ON public.homepage_sections TO service_role;
ALTER TABLE public.homepage_sections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "sections public read" ON public.homepage_sections FOR SELECT TO anon USING (true);
CREATE POLICY "sections admin write" ON public.homepage_sections FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER homepage_sections_updated_at BEFORE UPDATE ON public.homepage_sections
  FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

INSERT INTO public.homepage_sections (key, label, sort_order) VALUES
  ('hero','قسم البداية',0),
  ('services','الخدمات',1),
  ('why_us','لماذا نحن',2),
  ('ambulance','بانر الإسعاف',3),
  ('store','المتجر',4),
  ('doctors','الأطباء',5),
  ('stats','الأرقام',6),
  ('testimonials','آراء العملاء',7),
  ('faqs','الأسئلة الشائعة',8),
  ('contact','بيانات الاتصال',9)
ON CONFLICT (key) DO NOTHING;
