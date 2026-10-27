import { useSetting } from '@/components/ManagedSite';
import { readEvents, type EventItem } from '@/lib/event-schema';
import { useLang } from '@/components/Language';
import { type Lang } from '@/lib/i18n';
import { Link } from "@tanstack/react-router";
import { ArrowRight, CalendarDays, MapPin } from 'lucide-react';

function todayKey() {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

/** Découpe une date ISO (YYYY-MM-DD) en morceaux affichables selon la langue ; null si invalide. */
function dateParts(iso: string, lang: Lang) {
  const d = new Date(iso + 'T00:00:00');
  if (Number.isNaN(d.getTime())) return null;
  return {
    day: String(d.getDate()).padStart(2, '0'),
    month: new Intl.DateTimeFormat(lang === 'en' ? 'en-US' : 'fr-FR', { month: 'short' }).format(d).toUpperCase(),
    year: String(d.getFullYear()),
    long: d.toLocaleDateString(lang === 'en' ? 'en-GB' : 'fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }),
  };
}

/* Prochain événement : grande carte sombre, la date en chiffre géant comme élément dominant. */
function FeaturedEvent({ event }: { event: EventItem }) {
  const { t, lang } = useLang();
  const parts = dateParts(event.date, lang);
  return (
    <article className="bento border-0 bg-primary p-8 text-primary-foreground lg:p-12">
      <div className="grid gap-8 lg:grid-cols-[auto_1fr] lg:items-center lg:gap-12">
        <div className="flex items-baseline gap-3 border-border/40 lg:flex-col lg:items-center lg:gap-1 lg:border-r lg:pr-10 lg:text-center">
          <span className="font-display text-7xl font-bold leading-none tracking-tight lg:text-8xl">{parts?.day ?? '—'}</span>
          <span className="text-lg font-bold uppercase tracking-[0.25em] text-leaf">{parts?.month ?? ''}</span>
          <span className="text-xs font-semibold uppercase tracking-widest opacity-70 lg:mt-3">{parts?.year ?? ''}</span>
        </div>
        <div className="min-w-0">
          <span className="eyebrow !text-leaf">{t('events.next')}</span>
          <h3 className="mt-3 break-words text-3xl font-bold leading-tight lg:text-4xl">{event.title}</h3>
          {event.location && (
            <p className="mt-4 inline-flex items-center gap-2 rounded-full border border-background/15 bg-background/10 px-4 py-1.5 text-sm font-semibold">
              <MapPin className="h-4 w-4" /> {event.location}
            </p>
          )}
          {event.description && <p className="mt-4 max-w-2xl leading-relaxed opacity-85">{event.description}</p>}
          {event.url && (
            <a href={event.url} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex items-center gap-2 rounded-full bg-background px-6 py-3 text-sm font-semibold text-primary transition hover:bg-background/90">
              {t('common.learnMore')} <ArrowRight className="h-4 w-4" />
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

/** Puce de date compacte des cartes secondaires. */
function DateChip({ date }: { date: string }) {
  const { lang } = useLang();
  const parts = dateParts(date, lang);
  return (
    <div className="inline-flex shrink-0 flex-col items-center rounded-xl bg-accent px-4 py-3 text-center">
      <span className="text-[11px] font-bold uppercase tracking-widest text-primary">{parts?.month ?? '—'}</span>
      <span className="mt-0.5 font-display text-2xl font-bold leading-none text-primary">{parts?.day ?? ''}</span>
    </div>
  );
}

function UpcomingCard({ event }: { event: EventItem }) {
  const { t, lang } = useLang();
  const parts = dateParts(event.date, lang);
  return (
    <article className="bento p-6">
      <div className="flex items-start gap-5">
        <DateChip date={event.date} />
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{parts?.long ?? event.date}</p>
          <h3 className="mt-1.5 break-words text-xl font-bold leading-snug">{event.title}</h3>
          {event.location && (
            <p className="mt-2 inline-flex items-center gap-1.5 text-sm text-muted-foreground">
              <MapPin className="h-3.5 w-3.5" /> {event.location}
            </p>
          )}
        </div>
      </div>
      {event.description && <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-muted-foreground">{event.description}</p>}
      {event.url && (
        <a href={event.url} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary">
          {t('common.learnMore')} <ArrowRight className="h-4 w-4" />
        </a>
      )}
    </article>
  );
}

function PastCard({ event }: { event: EventItem }) {
  const { lang } = useLang();
  const parts = dateParts(event.date, lang);
  return (
    <article className="bento p-5">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{parts?.long ?? event.date}</p>
      <h3 className="mt-2 text-base font-bold leading-snug">{event.title}</h3>
      {event.location && <p className="mt-1.5 text-sm text-muted-foreground">{event.location}</p>}
    </article>
  );
}

/* Onglet « Événements » de la page Actualités : agenda à venir et éditions passées. */
export function EventsSection() {
  const { t } = useLang();
  const events = readEvents(useSetting('site.events'));
  const today = todayKey();
  const upcoming = events.filter((event) => event.date >= today).sort((a, b) => (a.date > b.date ? 1 : -1));
  const past = events.filter((event) => event.date < today).sort((a, b) => (a.date < b.date ? 1 : -1));
  const [next, ...rest] = upcoming;
  return (
    <>
      <section className="container-x py-12">
        {upcoming.length === 0 ? (
          <div className="bento p-10 text-center">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-accent text-primary"><CalendarDays className="h-5 w-5" /></span>
            <h2 className="mt-4 text-2xl font-bold">{t('events.emptyTitle')}</h2>
            <p className="mx-auto mt-3 max-w-md text-muted-foreground">{t('events.emptyText')}</p>
          </div>
        ) : (
          <>
            <FeaturedEvent event={next} />
            {rest.length > 0 && (
              <div className="mt-5 grid gap-5 md:grid-cols-2">
                {rest.map((event, i) => <UpcomingCard key={i} event={event} />)}
              </div>
            )}
          </>
        )}
      </section>

      {past.length > 0 && (
        <section className="container-x pb-12">
          <div className="max-w-2xl">
            <span className="eyebrow">{t('events.pastEyebrow')}</span>
            <h2 className="mt-3 text-2xl font-bold tracking-tight lg:text-3xl">{t('events.pastTitle')}</h2>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {past.map((event, i) => <PastCard key={i} event={event} />)}
          </div>
        </section>
      )}

      <section className="border-y border-border bg-accent/40">
        <div className="container-x py-12 text-center">
          <h2 className="mx-auto max-w-2xl text-2xl font-bold lg:text-3xl">{t('events.ctaTitle')}</h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">{t('events.ctaText')}</p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link to="/devenir-benevole" className="btn-primary">{t('nav.volunteer')} <ArrowRight className="h-4 w-4" /></Link>
            <Link to="/nous-joindre" className="btn-ghost">{t('footer.contactUs')}</Link>
          </div>
        </div>
      </section>
    </>
  );
}
