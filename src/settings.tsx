import { useRef, useState, type ReactNode } from 'react'
import * as P from '@phosphor-icons/react'
import { CATS, CAT_COLOR, CAT_LABEL, useApp, type Cat, type Scenario, type Txn } from './store'
import { Bar, Button, Card, Chip, Confirm, Field, Money, PageHead, Segmented, Select, StatusPill, Switch, cx, inputCls, num } from './ui'

function Section({ title, children, icon: I }: { title: string; icon: P.Icon; children: ReactNode }) {
  return (
    <Card className="p-5">
      <h2 className="serif mb-3 flex items-center gap-2 text-xl font-medium"><I size={20} className="text-primary" />{title}</h2>
      <div className="space-y-4">{children}</div>
    </Card>
  )
}
const Row = ({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) => (
  <div className="flex items-center justify-between gap-4"><div><p className="font-semibold">{label}</p>{hint && <p className="text-sm text-muted">{hint}</p>}</div>{children}</div>
)

function download(name: string, text: string, type: string) {
  const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([text], { type })); a.download = name; a.click(); URL.revokeObjectURL(a.href)
}

export function Settings() {
  const { settings, setSettings, limits, setLimits, profile, txns, bills, goals, resetDemo, deleteAll, importTxns, toast, nav, scenario, setScenario, setView } = useApp()
  const [draft, setDraft] = useState<Record<Cat, string>>(() => Object.fromEntries(CATS.map((c) => [c, String(limits[c])])) as Record<Cat, string>)
  const [confirm, setConfirm] = useState<'delete' | 'reset' | null>(null)
  const file = useRef<HTMLInputElement>(null)
  const alloc = CATS.reduce((a, c) => a + (Number(draft[c]) || 0), 0)
  const unalloc = profile.income - alloc
  const dirty = CATS.some((c) => Number(draft[c]) !== limits[c])

  const onImport = async (f?: File) => {
    if (!f) return
    try {
      const text = await f.text(); let rows: Partial<Txn>[] = []
      if (f.name.endsWith('.csv')) {
        const [head, ...lines] = text.trim().split(/\r?\n/); const h = head.split(',').map((x) => x.trim().toLowerCase())
        rows = lines.map((l) => { const v = l.split(','); const o: Record<string, string> = {}; h.forEach((k, i) => (o[k] = v[i])); return { date: o.date, merchant: o.merchant, cat: o.category as Cat, amount: Number(o.amount), method: o.method as Txn['method'] } })
      } else { const j = JSON.parse(text); rows = Array.isArray(j) ? j : j.transactions }
      const ok = rows.filter((r) => r.date && r.merchant && CATS.includes(r.cat as Cat) && Number(r.amount) > 0).map((r) => ({ ...r, amount: Number(r.amount), method: r.method === 'Cash' ? 'Cash' : 'UPI' }) as Txn)
      if (!ok.length) throw new Error('none')
      importTxns(ok); toast(`Imported ${ok.length} transaction${ok.length > 1 ? 's' : ''}`)
    } catch { toast("Couldn't read that file. Use the exported MintMate JSON or CSV format.", { tone: 'error' }) }
    if (file.current) file.current.value = ''
  }

  return (
    <div>
      <PageHead title="Settings" sub="Everything here is simulated and kept in memory for this prototype." />
      <div className="grid gap-5 lg:grid-cols-2">
        <div className="space-y-5">
          <Section title="Appearance" icon={P.Palette}>
            <Row label="Theme"><Segmented label="Theme" value={settings.theme} onChange={(v) => setSettings({ theme: v })} options={[{ v: 'light', l: 'Light' }, { v: 'dark', l: 'Dark' }, { v: 'system', l: 'System' }]} /></Row>
            <Row label="Language" hint="Core screens translate to Hindi"><Segmented label="Language" value={settings.lang} onChange={(v) => setSettings({ lang: v })} options={[{ v: 'en', l: 'English' }, { v: 'hi', l: 'हिन्दी' }]} /></Row>
            <Row label="Currency display"><Segmented label="Currency display" value={settings.currency} onChange={(v) => setSettings({ currency: v })} options={[{ v: 'symbol', l: '₹ 1,200' }, { v: 'code', l: 'INR 1,200' }]} /></Row>
          </Section>
          <Section title="Privacy & notifications" icon={P.ShieldCheck}>
            <Row label="Privacy mode" hint="Hide amounts across the app"><Switch label="Privacy mode" checked={settings.privacy} onChange={(v) => setSettings({ privacy: v })} /></Row>
            <Row label="Bill reminders"><Switch label="Bill reminders" checked={settings.notifs.bills} onChange={(v) => setSettings({ notifs: { ...settings.notifs, bills: v } })} /></Row>
            <Row label="Budget warnings" hint="When a category passes 85%"><Switch label="Budget warnings" checked={settings.notifs.budget} onChange={(v) => setSettings({ notifs: { ...settings.notifs, budget: v } })} /></Row>
            <Row label="Weekly summary"><Switch label="Weekly summary" checked={settings.notifs.weekly} onChange={(v) => setSettings({ notifs: { ...settings.notifs, weekly: v } })} /></Row>
          </Section>
          <Section title="Data" icon={P.Database}>
            <div className="flex flex-wrap gap-2">
              <Button variant="secondary" size="sm" icon={P.DownloadSimple} onClick={() => { download('mintmate-transactions.csv', 'date,merchant,category,amount,method\n' + txns.map((t) => [t.date, t.merchant.replace(/,/g, ' '), t.cat, t.amount, t.method].join(',')).join('\n'), 'text/csv'); toast('CSV exported') }}>Export CSV</Button>
              <Button variant="secondary" size="sm" icon={P.DownloadSimple} onClick={() => { download('mintmate-backup.json', JSON.stringify({ profile, limits, transactions: txns, bills, goals }, null, 2), 'application/json'); toast('JSON exported') }}>Export JSON</Button>
              <Button variant="secondary" size="sm" icon={P.UploadSimple} onClick={() => file.current?.click()}>Import</Button>
              <input ref={file} type="file" accept=".json,.csv" className="sr-only" aria-label="Import transactions file" onChange={(e) => onImport(e.target.files?.[0])} />
            </div>
            <div className="flex flex-wrap gap-2 border-t border-line pt-4">
              <Button variant="secondary" size="sm" icon={P.ArrowCounterClockwise} onClick={() => setConfirm('reset')}>Reset demo</Button>
              <Button variant="danger" size="sm" icon={P.Trash} onClick={() => setConfirm('delete')}>Delete local data</Button>
            </div>
          </Section>
        </div>
        <div className="space-y-5">
          <Section title="Budget allocations" icon={P.Sliders}>
            <ul className="space-y-3">
              {CATS.map((c) => (
                <li key={c} className="flex items-center gap-3">
                  <span className="size-2.5 rounded-full" style={{ background: CAT_COLOR[c] }} aria-hidden />
                  <label htmlFor={'al' + c} className="flex-1 text-[15px] font-semibold">{CAT_LABEL[c]}</label>
                  <div className="relative w-32"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted">₹</span><input id={'al' + c} inputMode="numeric" className={cx(inputCls, 'num pl-7 text-right')} value={draft[c]} onChange={(e) => setDraft({ ...draft, [c]: e.target.value.replace(/\D/g, '') })} /></div>
                </li>
              ))}
            </ul>
            <div className="rounded-lg bg-surface2 p-3 text-sm" aria-live="polite">
              <div className="mb-2 flex justify-between"><span>Allocated <b className="num">₹{num(alloc)}</b></span><span className={unalloc < 0 ? 'font-bold text-red' : ''}>{unalloc < 0 ? 'Over by' : 'Unallocated'} <b className="num">₹{num(Math.abs(unalloc))}</b></span></div>
              <Bar value={alloc} max={profile.income} tone={unalloc < 0 ? 'over' : 'ok'} label="Income allocated" />
            </div>
            <Button full disabled={!dirty || unalloc < 0} onClick={() => { setLimits(Object.fromEntries(CATS.map((c) => [c, Number(draft[c]) || 0])) as Record<Cat, number>); toast('Budget allocations saved') }}>Save allocations</Button>
          </Section>
          <Section title="Prototype controls" icon={P.Flask}>
            <p className="text-sm text-muted">These switches simulate states so you can see how the app behaves. They don't touch real data.</p>
            <Field label="Dashboard scenario"><Select label="Dashboard scenario" value={scenario} onChange={(v) => { setScenario(v as Scenario); toast('Scenario updated — check Home') }} options={[{ v: 'healthy', l: 'Healthy' }, { v: 'tight', l: 'Warning (category near limit)' }, { v: 'overspent', l: 'Overspending' }, { v: 'empty', l: 'Empty (no expenses)' }]} /></Field>
            <Row label="Simulate offline" hint="Shows the offline banner"><Switch label="Simulate offline" checked={settings.offline} onChange={(v) => setSettings({ offline: v })} /></Row>
            <Row label="Fail next save" hint="Test the error state in Add expense"><Switch label="Fail next save" checked={settings.failNext} onChange={(v) => setSettings({ failNext: v })} /></Row>
          </Section>
          <Card className="divide-y divide-line">
            {[
              ['AI Assistant', P.Robot, () => nav('ai-assistant')],
              ['Period history', P.ClockCounterClockwise, () => nav('history')], 
              ['Privacy Policy', P.ShieldCheck, () => window.open('#/privacy', '_blank')], 
              ['Terms of Service', P.FileText, () => window.open('#/terms', '_blank')],
              ['Design system', P.Cube, () => nav('system')], 
              ['Back to website', P.Globe, () => setView('site')],
              ['Sign Out', P.SignOut, () => {
                localStorage.removeItem('mintmate_auth')
                localStorage.removeItem('mintmate_user_email')
                toast('Signed out successfully')
                setTimeout(() => window.location.reload(), 500)
              }]
            ].map(([l, I, f]) => {
              const Ic = I as P.Icon
              const isSignOut = l === 'Sign Out'
              return <button key={l as string} onClick={f as () => void} className={cx("flex h-14 w-full items-center gap-3 px-5 text-left font-semibold hover:bg-surface2", isSignOut && "text-red")}><Ic size={20} className={isSignOut ? "text-red" : "text-primary"} />{l as string}<P.CaretRight size={16} className="ml-auto text-muted" /></button>
            })}
          </Card>
        </div>
      </div>
      <Confirm open={confirm === 'delete'} onClose={() => setConfirm(null)} title="Delete all local data?" body="This clears every expense, bill, goal and split stored in this prototype. You can reload sample data from the empty state or Reset demo." confirmLabel="Delete everything" onConfirm={() => { deleteAll(); toast('Local data deleted') }} />
      <Confirm open={confirm === 'reset'} onClose={() => setConfirm(null)} title="Reset demo data?" body="Sample transactions, bills, goals and splits will be restored." confirmLabel="Reset demo" onConfirm={() => { resetDemo(); setDraft(Object.fromEntries(CATS.map((c) => [c, String({ Food: 4500, Transport: 1500, Phone: 600, Entertainment: 1200, Shopping: 1500, Study: 1500, Misc: 700 }[c])])) as Record<Cat, string>); toast('Demo data restored') }} />
    </div>
  )
}

const swatches: [string, string, string][] = [
  ['Background', 'var(--bg)', '#FAF8F5 / #141414'], ['Surface', 'var(--surface)', 'Ivory / Charcoal'], ['Border', 'var(--line)', 'Warm gray'], ['Text', 'var(--ink)', '#242824 / off-white'], ['Muted', 'var(--muted)', 'Secondary text'],
  ['Primary', 'var(--primary)', '#1F7A5C / #4CC49A'], ['Warning', 'var(--amber)', 'Amber'], ['Error', 'var(--red)', 'Restrained red'], ['Hero', 'var(--hero)', 'Deep green'],
]
export function DesignSystem() {
  const { back } = useApp()
  const [sel, setSel] = useState(true)
  return (
    <div>
      <PageHead title="Design system" sub="Tokens and components used throughout MintMate." back={back} />
      <div className="space-y-5">
        <Card className="p-5"><h2 className="serif mb-3 text-xl font-medium">Colour tokens · light & dark</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">{swatches.map(([n, c, v]) => <div key={n}><div className="h-16 rounded-lg border border-line" style={{ background: c }} /><p className="mt-1.5 text-sm font-semibold">{n}</p><p className="text-xs text-muted">{v}</p></div>)}</div>
        </Card>
        <Card className="p-5"><h2 className="serif mb-3 text-xl font-medium">Typography</h2>
          <p className="serif text-[72px] leading-none">₹420</p><p className="text-sm text-muted">Fraunces — financial figures & headlines</p>
          <p className="serif mt-4 text-3xl">Make your money last all month</p>
          <p className="mt-4 text-[15px]">Figtree — body and UI text. Spacing runs on a 4px grid; radii are 8, 12 and 20px.</p>
        </Card>
        <Card className="p-5"><h2 className="serif mb-3 text-xl font-medium">Buttons · states</h2>
          <div className="flex flex-wrap items-center gap-3">
            <Button>Default</Button><Button className="bg-primary-hover">Hover</Button><Button className="outline outline-2 outline-offset-2 outline-primary">Focus</Button><Button className="scale-[.98] bg-primary-hover">Pressed</Button><Button disabled>Disabled</Button><Button loading>Loading</Button><Button variant="secondary">Secondary</Button><Button variant="ghost">Ghost</Button><Button variant="danger">Danger</Button>
          </div>
        </Card>
        <div className="grid gap-5 lg:grid-cols-2">
          <Card className="space-y-4 p-5"><h2 className="serif text-xl font-medium">Fields & chips</h2>
            <Field label="Default" htmlFor="d1"><input id="d1" className={inputCls} placeholder="Placeholder" /></Field>
            <Field label="Error" error="Enter an amount greater than ₹0" htmlFor="d2"><input id="d2" aria-invalid className={inputCls} defaultValue="0" /></Field>
            <Field label="Disabled" htmlFor="d3"><input id="d3" disabled className={inputCls} defaultValue="Locked" /></Field>
            <div className="flex gap-2"><Chip selected={sel} onClick={() => setSel(!sel)}>Selected</Chip><Chip selected={!sel} onClick={() => setSel(!sel)}>Unselected</Chip></div>
          </Card>
          <Card className="space-y-4 p-5"><h2 className="serif text-xl font-medium">Budget bars & status</h2>
            {([['On track', 40, 'ok'], ['Watch', 88, 'warn'], ['Over limit', 100, 'over']] as const).map(([l, v, t]) => <div key={l}><div className="mb-1 flex justify-between text-sm"><span className="font-semibold">{l}</span><span className="num">{v}%</span></div><Bar value={v} max={100} tone={t} label={l} /></div>)}
            <div className="flex flex-wrap gap-2"><StatusPill tone="ok">On track</StatusPill><StatusPill tone="warn">Warning</StatusPill><StatusPill tone="over">Overdue</StatusPill><StatusPill tone="info">Info</StatusPill></div>
            <p className="text-sm text-muted">State is always shown with an icon, label and pattern, never colour alone. Amounts: <Money v={12400} /></p>
          </Card>
        </div>
      </div>
    </div>
  )
}
