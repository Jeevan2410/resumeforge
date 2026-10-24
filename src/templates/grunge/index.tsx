/**
 * Grunge — a scrapbook. On a grainy recycled-paper page with an ink splatter, the header is a tilted
 * card pinned with masking tape, and every section is its own torn scrap of paper: off-white, kraft
 * and ruled grey in turn, pushed left and right of centre so the page zigzags, each with a strip of
 * tape on top, a ripped bottom edge and a heading stamped on a brush mark. The texture is decorative;
 * the words stay dark, plain and selectable. Single column.
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
  displayName,
  hasPhoto,
  sectionsToBlocks,
  type SectionView,
  type TemplateMeta,
  type TemplateProps,
} from '../shared'
import './grunge.css'

export const meta: TemplateMeta = {
  id: 'grunge',
  name: 'Grunge',
  description: 'A scrapbook: every section on its own torn paper scrap with masking tape, zigzagging down a grainy page with brush-stamped headings.',
  tags: ['Creative', 'Photo'],
  order: 310,
  collection: 'style',
  supportsPhoto: true,
  columns: 1,
  defaultFont: 'plex',
  defaultAccent: '#9a4a2c',
  headingCase: 'upper',
  gaps: { entry: 10, section: 15 },
}

/** Paper grain + a few stains for the whole page (decorative). */
function Grain() {
  return (
    <svg className="gr-grain" aria-hidden="true">
      <filter id="gr-noise">
        <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" stitchTiles="stitch" />
        <feColorMatrix values="0 0 0 0 0.25  0 0 0 0 0.2  0 0 0 0 0.14  0 0 0 0.55 0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#gr-noise)" />
    </svg>
  )
}

/** Rough brush stroke (used under the name and behind headings). */
const Brush = ({ className }: { className: string }) => (
  <svg className={className} viewBox="0 0 300 30" preserveAspectRatio="none" aria-hidden="true">
    <path d="M4 12C40 6 90 9 140 7S240 4 296 9L292 13L298 17C250 20 200 18 150 22S60 24 8 22L12 18L2 16Z" />
    <path className="gr-brush__fray" d="M20 25C60 27 110 25 160 27M30 5C80 3 140 4 200 2" />
  </svg>
)

const Splatter = () => (
  <svg className="gr-splat" viewBox="0 0 100 100" aria-hidden="true">
    <circle cx="50" cy="50" r="15" />
    <circle cx="72" cy="38" r="5" />
    <circle cx="30" cy="70" r="6" />
    <circle cx="80" cy="66" r="3" />
    <circle cx="22" cy="34" r="3.5" />
    <circle cx="60" cy="82" r="2.5" />
    <circle cx="88" cy="48" r="1.8" />
    <circle cx="40" cy="20" r="2" />
    <path d="M50 50L92 30M50 50L14 86M50 50L70 92" strokeWidth="2.5" />
  </svg>
)

const heading = (s: SectionView) => (
  <h2 className="gr-h">
    <Brush className="gr-h__brush" />
    <span className="gr-h__text">{s.title}</span>
  </h2>
)

export default function Grunge({ data, design, main }: TemplateProps) {
  const b = data.basics
  const vars = { '--gr-paper': '#ebe4d6', '--gr-ink': '#24211d', '--gr-olive': '#5c5f43', '--gr-tape': 'rgb(214 200 160 / 0.82)' } as CSSProperties

  const header = (
    <header className="gr-header">
      <span className="gr-tape gr-tape--l" aria-hidden="true" />
      <span className="gr-tape gr-tape--r" aria-hidden="true" />
      {hasPhoto(b, design) && <Photo basics={b} size="26mm" shape="square" className="gr-photo" />}
      <div className="gr-header__text">
        <h1 className="gr-name">{displayName(b)}</h1>
        <Brush className="gr-name__brush" />
        {b.title.trim() && <div className="gr-title">{b.title}</div>}
        <ContactList basics={b} layout="inline" className="gr-contact" iconSize="0.9em" />
      </div>
    </header>
  )

  const paper = new Map(main.map((s, i) => [s.id, i % 3]))
  /** One paper scrap per section: its blocks touch, tape on the first, a torn edge under the last. */
  const scrap = (node: ReactNode, info: { section: SectionView; first: boolean; last: boolean }) => (
    <div className={`gr-scrap gr-scrap--${paper.get(info.section.id) ?? 0}${info.first ? ' gr-scrap--first' : ''}${info.last ? ' gr-scrap--last' : ''}`}>
      {info.first && <span className="gr-scrap__tape" aria-hidden="true" />}
      {node}
    </div>
  )

  const blocks = sectionsToBlocks(main, {
    heading,
    summary: (s) => <RichParagraphs className="gr-summary" text={s.content} />,
    entry: (e) => compactEntry(e) ?? <DefaultEntry entry={e} variant="main" marker="dash" />,
    whole: (s) => compactWhole(s, 'gr-compact'),
    wrap: scrap,
  }).map((bl) => (bl.gap === 'entry' ? { ...bl, gap: 'none' as const } : bl))

  return (
    <PageLayout
      header={header}
      main={blocks}
      page={({ index, header, main }) => (
        <div className="gr-page" style={vars}>
          <Grain />
          {index === 0 && <Splatter />}
          <div className="gr-body">
            {header}
            {main}
          </div>
        </div>
      )}
    />
  )
}
