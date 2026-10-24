/**
 * Y2K — the résumé is an early-2000s desktop window. Each page is an iridescent aqua-lilac-pink desktop
 * with a glossy window on it: a chrome title bar with gel traffic-light buttons, a pale explorer pane
 * on the left (contact, skills, languages as "folders") and a white document area on the right that
 * opens on page 1 with a liquid-chrome name, a gel pill title and pixel sparkles. Headings are gel
 * bubbles. The window chrome is aria-hidden; the main column comes first in the DOM.
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
  description: 'Your résumé as an early-2000s desktop window: chrome title bar, gel buttons, an explorer pane and liquid-chrome lettering.',
  tags: ['Creative', 'Two-column', 'Photo'],
  order: 320,
  collection: 'style',
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
  const fileName = displayName(b).toLowerCase().replace(/\s+/g, '_')
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
      page={({ index, count, header, main, side }) => (
        <div className="yk-page" style={vars}>
          <div className="yk-window">
            <div className="yk-bar" aria-hidden="true">
              <span className="yk-dots">
                <i />
                <i />
                <i />
              </span>
              <span className="yk-bar__title">
                {fileName}.resume{count > 1 ? ` — ${index + 1}/${count}` : ''}
              </span>
              <Pixel className="yk-bar__px" />
            </div>
            <div className="yk-cols">
              <div className="yk-main">
                {header}
                {main}
              </div>
              <aside className="yk-side">{side}</aside>
            </div>
          </div>
        </div>
      )}
    />
  )
}
