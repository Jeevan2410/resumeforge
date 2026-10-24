/**
 * Neo-Brutalism — a raw table. Page 1 opens on a black slab with the name in huge yellow capitals and
 * a row of contact "stickers" (each in its own bordered box). Every section below is one full-width
 * table row with a thick black border and a hard offset shadow: a solid colour cell on the left holds
 * the heading (orange, yellow, blue in turn) and the right cell holds the entries. Rows continue
 * across pages. Single column, monospace details.
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
  type Block,
  type EntryView,
  type SectionView,
  type TemplateMeta,
  type TemplateProps,
} from '../shared'
import './neobrutalism.css'

export const meta: TemplateMeta = {
  id: 'neobrutalism',
  name: 'Neo-Brutalism',
  description: 'A raw table: a black name slab, contact stickers and every section as a thick-bordered row with a colour heading cell and a hard shadow.',
  tags: ['Creative', 'Photo'],
  order: 300,
  collection: 'style',
  supportsPhoto: true,
  columns: 1,
  defaultFont: 'plex',
  defaultAccent: '#ff5a36',
  headingCase: 'upper',
  gaps: { entry: 11, section: 14 },
}

const TONES = ['accent', 'yellow', 'blue'] as const

const entry = (e: EntryView): ReactNode => compactEntry(e) ?? <DefaultEntry entry={e} variant="main" marker="square" />

export default function NeoBrutalism({ data, design, main }: TemplateProps) {
  const b = data.basics
  const vars = { '--nb-yellow': '#ffd93d', '--nb-blue': '#4d7cfe', '--nb-ink': '#0a0a0a', '--nb-paper': '#fbf7ee' } as CSSProperties
  const tone = new Map(main.map((s, i) => [s.id, TONES[i % 3]]))

  const header = (
    <header className="nb-header">
      <div className="nb-slab">
        <div className="nb-slab__text">
          <h1 className="nb-name">{displayName(b)}</h1>
          {b.title.trim() && <div className="nb-title">{b.title}</div>}
        </div>
        {hasPhoto(b, design) && <Photo basics={b} size="27mm" shape="square" className="nb-photo" />}
      </div>
      {contactEntries(b).length > 0 && <ContactList basics={b} layout="inline" separator="" className="nb-stickers" itemClassName="nb-sticker" />}
    </header>
  )

  /** One table row per section: the blocks of a section touch and the CSS closes the row's borders. */
  const row = (node: ReactNode, info: { section: SectionView; first: boolean; last: boolean }) => (
    <div className={`nb-row nb-row--${tone.get(info.section.id) ?? 'accent'}${info.first ? ' nb-row--first' : ''}${info.last ? ' nb-row--last' : ''}`}>
      <div className="nb-row__cell">{info.first && <h2 className="nb-h">{info.section.title}</h2>}</div>
      <div className="nb-row__body">{node}</div>
    </div>
  )

  const blocks: Block[] = sectionsToBlocks(main, {
    heading: () => null,
    summary: (s) => <RichParagraphs className="nb-summary" text={s.content} />,
    entry,
    whole: (s) => compactWhole(s, 'nb-compact'),
    wrap: row,
  }).map((bl) => (bl.gap === 'entry' ? { ...bl, gap: 'none' } : bl))

  return (
    <PageLayout
      header={header}
      main={blocks}
      page={({ index, header, main }) => (
        <div className="nb-page" style={vars}>
          {header}
          {index > 0 && <div className="nb-cap" aria-hidden="true" />}
          {main}
        </div>
      )}
    />
  )
}
