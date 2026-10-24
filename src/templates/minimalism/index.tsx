/**
 * Minimalism — nothing but type. One family, black on white, no rules, no icons and no colour beyond
 * an optional accent on links: a large light-weight name, tiny tracked labels and wide margins. The
 * hierarchy comes from size, weight and space alone. Single column; compact rows for skills,
 * languages and certifications keep it to a page.
 */
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
import './minimalism.css'

export const meta: TemplateMeta = {
  id: 'minimalism',
  name: 'Minimalism',
  description: 'Extreme simplicity: a single typeface, black on white, no rules or ornament, with hierarchy from size, weight and space.',
  tags: ['ATS-friendly', 'Modern', 'One-page'],
  order: 240,
  supportsPhoto: true,
  columns: 1,
  defaultFont: 'inter',
  defaultAccent: '#111111',
  headingCase: 'upper',
  gaps: { entry: 10, section: 15 },
}

const heading = (s: SectionView) => <h2 className="mn-h">{s.title}</h2>

export default function Minimalism({ data, design, main }: TemplateProps) {
  const b = data.basics

  const header = (
    <header className="mn-header">
      {hasPhoto(b, design) && <Photo basics={b} size="20mm" className="mn-photo" />}
      <h1 className="mn-name">{displayName(b)}</h1>
      {b.title.trim() && <div className="mn-role">{b.title}</div>}
      <ContactList basics={b} layout="inline" showIcons={false} separator="   " className="mn-contact" />
    </header>
  )

  const blocks = sectionsToBlocks(main, {
    heading,
    summary: (s) => <RichParagraphs className="mn-summary" text={s.content} />,
    entry: (e) => compactEntry(e) ?? <DefaultEntry entry={e} variant="main" marker="none" />,
    whole: (s) => compactWhole(s, 'mn-compact'),
  })

  return (
    <PageLayout
      header={header}
      main={blocks}
      page={({ header, main }) => (
        <div className="mn-page">
          {header}
          {main}
        </div>
      )}
    />
  )
}
