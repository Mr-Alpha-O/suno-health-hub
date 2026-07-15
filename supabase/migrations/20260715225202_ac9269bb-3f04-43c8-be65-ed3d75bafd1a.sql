
ALTER TABLE public.jobs ALTER COLUMN description DROP NOT NULL;
ALTER TABLE public.service_categories ALTER COLUMN slug DROP NOT NULL;
ALTER TABLE public.testimonials ALTER COLUMN quote DROP NOT NULL;
ALTER TABLE public.faqs ALTER COLUMN answer DROP NOT NULL;
ALTER TABLE public.why_us_items ALTER COLUMN description DROP NOT NULL;
ALTER TABLE public.site_stats ALTER COLUMN value DROP NOT NULL;
