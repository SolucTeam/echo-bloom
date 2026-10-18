import { Link } from "@tanstack/react-router";
import { Facebook, Linkedin, Instagram, Youtube, Mail, Phone, MapPin, Leaf, Lock } from "lucide-react";
import { groupProjectMenu } from '@/lib/projects';
import { useSetting } from './ManagedSite';
import { Button } from '@/components/ui/button';
import { readNewsletter } from '@/lib/newsletter';
import { ExternalLink } from 'lucide-react';

export function SiteFooter() {
  const name=useSetting('site.name','Green Ivory'),tagline=useSetting('site.tagline','Le pouvoir citoyen pour l’environnement. ONG ivoirienne engagée contre la pollution plastique, pour la biodiversité et le climat depuis 2017.'),address=useSetting('site.address','Côte d’Ivoire — Abidjan, Bingerville'),phone=useSetting('site.phone','+225 01 03 05 83 63'),email=useSetting('site.email','info@greenivory.com');
  const facebook=useSetting('social.facebook'),linkedin=useSetting('social.linkedin'),instagram=useSetting('social.instagram'),youtube=useSetting('social.youtube'),menuValue=useSetting('site.footerMenu');
  const newsletter=readNewsletter(useSetting('site.newsletter'));
  let menu=[{label:'À propos',url:'/a-propos'},{label:'Projets',url:'/projets'},{label:'Galerie',url:'/galerie'},{label:'Blog',url:'/blog'},{label:'Devenir bénévole',url:'/devenir-benevole'}];
  try{if(menuValue)menu=groupProjectMenu(JSON.parse(menuValue));}catch{}
  return (
    <footer className="mt-24 border-t border-border bg-primary text-primary-foreground">
      <div className="container-x py-16 grid gap-12 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2 font-display text-xl font-bold">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-background/15">
              <Leaf className="h-5 w-5" />
            </span>
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
          <h4 className="font-semibold mb-4">Liens utiles</h4>
          <ul className="space-y-2 text-sm opacity-90">
            {menu.map((n,i)=><li key={i}><Link to={n.url}>{n.label}</Link></li>)}
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-4">Nous contacter</h4>
          <ul className="space-y-3 text-sm opacity-90">
            <li className="flex gap-2">
              <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
              <span>{address}</span>
            </li>
            <li className="flex gap-2">
              <Phone className="h-4 w-4 mt-0.5 shrink-0" />
              <a href={'tel:'+phone.replace(/\s/g,'')} className="hover:underline">{phone}</a>
            </li>
            <li className="flex gap-2">
              <Mail className="h-4 w-4 mt-0.5 shrink-0" />
              <a href={'mailto:'+email} className="hover:underline">{email}</a>
            </li>
          </ul>
        </div>

        {newsletter.enabled&&<div>
          <h4 className="font-semibold mb-4">{newsletter.title}</h4>
          <p className="text-sm opacity-85 mb-4">{newsletter.description}</p>
          <Button asChild variant="secondary" className="h-auto min-h-10 max-w-full whitespace-normal text-center">
            <a href={newsletter.url} target="_blank" rel="noopener noreferrer">{newsletter.buttonLabel}<ExternalLink/></a>
          </Button>
        </div>}
      </div>
      <div className="border-t border-background/10">
        <div className="container-x py-5 text-xs opacity-70 flex flex-wrap justify-between gap-2">
          <span>© {new Date().getFullYear()} {name} — Tous droits réservés.</span>
          <span className="flex items-center gap-3">
            <span>Conçu avec ❤️ pour la planète.</span>
            <Link to="/admin" aria-label="Console d'administration" title="Console d'administration" className="opacity-50 hover:opacity-100 transition">
              <Lock className="h-3.5 w-3.5" />
            </Link>
          </span>
        </div>
      </div>
    </footer>
  );
}
