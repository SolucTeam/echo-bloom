import { describe, expect, it } from 'vitest';
import { eventItemSchema, localizedEvents, readEvents } from './event-schema';
import { DEFAULT_EVENTS } from '@/data/events';

describe('événements bilingues', () => {
  it('accepte un événement avec champs anglais complets', () => {
    expect(eventItemSchema.safeParse({ ...DEFAULT_EVENTS[0], titleEn: 'Test event', locationEn: 'Abidjan', descriptionEn: 'English description.' }).success).toBe(true);
  });
  it('conserve les champs anglais lors de la lecture d’un réglage enregistré', () => {
    const raw = JSON.stringify([{ ...DEFAULT_EVENTS[0], titleEn: 'Saved event' }]);
    expect(readEvents(raw)[0].titleEn).toBe('Saved event');
  });
  it('affiche le français tel quel en français', () => {
    expect(localizedEvents(DEFAULT_EVENTS, 'fr')[0].title).toBe(DEFAULT_EVENTS[0].title);
  });
  it('remplace champ par champ en anglais, avec repli français', () => {
    const items = [{ ...DEFAULT_EVENTS[0], locationEn: 'Abidjan, Côte d’Ivoire', descriptionEn: undefined }];
    const en = localizedEvents(items, 'en');
    expect(en[0].title).toBe(items[0].titleEn);
    expect(en[0].location).toBe('Abidjan, Côte d’Ivoire');
    expect(en[0].description).toBe(DEFAULT_EVENTS[0].description);
    const fallback = localizedEvents([{ ...DEFAULT_EVENTS[0], descriptionEn: '' }], 'en');
    expect(fallback[0].description).toBe(DEFAULT_EVENTS[0].description);
  });
  it('les événements d’origine portent leur traduction anglaise', () => {
    expect(DEFAULT_EVENTS.every((e) => (e.titleEn ?? '').trim().length > 0)).toBe(true);
  });
});
