/**
 * Vaporwave — a 1980s sunset in the header: a gradient sky, a striped setting sun, a neon
 * perspective grid running to the horizon, a palm silhouette and a classical marble bust, with the
 * name in white carrying a cyan/magenta glitch offset. Below, a clean white page with neon-gradient
 * rules under the headings and a thin grid strip on later pages. Single column.
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
import './vaporwave.css'

export const meta: TemplateMeta = {
  id: 'vaporwave',
  name: 'Vaporwave',
  description: 'A neon 1980s sunset with a perspective grid, a classical bust and glitchy lettering over a clean white page.',
  tags: ['Creative', 'Photo'],
  order: 360,
  supportsPhoto: true,
  columns: 1,
  defaultFont: 'montserrat',
  defaultAccent: '#d1338f',
  headingCase: 'upper',
  gaps: { entry: 9, section: 14 },
}

/** Sunset scene: sun, horizon grid, palm and bust (decorative). Drawn in a 400×120 box. */
function Sunset() {
  const verticals: ReactNode[] = []
  for (let i = -10; i <= 10; i++) verticals.push(<line key={`v${i}`} x1={200 + i * 12} y1={84} x2={200 + i * 60} y2={124} />)
  const horizontals = [86, 89, 93, 98, 105, 114].map((y) => <line key={`h${y}`} x1={0} y1={y} x2={400} y2={y} />)
  return (
    <svg className="vw-scene" viewBox="0 0 400 120" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
      <defs>
        <linearGradient id="vw-sun" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffe66d" />
          <stop offset="0.55" stopColor="#ff8a5c" />
          <stop offset="1" stopColor="#ff3d9a" />
        </linearGradient>
        <clipPath id="vw-sun-cut">
          <rect x="0" y="0" width="400" height="58" />
          <rect x="0" y="61" width="400" height="5" />
          <rect x="0" y="69" width="400" height="4" />
          <rect x="0" y="76" width="400" height="3" />
          <rect x="0" y="81" width="400" height="2" />
        </clipPath>
      </defs>
      <circle cx="292" cy="84" r="44" fill="url(#vw-sun)" clipPath="url(#vw-sun-cut)" />
      <rect className="vw-floor" x="0" y="84" width="400" height="40" />
      <g className="vw-grid">
        {verticals}
        {horizontals}
      </g>
      {/* palm */}
      <g className="vw-palm" transform="translate(352 84) scale(0.7) translate(-352 -84)">
        <path d="M352 84C350 66 352 52 357 40" fill="none" strokeWidth="3" />
        <path d="M357 40C346 34 334 36 326 44C338 40 348 42 357 40ZM357 40C366 32 380 32 388 38C376 37 366 38 357 40ZM357 40C352 30 352 22 356 14C358 24 360 32 357 40ZM357 40C368 42 376 50 380 60C370 52 362 46 357 40ZM357 40C346 44 340 52 338 62C346 52 352 46 357 40Z" />
      </g>
      {/* bust in profile, on a plinth */}
      <g className="vw-bust" transform="translate(266 84) scale(0.62) translate(-222 -84)">
        <path d="M200 84V78H244V84Z" />
        <path d="M206 78C206 70 210 64 216 62C214 58 212 54 212 50C206 49 203 46 204 43C206 41 206 39 205 36C202 34 202 31 205 29C204 24 206 18 212 14C218 9 228 9 234 13C241 17 244 25 242 33C241 40 238 45 236 50C236 55 238 59 242 62C246 66 248 72 248 78Z" />
        <path className="vw-bust__hair" d="M212 14C218 8 230 8 236 13C242 18 244 26 241 32C238 28 236 24 232 22C228 24 222 24 218 21C216 24 214 26 211 27C209 22 209 18 212 14Z" />
      </g>
    </svg>
  )
}

const heading = (s: SectionView) => (
  <h2 className="vw-h">
    <span className="vw-h__text">{s.title}</span>
  </h2>
)

export default function Vaporwave({ data, design, main }: TemplateProps) {
  const b = data.basics
  const vars = { '--vw-cyan': '#25d8f0', '--vw-violet': '#6c2bd9', '--vw-night': '#1c0f3f', '--vw-ink': '#21173a' } as CSSProperties

  const header = (
    <header className="vw-header">
      <Sunset />
      <div className="vw-header__inner">
        {hasPhoto(b, design) && <Photo basics={b} size="25mm" className="vw-photo" />}
        <div className="vw-header__text">
          <h1 className="vw-name">{displayName(b)}</h1>
          {b.title.trim() && <div className="vw-title">{b.title}</div>}
        </div>
      </div>
    </header>
  )

  const blocks = sectionsToBlocks(main, {
    heading,
    summary: (s) => <RichParagraphs className="vw-summary" text={s.content} />,
    entry: (e) => compactEntry(e) ?? <DefaultEntry entry={e} variant="main" />,
    whole: (s) => compactWhole(s, 'vw-compact'),
  })

  return (
    <PageLayout
      header={header}
      main={blocks}
      page={({ index, header, main }) => (
        <div className="vw-page" style={vars}>
          {header}
          {index > 0 && <div className="vw-cap" aria-hidden="true" />}
          <div className="vw-body">
            {index === 0 && <ContactList basics={b} layout="inline" className="vw-contact" iconSize="0.95em" />}
            {main}
          </div>
        </div>
      )}
    />
  )
}
