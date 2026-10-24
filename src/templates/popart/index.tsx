/**
 * Pop Art — comic-book energy, kept legible. The header is a yellow panel with Ben-Day halftone dots
 * and a heavy black outline; the name sits on a white caption card with a hard black offset, the title
 * in a speech balloon, and a starburst carries the initials. Section headings are outlined caption
 * boxes that cycle magenta, cyan and yellow. Body text stays black on white. Single column.
 */
import type { CSSProperties } from 'react'
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
  initials,
  sectionsToBlocks,
  type SectionView,
  type TemplateMeta,
  type TemplateProps,
} from '../shared'
import './popart.css'

export const meta: TemplateMeta = {
  id: 'popart',
  name: 'Pop Art',
  description: 'Heavy black outlines, Ben-Day halftone dots and vibrant comic-book colours, with caption-box headings and a starburst.',
  tags: ['Creative', 'Photo'],
  order: 270,
  supportsPhoto: true,
  columns: 1,
  defaultFont: 'montserrat',
  defaultAccent: '#e5007d',
  headingCase: 'upper',
  gaps: { entry: 9, section: 15 },
}

const TONES = ['magenta', 'cyan', 'yellow'] as const

/** 16-point comic starburst. */
function Burst({ text }: { text: string }) {
  const pts: string[] = []
  for (let i = 0; i < 32; i++) {
    const r = i % 2 ? 31 : 48
    const a = (i * Math.PI) / 16 - Math.PI / 2
    pts.push(`${(50 + Math.cos(a) * r).toFixed(1)},${(50 + Math.sin(a) * r).toFixed(1)}`)
  }
  return (
    <svg className="pa-burst" viewBox="0 0 100 100" aria-hidden="true">
      <polygon points={pts.join(' ')} />
      <text x="50" y="50" dominantBaseline="central" textAnchor="middle">
        {text}
      </text>
    </svg>
  )
}

export default function PopArt({ data, design, main }: TemplateProps) {
  const b = data.basics
  const name = displayName(b)
  const tone = new Map(main.map((s, i) => [s.id, TONES[i % 3]]))
  const vars = { '--pa-cyan': '#00a0e3', '--pa-yellow': '#ffd400', '--pa-ink': '#111' } as CSSProperties

  const header = (
    <header className="pa-header">
      <div className="pa-header__text">
        <h1 className="pa-name">{name}</h1>
        {b.title.trim() && <div className="pa-balloon">{b.title}</div>}
      </div>
      {hasPhoto(b, design) ? <Photo basics={b} size="27mm" className="pa-photo" /> : <Burst text={initials(name)} />}
    </header>
  )

  const heading = (s: SectionView) => (
    <h2 className={`pa-h pa-h--${tone.get(s.id) ?? 'magenta'}`}>
      <span>{s.title}</span>
    </h2>
  )

  const blocks = sectionsToBlocks(main, {
    heading,
    summary: (s) => <RichParagraphs className="pa-summary" text={s.content} />,
    entry: (e) => compactEntry(e) ?? <DefaultEntry entry={e} variant="main" marker="square" />,
    whole: (s) => compactWhole(s, 'pa-compact'),
  })

  return (
    <PageLayout
      header={header}
      main={blocks}
      page={({ index, header, main }) => (
        <div className="pa-page" style={vars}>
          {header}
          {index === 0 && <ContactList basics={b} layout="inline" className="pa-contact" iconSize="0.95em" />}
          {index > 0 && <div className="pa-strip" aria-hidden="true" />}
          {main}
        </div>
      )}
    />
  )
}
