/**
 * Neo-Brutalism — raw and loud, never fragile. Every structure is a flat box with a thick black
 * border and a hard black offset shadow: a yellow header card, label-tag headings in the accent,
 * date stamps, and a side column card for contact and skills. Monospace details, heavy grotesk
 * headings, primary colours on off-white. Main column first in the DOM.
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
import './neobrutalism.css'

export const meta: TemplateMeta = {
  id: 'neobrutalism',
  name: 'Neo-Brutalism',
  description: 'Thick black borders, harsh offset shadows and high-contrast primary colours on raw, unpolished boxes.',
  tags: ['Creative', 'Two-column', 'Photo'],
  order: 300,
  supportsPhoto: true,
  columns: 2,
  defaultFont: 'plex',
  defaultAccent: '#ff5a36',
  sideKinds: ['skills', 'languages', 'certifications', 'awards', 'interests', 'references'],
  headingCase: 'upper',
  gaps: { entry: 11, section: 17 },
}

function SideSkill({ e }: { e: EntryView }) {
  return (
    <div className="rf-entry rf-entry--skills rf-entry--side rf-skill nb-skill">
      {e.title && <div className="rf-skill__name">{e.title}</div>}
      {e.level > 0 && <LevelSegments level={e.level} label={e.levelLabel} className="nb-skill__bar" height="0.55em" gap="0.15em" />}
      {e.keywords.length > 0 && <div className="rf-skill__keywords">{e.keywords.join(', ')}</div>}
    </div>
  )
}

const mainHeading = (s: SectionView) => (
  <h2 className="nb-h">
    <span>{s.title}</span>
  </h2>
)
const sideHeading = (s: SectionView | string) => <h3 className="nb-sh">{typeof s === 'string' ? s : s.title}</h3>

function sideEntry(e: EntryView): ReactNode {
  if (e.kind === 'skills') return <SideSkill e={e} />
  return <DefaultEntry entry={e} variant="side" />
}

export default function NeoBrutalism({ data, design, main, side }: TemplateProps) {
  const b = data.basics
  const vars = { '--nb-yellow': '#ffd93d', '--nb-blue': '#4d7cfe', '--nb-ink': '#0a0a0a', '--nb-paper': '#fbf7ee' } as CSSProperties

  const header = (
    <header className="nb-header">
      {hasPhoto(b, design) && <Photo basics={b} size="27mm" shape="square" className="nb-photo" />}
      <div className="nb-header__text">
        <h1 className="nb-name">{displayName(b)}</h1>
        {b.title.trim() && <div className="nb-title">{b.title}</div>}
      </div>
    </header>
  )

  const mainBlocks = sectionsToBlocks(main, {
    heading: mainHeading,
    summary: (s) => <RichParagraphs className="nb-summary" text={s.content} />,
    entry: (e) => <DefaultEntry entry={e} variant="main" marker="square" />,
  })

  const sideBlocks: Block[] = []
  if (contactEntries(b).length) {
    sideBlocks.push({ key: 'contact', gap: 'section', letter: true, node: <>{sideHeading('Contact')}<ContactList basics={b} layout="stack" className="nb-contact" /></> })
  }
  sideBlocks.push(...sectionsToBlocks(side, { heading: sideHeading, entry: sideEntry, whole: (s) => (s.kind === 'interests' ? inlineWhole(s, 'nb-inline') : undefined) }))

  return (
    <PageLayout
      header={header}
      main={mainBlocks}
      side={sideBlocks}
      page={({ header, main, side }) => (
        <div className="nb-page" style={vars}>
          {header}
          <div className="nb-cols">
            <div className="nb-main">{main}</div>
            <aside className="nb-side">{side}</aside>
          </div>
        </div>
      )}
    />
  )
}
