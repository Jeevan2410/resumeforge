/** #/templates — app bar + the template gallery. OWNER: shell agent. */
import { TemplateGallery } from '../features/gallery/TemplateGallery.tsx'
import { useDocumentTitle } from './hooks.ts'
import { SiteHeader } from './SiteHeader.tsx'

export function TemplatesScreen({ params }: { params: Record<string, string> }) {
  useDocumentTitle('Resume templates — ResumeForge')
  return (
    <div className="min-h-dvh bg-slate-50 dark:bg-slate-950">
      <SiteHeader current="templates" />
      <main>
        <TemplateGallery params={params} />
      </main>
    </div>
  )
}
