import { useMemo, useState } from 'react'
import * as P from '@phosphor-icons/react'
import { CATS, CAT_LABEL, TODAY, addDays, dayLabel, daysBetween, fmtDate, useApp, type Bill, type Cat, type Goal, type Txn } from './store'
import { TxnRow } from './addExpense'
import { dueText } from './home'
import { Bar, Button, CatBadge, CatChips, Card, Confirm, Empty, Field, Money, PageHead, Segmented, Select, Sheet, StatusPill, cx, inputCls, num } from './ui'

export function Transactions() {
  const { txns, deleteTxn, restoreTxn, openAdd, toast } = useApp()
  const [q, setQ] = useState('')
  const [cat, setCat] = useState('all')
  const [pay, setPay] = useState('all')
  const [range, setRange] = useState('all')
  const [sort, setSort] = useState('new')
  const [view, setView] = useState<Txn | null>(null)
  const [del, setDel] = useState<Txn | null>(null)

  const list = useMemo(() => {
    let l = txns.filter((t) => (cat === 'all' || t.cat === cat) && (pay === 'all' || t.method === pay) && (!q || (t.merchant + CAT_LABEL[t.cat]).toLowerCase().includes(q.toLowerCase())))
    if (range !== 'all') { const from = addDays(TODAY, -Number(range)); l = l.filter((t) => t.date > from) }
    return [...l].sort((a, b) => sort === 'new' ? b.date.localeCompare(a.date) : sort === 'old' ? a.date.localeCompare(b.date) : sort === 'high' ? b.amount - a.amount : a.amount - b.amount)
  }, [txns, q, cat, pay, range, sort])
  const grouped = sort === 'new' || sort === 'old'
  const groups = grouped ? [...new Set(list.map((t) => t.date))].map((d) => ({ d, items: list.filter((t) => t.date === d) })) : [{ d: '', items: list }]
  const filtered = q || cat !== 'all' || pay !== 'all' || range !== 'all'

  return (
    <div>
      <PageHead title="Transactions" sub={`${list.length} of ${txns.length} this period`} action={<Button icon={P.Plus} onClick={() => openAdd()} className="hidden sm:inline-flex">Add</Button>} />
      <div className="mb-5 space-y-3">
        <div className="relative">
          <P.MagnifyingGlass size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" aria-hidden />
          <input type="search" aria-label="Search transactions" placeholder="Search merchant or category" value={q} onChange={(e) => setQ(e.target.value)} className={cx(inputCls, 'pl-10')} />
        </div>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <Select label="Category" value={cat} onChange={setCat} options={[{ v: 'all', l: 'All categories' }, ...CATS.map((c) => ({ v: c, l: CAT_LABEL[c] }))]} />
          <Select label="Payment method" value={pay} onChange={setPay} options={[{ v: 'all', l: 'UPI + Cash' }, { v: 'UPI', l: 'UPI' }, { v: 'Cash', l: 'Cash' }]} />
          <Select label="Date range" value={range} onChange={setRange} options={[{ v: 'all', l: 'Whole period' }, { v: '3', l: 'Last 3 days' }, { v: '7', l: 'Last 7 days' }, { v: '14', l: 'Last 14 days' }]} />
          <Select label="Sort by" value={sort} onChange={setSort} options={[{ v: 'new', l: 'Newest first' }, { v: 'old', l: 'Oldest first' }, { v: 'high', l: 'Highest amount' }, { v: 'low', l: 'Lowest amount' }]} />
        </div>
        {filtered && <button className="text-sm font-semibold text-primary" onClick={() => { setQ(''); setCat('all'); setPay('all'); setRange('all') }}>Clear filters</button>}
      </div>
      {list.length === 0 ? (
        <Empty icon={P.MagnifyingGlass} title={txns.length ? 'No matches' : 'No transactions yet'} body={txns.length ? 'Try a different search or clear a filter.' : 'Add your first expense to start tracking.'} action={<Button size="sm" onClick={() => (txns.length ? (setQ(''), setCat('all'), setPay('all'), setRange('all')) : openAdd())}>{txns.length ? 'Clear filters' : 'Add expense'}</Button>} />
      ) : (
        <div className="space-y-5">
          {groups.map((g) => (
            <section key={g.d} aria-label={g.d ? dayLabel(g.d) : 'Results'}>
              {g.d && <div className="mb-1 flex justify-between px-1 text-sm font-semibold text-muted"><h2>{dayLabel(g.d)}</h2><Money v={-g.items.reduce((a, t) => a + t.amount, 0)} /></div>}
              <Card className="px-3 lg:px-4"><ul className="divide-y divide-line">{g.items.map((t) => <li key={t.id}><TxnRow t={t} onClick={() => setView(t)} /></li>)}</ul></Card>
            </section>
          ))}
        </div>
      )}
      <Sheet open={!!view} onClose={() => setView(null)} title="Transaction">
        {view && (
          <div>
            <div className="mb-5 flex items-center gap-3"><CatBadge cat={view.cat} size={48} /><div><p className="text-lg font-semibold">{view.merchant}</p><p className="text-sm text-muted">{CAT_LABEL[view.cat]}</p></div></div>
            <p className="serif mb-5 text-5xl font-medium"><Money v={view.amount} /></p>
            <dl className="mb-6 grid grid-cols-2 gap-4 text-sm"><div><dt className="text-muted">Date</dt><dd className="font-semibold">{fmtDate(view.date, { weekday: 'long', day: 'numeric', month: 'long' })}</dd></div><div><dt className="text-muted">Paid with</dt><dd className="font-semibold">{view.method}</dd></div></dl>
            <div className="flex gap-3"><Button variant="secondary" full icon={P.Trash} onClick={() => { setDel(view); setView(null) }}>Delete</Button><Button full icon={P.PencilSimple} onClick={() => { openAdd(view); setView(null) }}>Edit</Button></div>
          </div>
        )}
      </Sheet>
      <Confirm open={!!del} onClose={() => setDel(null)} title="Delete this expense?" body={del ? `${del.merchant} (₹${num(del.amount)}) will be removed from this period. You can undo right after.` : ''} confirmLabel="Delete" onConfirm={() => { const t = del!; deleteTxn(t.id); toast(`Deleted ${t.merchant}`, { undo: () => restoreTxn(t) }) }} />
    </div>
  )
}

type BillTab = 'upcoming' | 'overdue' | 'paid'
export function Bills() {
  const { bills, payBill, saveBill, deleteBill, toast } = useApp()
  const [tab, setTab] = useState<BillTab>('upcoming')
  const [edit, setEdit] = useState<Bill | null>(null)
  const [del, setDel] = useState<Bill | null>(null)
  const groups = { upcoming: bills.filter((b) => !b.paid && b.due >= TODAY), overdue: bills.filter((b) => !b.paid && b.due < TODAY), paid: bills.filter((b) => b.paid) }
  const list = [...groups[tab]].sort((a, b) => a.due.localeCompare(b.due))
  const projected = bills.filter((b) => b.recurring !== 'One-time').reduce((a, b) => a + (b.recurring === 'Weekly' ? b.amount * 4 : b.recurring === 'Yearly' ? 0 : b.amount), 0)
  const newBill = (): Bill => ({ id: '', name: '', amount: 0, due: addDays(TODAY, 7), cat: 'Misc', recurring: 'Monthly', paid: false })
  return (
    <div>
      <PageHead title="Bills" sub="Recurring payments, kept ahead of you." action={<Button icon={P.Plus} onClick={() => setEdit(newBill())}>Add bill</Button>} />
      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <div>
          <div className="mb-4 overflow-x-auto"><Segmented label="Bill status" value={tab} onChange={setTab} options={(['upcoming', 'overdue', 'paid'] as BillTab[]).map((v) => ({ v, l: `${v[0].toUpperCase() + v.slice(1)} (${groups[v].length})` }))} /></div>
          {list.length === 0 ? <Empty icon={P.Receipt} title={`No ${tab} bills`} body={tab === 'overdue' ? "You're all caught up." : 'Add a bill to keep track of due dates.'} /> : (
            <ul className="space-y-3">
              {list.map((b) => (
                <li key={b.id}>
                  <Card className="p-4">
                    <div className="flex items-center gap-3">
                      <CatBadge cat={b.cat} />
                      <div className="min-w-0 flex-1"><p className="truncate font-semibold">{b.name}</p><p className="flex items-center gap-1 text-sm text-muted"><P.Repeat size={13} />{b.recurring} · {b.paid ? `Paid ${fmtDate(b.paidOn!)}` : `Due ${fmtDate(b.due)}`}</p></div>
                      <div className="text-right"><Money v={b.amount} className="serif text-xl font-medium" /><div className="mt-1">{b.paid ? <StatusPill tone="ok">Paid</StatusPill> : <StatusPill tone={b.due < TODAY ? 'over' : daysBetween(TODAY, b.due) <= 4 ? 'warn' : 'info'}>{dueText(b.due)}</StatusPill>}</div></div>
                    </div>
                    <div className="mt-3 flex gap-2 border-t border-line pt-3">
                      {!b.paid && <Button size="sm" icon={P.Check} onClick={() => payBill(b.id)}>Mark as paid</Button>}
                      <Button size="sm" variant="ghost" icon={P.PencilSimple} onClick={() => setEdit(b)}>Edit</Button>
                      <Button size="sm" variant="ghost" icon={P.Trash} onClick={() => setDel(b)} aria-label={`Delete ${b.name}`}>Delete</Button>
                    </div>
                  </Card>
                </li>
              ))}
            </ul>
          )}
        </div>
        <Card className="h-fit p-5">
          <h2 className="serif text-xl font-medium">Next period projection</h2>
          <p className="serif mt-2 text-4xl font-medium"><Money v={projected} /></p>
          <p className="mt-1 text-sm text-muted">Estimated from your recurring bills, due in November. This is a simple sum, not a forecast.</p>
          <ul className="mt-4 space-y-2 border-t border-line pt-4 text-sm">
            {bills.filter((b) => b.recurring !== 'One-time').map((b) => <li key={b.id} className="flex justify-between"><span>{b.name}</span><Money v={b.recurring === 'Weekly' ? b.amount * 4 : b.amount} className="font-semibold" /></li>)}
          </ul>
        </Card>
      </div>
      <BillForm bill={edit} onClose={() => setEdit(null)} onSave={(b) => { saveBill(b); setEdit(null); toast(b.id ? 'Bill updated' : 'Bill added') }} />
      <Confirm open={!!del} onClose={() => setDel(null)} title="Delete this bill?" body={del ? `${del.name} and its schedule will be removed.` : ''} confirmLabel="Delete bill" onConfirm={() => { deleteBill(del!.id); toast('Bill deleted') }} />
    </div>
  )
}

function BillForm({ bill, onClose, onSave }: { bill: Bill | null; onClose: () => void; onSave: (b: Bill) => void }) {
  const [f, setF] = useState<Bill | null>(null)
  const [err, setErr] = useState<Record<string, string>>({})
  const [prev, setPrev] = useState<Bill | null>(null)
  if (bill !== prev) { setPrev(bill); setF(bill); setErr({}) }
  if (!f) return <Sheet open={false} onClose={onClose} title=""><></></Sheet>
  const submit = () => {
    const e: Record<string, string> = {}
    if (!f.name.trim()) e.name = 'Give the bill a name'
    if (!(f.amount > 0)) e.amount = 'Enter an amount'
    setErr(e); if (!Object.keys(e).length) onSave(f)
  }
  return (
    <Sheet open={!!bill} onClose={onClose} title={f.id ? 'Edit bill' : 'Add bill'}>
      <form className="space-y-4" noValidate onSubmit={(e) => { e.preventDefault(); submit() }}>
        <Field label="Name" error={err.name} htmlFor="bn"><input id="bn" data-autofocus className={inputCls} aria-invalid={!!err.name} value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} /></Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Amount (₹)" error={err.amount} htmlFor="ba"><input id="ba" inputMode="numeric" className={inputCls} aria-invalid={!!err.amount} value={f.amount || ''} onChange={(e) => setF({ ...f, amount: Number(e.target.value.replace(/\D/g, '')) })} /></Field>
          <Field label="Due date" htmlFor="bd"><input id="bd" type="date" className={inputCls} value={f.due} onChange={(e) => setF({ ...f, due: e.target.value })} /></Field>
        </div>
        <Field label="Repeats"><Select label="Repeats" value={f.recurring} onChange={(v) => setF({ ...f, recurring: v as Bill['recurring'] })} options={['Monthly', 'Weekly', 'Yearly', 'One-time'].map((v) => ({ v, l: v }))} /></Field>
        <Field label="Category"><CatChips value={f.cat} onChange={(c) => setF({ ...f, cat: c })} /></Field>
        <div className="flex gap-3 pt-2"><Button type="button" variant="secondary" onClick={onClose}>Cancel</Button><Button type="submit" full>Save bill</Button></div>
      </form>
    </Sheet>
  )
}

const GOAL_ICON = { laptop: P.Laptop, trip: P.Airplane, exam: P.GraduationCap, other: P.Target }
function goalStatus(g: Goal) {
  const weeks = Math.max(1, Math.ceil(daysBetween(TODAY, g.date) / 7))
  const need = Math.max(0, Math.ceil((g.target - g.saved) / weeks / 10) * 10)
  const status = g.saved >= g.target ? 'done' : need <= g.weekly ? 'ok' : 'behind'
  return { weeks, need, status } as const
}

export function Goals() {
  const { goals, saveGoal, deleteGoal, contribute, toast } = useApp()
  const [open, setOpen] = useState<string | null>(null)
  const [edit, setEdit] = useState<Goal | null>(null)
  const [add, setAdd] = useState<Goal | null>(null)
  const [del, setDel] = useState<Goal | null>(null)
  const [amt, setAmt] = useState('')
  const g = goals.find((x) => x.id === open)

  if (g) {
    const s = goalStatus(g); const p = Math.round((g.saved / g.target) * 100); const I = GOAL_ICON[g.kind]
    return (
      <div>
        <PageHead title={g.name} back={() => setOpen(null)} sub={`Target date ${fmtDate(g.date, { day: 'numeric', month: 'long', year: 'numeric' })}`} />
        <div className="grid gap-5 lg:grid-cols-[1.2fr_1fr]">
          <Card className="p-6">
            <div className="flex items-center gap-4"><span className="grid size-14 place-items-center rounded-2xl bg-primary-soft text-primary"><I size={30} weight="duotone" /></span><StatusPill tone={s.status === 'behind' ? 'warn' : 'ok'}>{s.status === 'done' ? 'Goal reached' : s.status === 'ok' ? 'On track' : 'Behind pace'}</StatusPill></div>
            <p className="serif mt-5 text-6xl font-medium"><Money v={g.saved} /></p>
            <p className="mt-1 text-muted">of <Money v={g.target} /> · {p}% saved · <Money v={Math.max(0, g.target - g.saved)} /> to go</p>
            <div className="mt-4"><Bar value={g.saved} max={g.target} label={`${g.name} progress`} h={12} /></div>
            <p className="mt-4 rounded-lg bg-surface2 p-3 text-sm">You need <b><Money v={s.need} /></b> a week for {s.weeks} weeks. Your plan is <b><Money v={g.weekly} /></b> a week.</p>
            <div className="mt-5 flex flex-wrap gap-3"><Button icon={P.Plus} onClick={() => { setAmt(''); setAdd(g) }}>Add contribution</Button><Button variant="secondary" icon={P.PencilSimple} onClick={() => setEdit(g)}>Edit</Button><Button variant="ghost" icon={P.Trash} onClick={() => setDel(g)}>Delete</Button></div>
          </Card>
          <Card className="p-5"><h2 className="serif mb-2 text-xl font-medium">Contributions</h2>{g.log.length === 0 ? <p className="text-sm text-muted">No contributions yet.</p> : <ul className="divide-y divide-line">{g.log.map((l, i) => <li key={i} className="flex justify-between py-3 text-[15px]"><span>{fmtDate(l.date, { day: 'numeric', month: 'short', year: 'numeric' })}</span><Money v={l.amount} sign className="font-semibold text-primary" /></li>)}</ul>}</Card>
        </div>
        <Contribute goal={add} amt={amt} setAmt={setAmt} onClose={() => setAdd(null)} onSave={(a) => { contribute(add!.id, a); setAdd(null); toast(`₹${num(a)} added to ${add!.name}`) }} />
        <GoalForm goal={edit} onClose={() => setEdit(null)} onSave={(x) => { saveGoal(x); setEdit(null); toast('Goal updated') }} />
        <Confirm open={!!del} onClose={() => setDel(null)} title="Delete this goal?" body="Your contribution history for this goal will be removed." confirmLabel="Delete goal" onConfirm={() => { deleteGoal(del!.id); setOpen(null); toast('Goal deleted') }} />
      </div>
    )
  }

  return (
    <div>
      <PageHead title="Savings goals" sub="Small weekly amounts, big things." action={<Button icon={P.Plus} onClick={() => setEdit({ id: '', name: '', target: 0, saved: 0, date: '2027-03-31', weekly: 0, kind: 'other', log: [] })}>New goal</Button>} />
      {goals.length === 0 ? <Empty icon={P.Target} title="No goals yet" body="Set a target for a laptop, a trip, or exam fees." /> : (
        <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {goals.map((x) => {
            const s = goalStatus(x); const I = GOAL_ICON[x.kind]
            return (
              <li key={x.id}>
                <Card className="flex h-full flex-col p-5 transition-colors duration-150 hover:border-muted">
                  <div className="flex items-center justify-between"><span className="grid size-11 place-items-center rounded-xl bg-primary-soft text-primary"><I size={24} weight="duotone" /></span><StatusPill tone={s.status === 'behind' ? 'warn' : 'ok'}>{s.status === 'done' ? 'Reached' : s.status === 'ok' ? 'On track' : 'Behind'}</StatusPill></div>
                  <h2 className="mt-4 text-lg font-semibold">{x.name}</h2>
                  <p className="serif mt-1 text-3xl font-medium"><Money v={x.saved} /> <span className="text-sm text-muted">of <Money v={x.target} /></span></p>
                  <div className="mt-3"><Bar value={x.saved} max={x.target} label={`${x.name} progress`} h={10} /></div>
                  <p className="mt-2 text-sm text-muted">{Math.round((x.saved / x.target) * 100)}% · by {fmtDate(x.date, { month: 'short', year: 'numeric' })} · <Money v={s.need} />/week needed</p>
                  <div className="mt-auto flex gap-2 pt-4"><Button size="sm" full icon={P.Plus} onClick={() => { setAmt(''); setAdd(x) }}>Contribute</Button><Button size="sm" variant="secondary" onClick={() => setOpen(x.id)}>Details</Button></div>
                </Card>
              </li>
            )
          })}
        </ul>
      )}
      <Contribute goal={add} amt={amt} setAmt={setAmt} onClose={() => setAdd(null)} onSave={(a) => { contribute(add!.id, a); setAdd(null); toast(`₹${num(a)} added to ${add!.name}`) }} />
      <GoalForm goal={edit} onClose={() => setEdit(null)} onSave={(x) => { saveGoal(x); setEdit(null); toast(x.id ? 'Goal updated' : 'Goal created') }} />
    </div>
  )
}

function Contribute({ goal, amt, setAmt, onClose, onSave }: { goal: Goal | null; amt: string; setAmt: (s: string) => void; onClose: () => void; onSave: (a: number) => void }) {
  const [err, setErr] = useState('')
  const n = Number(amt)
  return (
    <Sheet open={!!goal} onClose={onClose} title={goal ? `Add to ${goal.name}` : ''}>
      <form noValidate onSubmit={(e) => { e.preventDefault(); if (!(n > 0)) return setErr('Enter an amount greater than ₹0'); setErr(''); onSave(n) }} className="space-y-4">
        <Field label="Contribution (₹)" error={err} htmlFor="ca"><input id="ca" data-autofocus inputMode="numeric" className={cx(inputCls, 'serif h-14 text-3xl')} placeholder="0" aria-invalid={!!err} value={amt} onChange={(e) => setAmt(e.target.value.replace(/\D/g, ''))} /></Field>
        <div className="flex gap-2">{[250, 500, 1000].map((q) => <button type="button" key={q} onClick={() => setAmt(String(q))} className="h-10 rounded-full border border-line px-4 text-sm font-medium hover:bg-surface2">₹{q}</button>)}</div>
        {goal && n > 0 && <p className="text-sm text-muted">New total: <b className="text-ink"><Money v={goal.saved + n} /></b> · {Math.min(100, Math.round(((goal.saved + n) / goal.target) * 100))}%</p>}
        <div className="flex gap-3"><Button type="button" variant="secondary" onClick={onClose}>Cancel</Button><Button type="submit" full>Add contribution</Button></div>
      </form>
    </Sheet>
  )
}

function GoalForm({ goal, onClose, onSave }: { goal: Goal | null; onClose: () => void; onSave: (g: Goal) => void }) {
  const [f, setF] = useState<Goal | null>(null)
  const [prev, setPrev] = useState<Goal | null>(null)
  const [err, setErr] = useState<Record<string, string>>({})
  if (goal !== prev) { setPrev(goal); setF(goal); setErr({}) }
  if (!f) return null
  return (
    <Sheet open={!!goal} onClose={onClose} title={f.id ? 'Edit goal' : 'New goal'}>
      <form noValidate className="space-y-4" onSubmit={(e) => { e.preventDefault(); const x: Record<string, string> = {}; if (!f.name.trim()) x.name = 'Name your goal'; if (!(f.target > 0)) x.target = 'Enter a target'; setErr(x); if (!Object.keys(x).length) onSave({ ...f, weekly: f.weekly || Math.ceil(f.target / 26 / 10) * 10 }) }}>
        <Field label="Goal name" error={err.name} htmlFor="gn"><input id="gn" data-autofocus className={inputCls} value={f.name} aria-invalid={!!err.name} onChange={(e) => setF({ ...f, name: e.target.value })} /></Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Target (₹)" error={err.target} htmlFor="gt"><input id="gt" inputMode="numeric" className={inputCls} value={f.target || ''} aria-invalid={!!err.target} onChange={(e) => setF({ ...f, target: Number(e.target.value.replace(/\D/g, '')) })} /></Field>
          <Field label="Target date" htmlFor="gd"><input id="gd" type="date" min={TODAY} className={inputCls} value={f.date} onChange={(e) => setF({ ...f, date: e.target.value })} /></Field>
        </div>
        <Field label="Weekly plan (₹)" htmlFor="gw" hint="Optional. We'll suggest one if empty."><input id="gw" inputMode="numeric" className={inputCls} value={f.weekly || ''} onChange={(e) => setF({ ...f, weekly: Number(e.target.value.replace(/\D/g, '')) })} /></Field>
        <div className="flex gap-3 pt-2"><Button type="button" variant="secondary" onClick={onClose}>Cancel</Button><Button type="submit" full>Save goal</Button></div>
      </form>
    </Sheet>
  )
}

export type { Cat }
