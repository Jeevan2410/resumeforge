/**
 * Glassmorphism — frosted panels over a soft, blurred colour field. Three large blurred blobs (the
 * accent plus a pink and a mint) sit behind translucent white "glass" cards with a bright hairline
 * edge and a faint top highlight: one for the header, one for the side column, one for the main
 * column. The cards are mostly opaque, so text contrast holds in print even where backdrop blur is not
 * supported. Main column first in the DOM.
 */
import type { CSSProperties, ReactNode } from 'react'
import {
  ContactList,
  DefaultEntry,
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
import './glassmorphism.css'

export const meta: TemplateMeta = {
  id: 'glassmorphism',
  name: 'Glassmorphism',
  description: 'Translucent frosted-glass cards with soft highlights floating over a blurred colour field.',
  tags: ['Modern', 'Two-column', 'Photo'],
  order: 330,
  supportsPhoto: true,
  columns: 2,
  defaultFont: 'inter',
  defaultAccent: '#1769aa',
  sideKinds: ['skills', 'languages', 'certifications', 'awards', 'interests', 'references'],
  headingCase: 'upper',
  gaps: { entry: 10, section: 17 },
}

const mainHeading = (s: SectionView) => <h2 className="gl-h">{s.title}</h2>
const sideHeading = (s: SectionView | string) => <h3 className="gl-sh">{typeof s === 'string' ? s : s.title}</h3>

function sideEntry(e: EntryView): ReactNode {
  if (e.kind === 'skills') return <DefaultEntry entry={e} variant="side" level="bar" />
  return <DefaultEntry entry={e} variant="side" />
}

export default function Glassmorphism({ data, design, main, side }: TemplateProps) {
  const b = data.basics
  const vars = { '--gl-pink': '#f4a6c8', '--gl-mint': '#93e1d0', '--gl-ink': '#0f1f33' } as CSSProperties

  const header = (
    <header className="gl-header gl-glass">
      {hasPhoto(b, design) && <Photo basics={b} size="25mm" className="gl-photo" />}
      <div className="gl-header__text">
        <h1 className="gl-name">{displayName(b)}</h1>
        {b.title.trim() && <div className="gl-title">{b.title}</div>}
      </div>
    </header>
  )

  const mainBlocks = sectionsToBlocks(main, {
    heading: mainHeading,
    summary: (s) => <RichParagraphs className="gl-summary" text={s.content} />,
    entry: (e) => <DefaultEntry entry={e} variant="main" />,
  })

  const sideBlocks: Block[] = []
  if (contactEntries(b).length) {
    sideBlocks.push({ key: 'contact', gap: 'section', letter: true, node: <>{sideHeading('Contact')}<ContactList basics={b} layout="stack" className="gl-contact" /></> })
  }
  sideBlocks.push(...sectionsToBlocks(side, { heading: sideHeading, entry: sideEntry, whole: (s) => (s.kind === 'interests' ? inlineWhole(s, 'gl-inline') : undefined) }))

  return (
    <PageLayout
      header={header}
      main={mainBlocks}
      side={sideBlocks}
      page={({ header, main, side }) => (
        <div className="gl-page" style={vars}>
          <span className="gl-blob gl-blob--a" aria-hidden="true" />
          <span className="gl-blob gl-blob--b" aria-hidden="true" />
          <span className="gl-blob gl-blob--c" aria-hidden="true" />
          {header}
          <div className="gl-cols">
            <div className="gl-main gl-glass">{main}</div>
            <aside className="gl-side gl-glass">{side}</aside>
          </div>
        </div>
      )}
    />
  )
}
