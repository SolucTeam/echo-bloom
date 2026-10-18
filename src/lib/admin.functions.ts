import { createServerFn } from '@tanstack/react-start';
import { z } from 'zod';
import { requireSupabaseAuth } from '@/integrations/supabase/auth-middleware';
import { adminEntitySchema, pageSchema, postSchema, gallerySchema, mediaSchema, settingSchema, partnersSchema, safeLink } from './cms-schema';
import sanitizeHtml from 'sanitize-html';
import { contactSettingsSchema, volunteerSettingsSchema, contactDetailsSchema } from './form-settings';
import { projectsSchema } from './project-schema';
import { newsletterSchema } from './newsletter';
import { mailSettingsSchema, readMailSettings, mailServerOnline } from './mail-settings';
import { HOME_TEXT_FALLBACKS } from '../data/home';
import { ABOUT_TEXT_FALLBACKS } from '../data/about';

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
  const [mail, jobs] = await Promise.all([
    db.from('mail_settings').select('config,last_heartbeat').eq('id','notifications').maybeSingle(),
    db.from('mail_jobs').select('id,source_kind,status,created_at,attempts').order('created_at',{ascending:false}).limit(20),
  ]);
  if(mail.error || jobs.error) throw new Error('Impossible de charger la messagerie.');
  return {pages:pages.data??[],posts:posts.data??[],gallery:gallery.data??[],media:media.data??[],settings:settings.data??[],messages:messages.data??[],applications:applications.data??[],mail:readMailSettings(mail.data?.config),mailOnline:mailServerOnline(mail.data?.last_heartbeat),mailJobs:jobs.data??[]};
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
      if(p.key==='site.donations')z.array(z.object({label:z.string().min(1).max(200),url:safeLink})).max(10).parse(JSON.parse(p.value));
      if(p.key==='site.stats')z.array(z.object({value:z.string().max(20),label:z.string().min(1).max(100)})).min(1).max(6).parse(JSON.parse(p.value));
      if(p.key==='home.bigstats')z.array(z.object({value:z.string().min(1).max(20),label:z.string().min(1).max(100)})).min(1).max(8).parse(JSON.parse(p.value));
      if(p.key==='home.texts'){const parsed=z.record(z.string(),z.string().max(3000)).parse(JSON.parse(p.value));for(const k of Object.keys(parsed))if(!(k in HOME_TEXT_FALLBACKS))throw new Error('Clé de texte inconnue.');}
      if(p.key==='about.texts'){const parsed=z.record(z.string(),z.string().max(3000)).parse(JSON.parse(p.value));for(const k of Object.keys(parsed))if(!(k in ABOUT_TEXT_FALLBACKS))throw new Error('Clé de texte inconnue.');}
      if(p.key.startsWith('about.')&&p.key.endsWith('.image'))safeLink.parse(p.value);
      if(p.key.startsWith('home.')&&p.key.endsWith('.image'))safeLink.parse(p.value);
      if(p.key==='site.projects')projectsSchema.parse(JSON.parse(p.value));
      if(p.key==='site.partners')partnersSchema.parse(JSON.parse(p.value));
      if(p.key==='site.contact')contactSettingsSchema.parse(JSON.parse(p.value));
      if(p.key==='site.volunteer')volunteerSettingsSchema.parse(JSON.parse(p.value));
      if(p.key in contactDetailsSchema.shape)contactDetailsSchema.shape[p.key as keyof typeof contactDetailsSchema.shape].parse(p.value);
      if(p.key==='site.newsletter')newsletterSchema.parse(JSON.parse(p.value));
      const result=await db.from('site_content').upsert({...p,updated_at:new Date().toISOString()});error=result.error;
    }else{
      if(!data.id) throw new Error('Identifiant manquant.');
      const p=z.object({handled:z.boolean()}).parse(data.payload);
      const result=await db.from(data.entity==='messages'?'contact_submissions':'applications').update(p).eq('id',data.id);error=result.error;
    }
    if(error) throw new Error('Enregistrement impossible. Vérifiez les champs et les adresses uniques.');
    return {ok:true};
  });

export const saveMailSettings = createServerFn({method:'POST'}).middleware([adminMiddleware])
  .inputValidator((value:unknown)=>mailSettingsSchema.parse(value))
  .handler(async({data,context})=>{
    const role=await context.supabase.rpc('has_role',{_user_id:context.userId,_role:'admin'});
    if(role.error || !role.data)throw new Error('Accès refusé.');
    const result=await context.supabase.from('mail_settings').upsert({id:'notifications',config:data,updated_at:new Date().toISOString()});
    if(result.error)throw new Error('Enregistrement des e-mails impossible.');
    return {ok:true};
  });
export const testMail = createServerFn({method:'POST'}).middleware([adminMiddleware]).handler(async({context})=>{
  const db=context.supabase;
  const role=await db.rpc('has_role',{_user_id:context.userId,_role:'admin'});
  if(role.error || !role.data)throw new Error('Accès refusé.');
  const settings=await db.from('mail_settings').select('config,last_heartbeat').eq('id','notifications').single();
  if(settings.error || !mailServerOnline(settings.data?.last_heartbeat))throw new Error('La messagerie du serveur n’est pas connectée.');
  const config=mailSettingsSchema.parse(settings.data.config);
  if(!config.senderEmail || !config.contact.recipient)throw new Error('Enregistrez l’expéditeur et le destinataire Contact.');
  const recent=await db.from('mail_jobs').select('id').eq('source_kind','test').gte('created_at',new Date(Date.now()-60_000).toISOString()).limit(1);
  if(recent.error || recent.data?.length)throw new Error('Patientez une minute avant un autre test.');
  const result=await db.from('mail_jobs').insert({source_kind:'test',config});
  if(result.error)throw new Error('Test impossible.');
  return {ok:true};
});