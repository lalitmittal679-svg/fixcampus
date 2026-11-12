import { useMemo } from 'react'
import type { Issue, User } from '../types'
import { notifActions, useIssues, useReadNotifs } from '../services/issueStore'

export interface AppNotification {
  id: string; issueId: string; issueTitle: string; title: string; description: string; at: string; read: boolean
}

/** Student notifications: admin-side timeline events on issues they reported or follow. Admin: new reports. */
export function useNotifications(user: User) {
  const issues = useIssues()
  const read = useReadNotifs()
  const list = useMemo<AppNotification[]>(() => {
    const out: AppNotification[] = []
    const push = (i: Issue, t: { id: string; title: string; description: string; at: string }) =>
      out.push({ id: `${user.id}:${t.id}`, issueId: i.id, issueTitle: i.title, title: t.title, description: t.description, at: t.at, read: read.includes(`${user.id}:${t.id}`) })
    if (user.role === 'admin') {
      issues.filter((i) => !i.isDemo).forEach((i) => push(i, { ...i.timeline[0], title: 'New report received' }))
    } else {
      issues
        .filter((i) => i.reportedBy.id === user.id || i.followedBy.includes(user.id))
        .forEach((i) => i.timeline.slice(1).forEach((t) => push(i, t)))
    }
    return out.sort((a, b) => +new Date(b.at) - +new Date(a.at)).slice(0, 30)
  }, [issues, read, user])
  return {
    notifications: list,
    unread: list.filter((n) => !n.read).length,
    markAllRead: () => notifActions.markRead(list.map((n) => n.id)),
    markRead: (id: string) => notifActions.markRead([id]),
  }
}
