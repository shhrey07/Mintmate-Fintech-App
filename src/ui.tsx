import { useEffect, useRef, useState, type ButtonHTMLAttributes, type ComponentType, type ReactNode } from 'react'
import * as P from '@phosphor-icons/react'
import { CAT_COLOR, CAT_LABEL, CATS, useApp, type Cat } from './store'

export type IconC = ComponentType<P.IconProps>
export const cx = (...a: (string | false | undefined | null)[]) => a.filter(Boolean).join(' ')
export const num = (n: number) => (n < 0 ? '−' : '') + Math.abs(Math.round(n)).toLocaleString('en-IN')

export const CAT_ICON: Record<Cat, IconC> = { Food: P.ForkKnife, Transport: P.Bus, Phone: P.DeviceMobile, Entertainment: P.FilmSlate, Shopping: P.ShoppingBag, Study: P.BookOpen, Misc: P.Shapes }

export function Money({ v, className, sign }: { v: number; className?: string; sign?: boolean }) {
  const { settings } = useApp()
  const pre = settings.currency === 'code' ? 'INR ' : '₹'
  if (settings.privacy) return <span className={className} aria-label="Amount hidden">{pre}••••</span>
  return <span className={cx('num', className)}>{sign && v > 0 ? '+' : ''}{v < 0 ? '−' : ''}{pre}{Math.abs(Math.round(v)).toLocaleString('en-IN')}</span>
}

export function CatBadge({ cat, size = 40 }: { cat: Cat; size?: number }) {
  const I = CAT_ICON[cat]
  return (
    <span className="grid shrink-0 place-items-center rounded-xl" style={{ width: size, height: size, background: CAT_COLOR[cat] + '22', color: CAT_COLOR[cat] }} aria-hidden>
      <I size={size * 0.5} weight="duotone" />
    </span>
  )
}

type BtnProps = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'ghost' | 'danger'; size?: 'sm' | 'md' | 'lg'; loading?: boolean; icon?: IconC; full?: boolean }
export function Button({ variant = 'primary', size = 'md', loading, icon: I, full, children, className, disabled, ...r }: BtnProps) {
  const v = {
    primary: 'bg-primary text-primary-fg hover:bg-primary-hover active:scale-[.98] disabled:bg-surface2 disabled:text-muted',
    secondary: 'bg-surface text-ink border border-line hover:bg-surface2 active:scale-[.98] disabled:text-muted disabled:opacity-60',
    ghost: 'text-ink hover:bg-surface2 active:bg-line disabled:text-muted',
    danger: 'bg-red text-bg hover:opacity-90 active:scale-[.98] disabled:opacity-50',
  }[variant]
  const s = { sm: 'h-9 px-3 text-sm', md: 'h-11 px-4 text-[15px]', lg: 'h-[52px] px-6 text-base' }[size]
  return (
    <button {...r} disabled={disabled || loading} aria-busy={loading || undefined} className={cx('inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-all duration-150', v, s, full && 'w-full', className)}>
      {loading ? <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" aria-hidden /> : I && <I size={18} weight="bold" aria-hidden />}
      {children}
    </button>
  )
}

export function IconButton({ label, icon: I, onClick, active, className }: { label: string; icon: IconC; onClick?: () => void; active?: boolean; className?: string }) {
  return (
    <button onClick={onClick} aria-label={label} title={label} aria-pressed={active} className={cx('grid size-11 place-items-center rounded-full border border-line bg-surface text-ink transition-colors duration-150 hover:bg-surface2', active && 'bg-primary-soft text-primary', className)}>
      <I size={20} weight={active ? 'fill' : 'regular'} />
    </button>
  )
}

export function Chip({ selected, onClick, children, icon: I, color }: { selected?: boolean; onClick?: () => void; children: ReactNode; icon?: IconC; color?: string }) {
  return (
    <button type="button" onClick={onClick} aria-pressed={selected} className={cx('inline-flex h-10 shrink-0 items-center gap-1.5 rounded-full border px-3.5 text-sm font-medium transition-all duration-150 active:scale-[.97]', selected ? 'border-primary bg-primary-soft text-ink' : 'border-line bg-surface text-muted hover:bg-surface2 hover:text-ink')}>
      {selected ? <P.Check size={14} weight="bold" className="text-primary" aria-hidden /> : I && <I size={16} style={{ color }} aria-hidden />}
      {children}
    </button>
  )
}

export const inputCls = 'h-11 w-full rounded-lg border border-line bg-surface px-3 text-[15px] text-ink placeholder:text-muted/70 transition-colors duration-150 hover:border-muted focus:border-primary disabled:opacity-50 aria-[invalid=true]:border-red'
export function Field({ label, error, hint, children, htmlFor }: { label: string; error?: string; hint?: string; children: ReactNode; htmlFor?: string }) {
  return (
    <div className="block">
      <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-semibold">{label}</label>
      {children}
      {error ? <p role="alert" className="mt-1.5 flex items-center gap-1 text-sm text-red"><P.WarningCircle size={14} weight="fill" />{error}</p> : hint ? <p className="mt-1.5 text-sm text-muted">{hint}</p> : null}
    </div>
  )
}

export function Card({ children, className, ...r }: { children: ReactNode; className?: string } & React.HTMLAttributes<HTMLDivElement>) {
  return <div {...r} className={cx('rounded-xl border border-line bg-surface', className)}>{children}</div>
}

export function Sheet({ open, onClose, title, children, wide }: { open: boolean; onClose: () => void; title: string; children: ReactNode; wide?: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  const closeRef = useRef(onClose)
  closeRef.current = onClose
  useEffect(() => {
    if (!open) return
    const prev = document.activeElement as HTMLElement | null
    const el = ref.current
    ;(el?.querySelector<HTMLElement>('[data-autofocus]') ?? el)?.focus()
    const key = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeRef.current()
      if (e.key === 'Tab' && el) {
        const f = [...el.querySelectorAll<HTMLElement>('button,input,select,textarea,a[href],[tabindex]:not([tabindex="-1"])')].filter((x) => !x.hasAttribute('disabled'))
        if (!f.length) return
        const first = f[0], last = f[f.length - 1]
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
      }
    }
    document.addEventListener('keydown', key)
    document.body.style.overflow = 'hidden'
    return () => { document.removeEventListener('keydown', key); document.body.style.overflow = ''; prev?.focus?.() }
  }, [open])
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center lg:items-center">
      <div className="fade-in absolute inset-0 bg-black/50" onClick={onClose} aria-hidden />
      <div ref={ref} role="dialog" aria-modal="true" aria-label={title} tabIndex={-1} className={cx('sheet-in relative max-h-[94vh] w-full overflow-y-auto rounded-t-[20px] border border-line bg-bg p-5 shadow-2xl sm:p-6 lg:rounded-[20px]', wide ? 'lg:max-w-[560px]' : 'lg:max-w-[480px]')}>
        <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-line lg:hidden" aria-hidden />
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="serif text-2xl font-medium">{title}</h2>
          <button onClick={onClose} aria-label="Close" className="grid size-10 place-items-center rounded-full text-muted transition-colors hover:bg-surface2 hover:text-ink"><P.X size={20} /></button>
        </div>
        {children}
      </div>
    </div>
  )
}

export function Confirm({ open, title, body, confirmLabel, onConfirm, onClose }: { open: boolean; title: string; body: string; confirmLabel: string; onConfirm: () => void; onClose: () => void }) {
  return (
    <Sheet open={open} onClose={onClose} title={title}>
      <p className="mb-5 text-[15px] text-muted">{body}</p>
      <div className="flex gap-3">
        <Button variant="secondary" full onClick={onClose} data-autofocus>Cancel</Button>
        <Button variant="danger" full onClick={() => { onConfirm(); onClose() }}>{confirmLabel}</Button>
      </div>
    </Sheet>
  )
}

export function Toasts() {
  const { toasts, dismiss } = useApp()
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-24 z-[60] flex flex-col items-center gap-2 px-4 lg:bottom-6" role="status" aria-live="polite">
      {toasts.map((t) => (
        <div key={t.id} className="rise pointer-events-auto flex w-full max-w-[420px] items-center gap-3 rounded-xl bg-ink px-4 py-3 text-bg shadow-xl">
          {t.tone === 'error' ? <P.WarningCircle size={20} weight="fill" /> : <P.CheckCircle size={20} weight="fill" />}
          <span className="flex-1 text-sm font-medium">{t.msg}</span>
          {t.undo && <button onClick={() => { t.undo!(); dismiss(t.id) }} className="flex h-9 items-center gap-1 rounded-md px-2 text-sm font-bold underline underline-offset-2"><P.ArrowCounterClockwise size={14} weight="bold" />Undo</button>}
          <button onClick={() => dismiss(t.id)} aria-label="Dismiss" className="grid size-8 place-items-center rounded-full opacity-70 hover:opacity-100"><P.X size={14} /></button>
        </div>
      ))}
    </div>
  )
}

export function Switch({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button role="switch" aria-checked={checked} aria-label={label} onClick={() => onChange(!checked)} className={cx('relative h-7 w-12 shrink-0 rounded-full border transition-colors duration-200', checked ? 'border-primary bg-primary' : 'border-line bg-surface2')}>
      <span className={cx('absolute top-0.5 grid size-6 place-items-center rounded-full bg-white shadow transition-all duration-200', checked ? 'left-[22px]' : 'left-0.5')}>
        {checked && <P.Check size={12} weight="bold" className="text-primary" />}
      </span>
    </button>
  )
}

export function Segmented<T extends string>({ options, value, onChange, label }: { options: { v: T; l: string }[]; value: T; onChange: (v: T) => void; label: string }) {
  return (
    <div role="group" aria-label={label} className="inline-flex rounded-lg border border-line bg-surface2 p-1">
      {options.map((o) => (
        <button key={o.v} aria-pressed={value === o.v} onClick={() => onChange(o.v)} className={cx('h-9 rounded-md px-3.5 text-sm font-semibold transition-all duration-150', value === o.v ? 'bg-surface text-ink shadow-sm' : 'text-muted hover:text-ink')}>{o.l}</button>
      ))}
    </div>
  )
}

export const toneFor = (pct: number) => (pct >= 100 ? 'over' : pct >= 85 ? 'warn' : 'ok')
export const toneText = { ok: 'On track', warn: 'Watch', over: 'Over limit' }
export function Bar({ value, max, tone, label, h = 8, color }: { value: number; max: number; tone?: 'ok' | 'warn' | 'over'; label: string; h?: number; color?: string }) {
  const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0
  const bg = color ?? (tone === 'over' ? 'var(--red)' : tone === 'warn' ? 'var(--amber)' : 'var(--primary)')
  return (
    <div role="progressbar" aria-label={label} aria-valuemin={0} aria-valuemax={max} aria-valuenow={Math.min(value, max)} className="w-full overflow-hidden rounded-full bg-surface2" style={{ height: h }}>
      <div className="h-full rounded-full transition-[width] duration-500" style={{ width: pct + '%', background: bg, backgroundImage: tone === 'over' ? 'repeating-linear-gradient(45deg,transparent 0 4px,rgba(255,255,255,.35) 4px 8px)' : tone === 'warn' ? 'repeating-linear-gradient(45deg,transparent 0 6px,rgba(255,255,255,.22) 6px 9px)' : undefined }} />
    </div>
  )
}

export function StatusPill({ tone, children }: { tone: 'ok' | 'warn' | 'over' | 'info'; children: ReactNode }) {
  const c = { ok: 'bg-primary-soft text-primary', warn: 'bg-amber-soft text-amber', over: 'bg-red-soft text-red', info: 'bg-surface2 text-muted' }[tone]
  const I = { ok: P.CheckCircle, warn: P.Warning, over: P.WarningOctagon, info: P.Info }[tone]
  return <span className={cx('inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold', c)}><I size={13} weight="fill" aria-hidden />{children}</span>
}

export function Empty({ icon: I, title, body, action }: { icon: IconC; title: string; body: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center rounded-xl border border-dashed border-line px-6 py-10 text-center">
      <span className="mb-3 grid size-12 place-items-center rounded-full bg-primary-soft text-primary"><I size={24} weight="duotone" /></span>
      <h3 className="serif text-xl font-medium">{title}</h3>
      <p className="mt-1 max-w-[320px] text-sm text-muted">{body}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}

export const Skeleton = ({ className }: { className?: string }) => <div aria-hidden className={cx('animate-pulse rounded-lg bg-surface2', className)} />

export function PageHead({ title, sub, action, back }: { title: string; sub?: string; action?: ReactNode; back?: () => void }) {
  return (
    <div className="mb-6 flex items-end justify-between gap-4">
      <div className="min-w-0">
        {back && <button onClick={back} className="mb-2 -ml-2 inline-flex h-9 items-center gap-1 rounded-md px-2 text-sm font-semibold text-muted hover:text-ink"><P.ArrowLeft size={16} weight="bold" />Back</button>}
        <h1 className="serif text-[34px] font-medium leading-none lg:text-[44px]">{title}</h1>
        {sub && <p className="mt-2 text-[15px] text-muted">{sub}</p>}
      </div>
      {action}
    </div>
  )
}

export function Select({ value, onChange, options, label }: { value: string; onChange: (v: string) => void; options: { v: string; l: string }[]; label: string }) {
  return (
    <div className="relative">
      <select aria-label={label} value={value} onChange={(e) => onChange(e.target.value)} className={cx(inputCls, 'appearance-none pr-9')}>
        {options.map((o) => <option key={o.v} value={o.v}>{o.l}</option>)}
      </select>
      <P.CaretDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted" aria-hidden />
    </div>
  )
}

export function CatChips({ value, onChange }: { value: Cat | null; onChange: (c: Cat) => void }) {
  return (
    <div role="group" aria-label="Category" className="flex flex-wrap gap-2">
      {CATS.map((c) => <Chip key={c} selected={value === c} icon={CAT_ICON[c]} color={CAT_COLOR[c]} onClick={() => onChange(c)}>{CAT_LABEL[c]}</Chip>)}
    </div>
  )
}

export function Disclosure({ summary, children }: { summary: string; children: ReactNode }) {
  const [o, setO] = useState(false)
  return (
    <div>
      <button aria-expanded={o} onClick={() => setO(!o)} className="inline-flex h-9 items-center gap-1 text-sm font-semibold underline underline-offset-4 opacity-90 hover:opacity-100"><P.Info size={15} />{summary}</button>
      {o && <div className="rise mt-1 text-sm opacity-90">{children}</div>}
    </div>
  )
}

export function BarChart({ data, labelKey, valueKey, activeIndex, caption }: { data: { label: string; value: number; partial?: boolean }[]; labelKey?: string; valueKey?: string; activeIndex: number; caption: string }) {
  const max = Math.max(...data.map((d) => d.value)) * 1.15 || 1
  return (
    <figure>
      <div className="flex h-[200px] items-end gap-2 sm:gap-4" role="img" aria-label={caption}>
        {data.map((d, i) => (
          <div key={d.label} className="flex h-full flex-1 flex-col justify-end text-center">
            <span className="num mb-1 text-xs font-semibold">{d.value >= 1000 ? (d.value / 1000).toFixed(1) + 'k' : d.value}</span>
            <div className="rounded-t-md transition-all duration-500" style={{ height: (d.value / max) * 150, background: i === activeIndex ? 'var(--primary)' : 'var(--line)', backgroundImage: d.partial ? 'repeating-linear-gradient(45deg,transparent 0 5px,rgba(255,255,255,.35) 5px 9px)' : undefined }} />
            <span className={cx('mt-2 text-xs', i === activeIndex ? 'font-bold' : 'text-muted')}>{d.label}{d.partial ? '*' : ''}</span>
          </div>
        ))}
      </div>
      <table className="sr-only"><caption>{caption}</caption><thead><tr><th>{labelKey ?? 'Period'}</th><th>{valueKey ?? 'Spent (INR)'}</th></tr></thead><tbody>{data.map((d) => <tr key={d.label}><td>{d.label}</td><td>{d.value}</td></tr>)}</tbody></table>
    </figure>
  )
}
