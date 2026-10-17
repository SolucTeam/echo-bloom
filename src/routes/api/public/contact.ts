import { createFileRoute } from "@tanstack/react-router";
import { contactSubmissionSchema as ContactSchema, readContact } from '@/lib/form-settings';
import { formSpamResponse } from '@/lib/form-antispam';

export const Route = createFileRoute("/api/public/contact")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let body: unknown;
        try {
          body = await request.json();
        } catch {
          return Response.json({ ok: false, error: "Requête invalide" }, { status: 400 });
        }
        const parsed = ContactSchema.safeParse(body);
        if (!parsed.success) {
          return Response.json(
            { ok: false, error: parsed.error.issues[0]?.message ?? "Données invalides" },
            { status: 400 },
          );
        }
        const data = parsed.data;

        const spamResponse = formSpamResponse(data);
        if (spamResponse) return spamResponse;

        const ip =
          request.headers.get("cf-connecting-ip") ||
          request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
          null;

        const { supabaseAdmin } = await import('@/integrations/supabase/client.server');
        const {data:setting,error:settingsError}=await supabaseAdmin.from('site_content').select('value').eq('key','site.contact').maybeSingle();
        if(settingsError)return Response.json({ok:false,error:'Service indisponible.'},{status:503});
        const config=readContact(setting?.value||'');
        if(!config.enabled)return Response.json({ok:false,error:config.closedMessage},{status:403});
        const { error } = await supabaseAdmin.from("contact_submissions").insert({
          name: data.name || null,
          email: data.email,
          subject: data.subject,
          message: data.message,
          ip,
        });

        if (error) {
          console.error("Contact submission could not be saved.");
          return Response.json(
            { ok: false, error: "Impossible d'enregistrer votre message" },
            { status: 500 },
          );
        }

        // Email delivery is wired separately once the email domain is configured.
        return Response.json({ ok: true });
      },
    },
  },
});