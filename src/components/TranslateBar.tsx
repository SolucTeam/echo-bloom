import { Languages } from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * Barre « Traduction automatique » des sections anglaises de la console : affiche
 * le nombre de champs EN restant à renseigner et propose de les remplir depuis le
 * texte français. Ne remplace jamais un champ EN déjà saisi à la main.
 */
export function TranslateBar({ missing, total, busy, onTranslate, label = 'Traduire automatiquement' }: { missing: number; total?: number; busy: boolean; onTranslate: () => void; label?: string }) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button type="button" variant="outline" size="sm" disabled={busy || missing === 0} onClick={onTranslate}>
        <Languages className="h-4 w-4" />
        {busy ? 'Traduction…' : label}
      </Button>
      {total !== undefined && (
        <span
          className={
            'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ' +
            (missing === 0 ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800')
          }
        >
          {missing === 0 ? '✓ Anglais complet' : `${total - missing}/${total} en anglais`}
        </span>
      )}
      <span className="text-xs text-muted-foreground">Ne remplace que les champs anglais vides ; relisez le résultat avant d’enregistrer.</span>
    </div>
  );
}
