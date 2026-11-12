import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { SearchX, X } from 'lucide-react'
import { useIssues } from '../services/issueStore'
import { IssueRow } from '../components/issues/IssueRow'
import { CategoryChips, matchesChip } from '../components/maps/IssueMap'
import { EmptyState, PageHeader } from '../components/common/Common'
import { CAMPUS_LOCATIONS, STATUSES, URGENCIES, URGENCY_RANK } from '../data/constants'
import type { Category, Status, Urgency } from '../types'

type Sort = 'newest' | 'upvoted' | 'urgency'
const DAY = 86400_000

function toggle<T>(arr: T[], v: T) { return arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v] }

export default function AllIssues() {
  const issues = useIssues()
  const [params, setParams] = useSearchParams()
  const q = params.get('q') ?? ''
  const [cat, setCat] = useState<'all' | Category>('all')
  const [statuses, setStatuses] = useState<Status[]>([])
  const [urgencies, setUrgencies] = useState<Urgency[]>([])
  const [location, setLocation] = useState('all')
  const [range, setRange] = useState<'any' | '7' | '30'>('any')
  const [sort, setSort] = useState<Sort>('newest')

  const locations = useMemo(() => Array.from(new Set([...CAMPUS_LOCATIONS.map((l) => l.name), ...issues.map((i) => i.location)])).sort(), [issues])

  const list = useMemo(() => {
    const term = q.trim().toLowerCase()
    const now = Date.now()
    const out = issues.filter((i) =>
      matchesChip(i, cat) &&
      (statuses.length === 0 || statuses.includes(i.status)) &&
      (urgencies.length === 0 || urgencies.includes(i.urgency)) &&
      (location === 'all' || i.location === location) &&
      (range === 'any' || now - +new Date(i.reportedAt) <= Number(range) * DAY) &&
      (!term || i.title.toLowerCase().includes(term) || i.description.toLowerCase().includes(term)))
    return out.sort((a, b) =>
      sort === 'upvoted' ? b.upvotes - a.upvotes
        : sort === 'urgency' ? URGENCY_RANK[b.urgency] - URGENCY_RANK[a.urgency] || +new Date(b.reportedAt) - +new Date(a.reportedAt)
        : +new Date(b.reportedAt) - +new Date(a.reportedAt))
  }, [issues, q, cat, statuses, urgencies, location, range, sort])

  const dirty = q || cat !== 'all' || statuses.length || urgencies.length || location !== 'all' || range !== 'any'
  const clear = () => { setCat('all'); setStatuses([]); setUrgencies([]); setLocation('all'); setRange('any'); setParams({}) }

  return (
    <div>
      <PageHeader title="All Campus Issues" subtitle="Browse, discover and track problems reported across campus." />
      <CategoryChips value={cat} onChange={setCat} />

      <div className="mt-5 grid gap-5 lg:grid-cols-[220px_1fr]">
        <aside className="card h-fit p-4">
          <div className="mb-3 flex items-center justify-between"><h2 className="text-sm font-semibold">Filters</h2>{dirty ? <button onClick={clear} className="text-xs font-semibold text-accent">Clear all</button> : null}</div>
          <fieldset className="mb-4"><legend className="mb-2 text-xs font-semibold text-muted">Status</legend>
            {STATUSES.map((s) => <label key={s} className="flex items-center gap-2 py-1 text-sm"><input type="checkbox" className="accent-[#174C40]" checked={statuses.includes(s)} onChange={() => setStatuses(toggle(statuses, s))} />{s}</label>)}
          </fieldset>
          <fieldset className="mb-4"><legend className="mb-2 text-xs font-semibold text-muted">Urgency</legend>
            {URGENCIES.map((u) => <label key={u} className="flex items-center gap-2 py-1 text-sm"><input type="checkbox" className="accent-[#174C40]" checked={urgencies.includes(u)} onChange={() => setUrgencies(toggle(urgencies, u))} />{u}</label>)}
          </fieldset>
          <label className="mb-1.5 block text-xs font-semibold text-muted" htmlFor="loc">Location</label>
          <select id="loc" className="input mb-4 py-2" value={location} onChange={(e) => setLocation(e.target.value)}><option value="all">All locations</option>{locations.map((l) => <option key={l}>{l}</option>)}</select>
          <label className="mb-1.5 block text-xs font-semibold text-muted" htmlFor="rng">Date reported</label>
          <select id="rng" className="input py-2" value={range} onChange={(e) => setRange(e.target.value as 'any' | '7' | '30')}><option value="any">Any time</option><option value="7">Last 7 days</option><option value="30">Last 30 days</option></select>
        </aside>

        <section className="card min-w-0">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-4 py-3">
            <div className="flex flex-wrap items-center gap-2 text-sm font-semibold">{list.length} {list.length === 1 ? 'issue' : 'issues'} found
              {q && <span className="inline-flex items-center gap-1 rounded-full bg-bg px-2.5 py-1 text-xs font-medium">“{q}”<button aria-label="Clear search" onClick={() => setParams({})}><X size={12} /></button></span>}
            </div>
            <label className="flex items-center gap-2 text-sm text-muted">Sort
              <select aria-label="Sort issues" className="input w-auto py-1.5" value={sort} onChange={(e) => setSort(e.target.value as Sort)}>
                <option value="newest">Newest</option><option value="upvoted">Most upvoted</option><option value="urgency">Urgency</option>
              </select>
            </label>
          </div>
          {list.length === 0
            ? <EmptyState icon={SearchX} title="No issues match your filters" text="Try a different search term or clear some filters." action={<button className="btn-secondary" onClick={clear}>Clear filters</button>} />
            : <div className="divide-y divide-line">{list.map((i) => <IssueRow key={i.id} issue={i} to={`/app/issues/${i.id}`} />)}</div>}
        </section>
      </div>
    </div>
  )
}
