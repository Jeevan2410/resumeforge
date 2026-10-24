/**
 * Victorian — an engraved certificate. Ivory paper inside an ornate double border in jewel tones with
 * a scrolling flourish in every corner; page 1 is crowned by a centred cartouche (the name in an
 * italic display serif between fleurons, the title in small capitals and the contact on a ribbon). The
 * body sits in two columns divided by a vertical spine of fleurons: a narrow emerald-headed column on
 * the left for skills and languages, the main column on the right with burgundy headings on a gold
 * rule. Main column first in the DOM.
 */
import type { CSSProperties, ReactNode } from 'react'
import {
  ContactList,
  DefaultEntry,
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
import './victorian.css'

export const meta: TemplateMeta = {
  id: 'victorian',
  name: 'Victorian',
  description: 'An engraved certificate: ornate jewel-tone borders with corner flourishes, a centred cartouche and two columns split by a spine of fleurons.',
  tags: ['Classic', 'Two-column', 'Photo'],
  order: 420,
  supportsPhoto: true,
  columns: 2,
  defaultFont: 'playfair',
  defaultAccent: '#7a1f3d',
  sideKinds: ['skills', 'languages', 'certifications', 'awards', 'interests', 'references'],
  headingCase: 'normal',
  gaps: { entry: 9, section: 15 },
}

/** Scrolling corner flourish, drawn for the top-left corner and mirrored for the others. */
const Corner = ({ className }: { className: string }) => (
  <svg className={`vc-corner ${className}`} viewBox="0 0 80 80" aria-hidden="true">
    <path d="M4 76V20C4 10 10 4 20 4H76" />
    <path d="M12 76V26C12 17 17 12 26 12H76" className="vc-corner__thin" />
    <path d="M20 40C20 28 28 20 40 20C34 26 30 30 30 38S36 50 44 46 46 34 38 34" />
    <path d="M24 60c4-8 12-10 16-6s0 10-6 8" className="vc-corner__thin" />
    <path d="M60 24c-8 4-10 12-6 16s10 0 8-6" className="vc-corner__thin" />
    <circle cx="40" cy="40" r="2.6" className="vc-corner__dot" />
  </svg>
)

const Fleuron = ({ className = 'vc-fleuron' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 40 20" aria-hidden="true">
    <path d="M20 2C24 8 30 10 38 10C30 10 24 12 20 18C16 12 10 10 2 10C10 10 16 8 20 2Z" />
    <circle cx="20" cy="10" r="2" className="vc-fleuron__eye" />
  </svg>
)

const mainHeading = (s: SectionView) => (
  <h2 className="vc-h">
    <span>{s.title}</span>
  </h2>
)
const sideHeading = (s: SectionView) => (
  <h3 className="vc-sh">
    <Fleuron className="vc-sh__mark" />
    <span>{s.title}</span>
  </h3>
)

const sideEntry = (e: EntryView): ReactNode => compactEntry(e) ?? <DefaultEntry entry={e} variant="side" level={e.kind === 'skills' ? 'text' : undefined} />

export default function Victorian({ data, design, main, side }: TemplateProps) {
  const b = data.basics
  const vars = { '--vc-paper': '#fbf6ea', '--vc-ink': '#2a1d17', '--vc-emerald': '#1f5e4a', '--vc-gold': '#b8923a' } as CSSProperties

  const header = (
    <header className="vc-cartouche">
      {hasPhoto(b, design) && <Photo basics={b} size="26mm" shape="circle" className="vc-photo" />}
      <div className="vc-name-row">
        <Fleuron />
        <h1 className="vc-name">{displayName(b)}</h1>
        <Fleuron />
      </div>
      {b.title.trim() && <div className="vc-title">{b.title}</div>}
      <div className="vc-ribbon">
        <ContactList basics={b} layout="inline" className="vc-contact" separator="❦" showIcons={false} />
      </div>
    </header>
  )

  const mainBlocks = sectionsToBlocks(main, {
    heading: mainHeading,
    summary: (s) => <RichParagraphs className="vc-summary" text={s.content} />,
    entry: (e) => compactEntry(e) ?? <DefaultEntry entry={e} variant="main" />,
  })
  const sideBlocks = sectionsToBlocks(side, {
    heading: sideHeading,
    entry: sideEntry,
    whole: (s) => (s.kind === 'interests' ? inlineWhole(s, 'vc-inline') : undefined),
  })

  return (
    <PageLayout
      header={header}
      main={mainBlocks}
      side={sideBlocks}
      page={({ header, main, side }) => (
        <div className="vc-page" style={vars}>
          <span className="vc-frame" aria-hidden="true" />
          <Corner className="vc-corner--tl" />
          <Corner className="vc-corner--tr" />
          <Corner className="vc-corner--bl" />
          <Corner className="vc-corner--br" />
          <div className="vc-body">
            {header}
            <div className="vc-cols">
              <div className="vc-main">{main}</div>
              <div className="vc-spine" aria-hidden="true">
                <Fleuron className="vc-spine__mark" />
              </div>
              <aside className="vc-side">{side}</aside>
            </div>
          </div>
        </div>
      )}
    />
  )
}
