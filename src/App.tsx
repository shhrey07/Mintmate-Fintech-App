import { useState, useEffect } from 'react'
import * as P from '@phosphor-icons/react'
import { AppProvider, useApp, type Screen } from './store'
import { AddExpense } from './addExpense'
import Home from './home'
import { Bills, Goals, Transactions } from './lists'
import { History, Insights, Splits } from './analysis'
import { DesignSystem, Settings } from './settings'
import Onboarding from './onboarding'
import Site, { Wordmark } from './site'
import { Button, Sheet, Toasts, cx } from './ui'
import AIAssistant from './aiAssistant'
import Welcome from './welcome'
import Auth from './auth'

const NAV: { s: Screen; l: string; i: P.Icon }[] = [
  { s: 'home', l: 'Home', i: P.House }, 
  { s: 'transactions', l: 'Transactions', i: P.ListBullets }, 
  { s: 'insights', l: 'Insights', i: P.ChartBar }, 
  { s: 'goals', l: 'Goals', i: P.Target },
  { s: 'bills', l: 'Bills', i: P.Receipt }, 
  { s: 'splits', l: 'Splits', i: P.Users }, 
  { s: 'ai-assistant', l: 'AI Assistant', i: P.Robot },
  { s: 'history', l: 'History', i: P.ClockCounterClockwise }, 
  { s: 'settings', l: 'Settings', i: P.GearSix },
]
const MOBILE = NAV.slice(0, 4)
const SCREENS: Record<Screen, () => React.ReactElement> = { 
  home: Home, 
  transactions: Transactions, 
  bills: Bills, 
  goals: Goals, 
  insights: Insights, 
  splits: Splits, 
  'ai-assistant': AIAssistant,
  settings: Settings, 
  history: History, 
  system: DesignSystem 
}

function Shell() {
  const { screen, nav, openAdd, t, setView } = useApp()
  const [more, setMore] = useState(false)
  const Cur = SCREENS[screen]
  const moreActive = !MOBILE.some((n) => n.s === screen)
  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[248px_1fr]">
      <aside className="sticky top-0 hidden h-screen flex-col border-r border-line bg-surface px-4 py-6 lg:flex">
        <button onClick={() => setView('site')} className="mb-8 px-2 text-left" aria-label="MintMate website"><Wordmark /></button>
        <nav aria-label="Main" className="flex flex-1 flex-col gap-1">
          {NAV.map((n) => (
            <button key={n.s} onClick={() => nav(n.s)} aria-current={screen === n.s ? 'page' : undefined} className={cx('flex h-11 items-center gap-3 rounded-lg px-3 text-[15px] font-semibold transition-colors duration-150', screen === n.s ? 'bg-primary-soft text-ink' : 'text-muted hover:bg-surface2 hover:text-ink')}>
              <n.i size={20} weight={screen === n.s ? 'fill' : 'regular'} className={screen === n.s ? 'text-primary' : ''} />{t(n.l)}
            </button>
          ))}
        </nav>
        <Button icon={P.Plus} size="lg" full onClick={() => openAdd()}>{t('Add expense')}</Button>
        <p className="mt-4 px-1 text-xs text-muted">Prototype · sample data kept in memory only</p>
      </aside>

      <main className="min-w-0 pb-32 lg:pb-14">
        <div className="mx-auto max-w-[720px] px-5 pt-5 lg:max-w-[1120px] lg:px-10 lg:pt-10">
          <div className="mb-4 flex items-center justify-between lg:hidden"><Wordmark className="!text-xl" /><button onClick={() => setView('site')} className="text-xs font-semibold text-muted underline underline-offset-2">Website</button></div>
          <div key={screen} className="rise"><Cur /></div>
        </div>
      </main>

      <button onClick={() => openAdd()} aria-label="Add expense" className="fixed bottom-24 right-5 z-30 grid size-14 place-items-center rounded-full bg-primary text-primary-fg shadow-lg transition-transform duration-150 hover:scale-105 active:scale-95 lg:hidden"><P.Plus size={26} weight="bold" /></button>
      <nav aria-label="Main" className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-5 border-t border-line bg-surface pb-[env(safe-area-inset-bottom)] lg:hidden">
        {MOBILE.map((n) => (
          <button key={n.s} onClick={() => nav(n.s)} aria-current={screen === n.s ? 'page' : undefined} className={cx('flex h-16 flex-col items-center justify-center gap-0.5 text-[11px] font-semibold', screen === n.s ? 'text-primary' : 'text-muted')}>
            <n.i size={24} weight={screen === n.s ? 'fill' : 'regular'} />{t(n.l)}
          </button>
        ))}
        <button onClick={() => setMore(true)} aria-haspopup="dialog" className={cx('flex h-16 flex-col items-center justify-center gap-0.5 text-[11px] font-semibold', moreActive ? 'text-primary' : 'text-muted')}><P.DotsThree size={24} weight="bold" />{t('More')}</button>
      </nav>
      <Sheet open={more} onClose={() => setMore(false)} title={t('More')}>
        <ul className="grid grid-cols-2 gap-3">
          {NAV.slice(4).map((n) => <li key={n.s}><button onClick={() => { nav(n.s); setMore(false) }} className="flex h-16 w-full items-center gap-3 rounded-xl border border-line bg-surface px-4 font-semibold hover:bg-surface2"><n.i size={22} className="text-primary" />{t(n.l)}</button></li>)}
        </ul>
      </Sheet>
      <AddExpense />
    </div>
  )
}

function Root() {
  const { view, setView } = useApp()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [showWelcome, setShowWelcome] = useState(false)

  useEffect(() => {
    const auth = localStorage.getItem('mintmate_auth')
    const welcomed = localStorage.getItem('mintmate_welcomed')
    
    if (auth === 'true') {
      setIsAuthenticated(true)
      if (!welcomed) {
        setShowWelcome(true)
      }
    }
  }, [])

  const handleAuthSuccess = () => {
    setIsAuthenticated(true)
    setShowWelcome(true)
  }

  const handleWelcomeComplete = () => {
    localStorage.setItem('mintmate_welcomed', 'true')
    setShowWelcome(false)
    setView('app')
  }

  const handleWelcomeSkip = () => {
    localStorage.setItem('mintmate_welcomed', 'true')
    setShowWelcome(false)
    setView('app')
  }

  // Show welcome screens first after signup
  if (isAuthenticated && showWelcome) {
    return <Welcome onComplete={handleWelcomeComplete} onSkip={handleWelcomeSkip} />
  }

  // Show auth if not authenticated
  if (!isAuthenticated && view !== 'site') {
    return <Auth onSuccess={handleAuthSuccess} />
  }

  return (
    <>
      {view === 'site' ? <Site /> : view === 'onboarding' ? <Onboarding /> : <Shell />}
      <Toasts />
    </>
  )
}

export default function App() {
  return <AppProvider><Root /></AppProvider>
}
