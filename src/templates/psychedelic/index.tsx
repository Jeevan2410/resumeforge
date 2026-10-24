/**
 * Psychedelic — a concert-poster layout. The top of page 1 is a tall poster: a centred kaleidoscope of
 * conic rays and concentric neon rings with the name in the middle in echoing, stacked-shadow
 * lettering, the title and contact underneath, and a melting drip edge. The body below splits into two
 * equal columns divided by a wavy neon rule; headings sit on wavy underlines. Main first in the DOM.
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
  type EntryView,
  type SectionView,
  type TemplateMeta,
  type TemplateProps,
} from '../shared'
import './psychedelic.css'

export const meta: TemplateMeta = {
  id: 'psychedelic',
  name: 'Psychedelic',
  description: 'A concert-poster top half with a centred kaleidoscope and echoing neon lettering, over two equal columns split by a wavy rule.',
  tags: ['Creative', 'Two-column', 'Photo'],
  order: 290,
  collection: 'style',
  supportsPhoto: true,
  columns: 2,
  sideKinds: ['education', 'skills', 'languages', 'certifications', 'awards', 'interests', 'references'],
  defaultFont: 'poppins',
  defaultAccent: '#8b1fd6',
  headingCase: 'normal',
  gaps: { entry: 9, section: 14 },
}

/** The melting wave that closes the header band (decorative). */
const Drip = () => (
  <svg className="ps-drip" viewBox="0 0 400 24" preserveAspectRatio="none" aria-hidden="true">
    <path d="M0 0H400V8C380 8 372 22 352 22S326 6 304 6 276 18 256 18 230 4 208 4 184 20 160 20 134 6 112 6 88 16 66 16 40 4 22 4 6 12 0 12Z" />
  </svg>
)

const heading = (s: SectionView) => (
  <h2 className="ps-h">
    <span className="ps-h__text">{s.title}</span>
  </h2>
)

export default function Psychedelic({ data, design, main, side }: TemplateProps) {
  const b = data.basics
  const name = displayName(b)
  const vars = { '--ps-pink': '#ff2d95', '--ps-orange': '#ff8a00', '--ps-lime': '#b6e300', '--ps-deep': '#2a0845' } as CSSProperties

  const header = (
    <header className="ps-header">
      <div className="ps-swirl" aria-hidden="true" />
      <div className="ps-header__inner">
        {hasPhoto(b, design) && <Photo basics={b} size="27mm" className="ps-photo" />}
        <div className="ps-header__text">
          <h1 className="ps-name">{name}</h1>
          {b.title.trim() && <div className="ps-title">{b.title}</div>}
        </div>
        <ContactList basics={b} layout="inline" className="ps-contact" iconSize="0.95em" />
      </div>
      <Drip />
    </header>
  )

  const render = {
    heading,
    summary: (s: SectionView) => <RichParagraphs className="ps-summary" text={s.content} />,
    entry: (e: EntryView) => compactEntry(e) ?? <DefaultEntry entry={e} variant="main" />,
    whole: (s: SectionView) => compactWhole(s, 'ps-compact'),
  }
  const mainBlocks = sectionsToBlocks(main, render)
  const sideBlocks = sectionsToBlocks(side, render)

  return (
    <PageLayout
      header={header}
      main={mainBlocks}
      side={sideBlocks}
      page={({ index, header, main, side }) => (
        <div className="ps-page" style={vars}>
          {header}
          {index > 0 && <div className="ps-cap" aria-hidden="true" />}
          <div className="ps-cols">
            <div className="ps-col">{main}</div>
            <svg className="ps-wave" viewBox="0 0 10 400" preserveAspectRatio="none" aria-hidden="true">
              <path d="M5 0C9 25 1 25 5 50S9 75 5 100 1 125 5 150 9 175 5 200 1 225 5 250 9 275 5 300 1 325 5 350 9 375 5 400" />
            </svg>
            <div className="ps-col">{side}</div>
          </div>
        </div>
      )}
    />
  )
}
