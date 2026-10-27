import { DEFAULT_PROGRAMS } from '@/data/programs';
import { programsSchema, type Program } from './program-schema';
export function readPrograms(raw: string): Program[] {
  if(!raw)return DEFAULT_PROGRAMS;
  try { return programsSchema.parse(JSON.parse(raw)); } catch { return DEFAULT_PROGRAMS; }
}
/** Regroupe les pages de détail (nouvelles /programmes/* comme anciennes /projets/*) sous une seule entrée « Programmes ». */
export function groupProgramMenu(items: {label:string,url:string}[]) {
  const result: {label:string,url:string}[]=[];
  for(const item of items){
    const url=item.url==='/projets'||item.url.startsWith('/projets/')?item.url.replace('/projets','/programmes'):item.url;
    if(url.startsWith('/programmes/')){
      const hasListing=items.some(i=>i.url==='/programmes'||i.url==='/projets');
      if(!hasListing&&!result.some(i=>i.url==='/programmes'))result.push({label:'Programmes',url:'/programmes'});
    }
    else result.push({label:item.label,url});
  }
  return result;
}
/** Adapte les menus enregistrés : /projets* réécrits en /programmes* et regroupés, /blog, /galerie, /presse, /evenements fusionnés dans /actualites. */
export function normalizeMenu(items: {label:string,url:string}[]) {
  const grouped=groupProgramMenu(items);
  const result: {label:string,url:string}[]=[];
  for(const item of grouped){
    if(['/blog','/galerie','/presse','/evenements'].includes(item.url)){
      if(!result.some(i=>i.url==='/actualites'))result.push({label:'Actualités',url:'/actualites'});
    }
    else result.push(item);
  }
  return result;
}
