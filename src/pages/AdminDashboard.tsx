import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { ClipboardList, CircleDot, Hourglass, CheckCircle2, UserCog, SearchCheck, PhoneCall, MapPin } from 'lucide-react'
import { useIssues } from '../services/issueStore'
import { StatCard, EmptyState, DemoTag } from '../components/common/Common'
import { StatusBadge, UrgencyBadge } from '../components/common/Badges'
import { IssueThumb } from '../components/common/CategoryIcon'
import { CategoryDonut, TrendChart } from '../components/charts/Charts'
import { byCategory, summarize, trend } from '../utils/stats'
import { URGENCY_RANK } from '../data/constants'
import { fmtDate, timeAgo } from '../utils/format'
import type { Issue } from '../types'

function pendingAction(i: Issue): { label: string; icon: typeof UserCog } | null {
  if (i.status === 'Resolved') return null
  if (i.status === 'Open') return { label: 'Review issue', icon: SearchCheck }
  if (!i.assignedDepartment) return { label: 'Assign department', icon: UserCog }
  if (i.status === 'Under Review') return { label: 'Start work or update', icon: SearchCheck }
  if (Date.now() - +new Date(i.updatedAt) > 3 * 86400_000) return { label: 'Follow up (no recent update)', icon: PhoneCall }
  return null
}

export default function AdminDashboard() {
  const issues = useIssues()
  const s = summarize(issues)
  const recent = useMemo(() => [...issues].sort((a, b) => +new Date(b.reportedAt) - +new Date(a.reportedAt)).slice(0, 5), [issues])
  const pending = useMemo(() => issues.map((i) => ({ i, a: pendingAction(i) })).filter((x) => x.a)
    .sort((a, b) => URGENCY_RANK[b.i.urgency] - URGENCY_RANK[a.i.urgency] || b.i.upvotes - a.i.upvotes).slice(0, 5), [issues])
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-2"><div><h1 className="text-2xl font-bold">Dashboard</h1><p className="mt-1 text-sm text-muted">Overview of campus issues and their status.</p></div><DemoTag>Includes demo data</DemoTag></div>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Total Issues" value={s.total} icon={ClipboardList} tone="blue" to="/admin/issues" />
        <StatCard label="Open" value={s.open} icon={CircleDot} tone="orange" to="/admin/issues?status=Open" />
        <StatCard label="In Progress" value={s.progress} icon={Hourglass} tone="gray" to="/admin/issues?status=In Progress" />
        <StatCard label="Resolved" value={s.resolved} icon={CheckCircle2} tone="green" to="/admin/issues?status=Resolved" />
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <section className="card p-5"><h2 className="mb-4 text-lg font-semibold">Issues by Category</h2>{issues.length ? <CategoryDonut data={byCategory(issues)} /> : <EmptyState title="No data" text="No issues to chart." />}</section>
        <section className="card p-5"><h2 className="mb-4 text-lg font-semibold">Issues Trend <span className="text-xs font-normal text-muted">last 30 days</span></h2><TrendChart data={trend(issues, 30)} /></section>
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <section className="card p-5">
          <div className="mb-2 flex items-center justify-between"><h2 className="text-lg font-semibold">Recent Issues</h2><Link to="/admin/issues" className="text-xs font-semibold text-accent">View all →</Link></div>
          {recent.length === 0 ? <EmptyState title="No issues yet" text="New reports will appear here." /> : (
            <ul className="divide-y divide-line">{recent.map((i) => (
              <li key={i.id}><Link to={`/admin/issues/${i.id}`} className="flex items-center gap-3 py-3 hover:opacity-80">
                <IssueThumb category={i.category} image={i.images[0]} className="h-10 w-10" />
                <div className="min-w-0 flex-1"><div className="truncate text-sm font-semibold">{i.title}</div><div className="flex items-center gap-1 text-xs text-muted"><MapPin size={11} />{i.location} · {fmtDate(i.reportedAt)}</div></div>
                <div className="flex shrink-0 flex-col items-end gap-1"><StatusBadge status={i.status} /><UrgencyBadge urgency={i.urgency} /></div>
              </Link></li>))}</ul>)}
        </section>
        <section className="card p-5">
          <h2 className="mb-2 text-lg font-semibold">Pending Actions</h2>
          {pending.length === 0 ? <EmptyState icon={CheckCircle2} title="All caught up" text="No issues need attention right now." /> : (
            <ul className="divide-y divide-line">{pending.map(({ i, a }) => (
              <li key={i.id}><Link to={`/admin/issues/${i.id}`} className="flex items-center gap-3 py-3 hover:opacity-80">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent">{a && <a.icon size={17} />}</span>
                <div className="min-w-0 flex-1"><div className="truncate text-sm font-semibold">{a?.label}</div><div className="truncate text-xs text-muted">{i.title} · {timeAgo(i.updatedAt)}</div></div>
                <UrgencyBadge urgency={i.urgency} />
              </Link></li>))}</ul>)}
        </section>
      </div>
    </div>
  )
}
