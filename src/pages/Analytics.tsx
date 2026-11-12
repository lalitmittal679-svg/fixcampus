import { useState } from 'react'
import { useIssues } from '../services/issueStore'
import { PageHeader, DemoTag, EmptyState } from '../components/common/Common'
import { CategoryDonut, DepartmentBars, StatusBars, TrendChart } from '../components/charts/Charts'
import { byCategory, byDepartment, byStatusData, trend } from '../utils/stats'

export default function Analytics() {
  const issues = useIssues()
  const [days, setDays] = useState(30)
  const demoCount = issues.filter((i) => i.isDemo).length
  if (issues.length === 0) return <div className="card"><EmptyState title="No data to analyse" text="Analytics appear once issues have been reported." /></div>
  return (
    <div className="space-y-6">
      <PageHeader title="Analytics" subtitle="Computed live from the issue dataset." action={demoCount > 0 ? <DemoTag>{demoCount} of {issues.length} issues are demo data</DemoTag> : undefined} />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <section className="card p-5"><h2 className="mb-4 text-lg font-semibold">Issues by category</h2><CategoryDonut data={byCategory(issues)} /></section>
        <section className="card p-5"><h2 className="mb-4 text-lg font-semibold">Status distribution</h2><StatusBars data={byStatusData(issues)} /></section>
      </div>
      <section className="card p-5">
        <div className="mb-4 flex items-center justify-between"><h2 className="text-lg font-semibold">Issue trends</h2>
          <select aria-label="Trend range" className="input w-auto py-1.5" value={days} onChange={(e) => setDays(Number(e.target.value))}><option value={7}>Last 7 days</option><option value={14}>Last 14 days</option><option value={30}>Last 30 days</option></select></div>
        <TrendChart data={trend(issues, days)} height={280} />
      </section>
      <section className="card p-5"><h2 className="mb-4 text-lg font-semibold">Department-wise distribution</h2><DepartmentBars data={byDepartment(issues)} /></section>
    </div>
  )
}
