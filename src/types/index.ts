export type Category =
  | 'wifi' | 'washrooms' | 'classroom' | 'water'
  | 'lighting' | 'cleanliness' | 'infrastructure' | 'other'

export type Status = 'Open' | 'Under Review' | 'In Progress' | 'Resolved'
export type Urgency = 'Low' | 'Medium' | 'High'
export type Role = 'student' | 'admin'

export type LocationType =
  | 'Academic Block' | 'Lecture Hall' | 'Library' | 'Hostel'
  | 'Canteen' | 'Sports Complex' | 'Other'

export interface CampusLocation {
  id: string
  name: string
  type: LocationType
  lat: number
  lng: number
}

export interface User {
  id: string
  name: string
  course: string
  role: Role
  email: string
}

export interface TimelineEntry {
  id: string
  kind: 'status' | 'update'
  status?: Status
  title: string
  description: string
  at: string
  by: string
}

export interface Issue {
  id: string
  title: string
  description: string
  category: Category
  urgency: Urgency
  locationType: LocationType
  location: string
  locationDetails: string
  lat: number
  lng: number
  images: string[]
  reportedBy: { id: string; name: string; course: string }
  reportedAt: string
  updatedAt: string
  status: Status
  assignedDepartment: string | null
  upvotes: number
  upvotedBy: string[]
  bookmarkedBy: string[]
  followedBy: string[]
  timeline: TimelineEntry[]
  resolutionNotes: string
  isDemo: boolean
}

export interface AppSettings {
  autoAssign: boolean
  campusName: string
}
