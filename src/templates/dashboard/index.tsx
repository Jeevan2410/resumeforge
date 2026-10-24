/**
 * Dashboard — the résumé as a product UI. A dark app sidebar on the left holds the profile (avatar,
 * name, title), the contact details as menu items, skills as donut meters, languages as progress
 * pills and interests as tags. The light main area opens with a gradient hero card around the summary
 * and a row of KPI tiles (years of experience, roles, projects, skills), then every section sits in a
 * white card with an icon badge. All of it is real text. Main column first in the DOM.
 */
import type { CSSProperties, ReactNode } from 'react'
import { parseStored } from '../../lib/dates.ts'
import {
  ContactList,
  DefaultEntry,
  PageLayout,
  Photo,
  RichParagraphs,
  SectionIcon,
  compactEntry,
  compactWhole,
  contactEntries,
  displayName,
  hasPhoto,
  initials,
  sectionsToBlocks,
  type Block,
  type EntryView,
  type SectionView,
  type TemplateMeta,
  type TemplateProps,
} from '../shared'
import './dashboard.css'

export const meta: TemplateMeta = {
  id: 'dashboard',
  name: 'Dashboard',
  description: 'Your résumé as an app: a dark sidebar with donut skill meters, a gradient hero card, KPI tiles and every section in its own card with an icon.',
  tags: ['Modern', 'Creative', 'Two-column', 'Photo'],
  order: 530,
  supportsPhoto: true,
  columns: 2,
  defaultFont: 'poppins',
  defaultAccent: '#6c5ce7',
  sideKinds: ['skills', 'languages', 'interests', 'certifications', 'awards', 'references'],
  headingCase: 'normal',
  gaps: { entry: 8, section: 10 },
}

const RING = 2 * Math.PI * 15

function Donut({ level }: { level: number }) {
  const pct = level > 0 ? level * 20 : 100
  return (
    <svg className="db-donut" viewBox="0 0 40 40" aria-hidden="true">
      <circle className="db-donut__track" cx="20" cy="20" r="15" />
      <circle className="db-donut__fill" cx="20" cy="20" r="15" strokeDasharray={`${(pct / 100) * RING} ${RING}`} transform="rotate(-90 20 20)" />
      <text className="db-donut__text" x="20" y="20" dominantBaseline="central" textAnchor="middle">
        {level > 0 ? `${pct}%` : '✓'}
      </text>
    </svg>
  )
}

/** Years of work experience from the raw experience dates (first start to last end or today). */
function workMonths(data: TemplateProps['data']): number {
  const now = new Date()
  let from = Infinity
  let to = -Infinity
  for (const s of data.sections) {
    if (s.hidden || s.kind !== 'experience') continue
    for (const e of s.items) {
      const a = parseStored(e.start)
      const b = e.current ? { year: now.getFullYear(), month: now.getMonth() + 1 } : parseStored(e.end)
      if (!a || !b) continue
      from = Math.min(from, a.year * 12 + (a.month || 1) - 1)
      to = Math.max(to, b.year * 12 + (b.month || 12) - 1)
    }
  }
  return to >= from ? to - from + 1 : 0
}

const heading = (s: SectionView) => (
  <h2 className="db-h">
    <span className="db-h__icon">
      <SectionIcon kind={s.kind} size="1em" />
    </span>
    {s.title}
  </h2>
)

const sideHeading = (s: SectionView | string) => <h2 className="db-sh">{typeof s === 'string' ? s : s.title}</h2>

/** One white card per section: its blocks touch and the CSS rounds the outer corners. */
const card = (node: ReactNode, info: { first: boolean; last: boolean }) => (
  <div className={`db-card${info.first ? ' db-card--first' : ''}${info.last ? ' db-card--last' : ''}`}>{node}</div>
)

function sideEntry(e: EntryView): ReactNode {
  if (e.kind === 'skills') {
    return (
      <div className="rf-entry rf-entry--side db-skill">
        <Donut level={e.level} />
        <div className="db-skill__text">
          <div className="db-skill__name">{e.title}</div>
          {e.keywords.length > 0 && <div className="db-skill__kw">{e.keywords.join(' · ')}</div>}
        </div>
      </div>
    )
  }
  return compactEntry(e) ?? <DefaultEntry entry={e} variant="side" />
}

function sideWhole(s: SectionView): ReactNode | undefined {
  if (s.kind === 'languages') {
    return (
      <div className="db-langs">
        {s.entries.map((e) => (
          <div key={e.id} className="db-lang">
            <div className="db-lang__head">
              <span>{e.title}</span>
              {e.levelLabel && <span className="db-lang__lvl">{e.levelLabel}</span>}
            </div>
            <span className="db-lang__bar" aria-hidden="true">
              <span style={{ width: `${(e.level || 5) * 20}%` }} />
            </span>
          </div>
        ))}
      </div>
    )
  }
  if (s.kind === 'interests') {
    const tags = s.entries.flatMap((e) => (e.keywords.length ? e.keywords : [e.title])).filter(Boolean)
    return (
      <div className="db-tags">
        {tags.map((t, i) => (
          <span key={i} className="db-tag">
            {t}
          </span>
        ))}
      </div>
    )
  }
  return undefined
}

export default function Dashboard({ data, design, main, side, sections }: TemplateProps) {
  const b = data.basics
  const name = displayName(b)
  const first = name.split(/\s+/)[0] || name
  const vars = { '--db-ink': '#1b1840', '--db-nav': '#1e1b3a', '--db-bg': '#f3f3fa', '--db-pink': '#ff6fb5' } as CSSProperties

  const months = workMonths(data)
  const count = (kind: string) => sections.filter((s) => s.kind === kind).reduce((n, s) => n + s.entries.length, 0)
  const skills = sections.filter((s) => s.kind === 'skills').reduce((n, s) => n + s.entries.reduce((k, e) => k + Math.max(1, e.keywords.length), 0), 0)
  const kpis = [
    { value: months >= 12 ? (months / 12).toFixed(1).replace(/\.0$/, '') : String(months), label: months >= 12 ? 'Years exp.' : 'Months exp.', tone: 'a' },
    { value: String(count('experience')), label: 'Roles', tone: 'b' },
    { value: String(count('projects')), label: 'Projects', tone: 'c' },
    { value: String(skills), label: 'Skills', tone: 'd' },
  ].filter((k) => k.value !== '0')

  const header = (
    <header className="db-profile">
      <div className="db-brand" aria-hidden="true">
        <i />
        <i />
        <i />
      </div>
      <div className="db-avatar">{hasPhoto(b, design) ? <Photo basics={b} size="22mm" className="db-photo" /> : <span className="db-initials">{initials(name)}</span>}</div>
      <h1 className="db-name">{name}</h1>
      {b.title.trim() && <div className="db-title">{b.title}</div>}
    </header>
  )

  // the summary becomes the hero card; the KPI row follows it
  const summary = main.find((s) => s.kind === 'summary')
  const rest = main.filter((s) => s !== summary)
  const mainBlocks: Block[] = [
    {
      key: 'hero',
      sectionId: summary?.id,
      gap: 'section',
      node: (
        <div className="db-hero">
          <svg className="db-hero__art" viewBox="0 0 200 110" aria-hidden="true">
            <circle cx="168" cy="22" r="34" className="db-hero__orb" />
            <circle cx="40" cy="104" r="22" className="db-hero__orb db-hero__orb--b" />
            <path className="db-hero__area" d="M0 110V82l22-10 22 6 22-18 22 8 22-24 22 10 22-22 22 6 24-20v92Z" />
            <path className="db-hero__line" d="M0 82l22-10 22 6 22-18 22 8 22-24 22 10 22-22 22 6 24-20" />
          </svg>
          <div className="db-hero__text">
            <div className="db-hero__hi">Hello, I’m {first}</div>
            {summary?.content.trim() ? <RichParagraphs className="db-hero__summary" text={summary.content} /> : b.title.trim() && <div className="db-hero__summary">{b.title}</div>}
          </div>
        </div>
      ),
    },
  ]
  if (kpis.length) {
    mainBlocks.push({
      key: 'kpis',
      gap: 'section',
      node: (
        <div className="db-kpis">
          {kpis.map((k) => (
            <div key={k.label} className={`db-kpi db-kpi--${k.tone}`}>
              <span className="db-kpi__value">{k.value}</span>
              <span className="db-kpi__label">{k.label}</span>
            </div>
          ))}
        </div>
      ),
    })
  }
  mainBlocks.push(
    ...sectionsToBlocks(rest, {
      heading,
      entry: (e) => compactEntry(e) ?? <DefaultEntry entry={e} variant="main" />,
      whole: (s) => compactWhole(s, 'db-compact'),
      wrap: card,
    }).map((bl) => (bl.gap === 'entry' ? { ...bl, gap: 'none' as const } : bl)),
  )

  const sideBlocks: Block[] = []
  if (contactEntries(b).length) {
    sideBlocks.push({
      key: 'contact',
      gap: 'section',
      letter: true,
      node: (
        <>
          {sideHeading('Contact')}
          <ContactList basics={b} layout="stack" className="db-menu" itemClassName="db-menu__item" iconSize="0.95em" />
        </>
      ),
    })
  }
  sideBlocks.push(...sectionsToBlocks(side, { heading: sideHeading, entry: sideEntry, whole: sideWhole }))

  return (
    <PageLayout
      header={header}
      main={mainBlocks}
      side={sideBlocks}
      page={({ header, main, side }) => (
        <div className="db-page" style={vars}>
          <div className="db-main">{main}</div>
          <aside className="db-nav">
            {header}
            {side}
          </aside>
        </div>
      )}
    />
  )
}
