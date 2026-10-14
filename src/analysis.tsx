import { useMemo, useState } from 'react'
import * as P from '@phosphor-icons/react'
import { CATS, CAT_COLOR, CAT_LABEL, HISTORY, TODAY, balances, fmtDate, suggestions, useApp, type Cat } from './store'
import { TxnRow } from './addExpense'
import { Bar, BarChart, Button, CatBadge, Card, Chip, Empty, Field, Money, PageHead, Segmented, Select, Sheet, StatusPill, cx, inputCls, num } from './ui'

const WD = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export function Insights() {
  const { txns, m } = useApp()
  const [pid, setPid] = useState('2026-10')
  const cur = pid === '2026-10'
  const h = HISTORY.find((x) => x.id === pid)
  const d = useMemo(() => {
    if (cur) {
      const wd = Array(7).fill(0)
      txns.forEach((t) => { wd[(new Date(t.date + 'T00:00:00').getDay() + 6) % 7] += t.amount })
      const big = [...txns].sort((a, b) => b.amount - a.amount)[0]
      return { label: 'October 2026 (so far)', total: m.spent, cats: m.byCat, days: m.dayNo, wd, largest: big ? { merchant: big.merchant, amount: big.amount, date: big.date } : null, prev: Math.round(HISTORY[0].spent * (m.dayNo / 30)), prevLabel: 'same days of September' }
    }
    const i = HISTORY.indexOf(h!)
    const older = HISTORY[i + 1]
    return { label: h!.label, total: h!.spent, cats: h!.cats, days: 30, wd: h!.weekdays, largest: h!.largest, prev: older?.spent ?? null, prevLabel: older?.label ?? '' }
  }, [cur, txns, m, h])

  const trend = [...HISTORY].reverse().map((x) => ({ label: x.label.slice(0, 3), value: x.spent, id: x.id })).concat([{ label: 'Oct', value: m.spent, id: '2026-10', partial: true } as never])
  const activeIdx = trend.findIndex((x) => x.id === pid)
  const total = d.total || 1
  const ranked = CATS.map((c) => ({ c, v: d.cats[c] })).sort((a, b) => b.v - a.v)
  const maxWd = Math.max(...d.wd, 1)
  const weekend = (d.wd[5] + d.wd[6]) / (d.wd.reduce((a: number, b: number) => a + b, 0) || 1)
  const diff = d.prev ? Math.round(((d.total - d.prev) / d.prev) * 100) : null
  const obs: string[] = []
  if (d.total > 0) {
    obs.push(`${CAT_LABEL[ranked[0].c]} was ${Math.round((ranked[0].v / total) * 100)}% of spending (₹${num(ranked[0].v)}), the largest share.`)
    obs.push(`Weekends (Sat + Sun) made up ${Math.round(weekend * 100)}% of spending across just 2 of 7 days.`)
    if (diff !== null) obs.push(`Spending is ${Math.abs(diff)}% ${diff <= 0 ? 'lower' : 'higher'} than ${d.prevLabel}.`)
    if (d.largest) obs.push(`${d.largest.merchant} (₹${num(d.largest.amount)}) was ${Math.round((d.largest.amount / total) * 100)}% of the total.`)
  }

  return (
    <div>
      <PageHead title="Insights" sub={d.label} action={<div className="hidden sm:block"><PeriodSelect pid={pid} setPid={setPid} /></div>} />
      <div className="mb-5 sm:hidden"><PeriodSelect pid={pid} setPid={setPid} /></div>
      {d.total === 0 ? <Empty icon={P.ChartBar} title="Nothing to analyse yet" body="Add a few expenses and your patterns will appear here." /> : (
        <div className="grid gap-5 lg:grid-cols-12">
          <div className="grid grid-cols-2 gap-4 lg:col-span-12 lg:grid-cols-4">
            <Stat label="Total spending" value={<Money v={d.total} />} />
            <Stat label={`vs ${cur ? 'same days last period' : 'previous period'}`} value={diff === null ? '—' : <span className="inline-flex items-center gap-1">{diff <= 0 ? <P.ArrowDown size={20} /> : <P.ArrowUp size={20} />}{Math.abs(diff)}%</span>} sub={diff === null ? 'No earlier data' : diff <= 0 ? 'Lower — good' : 'Higher'} />
            <Stat label="Average per day" value={<Money v={d.total / d.days} />} sub={`over ${d.days} days`} />
            <Stat label="Largest expense" value={d.largest ? <Money v={d.largest.amount} /> : '—'} sub={d.largest ? `${d.largest.merchant} · ${fmtDate(d.largest.date)}` : ''} />
          </div>
          <Card className="p-5 lg:col-span-7">
            <h2 className="serif mb-4 text-xl font-medium">Six-period trend</h2>
            <BarChart data={trend} activeIndex={activeIdx} caption="Total spending for each of the last six periods, in rupees" />
            <p className="mt-2 text-xs text-muted">* October is partial (day {m.dayNo} of 31). Values in ₹.</p>
          </Card>
          <Card className="p-5 lg:col-span-5">
            <h2 className="serif mb-4 text-xl font-medium">Where it went</h2>
            <div className="flex h-4 overflow-hidden rounded-full" role="img" aria-label={'Category share: ' + ranked.map((r) => `${CAT_LABEL[r.c]} ${Math.round((r.v / total) * 100)}%`).join(', ')}>
              {ranked.map((r) => <div key={r.c} style={{ width: (r.v / total) * 100 + '%', background: CAT_COLOR[r.c] }} className="border-r-2 border-surface last:border-0" />)}
            </div>
            <ul className="mt-4 space-y-2.5">
              {ranked.map((r) => (
                <li key={r.c} className="flex items-center gap-2.5 text-[15px]"><CatBadge cat={r.c} size={28} /><span className="flex-1">{CAT_LABEL[r.c]}</span><span className="num text-sm text-muted">{Math.round((r.v / total) * 100)}%</span><Money v={r.v} className="w-20 text-right font-semibold" /></li>
              ))}
            </ul>
          </Card>
          <Card className="p-5 lg:col-span-7">
            <h2 className="serif mb-1 text-xl font-medium">Weekday spending</h2>
            <p className="mb-4 text-sm text-muted">Darker means more spent on that weekday.</p>
            <div className="grid grid-cols-7 gap-1.5 sm:gap-2" role="img" aria-label={'Spending by weekday: ' + WD.map((w, i) => `${w} ₹${num(d.wd[i])}`).join(', ')}>
              {WD.map((w, i) => (
                <div key={w} className="rounded-lg p-1.5 text-center sm:p-2" style={{ background: `color-mix(in srgb, var(--primary) ${Math.round((d.wd[i] / maxWd) * 55)}%, var(--surface2))` }}>
                  <p className="text-xs font-semibold">{w}</p>
                  <p className="num mt-4 text-[11px] font-bold sm:text-sm">{d.wd[i] >= 1000 ? (d.wd[i] / 1000).toFixed(1) + 'k' : d.wd[i]}</p>
                  {d.wd[i] === maxWd && <p className="text-[10px] font-bold uppercase">Peak</p>}
                </div>
              ))}
            </div>
          </Card>
          <Card className="p-5 lg:col-span-5">
            <h2 className="serif mb-3 text-xl font-medium">What the data says</h2>
            <ul className="space-y-3">{obs.map((o, i) => <li key={i} className="flex gap-2.5 text-[15px]"><P.Lightbulb size={18} weight="fill" className="mt-0.5 shrink-0 text-amber" />{o}</li>)}</ul>
          </Card>
        </div>
      )}
    </div>
  )
}
function PeriodSelect({ pid, setPid }: { pid: string; setPid: (s: string) => void }) {
  return <Segmented label="Period" value={pid} onChange={setPid} options={[{ v: '2026-10', l: 'Oct' }, { v: '2026-09', l: 'Sep' }, { v: '2026-08', l: 'Aug' }]} />
}
function Stat({ label, value, sub }: { label: string; value: React.ReactNode; sub?: string }) {
  return <Card className="p-4"><p className="text-sm text-muted">{label}</p><p className="serif mt-1 text-2xl font-medium lg:text-3xl">{value}</p>{sub && <p className="mt-0.5 truncate text-xs text-muted">{sub}</p>}</Card>
}

export function Splits() {
  const { people, splits, settlements, addSplit, settle, toast } = useApp()
  const name = (id: string) => people.find((p) => p.id === id)!.name
  const bal = balances(people, splits, settlements)
  const sug = suggestions(bal)
  const [form, setForm] = useState(false)
  const [pay, setPay] = useState<(typeof sug)[number] | null>(null)
  return (
    <div>
      <PageHead title="Flatmate splits" sub="Room 204 · 4 people" action={<Button icon={P.Plus} onClick={() => setForm(true)}>New split</Button>} />
      <div className="grid gap-5 lg:grid-cols-[1fr_1.2fr]">
        <div className="space-y-5">
          <Card className="p-5">
            <h2 className="serif mb-3 text-xl font-medium">Balances</h2>
            <ul className="divide-y divide-line">
              {people.map((p) => (
                <li key={p.id} className="flex items-center gap-3 py-3">
                  <span className="grid size-10 place-items-center rounded-full bg-surface2 font-bold">{p.name[0]}</span>
                  <span className="flex-1 font-semibold">{p.name}</span>
                  {Math.abs(bal[p.id]) < 1 ? <StatusPill tone="ok">Settled</StatusPill> : <span className="text-right text-sm"><span className="block text-muted">{bal[p.id] > 0 ? 'gets back' : 'owes'}</span><Money v={Math.abs(bal[p.id])} className={cx('text-lg font-semibold', bal[p.id] > 0 ? 'text-primary' : 'text-red')} /></span>}
                </li>
              ))}
            </ul>
          </Card>
          <Card className="p-5">
            <h2 className="serif mb-3 text-xl font-medium">Settlement suggestions</h2>
            {sug.length === 0 ? <Empty icon={P.Handshake} title="All square" body="Nobody owes anyone right now." /> : (
              <ul className="space-y-3">{sug.map((s, i) => (
                <li key={i} className="flex items-center gap-3 rounded-lg bg-surface2 p-3">
                  <p className="min-w-0 flex-1 text-[15px]"><b>{name(s.from)}</b> pays <b>{name(s.to)}</b><br /><Money v={s.amount} className="serif text-xl font-medium" /></p>
                  <Button size="sm" onClick={() => setPay(s)}>Settle Up</Button>
                </li>
              ))}</ul>
            )}
            {settlements.length > 0 && <p className="mt-3 text-sm text-muted">{settlements.length} payment{settlements.length > 1 ? 's' : ''} settled this period.</p>}
          </Card>
        </div>
        <Card className="p-5">
          <h2 className="serif mb-1 text-xl font-medium">Shared expenses</h2>
          <ul className="divide-y divide-line">
            {splits.map((e) => (
              <li key={e.id} className="py-3.5">
                <div className="flex items-center justify-between gap-3"><div><p className="font-semibold">{e.title}</p><p className="text-sm text-muted">{name(e.payer)} paid · {fmtDate(e.date)}</p></div><Money v={e.amount} className="serif text-xl font-medium" /></div>
                <p className="mt-1 text-xs text-muted">{Object.entries(e.shares).filter(([, v]) => v > 0).map(([id, v]) => `${name(id)} ₹${num(v)}`).join(' · ')}</p>
              </li>
            ))}
          </ul>
        </Card>
      </div>
      <SplitForm open={form} onClose={() => setForm(false)} onSave={(s) => { addSplit(s); setForm(false); toast(`"${s.title}" split saved`) }} />
      <Sheet open={!!pay} onClose={() => setPay(null)} title="Settle up">
        {pay && (
          <div>
            <p className="text-[15px] text-muted">Review before recording this payment. MintMate doesn't move real money; this just updates your shared balance.</p>
            <div className="my-5 flex items-center justify-center gap-4 rounded-xl bg-surface2 p-5 text-center"><b>{name(pay.from)}</b><P.ArrowRight size={20} /><b>{name(pay.to)}</b></div>
            <p className="serif mb-5 text-center text-5xl font-medium"><Money v={pay.amount} /></p>
            <div className="flex gap-3"><Button variant="secondary" onClick={() => setPay(null)}>Cancel</Button><Button full icon={P.Check} onClick={() => { settle(pay.from, pay.to, pay.amount); setPay(null); toast(`${name(pay.from)} settled ₹${num(pay.amount)} with ${name(pay.to)}`) }}>Confirm settlement</Button></div>
          </div>
        )}
      </Sheet>
    </div>
  )
}

function SplitForm({ open, onClose, onSave }: { open: boolean; onClose: () => void; onSave: (s: { title: string; amount: number; payer: string; date: string; shares: Record<string, number> }) => void }) {
  const { people } = useApp()
  const [title, setTitle] = useState('')
  const [amount, setAmount] = useState('')
  const [payer, setPayer] = useState('me')
  const [who, setWho] = useState<string[]>(people.map((p) => p.id))
  const [mode, setMode] = useState<'equal' | 'custom'>('equal')
  const [custom, setCustom] = useState<Record<string, string>>({})
  const [step, setStep] = useState<'form' | 'review'>('form')
  const [err, setErr] = useState<Record<string, string>>({})
  const amt = Number(amount) || 0
  const shares: Record<string, number> = Object.fromEntries(people.map((p) => [p.id, !who.includes(p.id) ? 0 : mode === 'equal' ? Math.round((amt / who.length) * 100) / 100 : Number(custom[p.id]) || 0]))
  const sum = Object.values(shares).reduce((a, b) => a + b, 0)
  const reset = () => { setTitle(''); setAmount(''); setPayer('me'); setWho(people.map((p) => p.id)); setMode('equal'); setCustom({}); setStep('form'); setErr({}) }
  const close = () => { reset(); onClose() }
  const review = () => {
    const e: Record<string, string> = {}
    if (!title.trim()) e.title = 'What was it for?'
    if (!(amt > 0)) e.amount = 'Enter the total amount'
    if (!who.length) e.who = 'Pick at least one person'
    if (mode === 'custom' && amt > 0 && Math.abs(sum - amt) > 0.5) e.sum = `Shares add up to ₹${num(sum)} — they need to equal ₹${num(amt)}`
    setErr(e); if (!Object.keys(e).length) setStep('review')
  }
  return (
    <Sheet open={open} onClose={close} title={step === 'form' ? 'New shared expense' : 'Review split'} wide>
      {step === 'form' ? (
        <form noValidate className="space-y-4" onSubmit={(e) => { e.preventDefault(); review() }}>
          <Field label="What was it for?" error={err.title} htmlFor="st"><input id="st" data-autofocus className={inputCls} aria-invalid={!!err.title} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Pizza night" /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Total (₹)" error={err.amount} htmlFor="sa"><input id="sa" inputMode="decimal" className={inputCls} aria-invalid={!!err.amount} value={amount} onChange={(e) => setAmount(e.target.value.replace(/[^\d.]/g, ''))} /></Field>
            <Field label="Paid by"><Select label="Paid by" value={payer} onChange={setPayer} options={people.map((p) => ({ v: p.id, l: p.name }))} /></Field>
          </div>
          <Field label="Split between" error={err.who}>
            <div className="flex flex-wrap gap-2">{people.map((p) => <Chip key={p.id} selected={who.includes(p.id)} onClick={() => setWho((w) => (w.includes(p.id) ? w.filter((x) => x !== p.id) : [...w, p.id]))}>{p.name}</Chip>)}</div>
          </Field>
          <Segmented label="Split type" value={mode} onChange={setMode} options={[{ v: 'equal', l: 'Equally' }, { v: 'custom', l: 'Custom amounts' }]} />
          {mode === 'custom' && (
            <div className="space-y-2">
              {who.map((id) => <div key={id} className="flex items-center gap-3"><label htmlFor={'c' + id} className="w-20 text-sm font-semibold">{people.find((p) => p.id === id)!.name}</label><input id={'c' + id} inputMode="decimal" className={inputCls} placeholder="₹0" value={custom[id] ?? ''} onChange={(e) => setCustom({ ...custom, [id]: e.target.value.replace(/[^\d.]/g, '') })} /></div>)}
              <p className={cx('text-sm', err.sum ? 'font-semibold text-red' : 'text-muted')} role={err.sum ? 'alert' : undefined}>{err.sum ?? `Assigned ₹${num(sum)} of ₹${num(amt)}`}</p>
            </div>
          )}
          <div className="flex gap-3 pt-2"><Button type="button" variant="secondary" onClick={close}>Cancel</Button><Button type="submit" full>Review split</Button></div>
        </form>
      ) : (
        <div>
          <p className="serif text-3xl font-medium">{title}</p>
          <p className="mb-4 text-muted"><Money v={amt} /> paid by {people.find((p) => p.id === payer)!.name}</p>
          <ul className="mb-5 divide-y divide-line rounded-xl border border-line bg-surface px-4">
            {people.filter((p) => who.includes(p.id)).map((p) => <li key={p.id} className="flex justify-between py-3"><span>{p.name}</span><Money v={shares[p.id]} className="font-semibold" /></li>)}
          </ul>
          <div className="flex gap-3"><Button variant="secondary" onClick={() => setStep('form')}>Back</Button><Button full icon={P.Check} onClick={() => { onSave({ title: title.trim(), amount: amt, payer, date: TODAY, shares }); reset() }}>Save split</Button></div>
        </div>
      )}
    </Sheet>
  )
}

export function History() {
  const { back } = useApp()
  const [open, setOpen] = useState<string | null>(null)
  const h = HISTORY.find((x) => x.id === open)
  if (h) {
    const left = h.budget - h.spent
    return (
      <div>
        <PageHead title={h.label} back={() => setOpen(null)} sub="Archived period · read-only, separate from your current budget" />
        <div className="grid gap-5 lg:grid-cols-2">
          <Card className="p-5">
            <dl className="grid grid-cols-2 gap-4">
              {[['Budget', h.budget], ['Spent', h.spent], [left >= 0 ? 'Remaining' : 'Over by', Math.abs(left)], ['Saved toward goals', h.saved]].map(([l, v]) => <div key={l as string}><dt className="text-sm text-muted">{l}</dt><dd className="serif text-2xl font-medium"><Money v={v as number} /></dd></div>)}
            </dl>
            <div className="mt-4"><Bar value={h.spent} max={h.budget} tone={h.spent > h.budget ? 'over' : 'ok'} label="Budget used" /></div>
          </Card>
          <Card className="p-5">
            <h2 className="serif mb-3 text-xl font-medium">Category breakdown</h2>
            <ul className="space-y-3">{CATS.map((c: Cat) => <li key={c}><div className="mb-1 flex justify-between text-sm"><span className="font-semibold">{CAT_LABEL[c]}</span><Money v={h.cats[c]} /></div><Bar value={h.cats[c]} max={h.spent} label={CAT_LABEL[c]} color={CAT_COLOR[c]} h={6} /></li>)}</ul>
          </Card>
          <Card className="p-5 lg:col-span-2"><h2 className="serif mb-1 text-xl font-medium">Notable transactions</h2><ul className="divide-y divide-line">{h.txns.map((t) => <li key={t.id}><TxnRow t={t} /></li>)}</ul></Card>
        </div>
      </div>
    )
  }
  return (
    <div>
      <PageHead title="Period history" sub="Your past budgets, kept apart from this one." back={back} />
      <ul className="grid gap-4 md:grid-cols-2">
        {HISTORY.map((x) => (
          <li key={x.id}>
            <button onClick={() => setOpen(x.id)} className="block w-full rounded-xl border border-line bg-surface p-5 text-left transition-colors duration-150 hover:border-muted">
              <div className="flex items-center justify-between"><h2 className="serif text-xl font-medium">{x.label}</h2><StatusPill tone={x.spent > x.budget ? 'over' : 'ok'}>{x.spent > x.budget ? 'Over' : 'Within budget'}</StatusPill></div>
              <p className="mt-2 text-sm text-muted">Spent <Money v={x.spent} className="font-semibold text-ink" /> of <Money v={x.budget} /> · Saved <Money v={x.saved} /></p>
              <div className="mt-3"><Bar value={x.spent} max={x.budget} label={`${x.label} budget used`} /></div>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
