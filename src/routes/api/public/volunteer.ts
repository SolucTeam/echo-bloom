import { createFileRoute } from '@tanstack/react-router';
import { readVolunteer, volunteerSubmissionSchema, volunteerApplication } from '@/lib/form-settings';

export const Route = createFileRoute('/api/public/volunteer')({
  server: { handlers: { POST: async ({ request }) => {
    let body: unknown;
    try { body = await request.json(); } catch { return Response.json({ ok: false, error: 'Requête invalide.' }, { status: 400 }); }
    const result = volunteerSubmissionSchema.safeParse(body);
    if (!result.success) return Response.json({ ok: false, error: result.error.issues[0]?.message || 'Données invalides.' }, { status: 400 });
    const data = result.data;
    if (data.website || Date.now() - data.startedAt < 2000) return Response.json({ ok: true });
    const { supabaseAdmin } = await import('@/integrations/supabase/client.server');
    const { data: setting, error: settingsError } = await supabaseAdmin.from('site_content').select('value').eq('key', 'site.volunteer').maybeSingle();
    if (settingsError) return Response.json({ ok: false, error: 'Service indisponible.' }, { status: 503 });
    const config = readVolunteer(setting?.value || '');
    if (!config.enabled) return Response.json({ ok: false, error: config.closedMessage }, { status: 403 });
    const { error } = await supabaseAdmin.from('applications').insert(volunteerApplication(data, config));
    if (error) return Response.json({ ok: false, error: 'Envoi impossible, réessayez.' }, { status: 500 });
    return Response.json({ ok: true });
  } } },
});
