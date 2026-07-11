
-- ============================================================
-- HERO
-- ============================================================
CREATE TABLE public.hero_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  badge text,
  headline text NOT NULL,
  headline_highlight text,
  subheading text,
  cta_primary_label text,
  cta_primary_href text,
  cta_secondary_label text,
  cta_secondary_href text,
  image_url text,
  stats jsonb NOT NULL DEFAULT '[]'::jsonb,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.hero_content TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.hero_content TO authenticated;
GRANT ALL ON public.hero_content TO service_role;
ALTER TABLE public.hero_content ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read hero" ON public.hero_content FOR SELECT TO anon, authenticated USING (is_active OR has_role(auth.uid(),'admin'));
CREATE POLICY "admin write hero" ON public.hero_content FOR ALL TO authenticated USING (has_role(auth.uid(),'admin')) WITH CHECK (has_role(auth.uid(),'admin'));
CREATE TRIGGER hero_content_updated BEFORE UPDATE ON public.hero_content FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

INSERT INTO public.hero_content (badge, headline, headline_highlight, subheading, cta_primary_label, cta_primary_href, cta_secondary_label, cta_secondary_href, stats) VALUES (
  'متاحون الآن على مدار 24 ساعة',
  'سونو للخدمات الطبية',
  'المتكاملة',
  'نقدم خدمات الرعاية الصحية المنزلية والطبية بأعلى معايير الجودة والاحترافية على مدار الساعة بفريق طبي مؤهل وأحدث المعدات.',
  'اطلب خدمة الآن', '/request',
  'تواصل عبر واتساب', 'whatsapp',
  '[{"value":"24/7","label":"متاحون دائماً"},{"value":"+50","label":"خدمة طبية"},{"value":"+100","label":"كادر متخصص"}]'::jsonb
);

-- ============================================================
-- WHY US
-- ============================================================
CREATE TABLE public.why_us_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  icon text,
  sort_order int NOT NULL DEFAULT 0,
  is_visible boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.why_us_items TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.why_us_items TO authenticated;
GRANT ALL ON public.why_us_items TO service_role;
ALTER TABLE public.why_us_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read why_us" ON public.why_us_items FOR SELECT TO anon, authenticated USING (is_visible OR has_role(auth.uid(),'admin'));
CREATE POLICY "admin write why_us" ON public.why_us_items FOR ALL TO authenticated USING (has_role(auth.uid(),'admin')) WITH CHECK (has_role(auth.uid(),'admin'));
CREATE TRIGGER why_us_items_updated BEFORE UPDATE ON public.why_us_items FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

INSERT INTO public.why_us_items (title, description, icon, sort_order) VALUES
  ('فريق طبي مؤهل','نخبة من الأطباء والممرضين بخبرات معتمدة.','shield-check',1),
  ('خدمة سريعة','استجابة فورية خلال دقائق من تأكيد الطلب.','clock',2),
  ('تغطية واسعة','نخدم القاهرة والجيزة وامتدادات المحافظات المجاورة.','map-pin',3),
  ('أسعار مناسبة','باقات شفافة بدون رسوم خفية تناسب جميع الفئات.','heart-pulse',4),
  ('متابعة مستمرة','متابعة دقيقة بعد الزيارة لضمان أفضل النتائج.','sparkles',5),
  ('خدمة 24 ساعة','متواجدون لخدمتك ليلاً ونهاراً طوال أيام الأسبوع.','stethoscope',6);

-- ============================================================
-- ABOUT
-- ============================================================
CREATE TABLE public.about_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  intro text,
  mission text,
  vision text,
  story text,
  values jsonb NOT NULL DEFAULT '[]'::jsonb,
  image_url text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.about_content TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.about_content TO authenticated;
GRANT ALL ON public.about_content TO service_role;
ALTER TABLE public.about_content ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read about" ON public.about_content FOR SELECT TO anon, authenticated USING (is_active OR has_role(auth.uid(),'admin'));
CREATE POLICY "admin write about" ON public.about_content FOR ALL TO authenticated USING (has_role(auth.uid(),'admin')) WITH CHECK (has_role(auth.uid(),'admin'));
CREATE TRIGGER about_content_updated BEFORE UPDATE ON public.about_content FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

INSERT INTO public.about_content (intro, mission, vision, story, values) VALUES (
  'شركة سونو للخدمات الطبية رائدة في تقديم الرعاية الصحية المنزلية والطبية المتكاملة.',
  'تقديم رعاية صحية آمنة واحترافية تصل إلى كل بيت.',
  'أن نكون الخيار الأول للرعاية الطبية المنزلية في مصر.',
  'انطلقنا برؤية إنسانية لخدمة المرضى في راحة منازلهم بجودة تضاهي المستشفيات.',
  '[{"title":"الاحترافية","desc":"معايير طبية عالمية"},{"title":"الرحمة","desc":"تعامل إنساني راقٍ"},{"title":"الثقة","desc":"شفافية في كل تعامل"}]'::jsonb
);

-- ============================================================
-- TEAM
-- ============================================================
CREATE TABLE public.team_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  role text,
  bio text,
  photo_url text,
  sort_order int NOT NULL DEFAULT 0,
  is_visible boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.team_members TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.team_members TO authenticated;
GRANT ALL ON public.team_members TO service_role;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read team" ON public.team_members FOR SELECT TO anon, authenticated USING (is_visible OR has_role(auth.uid(),'admin'));
CREATE POLICY "admin write team" ON public.team_members FOR ALL TO authenticated USING (has_role(auth.uid(),'admin')) WITH CHECK (has_role(auth.uid(),'admin'));
CREATE TRIGGER team_members_updated BEFORE UPDATE ON public.team_members FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- ============================================================
-- TESTIMONIALS
-- ============================================================
CREATE TABLE public.testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  author text NOT NULL,
  role text,
  quote text NOT NULL,
  rating int NOT NULL DEFAULT 5,
  photo_url text,
  sort_order int NOT NULL DEFAULT 0,
  is_visible boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.testimonials TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.testimonials TO authenticated;
GRANT ALL ON public.testimonials TO service_role;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read testimonials" ON public.testimonials FOR SELECT TO anon, authenticated USING (is_visible OR has_role(auth.uid(),'admin'));
CREATE POLICY "admin write testimonials" ON public.testimonials FOR ALL TO authenticated USING (has_role(auth.uid(),'admin')) WITH CHECK (has_role(auth.uid(),'admin'));
CREATE TRIGGER testimonials_updated BEFORE UPDATE ON public.testimonials FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- ============================================================
-- FAQS
-- ============================================================
CREATE TABLE public.faqs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question text NOT NULL,
  answer text NOT NULL,
  category text,
  sort_order int NOT NULL DEFAULT 0,
  is_visible boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.faqs TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.faqs TO authenticated;
GRANT ALL ON public.faqs TO service_role;
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read faqs" ON public.faqs FOR SELECT TO anon, authenticated USING (is_visible OR has_role(auth.uid(),'admin'));
CREATE POLICY "admin write faqs" ON public.faqs FOR ALL TO authenticated USING (has_role(auth.uid(),'admin')) WITH CHECK (has_role(auth.uid(),'admin'));
CREATE TRIGGER faqs_updated BEFORE UPDATE ON public.faqs FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- ============================================================
-- STATS
-- ============================================================
CREATE TABLE public.site_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  label text NOT NULL,
  value text NOT NULL,
  icon text,
  sort_order int NOT NULL DEFAULT 0,
  is_visible boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.site_stats TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.site_stats TO authenticated;
GRANT ALL ON public.site_stats TO service_role;
ALTER TABLE public.site_stats ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read stats" ON public.site_stats FOR SELECT TO anon, authenticated USING (is_visible OR has_role(auth.uid(),'admin'));
CREATE POLICY "admin write stats" ON public.site_stats FOR ALL TO authenticated USING (has_role(auth.uid(),'admin')) WITH CHECK (has_role(auth.uid(),'admin'));
CREATE TRIGGER site_stats_updated BEFORE UPDATE ON public.site_stats FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- ============================================================
-- JOBS
-- ============================================================
CREATE TABLE public.jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  department text,
  employment_type text,
  location text,
  is_open boolean NOT NULL DEFAULT true,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.jobs TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.jobs TO authenticated;
GRANT ALL ON public.jobs TO service_role;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read jobs" ON public.jobs FOR SELECT TO anon, authenticated USING (is_open OR has_role(auth.uid(),'admin'));
CREATE POLICY "admin write jobs" ON public.jobs FOR ALL TO authenticated USING (has_role(auth.uid(),'admin')) WITH CHECK (has_role(auth.uid(),'admin'));
CREATE TRIGGER jobs_updated BEFORE UPDATE ON public.jobs FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

INSERT INTO public.jobs (title, description, sort_order) VALUES
  ('أطباء','تخصصات متنوعة بدوام كامل أو جزئي.',1),
  ('تمريض','ممرضين/ممرضات بخبرة في الرعاية المنزلية.',2),
  ('فني أشعة','بخبرة في الأجهزة المتنقلة.',3),
  ('فني تحاليل','خبرة في سحب العينات والمعامل.',4),
  ('مسعفين','بخبرة في الإسعاف ونقل المرضى.',5),
  ('خدمة عملاء','للعمل بنظام شيفتات على مدار الساعة.',6);

-- ============================================================
-- CONTACT INFO (single row)
-- ============================================================
CREATE TABLE public.contact_info (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  phone text,
  phone_intl text,
  whatsapp text,
  email text,
  address text,
  hours text,
  map_embed text,
  socials jsonb NOT NULL DEFAULT '{}'::jsonb,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.contact_info TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.contact_info TO authenticated;
GRANT ALL ON public.contact_info TO service_role;
ALTER TABLE public.contact_info ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read contact_info" ON public.contact_info FOR SELECT TO anon, authenticated USING (is_active OR has_role(auth.uid(),'admin'));
CREATE POLICY "admin write contact_info" ON public.contact_info FOR ALL TO authenticated USING (has_role(auth.uid(),'admin')) WITH CHECK (has_role(auth.uid(),'admin'));
CREATE TRIGGER contact_info_updated BEFORE UPDATE ON public.contact_info FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

INSERT INTO public.contact_info (phone, phone_intl, whatsapp, email) VALUES
  ('01222212683','+201222212683','201222212683','swnwmedicalcare@gmail.com');

-- ============================================================
-- NAV ITEMS
-- ============================================================
CREATE TABLE public.nav_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  label text NOT NULL,
  href text NOT NULL,
  sort_order int NOT NULL DEFAULT 0,
  is_visible boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.nav_items TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.nav_items TO authenticated;
GRANT ALL ON public.nav_items TO service_role;
ALTER TABLE public.nav_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read nav" ON public.nav_items FOR SELECT TO anon, authenticated USING (is_visible OR has_role(auth.uid(),'admin'));
CREATE POLICY "admin write nav" ON public.nav_items FOR ALL TO authenticated USING (has_role(auth.uid(),'admin')) WITH CHECK (has_role(auth.uid(),'admin'));
CREATE TRIGGER nav_items_updated BEFORE UPDATE ON public.nav_items FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

INSERT INTO public.nav_items (label, href, sort_order) VALUES
  ('الرئيسية','/',1),
  ('من نحن','/about',2),
  ('خدماتنا','/services',3),
  ('المتجر الطبي','/store',4),
  ('اطلب خدمة','/request',5),
  ('الوظائف','/careers',6),
  ('تواصل معنا','/contact',7);

-- ============================================================
-- PRODUCT IMAGES
-- ============================================================
CREATE TABLE public.product_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  url text NOT NULL,
  alt text,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.product_images TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.product_images TO authenticated;
GRANT ALL ON public.product_images TO service_role;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read product_images" ON public.product_images FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "admin write product_images" ON public.product_images FOR ALL TO authenticated USING (has_role(auth.uid(),'admin')) WITH CHECK (has_role(auth.uid(),'admin'));
CREATE INDEX product_images_product_idx ON public.product_images(product_id, sort_order);

-- ============================================================
-- SUBMISSION STATUS ENUM
-- ============================================================
CREATE TYPE public.submission_status AS ENUM ('new','contacted','in_progress','done','archived');

-- ============================================================
-- SERVICE SUBMISSIONS
-- ============================================================
CREATE TABLE public.service_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  phone text NOT NULL,
  service_slug text,
  sub_service text,
  notes text,
  status public.submission_status NOT NULL DEFAULT 'new',
  admin_notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.service_submissions TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.service_submissions TO authenticated;
GRANT ALL ON public.service_submissions TO service_role;
ALTER TABLE public.service_submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone can submit service req" ON public.service_submissions FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "admin read service req" ON public.service_submissions FOR SELECT TO authenticated USING (has_role(auth.uid(),'admin'));
CREATE POLICY "admin update service req" ON public.service_submissions FOR UPDATE TO authenticated USING (has_role(auth.uid(),'admin')) WITH CHECK (has_role(auth.uid(),'admin'));
CREATE POLICY "admin delete service req" ON public.service_submissions FOR DELETE TO authenticated USING (has_role(auth.uid(),'admin'));
CREATE TRIGGER service_submissions_updated BEFORE UPDATE ON public.service_submissions FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- ============================================================
-- JOB APPLICATIONS
-- ============================================================
CREATE TABLE public.job_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  phone text NOT NULL,
  email text,
  position text,
  cv_url text,
  notes text,
  status public.submission_status NOT NULL DEFAULT 'new',
  admin_notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.job_applications TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.job_applications TO authenticated;
GRANT ALL ON public.job_applications TO service_role;
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone can apply" ON public.job_applications FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "admin read applications" ON public.job_applications FOR SELECT TO authenticated USING (has_role(auth.uid(),'admin'));
CREATE POLICY "admin update applications" ON public.job_applications FOR UPDATE TO authenticated USING (has_role(auth.uid(),'admin')) WITH CHECK (has_role(auth.uid(),'admin'));
CREATE POLICY "admin delete applications" ON public.job_applications FOR DELETE TO authenticated USING (has_role(auth.uid(),'admin'));
CREATE TRIGGER job_applications_updated BEFORE UPDATE ON public.job_applications FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- ============================================================
-- CONTACT MESSAGES
-- ============================================================
CREATE TABLE public.contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text,
  phone text,
  subject text,
  message text NOT NULL,
  status public.submission_status NOT NULL DEFAULT 'new',
  admin_notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.contact_messages TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.contact_messages TO authenticated;
GRANT ALL ON public.contact_messages TO service_role;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone can message" ON public.contact_messages FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "admin read messages" ON public.contact_messages FOR SELECT TO authenticated USING (has_role(auth.uid(),'admin'));
CREATE POLICY "admin update messages" ON public.contact_messages FOR UPDATE TO authenticated USING (has_role(auth.uid(),'admin')) WITH CHECK (has_role(auth.uid(),'admin'));
CREATE POLICY "admin delete messages" ON public.contact_messages FOR DELETE TO authenticated USING (has_role(auth.uid(),'admin'));
CREATE TRIGGER contact_messages_updated BEFORE UPDATE ON public.contact_messages FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- ============================================================
-- Helpful indexes
-- ============================================================
CREATE INDEX why_us_items_order_idx ON public.why_us_items(sort_order) WHERE is_visible;
CREATE INDEX team_members_order_idx ON public.team_members(sort_order) WHERE is_visible;
CREATE INDEX testimonials_order_idx ON public.testimonials(sort_order) WHERE is_visible;
CREATE INDEX faqs_order_idx ON public.faqs(sort_order) WHERE is_visible;
CREATE INDEX jobs_order_idx ON public.jobs(sort_order) WHERE is_open;
CREATE INDEX nav_items_order_idx ON public.nav_items(sort_order) WHERE is_visible;
CREATE INDEX service_submissions_created_idx ON public.service_submissions(created_at DESC);
CREATE INDEX job_applications_created_idx ON public.job_applications(created_at DESC);
CREATE INDEX contact_messages_created_idx ON public.contact_messages(created_at DESC);
