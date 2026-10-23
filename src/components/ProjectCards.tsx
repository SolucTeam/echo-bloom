import { Link } from '@tanstack/react-router';
import { ArrowUpRight } from 'lucide-react';
import type { Project } from '@/lib/project-schema';
import { ClientShader } from '@/components/shaders/ClientShader';
export function ProjectCards({projects}:{projects:Project[]}){
 return <div className="grid md:grid-cols-2 gap-8">{projects.map(p=><article key={p.slug} className="group border border-border rounded-lg overflow-hidden bg-card">
  {p.hero&&<Link to="/projets/$slug" params={{slug:p.slug}} className="relative block aspect-[16/10] overflow-hidden" aria-label={p.title} onClick={(e)=>{if(e.defaultPrevented||e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;document.querySelectorAll<HTMLElement>('[data-vt-hero]').forEach(el=>{el.style.viewTransitionName='';});const img=e.currentTarget.querySelector('img');if(img)img.style.viewTransitionName='project-hero';}}><img data-vt-hero src={p.hero} alt={p.title} className="h-full w-full object-cover motion-safe:transition-transform motion-safe:duration-500 motion-safe:group-hover:scale-105"/><ClientShader preset="cardDuotone" image={p.hero} className="pointer-events-none absolute inset-0 motion-safe:transition-[opacity,transform] motion-safe:duration-500 motion-safe:group-hover:scale-105 group-hover:opacity-0"/></Link>}
  <div className="p-6 lg:p-8"><span className="eyebrow">{p.eyebrow}</span><h2 className="mt-3 text-2xl font-bold break-words"><Link to="/projets/$slug" params={{slug:p.slug}}>{p.title}</Link></h2><p className="mt-3 text-muted-foreground break-words">{p.tagline}</p><Link to="/projets/$slug" params={{slug:p.slug}} className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary">Découvrir ce projet<ArrowUpRight className="h-4 w-4"/></Link></div>
 </article>)}</div>;
}
