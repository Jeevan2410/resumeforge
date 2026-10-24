/**
 * Compact row components for single-column templates (see compact.tsx for the `whole`/`entry`
 * helpers that use them):
 *   SkillRows   → a two-track table "Group | a, b, c (level)"
 *   CompactLine → "Title — Issuer ………………… Date" on one line (certifications, awards)
 * Classes: .rf-srows > .rf-srow (.rf-srow__name, .rf-srow__list, .rf-srow__level); .rf-cline
 * (.rf-cline__title, .rf-cline__by, .rf-cline__date, .rf-cline__link, .rf-cline__note), .rf-clines.
 * Base styles live in base.css (:where, overridable).
 */
import type { EntryView } from '../../lib/templateData.ts'
import { EntryLink } from './entries.tsx'
import { Rich } from './Rich.tsx'
import { cx } from './utils.ts'

/** Skills as rows of "Group | keywords (level)". */
export function SkillRows({ entries, className }: { entries: EntryView[]; className?: string }) {
  return (
    <div className={cx('rf-srows', className)}>
      {entries.map((e) => (
        <div key={e.id} className="rf-srow">
          <div className="rf-srow__name">{e.title}</div>
          <div className="rf-srow__list">
            {e.keywords.join(', ')}
            {e.levelLabel && <span className="rf-srow__level">{e.keywords.length ? ` (${e.levelLabel})` : e.levelLabel}</span>}
          </div>
        </div>
      ))}
    </div>
  )
}

/** "Title — Issuer ……… Date" with an optional link / note below (certifications, awards). */
export function CompactLine({ e, className }: { e: EntryView; className?: string }) {
  return (
    <div className={cx('rf-cline', `rf-cline--${e.kind}`, className)}>
      <div className="rf-cline__row">
        <div className="rf-cline__l">
          {e.title && <span className="rf-cline__title">{e.title}</span>}
          {e.title && e.subtitle && <span className="rf-cline__dash">{' — '}</span>}
          {e.subtitle && <span className="rf-cline__by">{e.subtitle}</span>}
        </div>
        {e.date && <div className="rf-cline__date">{e.date}</div>}
      </div>
      {e.url && <EntryLink entry={e} className="rf-cline__link" />}
      {e.description && <Rich as="div" className="rf-cline__note" text={e.description} />}
    </div>
  )
}
