/**
 * Template gallery helpers (pure, no React): collection shelves, search and filtering shared by the
 * #/templates page, the "New resume" dialog and the Design panel.
 */
import type { TemplateCollection } from '../templates/types.ts'

export interface CollectionInfo {
  id: TemplateCollection
  label: string
  /** Short label for chips and tight spaces. */
  short: string
  blurb: string
}

/** Shelves in gallery order. */
export const COLLECTIONS: readonly CollectionInfo[] = [
  { id: 'classic', label: 'Classic & professional', short: 'Classic', blurb: 'Proven layouts for corporate, academic and ATS-heavy applications.' },
  { id: 'style', label: 'Design styles', short: 'Design styles', blurb: 'Art-directed looks, from Bauhaus and Swiss grids to Y2K, Pop Art and Vaporwave.' },
  { id: 'format', label: 'Résumé formats', short: 'Formats', blurb: 'Different ways to tell your story: infographic, projects-first and skills-first.' },
  { id: 'ui', label: 'App-style UI', short: 'App UI', blurb: 'Résumés built like software: a dashboard, a design tool and a product showcase.' },
]

const BY_ID = new Map(COLLECTIONS.map((c) => [c.id, c]))

export function collectionInfo(id: TemplateCollection): CollectionInfo {
  return BY_ID.get(id) ?? COLLECTIONS[0]
}

export function isCollection(id: string | undefined): id is TemplateCollection {
  return !!id && BY_ID.has(id as TemplateCollection)
}

/** Tag chips offered next to the collections (collections already cover Classic / Creative / Modern). */
export const GALLERY_TAGS = ['ATS-friendly', 'Two-column', 'Photo', 'One-page'] as const
export type GalleryTag = (typeof GALLERY_TAGS)[number]

export interface GalleryItem {
  id: string
  name: string
  description: string
  tags: readonly string[]
  collection: TemplateCollection
}

export interface GalleryFilter {
  query?: string
  collection?: TemplateCollection | 'all'
  tags?: readonly string[]
}

const fold = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')

function haystack(t: GalleryItem): string {
  const c = collectionInfo(t.collection)
  return fold(`${t.name} ${t.id} ${t.tags.join(' ')} ${c.label} ${c.short} ${t.description}`)
}

/**
 * Filter templates by collection, required tags (all must match) and a free-text query (every word
 * must appear in the name, tags, collection or description). Name matches are ranked first.
 */
export function filterTemplates<T extends GalleryItem>(list: readonly T[], { query = '', collection = 'all', tags = [] }: GalleryFilter = {}): T[] {
  const words = fold(query).split(' ').filter(Boolean)
  const out = list.filter((t) => (collection === 'all' || t.collection === collection) && tags.every((tag) => t.tags.includes(tag)) && (words.length === 0 || words.every((w) => haystack(t).includes(w))))
  if (!words.length) return out
  const nameHit = (t: T) => words.some((w) => fold(t.name).includes(w))
  return [...out.filter(nameHit), ...out.filter((t) => !nameHit(t))]
}

/** Templates per collection, for tab counts. */
export function countByCollection(list: readonly GalleryItem[]): Record<TemplateCollection | 'all', number> {
  const counts = { all: list.length, classic: 0, style: 0, format: 0, ui: 0 }
  for (const t of list) counts[t.collection]++
  return counts
}

/** Neighbour in `ids` for the preview's previous / next buttons (wraps around). */
export function stepId(ids: readonly string[], current: string, delta: number): string {
  if (!ids.length) return current
  const i = ids.indexOf(current)
  if (i < 0) return ids[0]
  return ids[(i + delta + ids.length) % ids.length]
}
