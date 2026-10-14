import { useState } from 'react'
import * as P from '@phosphor-icons/react'
import { CATS, CAT_COLOR, CAT_LABEL, useApp, type Cat } from './store'
import { Bar, Button, Chip, Field, inputCls, cx, num } from './ui'
import { Wordmark } from './site'

export default function Onboarding() {
  const { setView, finishOnboarding } = useApp()
  const [step, setStep] = useState(0)
  const [name, setName] = useState('')
  const [type, setType] = useState('Allowance')
  const [income, setIncome] = useState('12000')
  const [day, setDay] = useState('1')
  const [goal, setGoal] = useState('')
  const [goalAmt, setGoalAmt] = useState('')
  const [err, setErr] = useState<Record<string, string>>({})
  const inc = Number(income) || 0
  const [al, setAl] = useState<Record<Cat, string>>({ Food: '4500', Transport: '1500', Phone: '600', Entertainment: '1200', Shopping: '1500', Study: '1500', Misc: '700' })
  const used = CATS.reduce((a, c) => a + (Number(al[c]) || 0), 0)
  const left = inc - used

  const next1 = () => {
    const e: Record<string, string> = {}
    if (!name.trim()) e.name = 'Tell us what to call you'
    if (!(inc > 0)) e.income = 'Enter your monthly amount'
    const d = Number(day); if (!(d >= 1 && d <= 28)) e.day = 'Pick a day from 1 to 28'
    setErr(e); if (!Object.keys(e).length) setStep(2)
  }
  const stepper = (c: Cat, dlt: number) => setAl({ ...al, [c]: String(Math.max(0, (Number(al[c]) || 0) + dlt)) })

  return (
    <div className="mx-auto flex min-h-screen max-w-[560px] flex-col px-5 py-6">
      <div className="mb-8 flex items-center justify-between">
        {step > 0 && step < 3 ? <button onClick={() => setStep(step - 1)} className="inline-flex h-10 items-center gap-1 rounded-md pr-2 text-sm font-semibold text-muted hover:text-ink"><P.ArrowLeft size={16} weight="bold" />Back</button> : <span />}
        <Wordmark />
        <button onClick={() => setView('site')} aria-label="Close onboarding" className="grid size-10 place-items-center rounded-full text-muted hover:bg-surface2"><P.X size={18} /></button>
      </div>
      {step > 0 && step < 3 && <div className="mb-6 flex gap-1.5" aria-label={`Step ${step} of 2`}>{[1, 2].map((s) => <span key={s} className={cx('h-1 flex-1 rounded-full', s <= step ? 'bg-primary' : 'bg-line')} />)}</div>}

      {step === 0 && (
        <div className="rise flex flex-1 flex-col justify-center pb-10">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[.14em] text-primary">Your allowance, all month.</p>
          <h1 className="serif text-[52px] font-medium leading-[1.02] sm:text-[64px]">Make your money last all month.</h1>
          <p className="mt-5 text-lg text-muted">Know what's safe to spend today. Set up takes about a minute.</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row"><Button size="lg" onClick={() => setStep(1)} icon={P.ArrowRight}>Get Started</Button><Button size="lg" variant="secondary" onClick={() => setView('app')}>Explore Demo</Button></div>
        </div>
      )}

      {step === 1 && (
        <form noValidate className="rise space-y-5" onSubmit={(e) => { e.preventDefault(); next1() }}>
          <h1 className="serif text-4xl font-medium">A little about you</h1>
          <Field label="First name" error={err.name} htmlFor="on"><input id="on" data-autofocus autoFocus className={inputCls} aria-invalid={!!err.name} value={name} onChange={(e) => setName(e.target.value.toUpperCase())} placeholder="e.g. Riya" /></Field>
          <Field label="Where does your money come from?"><div className="flex flex-wrap gap-2">{['Allowance', 'Part-time job', 'Stipend', 'Mixed'].map((t) => <Chip key={t} selected={type === t} onClick={() => setType(t)}>{t}</Chip>)}</div></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Monthly amount (₹)" error={err.income} htmlFor="oi"><input id="oi" inputMode="numeric" className={inputCls} aria-invalid={!!err.income} value={income} onChange={(e) => setIncome(e.target.value.replace(/\D/g, ''))} /></Field>
            <Field label="Budget starts on day" error={err.day} htmlFor="od" hint="of each month"><input id="od" inputMode="numeric" className={inputCls} aria-invalid={!!err.day} value={day} onChange={(e) => setDay(e.target.value.replace(/\D/g, ''))} /></Field>
          </div>
          <div className="grid grid-cols-[1.4fr_1fr] gap-3">
            <Field label="Savings goal (optional)" htmlFor="og"><input id="og" className={inputCls} placeholder="e.g. Laptop" value={goal} onChange={(e) => setGoal(e.target.value)} /></Field>
            <Field label="Target (₹)" htmlFor="oa"><input id="oa" inputMode="numeric" className={inputCls} value={goalAmt} onChange={(e) => setGoalAmt(e.target.value.replace(/\D/g, ''))} /></Field>
          </div>
          <Button type="submit" size="lg" full>Continue</Button>
        </form>
      )}

      {step === 2 && (
        <div className="rise">
          <h1 className="serif text-4xl font-medium">Split your ₹{num(inc)}</h1>
          <p className="mb-5 mt-1 text-muted">Give every rupee a job. You can change this any time.</p>
          <ul className="space-y-2.5">
            {CATS.map((c) => (
              <li key={c} className="flex items-center gap-2">
                <span className="size-2.5 rounded-full" style={{ background: CAT_COLOR[c] }} aria-hidden />
                <label htmlFor={'oa' + c} className="flex-1 text-[15px] font-semibold">{CAT_LABEL[c]}</label>
                <button type="button" aria-label={`Decrease ${CAT_LABEL[c]} by 100`} onClick={() => stepper(c, -100)} className="grid size-10 place-items-center rounded-full border border-line hover:bg-surface2"><P.Minus size={14} weight="bold" /></button>
                <input id={'oa' + c} inputMode="numeric" className={cx(inputCls, 'num w-24 text-center')} value={al[c]} onChange={(e) => setAl({ ...al, [c]: e.target.value.replace(/\D/g, '') })} />
                <button type="button" aria-label={`Increase ${CAT_LABEL[c]} by 100`} onClick={() => stepper(c, 100)} className="grid size-10 place-items-center rounded-full border border-line hover:bg-surface2"><P.Plus size={14} weight="bold" /></button>
              </li>
            ))}
          </ul>
          <div className="mt-5 rounded-xl bg-surface2 p-4" aria-live="polite">
            <div className="mb-2 flex justify-between text-sm"><span>Allocated <b className="num">₹{num(used)}</b></span><span className={left < 0 ? 'font-bold text-red' : ''}>{left < 0 ? 'Over by' : 'Unallocated'} <b className="num">₹{num(Math.abs(left))}</b></span></div>
            <Bar value={used} max={inc} tone={left < 0 ? 'over' : 'ok'} label="Income allocated" />
          </div>
          <Button size="lg" full className="mt-5" disabled={left < 0} onClick={() => setStep(3)}>Continue</Button>
          {left < 0 && <p role="alert" className="mt-2 text-sm text-red">You've allocated more than you have. Trim a category to continue.</p>}
        </div>
      )}

      {step === 3 && (
        <div className="rise flex flex-1 flex-col justify-center pb-10">
          <span className="mb-4 grid size-14 place-items-center rounded-full bg-primary-soft text-primary"><P.CheckCircle size={32} weight="fill" /></span>
          <h1 className="serif text-5xl font-medium leading-tight">You're set, {name || 'friend'}.</h1>
          <p className="mt-3 text-lg text-muted">₹{num(inc)} a month, starting on day {day}{goal ? `, with ${goal} as your goal` : ''}. ₹{num(Math.max(0, left))} is left unallocated as a buffer.</p>
          <Button size="lg" className="mt-8" icon={P.ArrowRight} onClick={() => finishOnboarding({ name: name.trim() || 'Friend', income: inc, incomeType: type, startDay: Number(day) || 1 }, Object.fromEntries(CATS.map((c) => [c, Number(al[c]) || 0])) as Record<Cat, number>, goal.trim() && Number(goalAmt) > 0 ? { name: goal.trim(), target: Number(goalAmt) } : undefined)}>View My Budget</Button>
        </div>
      )}
    </div>
  )
}
