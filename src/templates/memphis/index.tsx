/**
 * Corporate Memphis — the friendly flat-illustration look. A header with a flat geometric character
 * (tiny head, long bendy limbs, oversized body) waving beside a laptop, surrounded by blobs and
 * confetti squiggles in bright, cheerful colours; rounded type, soft blob markers on the headings,
 * pill-shaped date tags and a single readable column below.
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
import './memphis.css'

export const meta: TemplateMeta = {
  id: 'memphis',
  name: 'Corporate Memphis',
  description: 'A flat geometric character with exaggerated proportions, friendly blobs and confetti in bright, approachable colours.',
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

const heading = (s: SectionView) => (
  <h2 className="me-h">
    <span className="me-h__blob" aria-hidden="true" />
    <span className="me-h__text">{s.title}</span>
  </h2>
)

export default function Memphis({ data, design, main }: TemplateProps) {
  const b = data.basics
  const vars = { '--me-coral': '#ff7a59', '--me-sun': '#ffc93c', '--me-mint': '#3fd0a6', '--me-sky': '#cfe8ff', '--me-ink': '#1d1b33' } as CSSProperties

  const header = (
    <header className="me-header">
      <div className="me-header__text">
        {hasPhoto(b, design) && <Photo basics={b} size="22mm" className="me-photo" />}
        <h1 className="me-name">{displayName(b)}</h1>
        {b.title.trim() && <div className="me-title">{b.title}</div>}
        <ContactList basics={b} layout="inline" className="me-contact" iconSize="0.92em" />
      </div>
      <Character />
    </header>
  )

  const blocks = sectionsToBlocks(main, {
    heading,
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
