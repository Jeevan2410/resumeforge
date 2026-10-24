/**
 * Maximalism — more is more, with the reading parts kept calm. The header is a dense collage on deep
 * plum: clashing stripes, polka dots, a zigzag band and saturated discs, with the name on a tilted
 * yellow label and the title on a pink one. The side column is a patterned strip with a solid cream
 * card on top for the text; main headings get a zigzag underline that changes colour each section.
 * Main column first in the DOM.
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
import './maximalism.css'

export const meta: TemplateMeta = {
  id: 'maximalism',
  name: 'Maximalism',
  description: 'Dense layered patterns, clashing stripes and dots and saturated colour in the frame, with calm cards for the text.',
  tags: ['Creative', 'Two-column', 'Photo'],
  order: 280,
  supportsPhoto: true,
  columns: 2,
  defaultFont: 'playfair',
  defaultAccent: '#d1005c',
  sideKinds: ['skills', 'languages', 'certifications', 'awards', 'interests', 'references'],
  headingCase: 'normal',
  gaps: { entry: 9, section: 15 },
}

const ZIGS = ['pink', 'orange', 'teal', 'plum'] as const

/** Collage behind the header (decorative). */
function Collage() {
  return (
    <svg className="mx-collage" viewBox="0 0 400 120" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <pattern id="mx-dots" width="10" height="10" patternUnits="userSpaceOnUse">
          <circle cx="5" cy="5" r="2.4" fill="#ffd23f" />
        </pattern>
        <pattern id="mx-stripes" width="12" height="12" patternUnits="userSpaceOnUse" patternTransform="rotate(35)">
          <rect width="6" height="12" fill="#ff6a13" />
        </pattern>
        <pattern id="mx-checks" width="12" height="12" patternUnits="userSpaceOnUse">
          <rect width="6" height="6" fill="#00a6a0" />
          <rect x="6" y="6" width="6" height="6" fill="#00a6a0" />
        </pattern>
      </defs>
      <rect x="250" y="-10" width="170" height="80" fill="url(#mx-stripes)" />
      <circle cx="330" cy="88" r="52" fill="var(--rf-accent)" />
      <circle cx="330" cy="88" r="34" fill="url(#mx-dots)" />
      <rect x="-10" y="86" width="120" height="50" fill="url(#mx-checks)" opacity="0.8" />
      <circle cx="210" cy="10" r="26" fill="#00a6a0" />
      <circle cx="210" cy="10" r="14" fill="#ffd23f" />
      <path d="M150 120L162 104L174 120L186 104L198 120L210 104L222 120L234 104L246 120L258 104L270 120" fill="none" stroke="#ffd23f" strokeWidth="5" />
      <path d="M0 0H70L0 60Z" fill="url(#mx-dots)" />
      <rect x="372" y="20" width="22" height="22" fill="#ffd23f" transform="rotate(20 383 31)" />
    </svg>
  )
}

const sideHeading = (s: SectionView | string) => <h3 className="mx-sh">{typeof s === 'string' ? s : s.title}</h3>

function sideEntry(e: EntryView): ReactNode {
  if (e.kind === 'skills') return <DefaultEntry entry={e} variant="side" level="dots" />
  return <DefaultEntry entry={e} variant="side" />
}

export default function Maximalism({ data, design, main, side }: TemplateProps) {
  const b = data.basics
  const zig = new Map(main.map((s, i) => [s.id, ZIGS[i % ZIGS.length]]))
  const vars = { '--mx-plum': '#3d1462', '--mx-orange': '#ff6a13', '--mx-teal': '#00a6a0', '--mx-yellow': '#ffd23f', '--mx-cream': '#fff6df' } as CSSProperties

  const header = (
    <header className="mx-header">
      <Collage />
      {hasPhoto(b, design) && <Photo basics={b} size="26mm" className="mx-photo" />}
      <div className="mx-header__text">
        <h1 className="mx-name">
          <span>{displayName(b)}</span>
        </h1>
        {b.title.trim() && <div className="mx-title">{b.title}</div>}
      </div>
    </header>
  )

  const mainBlocks = sectionsToBlocks(main, {
    heading: (s) => (
      <h2 className={`mx-h mx-h--${zig.get(s.id) ?? 'pink'}`}>
        <span>{s.title}</span>
      </h2>
    ),
    summary: (s) => <RichParagraphs className="mx-summary" text={s.content} />,
    entry: (e) => <DefaultEntry entry={e} variant="main" marker="arrow" />,
  })

  const sideBlocks: Block[] = []
  if (contactEntries(b).length) {
    sideBlocks.push({ key: 'contact', gap: 'section', letter: true, node: <>{sideHeading('Contact')}<ContactList basics={b} layout="stack" className="mx-contact" /></> })
  }
  sideBlocks.push(...sectionsToBlocks(side, { heading: sideHeading, entry: sideEntry, whole: (s) => (s.kind === 'interests' ? inlineWhole(s, 'mx-inline') : undefined) }))

  return (
    <PageLayout
      header={header}
      main={mainBlocks}
      side={sideBlocks}
      page={({ index, header, main, side }) => (
        <div className="mx-page" style={vars}>
          {header}
          {index > 0 && <div className="mx-cap" aria-hidden="true" />}
          <div className="mx-cols">
            <div className="mx-main">{main}</div>
            <aside className="mx-side">
              <div className="mx-card">{side}</div>
            </aside>
          </div>
        </div>
      )}
    />
  )
}
