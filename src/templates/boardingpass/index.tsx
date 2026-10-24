/**
 * Boarding pass — every part of the résumé is a travel document. Page 1 opens with a boarding pass
 * for the candidate (passenger name, destination = job title, departing from = location, contact
 * details as the fine print) with a tear-off stub carrying the seat, a barcode and the photo. Section
 * headings are departure-board strips. Every dated entry (roles, degrees, projects) is its own ticket:
 * carrier and gate on top, the dates as big FROM → TO codes, the role and its details, and a
 * perforated stub with the class and a barcode. Skills and other undated items hang as luggage tags.
 * Single column.
 */
import type { CSSProperties, ReactNode } from 'react'
import {
  ContactList,
  EntryLink,
  PageLayout,
  Photo,
  Rich,
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
import './boardingpass.css'

export const meta: TemplateMeta = {
  id: 'boardingpass',
  name: 'Boarding Pass',
  description: 'Every role is a ticket: your header is a boarding pass, jobs and degrees are tickets with FROM → TO dates, skills hang as luggage tags.',
  tags: ['Creative', 'Photo'],
  order: 610,
  collection: 'format',
  supportsPhoto: true,
  columns: 1,
  defaultFont: 'montserrat',
  defaultAccent: '#1460d8',
  headingCase: 'upper',
  gaps: { entry: 8, section: 13 },
}

const CLASS: Partial<Record<string, string>> = {
  experience: 'Work',
  education: 'Study',
  projects: 'Project',
  volunteering: 'Volunteer',
  awards: 'Award',
  certifications: 'Certified',
  publications: 'Published',
}

const Barcode = ({ seed }: { seed: string }) => {
  // deterministic bar widths from the text so every ticket looks different
  const bars: number[] = []
  for (let i = 0; i < 26; i++) bars.push(1 + ((seed.charCodeAt(i % Math.max(1, seed.length)) || 7) * (i + 3)) % 3)
  let x = 0
  return (
    <svg className="bp-barcode" viewBox="0 0 80 20" preserveAspectRatio="none" aria-hidden="true">
      {bars.map((w, i) => {
        const r = <rect key={i} x={x} y="0" width={w} height="20" />
        x += w + 1.4
        return r
      })}
    </svg>
  )
}

const heading = (s: SectionView) => (
  <h2 className="bp-h">
    <span className="bp-h__kind" aria-hidden="true">
      Departures
    </span>
    <span className="bp-h__text">{s.title}</span>
  </h2>
)

function ticket(e: EntryView): ReactNode {
  return (
    <article className="bp-ticket">
      <div className="bp-ticket__main">
        <div className="bp-ticket__top">
          <span className="bp-ticket__carrier">{e.subtitle || e.title}</span>
          {e.location && (
            <span className="bp-ticket__gate">
              <small>Gate</small> {e.location}
            </span>
          )}
        </div>
        <div className="bp-route">
          <span className="bp-route__code">{e.startText || e.date}</span>
          {e.endText && (
            <>
              <svg className="bp-plane" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M2 13l8-1 5-8h2l-2 8 5-.5 2-2.5h1.5l-1 4 1 4H22l-2-2.5-5-.5 2 8h-2l-5-8-8-1z" />
              </svg>
              <span className={e.current ? 'bp-route__code bp-route__code--now' : 'bp-route__code'}>{e.endText}</span>
            </>
          )}
        </div>
        <h3 className="bp-ticket__role">{e.title}</h3>
        {e.url && <EntryLink entry={e} className="bp-ticket__link" />}
        {e.description && <Rich as="p" className="bp-ticket__desc" text={e.description} />}
        {e.bullets.length > 0 && (
          <ul className="bp-ticket__list">
            {e.bullets.map((t, i) => (
              <li key={i}>
                <Rich text={t} />
              </li>
            ))}
          </ul>
        )}
        {e.keywords.length > 0 && <div className="bp-ticket__kw">{e.keywords.join(' · ')}</div>}
        {e.meta && <div className="bp-ticket__kw">{e.meta}</div>}
      </div>
      <div className="bp-stub" aria-hidden="true">
        <div className="bp-field">
          <small>Class</small>
          <b>{CLASS[e.kind] ?? 'Item'}</b>
        </div>
        <div className="bp-field">
          <small>Seat</small>
          <b>{initials(e.subtitle || e.title).slice(0, 2) || '1A'}</b>
        </div>
        <Barcode seed={e.title + e.subtitle} />
      </div>
    </article>
  )
}

function tag(e: EntryView): ReactNode {
  return (
    <div className="bp-tag">
      <span className="bp-tag__hole" aria-hidden="true" />
      <div className="bp-tag__body">
        <div className="bp-tag__head">
          <span className="bp-tag__name">{e.title}</span>
          {e.levelLabel && <span className="bp-tag__lvl">{e.levelLabel}</span>}
        </div>
        {e.keywords.length > 0 && <div className="bp-tag__kw">{e.keywords.join(' · ')}</div>}
      </div>
    </div>
  )
}

function entry(e: EntryView): ReactNode {
  if (e.kind === 'skills') return tag(e)
  if ((e.startText || e.date) && (e.bullets.length || e.description || e.kind === 'experience' || e.kind === 'education')) return ticket(e)
  return compactEntry(e) ?? ticket(e)
}

export default function BoardingPass({ data, design, main }: TemplateProps) {
  const b = data.basics
  const name = displayName(b)
  const vars = { '--bp-ink': '#17202b', '--bp-bg': '#e9eef4', '--bp-board': '#1b2430', '--bp-amber': '#ffc23d' } as CSSProperties

  const header = (
    <header className="bp-pass">
      <div className="bp-pass__band">
        <span>Boarding pass</span>
        <span className="bp-pass__air">Career Class</span>
      </div>
      <div className="bp-pass__body">
        <div className="bp-pass__main">
          <div className="bp-field bp-field--big">
            <small>Passenger</small>
            <h1 className="bp-name">{name}</h1>
          </div>
          <div className="bp-pass__row">
            {b.title.trim() && (
              <div className="bp-field">
                <small>Destination</small>
                <b className="bp-dest">{b.title}</b>
              </div>
            )}
            {b.location.trim() && (
              <div className="bp-field">
                <small>Departing from</small>
                <b>{b.location}</b>
              </div>
            )}
          </div>
          <ContactList basics={b} layout="inline" className="bp-contact" iconSize="0.9em" />
        </div>
        <div className="bp-pass__stub">
          {hasPhoto(b, design) ? <Photo basics={b} size="20mm" shape="rounded" className="bp-photo" /> : <span className="bp-seat">{initials(name)}</span>}
          <div className="bp-field" aria-hidden="true">
            <small>Status</small>
            <b>Ready to board</b>
          </div>
          <Barcode seed={name} />
        </div>
      </div>
    </header>
  )

  const blocks = sectionsToBlocks(main, {
    heading,
    summary: (s) => <RichParagraphs className="bp-summary" text={s.content} />,
    entry,
    whole: (s) => (s.kind === 'skills' ? undefined : compactWhole(s, 'bp-compact')),
  })

  return (
    <PageLayout
      header={header}
      main={blocks}
      page={({ header, main }) => (
        <div className="bp-page" style={vars}>
          {header}
          {main}
        </div>
      )}
    />
  )
}
