import { useEffect, useRef, useState, type FormEvent } from 'react'
import { NavLink, Outlet, useLocation, useNavigate, Link } from 'react-router-dom'
import {
  LayoutDashboard, FilePlus2, ListChecks, Map as MapIcon, FileText, Bell, UserRound, Search, Menu, X,
  BarChart3, Users, Building, Settings, ChevronDown, Leaf, LogOut, Repeat, type LucideIcon,
} from 'lucide-react'
import { Logo } from '../common/Logo'
import { Avatar } from '../common/Common'
import { useAuth } from '../../context/AuthContext'
import { useNotifications } from '../../hooks/useNotifications'
import { useToast } from '../../context/ToastContext'
import type { Role } from '../../types'

interface NavItem { to: string; label: string; icon: LucideIcon; end?: boolean; badge?: boolean }

const NAV: Record<Role, NavItem[]> = {
  student: [
    { to: '/app', label: 'Dashboard', icon: LayoutDashboard, end: true },
    { to: '/app/report', label: 'Report Issue', icon: FilePlus2 },
    { to: '/app/issues', label: 'All Issues', icon: ListChecks },
    { to: '/app/map', label: 'Campus Map', icon: MapIcon },
    { to: '/app/my-reports', label: 'My Reports', icon: FileText },
    { to: '/app/notifications', label: 'Notifications', icon: Bell, badge: true },
    { to: '/app/profile', label: 'Profile', icon: UserRound },
  ],
  admin: [
    { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
    { to: '/admin/issues', label: 'All Issues', icon: ListChecks },
    { to: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
    { to: '/admin/map', label: 'Campus Map', icon: MapIcon },
    { to: '/admin/users', label: 'Users', icon: Users },
    { to: '/admin/departments', label: 'Departments', icon: Building },
    { to: '/admin/settings', label: 'Settings', icon: Settings },
  ],
}

function SidebarContent({ role, onNavigate }: { role: Role; onNavigate?: () => void }) {
  const { user } = useAuth()
  const { unread } = useNotifications(user)
  return (
    <div className="flex h-full flex-col">
      <div className="px-5 pb-5 pt-5"><Logo to={role === 'admin' ? '/admin' : '/app'} /></div>
      <nav className="flex-1 space-y-1 px-3" aria-label="Main">
        {NAV[role].map((n) => (
          <NavLink
            key={n.to} to={n.to} end={n.end} onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${isActive ? 'bg-brand-soft text-brand' : 'text-ink/80 hover:bg-bg'}`}
          >
            <n.icon size={18} />
            <span className="flex-1">{n.label}</span>
            {n.badge && unread > 0 && <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-danger px-1.5 text-[11px] font-bold text-white">{unread}</span>}
          </NavLink>
        ))}
      </nav>
      <div className="m-3 rounded-2xl bg-brand-soft p-4">
        <Leaf size={22} className="text-brand" />
        <p className="mt-2 text-sm font-semibold leading-snug text-brand">
          {role === 'admin' ? <>Admin Panel<br /><span className="font-normal text-brand/80">Demo University</span></> : <>Together for<br />a better campus.</>}
        </p>
      </div>
    </div>
  )
}

function UserMenu() {
  const { user, role, signIn, signOut } = useAuth()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const toast = useToast()
  useEffect(() => {
    const close = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) setOpen(false) }
    const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('mousedown', close); document.addEventListener('keydown', esc)
    return () => { document.removeEventListener('mousedown', close); document.removeEventListener('keydown', esc) }
  }, [])
  const switchRole = () => {
    const next: Role = role === 'student' ? 'admin' : 'student'
    signIn(next); setOpen(false); navigate(next === 'admin' ? '/admin' : '/app')
    toast(`Switched to the ${next} portal (demo)`)
  }
  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen((o) => !o)} aria-haspopup="menu" aria-expanded={open} className="flex items-center gap-2.5 rounded-xl px-1.5 py-1 hover:bg-bg">
        <Avatar name={user.name} />
        <span className="hidden text-left leading-tight sm:block">
          <span className="block text-sm font-semibold">{user.name}</span>
          <span className="block text-xs text-muted">{role === 'admin' ? 'Admin' : 'Student'}</span>
        </span>
        <ChevronDown size={16} className="hidden text-muted sm:block" />
      </button>
      {open && (
        <div role="menu" className="card absolute right-0 z-50 mt-2 w-60 p-1.5">
          <div className="px-3 py-2 text-xs text-muted">Signed in as {role === 'admin' ? 'Admin' : 'Student'} (demo account)</div>
          <button role="menuitem" onClick={switchRole} className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm hover:bg-bg"><Repeat size={16} />Switch to {role === 'student' ? 'Admin' : 'Student'} portal</button>
          {role === 'student' && <Link role="menuitem" to="/app/profile" onClick={() => setOpen(false)} className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm hover:bg-bg"><UserRound size={16} />Profile</Link>}
          <button role="menuitem" onClick={() => { signOut(); navigate('/') }} className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-danger hover:bg-bg"><LogOut size={16} />Sign out</button>
        </div>
      )}
    </div>
  )
}

export default function AppShell({ role }: { role: Role }) {
  const [drawer, setDrawer] = useState(false)
  const [q, setQ] = useState('')
  const navigate = useNavigate()
  const loc = useLocation()
  const { user } = useAuth()
  const { unread: rawUnread } = useNotifications(user)
  const unread = role === 'admin' ? 0 : rawUnread
  useEffect(() => { setDrawer(false); window.scrollTo(0, 0) }, [loc.pathname])

  const submit = (e: FormEvent) => {
    e.preventDefault()
    navigate(`${role === 'admin' ? '/admin/issues' : '/app/issues'}?q=${encodeURIComponent(q.trim())}`)
  }

  return (
    <div className="min-h-screen bg-bg">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 border-r border-line bg-white lg:block"><SidebarContent role={role} /></aside>

      {drawer && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-ink/40" onClick={() => setDrawer(false)} />
          <aside className="absolute inset-y-0 left-0 w-64 bg-white shadow-xl" aria-label="Navigation drawer">
            <button aria-label="Close menu" className="absolute right-3 top-4 rounded-lg p-1.5 text-muted hover:bg-bg" onClick={() => setDrawer(false)}><X size={18} /></button>
            <SidebarContent role={role} onNavigate={() => setDrawer(false)} />
          </aside>
        </div>
      )}

      <div className="lg:pl-60">
        <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-line bg-white/90 px-4 backdrop-blur sm:px-6">
          <button className="rounded-lg p-2 hover:bg-bg lg:hidden" aria-label="Open menu" onClick={() => setDrawer(true)}><Menu size={20} /></button>
          <form onSubmit={submit} className="relative max-w-md flex-1" role="search">
            <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
            <input value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search issues" placeholder="Search issues or keywords…" className="input rounded-xl bg-bg py-2 pl-9" />
          </form>
          <div className="ml-auto flex items-center gap-1.5">
            {role === 'admin' && <span className="hidden rounded-full bg-accent-soft px-2.5 py-1 text-xs font-semibold text-accent md:inline">Admin view</span>}
            <Link to={role === 'admin' ? '/admin/issues' : '/app/notifications'} aria-label={`Notifications (${unread} unread)`} className="relative rounded-xl p-2.5 text-ink/80 hover:bg-bg">
              <Bell size={19} />
              {unread > 0 && <span className="absolute right-1.5 top-1.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-danger" />}
            </Link>
            <UserMenu />
          </div>
        </header>
        <main className="mx-auto w-full max-w-[1200px] px-4 py-6 sm:px-6 sm:py-8"><Outlet /></main>
      </div>
    </div>
  )
}
