import { DEFAULT_PROJECTS } from '@/data/projects';
import { projectsSchema, type Project } from './project-schema';
export function readProjects(raw: string): Project[] {
  if(!raw)return DEFAULT_PROJECTS;
  try { return projectsSchema.parse(JSON.parse(raw)); } catch { return DEFAULT_PROJECTS; }
}
export function groupProjectMenu(items: {label:string,url:string}[]) {
  const result: {label:string,url:string}[]=[];
  for(const item of items){
    if(item.url.startsWith('/projets/')){if(!items.some(i=>i.url==='/projets')&&!result.some(i=>i.url==='/projets'))result.push({label:'Projets',url:'/projets'});}
    else result.push(item);
  }
  return result;
}
