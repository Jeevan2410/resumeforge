/**
 * Art Deco — a black header band crowned by a stepped gold sunburst, a tracked uppercase display name
 * and gold double rules; the body sits inside a double gold frame with a main column and a slim side
 * column split by a double hairline. Headings carry a small ziggurat mark. Gold (the accent) is only
 * used for ornament and headings; body text stays near-black on white. Main column first in the DOM.
 */
import type { ReactNode } from 'react'
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
import './artdeco.css'

export const meta: TemplateMeta = {
  id: 'artdeco',
  name: 'Art Deco',
  description: 'A black-and-gold header with a stepped sunburst, sharp geometric frames and tracked capitals over a crisp two-column body.',
  tags: ['Creative', 'Two-column', 'Photo'],
  order: 210,
  collection: 'style',
  supportsPhoto: true,
  columns: 2,
  defaultFont: 'playfair',
  defaultAccent: '#b38b3d',
  sideKinds: ['skills', 'languages', 'certifications', 'awards', 'interests', 'references'],
  headingCase: 'upper',
  gaps: { entry: 10, section: 17 },
}

/** Stepped half-sunburst: rays fanning out of a ziggurat. */
function Sunburst() {
  const rays = Array.from({ length: 13 }, (_, i) => {
    const a = Math.PI + (i * Math.PI) / 12
    return <line key={i} x1={100 + Math.cos(a) * 26} y1={60 + Math.sin(a) * 26} x2={100 + Math.cos(a) * (i % 2 ? 46 : 58)} y2={60 + Math.sin(a) * (i % 2 ? 46 : 58)} />
  })
  return (
    <svg className="ad-sun" viewBox="0 0 200 62" aria-hidden="true">
      <g className="ad-sun__rays">{rays}</g>
      <path className="ad-sun__step" d="M74 60V52H82V44H90V36H110V44H118V52H126V60Z" />
      <path className="ad-sun__arc" d="M66 60A34 34 0 0 1 134 60" />
    </svg>
  )
}

const Ziggurat = () => (
  <svg className="ad-zig" viewBox="0 0 22 12" aria-hidden="true">
    <path d="M0 12V8H4V4H8V0H14V4H18V8H22V12Z" />
  </svg>
)

const mainHeading = (s: SectionView) => (
  <h2 className="ad-h">
    <Ziggurat />
    <span>{s.title}</span>
  </h2>
)
const sideHeading = (s: SectionView | string) => <h3 className="ad-sh">{typeof s === 'string' ? s : s.title}</h3>

function sideEntry(e: EntryView): ReactNode {
  if (e.kind === 'skills') return <DefaultEntry entry={e} variant="side" level="bar" />
  return <DefaultEntry entry={e} variant="side" />
}

export default function ArtDeco({ data, design, main, side }: TemplateProps) {
  const b = data.basics
  const photo = hasPhoto(b, design)

  const header = (
    <header className="ad-header">
      <Sunburst />
      {photo && <Photo basics={b} size="24mm" className="ad-photo" />}
      <h1 className="ad-name">{displayName(b)}</h1>
      {b.title.trim() && (
        <div className="ad-title">
          <span className="ad-title__rule" />
          <span>{b.title}</span>
          <span className="ad-title__rule" />
        </div>
      )}
    </header>
  )

  const mainBlocks = sectionsToBlocks(main, {
    heading: mainHeading,
    summary: (s) => <RichParagraphs className="ad-summary" text={s.content} />,
    entry: (e) => <DefaultEntry entry={e} variant="main" marker="square" />,
  })

  const sideBlocks: Block[] = []
  if (contactEntries(b).length) {
    sideBlocks.push({ key: 'contact', gap: 'section', letter: true, node: <>{sideHeading('Contact')}<ContactList basics={b} layout="stack" className="ad-contact" /></> })
  }
  sideBlocks.push(...sectionsToBlocks(side, { heading: sideHeading, entry: sideEntry, whole: (s) => (s.kind === 'interests' ? inlineWhole(s, 'ad-inline') : undefined) }))

  return (
    <PageLayout
      header={header}
      main={mainBlocks}
      side={sideBlocks}
      page={({ index, header, main, side }) => (
        <div className="ad-page">
          <span className="ad-frame" aria-hidden="true" />
          {header}
          {index > 0 && <div className="ad-cap" aria-hidden="true" />}
          <div className="ad-cols">
            <div className="ad-main">{main}</div>
            <aside className="ad-side">{side}</aside>
          </div>
        </div>
      )}
    />
  )
}
