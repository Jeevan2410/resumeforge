/**
 * Kawaii — a cute spiral-bound planner. Every page has a row of binder rings down the left edge and
 * faint dotted grid paper; each section's heading is a pastel index tab sticking out of the right edge
 * of the page (pink, mint, lavender, butter in turn), and its heading text also opens the section. Page 1
 * starts with a rounded cloud card holding a smiling mascot (or the photo), the name and the title on
 * a candy pill. Skills become pastel candy chips. Single column, rounded everything.
 */
import type { CSSProperties, ReactNode } from 'react'
import {
  ContactList,
  DefaultEntry,
  Keywords,
  PageLayout,
  Photo,
  RichParagraphs,
  compactEntry,
  displayName,
  hasPhoto,
  inlineWhole,
  sectionsToBlocks,
  type EntryView,
  type SectionView,
  type TemplateMeta,
  type TemplateProps,
} from '../shared'
import './kawaii.css'

export const meta: TemplateMeta = {
  id: 'kawaii',
  name: 'Kawaii',
  description: 'A cute spiral-bound planner: binder rings, pastel index tabs on the page edge, a smiling mascot and candy-chip skills.',
  tags: ['Creative', 'Photo'],
  order: 430,
  collection: 'style',
  supportsPhoto: true,
  columns: 1,
  defaultFont: 'poppins',
  defaultAccent: '#f2668b',
  headingCase: 'normal',
  gaps: { entry: 9, section: 14 },
}

const TABS = ['pink', 'mint', 'lilac', 'butter'] as const

/** A smiling cloud with blush cheeks and a sparkle (decorative). */
const Mascot = () => (
  <svg className="kw-mascot" viewBox="0 0 100 80" aria-hidden="true">
    <path className="kw-mascot__body" d="M22 66C8 66 4 52 12 44C6 30 20 20 32 26C36 12 58 8 66 22C80 18 94 30 88 44C98 52 92 66 80 66Z" />
    <circle className="kw-mascot__eye" cx="40" cy="44" r="3.4" />
    <circle className="kw-mascot__eye" cx="62" cy="44" r="3.4" />
    <circle className="kw-mascot__shine" cx="41.2" cy="42.8" r="1.1" />
    <circle className="kw-mascot__shine" cx="63.2" cy="42.8" r="1.1" />
    <ellipse className="kw-mascot__blush" cx="33" cy="52" rx="5" ry="3" />
    <ellipse className="kw-mascot__blush" cx="69" cy="52" rx="5" ry="3" />
    <path className="kw-mascot__smile" d="M46 52c2 3 8 3 10 0" />
    <path className="kw-mascot__spark" d="M88 8l2 5 5 2-5 2-2 5-2-5-5-2 5-2Z" />
    <path className="kw-mascot__spark kw-mascot__spark--b" d="M10 10l1.4 3.4 3.4 1.4-3.4 1.4L10 19.6 8.6 16.2 5.2 14.8l3.4-1.4Z" />
  </svg>
)

function entry(e: EntryView): ReactNode {
  if (e.kind === 'skills') {
    return (
      <div className="rf-entry rf-entry--skills rf-entry--main kw-skill">
        {e.title && <span className="kw-skill__name">{e.title}</span>}
        <Keywords items={e.keywords} variant="chips" className="kw-chips" chipClassName="kw-chip" />
      </div>
    )
  }
  return compactEntry(e) ?? <DefaultEntry entry={e} variant="main" />
}

export default function Kawaii({ data, design, main }: TemplateProps) {
  const b = data.basics
  const vars = { '--kw-pink': '#ffc6d6', '--kw-mint': '#c4f0dc', '--kw-lilac': '#ddd0ff', '--kw-butter': '#fff0a8', '--kw-ink': '#4a3a4f' } as CSSProperties
  const tab = new Map(main.map((s, i) => [s.id, TABS[i % TABS.length]]))

  const header = (
    <header className="kw-cloud">
      {hasPhoto(b, design) ? <Photo basics={b} size="26mm" className="kw-photo" /> : <Mascot />}
      <div className="kw-cloud__text">
        <h1 className="kw-name">{displayName(b)}</h1>
        {b.title.trim() && <div className="kw-title">{b.title}</div>}
        <ContactList basics={b} layout="inline" className="kw-contact" iconSize="0.9em" />
      </div>
    </header>
  )

  /** The section heading doubles as an index tab that sticks out of the right page edge. */
  const heading = (s: SectionView) => (
    <h2 className={`kw-h kw-h--${tab.get(s.id) ?? 'pink'}`}>
      <span className="kw-h__text">{s.title}</span>
      <span className="kw-tab" aria-hidden="true">
        {s.title}
      </span>
    </h2>
  )

  const blocks = sectionsToBlocks(main, {
    heading,
    summary: (s) => <RichParagraphs className="kw-summary" text={s.content} />,
    entry,
    whole: (s) => (s.kind === 'languages' || s.kind === 'interests' ? inlineWhole(s, 'kw-inline') : undefined),
  })

  return (
    <PageLayout
      header={header}
      main={blocks}
      page={({ header, main }) => (
        <div className="kw-page" style={vars}>
          <div className="kw-rings" aria-hidden="true">
            {Array.from({ length: 14 }, (_, i) => (
              <i key={i} />
            ))}
          </div>
          <div className="kw-body">
            {header}
            {main}
          </div>
        </div>
      )}
    />
  )
}
