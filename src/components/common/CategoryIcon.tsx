import { Wifi, Bath, Presentation, Droplets, Lightbulb, Sparkles, Building2, CircleHelp, type LucideIcon } from 'lucide-react'
import type { Category } from '../../types'

export const CATEGORY_ICON: Record<Category, LucideIcon> = {
  wifi: Wifi, washrooms: Bath, classroom: Presentation, water: Droplets,
  lighting: Lightbulb, cleanliness: Sparkles, infrastructure: Building2, other: CircleHelp,
}

const TINT: Record<Category, string> = {
  wifi: 'bg-accent-soft text-accent',
  washrooms: 'bg-brand-soft text-brand',
  classroom: 'bg-warn-soft text-warn-text',
  water: 'bg-accent-soft text-accent',
  lighting: 'bg-warn-soft text-warn-text',
  cleanliness: 'bg-brand-soft text-brand',
  infrastructure: 'bg-gray-100 text-gray-600',
  other: 'bg-gray-100 text-gray-600',
}

export function CategoryIcon({ category, size = 18, boxed = true }: { category: Category; size?: number; boxed?: boolean }) {
  const Icon = CATEGORY_ICON[category]
  if (!boxed) return <Icon size={size} />
  return (
    <span className={`inline-flex shrink-0 items-center justify-center rounded-xl ${TINT[category]}`} style={{ width: size * 2.1, height: size * 2.1 }}>
      <Icon size={size} />
    </span>
  )
}

/** Thumbnail: the uploaded photo if there is one, otherwise a category tile (demo issues have no photos). */
export function IssueThumb({ category, image, className = 'h-14 w-14' }: { category: Category; image?: string; className?: string }) {
  if (image) return <img src={image} alt="" className={`${className} shrink-0 rounded-xl object-cover`} />
  const Icon = CATEGORY_ICON[category]
  return (
    <span className={`${className} flex shrink-0 items-center justify-center rounded-xl ${TINT[category]}`}>
      <Icon size={22} />
    </span>
  )
}
