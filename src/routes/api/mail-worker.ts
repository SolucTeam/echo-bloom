import { createFileRoute } from "@tanstack/react-router";
import { timingSafeEqual } from "node:crypto";
import { mailSettingsSchema } from "@/lib/mail-settings";
import { notificationMessage } from "@/lib/mail-message";

// Traitement de la file d'e-mails pour les déclencheurs automatiques.
// Authentification : en-tête « Authorization: Bearer <CRON_SECRET> » — Vercel
// l'ajoute automatiquement aux invocations de cron lorsque CRON_SECRET est défini ;
// un cron externe (pinger) doit l'envoyer lui-même. Sans secret configuré,
// l'endpoint répond 404 : fonctionnalité désactivée.

const MAX_JOBS_PER_RUN = 5;

export const Route = createFileRoute("/api/mail-worker")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const secret = process.env.CRON_SECRET;
        if (!secret) return new Response(null, { status: 404 });
        const auth = request.headers.get("authorization") || "";
        const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
        const authorized =
          token.length === secret.length &&
          timingSafeEqual(Buffer.from(token), Buffer.from(secret));
        if (!authorized) return Response.json({ ok: false }, { status: 401 });

        const host = process.env.SMTP_HOST;
        const user = process.env.SMTP_USER;
        const pass = process.env.SMTP_PASSWORD;
        const port = Number(process.env.SMTP_PORT || "465");
        if (!host || !user || !pass || ![465, 587].includes(port)) {
          return Response.json({ ok: false, error: "SMTP non configuré" }, { status: 503 });
        }

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { default: nodemailer } = await import("nodemailer");
        let transport;
        try {
          transport = nodemailer.createTransport({
            host, port, secure: port === 465, requireTLS: true,
            auth: { user, pass },
            tls: { rejectUnauthorized: true },
            connectionTimeout: 15_000, greetingTimeout: 15_000, socketTimeout: 30_000,
          });
          await transport.verify();
        } catch {
          return Response.json({ ok: false, error: "Connexion SMTP impossible" }, { status: 502 });
        }

        await supabaseAdmin
          .from("mail_settings")
          .update({ last_heartbeat: new Date().toISOString() })
          .eq("id", "notifications");
        await supabaseAdmin
          .from("mail_jobs")
          .update({ status: "failed", error_code: "retry_exhausted" })
          .eq("status", "sending")
          .gte("attempts", 5)
          .lte("available_at", new Date().toISOString());

        let sent = 0, failed = 0, disabled = 0;
        for (let i = 0; i < MAX_JOBS_PER_RUN; i++) {
          const { data, error } = await supabaseAdmin.rpc("claim_mail_job");
          if (error || !data?.length) break;
          const job = data[0];
          try {
            const config = mailSettingsSchema.parse(job.config);
            const { data: current, error: settingsError } = await supabaseAdmin
              .from("mail_settings")
              .select("config")
              .eq("id", "notifications")
              .single();
            if (settingsError || !current) throw new Error("settings_unavailable");
            const active = mailSettingsSchema.parse(current.config);
            const kind = job.source_kind as "contact" | "benevole" | "partenaire";
            if (job.source_kind !== "test" && !active[kind].enabled) {
              await supabaseAdmin.from("mail_jobs").update({ status: "failed", error_code: "disabled" }).eq("id", job.id);
              disabled++;
              continue;
            }
            let source = {};
            if (job.source_kind !== "test") {
              const result = await supabaseAdmin
                .from(job.source_kind === "contact" ? "contact_submissions" : "applications")
                .select("*")
                .eq("id", job.source_id)
                .single();
              if (result.error || !result.data) throw new Error("source_missing");
              source = result.data;
            }
            await transport.sendMail({
              ...notificationMessage(config, job.source_kind, source),
              messageId: `<${job.id}@green-ivory.local>`,
            });
            await supabaseAdmin
              .from("mail_jobs")
              .update({ status: "sent", sent_at: new Date().toISOString(), error_code: null })
              .eq("id", job.id);
            sent++;
          } catch {
            await supabaseAdmin
              .from("mail_jobs")
              .update({
                status: job.attempts >= 5 ? "failed" : "pending",
                available_at: new Date(Date.now() + 60_000 * job.attempts).toISOString(),
                error_code: "delivery_failed",
              })
              .eq("id", job.id);
            failed++;
          }
        }
        return Response.json({ ok: true, sent, failed, disabled });
      },
    },
  },
});
