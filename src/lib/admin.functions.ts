import { createServerFn } from '@tanstack/react-start';
import { z } from 'zod';
import { requireSupabaseAuth } from '@/integrations/supabase/auth-middleware';
import { adminEntitySchema, pageSchema, postSchema, gallerySchema, mediaSchema, settingSchema, safeLink } from './cms-schema';
import sanitizeHtml from 'sanitize-html';

const adminMiddleware = requireSupabaseAuth;
export const adminSnapshot = createServerFn({method:'GET'}).middleware([adminMiddleware]).handler(async({context})=>{
  const {data:allowed,error:roleError}=await context.supabase.rpc('has_role',{_user_id:context.userId,_role:'admin'});
  if(roleError || !allowed) throw new Error('Accès refusé.');
  const db=context.supabase;
  const [pages,posts,gallery,media,settings,messages,applications]=await Promise.all([
    db.from('cms_pages').select('*').order('path'),db.from('blog_posts').select('*').order('published_at',{ascending:false}),
    db.from('gallery_photos').select('*'),db.from('cms_media').select('*').order('created_at',{ascending:false}),
    db.from('site_content').select('*'),db.from('contact_submissions').select('*').order('created_at',{ascending:false}),db.from('applications').select('*').order('created_at',{ascending:false}),
  ]);
  if([pages,posts,gallery,media,settings,messages,applications].some(r=>r.error)) throw new Error('Impossible de charger la console.');
  return {pages:pages.data??[],posts:posts.data??[],gallery:gallery.data??[],media:media.data??[],settings:settings.data??[],messages:messages.data??[],applications:applications.data??[]};
});

export const adminWrite = createServerFn({method:'POST'}).middleware([adminMiddleware])
  .inputValidator((v:unknown)=>z.object({entity:adminEntitySchema,id:z.string().optional(),remove:z.boolean().default(false),payload:z.unknown().optional()}).parse(v))
  .handler(async({data,context})=>{
    const {data:allowed,error:roleError}=await context.supabase.rpc('has_role',{_user_id:context.userId,_role:'admin'});
    if(roleError || !allowed) throw new Error('Accès refusé.');
    const db=context.supabase;
    const tables={pages:'cms_pages',posts:'blog_posts',gallery:'gallery_photos',media:'cms_media',settings:'site_content',messages:'contact_submissions',applications:'applications'} as const;
    if(data.remove){
      if(!data.id || data.entity==='settings') throw new Error('Suppression invalide.');
      const result=await db.from(tables[data.entity]).delete().eq('id',data.id);
      if(result.error) throw new Error('Suppression impossible.');
      return {ok:true};
    }
    let error;
    if(data.entity==='pages'){
      const p=pageSchema.parse(data.payload);
      const result=await db.from('cms_pages').upsert({...p,updated_at:new Date().toISOString()},{onConflict:'path'}); error=result.error;
    }else if(data.entity==='posts'){
      const p=postSchema.parse(data.payload);
      if(p.content_format==='html') p.content=sanitizeHtml(p.content);
      const result=data.id ? await db.from('blog_posts').update({...p,updated_at:new Date().toISOString()}).eq('id',data.id):await db.from('blog_posts').upsert(p,{onConflict:'slug'}); error=result.error;
    }else if(data.entity==='gallery'){
      const p=gallerySchema.parse(data.payload);
      const result=data.id?await db.from('gallery_photos').update(p).eq('id',data.id):await db.from('gallery_photos').insert(p);error=result.error;
    }else if(data.entity==='media'){
      const p=mediaSchema.parse(data.payload);
      const result=data.id?await db.from('cms_media').update(p).eq('id',data.id):await db.from('cms_media').insert(p);error=result.error;
    }else if(data.entity==='settings'){
      const p=settingSchema.parse(data.payload);
      if(p.key.startsWith('social.')||['site.logo','site.donation'].includes(p.key))safeLink.parse(p.value);
      if(['site.menu','site.footerMenu'].includes(p.key))z.array(z.object({label:z.string().max(200),url:safeLink})).max(50).parse(JSON.parse(p.value));
      const result=await db.from('site_content').upsert({...p,updated_at:new Date().toISOString()});error=result.error;
    }else{
      if(!data.id) throw new Error('Identifiant manquant.');
      const p=z.object({handled:z.boolean()}).parse(data.payload);
      const result=await db.from(data.entity==='messages'?'contact_submissions':'applications').update(p).eq('id',data.id);error=result.error;
    }
    if(error) throw new Error('Enregistrement impossible. Vérifiez les champs et les adresses uniques.');
    return {ok:true};
  });