/**
 * Art Nouveau — single column on warm paper inside an asymmetric frame: a whiplash vine with leaves
 * and a bloom climbs the left edge of every page, a curling flourish hangs from the top-right corner,
 * and section headings end in a small leaf sprig on a hairline. Serif type, italic titles and a sage
 * accent keep it soft; the ornaments are decorative SVG (aria-hidden) so the text stays plain for ATS.
 */
import type { ReactNode } from 'react'
import {
  ContactList,
  DefaultEntry,
  PageLayout,
  Photo,
  RichParagraphs,
  displayName,
  compactEntry,
  hasPhoto,
  compactWhole,
  sectionsToBlocks,
  type EntryView,
  type SectionView,
  type TemplateMeta,
  type TemplateProps,
} from '../shared'
import './artnouveau.css'

export const meta: TemplateMeta = {
  id: 'artnouveau',
  name: 'Art Nouveau',
  description: 'Fluid vine and floral ornaments in an elegant asymmetrical frame, with soft serif type on warm paper.',
  tags: ['Creative', 'Classic', 'Photo'],
  order: 200,
  supportsPhoto: true,
  columns: 1,
  defaultFont: 'garamond',
  defaultAccent: '#55704f',
  headingCase: 'normal',
  gaps: { entry: 9, section: 14 },
}

const leaf = (x: number, y: number, rot: number, s = 1) => <path key={`${x}-${y}`} d="M0 0C7-9 19-9 26 0C19 6 7 6 0 0Z" transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`} />

/** The climbing vine on the left edge (one per page). */
function Vine() {
  return (
    <svg className="an-vine" viewBox="0 0 60 1100" preserveAspectRatio="xMidYMax meet" aria-hidden="true">
      <path className="an-vine__stem" d="M30 1100C8 1010 52 930 30 840S8 680 30 600 52 440 30 360 10 210 30 130" />
      <path className="an-vine__tendril" d="M30 840c14-18 26-12 24 0s-12 12-14 4M30 600c-14-18-26-12-24 0s12 12 14 4M30 360c14-18 26-12 24 0s-12 12-14 4" />
      <g className="an-vine__leaves">
        {[leaf(30, 1010, -140), leaf(30, 930, -40, 0.9), leaf(30, 760, -150, 0.8), leaf(30, 690, -30), leaf(30, 520, -140, 0.9), leaf(30, 450, -45, 0.8), leaf(30, 280, -150), leaf(30, 210, -35, 0.85)]}
      </g>
      <g className="an-vine__bloom" transform="translate(30 104)">
        {[0, 72, 144, 216, 288].map((r) => (
          <ellipse key={r} cx="0" cy="-13" rx="7.5" ry="14" transform={`rotate(${r})`} />
        ))}
        <circle className="an-vine__heart" r="5.5" />
      </g>
    </svg>
  )
}

/** Curling flourish hanging from the top-right corner (page 1 only, behind the header). */
function Flourish() {
  return (
    <svg className="an-flourish" viewBox="0 0 220 120" aria-hidden="true">
      <path d="M220 4C176 4 162 30 128 34S70 18 52 40c-14 17-2 40 16 36s16-24 4-28-14 8-8 12" />
      <path d="M220 24c-30 6-40 32-66 42s-48 2-60 18c-8 12 2 26 14 22" />
      {leaf(150, 36, 160, 0.8)}
      {leaf(104, 68, 200, 0.7)}
    </svg>
  )
}

const Sprig = () => (
  <svg className="an-sprig" viewBox="0 0 40 16" aria-hidden="true">
    <path d="M2 8C12 8 22 8 38 8" />
    <path className="an-sprig__leaf" d="M14 8C18 1 25 1 28 3C25 8 19 9 14 8ZM22 8C26 14 32 14 35 12C32 8 27 7 22 8Z" />
  </svg>
)

const heading = (s: SectionView) => (
  <h2 className="an-h">
    <span className="an-h__text">{s.title}</span>
    <span className="an-h__rule" />
    <Sprig />
  </h2>
)

const entry = (e: EntryView): ReactNode => compactEntry(e) ?? <DefaultEntry entry={e} variant="main" />

export default function ArtNouveau({ data, design, main }: TemplateProps) {
  const b = data.basics
  const photo = hasPhoto(b, design)

  const header = (
    <header className="an-header">
      <Flourish />
      {photo && <Photo basics={b} size="27mm" className="an-photo" />}
      <div className="an-header__text">
        <h1 className="an-name">{displayName(b)}</h1>
        {b.title.trim() && <div className="an-title">{b.title}</div>}
        <ContactList basics={b} layout="inline" className="an-contact" iconSize="0.9em" />
      </div>
    </header>
  )

  const blocks = sectionsToBlocks(main, {
    heading,
    summary: (s) => <RichParagraphs className="an-summary" text={s.content} />,
    entry,
    whole: (s) => compactWhole(s, 'an-compact'),
  })

  return (
    <PageLayout
      header={header}
      main={blocks}
      page={({ header, main }) => (
        <div className="an-page">
          <span className="an-frame" aria-hidden="true" />
          <Vine />
          <div className="an-body">
            {header}
            {main}
          </div>
        </div>
      )}
    />
  )
}
