import { pageHead } from '@/components/ManagedSite';
import { RouteError, RouteNotFound } from '@/components/RouteFeedback';
import { loadPage } from '@/lib/site.functions';
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { PageHero } from "@/components/PageHero";
import { MapPin, Phone, Mail, ArrowRight, Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useSetting } from '@/components/ManagedSite';

import { Button } from '@/components/ui/button';
import { readContact, contactSubmissionSchema, localizedContact } from '@/lib/form-settings';
import { useLang } from '@/components/Language';

export const Route = createFileRoute("/nous-joindre")({
  loader:async()=>({cmsPage:await loadPage({data:'/nous-joindre'})}),
  head: ({ loaderData }) => pageHead(loaderData?.cmsPage ?? null, 'Contact — Green Ivory | Écrivez-nous', "Contactez l'ONG Green Ivory : adresses, téléphone et formulaire pour un partenariat, une question ou une proposition de projet.", '/nous-joindre', { title: 'Contact — Green Ivory | Write to us', description: 'Contact the Green Ivory NGO: addresses, phone and form for a partnership, a question or a project proposal.' }),
  component: Contact,
  errorComponent: RouteError,
  notFoundComponent: RouteNotFound,
});

type FormErrors = Partial<Record<"name" | "email" | "subject" | "message" | "form", string>>;

function Contact() {
  const { t, tMsg, lang } = useLang();
  const address=useSetting('site.address','Bingerville Cité Ital, Côte d’Ivoire'),phone=useSetting('site.phone','+225 07 772 689 96'),email=useSetting('site.email','info@greenivory.org'),recruitment=useSetting('site.recruitment','recrutement@greenivory.org');
  const config=localizedContact(readContact(useSetting('site.contact')),lang);
  const navigate = useNavigate();
  const startedAtRef = useRef<number>(Date.now());
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const formErrorRef = useRef<HTMLParagraphElement>(null);

  // Pattern GOV.UK : après un échec serveur, le focus va au message d'erreur (annoncé par role="alert").
  useEffect(() => {
    if (errors.form) formErrorRef.current?.focus();
  }, [errors.form]);

  function validate(form: HTMLFormElement): FormErrors {
    const fd = new FormData(form);
    const parsed=contactSubmissionSchema.safeParse({...Object.fromEntries(fd),startedAt:startedAtRef.current});
    const e: FormErrors = {};
    if(!parsed.success)for(const issue of parsed.error.issues){const key=issue.path[0];if(key==='name'||key==='email'||key==='subject'||key==='message')e[key]=tMsg(issue.message);}
    return e;
  }

  async function onSubmit(ev: React.FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    const form = ev.currentTarget;
    const v = validate(form);
    if (Object.keys(v).length > 0) {
      setErrors(v);
      // Le focus va au premier champ invalide : les utilisateurs clavier/lecteur d'écran
      // trouvent l'erreur sans devoir la chercher.
      const first = (["name", "email", "subject", "message"] as const).find((k) => v[k]);
      if (first) document.getElementById(first)?.focus();
      return;
    }
    setErrors({});
    setLoading(true);
    const fd = new FormData(form);
    const payload = {
      name: String(fd.get("name") ?? ""),
      email: String(fd.get("email") ?? ""),
      subject: String(fd.get("subject") ?? ""),
      message: String(fd.get("message") ?? ""),
      website: String(fd.get("website") ?? ""), // honeypot
      startedAt: startedAtRef.current,
    };
    try {
      const res = await fetch("/api/public/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (!res.ok || !json.ok) {
        setErrors({ form: json.error || t('contact.errorGeneric') });
        setLoading(false);
        return;
      }
      navigate({ to: "/merci" });
    } catch {
      setErrors({ form: t('contact.errorNetwork') });
      setLoading(false);
    }
  }

  return (
    <>
      <PageHero
        eyebrow={t('nav.contact')}
        title={config.title}
        intro={config.intro}
      />

      <section className="container-x py-16 grid lg:grid-cols-3 gap-6">
        <InfoCard icon={<MapPin className="h-5 w-5" />} label={t('contact.addressLabel')} lines={[address]} />
        <InfoCard icon={<Phone className="h-5 w-5" />} label={t('contact.phoneLabel')} lines={[phone]} />
        <InfoCard icon={<Mail className="h-5 w-5" />} label={t('contact.emailsLabel')} lines={[email,recruitment]} />
      </section>

      <section className="container-x py-6 lg:py-10 grid lg:grid-cols-2 gap-10 items-start">
        <div>
          <h2 className="text-3xl lg:text-4xl font-bold">{config.formTitle}</h2>
          <p className="mt-4 text-muted-foreground max-w-md">
            {config.description}
          </p>
          <div className="mt-8 bento p-6 bg-accent border-0">
            <h3 className="font-semibold text-lg">{t('nav.volunteer')}</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {t('contact.volunteerText')}
            </p>
            <Link to="/devenir-benevole" className="mt-5 btn-primary inline-flex">
              <ArrowRight className="h-4 w-4" /> {t('nav.volunteer')}
            </Link>
          </div>
        </div>

        {config.enabled ? <form className="bento p-7 space-y-4" onSubmit={onSubmit} noValidate>
          {/* Honeypot — must remain empty. Hidden from humans. */}
          <div aria-hidden="true" className="absolute -left-[9999px] top-auto h-0 w-0 overflow-hidden">
            <label>
              {t('form.honeypot')}
              <input type="text" name="website" tabIndex={-1} autoComplete="off" />
            </label>
          </div>

          <Field label={t('contact.nameLabel')} name="name" maxLength={100} autoComplete="name" error={errors.name} />
          <Field label={t('form.email')} name="email" type="email" maxLength={255} required autoComplete="email" error={errors.email} />
          <Field label={t('contact.subjectLabel')} name="subject" maxLength={200} required error={errors.subject} />
          <div>
            <label className="text-sm font-medium" htmlFor="message">{t('form.message')}</label>
            <textarea
              id="message"
              name="message"
              required
              rows={6}
              maxLength={5000}
              className="mt-2 w-full rounded-2xl border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              aria-invalid={errors.message ? true : undefined}
            />
            {errors.message && <p className="mt-1 text-xs text-destructive">{errors.message}</p>}
          </div>

          {errors.form && (
            <p ref={formErrorRef} tabIndex={-1} role="alert" className="rounded-xl bg-destructive/10 text-destructive px-4 py-3 text-sm">
              {errors.form}
            </p>
          )}

          <Button type="submit" disabled={loading} className="btn-primary w-full justify-center disabled:opacity-60">
            {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> {t('form.sending')}</> : config.buttonLabel}
          </Button>
          <p className="text-xs text-muted-foreground">
            {t('contact.privacy')}
          </p>
        </form> : <p data-form-closed role="status" className="border-l-4 border-primary p-6 bg-accent">{config.closedMessage}</p>}
      </section>
    </>
  );
}

function InfoCard({ icon, label, lines }: { icon: React.ReactNode; label: string; lines: string[] }) {
  return (
    <div className="bento p-7">
      <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-accent text-primary">{icon}</span>
      <div className="mt-4 text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
      {lines.map((l) => <div key={l} className="font-semibold">{l}</div>)}
    </div>
  );
}

function Field({
  label,
  error,
  ...props
}: { label: string; error?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label className="text-sm font-medium" htmlFor={props.name}>{label}</label>
      <input
        id={props.name}
        {...props}
        aria-invalid={error ? true : undefined}
        className="mt-2 w-full rounded-full border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
      />
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
}
