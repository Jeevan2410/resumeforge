/**
 * "New resume" dialog: name, starter content (blank / developer / researcher) and template (live
 * thumbnails with search, collection tabs and tag filters). Opened with
 * uiActions.openModal('new-resume', { starter?, template?, accent? }).
 * OWNER: shell agent.
 */
import { Check, Code2, FilePlus2, FlaskConical, type LucideIcon } from 'lucide-react'
import { useId, useMemo, useState, type FormEvent } from 'react'
import { defaultDesign } from '../../lib/design.ts'
import { developerSample, researcherSample, type StarterKind } from '../../lib/samples.ts'
import { uniqueName } from '../../lib/shell.ts'
import type { Design, TemplateId } from '../../lib/types.ts'
import { navigate, resumeActions, toast, useResumes } from '../../store'
import { getTemplate, TEMPLATES, TemplateThumbnail } from '../../templates'
import { Button, cn, LazyMount, Modal, TextField } from '../../ui'
import { useTemplateFilter } from '../gallery/galleryState.ts'
import { TemplateFilterBar, TemplateSearch } from '../gallery/TemplateFilters.tsx'

export interface NewResumeDialogProps {
  open: boolean
  onClose: () => void
  starter?: StarterKind
  template?: TemplateId
  /** Accent picked in the template preview (default: the template's own). */
  accent?: string
}

const STARTERS: { id: StarterKind; label: string; hint: string; icon: LucideIcon }[] = [
  { id: 'blank', label: 'Blank', hint: 'Empty outline', icon: FilePlus2 },
  { id: 'developer', label: 'Developer sample', hint: '1 page, editable example', icon: Code2 },
  { id: 'researcher', label: 'Researcher sample', hint: 'Multi-page, 12 sections', icon: FlaskConical },
]

const DEFAULT_TEMPLATE: Record<StarterKind, TemplateId> = { blank: 'modern', developer: 'modern', researcher: 'academic' }

export function NewResumeDialog({ open, onClose, starter: initialStarter, template: initialTemplate, accent: initialAccent }: NewResumeDialogProps) {
  const resumes = useResumes()
  const [starter, setStarter] = useState<StarterKind>(initialStarter ?? 'blank')
  const [template, setTemplate] = useState<TemplateId>(() => getTemplate(initialTemplate ?? DEFAULT_TEMPLATE[initialStarter ?? 'blank']).id)
  const [templateTouched, setTemplateTouched] = useState(!!initialTemplate)
  // Opened from a template card: start on that template's shelf so the selection is in view.
  const { filter, setFilter, shown } = useTemplateFilter(initialTemplate ? { collection: getTemplate(initialTemplate).collection } : {})
  const [name, setName] = useState('')
  const groupId = useId()

  // Thumbnails show sample content so templates can be compared (a blank page says little).
  const sample = useMemo(() => (starter === 'researcher' ? researcherSample() : developerSample()), [starter])
  const designs = useMemo(() => {
    const out = {} as Record<TemplateId, Design>
    for (const t of TEMPLATES) out[t.id] = { ...defaultDesign, template: t.id, accent: t.defaultAccent }
    return out
  }, [])
  const defaultName = starter === 'blank' ? 'Untitled resume' : `${sample.basics.name} — ${sample.basics.title}`

  const pickStarter = (s: StarterKind) => {
    setStarter(s)
    if (!templateTouched) setTemplate(getTemplate(DEFAULT_TEMPLATE[s]).id)
  }

  const create = (e?: FormEvent) => {
    e?.preventDefault()
    const meta = getTemplate(template)
    const finalName = uniqueName(name.trim() || defaultName, resumes.map((r) => r.name))
    const accent = initialAccent && meta.id === initialTemplate ? initialAccent : meta.defaultAccent
    const id = resumeActions.createResume(starter, { name: finalName, design: { template: meta.id, accent } })
    onClose()
    navigate({ name: 'edit', id })
    toast(starter === 'blank' ? 'New resume created — start with your name' : 'Sample loaded — replace it with your own details', 'success')
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="xl"
      title="New resume"
      description="Choose what to start with and a template. You can change the template at any time."
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" form="new-resume-form">
            Create resume
          </Button>
        </>
      }
    >
      <form id="new-resume-form" onSubmit={create} className="space-y-5">
        <TextField label="Name (only you see this)" placeholder={defaultName} value={name} onValue={setName} maxLength={120} hint="e.g. “Frontend — Acme Corp” to keep one tailored copy per application" data-autofocus />

        <fieldset>
          <legend className="mb-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300">Start with</legend>
          <div className="grid gap-2 sm:grid-cols-3" role="radiogroup" aria-labelledby={groupId}>
            <span id={groupId} className="sr-only">
              Starting content
            </span>
            {STARTERS.map((s) => {
              const on = s.id === starter
              return (
                <button
                  key={s.id}
                  type="button"
                  role="radio"
                  aria-checked={on}
                  onClick={() => pickStarter(s.id)}
                  className={cn(
                    'flex items-center gap-3 rounded-xl p-3 text-left ring-1 transition outline-none focus-visible:ring-2 focus-visible:ring-indigo-500',
                    on ? 'bg-indigo-50 ring-2 ring-indigo-500 dark:bg-indigo-500/10' : 'bg-white ring-slate-200 hover:ring-indigo-300 dark:bg-slate-900 dark:ring-slate-700',
                  )}
                >
                  <s.icon className={cn('size-5 shrink-0', on ? 'text-indigo-600 dark:text-indigo-300' : 'text-slate-400')} aria-hidden />
                  <span className="min-w-0">
                    <span className="block text-sm font-bold text-slate-900 dark:text-white">{s.label}</span>
                    <span className="block text-xs text-slate-500 dark:text-slate-400">{s.hint}</span>
                  </span>
                </button>
              )
            })}
          </div>
        </fieldset>

        <fieldset>
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <legend className="mr-auto text-xs font-semibold text-slate-600 dark:text-slate-300">
              Template · <span className="text-slate-900 dark:text-white">{getTemplate(template).name}</span>
            </legend>
            <TemplateSearch compact value={filter.query} onChange={(query) => setFilter({ ...filter, query })} className="w-full sm:w-56" />
          </div>
          <TemplateFilterBar compact value={filter} onChange={setFilter} className="mb-3" />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4" role="radiogroup" aria-label="Template">
            {shown.map((t) => {
              const on = t.id === template
              return (
                <button
                  key={t.id}
                  type="button"
                  role="radio"
                  aria-checked={on}
                  onClick={() => {
                    setTemplate(t.id)
                    setTemplateTouched(true)
                  }}
                  onDoubleClick={() => {
                    setTemplate(t.id)
                    queueMicrotask(() => create())
                  }}
                  className={cn('group relative rounded-xl p-1.5 text-left ring-1 transition outline-none focus-visible:ring-2 focus-visible:ring-indigo-500', on ? 'bg-indigo-50 ring-2 ring-indigo-500 dark:bg-indigo-500/10' : 'ring-slate-200 hover:ring-indigo-300 dark:ring-slate-700')}
                >
                  <LazyMount className="aspect-[210/297] w-full overflow-hidden rounded-md bg-white shadow-sm ring-1 ring-slate-900/5">{(w) => <TemplateThumbnail data={sample} design={designs[t.id]} templateId={t.id} width={w} />}</LazyMount>
                  <span className="mt-1.5 block px-0.5 text-xs font-bold text-slate-900 dark:text-white">{t.name}</span>
                  <span className="block truncate px-0.5 text-[11px] text-slate-500 dark:text-slate-400">{t.description}</span>
                  {on && (
                    <span className="absolute top-3 right-3 grid size-6 place-items-center rounded-full bg-indigo-600 text-white shadow">
                      <Check className="size-3.5" aria-hidden />
                    </span>
                  )}
                </button>
              )
            })}
            {shown.length === 0 && <p className="col-span-full py-6 text-center text-sm text-slate-500">No templates match — try another word or reset the filters.</p>}
          </div>
        </fieldset>
      </form>
    </Modal>
  )
}
