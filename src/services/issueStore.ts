import { useSyncExternalStore } from 'react'
import type { AppSettings, Issue, Status, TimelineEntry, Urgency, Category, LocationType } from '../types'
import { buildSeedIssues } from '../data/seed'
import { DEFAULT_DEPARTMENT } from '../data/constants'

const KEY_ISSUES = 'fmc.issues.v1'
const KEY_SETTINGS = 'fmc.settings.v1'
const KEY_READ = 'fmc.notifRead.v1'

const defaultSettings: AppSettings = { autoAssign: true, campusName: 'Demo University Campus' }

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}
function write(key: string, value: unknown) {
  try { localStorage.setItem(key, JSON.stringify(value)) } catch { /* storage full or blocked */ }
}

let issues: Issue[] = (() => {
  const stored = read<Issue[] | null>(KEY_ISSUES, null)
  if (stored && Array.isArray(stored)) return stored
  const seeded = buildSeedIssues()
  write(KEY_ISSUES, seeded)
  return seeded
})()
let settings: AppSettings = { ...defaultSettings, ...read<Partial<AppSettings>>(KEY_SETTINGS, {}) }
let readNotifs: string[] = read<string[]>(KEY_READ, [])

const listeners = new Set<() => void>()
const emit = () => listeners.forEach((l) => l())
const subscribe = (l: () => void) => { listeners.add(l); return () => { listeners.delete(l) } }

function commitIssues(next: Issue[]) {
  issues = next
  write(KEY_ISSUES, issues)
  emit()
}
function patch(id: string, fn: (i: Issue) => Issue) {
  commitIssues(issues.map((i) => (i.id === id ? fn(i) : i)))
}

// Keep tabs in sync (e.g. student in one tab, admin in another)
window.addEventListener('storage', (e) => {
  if (e.key === KEY_ISSUES && e.newValue) { issues = JSON.parse(e.newValue); emit() }
  if (e.key === KEY_SETTINGS && e.newValue) { settings = JSON.parse(e.newValue); emit() }
})

const uid = () => Math.random().toString(36).slice(2, 9)

export interface NewIssueInput {
  title: string; description: string; category: Category; urgency: Urgency
  locationType: LocationType; location: string; locationDetails: string
  lat: number; lng: number; images: string[]
  reporter: { id: string; name: string; course: string }
}

export const issueActions = {
  create(input: NewIssueInput): Issue {
    const nums = issues.map((i) => parseInt(i.id.replace('FMC-', ''), 10)).filter((n) => !isNaN(n))
    const id = `FMC-${(nums.length ? Math.max(...nums) : 1000) + 1}`
    const now = new Date().toISOString()
    const issue: Issue = {
      id, title: input.title.trim(), description: input.description.trim(),
      category: input.category, urgency: input.urgency,
      locationType: input.locationType, location: input.location,
      locationDetails: input.locationDetails.trim(), lat: input.lat, lng: input.lng,
      images: input.images, reportedBy: input.reporter, reportedAt: now, updatedAt: now,
      status: 'Open', assignedDepartment: null, upvotes: 0, upvotedBy: [], bookmarkedBy: [],
      followedBy: [input.reporter.id],
      timeline: [{ id: `${id}-t0`, kind: 'status', status: 'Open', title: 'Issue Reported', description: 'Report submitted and logged for review.', at: now, by: input.reporter.name }],
      resolutionNotes: '', isDemo: false,
    }
    commitIssues([issue, ...issues])
    return issue
  },

  setStatus(id: string, status: Status, by: string, note?: string) {
    patch(id, (i) => {
      if (i.status === status) return i
      const now = new Date().toISOString()
      let dept = i.assignedDepartment
      if (settings.autoAssign && !dept && status !== 'Open') dept = DEFAULT_DEPARTMENT[i.category]
      const description =
        note?.trim() ||
        (status === 'In Progress' && dept ? `Assigned to the ${dept} department.`
          : status === 'Resolved' ? 'The issue has been marked as resolved.'
          : status === 'Under Review' ? 'Our team is reviewing the issue.'
          : 'Status changed to Open.')
      const entry: TimelineEntry = { id: `${id}-t${uid()}`, kind: 'status', status, title: status === 'Open' ? 'Reopened' : status, description, at: now, by }
      return {
        ...i, status, assignedDepartment: dept, updatedAt: now, timeline: [...i.timeline, entry],
        resolutionNotes: status === 'Resolved' && note?.trim() ? note.trim() : i.resolutionNotes,
      }
    })
  },

  assignDepartment(id: string, department: string, by: string) {
    patch(id, (i) => {
      if (i.assignedDepartment === department) return i
      const now = new Date().toISOString()
      const entry: TimelineEntry = { id: `${id}-t${uid()}`, kind: 'update', title: 'Department Assigned', description: `Assigned to ${department}.`, at: now, by }
      return { ...i, assignedDepartment: department, updatedAt: now, timeline: [...i.timeline, entry] }
    })
  },

  addUpdate(id: string, text: string, by: string) {
    patch(id, (i) => {
      const now = new Date().toISOString()
      const entry: TimelineEntry = { id: `${id}-t${uid()}`, kind: 'update', title: 'Resolution Update', description: text.trim(), at: now, by }
      return { ...i, updatedAt: now, timeline: [...i.timeline, entry] }
    })
  },

  setResolutionNotes(id: string, notes: string) {
    patch(id, (i) => ({ ...i, resolutionNotes: notes }))
  },

  /** Returns false if the user had already upvoted (no double votes). */
  upvote(id: string, userId: string): boolean {
    const target = issues.find((i) => i.id === id)
    if (!target || target.upvotedBy.includes(userId)) return false
    patch(id, (i) => ({ ...i, upvotedBy: [...i.upvotedBy, userId], upvotes: i.upvotes + 1 }))
    return true
  },

  toggleBookmark(id: string, userId: string): boolean {
    let on = false
    patch(id, (i) => {
      on = !i.bookmarkedBy.includes(userId)
      return { ...i, bookmarkedBy: on ? [...i.bookmarkedBy, userId] : i.bookmarkedBy.filter((u) => u !== userId) }
    })
    return on
  },

  toggleFollow(id: string, userId: string): boolean {
    let on = false
    patch(id, (i) => {
      on = !i.followedBy.includes(userId)
      return { ...i, followedBy: on ? [...i.followedBy, userId] : i.followedBy.filter((u) => u !== userId) }
    })
    return on
  },

  resetDemo() { commitIssues(buildSeedIssues()); readNotifs = []; write(KEY_READ, readNotifs); emit() },
  clearAll() { commitIssues([]) },
}

export const settingsActions = {
  update(next: Partial<AppSettings>) { settings = { ...settings, ...next }; write(KEY_SETTINGS, settings); emit() },
}

export const notifActions = {
  markRead(ids: string[]) { readNotifs = Array.from(new Set([...readNotifs, ...ids])); write(KEY_READ, readNotifs); emit() },
}

export const useIssues = () => useSyncExternalStore(subscribe, () => issues)
export const useSettings = () => useSyncExternalStore(subscribe, () => settings)
export const useReadNotifs = () => useSyncExternalStore(subscribe, () => readNotifs)
