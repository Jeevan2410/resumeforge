/**
 * Corporate Memphis — the friendly flat-illustration look, laid out like a product landing page. A
 * hero card puts the flat geometric character (tiny head, long bendy limbs, oversized body, waving
 * beside a laptop) on the left and the name, title and contact on the right. Below, every section hangs
 * its heading in a wide left gutter as a big coloured blob (sun, mint, coral, lilac in turn) with the
 * entries in the right track; pill-shaped date tags and confetti squiggles keep it cheerful.
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
  displayName,
  hasPhoto,
  sectionsToBlocks,
  type SectionView,
  type TemplateMeta,
  type TemplateProps,
} from '../shared'
import './memphis.css'

export const meta: TemplateMeta = {
  id: 'memphis',
  name: 'Corporate Memphis',
  description: 'A landing-page hero with a flat geometric character, and section headings hung in a left gutter as big friendly colour blobs.',
  tags: ['Creative', 'Modern', 'Photo'],
  order: 340,
  supportsPhoto: true,
  columns: 1,
  defaultFont: 'poppins',
  defaultAccent: '#5b45e0',
  headingCase: 'normal',
  gaps: { entry: 9, section: 15 },
}

/** Flat character with a laptop, a blob and confetti (decorative). */
function Character() {
  return (
    <svg className="me-art" viewBox="0 0 200 130" aria-hidden="true">
      <path className="me-blob" d="M40 70C30 30 80 6 120 14S196 40 188 82 140 128 96 124 50 110 40 70Z" />
      <path className="me-squig" d="M16 24c6-8 12 8 18 0s12 8 18 0" />
      <path className="me-squig me-squig--b" d="M156 116c6-8 12 8 18 0s12 8 18 0" />
      <circle className="me-dot" cx="22" cy="104" r="5" />
      <rect className="me-tri" x="176" y="18" width="10" height="10" transform="rotate(25 181 23)" />
      <path className="me-tri2" d="M60 10L68 24H52Z" />
      {/* legs */}
      <path className="me-leg" d="M104 88C100 104 92 114 78 124" />
      <path className="me-leg" d="M114 88C122 104 128 114 142 122" />
      <path className="me-shoe" d="M70 120h14v6H66Z" />
      <path className="me-shoe" d="M138 118h14l2 6h-16Z" />
      {/* body */}
      <path className="me-body" d="M88 48C96 40 124 40 132 50L136 94H84Z" />
      {/* arm waving */}
      <path className="me-arm" d="M130 56C146 50 152 36 150 20" />
      <circle className="me-skin" cx="150" cy="18" r="4.5" />
      {/* arm to laptop */}
      <path className="me-arm" d="M92 58C80 66 70 74 62 78" />
      {/* head */}
      <path className="me-neck" d="M106 38h8v8h-8Z" />
      <circle className="me-skin" cx="110" cy="31" r="9" />
      <path className="me-hair" d="M100 30C100 18 120 16 121 28C116 24 108 24 100 30Z" />
      {/* laptop */}
      <path className="me-laptop" d="M36 70h34l-6 20H30Z" />
      <path className="me-laptop-base" d="M26 90h44v4H26Z" />
      <circle className="me-logo" cx="51" cy="80" r="3" />
    </svg>
  )
}

const BLOBS = ['sun', 'mint', 'coral', 'lilac'] as const

export default function Memphis({ data, design, main }: TemplateProps) {
  const b = data.basics
  const vars = { '--me-coral': '#ff7a59', '--me-sun': '#ffc93c', '--me-mint': '#3fd0a6', '--me-sky': '#cfe8ff', '--me-ink': '#1d1b33' } as CSSProperties

  const header = (
    <header className="me-header">
      <Character />
      <div className="me-header__text">
        {hasPhoto(b, design) && <Photo basics={b} size="22mm" className="me-photo" />}
        <h1 className="me-name">{displayName(b)}</h1>
        {b.title.trim() && <div className="me-title">{b.title}</div>}
        <ContactList basics={b} layout="inline" className="me-contact" iconSize="0.92em" />
      </div>
    </header>
  )

  const tone = new Map(main.map((s, i) => [s.id, BLOBS[i % BLOBS.length]]))
  /** Two-track row: the heading blob hangs in the gutter of a section's first block. */
  const row = (node: ReactNode, info: { section: SectionView; first: boolean }) => (
    <div className="me-row">
      <div className="me-row__gutter">
        {info.first && (
          <h2 className={`me-h me-h--${tone.get(info.section.id) ?? 'sun'}`}>
            <span className="me-h__text">{info.section.title}</span>
          </h2>
        )}
      </div>
      <div className="me-row__body">{node}</div>
    </div>
  )

  const blocks = sectionsToBlocks(main, {
    heading: () => null,
    wrap: row,
    summary: (s) => <RichParagraphs className="me-summary" text={s.content} />,
    entry: (e) => compactEntry(e) ?? <DefaultEntry entry={e} variant="main" />,
    whole: (s) => compactWhole(s, 'me-compact'),
  })

  return (
    <PageLayout
      header={header}
      main={blocks}
      page={({ header, main }) => (
        <div className="me-page" style={vars}>
          {header}
          {main}
        </div>
      )}
    />
  )
}
