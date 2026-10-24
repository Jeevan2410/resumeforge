/**
 * Pop Art — the page is a comic-book page. A wide splash panel (yellow, Ben-Day halftone dots) holds
 * the name on a tilted caption card, the title in a speech balloon and a starburst; below it the
 * content runs as a grid of outlined panels in two gutters: every section is one panel with its title
 * in a caption box on the top edge (magenta, cyan, yellow in turn), and the narrow right gutter holds
 * contact and skills panels on a cyan halftone. Panels continue across pages like a strip.
 */
import type { CSSProperties, ReactNode } from 'react'
import {
  ContactList,
  DefaultEntry,
  PageLayout,
  Photo,
  RichParagraphs,
  compactEntry,
  compactWhole,
  contactEntries,
  inlineWhole,
  displayName,
  hasPhoto,
  initials,
  sectionsToBlocks,
  type Block,
  type SectionView,
  type TemplateMeta,
  type TemplateProps,
} from '../shared'
import './popart.css'

export const meta: TemplateMeta = {
  id: 'popart',
  name: 'Pop Art',
  description: 'A comic-book page: a halftone splash panel with a starburst, then every section framed as an outlined comic panel with a caption box.',
  tags: ['Creative', 'Two-column', 'Photo'],
  order: 270,
  collection: 'style',
  supportsPhoto: true,
  columns: 2,
  defaultFont: 'montserrat',
  defaultAccent: '#e5007d',
  sideKinds: ['skills', 'languages', 'certifications', 'awards', 'interests', 'references'],
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

/** Each section becomes one outlined panel: blocks inside a section touch (no gap) and the CSS draws
 * the panel's top edge on the first block and its bottom edge on the last. */
const panel = (node: ReactNode, info: { first: boolean; last: boolean }) => (
  <div className={`pa-panel${info.first ? ' pa-panel--first' : ''}${info.last ? ' pa-panel--last' : ''}`}>{node}</div>
)
const joined = (blocks: Block[]): Block[] => blocks.map((b) => (b.gap === 'entry' ? { ...b, gap: 'none' } : b))

export default function PopArt({ data, design, main, side }: TemplateProps) {
  const b = data.basics
  const name = displayName(b)
  const tone = new Map([...main, ...side].map((s, i) => [s.id, TONES[i % 3]]))
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

  const heading = (s: SectionView | string) => {
    const t = typeof s === 'string' ? 'yellow' : (tone.get(s.id) ?? 'magenta')
    return (
      <h2 className={`pa-h pa-h--${t}`}>
        <span>{typeof s === 'string' ? s : s.title}</span>
      </h2>
    )
  }

  const mainBlocks = joined(
    sectionsToBlocks(main, {
      heading,
      summary: (s) => <RichParagraphs className="pa-summary" text={s.content} />,
      entry: (e) => compactEntry(e) ?? <DefaultEntry entry={e} variant="main" marker="square" />,
      whole: (s) => compactWhole(s, 'pa-compact'),
      wrap: panel,
    }),
  )

  const sideBlocks: Block[] = []
  if (contactEntries(b).length) {
    sideBlocks.push({ key: 'contact', gap: 'section', letter: true, node: panel(<>{heading('Contact')}<ContactList basics={b} layout="stack" className="pa-contact" iconSize="0.95em" /></>, { first: true, last: true }) })
  }
  sideBlocks.push(
    ...joined(
      sectionsToBlocks(side, {
        heading,
        entry: (e) => compactEntry(e) ?? <DefaultEntry entry={e} variant="side" level={e.kind === 'skills' ? 'bar' : undefined} />,
        whole: (s) => (s.kind === 'interests' ? inlineWhole(s, 'pa-compact') : undefined),
        wrap: panel,
      }),
    ),
  )

  return (
    <PageLayout
      header={header}
      main={mainBlocks}
      side={sideBlocks}
      page={({ index, header, main, side }) => (
        <div className="pa-page" style={vars}>
          {header}
          {index > 0 && <div className="pa-strip" aria-hidden="true" />}
          <div className="pa-cols">
            <div className="pa-main">{main}</div>
            <aside className="pa-side">{side}</aside>
          </div>
        </div>
      )}
    />
  )
}
