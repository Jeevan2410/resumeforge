/**
 * Japandi — Japanese restraint with Scandinavian warmth. Warm undyed paper, soft charcoal ink and a
 * single muted clay accent. The page is laid out like an annotated book: a wide text column on the
 * left and a narrow margin on the right where each entry's dates and place sit as quiet side notes,
 * level with the entry. Page 1 opens with a light, airy name, a short brush stroke and a small square
 * seal stamped with the initials; the contact details sit in the margin beside it. Single column.
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
  displayName,
  hasPhoto,
  initials,
  sectionsToBlocks,
  type EntryView,
  type SectionView,
  type TemplateMeta,
  type TemplateProps,
} from '../shared'
import './japandi.css'

export const meta: TemplateMeta = {
  id: 'japandi',
  name: 'Japandi',
  description: 'Muted, warm neutrals and airy type laid out like an annotated book, with dates as quiet margin notes and a small clay seal.',
  tags: ['Classic', 'Modern', 'Photo'],
  order: 390,
  collection: 'style',
  supportsPhoto: true,
  columns: 1,
  defaultFont: 'raleway',
  defaultAccent: '#a65f3e',
  headingCase: 'upper',
  gaps: { entry: 11, section: 16 },
}

/** Margin notes for a full entry: dates, then place. Compact lines carry their own date. */
function note(e: EntryView | undefined): ReactNode {
  if (!e || compactEntry(e)) return null
  if (!e.date && !e.location) return null
  return (
    <>
      {e.date && <span className="jp-note__date">{e.date}</span>}
      {e.location && <span className="jp-note__place">{e.location}</span>}
    </>
  )
}

function row(node: ReactNode, { section, entry, first }: { section: SectionView; entry?: EntryView; first: boolean }) {
  const n = note(entry)
  return (
    <div className={n ? 'jp-row jp-row--noted' : 'jp-row'}>
      <div className="jp-row__text">
        {first && (
          <h2 className="jp-h">
            <span>{section.title}</span>
          </h2>
        )}
        {node}
      </div>
      <div className="jp-row__note">
        {first && <span className="jp-note__gap" />}
        {n}
      </div>
    </div>
  )
}

export default function Japandi({ data, design, main }: TemplateProps) {
  const b = data.basics
  const name = displayName(b)
  const vars = { '--jp-paper': '#f5f1ea', '--jp-ink': '#2c2a26', '--jp-soft': '#8a8379', '--jp-line': '#d9d2c5' } as CSSProperties

  const header = (
    <header className="jp-header">
      <div className="jp-row">
        <div className="jp-row__text jp-id">
          {hasPhoto(b, design) && <Photo basics={b} size="24mm" shape="square" className="jp-photo" />}
          <h1 className="jp-name">{name}</h1>
          <svg className="jp-brush" viewBox="0 0 120 10" aria-hidden="true">
            <path d="M2 6C20 3 44 2 70 3.5S108 6 118 4.5C110 7.5 80 8.5 56 7.4S14 7.8 2 6Z" />
          </svg>
          {b.title.trim() && <div className="jp-title">{b.title}</div>}
        </div>
        <div className="jp-row__note jp-id__note">
          <span className="jp-seal" aria-hidden="true">
            {initials(name)}
          </span>
          <ContactList basics={b} layout="stack" showIcons={false} className="jp-contact" />
        </div>
      </div>
    </header>
  )

  const blocks = sectionsToBlocks(main, {
    heading: () => null,
    summary: (s) => <RichParagraphs className="jp-summary" text={s.content} />,
    entry: (e) => compactEntry(e) ?? <DefaultEntry entry={e} variant="main" marker="dash" />,
    whole: (s) => compactWhole(s, 'jp-compact'),
    wrap: row,
  })

  return (
    <PageLayout
      header={header}
      main={blocks}
      page={({ header, main }) => (
        <div className="jp-page" style={vars}>
          <span className="jp-rule" aria-hidden="true" />
          {header}
          {main}
        </div>
      )}
    />
  )
}
