/**
 * Geometric — mathematical symmetry. A mirrored frieze of triangles and circles frames a centred
 * header; section headings sit centred between two rules with a diamond at each end; a fine dot grid
 * runs under the whole page and a matching frieze closes every page. Entries stay left-aligned so
 * they read quickly. Single column with compact rows for short sections.
 */
import type { ReactNode } from 'react'
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
  sectionsToBlocks,
  type SectionView,
  type TemplateMeta,
  type TemplateProps,
} from '../shared'
import './geometric.css'

export const meta: TemplateMeta = {
  id: 'geometric',
  name: 'Geometric',
  description: 'Symmetrical friezes of triangles and circles, a fine dot grid and centred diamond headings over a clean single column.',
  tags: ['Creative', 'Modern', 'Photo'],
  order: 260,
  supportsPhoto: true,
  columns: 1,
  defaultFont: 'montserrat',
  defaultAccent: '#0f766e',
  headingCase: 'upper',
  gaps: { entry: 9, section: 15 },
}

/** A symmetric strip: triangles alternating up/down on each side of a central ringed circle. */
function Frieze({ className }: { className: string }) {
  const half: ReactNode[] = []
  for (let i = 0; i < 9; i++) {
    const x = 6 + i * 11
    half.push(<path key={i} className={i % 2 ? 'gm-tri gm-tri--soft' : 'gm-tri'} d={i % 2 ? `M${x} 2H${x + 10}L${x + 5} 14Z` : `M${x} 14H${x + 10}L${x + 5} 2Z`} />)
  }
  return (
    <svg className={className} viewBox="0 0 300 16" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
      <g>{half}</g>
      <g transform="translate(300 0) scale(-1 1)">{half}</g>
      <circle className="gm-dot" cx="122" cy="8" r="2.5" />
      <circle className="gm-dot" cx="178" cy="8" r="2.5" />
      <circle className="gm-dot" cx="150" cy="8" r="7" />
      <circle className="gm-ring" cx="150" cy="8" r="3" />
    </svg>
  )
}

const heading = (s: SectionView) => (
  <h2 className="gm-h">
    <span className="gm-h__rule" />
    <span className="gm-h__text">{s.title}</span>
    <span className="gm-h__rule" />
  </h2>
)

export default function Geometric({ data, design, main }: TemplateProps) {
  const b = data.basics

  const header = (
    <header className="gm-header">
      <Frieze className="gm-frieze" />
      {hasPhoto(b, design) && <Photo basics={b} size="24mm" className="gm-photo" />}
      <h1 className="gm-name">{displayName(b)}</h1>
      {b.title.trim() && <div className="gm-title">{b.title}</div>}
      <ContactList basics={b} layout="inline" className="gm-contact" iconSize="0.9em" />
    </header>
  )

  const blocks = sectionsToBlocks(main, {
    heading,
    summary: (s) => <RichParagraphs className="gm-summary" text={s.content} />,
    entry: (e) => compactEntry(e) ?? <DefaultEntry entry={e} variant="main" marker="square" />,
    whole: (s) => compactWhole(s, 'gm-compact'),
  })

  return (
    <PageLayout
      header={header}
      main={blocks}
      page={({ header, main }) => (
        <div className="gm-page">
          {header}
          {main}
          <Frieze className="gm-frieze gm-frieze--foot" />
        </div>
      )}
    />
  )
}
