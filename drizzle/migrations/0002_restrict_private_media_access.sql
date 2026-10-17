DROP POLICY IF EXISTS "public read media" ON storage.objects;
CREATE POLICY "admin read media" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'media' AND public.has_role(auth.uid(), 'admin'));
DROP POLICY IF EXISTS "public media metadata" ON public.cms_media;
REVOKE SELECT ON public.cms_media FROM anon;