import { Link } from 'react-router-dom'

export function LogoMark({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
      <rect width="32" height="32" rx="8" fill="#174C40" />
      <path d="M9 21c0-6 4-10 14-10 0 8-4 12-10 12-1.5 0-2.7-.4-4-1.2z" fill="#E4F0EA" />
      <path d="M9 23c3-4 6-6 10-8" stroke="#174C40" strokeWidth="1.6" fill="none" strokeLinecap="round" />
    </svg>
  )
}

export function Logo({ to = '/', className = '' }: { to?: string; className?: string }) {
  return (
    <Link to={to} className={`flex items-center gap-2 ${className}`} aria-label="FixMyCampus home">
      <LogoMark />
      <span className="text-[17px] font-bold tracking-tight text-ink">FixMyCampus</span>
    </Link>
  )
}
