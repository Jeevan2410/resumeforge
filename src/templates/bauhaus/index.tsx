/**
 * Bauhaus — form follows function. A header composition of primary shapes (a red circle, a blue
 * square, a yellow triangle and a black bar) beside a heavy geometric-sans name; a light stone side
 * column behind a thick black bar holds contact and skills; every main heading carries one of the three
 * primary shapes in turn. The accent drives the red; blue and yellow are fixed partners. Main column
 * first in the DOM.
 */
import type { CSSProperties, ReactNode } from 'react'
import {
  ContactList,
  DefaultEntry,
  LevelSegments,
  PageLayout,
  Photo,
  RichParagraphs,
  contactEntries,
  displayName,
  hasPhoto,
  inlineWhole,
  sectionsToBlocks,
  type Block,
  type EntryView,
  type SectionView,
  type TemplateMeta,
  type TemplateProps,
} from '../shared'
import './bauhaus.css'

export const meta: TemplateMeta = {
  id: 'bauhaus',
  name: 'Bauhaus',
  description: 'Functional layout built from primary colours and balanced circles, squares and triangles, with heavy geometric type.',
  tags: ['Creative', 'Two-column', 'Photo'],
  order: 230,
  supportsPhoto: true,
  columns: 2,
  defaultFont: 'poppins',
  defaultAccent: '#d7301f',
  sideKinds: ['skills', 'languages', 'certifications', 'awards', 'interests', 'references'],
  headingCase: 'normal',
  gaps: { entry: 9, section: 16 },
}

const SHAPES = ['circle', 'square', 'triangle'] as const

function Shape({ kind }: { kind: (typeof SHAPES)[number] }) {
  return (
    <svg className={`bh-shape bh-shape--${kind}`} viewBox="0 0 10 10" aria-hidden="true">
      {kind === 'circle' && <circle cx="5" cy="5" r="5" />}
      {kind === 'square' && <rect width="10" height="10" />}
      {kind === 'triangle' && <path d="M0 10L5 0L10 10Z" />}
    </svg>
  )
}

/** The header composition (decorative). */
function Composition() {
  return (
    <svg className="bh-comp" viewBox="0 0 120 120" aria-hidden="true">
      <rect className="bh-blue" x="44" y="8" width="64" height="64" />
      <circle className="bh-red" cx="44" cy="70" r="36" />
      <path className="bh-yellow" d="M64 112L94 58L120 112Z" />
      <rect className="bh-black" x="0" y="104" width="120" height="8" />
      <path className="bh-black" d="M10 10H22V60H10Z" />
    </svg>
  )
}

function SideSkill({ e }: { e: EntryView }) {
  return (
    <div className="rf-entry rf-entry--skills rf-entry--side rf-skill bh-skill">
      {e.title && <div className="rf-skill__name">{e.title}</div>}
      {e.level > 0 && <LevelSegments level={e.level} label={e.levelLabel} className="bh-skill__bar" height="0.42em" gap="0.18em" />}
      {e.keywords.length > 0 && <div className="rf-skill__keywords">{e.keywords.join(', ')}</div>}
    </div>
  )
}

const sideHeading = (s: SectionView | string) => <h3 className="bh-sh">{typeof s === 'string' ? s : s.title}</h3>

function sideEntry(e: EntryView): ReactNode {
  if (e.kind === 'skills') return <SideSkill e={e} />
  return <DefaultEntry entry={e} variant="side" />
}

export default function Bauhaus({ data, design, main, side }: TemplateProps) {
  const b = data.basics
  const shapeOf = new Map(main.map((s, i) => [s.id, SHAPES[i % 3]]))
  const vars = { '--bh-blue': '#1d4f91', '--bh-yellow': '#f2b415' } as CSSProperties

  const header = (
    <header className="bh-header">
      <div className="bh-header__text">
        <h1 className="bh-name">{displayName(b)}</h1>
        {b.title.trim() && <div className="bh-title">{b.title}</div>}
      </div>
      {hasPhoto(b, design) ? <Photo basics={b} size="26mm" className="bh-photo" /> : <Composition />}
    </header>
  )

  const mainBlocks = sectionsToBlocks(main, {
    heading: (s) => (
      <h2 className="bh-h">
        <Shape kind={shapeOf.get(s.id) ?? 'circle'} />
        <span>{s.title}</span>
      </h2>
    ),
    summary: (s) => <RichParagraphs className="bh-summary" text={s.content} />,
    entry: (e) => <DefaultEntry entry={e} variant="main" marker="square" />,
  })

  const sideBlocks: Block[] = []
  if (contactEntries(b).length) {
    sideBlocks.push({ key: 'contact', gap: 'section', letter: true, node: <>{sideHeading('Contact')}<ContactList basics={b} layout="stack" className="bh-contact" /></> })
  }
  sideBlocks.push(...sectionsToBlocks(side, { heading: sideHeading, entry: sideEntry, whole: (s) => (s.kind === 'interests' ? inlineWhole(s, 'bh-inline') : undefined) }))

  return (
    <PageLayout
      header={header}
      main={mainBlocks}
      side={sideBlocks}
      page={({ header, main, side }) => (
        <div className="bh-page" style={vars}>
          {header}
          <div className="bh-cols">
            <div className="bh-main">{main}</div>
            <aside className="bh-side">{side}</aside>
          </div>
        </div>
      )}
    />
  )
}
