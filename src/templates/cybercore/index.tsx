/**
 * Cybercore — a night-mode HUD. A deep navy page with a faint circuit-board pattern; page 1 opens on a
 * terminal prompt (`> whoami`) above the name in neon-edged capitals with a hard magenta drop shadow.
 * Every main section sits inside HUD corner brackets with a glowing cyan heading and a circuit trace
 * leading in; the right-hand column is a system console where contact, skills and languages print as
 * command output (`$ skills --list`). Monospace details throughout. Main column first in the DOM.
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
import './cybercore.css'

export const meta: TemplateMeta = {
  id: 'cybercore',
  name: 'Cybercore',
  description: 'A night-mode HUD: neon type with harsh drop shadows, circuit traces, bracketed sections and a terminal console for your stack.',
  tags: ['Creative', 'Two-column', 'Photo'],
  order: 440,
  collection: 'style',
  supportsPhoto: true,
  columns: 2,
  defaultFont: 'montserrat',
  defaultAccent: '#00e5ff',
  sideKinds: ['skills', 'languages', 'certifications', 'awards', 'interests', 'references'],
  headingCase: 'upper',
  gaps: { entry: 10, section: 14 },
}

const cmd = (s: SectionView | string) => {
  const t = typeof s === 'string' ? s : s.title
  return (
    <h3 className="cy-cmd">
      <span className="cy-cmd__prompt">$</span> {t.toLowerCase().replace(/\s+/g, '-')} <span className="cy-cmd__flag">--list</span>
    </h3>
  )
}

/** HUD frame per section: corner brackets on the first and last block of the section. */
const hud = (node: ReactNode, info: { first: boolean; last: boolean }) => (
  <div className={`cy-hud${info.first ? ' cy-hud--first' : ''}${info.last ? ' cy-hud--last' : ''}`}>{node}</div>
)

function sideEntry(e: EntryView): ReactNode {
  if (e.kind === 'skills') {
    return (
      <div className="rf-entry rf-entry--skills rf-entry--side cy-skill">
        <div className="cy-skill__head">
          <span className="cy-skill__name">{e.title}</span>
          {e.level > 0 && <LevelSegments level={e.level} label={e.levelLabel} className="cy-skill__bar" height="0.45em" gap="0.15em" />}
        </div>
        {e.keywords.length > 0 && <div className="cy-skill__kw">[{e.keywords.join(', ')}]</div>}
      </div>
    )
  }
  return compactEntry(e) ?? <DefaultEntry entry={e} variant="side" />
}

export default function Cybercore({ data, design, main, side }: TemplateProps) {
  const b = data.basics
  const name = displayName(b)
  const vars = { '--cy-bg': '#0a0e1a', '--cy-panel': '#111830', '--cy-magenta': '#ff2bd6', '--cy-text': '#d8e3ff', '--cy-dim': '#8592b8' } as CSSProperties

  const header = (
    <header className="cy-header">
      <div className="cy-prompt" aria-hidden="true">
        &gt; whoami<span className="cy-caret" />
      </div>
      <div className="cy-id">
        {hasPhoto(b, design) && <Photo basics={b} size="24mm" shape="square" className="cy-photo" />}
        <div className="cy-id__text">
          <h1 className="cy-name">{name}</h1>
          {b.title.trim() && <div className="cy-title">// {b.title}</div>}
        </div>
      </div>
    </header>
  )

  const mainBlocks = sectionsToBlocks(main, {
    heading: (s) => (
      <h2 className="cy-h">
        <span className="cy-h__trace" aria-hidden="true" />
        {s.title}
      </h2>
    ),
    summary: (s) => <RichParagraphs className="cy-summary" text={s.content} />,
    entry: (e) => compactEntry(e) ?? <DefaultEntry entry={e} variant="main" marker="arrow" />,
    wrap: hud,
  }).map((bl) => (bl.gap === 'entry' ? { ...bl, gap: 'none' as const } : bl))

  const sideBlocks: Block[] = []
  if (contactEntries(b).length) {
    sideBlocks.push({ key: 'contact', gap: 'section', letter: true, node: <>{cmd('contact')}<ContactList basics={b} layout="stack" className="cy-contact" iconSize="0.9em" /></> })
  }
  sideBlocks.push(...sectionsToBlocks(side, { heading: cmd, entry: sideEntry, whole: (s) => (s.kind === 'interests' ? inlineWhole(s, 'cy-inline') : undefined) }))

  return (
    <PageLayout
      header={header}
      main={mainBlocks}
      side={sideBlocks}
      page={({ header, main, side }) => (
        <div className="cy-page" style={vars}>
          <span className="cy-circuit" aria-hidden="true" />
          {header}
          <div className="cy-cols">
            <div className="cy-main">{main}</div>
            <aside className="cy-side">
              <div className="cy-console__bar" aria-hidden="true">
                <i />
                <i />
                <i />
                <span>sys.console</span>
              </div>
              {side}
            </aside>
          </div>
        </div>
      )}
    />
  )
}
