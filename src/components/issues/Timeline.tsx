import type { Issue } from '../../types'
import { fmtDateTime } from '../../utils/format'
import { CheckCircle2, Circle, CircleDot } from 'lucide-react'

/** Only milestones that have actually happened are shown. */
export function Timeline({ issue }: { issue: Issue }) {
  const entries = [...issue.timeline].sort((a, b) => +new Date(a.at) - +new Date(b.at))
  return (
    <ol className="relative space-y-5">
      {entries.map((e, idx) => {
        const last = idx === entries.length - 1
        const done = e.status === 'Resolved'
        const Icon = done ? CheckCircle2 : last ? CircleDot : Circle
        return (
          <li key={e.id} className="relative flex gap-3.5">
            {!last && <span className="absolute left-[11px] top-6 h-[calc(100%+4px)] w-px bg-line" aria-hidden="true" />}
            <Icon size={22} className={`relative z-10 mt-0.5 shrink-0 bg-white ${done ? 'text-brand' : last ? 'text-warn' : 'text-brand/70'}`} />
            <div className="min-w-0">
              <div className="text-sm font-semibold">{e.title}</div>
              <div className="text-xs text-muted">{fmtDateTime(e.at)} · {e.by}</div>
              <p className="mt-1 text-sm text-ink/80">{e.description}</p>
            </div>
          </li>
        )
      })}
    </ol>
  )
}
