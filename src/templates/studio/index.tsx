/**
 * Studio — the résumé laid out like a design tool. A dark toolbar runs across the top of every page
 * (tools, file name, collaborators, zoom). Below it a white layers panel on the left lists skills as
 * components, languages and interests as layers, plus contact details and the colour styles; the
 * dotted canvas on the right holds the work. Page 1 opens with a selected hero frame (blue outline,
 * corner handles, size badge and a collaborator cursor) around the name, and every section is its own
 * frame with the section name as the frame label. Main column first in the DOM.
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
  displayName,
  hasPhoto,
  initials,
  sectionsToBlocks,
  type Block,
  type EntryView,
  type SectionView,
  type TemplateMeta,
  type TemplateProps,
} from '../shared'
import './studio.css'

export const meta: TemplateMeta = {
  id: 'studio',
  name: 'Studio',
  description: 'Built like a design tool: a toolbar, a layers panel listing your skills as components, and every section as a frame on a dotted canvas.',
  tags: ['Modern', 'Creative', 'Two-column', 'Photo'],
  order: 540,
  collection: 'ui',
  supportsPhoto: true,
  columns: 2,
  defaultFont: 'inter',
  defaultAccent: '#0d99ff',
  sideKinds: ['skills', 'languages', 'interests', 'certifications', 'awards', 'references'],
  headingCase: 'normal',
  gaps: { entry: 7, section: 10 },
}

const SWATCHES = ['var(--rf-accent)', '#9747ff', '#f24e1e', '#ffc700', '#0acf83', '#1e1e1e']

const Frame = () => (
  <svg className="st-glyph" viewBox="0 0 12 12" aria-hidden="true">
    <path d="M3.5 1v10M8.5 1v10M1 3.5h10M1 8.5h10" />
  </svg>
)

const Component = () => (
  <svg className="st-glyph st-glyph--comp" viewBox="0 0 12 12" aria-hidden="true">
    <path d="M6 1l2 2-2 2-2-2zM6 7l2 2-2 2-2-2zM3 4l2 2-2 2-2-2zM9 4l2 2-2 2-2-2z" />
  </svg>
)

const Layer = () => (
  <svg className="st-glyph" viewBox="0 0 12 12" aria-hidden="true">
    <rect x="1.5" y="1.5" width="9" height="9" rx="1" />
  </svg>
)

function Toolbar({ name }: { name: string }) {
  return (
    <div className="st-bar" aria-hidden="true">
      <div className="st-bar__tools">
        <svg viewBox="0 0 16 16" className="st-tool st-tool--on">
          <path d="M4 2l9 5-4 1.2L7.2 12z" />
        </svg>
        <svg viewBox="0 0 16 16" className="st-tool">
          <path d="M5 2v12M11 2v12M2 5h12M2 11h12" />
        </svg>
        <svg viewBox="0 0 16 16" className="st-tool">
          <rect x="3" y="3" width="10" height="10" rx="1" />
        </svg>
        <svg viewBox="0 0 16 16" className="st-tool">
          <path d="M3 13l2-5 6-6 3 3-6 6zM9 4l3 3" />
        </svg>
        <svg viewBox="0 0 16 16" className="st-tool">
          <path d="M3 3h10M8 3v10" />
        </svg>
      </div>
      <div className="st-bar__file">
        <span className="st-bar__dim">Résumé /</span> {name}
      </div>
      <div className="st-bar__right">
        <span className="st-peer st-peer--a">{initials(name)}</span>
        <span className="st-peer st-peer--b">HR</span>
        <span className="st-share">Share</span>
        <span className="st-zoom">100%</span>
      </div>
    </div>
  )
}

/** A frame label (the section heading) above the frame. */
const heading = (s: SectionView) => (
  <h2 className="st-h">
    <Frame />
    {s.title}
  </h2>
)

/** One frame per section: blocks of a section join into one white frame. */
const frame = (node: ReactNode, info: { first: boolean; last: boolean }) => (
  <div className={`st-frame${info.first ? ' st-frame--first' : ''}${info.last ? ' st-frame--last' : ''}`}>{node}</div>
)

const sideHeading = (s: SectionView | string) => <h2 className="st-ph">{typeof s === 'string' ? s : s.title}</h2>

function sideEntry(e: EntryView): ReactNode {
  if (e.kind === 'skills') {
    return (
      <div className="rf-entry rf-entry--side st-comp">
        <div className="st-row st-row--comp">
          <Component />
          <span className="st-row__name">{e.title}</span>
          {e.levelLabel && <span className="st-row__tag">{e.levelLabel}</span>}
        </div>
        {e.keywords.length > 0 && (
          <ul className="st-comp__kids">
            {e.keywords.map((k, i) => (
              <li key={i} className="st-row">
                <Layer />
                <span>{k}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    )
  }
  return compactEntry(e) ?? <DefaultEntry entry={e} variant="side" />
}

function sideWhole(s: SectionView): ReactNode | undefined {
  if (s.kind !== 'languages' && s.kind !== 'interests') return undefined
  const rows = s.kind === 'interests' ? s.entries.flatMap((e) => (e.keywords.length ? e.keywords : [e.title])) : s.entries.map((e) => e.title)
  return (
    <ul className="st-layers">
      {rows.filter(Boolean).map((t, i) => (
        <li key={i} className="st-row">
          <span className="st-glyph st-glyph--text" aria-hidden="true">
            T
          </span>
          <span className="st-row__name">{t}</span>
          {s.kind === 'languages' && s.entries[i]?.levelLabel && <span className="st-row__tag">{s.entries[i].levelLabel}</span>}
        </li>
      ))}
    </ul>
  )
}

export default function Studio({ data, design, main, side }: TemplateProps) {
  const b = data.basics
  const name = displayName(b)
  const first = name.split(/\s+/)[0] || name
  const vars = { '--st-ink': '#1e1e1e', '--st-line': '#e6e6e6', '--st-canvas': '#f0f0f2', '--st-purple': '#9747ff' } as CSSProperties

  const header = (
    <header className="st-hero">
      <div className="st-h st-h--hero" aria-hidden="true">
        <Frame />
        Hero
      </div>
      <div className="st-hero__frame">
        <i className="st-handle st-handle--tl" />
        <i className="st-handle st-handle--tr" />
        <i className="st-handle st-handle--bl" />
        <i className="st-handle st-handle--br" />
        {hasPhoto(b, design) && <Photo basics={b} size="24mm" shape="rounded" className="st-photo" />}
        <div className="st-hero__text">
          <h1 className="st-name">{name}</h1>
          {b.title.trim() && <div className="st-title">{b.title}</div>}
        </div>
        <span className="st-size" aria-hidden="true">
          Fill × Hug
        </span>
        <svg className="st-cursor" viewBox="0 0 80 40" aria-hidden="true">
          <path className="st-cursor__arrow" d="M2 2l4 16 4-6 7-1z" />
          <rect className="st-cursor__tag" x="12" y="16" width="56" height="16" rx="4" />
          <text className="st-cursor__name" x="40" y="24" dominantBaseline="central" textAnchor="middle">
            {first.slice(0, 9)}
          </text>
        </svg>
      </div>
    </header>
  )

  const mainBlocks: Block[] = sectionsToBlocks(main, {
    heading,
    summary: (s) => <RichParagraphs className="st-summary" text={s.content} />,
    entry: (e) => compactEntry(e) ?? <DefaultEntry entry={e} variant="main" />,
    whole: (s) => compactWhole(s, 'st-compact'),
    wrap: frame,
  }).map((bl) => (bl.gap === 'entry' ? { ...bl, gap: 'none' as const } : bl))

  const sideBlocks: Block[] = []
  if (contactEntries(b).length) {
    sideBlocks.push({
      key: 'contact',
      gap: 'section',
      letter: true,
      node: (
        <>
          {sideHeading('Contact')}
          <ContactList basics={b} layout="stack" className="st-contact" iconSize="0.9em" />
        </>
      ),
    })
  }
  sideBlocks.push(...sectionsToBlocks(side, { heading: sideHeading, entry: sideEntry, whole: sideWhole }))
  sideBlocks.push({
    key: 'styles',
    gap: 'section',
    node: (
      <div className="st-styles" aria-hidden="true">
        <div className="st-ph">Colour styles</div>
        <div className="st-swatches">
          {SWATCHES.map((c) => (
            <span key={c} className="st-swatch" style={{ background: c }} />
          ))}
        </div>
      </div>
    ),
  })

  return (
    <PageLayout
      header={header}
      main={mainBlocks}
      side={sideBlocks}
      page={({ header, main, side }) => (
        <div className="st-page" style={vars}>
          <Toolbar name={name} />
          <div className="st-work">
            <div className="st-canvas">
              {header}
              {main}
            </div>
            <aside className="st-panel">
              <div className="st-tabs" aria-hidden="true">
                <span className="st-tabs__on">Layers</span>
                <span>Assets</span>
              </div>
              {side}
            </aside>
          </div>
        </div>
      )}
    />
  )
}
