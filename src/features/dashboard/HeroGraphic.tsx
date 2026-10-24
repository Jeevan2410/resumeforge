/**
 * Dashboard hero illustration: a resume sheet that writes itself line by line, gets a pass from the
 * ATS scanner, then shows its score and matched keywords. Pure SVG + CSS (rf-ink, rf-scan, rf-score
 * in index.css), coloured from the palette scales so it follows Paper / Ledger / … and dark mode.
 * Decorative only. OWNER: shell agent.
 */
import { Check } from 'lucide-react'
import type { CSSProperties } from 'react'

const d = (ms: number) => ({ '--d': `${ms}ms` }) as CSSProperties

/** [x, y, width, delay] of the body lines, grouped by section. */
const SECTIONS: { y: number; lines: [number, number][] }[] = [
  { y: 128, lines: [[178, 0], [158, 1], [170, 2]] },
  { y: 206, lines: [[184, 0], [150, 1], [166, 2]] },
]

const KEYWORDS = ['TypeScript', 'System design', 'Mentoring']

export function HeroGraphic() {
  return (
    <div className="rf-float relative mx-auto h-[26rem] w-[22rem] select-none" aria-hidden="true">
      <svg viewBox="0 0 352 416" className="absolute inset-0 size-full overflow-visible">
        {/* the stack behind */}
        <g className="rf-rise" style={d(0)}>
          <rect x="78" y="34" width="236" height="328" rx="12" transform="rotate(5 196 198)" className="fill-slate-200 dark:fill-slate-800" />
          <rect x="64" y="30" width="236" height="328" rx="12" transform="rotate(2 182 194)" className="fill-slate-100 stroke-slate-200 dark:fill-slate-800/70 dark:stroke-slate-700" />
        </g>

        {/* the sheet */}
        <g className="rf-rise" style={d(120)}>
          <rect x="44" y="24" width="240" height="336" rx="12" className="fill-white stroke-slate-200 dark:stroke-slate-700" style={{ filter: 'drop-shadow(0 18px 28px rgb(0 0 0 / 0.12))' }} />
          <clipPath id="rf-hero-sheet">
            <rect x="44" y="24" width="240" height="336" rx="12" />
          </clipPath>

          {/* header */}
          <rect x="68" y="50" width="118" height="13" rx="6.5" className="rf-ink fill-indigo-600" style={d(420)} />
          <rect x="68" y="72" width="76" height="6" rx="3" className="rf-ink fill-slate-300" style={d(560)} />
          {[0, 1, 2].map((i) => (
            <rect key={i} x={68 + i * 44} y="88" width="36" height="5" rx="2.5" className="rf-ink fill-slate-200" style={d(640 + i * 60)} />
          ))}

          {SECTIONS.map((s, si) => (
            <g key={s.y}>
              <rect x="68" y={s.y - 14} width="58" height="6" rx="3" className="rf-ink fill-indigo-500" style={d(820 + si * 520)} />
              <rect x="68" y={s.y - 3} width="192" height="1.5" className="rf-ink fill-slate-200" style={d(880 + si * 520)} />
              {s.lines.map(([w, i]) => (
                <g key={i}>
                  <circle cx="71" cy={s.y + 12 + i * 13} r="2" className="rf-ink fill-slate-400" style={d(960 + si * 520 + i * 110)} />
                  <rect x="79" y={s.y + 9.5 + i * 13} width={w} height="5" rx="2.5" className="rf-ink fill-slate-200" style={d(980 + si * 520 + i * 110)} />
                </g>
              ))}
            </g>
          ))}

          {/* skills */}
          <rect x="68" y="270" width="44" height="6" rx="3" className="rf-ink fill-indigo-500" style={d(1900)} />
          {[44, 58, 36, 50].map((w, i, a) => (
            <rect key={i} x={68 + a.slice(0, i).reduce((s, n) => s + n + 6, 0)} y="286" width={w} height="14" rx="7" className="rf-ink fill-indigo-100" style={d(1980 + i * 70)} />
          ))}

          {/* ATS scanner sweep */}
          <g clipPath="url(#rf-hero-sheet)">
            <g className="rf-scan">
              <rect x="44" y="0" width="240" height="26" className="fill-indigo-500" opacity="0.08" />
              <rect x="44" y="25" width="240" height="1.5" className="fill-indigo-500" opacity="0.7" />
            </g>
          </g>
        </g>
      </svg>

      {/* score */}
      <div className="rf-pop-in absolute bottom-6 left-0 flex items-center gap-3 rounded-2xl bg-white p-3 pr-4 shadow-xl ring-1 ring-slate-900/5 dark:bg-slate-900 dark:ring-white/10" style={d(2600)}>
        <svg viewBox="0 0 52 52" className="size-12 -rotate-90">
          <circle cx="26" cy="26" r="22" fill="none" strokeWidth="5" className="stroke-slate-100 dark:stroke-slate-800" />
          <circle cx="26" cy="26" r="22" fill="none" strokeWidth="5" strokeLinecap="round" pathLength="100" className="rf-ring stroke-indigo-600 dark:stroke-indigo-400" style={d(2750)} />
        </svg>
        <div className="leading-tight">
          <p className="rf-score text-xl font-extrabold text-slate-900 tabular-nums dark:text-white" style={d(2750)} />
          <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">ATS score</p>
        </div>
      </div>

      {/* matched keywords */}
      <ul className="absolute top-16 -right-6 space-y-2">
        {KEYWORDS.map((k, i) => (
          <li key={k} className="rf-pop-in flex items-center gap-1.5 rounded-full bg-white py-1 pr-3 pl-1.5 text-xs font-semibold text-slate-700 shadow-lg ring-1 ring-slate-900/5 dark:bg-slate-900 dark:text-slate-200 dark:ring-white/10" style={d(3100 + i * 160)}>
            <span className="grid size-5 place-items-center rounded-full bg-indigo-600 text-white">
              <Check className="size-3" strokeWidth={3} />
            </span>
            {k}
          </li>
        ))}
      </ul>
    </div>
  )
}
