/** Gallery state hooks and actions shared by the gallery page, dashboard, New resume dialog and Design panel. */
import { useMemo, useState } from 'react'
import { defaultDesign } from '../../lib/design.ts'
import { filterTemplates, type GalleryFilter } from '../../lib/gallery.ts'
import { developerSample, researcherSample } from '../../lib/samples.ts'
import type { Design, ResumeData, TemplateId } from '../../lib/types.ts'
import { uiActions, useActiveDoc } from '../../store'
import { TEMPLATES, type TemplateCollection, type TemplateDef } from '../../templates'

export type PreviewSample = 'developer' | 'researcher' | 'mine'

export interface TemplateFilterState {
  query: string
  collection: TemplateCollection | 'all'
  tags: string[]
}

export const EMPTY_FILTER: TemplateFilterState = { query: '', collection: 'all', tags: [] }

export const isFiltered = (f: TemplateFilterState) => !!f.query.trim() || f.collection !== 'all' || f.tags.length > 0

export function useFilteredTemplates(filter: GalleryFilter): TemplateDef[] {
  return useMemo(() => filterTemplates(TEMPLATES, filter), [filter])
}

/** Local filter state + the matching templates. */
export function useTemplateFilter(initial: Partial<TemplateFilterState> = {}) {
  const [filter, setFilter] = useState<TemplateFilterState>({ ...EMPTY_FILTER, ...initial })
  const shown = useFilteredTemplates(filter)
  return { filter, setFilter, shown }
}

/** Open the big preview; `ids` is the list Previous / Next steps through. */
export const openPreview = (template: TemplateId, ids?: TemplateId[], sample?: PreviewSample) => uiActions.openModal('template-preview', { template, ids, sample })

export const startWithTemplate = (template: TemplateId, accent?: string) => uiActions.openModal('new-resume', { template, accent, starter: 'developer' })

/** Thumbnail content + per-template designs (template default accent) for a preview sample. */
export function useSampleDesigns(sample: PreviewSample) {
  const active = useActiveDoc()
  const mine = sample === 'mine' && active ? active : null
  const data = useMemo<ResumeData>(() => (mine ? mine.data : sample === 'researcher' ? researcherSample() : developerSample()), [mine, sample])
  const designs = useMemo(() => {
    const base = mine ? mine.design : defaultDesign
    return Object.fromEntries(TEMPLATES.map((t) => [t.id, { ...base, template: t.id, accent: t.defaultAccent }])) as Record<TemplateId, Design>
  }, [mine])
  return { data, designs }
}
