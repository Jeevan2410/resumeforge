/** Palette entries for the theme menus (ThemeToggle and the compact editor header). OWNER: shell agent. */
import type { MenuItem } from '../ui'
import { PALETTES, setPalette, usePalette } from './palette.ts'
import { PaletteSwatch } from './PaletteSwatch.tsx'

/** Menu entries for the palettes (shared with the compact header menu). */
export function usePaletteItems(): MenuItem[] {
  const palette = usePalette()
  return PALETTES.map((p) => ({
    key: `palette-${p.id}`,
    icon: ({ className }: { className?: string }) => <PaletteSwatch palette={p} className={className} />,
    label: p.name,
    description: p.blurb,
    checked: palette === p.id,
    onSelect: () => setPalette(p.id),
  }))
}
