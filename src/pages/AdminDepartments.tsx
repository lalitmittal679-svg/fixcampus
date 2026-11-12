import { Link } from 'react-router-dom'
import { useIssues } from '../services/issueStore'
import { PageHeader } from '../components/common/Common'
import { DEPARTMENTS } from '../data/constants'

export default function AdminDepartments() {
  const issues = useIssues()
  return (
    <div>
      <PageHeader title="Departments" subtitle="Workload by department. Assign issues from an issue's page or the All Issues table." />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {DEPARTMENTS.map((d) => {
          const mine = issues.filter((i) => i.assignedDepartment === d)
          const resolved = mine.filter((i) => i.status === 'Resolved').length
          const active = mine.length - resolved
          const pct = mine.length ? Math.round((resolved / mine.length) * 100) : 0
          return (
            <div key={d} className="card p-5">
              <h2 className="font-semibold">{d}</h2>
              <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                {[['Assigned', mine.length], ['Active', active], ['Resolved', resolved]].map(([l, v]) => <div key={l} className="rounded-xl bg-bg py-2"><div className="text-lg font-bold">{v}</div><div className="text-[11px] text-muted">{l}</div></div>)}
              </div>
              <div className="mt-4"><div className="mb-1 flex justify-between text-xs text-muted"><span>Resolution rate</span><span>{pct}%</span></div><div className="h-1.5 rounded-full bg-gray-100"><div className="h-full rounded-full bg-brand" style={{ width: `${pct}%` }} /></div></div>
            </div>
          )
        })}
      </div>
      <p className="mt-5 text-sm text-muted">Need to assign work? <Link className="font-semibold text-accent" to="/admin/issues">Open all issues →</Link></p>
    </div>
  )
}
