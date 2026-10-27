import { ArrowUp, ArrowDown, Plus, Trash2, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { PressItem } from '@/lib/press-schema';

const field = 'w-full rounded-md border border-input bg-background px-3 py-2 text-sm';

export function PressEditor({ items, setItems, busy, onSave }: { items: PressItem[]; setItems: (items: PressItem[]) => void; busy: boolean; onSave: () => void }) {
  function move(index: number, direction: number) {
    const target = index + direction;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    [next[index], next[target]] = [next[target], next[index]];
    setItems(next);
  }
  function patch(index: number, value: Partial<PressItem>) { setItems(items.map((v, i) => i === index ? { ...v, ...value } : v)); }
  return <section className="space-y-4">
    <div className="flex flex-wrap justify-between gap-3 items-center">
      <div>
        <h2 className="text-2xl font-bold">Espace presse</h2>
        <p className="text-sm text-muted-foreground">Les communiqués affichés dans l’onglet « Presse » de la page Actualités, du plus récent en haut idéalement.</p>
      </div>
      <Button variant="outline" onClick={() => setItems([...items, { title: '', date: new Date().toISOString().slice(0, 10), summary: '', url: '' }])}><Plus />Ajouter un communiqué</Button>
    </div>
    <p className="text-sm text-muted-foreground">Version anglaise : laissez un champ « (EN) » vide pour conserver le texte français.</p>
    {items.map((item, index) => <div key={index} className="border border-border rounded-lg p-4 space-y-3">
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-semibold">Communiqué {index + 1}</span>
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" disabled={index === 0} title="Monter le communiqué" aria-label="Monter le communiqué" onClick={() => { const t = index - 1; if (t < 0) return; const next = [...items]; [next[index], next[t]] = [next[t], next[index]]; setItems(next); }}><ArrowUp /></Button>
          <Button variant="ghost" size="icon" disabled={index === items.length - 1} title="Descendre le communiqué" aria-label="Descendre le communiqué" onClick={() => { const t = index + 1; if (t >= items.length) return; const next = [...items]; [next[index], next[t]] = [next[t], next[index]]; setItems(next); }}><ArrowDown /></Button>
          <Button variant="ghost" size="icon" title="Retirer le communiqué" aria-label="Retirer le communiqué" onClick={() => setItems(items.filter((_, i) => i !== index))}><Trash2 /></Button>
        </div>
      </div>
      <label className="block text-sm font-medium space-y-1"><span>Titre</span><input maxLength={300} className={field} value={item.title} onChange={e => patch(index, { title: e.target.value })} /></label>
      <label className="block text-sm font-medium space-y-1"><span>Titre (EN)</span><input maxLength={300} className={field} placeholder={item.title || 'Version anglaise'} value={item.titleEn || ''} onChange={e => patch(index, { titleEn: e.target.value })} /></label>
      <div className="grid sm:grid-cols-2 gap-4">
        <label className="block text-sm font-medium space-y-1"><span>Date</span><input type="date" className={field} value={item.date} onChange={e => patch(index, { date: e.target.value })} /></label>
        <label className="block text-sm font-medium space-y-1"><span>Lien du communiqué (PDF, https://…)</span><input type="url" placeholder="https://" className={field} value={item.url} onChange={e => patch(index, { url: e.target.value })} /></label>
      </div>
      <label className="block text-sm font-medium space-y-1"><span>Résumé</span><textarea rows={3} maxLength={2000} className={field} value={item.summary} onChange={e => patch(index, { summary: e.target.value })} /></label>
      <label className="block text-sm font-medium space-y-1"><span>Résumé (EN)</span><textarea rows={3} maxLength={2000} className={field} placeholder={item.summary || 'Version anglaise'} value={item.summaryEn || ''} onChange={e => patch(index, { summaryEn: e.target.value })} /></label>
    </div>)}
    <Button disabled={busy} onClick={onSave}><Save />{busy ? 'Enregistrement…' : 'Enregistrer les communiqués'}</Button>
  </section>;
}
