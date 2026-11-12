import type { Category, Issue, Status, TimelineEntry, Urgency, User } from '../types'
import { CAMPUS_LOCATIONS, CURRENT_STUDENT_ID, DEFAULT_DEPARTMENT } from './constants'

export const DEMO_USERS: User[] = [
  { id: CURRENT_STUDENT_ID, name: 'Aadi Pujani', course: 'Second Year, CSE', role: 'student', email: 'aadi.demo@fixmycampus.app' },
  { id: 'u-admin', name: 'Campus Admin', course: 'Facilities Office', role: 'admin', email: 'admin.demo@fixmycampus.app' },
]

const REPORTERS = [
  { id: CURRENT_STUDENT_ID, name: 'Aadi Pujani', course: 'Second Year, CSE' },
  { id: 'u-r1', name: 'Riya Sharma', course: 'Third Year, ECE' },
  { id: 'u-r2', name: 'Karan Mehta', course: 'First Year, ME' },
  { id: 'u-r3', name: 'Simran Kaur', course: 'Final Year, BT' },
  { id: 'u-r4', name: 'Vikram Rao', course: 'Second Year, CE' },
  { id: 'u-r5', name: 'Ananya Gupta', course: 'Third Year, CSE' },
]

type Row = [
  title: string, description: string, category: Category, urgency: Urgency,
  locId: string, status: Status, daysAgo: number, upvotes: number, reporter: number, details: string,
]

const ROWS: Row[] = [
  ['Wi-Fi not working in Academic Block A', 'The Wi-Fi has not been working on the 2nd and 3rd floors for the past 3 days. Multiple students are facing the same issue and cannot access online lab portals.', 'wifi', 'Medium', 'ab-a', 'In Progress', 6, 24, 0, '2nd and 3rd floor corridors'],
  ['Projector not turning on in Lecture Hall 3', 'The ceiling projector does not power on and the remote has no response. Two lectures this week had to be taken without slides.', 'classroom', 'High', 'lh-3', 'Open', 2, 18, 1, 'Front of the hall, ceiling mount'],
  ['Water cooler not working near Library', 'The water cooler on the ground floor has been dry since Monday. Students are carrying bottles from the hostel.', 'water', 'Medium', 'lib', 'Resolved', 21, 32, 2, 'Ground floor, near reading room entrance'],
  ['Tube lights flickering in Hostel B corridor', 'Several tube lights in the first floor corridor flicker constantly and two are completely off. It is quite dark after 8 PM.', 'lighting', 'Low', 'h-b', 'Open', 9, 7, 3, 'First floor corridor'],
  ['Unclean washroom on 2nd floor', 'The washroom has not been cleaned for several days and the water supply is irregular. A strong odour reaches the corridor.', 'washrooms', 'High', 'ab-c', 'In Progress', 8, 15, 1, 'Second floor, near staircase'],
  ['Wi-Fi slow in the Library reading hall', 'Speeds drop to almost nothing between 4 and 7 PM, which makes research and online submissions difficult.', 'wifi', 'Low', 'lib', 'Under Review', 4, 12, 4, 'Main reading hall'],
  ['Broken benches outside Canteen', 'Three benches in the seating area have broken slats and one has a sharp metal edge exposed.', 'infrastructure', 'Medium', 'can', 'Open', 5, 9, 5, 'Outdoor seating area'],
  ['Overflowing dustbins near Sports Complex', 'Dustbins near the entrance have not been emptied in days and waste is spreading on the pavement.', 'cleanliness', 'Medium', 'spc', 'In Progress', 7, 11, 2, 'Main entrance walkway'],
  ['Fan not working in Lecture Hall 1', 'Four ceiling fans in the back half of the hall have stopped working. The room is very hot during afternoon classes.', 'classroom', 'Medium', 'lh-1', 'Under Review', 3, 14, 3, 'Back rows'],
  ['Street light out on Main Gate road', 'The street light just inside the main gate has been off for a week, leaving the stretch dark at night.', 'lighting', 'High', 'oth', 'Resolved', 18, 21, 4, 'Left side of the gate road'],
  ['Hot water unavailable in Girls Hostel', 'Geyser on the third floor is not heating and the common bathroom has no hot water in the mornings.', 'infrastructure', 'High', 'h-g', 'In Progress', 5, 27, 5, 'Third floor common bathroom'],
  ['Water leakage from ceiling in Academic Block B', 'Water drips from the ceiling in the east corridor whenever it rains and the floor becomes slippery.', 'infrastructure', 'High', 'ab-b', 'Open', 1, 16, 0, 'East corridor, ground floor'],
  ['Water cooler filter overdue in Hostel A', 'The water tastes odd and the filter indicator has been red for weeks.', 'water', 'Medium', 'h-a', 'Under Review', 6, 10, 1, 'Ground floor common area'],
  ['Power sockets not working in Library', 'Most sockets along the window-side tables are dead, which is a problem for laptop users during exam season.', 'lighting', 'Medium', 'lib', 'In Progress', 10, 19, 0, 'Window-side tables, first floor'],
  ['Whiteboard markers and duster missing in LH1', 'The hall has been without markers or a duster for two weeks. Faculty are borrowing from other rooms.', 'classroom', 'Low', 'lh-1', 'Resolved', 15, 5, 2, 'Front desk'],
  ['Canteen floor slippery near the counter', 'The floor near the serving counter stays wet and is not mopped regularly. A couple of near falls this week.', 'cleanliness', 'Medium', 'can', 'Open', 2, 13, 4, 'Serving counter area'],
  ['Wi-Fi dropping in Hostel Block A', 'The network disconnects every few minutes on the 2nd floor, which makes online classes impossible.', 'wifi', 'Medium', 'h-a', 'Resolved', 24, 29, 5, 'Second floor rooms 201-215'],
  ['Damaged chairs in Lecture Hall 3', 'About six chairs have broken armrests or loose seats. Students end up crowding the remaining ones.', 'classroom', 'Low', 'lh-3', 'Open', 11, 6, 3, 'Rows 4 to 6'],
  ['Washroom tap leaking in Hostel B', 'The tap in the ground floor washroom has been leaking constantly and wasting water.', 'washrooms', 'Low', 'h-b', 'Resolved', 19, 8, 2, 'Ground floor washroom, basin 2'],
  ['Floodlights not working at the sports ground', 'Two of the four floodlights are dead, making evening practice unsafe.', 'lighting', 'High', 'spc', 'Under Review', 3, 22, 4, 'North side of the ground'],
  ['Stagnant water near Academic Block C', 'Rainwater has collected behind the block and has started to attract mosquitoes.', 'cleanliness', 'High', 'ab-c', 'Open', 4, 17, 5, 'Rear parking area'],
  ['Projector remote missing in Academic Block A', 'Seminar room projector works but the remote and HDMI adapter are missing.', 'classroom', 'Low', 'ab-a', 'In Progress', 12, 4, 0, 'Seminar room 105'],
  ['Cracked pavement near the Library', 'A section of the pavement has cracked and lifted, causing trips for people with bags.', 'infrastructure', 'Medium', 'lib', 'Under Review', 7, 8, 1, 'Footpath to main entrance'],
  ['Washroom soap dispensers empty in Block B', 'Soap dispensers on all floors have been empty for over a week.', 'washrooms', 'Low', 'ab-b', 'Resolved', 14, 6, 3, 'All floors'],
]

const hoursBefore = (now: number, h: number) => new Date(now - h * 3600_000).toISOString()

function buildTimeline(now: number, daysAgo: number, status: Status, dept: string, id: string): { tl: TimelineEntry[]; updatedAt: string; notes: string } {
  const tl: TimelineEntry[] = []
  const start = daysAgo * 24
  let n = 0
  const add = (h: number, e: Omit<TimelineEntry, 'id' | 'at'>) => tl.push({ ...e, id: `${id}-t${n++}`, at: hoursBefore(now, h) })
  add(start, { kind: 'status', status: 'Open', title: 'Issue Reported', description: 'Report submitted and logged for review.', by: 'System' })
  let notes = ''
  if (status !== 'Open') add(Math.max(start - 3, 1), { kind: 'status', status: 'Under Review', title: 'Under Review', description: 'Our team is reviewing the issue.', by: 'Campus Admin' })
  if (status === 'In Progress' || status === 'Resolved') add(Math.max(start * 0.6, 2), { kind: 'status', status: 'In Progress', title: 'In Progress', description: `Assigned to the ${dept} department.`, by: 'Campus Admin' })
  if (status === 'Resolved') {
    notes = 'Work completed and checked by the department. Please report again if the problem returns.'
    add(Math.max(start * 0.35, 1.5), { kind: 'update', title: 'Resolution Update', description: 'Repair work carried out on site.', by: 'Campus Admin' })
    add(Math.max(start * 0.2, 1), { kind: 'status', status: 'Resolved', title: 'Resolved', description: notes, by: 'Campus Admin' })
  }
  return { tl, updatedAt: tl[tl.length - 1].at, notes }
}

export function buildSeedIssues(now = Date.now()): Issue[] {
  return ROWS.map((r, i) => {
    const [title, description, category, urgency, locId, status, daysAgo, upvotes, rep, details] = r
    const loc = CAMPUS_LOCATIONS.find((l) => l.id === locId)!
    const id = `FMC-${String(1001 + i)}`
    const dept = status === 'Open' ? null : DEFAULT_DEPARTMENT[category]
    const { tl, updatedAt, notes } = buildTimeline(now, daysAgo, status, dept ?? '', id)
    const voters = Array.from({ length: Math.max(upvotes - 1, 0) }, (_, k) => `demo-voter-${id}-${k}`)
    return {
      id, title, description, category, urgency,
      locationType: loc.type, location: loc.name, locationDetails: details,
      lat: loc.lat + ((i % 5) - 2) * 0.00012, lng: loc.lng + ((i % 3) - 1) * 0.00014,
      images: [], reportedBy: REPORTERS[rep], reportedAt: tl[0].at, updatedAt,
      status, assignedDepartment: dept, upvotes, upvotedBy: voters,
      bookmarkedBy: [], followedBy: [], timeline: tl, resolutionNotes: notes, isDemo: true,
    }
  })
}
