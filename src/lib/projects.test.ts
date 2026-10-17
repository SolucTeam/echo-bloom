import { describe,expect,it } from 'vitest';
import { projectsSchema,visibleProjects } from './project-schema';
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
});
