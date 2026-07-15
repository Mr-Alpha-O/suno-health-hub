
-- Fix product_images visibility: join to parent product
DROP POLICY IF EXISTS "public read product_images" ON public.product_images;
CREATE POLICY "public read product_images" ON public.product_images
  FOR SELECT TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.products p
      WHERE p.id = product_images.product_id
        AND p.is_visible = true
    )
    OR public.has_role(auth.uid(), 'admin')
  );

-- Lock down SECURITY DEFINER function has_role: revoke from public/anon, grant to authenticated only
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;
