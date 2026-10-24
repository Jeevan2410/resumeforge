import { cn } from '../ui'
import type { Palette } from './palette.ts'

/** A palette chip: page colour with an ink half-moon and an accent dot. */
export function PaletteSwatch({ palette, className }: { palette: Palette; className?: string }) {
  const [page, ink, accent] = palette.swatch
  return (
    <svg viewBox="0 0 16 16" className={cn(className, 'opacity-100!')} aria-hidden="true">
      <circle cx="8" cy="8" r="7.25" fill={page} stroke={ink} strokeOpacity="0.25" strokeWidth="1.5" />
      <path d="M8 .75a7.25 7.25 0 0 1 0 14.5z" fill={ink} />
      <circle cx="8" cy="8" r="3" fill={accent} />
    </svg>
  )
}
