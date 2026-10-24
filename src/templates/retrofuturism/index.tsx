/**
 * Retro-Futurism — the space age as imagined in 1960, laid out as a mission-control console. Page 1
 * opens with a teal header (boomerang curve, orbiting planet, atomic starbursts) and, beneath it, a
 * cream instrument panel: one round dial per skill group (the needle shows the level), each with its
 * group name and tools engraved below, and a contact readout strip. The skills section moves into the
 * panel; everything else follows in one column with headings that launch from a small starburst.
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
  sectionsToBlocks,
  type EntryView,
  type SectionView,
  type TemplateMeta,
  type TemplateProps,
} from '../shared'
import './retrofuturism.css'

export const meta: TemplateMeta = {
  id: 'retrofuturism',
  name: 'Retro-Futurism',
  description: 'A 1960s mission-control console: a teal space-age header over an instrument panel of skill dials, then one clean column.',
  tags: ['Creative', 'Photo'],
  order: 370,
  collection: 'style',
  supportsPhoto: true,
  columns: 1,
  defaultFont: 'montserrat',
  defaultAccent: '#2f8f89',
  headingCase: 'normal',
  gaps: { entry: 10, section: 16 },
}

/** Four-point "atomic" starburst with thin rays between the points. */
function Star({ x, y, r, className }: { x: number; y: number; r: number; className: string }) {
  const k = r * 0.22
  return (
    <g className={className} transform={`translate(${x} ${y})`}>
      <path d={`M0 ${-r}L${k} ${-k}L${r} 0L${k} ${k}L0 ${r}L${-k} ${k}L${-r} 0L${-k} ${-k}Z`} />
      <path className="rf2-ray" d={`M${-r * 0.6} ${-r * 0.6}L${r * 0.6} ${r * 0.6}M${r * 0.6} ${-r * 0.6}L${-r * 0.6} ${r * 0.6}`} />
    </g>
  )
}

function Space() {
  return (
    <svg className="rf2-space" viewBox="0 0 400 110" preserveAspectRatio="xMaxYMid slice" aria-hidden="true">
      <path className="rf2-boomerang" d="M210 110C240 40 320 10 410 18V60C340 52 280 70 250 110Z" />
      <ellipse className="rf2-orbit" cx="330" cy="52" rx="46" ry="14" transform="rotate(-18 330 52)" />
      <circle className="rf2-planet" cx="330" cy="52" r="15" />
      <path className="rf2-orbit rf2-orbit--front" d="M286 66A46 14 -18 0 0 374 38" transform="rotate(0)" />
      <circle className="rf2-moon" cx="372" cy="40" r="3.5" />
      <Star x={262} y={26} r={11} className="rf2-star rf2-star--sun" />
      <Star x={388} y={92} r={8} className="rf2-star rf2-star--coral" />
      <Star x={232} y={70} r={5} className="rf2-star rf2-star--cream" />
      <circle className="rf2-dot" cx="298" cy="94" r="2" />
      <circle className="rf2-dot" cx="214" cy="18" r="1.6" />
      <circle className="rf2-dot" cx="360" cy="10" r="1.8" />
    </svg>
  )
}

const StarMark = () => (
  <svg className="rf2-mark" viewBox="-10 -10 20 20" aria-hidden="true">
    <path d="M0 -9L2 -2L9 0L2 2L0 9L-2 2L-9 0L-2 -2Z" />
  </svg>
)

const mainHeading = (s: SectionView) => (
  <h2 className="rf2-h">
    <StarMark />
    <span>{s.title}</span>
  </h2>
)
const MAX_DIALS = 5

/** A round instrument dial: a 240° scale with ticks and a needle at level/5 (no level → a full sweep). */
function Dial({ e }: { e: EntryView }) {
  const frac = e.level > 0 ? e.level / 5 : 1
  const a0 = 150
  const ang = ((a0 + frac * 240) * Math.PI) / 180
  const arc = (from: number, to: number, r: number) => {
    const p = (deg: number) => `${(30 + Math.cos((deg * Math.PI) / 180) * r).toFixed(2)} ${(30 + Math.sin((deg * Math.PI) / 180) * r).toFixed(2)}`
    return `M${p(from)}A${r} ${r} 0 ${to - from > 180 ? 1 : 0} 1 ${p(to)}`
  }
  return (
    <div className="rf2-dial">
      <svg className="rf2-dial__face" viewBox="0 0 60 60" aria-hidden="true">
        <circle className="rf2-dial__rim" cx="30" cy="30" r="27" />
        <path className="rf2-dial__track" d={arc(a0, a0 + 240, 21)} />
        <path className="rf2-dial__fill" d={arc(a0, a0 + 240 * frac, 21)} />
        {Array.from({ length: 6 }, (_, i) => {
          const t = ((a0 + i * 48) * Math.PI) / 180
          return <line key={i} className="rf2-dial__tick" x1={30 + Math.cos(t) * 15} y1={30 + Math.sin(t) * 15} x2={30 + Math.cos(t) * 17.5} y2={30 + Math.sin(t) * 17.5} />
        })}
        <line className="rf2-dial__needle" x1="30" y1="30" x2={30 + Math.cos(ang) * 16} y2={30 + Math.sin(ang) * 16} />
        <circle className="rf2-dial__hub" cx="30" cy="30" r="3" />
      </svg>
      <div className="rf2-dial__name">{e.title}</div>
      {e.levelLabel && <div className="rf2-dial__level">{e.levelLabel}</div>}
      {e.keywords.length > 0 && <div className="rf2-dial__tools">{e.keywords.join(' · ')}</div>}
    </div>
  )
}

const entry = (e: EntryView): ReactNode => compactEntry(e) ?? <DefaultEntry entry={e} variant="main" />

export default function RetroFuturism({ data, design, main }: TemplateProps) {
  const b = data.basics
  const vars = { '--rf2-cream': '#f8f1e2', '--rf2-mustard': '#e2a93b', '--rf2-coral': '#e2674c', '--rf2-ink': '#24302f' } as CSSProperties

  // the first skills section (when it fits the panel) becomes the dials
  const skills = main.find((s) => s.kind === 'skills')
  const dials = skills && skills.entries.length <= MAX_DIALS ? skills : undefined
  const body = dials ? main.filter((s) => s !== dials) : main

  const header = (
    <header className="rf2-top">
      <div className="rf2-header">
        <Space />
        {hasPhoto(b, design) && <Photo basics={b} size="25mm" className="rf2-photo" />}
        <div className="rf2-header__text">
          <h1 className="rf2-name">{displayName(b)}</h1>
          {b.title.trim() && <div className="rf2-title">{b.title}</div>}
        </div>
      </div>
      <div className="rf2-console">
        {dials && (
          <section className="rf2-dials" data-section-id={dials.id}>
            <h2 className="rf2-console__label">{dials.title}</h2>
            <div className="rf2-dials__row">
              {dials.entries.map((e) => (
                <Dial key={e.id} e={e} />
              ))}
            </div>
          </section>
        )}
        {contactEntries(b).length > 0 && <ContactList basics={b} layout="inline" className="rf2-readout" iconSize="0.9em" />}
      </div>
    </header>
  )

  const blocks = sectionsToBlocks(body, {
    heading: mainHeading,
    summary: (s) => <RichParagraphs className="rf2-summary" text={s.content} />,
    entry,
    whole: (s) => compactWhole(s, 'rf2-inline'),
  })

  return (
    <PageLayout
      header={header}
      main={blocks}
      page={({ index, header, main }) => (
        <div className="rf2-page" style={vars}>
          {header}
          {index > 0 && <div className="rf2-cap" aria-hidden="true" />}
          <div className="rf2-body">{main}</div>
        </div>
      )}
    />
  )
}
