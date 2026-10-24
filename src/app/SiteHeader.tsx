/** App bar for the browse pages (#/ and #/templates): logo, section tabs, import, theme, new resume. OWNER: shell agent. */
import { FileUp, LayoutGrid, Plus, Rows3 } from 'lucide-react'
import type { MouseEvent } from 'react'
import { navigate, uiActions, type Route } from '../store'
import { Button, cn } from '../ui'
import { Logo } from './Logo.tsx'
import { ThemeToggle } from './ThemeToggle.tsx'

const TABS = [
  { id: 'dashboard', label: 'My resumes', icon: Rows3, href: '#/', route: { name: 'dashboard' } },
  { id: 'templates', label: 'Templates', icon: LayoutGrid, href: '#/templates', route: { name: 'templates', params: {} } },
] as const satisfies readonly { id: Route['name']; label: string; icon: unknown; href: string; route: Route }[]

export function SiteHeader({ current }: { current: 'dashboard' | 'templates' }) {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/85 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/85">
      <div className="mx-auto flex h-14 max-w-7xl items-center gap-2 px-4 sm:gap-4 sm:px-6">
        <Logo />
        <nav aria-label="Main" className="flex h-full items-stretch gap-1 sm:ml-2">
          {TABS.map((t) => {
            const on = t.id === current
            return (
              <a
                key={t.id}
                href={t.href}
                aria-current={on ? 'page' : undefined}
                onClick={(e: MouseEvent) => {
                  if (e.metaKey || e.ctrlKey || e.shiftKey) return
                  e.preventDefault()
                  navigate(t.route)
                }}
                className={cn(
                  'relative inline-flex items-center gap-1.5 px-2 text-sm font-semibold transition-colors outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-inset sm:px-3',
                  on ? 'text-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white',
                )}
              >
                <t.icon className={cn('hidden size-4 sm:block', on ? 'text-indigo-600 dark:text-indigo-400' : '')} aria-hidden />
                {t.label}
                <span className={cn('absolute inset-x-2 -bottom-px h-0.5 rounded-full transition-colors sm:inset-x-3', on ? 'bg-indigo-600 dark:bg-indigo-400' : 'bg-transparent')} aria-hidden />
              </a>
            )
          })}
        </nav>
        <div className="ml-auto flex items-center gap-1 sm:gap-2">
          <Button variant="ghost" icon={FileUp} onClick={() => uiActions.openModal('import')} aria-label="Import a resume" className="hidden min-[480px]:inline-flex">
            <span className="hidden md:inline">Import</span>
          </Button>
          <ThemeToggle />
          <Button variant="primary" icon={Plus} onClick={() => uiActions.openModal('new-resume')} aria-label="New resume">
            <span className="hidden md:inline">New resume</span>
          </Button>
        </div>
      </div>
    </header>
  )
}
