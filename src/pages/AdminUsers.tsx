import { useMemo } from 'react'
import { useIssues } from '../services/issueStore'
import { Avatar, EmptyState, PageHeader } from '../components/common/Common'
import { Users } from 'lucide-react'

export default function AdminUsers() {
  const issues = useIssues()
  const users = useMemo(() => {
    const map = new Map<string, { id: string; name: string; course: string; reports: number; resolved: number; upvotes: number }>()
    issues.forEach((i) => {
      const u = map.get(i.reportedBy.id) ?? { ...i.reportedBy, reports: 0, resolved: 0, upvotes: 0 }
      u.reports++; u.upvotes += i.upvotes; if (i.status === 'Resolved') u.resolved++
      map.set(i.reportedBy.id, u)
    })
    return [...map.values()].sort((a, b) => b.reports - a.reports)
  }, [issues])
  return (
    <div>
      <PageHeader title="Users" subtitle="Students who have reported issues. Derived from report data (demo accounts)." />
      <div className="card overflow-hidden">
        {users.length === 0 ? <EmptyState icon={Users} title="No users yet" text="Students appear here after they submit a report." /> : (
          <div className="overflow-x-auto"><table className="w-full min-w-[560px] text-sm">
            <thead className="bg-bg text-left text-xs text-muted"><tr>{['Student', 'Course', 'Reports', 'Resolved', 'Upvotes received'].map((h) => <th key={h} className="px-4 py-2.5 font-semibold">{h}</th>)}</tr></thead>
            <tbody className="divide-y divide-line">{users.map((u) => (
              <tr key={u.id}><td className="px-4 py-3"><div className="flex items-center gap-3"><Avatar name={u.name} size={32} /><span className="font-semibold">{u.name}</span></div></td><td className="px-4 py-3 text-muted">{u.course}</td><td className="px-4 py-3">{u.reports}</td><td className="px-4 py-3">{u.resolved}</td><td className="px-4 py-3">{u.upvotes}</td></tr>))}</tbody>
          </table></div>)}
      </div>
    </div>
  )
}
