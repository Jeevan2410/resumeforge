/**
 * Bauhaus — form follows function. Page 1 opens with a modular tile grid: the heavy lowercase name in
 * a wide white tile, a red tile with a white circle (or the photo), a blue tile with the job title and a
 * yellow tile holding the contact details. Below it one column runs on a strict rhythm: every section
 * heading is a solid colour block (red, blue, yellow in turn) on a thick black rule. The accent drives
 * the red; blue and yellow are fixed partners.
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
  type TemplateMeta,
  type TemplateProps,
} from '../shared'
import './bauhaus.css'

export const meta: TemplateMeta = {
  id: 'bauhaus',
  name: 'Bauhaus',
  description: 'A modular header grid of red, blue and yellow tiles, heavy geometric type and colour-block section headings on thick black rules.',
  tags: ['Creative', 'Photo'],
  order: 230,
  collection: 'style',
  supportsPhoto: true,
  columns: 1,
  defaultFont: 'poppins',
  defaultAccent: '#d7301f',
  headingCase: 'normal',
  gaps: { entry: 9, section: 16 },
}

const TONES = ['red', 'blue', 'yellow'] as const

const entry = (e: EntryView): ReactNode => compactEntry(e) ?? <DefaultEntry entry={e} variant="main" marker="square" />

export default function Bauhaus({ data, design, main }: TemplateProps) {
  const b = data.basics
  const toneOf = new Map(main.map((s, i) => [s.id, TONES[i % 3]]))
  const vars = { '--bh-blue': '#1d4f91', '--bh-yellow': '#f2b415' } as CSSProperties

  const header = (
    <header className="bh-grid">
      <div className="bh-tile bh-tile--name">
        <h1 className="bh-name">{displayName(b)}</h1>
      </div>
      <div className="bh-tile bh-tile--red">
        {hasPhoto(b, design) ? (
          <Photo basics={b} size="30mm" shape="circle" className="bh-photo" />
        ) : (
          <svg className="bh-mark" viewBox="0 0 100 100" aria-hidden="true">
            <circle cx="50" cy="50" r="34" />
            <path d="M16 96H84" />
          </svg>
        )}
      </div>
      <div className="bh-tile bh-tile--blue">
        <svg className="bh-tri" viewBox="0 0 10 10" aria-hidden="true">
          <path d="M0 10L5 0L10 10Z" />
        </svg>
        {b.title.trim() && <div className="bh-title">{b.title}</div>}
      </div>
      <div className="bh-tile bh-tile--yellow">{contactEntries(b).length > 0 && <ContactList basics={b} layout="grid" className="bh-contact" />}</div>
    </header>
  )

  const blocks = sectionsToBlocks(main, {
    heading: (s) => (
      <h2 className={`bh-h bh-h--${toneOf.get(s.id) ?? 'red'}`}>
        <span className="bh-h__block">{s.title}</span>
        <span className="bh-h__rule" />
      </h2>
    ),
    summary: (s) => <RichParagraphs className="bh-summary" text={s.content} />,
    entry,
    whole: (s) => compactWhole(s, 'bh-compact'),
  })

  return (
    <PageLayout
      header={header}
      main={blocks}
      page={({ index, header, main }) => (
        <div className="bh-page" style={vars}>
          {header}
          {index > 0 && <div className="bh-cap" aria-hidden="true" />}
          <div className="bh-body">{main}</div>
        </div>
      )}
    />
  )
}
