import { createContext, useContext } from 'react';
import { useLocation, Link } from '@tanstack/react-router';
import type { CmsPageData, CmsBlock } from '@/lib/cms-schema';
import { useLang } from '@/components/Language';

export const SiteContext = createContext<{pages:CmsPageData[],settings:Record<string,string>}>({pages:[],settings:{}});
export function useSetting(key:string,fallback=''){const {settings}=useContext(SiteContext);return settings[key] || fallback;}
export function CmsBlocks({blocks}:{blocks:CmsBlock[]}) {
  const { t } = useLang();
  return <>{blocks.filter(b=>b.visible).map((b,i)=><section key={b.id} className={b.type==='callout'?'bg-accent border-y border-border':'border-b border-border/50'}>
    <div className="container-x py-12 space-y-6">
      {b.title && (i===0?<h1 className="text-4xl lg:text-5xl font-bold max-w-4xl break-words">{b.title}</h1>:<h2 className="text-3xl font-bold break-words">{b.title}</h2>)}
      {b.image && <img src={b.image} alt={b.alt} className="w-full max-h-[560px] object-cover rounded-lg" />}
      {b.body && <div className="max-w-4xl space-y-4 text-lg leading-relaxed">{b.body.split(/\n\s*\n/).map((p,j)=><p key={j} className="whitespace-pre-line">{p}</p>)}</div>}
      {b.link && <Link to={b.link} className="btn-primary">{b.linkLabel || t('common.learnMore')}</Link>}
    </div>
  </section>)}</>;
}
export function ManagedContent({children}:{children:React.ReactNode}) {
  const path=useLocation({select:l=>l.pathname});
  const {pages}=useContext(SiteContext);
  const page=pages.find(p=>p.path===path);
  if(path==='/'||path==='/a-propos')return <>{children}</>;
  if(path.startsWith('/programmes/'))return <>{children}</>;
  if(!page) return <>{children}</>;
  const formPage=['/nous-joindre','/devenir-benevole','/devenir-partenaire','/faire-un-don'].includes(path);
  const collectionPage=['/actualites','/programmes'].includes(path);
  if((!formPage&&!collectionPage)||!page.blocks.some(b=>b.visible)) return <>{children}</>;
  return <><CmsBlocks blocks={page.blocks}/><div className={formPage?'cms-preserve-forms':'cms-preserve-collection'}>{children}</div></>;
}
/**
 * Méta d'une page (phase 3 bilingue) : en plus des méta françaises servies au
 * serveur, les titres/descriptions anglais renseignés (page CMS ou argument `en`)
 * sont émis dans des balises porteuses `x-*-en` ; Language.tsx les applique côté
 * client quand le visiteur est en anglais, et restaure le français sinon.
 */
export function pageHead(page:CmsPageData|null, fallbackTitle:string, fallbackDescription:string, path:string, en?:{title?:string;description?:string}){
  const title=page?.title||fallbackTitle,description=page?.description||fallbackDescription;
  const enTitle=page?.title_en?.trim()||en?.title?.trim()||'';
  const enDescription=page?.description_en?.trim()||en?.description?.trim()||'';
  const base=import.meta.env.VITE_SITE_URL || 'https://green-ivory-tan.vercel.app';
  const image=page?.share_image;
  return {meta:[{title},{name:'description',content:description},{property:'og:title',content:title},{property:'og:description',content:description},{property:'og:type',content:'website'},{property:'og:url',content:base+path},{name:'twitter:card',content:'summary_large_image'},...(image?.startsWith('https://')?[{property:'og:image',content:image},{name:'twitter:image',content:image}]:[]),...(enTitle?[{name:'x-title-en',content:enTitle}]:[]),...(enDescription?[{name:'x-description-en',content:enDescription}]:[])],links:[{rel:'canonical',href:base+path}]};
}