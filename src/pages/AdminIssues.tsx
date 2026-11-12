import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { SearchX, Search } from 'lucide-react'
import { issueActions, useIssues } from '../services/issueStore'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { EmptyState, PageHeader } from '../components/common/Common'
import { StatusBadge, UrgencyBadge } from '../components/common/Badges'
import { CATEGORIES, DEPARTMENTS, STATUSES, URGENCIES, URGENCY_RANK, categoryShort } from '../data/constants'
import { fmtDate } from '../utils/format'
import type { Status } from '../types'

export default function AdminIssues() {
  const issues = useIssues()
  const { user } = useAuth()
  const toast = useToast()
  const [params, setParams] = useSearchParams()
  const q = params.get('q') ?? ''
  const status = params.get('status') ?? 'all'
  const [cat, setCat] = useState('all')
  const [urgency, setUrgency] = useState('all')
  const [sort, setSort] = useState<'newest' | 'upvoted' | 'urgency'>('newest')

  const setParam = (k: string, v: string) => { const p = new URLSearchParams(params); if (v && v !== 'all') p.set(k, v); else p.delete(k); setParams(p) }

  const list = useMemo(() => {
    const term = q.trim().toLowerCase()
    return issues.filter((i) =>
      (status === 'all' || i.status === status) && (cat === 'all' || i.category === cat) && (urgency === 'all' || i.urgency === urgency) &&
      (!term || i.title.toLowerCase().includes(term) || i.description.toLowerCase().includes(term) || i.id.toLowerCase().includes(term)))
      .sort((a, b) => sort === 'upvoted' ? b.upvotes - a.upvotes : sort === 'urgency' ? URGENCY_RANK[b.urgency] - URGENCY_RANK[a.urgency] : +new Date(b.reportedAt) - +new Date(a.reportedAt))
  }, [issues, q, status, cat, urgency, sort])

  return (
    <div>
      <PageHeader title="All Issues" subtitle="Review, assign and update every reported issue." />
      <div className="card mb-4 grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-5">
        <div className="relative lg:col-span-2"><Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" /><input aria-label="Search issues" className="input pl-9" placeholder="Search title, description or ID" value={q} onChange={(e) => setParam('q', e.target.value)} /></div>
        <select aria-label="Filter by status" className="input" value={status} onChange={(e) => setParam('status', e.target.value)}><option value="all">All statuses</option>{STATUSES.map((s) => <option key={s}>{s}</option>)}</select>
        <select aria-label="Filter by category" className="input" value={cat} onChange={(e) => setCat(e.target.value)}><option value="all">All categories</option>{CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}</select>
        <select aria-label="Filter by urgency" className="input" value={urgency} onChange={(e) => setUrgency(e.target.value)}><option value="all">All urgencies</option>{URGENCIES.map((u) => <option key={u}>{u}</option>)}</select>
      </div>
      <div className="card overflow-hidden">
        <div className="flex items-center justify-between border-b border-line px-4 py-3 text-sm"><span className="font-semibold">{list.length} issues</span>
          <label className="flex items-center gap-2 text-muted">Sort<select aria-label="Sort" className="input w-auto py-1.5" value={sort} onChange={(e) => setSort(e.target.value as typeof sort)}><option value="newest">Newest</option><option value="upvoted">Most upvoted</option><option value="urgency">Urgency</option></select></label></div>
        {list.length === 0 ? <EmptyState icon={SearchX} title="No issues match" text="Adjust the filters or search term." /> : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px] text-sm">
              <thead className="bg-bg text-left text-xs text-muted"><tr>{['Issue', 'Category', 'Location', 'Urgency', 'Reported', 'Department', 'Status'].map((h) => <th key={h} className="px-4 py-2.5 font-semibold">{h}</th>)}</tr></thead>
              <tbody className="divide-y divide-line">
                {list.map((i) => (
                  <tr key={i.id} className="hover:bg-bg/60">
                    <td className="max-w-[260px] px-4 py-3"><Link to={`/admin/issues/${i.id}`} className="block truncate font-semibold hover:text-accent">{i.title}</Link><span className="text-xs text-muted">{i.id} · {i.upvotes} upvotes</span></td>
                    <td className="px-4 py-3 text-muted">{categoryShort(i.category)}</td>
                    <td className="px-4 py-3 text-muted">{i.location}</td>
                    <td className="px-4 py-3"><UrgencyBadge urgency={i.urgency} /></td>
                    <td className="whitespace-nowrap px-4 py-3 text-muted">{fmtDate(i.reportedAt)}</td>
                    <td className="px-4 py-3">
                      <select aria-label={`Department for ${i.id}`} className="input w-44 py-1.5 text-xs" value={i.assignedDepartment ?? ''} onChange={(e) => { if (e.target.value) { issueActions.assignDepartment(i.id, e.target.value, user.name); toast(`${i.id} assigned to ${e.target.value}`) } }}>
                        <option value="">Unassigned</option>{DEPARTMENTS.map((d) => <option key={d}>{d}</option>)}
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col items-start gap-1.5"><StatusBadge status={i.status} />
                        <select aria-label={`Change status for ${i.id}`} className="input w-32 py-1 text-xs" value={i.status} onChange={(e) => { issueActions.setStatus(i.id, e.target.value as Status, user.name); toast(`${i.id} is now ${e.target.value}`) }}>{STATUSES.map((s) => <option key={s}>{s}</option>)}</select>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
