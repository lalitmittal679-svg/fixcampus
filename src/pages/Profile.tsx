import { useState, type FormEvent } from 'react'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { useIssues } from '../services/issueStore'
import { Avatar, PageHeader } from '../components/common/Common'
import { summarize } from '../utils/stats'

export default function Profile() {
  const { user, updateProfile } = useAuth()
  const toast = useToast()
  const issues = useIssues()
  const [name, setName] = useState(user.name)
  const [course, setCourse] = useState(user.course)
  const [err, setErr] = useState('')
  const mine = summarize(issues.filter((i) => i.reportedBy.id === user.id))
  const save = (e: FormEvent) => {
    e.preventDefault()
    if (name.trim().length < 2) { setErr('Please enter your name.'); return }
    setErr(''); updateProfile({ name: name.trim(), course: course.trim() }); toast('Profile updated')
  }
  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader title="Profile" subtitle="Manage how you appear on your reports." />
      <div className="card p-6">
        <div className="mb-6 flex items-center gap-4"><Avatar name={user.name} size={56} /><div><div className="text-lg font-semibold">{user.name}</div><div className="text-sm text-muted">{user.email}</div></div></div>
        <form onSubmit={save} className="space-y-4">
          <div><label className="label" htmlFor="pn">Full name</label><input id="pn" className="input" value={name} onChange={(e) => setName(e.target.value)} />{err && <p className="mt-1.5 text-xs font-medium text-danger" role="alert">{err}</p>}</div>
          <div><label className="label" htmlFor="pc">Year and course</label><input id="pc" className="input" value={course} onChange={(e) => setCourse(e.target.value)} /></div>
          <button className="btn-primary">Save changes</button>
        </form>
        <div className="mt-6 grid grid-cols-3 gap-3 border-t border-line pt-6 text-center">
          {[['Reports', mine.total], ['Resolved', mine.resolved], ['Upvotes received', mine.upvotes]].map(([l, v]) => <div key={l} className="rounded-xl bg-bg p-3"><div className="text-xl font-bold">{v}</div><div className="text-xs text-muted">{l}</div></div>)}
        </div>
      </div>
    </div>
  )
}
