/**
 * Risograph — a two-colour zine spread printed on a riso duplicator. Fluorescent pink and a deep blue
 * (the accent) overprint with multiply blending, a fine paper grain sits over everything and the
 * colours are slightly misregistered. Page 1 is an editorial cover split in two: the name stacked huge
 * on the left as offset pink and blue plates over overlapping halftone shapes, the summary set as a
 * large pull quote on the right. Below, the body runs in two columns with stamped, misregistered
 * headings. Main column first in the DOM.
 */
import type { CSSProperties, ReactNode } from 'react'
import {
  ContactList,
  DefaultEntry,
  PageLayout,
  Photo,
  Rich,
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
import './risograph.css'

export const meta: TemplateMeta = {
  id: 'risograph',
  name: 'Risograph',
  description: 'A two-colour zine cover: an overprinted, misregistered name beside a big pull-quote summary, with paper grain and spot-colour halftones.',
  tags: ['Creative', 'Two-column', 'Photo'],
  order: 400,
  supportsPhoto: true,
  columns: 2,
  defaultFont: 'montserrat',
  defaultAccent: '#2b4fd8',
  sideKinds: ['education', 'skills', 'languages', 'certifications', 'awards', 'interests', 'references'],
  headingCase: 'upper',
  gaps: { entry: 10, section: 15 },
}

const Grain = () => (
  <svg className="rg-grain" aria-hidden="true">
    <filter id="rg-noise">
      <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
      <feColorMatrix values="0 0 0 0 0.2  0 0 0 0 0.15  0 0 0 0 0.2  0 0 0 0.35 0" />
    </filter>
    <rect width="100%" height="100%" filter="url(#rg-noise)" />
  </svg>
)

const heading = (s: SectionView | string) => {
  const t = typeof s === 'string' ? s : s.title
  return (
    <h2 className="rg-h" data-text={t}>
      {t}
    </h2>
  )
}

const entry = (e: EntryView): ReactNode => compactEntry(e) ?? <DefaultEntry entry={e} variant="main" marker="square" />

export default function Risograph({ data, design, main, side }: TemplateProps) {
  const b = data.basics
  const name = displayName(b)
  const vars = { '--rg-pink': '#ff48b0', '--rg-paper': '#f6f1e7', '--rg-ink': '#1d1f3a' } as CSSProperties

  // the first summary becomes the cover's pull quote
  const summary = main.find((s) => s.kind === 'summary')
  const body = summary ? main.filter((s) => s !== summary) : main

  const header = (
    <header className="rg-cover">
      <div className="rg-cover__left">
        <span className="rg-shape rg-shape--circle" aria-hidden="true" />
        <span className="rg-shape rg-shape--block" aria-hidden="true" />
        {hasPhoto(b, design) && <Photo basics={b} size="26mm" className="rg-photo" />}
        <h1 className="rg-name" data-text={name}>
          {name}
        </h1>
        {b.title.trim() && <div className="rg-title">{b.title}</div>}
      </div>
      <div className="rg-cover__right">
        {summary && (
          <blockquote className="rg-quote" data-section-id={summary.id}>
            <Rich as="div" text={summary.content.split(/\n\s*\n/)[0]} />
          </blockquote>
        )}
        {contactEntries(b).length > 0 && <ContactList basics={b} layout="stack" className="rg-contact" iconSize="0.9em" />}
      </div>
    </header>
  )

  const mainBlocks = sectionsToBlocks(body, {
    heading,
    summary: (s) => <RichParagraphs className="rg-summary" text={s.content} />,
    entry,
  })
  const sideBlocks: Block[] = sectionsToBlocks(side, {
    heading,
    entry,
    whole: (s) => (s.kind === 'interests' || s.kind === 'languages' ? inlineWhole(s, 'rg-inline') : undefined),
  })

  return (
    <PageLayout
      header={header}
      main={mainBlocks}
      side={sideBlocks}
      page={({ index, header, main, side }) => (
        <div className="rg-page" style={vars}>
          {header}
          {index > 0 && <div className="rg-cap" aria-hidden="true" />}
          <div className="rg-cols">
            <div className="rg-main">{main}</div>
            <aside className="rg-side">{side}</aside>
          </div>
          <Grain />
        </div>
      )}
    />
  )
}
