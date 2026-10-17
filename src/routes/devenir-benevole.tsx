import { pageHead, useSetting } from '@/components/ManagedSite';
import { loadPage } from '@/lib/site.functions';
import { createFileRoute } from '@tanstack/react-router';
import { PageHero } from '@/components/PageHero';
import { useRef, useState } from 'react';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { readVolunteer, volunteerSubmissionSchema } from '@/lib/form-settings';

export const Route = createFileRoute('/devenir-benevole')({
  loader: async () => ({ cmsPage: await loadPage({ data: '/devenir-benevole' }) }),
  head: ({ loaderData }) => pageHead(loaderData?.cmsPage ?? null, 'Devenir bénévole — Green Ivory', 'Rejoignez la communauté des bénévoles Green Ivory et passez à l’action pour l’environnement en Côte d’Ivoire.', '/devenir-benevole'),
  component: Volunteer,
});
function Volunteer() {
  const config = readVolunteer(useSetting('site.volunteer'));
  const [sent, setSent] = useState(false), [busy, setBusy] = useState(false), [error, setError] = useState('');
  const startedAt = useRef(Date.now());
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const result = volunteerSubmissionSchema.safeParse({ ...Object.fromEntries(new FormData(form)), startedAt: startedAt.current });
    if (!result.success) { setError(result.error.issues[0]?.message || 'Vérifiez les champs.'); return; }
    setBusy(true); setError(''); setSent(false);
    try {
      const response = await fetch('/api/public/volunteer', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(result.data) });
      const reply = await response.json() as { ok?: boolean; error?: string };
      if (!response.ok || !reply.ok) throw new Error(reply.error || 'Envoi impossible.');
      setSent(true); form.reset(); startedAt.current = Date.now();
    } catch (err) { setError(err instanceof Error ? err.message : 'Envoi impossible.'); }
    finally { setBusy(false); }
  }
  return <>
    <PageHero eyebrow="Devenir bénévole" title={config.title} intro={config.intro}/>
    <section className="container-x py-16 grid lg:grid-cols-2 gap-10 items-start">
      <div><h2 className="text-2xl font-bold">Vos missions possibles</h2><ul className="mt-6 space-y-3">{config.missions.map((m, i) => <li key={i} className="flex gap-3"><CheckCircle2 className="h-5 w-5 text-secondary mt-0.5 shrink-0"/>{m}</li>)}</ul></div>
      {config.enabled ? <form className="bento p-8 grid sm:grid-cols-2 gap-4" onSubmit={submit} noValidate>
        <h3 className="sm:col-span-2 text-2xl font-bold">{config.formTitle}</h3>
        {config.description && <p className="sm:col-span-2 text-muted-foreground">{config.description}</p>}
        <div aria-hidden="true" className="hidden"><input name="website" tabIndex={-1} autoComplete="off"/></div>
        <Field label="Nom complet" name="name" maxLength={200} required autoComplete="name"/>
        <Field label="E-mail" name="email" type="email" maxLength={255} required autoComplete="email"/>
        {config.showPhone && <Field label="Téléphone" name="phone" maxLength={50} autoComplete="tel"/>}
        {config.showCity && <Field label="Ville" name="city" maxLength={100}/>}
        {config.showMessage && <div className="sm:col-span-2"><label htmlFor="volunteer-message" className="text-sm font-medium">{config.messageLabel}</label><textarea id="volunteer-message" name="message" maxLength={5000} rows={5} className="mt-2 w-full rounded-lg border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"/></div>}
        <Button type="submit" disabled={busy} className="sm:col-span-2">{busy ? <><Loader2 className="animate-spin"/>Envoi en cours…</> : config.buttonLabel}</Button>
        {error && <p role="alert" className="sm:col-span-2 text-sm text-destructive">{error}</p>}
        {sent && <p role="status" className="sm:col-span-2 text-sm text-secondary font-medium">{config.successMessage}</p>}
      </form> : <p role="status" className="border-l-4 border-primary p-6 bg-accent">{config.closedMessage}</p>}
    </section>
  </>;
}
function Field({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return <div><label htmlFor={'volunteer-' + props.name} className="text-sm font-medium">{label}</label><input id={'volunteer-' + props.name} {...props} className="mt-2 w-full rounded-lg border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"/></div>;
}
