import { useState } from 'react'
import * as P from '@phosphor-icons/react'
import { CATS, CAT_COLOR, CAT_LABEL, useApp } from './store'
import { Bar, Button, CatBadge, Card, cx } from './ui'

function HandsMoneyIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 860 901" className={className}>
      <path fill="currentColor" fillRule="evenodd" d="M 393 43 L 343 56 L 295 80 L 267 101 L 226 146 L 202 188 L 185 240 L 182 267 L 184 333 L 196 376 L 220 424 L 248 460 L 282 490 L 327 516 L 366 530 L 408 537 L 465 536 L 512 524 L 557 503 L 602 469 L 630 437 L 653 399 L 670 354 L 677 311 L 676 254 L 662 200 L 644 163 L 616 125 L 574 87 L 537 65 L 486 47 L 448 41 Z M 403 90 L 450 90 L 479 95 L 512 107 L 551 130 L 585 163 L 602 187 L 617 218 L 628 259 L 630 300 L 625 335 L 614 368 L 593 405 L 559 442 L 536 459 L 503 476 L 465 487 L 411 489 L 384 485 L 349 473 L 314 453 L 287 430 L 258 393 L 244 366 L 231 321 L 230 269 L 235 239 L 245 210 L 265 175 L 295 141 L 321 121 L 356 103 Z M 422 136 L 420 152 L 386 164 L 373 176 L 362 193 L 358 215 L 360 240 L 372 265 L 389 280 L 422 296 L 421 363 L 415 364 L 405 354 L 393 330 L 356 333 L 351 337 L 360 365 L 370 380 L 386 394 L 421 407 L 422 436 L 444 436 L 444 407 L 470 398 L 489 386 L 505 367 L 514 340 L 513 313 L 501 286 L 479 268 L 444 254 L 445 192 L 447 189 L 457 197 L 466 215 L 507 208 L 498 184 L 484 168 L 465 157 L 446 153 L 444 136 Z M 445 302 L 463 310 L 474 328 L 471 350 L 450 369 L 445 365 Z M 419 188 L 422 190 L 421 248 L 406 238 L 398 223 L 402 203 Z M 35 424 L 30 460 L 35 531 L 50 581 L 74 621 L 117 664 L 212 737 L 249 772 L 268 802 L 277 839 L 369 839 L 382 796 L 383 750 L 373 711 L 354 679 L 320 646 L 222 571 L 158 512 L 128 514 L 121 523 L 122 535 L 146 579 L 200 639 L 169 630 L 133 609 L 110 587 L 93 560 L 84 533 L 74 468 L 66 443 L 53 430 Z M 823 424 L 809 428 L 794 441 L 787 458 L 777 524 L 766 559 L 754 581 L 727 608 L 690 630 L 659 639 L 707 587 L 737 535 L 738 523 L 731 514 L 701 512 L 631 576 L 534 650 L 509 674 L 488 706 L 476 749 L 477 796 L 490 839 L 582 839 L 591 802 L 609 773 L 648 736 L 743 663 L 784 622 L 809 580 L 824 530 L 829 460 Z"/>
    </svg>
  )
}

export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={cx('serif inline-flex items-center gap-2 text-2xl font-semibold', className)}>
      <span className="grid size-7 place-items-center rounded-lg bg-primary text-primary-fg">
        <HandsMoneyIcon className="size-4" />
      </span>
      MintMate
    </span>
  )
}

const FAQ = [
  ['Does MintMate connect to my bank or UPI?', "No. You log expenses yourself in a few taps. There's no bank linking, so nothing about your accounts is ever read."],
  ['How is "safe to spend today" calculated?', 'Money left this period, minus bills you still have to pay, divided by the days remaining. The formula is shown on the dashboard so you can check it.'],
  ['Where is my data stored?', 'This prototype keeps everything in memory in your browser tab and sends nothing anywhere. Export to CSV or JSON from Settings whenever you like.'],
  ['Is MintMate free?', 'This is a design prototype, so there is nothing to buy. Pricing for a future release has not been decided.'],
  ['Can I use it in Hindi?', 'Core screens have a Hindi option in Settings. More of the app will follow.'],
] as const

export default function Site() {
  const { setView, m, limits } = useApp()
  const [open, setOpen] = useState<number | null>(0)
  const tryIt = () => setView('onboarding')
  const demo = () => setView('app')
  return (
    <div className="min-h-screen">
      <header className="mx-auto flex max-w-[1180px] items-center justify-between px-5 py-5 lg:px-8">
        <Wordmark />
        <nav aria-label="Primary" className="hidden items-center gap-7 text-[15px] font-medium md:flex">
          <a href="#how" className="hover:text-primary">How it works</a><a href="#features" className="hover:text-primary">Features</a><a href="#privacy" className="hover:text-primary">Privacy</a><a href="#faq" className="hover:text-primary">FAQ</a>
        </nav>
        <Button size="sm" onClick={tryIt}>Try MintMate</Button>
      </header>

      <section className="mx-auto grid max-w-[1180px] items-center gap-12 px-5 pb-20 pt-8 lg:grid-cols-[1.1fr_1fr] lg:px-8 lg:pt-16">
        <div className="rise">
          <p className="mb-5 text-sm font-semibold uppercase tracking-[.16em] text-primary">Your allowance, all month.</p>
          <h1 className="serif text-[48px] font-medium leading-[1.02] sm:text-[68px] lg:text-[80px]">Make your money last all month.</h1>
          <p className="mt-6 max-w-[520px] text-lg text-muted">Know what you can spend today, track expenses in seconds, and stay on top of your savings.</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row"><Button size="lg" onClick={tryIt} icon={P.ArrowRight}>Try MintMate</Button><Button size="lg" variant="secondary" onClick={demo}>Explore Demo</Button></div>
          <p className="mt-4 text-sm text-muted">Built for college students in India · ₹ and UPI-first</p>
        </div>
        <div className="rise relative" style={{ animationDelay: '120ms' }} aria-label="Preview of the MintMate dashboard">
          <div className="mx-auto w-full max-w-[380px] rotate-[2deg] rounded-[28px] border border-line bg-bg p-4 shadow-2xl">
            <div className="rounded-[20px] bg-hero p-5 text-hero-fg">
              <p className="text-xs font-semibold opacity-80">Safe to spend today</p>
              <p className="serif mt-1 text-[64px] font-medium leading-none">₹{Math.max(m.safe, 0)}</p>
              <p className="mt-2 text-sm opacity-85">for each of the next {m.daysLeft} days</p>
              <div className="mt-4 h-2 rounded-full bg-white/15"><div className="h-full rounded-full bg-hero-fg" style={{ width: m.pct + '%' }} /></div>
              <p className="mt-1.5 text-xs opacity-80">{m.pct}% spent · day {m.dayNo} of 31</p>
            </div>
            <div className="mt-3 space-y-3 rounded-xl border border-line bg-surface p-4">
              {CATS.slice(0, 3).map((c) => <div key={c}><div className="mb-1 flex justify-between text-xs font-semibold"><span>{CAT_LABEL[c]}</span><span className="num text-muted">₹{m.byCat[c].toLocaleString('en-IN')} / ₹{limits[c].toLocaleString('en-IN')}</span></div><Bar value={m.byCat[c]} max={limits[c]} tone={m.byCat[c] / limits[c] >= 0.85 ? 'warn' : 'ok'} label={c} h={6} /></div>)}
            </div>
          </div>
        </div>
      </section>

      <section id="how" className="border-y border-line bg-surface">
        <div className="mx-auto max-w-[1180px] px-5 py-16 lg:px-8">
          <h2 className="serif mb-10 text-4xl font-medium lg:text-5xl">Three steps. No spreadsheets.</h2>
          <ol className="grid gap-8 md:grid-cols-3">
            {[['Set your month', 'Enter your allowance and give each category a limit.'], ['Log as you spend', 'Amount, category, done. Under ten seconds.'], ['Check today\'s number', 'One figure tells you what\'s safe to spend.']].map(([t, b], i) => (
              <li key={t} className="border-t-2 border-ink pt-4"><span className="serif text-5xl font-medium text-primary">0{i + 1}</span><h3 className="mt-3 text-xl font-semibold">{t}</h3><p className="mt-1 text-muted">{b}</p></li>
            ))}
          </ol>
        </div>
      </section>

      <section id="features" className="mx-auto max-w-[1180px] px-5 py-20 lg:px-8">
        <h2 className="serif mb-10 max-w-[620px] text-4xl font-medium lg:text-5xl">Everything a student budget needs, nothing it doesn't.</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {[[P.Gauge, 'Safe-to-spend', 'A daily number that accounts for bills still due.'], [P.Lightning, 'Fast expense entry', 'A big amount field, category chips, and Save.'], [P.Receipt, 'Bills & reminders', 'Never miss a recharge or subscription.'], [P.Target, 'Savings goals', 'Laptop, trip or exam fees, with a weekly target.'], [P.ChartBar, 'Insights', 'Trends, weekday patterns and category shares.'], [P.Users, 'Flatmate splits', 'Share costs, see who owes whom, settle up.']].map(([I, t, b], i) => {
            const Ic = I as P.Icon
            return <Card key={t as string} className={cx('p-6', i === 0 && 'md:col-span-2')}><Ic size={28} weight="duotone" className="text-primary" /><h3 className="mt-4 text-xl font-semibold">{t as string}</h3><p className="mt-1 text-muted">{b as string}</p></Card>
          })}
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-3" aria-label="Interface previews">
          <Card className="p-5"><p className="mb-3 text-sm font-semibold text-muted">Quick add</p><p className="serif text-5xl font-medium">₹180</p><div className="mt-3 flex flex-wrap gap-1.5">{CATS.slice(0, 4).map((c, i) => <span key={c} className={cx('rounded-full border px-3 py-1 text-xs font-medium', i === 0 ? 'border-primary bg-primary-soft' : 'border-line text-muted')}>{c}</span>)}</div></Card>
          <Card className="p-5"><p className="mb-3 text-sm font-semibold text-muted">Upcoming bill</p><div className="flex items-center gap-3"><CatBadge cat="Phone" /><div className="flex-1"><p className="font-semibold">Mobile Recharge</p><p className="text-sm text-muted">Due 27 Oct</p></div><b className="serif text-xl">₹299</b></div></Card>
          <Card className="p-5"><p className="mb-3 text-sm font-semibold text-muted">Goal</p><p className="font-semibold">Weekend Trip</p><Bar value={3200} max={6000} label="Weekend trip" h={10} /><p className="mt-2 text-sm text-muted">₹3,200 of ₹6,000 · 53%</p></Card>
        </div>
      </section>

      <section id="privacy" className="bg-hero text-hero-fg">
        <div className="mx-auto grid max-w-[1180px] gap-8 px-5 py-16 lg:grid-cols-2 lg:px-8">
          <h2 className="serif text-4xl font-medium lg:text-5xl">Your money details stay yours.</h2>
          <ul className="space-y-3 text-[17px]">{['No bank or UPI linking. You enter what you spend.', 'Privacy mode hides every amount with one tap.', 'Export or delete your data from Settings, any time.', 'This prototype stores nothing outside your browser tab.'].map((t) => <li key={t} className="flex gap-3"><P.ShieldCheck size={22} weight="fill" className="mt-0.5 shrink-0" />{t}</li>)}</ul>
        </div>
      </section>

      <section id="faq" className="mx-auto max-w-[780px] px-5 py-20 lg:px-8">
        <h2 className="serif mb-8 text-4xl font-medium">Questions</h2>
        <div className="divide-y divide-line border-y border-line">
          {FAQ.map(([q, a], i) => (
            <div key={q}>
              <h3><button id={'fq' + i} aria-expanded={open === i} aria-controls={'fa' + i} onClick={() => setOpen(open === i ? null : i)} className="flex min-h-14 w-full items-center justify-between gap-4 py-4 text-left text-lg font-semibold">{q}<P.Plus size={20} className={cx('shrink-0 transition-transform duration-200', open === i && 'rotate-45')} /></button></h3>
              {open === i && <p id={'fa' + i} role="region" aria-labelledby={'fq' + i} className="pb-5 text-muted">{a}</p>}
            </div>
          ))}
        </div>
        <div className="mt-12 text-center"><Button size="lg" onClick={tryIt}>Try MintMate</Button></div>
      </section>

      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-[1180px] flex-col gap-4 px-5 py-8 text-sm text-muted sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <Wordmark className="!text-xl text-ink" /><p>A design prototype. Figures shown are sample data, not real usage.</p>
          <div className="flex gap-4"><button onClick={demo} className="font-semibold hover:text-ink">Explore Demo</button><a href="#privacy" className="font-semibold hover:text-ink">Privacy</a></div>
        </div>
      </footer>
    </div>
  )
}
export { CAT_COLOR }
