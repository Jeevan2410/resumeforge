/**
 * Swiss / International — a rigid two-track grid. A heavy black rule opens the page, the name is set
 * big and flush-left in a neo-grotesk, and every section is a numbered row: "01 Experience" on a
 * black hairline across the full width, then entries whose dates and places hang in the narrow left
 * track while the content runs down the wide right track. One signal colour (the accent), no ornament,
 * lots of negative space. Single column in the DOM, so it reads cleanly for ATS parsers.
 */
import type { ReactNode } from 'react'
import {
  Bullets,
  ContactList,
  EntryLink,
  Keywords,
  PageLayout,
  Photo,
  Rich,
  RichParagraphs,
  compactEntry,
  compactWhole,
  cx,
  displayName,
  hasPhoto,
  sectionsToBlocks,
  type EntryView,
  type SectionView,
  type TemplateMeta,
  type TemplateProps,
} from '../shared'
import './swiss.css'

export const meta: TemplateMeta = {
  id: 'swiss',
  name: 'Swiss',
  description: 'International Typographic Style: a strict numbered grid, flush-left grotesk type, one signal colour and plenty of white space.',
  tags: ['Modern', 'ATS-friendly', 'One-page'],
  order: 220,
  supportsPhoto: true,
  columns: 1,
  defaultFont: 'inter',
  defaultAccent: '#e30613',
  headingCase: 'normal',
  gaps: { entry: 9, section: 14 },
}

/** Grid row: narrow left track (dates, numbers) + wide right track. */
const Row = ({ left, children, className }: { left?: ReactNode; children: ReactNode; className?: string }) => (
  <div className={cx('sw-row', className)}>
    <div className="sw-l">{left}</div>
    <div className="sw-r">{children}</div>
  </div>
)

/** One entry as a grid row; `label` (the section heading) tops the left track on the first entry. */
function Entry({ e, label }: { e: EntryView; label: ReactNode }) {
  const compact = compactEntry(e)
  if (compact) return <Row left={label}>{compact}</Row>
  return (
    <Row
      left={
        <>
          {label}
          {e.date && <div className="sw-date">{e.date}</div>}
          {e.location && <div className="sw-loc">{e.location}</div>}
        </>
      }
    >
      <div className="sw-head">
        {e.title && <span className="sw-title">{e.title}</span>}
        {e.title && e.subtitle && <span className="sw-sep">{' / '}</span>}
        {e.subtitle && <span className="sw-sub">{e.subtitle}</span>}
        {(e.title || e.subtitle) && e.url && <span className="sw-sep">{' / '}</span>}
        {e.url && <EntryLink entry={e} className="sw-url" />}
      </div>
      {e.meta && <div className="sw-meta">{e.meta}</div>}
      {e.description && <Rich as="div" className="sw-desc" text={e.description} />}
      {e.keywords.length > 0 && <Keywords className="sw-kw" items={e.keywords} separator=" / " />}
      <Bullets items={e.bullets} marker="dash" />
    </Row>
  )
}

export default function Swiss({ data, design, main }: TemplateProps) {
  const b = data.basics
  const photo = hasPhoto(b, design)
  const number = new Map(main.map((s, i) => [s.id, String(i + 1).padStart(2, '0')]))

  const header = (
    <header className="sw-header">
      <div className="sw-bar" />
      <Row left={photo ? <Photo basics={b} size="24mm" shape="square" className="sw-photo" /> : null} className="sw-head-row">
        <h1 className="sw-name">{displayName(b)}</h1>
        {b.title.trim() && <div className="sw-role">{b.title}</div>}
        <ContactList basics={b} layout="grid" className="sw-contact" showIcons={false} />
      </Row>
    </header>
  )

  const heading = (s: SectionView) => (
    <h2 className="sw-h">
      <span className="sw-h__no">{number.get(s.id)}</span>
      <span className="sw-h__text">{s.title}</span>
    </h2>
  )

  // the heading lives in the left track of each section's first row, so headings render nothing themselves
  const blocks = sectionsToBlocks(main, {
    heading: () => null,
    summary: (s) => (
      <Row left={heading(s)} className="sw-row--first">
        <RichParagraphs className="sw-summary" text={s.content} />
      </Row>
    ),
    entry: (e, s, i) => (i === 0 ? <div className="sw-row--first"><Entry e={e} label={heading(s)} /></div> : <Entry e={e} label={null} />),
    whole: (s) => {
      const node = compactWhole(s, 'sw-compact')
      return node === undefined ? undefined : <Row left={heading(s)} className="sw-row--first">{node}</Row>
    },
  })

  return (
    <PageLayout
      header={header}
      main={blocks}
      page={({ index, count, header, main }) => (
        <div className="sw-page">
          {header}
          {index > 0 && <div className="sw-bar sw-bar--thin" />}
          {main}
          {count > 1 && <div className="sw-folio">{`${index + 1}/${count}`}</div>}
        </div>
      )}
    />
  )
}
