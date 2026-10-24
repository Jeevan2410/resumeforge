/**
 * Portfolio — a projects-first résumé for designers, developers and makers. Page 1 opens with a large
 * name, the title and the contact line, then the summary as a short intro. Projects come next as a
 * grid of tiles, two per row: each has a colour cover with its number and initial, the title, link,
 * description and stack chips. Experience, skills and the rest follow in compact form below. When
 * there is no projects section the layout falls back to a clean single column.
 */
import type { CSSProperties, ReactNode } from 'react'
import {
  ContactList,
  DefaultEntry,
  EntryLink,
  Keywords,
  PageLayout,
  Photo,
  Rich,
  RichParagraphs,
  compactEntry,
  compactWhole,
  displayName,
  hasPhoto,
  sectionsToBlocks,
  type Block,
  type EntryView,
  type SectionView,
  type TemplateMeta,
  type TemplateProps,
} from '../shared'
import './portfolio.css'

export const meta: TemplateMeta = {
  id: 'portfolio',
  name: 'Portfolio',
  description: 'Projects first: a grid of project tiles with colour covers, links and stack chips, followed by a compact experience and skills section.',
  tags: ['Modern', 'Creative', 'Photo'],
  order: 510,
  collection: 'format',
  supportsPhoto: true,
  columns: 1,
  defaultFont: 'inter',
  defaultAccent: '#ff5c39',
  headingCase: 'normal',
  gaps: { entry: 10, section: 16 },
}

const COVERS = ['a', 'b', 'c', 'd'] as const

const heading = (s: SectionView) => (
  <h2 className="pf-h">
    <span>{s.title}</span>
    {s.kind === 'projects' && <span className="pf-h__count">{String(s.entries.length).padStart(2, '0')}</span>}
  </h2>
)

function Tile({ e, n }: { e: EntryView; n: number }) {
  return (
    <article className={`pf-tile pf-tile--${COVERS[n % COVERS.length]}`}>
      <div className="pf-cover" aria-hidden="true">
        <span className="pf-cover__n">{String(n + 1).padStart(2, '0')}</span>
        <span className="pf-cover__letter">{(e.title.trim()[0] ?? '•').toUpperCase()}</span>
      </div>
      <div className="pf-tile__body">
        <h3 className="pf-tile__title">{e.title}</h3>
        {(e.subtitle || e.date) && <div className="pf-tile__meta">{[e.subtitle, e.date].filter(Boolean).join(' · ')}</div>}
        {e.url && <EntryLink entry={e} className="pf-tile__link" />}
        {e.description && <Rich as="div" className="pf-tile__desc" text={e.description} />}
        {e.bullets.length > 0 && (
          <ul className="pf-tile__bullets">
            {e.bullets.map((t, i) => (
              <li key={i}>
                <Rich text={t} />
              </li>
            ))}
          </ul>
        )}
        {e.keywords.length > 0 && <Keywords items={e.keywords} variant="chips" className="pf-chips" chipClassName="pf-chip" />}
      </div>
    </article>
  )
}

/** Projects as rows of two tiles (one pagination block per row; the heading rides on the first). */
function projectRows(s: SectionView): Block[] {
  const rows: Block[] = []
  for (let i = 0; i < s.entries.length; i += 2) {
    const pair = s.entries.slice(i, i + 2)
    const last = i + 2 >= s.entries.length
    rows.push({
      key: `${s.id}:${pair[0].id}`,
      sectionId: s.id,
      entryId: pair[0].id,
      gap: last ? 'section' : 'entry',
      node: (
        <>
          {i === 0 && heading(s)}
          <div className="pf-row">
            {pair.map((e, k) => (
              <Tile key={e.id} e={e} n={i + k} />
            ))}
          </div>
        </>
      ),
    })
  }
  return rows
}

const entry = (e: EntryView): ReactNode => compactEntry(e) ?? <DefaultEntry entry={e} variant="main" />

export default function Portfolio({ data, design, main }: TemplateProps) {
  const b = data.basics
  const vars = { '--pf-ink': '#15171c', '--pf-soft': '#f4f3f0' } as CSSProperties

  // projects move up to follow the intro; everything else keeps the user's order
  const intro = main.filter((s) => s.kind === 'summary')
  const projects = main.filter((s) => s.kind === 'projects')
  const rest = main.filter((s) => s.kind !== 'summary' && s.kind !== 'projects')

  const header = (
    <header className="pf-header">
      <div className="pf-header__text">
        <h1 className="pf-name">{displayName(b)}</h1>
        {b.title.trim() && <div className="pf-title">{b.title}</div>}
        <ContactList basics={b} layout="inline" className="pf-contact" iconSize="0.9em" />
      </div>
      {hasPhoto(b, design) && <Photo basics={b} size="28mm" shape="rounded" className="pf-photo" />}
    </header>
  )

  const render = {
    heading,
    summary: (s: SectionView) => <RichParagraphs className="pf-intro" text={s.content} />,
    entry,
    whole: (s: SectionView) => compactWhole(s, 'pf-compact'),
  }
  const blocks: Block[] = [...sectionsToBlocks(intro, render), ...projects.flatMap(projectRows), ...sectionsToBlocks(rest, render)]

  return (
    <PageLayout
      header={header}
      main={blocks}
      page={({ header, main }) => (
        <div className="pf-page" style={vars}>
          {header}
          <div className="pf-body">{main}</div>
        </div>
      )}
    />
  )
}
