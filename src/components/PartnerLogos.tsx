import type { CSSProperties } from 'react';
import { useSetting } from './ManagedSite';
import { useLang } from '@/components/Language';
import { partnersSchema, type Partner } from '@/lib/cms-schema';
import { DEFAULT_PARTNERS } from '@/data/partners';

function readPartners(raw: string): Partner[] {
  if (!raw) return DEFAULT_PARTNERS;
  try {
    const parsed = partnersSchema.parse(JSON.parse(raw));
    return parsed.length ? parsed : DEFAULT_PARTNERS;
  } catch {
    return DEFAULT_PARTNERS;
  }
}

/**
 * Bande défilante en boucle : le contenu est dédoublé et translateX(-50%)
 * boucle parfaitement. Pause au survol, statique si « Réduire les animations ».
 */
function MarqueeRow({ partners, reverse, duration }: { partners: Partner[]; reverse?: boolean; duration: string }) {
  if (!partners.length) return null;
  // Peu de logos ? On double la rangée pour que la boucle ne montre jamais de vide.
  const base = partners.length >= 4 ? partners : [...partners, ...partners];
  const copies = [...base, ...base];
  return (
    <div className="partner-marquee overflow-hidden py-2 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
      <div
        className="partner-marquee-track flex w-max items-center gap-5"
        data-reverse={reverse ? 'true' : undefined}
        style={{ '--marquee-duration': duration } as CSSProperties}
      >
        {copies.map((partner, i) => (
          <div
            key={partner.name + i}
            aria-hidden={i >= base.length}
            className="flex h-24 w-44 shrink-0 items-center justify-center rounded-lg border border-border bg-card p-4"
          >
            <img src={partner.image} alt={i >= base.length ? '' : partner.name} loading="lazy" className="h-full w-full object-contain" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function PartnerLogos() {
  const { t } = useLang();
  const partners = readPartners(useSetting('site.partners', ''));
  if (!partners.length) return null;
  const half = Math.ceil(partners.length / 2);
  return (
    <div className="grid gap-2" aria-label={t('partner.logosAria')}>
      <MarqueeRow partners={partners.slice(0, half)} duration="32s" />
      <MarqueeRow partners={partners.slice(half)} reverse duration="40s" />
    </div>
  );
}
