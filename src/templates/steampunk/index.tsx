/**
 * Steampunk — Victorian engineering on sepia paper. Brass clockwork gears mesh in the top-right
 * corner and turn up again at the foot of every page, a riveted double brass frame encloses the
 * sheet, the name is set in a display serif over a brass rule with rivets, and headings carry a small
 * cog. Warm browns throughout; body text is dark umber for contrast. Single column.
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
  sectionsToBlocks,
  type SectionView,
  type TemplateMeta,
  type TemplateProps,
} from '../shared'
import './steampunk.css'

export const meta: TemplateMeta = {
  id: 'steampunk',
  name: 'Steampunk',
  description: 'Brass clockwork gears, a riveted frame and warm sepia paper with Victorian display type.',
  tags: ['Creative', 'Classic', 'Photo'],
  order: 350,
  supportsPhoto: true,
  columns: 1,
  defaultFont: 'playfair',
  defaultAccent: '#8f5f24',
  headingCase: 'normal',
  gaps: { entry: 9, section: 14 },
}

/** Gear outline: `teeth` teeth between radius r (root) and r + depth (tip), with a hub hole. */
function gearPath(cx: number, cy: number, r: number, teeth: number, depth: number): string {
  const step = (Math.PI * 2) / teeth
  const pts: string[] = []
  for (let i = 0; i < teeth; i++) {
    const a = i * step
    const p = (ang: number, rad: number) => `${(cx + Math.cos(ang) * rad).toFixed(2)} ${(cy + Math.sin(ang) * rad).toFixed(2)}`
    pts.push(p(a - step * 0.25, r), p(a - step * 0.15, r + depth), p(a + step * 0.15, r + depth), p(a + step * 0.25, r))
  }
  return `M${pts.join('L')}Z`
}

function Gear({ cx, cy, r, teeth, className }: { cx: number; cy: number; r: number; teeth: number; className?: string }) {
  const spokes = [0, 60, 120]
  return (
    <g className={className}>
      <path className="sp-gear" d={gearPath(cx, cy, r, teeth, r * 0.18)} />
      <circle className="sp-gear__ring" cx={cx} cy={cy} r={r * 0.72} />
      {spokes.map((a) => (
        <rect key={a} className="sp-gear__spoke" x={cx - r * 0.7} y={cy - r * 0.07} width={r * 1.4} height={r * 0.14} transform={`rotate(${a} ${cx} ${cy})`} />
      ))}
      <circle className="sp-gear__hub" cx={cx} cy={cy} r={r * 0.2} />
      <circle className="sp-gear__axle" cx={cx} cy={cy} r={r * 0.08} />
    </g>
  )
}

const Clockwork = () => (
  <svg className="sp-clock" viewBox="0 0 120 100" aria-hidden="true">
    <Gear cx={74} cy={38} r={30} teeth={14} />
    <Gear cx={30} cy={72} r={17} teeth={9} className="sp-gear--copper" />
    <Gear cx={108} cy={84} r={11} teeth={7} />
  </svg>
)

const Cog = () => (
  <svg className="sp-cog" viewBox="0 0 24 24" aria-hidden="true">
    <path d={gearPath(12, 12, 8, 8, 2.6)} />
    <circle cx="12" cy="12" r="3" className="sp-cog__hole" />
  </svg>
)

const heading = (s: SectionView) => (
  <h2 className="sp-h">
    <Cog />
    <span className="sp-h__text">{s.title}</span>
    <span className="sp-h__rule" />
  </h2>
)

export default function Steampunk({ data, design, main }: TemplateProps) {
  const b = data.basics
  const vars = { '--sp-paper': '#f3e8d0', '--sp-ink': '#2f2012', '--sp-copper': '#a4552c', '--sp-brass': 'var(--rf-accent)' } as CSSProperties

  const header = (
    <header className="sp-header">
      <Clockwork />
      {hasPhoto(b, design) && <Photo basics={b} size="25mm" className="sp-photo" />}
      <div className="sp-header__text">
        <h1 className="sp-name">{displayName(b)}</h1>
        <div className="sp-rule" aria-hidden="true">
          <span />
        </div>
        {b.title.trim() && <div className="sp-title">{b.title}</div>}
        <ContactList basics={b} layout="inline" className="sp-contact" iconSize="0.9em" />
      </div>
    </header>
  )

  const blocks = sectionsToBlocks(main, {
    heading,
    summary: (s) => <RichParagraphs className="sp-summary" text={s.content} />,
    entry: (e) => compactEntry(e) ?? <DefaultEntry entry={e} variant="main" />,
    whole: (s) => compactWhole(s, 'sp-compact'),
  })

  return (
    <PageLayout
      header={header}
      main={blocks}
      page={({ header, main }) => (
        <div className="sp-page" style={vars}>
          <span className="sp-frame" aria-hidden="true">
            <i />
            <i />
            <i />
            <i />
          </span>
          <svg className="sp-foot" viewBox="0 0 60 40" aria-hidden="true">
            <Gear cx={18} cy={24} r={14} teeth={9} />
            <Gear cx={44} cy={14} r={9} teeth={7} className="sp-gear--copper" />
          </svg>
          <div className="sp-body">
            {header}
            {main}
          </div>
        </div>
      )}
    />
  )
}
