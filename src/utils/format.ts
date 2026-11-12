import { format, formatDistanceToNow, parseISO } from 'date-fns'

export const timeAgo = (iso: string) => {
  const s = formatDistanceToNow(parseISO(iso), { addSuffix: true })
  return s.replace('about ', '').replace('less than a minute ago', 'just now')
}
export const fmtDate = (iso: string) => format(parseISO(iso), 'd MMM yyyy')
export const fmtDateTime = (iso: string) => format(parseISO(iso), 'd MMM yyyy, h:mm a')
