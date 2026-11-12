import { useMemo, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowUp, Share2, BellPlus, BellRing, MapPin, Calendar, User as UserIcon, Building, CheckCircle2, Bookmark } from 'lucide-react'
import { issueActions, useIssues } from '../services/issueStore'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { useIssueActions } from '../hooks/useIssueActions'
import { StatusBadge, UrgencyBadge } from '../components/common/Badges'
import { Avatar, ConfirmDialog, DemoTag, EmptyState } from '../components/common/Common'
import { IssueThumb } from '../components/common/CategoryIcon'
import { Timeline } from '../components/issues/Timeline'
import { LocationPicker } from '../components/maps/IssueMap'
import { categoryLabel, DEPARTMENTS, STATUSES } from '../data/constants'
import { fmtDate, fmtDateTime } from '../utils/format'
import type { Issue, Status } from '../types'

function AdminPanel({ issue }: { issue: Issue }) {
  const { user } = useAuth()
  const toast = useToast()
  const [status, setStatus] = useState<Status>(issue.status)
  const [note, setNote] = useState('')
  const [dept, setDept] = useState(issue.assignedDepartment ?? '')
  const [update, setUpdate] = useState('')
  const [confirm, setConfirm] = useState(false)

  const applyStatus = () => {
    issueActions.setStatus(issue.id, status, user.name, note)
    setNote(''); setConfirm(false)
    toast(`Status changed to ${status}`)
  }
  return (
    <section className="card space-y-5 border-accent/30 p-5" aria-label="Admin controls">
      <div className="flex items-center justify-between"><h2 className="text-lg font-semibold">Manage issue</h2><span className="rounded-full bg-accent-soft px-2.5 py-1 text-xs font-semibold text-accent">Admin</span></div>

      <div>
        <label htmlFor="st" className="label">Status</label>
        <div className="flex flex-col gap-2 sm:flex-row">
          <select id="st" className="input" value={status} onChange={(e) => setStatus(e.target.value as Status)}>{STATUSES.map((s) => <option key={s}>{s}</option>)}</select>
        </div>
        <label htmlFor="note" className="label mt-3">Note for the student <span className="font-normal text-muted">(optional)</span></label>
        <textarea id="note" rows={2} className="input" value={note} onChange={(e) => setNote(e.target.value)} placeholder={status === 'Resolved' ? 'Resolution notes, e.g. what was fixed' : 'Short status note'} />
        <div className="mt-3 flex flex-wrap gap-2">
          <button className="btn-primary" disabled={status === issue.status} onClick={() => (status === 'Resolved' ? setConfirm(true) : applyStatus())}>Update status</button>
          {issue.status !== 'Resolved' && <button className="btn-secondary" onClick={() => { setStatus('Resolved'); setConfirm(true) }}><CheckCircle2 size={16} />Mark as resolved</button>}
        </div>
      </div>

      <div className="border-t border-line pt-5">
        <label htmlFor="dept" className="label">Assigned department</label>
        <div className="flex gap-2">
          <select id="dept" className="input" value={dept} onChange={(e) => setDept(e.target.value)}>
            <option value="">Unassigned</option>
            {DEPARTMENTS.map((d) => <option key={d}>{d}</option>)}
          </select>
          <button className="btn-secondary shrink-0" disabled={!dept || dept === issue.assignedDepartment} onClick={() => { issueActions.assignDepartment(issue.id, dept, user.name); toast(`Assigned to ${dept}`) }}>Assign</button>
        </div>
      </div>

      <div className="border-t border-line pt-5">
        <label htmlFor="upd" className="label">Post a timeline update</label>
        <textarea id="upd" rows={2} className="input" value={update} onChange={(e) => setUpdate(e.target.value)} placeholder="E.g. Technician visited, spare part ordered" />
        <button className="btn-secondary mt-3" disabled={update.trim().length < 3} onClick={() => { issueActions.addUpdate(issue.id, update, user.name); setUpdate(''); toast('Update posted') }}>Post update</button>
      </div>

      <ConfirmDialog open={confirm} title="Mark this issue as resolved?" message="The student who reported it and anyone following it will see the resolution in their timeline." confirmLabel="Mark resolved" onConfirm={applyStatus} onCancel={() => { setConfirm(false); setStatus(issue.status) }} />
    </section>
  )
}

export default function IssueDetails() {
  const { id } = useParams()
  const issues = useIssues()
  const { user, role } = useAuth()
  const { upvote, follow, bookmark } = useIssueActions()
  const toast = useToast()
  const base = useLocation().pathname.startsWith('/admin') ? '/admin/issues' : '/app/issues'
  const issue = issues.find((i) => i.id === id)
  const [active, setActive] = useState(0)

  const related = useMemo(() => {
    if (!issue) return []
    return issues.filter((i) => i.id !== issue.id && (i.category === issue.category || i.location === issue.location))
      .sort((a, b) => Number(b.category === issue.category && b.location === issue.location) - Number(a.category === issue.category && a.location === issue.location) || b.upvotes - a.upvotes).slice(0, 3)
  }, [issues, issue])

  if (!issue) return <div className="card"><EmptyState title="Issue not found" text="This report may have been removed, or the link is incorrect." action={<Link className="btn-primary" to={base}>Back to issues</Link>} /></div>

  const voted = issue.upvotedBy.includes(user.id)
  const following = issue.followedBy.includes(user.id)
  const saved = issue.bookmarkedBy.includes(user.id)
  const share = async () => {
    try { await navigator.clipboard.writeText(window.location.href); toast('Link copied to clipboard') }
    catch { toast('Copy the link from your browser address bar', 'error') }
  }

  return (
    <div>
      <Link to={base} className="mb-3 inline-flex items-center gap-1.5 text-sm text-muted hover:text-ink"><ArrowLeft size={15} />Back to all issues</Link>
      <div className="flex flex-wrap items-start gap-3">
        <h1 className="text-2xl font-bold">{issue.title}</h1>
        <StatusBadge status={issue.status} />
        {issue.isDemo && <DemoTag />}
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted">
        <span className="font-semibold text-ink/70">{issue.id}</span>
        <span className="inline-flex items-center gap-1"><MapPin size={14} />{issue.location}</span>
        <span className="inline-flex items-center gap-1"><Calendar size={14} />Reported on {fmtDate(issue.reportedAt)}</span>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
        <div className="min-w-0 space-y-6">
          <section className="card overflow-hidden">
            {issue.images.length > 0 ? (
              <div className="p-4">
                <img src={issue.images[active]} alt={`Photo ${active + 1} of ${issue.title}`} className="max-h-96 w-full rounded-xl object-cover" />
                {issue.images.length > 1 && <div className="mt-3 flex gap-2">{issue.images.map((s, i) => <button key={i} onClick={() => setActive(i)} aria-label={`Show photo ${i + 1}`} className={`overflow-hidden rounded-lg border-2 ${i === active ? 'border-brand' : 'border-transparent'}`}><img src={s} alt="" className="h-16 w-16 object-cover" /></button>)}</div>}
              </div>
            ) : (
              <div className="flex items-center gap-4 p-5"><IssueThumb category={issue.category} className="h-16 w-16" /><p className="text-sm text-muted">No photographs were attached to this report.</p></div>
            )}
          </section>

          <section className="card p-5">
            <h2 className="text-lg font-semibold">Issue Details</h2>
            <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-relaxed text-ink/85">{issue.description}</p>
            <dl className="mt-5 grid gap-4 sm:grid-cols-2">
              <div><dt className="text-xs text-muted">Category</dt><dd className="mt-1 text-sm font-semibold">{categoryLabel(issue.category)}</dd></div>
              <div><dt className="text-xs text-muted">Urgency level</dt><dd className="mt-1"><UrgencyBadge urgency={issue.urgency} /></dd></div>
              <div><dt className="text-xs text-muted">Location</dt><dd className="mt-1 text-sm font-semibold">{issue.location}</dd>{issue.locationDetails && <dd className="text-xs text-muted">{issue.locationDetails}</dd>}</div>
              <div><dt className="text-xs text-muted">Assigned department</dt><dd className="mt-1 flex items-center gap-1.5 text-sm font-semibold"><Building size={14} className="text-muted" />{issue.assignedDepartment ?? 'Not assigned yet'}</dd></div>
              <div className="sm:col-span-2"><dt className="text-xs text-muted">Reported by</dt><dd className="mt-1 flex items-center gap-2.5"><Avatar name={issue.reportedBy.name} size={32} /><span><span className="block text-sm font-semibold">{issue.reportedBy.name}</span><span className="block text-xs text-muted">{issue.reportedBy.course}</span></span></dd></div>
            </dl>
            {issue.resolutionNotes && <div className="mt-5 rounded-xl bg-brand-soft p-4 text-sm"><div className="font-semibold text-brand">Resolution notes</div><p className="mt-1 text-ink/80">{issue.resolutionNotes}</p></div>}
          </section>

          <section className="card p-5">
            <h2 className="mb-1 text-lg font-semibold">Location on map</h2>
            <p className="mb-3 text-xs text-muted">Position is approximate{issue.isDemo ? ' (demo coordinates)' : ''}.</p>
            <LocationPicker lat={issue.lat} lng={issue.lng} height={220} />
          </section>

          <section className="card p-5">
            <h2 className="mb-4 text-lg font-semibold">Resolution Timeline</h2>
            <Timeline issue={issue} />
            {issue.status !== 'Resolved' && <p className="mt-5 text-xs text-muted">This issue is still {issue.status === 'Open' ? 'waiting for review' : issue.status.toLowerCase()}. New milestones appear here as they happen.</p>}
          </section>
        </div>

        <aside className="space-y-6">
          <section className="card bg-accent-soft/40 p-5">
            <h2 className="font-semibold">Upvote this issue</h2>
            <p className="mt-1 text-xs text-muted">Helps administrators prioritise important issues.</p>
            <div className="mt-3 flex items-center justify-between">
              <div><div className="text-3xl font-bold">{issue.upvotes}</div><div className="text-xs text-muted">Upvotes</div></div>
              <button onClick={() => upvote(issue.id)} disabled={voted} aria-label={voted ? 'Already upvoted' : 'Upvote this issue'} className={`flex h-12 w-12 items-center justify-center rounded-xl transition-colors ${voted ? 'bg-brand text-white' : 'bg-white text-accent ring-1 ring-accent/30 hover:bg-accent hover:text-white'}`}><ArrowUp size={22} /></button>
            </div>
            {voted && <p className="mt-2 text-xs font-medium text-brand">You upvoted this issue.</p>}
            <div className="mt-4 grid grid-cols-2 gap-2">
              <button className="btn-secondary px-3" onClick={share}><Share2 size={15} />Share</button>
              <button className={`btn-secondary px-3 ${following ? 'border-brand text-brand' : ''}`} aria-pressed={following} onClick={() => follow(issue.id)}>{following ? <BellRing size={15} /> : <BellPlus size={15} />}{following ? 'Following' : 'Follow'}</button>
            </div>
            <button className="btn-secondary mt-2 w-full" aria-pressed={saved} onClick={() => bookmark(issue.id)}><Bookmark size={15} className={saved ? 'fill-brand text-brand' : ''} />{saved ? 'Bookmarked' : 'Bookmark'}</button>
          </section>

          {role === 'admin' && <AdminPanel key={`${issue.id}-${issue.updatedAt}`} issue={issue} />}

          <section className="card p-5">
            <h2 className="mb-3 font-semibold">Related Issues</h2>
            {related.length === 0 ? <p className="text-sm text-muted">No related issues yet.</p> : (
              <ul className="space-y-3">
                {related.map((r) => (
                  <li key={r.id}><Link to={`${base}/${r.id}`} className="flex items-center gap-3 hover:opacity-80"><IssueThumb category={r.category} image={r.images[0]} className="h-11 w-11" /><span className="min-w-0"><span className="block truncate text-sm font-semibold">{r.title}</span><span className="block text-xs text-muted">{r.upvotes} upvotes · {r.status}</span></span></Link></li>
                ))}
              </ul>
            )}
          </section>
          <p className="flex items-center gap-1.5 text-xs text-muted"><UserIcon size={12} />Last updated {fmtDateTime(issue.updatedAt)}</p>
        </aside>
      </div>
    </div>
  )
}
