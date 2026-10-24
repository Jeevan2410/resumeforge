/**
 * Y2K / Cyber — millennium tech-optimism. An iridescent header with a liquid-chrome name, a glossy
 * gel-bubble title pill and pixel sparkles; glossy bubble headings; a frosted pearl side column with
 * pixel-block skill meters. All colour and gloss sits behind short labels; body copy stays dark on
 * white. Main column first in the DOM.
 */
import type { CSSProperties, ReactNode } from 'react'
import {
  ContactList,
  DefaultEntry,
  LevelSegments,
  PageLayout,
  Photo,
  RichParagraphs,
  contactEntries,
  displayName,
  hasPhoto,
  inlineWhole,
  sectionsToBlocks,
  type Block,
  type EntryView,
  type SectionView,
  type TemplateMeta,
  type TemplateProps,
} from '../shared'
import './y2k.css'

export const meta: TemplateMeta = {
  id: 'y2k',
  name: 'Y2K',
  description: 'Liquid-chrome lettering, glossy gel bubbles, pixel sparkles and iridescent panels, in a tidy two-column layout.',
  tags: ['Creative', 'Two-column', 'Photo'],
  order: 320,
  supportsPhoto: true,
  columns: 2,
  defaultFont: 'montserrat',
  defaultAccent: '#2f5bff',
  sideKinds: ['skills', 'languages', 'certifications', 'awards', 'interests', 'references'],
  headingCase: 'upper',
  gaps: { entry: 10, section: 17 },
}

/** 7×7 pixel sparkle (decorative). */
function Pixel({ className }: { className: string }) {
  const on = ['3,0', '3,1', '3,2', '0,3', '1,3', '2,3', '3,3', '4,3', '5,3', '6,3', '3,4', '3,5', '3,6', '2,2', '4,2', '2,4', '4,4']
  return (
    <svg className={className} viewBox="0 0 7 7" shapeRendering="crispEdges" aria-hidden="true">
      {on.map((p) => {
        const [x, y] = p.split(',')
        return <rect key={p} x={x} y={y} width="1" height="1" className={p === '3,3' ? 'yk-px--core' : undefined} />
      })}
    </svg>
  )
}

function SideSkill({ e }: { e: EntryView }) {
  return (
    <div className="rf-entry rf-entry--skills rf-entry--side rf-skill yk-skill">
      {e.title && <div className="rf-skill__name">{e.title}</div>}
      {e.level > 0 && <LevelSegments level={e.level} label={e.levelLabel} className="yk-skill__bar" height="0.5em" gap="0.18em" />}
      {e.keywords.length > 0 && <div className="rf-skill__keywords">{e.keywords.join(', ')}</div>}
    </div>
  )
}

const mainHeading = (s: SectionView) => (
  <h2 className="yk-h">
    <span className="yk-bubble">{s.title}</span>
    <span className="yk-h__line" />
  </h2>
)
const sideHeading = (s: SectionView | string) => <h3 className="yk-sh">{typeof s === 'string' ? s : s.title}</h3>

function sideEntry(e: EntryView): ReactNode {
  if (e.kind === 'skills') return <SideSkill e={e} />
  return <DefaultEntry entry={e} variant="side" />
}

export default function Y2K({ data, design, main, side }: TemplateProps) {
  const b = data.basics
  const vars = { '--yk-lilac': '#c9b6ff', '--yk-aqua': '#9ef0ff', '--yk-pink': '#ffc4ec', '--yk-ink': '#141a33' } as CSSProperties

  const header = (
    <header className="yk-header">
      <Pixel className="yk-px yk-px--a" />
      <Pixel className="yk-px yk-px--b" />
      <Pixel className="yk-px yk-px--c" />
      {hasPhoto(b, design) && <Photo basics={b} size="26mm" className="yk-photo" />}
      <div className="yk-header__text">
        <h1 className="yk-name">{displayName(b)}</h1>
        {b.title.trim() && <div className="yk-pill">{b.title}</div>}
      </div>
    </header>
  )

  const mainBlocks = sectionsToBlocks(main, {
    heading: mainHeading,
    summary: (s) => <RichParagraphs className="yk-summary" text={s.content} />,
    entry: (e) => <DefaultEntry entry={e} variant="main" />,
  })

  const sideBlocks: Block[] = []
  if (contactEntries(b).length) {
    sideBlocks.push({ key: 'contact', gap: 'section', letter: true, node: <>{sideHeading('Contact')}<ContactList basics={b} layout="stack" className="yk-contact" /></> })
  }
  sideBlocks.push(...sectionsToBlocks(side, { heading: sideHeading, entry: sideEntry, whole: (s) => (s.kind === 'interests' ? inlineWhole(s, 'yk-inline') : undefined) }))

  return (
    <PageLayout
      header={header}
      main={mainBlocks}
      side={sideBlocks}
      page={({ header, main, side }) => (
        <div className="yk-page" style={vars}>
          {header}
          <div className="yk-cols">
            <div className="yk-main">{main}</div>
            <aside className="yk-side">{side}</aside>
          </div>
        </div>
      )}
    />
  )
}
