import { useSetting } from '@/components/ManagedSite';
import { readPress, type PressItem } from '@/lib/press-schema';
import { useLang } from '@/components/Language';
import { type Lang } from '@/lib/i18n';
import { Link } from "@tanstack/react-router";
import { ArrowRight, Camera, Download, FileText, Mail, Megaphone, Phone } from 'lucide-react';

/** Découpe une date ISO (YYYY-MM-DD) en morceaux affichables selon la langue ; null si invalide. */
function dateParts(iso: string, lang: Lang) {
  const d = new Date(iso + 'T00:00:00');
  if (Number.isNaN(d.getTime())) return null;
  return {
    day: String(d.getDate()).padStart(2, '0'),
    month: new Intl.DateTimeFormat(lang === 'en' ? 'en-US' : 'fr-FR', { month: 'short' }).format(d).toUpperCase(),
    year: String(d.getFullYear()),
    long: d.toLocaleDateString(lang === 'en' ? 'en-GB' : 'fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }),
  };
}

/** Volet du kit média : une colonne du bloc divisé en trois. */
function KitCell({ icon, title, text, children }: { icon: React.ReactNode; title: string; text: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col p-6 lg:p-8">
      <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-accent text-primary">{icon}</span>
      <h3 className="mt-5 text-lg font-bold">{title}</h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{text}</p>
      <div className="mt-5">{children}</div>
    </div>
  );
}

/* Communiqué à la une : bloc date sombre en tête de liste. */
function FeaturedRelease({ item }: { item: PressItem }) {
  const { t, lang } = useLang();
  const parts = dateParts(item.date, lang);
  return (
    <article className="bento mt-8 p-6 lg:p-8">
      <div className="grid gap-6 md:grid-cols-[auto_1fr] md:gap-8">
        <div className="inline-flex w-fit shrink-0 flex-col items-center rounded-2xl bg-primary px-6 py-4 text-center text-primary-foreground">
          <span className="text-[11px] font-bold uppercase tracking-widest opacity-80">{parts?.month ?? '—'}</span>
          <span className="mt-0.5 font-display text-4xl font-bold leading-none">{parts?.day ?? ''}</span>
          <span className="mt-1 text-[11px] font-semibold uppercase tracking-widest opacity-80">{parts?.year ?? ''}</span>
        </div>
        <div className="min-w-0">
          <h3 className="break-words text-xl font-bold leading-snug lg:text-2xl">{item.title}</h3>
          {item.summary && <p className="mt-3 max-w-3xl leading-relaxed text-muted-foreground">{item.summary}</p>}
          {item.url && (
            <a href={item.url} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary">
              <Download className="h-4 w-4" /> {t('press.downloadRelease')}
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

function ReleaseCard({ item }: { item: PressItem }) {
  const { t, lang } = useLang();
  const parts = dateParts(item.date, lang);
  return (
    <article className="bento flex flex-col p-6">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{parts?.long ?? item.date}</p>
      <h3 className="mt-2 break-words text-lg font-bold leading-snug">{item.title}</h3>
      {item.summary && <p className="mt-2 flex-1 line-clamp-3 text-sm leading-relaxed text-muted-foreground">{item.summary}</p>}
      {item.url && (
        <a href={item.url} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary">
          <Download className="h-4 w-4" /> {t('press.download')}
        </a>
      )}
    </article>
  );
}

/* Onglet « Presse » de la page Actualités : kit média, communiqués et contact. */
export function PressSection() {
  const { t } = useLang();
  const items = readPress(useSetting('site.press')).slice().sort((a, b) => (a.date < b.date ? 1 : -1));
  const email = useSetting('site.email', 'info@greenivory.org');
  const phone = useSetting('site.phone', '+225 07 772 689 96');
  const [featured, ...rest] = items;
  return (
    <>
      {/* Kit média — un seul bloc divisé en trois volets */}
      <section className="container-x py-12">
        <div className="max-w-2xl">
          <span className="eyebrow">{t('press.eyebrow')}</span>
          <h2 className="mt-3 text-2xl font-bold tracking-tight lg:text-3xl">{t('press.kitTitle')}</h2>
          <p className="mt-3 text-muted-foreground">{t('press.kitIntro')}</p>
        </div>
        <div className="bento mt-8 p-2 lg:p-3">
          <div className="grid gap-2 divide-border md:grid-cols-3 md:gap-0 md:divide-x">
            <KitCell icon={<FileText className="h-5 w-5" />} title={t('press.kitBrand')} text={t('press.kitBrandText')}>
              <a href={'mailto:' + email + '?subject=' + encodeURIComponent(t('press.kitBrandSubject'))} className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
                {t('press.kitBrandCta')} <ArrowRight className="h-4 w-4" />
              </a>
            </KitCell>
            <KitCell icon={<Camera className="h-5 w-5" />} title={t('press.kitPhotos')} text={t('press.kitPhotosText')}>
              <Link to="/actualites" search={{ vue: 'galerie' }} className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
                {t('press.kitPhotosCta')} <ArrowRight className="h-4 w-4" />
              </Link>
            </KitCell>
            <KitCell icon={<Megaphone className="h-5 w-5" />} title={t('press.kitInterviews')} text={t('press.kitInterviewsText')}>
              <a href={'mailto:' + email + '?subject=' + encodeURIComponent(t('press.kitInterviewSubject'))} className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
                {t('press.kitInterviewsCta')} <ArrowRight className="h-4 w-4" />
              </a>
            </KitCell>
          </div>
        </div>
      </section>

      {/* Communiqués — le plus récent à la une */}
      <section className="container-x pb-12">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-2xl">
            <span className="eyebrow">{t('press.releasesEyebrow')}</span>
            <h2 className="mt-3 text-2xl font-bold tracking-tight lg:text-3xl">{t('press.releasesTitle')}</h2>
          </div>
          {items.length > 0 && <p className="pb-1 text-sm text-muted-foreground">{items.length > 1 ? t('press.countMany', { n: items.length }) : t('press.countOne')}</p>}
        </div>
        {items.length === 0 ? (
          <div className="bento mt-8 p-10 text-center">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-accent text-primary"><FileText className="h-5 w-5" /></span>
            <h3 className="mt-4 text-xl font-bold">{t('press.emptyTitle')}</h3>
            <p className="mx-auto mt-3 max-w-md text-muted-foreground">{t('press.emptyText')}</p>
          </div>
        ) : (
          <>
            <FeaturedRelease item={featured} />
            {rest.length > 0 && (
              <div className="mt-5 grid gap-5 md:grid-cols-2">
                {rest.map((item, i) => <ReleaseCard key={i} item={item} />)}
              </div>
            )}
          </>
        )}
      </section>

      {/* Contact presse — bandeau compact */}
      <section className="container-x pb-12">
        <div className="bento flex flex-wrap items-center justify-between gap-6 border-0 bg-accent p-8 lg:p-10">
          <div className="max-w-xl">
            <h2 className="text-2xl font-bold">{t('press.contactTitle')}</h2>
            <p className="mt-2 text-sm text-foreground/70">{t('press.contactText')}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a href={'mailto:' + email} className="btn-primary"><Mail className="h-4 w-4" /> {t('press.contactCta')}</a>
            <a href={'tel:' + phone.replace(/\s/g, '')} className="btn-ghost"><Phone className="h-4 w-4" /> {phone}</a>
          </div>
        </div>
      </section>
    </>
  );
}
