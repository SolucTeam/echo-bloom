import { ArrowUp, ArrowDown, Plus, Trash2, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { EventItem } from '@/lib/event-schema';

const field = 'w-full rounded-md border border-input bg-background px-3 py-2 text-sm';

export function EventEditor({ items, setItems, busy, onSave }: { items: EventItem[]; setItems: (items: EventItem[]) => void; busy: boolean; onSave: () => void }) {
  function move(index: number, direction: number) {
    const target = index + direction;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    [next[index], next[target]] = [next[target], next[index]];
    setItems(next);
  }
  function patch(index: number, value: Partial<EventItem>) { setItems(items.map((v, i) => i === index ? { ...v, ...value } : v)); }
  return <section className="space-y-4">
    <div className="flex flex-wrap justify-between gap-3 items-center">
      <div>
        <h2 className="text-2xl font-bold">Événements</h2>
        <p className="text-sm text-muted-foreground">Les événements affichés dans l’onglet « Événements » de la page Actualités, triés automatiquement par date.</p>
      </div>
      <Button variant="outline" onClick={() => setItems([...items, { title: '', date: new Date().toISOString().slice(0, 10), location: '', description: '', url: '' }])}><Plus />Ajouter un événement</Button>
    </div>
    {items.map((item, index) => <div key={index} className="border border-border rounded-lg p-4 space-y-3">
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-semibold">Événement {index + 1}</span>
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" disabled={index === 0} title="Monter l'événement" aria-label="Monter l'événement" onClick={() => move(index, -1)}><ArrowUp /></Button>
          <Button variant="ghost" size="icon" disabled={index === items.length - 1} title="Descendre l'événement" aria-label="Descendre l'événement" onClick={() => move(index, 1)}><ArrowDown /></Button>
          <Button variant="ghost" size="icon" title="Retirer l'événement" aria-label="Retirer l'événement" onClick={() => setItems(items.filter((_, i) => i !== index))}><Trash2 /></Button>
        </div>
      </div>
      <label className="block text-sm font-medium space-y-1"><span>Titre</span><input maxLength={300} className={field} value={item.title} onChange={e => patch(index, { title: e.target.value })} /></label>
      <div className="grid sm:grid-cols-2 gap-4">
        <label className="block text-sm font-medium space-y-1"><span>Date</span><input type="date" className={field} value={item.date} onChange={e => patch(index, { date: e.target.value })} /></label>
        <label className="block text-sm font-medium space-y-1"><span>Lieu</span><input maxLength={300} className={field} value={item.location} onChange={e => patch(index, { location: e.target.value })} /></label>
      </div>
      <label className="block text-sm font-medium space-y-1"><span>Description</span><textarea rows={3} maxLength={5000} className={field} value={item.description} onChange={e => patch(index, { description: e.target.value })} /></label>
      <label className="block text-sm font-medium space-y-1"><span>Lien (https://…)</span><input type="url" placeholder="https://" className={field} value={item.url} onChange={e => patch(index, { url: e.target.value })} /></label>
    </div>)}
    <Button disabled={busy} onClick={onSave}><Save />{busy ? 'Enregistrement…' : 'Enregistrer les événements'}</Button>
  </section>;
}
