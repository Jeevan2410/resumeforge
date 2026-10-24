/**
 * Bento grid — content divided into neat, rounded compartments, like a bento box or a product
 * feature page. Page 1 opens with a tile mosaic: a large accent tile with the name, a square tile with
 * the photo or initials, a dark tile with the title and a light tile with the contact details. Below,
 * two columns of separate rounded cards (each section is one card) in alternating tints sit in a
 * light grey tray with even gutters. Main column first in the DOM.
 */
import type { CSSProperties, ReactNode } from 'react'
import {
  ContactList,
  DefaultEntry,
  PageLayout,
  Photo,
  RichParagraphs,
  compactEntry,
  contactEntries,
  displayName,
  hasPhoto,
  initials,
  inlineWhole,
  sectionsToBlocks,
  type Block,
  type EntryView,
  type SectionView,
  type TemplateMeta,
  type TemplateProps,
} from '../shared'
import './bento.css'

export const meta: TemplateMeta = {
  id: 'bento',
  name: 'Bento Grid',
  description: 'A mosaic of rounded tiles for your name, photo, title and contact, then every section in its own neat card across two columns.',
  tags: ['Modern', 'Two-column', 'Photo'],
  order: 380,
  supportsPhoto: true,
  columns: 2,
  defaultFont: 'inter',
  defaultAccent: '#3d5afe',
  sideKinds: ['skills', 'languages', 'certifications', 'awards', 'interests', 'references'],
  headingCase: 'normal',
  gaps: { entry: 10, section: 11 },
}

/** One card per section: the blocks of a section touch and the CSS rounds the outer corners. */
const card = (tint: (s: SectionView) => string) => (node: ReactNode, info: { section: SectionView; first: boolean; last: boolean }) => (
  <div className={`bt-card bt-card--${tint(info.section)}${info.first ? ' bt-card--first' : ''}${info.last ? ' bt-card--last' : ''}`}>{node}</div>
)
const joined = (blocks: Block[]): Block[] => blocks.map((b) => (b.gap === 'entry' ? { ...b, gap: 'none' } : b))

const heading = (s: SectionView | string) => <h2 className="bt-h">{typeof s === 'string' ? s : s.title}</h2>

const sideEntry = (e: EntryView): ReactNode => compactEntry(e) ?? <DefaultEntry entry={e} variant="side" level={e.kind === 'skills' ? 'bar' : undefined} />

export default function Bento({ data, design, main, side }: TemplateProps) {
  const b = data.basics
  const name = displayName(b)
  const vars = { '--bt-tray': '#eef0f4', '--bt-ink': '#14161c', '--bt-dark': '#1b1e27' } as CSSProperties
  const sideTint = new Map(side.map((s, i) => [s.id, i % 2 ? 'white' : 'soft']))

  const header = (
    <header className="bt-mosaic">
      <div className="bt-tile bt-tile--name">
        <span className="bt-tile__label">Résumé</span>
        <h1 className="bt-name">{name}</h1>
      </div>
      <div className="bt-tile bt-tile--face">{hasPhoto(b, design) ? <Photo basics={b} size="30mm" shape="rounded" className="bt-photo" /> : <span className="bt-initials">{initials(name)}</span>}</div>
      <div className="bt-tile bt-tile--title">{b.title.trim() && <div className="bt-title">{b.title}</div>}</div>
      <div className="bt-tile bt-tile--contact">{contactEntries(b).length > 0 && <ContactList basics={b} layout="grid" className="bt-contact" />}</div>
    </header>
  )

  const mainBlocks = joined(
    sectionsToBlocks(main, {
      heading,
      summary: (s) => <RichParagraphs className="bt-summary" text={s.content} />,
      entry: (e) => compactEntry(e) ?? <DefaultEntry entry={e} variant="main" />,
      wrap: card(() => 'white'),
    }),
  )
  const sideBlocks = joined(
    sectionsToBlocks(side, {
      heading,
      entry: sideEntry,
      whole: (s) => (s.kind === 'interests' ? inlineWhole(s, 'bt-inline') : undefined),
      wrap: card((s) => sideTint.get(s.id) ?? 'white'),
    }),
  )

  return (
    <PageLayout
      header={header}
      main={mainBlocks}
      side={sideBlocks}
      page={({ header, main, side }) => (
        <div className="bt-page" style={vars}>
          {header}
          <div className="bt-cols">
            <div className="bt-main">{main}</div>
            <aside className="bt-side">{side}</aside>
          </div>
        </div>
      )}
    />
  )
}
