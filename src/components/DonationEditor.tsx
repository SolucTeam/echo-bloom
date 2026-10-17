import { ArrowUp, ArrowDown, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

type Collection = { label: string; url: string };

export function DonationEditor({ items, setItems }: { items: Collection[]; setItems: (items: Collection[]) => void }) {
  function move(index: number, direction: number) {
    const target = index + direction;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    [next[index], next[target]] = [next[target], next[index]];
    setItems(next);
  }
  return <section className="space-y-4 border-t border-border pt-6">
    <h3 className="text-xl font-bold">Collectes de dons</h3>
    {items.map((item, index) => <div key={index} className="border border-border rounded-lg p-4 space-y-3">
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-semibold">Collecte {index + 1}</span>
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" disabled={index === 0} title="Monter la collecte" aria-label="Monter la collecte" onClick={() => move(index, -1)}><ArrowUp /></Button>
          <Button variant="ghost" size="icon" disabled={index === items.length - 1} title="Descendre la collecte" aria-label="Descendre la collecte" onClick={() => move(index, 1)}><ArrowDown /></Button>
          <Button variant="ghost" size="icon" title="Retirer la collecte" aria-label="Retirer la collecte" onClick={() => setItems(items.filter((_, i) => i !== index))}><Trash2 /></Button>
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <label className="block text-sm font-medium space-y-1"><span>Titre de la collecte</span><input maxLength={200} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={item.label} onChange={e => setItems(items.map((v, i) => i === index ? { ...v, label: e.target.value } : v))} /></label>
        <label className="block text-sm font-medium space-y-1"><span>Lien de la collecte</span><input type="url" placeholder="https://" className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={item.url} onChange={e => setItems(items.map((v, i) => i === index ? { ...v, url: e.target.value } : v))} /></label>
      </div>
    </div>)}
    <Button variant="outline" onClick={() => setItems([...items, { label: '', url: '' }])}><Plus />Ajouter une collecte</Button>
  </section>;
}