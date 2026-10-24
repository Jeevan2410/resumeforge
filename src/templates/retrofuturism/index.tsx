/**
 * Retro-Futurism — the space age as imagined in 1960. Cream paper in faded technicolor: a teal header
 * with a sweeping boomerang curve, an orbiting planet and atomic starbursts in mustard and coral, a
 * side column shaped like a rounded console panel, and headings that launch from a small starburst.
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
import './retrofuturism.css'

export const meta: TemplateMeta = {
  id: 'retrofuturism',
  name: 'Retro-Futurism',
  description: 'Mid-century space-age curves, orbits and atomic starbursts in faded technicolor on cream paper.',
  tags: ['Creative', 'Two-column', 'Photo'],
  order: 370,
  supportsPhoto: true,
  columns: 2,
  defaultFont: 'montserrat',
  defaultAccent: '#2f8f89',
  sideKinds: ['skills', 'languages', 'certifications', 'awards', 'interests', 'references'],
  headingCase: 'normal',
  gaps: { entry: 10, section: 16 },
}

/** Four-point "atomic" starburst with thin rays between the points. */
function Star({ x, y, r, className }: { x: number; y: number; r: number; className: string }) {
  const k = r * 0.22
  return (
    <g className={className} transform={`translate(${x} ${y})`}>
      <path d={`M0 ${-r}L${k} ${-k}L${r} 0L${k} ${k}L0 ${r}L${-k} ${k}L${-r} 0L${-k} ${-k}Z`} />
      <path className="rf2-ray" d={`M${-r * 0.6} ${-r * 0.6}L${r * 0.6} ${r * 0.6}M${r * 0.6} ${-r * 0.6}L${-r * 0.6} ${r * 0.6}`} />
    </g>
  )
}

function Space() {
  return (
    <svg className="rf2-space" viewBox="0 0 400 110" preserveAspectRatio="xMaxYMid slice" aria-hidden="true">
      <path className="rf2-boomerang" d="M210 110C240 40 320 10 410 18V60C340 52 280 70 250 110Z" />
      <ellipse className="rf2-orbit" cx="330" cy="52" rx="46" ry="14" transform="rotate(-18 330 52)" />
      <circle className="rf2-planet" cx="330" cy="52" r="15" />
      <path className="rf2-orbit rf2-orbit--front" d="M286 66A46 14 -18 0 0 374 38" transform="rotate(0)" />
      <circle className="rf2-moon" cx="372" cy="40" r="3.5" />
      <Star x={262} y={26} r={11} className="rf2-star rf2-star--sun" />
      <Star x={388} y={92} r={8} className="rf2-star rf2-star--coral" />
      <Star x={232} y={70} r={5} className="rf2-star rf2-star--cream" />
      <circle className="rf2-dot" cx="298" cy="94" r="2" />
      <circle className="rf2-dot" cx="214" cy="18" r="1.6" />
      <circle className="rf2-dot" cx="360" cy="10" r="1.8" />
    </svg>
  )
}

const StarMark = () => (
  <svg className="rf2-mark" viewBox="-10 -10 20 20" aria-hidden="true">
    <path d="M0 -9L2 -2L9 0L2 2L0 9L-2 2L-9 0L-2 -2Z" />
  </svg>
)

const mainHeading = (s: SectionView) => (
  <h2 className="rf2-h">
    <StarMark />
    <span>{s.title}</span>
  </h2>
)
const sideHeading = (s: SectionView | string) => <h3 className="rf2-sh">{typeof s === 'string' ? s : s.title}</h3>

function sideEntry(e: EntryView): ReactNode {
  if (e.kind === 'skills') return <DefaultEntry entry={e} variant="side" level="bar" />
  return <DefaultEntry entry={e} variant="side" />
}

export default function RetroFuturism({ data, design, main, side }: TemplateProps) {
  const b = data.basics
  const vars = { '--rf2-cream': '#f8f1e2', '--rf2-mustard': '#e2a93b', '--rf2-coral': '#e2674c', '--rf2-ink': '#24302f' } as CSSProperties

  const header = (
    <header className="rf2-header">
      <Space />
      {hasPhoto(b, design) && <Photo basics={b} size="25mm" className="rf2-photo" />}
      <div className="rf2-header__text">
        <h1 className="rf2-name">{displayName(b)}</h1>
        {b.title.trim() && <div className="rf2-title">{b.title}</div>}
      </div>
    </header>
  )

  const mainBlocks = sectionsToBlocks(main, {
    heading: mainHeading,
    summary: (s) => <RichParagraphs className="rf2-summary" text={s.content} />,
    entry: (e) => <DefaultEntry entry={e} variant="main" />,
  })

  const sideBlocks: Block[] = []
  if (contactEntries(b).length) {
    sideBlocks.push({ key: 'contact', gap: 'section', letter: true, node: <>{sideHeading('Contact')}<ContactList basics={b} layout="stack" className="rf2-contact" /></> })
  }
  sideBlocks.push(...sectionsToBlocks(side, { heading: sideHeading, entry: sideEntry, whole: (s) => (s.kind === 'interests' ? inlineWhole(s, 'rf2-inline') : undefined) }))

  return (
    <PageLayout
      header={header}
      main={mainBlocks}
      side={sideBlocks}
      page={({ index, header, main, side }) => (
        <div className="rf2-page" style={vars}>
          {header}
          {index > 0 && <div className="rf2-cap" aria-hidden="true" />}
          <div className="rf2-cols">
            <div className="rf2-main">{main}</div>
            <aside className="rf2-side">{side}</aside>
          </div>
        </div>
      )}
    />
  )
}
