import { describe, expect, it } from 'vitest';
import { pressItemSchema, localizedPress, readPress } from './press-schema';
import { DEFAULT_PRESS } from '@/data/press';

describe('communiqués bilingues', () => {
  it('accepte un communiqué avec champs anglais complets', () => {
    expect(pressItemSchema.safeParse({ ...DEFAULT_PRESS[0], titleEn: 'Test release', summaryEn: 'English summary.' }).success).toBe(true);
  });
  it('conserve les champs anglais lors de la lecture d’un réglage enregistré', () => {
    const raw = JSON.stringify([{ ...DEFAULT_PRESS[0], titleEn: 'Saved title' }]);
    expect(readPress(raw)[0].titleEn).toBe('Saved title');
  });
  it('affiche le français tel quel en français', () => {
    expect(localizedPress(DEFAULT_PRESS, 'fr')[0].title).toBe(DEFAULT_PRESS[0].title);
  });
  it('remplace champ par champ en anglais, avec repli français', () => {
    const items = [{ ...DEFAULT_PRESS[0], summaryEn: 'English summary.' }];
    const en = localizedPress(items, 'en');
    expect(en[0].title).toBe(items[0].titleEn);
    expect(en[0].summary).toBe('English summary.');
    const fallback = localizedPress([{ ...DEFAULT_PRESS[0], titleEn: '  ' }], 'en');
    expect(fallback[0].title).toBe(DEFAULT_PRESS[0].title);
  });
  it('les communiqués d’origine portent leur traduction anglaise', () => {
    expect(DEFAULT_PRESS.every((p) => (p.titleEn ?? '').trim().length > 0)).toBe(true);
  });
});
