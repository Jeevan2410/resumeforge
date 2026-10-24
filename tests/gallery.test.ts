import assert from 'node:assert/strict'
import { readdirSync, readFileSync } from 'node:fs'
import { describe, it } from 'node:test'
import { COLLECTIONS, countByCollection, filterTemplates, isCollection, stepId, type GalleryItem } from '../src/lib/gallery.ts'

const list: GalleryItem[] = [
  { id: 'classic', name: 'Classic', description: 'Timeless serif typography', tags: ['Classic', 'ATS-friendly'], collection: 'classic' },
  { id: 'popart', name: 'Pop Art', description: 'A comic-book page with halftone', tags: ['Creative', 'Photo'], collection: 'style' },
  { id: 'vaporwave', name: 'Vaporwave', description: 'A neon 1980s sunset', tags: ['Creative', 'Photo'], collection: 'style' },
  { id: 'dashboard', name: 'Dashboard', description: 'Your résumé as an app with KPI tiles', tags: ['Modern', 'Two-column'], collection: 'ui' },
]
const ids = (l: GalleryItem[]) => l.map((t) => t.id)

describe('template gallery', () => {
  it('filters by collection, tags and every query word', () => {
    assert.deepEqual(ids(filterTemplates(list)), ['classic', 'popart', 'vaporwave', 'dashboard'])
    assert.deepEqual(ids(filterTemplates(list, { collection: 'style' })), ['popart', 'vaporwave'])
    assert.deepEqual(ids(filterTemplates(list, { tags: ['Photo', 'Creative'] })), ['popart', 'vaporwave'])
    assert.deepEqual(ids(filterTemplates(list, { query: 'neon' })), ['vaporwave'])
    assert.deepEqual(ids(filterTemplates(list, { query: 'creative photo comic' })), ['popart'])
    assert.deepEqual(ids(filterTemplates(list, { query: 'APP UI' })), ['dashboard'], 'collection labels are searchable')
    assert.deepEqual(ids(filterTemplates(list, { query: 'resume app' })), ['dashboard'], 'accents are folded')
    assert.deepEqual(filterTemplates(list, { query: 'zzz' }), [])
  })

  it('ranks name matches first', () => {
    const l: GalleryItem[] = [
      { id: 'a', name: 'Alpha', description: 'has a timeline', tags: [], collection: 'classic' },
      { id: 'b', name: 'Timeline', description: '', tags: [], collection: 'classic' },
    ]
    assert.deepEqual(ids(filterTemplates(l, { query: 'timeline' })), ['b', 'a'])
  })

  it('counts collections and steps with wrap-around', () => {
    assert.deepEqual(countByCollection(list), { all: 4, classic: 1, style: 2, format: 0, ui: 1 })
    assert.equal(stepId(['a', 'b', 'c'], 'c', 1), 'a')
    assert.equal(stepId(['a', 'b', 'c'], 'a', -1), 'c')
    assert.equal(stepId(['a', 'b'], 'zz', 1), 'a')
    assert.ok(isCollection('ui') && !isCollection('nope') && !isCollection(undefined))
  })

  it('every template declares a known collection', () => {
    const known = new Set(COLLECTIONS.map((c) => c.id))
    const dirs = readdirSync('src/templates', { withFileTypes: true }).filter((d) => d.isDirectory() && d.name !== 'shared')
    assert.ok(dirs.length >= 45)
    for (const d of dirs) {
      const m = /collection: '(\w+)'/.exec(readFileSync(`src/templates/${d.name}/index.tsx`, 'utf8'))
      assert.ok(m && known.has(m[1] as never), `${d.name} needs a collection`)
    }
  })
})
