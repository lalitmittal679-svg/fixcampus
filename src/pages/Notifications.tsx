import { Link } from 'react-router-dom'
import { BellOff, CheckCheck } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useNotifications } from '../hooks/useNotifications'
import { EmptyState, PageHeader } from '../components/common/Common'
import { timeAgo } from '../utils/format'

export default function Notifications() {
  const { user } = useAuth()
  const { notifications, unread, markAllRead, markRead } = useNotifications(user)
  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title="Notifications" subtitle="Updates on issues you reported or follow." action={unread > 0 ? <button className="btn-secondary" onClick={markAllRead}><CheckCheck size={16} />Mark all as read</button> : undefined} />
      <div className="card">
        {notifications.length === 0
          ? <EmptyState icon={BellOff} title="No notifications yet" text="When an administrator updates a report you made or follow, it shows up here." action={<Link to="/app/issues" className="btn-secondary">Browse issues</Link>} />
          : <ul className="divide-y divide-line">{notifications.map((n) => (
              <li key={n.id}>
                <Link to={`/app/issues/${n.issueId}`} onClick={() => markRead(n.id)} className={`flex gap-3 px-5 py-4 hover:bg-bg/70 ${n.read ? '' : 'bg-accent-soft/30'}`}>
                  <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${n.read ? 'bg-transparent' : 'bg-danger'}`} />
                  <div className="min-w-0 flex-1"><div className="text-sm font-semibold">{n.title}: <span className="font-normal">{n.issueTitle}</span></div><p className="mt-0.5 text-sm text-muted">{n.description}</p></div>
                  <span className="shrink-0 text-xs text-muted">{timeAgo(n.at)}</span>
                </Link>
              </li>))}</ul>}
      </div>
    </div>
  )
}
