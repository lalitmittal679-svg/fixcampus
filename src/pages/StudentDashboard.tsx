import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { FileText, Hourglass, CheckCircle2, ThumbsUp, ArrowRight, ChevronRight, FilePlus2, Map as MapIcon, ListChecks, MapPin } from 'lucide-react'
import { useIssues } from '../services/issueStore'
import { useAuth } from '../context/AuthContext'
import { CampusMapPanel } from '../components/maps/IssueMap'
import { StatCard, EmptyState } from '../components/common/Common'
import { StatusBadge } from '../components/common/Badges'
import { CategoryIcon } from '../components/common/CategoryIcon'
import { timeAgo } from '../utils/format'

export default function StudentDashboard() {
  const issues = useIssues()
  const { user } = useAuth()
  const mine = useMemo(() => issues.filter((i) => i.reportedBy.id === user.id), [issues, user.id])
  const recent = useMemo(() => [...issues].sort((a, b) => +new Date(b.updatedAt) - +new Date(a.updatedAt)).slice(0, 5), [issues])
  const stats = {
    total: mine.length,
    progress: mine.filter((i) => i.status === 'In Progress').length,
    resolved: mine.filter((i) => i.status === 'Resolved').length,
    upvotes: mine.reduce((s, i) => s + i.upvotes, 0),
  }
  const actions = [
    { to: '/app/report', label: 'Report a New Issue', icon: FilePlus2, primary: true },
    { to: '/app/map', label: 'View Campus Map', icon: MapIcon },
    { to: '/app/my-reports', label: 'See My Reports', icon: FileText },
    { to: '/app/issues', label: 'Browse All Issues', icon: ListChecks },
  ]
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Welcome back, {user.name.split(' ')[0]}!</h1>
        <p className="mt-1 text-sm text-muted">Let's keep our campus better, one report at a time.</p>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="My Reports" value={stats.total} icon={FileText} tone="blue" to="/app/my-reports" />
        <StatCard label="In Progress" value={stats.progress} icon={Hourglass} tone="orange" to="/app/my-reports?tab=In Progress" />
        <StatCard label="Resolved" value={stats.resolved} icon={CheckCircle2} tone="green" to="/app/my-reports?tab=Resolved" />
        <StatCard label="Total Upvotes" value={stats.upvotes} icon={ThumbsUp} tone="gray" />
      </div>

      <CampusMapPanel issues={issues} fullHref="/app/map" />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.5fr_1fr]">
        <section className="card p-5">
          <div className="mb-2 flex items-center justify-between"><h2 className="text-lg font-semibold">Recent Updates</h2><Link to="/app/issues" className="text-xs font-semibold text-accent">View all →</Link></div>
          {recent.length === 0 ? <EmptyState title="No activity yet" text="Reports and updates will appear here." /> : (
            <ul className="divide-y divide-line">
              {recent.map((i) => (
                <li key={i.id}>
                  <Link to={`/app/issues/${i.id}`} className="flex items-center gap-3 py-3 hover:opacity-80">
                    <CategoryIcon category={i.category} size={17} />
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-semibold">{i.title}</div>
                      <div className="mt-0.5 flex items-center gap-1 text-xs text-muted"><MapPin size={11} />{i.location}</div>
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-1"><StatusBadge status={i.status} /><span className="text-xs text-muted">{timeAgo(i.updatedAt)}</span></div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="card p-5">
          <h2 className="mb-3 text-lg font-semibold">Quick Actions</h2>
          <div className="space-y-2">
            {actions.map((a) => (
              <Link key={a.to} to={a.to} className={`flex items-center gap-3 rounded-xl border px-3.5 py-3 text-sm font-semibold transition-colors ${a.primary ? 'border-accent/30 bg-accent-soft text-accent hover:bg-accent-soft/70' : 'border-line hover:bg-bg'}`}>
                <a.icon size={17} /><span className="flex-1">{a.label}</span>{a.primary ? <ArrowRight size={16} /> : <ChevronRight size={16} className="text-muted" />}
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
