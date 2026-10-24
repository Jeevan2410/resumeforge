/**
 * Newspaper — the résumé as a broadsheet front page. Page 1 opens with a masthead (the name in a heavy
 * display serif between rules, with an edition line carrying the location and contact details), then
 * a banner headline (the job title) over the summary as the lead story, set in two justified columns
 * with a drop cap. Below, the page splits into the news column (experience, projects and the rest as
 * articles with headlines, bylines and datelines) and a narrow sidebar ("In brief": skills, languages,
 * certifications and so on), divided by a column rule. Later pages repeat a slim running head.
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
  inlineWhole,
  sectionsToBlocks,
  useFont,
  type Block,
  type EntryView,
  type SectionView,
  type TemplateMeta,
  type TemplateProps,
} from '../shared'
import './newspaper.css'

export const meta: TemplateMeta = {
  id: 'newspaper',
  name: 'Newspaper',
  description: 'Your résumé as a front page: a masthead with your name, a banner headline, the summary as the lead story and your roles as news articles.',
  tags: ['Creative', 'Two-column', 'Classic'],
  order: 600,
  collection: 'format',
  supportsPhoto: true,
  columns: 2,
  defaultFont: 'georgia',
  defaultAccent: '#b3261e',
  sideKinds: ['skills', 'languages', 'certifications', 'awards', 'interests', 'references'],
  headingCase: 'upper',
  gaps: { entry: 10, section: 14 },
}

const heading = (s: SectionView) => (
  <h2 className="np-h">
    <span>{s.title}</span>
  </h2>
)

const sideHeading = (s: SectionView) => <h2 className="np-sh">{s.title}</h2>

/** An entry as a news article: headline, byline, dateline, then the copy. */
function article(e: EntryView): ReactNode {
  const compact = compactEntry(e)
  if (compact && !e.bullets.length && !e.description) return compact
  return (
    <article className="np-art">
      <h3 className="np-art__head">{e.title}</h3>
      {(e.subtitle || e.location || e.date) && (
        <div className="np-art__by">
          {e.subtitle && <span className="np-art__org">{e.subtitle}</span>}
          {e.location && <span>{e.location}</span>}
          {e.date && <span className="np-art__date">{e.date}</span>}
        </div>
      )}
      {e.url && <EntryLink entry={e} className="np-art__link" />}
      {e.description && <Rich as="p" className="np-art__copy" text={e.description} />}
      {e.bullets.length > 0 && (
        <ul className="np-art__list">
          {e.bullets.map((t, i) => (
            <li key={i}>
              <Rich text={t} />
            </li>
          ))}
        </ul>
      )}
      {e.keywords.length > 0 && <div className="np-art__tags">{e.keywords.join(' · ')}</div>}
      {e.meta && <div className="np-art__tags">{e.meta}</div>}
    </article>
  )
}

function brief(e: EntryView): ReactNode {
  if (e.kind === 'skills') {
    return (
      <div className="np-brief">
        <span className="np-brief__head">{e.title}</span>
        {e.levelLabel && <span className="np-brief__lvl"> ({e.levelLabel})</span>}
        {e.keywords.length > 0 && <div className="np-brief__body">{e.keywords.join(', ')}</div>}
      </div>
    )
  }
  return (
    compactEntry(e) ?? (
      <div className="np-brief">
        <span className="np-brief__head">{e.title}</span>
        {(e.subtitle || e.date) && <div className="np-brief__body">{[e.subtitle, e.date].filter(Boolean).join(', ')}</div>}
      </div>
    )
  )
}

export default function Newspaper({ data, design, main, side }: TemplateProps) {
  useFont('playfair')
  const b = data.basics
  const name = displayName(b)
  const vars = { '--np-ink': '#1b1a17', '--np-paper': '#f7f3ea', '--np-rule': '#2b2925' } as CSSProperties

  const summary = main.find((s) => s.kind === 'summary')
  const rest = main.filter((s) => s !== summary)

  const header = (
    <header className="np-mast">
      <div className="np-ears" aria-hidden="true">
        <span>Vol. I · No. 1</span>
        <span>Late edition</span>
      </div>
      <h1 className="np-name">{name}</h1>
      <div className="np-edition">
        <ContactList basics={b} layout="inline" className="np-contact" separator="·" showIcons={false} />
      </div>
    </header>
  )

  const mainBlocks: Block[] = []
  if (b.title.trim() || summary) {
    mainBlocks.push({
      key: 'lead',
      sectionId: summary?.id,
      gap: 'section',
      node: (
        <div className="np-lead">
          {b.title.trim() && <div className="np-banner">{b.title}</div>}
          {hasPhoto(b, design) && (
            <figure className="np-fig">
              <Photo basics={b} size="30mm" shape="square" className="np-photo" />
              <figcaption>{name}</figcaption>
            </figure>
          )}
          {summary && (
            <div className={`np-lead__body${summary.content.length > 260 ? ' np-lead__body--cols' : ''}`}>
              <RichParagraphs className="np-lead__copy" text={summary.content} />
            </div>
          )}
        </div>
      ),
    })
  }
  mainBlocks.push(
    ...sectionsToBlocks(rest, {
      heading,
      entry: article,
      whole: (s) => compactWhole(s, 'np-compact'),
    }),
  )

  const sideBlocks = sectionsToBlocks(side, {
    heading: sideHeading,
    entry: brief,
    whole: (s) => (s.kind === 'languages' || s.kind === 'interests' ? inlineWhole(s, 'np-inline') : undefined),
  })

  return (
    <PageLayout
      header={header}
      main={mainBlocks}
      side={sideBlocks}
      page={({ index, header, main, side }) => (
        <div className="np-page" style={vars}>
          {header ?? (
            <div className="np-run" aria-hidden="true">
              <span>{name}</span>
              <span>Page {index + 1}</span>
            </div>
          )}
          <div className="np-cols">
            <div className="np-main">{main}</div>
            <aside className="np-side">
              {index === 0 && (
                <div className="np-side__label" aria-hidden="true">
                  In brief
                </div>
              )}
              {side}
            </aside>
          </div>
        </div>
      )}
    />
  )
}
