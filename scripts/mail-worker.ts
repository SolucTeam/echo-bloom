// Private standalone process: never imported by src/ or the managed Worker.
import { readFileSync } from 'node:fs';
import nodemailer from 'nodemailer';
import { createClient } from '@supabase/supabase-js';
import { mailSettingsSchema } from '../src/lib/mail-settings';
import { notificationMessage } from './mail-message';

function required(name: string) { const value = process.env[name]; if (!value) throw new Error('missing_configuration'); return value; }
async function main() {
  if (process.env['MAIL_WORKER_ENABLED'] !== 'true') {
    console.log('Mail delivery disabled.');
    await new Promise(() => {});
    return;
  }
  const port = Number(process.env['SMTP_PORT'] || '587');
  if (![465, 587].includes(port)) throw new Error('invalid_smtp_port');
  const password = readFileSync(required('SMTP_PASSWORD_FILE'), 'utf8').trim();
  if (!password) throw new Error('missing_smtp_password');
  const transport = nodemailer.createTransport({
    host: required('SMTP_HOST'), port, secure: port === 465, requireTLS: true,
    auth: { user: required('SMTP_USER'), pass: password },
    tls: { rejectUnauthorized: true }, connectionTimeout: 15_000, greetingTimeout: 15_000, socketTimeout: 30_000,
  });
  const db = createClient(required('SUPABASE_URL'), required('SUPABASE_SERVICE_ROLE_KEY'), { auth: { persistSession: false, autoRefreshToken: false } });
  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
  while (true) {
    try {
      await transport.verify();
      await db.from('mail_settings').update({ last_heartbeat: new Date().toISOString() }).eq('id', 'notifications');
      await db.from('mail_jobs').update({status:'failed',error_code:'retry_exhausted'}).eq('status','sending').gte('attempts',5).lte('available_at',new Date().toISOString());
      const {data, error} = await db.rpc('claim_mail_job');
      if (error) throw new Error('queue_unavailable');
      const job = data?.[0];
      if (job) {
        try {
          const config = mailSettingsSchema.parse(job.config);
          const {data: current, error: settingsError} = await db.from('mail_settings').select('config').eq('id', 'notifications').single();
          if (settingsError) throw new Error('settings_unavailable');
          const active = mailSettingsSchema.parse(current.config);
          if (job.source_kind !== 'test' && !active[job.source_kind as 'contact' | 'benevole' | 'partenaire'].enabled) {
            await db.from('mail_jobs').update({status: 'failed', error_code: 'disabled'}).eq('id', job.id);
          } else {
            let source = {};
            if (job.source_kind !== 'test') {
              const result = await db.from(job.source_kind === 'contact' ? 'contact_submissions' : 'applications').select('*').eq('id', job.source_id).single();
              if (result.error || !result.data) throw new Error('source_missing');
              source = result.data;
            }
            await transport.sendMail({...notificationMessage(config, job.source_kind, source), messageId: `<${job.id}@green-ivory.local>`});
            const result = await db.from('mail_jobs').update({status: 'sent', sent_at: new Date().toISOString(), error_code: null}).eq('id', job.id);
            if (result.error) console.error('Mail status update failed.');
          }
        } catch {
          await db.from('mail_jobs').update({status: job.attempts >= 5 ? 'failed' : 'pending', available_at: new Date(Date.now() + 60_000 * job.attempts).toISOString(), error_code: 'delivery_failed'}).eq('id', job.id);
          console.error('Mail delivery failed; check private server configuration.');
        }
      }
      await sleep(5000);
    } catch {
      console.error('Mail server unavailable; retrying.');
      await sleep(30_000);
    }
  }
}
main().catch(() => { console.error('Mail worker configuration invalid.'); process.exit(1); });