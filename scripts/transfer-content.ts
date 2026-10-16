import { createClient } from '@supabase/supabase-js';
import { readFile } from 'node:fs/promises';
import { z } from 'zod';
import { pageSchema, postSchema, gallerySchema, mediaSchema, settingSchema } from '../src/lib/cms-schema';

const url=process.env['TARGET_SUPABASE_URL'],key=process.env['TARGET_SERVICE_ROLE_KEY'],file=process.env['BACKUP_FILE'];
if(!url||!key||!file)throw new Error('BACKUP_FILE, TARGET_SUPABASE_URL and TARGET_SERVICE_ROLE_KEY are required.');
const db=createClient(url,key,{auth:{persistSession:false,autoRefreshToken:false}});
const backup=z.object({pages:z.array(z.unknown()).default([]),posts:z.array(z.unknown()).default([]),gallery:z.array(z.unknown()).default([]),media:z.array(z.unknown()).default([]),settings:z.array(z.unknown()).default([]),messages:z.array(z.unknown()).default([]),applications:z.array(z.unknown()).default([])}).parse(JSON.parse(await readFile(file,'utf8')));
const mapped=new Map<string,string>();
async function image(old:string):Promise<string>{
  if(!/^https:\/\//i.test(old))return old;
  if(old.startsWith(url+'/'))return old;
  const known=mapped.get(old);if(known)return known;
  const response=await fetch(old,{signal:AbortSignal.timeout(30000)});
  if(!response.ok)throw new Error('A source image could not be downloaded. Refresh its link before retrying.');
  const type=(response.headers.get('content-type')||'').split(';')[0];
  const extensions:Record<string,string>={'image/jpeg':'jpg','image/png':'png','image/webp':'webp','image/gif':'gif','image/avif':'avif'};
  const ext=extensions[type];if(!ext)throw new Error('Unsupported source image type.');
  const bytes=await response.arrayBuffer();if(bytes.byteLength>10*1024*1024)throw new Error('Source image exceeds 10 MB.');
  const digest=await crypto.subtle.digest('SHA-256',bytes);
  const path='import/'+Array.from(new Uint8Array(digest)).map(n=>n.toString(16).padStart(2,'0')).join('')+'.'+ext;
  const upload=await db.storage.from('media').upload(path,bytes,{contentType:type,upsert:false});
  if(upload.error && !/already exists|duplicate/i.test(upload.error.message))throw new Error('Image transfer failed.');
  const {data,error}=await db.storage.from('media').createSignedUrl(path,60*60*24*365*10);
  if(error||!data)throw new Error('Target image address could not be created.');
  mapped.set(old,data.signedUrl);return data.signedUrl;
}
async function put(table:string,rows:unknown[],conflict:string){
  if(!rows.length)return;
  const {error}=await db.from(table).upsert(rows,{onConflict:conflict});
  if(error)throw new Error('Content import failed for '+table+'.');
}
const pages=[];for(const raw of backup.pages){const p=pageSchema.parse(raw);p.share_image=await image(p.share_image);for(const b of p.blocks)b.image=await image(b.image);pages.push(p);}
const posts=[];for(const raw of backup.posts){const p=postSchema.parse(raw);if(p.image_url)p.image_url=await image(p.image_url);posts.push(p);}
const photos=[];for(const raw of backup.gallery){const p=gallerySchema.extend({id:z.string().uuid()}).parse(raw);p.image_url=await image(p.image_url);photos.push(p);}
const media=[];for(const raw of backup.media){const p=mediaSchema.extend({id:z.string().uuid()}).parse(raw);p.url=await image(p.url);media.push(p);}
const settings=[];for(const raw of backup.settings){const p=settingSchema.parse(raw);if(p.key==='site.logo')p.value=await image(p.value);settings.push(p);}
await put('cms_pages',pages,'path');await put('blog_posts',posts,'slug');await put('gallery_photos',photos,'id');await put('cms_media',media,'id');await put('site_content',settings,'key');
const message=z.object({id:z.string().uuid(),name:z.string().nullable(),email:z.string().email(),subject:z.string(),message:z.string(),ip:z.string().nullable(),handled:z.boolean(),created_at:z.string().datetime()});
const application=z.object({id:z.string().uuid(),kind:z.enum(['benevole','partenaire']),name:z.string(),email:z.string().email(),phone:z.string().nullable(),city:z.string().nullable(),organization:z.string().nullable(),message:z.string().nullable(),handled:z.boolean(),created_at:z.string().datetime()});
await put('contact_submissions',backup.messages.map(r=>message.parse(r)),'id');await put('applications',backup.applications.map(r=>application.parse(r)),'id');
console.log('Content transferred. '+mapped.size+' remote images copied. Verify the target site before changing its domain.');