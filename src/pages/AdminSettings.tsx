import { useState } from 'react'
import { issueActions, settingsActions, useIssues, useSettings } from '../services/issueStore'
import { ConfirmDialog, PageHeader } from '../components/common/Common'
import { useToast } from '../context/ToastContext'

export default function AdminSettings() {
  const settings = useSettings()
  const issues = useIssues()
  const toast = useToast()
  const [dialog, setDialog] = useState<null | 'reset' | 'clear'>(null)
  const [name, setName] = useState(settings.campusName)
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <PageHeader title="Settings" subtitle="Preferences for this demo workspace." />
      <section className="card space-y-5 p-5">
        <div><label className="label" htmlFor="cn">Campus name</label>
          <div className="flex gap-2"><input id="cn" className="input" value={name} onChange={(e) => setName(e.target.value)} /><button className="btn-secondary shrink-0" disabled={!name.trim() || name === settings.campusName} onClick={() => { settingsActions.update({ campusName: name.trim() }); toast('Campus name saved') }}>Save</button></div></div>
        <label className="flex items-start justify-between gap-4 border-t border-line pt-5">
          <span><span className="block text-sm font-semibold">Auto-assign department</span><span className="block text-sm text-muted">When an unassigned issue moves past “Open”, assign the department that usually handles its category.</span></span>
          <input type="checkbox" className="mt-1 h-5 w-5 accent-[#174C40]" checked={settings.autoAssign} onChange={(e) => { settingsActions.update({ autoAssign: e.target.checked }); toast(e.target.checked ? 'Auto-assign on' : 'Auto-assign off') }} />
        </label>
      </section>
      <section className="card p-5">
        <h2 className="font-semibold">Data</h2>
        <p className="mt-1 text-sm text-muted">{issues.length} issues stored in this browser ({issues.filter((i) => i.isDemo).length} demo). Nothing is sent to a server.</p>
        <div className="mt-4 flex flex-wrap gap-2"><button className="btn-secondary" onClick={() => setDialog('reset')}>Reset to demo data</button><button className="btn-danger" onClick={() => setDialog('clear')}>Delete all issues</button></div>
      </section>
      <ConfirmDialog open={dialog === 'reset'} title="Reset to demo data?" message="This replaces every issue, including ones you reported, with the original demo dataset." confirmLabel="Reset" onConfirm={() => { issueActions.resetDemo(); setDialog(null); toast('Demo data restored') }} onCancel={() => setDialog(null)} />
      <ConfirmDialog open={dialog === 'clear'} danger title="Delete all issues?" message="This permanently removes all issues from this browser. You can restore the demo data afterwards." confirmLabel="Delete all" onConfirm={() => { issueActions.clearAll(); setDialog(null); toast('All issues deleted') }} onCancel={() => setDialog(null)} />
    </div>
  )
}
