/**
 * Psychedelic — a kaleidoscope header (conic rays and concentric rings in neon violet, magenta,
 * orange and lime) behind a heavy rounded name echoed by offset neon shadows, wavy neon rules under
 * the headings and a melting wave edge at the foot of the header. The body stays on white with dark
 * text so it prints and parses cleanly. Single column with compact rows for short sections.
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
import './psychedelic.css'

export const meta: TemplateMeta = {
  id: 'psychedelic',
  name: 'Psychedelic',
  description: 'A kaleidoscopic neon header with echoing, fluid lettering and wavy rules over a clean, readable single column.',
  tags: ['Creative', 'Photo'],
  order: 290,
  supportsPhoto: true,
  columns: 1,
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

export default function Psychedelic({ data, design, main }: TemplateProps) {
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
      </div>
      <Drip />
    </header>
  )

  const blocks = sectionsToBlocks(main, {
    heading,
    summary: (s) => <RichParagraphs className="ps-summary" text={s.content} />,
    entry: (e) => compactEntry(e) ?? <DefaultEntry entry={e} variant="main" />,
    whole: (s) => compactWhole(s, 'ps-compact'),
  })

  return (
    <PageLayout
      header={header}
      main={blocks}
      page={({ index, header, main }) => (
        <div className="ps-page" style={vars}>
          {header}
          {index > 0 && <div className="ps-cap" aria-hidden="true" />}
          <div className="ps-body">
            {index === 0 && <ContactList basics={b} layout="inline" className="ps-contact" iconSize="0.95em" />}
            {main}
          </div>
        </div>
      )}
    />
  )
}
