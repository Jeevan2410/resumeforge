/**
 * Type-collage — letterforms are the artwork. Page 1 opens with the name cut up and pasted: the first
 * name in heavy condensed capitals, the rest in a big italic display serif overlapping it, a giant
 * outlined initial behind both, the title on a tilted label and the contact in a mono strip. Every
 * section heading mixes three voices: a large italic serif number, the title in heavy capitals and a
 * tiny mono tag, over a rule. Body text stays plain and readable. Single column.
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
  useFont,
  type SectionView,
  type TemplateMeta,
  type TemplateProps,
} from '../shared'
import './typecollage.css'

export const meta: TemplateMeta = {
  id: 'typecollage',
  name: 'Type Collage',
  description: 'Letterforms as the artwork: a cut-and-pasted name in mixed fonts and scales, giant outlined initials and three-voice section headings.',
  tags: ['Creative', 'Photo'],
  order: 450,
  collection: 'style',
  supportsPhoto: true,
  columns: 1,
  defaultFont: 'montserrat',
  defaultAccent: '#ff4f1f',
  headingCase: 'upper',
  gaps: { entry: 10, section: 15 },
}

export default function TypeCollage({ data, design, main }: TemplateProps) {
  useFont('playfair') // the italic display serif is part of the collage whatever the body font
  const b = data.basics
  const name = displayName(b)
  const [first, ...rest] = name.split(/\s+/)
  const vars = { '--tc-serif': "'Playfair Display', Georgia, serif", '--tc-ink': '#141414', '--tc-paper': '#f7f4ee' } as CSSProperties
  const number = new Map(main.map((s, i) => [s.id, String(i + 1).padStart(2, '0')]))

  const header = (
    <header className="tc-header">
      <span className="tc-ghost" aria-hidden="true">
        {first.charAt(0)}
      </span>
      {hasPhoto(b, design) && <Photo basics={b} size="28mm" shape="square" className="tc-photo" />}
      <h1 className="tc-name">
        <span className="tc-name__a">{first}</span>
        {rest.length > 0 && <span className="tc-name__b">{rest.join(' ')}</span>}
      </h1>
      {b.title.trim() && <div className="tc-label">{b.title}</div>}
      <ContactList basics={b} layout="inline" showIcons={false} separator="/" className="tc-contact" />
    </header>
  )

  const heading = (s: SectionView): ReactNode => (
    <h2 className="tc-h">
      <span className="tc-h__num" aria-hidden="true">
        {number.get(s.id)}
      </span>
      <span className="tc-h__title">{s.title}</span>
      <span className="tc-h__tag" aria-hidden="true">
        {s.kind}
      </span>
    </h2>
  )

  const blocks = sectionsToBlocks(main, {
    heading,
    summary: (s) => <RichParagraphs className="tc-summary" text={s.content} />,
    entry: (e) => compactEntry(e) ?? <DefaultEntry entry={e} variant="main" marker="dash" />,
    whole: (s) => compactWhole(s, 'tc-compact'),
  })

  return (
    <PageLayout
      header={header}
      main={blocks}
      page={({ index, header, main }) => (
        <div className="tc-page" style={vars}>
          {header}
          {index > 0 && (
            <div className="tc-cap" aria-hidden="true">
              {name}
            </div>
          )}
          <div className="tc-body">{main}</div>
        </div>
      )}
    />
  )
}
