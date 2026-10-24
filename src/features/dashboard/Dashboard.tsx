/**
 * Dashboard (#/): landing hero, "start new" starters, a "Browse templates" block (search, collection
 * cards, popular picks → #/templates and the big preview), and the "My resumes" grid (live
 * thumbnails, search, sort, rename, duplicate, delete). OWNER: shell agent.
 */
import { Anvil, ArrowRight, Code2, FilePlus2, FileUp, FlaskConical, Gauge, LayoutGrid, Lock, Mail, Search, Target, type LucideIcon } from 'lucide-react'
import { useEffect, useMemo, useState, type CSSProperties, type FormEvent } from 'react'
import type { StarterKind } from '../../lib/samples.ts'
import { COLLECTIONS, type CollectionInfo } from '../../lib/gallery.ts'
import type { TemplateId } from '../../lib/types.ts'
import { sortResumes, type ResumeSort } from '../../lib/shell.ts'
import { navigate, uiActions, useResumes } from '../../store'
import { getTemplate, TEMPLATES, TemplateThumbnail } from '../../templates'
import { Button, cn, inputClass, LazyMount, Segmented } from '../../ui'
import { openPreview, useSampleDesigns } from '../gallery/galleryState.ts'
import { TemplateCard } from '../gallery/TemplateGallery.tsx'
import { TemplateSearch } from '../gallery/TemplateFilters.tsx'
import { HeroGraphic } from './HeroGraphic.tsx'
import { ResumeCard } from './ResumeCard.tsx'

const STARTERS: { id: StarterKind; title: string; description: string; icon: LucideIcon; tone: string }[] = [
  { id: 'blank', title: 'Blank resume', description: 'Start from an empty outline', icon: FilePlus2, tone: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200' },
  { id: 'developer', title: 'Developer sample', description: 'One page · full-stack engineer', icon: Code2, tone: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-300' },
  { id: 'researcher', title: 'Researcher sample', description: 'Multi-page · publications & awards', icon: FlaskConical, tone: 'bg-teal-50 text-teal-700 dark:bg-teal-500/15 dark:text-teal-300' },
]

const FEATURES: { icon: LucideIcon; title: string; text: string }[] = [
  { icon: Gauge, title: 'ATS checker', text: 'Score + fixes that jump to the field' },
  { icon: Target, title: 'Job match', text: 'Paste a job ad, see missing keywords' },
  { icon: Mail, title: 'Cover letters', text: 'Matching letter for every resume' },
  { icon: Lock, title: 'Private', text: 'Everything stays in your browser' },
]

const SORTS: { value: ResumeSort; label: string }[] = [
  { value: 'updated', label: 'Recent' },
  { value: 'created', label: 'Created' },
  { value: 'name', label: 'Name' },
]

const newResume = (props: Record<string, unknown> = {}) => uiActions.openModal('new-resume', props)

export function Dashboard() {
  const resumes = useResumes()
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState<ResumeSort>('updated')
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 30_000)
    return () => clearInterval(t)
  }, [])
  const list = useMemo(() => sortResumes(resumes, sort, query), [resumes, sort, query])
  const empty = resumes.length === 0
  // A first-time visitor only has the untouched auto-created sample: greet them with the hero, not "Your resumes".
  const fresh = empty || (resumes.length === 1 && resumes[0].updatedAt === resumes[0].createdAt && resumes[0].snapshots.length === 0)

  return (
    <div className="mx-auto max-w-7xl px-4 pb-16 sm:px-6">
      {/* Hero */}
      <section className={cn('relative px-1 pt-8 sm:pt-12', fresh ? 'pb-10 lg:grid lg:grid-cols-[1fr_auto] lg:items-center lg:gap-10' : 'pb-6')}>
        <div className="rf-graph pointer-events-none absolute -inset-x-4 -top-14 bottom-0 sm:-inset-x-6" aria-hidden />
        <div className="rf-rise relative">
          <p className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-xs font-semibold text-indigo-700 ring-1 ring-indigo-100 dark:bg-slate-900 dark:text-indigo-300 dark:ring-indigo-500/30">
            <Anvil className="size-3.5" aria-hidden />
            {TEMPLATES.length} templates · ATS checker · PDF & Word export
          </p>
          <h1 className="mt-4 max-w-3xl text-3xl font-extrabold tracking-tight text-balance text-slate-900 sm:text-5xl dark:text-white">{fresh ? 'Build a resume that gets you the interview' : 'Your resumes'}</h1>
          <p className="mt-3 max-w-2xl text-base text-pretty text-slate-600 sm:text-lg dark:text-slate-400">
            {fresh ? 'Pick a starter, choose a template and watch your resume update live. Free, no sign-up, and nothing ever leaves your browser.' : 'Tailor a copy for every application — duplicate a resume, adjust it for the job ad and keep each version.'}
          </p>
          {fresh && (
            <div className="mt-6 flex flex-wrap gap-3">
              <Button size="md" variant="primary" iconRight={ArrowRight} onClick={() => newResume({ starter: 'developer' })}>
                Create my resume
              </Button>
              <Button size="md" icon={LayoutGrid} onClick={() => navigate({ name: 'templates', params: {} })}>
                Browse {TEMPLATES.length} templates
              </Button>
              {!empty && (
                <Button size="md" onClick={() => navigate({ name: 'edit', id: resumes[0].id })}>
                  Explore the sample
                </Button>
              )}
              <Button size="md" variant="ghost" icon={FileUp} onClick={() => uiActions.openModal('import')}>
                Import
              </Button>
            </div>
          )}
        </div>
        {fresh && (
          <div className="relative hidden pr-6 lg:block">
            <HeroGraphic />
          </div>
        )}
      </section>

      {/* Start new */}
      <section aria-labelledby="start-h" className="rf-rise mt-2" style={{ '--d': '120ms' } as CSSProperties}>
        <h2 id="start-h" className="mb-3 text-sm font-bold text-slate-900 dark:text-white">
          Start a new resume
        </h2>
        <div className="rf-stagger grid gap-3 sm:grid-cols-2 lg:grid-cols-4" style={{ '--rf-step': '70ms' } as CSSProperties}>
          {STARTERS.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => newResume({ starter: s.id })}
              className="group flex items-center gap-3 rounded-2xl bg-white p-4 text-left ring-1 ring-slate-200 transition outline-none hover:-translate-y-0.5 hover:shadow-lg hover:ring-indigo-300 focus-visible:ring-2 focus-visible:ring-indigo-500 dark:bg-slate-900 dark:ring-slate-800 dark:hover:ring-indigo-500/50"
            >
              <span className={cn('grid size-11 shrink-0 place-items-center rounded-xl', s.tone)}>
                <s.icon className="size-5" aria-hidden />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-bold text-slate-900 dark:text-white">{s.title}</span>
                <span className="block text-xs text-pretty text-slate-500 dark:text-slate-400">{s.description}</span>
              </span>
              <ArrowRight className="size-4 shrink-0 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-indigo-500 dark:text-slate-600" aria-hidden />
            </button>
          ))}
          <button
            type="button"
            onClick={() => uiActions.openModal('import')}
            className="group flex items-center gap-3 rounded-2xl border-2 border-dashed border-slate-300 p-4 text-left transition outline-none hover:border-indigo-400 hover:bg-white focus-visible:ring-2 focus-visible:ring-indigo-500 dark:border-slate-700 dark:hover:border-indigo-500/60 dark:hover:bg-slate-900"
          >
            <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300">
              <FileUp className="size-5" aria-hidden />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-bold text-slate-900 dark:text-white">Import</span>
              <span className="block truncate text-xs text-slate-500 dark:text-slate-400">ResumeForge or JSON Resume file</span>
            </span>
          </button>
        </div>
      </section>

      {fresh && <TemplateShelves />}

      {/* My resumes */}
      <section aria-labelledby="mine-h" className="mt-10">
        <div className="mb-4 flex flex-wrap items-end gap-3">
          <div className="mr-auto">
            <h2 id="mine-h" tabIndex={-1} className="text-lg outline-none font-extrabold tracking-tight text-slate-900 dark:text-white">
              My resumes <span className="ml-1 text-sm font-semibold text-slate-400">{resumes.length}</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Saved automatically in this browser · double-click a name to rename</p>
          </div>
          {resumes.length > 1 && (
            <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto">
              <label className="relative min-w-0 flex-1 sm:w-56 sm:flex-none">
                <span className="sr-only">Search resumes</span>
                <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-slate-400" aria-hidden />
                <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search" className={cn(inputClass, 'h-8 py-1 pl-8')} />
              </label>
              <Segmented ariaLabel="Sort resumes" size="xs" block={false} value={sort} onChange={setSort} options={SORTS} />
            </div>
          )}
        </div>
        {empty ? (
          <div className="rounded-2xl border-2 border-dashed border-slate-300 bg-white/50 px-6 py-12 text-center dark:border-slate-700 dark:bg-slate-900/40">
            <Anvil className="mx-auto size-8 text-indigo-500" aria-hidden />
            <p className="mt-3 font-bold text-slate-800 dark:text-slate-100">No resumes yet</p>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Start from a sample to see how a strong resume reads, or begin blank.</p>
            <Button className="mt-4" variant="primary" icon={FilePlus2} onClick={() => newResume()}>
              New resume
            </Button>
          </div>
        ) : list.length === 0 ? (
          <p className="rounded-2xl bg-white px-6 py-10 text-center text-sm text-slate-500 ring-1 ring-slate-200 dark:bg-slate-900 dark:text-slate-400 dark:ring-slate-800">No resumes match “{query}”.</p>
        ) : (
          <div className="rf-stagger grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4 xl:grid-cols-5">
            {list.map((r) => (
              <ResumeCard key={r.id} doc={r} now={now} />
            ))}
          </div>
        )}
      </section>

      {/* Features */}
      <section aria-label="Highlights" className="rf-stagger mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {FEATURES.map((f) => (
          <div key={f.title} className="flex items-start gap-3 rounded-2xl bg-white/70 p-4 ring-1 ring-slate-200/70 dark:bg-slate-900/50 dark:ring-slate-800">
            <f.icon className="mt-0.5 size-5 shrink-0 text-indigo-500 dark:text-indigo-400" aria-hidden />
            <div>
              <p className="text-sm font-bold text-slate-900 dark:text-white">{f.title}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{f.text}</p>
            </div>
          </div>
        ))}
      </section>

      {!fresh && <TemplateShelves />}

      <footer className="mt-14 flex flex-wrap items-center justify-between gap-2 border-t border-slate-200 pt-6 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">
        <p>ResumeForge — free, open-source resume builder. Your data never leaves this device.</p>
        <p>
          Built by{' '}
          <a href="https://github.com/Jeevan2410" target="_blank" rel="noreferrer" className="font-semibold text-slate-700 underline-offset-2 hover:underline dark:text-slate-200">
            Jeevan
          </a>
        </p>
      </footer>
    </div>
  )
}

/** Representative templates fanned out on each collection card. */
const COVER: Record<CollectionInfo['id'], TemplateId[]> = {
  classic: ['executive', 'classic', 'modern'],
  style: ['popart', 'bauhaus', 'swiss'],
  format: ['portfolio', 'infographic', 'skillsfirst'],
  ui: ['studio', 'dashboard', 'showcase'],
}
const POPULAR: TemplateId[] = ['modern', 'classic', 'ats', 'swiss', 'dashboard']
const browse = (params: Record<string, string> = {}) => navigate({ name: 'templates', params })

function TemplateShelves() {
  const { data, designs } = useSampleDesigns('developer')
  const [q, setQ] = useState('')
  const search = (e: FormEvent) => {
    e.preventDefault()
    browse(q.trim() ? { q: q.trim() } : {})
  }
  const counts = useMemo(() => Object.fromEntries(COLLECTIONS.map((c) => [c.id, TEMPLATES.filter((t) => t.collection === c.id).length])), [])
  const popular = POPULAR.map((id) => getTemplate(id))
  return (
    <section aria-labelledby="tpl-h" className="mt-12">
      <div className="mb-5 flex flex-wrap items-end gap-3">
        <div className="mr-auto">
          <h2 id="tpl-h" className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-white">
            Browse templates <span className="ml-1 text-sm font-semibold text-slate-400">{TEMPLATES.length}</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Every template reads cleanly in applicant-tracking systems. Switch any time — your content stays.</p>
        </div>
        <form onSubmit={search} role="search" className="flex w-full gap-2 sm:w-auto">
          <TemplateSearch compact value={q} onChange={setQ} className="flex-1 sm:w-64" />
          <Button type="submit" size="sm">
            Search
          </Button>
        </form>
      </div>

      <ul className="rf-stagger grid gap-3 sm:grid-cols-2 lg:grid-cols-4" style={{ '--rf-step': '70ms' } as CSSProperties}>
        {COLLECTIONS.map((c) => (
          <li key={c.id}>
            <button
              type="button"
              onClick={() => browse({ c: c.id })}
              className="group flex h-full w-full flex-col overflow-hidden rounded-2xl bg-white text-left ring-1 ring-slate-200 transition outline-none hover:-translate-y-0.5 hover:shadow-lg hover:ring-indigo-300 focus-visible:ring-2 focus-visible:ring-indigo-500 dark:bg-slate-900 dark:ring-slate-800 dark:hover:ring-indigo-500/50"
            >
              <span className="relative block h-40 overflow-hidden bg-slate-100 dark:bg-slate-800/60" aria-hidden>
                {COVER[c.id].map((id, i) => (
                  <span
                    key={id}
                    className="absolute top-5 left-1/2 w-[38%] origin-bottom transition duration-300 ease-out"
                    style={{ transform: `translateX(${-50 + (i - 1) * 62}%) rotate(${(i - 1) * 7}deg) translateY(${i === 1 ? 0 : 10}px)`, zIndex: i === 1 ? 2 : 1 }}
                  >
                    <LazyMount className="aspect-[210/297] w-full overflow-hidden rounded-[3px] bg-white shadow-md ring-1 ring-slate-900/10 transition duration-300 group-hover:shadow-xl">
                      {(w) => <TemplateThumbnail data={data} design={designs[id]} templateId={id} width={w} />}
                    </LazyMount>
                  </span>
                ))}
              </span>
              <span className="flex flex-1 flex-col p-4">
                <span className="flex items-baseline gap-2">
                  <span className="text-sm font-bold text-slate-900 dark:text-white">{c.label}</span>
                  <span className="text-xs font-semibold text-slate-400 tabular-nums">{counts[c.id]}</span>
                </span>
                <span className="mt-0.5 block text-xs text-pretty text-slate-500 dark:text-slate-400">{c.blurb}</span>
                <span className="mt-auto inline-flex items-center gap-1 pt-3 text-xs font-bold text-indigo-600 dark:text-indigo-300">
                  See all {counts[c.id]} <ArrowRight className="size-3.5 transition group-hover:translate-x-0.5" aria-hidden />
                </span>
              </span>
            </button>
          </li>
        ))}
      </ul>

      <div className="mt-8 mb-3 flex items-center justify-between gap-3">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">Popular picks</h3>
        <button type="button" onClick={() => browse()} className="inline-flex items-center gap-1 text-sm font-semibold text-indigo-600 hover:underline dark:text-indigo-300">
          All {TEMPLATES.length} templates <ArrowRight className="size-4" aria-hidden />
        </button>
      </div>
      <ul className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 lg:grid-cols-5">
        {popular.map((t) => (
          <TemplateCard key={t.id} t={t} data={data} design={designs[t.id]} onPreview={() => openPreview(t.id, POPULAR)} />
        ))}
      </ul>
    </section>
  )
}
