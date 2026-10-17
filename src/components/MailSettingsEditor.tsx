import { Mail, Save, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { mailKinds, type MailSettings } from '@/lib/mail-settings';

export function MailSettingsEditor({ value, onChange, busy, onSave, onTest, online, jobs }: {
  value: MailSettings; onChange: (value: MailSettings) => void; busy: boolean;
  onSave: () => void; onTest: () => void; online: boolean;
  jobs: { id: string; source_kind: string; status: string; created_at: string; attempts: number }[];
}) {
  const field = 'w-full rounded-md border border-input bg-background px-3 py-2 text-sm';
  const labels = { contact: 'Contact', benevole: 'Bénévoles', partenaire: 'Partenaires' };
  const states: Record<string, string> = { pending: 'En attente du serveur', sending: 'Envoi en cours', sent: 'Envoyé', failed: 'Échec — vérifier la messagerie' };
  return <section className="space-y-6">
    <div><h2 className="text-2xl font-bold">E-mails automatiques</h2><p role="status" className="mt-2 text-sm text-muted-foreground">{online ? 'Messagerie du serveur connectée.' : 'Messagerie du serveur non connectée — aucun envoi actuellement.'}</p></div>
    <fieldset disabled={busy} className="space-y-6">
      <div className="grid sm:grid-cols-2 gap-4">
        <label className="block space-y-1 text-sm font-medium">Nom de l’expéditeur<input className={field} maxLength={120} value={value.senderName} onChange={e => onChange({...value, senderName: e.target.value})}/></label>
        <label className="block space-y-1 text-sm font-medium">Adresse d’expédition<input className={field} type="email" value={value.senderEmail} onChange={e => onChange({...value, senderEmail: e.target.value})}/></label>
      </div>
      {mailKinds.map(kind => <div key={kind} className="space-y-3 border-t border-border pt-5">
        <h3 className="flex gap-2 items-center text-lg font-semibold"><Mail className="h-4 w-4"/>{labels[kind]}</h3>
        <label className="flex gap-3 items-center text-sm"><input type="checkbox" checked={value[kind].enabled} onChange={e => onChange({...value, [kind]: {...value[kind], enabled: e.target.checked}})}/>Notifier l’équipe à chaque nouvelle demande</label>
        <div className="grid sm:grid-cols-2 gap-4">
          <label className="block space-y-1 text-sm font-medium">Destinataire — {labels[kind]}<input className={field} type="email" value={value[kind].recipient} onChange={e => onChange({...value, [kind]: {...value[kind], recipient: e.target.value}})}/></label>
          <label className="block space-y-1 text-sm font-medium">Objet — {labels[kind]}<input className={field} maxLength={120} value={value[kind].subject} onChange={e => onChange({...value, [kind]: {...value[kind], subject: e.target.value}})}/></label>
        </div>
      </div>)}
      <div className="flex gap-3 flex-wrap"><Button onClick={onSave}><Save/>Enregistrer les e-mails</Button><Button variant="outline" disabled={!online} onClick={onTest}><Send/>Envoyer un test au destinataire Contact</Button></div>
    </fieldset>
    <div className="border-t border-border pt-5"><h3 className="text-lg font-semibold">Derniers envois</h3>{jobs.length === 0 ? <p className="mt-3 text-sm text-muted-foreground">Aucun e-mail en attente ou envoyé.</p> : <ul className="divide-y divide-border">{jobs.map(job => <li key={job.id} className="py-3 flex flex-wrap justify-between gap-2 text-sm"><span>{job.source_kind === 'test' ? 'Test' : labels[job.source_kind as keyof typeof labels] || job.source_kind} · {new Date(job.created_at).toLocaleString('fr-FR')}</span><span>{states[job.status] || job.status}</span></li>)}</ul>}</div>
  </section>;
}