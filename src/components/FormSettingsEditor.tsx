import { useState } from 'react';
import { useServerFn } from '@tanstack/react-start';
import { Plus, Save, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TranslateBar } from '@/components/TranslateBar';
import { adminTranslate } from '@/lib/admin.functions';
import type { ContactSettings, VolunteerSettings } from '@/lib/form-settings';

const field = 'w-full rounded-md border border-input bg-background px-3 py-2 text-sm';
type FormTextField = 'title' | 'intro' | 'formTitle' | 'description' | 'buttonLabel' | 'successMessage' | 'closedMessage' | 'messageLabel' | 'titleEn' | 'introEn' | 'formTitleEn' | 'descriptionEn' | 'buttonLabelEn' | 'successMessageEn' | 'closedMessageEn' | 'messageLabelEn';
export function FormSettingsEditor({ kind, value, onChange, onSave, busy: saveBusy, children }: {
  kind: 'contact' | 'volunteer'; value: ContactSettings | VolunteerSettings;
  onChange: (patch: Partial<VolunteerSettings>) => void; onSave: () => void; busy: boolean; children?: React.ReactNode;
}) {
  const translate = useServerFn(adminTranslate);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const v: Partial<VolunteerSettings> = value;
  const scalarPairs: ReadonlyArray<readonly [FormTextField, FormTextField]> = [
    ['title', 'titleEn'], ['intro', 'introEn'], ['formTitle', 'formTitleEn'], ['description', 'descriptionEn'],
    ['buttonLabel', 'buttonLabelEn'], ['successMessage', 'successMessageEn'], ['closedMessage', 'closedMessageEn'],
    ...(v.missions ? [['messageLabel', 'messageLabelEn'] as const] : []),
  ];
  const scalarItems = scalarPairs.filter(([fr, en]) => (v[fr] ?? '').trim() !== '' && (v[en] ?? '').trim() === '').map(([fr, en]) => ({ id: en, text: (v[fr] ?? '').trim() }));
  const missionItems = (v.missions ?? []).map((text, index) => ({ id: `mis${index}`, text })).filter((item, index) => item.text.trim() !== '' && ((v.missionsEn ?? [])[index] ?? '').trim() === '');
  const missing = scalarItems.length + (v.missions && missionItems.length ? 1 : 0);
  const total = scalarPairs.length + (v.missions ? 1 : 0);
  async function run() {
    const items = [...scalarItems, ...missionItems];
    if (!items.length) return;
    setBusy(true); setError(null);
    try {
      const results: Record<string, string> = {};
      for (let i = 0; i < items.length; i += 40) {
        const res = await translate({ data: { items: items.slice(i, i + 40) } });
        for (const t of res.translations) if (t.text.trim()) results[t.id] = t.text;
      }
      const patch: Partial<VolunteerSettings> = {};
      const missionsEn = v.missions ? Array.from({ length: Math.max(v.missions.length, (v.missionsEn ?? []).length) }, (_, i) => (v.missionsEn ?? [])[i] ?? '') : null;
      let missionsTranslated = false;
      for (const [id, text] of Object.entries(results)) {
        if (missionsEn !== null && id.startsWith('mis')) {
          const index = Number(id.slice(3));
          if (Number.isInteger(index) && index >= 0 && index < missionsEn.length && !missionsEn[index].trim()) { missionsEn[index] = text; missionsTranslated = true; }
        } else Object.assign(patch, { [id]: text });
      }
      if (missionsEn !== null && missionsTranslated) patch.missionsEn = missionsEn;
      if (Object.keys(patch).length) onChange(patch);
    } catch (e) { setError(e instanceof Error ? e.message : 'Traduction impossible.'); }
    finally { setBusy(false); }
  }
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
    {/* Version anglaise optionnelle : un champ laissé vide affiche son homologue français. */}
    <details className="rounded-lg border border-border bg-muted/30 p-4">
      <summary className="cursor-pointer select-none text-sm font-bold">Version anglaise (optionnel)</summary>
      <p className="mt-2 text-sm text-muted-foreground">Textes affichés aux visiteurs anglophones. Laissez un champ vide pour afficher le texte français correspondant (visible en gris dans le champ).</p>
      <div className="mt-3"><TranslateBar missing={missing} total={total} busy={busy} onTranslate={run}/></div>
      {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
      <div className="mt-4 grid sm:grid-cols-2 gap-4">
        {([['titleEn', 'title', 'Titre de la page'], ['formTitleEn', 'formTitle', 'Titre du formulaire'], ['buttonLabelEn', 'buttonLabel', 'Texte du bouton'], ['closedMessageEn', 'closedMessage', 'Message de fermeture']] as const).map(([enKey, frKey, label]) => <label key={enKey} className="block space-y-1 text-sm font-medium"><span>{label} (EN)</span><input className={field} value={value[enKey] ?? ''} maxLength={200} placeholder={value[frKey]} onChange={e => onChange({ [enKey]: e.target.value })}/></label>)}
      </div>
      {([['introEn', 'intro', 'Présentation de la page'], ['descriptionEn', 'description', 'Présentation du formulaire'], ['successMessageEn', 'successMessage', 'Message après envoi']] as const).map(([enKey, frKey, label]) => <label key={enKey} className="block space-y-1 text-sm font-medium"><span>{label} (EN)</span><textarea rows={3} className={field} value={value[enKey] ?? ''} maxLength={enKey === 'successMessageEn' ? 200 : 2000} placeholder={value[frKey]} onChange={e => onChange({ [enKey]: e.target.value })}/></label>)}
      {'missions' in value && <>
        <label className="mt-4 block space-y-1 text-sm font-medium"><span>Libellé du champ motivation (EN)</span><input className={field} value={value.messageLabelEn ?? ''} maxLength={200} placeholder={value.messageLabel} onChange={e => onChange({ messageLabelEn: e.target.value })}/></label>
        <div className="mt-4 space-y-3"><h3 className="text-lg font-bold">Missions proposées (EN)</h3>
          {(value.missionsEn ?? []).map((mission, i) => <div key={i} className="flex gap-2"><input aria-label={`Mission EN ${i + 1}`} className={field} value={mission} maxLength={200} placeholder={value.missions[i]} onChange={e => onChange({ missionsEn: (value.missionsEn ?? []).map((m, j) => i === j ? e.target.value : m) })}/><Button size="icon" variant="ghost" aria-label={`Retirer la mission EN ${i + 1}`} title="Retirer la mission" onClick={() => onChange({ missionsEn: (value.missionsEn ?? []).filter((_, j) => j !== i) })}><Trash2/></Button></div>)}
          <Button variant="outline" disabled={(value.missionsEn ?? []).length >= 20} onClick={() => onChange({ missionsEn: [...(value.missionsEn ?? []), ''] })}><Plus/>Ajouter une mission (EN)</Button>
        </div>
      </>}
    </details>
    <p className="text-sm text-muted-foreground">Les demandes sont enregistrées dans « {kind === 'contact' ? 'Messages' : 'Candidatures'} ». Aucun e-mail automatique n’est envoyé.</p>
    <Button disabled={saveBusy} onClick={onSave}><Save/>{saveBusy ? 'Enregistrement…' : kind === 'contact' ? 'Enregistrer le contact' : 'Enregistrer les bénévoles'}</Button>
  </section>;
}
