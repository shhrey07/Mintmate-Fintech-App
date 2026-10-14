import { useEffect, useState } from 'react'
import * as P from '@phosphor-icons/react'
import { CATS, CAT_LABEL, PERIOD, TODAY, daysBetween, fmtDate, useApp, type Cat } from './store'
import { TxnRow } from './addExpense'
import { Bar, Button, CatBadge, Card, Chip, Disclosure, Empty, IconButton, Money, Sheet, Skeleton, StatusPill, cx, toneFor, toneText, num } from './ui'

export function dueText(due: string) {
  const n = daysBetween(TODAY, due)
  return n < 0 ? `Overdue by ${-n} day${n === -1 ? '' : 's'}` : n === 0 ? 'Due today' : `Due in ${n} day${n === 1 ? '' : 's'}`
}

function Alerts({ onAdjust }: { onAdjust: () => void }) {
  const { m, limits, bills, nav } = useApp()
  const overdue = bills.filter((b) => !b.paid && b.due < TODAY)
  const items: { tone: 'warn' | 'over'; text: string; action?: React.ReactNode }[] = []
  if (m.status === 'over') items.push({ tone: 'over', text: `You've used the whole budget for this period. ${m.daysLeft} days to go, so hold non-essentials.`, action: <Button size="sm" variant="secondary" onClick={onAdjust}>Review budget adjustment</Button> })
  m.hot.forEach((c) => {
    const p = Math.round((m.byCat[c] / limits[c]) * 100)
    items.push({ tone: p >= 100 ? 'over' : 'warn', text: `${CAT_LABEL[c]} is at ${p}% with ${m.daysLeft} days left.`, action: m.status !== 'over' ? <Button size="sm" variant="secondary" onClick={onAdjust}>Review budget adjustment</Button> : undefined })
  })
  overdue.forEach((b) => items.push({ tone: 'warn', text: `${b.name} (₹${num(b.amount)}) is overdue.`, action: <Button size="sm" variant="secondary" onClick={() => nav('bills')}>Open bills</Button> }))
  if (!items.length) return null
  return (
    <div className="space-y-2" aria-label="Warnings">
      {items.slice(0, 3).map((a, i) => (
        <div key={i} className={cx('flex flex-wrap items-center gap-x-3 gap-y-2 rounded-xl p-3.5 pl-4', a.tone === 'over' ? 'bg-red-soft text-red' : 'bg-amber-soft text-amber')}>
          {a.tone === 'over' ? <P.WarningOctagon size={20} weight="fill" /> : <P.Warning size={20} weight="fill" />}
          <p className="min-w-[180px] flex-1 text-[15px] font-semibold">{a.text}</p>
          {a.action}
        </div>
      ))}
    </div>
  )
}

function AdjustSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { limits, setLimits, m, toast } = useApp()
  const target = (m.hot[0] ?? 'Food') as Cat
  const donors = CATS.filter((c) => c !== target).map((c) => ({ c, spare: limits[c] - m.byCat[c] })).filter((x) => x.spare > 100).sort((a, b) => b.spare - a.spare)
  const [from, setFrom] = useState<Cat | null>(null)
  const [amt, setAmt] = useState(300)
  useEffect(() => { if (open) { setFrom(donors[0]?.c ?? null); setAmt(300) } }, [open]) // eslint-disable-line
  const spare = from ? limits[from] - m.byCat[from] : 0
  return (
    <Sheet open={open} onClose={onClose} title="Review budget adjustment">
      <p className="mb-4 text-[15px] text-muted">Move unused money into <b className="text-ink">{CAT_LABEL[target]}</b>. Your total budget stays the same.</p>
      {donors.length === 0 ? <p className="rounded-lg bg-surface2 p-3 text-sm">No category has spare room right now. You could trim goals or pause a subscription instead.</p> : (
        <>
          <p className="mb-2 text-sm font-semibold">Take from</p>
          <div className="mb-4 flex flex-wrap gap-2">{donors.map((d) => <Chip key={d.c} selected={from === d.c} onClick={() => { setFrom(d.c); setAmt(Math.min(amt, d.spare)) }}>{CAT_LABEL[d.c]} · ₹{num(d.spare)} spare</Chip>)}</div>
          <p className="mb-2 text-sm font-semibold">Amount</p>
          <div className="mb-5 flex flex-wrap gap-2">{[200, 300, 500].filter((a) => a <= spare).map((a) => <Chip key={a} selected={amt === a} onClick={() => setAmt(a)}>₹{a}</Chip>)}</div>
          <Card className="mb-5 p-3.5 text-sm">
            <div className="flex justify-between"><span>{CAT_LABEL[target]} limit</span><span className="num font-semibold">₹{num(limits[target])} → ₹{num(limits[target] + amt)}</span></div>
            {from && <div className="mt-1 flex justify-between text-muted"><span>{CAT_LABEL[from]} limit</span><span className="num">₹{num(limits[from])} → ₹{num(limits[from] - amt)}</span></div>}
          </Card>
          <div className="flex gap-3">
            <Button variant="secondary" onClick={onClose}>Not now</Button>
            <Button full disabled={!from || amt > spare} onClick={() => { setLimits({ ...limits, [target]: limits[target] + amt, [from!]: limits[from!] - amt }); toast(`Moved ₹${num(amt)} to ${CAT_LABEL[target]}`); onClose() }}>Apply adjustment</Button>
          </div>
        </>
      )}
    </Sheet>
  )
}

function Notifications({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { m, bills, settings, limits } = useApp()
  const rows: { icon: P.Icon; text: string }[] = []
  if (settings.notifs.budget) m.hot.forEach((c) => rows.push({ icon: P.Warning, text: `${CAT_LABEL[c]} reached ${Math.round((m.byCat[c] / limits[c]) * 100)}% of its limit.` }))
  if (settings.notifs.bills) bills.filter((b) => !b.paid).forEach((b) => rows.push({ icon: P.Receipt, text: `${b.name}: ${dueText(b.due).toLowerCase()} · ₹${num(b.amount)}` }))
  if (settings.notifs.weekly) rows.push({ icon: P.ChartBar, text: 'Your weekly summary is ready in Insights.' })
  return (
    <Sheet open={open} onClose={onClose} title="Notifications">
      {rows.length === 0 ? <Empty icon={P.BellSlash} title="All quiet" body="Nothing needs your attention right now." /> : <ul className="divide-y divide-line">{rows.map((r, i) => <li key={i} className="flex items-center gap-3 py-3 text-[15px]"><r.icon size={20} className="text-primary" />{r.text}</li>)}</ul>}
    </Sheet>
  )
}

export default function Home() {
  const { profile, m, limits, txns, bills, goals, nav, openAdd, settings, setSettings, payBill, t, resetDemo } = useApp()
  const [loading, setLoading] = useState(true)
  const [adjust, setAdjust] = useState(false)
  const [notif, setNotif] = useState(false)
  useEffect(() => { const x = setTimeout(() => setLoading(false), 450); return () => clearTimeout(x) }, [])

  const bill = [...bills].filter((b) => !b.paid).sort((a, b) => a.due.localeCompare(b.due))[0]
  const goal = goals[0]
  const weeksLeft = goal ? Math.max(1, Math.ceil(daysBetween(TODAY, goal.date) / 7)) : 1
  const status = m.status
  const heroTone = status === 'over' ? 'over' : status === 'warning' ? 'warn' : 'ok'

  const header = (
    <header className="mb-6 flex items-start justify-between gap-3">
      <div>
        <p className="text-sm font-medium text-muted">{t('Good morning')}, {profile.name}</p>
        <h1 className="serif mt-0.5 text-[28px] font-medium leading-tight lg:text-[34px]">Day {m.dayNo} of {PERIOD.days}</h1>
        <p className="mt-0.5 flex items-center gap-1.5 text-sm text-muted"><P.CalendarBlank size={14} />{PERIOD.label}</p>
      </div>
      <div className="flex items-center gap-2">
        <IconButton label={settings.privacy ? 'Show amounts' : 'Hide amounts'} icon={settings.privacy ? P.EyeSlash : P.Eye} active={settings.privacy} onClick={() => setSettings({ privacy: !settings.privacy })} />
        <div className="relative">
          <IconButton label="Notifications" icon={P.Bell} onClick={() => setNotif(true)} />
          {(m.hot.length > 0 || bills.some((b) => !b.paid)) && <span className="absolute right-1 top-1 size-2.5 rounded-full bg-amber ring-2 ring-bg" aria-hidden />}
        </div>
        <button onClick={() => nav('settings')} aria-label="Profile and settings" className="grid size-11 place-items-center rounded-full bg-primary text-sm font-bold text-primary-fg">{profile.name[0]}</button>
      </div>
    </header>
  )

  if (loading) return (
    <div>{header}<Skeleton className="h-[300px] rounded-[20px]" /><div className="mt-4 grid gap-4 lg:grid-cols-2"><Skeleton className="h-64" /><Skeleton className="h-64" /></div></div>
  )

  const shown = Math.max(m.safe, 0)
  return (
    <div>
      {header}
      {settings.offline && (
        <div role="status" className="mb-4 flex items-center gap-2 rounded-xl border border-line bg-surface2 p-3 text-sm"><P.WifiSlash size={18} /><span><b>You're offline.</b> New expenses are kept on this device and sync when you reconnect.</span></div>
      )}
      <div className="grid gap-5 lg:grid-cols-[1.35fr_1fr] lg:gap-6">
        <div className="space-y-5">
          {status === 'empty' ? (
            <Card className="p-6 lg:p-8">
              <p className="text-sm font-semibold text-muted">{t('Safe to spend today')}</p>
              <p className="serif mt-2 text-3xl font-medium lg:text-4xl">A fresh month, <span className="text-primary">₹<span className="num">{num(m.budget)}</span></span> to work with.</p>
              <p className="mt-2 max-w-[440px] text-[15px] text-muted">Add your first expense and MintMate will work out what's safe to spend each day for the rest of the period.</p>
              <div className="mt-5 flex flex-wrap gap-3"><Button icon={P.Plus} onClick={() => openAdd()}>{t('Add expense')}</Button><Button variant="secondary" onClick={resetDemo}>Load sample data</Button></div>
            </Card>
          ) : (
            <section aria-label="Safe to spend today" className="relative overflow-hidden rounded-[20px] bg-hero p-6 text-hero-fg lg:p-8">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold tracking-wide opacity-80">{t('Safe to spend today')}</p>
                <span className={cx('inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold', heroTone === 'ok' ? 'bg-white/15' : heroTone === 'warn' ? 'bg-[#f0b45a] text-[#2b1a00]' : 'bg-[#f08a82] text-[#33100d]')}>
                  {heroTone === 'ok' ? <P.CheckCircle size={13} weight="fill" /> : <P.Warning size={13} weight="fill" />}{status === 'over' ? 'Over budget' : status === 'warning' ? 'Tight' : 'On track'}
                </span>
              </div>
              <p className="serif mt-3 text-[72px] font-medium leading-none lg:text-[96px]"><Money v={shown} /></p>
              <p className="mt-3 text-[15px] opacity-85">{status === 'over' ? `You're ₹${num(-(m.remaining - m.unpaid))} past what's available. Try to spend nothing extra today.` : <>for each of the next <b>{m.daysLeft} days</b> · {m.daysLeft} left in this period</>}</p>
              <div className="mt-2"><Disclosure summary="How is this calculated?">(<Money v={m.remaining} /> left − <Money v={m.unpaid} /> in unpaid bills) ÷ {m.daysLeft} days remaining, rounded down. Simulated in this prototype.</Disclosure></div>

              <dl className="mt-6 grid grid-cols-3 gap-3 border-t border-white/15 pt-5">
                {[[t('Budget'), m.budget], [t('Spent'), m.spent], [t('Left'), m.remaining]].map(([l, v]) => (
                  <div key={l as string}><dt className="text-xs font-semibold uppercase tracking-wider opacity-70">{l}</dt><dd className="serif mt-1 text-xl font-medium lg:text-2xl"><Money v={v as number} /></dd></div>
                ))}
              </dl>
              <div className="mt-5 space-y-2.5 text-xs font-medium opacity-90">
                <div><div className="mb-1 flex justify-between"><span>Spent so far</span><span className="num">{m.pct}% of budget</span></div><div role="progressbar" aria-label="Budget used" aria-valuenow={m.pct} aria-valuemin={0} aria-valuemax={100} className="h-2 rounded-full bg-white/15"><div className="h-full rounded-full bg-hero-fg transition-all duration-500" style={{ width: Math.min(m.pct, 100) + '%' }} /></div></div>
                <div><div className="mb-1 flex justify-between"><span>Period elapsed</span><span className="num">{m.periodPct}%</span></div><div role="progressbar" aria-label="Period elapsed" aria-valuenow={m.periodPct} aria-valuemin={0} aria-valuemax={100} className="h-2 rounded-full bg-white/15"><div className="h-full rounded-full bg-white/50" style={{ width: m.periodPct + '%' }} /></div></div>
              </div>
              <button onClick={() => openAdd()} className="mt-6 hidden h-12 items-center gap-2 rounded-lg bg-hero-fg px-5 font-semibold text-hero transition-transform duration-150 hover:scale-[1.02] active:scale-[.98] lg:inline-flex"><P.Plus size={18} weight="bold" />{t('Add expense')}</button>
            </section>
          )}

          <Alerts onAdjust={() => setAdjust(true)} />

          <Card className="p-5">
            <div className="mb-4 flex items-center justify-between"><h2 className="serif text-xl font-medium">Category budgets</h2><button onClick={() => nav('settings')} className="text-sm font-semibold text-primary">Edit limits</button></div>
            <ul className="space-y-4">
              {CATS.map((c) => {
                const p = Math.round((m.byCat[c] / limits[c]) * 100); const tone = toneFor(p)
                return (
                  <li key={c}>
                    <div className="mb-1.5 flex items-center gap-3">
                      <CatBadge cat={c} size={32} />
                      <span className="flex-1 text-[15px] font-semibold">{CAT_LABEL[c]}</span>
                      <span className="text-sm text-muted"><Money v={m.byCat[c]} className="font-semibold text-ink" /> / <Money v={limits[c]} /></span>
                    </div>
                    <Bar value={m.byCat[c]} max={limits[c]} tone={tone} label={`${CAT_LABEL[c]} spending`} />
                    <p className={cx('mt-1 text-xs font-semibold', tone === 'ok' ? 'text-muted' : tone === 'warn' ? 'text-amber' : 'text-red')}>{p}% · {toneText[tone]}</p>
                  </li>
                )
              })}
            </ul>
          </Card>
        </div>

        <div className="space-y-5">
          {bill && (
            <Card className="p-5">
              <div className="mb-3 flex items-center justify-between"><h2 className="serif text-xl font-medium">{t('Upcoming bill')}</h2><StatusPill tone={bill.due < TODAY ? 'over' : 'info'}>{dueText(bill.due)}</StatusPill></div>
              <div className="flex items-center gap-3">
                <CatBadge cat={bill.cat} />
                <div className="min-w-0 flex-1"><p className="truncate font-semibold">{bill.name}</p><p className="text-sm text-muted">{fmtDate(bill.due, { day: 'numeric', month: 'short' })} · {bill.recurring}</p></div>
                <Money v={bill.amount} className="serif text-2xl font-medium" />
              </div>
              <Button full variant="secondary" className="mt-4" icon={P.Check} onClick={() => payBill(bill.id)}>{t('Mark as paid')}</Button>
            </Card>
          )}
          {goal && (
            <Card className="p-5">
              <div className="mb-3 flex items-center justify-between"><h2 className="serif text-xl font-medium">{t('Savings goal')}</h2><button onClick={() => nav('goals')} className="text-sm font-semibold text-primary">All goals</button></div>
              <div className="flex items-baseline justify-between"><p className="font-semibold">{goal.name}</p><p className="text-sm text-muted">Target <Money v={goal.target} /></p></div>
              <p className="serif mt-1 text-3xl font-medium"><Money v={goal.saved} /> <span className="text-base text-muted">· {Math.round((goal.saved / goal.target) * 100)}%</span></p>
              <div className="mt-3"><Bar value={goal.saved} max={goal.target} label={`${goal.name} progress`} h={10} /></div>
              <p className="mt-2 text-sm text-muted">Save <b className="text-ink"><Money v={Math.ceil((goal.target - goal.saved) / weeksLeft / 10) * 10} /></b> a week to reach it by {fmtDate(goal.date, { month: 'short', year: 'numeric' })}.</p>
            </Card>
          )}
          <Card className="p-5">
            <div className="mb-2 flex items-center justify-between"><h2 className="serif text-xl font-medium">{t('Recent transactions')}</h2><button onClick={() => nav('transactions')} className="text-sm font-semibold text-primary">View all</button></div>
            {txns.length === 0 ? <Empty icon={P.Receipt} title="No expenses yet" body="Your latest spending will show up here." action={<Button size="sm" icon={P.Plus} onClick={() => openAdd()}>Add expense</Button>} /> : (
              <ul className="divide-y divide-line">{[...txns].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5).map((x) => <li key={x.id}><TxnRow t={x} onClick={() => openAdd(x)} /></li>)}</ul>
            )}
          </Card>
        </div>
      </div>
      <AdjustSheet open={adjust} onClose={() => setAdjust(false)} />
      <Notifications open={notif} onClose={() => setNotif(false)} />
    </div>
  )
}
