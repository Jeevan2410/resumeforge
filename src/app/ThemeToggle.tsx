/** Theme menu: Light / Dark / System plus the colour palette. OWNER: shell agent. */
import { Monitor, Moon, Sun } from 'lucide-react'
import { useTheme } from '../store'
import { IconButton, Menu } from '../ui'
import { switchTheme, useResolvedTheme } from './hooks.ts'
import { usePaletteItems } from './paletteItems.tsx'

const LABEL = { light: 'Light', dark: 'Dark', system: 'System' }

export function ThemeToggle() {
  const theme = useTheme()
  const resolved = useResolvedTheme()
  const paletteItems = usePaletteItems()
  const Icon = theme === 'system' ? Monitor : resolved === 'dark' ? Moon : Sun
  return (
    <Menu
      width="w-60"
      label="Theme"
      trigger={(p) => <IconButton icon={Icon} label={`Theme: ${LABEL[theme]}`} {...p} />}
      items={[
        { heading: 'Appearance' },
        { key: 'light', icon: Sun, label: 'Light', checked: theme === 'light', onSelect: () => switchTheme('light') },
        { key: 'dark', icon: Moon, label: 'Dark', checked: theme === 'dark', onSelect: () => switchTheme('dark') },
        { key: 'system', icon: Monitor, label: 'System', checked: theme === 'system', onSelect: () => switchTheme('system') },
        'separator',
        { heading: 'Palette' },
        ...paletteItems,
      ]}
    />
  )
}
