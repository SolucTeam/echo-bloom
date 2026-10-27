import { useState } from 'react';
import { useServerFn } from '@tanstack/react-start';
import { Plus, Save, Pencil, Trash2, ArrowUp, ArrowDown, X, Eye } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { UploadField } from '@/components/UploadField';
import { TranslateBar } from '@/components/TranslateBar';
import { adminTranslate } from '@/lib/admin.functions';
import type { Program } from '@/lib/program-schema';
const field='w-full rounded-md border border-input bg-background px-3 py-2 text-sm';
export function ProgramsEditor({items,onChange,onSave,onUpload,busy}:{items:Program[];onChange:(items:Program[])=>void;onSave:()=>void;onUpload:(file:File)=>Promise<string>;busy:boolean}){
 const [selected,setSelected]=useState<number|null>(null);
 const program=selected===null?undefined:items[selected];
 function patch(value:Partial<Program>){if(selected===null)return;onChange(items.map((p,i)=>i===selected?{...p,...value}:p));}
 function move(index:number,dir:number){const next=[...items],to=index+dir;if(to<0||to>=next.length)return;[next[index],next[to]]=[next[to],next[index]];onChange(next);}
 const translate=useServerFn(adminTranslate);
 const [translating,setTranslating]=useState(false);
 const [translateError,setTranslateError]=useState<string|null>(null);
 const enFields=[['title','titleEn'],['eyebrow','eyebrowEn'],['tagline','taglineEn'],['org','orgEn'],['launched','launchedEn'],['pilot','pilotEn'],['firstEdition','firstEditionEn'],['goal','goalEn'],['goalDetail','goalDetailEn'],['context','contextEn']] as const;
 const listEnEmpty=(l?:string[])=>!(l??[]).some(v=>v.trim());
 const outcomesEnEmpty=(l?:{label:string;value:string}[])=>!(l??[]).some(o=>o.label.trim()||o.value.trim());
 const missing=program?enFields.filter(([fr,en])=>program[fr].trim()&&!(program[en]??'').trim()).length+(program.objectives.some(o=>o.trim())&&listEnEmpty(program.objectivesEn)?1:0)+(program.outcomes.some(o=>o.label.trim()||o.value.trim())&&outcomesEnEmpty(program.outcomesEn)?1:0):0;
 async function run(){
  if(!program)return;
  const p=program,items:{id:string;text:string}[]=[];
  const objTodo=p.objectives.some(o=>o.trim())&&listEnEmpty(p.objectivesEn);
  const outTodo=p.outcomes.some(o=>o.label.trim()||o.value.trim())&&outcomesEnEmpty(p.outcomesEn);
  for(const [fr,en] of enFields){const source=p[fr].trim();if(source&&!(p[en]??'').trim())items.push({id:en,text:source});}
  if(objTodo)p.objectives.forEach((o,i)=>{if(o.trim())items.push({id:'obj'+i,text:o.trim()});});
  if(outTodo)p.outcomes.forEach((o,i)=>{if(o.label.trim())items.push({id:'out'+i,text:o.label.trim()});});
  if(!items.length)return;
  setTranslating(true);setTranslateError(null);
  try{
   const map=new Map<string,string>();
   for(let i=0;i<items.length;i+=40){const res=await translate({data:{items:items.slice(i,i+40)}});for(const t of res.translations)map.set(t.id,t.text);}
   const next:Partial<Program>={};
   for(const [,en] of enFields){const t=map.get(en);if(t&&!(p[en]??'').trim())next[en]=t;}
   if(objTodo){const list=p.objectives.map((o,i)=>map.get('obj'+i)??'');if(list.some(v=>v.trim()))next.objectivesEn=list;}
   if(outTodo){const list=p.outcomes.map((o,i)=>({label:map.get('out'+i)??'',value:o.value}));if(list.some(o=>o.label.trim()||o.value.trim()))next.outcomesEn=list;}
   if(Object.keys(next).length)patch(next);
  }catch(e){setTranslateError(e instanceof Error?e.message:'Traduction impossible.');}
  finally{setTranslating(false);}
 }
 const action=(label:string,fn:()=>void,icon:React.ReactNode)=><Button variant="ghost" size="icon" title={label} aria-label={label} onClick={fn}>{icon}</Button>;
 return <section><fieldset disabled={busy||translating} className="min-w-0 space-y-6">
  <div className="flex flex-wrap justify-between gap-3"><h2 className="text-2xl font-bold">Programmes</h2>{program?action('Fermer le programme',()=>setSelected(null),<X/>):<Button onClick={()=>{onChange([...items,{slug:'nouveau-programme-'+Date.now(),visible:false,title:'Nouveau programme',eyebrow:'',tagline:'',org:'Green Ivory',launched:'',pilot:'',firstEdition:'',goal:'',goalDetail:'',hero:'',context:'',objectives:[],outcomes:[]}]);setSelected(items.length);}}><Plus/>Ajouter un programme</Button>}</div>
  {program?<>
   <div className="grid sm:grid-cols-2 gap-4">{([['title','Nom du programme'],['slug','Adresse du programme'],['eyebrow','Catégorie'],['org','Organisation'],['launched','Lancement'],['pilot','Phase pilote'],['firstEdition','Première édition'],['goal','Objectif principal']] as const).map(([key,label])=><label key={key} className="block space-y-1 text-sm font-medium"><span>{label}</span><input className={field} maxLength={300} value={program[key]} onChange={e=>patch({[key]:e.target.value})}/></label>)}</div>
   <label className="flex gap-2 text-sm"><input type="checkbox" checked={program.visible} onChange={e=>patch({visible:e.target.checked})}/>Afficher ce programme sur le site</label>
   {([['tagline','Résumé'],['goalDetail','Présentation de l’objectif'],['context','Contexte']] as const).map(([key,label])=><label key={key} className="block space-y-1 text-sm font-medium"><span>{label}</span><textarea className={field} rows={4} maxLength={key==='context'?20000:key==='goalDetail'?5000:2000} value={program[key]} onChange={e=>patch({[key]:e.target.value})}/></label>)}
   <label className="block space-y-1 text-sm font-medium"><span>Photo du programme</span><input className={field} value={program.hero} maxLength={2000} onChange={e=>patch({hero:e.target.value})}/></label>
   <UploadField label="Importer une photo" disabled={busy} onFiles={async files=>{const file=files[0];try{patch({hero:await onUpload(file)});}catch{/* Parent displays upload errors. */}}}/>
   {program.hero&&<img src={program.hero} alt={program.title} className="max-w-md w-full aspect-[16/10] object-cover rounded-lg"/>}
   <div className="space-y-3 border-t border-border pt-6"><h3 className="text-lg font-bold">Objectifs spécifiques</h3>{program.objectives.map((o,i)=><div key={i} className="flex gap-2"><input className={field} aria-label={'Objectif '+(i+1)} value={o} maxLength={1000} onChange={e=>patch({objectives:program.objectives.map((v,j)=>j===i?e.target.value:v)})}/>{action('Retirer l’objectif '+(i+1),()=>patch({objectives:program.objectives.filter((_,j)=>j!==i)}),<Trash2/>)}</div>)}<Button variant="outline" onClick={()=>patch({objectives:[...program.objectives,'']})}><Plus/>Ajouter un objectif</Button></div>
   <div className="space-y-3 border-t border-border pt-6"><h3 className="text-lg font-bold">Résultats attendus</h3>{program.outcomes.map((o,i)=><div key={i} className="flex gap-2"><input className={field} aria-label={'Valeur du résultat '+(i+1)} value={o.value} onChange={e=>patch({outcomes:program.outcomes.map((v,j)=>j===i?{...v,value:e.target.value}:v)})}/><input className={field} aria-label={'Libellé du résultat '+(i+1)} value={o.label} onChange={e=>patch({outcomes:program.outcomes.map((v,j)=>j===i?{...v,label:e.target.value}:v)})}/>{action('Retirer le résultat '+(i+1),()=>patch({outcomes:program.outcomes.filter((_,j)=>j!==i)}),<Trash2/>)}</div>)}<Button variant="outline" onClick={()=>patch({outcomes:[...program.outcomes,{label:'',value:''}]})}><Plus/>Ajouter un résultat</Button></div>
   {/* Version anglaise optionnelle : un champ laissé vide affiche son homologue français. */}
   <details className="rounded-lg border border-border bg-muted/30 p-4">
    <summary className="cursor-pointer select-none text-sm font-bold">Version anglaise (optionnel)</summary>
    <p className="mt-2 text-sm text-muted-foreground">Textes affichés aux visiteurs anglophones. Laissez un champ vide pour afficher le texte français correspondant.</p>
    <div className="mt-3"><TranslateBar missing={missing} total={enFields.length+2} busy={translating} onTranslate={run}/></div>
    {translateError&&<p className="mt-2 text-sm text-destructive">{translateError}</p>}
    <div className="mt-4 grid sm:grid-cols-2 gap-4">{([['titleEn','Nom du programme'],['eyebrowEn','Catégorie'],['orgEn','Organisation'],['launchedEn','Lancement'],['pilotEn','Phase pilote'],['firstEditionEn','Première édition'],['goalEn','Objectif principal']] as const).map(([key,label])=><label key={key} className="block space-y-1 text-sm font-medium"><span>{label} (EN)</span><input className={field} maxLength={300} value={program[key]??''} onChange={e=>patch({[key]:e.target.value})}/></label>)}</div>
    {([['taglineEn','Résumé'],['goalDetailEn','Présentation de l’objectif'],['contextEn','Contexte']] as const).map(([key,label])=><label key={key} className="mt-4 block space-y-1 text-sm font-medium"><span>{label} (EN)</span><textarea className={field} rows={4} maxLength={key==='contextEn'?20000:key==='goalDetailEn'?5000:2000} value={program[key]??''} onChange={e=>patch({[key]:e.target.value})}/></label>)}
    <div className="mt-4 space-y-3 border-t border-border pt-4"><h3 className="text-lg font-bold">Objectifs spécifiques (EN)</h3>{(program.objectivesEn??[]).map((o,i)=><div key={i} className="flex gap-2"><input className={field} aria-label={'Objectif EN '+(i+1)} value={o} maxLength={1000} onChange={e=>patch({objectivesEn:(program.objectivesEn??[]).map((v,j)=>j===i?e.target.value:v)})}/>{action('Retirer l’objectif EN '+(i+1),()=>patch({objectivesEn:(program.objectivesEn??[]).filter((_,j)=>j!==i)}),<Trash2/>)}</div>)}<Button variant="outline" onClick={()=>patch({objectivesEn:[...(program.objectivesEn??[]),'']})}><Plus/>Ajouter un objectif (EN)</Button></div>
    <div className="mt-4 space-y-3 border-t border-border pt-4"><h3 className="text-lg font-bold">Résultats attendus (EN)</h3>{(program.outcomesEn??[]).map((o,i)=><div key={i} className="flex gap-2"><input className={field} aria-label={'Valeur du résultat EN '+(i+1)} value={o.value} onChange={e=>patch({outcomesEn:(program.outcomesEn??[]).map((v,j)=>j===i?{...v,value:e.target.value}:v)})}/><input className={field} aria-label={'Libellé du résultat EN '+(i+1)} value={o.label} onChange={e=>patch({outcomesEn:(program.outcomesEn??[]).map((v,j)=>j===i?{...v,label:e.target.value}:v)})}/>{action('Retirer le résultat EN '+(i+1),()=>patch({outcomesEn:(program.outcomesEn??[]).filter((_,j)=>j!==i)}),<Trash2/>)}</div>)}<Button variant="outline" onClick={()=>patch({outcomesEn:[...(program.outcomesEn??[]),{label:'',value:''}]})}><Plus/>Ajouter un résultat (EN)</Button></div>
   </details>
  </>:<div className="divide-y divide-border">{items.map((p,i)=><div key={i} className="py-4 flex flex-wrap items-center justify-between gap-3"><div><h3 className="font-semibold">{p.title}</h3><p className="text-sm text-muted-foreground">/programmes/{p.slug} · {p.visible?'Visible':'Masqué'}</p></div><div className="flex gap-1">{action('Modifier '+p.title,()=>setSelected(i),<Pencil/>)}{p.visible&&<a href={'/programmes/'+p.slug} target="_blank" rel="noreferrer" title={'Voir '+p.title+' sur le site'} aria-label={'Voir '+p.title+' sur le site'} className="inline-flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition hover:bg-accent hover:text-foreground"><Eye className="h-4 w-4"/></a>}{action('Monter '+p.title,()=>move(i,-1),<ArrowUp/>)}{action('Descendre '+p.title,()=>move(i,1),<ArrowDown/>)}{action('Retirer '+p.title,()=>{if(confirm('Retirer ce programme ?'))onChange(items.filter((_,j)=>j!==i));},<Trash2/>)}</div></div>)}</div>}
  <div className="flex gap-3"><Button disabled={busy} onClick={onSave}><Save/>{busy?'Enregistrement…':'Enregistrer les programmes'}</Button><Button asChild variant="outline"><Link to="/programmes"><Eye/>Voir les programmes</Link></Button></div>
 </fieldset></section>;
}
