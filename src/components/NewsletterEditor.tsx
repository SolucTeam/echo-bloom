import { ExternalLink, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { NewsletterSettings } from '@/lib/newsletter';

export function NewsletterEditor({value, onChange, onSave, busy}: {
  value: NewsletterSettings;
  onChange: (value: NewsletterSettings) => void;
  onSave: () => void;
  busy: boolean;
}) {
  const field = 'w-full rounded-md border border-input bg-background px-3 py-2 text-sm';
  return <section className="space-y-6">
    <h2 className="text-2xl font-bold">Newsletter</h2>
    <label className="flex items-center gap-3 text-sm font-medium">
      <input type="checkbox" checked={value.enabled} onChange={e => onChange({...value, enabled: e.target.checked})}/>
      Afficher la newsletter sur le site
    </label>
    <div className="grid sm:grid-cols-2 gap-4">
      <label className="space-y-1 text-sm font-medium">Titre<input className={field} value={value.title} maxLength={120} onChange={e => onChange({...value, title:e.target.value})}/></label>
      <label className="space-y-1 text-sm font-medium">Texte du bouton<input className={field} value={value.buttonLabel} maxLength={80} onChange={e => onChange({...value, buttonLabel:e.target.value})}/></label>
    </div>
    <label className="block space-y-1 text-sm font-medium">Présentation<textarea className={field} rows={3} maxLength={500} value={value.description} onChange={e => onChange({...value, description:e.target.value})}/></label>
    <div className="space-y-1">
      <label className="block space-y-1 text-sm font-medium">Formulaire intégré (inscription directement sur votre page)<input type="url" placeholder="https://… (adresse du formulaire Brevo « Intégré »)" className={field} value={value.embed} onChange={e => onChange({...value, embed:e.target.value})}/></label>
      <p className="text-xs text-muted-foreground">Dans Brevo : Contacts → Formulaires d’inscription → créez un formulaire de type « Intégré » → copiez l’adresse qui apparaît après <code>src=</code> dans le code fourni, et collez-la ici. Le formulaire d’abonnement s’affichera directement dans le pied de page.</p>
    </div>
    <label className="block space-y-1 text-sm font-medium">Lien de la page d’inscription (bouton de secours si aucun formulaire intégré)<input type="url" placeholder="https://…" className={field} value={value.url} onChange={e => onChange({...value, url:e.target.value})}/></label>
    <div className="flex flex-wrap gap-3">
      <Button disabled={busy} onClick={onSave}><Save/>{busy?'Enregistrement…':'Enregistrer la newsletter'}</Button>
      {value.url.startsWith('https://') && <Button variant="outline" asChild><a href={value.url} target="_blank" rel="noopener noreferrer"><ExternalLink/>Ouvrir la page d’inscription</a></Button>}
    </div>
  </section>;
}