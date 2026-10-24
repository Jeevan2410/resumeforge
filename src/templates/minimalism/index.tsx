/**
 * Minimalism — nothing but type, and the order turned upside down: the page opens straight on the
 * summary set large like a statement, and the identity sits at the foot of the page as a signature —
 * a big light-weight name with the title and contact beside it. Later pages repeat the name small with
 * a page number in the same footer band. One family, black on white, no rules, icons or colour.
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
  mmToPx,
  sectionsToBlocks,
  type SectionView,
  type TemplateMeta,
  type TemplateProps,
} from '../shared'
import './minimalism.css'

export const meta: TemplateMeta = {
  id: 'minimalism',
  name: 'Minimalism',
  description: 'Extreme simplicity flipped: the summary opens the page as a large statement and your name signs off at the foot, all in one typeface on white.',
  tags: ['Modern', 'One-page', 'Photo'],
  order: 240,
  supportsPhoto: true,
  columns: 1,
  defaultFont: 'inter',
  defaultAccent: '#111111',
  headingCase: 'upper',
  gaps: { entry: 10, section: 15 },
}

const heading = (s: SectionView) => <h2 className="mn-h">{s.title}</h2>

const FOOT_MM = 24

export default function Minimalism({ data, design, main }: TemplateProps) {
  const b = data.basics
  const name = displayName(b)

  const header = (
    <footer className="mn-sign">
      {hasPhoto(b, design) && <Photo basics={b} size="20mm" className="mn-photo" />}
      <h1 className="mn-name">{name}</h1>
      <div className="mn-sign__meta">
        {b.title.trim() && <div className="mn-role">{b.title}</div>}
        <ContactList basics={b} layout="grid" showIcons={false} className="mn-contact" />
      </div>
    </footer>
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
      bottom={mmToPx(design.margin + FOOT_MM)}
      page={({ index, count, header, main }) => (
        <div className="mn-page">
          <div className="mn-body">{main}</div>
          <div className="mn-foot">
            {header ?? (
              <div className="mn-foot__small">
                <span>{name}</span>
                <span>{index + 1}{count > 1 ? ` / ${count}` : ''}</span>
              </div>
            )}
          </div>
        </div>
      )}
    />
  )
}
