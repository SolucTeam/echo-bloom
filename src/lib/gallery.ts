export type GalleryImage = { src: string; tag: string; alt?: string; caption?: string };
export type GalleryCollection = { title: string; tags: string[]; images: GalleryImage[] };
type GalleryPhoto = { collection: string; image_url: string; tag: string; alt?: string; caption?: string };

export function galleryCollections(originals: GalleryCollection[], photos: GalleryPhoto[], imported: boolean): GalleryCollection[] {
  const titles = [...new Set([...(imported ? [] : originals.map(c => c.title)), ...photos.map(p => p.collection)])];
  return titles.map(title => {
    const original = imported ? undefined : originals.find(c => c.title === title);
    const images = [...photos.filter(p => p.collection === title).map(p => ({ src: p.image_url, tag: p.tag, alt: p.alt, caption: p.caption })), ...(original?.images ?? [])];
    return { title, images, tags: ['Tous', ...new Set(images.map(i => i.tag).filter(t => t && t !== 'Tous'))] };
  });
}