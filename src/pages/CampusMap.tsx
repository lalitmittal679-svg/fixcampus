import { useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useIssues } from '../services/issueStore'
import { CategoryChips, IssueMap, MapLegend, matchesChip } from '../components/maps/IssueMap'
import { PageHeader, DemoTag } from '../components/common/Common'
import { STATUSES } from '../data/constants'
import type { Category, Status } from '../types'

export default function CampusMap() {
  const issues = useIssues()
  const admin = useLocation().pathname.startsWith('/admin')
  const [cat, setCat] = useState<'all' | Category>('all')
  const [status, setStatus] = useState<'all' | Status>('all')
  const shown = useMemo(() => issues.filter((i) => matchesChip(i, cat) && (status === 'all' || i.status === status)), [issues, cat, status])
  return (
    <div>
      <PageHeader title="Campus Map" subtitle="See where issues have been reported across campus." action={<DemoTag>Demo positions · placeholder layout</DemoTag>} />
      <div className="card space-y-3 p-5">
        <CategoryChips value={cat} onChange={setCat} />
        <div className="flex flex-wrap items-center gap-3">
          <label className="text-sm font-semibold" htmlFor="map-status">Status</label>
          <select id="map-status" className="input w-auto py-1.5" value={status} onChange={(e) => setStatus(e.target.value as 'all' | Status)}>
            <option value="all">All statuses</option>
            {STATUSES.map((s) => <option key={s}>{s}</option>)}
          </select>
          <span className="text-sm text-muted">{shown.length} issues shown</span>
        </div>
        <IssueMap issues={shown} height="min(65vh, 560px)" admin={admin} />
        <MapLegend />
        <p className="text-xs text-muted">Marker positions are illustrative demo coordinates on a placeholder campus layout. They do not mark verified real-world incidents.</p>
      </div>
    </div>
  )
}
