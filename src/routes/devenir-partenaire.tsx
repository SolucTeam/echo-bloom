import { pageHead } from '@/components/ManagedSite';
import { RouteError, RouteNotFound } from '@/components/RouteFeedback';
import { loadPage } from '@/lib/site.functions';
import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { PageHero } from "@/components/PageHero";
import { useEffect, useRef, useState } from "react";
import { Button } from '@/components/ui/button';
import { supabase } from "@/integrations/supabase/client";
import { PartnerLogos } from '@/components/PartnerLogos';
import { useLang } from '@/components/Language';
import { Heart } from 'lucide-react';
import { leafBurst } from '@/components/leafCelebration';

export const Route = createFileRoute("/devenir-partenaire")({
  loader: async () => ({ cmsPage: await loadPage({ data: '/devenir-partenaire' }) }),
  head: ({ loaderData }) => pageHead(loaderData?.cmsPage ?? null, 'Devenir partenaire — Green Ivory', 'Entreprises, institutions, ONG, collectivités : rejoignez Green Ivory et développons ensemble des solutions durables.', '/devenir-partenaire', { title: 'Become a partner — Green Ivory', description: 'Companies, institutions, NGOs, local authorities: join Green Ivory and build sustainable solutions together.' }),
  component: Partner,
  errorComponent: RouteError,
  notFoundComponent: RouteNotFound,
});

function Partner() {
  const { t } = useLang();
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const submitting = useRef(false);
  const errorSummaryRef = useRef<HTMLParagraphElement>(null);
  const submitRef = useRef<HTMLButtonElement>(null);

  // Pattern GOV.UK : après un échec d'envoi, le focus va au message d'erreur (annoncé par role="alert").
  useEffect(() => {
    if (errorMessage) errorSummaryRef.current?.focus();
  }, [errorMessage]);
  return (
    <>
      <PageHero
        eyebrow={t('partner.eyebrow')}
        title={t('nav.partner')}
        intro={t('partner.intro')}
      />
      <section className="container-x pt-12" data-partner-logos>
        <h2 className="text-2xl font-bold mb-6">{t('partner.logosTitle')}</h2>
        <PartnerLogos />
      </section>
      <section className="container-x pt-10">
        <div className="bg-primary text-primary-foreground rounded-lg p-8 sm:p-10 flex flex-col sm:flex-row sm:items-center gap-6 justify-between" data-donation-collections>
          <div className="flex items-start gap-4">
            <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-card text-card-foreground"><Heart className="h-5 w-5" aria-hidden="true" /></span>
            <div>
              <h2 className="text-xl font-bold">{t('partner.collectionsTitle')}</h2>
              <p className="mt-2 text-sm text-primary-foreground/80 max-w-xl">{t('partner.collectionsText')}</p>
            </div>
          </div>
          <Link to="/faire-un-don" className="shrink-0 rounded-full bg-background text-primary px-6 py-3 text-sm font-semibold transition-all hover:opacity-90">{t('nav.donate')}</Link>
        </div>
      </section>

      <section className="container-x py-16 grid lg:grid-cols-5 gap-10 items-start">
        <div className="lg:col-span-2 space-y-6">
          <div className="bento p-7">
            <h3 className="text-xl font-bold">{t('partner.whyTitle')}</h3>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground list-disc pl-5">
              <li>{t('partner.why1')}</li>
              <li>{t('partner.why2')}</li>
              <li>{t('partner.why3')}</li>
              <li>{t('partner.why4')}</li>
            </ul>
          </div>
        </div>

        <form
          className="lg:col-span-3 bento p-8 grid sm:grid-cols-2 gap-4"
          onSubmit={async (e) => {
            e.preventDefault();
            if (submitting.current) return;
            submitting.current = true;
            setBusy(true); setSent(false); setErrorMessage('');
            const form = e.currentTarget;
            const f = new FormData(form);
            const g = (k: string) => String(f.get(k) ?? "").trim().slice(0, 5000) || null;
            const name = [g("firstname"), g("lastname")].filter(Boolean).join(" ");
            const msg = [g("country") && `Pays : ${g("country")}`, g("message")].filter(Boolean).join("\n\n");
            try {
              const { error } = await supabase.from("applications").insert({ kind: "partenaire", name, email: g("email") ?? "", phone: g("phone"), organization: g("org"), message: msg || null });
              if (error) throw new Error(t('partner.sendFailed'));
              setSent(true); form.reset();
              const rect = submitRef.current?.getBoundingClientRect();
              if (rect) leafBurst(rect.left + rect.width / 2, rect.top);
            } catch { setErrorMessage(t('partner.sendFailed')); }
            finally { submitting.current = false; setBusy(false); }
          }}
        >
          <h3 className="sm:col-span-2 text-2xl font-bold">{t('partner.formTitle')}</h3>
          <Field label={t('form.lastName')} name="lastname" required />
          <Field label={t('form.firstName')} name="firstname" required />
          <Field label={t('form.email')} name="email" type="email" required />
          <Field label={t('form.phone')} name="phone" />
          <Field label={t('form.residenceCountry')} name="country" />
          <Field label={t('form.organization')} name="org" />
          <div className="sm:col-span-2">
            <label htmlFor="partner-message" className="text-sm font-medium">{t('form.yourMessage')}</label>
            <textarea id="partner-message" name="message" maxLength={5000} required rows={5} className="mt-2 w-full rounded-2xl border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <Button ref={submitRef} type="submit" disabled={busy} className="sm:col-span-2 btn-primary justify-center">{busy ? t('form.sending') : t('form.sendRequest')}</Button>
          {errorMessage && <p ref={errorSummaryRef} tabIndex={-1} role="alert" className="sm:col-span-2 text-sm text-destructive">{errorMessage}</p>}
          {sent && <p role="status" className="sm:col-span-2 text-sm text-secondary font-medium">{t('partner.sentThanks')}</p>}
        </form>
      </section>
    </>
  );
}

function Field({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label htmlFor={'partner-'+props.name} className="text-sm font-medium">{label}</label>
      <input id={'partner-'+props.name} {...props} className="mt-2 w-full rounded-full border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
    </div>
  );
}
