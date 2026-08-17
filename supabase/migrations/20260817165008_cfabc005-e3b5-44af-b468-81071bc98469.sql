UPDATE public.homepage_sections SET sort_order = sort_order + 1 WHERE sort_order >= 7 AND key <> 'reviews';
UPDATE public.homepage_sections SET sort_order = 7 WHERE key = 'reviews';