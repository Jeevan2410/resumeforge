/**
 * Warhol — pop art in the screen-print style. Page 1 opens with a 2×2 grid of the same portrait in
 * four flat colourways (the photo with colour washes, or the initials when there is no photo) next to
 * the name in heavy outlined pop lettering with an offset colour shadow, the title in a speech bubble
 * and the contact line on a yellow strip. A four-colour bar runs across the top of every page and a
 * halftone dot field fades in at the bottom. Section headings are pop lettering beside a starburst,
 * dates sit on tilted stickers and skills become colour chips. Single column.
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
  initials,
  sectionsToBlocks,
  type EntryView,
  type SectionView,
  type TemplateMeta,
  type TemplateProps,
} from '../shared'
import './warhol.css'

export const meta: TemplateMeta = {
  id: 'warhol',
  name: 'Warhol',
  description: 'Screen-print pop art: a four-colour portrait grid, outlined pop lettering, a speech bubble, starburst headings and colour-chip skills.',
  tags: ['Creative', 'Photo'],
  order: 570,
  collection: 'style',
  supportsPhoto: true,
  columns: 1,
  defaultFont: 'montserrat',
  defaultAccent: '#ff2e88',
  headingCase: 'upper',
  gaps: { entry: 9, section: 14 },
}

const TONES = ['pink', 'cyan', 'yellow', 'orange'] as const

const Burst = ({ tone }: { tone: string }) => (
  <svg className={`wh-burst wh-burst--${tone}`} viewBox="0 0 40 40" aria-hidden="true">
    <path d="M20 1l4 9 9-5-2 10 9 2-8 6 6 8-10-1-1 10-7-7-7 7-1-10-10 1 6-8-8-6 9-2-2-10 9 5z" />
  </svg>
)

const heading = (s: SectionView, i: number) => {
  const tone = TONES[i % TONES.length]
  return (
    <h2 className={`wh-h wh-h--${tone}`}>
      <Burst tone={tone} />
      <span className="wh-h__text">{s.title}</span>
    </h2>
  )
}

function entry(e: EntryView): ReactNode {
  if (e.kind === 'skills') {
    return (
      <div className="rf-entry wh-skill">
        <span className="wh-skill__name">{e.title}</span>
        <span className="wh-chips">
          {(e.keywords.length ? e.keywords : [e.levelLabel].filter(Boolean)).map((k, i) => (
            <span key={i} className={`wh-chip wh-chip--${TONES[i % TONES.length]}`}>
              {k}
            </span>
          ))}
        </span>
      </div>
    )
  }
  return compactEntry(e) ?? <DefaultEntry entry={e} variant="main" />
}

export default function Warhol({ data, design, main }: TemplateProps) {
  const b = data.basics
  const name = displayName(b)
  const photo = hasPhoto(b, design)
  const vars = { '--wh-ink': '#141414', '--wh-cyan': '#00c2e8', '--wh-yellow': '#ffe500', '--wh-orange': '#ff7a00' } as CSSProperties

  const header = (
    <header className="wh-header">
      <div className="wh-grid" aria-hidden="true">
        {TONES.map((t) => (
          <div key={t} className={`wh-tile wh-tile--${t}`}>
            {photo ? <Photo basics={b} size="100%" shape="square" className="wh-photo" /> : <span className="wh-ini">{initials(name)}</span>}
          </div>
        ))}
      </div>
      <div className="wh-header__text">
        <h1 className="wh-name">{name}</h1>
        {b.title.trim() && <div className="wh-bubble">{b.title}</div>}
        <ContactList basics={b} layout="inline" className="wh-contact" iconSize="0.9em" />
      </div>
    </header>
  )

  const blocks = main.flatMap((s, i) =>
    sectionsToBlocks([s], {
      heading: (sec) => heading(sec, i),
      summary: (sec) => <RichParagraphs className="wh-summary" text={sec.content} />,
      entry,
      whole: (sec) => (sec.kind === 'skills' ? undefined : compactWhole(sec, 'wh-compact')),
    }),
  )

  return (
    <PageLayout
      header={header}
      main={blocks}
      page={({ header, main }) => (
        <div className="wh-page" style={vars}>
          <span className="wh-bar" aria-hidden="true" />
          <span className="wh-dots" aria-hidden="true" />
          <div className="wh-body">
            {header}
            {main}
          </div>
        </div>
      )}
    />
  )
}
