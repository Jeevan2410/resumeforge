/**
 * Code editor — the résumé is a source file open in an IDE. Every page is an editor window: a title
 * bar, an explorer panel listing one file per section (page 1 also shows the contact details and the
 * photo there), editor tabs, a breadcrumb, a minimap and a status bar. The content itself is code
 * with line numbers that run on across pages and syntax colours: the name and title are a doc
 * comment, each section is an exported constant, each role an object literal ({ role, at, when,
 * did: [...] }), and skills are arrays of strings. Single column of code.
 */
import type { CSSProperties, ReactNode } from 'react'
import { mmToPx } from '../../lib/templateData.ts'
import {
  ContactList,
  PageLayout,
  Photo,
  Rich,
  displayName,
  hasPhoto,
  type Block,
  type EntryView,
  type SectionView,
  type TemplateMeta,
  type TemplateProps,
} from '../shared'
import { isShortList } from '../shared/keep.ts'
import './codeeditor.css'

export const meta: TemplateMeta = {
  id: 'codeeditor',
  name: 'Code Editor',
  description: 'Your résumé as a source file in an IDE: an explorer, tabs and a status bar, roles as object literals and skills as string arrays, with real line numbers.',
  tags: ['Creative', 'Photo'],
  order: 630,
  collection: 'format',
  supportsPhoto: true,
  columns: 1,
  defaultFont: 'plex',
  defaultAccent: '#0969da',
  headingCase: 'normal',
  gaps: { entry: 0, section: 6 },
}

/** "Work experience" → "workExperience" (a valid-looking identifier). */
const ident = (t: string) => {
  const w = t
    .normalize('NFD')
    .replace(/[^\w\s]/g, '')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
  if (!w.length) return 'section'
  const s = w.map((x, i) => (i ? x[0].toUpperCase() + x.slice(1).toLowerCase() : x.toLowerCase())).join('')
  return /^\d/.test(s) ? `_${s}` : s
}

const FILE_EXT: Partial<Record<string, string>> = { summary: 'md', skills: 'json', languages: 'json', interests: 'txt' }

const ONE_LINE = new Set(['certifications', 'awards', 'languages', 'interests', 'references', 'publications'])

export default function CodeEditor({ data, design, main }: TemplateProps) {
  const b = data.basics
  const name = displayName(b)
  const vars = {
    '--ce-kw': '#cf222e',
    '--ce-str': '#0a3069',
    '--ce-prop': '#0550ae',
    '--ce-fn': '#8250df',
    '--ce-com': '#6e7781',
    '--ce-chrome': '#f6f8fa',
    '--ce-line': '#d0d7de',
  } as CSSProperties

  // line numbers run on through the whole file (blocks never split, so pages stay continuous)
  let n = 0
  const line = (indent: number, content: ReactNode, cls = '') => (
    <div className={`ce-l ${cls}`} style={{ '--ce-i': indent } as CSSProperties}>
      <span className="ce-n" aria-hidden="true">
        {++n}
      </span>
      <span className="ce-c">{content}</span>
    </div>
  )
  const p = (t: string) => <span className="ce-p">{t}</span>
  const kw = (t: string) => <span className="ce-kw">{t}</span>
  const key = (k: string) => (
    <span className="ce-key" aria-hidden="true">
      {k}:{' '}
    </span>
  )
  const str = (node: ReactNode) => (
    <span className="ce-str">
      <span aria-hidden="true">"</span>
      {node}
      <span aria-hidden="true">"</span>
    </span>
  )
  const arr = (items: string[]) => (
    <>
      {p('[')}
      {items.map((k, i) => (
        <span key={k}>
          {str(k)}
          {i < items.length - 1 && p(', ')}
        </span>
      ))}
      {p(']')}
    </>
  )

  const header = (
    <header className="ce-head">
      {line(0, <span className="ce-com">/**</span>)}
      {line(
        0,
        <span className="ce-com">
          {' * '}
          <h1 className="ce-name">{name}</h1>
        </span>,
        'ce-l--name',
      )}
      {b.title.trim() && line(0, <span className="ce-com"> * @role {b.title}</span>)}
      {b.location.trim() && line(0, <span className="ce-com"> * @location {b.location}</span>)}
      {line(0, <span className="ce-com"> */</span>)}
    </header>
  )

  const heading = (s: SectionView) => (
    <>
      {line(0, <h2 className="ce-h">// {s.title}</h2>)}
      {s.kind !== 'summary' &&
        line(
          0,
          <span aria-hidden="true">
            {kw('export const ')}
            <span className="ce-var">{ident(s.title)}</span>
            {p(s.kind === 'skills' ? ' = {' : ' = [')}
          </span>,
        )}
    </>
  )

  const close = (s: SectionView) => line(0, p(s.kind === 'skills' ? '}' : ']'))

  const object = (e: EntryView) => {
    return (
      <div className="ce-obj">
        {line(1, p('{'))}
        {line(
          2,
          <>
            {key('role')}
            <h3 className="ce-title">{str(e.title)}</h3>
            {p(',')}
          </>,
        )}
        {(e.subtitle || e.date) &&
          line(
            2,
            <>
              {e.subtitle && <>{key('at')}{str(e.subtitle)}{p(', ')}</>}
              {e.location && <>{key('in')}{str(e.location)}{p(', ')}</>}
              {e.date && <>{key('when')}<span className="ce-date">{str(e.date)}</span>{p(',')}</>}
            </>,
            'ce-l--wrap',
          )}
        {e.url && line(2, <>{key('url')}{str(e.url)}{p(',')}</>)}
        {e.description && line(2, <>{key('about')}{str(<Rich text={e.description} />)}{p(',')}</>, 'ce-l--wrap')}
        {e.bullets.length > 0 && (
          <>
            {line(2, <>{key('did')}{p('[')}</>)}
            {e.bullets.map((t, i) => (
              <div key={i}>{line(3, <>{str(<Rich text={t} />)}{p(',')}</>, 'ce-l--wrap')}</div>
            ))}
            {line(2, p('],'))}
          </>
        )}
        {e.keywords.length > 0 && line(2, <>{key('stack')}{arr(e.keywords)}{p(',')}</>, 'ce-l--wrap')}
        {e.meta && line(2, <>{key('note')}{str(e.meta)}{p(',')}</>)}
        {line(1, p('},'))}
      </div>
    )
  }

  const oneLine = (e: EntryView) => {
    const extra = [e.subtitle, e.levelLabel, e.date, e.description].filter(Boolean).join(' · ')
    return line(
      1,
      <>
        <span className="ce-str-wrap">{str(<b className="ce-strong">{e.title}</b>)}</span>
        {p(',')}
        {extra && <span className="ce-com"> // {extra}</span>}
      </>,
      'ce-l--wrap',
    )
  }

  const skillsWhole = (s: SectionView) => (
    <>
      {s.entries.map((e) => (
        <div key={e.id}>
          {line(
            1,
            <>
              <span className="ce-key">
                <b className="ce-strong">{ident(e.title)}</b>:{' '}
              </span>
              {arr(e.keywords.length ? e.keywords : [e.title])}
              {p(',')}
              {e.levelLabel && <span className="ce-com"> // {e.levelLabel}</span>}
            </>,
            'ce-l--wrap',
          )}
        </div>
      ))}
    </>
  )

  const files = main.map((s) => `${ident(s.title)}.${FILE_EXT[s.kind] ?? 'ts'}`)

  // built by hand (not sectionsToBlocks) so lines are created, and numbered, in reading order
  const blocks: Block[] = []
  for (const s of main) {
    if (s.kind === 'summary') {
      blocks.push({
        key: `${s.id}:all`,
        sectionId: s.id,
        gap: 'section',
        node: (
          <>
            {heading(s)}
            {line(0, <span aria-hidden="true">{kw('export const ')}<span className="ce-var">{ident(s.title)}</span>{p(' = `')}</span>)}
            {s.content
              .split(/\n+/)
              .filter((t) => t.trim())
              .map((t, i) => (
                <div key={i}>{line(1, <Rich as="span" className="ce-str" text={t} />, 'ce-l--wrap')}</div>
              ))}
            {line(0, p('`'))}
          </>
        ),
      })
      continue
    }
    if (s.kind === 'skills') {
      blocks.push({ key: `${s.id}:all`, sectionId: s.id, gap: 'section', node: <>{heading(s)}{skillsWhole(s)}{close(s)}</> })
      continue
    }
    const keep = isShortList(s)
    s.entries.forEach((e, i) => {
      const first = i === 0
      const last = i === s.entries.length - 1
      const head = first ? heading(s) : null
      const body = ONE_LINE.has(e.kind) || (!e.bullets.length && !e.description && !e.date) ? oneLine(e) : object(e)
      blocks.push({
        key: `${s.id}:${e.id}`,
        sectionId: s.id,
        entryId: e.id,
        gap: last ? 'section' : 'entry',
        keepWithNext: keep && !last ? true : undefined,
        node: (
          <>
            {head}
            {body}
            {last && close(s)}
          </>
        ),
      })
    })
  }

  return (
    <PageLayout
      header={header}
      main={blocks}
      bottom={mmToPx(9)}
      page={({ index, count, header, main }) => (
        <div className="ce-page" style={vars}>
          <div className="ce-titlebar" aria-hidden="true">
            <span className="ce-dots">
              <i />
              <i />
              <i />
            </span>
            <span className="ce-titlebar__name">resume.ts — {name}</span>
          </div>
          <div className="ce-body">
            <div className="ce-activity" aria-hidden="true">
              <span className="ce-act ce-act--on" />
              <span className="ce-act" />
              <span className="ce-act" />
              <span className="ce-act" />
            </div>
            <aside className="ce-explorer">
              <div className="ce-explorer__title" aria-hidden="true">
                Explorer
              </div>
              <div className="ce-folder" aria-hidden="true">
                ▾ {ident(name).toLowerCase()}
              </div>
              <ul className="ce-files" aria-hidden="true">
                <li className="ce-file ce-file--on">resume.ts</li>
                {files.map((f) => (
                  <li key={f} className="ce-file">
                    {f}
                  </li>
                ))}
              </ul>
              {index === 0 && (
                <>
                  <div className="ce-explorer__title ce-explorer__title--gap" aria-hidden="true">
                    Contact
                  </div>
                  <ContactList basics={b} layout="stack" className="ce-contact" itemClassName="ce-contact__item" iconSize="0.95em" />
                  {hasPhoto(b, design) && (
                    <>
                      <div className="ce-explorer__title ce-explorer__title--gap" aria-hidden="true">
                        avatar.png
                      </div>
                      <Photo basics={b} size="26mm" shape="rounded" className="ce-photo" />
                    </>
                  )}
                </>
              )}
            </aside>
            <div className="ce-editor">
              <div className="ce-tabs" aria-hidden="true">
                <span className="ce-tab ce-tab--on">resume.ts</span>
                <span className="ce-tab">README.md</span>
              </div>
              <div className="ce-crumbs" aria-hidden="true">
                src › resume.ts › {name}
              </div>
              <div className="ce-code">
                {header}
                {main}
              </div>
              <div className="ce-minimap" aria-hidden="true" />
            </div>
          </div>
          <div className="ce-status" aria-hidden="true">
            <span>⎇ main</span>
            <span>✓ 0 problems</span>
            <span className="ce-status__fill" />
            <span>
              Page {index + 1} of {count}
            </span>
            <span>UTF-8</span>
            <span>TypeScript</span>
          </div>
        </div>
      )}
    />
  )
}
