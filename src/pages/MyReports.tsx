import { useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { FilePlus2, FileText, Hourglass, CheckCircle2, CircleDot } from 'lucide-react'
import { useIssues } from '../services/issueStore'
import { useAuth } from '../context/AuthContext'
import { IssueRow } from '../components/issues/IssueRow'
import { EmptyState, PageHeader, StatCard } from '../components/common/Common'
import type { Status } from '../types'

const TABS = ['All', 'Open', 'In Progress', 'Resolved'] as const

export default function MyReports() {
  const issues = useIssues()
  const { user } = useAuth()
  const [params, setParams] = useSearchParams()
  const tab = (TABS as readonly string[]).includes(params.get('tab') ?? '') ? (params.get('tab') as (typeof TABS)[number]) : 'All'
  const mine = useMemo(() => issues.filter((i) => i.reportedBy.id === user.id).sort((a, b) => +new Date(b.reportedAt) - +new Date(a.reportedAt)), [issues, user.id])
  const count = (s: Status) => mine.filter((i) => i.status === s).length
  const shown = mine.filter((i) => tab === 'All' || (tab === 'Open' ? i.status === 'Open' || i.status === 'Under Review' : i.status === tab))

  return (
    <div>
      <PageHeader title="My Reports" subtitle="Everything you have reported, and where it stands." action={<Link to="/app/report" className="btn-primary"><FilePlus2 size={16} />New report</Link>} />
      <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Total submitted" value={mine.length} icon={FileText} tone="blue" />
        <StatCard label="Open" value={count('Open') + count('Under Review')} icon={CircleDot} tone="gray" hint="incl. under review" />
        <StatCard label="In Progress" value={count('In Progress')} icon={Hourglass} tone="orange" />
        <StatCard label="Resolved" value={count('Resolved')} icon={CheckCircle2} tone="green" />
      </div>
      <div className="card">
        <div className="flex gap-1 overflow-x-auto border-b border-line px-3" role="tablist">
          {TABS.map((t) => (
            <button key={t} role="tab" aria-selected={tab === t} onClick={() => setParams(t === 'All' ? {} : { tab: t })} className={`whitespace-nowrap border-b-2 px-3 py-3 text-sm font-semibold ${tab === t ? 'border-brand text-brand' : 'border-transparent text-muted hover:text-ink'}`}>{t}</button>
          ))}
        </div>
        {shown.length === 0
          ? <EmptyState title={mine.length === 0 ? 'You have not reported anything yet' : 'Nothing in this tab'} text={mine.length === 0 ? 'Spotted a problem on campus? Report it and follow its progress here.' : 'Reports with this status will appear here.'} action={mine.length === 0 ? <Link to="/app/report" className="btn-primary">Report an issue</Link> : undefined} />
          : <div className="divide-y divide-line">{shown.map((i) => <IssueRow key={i.id} issue={i} to={`/app/issues/${i.id}`} />)}</div>}
      </div>
    </div>
  )
}
