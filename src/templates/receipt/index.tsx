/**
 * Receipt — the résumé is a till receipt printed on a strip of thermal paper with torn zig-zag
 * edges, centred on a counter-top background. The "shop" is the candidate: a thermal-printed photo
 * or logo, the name as the store name, the job title as its slogan and the contact details as the
 * address. Sections are "*** HEADINGS ***" between dashed rules. Every role or degree is a line item
 * with a dotted leader running to its date (the "price"), the employer underneath and the bullets
 * as sub-items. Skill groups are items with a quantity (x5). The last page ends with totals counted
 * from the résumé, a thank-you line and a barcode. Single narrow column.
 */
import type { CSSProperties, ReactNode } from 'react'
import { mmToPx } from '../../lib/templateData.ts'
import {
  ContactList,
  EntryLink,
  PageLayout,
  Photo,
  Rich,
  RichParagraphs,
  displayName,
  hasPhoto,
  initials,
  sectionsToBlocks,
  type EntryView,
  type SectionView,
  type TemplateMeta,
  type TemplateProps,
} from '../shared'
import './receipt.css'

export const meta: TemplateMeta = {
  id: 'receipt',
  name: 'Receipt',
  description: 'Your résumé as a till receipt: your name as the shop, roles as line items with dotted leaders to their dates, skills with quantities, and totals with a barcode.',
  tags: ['Creative', 'Photo', 'One-page'],
  order: 640,
  collection: 'format',
  supportsPhoto: true,
  columns: 1,
  defaultFont: 'plex',
  defaultAccent: '#d1342f',
  headingCase: 'upper',
  gaps: { entry: 7, section: 10 },
}

const Barcode = ({ seed }: { seed: string }) => {
  const bars: number[] = []
  for (let i = 0; i < 44; i++) bars.push(1 + ((seed.charCodeAt(i % Math.max(1, seed.length)) || 5) * (i + 7)) % 3)
  let x = 0
  return (
    <svg className="rc-barcode" viewBox="0 0 132 24" preserveAspectRatio="none" aria-hidden="true">
      {bars.map((w, i) => {
        const r = <rect key={i} x={x} y="0" width={w} height="24" />
        x += w + 1
        return r
      })}
    </svg>
  )
}

const heading = (s: SectionView) => (
  <h2 className="rc-h">
    <span aria-hidden="true">*** </span>
    {s.title}
    <span aria-hidden="true"> ***</span>
  </h2>
)

const leader = (left: ReactNode, right: ReactNode, cls = '') => (
  <div className={`rc-row ${cls}`}>
    <span className="rc-row__l">{left}</span>
    <span className="rc-row__dots" aria-hidden="true" />
    {right && <span className="rc-row__r">{right}</span>}
  </div>
)

function item(e: EntryView, n: number): ReactNode {
  const at = [e.subtitle, e.location].filter(Boolean).join(', ')
  return (
    <div className="rc-item">
      {leader(
        <>
          <span className="rc-qty" aria-hidden="true">
            {n}
          </span>
          <h3 className="rc-item__title">{e.title}</h3>
        </>,
        e.date,
      )}
      {at && <div className="rc-sub">@ {at}</div>}
      {e.url && <EntryLink entry={e} className="rc-sub rc-link" />}
      {e.description && <Rich as="p" className="rc-sub rc-desc" text={e.description} />}
      {e.bullets.length > 0 && (
        <ul className="rc-list">
          {e.bullets.map((t, i) => (
            <li key={i}>
              <Rich text={t} />
            </li>
          ))}
        </ul>
      )}
      {e.keywords.length > 0 && <div className="rc-sub rc-kw">{e.keywords.join(' / ')}</div>}
      {e.meta && <div className="rc-sub">{e.meta}</div>}
    </div>
  )
}

function line(e: EntryView): ReactNode {
  const right = e.date || e.levelLabel
  const extra = [e.subtitle, e.date && e.levelLabel].filter(Boolean).join(' · ')
  return (
    <div className="rc-item rc-item--one">
      {leader(<b className="rc-item__name">{e.title}</b>, right)}
      {extra && <div className="rc-sub">{extra}</div>}
      {e.description && <Rich as="p" className="rc-sub rc-desc" text={e.description} />}
    </div>
  )
}

function skills(s: SectionView): ReactNode {
  return (
    <div className="rc-skills">
      {s.entries.map((e) => (
        <div key={e.id} className="rc-item rc-item--one">
          {leader(
            <b className="rc-item__name">
              {e.title}
              {e.levelLabel && <span className="rc-lvl"> ({e.levelLabel})</span>}
            </b>,
            e.keywords.length > 0 && <span aria-hidden="true">x{e.keywords.length}</span>,
          )}
          {e.keywords.length > 0 && <div className="rc-sub">{e.keywords.join(', ')}</div>}
        </div>
      ))}
    </div>
  )
}

export default function Receipt({ data, design, main }: TemplateProps) {
  const b = data.basics
  const name = displayName(b)
  const vars = { '--rc-paper': '#fffdf7', '--rc-ink': '#2b2a28', '--rc-counter': '#cfc9bd' } as CSSProperties

  const count = (k: string) => main.filter((s) => s.kind === k).reduce((n, s) => n + s.entries.length, 0)
  const totals: [string, number][] = (
    [
      ['Roles', count('experience')],
      ['Projects', count('projects')],
      ['Degrees', count('education')],
      ['Skills', main.filter((s) => s.kind === 'skills').reduce((n, s) => n + s.entries.reduce((m, e) => m + Math.max(1, e.keywords.length), 0), 0)],
      ['Certificates', count('certifications')],
      ['Languages', count('languages')],
    ] as [string, number][]
  ).filter(([, n]) => n > 0)

  const header = (
    <header className="rc-head">
      {hasPhoto(b, design) ? <Photo basics={b} size="24mm" shape="circle" className="rc-photo" /> : <span className="rc-logo">{initials(name)}</span>}
      <h1 className="rc-name">{name}</h1>
      {b.title.trim() && <div className="rc-slogan">{b.title}</div>}
      <ContactList basics={b} layout="inline" separator="·" showIcons={false} className="rc-contact" />
      <div className="rc-rule rc-rule--double" aria-hidden="true" />
      <div className="rc-txn" aria-hidden="true">
        <span>TXN #0001</span>
        <span>CASHIER: {initials(name)}</span>
        <span>TILL 1</span>
      </div>
      <div className="rc-rule" aria-hidden="true" />
    </header>
  )

  let n = 0
  const blocks = sectionsToBlocks(main, {
    heading,
    summary: (s) => <RichParagraphs className="rc-note" text={s.content} />,
    entry: (e) => {
      if (e.bullets.length || (e.date && (e.kind === 'experience' || e.kind === 'education' || e.kind === 'projects' || e.kind === 'volunteering'))) return item(e, ++n)
      return line(e)
    },
    whole: (s) => (s.kind === 'skills' ? skills(s) : undefined),
  })

  return (
    <PageLayout
      header={header}
      main={blocks}
      bottom={mmToPx(design.margin * 0.5 + 52)}
      page={({ index, count: pages, header, main }) => (
        <div className="rc-page" style={vars}>
          <div className="rc-shadow">
            <div className="rc-paper">
              {header ?? (
                <div className="rc-cont" aria-hidden="true">
                  {name} · continued {index + 1}/{pages}
                </div>
              )}
              {main}
              {index === pages - 1 ? (
                <div className="rc-foot">
                  <div className="rc-rule rc-rule--double" aria-hidden="true" />
                  {totals.map(([k, v]) => (
                    <div key={k}>{leader(k, String(v), 'rc-row--total')}</div>
                  ))}
                  <div className="rc-rule" aria-hidden="true" />
                  {leader(<b>Total</b>, <b>Ready to hire</b>, 'rc-row--grand')}
                  <div className="rc-thanks" aria-hidden="true">
                    Thank you for reading!
                    <br />
                    Please keep this receipt
                  </div>
                  <Barcode seed={name + (b.title || '')} />
                  <div className="rc-code" aria-hidden="true">
                    {initials(name)}-{String(totals.reduce((s, [, v]) => s + v, 0)).padStart(4, '0')}-HIRE
                  </div>
                </div>
              ) : (
                <div className="rc-more" aria-hidden="true">
                  — continued on next page —
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    />
  )
}
