import { describe, expect, it } from 'vitest';
import { galleryCollections } from './gallery';

const originals = [{ title: 'Terrain', tags: ['Tous', 'Nettoyage'], images: [{ src: '/original.jpg', tag: 'Nettoyage' }] }];
describe('Editable gallery collections', () => {
  it('exposes new categories before the originals are imported', () => {
    const result = galleryCollections(originals, [{ collection: 'Terrain', image_url: '/new.jpg', tag: 'Formation' }], false);
    expect(result[0].tags).toEqual(['Tous', 'Formation', 'Nettoyage']);
  });
  it('exposes entirely new collections with their caption and alternative text', () => {
    const result = galleryCollections(originals, [{ collection: 'Écoles', image_url: '/school.jpg', tag: 'Atelier', alt: 'Élèves', caption: 'Atelier scolaire' }], false);
    expect(result[1]).toMatchObject({ title: 'Écoles', tags: ['Tous', 'Atelier'], images: [{ alt: 'Élèves', caption: 'Atelier scolaire' }] });
  });
  it('does not restore deleted originals after import', () => {
    expect(galleryCollections(originals, [], true)).toEqual([]);
  });
});