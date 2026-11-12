import type { Status, Urgency } from '../../types'
import { STATUS_STYLES, URGENCY_STYLES } from '../../data/constants'

export const StatusBadge = ({ status }: { status: Status }) => (
  <span className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_STYLES[status].badge}`}>
    <span className={`h-1.5 w-1.5 rounded-full ${STATUS_STYLES[status].dot}`} />
    {status}
  </span>
)

export const UrgencyBadge = ({ urgency }: { urgency: Urgency }) => (
  <span className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ${URGENCY_STYLES[urgency]}`}>{urgency}</span>
)
