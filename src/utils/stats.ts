import { format, parseISO, startOfDay, subDays } from 'date-fns'
import type { Issue, Status } from '../types'
import { CATEGORIES, DEPARTMENTS, STATUSES } from '../data/constants'

export const countByStatus = (issues: Issue[]) => {
  const out: Record<Status, number> = { Open: 0, 'Under Review': 0, 'In Progress': 0, Resolved: 0 }
  issues.forEach((i) => { out[i.status]++ })
  return out
}

export const summarize = (issues: Issue[]) => {
  const c = countByStatus(issues)
  return { total: issues.length, open: c.Open, review: c['Under Review'], progress: c['In Progress'], resolved: c.Resolved, upvotes: issues.reduce((s, i) => s + i.upvotes, 0) }
}

export const byCategory = (issues: Issue[]) =>
  CATEGORIES.filter((c) => c.id !== 'other').map((c) => ({
    id: c.id, name: c.label,
    value: issues.filter((i) => i.category === c.id || (c.id === 'infrastructure' && i.category === 'other')).length,
  })).filter((d) => d.value > 0)

export const byStatusData = (issues: Issue[]) => {
  const c = countByStatus(issues)
  return STATUSES.map((s) => ({ name: s, value: c[s] }))
}

export const byDepartment = (issues: Issue[]) => {
  const rows = DEPARTMENTS.map((d) => ({ name: d, value: issues.filter((i) => i.assignedDepartment === d).length }))
  const unassigned = issues.filter((i) => !i.assignedDepartment).length
  return [...rows, { name: 'Unassigned', value: unassigned }].filter((r) => r.value > 0)
}

/** Reported vs resolved per day over the last `days` days, derived from issue timelines. */
export const trend = (issues: Issue[], days = 30) => {
  const today = startOfDay(new Date())
  const rows = Array.from({ length: days }, (_, k) => {
    const d = subDays(today, days - 1 - k)
    return { key: format(d, 'yyyy-MM-dd'), label: format(d, 'd MMM'), reported: 0, resolved: 0 }
  })
  const idx = new Map(rows.map((r) => [r.key, r]))
  issues.forEach((i) => {
    const r = idx.get(format(parseISO(i.reportedAt), 'yyyy-MM-dd'))
    if (r) r.reported++
    i.timeline.filter((t) => t.status === 'Resolved').forEach((t) => {
      const rr = idx.get(format(parseISO(t.at), 'yyyy-MM-dd'))
      if (rr) rr.resolved++
    })
  })
  return rows
}
