import { useSetting } from './ManagedSite';
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

export function PartnerLogos() {
  const partners = readPartners(useSetting('site.partners', ''));
  return <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5" aria-label="Partenaires Green Ivory">
    {partners.map((partner, i) => <div key={partner.name + i} className="flex items-center justify-center min-h-32 bg-card border border-border rounded-lg p-6">
      <img src={partner.image} alt={partner.name} loading="lazy" className="w-full max-w-48 h-20 object-contain" />
    </div>)}
  </div>;
}
