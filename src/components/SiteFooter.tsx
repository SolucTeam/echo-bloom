import { Link } from "@tanstack/react-router";
import { Facebook, Linkedin, Instagram, Youtube, Mail, Phone, MapPin, Lock } from "lucide-react";
import { normalizeMenu } from '@/lib/programs';
import { useSetting } from './ManagedSite';
import { useLang } from './Language';
import { Button } from '@/components/ui/button';
import { readNewsletter } from '@/lib/newsletter';
import { ExternalLink } from 'lucide-react';
import logoMark from '@/assets/logo-mark.png';

export function SiteFooter() {
  const { t, tLabel } = useLang();
  const name=useSetting('site.name','Green Ivory'),tagline=useSetting('site.tagline',t('footer.tagline')),address=useSetting('site.address','Bingerville Cité Ital, Côte d’Ivoire'),phone=useSetting('site.phone','+225 07 772 689 96'),email=useSetting('site.email','info@greenivory.org');
  const facebook=useSetting('social.facebook'),linkedin=useSetting('social.linkedin'),instagram=useSetting('social.instagram'),youtube=useSetting('social.youtube'),menuValue=useSetting('site.footerMenu');
  const newsletter=readNewsletter(useSetting('site.newsletter'));
  let menu=[{label:'À propos',url:'/a-propos'},{label:'Programmes',url:'/programmes'},{label:'Actualités',url:'/actualites'},{label:'Devenir bénévole',url:'/devenir-benevole'}];
  try{if(menuValue)menu=normalizeMenu(JSON.parse(menuValue));}catch{}
  return (
    <footer className="mt-24 border-t border-border bg-primary text-primary-foreground">
      <div className="container-x py-16 grid gap-12 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2 font-display text-xl font-bold">
            <img src={logoMark} alt="" className="h-9 w-9 object-contain" />
            {name}
          </div>
          <p className="mt-4 text-sm opacity-80 max-w-xs">
            {tagline}
          </p>
          <div className="mt-6 flex gap-3">
            {[{Icon:Facebook,url:facebook,label:'Facebook'},{Icon:Linkedin,url:linkedin,label:'LinkedIn'},{Icon:Instagram,url:instagram,label:'Instagram'},{Icon:Youtube,url:youtube,label:'YouTube'}].filter(s=>s.url).map(({Icon,url,label}) => (
              <a key={label} href={url} aria-label={label} className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-background/10 hover:bg-background/20 transition">
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-4">{t('footer.links')}</h4>
          <ul className="space-y-1 text-sm opacity-90">
            {menu.map((n,i)=><li key={i}><Link to={n.url} className="inline-block py-1.5">{tLabel(n.label)}</Link></li>)}
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-4">{t('footer.contactUs')}</h4>
          <ul className="space-y-3 text-sm opacity-90">
            <li className="flex gap-2">
              <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
              <span>{address}</span>
            </li>
            <li className="flex gap-2">
              <Phone className="h-4 w-4 mt-0.5 shrink-0" />
              <a href={'tel:'+phone.replace(/\s/g,'')} className="inline-block py-1.5 -my-1.5 hover:underline">{phone}</a>
            </li>
            <li className="flex gap-2">
              <Mail className="h-4 w-4 mt-0.5 shrink-0" />
              <a href={'mailto:'+email} className="inline-block py-1.5 -my-1.5 hover:underline">{email}</a>
            </li>
          </ul>
        </div>

        {newsletter.enabled&&<div>
          <h4 className="font-semibold mb-4">{newsletter.title}</h4>
          <p className="text-sm opacity-85 mb-4">{newsletter.description}</p>
          {newsletter.embed
            ? <iframe src={newsletter.embed} title={newsletter.title} loading="lazy" className="w-full max-w-sm rounded-md border-0" style={{ height: '480px' }} />
            : <Button asChild variant="secondary" className="h-auto min-h-10 max-w-full whitespace-normal text-center">
              <a href={newsletter.url} target="_blank" rel="noopener noreferrer">{newsletter.buttonLabel}<ExternalLink/></a>
            </Button>}
        </div>}
      </div>
      <div className="border-t border-background/10">
        <div className="container-x py-5 text-xs opacity-70 flex flex-wrap justify-between gap-2">
          <span>© {new Date().getFullYear()} {name} — {t('footer.rights')}</span>
          <span className="flex items-center gap-2">
            <span>{t('footer.madeWith')}</span>
            <Link to="/admin" aria-label={t('footer.admin')} title={t('footer.admin')} className="inline-flex h-8 w-8 -mr-2 items-center justify-center rounded-full opacity-50 hover:opacity-100 hover:bg-background/10 transition">
              <Lock className="h-3.5 w-3.5" />
            </Link>
          </span>
        </div>
      </div>
    </footer>
  );
}
