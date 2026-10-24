/**
 * Groovy — 1970s psychedelic. A flowing ribbon of wavy rainbow stripes (orange, mustard, pink, purple,
 * teal) runs down the left edge of every page on warm cream paper. Page 1 opens with a rising sun and
 * daisies beside the name in chunky lettering with stacked colour outlines, the title on a brown pill
 * and the contact line. Each section heading is a daisy with a wavy underline in the next ribbon
 * colour. Single column to the right of the ribbon; all text stays real text.
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
import './groovy.css'

export const meta: TemplateMeta = {
  id: 'groovy',
  name: 'Groovy',
  description: 'Seventies psychedelic: a flowing rainbow wave ribbon, a rising sun, daisies and chunky lettering with stacked colour outlines.',
  tags: ['Creative', 'Photo'],
  order: 580,
  collection: 'style',
  supportsPhoto: true,
  columns: 1,
  defaultFont: 'poppins',
  defaultAccent: '#f26b1d',
  headingCase: 'normal',
  gaps: { entry: 9, section: 14 },
}

const TONES = ['orange', 'pink', 'purple', 'teal', 'mustard'] as const

/** Five wavy bands running top to bottom. */
const Ribbon = () => {
  const band = (x: number) => {
    let d = `M${x} -10 q 6 12 0 24`
    for (let y = 14; y < 310; y += 24) d += ' t 0 24'
    return d
  }
  return (
    <svg className="gr-ribbon" viewBox="0 0 34 297" preserveAspectRatio="none" aria-hidden="true">
      {[4, 10.5, 17, 23.5, 30].map((x, i) => (
        <path key={x} className={`gr-band gr-band--${TONES[i]}`} d={band(x)} />
      ))}
    </svg>
  )
}

const Daisy = ({ tone }: { tone: string }) => (
  <svg className={`gr-daisy gr-daisy--${tone}`} viewBox="0 0 40 40" aria-hidden="true">
    {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
      <ellipse key={a} className="gr-daisy__petal" cx="20" cy="9" rx="5.5" ry="9" transform={`rotate(${a} 20 20)`} />
    ))}
    <circle className="gr-daisy__eye" cx="20" cy="20" r="6.5" />
  </svg>
)

const Sun = () => (
  <svg className="gr-sun" viewBox="0 0 120 70" aria-hidden="true">
    {[0, 1, 2, 3, 4].map((i) => (
      <path key={i} className={`gr-arc gr-arc--${TONES[i]}`} d={`M${10 + i * 9} 70a${50 - i * 9} ${50 - i * 9} 0 0 1 ${100 - i * 18} 0`} />
    ))}
    <circle className="gr-sun__core" cx="60" cy="70" r="12" />
  </svg>
)

const heading = (s: SectionView, i: number) => {
  const tone = TONES[i % TONES.length]
  return (
    <h2 className={`gr-h gr-h--${tone}`}>
      <Daisy tone={tone} />
      <span className="gr-h__text">{s.title}</span>
    </h2>
  )
}

export default function Groovy({ data, design, main }: TemplateProps) {
  const b = data.basics
  const vars = {
    '--gr-cream': '#fff2dc',
    '--gr-brown': '#5a2d0c',
    '--gr-mustard': '#f7b52c',
    '--gr-pink': '#ef5b8c',
    '--gr-purple': '#8c4fd1',
    '--gr-teal': '#2aa198',
  } as CSSProperties

  const header = (
    <header className="gr-header">
      <div className="gr-header__text">
        <h1 className="gr-name">{displayName(b)}</h1>
        {b.title.trim() && <div className="gr-title">{b.title}</div>}
        <ContactList basics={b} layout="inline" className="gr-contact" iconSize="0.9em" />
      </div>
      <div className="gr-art">
        <Sun />
        {hasPhoto(b, design) ? (
          <Photo basics={b} size="24mm" className="gr-photo" />
        ) : (
          <>
            <Daisy tone="mustard" />
            <Daisy tone="pink" />
          </>
        )}
      </div>
    </header>
  )

  const blocks = main.flatMap((s, i) =>
    sectionsToBlocks([s], {
      heading: (sec) => heading(sec, i),
      summary: (sec) => <RichParagraphs className="gr-summary" text={sec.content} />,
      entry: (e) => compactEntry(e) ?? <DefaultEntry entry={e} variant="main" />,
      whole: (sec) => compactWhole(sec, 'gr-compact'),
    }),
  )

  return (
    <PageLayout
      header={header}
      main={blocks}
      page={({ header, main }) => (
        <div className="gr-page" style={vars}>
          <Ribbon />
          <div className="gr-body">
            {header}
            {main}
          </div>
        </div>
      )}
    />
  )
}
