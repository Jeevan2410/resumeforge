/**
 * Flat Design — solid colour and nothing else: no gradients, no shadows. A full-width accent header
 * with a small two-dimensional desk illustration (monitor, plant, mug) built from flat shapes, solid
 * label-style headings, a pale side column of contact and skills with flat segment bars, and
 * square bullets. Main column first in the DOM.
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
import './flat.css'

export const meta: TemplateMeta = {
  id: 'flat',
  name: 'Flat',
  description: 'Solid colour blocks, a two-dimensional illustration and label headings, with zero gradients or drop shadows.',
  tags: ['Modern', 'Two-column', 'Photo'],
  order: 250,
  supportsPhoto: true,
  columns: 2,
  defaultFont: 'poppins',
  defaultAccent: '#1f7ae0',
  sideKinds: ['skills', 'languages', 'certifications', 'awards', 'interests', 'references'],
  headingCase: 'upper',
  gaps: { entry: 10, section: 17 },
}

/** A flat desk scene: monitor with code lines, a plant and a mug (decorative). */
function Desk() {
  return (
    <svg className="fl-desk" viewBox="0 0 160 100" aria-hidden="true">
      <rect className="fl-c-dark" x="20" y="10" width="92" height="62" rx="4" />
      <rect className="fl-c-screen" x="25" y="15" width="82" height="50" rx="2" />
      <rect className="fl-c-orange" x="31" y="22" width="26" height="5" rx="2.5" />
      <rect className="fl-c-green" x="61" y="22" width="18" height="5" rx="2.5" />
      <rect className="fl-c-pale" x="37" y="32" width="40" height="5" rx="2.5" />
      <rect className="fl-c-red" x="81" y="32" width="14" height="5" rx="2.5" />
      <rect className="fl-c-pale" x="37" y="42" width="22" height="5" rx="2.5" />
      <rect className="fl-c-orange" x="63" y="42" width="30" height="5" rx="2.5" />
      <rect className="fl-c-green" x="31" y="52" width="34" height="5" rx="2.5" />
      <rect className="fl-c-dark" x="58" y="72" width="16" height="12" />
      <rect className="fl-c-dark" x="44" y="84" width="44" height="5" rx="2" />
      <rect className="fl-c-desk" x="0" y="89" width="160" height="11" />
      <path className="fl-c-green" d="M132 58C120 46 120 32 128 24C134 34 136 46 132 58Z" />
      <path className="fl-c-green2" d="M134 58C140 42 150 36 158 36C156 48 146 56 134 58Z" />
      <path className="fl-c-green2" d="M131 60C118 56 110 48 108 40C120 40 128 48 131 60Z" />
      <path className="fl-c-orange" d="M122 60H144L140 89H126Z" />
      <rect className="fl-c-red" x="2" y="68" width="14" height="21" rx="2" />
      <path className="fl-c-red" d="M16 72H20A4 4 0 0 1 20 84H16V80H19A1 1 0 0 0 19 76H16Z" />
    </svg>
  )
}

function SideSkill({ e }: { e: EntryView }) {
  return (
    <div className="rf-entry rf-entry--skills rf-entry--side rf-skill fl-skill">
      {e.title && <div className="rf-skill__name">{e.title}</div>}
      {e.level > 0 && <LevelSegments level={e.level} label={e.levelLabel} className="fl-skill__bar" height="0.4em" gap="0.2em" />}
      {e.keywords.length > 0 && <div className="rf-skill__keywords">{e.keywords.join(', ')}</div>}
    </div>
  )
}

const mainHeading = (s: SectionView) => (
  <h2 className="fl-h">
    <span className="fl-h__tag">{s.title}</span>
  </h2>
)
const sideHeading = (s: SectionView | string) => <h3 className="fl-sh">{typeof s === 'string' ? s : s.title}</h3>

function sideEntry(e: EntryView): ReactNode {
  if (e.kind === 'skills') return <SideSkill e={e} />
  return <DefaultEntry entry={e} variant="side" />
}

export default function Flat({ data, design, main, side }: TemplateProps) {
  const b = data.basics
  const vars = { '--fl-orange': '#f39c32', '--fl-green': '#27ae60', '--fl-red': '#e74c3c' } as CSSProperties

  const header = (
    <header className="fl-header">
      {hasPhoto(b, design) && <Photo basics={b} size="26mm" className="fl-photo" />}
      <div className="fl-header__text">
        <h1 className="fl-name">{displayName(b)}</h1>
        {b.title.trim() && <div className="fl-title">{b.title}</div>}
      </div>
      <Desk />
    </header>
  )

  const mainBlocks = sectionsToBlocks(main, {
    heading: mainHeading,
    summary: (s) => <RichParagraphs className="fl-summary" text={s.content} />,
    entry: (e) => <DefaultEntry entry={e} variant="main" marker="square" />,
  })

  const sideBlocks: Block[] = []
  if (contactEntries(b).length) {
    sideBlocks.push({ key: 'contact', gap: 'section', letter: true, node: <>{sideHeading('Contact')}<ContactList basics={b} layout="stack" className="fl-contact" /></> })
  }
  sideBlocks.push(...sectionsToBlocks(side, { heading: sideHeading, entry: sideEntry, whole: (s) => (s.kind === 'interests' ? inlineWhole(s, 'fl-inline') : undefined) }))

  return (
    <PageLayout
      header={header}
      main={mainBlocks}
      side={sideBlocks}
      page={({ header, main, side }) => (
        <div className="fl-page" style={vars}>
          {header}
          <div className="fl-cols">
            <div className="fl-main">{main}</div>
            <aside className="fl-side">{side}</aside>
          </div>
        </div>
      )}
    />
  )
}
