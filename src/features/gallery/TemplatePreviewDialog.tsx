/**
 * Large template preview: the first two pages at reading size with sample (or your own) content,
 * accent swatches, previous / next through the list it was opened from, and the two ways to use it
 * (start a new resume, or apply it to the resume you are working on).
 * Opened with uiActions.openModal('template-preview', { template, ids?, sample? }). OWNER: shell agent.
 */
import { ArrowRight, Check, ChevronLeft, ChevronRight, Wand2 } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { ACCENT_PRESETS, defaultDesign } from '../../lib/design.ts'
import { collectionInfo, stepId } from '../../lib/gallery.ts'
import { developerSample, researcherSample } from '../../lib/samples.ts'
import { paperSize } from '../../lib/templateData.ts'
import type { Design, TemplateId } from '../../lib/types.ts'
import { navigate, resumeActions, toast, uiActions, useActiveDoc } from '../../store'
import { getTemplate, PagedDocument, TEMPLATES } from '../../templates'
import { Button, cn, isTypingTarget, LazyMount, Modal, Segmented } from '../../ui'
import type { PreviewSample } from './galleryState.ts'

export interface TemplatePreviewDialogProps {
  open: boolean
  onClose: () => void
  template: TemplateId
  /** The list the preview steps through (default: every template). */
  ids?: TemplateId[]
  sample?: PreviewSample
}

export function TemplatePreviewDialog({ open, onClose, template, ids, sample: initialSample = 'developer' }: TemplatePreviewDialogProps) {
  const active = useActiveDoc()
  const order = useMemo(() => (ids?.length ? ids : TEMPLATES.map((t) => t.id)), [ids])
  const [id, setId] = useState<TemplateId>(() => getTemplate(template).id)
  const [sample, setSample] = useState<PreviewSample>(initialSample === 'mine' && !active ? 'developer' : initialSample)
  const [accent, setAccent] = useState<string | null>(null)
  const tpl = getTemplate(id)
  const shownAccent = accent ?? tpl.defaultAccent

  const data = useMemo(() => (sample === 'mine' && active ? active.data : sample === 'researcher' ? researcherSample() : developerSample()), [sample, active])
  const design = useMemo<Design>(() => ({ ...(sample === 'mine' && active ? active.design : defaultDesign), template: tpl.id, accent: shownAccent }), [sample, active, tpl.id, shownAccent])

  const go = (delta: number) => {
    setId((cur) => stepId(order, cur, delta) as TemplateId)
    setAccent(null)
  }
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (isTypingTarget(e.target) || e.altKey || e.metaKey || e.ctrlKey) return
      if (e.key === 'ArrowLeft') go(-1)
      if (e.key === 'ArrowRight') go(1)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  })

  const startNew = () => uiActions.openModal('new-resume', { template: tpl.id, accent: shownAccent, starter: sample === 'researcher' ? 'researcher' : 'developer' })
  const applyToActive = () => {
    if (!active) return
    resumeActions.updateDesign({ template: tpl.id, accent: shownAccent }, null)
    onClose()
    navigate({ name: 'edit', id: active.id })
    toast(`${tpl.name} applied to “${active.name}”`, 'success')
  }

  const swatches = useMemo(() => [tpl.defaultAccent, ...ACCENT_PRESETS.filter((c) => c.toLowerCase() !== tpl.defaultAccent.toLowerCase())].slice(0, 8), [tpl.defaultAccent])
  const pos = order.indexOf(tpl.id)
  const coll = collectionInfo(tpl.collection)

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="2xl"
      className="sm:h-[92dvh]"
      title={
        <span className="flex flex-wrap items-baseline gap-x-2">
          {tpl.name}
          <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">{coll.label}</span>
        </span>
      }
      footer={
        <>
          <div className="mr-auto flex items-center gap-1">
            <Button variant="ghost" icon={ChevronLeft} onClick={() => go(-1)} aria-label="Previous template" disabled={order.length < 2}>
              <span className="hidden sm:inline">Previous</span>
            </Button>
            <span className="min-w-14 text-center text-xs text-slate-500 tabular-nums dark:text-slate-400" aria-live="polite">
              {pos + 1} / {order.length}
            </span>
            <Button variant="ghost" iconRight={ChevronRight} onClick={() => go(1)} aria-label="Next template" disabled={order.length < 2}>
              <span className="hidden sm:inline">Next</span>
            </Button>
          </div>
          {active && (
            <Button icon={Wand2} onClick={applyToActive} title={`Switch “${active.name}” to ${tpl.name} — your content stays`}>
              <span className="hidden sm:inline">Apply to current resume</span>
              <span className="sm:hidden">Apply</span>
            </Button>
          )}
          <Button variant="primary" iconRight={ArrowRight} onClick={startNew} data-autofocus>
            Use this template
          </Button>
        </>
      }
    >
      <div className="grid gap-5 md:h-full md:grid-cols-[minmax(0,1fr)_17rem]">
        <div className="relative min-h-0 overflow-y-auto rounded-xl bg-slate-100 p-3 ring-1 ring-slate-200/70 sm:p-6 dark:bg-slate-950 dark:ring-slate-800">
          <LazyMount key={`${tpl.id}-${sample}`} className="mx-auto w-full max-w-[640px]" margin="0px">
            {(w) => (
              <div aria-hidden inert className="pointer-events-none">
                <PagedDocument data={data} design={design} mode="thumbnail" scale={w / paperSize(design.paper).widthPx} maxPages={2} pageGap={24} />
              </div>
            )}
          </LazyMount>
        </div>

        <aside className="space-y-5 md:overflow-y-auto">
          <p className="text-sm text-pretty text-slate-600 dark:text-slate-300">{tpl.description}</p>
          <ul className="flex flex-wrap gap-1.5" aria-label="Features">
            {tpl.tags.map((t) => (
              <li key={t} className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                {t}
              </li>
            ))}
            <li className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">{tpl.columns === 2 ? 'Sidebar layout' : 'Single column'}</li>
          </ul>

          <div>
            <p className="mb-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400">Preview with</p>
            <Segmented
              ariaLabel="Preview content"
              size="xs"
              value={sample}
              onChange={setSample}
              options={[
                { value: 'developer', label: 'Developer' },
                { value: 'researcher', label: 'Researcher' },
                ...(active ? [{ value: 'mine' as const, label: 'My resume' }] : []),
              ]}
            />
          </div>

          <div>
            <p className="mb-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400">Accent colour</p>
            <div className="flex flex-wrap gap-1.5" role="radiogroup" aria-label="Accent colour">
              {swatches.map((c, i) => {
                const on = c.toLowerCase() === shownAccent.toLowerCase()
                return (
                  <button
                    key={c}
                    type="button"
                    role="radio"
                    aria-checked={on}
                    aria-label={i === 0 ? `${c} (template default)` : c}
                    title={i === 0 ? `${c} — template default` : c}
                    onClick={() => setAccent(i === 0 ? null : c)}
                    className={cn('grid size-7 place-items-center rounded-full ring-offset-2 transition outline-none ring-offset-white focus-visible:ring-2 focus-visible:ring-indigo-500 dark:ring-offset-slate-900', on && 'ring-2 ring-slate-900 dark:ring-white')}
                    style={{ background: c }}
                  >
                    {on && <Check className="size-3.5 text-white mix-blend-difference" aria-hidden />}
                  </button>
                )
              })}
            </div>
            <p className="mt-1.5 text-[11px] text-slate-500 dark:text-slate-400">Fonts, spacing and colours stay adjustable in the editor.</p>
          </div>

          <p className="hidden rounded-lg bg-slate-50 px-3 py-2 text-[11px] text-slate-500 md:block dark:bg-slate-800/60 dark:text-slate-400">
            Tip: use <kbd className="font-sans font-bold">←</kbd> <kbd className="font-sans font-bold">→</kbd> to flip through templates.
          </p>
        </aside>
      </div>
    </Modal>
  )
}
