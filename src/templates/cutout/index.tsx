/**
 * Cut-out — colourful graphic art in the spirit of paper cut-outs. Every page is a vivid colour field
 * scattered with hand-cut paper shapes (leaves, stars, waves, dots) in yellow, pink, green, orange and
 * navy; the résumé itself sits on a white paper sheet laid on top. Page 1 opens with the name in big
 * letters that change colour one by one, the title on a black paper tag and the contact line; each
 * section heading is a torn paper label in the next colour of the palette. Single column; all text is
 * real text on white.
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
import './cutout.css'

export const meta: TemplateMeta = {
  id: 'cutout',
  name: 'Cut-out',
  description: 'Colourful graphic art: hand-cut paper shapes on a vivid page, a white paper sheet, multicoloured lettering and torn paper section labels.',
  tags: ['Creative', 'Photo'],
  order: 560,
  collection: 'style',
  supportsPhoto: true,
  columns: 1,
  defaultFont: 'poppins',
  defaultAccent: '#2b45d4',
  headingCase: 'normal',
  gaps: { entry: 9, section: 14 },
}

const TONES = ['pink', 'yellow', 'green', 'orange', 'navy'] as const

/** Paper shapes glued around the sheet; they overlap its edges but stay out of the text area. */
const Shapes = () => (
  <svg className="co-shapes" viewBox="0 0 210 297" preserveAspectRatio="none" aria-hidden="true">
    {/* top-left: big leaf and sun */}
    <path className="co-pink" d="M-8 24C0 8 14-2 38-6 32 8 18 18-8 24Z" />
    <circle className="co-yellow" cx="8" cy="40" r="6" />
    <path className="co-green" d="M30 2c4 6 12 8 20 6-2 6-12 10-20-6z" />
    {/* top-right: star and dot */}
    <path className="co-yellow" d="M200 -2l3.6 8 9 1-7 6 2.4 9-8-5-8 5 2.4-9-7-6 9-1z" />
    <circle className="co-orange" cx="208" cy="36" r="7" />
    {/* right: wave strip */}
    <path className="co-pink" d="M212 112c-9 5-9 12-2 17-7 5-7 12 0 17-7 5-7 12 2 17z" />
    {/* left: dots */}
    <circle className="co-yellow" cx="3" cy="160" r="5" />
    <circle className="co-orange" cx="6" cy="174" r="2.6" />
    {/* bottom-left: seaweed */}
    <path className="co-green" d="M-6 302c3-18 0-30 6-42 2 10 6 16 3 24 4-6 6-12 7-20 4 14 1 28-6 38z" />
    <circle className="co-orange" cx="30" cy="294" r="6" />
    {/* bottom-right: leaf and spiral */}
    <path className="co-navy" d="M216 254c-20 4-34 18-40 46 20-2 34-16 40-46z" />
    <path className="co-yellow" d="M182 300c0-8 6-14 14-14" />
  </svg>
)

const heading = (s: SectionView, i: number) => (
  <h2 className={`co-h co-h--${TONES[i % TONES.length]}`}>
    <span>{s.title}</span>
  </h2>
)

export default function Cutout({ data, design, main }: TemplateProps) {
  const b = data.basics
  const name = displayName(b)
  const vars = { '--co-ink': '#1a1b2e', '--co-pink': '#ff5fa2', '--co-yellow': '#ffd23f', '--co-green': '#1fbf8f', '--co-orange': '#ff7a2f', '--co-navy': '#16205c' } as CSSProperties

  let n = 0
  const letters = Array.from(name).map((ch, i) => {
    if (ch.trim() === '') return <span key={i}> </span>
    const tone = TONES[n++ % 4]
    return (
      <span key={i} className={`co-l co-l--${tone}`}>
        {ch}
      </span>
    )
  })

  const header = (
    <header className="co-header">
      <div className="co-header__text">
        <h1 className="co-name" aria-label={name}>
          {letters}
        </h1>
        {b.title.trim() && <div className="co-title">{b.title}</div>}
        <ContactList basics={b} layout="inline" className="co-contact" iconSize="0.9em" />
      </div>
      {hasPhoto(b, design) && <Photo basics={b} size="27mm" className="co-photo" />}
    </header>
  )

  const blocks = main.flatMap((s, i) =>
    sectionsToBlocks([s], {
      heading: (sec) => heading(sec, i),
      summary: (sec) => <RichParagraphs className="co-summary" text={sec.content} />,
      entry: (e) => compactEntry(e) ?? <DefaultEntry entry={e} variant="main" />,
      whole: (sec) => compactWhole(sec, 'co-compact'),
    }),
  )

  return (
    <PageLayout
      header={header}
      main={blocks}
      page={({ header, main }) => (
        <div className="co-page" style={vars}>
          <div className="co-sheet">
            {header}
            {main}
          </div>
          <Shapes />
        </div>
      )}
    />
  )
}
