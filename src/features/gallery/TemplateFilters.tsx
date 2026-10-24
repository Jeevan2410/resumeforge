/**
 * Template search + collection tabs + tag toggles, shared by the #/templates gallery, the "New
 * resume" dialog and the Design panel. State lives with the caller (galleryState.ts) so the
 * gallery page can mirror it in the URL. OWNER: shell agent.
 */
import { Search, X } from 'lucide-react'
import { useMemo } from 'react'
import { COLLECTIONS, countByCollection, GALLERY_TAGS } from '../../lib/gallery.ts'
import { TEMPLATES } from '../../templates'
import { cn, inputClass } from '../../ui'
import { EMPTY_FILTER, isFiltered, type TemplateFilterState } from './galleryState.ts'

export interface TemplateFilterBarProps {
  value: TemplateFilterState
  onChange: (next: TemplateFilterState) => void
  /** Small chips and a short search box (dialogs, side panel). */
  compact?: boolean
  className?: string
}

const chip = (on: boolean, compact: boolean) =>
  cn(
    'inline-flex shrink-0 items-center gap-1 rounded-full font-semibold whitespace-nowrap transition outline-none focus-visible:ring-2 focus-visible:ring-indigo-500',
    compact ? 'px-2.5 py-1 text-xs' : 'px-3 py-1.5 text-sm',
    on ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white',
  )

export function TemplateSearch({ value, onChange, compact = false, className, autoFocus }: { value: string; onChange: (q: string) => void; compact?: boolean; className?: string; autoFocus?: boolean }) {
  return (
    <label className={cn('relative block min-w-0', className)}>
      <span className="sr-only">Search templates</span>
      <Search className={cn('pointer-events-none absolute top-1/2 -translate-y-1/2 text-slate-400', compact ? 'left-2.5 size-4' : 'left-3.5 size-5')} aria-hidden />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Escape' && value) {
            e.stopPropagation()
            onChange('')
          }
        }}
        placeholder={compact ? 'Search templates' : 'Search by name, style or feature — “serif”, “photo”, “neon”…'}
        autoFocus={autoFocus}
        className={cn(inputClass, '[&::-webkit-search-cancel-button]:hidden', compact ? 'h-8 py-1 pr-8 pl-8' : 'h-12 rounded-xl pr-10 pl-11 text-base')}
      />
      {value && (
        <button type="button" onClick={() => onChange('')} className={cn('absolute top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200', compact ? 'right-1.5' : 'right-2.5')} aria-label="Clear search">
          <X className="size-4" aria-hidden />
        </button>
      )}
    </label>
  )
}

/** Collection tabs (with counts) and tag toggles; the search box is rendered separately or with `withSearch`. */
export function TemplateFilterBar({ value, onChange, compact = false, className, withSearch = false }: TemplateFilterBarProps & { withSearch?: boolean }) {
  const counts = useMemo(() => countByCollection(TEMPLATES), [])
  const set = (patch: Partial<TemplateFilterState>) => onChange({ ...value, ...patch })
  const toggleTag = (tag: string) => set({ tags: value.tags.includes(tag) ? value.tags.filter((t) => t !== tag) : [...value.tags, tag] })
  return (
    <div className={cn('space-y-2', className)}>
      {withSearch && <TemplateSearch compact={compact} value={value.query} onChange={(query) => set({ query })} />}
      <div className="rf-scroll -mx-1 flex gap-1 overflow-x-auto px-1 pb-0.5" role="group" aria-label="Template collection">
        {[{ id: 'all' as const, short: 'All' }, ...COLLECTIONS].map((c) => (
          <button key={c.id} type="button" aria-pressed={value.collection === c.id} onClick={() => set({ collection: c.id })} className={chip(value.collection === c.id, compact)}>
            {c.short}
            <span className={cn('tabular-nums', value.collection === c.id ? 'opacity-70' : 'text-slate-400 dark:text-slate-500')}>{counts[c.id]}</span>
          </button>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-1" role="group" aria-label="Must have">
        {!compact && <span className="mr-1 text-xs font-semibold text-slate-500 dark:text-slate-400">Must have</span>}
        {GALLERY_TAGS.map((tag) => {
          const on = value.tags.includes(tag)
          return (
            <button
              key={tag}
              type="button"
              aria-pressed={on}
              onClick={() => toggleTag(tag)}
              className={cn(
                'rounded-md px-2 py-0.5 text-xs font-semibold ring-1 transition outline-none focus-visible:ring-2 focus-visible:ring-indigo-500',
                on ? 'bg-indigo-50 text-indigo-700 ring-indigo-300 dark:bg-indigo-500/15 dark:text-indigo-200 dark:ring-indigo-500/50' : 'text-slate-500 ring-slate-200 hover:text-slate-800 hover:ring-slate-300 dark:text-slate-400 dark:ring-slate-700 dark:hover:text-slate-100',
              )}
            >
              {on && <span aria-hidden>✓ </span>}
              {tag}
            </button>
          )
        })}
        {isFiltered(value) && (
          <button type="button" onClick={() => onChange(EMPTY_FILTER)} className="ml-auto rounded-md px-1.5 py-0.5 text-xs font-semibold text-indigo-600 hover:underline dark:text-indigo-300">
            Reset
          </button>
        )}
      </div>
    </div>
  )
}
