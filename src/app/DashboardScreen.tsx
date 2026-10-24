/** #/ — app bar + the dashboard feature. OWNER: shell agent. */
import { useEffect } from 'react'
import { Dashboard } from '../features/dashboard/Dashboard.tsx'
import { useDocumentTitle } from './hooks.ts'
import { prefetchEditor } from './lazy.ts'
import { SiteHeader } from './SiteHeader.tsx'

export function DashboardScreen() {
  useDocumentTitle('My resumes — ResumeForge')
  useEffect(() => {
    const t = setTimeout(prefetchEditor, 800)
    return () => clearTimeout(t)
  }, [])
  return (
    <div className="min-h-dvh bg-slate-50 dark:bg-slate-950">
      <SiteHeader current="dashboard" />
      <main>
        <Dashboard />
      </main>
    </div>
  )
}
