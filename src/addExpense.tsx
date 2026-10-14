import { useEffect, useState } from 'react'
import * as P from '@phosphor-icons/react'
import { CAT_LABEL, TODAY, fmtDate, useApp, type Cat, type Method, type Txn } from './store'
import { Button, CatBadge, CatChips, Chip, Field, Money, Sheet, inputCls, num, cx } from './ui'

export function TxnRow({ t, onClick }: { t: Txn; onClick?: () => void }) {
  return (
    <button onClick={onClick} className="flex w-full items-center gap-3 rounded-lg px-1 py-3 text-left transition-colors duration-150 hover:bg-surface2 focus-visible:bg-surface2 sm:px-2">
      <CatBadge cat={t.cat} />
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[15px] font-semibold">{t.merchant}</span>
        <span className="block truncate text-sm text-muted">{CAT_LABEL[t.cat]} · {t.method} · {fmtDate(t.date)}</span>
      </span>
      <Money v={-t.amount} className="text-[15px] font-semibold" />
    </button>
  )
}

export function AddExpense() {
  const { sheet, closeAdd, addTxn, updateTxn, settings, setSettings, toast, deleteTxn, m } = useApp()
  const edit = sheet?.txn
  const [amount, setAmount] = useState('')
  const [cat, setCat] = useState<Cat | null>(null)
  const [note, setNote] = useState('')
  const [method, setMethod] = useState<Method>('UPI')
  const [date, setDate] = useState(TODAY)
  const [err, setErr] = useState<{ amount?: string; cat?: string; date?: string }>({})
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle')

  useEffect(() => {
    if (!sheet) return
    setAmount(edit ? String(edit.amount) : ''); setCat(edit?.cat ?? null); setNote(edit?.note ?? (edit ? edit.merchant : ''))
    setMethod(edit?.method ?? 'UPI'); setDate(edit?.date ?? TODAY); setErr({}); setStatus('idle')
  }, [sheet, edit])

  const amt = parseFloat(amount) || 0
  const after = Math.floor((m.remaining - (edit ? -edit.amount : 0) - amt - m.unpaid) / m.daysLeft)

  const save = () => {
    const e: typeof err = {}
    if (!(amt > 0)) e.amount = 'Enter an amount greater than ₹0'
    if (!cat) e.cat = 'Pick a category'
    if (date > TODAY) e.date = "Date can't be in the future"
    setErr(e)
    if (Object.keys(e).length) return
    setStatus('loading')
    setTimeout(() => {
      if (settings.failNext) { setSettings({ failNext: false }); setStatus('error'); return }
      const body = { amount: amt, cat: cat!, method, date, merchant: note.trim() || CAT_LABEL[cat!], note: note.trim() || undefined }
      if (edit) { updateTxn({ ...edit, ...body }); toast('Expense updated') }
      else {
        const id = addTxn(body)
        toast(settings.offline ? `₹${num(amt)} saved on this device — will sync when online` : `₹${num(amt)} added to ${CAT_LABEL[cat!]}`, { undo: () => deleteTxn(id) })
      }
      closeAdd()
    }, 650)
  }

  return (
    <Sheet open={!!sheet} onClose={closeAdd} title={edit ? 'Edit expense' : 'Add expense'}>
      <form onSubmit={(e) => { e.preventDefault(); save() }} className="space-y-5" noValidate>
        <div>
          <label htmlFor="amt" className="mb-1 block text-sm font-semibold">Amount</label>
          <div className={cx('flex items-baseline gap-2 rounded-xl border bg-surface px-4 py-3 focus-within:border-primary', err.amount ? 'border-red' : 'border-line')}>
            <span className="serif text-4xl text-muted" aria-hidden>₹</span>
            <input id="amt" data-autofocus inputMode="decimal" autoComplete="off" placeholder="0" aria-invalid={!!err.amount} aria-label="Amount in rupees" value={amount} onChange={(e) => setAmount(e.target.value.replace(/[^\d.]/g, '').replace(/(\..*)\./g, '$1').slice(0, 8))} className="serif num w-full bg-transparent text-5xl font-medium outline-none placeholder:text-line" />
          </div>
          {err.amount && <p role="alert" className="mt-1.5 flex items-center gap-1 text-sm text-red"><P.WarningCircle size={14} weight="fill" />{err.amount}</p>}
          <div className="mt-2 flex gap-2 overflow-x-auto">
            {[50, 100, 200, 500].map((q) => <Chip key={q} onClick={() => setAmount(String(q))}>₹{q}</Chip>)}
          </div>
          {amt > 0 && <p className="mt-2 text-sm text-muted" aria-live="polite">Safe to spend today would become <b className={cx(after < 0 ? 'text-red' : 'text-ink')}><Money v={Math.max(after, 0)} /></b>{after < 0 && ' — this puts you over budget'}.</p>}
        </div>

        <Field label="Category" error={err.cat}><CatChips value={cat} onChange={(c) => { setCat(c); setErr((x) => ({ ...x, cat: undefined })) }} /></Field>

        <Field label="Note (optional)" htmlFor="note"><input id="note" className={inputCls} placeholder="e.g. College Canteen" maxLength={40} value={note} onChange={(e) => setNote(e.target.value)} /></Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Paid with">
            <div role="group" aria-label="Payment method" className="grid grid-cols-2 gap-1 rounded-lg border border-line bg-surface2 p-1">
              {(['UPI', 'Cash'] as Method[]).map((x) => (
                <button type="button" key={x} aria-pressed={method === x} onClick={() => setMethod(x)} className={cx('flex h-9 items-center justify-center gap-1 rounded-md text-sm font-semibold transition-all', method === x ? 'bg-surface shadow-sm' : 'text-muted')}>
                  {x === 'UPI' ? <P.Bank size={15} /> : <P.Money size={15} />}{x}
                </button>
              ))}
            </div>
          </Field>
          <Field label="Date" error={err.date} htmlFor="date"><input id="date" type="date" max={TODAY} className={inputCls} value={date} aria-invalid={!!err.date} onChange={(e) => setDate(e.target.value)} /></Field>
        </div>

        {status === 'error' && (
          <div role="alert" className="flex items-start gap-2 rounded-lg bg-red-soft p-3 text-sm text-red">
            <P.WifiSlash size={18} className="mt-0.5 shrink-0" /><span><b>Couldn't save this expense.</b> Nothing was lost — check your connection and try again.</span>
          </div>
        )}
        <div className="flex gap-3 pt-1">
          <Button type="button" variant="secondary" onClick={closeAdd} className="shrink-0">Close</Button>
          <Button type="submit" full size="lg" loading={status === 'loading'}>{status === 'error' ? 'Try again' : edit ? 'Save changes' : 'Save Expense'}</Button>
        </div>
      </form>
    </Sheet>
  )
}
