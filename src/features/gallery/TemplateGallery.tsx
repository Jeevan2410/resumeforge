/**
 * #/templates — every template as a large live thumbnail. Search, collection tabs and tag toggles are
 * mirrored in the URL (?q=&c=&tags=) so a filtered view can be bookmarked or linked from the
 * dashboard. With no filter the templates are grouped into collection shelves. Clicking a card opens
 * the big preview; "Use" goes straight to the New resume dialog. OWNER: shell agent.
 */
import { ArrowRight, Eye, SearchX } from 'lucide-react'
import { useMemo, useState, type CSSProperties } from 'react'
import { COLLECTIONS, collectionInfo, isCollection } from '../../lib/gallery.ts'
import type { Design, ResumeData, TemplateId } from '../../lib/types.ts'
import { navigate, useActiveDoc } from '../../store'
import { TEMPLATES, TemplateThumbnail, type TemplateDef } from '../../templates'
import { Button, LazyMount, Segmented } from '../../ui'
import { EMPTY_FILTER, isFiltered, openPreview, startWithTemplate, useFilteredTemplates, useSampleDesigns, type PreviewSample, type TemplateFilterState } from './galleryState.ts'
import { TemplateFilterBar, TemplateSearch } from './TemplateFilters.tsx'

function fromParams(p: Record<string, string>): TemplateFilterState {
  return {
    query: p.q ?? '',
    collection: isCollection(p.c) ? p.c : 'all',
    tags: p.tags ? p.tags.split(',').filter(Boolean) : [],
  }
}

function toParams(f: TemplateFilterState): Record<string, string> {
  const out: Record<string, string> = {}
  if (f.query) out.q = f.query
  if (f.collection !== 'all') out.c = f.collection
  if (f.tags.length) out.tags = f.tags.join(',')
  return out
}

export function TemplateGallery({ params }: { params: Record<string, string> }) {
  const filter = useMemo(() => fromParams(params), [params])
  const setFilter = (f: TemplateFilterState) => navigate({ name: 'templates', params: toParams(f) }, { replace: true })
  const shown = useFilteredTemplates(filter)
  const active = useActiveDoc()
  const [sample, setSample] = useState<PreviewSample>('developer')
  const { data, designs } = useSampleDesigns(sample)
  const ids = shown.map((t) => t.id)
  const filtered = isFiltered(filter)

  const card = (t: TemplateDef, list: TemplateId[]) => <TemplateCard key={t.id} t={t} data={data} design={designs[t.id]} onPreview={() => openPreview(t.id, list, sample)} />

  return (
    <div className="mx-auto max-w-7xl px-4 pb-20 sm:px-6">
      <section className="relative pt-8 pb-6 sm:pt-12">
        <div className="rf-graph pointer-events-none absolute -inset-x-4 -top-14 bottom-0 sm:-inset-x-6" aria-hidden />
        <div className="rf-rise relative grid gap-6 lg:grid-cols-[1fr_minmax(0,30rem)] lg:items-end">
          <div>
            <p className="text-xs font-bold tracking-[0.18em] text-indigo-600 uppercase dark:text-indigo-400">{TEMPLATES.length} templates · all ATS-readable</p>
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-balance text-slate-900 sm:text-5xl dark:text-white">Find a template that fits you</h1>
            <p className="mt-3 max-w-2xl text-base text-pretty text-slate-600 dark:text-slate-400">Open any template to see it full size with sample content — or with your own resume — then start with one click. You can switch templates later without retyping anything.</p>
          </div>
          <TemplateSearch value={filter.query} onChange={(query) => setFilter({ ...filter, query })} />
        </div>
      </section>

      <div className="sticky top-14 z-20 -mx-4 border-y border-slate-200/80 bg-slate-50/90 px-4 py-3 backdrop-blur-md sm:-mx-6 sm:px-6 dark:border-slate-800 dark:bg-slate-950/90">
        <div className="flex flex-wrap items-start gap-x-6 gap-y-2">
          <TemplateFilterBar value={filter} onChange={setFilter} className="min-w-0 flex-1" />
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Show</span>
            <Segmented
              ariaLabel="Thumbnail content"
              size="xs"
              block={false}
              value={sample}
              onChange={setSample}
              options={[{ value: 'developer', label: 'Developer' }, { value: 'researcher', label: 'Researcher' }, ...(active ? [{ value: 'mine', label: 'My resume' } as const] : [])]}
            />
          </div>
        </div>
      </div>

      {filtered ? (
        <section aria-live="polite" className="mt-6">
          <p className="mb-4 text-sm text-slate-500 dark:text-slate-400">
            <span className="font-bold text-slate-900 dark:text-white">{shown.length}</span> {shown.length === 1 ? 'template' : 'templates'}
            {filter.query && <> matching “{filter.query}”</>}
            {filter.collection !== 'all' && <> in {collectionInfo(filter.collection).label}</>}
          </p>
          {shown.length ? (
            <ul className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 xl:grid-cols-5">{shown.map((t) => card(t, ids))}</ul>
          ) : (
            <div className="rounded-2xl border-2 border-dashed border-slate-300 px-6 py-14 text-center dark:border-slate-700">
              <SearchX className="mx-auto size-8 text-slate-400" aria-hidden />
              <p className="mt-3 font-bold text-slate-800 dark:text-slate-100">No template matches all of that</p>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Try fewer words, or drop a “must have”.</p>
              <Button className="mt-4" onClick={() => setFilter(EMPTY_FILTER)}>
                Show all templates
              </Button>
            </div>
          )}
        </section>
      ) : (
        COLLECTIONS.map((c, i) => {
          const list = TEMPLATES.filter((t) => t.collection === c.id)
          const listIds = list.map((t) => t.id)
          return (
            <section key={c.id} aria-labelledby={`shelf-${c.id}`} className="mt-10 first-of-type:mt-8">
              <div className="mb-5 flex flex-wrap items-end gap-x-4 gap-y-1 border-b border-slate-200 pb-3 dark:border-slate-800">
                <span className="font-mono text-xs font-bold text-slate-400 tabular-nums dark:text-slate-500">{String(i + 1).padStart(2, '0')}</span>
                <h2 id={`shelf-${c.id}`} className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                  {c.label} <span className="ml-1 text-sm font-semibold text-slate-400">{list.length}</span>
                </h2>
                <p className="w-full text-sm text-slate-500 sm:w-auto sm:flex-1 dark:text-slate-400">{c.blurb}</p>
                <button type="button" onClick={() => setFilter({ ...EMPTY_FILTER, collection: c.id })} className="text-sm font-semibold text-indigo-600 hover:underline dark:text-indigo-300">
                  Only {c.short.toLowerCase()}
                </button>
              </div>
              <ul className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 xl:grid-cols-5">{list.map((t) => card(t, listIds))}</ul>
            </section>
          )
        })
      )}
    </div>
  )
}

export function TemplateCard({ t, data, design, onPreview, style }: { t: TemplateDef; data: ResumeData; design: Design; onPreview: () => void; style?: CSSProperties }) {
  return (
    <li className="group/card min-w-0" style={style}>
      <button type="button" onClick={onPreview} className="relative block w-full rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-4 focus-visible:ring-offset-slate-50 dark:focus-visible:ring-offset-slate-950" aria-label={`Preview the ${t.name} template`}>
        <LazyMount className="aspect-[210/297] w-full overflow-hidden rounded-lg bg-white shadow-sm ring-1 ring-slate-200 transition duration-300 group-hover/card:-translate-y-1 group-hover/card:shadow-xl group-hover/card:shadow-slate-900/10 group-hover/card:ring-slate-300 dark:ring-slate-800 dark:group-hover/card:ring-slate-600">
          {(w) => <TemplateThumbnail data={data} design={design} templateId={t.id} width={w} />}
        </LazyMount>
        <span className="pointer-events-none absolute inset-x-0 bottom-3 flex justify-center opacity-0 transition group-hover/card:opacity-100 group-focus-visible/card:opacity-100" aria-hidden>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-900/90 px-3 py-1.5 text-xs font-semibold text-white shadow-lg dark:bg-white/95 dark:text-slate-900">
            <Eye className="size-3.5" /> Preview
          </span>
        </span>
      </button>
      <div className="mt-2.5 flex items-start gap-2 px-0.5">
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold text-slate-900 dark:text-white">{t.name}</p>
          <p className="truncate text-xs text-slate-500 dark:text-slate-400">{t.tags.filter((x) => x !== 'Creative' && x !== 'Modern' && x !== 'Classic').slice(0, 2).join(' · ') || collectionInfo(t.collection).short}</p>
        </div>
        <button
          type="button"
          onClick={() => startWithTemplate(t.id)}
          className="inline-flex shrink-0 items-center gap-0.5 rounded-md px-1.5 py-1 text-xs font-bold text-indigo-600 transition outline-none hover:bg-indigo-50 focus-visible:ring-2 focus-visible:ring-indigo-500 dark:text-indigo-300 dark:hover:bg-indigo-500/15"
          aria-label={`Use the ${t.name} template`}
        >
          Use <ArrowRight className="size-3.5" aria-hidden />
        </button>
      </div>
    </li>
  )
}
