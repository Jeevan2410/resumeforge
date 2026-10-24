/**
 * Magazine — page 1 opens with a magazine cover: a full-bleed cover image (the photo, or bold cover
 * art made from the initials), a giant masthead, the name as the cover star with the job title as a
 * tagline, cover lines drawn from the résumé (an exclusive from the latest role, the current job,
 * the size of the toolkit) and an "In this issue" contents strip with the contact details. The rest
 * reads as the feature inside: numbered section openers with a kicker, the summary as a pull quote,
 * roles as feature stories, skills as a toolkit grid, and a folio on every page. Single column.
 */
import type { CSSProperties } from 'react'
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
  useFont,
  type EntryView,
  type SectionView,
  type TemplateMeta,
  type TemplateProps,
} from '../shared'
import './magazine.css'

export const meta: TemplateMeta = {
  id: 'magazine',
  name: 'Magazine',
  description: 'Your résumé as a magazine: a cover with a giant masthead, you as the cover star and cover lines from your career, then the feature story inside.',
  tags: ['Creative', 'Photo'],
  order: 650,
  collection: 'format',
  supportsPhoto: true,
  columns: 1,
  defaultFont: 'montserrat',
  defaultAccent: '#e5007d',
  headingCase: 'normal',
  gaps: { entry: 9, section: 14 },
}

const KICKER: Record<SectionKind, string> = {
  summary: 'In their own words',
  experience: 'Cover story',
  education: 'Back to school',
  projects: 'Made by hand',
  skills: 'The toolkit',
  certifications: 'Credentials',
  languages: 'Lost in translation',
  awards: 'Hall of fame',
  publications: 'In print',
  volunteering: 'Giving back',
  references: 'They said it',
  interests: 'Off duty',
  custom: 'Also inside',
}

/** Plain text of a markdown-ish line, cut to a cover-line length. */
const plain = (t: string, max = 78) => {
  const s = t.replace(/[*_`[\]]/g, '').replace(/\(https?:[^)]*\)/g, '').trim()
  return s.length > max ? `${s.slice(0, max - 1).replace(/\s+\S*$/, '')}…` : s
}

function story(e: EntryView) {
  const meta = [e.subtitle, e.location, e.date].filter(Boolean)
  return (
    <article className="mg-story">
      <h3 className="mg-story__title">{e.title}</h3>
      {meta.length > 0 && <div className="mg-story__meta">{meta.join('  /  ')}</div>}
      {e.url && <EntryLink entry={e} className="mg-story__link" />}
      {e.description && <Rich as="p" className="mg-story__desc" text={e.description} />}
      {e.bullets.length > 0 && (
        <ul className="mg-story__list">
          {e.bullets.map((t, i) => (
            <li key={i}>
              <Rich text={t} />
            </li>
          ))}
        </ul>
      )}
      {e.keywords.length > 0 && <div className="mg-story__kw">{e.keywords.join(' · ')}</div>}
      {e.meta && <div className="mg-story__kw">{e.meta}</div>}
    </article>
  )
}

function toolkit(s: SectionView) {
  return (
    <div className="mg-kit">
      {s.entries.map((e) => (
        <div key={e.id} className="mg-kit__card">
          <div className="mg-kit__head">
            <b>{e.title}</b>
            {e.levelLabel && <span>{e.levelLabel}</span>}
          </div>
          {e.keywords.length > 0 && <div className="mg-kit__kw">{e.keywords.join(' · ')}</div>}
        </div>
      ))}
    </div>
  )
}

export default function Magazine({ data, design, main }: TemplateProps) {
  useFont('playfair')
  const b = data.basics
  const name = displayName(b)
  const vars = { '--mg-ink': '#141414' } as CSSProperties
  const photo = hasPhoto(b, design)

  const sections = main.filter((s) => s.kind !== 'summary')
  const num = (s: SectionView) => String(sections.indexOf(s) + 1).padStart(2, '0')

  const job = main.find((s) => s.kind === 'experience')?.entries[0]
  const scoop = job?.bullets[0]
  const skillCount = main.filter((s) => s.kind === 'skills').reduce((n, s) => n + s.entries.reduce((m, e) => m + Math.max(1, e.keywords.length), 0), 0)
  const lines: { kicker: string; text: string }[] = []
  if (scoop) lines.push({ kicker: 'Exclusive', text: plain(scoop) })
  if (job) lines.push({ kicker: job.current ? 'Now' : 'Latest', text: [job.title, job.subtitle].filter(Boolean).join(' at ') })
  if (skillCount) lines.push({ kicker: 'Inside', text: `${skillCount} skills in the toolkit` })

  const [first, ...rest] = name.split(/\s+/)

  const header = (
    <header className="mg-cover-wrap">
      <div className={photo ? 'mg-cover mg-cover--photo' : 'mg-cover'}>
        {photo ? (
          <Photo basics={b} size="100%" shape="square" className="mg-cover__img" />
        ) : (
          <span className="mg-cover__art" aria-hidden="true">
            {initials(name)}
          </span>
        )}
        <div className="mg-mast" aria-hidden="true">
          <span className="mg-mast__title">Profile</span>
          <span className="mg-mast__issue">
            Issue 01
            <br />
            The career edition
          </span>
        </div>
        {lines.length > 0 && (
          <ul className="mg-lines" aria-hidden="true">
            {lines.map((l) => (
              <li key={l.kicker}>
                <small>{l.kicker}</small>
                {l.text}
              </li>
            ))}
          </ul>
        )}
        <div className="mg-star">
          <h1 className="mg-name">
            <span>{first}</span>
            {rest.length > 0 && <span>{rest.join(' ')}</span>}
          </h1>
          {b.title.trim() && <div className="mg-tagline">{b.title}</div>}
        </div>
      </div>
      <div className="mg-strip">
        <div className="mg-contents" aria-hidden="true">
          <b>In this issue</b>
          {sections.map((s) => (
            <span key={s.id}>
              <i>{num(s)}</i> {s.title}
            </span>
          ))}
        </div>
        <ContactList basics={b} layout="stack" className="mg-contact" iconSize="0.9em" />
      </div>
    </header>
  )

  const heading = (s: SectionView) =>
    s.kind === 'summary' ? (
      <h2 className="mg-quote-h">{s.title}</h2>
    ) : (
      <div className="mg-opener">
        <span className="mg-opener__num" aria-hidden="true">
          {num(s)}
        </span>
        <div>
          <span className="mg-opener__kicker" aria-hidden="true">
            {KICKER[s.kind]}
          </span>
          <h2 className="mg-h">{s.title}</h2>
        </div>
      </div>
    )

  const blocks = sectionsToBlocks(main, {
    heading,
    summary: (s) => (
      <blockquote className="mg-quote">
        <RichParagraphs text={s.content} />
      </blockquote>
    ),
    entry: story,
    whole: (s) => (s.kind === 'skills' ? toolkit(s) : compactWhole(s, 'mg-compact')),
  })

  return (
    <PageLayout
      header={header}
      main={blocks}
      page={({ index, count, header, main }) => (
        <div className="mg-page" style={vars}>
          {header ?? (
            <div className="mg-run" aria-hidden="true">
              <b>Profile</b> <span>The {name} feature</span>
            </div>
          )}
          <div className="mg-body">{main}</div>
          <div className="mg-folio" aria-hidden="true">
            <span>Profile · Issue 01</span>
            <span>
              {index + 1} / {count}
            </span>
          </div>
        </div>
      )}
    />
  )
}
