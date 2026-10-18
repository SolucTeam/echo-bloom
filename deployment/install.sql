BEGIN;
CREATE TABLE public.contact_submissions (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), name text, email text NOT NULL, subject text NOT NULL, message text NOT NULL, ip text, created_at timestamptz NOT NULL DEFAULT now());
GRANT INSERT ON public.contact_submissions TO anon;
GRANT INSERT ON public.contact_submissions TO authenticated;
GRANT ALL ON public.contact_submissions TO service_role;
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit a contact message" ON public.contact_submissions FOR INSERT TO anon, authenticated WITH CHECK (length(email)<=255 AND length(subject)<=200 AND length(message)<=5000 AND (name IS NULL OR length(name)<=100));
CREATE TYPE public.app_role AS ENUM ('admin');
CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own roles readable" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

-- Contact messages
ALTER TABLE public.contact_submissions ADD COLUMN IF NOT EXISTS handled boolean NOT NULL DEFAULT false;
GRANT SELECT, UPDATE, DELETE ON public.contact_submissions TO authenticated;
CREATE POLICY "admin read contact" ON public.contact_submissions FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "admin update contact" ON public.contact_submissions FOR UPDATE TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "admin delete contact" ON public.contact_submissions FOR DELETE TO authenticated USING (public.has_role(auth.uid(),'admin'));

-- Blog posts
CREATE TABLE public.blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  excerpt text NOT NULL DEFAULT '',
  content text NOT NULL DEFAULT '',
  category text NOT NULL DEFAULT 'Initiatives',
  image_url text,
  author text NOT NULL DEFAULT 'Green Ivory',
  published boolean NOT NULL DEFAULT false,
  published_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.blog_posts TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.blog_posts TO authenticated;
GRANT ALL ON public.blog_posts TO service_role;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read published" ON public.blog_posts FOR SELECT TO anon, authenticated USING (published OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "admin write posts" ON public.blog_posts FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- Gallery
CREATE TABLE public.gallery_photos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  collection text NOT NULL DEFAULT 'Journées sans plastique',
  tag text NOT NULL DEFAULT '',
  image_url text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.gallery_photos TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.gallery_photos TO authenticated;
GRANT ALL ON public.gallery_photos TO service_role;
ALTER TABLE public.gallery_photos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read gallery" ON public.gallery_photos FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "admin write gallery" ON public.gallery_photos FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- Volunteer & partner applications
CREATE TABLE public.applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kind text NOT NULL CHECK (kind IN ('benevole','partenaire')),
  name text NOT NULL CHECK (char_length(name) BETWEEN 1 AND 200),
  email text NOT NULL CHECK (char_length(email) BETWEEN 3 AND 255),
  phone text CHECK (char_length(phone) <= 50),
  city text CHECK (char_length(city) <= 100),
  organization text CHECK (char_length(organization) <= 200),
  message text CHECK (char_length(message) <= 5000),
  handled boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.applications TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.applications TO authenticated;
GRANT ALL ON public.applications TO service_role;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone can apply" ON public.applications FOR INSERT TO anon, authenticated WITH CHECK (handled = false);
CREATE POLICY "admin read apps" ON public.applications FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "admin update apps" ON public.applications FOR UPDATE TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "admin delete apps" ON public.applications FOR DELETE TO authenticated USING (public.has_role(auth.uid(),'admin'));

-- Editable site texts
CREATE TABLE public.site_content (
  key text PRIMARY KEY,
  label text NOT NULL DEFAULT '',
  value text NOT NULL DEFAULT '',
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.site_content TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.site_content TO authenticated;
GRANT ALL ON public.site_content TO service_role;
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read content" ON public.site_content FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "admin write content" ON public.site_content FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- Media storage policies (bucket created separately)
CREATE POLICY "admin read media" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'media' AND public.has_role(auth.uid(),'admin'));
CREATE POLICY "admin upload media" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'media' AND public.has_role(auth.uid(),'admin'));
CREATE POLICY "admin delete media" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'media' AND public.has_role(auth.uid(),'admin'));
CREATE OR REPLACE FUNCTION public.assign_first_admin() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$ BEGIN RETURN NEW; END; $$;
COMMENT ON FUNCTION public.assign_first_admin() IS 'Automatic administrator assignment disabled; administrators are provisioned by a private deployment command.';
REVOKE ALL ON FUNCTION public.assign_first_admin() FROM PUBLIC, anon, authenticated;
CREATE TABLE public.cms_pages (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), path text NOT NULL UNIQUE, title text NOT NULL DEFAULT '', description text NOT NULL DEFAULT '', share_image text NOT NULL DEFAULT '', blocks jsonb NOT NULL DEFAULT '[]'::jsonb, published boolean NOT NULL DEFAULT false, updated_at timestamptz NOT NULL DEFAULT now());
GRANT SELECT ON public.cms_pages TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.cms_pages TO authenticated;
GRANT ALL ON public.cms_pages TO service_role;
ALTER TABLE public.cms_pages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public published pages" ON public.cms_pages FOR SELECT TO anon, authenticated USING (published OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admin manage pages" ON public.cms_pages FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TABLE public.cms_media (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), url text NOT NULL, name text NOT NULL DEFAULT '', alt text NOT NULL DEFAULT '', created_at timestamptz NOT NULL DEFAULT now());
GRANT SELECT, INSERT, UPDATE, DELETE ON public.cms_media TO authenticated;
GRANT ALL ON public.cms_media TO service_role;
ALTER TABLE public.cms_media ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admin manage media" ON public.cms_media FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
ALTER TABLE public.blog_posts ADD COLUMN content_format text NOT NULL DEFAULT 'text';
ALTER TABLE public.gallery_photos ADD COLUMN caption text NOT NULL DEFAULT '', ADD COLUMN alt text NOT NULL DEFAULT '';

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
CREATE TABLE public.mail_settings (
 id text PRIMARY KEY DEFAULT 'notifications' CHECK (id='notifications'),
 config jsonb NOT NULL DEFAULT '{}'::jsonb,
 last_heartbeat timestamptz,
 updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.mail_settings TO authenticated;
GRANT ALL ON public.mail_settings TO service_role;
ALTER TABLE public.mail_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admin mail settings" ON public.mail_settings FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TABLE public.mail_jobs (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 source_kind text NOT NULL CHECK (source_kind IN ('contact','benevole','partenaire','test')),
 source_id uuid,
 config jsonb NOT NULL,
 status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','sending','sent','failed')),
 attempts integer NOT NULL DEFAULT 0,
 available_at timestamptz NOT NULL DEFAULT now(),
 created_at timestamptz NOT NULL DEFAULT now(),
 sent_at timestamptz,
 error_code text,
 UNIQUE(source_kind,source_id)
);
GRANT SELECT, INSERT ON public.mail_jobs TO authenticated;
GRANT ALL ON public.mail_jobs TO service_role;
ALTER TABLE public.mail_jobs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admin read mail jobs" ON public.mail_jobs FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "admin test mail jobs" ON public.mail_jobs FOR INSERT TO authenticated WITH CHECK (source_kind='test' AND source_id IS NULL AND public.has_role(auth.uid(),'admin'));
CREATE INDEX mail_jobs_pending ON public.mail_jobs(status,available_at);
CREATE FUNCTION public.queue_form_notification() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
DECLARE cfg jsonb; kind text;
BEGIN
 IF TG_TABLE_NAME='contact_submissions' THEN
   kind := 'contact';
 ELSE
   kind := NEW.kind;
 END IF;
 SELECT config INTO cfg FROM public.mail_settings WHERE id='notifications';
 IF cfg IS NOT NULL AND cfg->kind->>'enabled'='true' AND coalesce(cfg->kind->>'recipient','')<>'' THEN
 INSERT INTO public.mail_jobs(source_kind,source_id,config) VALUES(kind,NEW.id,cfg) ON CONFLICT(source_kind,source_id) DO NOTHING;
 END IF;
 RETURN NEW;
END; $$;
REVOKE ALL ON FUNCTION public.queue_form_notification() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.queue_form_notification() TO service_role;
CREATE TRIGGER contact_mail_notification AFTER INSERT ON public.contact_submissions FOR EACH ROW EXECUTE FUNCTION public.queue_form_notification();
CREATE TRIGGER application_mail_notification AFTER INSERT ON public.applications FOR EACH ROW EXECUTE FUNCTION public.queue_form_notification();
CREATE FUNCTION public.claim_mail_job() RETURNS SETOF public.mail_jobs LANGUAGE sql SECURITY DEFINER SET search_path=public AS $$
 UPDATE public.mail_jobs SET status='sending',attempts=attempts+1,available_at=now()+interval '5 minutes'
 WHERE id=(SELECT id FROM public.mail_jobs WHERE (status='pending' OR status='sending') AND available_at<=now() AND attempts<5 ORDER BY created_at FOR UPDATE SKIP LOCKED LIMIT 1)
 RETURNING *;
$$;
REVOKE ALL ON FUNCTION public.claim_mail_job() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.claim_mail_job() TO service_role;
COMMIT;
