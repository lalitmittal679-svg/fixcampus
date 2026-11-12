import { useNavigate, Link } from 'react-router-dom'
import { GraduationCap, ShieldCheck, ArrowRight } from 'lucide-react'
import { Logo } from '../components/common/Logo'
import { useAuth } from '../context/AuthContext'

export default function SignIn() {
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const go = (role: 'student' | 'admin') => { signIn(role); navigate(role === 'admin' ? '/admin' : '/app') }
  const options = [
    { role: 'student' as const, icon: GraduationCap, title: 'Student', text: 'Report issues, track progress and support reports from your campus.' },
    { role: 'admin' as const, icon: ShieldCheck, title: 'Administrator', text: 'Review reports, assign departments and update statuses.' },
  ]
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-bg px-4 py-10">
      <Logo className="mb-8" />
      <div className="card w-full max-w-xl p-6 sm:p-8">
        <h1 className="text-2xl font-bold">Sign in to FixMyCampus</h1>
        <p className="mt-1 text-sm text-muted">This is a demo. There is no real authentication; pick a role to explore each experience.</p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {options.map((o) => (
            <button key={o.role} onClick={() => go(o.role)} className="group rounded-2xl border border-line p-5 text-left transition-colors hover:border-brand hover:bg-brand-soft/40">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-soft text-brand"><o.icon size={20} /></span>
              <div className="mt-4 font-semibold">{o.title}</div>
              <p className="mt-1 text-sm text-muted">{o.text}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand">Continue <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" /></span>
            </button>
          ))}
        </div>
      </div>
      <Link to="/" className="mt-6 text-sm text-muted hover:text-ink">← Back to home</Link>
    </div>
  )
}
