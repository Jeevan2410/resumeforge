/**
 * Art Nouveau — a full-height left panel shaped like an arched window: the name, photo and contact sit
 * under the arch, the skills and languages below it, and a whiplash vine with leaves and a bloom climbs
 * the panel's right edge as the column divider. The main column on the right carries sprig headings on
 * hairlines. Serif type, italic titles and a sage accent; ornaments are aria-hidden SVG.
 */
import type { ReactNode } from 'react'
import {
  ContactList,
  contactEntries,
  DefaultEntry,
  PageLayout,
  Photo,
  RichParagraphs,
  displayName,
  compactEntry,
  hasPhoto,
  compactWhole,
  sectionsToBlocks,
  type Block,
  type EntryView,
  type SectionView,
  type TemplateMeta,
  type TemplateProps,
} from '../shared'
import './artnouveau.css'

export const meta: TemplateMeta = {
  id: 'artnouveau',
  name: 'Art Nouveau',
  description: 'An arched-window sidebar holding your name and skills, a climbing vine as the column divider and soft serif type on warm paper.',
  tags: ['Creative', 'Two-column', 'Photo'],
  order: 200,
  supportsPhoto: true,
  columns: 2,
  defaultFont: 'garamond',
  defaultAccent: '#55704f',
  sideKinds: ['skills', 'languages', 'interests', 'references'],
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

const sideHeading = (s: SectionView | string) => <h3 className="an-sh">{typeof s === 'string' ? s : s.title}</h3>

const entry = (e: EntryView): ReactNode => compactEntry(e) ?? <DefaultEntry entry={e} variant="main" />
const sideEntry = (e: EntryView): ReactNode => <DefaultEntry entry={e} variant="side" level={e.kind === 'skills' || e.kind === 'languages' ? 'dots' : undefined} />

export default function ArtNouveau({ data, design, main, side }: TemplateProps) {
  const b = data.basics
  const photo = hasPhoto(b, design)

  const header = (
    <header className="an-header">
      {photo && <Photo basics={b} size="30mm" shape="circle" className="an-photo" />}
      <h1 className="an-name">{displayName(b)}</h1>
      {b.title.trim() && <div className="an-title">{b.title}</div>}
      <svg className="an-knot" viewBox="0 0 80 14" aria-hidden="true">
        <path d="M2 7H30M50 7H78M30 7c4-8 16-8 20 0-4 8-16 8-20 0Z" />
      </svg>
    </header>
  )

  const mainBlocks = sectionsToBlocks(main, {
    heading,
    summary: (s) => <RichParagraphs className="an-summary" text={s.content} />,
    entry,
    whole: (s) => compactWhole(s, 'an-compact'),
  })

  const sideBlocks: Block[] = []
  if (contactEntries(b).length) {
    sideBlocks.push({ key: 'contact', gap: 'section', letter: true, node: <>{sideHeading('Contact')}<ContactList basics={b} layout="stack" className="an-contact" iconSize="0.9em" /></> })
  }
  sideBlocks.push(...sectionsToBlocks(side, { heading: sideHeading, entry: sideEntry }))

  return (
    <PageLayout
      header={header}
      main={mainBlocks}
      side={sideBlocks}
      page={({ header, main, side }) => (
        <div className="an-page">
          <aside className="an-side">
            <span className="an-arch" aria-hidden="true" />
            <Vine />
            <div className="an-side__in">
              {header}
              {side}
            </div>
          </aside>
          <div className="an-main">{main}</div>
        </div>
      )}
    />
  )
}
