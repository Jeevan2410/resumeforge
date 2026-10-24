/**
 * Chat — the résumé is a conversation in a messaging app. Page 1 opens with the app bar (avatar,
 * name, "online · job title", call icons) and the contact details pinned as a shared contact card.
 * Each section starts with an incoming message from a recruiter asking a question, with the section
 * title as a topic pill (the real h2). The answers are outgoing bubbles in the accent colour: the
 * summary as a text message, every role / degree / project as its own bubble, skills as chip
 * bubbles, with small timestamps and read ticks. The last page ends with a message composer bar.
 * Single column.
 */
import type { CSSProperties, ReactNode } from 'react'
import { mmToPx } from '../../lib/templateData.ts'
import type { SectionKind } from '../../lib/types.ts'
import {
  ContactList,
  EntryLink,
  PageLayout,
  Photo,
  Rich,
  RichParagraphs,
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
import './chat.css'

export const meta: TemplateMeta = {
  id: 'chat',
  name: 'Chat',
  description: 'Your résumé as a conversation: a recruiter asks one question per section and you answer in message bubbles, with chips, timestamps and read ticks.',
  tags: ['Creative', 'Photo', 'Modern'],
  order: 620,
  collection: 'format',
  supportsPhoto: true,
  columns: 1,
  defaultFont: 'inter',
  defaultAccent: '#0b7a5c',
  headingCase: 'normal',
  gaps: { entry: 5, section: 10 },
}

const QUESTION: Record<SectionKind, string> = {
  summary: 'Hi! Could you tell me a bit about yourself?',
  experience: 'Great. Where have you worked so far?',
  education: 'What did you study?',
  projects: 'Any projects you are proud of?',
  skills: 'Which tools and skills do you bring?',
  certifications: 'Do you hold any certifications?',
  languages: 'Which languages do you speak?',
  awards: 'Any awards or recognition?',
  publications: 'Have you published anything?',
  volunteering: 'Do you volunteer anywhere?',
  references: 'Who can we talk to about you?',
  interests: 'What do you enjoy outside work?',
  custom: 'Anything else you would like to share?',
}

// deterministic "sent at" time: a few minutes per section, one per message
const stamp = (section: number, message: number) => {
  const m = 41 + section * 7 + message
  return `${9 + Math.floor(m / 60)}:${String(m % 60).padStart(2, '0')}`
}

const Ticks = () => (
  <svg className="ch-ticks" viewBox="0 0 18 10" aria-hidden="true">
    <path d="M1 5.5l3 3L10 1.5M7 8.5l1 0L15.5 1.5" />
  </svg>
)

const Meta = ({ at, out = true }: { at: string; out?: boolean }) => (
  <span className="ch-meta" aria-hidden="true">
    {at}
    {out && <Ticks />}
  </span>
)

const heading = (s: SectionView, at: string) => (
  <div className="ch-in">
    <span className="ch-in__avatar" aria-hidden="true">
      HR
    </span>
    <div className="ch-bubble ch-bubble--in">
      <span className="ch-in__q" aria-hidden="true">
        {QUESTION[s.kind]}
      </span>
      <h2 className="ch-h">{s.title}</h2>
      <Meta at={at} out={false} />
    </div>
  </div>
)

const out = (at: string, node: ReactNode, cls = '') => (
  <div className="ch-out">
    <div className={`ch-bubble ch-bubble--out ${cls}`}>
      {node}
      <Meta at={at} />
    </div>
  </div>
)

function card(e: EntryView, at: string): ReactNode {
  const where = [e.subtitle, e.location].filter(Boolean).join(' · ')
  return out(
    at,
    <>
      <div className="ch-card__top">
        <h3 className="ch-card__title">{e.title}</h3>
        {e.date && <span className="ch-card__date">{e.date}</span>}
      </div>
      {where && <div className="ch-card__where">{where}</div>}
      {e.url && <EntryLink entry={e} className="ch-card__link" />}
      {e.description && <Rich as="p" className="ch-card__desc" text={e.description} />}
      {e.bullets.length > 0 && (
        <ul className="ch-card__list">
          {e.bullets.map((t, i) => (
            <li key={i}>
              <Rich text={t} />
            </li>
          ))}
        </ul>
      )}
      {e.keywords.length > 0 && (
        <div className="ch-chips">
          {e.keywords.map((k) => (
            <span key={k} className="ch-chip">
              {k}
            </span>
          ))}
        </div>
      )}
      {e.meta && <div className="ch-card__meta">{e.meta}</div>}
    </>,
  )
}

function skill(e: EntryView, at: string): ReactNode {
  return out(
    at,
    <>
      <div className="ch-card__top">
        <h3 className="ch-card__title">{e.title}</h3>
        {e.levelLabel && <span className="ch-card__date">{e.levelLabel}</span>}
      </div>
      {e.keywords.length > 0 && (
        <div className="ch-chips">
          {e.keywords.map((k) => (
            <span key={k} className="ch-chip">
              {k}
            </span>
          ))}
        </div>
      )}
    </>,
    'ch-bubble--skills',
  )
}

export default function Chat({ data, design, main }: TemplateProps) {
  const b = data.basics
  const name = displayName(b)
  const vars = { '--ch-wall': '#efe9df', '--ch-bar': 'var(--rf-accent)', '--ch-in': '#ffffff', '--ch-ink': '#1b1f1d' } as CSSProperties

  const header = (
    <header className="ch-head">
      <div className="ch-bar">
        <svg className="ch-bar__back" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M15 5l-7 7 7 7" />
        </svg>
        {hasPhoto(b, design) ? <Photo basics={b} size="13mm" shape="circle" className="ch-avatar" /> : <span className="ch-avatar ch-avatar--txt">{initials(name)}</span>}
        <div className="ch-bar__who">
          <h1 className="ch-name">{name}</h1>
          <div className="ch-status">
            <span className="ch-dot" aria-hidden="true" />
            online{b.title.trim() && <> · {b.title}</>}
          </div>
        </div>
        <svg className="ch-bar__icon" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M3 7h12v10H3zM15 10l6-3v10l-6-3" />
        </svg>
        <svg className="ch-bar__icon" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M5 3h4l2 5-3 2a11 11 0 006 6l2-3 5 2v4a2 2 0 01-2 2A17 17 0 013 5a2 2 0 012-2z" />
        </svg>
      </div>
      <div className="ch-day" aria-hidden="true">
        <span>Today</span>
      </div>
      <div className="ch-pinned">
        <span className="ch-pinned__label">Shared contact</span>
        <ContactList basics={b} layout="inline" separator="" className="ch-contact" itemClassName="ch-contact__item" iconSize="0.95em" />
      </div>
    </header>
  )

  const n = (s: SectionView) => main.indexOf(s)
  const blocks = sectionsToBlocks(main, {
    heading: (s) => heading(s, stamp(n(s), 0)),
    summary: (s) => out(stamp(n(s), 2), <RichParagraphs className="ch-text" text={s.content} />),
    entry: (e, s, i) => (e.kind === 'skills' ? skill(e, stamp(n(s), 2 + i)) : card(e, stamp(n(s), 2 + i * 2))),
    whole: (s) => {
      if (s.kind === 'skills') return undefined
      const node = compactWhole(s, 'ch-compact')
      return node === undefined ? undefined : out(stamp(n(s), 2), node)
    },
  })

  return (
    <PageLayout
      header={header}
      main={blocks}
      bottom={mmToPx(design.margin * 0.6 + 14)}
      page={({ index, count, header, main }) => (
        <div className="ch-page" style={vars}>
          {header ?? (
            <div className="ch-run" aria-hidden="true">
              <span>{name}</span>
              <span>
                {index + 1} / {count}
              </span>
            </div>
          )}
          <div className="ch-thread">{main}</div>
          {index === count - 1 && (
            <div className="ch-composer" aria-hidden="true">
              <span className="ch-composer__field">Type a message</span>
              <span className="ch-composer__send">
                <svg viewBox="0 0 24 24">
                  <path d="M3 20l18-8L3 4v6l12 2-12 2z" />
                </svg>
              </span>
            </div>
          )}
        </div>
      )}
    />
  )
}
