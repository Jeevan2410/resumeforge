/**
 * Pixel art — an 8-bit game screen. Page 1 opens with a HUD bar: a blocky avatar (the photo, or an
 * 8×8 sprite generated from the name), the name as the player in chunky mono capitals, the title as
 * the class, and HP/XP-style meters for the top skills. A dark "inventory" panel runs down the left of
 * every page with contact and skills as item slots; on the right, every section is a dialogue box with
 * notched pixel corners and a ▶ cursor heading. Pixel borders are drawn with stepped box-shadows.
 */
import type { CSSProperties, ReactNode } from 'react'
import {
  ContactList,
  DefaultEntry,
  PageLayout,
  Photo,
  RichParagraphs,
  compactEntry,
  contactEntries,
  displayName,
  hasPhoto,
  sectionsToBlocks,
  type Block,
  type EntryView,
  type SectionView,
  type TemplateMeta,
  type TemplateProps,
} from '../shared'
import './pixel.css'

export const meta: TemplateMeta = {
  id: 'pixel',
  name: 'Pixel Art',
  description: 'An 8-bit game screen: a HUD with a pixel sprite and skill meters, an inventory panel and every section in a notched dialogue box.',
  tags: ['Creative', 'Two-column', 'Photo'],
  order: 410,
  supportsPhoto: true,
  columns: 2,
  defaultFont: 'plex',
  defaultAccent: '#e8433f',
  sideKinds: ['skills', 'languages', 'certifications', 'awards', 'interests', 'references'],
  headingCase: 'upper',
  gaps: { entry: 10, section: 12 },
}

/** Deterministic, mirrored 8×8 sprite from the name (like an identicon). */
function Sprite({ seed }: { seed: string }) {
  let h = 2166136261
  for (const ch of seed) h = Math.imul(h ^ ch.charCodeAt(0), 16777619)
  const cells: ReactNode[] = []
  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 4; x++) {
      h = Math.imul(h ^ (h >>> 13), 1274126177)
      if ((h >>> 7) % 3 === 0) continue
      const tone = (h >>> 3) % 4 === 0 ? 'pk-sp--b' : 'pk-sp--a'
      cells.push(<rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" className={tone} />, <rect key={`${7 - x}-${y}`} x={7 - x} y={y} width="1" height="1" className={tone} />)
    }
  }
  return (
    <svg className="pk-sprite" viewBox="-1 -1 10 10" shapeRendering="crispEdges" aria-hidden="true">
      <rect x="-1" y="-1" width="10" height="10" className="pk-sp--bg" />
      {cells}
    </svg>
  )
}

function Meter({ label, level }: { label: string; level: number }) {
  return (
    <div className="pk-meter">
      <span className="pk-meter__label">{label}</span>
      <span className="pk-meter__bar" aria-hidden="true">
        {Array.from({ length: 10 }, (_, i) => (
          <i key={i} className={i < level * 2 ? 'on' : undefined} />
        ))}
      </span>
    </div>
  )
}

/** One dialogue box per section: blocks of a section touch; CSS draws the notched frame. */
const box = (cls: string) => (node: ReactNode, info: { first: boolean; last: boolean }) => (
  <div className={`${cls}${info.first ? ` ${cls}--first` : ''}${info.last ? ` ${cls}--last` : ''}`}>{node}</div>
)
const joined = (blocks: Block[]): Block[] => blocks.map((b) => (b.gap === 'entry' ? { ...b, gap: 'none' } : b))

const heading = (s: SectionView | string) => <h2 className="pk-h">{typeof s === 'string' ? s : s.title}</h2>

function sideEntry(e: EntryView): ReactNode {
  if (e.kind === 'skills') {
    return (
      <div className="rf-entry rf-entry--skills rf-entry--side pk-slotgroup">
        {e.title && <div className="pk-slotgroup__name">{e.title}</div>}
        <div className="pk-slots">
          {e.keywords.map((k) => (
            <span key={k} className="pk-slot">
              {k}
            </span>
          ))}
        </div>
      </div>
    )
  }
  return compactEntry(e) ?? <DefaultEntry entry={e} variant="side" />
}

export default function PixelArt({ data, design, main, side }: TemplateProps) {
  const b = data.basics
  const name = displayName(b)
  const vars = { '--pk-ink': '#1b1c33', '--pk-panel': '#24264a', '--pk-paper': '#fbf8ef', '--pk-gold': '#ffcc33', '--pk-green': '#46c46b' } as CSSProperties
  const meters = (side.find((s) => s.kind === 'skills') ?? main.find((s) => s.kind === 'skills'))?.entries.filter((e) => e.level > 0).slice(0, 3) ?? []

  const header = (
    <header className="pk-hud">
      <div className="pk-avatar">{hasPhoto(b, design) ? <Photo basics={b} size="24mm" shape="square" className="pk-photo" /> : <Sprite seed={name} />}</div>
      <div className="pk-hud__id">
        <div className="pk-hud__tag">Player 1</div>
        <h1 className="pk-name">{name}</h1>
        {b.title.trim() && <div className="pk-class">Class: {b.title}</div>}
      </div>
      {meters.length > 0 && (
        <div className="pk-hud__stats">
          {meters.map((e) => (
            <Meter key={e.id} label={e.title} level={e.level} />
          ))}
        </div>
      )}
    </header>
  )

  const mainBlocks = joined(
    sectionsToBlocks(main, {
      heading,
      summary: (s) => <RichParagraphs className="pk-summary" text={s.content} />,
      entry: (e) => compactEntry(e) ?? <DefaultEntry entry={e} variant="main" marker="square" />,
      wrap: box('pk-box'),
    }),
  )

  const sideBlocks: Block[] = []
  if (contactEntries(b).length) {
    sideBlocks.push({ key: 'contact', gap: 'section', letter: true, node: <>{heading('Contact')}<ContactList basics={b} layout="stack" className="pk-contact" iconSize="0.9em" /></> })
  }
  sideBlocks.push(...sectionsToBlocks(side, { heading, entry: sideEntry }))

  return (
    <PageLayout
      header={header}
      main={mainBlocks}
      side={sideBlocks}
      page={({ header, main, side }) => (
        <div className="pk-page" style={vars}>
          {header}
          <div className="pk-cols">
            <div className="pk-main">{main}</div>
            <aside className="pk-side">{side}</aside>
          </div>
        </div>
      )}
    />
  )
}
