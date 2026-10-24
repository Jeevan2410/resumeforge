/**
 * App colour palettes (src/palettes.css) and the animated theme switch. The palette is a per-device
 * UI preference, so it lives in its own localStorage key rather than in the resume store.
 * OWNER: shell agent.
 */
import { useSyncExternalStore } from 'react'

export type PaletteId = 'classic' | 'paper' | 'ledger' | 'graphite' | 'dusk'

export interface Palette {
  id: PaletteId
  name: string
  blurb: string
  /** Swatch colours: page, ink, accent (light mode). */
  swatch: [string, string, string]
  /** <meta name="theme-color"> in light (accent) and dark (surface) mode. */
  meta: { light: string; dark: string }
}

export const PALETTES: Palette[] = [
  { id: 'classic', name: 'Classic', blurb: 'Slate & indigo', swatch: ['#f8fafc', '#0f172a', '#4f46e5'], meta: { light: '#4f46e5', dark: '#0f172a' } },
  { id: 'paper', name: 'Paper', blurb: 'Cream stock & ink blue', swatch: ['#f9f4ec', '#1d1813', '#2969b1'], meta: { light: '#2969b1', dark: '#1d1813' } },
  { id: 'ledger', name: 'Ledger', blurb: "Sage & banker's green", swatch: ['#f1f6f2', '#141b17', '#007e46'], meta: { light: '#007e46', dark: '#141b17' } },
  { id: 'graphite', name: 'Graphite', blurb: 'Greys & Swiss vermilion', swatch: ['#f5f5f5', '#191919', '#b83000'], meta: { light: '#b83000', dark: '#191919' } },
  { id: 'dusk', name: 'Dusk', blurb: 'Plum & marigold', swatch: ['#f8f3fa', '#1c1524', '#b36c00'], meta: { light: '#995600', dark: '#1c1524' } },
]

const KEY = 'resumeforge-palette'
const listeners = new Set<() => void>()

const isPalette = (v: unknown): v is PaletteId => PALETTES.some((p) => p.id === v)

function read(): PaletteId {
  try {
    const v = localStorage.getItem(KEY)
    return isPalette(v) ? v : 'classic'
  } catch {
    return 'classic'
  }
}

let current: PaletteId = typeof window === 'undefined' ? 'classic' : read()

export const paletteOf = (id: PaletteId): Palette => PALETTES.find((p) => p.id === id) ?? PALETTES[0]

/** Put the palette on <html> (index.html does the same before first paint). */
export function applyPalette(id: PaletteId): void {
  const root = document.documentElement
  if (id === 'classic') root.removeAttribute('data-palette')
  else root.setAttribute('data-palette', id)
  syncThemeColor()
}

/** Keep the browser chrome colour in step with the palette and light/dark mode. */
export function syncThemeColor(): void {
  const p = paletteOf(current)
  const dark = document.documentElement.classList.contains('dark')
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', dark ? p.meta.dark : p.meta.light)
}

export function setPalette(id: PaletteId): void {
  if (id === current) return
  current = id
  try {
    localStorage.setItem(KEY, id)
  } catch {
    /* private mode: the palette still applies for this visit */
  }
  withThemeTransition(() => applyPalette(id))
  listeners.forEach((l) => l())
}

export function usePalette(): PaletteId {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb)
      return () => listeners.delete(cb)
    },
    () => current,
    () => 'classic',
  )
}

/* ---------------- animated switch ---------------- */

// Menus call onSelect without the event, so remember where the last press happened.
let origin: { x: number; y: number } | null = null
if (typeof window !== 'undefined') {
  addEventListener('pointerdown', (e) => (origin = { x: e.clientX, y: e.clientY }), { capture: true, passive: true })
  addEventListener('keydown', () => (origin = null), { capture: true, passive: true })
}

type ViewTransitionDoc = Document & { startViewTransition?: (cb: () => void) => { ready: Promise<void> } }

/**
 * Run a colour change inside a View Transition: the new colours spread out as a circle from the
 * pointer (or from the top-right corner, where the theme button lives, for keyboard use).
 * Falls back to an instant change without View Transitions or with reduced motion.
 */
export function withThemeTransition(change: () => void): void {
  const doc = document as ViewTransitionDoc
  if (!doc.startViewTransition || matchMedia('(prefers-reduced-motion: reduce)').matches) {
    change()
    return
  }
  const { x, y } = origin ?? { x: innerWidth - 48, y: 28 }
  const r = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y))
  const t = doc.startViewTransition(change)
  t.ready
    .then(() =>
      document.documentElement.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] },
        { duration: 520, easing: 'cubic-bezier(0.65, 0, 0.35, 1)', pseudoElement: '::view-transition-new(root)' },
      ),
    )
    .catch(() => {})
}
