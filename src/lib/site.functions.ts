import { createServerFn } from '@tanstack/react-start';
import { z } from 'zod';
import { publicClient } from './public-client.server';
import { pageSchema } from './cms-schema';
import { dbPostToBlogPost } from './cms';
import { POSTS } from '@/data/blog-posts';
import { readPrograms } from './programs';
import { findVisibleProgram, programSlugSchema } from './program-schema';
import sanitizeHtml from 'sanitize-html';

export const loadSite = createServerFn({method:'GET'}).handler(async () => {
  try {
    const db = publicClient();
    const [pages, settings] = await Promise.all([
      db.from('cms_pages').select('path,title,description,share_image,blocks,published').eq('published',true),
      db.from('site_content').select('key,value'),
    ]);
    if (pages.error || settings.error) throw new Error('Impossible de charger les contenus du site.');
    return {pages:(pages.data ?? []).map(p=>pageSchema.parse(p)), settings:Object.fromEntries((settings.data ?? []).map(s=>[s.key,s.value]))};
  } catch (e) {
    console.error('[loadSite] base injoignable — affichage du contenu d’origine.', e);
    return {pages:[],settings:{}};
  }
});
export const loadPage = createServerFn({method:'GET'}).validator((p:unknown)=>z.string().parse(p)).handler(async ({data}) => {
  try {
    const db = publicClient();
    const {data:row,error} = await db.from('cms_pages').select('path,title,description,title_en,description_en,share_image,blocks,published').eq('path',data).eq('published',true).maybeSingle();
    if(error) throw new Error('Impossible de charger cette page.');
    return row ? pageSchema.parse(row) : null;
  } catch (e) {
    console.error('[loadPage] base injoignable pour '+data+' — métadonnées d’origine.', e);
    return null;
  }
});
export const loadPosts = createServerFn({method:'GET'}).handler(async()=>{
  try {
    const db=publicClient();
    const [posts,setting]=await Promise.all([db.from('blog_posts').select('*').eq('published',true).order('published_at',{ascending:false}),db.from('site_content').select('value').eq('key','cms.posts.imported').maybeSingle()]);
    if(posts.error || setting.error) throw new Error('Impossible de charger les articles.');
    return {posts:(posts.data??[]).map(p=>({...dbPostToBlogPost(p),html:p.content_format==='html'?sanitizeHtml(p.content):null,
      /* Version anglaise optionnelle (phase 2 bilingue) : le contenu EN est
       * sanitizé comme le français ; vide, la vue localisée replie sur le FR. */
      titleEn:p.title_en||undefined,excerptEn:p.excerpt_en||undefined,
      htmlEn:p.content_format==='html'&&p.content_en?sanitizeHtml(p.content_en):null,
      contentEn:p.content_en&&p.content_format!=='html'?p.content_en.split(/\n\s*\n/).map((s)=>s.trim()).filter(Boolean):undefined,
    })),imported:setting.data?.value==='true'};
  } catch (e) {
    console.error('[loadPosts] base injoignable — affichage des articles d’origine.', e);
    return {posts:POSTS.map(p=>({...p,html:null})),imported:true};
  }
});
export const loadGallery = createServerFn({method:'GET'}).handler(async()=>{
  try {
    const db=publicClient();
    const [photos,setting]=await Promise.all([db.from('gallery_photos').select('id,collection,tag,tag_en,image_url,caption,alt').order('created_at',{ascending:false}),db.from('site_content').select('value').eq('key','cms.gallery.imported').maybeSingle()]);
    if(photos.error || setting.error) throw new Error('Impossible de charger la galerie.');
    return {photos:photos.data??[],imported:setting.data?.value==='true'};
  } catch (e) {
    console.error('[loadGallery] base injoignable — affichage de la galerie d’origine.', e);
    return {photos:[],imported:false};
  }
});
export const loadProgram=createServerFn({method:'GET'}).validator((v:unknown)=>z.string().parse(v)).handler(async({data})=>{
 if(!programSlugSchema.safeParse(data).success)return null;
 try{
  const db=publicClient();const result=await db.from('site_content').select('key,value').in('key',['site.programs','site.projects']);
  if(result.error)throw new Error('Impossible de charger ce programme.');
  const rows=result.data??[];
  // Compatibilité : la nouvelle clé site.programs prime sur l'ancienne site.projects.
  const raw=rows.find(r=>r.key==='site.programs')?.value||rows.find(r=>r.key==='site.projects')?.value||'';
  return findVisibleProgram(readPrograms(raw),data);
 } catch (e) {
  console.error('[loadProgram] base injoignable — affichage du programme d’origine.', e);
  return findVisibleProgram(readPrograms(''),data);
 }
});
