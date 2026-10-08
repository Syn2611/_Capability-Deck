import { getCollection, type CollectionEntry } from 'astro:content';

export type Sector = CollectionEntry<'sectors'>;

/** All sectors, ordered. Drafts are included (they are built, just not linked). */
export async function getAllSectors(): Promise<Sector[]> {
  const all = await getCollection('sectors');
  return all.sort((a, b) => a.data.order - b.data.order);
}

/** Sectors shown in navigation, grids, sitemap and prev/next. */
export async function getLiveSectors(): Promise<Sector[]> {
  return (await getAllSectors()).filter((s) => !s.data.draft);
}

export const sectorHref = (slug: string) => `/sectors/${slug}/`;
