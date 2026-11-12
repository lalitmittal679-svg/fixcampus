import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { MapContainer, Marker, Popup, TileLayer, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import { Maximize2, Info } from 'lucide-react'
import type { Category, Issue } from '../../types'
import { CAMPUS_CENTER, CATEGORIES, STATUS_STYLES, categoryLabel } from '../../data/constants'
import { StatusBadge } from '../common/Badges'

const iconCache = new Map<string, L.DivIcon>()
function pin(color: string, big = false) {
  const key = color + big
  if (!iconCache.has(key)) {
    const s = big ? 34 : 28
    iconCache.set(key, L.divIcon({
      className: 'fmc-pin',
      html: `<svg width="${s}" height="${s * 1.25}" viewBox="0 0 28 35" xmlns="http://www.w3.org/2000/svg"><path d="M14 1C7 1 1.5 6.300 1.500 13c0 9 12.500 21 12.500 21s12.500-12 12.500-21C26.500 6.300 21 1 14 1z" fill="${color}" stroke="#fff" stroke-width="2"/><circle cx="14" cy="13" r="4.500" fill="#fff"/></svg>`,
      iconSize: [s, s * 1.25], iconAnchor: [s / 2, s * 1.25], popupAnchor: [0, -s * 1.1],
    }))
  }
  return iconCache.get(key)!
}

const ROUTE_PREFIX = (admin?: boolean) => (admin ? '/admin/issues/' : '/app/issues/')

export function IssueMap({ issues, height = 380, admin }: { issues: Issue[]; height?: number | string; admin?: boolean }) {
  return (
    <MapContainer center={CAMPUS_CENTER} zoom={17} scrollWheelZoom={false} style={{ height, width: '100%' }} className="border border-line">
      <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" maxZoom={19} />
      {issues.map((i) => (
        <Marker key={i.id} position={[i.lat, i.lng]} icon={pin(STATUS_STYLES[i.status].hex)}>
          <Popup>
            <div className="min-w-[180px] font-sans">
              <div className="text-sm font-semibold leading-snug text-ink">{i.title}</div>
              <div className="mt-1 text-xs text-muted">{i.location}</div>
              <div className="mt-0.5 text-xs text-muted">{categoryLabel(i.category)}</div>
              <div className="mt-2 flex items-center justify-between gap-2">
                <StatusBadge status={i.status} />
                <Link to={`${ROUTE_PREFIX(admin)}${i.id}`} className="text-xs font-semibold text-accent hover:underline">View</Link>
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}

export function MapLegend() {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted">
      {(Object.keys(STATUS_STYLES) as (keyof typeof STATUS_STYLES)[]).map((s) => (
        <span key={s} className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full" style={{ background: STATUS_STYLES[s].hex }} />{s}</span>
      ))}
    </div>
  )
}

const FILTERS: { id: 'all' | Category; label: string }[] = [
  { id: 'all', label: 'All' }, { id: 'wifi', label: 'Wi-Fi' }, { id: 'washrooms', label: 'Washrooms' },
  { id: 'classroom', label: 'Classrooms' }, { id: 'water', label: 'Water' }, { id: 'lighting', label: 'Lighting' },
  { id: 'cleanliness', label: 'Cleanliness' }, { id: 'infrastructure', label: 'Others' },
]

export function CategoryChips({ value, onChange }: { value: 'all' | Category; onChange: (v: 'all' | Category) => void }) {
  return (
    <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1" role="tablist" aria-label="Filter by category">
      {FILTERS.map((f) => (
        <button key={f.id} role="tab" aria-selected={value === f.id} onClick={() => onChange(f.id)}
          className={`whitespace-nowrap rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors ${value === f.id ? 'border-brand bg-brand text-white' : 'border-line bg-white text-ink/80 hover:bg-bg'}`}>
          {f.label}
        </button>
      ))}
    </div>
  )
}

export const matchesChip = (i: Issue, f: 'all' | Category) =>
  f === 'all' || i.category === f || (f === 'infrastructure' && (i.category === 'infrastructure' || i.category === 'other'))

export function CampusMapPanel({ issues, fullHref, height = 380, admin }: { issues: Issue[]; fullHref?: string; height?: number; admin?: boolean }) {
  const [filter, setFilter] = useState<'all' | Category>('all')
  const shown = useMemo(() => issues.filter((i) => matchesChip(i, filter)), [issues, filter])
  return (
    <section className="card p-5" aria-label="Campus map">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold">Campus Map</h2>
        {fullHref && <Link to={fullHref} className="btn-secondary px-3 py-1.5 text-xs"><Maximize2 size={14} />Open full map</Link>}
      </div>
      <CategoryChips value={filter} onChange={setFilter} />
      <div className="mt-3"><IssueMap issues={shown} height={height} admin={admin} /></div>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
        <MapLegend />
        <span className="inline-flex items-center gap-1.5 text-xs text-muted"><Info size={13} />{shown.length} issues shown · demo positions on a placeholder campus layout</span>
      </div>
    </section>
  )
}

function ClickToPlace({ onPick }: { onPick: (lat: number, lng: number) => void }) {
  useMapEvents({ click: (e) => onPick(e.latlng.lat, e.latlng.lng) })
  return null
}

export function LocationPicker({ lat, lng, onPick, height = 260 }: { lat: number; lng: number; onPick?: (lat: number, lng: number) => void; height?: number }) {
  return (
    <MapContainer key={`${lat.toFixed(5)}-${lng.toFixed(5)}`} center={[lat, lng]} zoom={18} scrollWheelZoom={false} style={{ height, width: '100%' }} className="border border-line">
      <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" maxZoom={19} />
      <Marker position={[lat, lng]} icon={pin('#D66A62', true)} />
      {onPick && <ClickToPlace onPick={onPick} />}
    </MapContainer>
  )
}

export { CATEGORIES }
