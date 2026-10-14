import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'

const d = (iso: string) => new Date(iso + 'T00:00:00')
export const daysBetween = (a: string, b: string) => Math.round((d(b).getTime() - d(a).getTime()) / 864e5)
export const fmtDate = (iso: string, o: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short' }) => d(iso).toLocaleDateString('en-IN', o)
export const addDays = (iso: string, n: number) => { const x = d(iso); x.setDate(x.getDate() + n); return x.toISOString().slice(0, 10) }
export const dayLabel = (iso: string) => {
  const TODAY = getTodayDate()
  return iso === TODAY ? 'Today' : iso === addDays(TODAY, -1) ? 'Yesterday' : fmtDate(iso, { weekday: 'short', day: 'numeric', month: 'short' })
}

// Get current date dynamically
export const getTodayDate = () => {
  const now = new Date()
  return now.toISOString().slice(0, 10)
}

export const TODAY = getTodayDate()

// Calculate budget period based on user's start day
export const calculatePeriod = (startDay: number) => {
  const today = new Date(TODAY + 'T00:00:00')
  const currentDay = today.getDate()
  const currentMonth = today.getMonth()
  const currentYear = today.getFullYear()
  
  let periodStart: Date
  let periodEnd: Date
  
  // If current day is before start day, period is from last month's start day to this month's (start day - 1)
  if (currentDay < startDay) {
    periodStart = new Date(currentYear, currentMonth - 1, startDay)
    periodEnd = new Date(currentYear, currentMonth, startDay - 1)
  } else {
    // Period is from this month's start day to next month's (start day - 1)
    periodStart = new Date(currentYear, currentMonth, startDay)
    periodEnd = new Date(currentYear, currentMonth + 1, startDay - 1)
  }
  
  const start = periodStart.toISOString().slice(0, 10)
  const end = periodEnd.toISOString().slice(0, 10)
  const days = Math.round((periodEnd.getTime() - periodStart.getTime()) / 864e5) + 1
  
  const startLabel = fmtDate(start, { day: 'numeric', month: 'short' })
  const endLabel = fmtDate(end, { day: 'numeric', month: 'short', year: 'numeric' })
  
  return { start, end, label: `${startLabel} – ${endLabel}`, days }
}

// Default period for demo mode
export const PERIOD = calculatePeriod(1)
export const CATS = ['Food', 'Transport', 'Phone', 'Entertainment', 'Shopping', 'Study', 'Misc'] as const
export type Cat = (typeof CATS)[number]
export const CAT_LABEL: Record<Cat, string> = { Food: 'Food', Transport: 'Transport', Phone: 'Phone', Entertainment: 'Entertainment', Shopping: 'Shopping', Study: 'Study', Misc: 'Miscellaneous' }
export const CAT_COLOR: Record<Cat, string> = { Food: '#1f7a5c', Transport: '#3b73b0', Phone: '#8660b8', Entertainment: '#c4582c', Shopping: '#b58a14', Study: '#23909a', Misc: '#80857d' }

export type Method = 'UPI' | 'Cash'
export interface Txn { id: string; date: string; merchant: string; cat: Cat; amount: number; method: Method; note?: string }
export interface Bill { id: string; name: string; amount: number; due: string; cat: Cat; recurring: 'Monthly' | 'Weekly' | 'Yearly' | 'One-time'; paid: boolean; paidOn?: string; txnId?: string }
export interface Goal { id: string; name: string; target: number; saved: number; date: string; weekly: number; kind: 'laptop' | 'trip' | 'exam' | 'other'; log: { date: string; amount: number }[] }
export interface Person { id: string; name: string }
export interface SplitExp { id: string; title: string; amount: number; payer: string; date: string; shares: Record<string, number> }
export interface Settlement { id: string; from: string; to: string; amount: number; date: string }
export interface Settings { theme: 'light' | 'dark' | 'system'; lang: 'en' | 'hi'; currency: 'symbol' | 'code'; privacy: boolean; offline: boolean; failNext: boolean; notifs: { bills: boolean; budget: boolean; weekly: boolean } }
export interface Profile { name: string; income: number; incomeType: string; startDay: number }
export type Screen = 'home' | 'transactions' | 'bills' | 'goals' | 'insights' | 'splits' | 'settings' | 'history' | 'system' | 'ai-assistant'
export type Scenario = 'healthy' | 'tight' | 'overspent' | 'empty'

const T = (date: string, merchant: string, cat: Cat, amount: number, method: Method, i: number): Txn => ({ id: 's' + i, date, merchant, cat, amount, method })
const seedRaw: [string, string, Cat, number, Method][] = [
  ['2026-10-23', 'College Canteen', 'Food', 85, 'Cash'],
  ['2026-10-22', 'Coffee Shop', 'Food', 180, 'UPI'],
  ['2026-10-22', 'College Canteen', 'Food', 70, 'Cash'],
  ['2026-10-21', 'Grocery Store', 'Food', 640, 'UPI'],
  ['2026-10-21', 'Metro Recharge', 'Transport', 300, 'UPI'],
  ['2026-10-20', 'Biryani Zone', 'Food', 340, 'UPI'],
  ['2026-10-19', 'PVR Movie Tickets', 'Entertainment', 450, 'UPI'],
  ['2026-10-18', 'College Canteen', 'Food', 90, 'Cash'],
  ['2026-10-17', 'Study Materials', 'Study', 500, 'UPI'],
  ['2026-10-16', 'Grocery Store', 'Food', 560, 'UPI'],
  ['2026-10-15', 'Campus Store T-shirt', 'Shopping', 550, 'UPI'],
  ['2026-10-14', 'Pizza Hangout', 'Food', 450, 'UPI'],
  ['2026-10-12', 'Metro Recharge', 'Transport', 300, 'UPI'],
  ['2026-10-11', 'Grocery Store', 'Food', 520, 'UPI'],
  ['2026-10-10', 'Laundry', 'Misc', 175, 'Cash'],
  ['2026-10-09', 'Open Mic Cover', 'Entertainment', 450, 'UPI'],
  ['2026-10-07', 'Auto Rickshaw', 'Transport', 120, 'Cash'],
  ['2026-10-06', 'Weekend Dinner', 'Food', 620, 'UPI'],
  ['2026-10-05', 'Xerox & Notes', 'Study', 300, 'Cash'],
  ['2026-10-04', 'Metro Recharge', 'Transport', 380, 'UPI'],
  ['2026-10-03', 'College Canteen', 'Food', 270, 'Cash'],
  ['2026-10-02', 'Data Pack', 'Phone', 300, 'UPI'],
]
const seedTxns = (): Txn[] => seedRaw.map((r, i) => T(r[0], r[1], r[2], r[3], r[4], i))
const scenarioTxns = (s: Scenario): Txn[] => {
  if (s === 'empty') return []
  if (s === 'tight') return [{ id: 'x1', date: TODAY, merchant: 'Team Lunch', cat: 'Food', amount: 520, method: 'UPI' }, ...seedTxns()]
  if (s === 'overspent') return [{ id: 'x2', date: TODAY, merchant: 'Laptop Bag & Accessories', cat: 'Shopping', amount: 3900, method: 'UPI' }, ...seedTxns()]
  return seedTxns()
}
const seedLimits = (): Record<Cat, number> => ({ Food: 4500, Transport: 1500, Phone: 600, Entertainment: 1200, Shopping: 1500, Study: 1500, Misc: 700 })
const seedBills = (): Bill[] => [
  { id: 'b1', name: 'Library Membership', amount: 150, due: '2026-10-20', cat: 'Study', recurring: 'Monthly', paid: false },
  { id: 'b2', name: 'Mobile Recharge', amount: 299, due: '2026-10-27', cat: 'Phone', recurring: 'Monthly', paid: false },
  { id: 'b3', name: 'Spotify Student', amount: 119, due: '2026-10-29', cat: 'Entertainment', recurring: 'Monthly', paid: false },
  { id: 'b4', name: 'Hostel Wi-Fi Share', amount: 250, due: '2026-10-15', cat: 'Misc', recurring: 'Monthly', paid: true, paidOn: '2026-10-14' },
  { id: 'b5', name: 'Netflix Split', amount: 149, due: '2026-10-12', cat: 'Entertainment', recurring: 'Monthly', paid: true, paidOn: '2026-10-12' },
]
const seedGoals = (): Goal[] => [
  { id: 'g1', name: 'Laptop Fund', target: 55000, saved: 18500, date: '2027-03-31', weekly: 1200, kind: 'laptop', log: [{ date: '2026-10-14', amount: 1200 }, { date: '2026-10-07', amount: 1000 }, { date: '2026-09-30', amount: 1500 }] },
  { id: 'g2', name: 'Weekend Trip', target: 6000, saved: 3200, date: '2026-12-15', weekly: 400, kind: 'trip', log: [{ date: '2026-10-16', amount: 400 }, { date: '2026-10-02', amount: 800 }] },
  { id: 'g3', name: 'Exam Fees', target: 4500, saved: 2800, date: '2026-11-30', weekly: 250, kind: 'exam', log: [{ date: '2026-10-10', amount: 500 }] },
]
const seedPeople = (): Person[] => [{ id: 'me', name: 'You' }, { id: 'aarav', name: 'Aarav' }, { id: 'meera', name: 'Meera' }, { id: 'kabir', name: 'Kabir' }]
const eq = (amt: number, ids: string[]) => Object.fromEntries(ids.map((i) => [i, amt / ids.length]))
const all4 = ['me', 'aarav', 'meera', 'kabir']
const seedSplits = (): SplitExp[] => [
  { id: 'p1', title: 'Electricity bill', amount: 1800, payer: 'me', date: '2026-10-18', shares: eq(1800, all4) },
  { id: 'p2', title: 'Groceries run', amount: 1240, payer: 'aarav', date: '2026-10-20', shares: eq(1240, all4) },
  { id: 'p3', title: 'Wi-Fi recharge', amount: 999, payer: 'meera', date: '2026-10-12', shares: eq(999, all4) },
  { id: 'p4', title: 'Cooking gas', amount: 900, payer: 'aarav', date: '2026-10-08', shares: { me: 300, aarav: 300, meera: 300, kabir: 0 } },
]

export function balances(people: Person[], splits: SplitExp[], settlements: Settlement[]) {
  const b: Record<string, number> = {}
  people.forEach((p) => (b[p.id] = 0))
  splits.forEach((e) => { b[e.payer] = (b[e.payer] ?? 0) + e.amount; Object.entries(e.shares).forEach(([id, s]) => (b[id] = (b[id] ?? 0) - s)) })
  settlements.forEach((s) => { b[s.from] += s.amount; b[s.to] -= s.amount })
  return b
}
export function suggestions(b: Record<string, number>) {
  const cr = Object.entries(b).filter(([, v]) => v > 0.5).map(([id, v]) => ({ id, v })).sort((x, y) => y.v - x.v)
  const db = Object.entries(b).filter(([, v]) => v < -0.5).map(([id, v]) => ({ id, v: -v })).sort((x, y) => y.v - x.v)
  const out: { from: string; to: string; amount: number }[] = []
  let i = 0, j = 0
  while (i < db.length && j < cr.length) {
    const amt = Math.min(db[i].v, cr[j].v)
    out.push({ from: db[i].id, to: cr[j].id, amount: Math.round(amt) })
    db[i].v -= amt; cr[j].v -= amt
    if (db[i].v < 0.5) i++
    if (cr[j].v < 0.5) j++
  }
  return out
}

export interface HistPeriod { id: string; label: string; budget: number; spent: number; saved: number; cats: Record<Cat, number>; weekdays: number[]; largest: { merchant: string; amount: number; date: string }; txns: Txn[] }
const split = (total: number, r: number[]): Record<Cat, number> => {
  const vals = r.map((x) => Math.round(total * x)); vals[0] += total - vals.reduce((a, b) => a + b, 0)
  return Object.fromEntries(CATS.map((c, i) => [c, vals[i]])) as Record<Cat, number>
}
const H = (id: string, label: string, spent: number, saved: number, r: number[], wd: number[], largest: HistPeriod['largest'], tx: [string, string, Cat, number, Method][]): HistPeriod => ({
  id, label, budget: 12000, spent, saved, cats: split(spent, r), weekdays: wd, largest, txns: tx.map((t, i) => T(t[0], t[1], t[2], t[3], t[4], 900 + i)),
})
export const HISTORY: HistPeriod[] = [
  H('2026-09', 'September 2026', 11240, 1800, [0.4, 0.1, 0.05, 0.1, 0.12, 0.17, 0.06], [1210, 1480, 1320, 1390, 2250, 2160, 1430], { merchant: 'Semester Textbooks', amount: 1450, date: '2026-09-04' }, [['2026-09-28', 'College Canteen', 'Food', 120, 'Cash'], ['2026-09-26', 'Semester Textbooks', 'Study', 1450, 'UPI'], ['2026-09-21', 'Grocery Store', 'Food', 610, 'UPI'], ['2026-09-15', 'Metro Recharge', 'Transport', 300, 'UPI']]),
  H('2026-08', 'August 2026', 11610, 1200, [0.37, 0.09, 0.05, 0.14, 0.18, 0.11, 0.06], [1350, 1210, 1620, 1480, 2380, 2540, 1030], { merchant: 'Sneakers', amount: 1999, date: '2026-08-17' }, [['2026-08-30', 'Weekend Dinner', 'Food', 680, 'UPI'], ['2026-08-17', 'Sneakers', 'Shopping', 1999, 'UPI'], ['2026-08-09', 'Movie Tickets', 'Entertainment', 480, 'UPI']]),
  H('2026-07', 'July 2026', 9860, 2400, [0.41, 0.12, 0.05, 0.08, 0.1, 0.18, 0.06], [1180, 1330, 1250, 1210, 1830, 1780, 1280], { merchant: 'Lab Manual & Kit', amount: 1100, date: '2026-07-11' }, [['2026-07-24', 'Grocery Store', 'Food', 540, 'UPI'], ['2026-07-11', 'Lab Manual & Kit', 'Study', 1100, 'UPI']]),
  H('2026-06', 'June 2026', 11020, 1000, [0.39, 0.1, 0.06, 0.11, 0.14, 0.14, 0.06], [1300, 1190, 1280, 1520, 2150, 2240, 1340], { merchant: 'Train Tickets Home', amount: 1250, date: '2026-06-02' }, [['2026-06-02', 'Train Tickets Home', 'Transport', 1250, 'UPI'], ['2026-06-19', 'Coffee Shop', 'Food', 210, 'UPI']]),
  H('2026-05', 'May 2026', 10480, 1500, [0.4, 0.11, 0.05, 0.1, 0.12, 0.16, 0.06], [1240, 1330, 1180, 1290, 2060, 2020, 1360], { merchant: 'Exam Fee', amount: 1500, date: '2026-05-06' }, [['2026-05-06', 'Exam Fee', 'Study', 1500, 'UPI'], ['2026-05-22', 'College Canteen', 'Food', 95, 'Cash']]),
]

const HI: Record<string, string> = {
  Home: 'होम', Transactions: 'लेन-देन', Insights: 'इनसाइट्स', Goals: 'लक्ष्य', More: 'और', Bills: 'बिल', Splits: 'बँटवारा', History: 'इतिहास', Settings: 'सेटिंग्स',
  'Safe to spend today': 'आज खर्च करना सुरक्षित', 'Add expense': 'खर्च जोड़ें', 'Good morning': 'सुप्रभात', Budget: 'बजट', Spent: 'खर्च', Left: 'बाकी', 'Recent transactions': 'हाल के लेन-देन', 'Upcoming bill': 'आने वाला बिल', 'Savings goal': 'बचत लक्ष्य', 'Mark as paid': 'भुगतान हुआ',
}

interface ToastItem { id: number; msg: string; undo?: () => void; tone?: 'ok' | 'error' }
interface Ctx {
  view: 'site' | 'onboarding' | 'app'; setView: (v: 'site' | 'onboarding' | 'app') => void
  screen: Screen; nav: (s: Screen) => void; back: () => void; canBack: boolean
  profile: Profile; limits: Record<Cat, number>; setLimits: (l: Record<Cat, number>) => void
  txns: Txn[]; addTxn: (t: Omit<Txn, 'id'>) => string; updateTxn: (t: Txn) => void; deleteTxn: (id: string) => void; restoreTxn: (t: Txn) => void
  bills: Bill[]; payBill: (id: string) => void; saveBill: (b: Bill) => void; deleteBill: (id: string) => void
  goals: Goal[]; saveGoal: (g: Goal) => void; deleteGoal: (id: string) => void; contribute: (id: string, amt: number) => void
  people: Person[]; splits: SplitExp[]; settlements: Settlement[]; addSplit: (s: Omit<SplitExp, 'id'>) => void; settle: (from: string, to: string, amount: number) => void
  settings: Settings; setSettings: (p: Partial<Settings>) => void
  scenario: Scenario; setScenario: (s: Scenario) => void
  toasts: ToastItem[]; toast: (msg: string, o?: { undo?: () => void; tone?: 'ok' | 'error' }) => void; dismiss: (id: number) => void
  sheet: null | { txn?: Txn }; openAdd: (txn?: Txn) => void; closeAdd: () => void
  m: Metrics; t: (s: string) => string
  resetDemo: () => void; deleteAll: () => void; finishOnboarding: (p: Profile, l: Record<Cat, number>, goal?: { name: string; target: number }) => void
  importTxns: (t: Txn[]) => void
}
export interface Metrics { budget: number; spent: number; remaining: number; daysLeft: number; dayNo: number; unpaid: number; safe: number; byCat: Record<Cat, number>; pct: number; periodPct: number; status: 'healthy' | 'warning' | 'over' | 'empty'; hot: Cat[] }

const AppCtx = createContext<Ctx>(null as unknown as Ctx)
export const useApp = () => useContext(AppCtx)

// Load data from localStorage with fallback
const loadFromStorage = <T,>(key: string, fallback: T): T => {
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : fallback
  } catch {
    return fallback
  }
}

// Save to localStorage
const saveToStorage = (key: string, value: any) => {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (e) {
    console.error('Failed to save to localStorage', e)
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [view, setView] = useState<'site' | 'onboarding' | 'app'>('site')
  const [stack, setStack] = useState<Screen[]>(['home'])
  const [profile, setProfile] = useState<Profile>(() => loadFromStorage('mintmate_profile', { name: 'Riya', income: 12000, incomeType: 'Allowance', startDay: 1 }))
  const [limits, setLimits] = useState<Record<Cat, number>>(() => loadFromStorage('mintmate_limits', seedLimits()))
  const [txns, setTxns] = useState<Txn[]>(() => loadFromStorage('mintmate_txns', seedTxns()))
  const [bills, setBills] = useState<Bill[]>(() => loadFromStorage('mintmate_bills', seedBills()))
  const [goals, setGoals] = useState<Goal[]>(() => loadFromStorage('mintmate_goals', seedGoals()))
  const [people] = useState(seedPeople)
  const [splits, setSplits] = useState<SplitExp[]>(() => loadFromStorage('mintmate_splits', seedSplits()))
  const [settlements, setSettlements] = useState<Settlement[]>(() => loadFromStorage('mintmate_settlements', []))
  const [settings, setS] = useState<Settings>(() => loadFromStorage('mintmate_settings', { theme: 'light', lang: 'en', currency: 'symbol', privacy: false, offline: false, failNext: false, notifs: { bills: true, budget: true, weekly: false } }))
  const [scenario, setScen] = useState<Scenario>('healthy')
  const [toasts, setToasts] = useState<ToastItem[]>([])
  const [sheet, setSheet] = useState<null | { txn?: Txn }>(null)
  const idc = useRef(100)
  const nid = (p: string) => p + ++idc.current

  const screen = stack[stack.length - 1]
  const nav = useCallback((s: Screen) => { setStack((st) => (st[st.length - 1] === s ? st : ['home', 'transactions', 'insights', 'goals'].includes(s) ? [s] : [...st.slice(0, 1), s])); window.scrollTo({ top: 0 }) }, [])
  const back = useCallback(() => setStack((st) => (st.length > 1 ? st.slice(0, -1) : st)), [])
  const dismiss = useCallback((id: number) => setToasts((t) => t.filter((x) => x.id !== id)), [])
  const toast: Ctx['toast'] = useCallback((msg, o) => {
    const id = ++idc.current
    setToasts((t) => [...t.slice(-2), { id, msg, ...o }])
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 7000)
  }, [])

  const m = useMemo<Metrics>(() => {
    const budget = profile.income
    const period = calculatePeriod(profile.startDay)
    const spent = txns.reduce((a, t) => a + t.amount, 0)
    const byCat = Object.fromEntries(CATS.map((c) => [c, txns.filter((t) => t.cat === c).reduce((a, t) => a + t.amount, 0)])) as Record<Cat, number>
    const daysLeft = daysBetween(TODAY, period.end) + 1
    const dayNo = daysBetween(period.start, TODAY) + 1
    const unpaid = bills.filter((b) => !b.paid).reduce((a, b) => a + b.amount, 0)
    const remaining = budget - spent
    const safe = Math.floor((remaining - unpaid) / daysLeft)
    const hot = CATS.filter((c) => limits[c] > 0 && byCat[c] / limits[c] >= 0.85)
    const status = txns.length === 0 ? 'empty' : safe <= 0 ? 'over' : hot.length || safe < 250 ? 'warning' : 'healthy'
    return { budget, spent, remaining, daysLeft, dayNo, unpaid, safe, byCat, pct: Math.round((spent / budget) * 100), periodPct: Math.round((dayNo / period.days) * 100), status, hot }
  }, [txns, bills, limits, profile.income, profile.startDay])

  const t = useCallback((s: string) => (settings.lang === 'hi' ? HI[s] ?? s : s), [settings.lang])

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const apply = () => document.documentElement.dataset.theme = settings.theme === 'system' ? (mq.matches ? 'dark' : 'light') : settings.theme
    apply(); mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [settings.theme])

  // Persist data to localStorage
  useEffect(() => { saveToStorage('mintmate_profile', profile) }, [profile])
  useEffect(() => { saveToStorage('mintmate_limits', limits) }, [limits])
  useEffect(() => { saveToStorage('mintmate_txns', txns) }, [txns])
  useEffect(() => { saveToStorage('mintmate_bills', bills) }, [bills])
  useEffect(() => { saveToStorage('mintmate_goals', goals) }, [goals])
  useEffect(() => { saveToStorage('mintmate_splits', splits) }, [splits])
  useEffect(() => { saveToStorage('mintmate_settlements', settlements) }, [settlements])
  useEffect(() => { saveToStorage('mintmate_settings', settings) }, [settings])

  const value: Ctx = {
    view, setView, screen, nav, back, canBack: stack.length > 1, profile, limits, setLimits, txns,
    addTxn: (x) => { const id = nid('t'); setTxns((l) => [{ ...x, id }, ...l]); return id },
    updateTxn: (x) => setTxns((l) => l.map((y) => (y.id === x.id ? x : y))),
    deleteTxn: (id) => setTxns((l) => l.filter((y) => y.id !== id)),
    restoreTxn: (x) => setTxns((l) => [x, ...l]),
    bills,
    payBill: (id) => {
      const b = bills.find((x) => x.id === id); if (!b) return
      const txnId = nid('t')
      setTxns((l) => [{ id: txnId, date: TODAY, merchant: b.name, cat: b.cat, amount: b.amount, method: 'UPI' }, ...l])
      setBills((l) => l.map((x) => (x.id === id ? { ...x, paid: true, paidOn: TODAY, txnId } : x)))
      toast(`${b.name} marked as paid`, { undo: () => { setTxns((l) => l.filter((y) => y.id !== txnId)); setBills((l) => l.map((x) => (x.id === id ? { ...x, paid: false, paidOn: undefined, txnId: undefined } : x))) } })
    },
    saveBill: (b) => setBills((l) => (l.some((x) => x.id === b.id) ? l.map((x) => (x.id === b.id ? b : x)) : [...l, { ...b, id: nid('b') }])),
    deleteBill: (id) => setBills((l) => l.filter((x) => x.id !== id)),
    goals,
    saveGoal: (g) => setGoals((l) => (l.some((x) => x.id === g.id) ? l.map((x) => (x.id === g.id ? g : x)) : [...l, { ...g, id: nid('g') }])),
    deleteGoal: (id) => setGoals((l) => l.filter((x) => x.id !== id)),
    contribute: (id, amt) => setGoals((l) => l.map((g) => (g.id === id ? { ...g, saved: g.saved + amt, log: [{ date: TODAY, amount: amt }, ...g.log] } : g))),
    people, splits, settlements,
    addSplit: (s) => setSplits((l) => [{ ...s, id: nid('p') }, ...l]),
    settle: (from, to, amount) => setSettlements((l) => [...l, { id: nid('st'), from, to, amount, date: TODAY }]),
    settings, setSettings: (p) => setS((s) => ({ ...s, ...p })),
    scenario, setScenario: (s) => { setScen(s); setTxns(scenarioTxns(s)) },
    toasts, toast, dismiss, sheet, openAdd: (txn) => setSheet({ txn }), closeAdd: () => setSheet(null), m, t,
    resetDemo: () => { setScen('healthy'); setTxns(seedTxns()); setBills(seedBills()); setGoals(seedGoals()); setSplits(seedSplits()); setSettlements([]); setLimits(seedLimits()); setProfile({ name: 'Riya', income: 12000, incomeType: 'Allowance', startDay: 1 }) },
    deleteAll: () => { setTxns([]); setBills([]); setGoals([]); setSplits([]); setSettlements([]); setScen('empty') },
    finishOnboarding: (p, l, goal) => {
      setProfile(p); setLimits(l); setTxns([]); setBills([]); setSplits(seedSplits()); setSettlements([]); setScen('empty')
      setGoals(goal ? [{ id: 'g-new', name: goal.name, target: goal.target, saved: 0, date: '2027-03-31', weekly: Math.ceil(goal.target / 22 / 10) * 10, kind: 'other', log: [] }] : [])
      setStack(['home']); setView('app')
    },
    importTxns: (x) => setTxns((l) => [...x.map((y, i) => ({ ...y, id: 'imp' + Date.now() + i })), ...l]),
  }
  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>
}
