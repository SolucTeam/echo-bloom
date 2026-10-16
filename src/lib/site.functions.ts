import { createServerFn } from '@tanstack/react-start';
import { z } from 'zod';
import { publicClient } from './public-client.server';
import { pageSchema } from './cms-schema';
import { dbPostToBlogPost } from './cms';
import sanitizeHtml from 'sanitize-html';

export const loadSite = createServerFn({method:'GET'}).handler(async () => {
  const db = publicClient();
  const [pages, settings] = await Promise.all([
    db.from('cms_pages').select('path,title,description,share_image,blocks,published').eq('published',true),
    db.from('site_content').select('key,value'),
  ]);
  if (pages.error || settings.error) throw new Error('Impossible de charger les contenus du site.');
  return {pages:(pages.data ?? []).map(p=>pageSchema.parse(p)), settings:Object.fromEntries((settings.data ?? []).map(s=>[s.key,s.value]))};
});
export const loadPage = createServerFn({method:'GET'}).inputValidator((p:unknown)=>z.string().parse(p)).handler(async ({data}) => {
  const db = publicClient();
  const {data:row,error} = await db.from('cms_pages').select('path,title,description,share_image,blocks,published').eq('path',data).eq('published',true).maybeSingle();
  if(error) throw new Error('Impossible de charger cette page.');
  return row ? pageSchema.parse(row) : null;
});
export const loadPosts = createServerFn({method:'GET'}).handler(async()=>{
  const db=publicClient();
  const [posts,setting]=await Promise.all([db.from('blog_posts').select('*').eq('published',true).order('published_at',{ascending:false}),db.from('site_content').select('value').eq('key','cms.posts.imported').maybeSingle()]);
  if(posts.error || setting.error) throw new Error('Impossible de charger les articles.');
  return {posts:(posts.data??[]).map(p=>({...dbPostToBlogPost(p),html:p.content_format==='html'?sanitizeHtml(p.content):null})),imported:setting.data?.value==='true'};
});
export const loadGallery = createServerFn({method:'GET'}).handler(async()=>{
  const db=publicClient();
  const [photos,setting]=await Promise.all([db.from('gallery_photos').select('id,collection,tag,image_url,caption,alt').order('created_at',{ascending:false}),db.from('site_content').select('value').eq('key','cms.gallery.imported').maybeSingle()]);
  if(photos.error || setting.error) throw new Error('Impossible de charger la galerie.');
  return {photos:photos.data??[],imported:setting.data?.value==='true'};
});