/**
 * Metro — the career as a transit map. Page 1 opens with a station sign (the name on a dark sign
 * with a coloured stripe) and a strip map like the one above train doors: one stop per section, each
 * segment in that section's line colour, "You are here" at the start. The summary is a line-status
 * board ("Good service"). Every other section is its own coloured line with a line badge; each role,
 * degree or project is a station on it (a tick, or an interchange ring for a current role) with its
 * dates in a zone tag, and the line ends in a terminus bar with a "Change here for …" note pointing to
 * the next section. Single column.
 */
import type { CSSProperties, ReactNode } from 'react'
import {
  ContactList,
  EntryLink,
  PageLayout,
  Photo,
  Rich,
  RichParagraphs,
  displayName,
  hasPhoto,
  sectionsToBlocks,
  type EntryView,
  type SectionView,
  type TemplateMeta,
  type TemplateProps,
} from '../shared'
import './metro.css'

export const meta: TemplateMeta = {
  id: 'metro',
  name: 'Metro Map',
  description: 'Your career as a transit map: a station sign and strip map up top, each section its own coloured line, and every role a station with its dates in a zone tag.',
  tags: ['Creative', 'Photo'],
  order: 660,
  collection: 'format',
  supportsPhoto: true,
  columns: 1,
  defaultFont: 'raleway',
  defaultAccent: '#dc241f',
  headingCase: 'normal',
  gaps: { entry: 6, section: 12 },
}

// line colours after the accent (first line); light ones get dark badge text
const LINES = ['#0098d4', '#00843d', '#9b0056', '#f5a300', '#7156a5', '#e86a10', '#00a4a7', '#6a7278']
const LIGHT = new Set(['#f5a300'])

export default function Metro({ data, design, main }: TemplateProps) {
  const b = data.basics
  const name = displayName(b)
  const vars = { '--mt-ink': '#10213d' } as CSSProperties

  const routes = main.filter((s) => s.kind !== 'summary')
  const colour = (s: SectionView) => {
    const i = routes.indexOf(s)
    return i <= 0 ? 'var(--rf-accent)' : LINES[(i - 1) % LINES.length]
  }
  const lineVars = (s: SectionView) => {
    const c = colour(s)
    return { '--mt-line': c, '--mt-badge-ink': LIGHT.has(c) ? '#10213d' : '#fff' } as CSSProperties
  }

  const header = (
    <header className="mt-head">
      <div className="mt-sign">
        {hasPhoto(b, design) && <Photo basics={b} size="21mm" shape="circle" className="mt-photo" />}
        <div className="mt-sign__text">
          <h1 className="mt-name">{name}</h1>
          {b.title.trim() && <div className="mt-title">{b.title}</div>}
        </div>
        <span className="mt-sign__m" aria-hidden="true">
          M
        </span>
      </div>
      <ContactList basics={b} layout="inline" className="mt-contact" iconSize="0.9em" />
      {routes.length > 0 && (
        <div className="mt-strip" aria-hidden="true">
          <span className="mt-strip__here">You are here</span>
          <div className="mt-strip__map">
            {routes.map((s) => (
              <div key={s.id} className="mt-stop" style={lineVars(s)}>
                <span className="mt-stop__dot" />
                <span className="mt-stop__name">{s.title}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </header>
  )

  const heading = (s: SectionView) =>
    s.kind === 'summary' ? (
      <div className="mt-status__head">
        <h2 className="mt-status__h">{s.title}</h2>
        <span className="mt-status__good" aria-hidden="true">
          Good service
        </span>
      </div>
    ) : (
      <div className="mt-badge" style={lineVars(s)}>
        <span className="mt-badge__no" aria-hidden="true">
          {routes.indexOf(s) + 1}
        </span>
        <h2 className="mt-h">{s.title}</h2>
        <span className="mt-badge__line" aria-hidden="true">
          line
        </span>
      </div>
    )

  const station = (e: EntryView): ReactNode => {
    const where = [e.subtitle, e.location].filter(Boolean).join(' · ')
    const zone = e.date || e.levelLabel
    return (
      <div className="mt-station">
        <span className="mt-track" aria-hidden="true" />
        <span className="mt-tick" aria-hidden="true" />
        <div className="mt-station__top">
          <h3 className="mt-station__name">{e.title}</h3>
          {zone && <span className="mt-zone">{zone}</span>}
        </div>
        {where && <div className="mt-station__where">{where}</div>}
        {e.url && <EntryLink entry={e} className="mt-station__link" />}
        {e.description && <Rich as="p" className="mt-station__desc" text={e.description} />}
        {e.bullets.length > 0 && (
          <ul className="mt-station__list">
            {e.bullets.map((t, i) => (
              <li key={i}>
                <Rich text={t} />
              </li>
            ))}
          </ul>
        )}
        {e.keywords.length > 0 && (
          <div className="mt-changes">
            {e.keywords.map((k) => (
              <span key={k} className="mt-change">
                {k}
              </span>
            ))}
          </div>
        )}
        {e.meta && <div className="mt-station__where">{e.meta}</div>}
      </div>
    )
  }

  const blocks = sectionsToBlocks(main, {
    heading,
    summary: (s) => <RichParagraphs className="mt-status__text" text={s.content} />,
    entry: (e) => station(e),
    wrap: (node, { section, entry, first, last }) => {
      if (section.kind === 'summary') return <div className="mt-status">{node}</div>
      const next = routes[routes.indexOf(section) + 1]
      return (
        <div className={`mt-row${first ? ' mt-row--first' : ''}${last ? ' mt-row--last' : ''}${entry?.current ? ' mt-row--now' : ''}`} style={lineVars(section)}>
          {node}
          {last && next && (
            <div className="mt-transfer" aria-hidden="true">
              <span className="mt-transfer__icon" />
              Change here for the <b style={{ color: colour(next) }}>{next.title}</b> line
            </div>
          )}
        </div>
      )
    },
  })

  return (
    <PageLayout
      header={header}
      main={blocks}
      page={({ index, count, header, main }) => (
        <div className="mt-page" style={vars}>
          {header ?? (
            <div className="mt-run" aria-hidden="true">
              <span className="mt-sign__m">M</span>
              <b>{name}</b>
              <span>
                Map {index + 1} of {count}
              </span>
            </div>
          )}
          {main}
        </div>
      )}
    />
  )
}
