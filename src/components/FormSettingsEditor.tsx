import { Plus, Save, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { ContactSettings, VolunteerSettings } from '@/lib/form-settings';

const field = 'w-full rounded-md border border-input bg-background px-3 py-2 text-sm';
export function FormSettingsEditor({ kind, value, onChange, onSave, busy, children }: {
  kind: 'contact' | 'volunteer'; value: ContactSettings | VolunteerSettings;
  onChange: (patch: Partial<VolunteerSettings>) => void; onSave: () => void; busy: boolean; children?: React.ReactNode;
}) {
  return <section className="space-y-6">
    <h2 className="text-2xl font-bold">{kind === 'contact' ? 'Contact' : 'Formulaire bénévoles'}</h2>
    {children}
    <label className="flex items-center gap-3 text-sm font-medium"><input type="checkbox" checked={value.enabled} onChange={e => onChange({ enabled: e.target.checked })}/>Accepter les {kind === 'contact' ? 'messages de contact' : 'inscriptions bénévoles'}</label>
    <div className="grid sm:grid-cols-2 gap-4">
      {([['title', 'Titre de la page'], ['formTitle', 'Titre du formulaire'], ['buttonLabel', 'Texte du bouton'], ['closedMessage', 'Message de fermeture']] as const).map(([key, label]) => <label key={key} className="block space-y-1 text-sm font-medium"><span>{label}</span><input className={field} value={value[key]} maxLength={200} onChange={e => onChange({ [key]: e.target.value })}/></label>)}
    </div>
    {([['intro', 'Présentation de la page'], ['description', 'Présentation du formulaire'], ['successMessage', 'Message après envoi']] as const).map(([key, label]) => <label key={key} className="block space-y-1 text-sm font-medium"><span>{label}</span><textarea rows={3} className={field} value={value[key]} maxLength={key === 'successMessage' ? 200 : 2000} onChange={e => onChange({ [key]: e.target.value })}/></label>)}
    {'missions' in value && <>
      <div className="border-t border-border pt-6 space-y-3"><h3 className="text-lg font-bold">Champs facultatifs</h3>
        {([['showPhone', 'Téléphone'], ['showCity', 'Ville'], ['showMessage', 'Motivation']] as const).map(([key, label]) => <label key={key} className="flex items-center gap-3 text-sm"><input type="checkbox" checked={value[key]} onChange={e => onChange({ [key]: e.target.checked })}/>{label}</label>)}
        <label className="block space-y-1 text-sm font-medium"><span>Libellé du champ motivation</span><input className={field} value={value.messageLabel} maxLength={200} onChange={e => onChange({ messageLabel: e.target.value })}/></label>
      </div>
      <div className="border-t border-border pt-6 space-y-3"><h3 className="text-lg font-bold">Missions proposées</h3>
        {value.missions.map((mission, i) => <div key={i} className="flex gap-2"><input aria-label={`Mission ${i + 1}`} className={field} value={mission} maxLength={200} onChange={e => onChange({ missions: value.missions.map((m, j) => i === j ? e.target.value : m) })}/><Button size="icon" variant="ghost" aria-label={`Retirer la mission ${i + 1}`} title="Retirer la mission" onClick={() => onChange({ missions: value.missions.filter((_, j) => j !== i) })}><Trash2/></Button></div>)}
        <Button variant="outline" disabled={value.missions.length >= 20} onClick={() => onChange({ missions: [...value.missions, ''] })}><Plus/>Ajouter une mission</Button>
      </div>
    </>}
    <p className="text-sm text-muted-foreground">Les demandes sont enregistrées dans « {kind === 'contact' ? 'Messages' : 'Candidatures'} ». Aucun e-mail automatique n’est envoyé.</p>
    <Button disabled={busy} onClick={onSave}><Save/>{busy ? 'Enregistrement…' : kind === 'contact' ? 'Enregistrer le contact' : 'Enregistrer les bénévoles'}</Button>
  </section>;
}
