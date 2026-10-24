/**
 * Showcase — a bright, illustrated résumé for product and UI designers. Page 1 opens with a hero panel:
 * the name, title and contact chips on the left and a flat illustration on the right (a laptop and a
 * phone showing UI wireframes, a plant and floating shapes; the photo, when shown, sits in a badge on
 * it). The skills section becomes an "at a glance" row: a radar chart of the skill groups next to a
 * toolbox of colour chips, right after the summary. Every other section gets a round icon badge that cycles through the palette.
 * Single column; all text stays real text.
 */
import type { CSSProperties, ReactNode } from 'react'
import {
  ContactList,
  DefaultEntry,
  PageLayout,
  Photo,
  RichParagraphs,
  SectionIcon,
  compactEntry,
  compactWhole,
  displayName,
  hasPhoto,
  sectionsToBlocks,
  type Block,
  type EntryView,
  type SectionView,
  type TemplateMeta,
  type TemplateProps,
} from '../shared'
import './showcase.css'

export const meta: TemplateMeta = {
  id: 'showcase',
  name: 'Showcase',
  description: 'Bright and illustrated: a hero with a flat laptop-and-phone illustration, a skills radar chart, a colourful toolbox and icon badges for every section.',
  tags: ['Modern', 'Creative', 'Photo'],
  order: 550,
  supportsPhoto: true,
  columns: 1,
  defaultFont: 'poppins',
  defaultAccent: '#ff6b5b',
  headingCase: 'normal',
  gaps: { entry: 9, section: 14 },
}

const TONES = ['a', 'b', 'c', 'd'] as const

function Illustration({ photo }: { photo: ReactNode }) {
  return (
    <div className="sc-art">
      <svg className="sc-art__svg" viewBox="0 0 240 170" aria-hidden="true">
        <circle className="sc-f-soft" cx="150" cy="80" r="70" />
        <path className="sc-f-yellow" d="M18 30l12-20 12 20z" />
        <circle className="sc-f-teal" cx="222" cy="24" r="8" />
        <path className="sc-s-blue" d="M196 150c6-8 12 8 18 0s12 8 18 0" />
        <path className="sc-s-accent" d="M14 120c6-8 12 8 18 0s12 8 18 0" />
        {/* laptop */}
        <rect className="sc-f-ink" x="62" y="42" width="128" height="84" rx="6" />
        <rect className="sc-f-white" x="68" y="48" width="116" height="72" rx="2" />
        <rect className="sc-f-accent" x="74" y="54" width="44" height="6" rx="3" />
        <rect className="sc-f-line" x="74" y="64" width="64" height="4" rx="2" />
        <rect className="sc-f-line" x="74" y="71" width="52" height="4" rx="2" />
        <rect className="sc-f-blue" x="74" y="82" width="30" height="30" rx="4" />
        <rect className="sc-f-yellow" x="108" y="82" width="30" height="30" rx="4" />
        <rect className="sc-f-teal" x="142" y="82" width="36" height="13" rx="4" />
        <rect className="sc-f-line" x="142" y="99" width="36" height="13" rx="4" />
        <path className="sc-f-ink2" d="M48 126h156l-8 10H56z" />
        {/* phone */}
        <rect className="sc-f-ink" x="176" y="70" width="44" height="80" rx="7" />
        <rect className="sc-f-white" x="180" y="76" width="36" height="68" rx="3" />
        <circle className="sc-f-accent" cx="198" cy="92" r="9" />
        <rect className="sc-f-line" x="186" y="106" width="24" height="4" rx="2" />
        <rect className="sc-f-line" x="189" y="113" width="18" height="4" rx="2" />
        <rect className="sc-f-blue" x="186" y="124" width="24" height="10" rx="5" />
        {/* plant */}
        <path className="sc-f-teal" d="M30 112c-8-18 2-34 10-38-2 14 2 26-10 38zM34 112c2-20 16-28 26-28-6 12-14 24-26 28z" />
        <path className="sc-f-accent" d="M22 112h24l-4 24H26z" />
        {/* cursor */}
        <path className="sc-f-ink sc-cursor" d="M150 100l14 6-6 2-2 6z" />
      </svg>
      {photo && <div className="sc-art__photo">{photo}</div>}
    </div>
  )
}

/** Radar chart of skill groups (levels 1–5; unset levels count as 3). */
function Radar({ items }: { items: EntryView[] }) {
  const n = items.length
  const cx = 110
  const cy = 92
  const r = 58
  const pt = (i: number, f: number) => {
    const a = -Math.PI / 2 + (i * 2 * Math.PI) / n
    return [cx + Math.cos(a) * r * f, cy + Math.sin(a) * r * f] as const
  }
  const ring = (f: number) => items.map((_, i) => pt(i, f).map((v) => v.toFixed(1)).join(',')).join(' ')
  const shape = items.map((e, i) => pt(i, (e.level || 3) / 5).map((v) => v.toFixed(1)).join(',')).join(' ')
  return (
    <svg className="sc-radar" viewBox="0 0 220 184" role="img" aria-label="Skill levels">
      {[0.2, 0.4, 0.6, 0.8, 1].map((f) => (
        <polygon key={f} className="sc-radar__ring" points={ring(f)} />
      ))}
      {items.map((e, i) => {
        const [x, y] = pt(i, 1)
        return <line key={e.id} className="sc-radar__spoke" x1={cx} y1={cy} x2={x} y2={y} />
      })}
      <polygon className="sc-radar__shape" points={shape} />
      {items.map((e, i) => {
        const [x, y] = pt(i, (e.level || 3) / 5)
        return <circle key={e.id} className="sc-radar__dot" cx={x} cy={y} r="3" />
      })}
      {items.map((e, i) => {
        const [x, y] = pt(i, 1.2)
        const anchor = Math.abs(x - cx) < 4 ? 'middle' : x > cx ? 'start' : 'end'
        return (
          <text key={e.id} className="sc-radar__label" x={x} y={y} textAnchor={anchor} dominantBaseline="central">
            {e.title}
          </text>
        )
      })}
    </svg>
  )
}

function heading(s: SectionView, i: number) {
  return (
    <h2 className={`sc-h sc-h--${TONES[i % TONES.length]}`}>
      <span className="sc-h__icon">
        <SectionIcon kind={s.kind} size="1em" />
      </span>
      <span className="sc-h__text">{s.title}</span>
      <span className="sc-h__rule" />
    </h2>
  )
}

/** The skills section as an "at a glance" row: radar chart + toolbox chips. */
function glance(s: SectionView, tone: number): Block {
  const groups = s.entries.slice(0, 8)
  const chips = s.entries.flatMap((e) => (e.keywords.length ? e.keywords : [e.title]))
  return {
    key: `${s.id}:glance`,
    sectionId: s.id,
    gap: 'section',
    node: (
      <>
        {heading(s, tone)}
        <div className={groups.length >= 3 ? 'sc-glance' : 'sc-glance sc-glance--chips'}>
          {groups.length >= 3 && (
            <div className="sc-glance__card sc-glance__card--radar">
              <Radar items={groups} />
            </div>
          )}
          <div className="sc-glance__card">
            <div className="sc-glance__label" aria-hidden="true">
              Toolbox
            </div>
            <div className="sc-chips">
              {chips.map((c, i) => (
                <span key={i} className={`sc-chip sc-chip--${TONES[i % TONES.length]}`}>
                  {c}
                </span>
              ))}
            </div>
          </div>
        </div>
      </>
    ),
  }
}

export default function Showcase({ data, design, main }: TemplateProps) {
  const b = data.basics
  const vars = { '--sc-ink': '#232041', '--sc-blue': '#5b6cff', '--sc-yellow': '#ffc93c', '--sc-teal': '#2ec4b6', '--sc-soft': '#fff3ef' } as CSSProperties

  const header = (
    <header className="sc-hero">
      <div className="sc-hero__text">
        <span className="sc-hello" aria-hidden="true">
          Hi there, I’m
        </span>
        <h1 className="sc-name">{displayName(b)}</h1>
        {b.title.trim() && <div className="sc-title">{b.title}</div>}
        <ContactList basics={b} layout="inline" className="sc-contact" itemClassName="sc-contact__item" separator="" iconSize="0.9em" />
      </div>
      <Illustration photo={hasPhoto(b, design) ? <Photo basics={b} size="20mm" className="sc-photo" /> : null} />
    </header>
  )

  // the skills glance moves up to follow the summary; everything else keeps the user's order
  const ordered = [...main.filter((s) => s.kind === 'summary'), ...main.filter((s) => s.kind === 'skills'), ...main.filter((s) => s.kind !== 'summary' && s.kind !== 'skills')]
  const blocks: Block[] = []
  ordered.forEach((s, i) => {
    if (s.kind === 'skills' && s.entries.length) {
      blocks.push(glance(s, i))
      return
    }
    blocks.push(
      ...sectionsToBlocks([s], {
        heading: (sec) => heading(sec, i),
        summary: (sec) => <RichParagraphs className="sc-summary" text={sec.content} />,
        entry: (e) => compactEntry(e) ?? <DefaultEntry entry={e} variant="main" />,
        whole: (sec) => compactWhole(sec, 'sc-compact'),
      }),
    )
  })

  return (
    <PageLayout
      header={header}
      main={blocks}
      page={({ header, main }) => (
        <div className="sc-page" style={vars}>
          <span className="sc-corner" aria-hidden="true" />
          {header}
          <div className="sc-body">{main}</div>
        </div>
      )}
    />
  )
}
