import thinkHuman from '@/assets/think-human.jpg.asset.json';
import unicef from '@/assets/unicef.png.asset.json';
import europeanUnion from '@/assets/european-union.jpg.asset.json';

const partners = [
  { name: 'Think Human Foundation', image: thinkHuman.url },
  { name: 'UNICEF', image: unicef.url },
  { name: 'Union européenne', image: europeanUnion.url },
];

export function PartnerLogos() {
  return <div className="grid grid-cols-1 sm:grid-cols-3 gap-5" aria-label="Partenaires Green Ivory">
    {partners.map(partner => <div key={partner.name} className="flex items-center justify-center min-h-32 bg-card border border-border rounded-lg p-6">
      <img src={partner.image} alt={partner.name} loading="lazy" className="w-full max-w-48 h-20 object-contain" />
    </div>)}
  </div>;
}