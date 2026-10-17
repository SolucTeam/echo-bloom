import { describe,expect,it } from 'vitest';
import { projectsSchema,visibleProjects,findVisibleProject,isPublicProjectPath } from './project-schema';
import { DEFAULT_PROJECTS } from '@/data/projects';
import { groupProjectMenu,readProjects } from './projects';
describe('Project catalogue',()=>{
 it('keeps both existing projects in the default collection',()=>expect(DEFAULT_PROJECTS.map(p=>p.slug)).toEqual(['journees-sans-plastique','sentiers-verts']));
 it('groups individual projects under one Projects menu link',()=>expect(groupProjectMenu([{label:'Journées',url:'/projets/journees-sans-plastique'},{label:'Sentiers',url:'/projets/sentiers-verts'}])).toEqual([{label:'Projets',url:'/projets'}]));
 it('does not duplicate an existing project menu entry',()=>expect(groupProjectMenu([{label:'Projets',url:'/projets'},{label:'Sentiers',url:'/projets/sentiers-verts'}])).toEqual([{label:'Projets',url:'/projets'}]));
 it('hides disabled projects',()=>expect(visibleProjects([{...DEFAULT_PROJECTS[0],visible:false},DEFAULT_PROJECTS[1]]).map(p=>p.slug)).toEqual(['sentiers-verts']));
 it('keeps an intentionally empty catalogue empty',()=>expect(readProjects('[]')).toEqual([]));
 it('rejects duplicate addresses',()=>expect(projectsSchema.safeParse([DEFAULT_PROJECTS[0],DEFAULT_PROJECTS[0]]).success).toBe(false));
 it('rejects unsafe image links',()=>expect(projectsSchema.safeParse([{...DEFAULT_PROJECTS[0],hero:'javascript:alert(1)'}]).success).toBe(false));
 it('returns unavailable for an invalid project address',()=>expect(findVisibleProject(DEFAULT_PROJECTS,'Adresse-Invalide')).toBeNull());
 it('does not resolve a hidden original project',()=>expect(findVisibleProject([{...DEFAULT_PROJECTS[0],visible:false}],'journees-sans-plastique')).toBeNull());
 it('does not resolve a deleted original project',()=>expect(findVisibleProject([],'sentiers-verts')).toBeNull());
 it('excludes hidden project CMS pages from the sitemap',()=>expect(isPublicProjectPath('/projets/journees-sans-plastique',[{...DEFAULT_PROJECTS[0],visible:false}])).toBe(false));
 it('keeps visible project CMS pages in the sitemap',()=>expect(isPublicProjectPath('/projets/sentiers-verts',DEFAULT_PROJECTS)).toBe(true));
 it('preserves saved project ordering',()=>expect(readProjects(JSON.stringify([...DEFAULT_PROJECTS].reverse())).map(p=>p.slug)).toEqual(['sentiers-verts','journees-sans-plastique']));
});
