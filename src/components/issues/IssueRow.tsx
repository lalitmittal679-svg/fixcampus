import { Link } from 'react-router-dom'
import { Bookmark, ChevronUp, MapPin } from 'lucide-react'
import type { Issue } from '../../types'
import { categoryShort } from '../../data/constants'
import { StatusBadge, UrgencyBadge } from '../common/Badges'
import { IssueThumb } from '../common/CategoryIcon'
import { fmtDate } from '../../utils/format'
import { useAuth } from '../../context/AuthContext'
import { useIssueActions } from '../../hooks/useIssueActions'

export function IssueRow({ issue, to }: { issue: Issue; to: string }) {
  const { user } = useAuth()
  const { bookmark } = useIssueActions()
  const saved = issue.bookmarkedBy.includes(user.id)
  return (
    <div className="flex items-center gap-3 px-4 py-3.5 transition-colors hover:bg-bg/70 sm:gap-4">
      <Link to={to} className="flex min-w-0 flex-1 items-center gap-3 sm:gap-4" aria-label={`Open ${issue.title}`}>
        <IssueThumb category={issue.category} image={issue.images[0]} />
        <div className="min-w-0 flex-1">
          <div className="truncate text-[15px] font-semibold">{issue.title}</div>
          <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted">
            <span className="inline-flex items-center gap-1"><MapPin size={12} />{issue.location}</span>
            <span>·</span><span>{fmtDate(issue.reportedAt)}</span>
            <span className="rounded-full bg-bg px-2 py-0.5 font-medium text-ink/70">{categoryShort(issue.category)}</span>
          </div>
          <div className="mt-2 flex items-center gap-2 sm:hidden"><StatusBadge status={issue.status} /><UrgencyBadge urgency={issue.urgency} /></div>
        </div>
        <div className="hidden shrink-0 flex-col items-end gap-1.5 sm:flex"><StatusBadge status={issue.status} /><UrgencyBadge urgency={issue.urgency} /></div>
        <div className="flex w-12 shrink-0 flex-col items-center text-sm font-semibold text-ink/80"><ChevronUp size={16} className="text-muted" />{issue.upvotes}</div>
      </Link>
      <button onClick={() => bookmark(issue.id)} aria-pressed={saved} aria-label={saved ? 'Remove bookmark' : 'Bookmark issue'} className="shrink-0 rounded-lg p-2 text-muted hover:bg-bg">
        <Bookmark size={18} className={saved ? 'fill-brand text-brand' : ''} />
      </button>
    </div>
  )
}
