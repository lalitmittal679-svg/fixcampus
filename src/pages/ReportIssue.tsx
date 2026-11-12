import { useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Check, CheckCircle2, ImagePlus, X, Leaf, AlertTriangle, Minus } from 'lucide-react'
import { CATEGORIES, CAMPUS_LOCATIONS, LOCATION_TYPES, URGENCIES } from '../data/constants'
import type { Category, Issue, LocationType, Urgency } from '../types'
import { CategoryIcon } from '../components/common/CategoryIcon'
import { LocationPicker } from '../components/maps/IssueMap'
import { Spinner } from '../components/common/Common'
import { issueActions } from '../services/issueStore'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { compressImage } from '../utils/image'

const STEPS = ['Details', 'Location', 'Media', 'Review']
const URGENCY_INFO: Record<Urgency, { hint: string; cls: string; icon: typeof Leaf }> = {
  Low: { hint: 'Minor inconvenience', cls: 'border-brand/40 bg-brand-soft/60', icon: Leaf },
  Medium: { hint: 'Affects multiple people', cls: 'border-warn bg-warn-soft', icon: Minus },
  High: { hint: 'Critical issue', cls: 'border-danger bg-danger-soft', icon: AlertTriangle },
}

interface Form {
  category: Category | null; title: string; description: string; urgency: Urgency
  locationType: LocationType | null; locationId: string; locationDetails: string; lat: number; lng: number
  images: string[]
}
const empty: Form = { category: null, title: '', description: '', urgency: 'Medium', locationType: null, locationId: '', locationDetails: '', lat: CAMPUS_LOCATIONS[0].lat, lng: CAMPUS_LOCATIONS[0].lng, images: [] }

export default function ReportIssue() {
  const [step, setStep] = useState(0)
  const [f, setF] = useState<Form>(empty)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const [created, setCreated] = useState<Issue | null>(null)
  const [uploadErr, setUploadErr] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)
  const { user } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()
  const set = <K extends keyof Form>(k: K, v: Form[K]) => setF((p) => ({ ...p, [k]: v }))

  const placeOptions = CAMPUS_LOCATIONS.filter((l) => l.type === f.locationType)
  const place = CAMPUS_LOCATIONS.find((l) => l.id === f.locationId)
  const locationName = f.locationType === 'Other' && !place ? f.locationDetails.trim() : place?.name ?? ''

  const validate = (s: number) => {
    const e: Record<string, string> = {}
    if (s === 0) {
      if (!f.category) e.category = 'Please choose a category.'
      if (f.title.trim().length < 5) e.title = 'Give the issue a short title (at least 5 characters).'
      if (f.description.trim().length < 20) e.description = 'Describe the problem in at least 20 characters.'
    }
    if (s === 1) {
      if (!f.locationType) e.locationType = 'Select where the issue is.'
      else if (!f.locationId) e.locationId = 'Choose the specific place.'
      else if (f.locationType === 'Other' && f.locationDetails.trim().length < 3) e.locationDetails = 'Describe the location for this "Other" place.'
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const next = () => { if (validate(step)) setStep((s) => s + 1) }
  const back = () => { setErrors({}); setStep((s) => s - 1) }

  const chooseType = (t: LocationType) => {
    const first = CAMPUS_LOCATIONS.find((l) => l.type === t)
    setF((p) => ({ ...p, locationType: t, locationId: first && t === 'Other' ? first.id : '', ...(first ? { lat: first.lat, lng: first.lng } : {}) }))
    setErrors({})
  }
  const choosePlace = (id: string) => {
    const l = CAMPUS_LOCATIONS.find((x) => x.id === id)
    setF((p) => ({ ...p, locationId: id, ...(l ? { lat: l.lat, lng: l.lng } : {}) }))
  }

  const onFiles = async (files: FileList | null) => {
    setUploadErr('')
    if (!files) return
    const room = 3 - f.images.length
    if (room <= 0) { setUploadErr('You can attach up to 3 photos.'); return }
    const picked = Array.from(files).slice(0, room)
    try {
      const out: string[] = []
      for (const file of picked) {
        if (!file.type.startsWith('image/')) { setUploadErr('Only image files are supported.'); continue }
        out.push(await compressImage(file))
      }
      if (out.length) setF((p) => ({ ...p, images: [...p.images, ...out] }))
    } catch (err) {
      setUploadErr(err instanceof Error ? err.message : 'Upload failed')
    }
    if (fileRef.current) fileRef.current.value = ''
  }

  const submit = async () => {
    if (!validate(0)) { setStep(0); return }
    if (!validate(1)) { setStep(1); return }
    setSubmitting(true)
    await new Promise((r) => setTimeout(r, 600))
    try {
      const issue = issueActions.create({
        title: f.title, description: f.description, category: f.category!, urgency: f.urgency,
        locationType: f.locationType!, location: locationName, locationDetails: f.locationDetails,
        lat: f.lat, lng: f.lng, images: f.images, reporter: { id: user.id, name: user.name, course: user.course },
      })
      setCreated(issue)
      toast('Report submitted')
    } catch {
      toast('Could not save the report. Browser storage may be full.', 'error')
    } finally { setSubmitting(false) }
  }

  if (created) {
    return (
      <div className="mx-auto max-w-lg py-10">
        <div className="card p-8 text-center">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-soft text-brand"><CheckCircle2 size={28} /></span>
          <h1 className="mt-5 text-2xl font-bold">Report submitted</h1>
          <p className="mt-2 text-sm text-muted">Thanks for helping improve the campus. Your issue is now Open and visible to administrators.</p>
          <div className="mx-auto mt-5 inline-block rounded-xl border border-line bg-bg px-5 py-3"><div className="text-xs text-muted">Issue ID</div><div className="text-lg font-bold tracking-wide">{created.id}</div></div>
          <div className="mt-7 flex flex-col justify-center gap-2 sm:flex-row">
            <button className="btn-primary" onClick={() => navigate(`/app/issues/${created.id}`)}>View my report</button>
            <button className="btn-secondary" onClick={() => { setCreated(null); setF(empty); setStep(0) }}>Report another</button>
          </div>
        </div>
      </div>
    )
  }

  const err = (k: string) => errors[k] && <p className="mt-1.5 text-xs font-medium text-danger" role="alert">{errors[k]}</p>

  return (
    <div className="mx-auto max-w-3xl">
      <Link to="/app" className="mb-3 inline-flex items-center gap-1.5 text-sm text-muted hover:text-ink"><ArrowLeft size={15} />Back</Link>
      <h1 className="text-2xl font-bold">Report a New Issue</h1>
      <p className="mt-1 text-sm text-muted">Help us identify and resolve campus issues quickly.</p>

      <ol className="card mt-6 flex items-center justify-between px-4 py-3 sm:px-6" aria-label="Progress">
        {STEPS.map((s, i) => (
          <li key={s} className="flex items-center gap-2" aria-current={i === step ? 'step' : undefined}>
            <span className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${i < step ? 'bg-brand text-white' : i === step ? 'bg-brand text-white' : 'bg-gray-100 text-muted'}`}>{i < step ? <Check size={14} /> : i + 1}</span>
            <span className={`hidden text-sm font-medium sm:block ${i === step ? 'text-ink' : 'text-muted'}`}>{s}</span>
          </li>
        ))}
      </ol>

      <div className="card mt-4 p-5 sm:p-7">
        {step === 0 && (
          <div className="space-y-6">
            <fieldset>
              <legend className="label">Issue Category <span className="text-danger">*</span></legend>
              <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                {CATEGORIES.map((c) => (
                  <button type="button" key={c.id} onClick={() => set('category', c.id)} aria-pressed={f.category === c.id}
                    className={`flex flex-col items-center gap-2 rounded-xl border p-3.5 text-center text-xs font-semibold transition-colors ${f.category === c.id ? 'border-accent bg-accent-soft/60 ring-1 ring-accent' : 'border-line hover:bg-bg'}`}>
                    <CategoryIcon category={c.id} size={18} boxed={false} />{c.label}
                  </button>
                ))}
              </div>
              {err('category')}
            </fieldset>
            <div>
              <label className="label" htmlFor="title">Issue Title <span className="text-danger">*</span></label>
              <input id="title" className="input" maxLength={90} value={f.title} onChange={(e) => set('title', e.target.value)} placeholder="E.g. Wi-Fi not working in Academic Block A" />
              {err('title')}
            </div>
            <div>
              <label className="label" htmlFor="desc">Description <span className="text-danger">*</span></label>
              <textarea id="desc" rows={4} className="input resize-y" value={f.description} onChange={(e) => set('description', e.target.value)} placeholder="Provide a detailed description of the issue…" />
              {err('description')}
            </div>
            <fieldset>
              <legend className="label">Urgency Level <span className="text-danger">*</span></legend>
              <div className="grid gap-2.5 sm:grid-cols-3">
                {URGENCIES.map((u) => {
                  const info = URGENCY_INFO[u]
                  return (
                    <button type="button" key={u} aria-pressed={f.urgency === u} onClick={() => set('urgency', u)}
                      className={`flex items-center gap-3 rounded-xl border p-3.5 text-left transition-colors ${f.urgency === u ? `${info.cls} ring-1 ring-current/20` : 'border-line hover:bg-bg'}`}>
                      <info.icon size={18} /><span><span className="block text-sm font-semibold">{u}</span><span className="block text-xs text-muted">{info.hint}</span></span>
                    </button>
                  )
                })}
              </div>
            </fieldset>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-6">
            <fieldset>
              <legend className="label">Where is the issue? <span className="text-danger">*</span></legend>
              <div className="flex flex-wrap gap-2">
                {LOCATION_TYPES.map((t) => (
                  <button type="button" key={t} aria-pressed={f.locationType === t} onClick={() => chooseType(t)}
                    className={`rounded-full border px-3.5 py-2 text-sm font-semibold transition-colors ${f.locationType === t ? 'border-brand bg-brand text-white' : 'border-line hover:bg-bg'}`}>{t}</button>
                ))}
              </div>
              {err('locationType')}
            </fieldset>
            {f.locationType && f.locationType !== 'Other' && (
              <div>
                <label className="label" htmlFor="place">Specific place <span className="text-danger">*</span></label>
                <select id="place" className="input" value={f.locationId} onChange={(e) => choosePlace(e.target.value)}>
                  <option value="">Select…</option>
                  {placeOptions.map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}
                </select>
                {err('locationId')}
              </div>
            )}
            <div>
              <label className="label" htmlFor="ld">{f.locationType === 'Other' ? 'Describe the location' : 'Additional location details'} {f.locationType === 'Other' && <span className="text-danger">*</span>}</label>
              <input id="ld" className="input" value={f.locationDetails} onChange={(e) => set('locationDetails', e.target.value)} placeholder="E.g. Second floor, near the staircase" />
              {err('locationDetails')}
            </div>
            <div>
              <div className="mb-1.5 flex items-center justify-between"><span className="label mb-0">Selected location</span><span className="text-xs text-muted">{f.locationType === 'Other' ? 'Click the map to move the pin' : 'Demo map position'}</span></div>
              <LocationPicker lat={f.lat} lng={f.lng} onPick={f.locationType === 'Other' ? (la, ln) => setF((p) => ({ ...p, lat: la, lng: ln })) : undefined} />
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <div className="label">Photos <span className="font-normal text-muted">(optional, up to 3)</span></div>
            <input ref={fileRef} id="photos" type="file" accept="image/*" multiple className="sr-only" onChange={(e) => onFiles(e.target.files)} />
            <label htmlFor="photos" className="flex cursor-pointer flex-col items-center rounded-2xl border border-dashed border-gray-300 bg-bg/60 px-4 py-10 text-center hover:border-brand">
              <ImagePlus size={28} className="text-brand" />
              <span className="mt-3 text-sm font-semibold">Click to upload photos</span>
              <span className="mt-1 text-xs text-muted">Images are resized and stored in your browser only (demo)</span>
            </label>
            {uploadErr && <p className="mt-2 text-xs font-medium text-danger" role="alert">{uploadErr}</p>}
            {f.images.length > 0 && (
              <ul className="mt-4 grid grid-cols-3 gap-3">
                {f.images.map((src, i) => (
                  <li key={i} className="relative">
                    <img src={src} alt={`Upload preview ${i + 1}`} className="aspect-square w-full rounded-xl border border-line object-cover" />
                    <button type="button" aria-label={`Remove photo ${i + 1}`} onClick={() => set('images', f.images.filter((_, k) => k !== i))} className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-ink text-white shadow"><X size={13} /></button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 className="text-lg font-semibold">Review your report</h2>
            <dl className="mt-4 divide-y divide-line rounded-xl border border-line text-sm">
              {[
                ['Category', CATEGORIES.find((c) => c.id === f.category)?.label],
                ['Title', f.title], ['Description', f.description], ['Urgency', f.urgency],
                ['Location', `${locationName}${f.locationDetails && f.locationType !== 'Other' ? ` — ${f.locationDetails}` : ''}`],
              ].map(([k, v]) => (
                <div key={k} className="grid gap-1 px-4 py-3 sm:grid-cols-[130px_1fr]"><dt className="text-muted">{k}</dt><dd className="whitespace-pre-wrap break-words font-medium">{v}</dd></div>
              ))}
              <div className="grid gap-1 px-4 py-3 sm:grid-cols-[130px_1fr]"><dt className="text-muted">Photos</dt><dd>{f.images.length === 0 ? <span className="text-muted">None attached</span> : <div className="flex gap-2">{f.images.map((s, i) => <img key={i} src={s} alt="" className="h-14 w-14 rounded-lg object-cover" />)}</div>}</dd></div>
            </dl>
          </div>
        )}

        <div className="mt-7 flex items-center justify-between border-t border-line pt-5">
          {step > 0 ? <button type="button" className="btn-secondary" onClick={back} disabled={submitting}><ArrowLeft size={16} />Go Back</button> : <span />}
          {step < 3
            ? <button type="button" className="btn-primary" onClick={next}>Next Step <ArrowRight size={16} /></button>
            : <button type="button" className="btn-primary" onClick={submit} disabled={submitting}>{submitting ? <><Spinner />Submitting…</> : 'Submit Report'}</button>}
        </div>
      </div>
    </div>
  )
}
