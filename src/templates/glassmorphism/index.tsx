/**
 * Glassmorphism — frosted panes over a blurred colour field. Page 1 opens with a split header of two
 * glass panes side by side: a wide one with the photo, name and title, and a narrow one with the
 * contact details. Below, every section floats in its own frosted card with soft highlights (blocks of
 * a section join into one card), so the page reads as a stack of glass sheets. Single column.
 */
import type { CSSProperties, ReactNode } from 'react'
import {
  ContactList,
  DefaultEntry,
  PageLayout,
  Photo,
  RichParagraphs,
  compactEntry,
  compactWhole,
  contactEntries,
  displayName,
  hasPhoto,
  sectionsToBlocks,
  type EntryView,
  type SectionView,
  type TemplateMeta,
  type TemplateProps,
} from '../shared'
import './glassmorphism.css'

export const meta: TemplateMeta = {
  id: 'glassmorphism',
  name: 'Glassmorphism',
  description: 'A split header of two frosted-glass panes, then every section in its own floating glass card over a soft blurred colour field.',
  tags: ['Modern', 'Photo'],
  order: 330,
  collection: 'style',
  supportsPhoto: true,
  columns: 1,
  defaultFont: 'inter',
  defaultAccent: '#1769aa',
  headingCase: 'upper',
  gaps: { entry: 10, section: 12 },
}

const heading = (s: SectionView) => <h2 className="gl-h">{s.title}</h2>

/** One glass card per section: the blocks of a section touch and the CSS rounds the outer corners. */
const card = (node: ReactNode, info: { first: boolean; last: boolean }) => (
  <div className={`gl-card${info.first ? ' gl-card--first' : ''}${info.last ? ' gl-card--last' : ''}`}>{node}</div>
)

export default function Glassmorphism({ data, design, main }: TemplateProps) {
  const b = data.basics
  const vars = { '--gl-pink': '#f4a6c8', '--gl-mint': '#93e1d0', '--gl-ink': '#0f1f33' } as CSSProperties

  const header = (
    <header className="gl-header">
      <div className="gl-pane gl-pane--id gl-glass">
        {hasPhoto(b, design) && <Photo basics={b} size="25mm" className="gl-photo" />}
        <div className="gl-header__text">
          <h1 className="gl-name">{displayName(b)}</h1>
          {b.title.trim() && <div className="gl-title">{b.title}</div>}
        </div>
      </div>
      {contactEntries(b).length > 0 && (
        <div className="gl-pane gl-pane--contact gl-glass">
          <ContactList basics={b} layout="stack" className="gl-contact" />
        </div>
      )}
    </header>
  )

  const blocks = sectionsToBlocks(main, {
    heading,
    summary: (s) => <RichParagraphs className="gl-summary" text={s.content} />,
    entry: (e: EntryView) => compactEntry(e) ?? <DefaultEntry entry={e} variant="main" />,
    whole: (s) => compactWhole(s, 'gl-compact'),
    wrap: card,
  }).map((bl) => (bl.gap === 'entry' ? { ...bl, gap: 'none' as const } : bl))

  return (
    <PageLayout
      header={header}
      main={blocks}
      page={({ header, main }) => (
        <div className="gl-page" style={vars}>
          <span className="gl-blob gl-blob--a" aria-hidden="true" />
          <span className="gl-blob gl-blob--b" aria-hidden="true" />
          <span className="gl-blob gl-blob--c" aria-hidden="true" />
          {header}
          <div className="gl-body">{main}</div>
        </div>
      )}
    />
  )
}
