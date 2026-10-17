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
 kind := CASE WHEN TG_TABLE_NAME='contact_submissions' THEN 'contact' ELSE NEW.kind END;
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