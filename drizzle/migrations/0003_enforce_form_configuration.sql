CREATE POLICY "configured volunteer submissions" ON public.applications AS RESTRICTIVE FOR INSERT TO anon, authenticated WITH CHECK (
 kind <> 'benevole' OR (
 length(trim(name)) BETWEEN 1 AND 200 AND length(email) <= 255 AND email ~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'
 AND coalesce(length(phone),0) <= 50 AND coalesce(length(city),0) <= 100 AND coalesce(length(message),0) <= 5000
 AND coalesce((SELECT (value::jsonb->>'enabled')::boolean FROM public.site_content WHERE key='site.volunteer'),true)
 AND (coalesce((SELECT (value::jsonb->>'showPhone')::boolean FROM public.site_content WHERE key='site.volunteer'),true) OR phone IS NULL OR phone='')
 AND (coalesce((SELECT (value::jsonb->>'showCity')::boolean FROM public.site_content WHERE key='site.volunteer'),true) OR city IS NULL OR city='')
 AND (coalesce((SELECT (value::jsonb->>'showMessage')::boolean FROM public.site_content WHERE key='site.volunteer'),true) OR message IS NULL OR message='')
 ));
CREATE POLICY "configured contact submissions" ON public.contact_submissions AS RESTRICTIVE FOR INSERT TO anon, authenticated WITH CHECK (
 handled=false AND email ~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$' AND length(email)<=255 AND length(trim(subject)) BETWEEN 2 AND 200 AND length(trim(message)) BETWEEN 10 AND 5000 AND coalesce(length(name),0)<=100
 AND coalesce((SELECT (value::jsonb->>'enabled')::boolean FROM public.site_content WHERE key='site.contact'),true)
);