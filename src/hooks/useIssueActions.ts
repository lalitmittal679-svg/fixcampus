import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { issueActions } from '../services/issueStore'

export function useIssueActions() {
  const { user } = useAuth()
  const toast = useToast()
  return {
    upvote: (id: string) => {
      const ok = issueActions.upvote(id, user.id)
      toast(ok ? 'Upvote added' : 'You have already upvoted this issue', ok ? 'success' : 'error')
    },
    bookmark: (id: string) => {
      const on = issueActions.toggleBookmark(id, user.id)
      toast(on ? 'Issue bookmarked' : 'Bookmark removed')
    },
    follow: (id: string) => {
      const on = issueActions.toggleFollow(id, user.id)
      toast(on ? 'You are now following this issue' : 'You unfollowed this issue')
    },
  }
}
