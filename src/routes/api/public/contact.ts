import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const ContactSchema = z.object({
  name: z.string().trim().max(100).optional().or(z.literal("")),
  email: z.string().trim().email("Email invalide").max(255),
  subject: z.string().trim().min(2, "Objet trop court").max(200),
  message: z.string().trim().min(10, "Message trop court").max(5000),
  // Honeypot (must stay empty)
  website: z.string().max(0).optional().or(z.literal("")),
  // Time-trap: ms since form rendered
  startedAt: z.number().int().nonnegative().optional(),
});

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

        // Honeypot triggered → pretend success
        if (data.website && data.website.length > 0) {
          return Response.json({ ok: true });
        }
        // Submitted too fast (<2s) → likely a bot
        if (typeof data.startedAt === "number") {
          const elapsed = Date.now() - data.startedAt;
          if (elapsed >= 0 && elapsed < 2000) {
            return Response.json({ ok: true });
          }
        }

        const ip =
          request.headers.get("cf-connecting-ip") ||
          request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
          null;

        const { supabaseAdmin } = await import('@/integrations/supabase/client.server');
        const { error } = await supabaseAdmin.from("contact_submissions").insert({
          name: data.name || null,
          email: data.email,
          subject: data.subject,
          message: data.message,
          ip,
        });

        if (error) {
          console.error("contact insert error", error);
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