/**
 * Compact renderers for single-column templates, so short sections cost a line or two instead of a
 * row per item:
 *   languages / interests → "English (Native) · Hindi (Fluent)"            (inlineWhole)
 *   skills (≤ 8 groups)   → SkillRows table
 *   certifications/awards → CompactLine rows
 * Use compactWhole as (part of) sectionsToBlocks' `whole`, and compactEntry ahead of DefaultEntry.
 */
import type { ReactNode } from 'react'
import type { EntryView, SectionView } from '../../lib/templateData.ts'
import { Keywords } from './entries.tsx'
import { CompactLine, SkillRows } from './inline.tsx'
import { cx } from './utils.ts'

/** "Title (detail)" labels for a languages or interests section. */
export function inlineLabels(s: SectionView): string[] {
  return s.entries
    .map((e) => {
      const detail = s.kind === 'languages' ? e.levelLabel : e.keywords.join(', ')
      return e.title && detail ? `${e.title} (${detail})` : e.title || detail
    })
    .filter(Boolean)
}

/** Languages and interests as one inline list; undefined for every other kind. */
export function inlineWhole(s: SectionView, className?: string, separator = ' · '): ReactNode | undefined {
  if (s.kind !== 'languages' && s.kind !== 'interests') return undefined
  return <Keywords variant="inline" separator={separator} className={className} items={inlineLabels(s)} />
}

const SKILL_ROWS_MAX = 8
const LINES_MAX = 6

/**
 * `whole` renderer for single-column templates: inline languages/interests, a skills table (up to 8
 * groups) and certifications/awards as tight one-line rows (up to 6). Longer lists return undefined
 * and fall back to one block per entry (use compactEntry) so they can still paginate.
 */
export function compactWhole(s: SectionView, className?: string): ReactNode | undefined {
  if (s.kind === 'skills') return s.entries.length <= SKILL_ROWS_MAX ? <SkillRows entries={s.entries} className={className} /> : undefined
  if ((s.kind === 'certifications' || s.kind === 'awards') && s.entries.length <= LINES_MAX) {
    return (
      <div className={cx('rf-clines', className)}>
        {s.entries.map((e) => (
          <CompactLine key={e.id} e={e} />
        ))}
      </div>
    )
  }
  return inlineWhole(s, className)
}

/** One-line entry for certifications and awards; undefined for every other kind. */
export function compactEntry(e: EntryView, className?: string): ReactNode | undefined {
  return e.kind === 'certifications' || e.kind === 'awards' ? <CompactLine e={e} className={className} /> : undefined
}
