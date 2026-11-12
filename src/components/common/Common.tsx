import { useEffect, useRef, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Inbox, Loader2, type LucideIcon } from 'lucide-react'

export function EmptyState({ title, text, action, icon: Icon = Inbox }: { title: string; text: string; action?: ReactNode; icon?: LucideIcon }) {
  return (
    <div className="flex flex-col items-center px-6 py-14 text-center">
      <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-brand-soft text-brand"><Icon size={22} /></span>
      <h3 className="text-base font-semibold">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-muted">{text}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}

export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse rounded-xl bg-gray-200/70 ${className}`} />
}

export function Spinner() { return <Loader2 size={16} className="animate-spin" /> }

export function StatCard({ label, value, icon: Icon, tone, hint, to }: { label: string; value: number | string; icon: LucideIcon; tone: 'blue' | 'orange' | 'green' | 'gray'; hint?: string; to?: string }) {
  const tones = {
    blue: 'bg-accent-soft text-accent', orange: 'bg-warn-soft text-warn-text',
    green: 'bg-brand-soft text-brand', gray: 'bg-gray-100 text-gray-600',
  }
  const inner = (
    <div className="flex items-center gap-3.5 rounded-2xl border border-line bg-white p-4 shadow-card transition-colors hover:border-gray-300">
      <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${tones[tone]}`}><Icon size={20} /></span>
      <div className="min-w-0">
        <div className="text-2xl font-bold leading-none">{value}</div>
        <div className="mt-1 truncate text-sm text-muted">{label}</div>
        {hint && <div className="mt-0.5 truncate text-xs text-muted/80">{hint}</div>}
      </div>
    </div>
  )
  return to ? <Link to={to} className="block">{inner}</Link> : inner
}

export function Avatar({ name, size = 36 }: { name: string; size?: number }) {
  const initials = name.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase()
  return (
    <span className="inline-flex shrink-0 items-center justify-center rounded-full bg-brand-soft font-semibold text-brand" style={{ width: size, height: size, fontSize: size * 0.38 }} aria-hidden="true">
      {initials}
    </span>
  )
}

export function DemoTag({ children = 'Demo data' }: { children?: ReactNode }) {
  return <span className="rounded-full border border-line bg-white px-2 py-0.5 text-[11px] font-medium text-muted">{children}</span>
}

export function ConfirmDialog({ open, title, message, confirmLabel = 'Confirm', danger, onConfirm, onCancel }: {
  open: boolean; title: string; message: string; confirmLabel?: string; danger?: boolean; onConfirm: () => void; onCancel: () => void
}) {
  const ref = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    if (!open) return
    ref.current?.focus()
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onCancel() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onCancel])
  if (!open) return null
  return (
    <div className="fixed inset-0 z-[1500] flex items-center justify-center bg-ink/40 p-4" onClick={onCancel}>
      <div role="alertdialog" aria-modal="true" aria-labelledby="dlg-title" className="card w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
        <h2 id="dlg-title" className="text-lg font-semibold">{title}</h2>
        <p className="mt-2 text-sm text-muted">{message}</p>
        <div className="mt-6 flex justify-end gap-2">
          <button className="btn-secondary" onClick={onCancel}>Cancel</button>
          <button ref={ref} className={danger ? 'btn-danger' : 'btn-primary'} onClick={onConfirm}>{confirmLabel}</button>
        </div>
      </div>
    </div>
  )
}

export function PageHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
      <div>
        <h1 className="text-2xl font-bold">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-muted">{subtitle}</p>}
      </div>
      {action}
    </div>
  )
}
