/**
 * Infographic — a résumé you can read at a glance. Page 1 opens with an identity row (a ringed photo
 * or initials, the name and title) next to four key figures computed from the content: years of
 * experience, roles, projects and skills. The main column starts with a career chart (a Gantt-style
 * bar per role and degree on a shared year axis) above the full entries; the right-hand column turns
 * skills into percentage bars, languages into ring gauges and certifications into badges. Everything is
 * still real text. Main column first in the DOM.
 */
import type { CSSProperties, ReactNode } from 'react'
import { parseStored } from '../../lib/dates.ts'
import {
  ContactList,
  DefaultEntry,
  PageLayout,
  Photo,
  RichParagraphs,
  compactEntry,
  displayName,
  hasPhoto,
  initials,
  inlineWhole,
  sectionsToBlocks,
  type Block,
  type EntryView,
  type SectionView,
  type TemplateMeta,
  type TemplateProps,
} from '../shared'
import './infographic.css'

export const meta: TemplateMeta = {
  id: 'infographic',
  name: 'Infographic',
  description: 'A career at a glance: key figures, a timeline chart of your roles, skill percentage bars, language rings and certification badges.',
  tags: ['Modern', 'Two-column', 'Photo'],
  order: 500,
  supportsPhoto: true,
  columns: 2,
  defaultFont: 'poppins',
  defaultAccent: '#0f8b8d',
  sideKinds: ['skills', 'languages', 'certifications', 'awards', 'interests', 'references'],
  headingCase: 'normal',
  gaps: { entry: 10, section: 16 },
}

type Span = { id: string; label: string; kind: 'work' | 'study'; from: number; to: number }

/** Month index (year*12 + month) of a stored date; months default to January / December. */
function monthIndex(value: string, end: boolean): number | null {
  const ym = parseStored(value)
  if (!ym) return null
  return ym.year * 12 + (ym.month ? ym.month - 1 : end ? 11 : 0)
}

function spansOf(data: TemplateProps['data']): Span[] {
  const now = new Date()
  const nowIdx = now.getFullYear() * 12 + now.getMonth()
  const spans: Span[] = []
  for (const s of data.sections) {
    if (s.hidden || (s.kind !== 'experience' && s.kind !== 'education')) continue
    for (const e of s.items) {
      const from = monthIndex(e.start, false)
      const to = e.current ? nowIdx : monthIndex(e.end, true)
      if (from === null || to === null || to < from) continue
      spans.push({ id: e.id, label: e.title || e.subtitle, kind: s.kind === 'experience' ? 'work' : 'study', from, to })
    }
  }
  return spans.sort((a, b) => a.from - b.from)
}

/** Gantt-style career chart on a shared year axis. */
function CareerChart({ spans }: { spans: Span[] }) {
  const y0 = Math.floor(Math.min(...spans.map((s) => s.from)) / 12)
  const y1 = Math.floor(Math.max(...spans.map((s) => s.to)) / 12) + 1
  const years = Array.from({ length: y1 - y0 + 1 }, (_, i) => y0 + i)
  const pos = (m: number) => `${(((m / 12 - y0) / (y1 - y0)) * 100).toFixed(2)}%`
  return (
    <div className="ig-chart">
      {spans.map((s) => (
        <div key={s.id} className="ig-chart__row">
          <span className="ig-chart__label">{s.label}</span>
          <span className="ig-chart__track">
            <span className={`ig-chart__bar ig-chart__bar--${s.kind}`} style={{ left: pos(s.from), width: `calc(${pos(s.to + 1)} - ${pos(s.from)})` }} />
          </span>
        </div>
      ))}
      <div className="ig-chart__row ig-chart__row--axis" aria-hidden="true">
        <span className="ig-chart__label" />
        <span className="ig-chart__track ig-chart__axis">
          {years.map((y) => (
            <span key={y} className="ig-chart__tick" style={{ left: pos(y * 12) }}>
              {y}
            </span>
          ))}
        </span>
      </div>
    </div>
  )
}

function Ring({ level, label }: { level: number; label: string }) {
  const c = 2 * Math.PI * 15
  return (
    <svg className="ig-ring__svg" viewBox="0 0 40 40" aria-hidden="true">
      <circle className="ig-ring__track" cx="20" cy="20" r="15" />
      <circle className="ig-ring__fill" cx="20" cy="20" r="15" strokeDasharray={`${((level || 5) / 5) * c} ${c}`} transform="rotate(-90 20 20)" />
      <text x="20" y="20" dominantBaseline="central" textAnchor="middle" className="ig-ring__text">
        {label}
      </text>
    </svg>
  )
}

function sideEntry(e: EntryView): ReactNode {
  if (e.kind === 'skills') {
    const pct = e.level > 0 ? e.level * 20 : 0
    return (
      <div className="rf-entry rf-entry--skills rf-entry--side ig-skill">
        <div className="ig-skill__head">
          <span className="ig-skill__name">{e.title}</span>
          {pct > 0 && <span className="ig-skill__pct">{pct}%</span>}
        </div>
        {pct > 0 && (
          <span className="ig-skill__bar" aria-hidden="true">
            <span style={{ width: `${pct}%` }} />
          </span>
        )}
        {e.keywords.length > 0 && <div className="ig-skill__kw">{e.keywords.join(', ')}</div>}
      </div>
    )
  }
  if (e.kind === 'certifications' || e.kind === 'awards') {
    return (
      <div className="rf-entry rf-entry--side ig-badge">
        <svg className="ig-badge__icon" viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="9" r="7" />
          <path d="M8 15l-2 7 6-3 6 3-2-7" />
        </svg>
        <div className="ig-badge__text">
          <div className="ig-badge__title">{e.title}</div>
          <div className="ig-badge__meta">{[e.subtitle, e.date].filter(Boolean).join(' · ')}</div>
        </div>
      </div>
    )
  }
  return compactEntry(e) ?? <DefaultEntry entry={e} variant="side" />
}

const heading = (s: SectionView | string) => (
  <h2 className="ig-h">
    <span className="ig-h__dot" aria-hidden="true" />
    {typeof s === 'string' ? s : s.title}
  </h2>
)

export default function Infographic({ data, design, main, side, sections }: TemplateProps) {
  const b = data.basics
  const name = displayName(b)
  const vars = { '--ig-ink': '#1d2733', '--ig-soft': '#f1f6f7', '--ig-coral': '#f2785c' } as CSSProperties

  const spans = spansOf(data)
  const work = spans.filter((s) => s.kind === 'work')
  const months = work.length ? Math.max(...work.map((s) => s.to)) - Math.min(...work.map((s) => s.from)) + 1 : 0
  const count = (kind: string) => sections.filter((s) => s.kind === kind).reduce((n, s) => n + s.entries.length, 0)
  const skillCount = sections.filter((s) => s.kind === 'skills').reduce((n, s) => n + s.entries.reduce((k, e) => k + Math.max(1, e.keywords.length), 0), 0)
  const stats = [
    { value: months >= 12 ? `${(months / 12).toFixed(1).replace(/\.0$/, '')}` : String(months), unit: months >= 12 ? 'years' : 'months', label: 'experience' },
    { value: String(count('experience')), unit: '', label: 'roles' },
    { value: String(count('projects')), unit: '', label: 'projects' },
    { value: String(skillCount), unit: '', label: 'skills' },
  ].filter((s) => s.value !== '0')

  const header = (
    <header className="ig-header">
      <div className="ig-id">
        <div className="ig-avatar">{hasPhoto(b, design) ? <Photo basics={b} size="24mm" className="ig-photo" /> : <span className="ig-initials">{initials(name)}</span>}</div>
        <div className="ig-id__text">
          <h1 className="ig-name">{name}</h1>
          {b.title.trim() && <div className="ig-title">{b.title}</div>}
          <ContactList basics={b} layout="inline" className="ig-contact" iconSize="0.9em" />
        </div>
      </div>
      {stats.length > 0 && (
        <div className="ig-stats">
          {stats.map((s) => (
            <div key={s.label} className="ig-stat">
              <span className="ig-stat__value">
                {s.value}
                {s.unit && <small> {s.unit}</small>}
              </span>
              <span className="ig-stat__label">{s.label}</span>
            </div>
          ))}
        </div>
      )}
    </header>
  )

  const mainBlocks: Block[] = sectionsToBlocks(main, {
    heading,
    summary: (s) => <RichParagraphs className="ig-summary" text={s.content} />,
    entry: (e) => compactEntry(e) ?? <DefaultEntry entry={e} variant="main" />,
  })
  if (spans.length > 1) {
    // the chart follows an opening summary, otherwise it leads the column
    const at = main[0]?.kind === 'summary' ? 1 : 0
    mainBlocks.splice(at, 0, { key: 'career-chart', gap: 'section', node: <>{heading('Career timeline')}<CareerChart spans={spans} /></> })
  }

  const sideBlocks: Block[] = sectionsToBlocks(side, {
    heading,
    entry: sideEntry,
    whole: (s) =>
      s.kind === 'languages' ? (
        <div className="ig-rings">
          {s.entries.map((e) => (
            <div key={e.id} className="ig-ring">
              <Ring level={e.level} label={e.level ? `${e.level * 20}%` : '✓'} />
              <span className="ig-ring__name">{e.title}</span>
              {e.levelLabel && <span className="ig-ring__level">{e.levelLabel}</span>}
            </div>
          ))}
        </div>
      ) : s.kind === 'interests' ? (
        inlineWhole(s, 'ig-inline')
      ) : undefined,
  })

  return (
    <PageLayout
      header={header}
      main={mainBlocks}
      side={sideBlocks}
      page={({ header, main, side }) => (
        <div className="ig-page" style={vars}>
          {header}
          <div className="ig-cols">
            <div className="ig-main">{main}</div>
            <aside className="ig-side">{side}</aside>
          </div>
        </div>
      )}
    />
  )
}
