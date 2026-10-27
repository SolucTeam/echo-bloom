import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { useEffect, useRef } from "react";

import { useSetting } from '@/components/ManagedSite';
import { readContact } from '@/lib/form-settings';
import { useLang } from '@/components/Language';
import { leafBurst } from '@/components/leafCelebration';

const SITE_URL = import.meta.env.VITE_SITE_URL || "https://green-ivory-tan.vercel.app";

export const Route = createFileRoute("/merci")({
  head: () => ({
    meta: [
      { title: "Message reçu — Merci ! | Green Ivory" },
      { name: "description", content: "Merci de nous avoir écrit. L'équipe Green Ivory revient vers vous dans les 48 heures." },
      { property: "og:title", content: "Merci pour votre message — Green Ivory" },
      { property: "og:description", content: "Votre message a bien été reçu. Nous vous répondons sous 48h." },
      { property: "og:url", content: `${SITE_URL}/merci` },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex,follow" },
      /* Phase 3 bilingue : version anglaise optionnelle, appliquée côté client par Language.tsx. */
      { name: "x-title-en", content: "Message received — Thank you! | Green Ivory" },
      { name: "x-description-en", content: "Thank you for writing to us. The Green Ivory team will get back to you within 48 hours." },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/merci` }],
  }),
  component: ThankYou,
});

function ThankYou() {
  const { t } = useLang();
  const config=readContact(useSetting('site.contact'));
  const badgeRef = useRef<HTMLSpanElement>(null);
  // Célébration à l'arrivée sur la page : une pluie de feuilles depuis la coche (rien en mouvement réduit).
  useEffect(() => {
    const rect = badgeRef.current?.getBoundingClientRect();
    if (rect) leafBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 18);
  }, []);
  return (
    <section className="container-x py-24 lg:py-32">
      <div className="bento p-10 lg:p-14 max-w-2xl mx-auto text-center">
        <span ref={badgeRef} className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-accent text-primary">
          <CheckCircle2 className="h-8 w-8" />
        </span>
        <h1 className="mt-6 text-3xl lg:text-4xl font-bold">{t('merci.title')}</h1>
        <p className="mt-4 text-muted-foreground">
          {config.successMessage}
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link to="/" className="btn-ghost">{t('notfound.backHome')}</Link>
          <Link to="/blog" className="btn-primary">
            {t('merci.readArticles')} <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-10 grid sm:grid-cols-2 gap-3 text-sm">
          <Link to="/programmes" className="bento p-4 hover:bg-accent transition">{t('home.ctaDiscover')}</Link>
          <Link to="/devenir-benevole" className="bento p-4 hover:bg-accent transition">{t('nav.volunteer')}</Link>
        </div>
      </div>
    </section>
  );
}