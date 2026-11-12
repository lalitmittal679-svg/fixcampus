import { Link } from 'react-router-dom'
import { ArrowRight, BellRing, ClipboardCheck, Map as MapIcon, ShieldCheck, HeartHandshake, Eye, Zap, CheckCircle2, Smartphone, TrendingUp, Camera, Search } from 'lucide-react'
import { Logo } from '../components/common/Logo'
import { CampusIllustration } from '../components/common/CampusIllustration'
import { CategoryIcon } from '../components/common/CategoryIcon'
import { useIssues } from '../services/issueStore'
import { CATEGORIES } from '../data/constants'
import { summarize } from '../utils/stats'
import { useAuth } from '../context/AuthContext'
import type { Category } from '../types'

const NAV = [{ href: '#top', label: 'Home' }, { href: '#features', label: 'Features' }, { href: '#how', label: 'How It Works' }, { href: '#about', label: 'About' }]

export default function LandingPage() {
  const issues = useIssues()
  const s = summarize(issues)
  const { signedIn, role } = useAuth()
  const home = signedIn ? (role === 'admin' ? '/admin' : '/app') : '/signin'
  const report = signedIn && role === 'student' ? '/app/report' : '/signin'
  const map = signedIn && role === 'student' ? '/app/map' : '/signin'
  const common: Category[] = ['wifi', 'washrooms', 'classroom', 'water', 'lighting', 'cleanliness']
  const rate = s.total ? Math.round((s.resolved / s.total) * 100) : 0

  return (
    <div id="top" className="bg-bg">
      <header className="sticky top-0 z-30 border-b border-line bg-bg/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-4 sm:px-6">
          <Logo />
          <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
            {NAV.map((n) => <a key={n.href} href={n.href} className="text-sm font-medium text-ink/80 hover:text-ink">{n.label}</a>)}
          </nav>
          <div className="flex items-center gap-2">
            <Link to="/signin" className="hidden px-3 text-sm font-semibold sm:block">Sign In</Link>
            <Link to={home} className="btn-primary px-4 py-2">{signedIn ? 'Open app' : 'Get Started'}</Link>
          </div>
        </div>
      </header>

      <section className="mx-auto grid max-w-[1200px] items-center gap-10 px-4 pb-14 pt-10 sm:px-6 lg:grid-cols-2 lg:pt-16">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-3 py-1 text-xs font-medium text-ink/70"><HeartHandshake size={13} className="text-brand" />For a better campus, together</span>
          <h1 className="mt-5 text-4xl font-bold leading-[1.08] sm:text-5xl">See a problem.<br />Report it.<br />Get it fixed.</h1>
          <p className="mt-5 max-w-md text-base text-muted">FixMyCampus makes it easy for students to report campus issues and track their resolution. A cleaner, safer and better campus for everyone.</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link to={report} className="btn-primary px-5 py-3">Report an Issue <ArrowRight size={16} /></Link>
            <Link to={map} className="btn-secondary px-5 py-3">Explore Campus Map</Link>
          </div>
        </div>
        <div className="relative">
          <div className="overflow-hidden rounded-3xl border border-line"><CampusIllustration className="block w-full" /></div>
          <div className="card absolute -bottom-5 left-4 flex items-center gap-3 px-4 py-3 sm:left-auto sm:right-6">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-soft text-brand"><ClipboardCheck size={20} /></span>
            <div><div className="text-xl font-bold leading-none">{s.resolved}</div><div className="mt-1 text-xs text-muted">issues resolved · demo data</div></div>
          </div>
        </div>
      </section>

      <section id="features" className="mx-auto max-w-[1200px] scroll-mt-20 px-4 py-10 sm:px-6">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Camera, t: 'Quick Reporting', d: 'Report issues in minutes, with photos' },
            { icon: BellRing, t: 'Track Progress', d: 'Follow every status change' },
            { icon: MapIcon, t: 'Interactive Map', d: 'Find and view issues by location' },
            { icon: TrendingUp, t: 'Make an Impact', d: 'Upvote what matters most' },
          ].map((f) => (
            <div key={f.t} className="text-center">
              <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-brand-soft text-brand"><f.icon size={20} /></span>
              <div className="mt-3 text-sm font-semibold">{f.t}</div>
              <div className="mt-0.5 text-xs text-muted">{f.d}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1200px] px-4 py-10 sm:px-6">
        <div className="mb-5 flex items-end justify-between"><h2 className="text-xl font-bold">Common Issues Reported</h2><Link to={signedIn && role === 'student' ? '/app/issues' : '/signin'} className="text-sm font-semibold text-accent">View all →</Link></div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {common.map((c) => {
            const n = issues.filter((i) => i.category === c).length
            return (
              <div key={c} className="card p-4">
                <CategoryIcon category={c} size={20} />
                <div className="mt-3 text-sm font-semibold">{CATEGORIES.find((x) => x.id === c)!.label}</div>
                <div className="text-xs text-muted">{n} reports</div>
              </div>
            )
          })}
        </div>
      </section>

      <section id="how" className="mx-auto max-w-[1200px] scroll-mt-20 px-4 py-12 sm:px-6">
        <h2 className="text-center text-2xl font-bold">How it works</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {[
            { n: '1', icon: Smartphone, t: 'Report', d: 'Describe the problem, pin the location and attach a photo. It takes about two minutes.' },
            { n: '2', icon: Search, t: 'Track', d: 'Follow the report through review and repair, and upvote issues that affect many people.' },
            { n: '3', icon: CheckCircle2, t: 'Resolve', d: 'Administrators assign a department, post updates and mark the issue resolved.' },
          ].map((s2) => (
            <div key={s2.n} className="card p-6">
              <div className="flex items-center justify-between"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand text-white"><s2.icon size={19} /></span><span className="text-3xl font-bold text-line">{s2.n}</span></div>
              <h3 className="mt-4 text-lg font-semibold">{s2.t}</h3>
              <p className="mt-1.5 text-sm text-muted">{s2.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="about" className="mx-auto max-w-[1200px] scroll-mt-20 px-4 py-10 sm:px-6">
        <div className="grid gap-8 rounded-3xl border border-line bg-white p-6 sm:p-10 lg:grid-cols-2">
          <div>
            <h2 className="text-2xl font-bold">One place for every campus issue</h2>
            <p className="mt-3 text-sm text-muted">Reports used to disappear into notice boards and message groups. FixMyCampus gives students and administration a shared, visible record.</p>
            <ul className="mt-6 space-y-4">
              {[
                { icon: Eye, t: 'Transparent', d: 'Every status change is time-stamped and visible.' },
                { icon: Zap, t: 'Efficient', d: 'Issues route to the right department.' },
                { icon: ShieldCheck, t: 'Accountable', d: 'Admins add notes so students know what was done.' },
              ].map((b) => (
                <li key={b.t} className="flex gap-3"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-brand"><b.icon size={17} /></span><div><div className="text-sm font-semibold">{b.t}</div><div className="text-sm text-muted">{b.d}</div></div></li>
              ))}
            </ul>
          </div>
          <div>
            <div className="mb-3 text-sm font-semibold">Community impact <span className="ml-1 rounded-full border border-line px-2 py-0.5 text-[11px] font-medium text-muted">demo data</span></div>
            <div className="grid grid-cols-2 gap-3">
              {[{ v: s.total, l: 'Issues reported' }, { v: s.resolved, l: 'Resolved' }, { v: `${rate}%`, l: 'Resolution rate' }, { v: s.upvotes, l: 'Community upvotes' }].map((x) => (
                <div key={x.l} className="rounded-2xl bg-bg p-5"><div className="text-3xl font-bold text-brand">{x.v}</div><div className="mt-1 text-sm text-muted">{x.l}</div></div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1200px] px-4 pb-16 pt-6 sm:px-6">
        <div className="rounded-3xl bg-brand px-6 py-12 text-center text-white">
          <h2 className="text-2xl font-bold sm:text-3xl">Help make your campus better</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-white/75">Spotted something broken? It only takes a couple of minutes to report.</p>
          <Link to={report} className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-brand hover:bg-brand-soft">Report an Issue <ArrowRight size={16} /></Link>
        </div>
      </section>

      <footer className="border-t border-line bg-white">
        <div className="mx-auto flex max-w-[1200px] flex-col items-center justify-between gap-3 px-4 py-6 text-sm text-muted sm:flex-row sm:px-6">
          <Logo />
          <span>See a problem. Report it. Get it fixed.</span>
          <span>© {new Date().getFullYear()} FixMyCampus · Demo project</span>
        </div>
      </footer>
    </div>
  )
}
