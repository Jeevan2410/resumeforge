/**
 * Skills-first — a functional résumé that leads with what you can do. A dark header band carries the
 * name, title and contact line; the summary follows as a profile panel with an accent rule. Skills come
 * next as a "core competencies" grid, three cards per row, each with the group name, a segmented level
 * meter and its keywords as a checklist. Experience, education and the rest follow as a condensed
 * career history. Without a skills section the layout falls back to a plain single column.
 */
import type { CSSProperties, ReactNode } from 'react'
import {
  ContactList,
  DefaultEntry,
  LevelSegments,
  PageLayout,
  Photo,
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
import './skillsfirst.css'

export const meta: TemplateMeta = {
  id: 'skillsfirst',
  name: 'Skills-first',
  description: 'A functional résumé: a core-competencies grid of skill cards with level meters up front, then a condensed career history.',
  tags: ['Modern', 'Classic', 'Photo'],
  order: 520,
  supportsPhoto: true,
  columns: 1,
  defaultFont: 'montserrat',
  defaultAccent: '#14866d',
  headingCase: 'upper',
  gaps: { entry: 9, section: 16 },
}

/** Three cards per row; exactly four groups sit on one row instead of leaving a lone card. */
const perRow = (n: number) => (n === 4 ? 4 : 3)

const heading = (s: SectionView) => (
  <h2 className="sf-h">
    <span className="sf-h__text">{s.title}</span>
    <span className="sf-h__rule" />
  </h2>
)

function Card({ e }: { e: EntryView }) {
  return (
    <article className="sf-card">
      <h3 className="sf-card__title">{e.title}</h3>
      {e.level > 0 && (
        <div className="sf-card__level">
          <LevelSegments level={e.level} label={e.levelLabel} className="sf-card__meter" height="0.38em" gap="0.18em" />
          {e.levelLabel && <span className="sf-card__label">{e.levelLabel}</span>}
        </div>
      )}
      {e.keywords.length > 0 && (
        <ul className="sf-card__list">
          {e.keywords.map((k, i) => (
            <li key={i}>{k}</li>
          ))}
        </ul>
      )}
      {e.description && <RichParagraphs className="sf-card__desc" text={e.description} />}
    </article>
  )
}

/** Skills as rows of three cards (one pagination block per row; the heading rides on the first). */
function competencyRows(s: SectionView): Block[] {
  const rows: Block[] = []
  const n = perRow(s.entries.length)
  for (let i = 0; i < s.entries.length; i += n) {
    const group = s.entries.slice(i, i + n)
    rows.push({
      key: `${s.id}:${group[0].id}`,
      sectionId: s.id,
      entryId: group[0].id,
      gap: i + n >= s.entries.length ? 'section' : 'entry',
      node: (
        <>
          {i === 0 && heading(s)}
          <div className={n === 4 ? 'sf-grid sf-grid--4' : 'sf-grid'}>
            {group.map((e) => (
              <Card key={e.id} e={e} />
            ))}
          </div>
        </>
      ),
    })
  }
  return rows
}

const entry = (e: EntryView): ReactNode => compactEntry(e) ?? <DefaultEntry entry={e} variant="main" />

export default function SkillsFirst({ data, design, main }: TemplateProps) {
  const b = data.basics
  const vars = { '--sf-ink': '#17212b', '--sf-soft': '#f1f5f4' } as CSSProperties

  // the profile and the skills move to the top; everything else keeps the user's order
  const profile = main.filter((s) => s.kind === 'summary')
  const skills = main.filter((s) => s.kind === 'skills')
  const rest = main.filter((s) => s.kind !== 'summary' && s.kind !== 'skills')

  const header = (
    <header className="sf-header">
      {hasPhoto(b, design) && <Photo basics={b} size="24mm" className="sf-photo" />}
      <div className="sf-header__text">
        <h1 className="sf-name">{displayName(b)}</h1>
        {b.title.trim() && <div className="sf-title">{b.title}</div>}
        <ContactList basics={b} layout="inline" className="sf-contact" iconSize="0.9em" />
      </div>
    </header>
  )

  const render = {
    heading,
    summary: (s: SectionView) => <RichParagraphs className="sf-profile" text={s.content} />,
    entry,
    whole: (s: SectionView) => compactWhole(s, 'sf-compact'),
  }
  const blocks: Block[] = [
    ...sectionsToBlocks(profile, render),
    ...skills.flatMap((s) => (s.entries.length ? competencyRows(s) : sectionsToBlocks([s], render))),
    ...sectionsToBlocks(rest, render),
  ]

  return (
    <PageLayout
      header={header}
      main={blocks}
      page={({ header, main }) => (
        <div className="sf-page" style={vars}>
          {header}
          <div className="sf-body">{main}</div>
        </div>
      )}
    />
  )
}
