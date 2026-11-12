import type { Category, CampusLocation, LocationType, Status, Urgency } from '../types'

export const CATEGORIES: { id: Category; label: string; short: string; filterLabel: string }[] = [
  { id: 'wifi', label: 'Wi-Fi / Network', short: 'Wi-Fi', filterLabel: 'Wi-Fi' },
  { id: 'washrooms', label: 'Washrooms', short: 'Washrooms', filterLabel: 'Washrooms' },
  { id: 'classroom', label: 'Classroom Facilities', short: 'Classroom', filterLabel: 'Classrooms' },
  { id: 'water', label: 'Water Coolers', short: 'Water', filterLabel: 'Water' },
  { id: 'lighting', label: 'Lighting', short: 'Lighting', filterLabel: 'Lighting' },
  { id: 'cleanliness', label: 'Cleanliness', short: 'Cleanliness', filterLabel: 'Cleanliness' },
  { id: 'infrastructure', label: 'Infrastructure', short: 'Infrastructure', filterLabel: 'Other' },
  { id: 'other', label: 'Other', short: 'Other', filterLabel: 'Other' },
]

export const categoryLabel = (c: Category) => CATEGORIES.find((x) => x.id === c)?.label ?? c
export const categoryShort = (c: Category) => CATEGORIES.find((x) => x.id === c)?.short ?? c

export const STATUSES: Status[] = ['Open', 'Under Review', 'In Progress', 'Resolved']
export const URGENCIES: Urgency[] = ['Low', 'Medium', 'High']
export const URGENCY_RANK: Record<Urgency, number> = { Low: 1, Medium: 2, High: 3 }

export const DEPARTMENTS = [
  'IT Services',
  'Housekeeping',
  'Electrical Maintenance',
  'Plumbing & Water',
  'Civil & Maintenance',
  'Hostel Administration',
  'Academic Facilities',
]

export const DEFAULT_DEPARTMENT: Record<Category, string> = {
  wifi: 'IT Services',
  washrooms: 'Housekeeping',
  classroom: 'Academic Facilities',
  water: 'Plumbing & Water',
  lighting: 'Electrical Maintenance',
  cleanliness: 'Housekeeping',
  infrastructure: 'Civil & Maintenance',
  other: 'Civil & Maintenance',
}

export const LOCATION_TYPES: LocationType[] = [
  'Academic Block', 'Lecture Hall', 'Library', 'Hostel', 'Canteen', 'Sports Complex', 'Other',
]

// DEMO coordinates: an illustrative layout around a placeholder campus centre.
// These are NOT surveyed positions of real buildings.
export const CAMPUS_CENTER: [number, number] = [30.3556, 76.3661]

export const CAMPUS_LOCATIONS: CampusLocation[] = [
  { id: 'ab-a', name: 'Academic Block A', type: 'Academic Block', lat: 30.3566, lng: 76.3645 },
  { id: 'ab-b', name: 'Academic Block B', type: 'Academic Block', lat: 30.3571, lng: 76.3668 },
  { id: 'ab-c', name: 'Academic Block C', type: 'Academic Block', lat: 30.3559, lng: 76.3684 },
  { id: 'lh-1', name: 'Lecture Hall 1', type: 'Lecture Hall', lat: 30.3548, lng: 76.3652 },
  { id: 'lh-3', name: 'Lecture Hall 3', type: 'Lecture Hall', lat: 30.3550, lng: 76.3664 },
  { id: 'lib', name: 'Library Block', type: 'Library', lat: 30.3560, lng: 76.3659 },
  { id: 'h-a', name: 'Hostel Block A', type: 'Hostel', lat: 30.3535, lng: 76.3630 },
  { id: 'h-b', name: 'Hostel Block B', type: 'Hostel', lat: 30.3530, lng: 76.3650 },
  { id: 'h-g', name: 'Girls Hostel', type: 'Hostel', lat: 30.3585, lng: 76.3630 },
  { id: 'can', name: 'Central Canteen', type: 'Canteen', lat: 30.3545, lng: 76.3676 },
  { id: 'spc', name: 'Sports Complex', type: 'Sports Complex', lat: 30.3524, lng: 76.3688 },
  { id: 'oth', name: 'Main Gate', type: 'Other', lat: 30.3590, lng: 76.3665 },
]

export const STATUS_STYLES: Record<Status, { badge: string; dot: string; hex: string }> = {
  Open: { badge: 'bg-accent-soft text-accent', dot: 'bg-accent', hex: '#416FAD' },
  'Under Review': { badge: 'bg-gray-100 text-gray-600', dot: 'bg-gray-400', hex: '#7C8490' },
  'In Progress': { badge: 'bg-warn-soft text-warn-text', dot: 'bg-warn', hex: '#E9A66B' },
  Resolved: { badge: 'bg-brand-soft text-brand', dot: 'bg-brand', hex: '#174C40' },
}

export const URGENCY_STYLES: Record<Urgency, string> = {
  Low: 'bg-brand-soft text-brand',
  Medium: 'bg-warn-soft text-warn-text',
  High: 'bg-danger-soft text-danger',
}

export const CURRENT_STUDENT_ID = 'u-student'
