/**
 * Grunge — distressed but still a résumé. Warm recycled-paper tone with a grain overlay, strips of
 * masking tape pinning the header, an ink splatter, a typewriter-style name with a rough brush stroke
 * beneath it, and headings stamped on torn brush marks in muted rust and olive. The texture is all
 * decorative SVG behind the text; the words themselves stay dark, plain and selectable. Single column.
 */
import type { CSSProperties } from 'react'
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
  description: 'Distressed paper grain, masking tape and rough brush strokes in muted tones, with raw typewriter-style headings.',
  tags: ['Creative', 'Photo'],
  order: 310,
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

  const blocks = sectionsToBlocks(main, {
    heading,
    summary: (s) => <RichParagraphs className="gr-summary" text={s.content} />,
    entry: (e) => compactEntry(e) ?? <DefaultEntry entry={e} variant="main" marker="dash" />,
    whole: (s) => compactWhole(s, 'gr-compact'),
  })

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
