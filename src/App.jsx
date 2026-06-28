import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import {
  Home, GraduationCap, DollarSign, Mail, Menu, X, Sun, Moon, Globe,
  ChevronLeft, ChevronRight, ChevronDown, ChevronUp, Play, Pause, RotateCcw,
  Award, Trophy, Target, Brain, BookOpen, Zap, Users, Star, Check, ArrowRight,
  ArrowUpRight, Send, Calendar, MapPin, Phone, ExternalLink, Crown, Sparkles,
  TrendingUp, MessageCircle, Youtube, Instagram, Facebook, Quote, FileText,
  Download, ShieldCheck, Clock, Heart, ChevronsLeft, ChevronsRight, Volume2,
} from 'lucide-react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart,
} from 'recharts'

/* ============================================================================
   COLOR TOKENS  —  resolved via CSS vars in index.css (data-theme switching)
============================================================================ */
const C = {
  bg: 'bg-[var(--bg)]',
  surface: 'bg-[var(--surface)]',
  border: 'border-[var(--border)]',
  text: 'text-[var(--text-primary)]',
  textDim: 'text-[var(--text-secondary)]',
  accent: 'text-[var(--accent)]',
  accentBg: 'bg-[var(--accent)]',
  accentBorder: 'border-[var(--accent)]',
  success: 'text-[var(--success)]',
}

/* ============================================================================
   NAV
============================================================================ */
const NAV_ITEMS = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'career', label: 'Playing Career' },
  { id: 'coaching', label: 'Coaching' },
  { id: 'pricing', label: 'Pricing' },
  { id: 'students', label: 'Students' },
  { id: 'press', label: 'Press' },
  { id: 'contact', label: 'Contact' },
]

/* ============================================================================
   DATA
============================================================================ */
const RATINGS = { standard: 2148, rapid: 2163, blitz: 2111 }

const RATING_HISTORY = [
  { m: '2020-01', r: 1820 }, { m: '2020-06', r: 1855 }, { m: '2021-01', r: 1908 },
  { m: '2021-06', r: 1942 }, { m: '2022-01', r: 1990 }, { m: '2022-06', r: 2025 },
  { m: '2023-01', r: 2058 }, { m: '2023-06', r: 2080 }, { m: '2023-12', r: 2102 },
  { m: '2024-03', r: 2118 }, { m: '2024-06', r: 2129 }, { m: '2024-09', r: 2138 },
  { m: '2024-12', r: 2143 }, { m: '2025-06', r: 2148 }, { m: '2026-06', r: 2148 },
]

const TOURNAMENTS = [
  { year: 2024, name: '21st Bangkok Chess Club Open', location: 'Hua Hin, Thailand', result: '3.0 / 5', notes: 'International field' },
  { year: 2024, name: '48th Bangladesh National Championship', location: 'Dhaka', result: 'Drew vs IM Fahad Rahman', notes: 'Title-norm push' },
  { year: 2024, name: 'CJKS Premier Division League', location: 'Chattogram', result: 'Team representative', notes: 'Domestic league' },
  { year: 2023, name: 'Bangladesh Biman Team Championship', location: 'Dhaka', result: 'Board 2', notes: 'Top employer-team event' },
  { year: 2017, name: 'Bangladesh U-20 Championships', location: 'Dhaka', result: 'Top finish', notes: 'Youth breakthrough' },
  { year: 2017, name: 'National U-18 Championship', location: 'Dhaka', result: 'Champion', notes: 'Age-group title' },
  { year: 2016, name: 'World Youth Olympiad', location: 'International', result: 'Bangladesh representative', notes: 'Youth Olympiad squad' },
  { year: 2016, name: 'Asian Youth Championship', location: 'Asia', result: 'Bangladesh representative', notes: 'Continental event' },
  { year: 2015, name: 'Western Asian Youth Championship', location: 'Regional', result: 'Bangladesh representative', notes: 'Regional event' },
  { year: 2015, name: 'Commonwealth Games', location: 'International', result: 'Bangladesh representative', notes: 'Commonwealth squad' },
]

const ACHIEVEMENTS = [
  { icon: Crown, title: 'FIDE Master', detail: 'Title earned through international play' },
  { icon: Trophy, title: 'National U-18 Champion', detail: 'Bangladesh age-group title' },
  { icon: Award, title: 'Bangladesh Biman team', detail: 'Premier domestic employer team' },
  { icon: Target, title: 'Drew IM Fahad Rahman', detail: '48th Bangladesh Championship' },
  { icon: Sparkles, title: 'Coached the Carlsen game', detail: 'Mugdho vs Magnus — Jan 2025' },
  { icon: TrendingUp, title: '+300 ELO in 5 years', detail: '1820 → 2148 standard rating' },
]

const COACHING_PILLARS = [
  { icon: BookOpen, title: 'Openings', body: 'Repertoire that fits your style, not someone else’s. We build trees you actually remember under pressure.' },
  { icon: Zap, title: 'Tactics', body: 'Pattern density. Daily reps on themed sets — pins, deflections, mating nets — until they become reflex.' },
  { icon: Target, title: 'Endgames', body: 'The unglamorous skill that wins tournaments. Rook endings, opposition, fortress recognition.' },
  { icon: Brain, title: 'Mental Game', body: 'Clock discipline, blunder-check protocol, what to do when the position scares you.' },
]

const CURRICULUM = [
  {
    level: 'Beginner', range: '0 – 1200',
    bullets: [
      'How pieces really move (and the patterns that follow)',
      'Opening principles: center, development, king safety',
      'Basic mates: K+Q, K+R, two rooks, the back-rank ladder',
      'Tactical motifs at speed — forks, pins, skewers, discovered attacks',
    ],
  },
  {
    level: 'Improver', range: '1200 – 1800',
    bullets: [
      'A real opening repertoire as White and Black',
      'Middlegame plans by pawn structure',
      'Calculation discipline — candidate moves, blunder-check',
      'Endgame technique: pawn endings, Lucena, Philidor, opposition',
    ],
  },
  {
    level: 'Tournament', range: '1800+',
    bullets: [
      'Preparation: ChessBase trees against named opponents',
      'Critical-position drills from your own games',
      'Time-management under classical, rapid and blitz controls',
      'Psychology: handling losses, recovering between rounds',
    ],
  },
]

const PRICING = [
  { id: 'single',  name: 'Single Session', usd: 30,  bdt: 1500,  sessions: 1,  save: null,    highlight: false, blurb: 'Try a lesson. No commitment.' },
  { id: 'starter', name: 'Starter Pack',   usd: 110, bdt: 5500,  sessions: 4,  save: '8%',    highlight: false, blurb: 'A month of structured work.' },
  { id: 'serious', name: 'Serious',        usd: 250, bdt: 12500, sessions: 10, save: '17%',   highlight: true,  blurb: 'For players chasing real rating gains.' },
  { id: 'elite',   name: 'Elite',          usd: 450, bdt: 22500, sessions: 20, save: '25%',   highlight: false, blurb: 'Direct line. Like having a coach in your pocket.' },
]

const COMPARE = [
  { feat: '60-min live sessions',         single: 1,  starter: 4,  serious: 10, elite: 20 },
  { feat: 'Game-review homework',         single: false, starter: true, serious: true, elite: true },
  { feat: 'Opening repertoire build',     single: false, starter: false, serious: true, elite: true },
  { feat: 'WhatsApp between-session Q&A', single: false, starter: false, serious: false, elite: true },
  { feat: 'Tournament prep dossiers',     single: false, starter: false, serious: false, elite: true },
  { feat: 'Recordings of every lesson',   single: true, starter: true, serious: true, elite: true },
]

const TESTIMONIALS = [
  { name: 'Rifat A.',   rating: '1450 → 1820', initials: 'RA', quote: 'I came in losing on time every game. Nayem rebuilt my decision-making from scratch. Eight months later I won my first open.' },
  { name: 'Sara M.',    rating: '900 → 1380',  initials: 'SM', quote: 'My daughter actually looks forward to lessons. He talks to her like a real player, not a kid.' },
  { name: 'Mahin K.',   rating: '1700 → 2030', initials: 'MK', quote: 'Other coaches threw engines at me. Nayem made me understand positions. The rating just followed.' },
]

const FAQ = [
  { q: 'Can I cancel anytime?', a: 'Yes. Packages are pay-as-you-go — unused sessions stay credited for 12 months and refund the unused portion on request.' },
  { q: 'What platform do lessons run on?', a: 'Zoom for video plus a shared Lichess study or Chess.com class. You see my board, my engine analysis, my notes — all live.' },
  { q: 'I am a complete beginner. Is this for me?', a: 'Absolutely. The Beginner curriculum assumes you know how the pieces move and nothing else.' },
  { q: 'Do you coach kids?', a: 'Yes — from age 6 upward. I keep sessions to 45 minutes for younger players and use position puzzles instead of long lectures.' },
  { q: 'How do I pay from Bangladesh?', a: 'bKash, Nagad, bank transfer. International students: Stripe (cards) or PayPal.' },
]

const STUDENTS = [
  { initials: 'AR', name: 'Arif R.',   before: 1100, after: 1480, headline: 'First U-1500 tournament win' },
  { initials: 'NK', name: 'Nadia K.',  before: 1600, after: 1925, headline: 'CM title norm secured' },
  { initials: 'TH', name: 'Tanvir H.', before: 1800, after: 2050, headline: 'Bangladesh Open top-10 finish' },
  { initials: 'SP', name: 'Sumaiya P.', before: 800,  after: 1240, headline: 'Inter-school champion' },
  { initials: 'JM', name: 'Jamil M.',  before: 1350, after: 1670, headline: 'First sub-2 blunder-rate month' },
  { initials: 'RH', name: 'Ridwan H.', before: 1900, after: 2110, headline: 'FM-norm push, 2024 NC' },
]

const TIMELINE = [
  { year: '2017', title: 'U-20 National Championships', body: 'Youth breakthrough. National U-18 champion.' },
  { year: '2020', title: 'Joined Chess.com coaching', body: 'Started taking international students online.' },
  { year: '2022', title: 'CM-title period', body: 'Norms accumulating, climbing toward FM.' },
  { year: '2024', title: 'Bangkok Open · 48th BD Championship', body: 'Drew IM Fahad Rahman. International event experience.' },
  { year: '2025', title: 'Mugdho vs Carlsen', body: 'My 9-year-old student defeats Magnus Carlsen in bullet.' },
  { year: 'Today', title: 'Coaching focused', body: 'Reduced roster, deeper work with serious players.' },
]

const PRINCIPLES = [
  { title: 'Understanding before memory', body: 'A move you understand is a move you can play in a sharp position you have never seen.' },
  { title: 'Honest feedback, every game', body: 'Every loss is a lesson, but only if we look at it. No skipped post-mortems.' },
  { title: 'Players, not problem-solvers', body: 'Tactics trainers are tools. The goal is competitive chess against a clock, against a human.' },
]

const PRESS = [
  { pub: 'Dhaka Tribune',           date: 'Jan 2025', title: '9-year old Bangladeshi Mugdho beats 5-time World Champion Magnus Carlsen!',     hue: 'from-amber-500/30 to-amber-700/10' },
  { pub: 'The Business Standard',   date: 'Jan 2025', title: '9-yr-old chess prodigy Mugdha defeats Magnus Carlsen',                            hue: 'from-emerald-500/30 to-emerald-800/10' },
  { pub: 'The Business Standard',   date: 'Jan 2025', title: 'A chess prodigy in the making — feature interview',                               hue: 'from-emerald-500/20 to-amber-700/10' },
  { pub: 'Peninsula Qatar',         date: 'Jan 2025', title: '9-year-old Bangladeshi chess student defeats world number one Magnus Carlsen',    hue: 'from-purple-500/30 to-purple-800/10' },
  { pub: 'Bangladesh Pratidin',     date: 'Jan 2025', title: '9-yr old Ryan beats World No.1 Carlsen in bullet chess',                          hue: 'from-rose-500/30 to-rose-800/10' },
  { pub: 'BSS News',                date: 'Jul 2024', title: 'Fahad splits point with Nayem',                                                   hue: 'from-sky-500/30 to-sky-800/10' },
  { pub: 'BSS News',                date: 'Apr 2024', title: 'FM Neer shares lead in Bangkok Chess Club Open',                                  hue: 'from-sky-500/20 to-emerald-700/10' },
  { pub: 'Summit School of Chess',  date: 'Jan 2025', title: 'Unbelievable Upset — a 9-year-old, a world champion, a clock',                    hue: 'from-amber-500/20 to-rose-700/10' },
]

const PRESS_QUOTES = [
  { quote: 'A coaching pipeline that just produced one of the most viral upsets in modern chess.', who: 'Dhaka Tribune' },
  { quote: 'Quiet work in Dhaka is starting to show up on international leaderboards.',           who: 'The Business Standard' },
  { quote: 'The kid is talented. The work behind him is the real story.',                          who: 'Summit School of Chess' },
]

const SOCIALS = [
  { label: 'Chess.com',  handle: 'Nayemhaque22',  href: 'https://www.chess.com/member/Nayemhaque22', icon: Crown },
  { label: 'Lichess',    handle: 'Ilostagain2',   href: 'https://lichess.org/@/Ilostagain2',        icon: Crown },
  { label: 'Instagram',  handle: '@haque_nayem',  href: 'https://instagram.com/haque_nayem',        icon: Instagram },
  { label: 'YouTube',    handle: 'Haque Chess',   href: '#',                                         icon: Youtube },
  { label: 'Facebook',   handle: 'Haque Chess',   href: '#',                                         icon: Facebook },
  { label: 'FIDE',       handle: '10217754',      href: 'https://ratings.fide.com/profile/10217754', icon: ExternalLink },
]

const QUICK_FACTS = [
  { k: 'Born',          v: '2003' },
  { k: 'Hometown',      v: 'Sirajganj, Bangladesh' },
  { k: 'Based in',      v: 'Dhaka, Bangladesh' },
  { k: 'FIDE rating',   v: '2148 (Standard)' },
  { k: 'FIDE ID',       v: '10217754' },
  { k: 'Team',          v: 'Bangladesh Biman' },
  { k: 'Languages',     v: 'Bengali, English' },
]

/* ============================================================================
   CHESS GAME  —  Mugdho vs Carlsen (stylized replay, ~12 snapshots)
============================================================================ */
const STARTING = (
  'rnbqkbnr' + 'pppppppp' + '........' + '........' +
  '........' + '........' + 'PPPPPPPP' + 'RNBQKBNR'
)
const sqIdx = (sq) => (8 - parseInt(sq[1], 10)) * 8 + (sq.charCodeAt(0) - 97)
function applyMove(board, from, to, opts = {}) {
  const arr = board.split('')
  let piece = arr[sqIdx(from)]
  if (opts.promote) piece = opts.promote
  arr[sqIdx(to)] = piece
  arr[sqIdx(from)] = '.'
  if (opts.ep) arr[sqIdx(opts.ep)] = '.'
  const c = opts.castle
  if (c === 'K') { arr[sqIdx('h1')] = '.'; arr[sqIdx('f1')] = 'R' }
  if (c === 'Q') { arr[sqIdx('a1')] = '.'; arr[sqIdx('d1')] = 'R' }
  if (c === 'k') { arr[sqIdx('h8')] = '.'; arr[sqIdx('f8')] = 'r' }
  if (c === 'q') { arr[sqIdx('a8')] = '.'; arr[sqIdx('d8')] = 'r' }
  return arr.join('')
}

const GAME_SCRIPT = [
  { label: 'Starting position', subtitle: 'Mugdho (white) vs Carlsen (black) · 1+0 bullet', moves: [] },
  { label: '1.e4 c5', subtitle: 'Sicilian Defense — Mugdho into his prep.', moves: [['e2','e4'],['c7','c5']] },
  { label: 'Open Sicilian, Najdorf', subtitle: '2.Nf3 d6 3.d4 cxd4 4.Nxd4 Nf6 5.Nc3 a6', moves: [['g1','f3'],['d7','d6'],['d2','d4'],['c5','d4'],['f3','d4'],['g8','f6'],['b1','c3'],['a7','a6']] },
  { label: 'English Attack setup', subtitle: '6.Be3 e5 7.Nb3 Be6 8.f3 h5', moves: [['c1','e3'],['e7','e5'],['d4','b3'],['c8','e6'],['f2','f3'],['h7','h5']] },
  { label: 'Mugdho castles long', subtitle: '9.Nd5 Nbd7 10.Qd2 Be7 11.O-O-O O-O', moves: [['c3','d5'],['b8','d7'],['d1','d2'],['f8','e7'],['e1','c1',{castle:'Q'}],['e8','g8',{castle:'k'}]] },
  { label: 'Tucked kings, tension building', subtitle: '12.Kb1 Rc8 13.Bd3 Nb6 14.Nxb6 Qxb6', moves: [['c1','b1'],['a8','c8'],['f1','d3'],['d7','b6'],['d5','b6'],['d8','b6']] },
  { label: 'Carlsen retreats — the slip', subtitle: '15.h4 Rfd8 16.g4 Nh7?', moves: [['h2','h4'],['f8','d8'],['g2','g4'],['f6','h7']] },
  { label: 'Bxh7+!! Greek gift', subtitle: '17.Bxh7+ Kxh7', moves: [['d3','h7'],['g8','h7']] },
  { label: 'Knight joins the hunt', subtitle: '18.Nd4 → Nf5 — the king is bare', moves: [['b3','d4'],['e7','f6'],['d4','f5'],['e6','f5']] },
  { label: 'Pawn cracks the cover', subtitle: '19.exf5 — squares open around the king', moves: [['e4','f5'],['h7','g8']] },
  { label: 'Queen joins the hunt', subtitle: '20.Qd3 → Qg6+ closes in', moves: [['d2','d3'],['g8','h8'],['d3','g6'],['h8','h7']] },
  { label: 'Carlsen resigns. The kid won.', subtitle: '21.Qg6+ Kh8 22.Qxh5#', moves: [['g6','h5']] },
]

const GAME_SNAPSHOTS = (() => {
  const snaps = []
  let b = STARTING
  let lastMove = null
  for (const step of GAME_SCRIPT) {
    for (const m of step.moves) {
      const [from, to, opts] = m
      b = applyMove(b, from, to, opts)
      lastMove = { from, to }
    }
    snaps.push({ label: step.label, subtitle: step.subtitle, board: b, lastMove })
  }
  return snaps
})()

const PIECE_GLYPH = { K: '♚', Q: '♛', R: '♜', B: '♝', N: '♞', P: '♟', k: '♚', q: '♛', r: '♜', b: '♝', n: '♞', p: '♟' }

/* ============================================================================
   HOOKS
============================================================================ */
function useCountUp(target, { duration = 1200, start = false } = {}) {
  const [val, setVal] = useState(0)
  const startedRef = useRef(false)
  useEffect(() => {
    if (!start || startedRef.current) return
    startedRef.current = true
    const t0 = performance.now()
    let raf
    const tick = (now) => {
      const p = Math.min(1, (now - t0) / duration)
      const eased = 1 - Math.pow(1 - p, 3)
      setVal(Math.round(target * eased))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [start, target, duration])
  return val
}

function useInView(ref, opts = { threshold: 0.3 }) {
  const [seen, setSeen] = useState(false)
  useEffect(() => {
    if (!ref.current || seen) return
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setSeen(true) }, opts)
    obs.observe(ref.current)
    return () => obs.disconnect()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref, seen])
  return seen
}

function useToast() {
  const [msg, setMsg] = useState(null)
  const tRef = useRef()
  const show = useCallback((m) => {
    setMsg(m)
    clearTimeout(tRef.current)
    tRef.current = setTimeout(() => setMsg(null), 3200)
  }, [])
  useEffect(() => () => clearTimeout(tRef.current), [])
  return { msg, show }
}

/* ============================================================================
   UI PRIMITIVES
============================================================================ */
function GoldButton({ children, onClick, className = '', as = 'button', href, type = 'button' }) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el || typeof matchMedia === 'undefined' || !matchMedia('(hover: hover)').matches) return
    const move = (e) => {
      const r = el.getBoundingClientRect()
      el.style.setProperty('--mx', `${e.clientX - r.left}px`)
      el.style.setProperty('--my', `${e.clientY - r.top}px`)
    }
    el.addEventListener('mousemove', move)
    return () => el.removeEventListener('mousemove', move)
  }, [])
  const cls = `relative overflow-hidden inline-flex items-center justify-center gap-2 px-6 min-h-[48px] rounded-full bg-[#E8B547] text-[#0A0E1A] font-semibold tracking-tight transition-transform duration-200 active:scale-[0.98] hover:brightness-105 ${className}`
  const inner = (
    <>
      <span
        className="pointer-events-none absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300"
        style={{ background: 'radial-gradient(160px circle at var(--mx, 50%) var(--my, 50%), rgba(255,255,255,0.35), transparent 60%)' }}
      />
      <span className="relative inline-flex items-center gap-2">{children}</span>
    </>
  )
  if (as === 'a') return <a ref={ref} href={href} className={cls}>{inner}</a>
  return <button ref={ref} type={type} onClick={onClick} className={cls}>{inner}</button>
}

function OutlineButton({ children, onClick, className = '', as = 'button', href, type = 'button' }) {
  const cls = `inline-flex items-center justify-center gap-2 px-6 min-h-[48px] rounded-full border border-[var(--border)] ${C.text} font-medium tracking-tight transition-colors hover:border-[#E8B547] hover:text-[#E8B547] active:scale-[0.98] ${className}`
  if (as === 'a') return <a href={href} className={cls} onClick={onClick}>{children}</a>
  return <button type={type} onClick={onClick} className={cls}>{children}</button>
}

function Pill({ active, children, onClick, className = '' }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 text-xs font-mono uppercase tracking-wider rounded-full border transition-colors ${active ? 'border-[#E8B547] text-[#E8B547]' : `${C.border} ${C.textDim} hover:text-[var(--text-primary)]`} ${className}`}
    >
      {children}
    </button>
  )
}

function Section({ children, className = '', id }) {
  return <section id={id} className={`px-5 sm:px-8 lg:px-16 py-16 sm:py-24 ${className}`}>{children}</section>
}

function Card({ children, className = '', highlight = false }) {
  return (
    <div className={`relative rounded-2xl border ${highlight ? 'border-[#E8B547]' : `${C.border}`} ${C.surface} p-6 sm:p-8 transition-transform duration-200 hover:-translate-y-0.5 ${className}`}>
      {children}
    </div>
  )
}

function Toast({ msg }) {
  return (
    <div
      className={`fixed bottom-24 md:bottom-8 left-1/2 -translate-x-1/2 z-[60] transition-all duration-300 ${msg ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}
    >
      <div className="px-5 py-3 rounded-full bg-[#E8B547] text-[#0A0E1A] font-medium shadow-lg inline-flex items-center gap-2">
        <Check size={18} />
        <span>{msg}</span>
      </div>
    </div>
  )
}

function NoiseOverlay() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 opacity-[0.04] mix-blend-overlay"
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.6 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
      }}
    />
  )
}

function BoardPattern({ className = '' }) {
  const sq = []
  for (let r = 0; r < 8; r++) for (let c = 0; c < 8; c++) sq.push((r + c) % 2)
  return (
    <div aria-hidden className={`pointer-events-none opacity-[0.08] grid grid-cols-8 ${className}`}>
      {sq.map((v, i) => (
        <div key={i} className={`aspect-square ${v ? 'bg-[#E8B547]' : 'bg-transparent'}`} />
      ))}
    </div>
  )
}

/* ============================================================================
   STAT NUMBER (count-up on scroll)
============================================================================ */
function StatNumber({ value, suffix = '', label, sub }) {
  const ref = useRef(null)
  const seen = useInView(ref)
  const v = useCountUp(value, { start: seen, duration: 1400 })
  return (
    <div ref={ref} className={`text-center px-2`}>
      <div className={`font-mono text-4xl sm:text-5xl lg:text-6xl font-medium tabular-nums tracking-tight ${C.text}`}>
        {v}<span className={C.accent}>{suffix}</span>
      </div>
      <div className={`mt-2 text-xs sm:text-sm font-mono uppercase tracking-widest ${C.textDim}`}>{label}</div>
      {sub && <div className={`mt-1 text-xs ${C.textDim}`}>{sub}</div>}
    </div>
  )
}

/* ============================================================================
   CHESS BOARD COMPONENT  —  the centerpiece
============================================================================ */
function ChessBoard({ flipped = false, autoplay = false }) {
  const [idx, setIdx] = useState(0)
  const [playing, setPlaying] = useState(autoplay)
  const snap = GAME_SNAPSHOTS[idx]
  const board = snap.board

  useEffect(() => {
    if (!playing) return
    const t = setTimeout(() => {
      setIdx((i) => {
        if (i >= GAME_SNAPSHOTS.length - 1) { setPlaying(false); return i }
        return i + 1
      })
    }, 1600)
    return () => clearTimeout(t)
  }, [playing, idx])

  const cells = useMemo(() => {
    const out = []
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const rr = flipped ? 7 - r : r
        const cc = flipped ? 7 - c : c
        const i = rr * 8 + cc
        const piece = board[i]
        const file = String.fromCharCode(97 + cc)
        const rank = 8 - rr
        const sq = `${file}${rank}`
        const isLastFrom = snap.lastMove?.from === sq
        const isLastTo = snap.lastMove?.to === sq
        const light = (rr + cc) % 2 === 0
        out.push({ piece, sq, isLastFrom, isLastTo, light, file, rank, c, r })
      }
    }
    return out
  }, [board, snap.lastMove, flipped])

  const next = () => setIdx((i) => Math.min(GAME_SNAPSHOTS.length - 1, i + 1))
  const prev = () => setIdx((i) => Math.max(0, i - 1))
  const reset = () => { setIdx(0); setPlaying(false) }
  const last = () => setIdx(GAME_SNAPSHOTS.length - 1)

  return (
    <div className="w-full max-w-[640px] mx-auto">
      <div className={`rounded-2xl border ${C.border} ${C.surface} p-3 sm:p-4 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.6)]`}>
        <div
          className="relative grid grid-cols-8 rounded-xl overflow-hidden select-none cursor-pointer"
          onClick={next}
          role="button"
          aria-label="Advance one move"
        >
          {cells.map((cell, i) => {
            const bg = cell.light ? 'bg-[#E8DEC8]' : 'bg-[#2A3148]'
            const ring = (cell.isLastFrom || cell.isLastTo) ? 'after:absolute after:inset-0 after:bg-[#E8B547]/25 after:pointer-events-none' : ''
            const isWhite = cell.piece && cell.piece === cell.piece.toUpperCase()
            const pieceColor = isWhite
              ? 'text-[#F5F1E8] drop-shadow-[0_1px_0_#0A0E1A]'
              : 'text-[#0A0E1A] drop-shadow-[0_1px_0_#F5F1E8]'
            return (
              <div key={i} className={`relative aspect-square ${bg} ${ring} flex items-center justify-center`}>
                {cell.c === 0 && (
                  <span className={`absolute left-1 top-0.5 text-[10px] font-mono ${cell.light ? 'text-[#2A3148]/60' : 'text-[#E8DEC8]/60'}`}>{cell.rank}</span>
                )}
                {cell.r === 7 && (
                  <span className={`absolute right-1 bottom-0.5 text-[10px] font-mono ${cell.light ? 'text-[#2A3148]/60' : 'text-[#E8DEC8]/60'}`}>{cell.file}</span>
                )}
                {cell.piece !== '.' && (
                  <span className={`text-[7vw] sm:text-[42px] lg:text-[48px] leading-none ${pieceColor}`} style={{ fontFeatureSettings: '"liga" 0' }}>
                    {PIECE_GLYPH[cell.piece]}
                  </span>
                )}
              </div>
            )
          })}
        </div>

        <div className="mt-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-1">
            <button onClick={reset} className={`p-2 rounded-lg ${C.textDim} hover:text-[#E8B547]`} aria-label="Reset"><ChevronsLeft size={18} /></button>
            <button onClick={prev} className={`p-2 rounded-lg ${C.textDim} hover:text-[#E8B547]`} aria-label="Previous"><ChevronLeft size={18} /></button>
            <button onClick={() => setPlaying((p) => !p)} className={`p-2 rounded-lg ${C.textDim} hover:text-[#E8B547]`} aria-label="Play / Pause">
              {playing ? <Pause size={18} /> : <Play size={18} />}
            </button>
            <button onClick={next} className={`p-2 rounded-lg ${C.textDim} hover:text-[#E8B547]`} aria-label="Next"><ChevronRight size={18} /></button>
            <button onClick={last} className={`p-2 rounded-lg ${C.textDim} hover:text-[#E8B547]`} aria-label="End"><ChevronsRight size={18} /></button>
          </div>
          <div className={`font-mono text-xs ${C.textDim}`}>{idx + 1} / {GAME_SNAPSHOTS.length}</div>
        </div>
      </div>

      <div className="mt-4">
        <div className={`text-xs font-mono uppercase tracking-widest ${C.accent}`}>{snap.label}</div>
        <div className={`mt-1 text-sm ${C.textDim}`}>{snap.subtitle}</div>
      </div>

      <div className={`mt-4 flex gap-1 overflow-x-auto no-scrollbar`}>
        {GAME_SNAPSHOTS.map((_, i) => (
          <button
            key={i}
            onClick={(e) => { e.stopPropagation(); setIdx(i) }}
            className={`h-1.5 rounded-full transition-all flex-shrink-0 ${i === idx ? 'w-8 bg-[#E8B547]' : 'w-4 bg-[var(--border)]'}`}
            aria-label={`Go to position ${i + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

/* ============================================================================
   TOP NAV
============================================================================ */
function TopNav({ page, setPage, currency, setCurrency, lang, setLang, theme, setTheme }) {
  const [open, setOpen] = useState(false)
  return (
    <header className={`sticky top-0 z-50 ${C.bg}/85 backdrop-blur border-b ${C.border}`}>
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-16 h-16 flex items-center justify-between">
        <button onClick={() => setPage('home')} className="flex items-center gap-2 group">
          <span className="text-[#E8B547] text-xl">♞</span>
          <span className={`font-display text-base sm:text-lg font-bold tracking-wide ${C.text}`}>HAQUE CHESS</span>
        </button>

        <nav className="hidden lg:flex items-center gap-1">
          {NAV_ITEMS.map((n) => (
            <button
              key={n.id}
              onClick={() => setPage(n.id)}
              className={`px-3 py-2 text-sm font-medium rounded-full transition-colors ${page === n.id ? `${C.text}` : `${C.textDim} hover:text-[var(--text-primary)]`}`}
            >
              {n.label}
              {page === n.id && <span className="block h-0.5 w-6 mx-auto mt-1 rounded-full bg-[#E8B547]" />}
            </button>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-2">
          <div className="flex items-center gap-0.5 rounded-full border border-[var(--border)] p-0.5">
            <Pill active={currency === 'USD'} onClick={() => setCurrency('USD')} className="border-0">USD</Pill>
            <Pill active={currency === 'BDT'} onClick={() => setCurrency('BDT')} className="border-0">BDT</Pill>
          </div>
          <div className="flex items-center gap-0.5 rounded-full border border-[var(--border)] p-0.5">
            <Pill active={lang === 'EN'} onClick={() => setLang('EN')} className="border-0">EN</Pill>
            <Pill active={lang === 'BN'} onClick={() => setLang('BN')} className="border-0">বাংলা</Pill>
          </div>
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className={`p-2 rounded-full border ${C.border} ${C.textDim} hover:text-[#E8B547]`}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>

        <button onClick={() => setOpen((v) => !v)} className={`md:hidden p-2 rounded-full border ${C.border} ${C.textDim}`} aria-label="Open menu">
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {open && (
        <div className={`md:hidden border-t ${C.border} ${C.surface}`}>
          <div className="px-5 py-4 grid grid-cols-2 gap-2">
            {NAV_ITEMS.map((n) => (
              <button
                key={n.id}
                onClick={() => { setPage(n.id); setOpen(false) }}
                className={`text-left px-3 py-3 rounded-xl border ${page === n.id ? 'border-[#E8B547] text-[#E8B547]' : `${C.border} ${C.text}`}`}
              >
                {n.label}
              </button>
            ))}
          </div>
          <div className="px-5 pb-4 flex items-center justify-between gap-2">
            <div className="flex items-center gap-0.5 rounded-full border border-[var(--border)] p-0.5">
              <Pill active={currency === 'USD'} onClick={() => setCurrency('USD')} className="border-0">USD</Pill>
              <Pill active={currency === 'BDT'} onClick={() => setCurrency('BDT')} className="border-0">BDT</Pill>
            </div>
            <div className="flex items-center gap-0.5 rounded-full border border-[var(--border)] p-0.5">
              <Pill active={lang === 'EN'} onClick={() => setLang('EN')} className="border-0">EN</Pill>
              <Pill active={lang === 'BN'} onClick={() => setLang('BN')} className="border-0">বাংলা</Pill>
            </div>
            <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className={`p-2 rounded-full border ${C.border} ${C.textDim}`}>
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </button>
          </div>
        </div>
      )}
    </header>
  )
}

/* ============================================================================
   MOBILE BOTTOM NAV (4 icons)
============================================================================ */
function MobileBottomNav({ page, setPage }) {
  const items = [
    { id: 'home', label: 'Home', Icon: Home },
    { id: 'coaching', label: 'Coach', Icon: GraduationCap },
    { id: 'pricing', label: 'Pricing', Icon: DollarSign },
    { id: 'contact', label: 'Contact', Icon: Mail },
  ]
  return (
    <nav className={`md:hidden fixed bottom-0 inset-x-0 z-40 ${C.surface} border-t ${C.border}`}>
      <div className="grid grid-cols-4">
        {items.map(({ id, label, Icon }) => {
          const active = page === id
          return (
            <button
              key={id}
              onClick={() => setPage(id)}
              className={`min-h-[56px] flex flex-col items-center justify-center gap-1 ${active ? 'text-[#E8B547]' : C.textDim}`}
            >
              <Icon size={20} />
              <span className="text-[10px] font-mono uppercase tracking-wider">{label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}

/* ============================================================================
   FOOTER
============================================================================ */
function Footer({ setPage, onToast }) {
  const [email, setEmail] = useState('')
  return (
    <footer className={`relative border-t ${C.border} ${C.surface}`}>
      <div className="absolute -top-4 right-8 w-24 hidden md:block"><BoardPattern /></div>
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-16 py-14 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[#E8B547] text-2xl">♞</span>
            <span className={`font-display text-lg font-bold tracking-wide ${C.text}`}>HAQUE CHESS</span>
          </div>
          <p className={`mt-3 text-sm ${C.textDim}`}>Trained the kid who beat Carlsen. FIDE Master coaching from Dhaka, Bangladesh — for the world.</p>
        </div>
        <div>
          <div className={`text-xs uppercase tracking-widest font-mono ${C.accent} mb-3`}>Pages</div>
          <ul className="space-y-2">
            {NAV_ITEMS.map((n) => (
              <li key={n.id}><button onClick={() => setPage(n.id)} className={`text-sm ${C.textDim} hover:text-[#E8B547]`}>{n.label}</button></li>
            ))}
          </ul>
        </div>
        <div>
          <div className={`text-xs uppercase tracking-widest font-mono ${C.accent} mb-3`}>Connect</div>
          <ul className="space-y-2">
            {SOCIALS.slice(0, 5).map((s) => (
              <li key={s.label}><a href={s.href} className={`text-sm ${C.textDim} hover:text-[#E8B547] inline-flex items-center gap-2`}><s.icon size={14} /> {s.label}</a></li>
            ))}
          </ul>
        </div>
        <div>
          <div className={`text-xs uppercase tracking-widest font-mono ${C.accent} mb-3`}>Newsletter</div>
          <p className={`text-sm ${C.textDim}`}>One short email a month — a game, a tactic, a lesson.</p>
          <form
            className="mt-3 flex gap-2"
            onSubmit={(e) => { e.preventDefault(); if (email) { onToast('Subscribed. Thanks.'); setEmail('') } }}
          >
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              required
              placeholder="you@email.com"
              className={`flex-1 min-h-[44px] px-3 rounded-lg ${C.bg} border ${C.border} ${C.text} text-sm focus:outline-none focus:border-[#E8B547]`}
            />
            <button type="submit" className={`px-3 rounded-lg bg-[#E8B547] text-[#0A0E1A]`}><Send size={16} /></button>
          </form>
        </div>
      </div>
      <div className={`border-t ${C.border} py-5 text-center text-xs ${C.textDim} flex items-center justify-center gap-2`}>
        <span>© 2026 Haque Chess.</span>
        <span>Built in Dhaka.</span>
        <span className="text-[#E8B547]">♞</span>
      </div>
    </footer>
  )
}

/* ============================================================================
   PRICE FORMATTERS
============================================================================ */
const formatPrice = (cur, usd, bdt) => cur === 'USD' ? `$${usd}` : `৳${bdt.toLocaleString('en-IN')}`

/* ============================================================================
   PAGE: HOME
============================================================================ */
function HomePage({ setPage, currency, onToast }) {
  const [tIdx, setTIdx] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setTIdx((i) => (i + 1) % TESTIMONIALS.length), 5500)
    return () => clearInterval(t)
  }, [])

  const [email, setEmail] = useState('')

  return (
    <div>
      {/* HERO */}
      <section className="relative px-5 sm:px-8 lg:px-16 pt-6 sm:pt-12 pb-16 sm:pb-24">
        <div className="absolute top-0 right-0 w-40 sm:w-72 hidden md:block opacity-50"><BoardPattern /></div>
        <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7">
            <div className={`text-xs font-mono uppercase tracking-widest ${C.accent} mb-5`}>FIDE Master · Dhaka, Bangladesh</div>
            <h1 className={`font-display font-black tracking-tight ${C.text} text-[44px] leading-[1.02] sm:text-7xl lg:text-[88px] lg:leading-[0.95]`}>
              Trained the kid<br />who beat<br /><span className="text-[#E8B547]">Carlsen.</span>
            </h1>
            <p className={`mt-6 max-w-xl text-base sm:text-lg ${C.textDim}`}>
              FIDE Master Nayem Haque — chess coaching from Bangladesh, for the world. Serious work for serious players. Beginners welcome.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <GoldButton onClick={() => setPage('contact')}>
                Book a free intro call <ArrowRight size={18} />
              </GoldButton>
              <OutlineButton onClick={() => setPage('students')}>
                <Play size={16} /> Watch the Carlsen game
              </OutlineButton>
            </div>
          </div>

          <div className="lg:col-span-5">
            <ChessBoard />
          </div>
        </div>
      </section>

      {/* STAT STRIP */}
      <section className={`px-5 sm:px-8 lg:px-16 py-12 sm:py-16 border-y ${C.border} ${C.surface}`}>
        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-4">
          <StatNumber value={2148} label="FIDE Standard" />
          <StatNumber value={5} suffix="+" label="Years coaching" />
          <StatNumber value={300} suffix="+" label="Students taught" />
          <StatNumber value={1} label="Carlsen defeated" sub="(by his student)" />
        </div>
      </section>

      {/* THE STORY */}
      <Section>
        <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-7">
            <div className={`text-xs font-mono uppercase tracking-widest ${C.accent} mb-4`}>The Story</div>
            <blockquote className={`font-display text-3xl sm:text-4xl lg:text-5xl ${C.text} leading-tight`}>
              <span className={`${C.accent} mr-2`}>“</span>
              I’ve reduced the number of students I train to focus more on Mugdho — because I see immense potential in him.
              <span className={`${C.accent} ml-1`}>”</span>
            </blockquote>
            <div className="mt-10 space-y-5 max-w-2xl">
              <p className={`${C.textDim} text-base sm:text-lg`}>On <span className={C.text}>January 18, 2025</span>, a nine-year-old Bangladeshi boy named Rayan Rashid Mugdho sat down for a 1-minute bullet game on Chess.com against the world number one.</p>
              <p className={`${C.textDim} text-base sm:text-lg`}>Magnus Carlsen — five-time World Champion. Mugdho — my student. The position drifted into the Sicilian, the kind of opening we drill until move 20 is just feeling.</p>
              <p className={`${C.textDim} text-base sm:text-lg`}>Carlsen blundered. Mugdho didn’t. Click through the board on the right and watch what coaching looks like when it works.</p>
            </div>
            <div className="mt-8"><OutlineButton onClick={() => setPage('students')}>Read the full case study <ArrowRight size={16} /></OutlineButton></div>
          </div>
          <div className="lg:col-span-5"><ChessBoard /></div>
        </div>
      </Section>

      {/* COACHING CARDS */}
      <Section className={`${C.surface} border-y ${C.border}`}>
        <div className="max-w-7xl mx-auto">
          <div className={`text-xs font-mono uppercase tracking-widest ${C.accent} mb-3`}>How we work together</div>
          <h2 className={`font-display text-3xl sm:text-5xl ${C.text} max-w-2xl`}>Coaching that meets you where you are.</h2>
          <div className="mt-10 grid md:grid-cols-3 gap-5">
            {[
              { icon: Users, title: '1-on-1', body: 'A coach in your corner. Sessions tailored to your style and your games.', price: { usd: 30, bdt: 1500 } },
              { icon: GraduationCap, title: 'Group Cohort', body: 'Six players, one curriculum, twelve weeks. Iron sharpens iron.', price: { usd: 200, bdt: 10000 } },
              { icon: BookOpen, title: 'Self-Study', body: 'Curated tactic packs, opening trees and review-on-demand for your games.', price: { usd: 19, bdt: 950 } },
            ].map((c) => (
              <Card key={c.title} className="flex flex-col">
                <c.icon className={`${C.accent} mb-4`} size={22} />
                <div className={`font-display text-2xl ${C.text}`}>{c.title}</div>
                <p className={`mt-3 text-sm ${C.textDim}`}>{c.body}</p>
                <div className={`mt-6 font-mono text-sm ${C.textDim}`}>From <span className={`${C.text} text-base`}>{formatPrice(currency, c.price.usd, c.price.bdt)}</span></div>
                <button onClick={() => setPage('pricing')} className={`mt-4 self-start text-sm ${C.accent} inline-flex items-center gap-1`}>Learn more <ArrowUpRight size={14} /></button>
              </Card>
            ))}
          </div>
        </div>
      </Section>

      {/* PRESS LOGO WALL */}
      <Section>
        <div className="max-w-7xl mx-auto">
          <div className={`text-center text-xs font-mono uppercase tracking-widest ${C.textDim} mb-8`}>As featured in</div>
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-5">
            {['Dhaka Tribune','The Business Standard','Peninsula Qatar','Bangladesh Pratidin','BSS','Summit School of Chess'].map((p) => (
              <span key={p} className={`font-display text-base sm:text-lg ${C.textDim} grayscale hover:grayscale-0 hover:text-[#E8B547] transition-colors`}>{p}</span>
            ))}
          </div>
        </div>
      </Section>

      {/* TESTIMONIAL CAROUSEL */}
      <Section className={`${C.surface} border-y ${C.border}`}>
        <div className="max-w-3xl mx-auto text-center">
          <Quote className={`${C.accent} mx-auto mb-4`} size={28} />
          <div className="min-h-[180px]">
            <p key={tIdx} className={`page-enter font-display text-2xl sm:text-3xl ${C.text} leading-snug`}>“{TESTIMONIALS[tIdx].quote}”</p>
            <div className="mt-6 flex items-center justify-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#E8B547] text-[#0A0E1A] font-mono font-semibold flex items-center justify-center">{TESTIMONIALS[tIdx].initials}</div>
              <div className="text-left">
                <div className={`text-sm ${C.text}`}>{TESTIMONIALS[tIdx].name}</div>
                <div className={`text-xs font-mono ${C.textDim}`}>{TESTIMONIALS[tIdx].rating}</div>
              </div>
            </div>
          </div>
          <div className="mt-6 flex justify-center gap-2">
            {TESTIMONIALS.map((_, i) => (
              <button key={i} onClick={() => setTIdx(i)} className={`h-1.5 rounded-full ${i === tIdx ? 'w-8 bg-[#E8B547]' : 'w-3 bg-[var(--border)]'}`} aria-label={`testimonial ${i+1}`} />
            ))}
          </div>
        </div>
      </Section>

      {/* FINAL CTA */}
      <Section>
        <div className="max-w-4xl mx-auto text-center">
          <h2 className={`font-display text-4xl sm:text-6xl ${C.text}`}>Ready to level up?</h2>
          <p className={`mt-4 ${C.textDim}`}>Free 15-minute intro call. No sales pitch — bring a game, we’ll look at it.</p>
          <form
            className="mt-8 flex flex-col sm:flex-row gap-3 max-w-xl mx-auto"
            onSubmit={(e) => { e.preventDefault(); if (email) { onToast('We’ll be in touch.'); setEmail('') } }}
          >
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              type="email"
              placeholder="you@email.com"
              className={`flex-1 min-h-[48px] px-4 rounded-full ${C.surface} border ${C.border} ${C.text} focus:outline-none focus:border-[#E8B547]`}
            />
            <GoldButton type="submit">Book a call</GoldButton>
          </form>
        </div>
      </Section>
    </div>
  )
}

/* ============================================================================
   PAGE: ABOUT
============================================================================ */
function AboutPage() {
  return (
    <div>
      <Section>
        <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-5">
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden border border-[var(--border)] bg-gradient-to-br from-[#1F2638] via-[#141929] to-[#0A0E1A] flex items-center justify-center">
              <span className="text-[200px] text-[#E8B547]/40 leading-none">♞</span>
              <div className="absolute bottom-4 left-4 right-4 bg-black/40 backdrop-blur rounded-2xl p-3 border border-white/10">
                <div className={`text-xs font-mono uppercase tracking-widest ${C.accent}`}>FM Nayem Haque</div>
                <div className={`text-sm text-white`}>Dhaka · 2148 FIDE Standard</div>
              </div>
            </div>
            <div className="mt-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
              <div className={`text-xs font-mono uppercase tracking-widest ${C.accent} mb-4`}>Quick facts</div>
              <ul className="space-y-3">
                {QUICK_FACTS.map((f) => (
                  <li key={f.k} className="flex justify-between gap-4 text-sm">
                    <span className={C.textDim}>{f.k}</span>
                    <span className={`${C.text} font-mono text-right`}>{f.v}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className={`text-xs font-mono uppercase tracking-widest ${C.accent} mb-4`}>About</div>
            <h1 className={`font-display text-4xl sm:text-6xl ${C.text} leading-tight`}>The player behind the coach.</h1>
            <div className="mt-8 space-y-6 max-w-2xl">
              <p className={`text-base sm:text-lg ${C.textDim}`}>I grew up in Sirajganj, on the banks of the Jamuna. My first chess board was a paper one a relative drew with a marker. By 13, I had a FIDE rating. By 14, I was on the Bangladesh U-20 team.</p>
              <p className={`text-base sm:text-lg ${C.textDim}`}>I’ve represented Bangladesh at the World Youth Olympiad, Asian Youth, Western Asian Youth, and the Commonwealth Games. I now play for Bangladesh Biman — one of the top employer-teams in the country — and split my time between tournaments and coaching.</p>
              <p className={`text-base sm:text-lg ${C.textDim}`}>Coaching is the part of chess that satisfies me most. Watching a student see a pattern for the first time, or come back from a tournament with a result they wouldn’t have managed six months earlier — that’s the work.</p>
              <p className={`text-base sm:text-lg ${C.textDim}`}>In January 2025, my student Mugdho beat Magnus Carlsen in a bullet game. It put a spotlight on a process I’ve been quietly running for years. I don’t think the kid is a miracle — I think the work is.</p>
            </div>
          </div>
        </div>
      </Section>

      <Section className={`${C.surface} border-y ${C.border}`}>
        <div className="max-w-5xl mx-auto">
          <div className={`text-xs font-mono uppercase tracking-widest ${C.accent} mb-3`}>Timeline</div>
          <h2 className={`font-display text-3xl sm:text-4xl ${C.text} mb-10`}>A nine-year arc.</h2>
          <div className="relative pl-6 sm:pl-10 border-l border-[var(--border)]">
            {TIMELINE.map((t, i) => (
              <div key={i} className="mb-10 relative">
                <span className="absolute -left-[33px] sm:-left-[49px] top-1.5 w-3 h-3 rounded-full bg-[#E8B547] ring-4 ring-[var(--surface)]" />
                <div className={`font-mono text-xs ${C.accent}`}>{t.year}</div>
                <div className={`font-display text-xl sm:text-2xl ${C.text} mt-1`}>{t.title}</div>
                <p className={`mt-1 ${C.textDim}`}>{t.body}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section>
        <div className="max-w-5xl mx-auto">
          <div className={`text-xs font-mono uppercase tracking-widest ${C.accent} mb-3`}>Philosophy</div>
          <h2 className={`font-display text-3xl sm:text-4xl ${C.text}`}>Three principles I won’t bend on.</h2>
          <div className="mt-10 grid md:grid-cols-3 gap-5">
            {PRINCIPLES.map((p, i) => (
              <Card key={i}>
                <div className={`font-mono text-xs ${C.accent}`}>0{i+1}</div>
                <div className={`font-display text-xl ${C.text} mt-2`}>{p.title}</div>
                <p className={`mt-3 text-sm ${C.textDim}`}>{p.body}</p>
              </Card>
            ))}
          </div>
        </div>
      </Section>
    </div>
  )
}

/* ============================================================================
   PAGE: CAREER
============================================================================ */
function CareerPage() {
  return (
    <div>
      <Section>
        <div className="max-w-7xl mx-auto">
          <div className={`text-xs font-mono uppercase tracking-widest ${C.accent} mb-4`}>Playing Career</div>
          <h1 className={`font-display text-5xl sm:text-7xl ${C.text}`}>The board speaks.</h1>
          <p className={`mt-4 max-w-2xl ${C.textDim}`}>Ratings, tournaments, and a curve that took five years.</p>

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-5">
            {[
              { label: 'Standard', value: RATINGS.standard },
              { label: 'Rapid', value: RATINGS.rapid },
              { label: 'Blitz', value: RATINGS.blitz },
            ].map((r) => (
              <div key={r.label} className={`rounded-2xl border ${C.border} ${C.surface} p-6 sm:p-8`}>
                <div className={`text-xs font-mono uppercase tracking-widest ${C.textDim}`}>FIDE {r.label}</div>
                <div className={`mt-3 font-mono text-5xl sm:text-6xl ${C.text} tabular-nums`}>{r.value}</div>
                <div className="mt-3 inline-flex items-center gap-1 text-xs font-mono text-[#52C41A]"><TrendingUp size={12} /> live FIDE</div>
              </div>
            ))}
          </div>

          <div className={`mt-10 rounded-2xl border ${C.border} ${C.surface} p-4 sm:p-6`}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className={`text-xs font-mono uppercase tracking-widest ${C.accent}`}>Rating progression</div>
                <div className={`text-sm ${C.textDim}`}>2020 → today</div>
              </div>
              <div className={`text-xs font-mono ${C.textDim}`}>1820 → 2148</div>
            </div>
            <div className="h-64 sm:h-80">
              <ResponsiveContainer>
                <AreaChart data={RATING_HISTORY} margin={{ top: 8, right: 12, bottom: 0, left: -16 }}>
                  <defs>
                    <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#E8B547" stopOpacity={0.45} />
                      <stop offset="100%" stopColor="#E8B547" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="#1F2638" vertical={false} />
                  <XAxis dataKey="m" tick={{ fill: '#9CA3B8', fontSize: 10, fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} />
                  <YAxis domain={[1800, 2200]} tick={{ fill: '#9CA3B8', fontSize: 10, fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} width={48} />
                  <Tooltip contentStyle={{ background: '#141929', border: '1px solid #1F2638', borderRadius: 12, color: '#F5F1E8', fontFamily: 'JetBrains Mono', fontSize: 12 }} />
                  <Area type="monotone" dataKey="r" stroke="#E8B547" strokeWidth={2.5} fill="url(#g1)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </Section>

      <Section className={`${C.surface} border-y ${C.border}`}>
        <div className="max-w-7xl mx-auto">
          <div className={`text-xs font-mono uppercase tracking-widest ${C.accent} mb-3`}>Tournaments</div>
          <h2 className={`font-display text-3xl sm:text-4xl ${C.text} mb-8`}>Selected events</h2>

          <div className="hidden md:block">
            <div className={`grid grid-cols-12 px-4 py-3 text-xs font-mono uppercase tracking-widest ${C.textDim} border-b ${C.border}`}>
              <div className="col-span-1">Year</div>
              <div className="col-span-5">Event</div>
              <div className="col-span-3">Location</div>
              <div className="col-span-3">Result</div>
            </div>
            {TOURNAMENTS.map((t, i) => (
              <div key={i} className={`grid grid-cols-12 px-4 py-4 items-center border-b ${C.border} text-sm hover:bg-[#0A0E1A]/40`}>
                <div className={`col-span-1 font-mono ${C.accent}`}>{t.year}</div>
                <div className={`col-span-5 ${C.text}`}>{t.name}</div>
                <div className={`col-span-3 ${C.textDim}`}>{t.location}</div>
                <div className={`col-span-3 font-mono ${C.text}`}>{t.result}</div>
              </div>
            ))}
          </div>

          <div className="md:hidden space-y-3">
            {TOURNAMENTS.map((t, i) => (
              <Card key={i}>
                <div className={`flex justify-between items-start`}>
                  <div>
                    <div className={`font-mono text-xs ${C.accent}`}>{t.year}</div>
                    <div className={`mt-1 ${C.text}`}>{t.name}</div>
                    <div className={`text-xs ${C.textDim} mt-1`}>{t.location}</div>
                  </div>
                  <div className={`font-mono text-xs ${C.text} text-right`}>{t.result}</div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </Section>

      <Section>
        <div className="max-w-7xl mx-auto">
          <div className={`text-xs font-mono uppercase tracking-widest ${C.accent} mb-3`}>Achievements</div>
          <h2 className={`font-display text-3xl sm:text-4xl ${C.text} mb-8`}>What I’m proud of.</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {ACHIEVEMENTS.map((a, i) => (
              <Card key={i}>
                <a.icon className={`${C.accent} mb-3`} size={22} />
                <div className={`font-display text-lg ${C.text}`}>{a.title}</div>
                <div className={`text-sm ${C.textDim} mt-1`}>{a.detail}</div>
              </Card>
            ))}
          </div>

          <div className={`mt-12 rounded-2xl border ${C.border} ${C.surface} p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5`}>
            <div>
              <div className={`font-display text-2xl ${C.text}`}>Play me online</div>
              <p className={`text-sm ${C.textDim} mt-1`}>Chess.com @Nayemhaque22 · Lichess @Ilostagain2</p>
            </div>
            <div className="flex gap-3">
              <GoldButton as="a" href="https://www.chess.com/member/Nayemhaque22">Chess.com</GoldButton>
              <OutlineButton as="a" href="https://lichess.org/@/Ilostagain2">Lichess</OutlineButton>
            </div>
          </div>
        </div>
      </Section>
    </div>
  )
}

/* ============================================================================
   PAGE: COACHING
============================================================================ */
function CoachingPage({ setPage }) {
  const [openLevel, setOpenLevel] = useState(0)
  return (
    <div>
      <Section>
        <div className="max-w-7xl mx-auto">
          <div className={`text-xs font-mono uppercase tracking-widest ${C.accent} mb-4`}>Coaching</div>
          <h1 className={`font-display text-5xl sm:text-7xl ${C.text}`}>How I train players.</h1>
          <p className={`mt-4 max-w-2xl ${C.textDim}`}>Four pillars, one method: understanding first, memory second.</p>

          <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {COACHING_PILLARS.map((p) => (
              <Card key={p.title}>
                <p.icon className={`${C.accent} mb-4`} size={24} />
                <div className={`font-display text-2xl ${C.text}`}>{p.title}</div>
                <p className={`mt-3 text-sm ${C.textDim}`}>{p.body}</p>
              </Card>
            ))}
          </div>
        </div>
      </Section>

      <Section className={`${C.surface} border-y ${C.border}`}>
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-5">
          <Card>
            <div className={`text-xs font-mono uppercase tracking-widest text-[#52C41A] mb-3`}>Who this is for</div>
            <ul className="space-y-3">
              {[
                'Players who want to actually improve, not just play more games',
                'Adults who started later and feel stuck around 1200–1800',
                'Kids who already love chess and want a serious coach',
                'Tournament players preparing for specific events',
              ].map((x) => <li key={x} className="flex gap-2 text-sm"><Check size={16} className="text-[#52C41A] flex-shrink-0 mt-0.5" /> <span className={C.text}>{x}</span></li>)}
            </ul>
          </Card>
          <Card>
            <div className={`text-xs font-mono uppercase tracking-widest text-rose-400 mb-3`}>Who this isn’t for</div>
            <ul className="space-y-3">
              {[
                'People looking for a “rating in 30 days” shortcut',
                'Players who won’t do homework between sessions',
                'Anyone expecting engine analysis without context',
                'Spectators — this is active, not passive',
              ].map((x) => <li key={x} className="flex gap-2 text-sm"><X size={16} className="text-rose-400 flex-shrink-0 mt-0.5" /> <span className={C.text}>{x}</span></li>)}
            </ul>
          </Card>
        </div>
      </Section>

      <Section>
        <div className="max-w-5xl mx-auto">
          <div className={`text-xs font-mono uppercase tracking-widest ${C.accent} mb-3`}>Curriculum preview</div>
          <h2 className={`font-display text-3xl sm:text-4xl ${C.text} mb-8`}>Where do you fit?</h2>
          <div className="space-y-3">
            {CURRICULUM.map((c, i) => {
              const open = openLevel === i
              return (
                <div key={c.level} className={`rounded-2xl border ${open ? 'border-[#E8B547]' : C.border} ${C.surface} overflow-hidden`}>
                  <button onClick={() => setOpenLevel(open ? -1 : i)} className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left">
                    <div>
                      <div className={`font-display text-xl ${C.text}`}>{c.level}</div>
                      <div className={`text-xs font-mono ${C.textDim}`}>{c.range}</div>
                    </div>
                    {open ? <ChevronUp className={C.accent} /> : <ChevronDown className={C.textDim} />}
                  </button>
                  {open && (
                    <ul className="px-6 pb-6 space-y-2">
                      {c.bullets.map((b) => <li key={b} className={`text-sm ${C.textDim} flex gap-2`}><span className={`${C.accent} mt-1`}>·</span> <span>{b}</span></li>)}
                    </ul>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </Section>

      <Section className={`${C.surface} border-y ${C.border}`}>
        <div className="max-w-5xl mx-auto">
          <div className={`text-xs font-mono uppercase tracking-widest ${C.accent} mb-3`}>Tools</div>
          <h2 className={`font-display text-3xl sm:text-4xl ${C.text}`}>The toolkit, every lesson.</h2>
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {['Chess.com','Lichess','ChessBase','Zoom'].map((t) => (
              <div key={t} className={`rounded-2xl border ${C.border} ${C.bg} p-6 text-center`}>
                <div className={`font-display text-lg ${C.text}`}>{t}</div>
              </div>
            ))}
          </div>

          <div className={`mt-10 rounded-2xl border ${C.border} ${C.bg} p-6 sm:p-8`}>
            <div className={`text-xs font-mono uppercase tracking-widest ${C.accent} mb-3`}>Sample lesson outline</div>
            <div className="grid sm:grid-cols-4 gap-4 text-sm">
              {[
                { t: '00:00', h: 'Game review', b: 'One of your tournament games, critical positions only.' },
                { t: '15:00', h: 'Pattern set', b: 'Themed tactics — today: rook lifts and back-rank weaknesses.' },
                { t: '30:00', h: 'Opening trees', b: 'Add a branch to your repertoire that came up in your last game.' },
                { t: '45:00', h: 'Homework', b: 'Specific puzzles, one annotated study to play through.' },
              ].map((x) => (
                <div key={x.t} className={`border-l-2 border-[#E8B547] pl-3`}>
                  <div className={`font-mono text-xs ${C.accent}`}>{x.t}</div>
                  <div className={`${C.text} mt-1`}>{x.h}</div>
                  <div className={`${C.textDim} mt-1 text-xs`}>{x.b}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-10 flex flex-wrap gap-3"><GoldButton onClick={() => setPage('pricing')}>See pricing <ArrowRight size={16} /></GoldButton><OutlineButton onClick={() => setPage('contact')}>Book free intro</OutlineButton></div>
        </div>
      </Section>
    </div>
  )
}

/* ============================================================================
   PAGE: PRICING
============================================================================ */
function PricingPage({ currency, setCurrency, setPage, onToast }) {
  const [openFAQ, setOpenFAQ] = useState(-1)
  const scrollRef = useRef(null)
  const [scrollIdx, setScrollIdx] = useState(0)
  const onScroll = () => {
    if (!scrollRef.current) return
    const w = scrollRef.current.offsetWidth
    setScrollIdx(Math.round(scrollRef.current.scrollLeft / w))
  }

  return (
    <div>
      <Section>
        <div className="max-w-7xl mx-auto">
          <div className={`text-xs font-mono uppercase tracking-widest ${C.accent} mb-4`}>Pricing</div>
          <h1 className={`font-display text-5xl sm:text-7xl ${C.text}`}>Simple. Transparent.<br />No surprises.</h1>
          <p className={`mt-4 max-w-xl ${C.textDim}`}>Pay per package. Unused sessions refund on request. Local prices for Bangladesh.</p>

          <div className="mt-6 inline-flex items-center gap-0.5 rounded-full border border-[var(--border)] p-1">
            <Pill active={currency === 'USD'} onClick={() => setCurrency('USD')} className="border-0">USD</Pill>
            <Pill active={currency === 'BDT'} onClick={() => setCurrency('BDT')} className="border-0">BDT</Pill>
          </div>

          {/* Desktop grid */}
          <div className="hidden md:grid mt-12 grid-cols-4 gap-5">
            {PRICING.map((p) => (
              <Card key={p.id} highlight={p.highlight} className={p.highlight ? 'ring-1 ring-[#E8B547]/40' : ''}>
                {p.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-[#E8B547] text-[#0A0E1A] text-xs font-mono uppercase tracking-widest flex items-center gap-1">
                    <Star size={12} fill="currentColor" /> Most chosen
                  </div>
                )}
                <div className={`font-display text-2xl ${C.text}`}>{p.name}</div>
                <p className={`mt-2 text-sm ${C.textDim} min-h-[40px]`}>{p.blurb}</p>
                <div className={`mt-6 font-mono text-5xl ${C.text} tabular-nums`}>{formatPrice(currency, p.usd, p.bdt)}</div>
                <div className={`mt-1 text-xs font-mono ${C.textDim}`}>{p.sessions} session{p.sessions > 1 ? 's' : ''}{p.save ? ` · save ${p.save}` : ''}</div>
                {p.highlight ? (
                  <GoldButton onClick={() => setPage('contact')} className="mt-6 w-full">Book package</GoldButton>
                ) : (
                  <OutlineButton onClick={() => setPage('contact')} className="mt-6 w-full">Choose</OutlineButton>
                )}
              </Card>
            ))}
          </div>

          {/* Mobile scroll-snap */}
          <div className="md:hidden mt-10">
            <div
              ref={scrollRef}
              onScroll={onScroll}
              className="scroll-snap-x overflow-x-auto flex gap-4 no-scrollbar pb-2 -mx-5 px-5"
            >
              {PRICING.map((p) => (
                <div key={p.id} className="scroll-snap-center min-w-[85vw] max-w-[85vw]">
                  <Card highlight={p.highlight}>
                    {p.highlight && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-[#E8B547] text-[#0A0E1A] text-[10px] font-mono uppercase tracking-widest flex items-center gap-1">
                        <Star size={10} fill="currentColor" /> Most chosen
                      </div>
                    )}
                    <div className={`font-display text-2xl ${C.text}`}>{p.name}</div>
                    <p className={`mt-2 text-sm ${C.textDim}`}>{p.blurb}</p>
                    <div className={`mt-6 font-mono text-5xl ${C.text} tabular-nums`}>{formatPrice(currency, p.usd, p.bdt)}</div>
                    <div className={`mt-1 text-xs font-mono ${C.textDim}`}>{p.sessions} session{p.sessions > 1 ? 's' : ''}{p.save ? ` · save ${p.save}` : ''}</div>
                    <GoldButton onClick={() => setPage('contact')} className="mt-6 w-full">{p.highlight ? 'Book package' : 'Choose'}</GoldButton>
                  </Card>
                </div>
              ))}
            </div>
            <div className="mt-3 flex justify-center gap-2">
              {PRICING.map((_, i) => <span key={i} className={`h-1.5 rounded-full ${i === scrollIdx ? 'w-6 bg-[#E8B547]' : 'w-2 bg-[var(--border)]'}`} />)}
            </div>
          </div>
        </div>
      </Section>

      <Section className={`${C.surface} border-y ${C.border}`}>
        <div className="max-w-5xl mx-auto">
          <div className={`text-xs font-mono uppercase tracking-widest ${C.accent} mb-3`}>What’s included</div>
          <h2 className={`font-display text-3xl sm:text-4xl ${C.text} mb-8`}>Compare packages</h2>
          <div className={`rounded-2xl border ${C.border} ${C.bg} overflow-x-auto`}>
            <table className={`w-full text-sm`}>
              <thead>
                <tr className={`border-b ${C.border}`}>
                  <th className={`text-left p-4 font-mono text-xs uppercase tracking-widest ${C.textDim}`}>Feature</th>
                  {PRICING.map((p) => (
                    <th key={p.id} className={`p-4 font-mono text-xs uppercase tracking-widest text-center ${p.highlight ? C.accent : C.textDim}`}>{p.name}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COMPARE.map((row, i) => (
                  <tr key={i} className={`border-b ${C.border} last:border-0`}>
                    <td className={`p-4 ${C.text}`}>{row.feat}</td>
                    {['single','starter','serious','elite'].map((k) => (
                      <td key={k} className={`p-4 text-center font-mono ${C.text}`}>
                        {typeof row[k] === 'boolean' ? (row[k] ? <Check size={16} className="inline text-[#52C41A]" /> : <X size={16} className="inline text-[#1F2638]" />) : row[k]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Section>

      <Section>
        <div className="max-w-5xl mx-auto rounded-3xl border border-[#E8B547]/40 bg-gradient-to-br from-[#E8B547]/10 to-transparent p-8 sm:p-12 text-center">
          <Sparkles className={`${C.accent} mx-auto mb-3`} />
          <h3 className={`font-display text-3xl sm:text-4xl ${C.text}`}>Free 15-minute intro call</h3>
          <p className={`mt-3 ${C.textDim} max-w-xl mx-auto`}>Bring a game or just bring questions. We’ll see if it’s a fit. No commitment.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <GoldButton onClick={() => setPage('contact')}>Book free call <ArrowRight size={16} /></GoldButton>
            <OutlineButton onClick={() => setPage('coaching')}>How I coach</OutlineButton>
          </div>
        </div>
      </Section>

      <Section className={`${C.surface} border-y ${C.border}`}>
        <div className="max-w-5xl mx-auto">
          <div className={`text-xs font-mono uppercase tracking-widest ${C.accent} mb-3`}>Payments</div>
          <h2 className={`font-display text-2xl sm:text-3xl ${C.text} mb-6`}>Pay how it works for you.</h2>
          <div className="flex flex-wrap gap-3">
            {['bKash','Nagad','Bank transfer','Stripe (Cards)','PayPal'].map((p) => (
              <div key={p} className={`px-4 py-3 rounded-xl border ${C.border} ${C.bg} font-mono text-sm ${C.text}`}>{p}</div>
            ))}
          </div>
        </div>
      </Section>

      <Section>
        <div className="max-w-3xl mx-auto">
          <div className={`text-xs font-mono uppercase tracking-widest ${C.accent} mb-3`}>FAQ</div>
          <h2 className={`font-display text-3xl sm:text-4xl ${C.text} mb-8`}>Common questions.</h2>
          <div className="space-y-3">
            {FAQ.map((f, i) => {
              const open = openFAQ === i
              return (
                <div key={i} className={`rounded-2xl border ${open ? 'border-[#E8B547]' : C.border} ${C.surface}`}>
                  <button onClick={() => setOpenFAQ(open ? -1 : i)} className="w-full px-6 py-5 text-left flex items-center justify-between gap-4">
                    <span className={`${C.text} text-base sm:text-lg`}>{f.q}</span>
                    {open ? <ChevronUp className={C.accent} /> : <ChevronDown className={C.textDim} />}
                  </button>
                  {open && <div className={`px-6 pb-5 -mt-2 text-sm ${C.textDim}`}>{f.a}</div>}
                </div>
              )
            })}
          </div>
        </div>
      </Section>
    </div>
  )
}

/* ============================================================================
   PAGE: STUDENTS
============================================================================ */
function StudentsPage() {
  return (
    <div>
      <Section>
        <div className="max-w-7xl mx-auto">
          <div className={`text-xs font-mono uppercase tracking-widest ${C.accent} mb-4`}>Case Study · Rayan Rashid Mugdho</div>
          <h1 className={`font-display text-5xl sm:text-7xl ${C.text} leading-[0.95]`}>9 years old. World<br />champion defeated.</h1>

          <div className="mt-12 grid lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-7 space-y-5">
              <p className={`text-base sm:text-lg ${C.textDim}`}>Rayan Rashid Mugdho started lessons with me when he was seven. We worked through the basics other coaches skip — piece coordination, real endgames, how to lose without panic.</p>
              <p className={`text-base sm:text-lg ${C.textDim}`}>On <span className={C.text}>January 18, 2025</span>, in a 1-minute bullet game on Chess.com, Mugdho beat the World Champion Magnus Carlsen. The position drifted into our Najdorf prep. Carlsen blundered. Mugdho didn’t.</p>
              <p className={`text-base sm:text-lg ${C.textDim}`}>The internet noticed. National TV came knocking. Our work hasn’t changed.</p>

              <div className={`mt-8 rounded-2xl border ${C.border} ${C.surface} p-6`}>
                <Quote className={`${C.accent} mb-3`} />
                <p className={`font-display text-xl sm:text-2xl ${C.text}`}>“I’ve reduced the number of students I train to focus more on Mugdho because I see immense potential in him.”</p>
                <div className={`mt-3 text-xs font-mono uppercase tracking-widest ${C.textDim}`}>— FM Nayem Haque</div>
              </div>
            </div>

            <div className="lg:col-span-5">
              <ChessBoard />
            </div>
          </div>
        </div>
      </Section>

      <Section className={`${C.surface} border-y ${C.border}`}>
        <div className="max-w-7xl mx-auto">
          <div className={`text-xs font-mono uppercase tracking-widest ${C.accent} mb-3`}>Wall of wins</div>
          <h2 className={`font-display text-3xl sm:text-4xl ${C.text} mb-8`}>The rest of the roster.</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {STUDENTS.map((s) => (
              <Card key={s.initials}>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-[#E8B547] text-[#0A0E1A] font-mono font-semibold flex items-center justify-center">{s.initials}</div>
                  <div>
                    <div className={`${C.text}`}>{s.name}</div>
                    <div className={`text-xs font-mono ${C.textDim}`}>Student</div>
                  </div>
                </div>
                <div className="mt-5 flex items-baseline gap-2">
                  <span className={`font-mono text-3xl ${C.text} tabular-nums`}>{s.before}</span>
                  <ArrowRight className={C.textDim} size={18} />
                  <span className={`font-mono text-3xl text-[#52C41A] tabular-nums`}>{s.after}</span>
                </div>
                <div className={`mt-2 text-sm ${C.textDim}`}>{s.headline}</div>
              </Card>
            ))}
          </div>
        </div>
      </Section>

      <Section>
        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-8">
          <StatNumber value={4200} suffix="+" label="ELO points gained" sub="across the roster this year" />
          <StatNumber value={6} label="Titled students" sub="CM / WCM / FM norms" />
          <StatNumber value={89} suffix="%" label="Improvement rate" sub="students who gain rating" />
          <StatNumber value={1} label="Carlsen, defeated" sub="January 18, 2025" />
        </div>
      </Section>
    </div>
  )
}

/* ============================================================================
   PAGE: PRESS
============================================================================ */
function PressPage() {
  return (
    <div>
      <Section>
        <div className="max-w-7xl mx-auto">
          <div className={`text-xs font-mono uppercase tracking-widest ${C.accent} mb-4`}>Press</div>
          <h1 className={`font-display text-5xl sm:text-7xl ${C.text}`}>As featured in.</h1>
          <p className={`mt-4 max-w-2xl ${C.textDim}`}>A quiet coaching practice in Dhaka, suddenly in the international news cycle.</p>

          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {PRESS.map((p, i) => (
              <a key={i} href="#" className={`group rounded-2xl border ${C.border} ${C.surface} overflow-hidden block hover:-translate-y-0.5 transition-transform`}>
                <div className={`relative aspect-[4/3] bg-gradient-to-br ${p.hue} ${C.surface}`}>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <FileText className={`${C.accent}`} size={32} />
                  </div>
                  <div className={`absolute bottom-3 left-3 text-[10px] font-mono uppercase tracking-widest ${C.text}`}>{p.pub}</div>
                </div>
                <div className="p-5">
                  <div className={`text-xs font-mono ${C.textDim}`}>{p.date}</div>
                  <div className={`mt-2 font-display text-lg ${C.text} leading-snug`}>{p.title}</div>
                  <div className={`mt-3 text-xs ${C.accent} inline-flex items-center gap-1`}>Read article <ArrowUpRight size={12} /></div>
                </div>
              </a>
            ))}
          </div>

          <div className={`mt-12 rounded-2xl border ${C.border} ${C.surface} p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5`}>
            <div>
              <div className={`font-display text-2xl ${C.text}`}>Press kit</div>
              <p className={`text-sm ${C.textDim} mt-1`}>High-res photos, bio, fact sheet, the Mugdho-Carlsen PGN.</p>
            </div>
            <OutlineButton as="a" href="#"><Download size={16} /> Download (.zip)</OutlineButton>
          </div>
        </div>
      </Section>

      <Section className={`${C.surface} border-y ${C.border}`}>
        <div className="max-w-7xl mx-auto">
          <div className={`text-xs font-mono uppercase tracking-widest ${C.accent} mb-3`}>What they’re saying</div>
          <h2 className={`font-display text-3xl sm:text-4xl ${C.text} mb-8`}>Pull quotes.</h2>
          <div className="grid md:grid-cols-3 gap-5">
            {PRESS_QUOTES.map((q, i) => (
              <Card key={i}>
                <Quote className={`${C.accent} mb-4`} />
                <p className={`font-display text-xl ${C.text} leading-snug`}>“{q.quote}”</p>
                <div className={`mt-4 text-xs font-mono uppercase tracking-widest ${C.textDim}`}>— {q.who}</div>
              </Card>
            ))}
          </div>
        </div>
      </Section>
    </div>
  )
}

/* ============================================================================
   PAGE: CONTACT
============================================================================ */
function ContactPage({ onToast }) {
  const [form, setForm] = useState({ name: '', email: '', level: 'Beginner (0–1200)', message: '' })
  const submit = (e) => {
    e.preventDefault()
    if (!form.name || !form.email) return
    onToast('Sent! I’ll reply within 24 hours.')
    setForm({ name: '', email: '', level: 'Beginner (0–1200)', message: '' })
  }

  return (
    <div>
      <Section>
        <div className="max-w-7xl mx-auto">
          <div className={`text-xs font-mono uppercase tracking-widest ${C.accent} mb-4`}>Contact</div>
          <h1 className={`font-display text-5xl sm:text-7xl ${C.text}`}>Let’s play.</h1>
          <p className={`mt-4 max-w-xl ${C.textDim}`}>Free 15-minute intro, no obligation. Or just say hi — I read every message.</p>

          <div className="mt-12 grid lg:grid-cols-12 gap-10">
            {/* FORM */}
            <form onSubmit={submit} className={`lg:col-span-7 rounded-2xl border ${C.border} ${C.surface} p-6 sm:p-8 space-y-4`}>
              <div className="grid sm:grid-cols-2 gap-4">
                <label className="block">
                  <span className={`text-xs font-mono uppercase tracking-widest ${C.textDim}`}>Name</span>
                  <input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                    className={`mt-2 w-full min-h-[48px] px-4 rounded-xl ${C.bg} border ${C.border} ${C.text} focus:outline-none focus:border-[#E8B547]`}
                    placeholder="Your name"
                  />
                </label>
                <label className="block">
                  <span className={`text-xs font-mono uppercase tracking-widest ${C.textDim}`}>Email</span>
                  <input
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                    type="email"
                    className={`mt-2 w-full min-h-[48px] px-4 rounded-xl ${C.bg} border ${C.border} ${C.text} focus:outline-none focus:border-[#E8B547]`}
                    placeholder="you@email.com"
                  />
                </label>
              </div>
              <label className="block">
                <span className={`text-xs font-mono uppercase tracking-widest ${C.textDim}`}>Your level</span>
                <select
                  value={form.level}
                  onChange={(e) => setForm({ ...form, level: e.target.value })}
                  className={`mt-2 w-full min-h-[48px] px-4 rounded-xl ${C.bg} border ${C.border} ${C.text} focus:outline-none focus:border-[#E8B547]`}
                >
                  <option>Beginner (0–1200)</option>
                  <option>Improver (1200–1800)</option>
                  <option>Tournament (1800+)</option>
                  <option>Parent / on behalf of child</option>
                </select>
              </label>
              <label className="block">
                <span className={`text-xs font-mono uppercase tracking-widest ${C.textDim}`}>Message</span>
                <textarea
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  rows={5}
                  className={`mt-2 w-full px-4 py-3 rounded-xl ${C.bg} border ${C.border} ${C.text} focus:outline-none focus:border-[#E8B547]`}
                  placeholder="A game you want analyzed, or just say hi."
                />
              </label>
              <GoldButton type="submit" className="w-full sm:w-auto">Send message <Send size={16} /></GoldButton>
            </form>

            {/* CONTACT METHODS */}
            <div className="lg:col-span-5 space-y-4">
              {[
                { Icon: Mail, label: 'Email', value: 'nayemhaque32@gmail.com', href: 'mailto:nayemhaque32@gmail.com' },
                { Icon: MessageCircle, label: 'WhatsApp', value: '+880 1XXX-XXXXXX', href: '#' },
                { Icon: MapPin, label: 'Location', value: 'Dhaka, Bangladesh', href: '#' },
              ].map(({ Icon, label, value, href }) => (
                <a key={label} href={href} className={`block rounded-2xl border ${C.border} ${C.surface} p-5 hover:-translate-y-0.5 transition-transform`}>
                  <div className={`text-xs font-mono uppercase tracking-widest ${C.accent}`}>{label}</div>
                  <div className="mt-2 flex items-center gap-3">
                    <Icon className={C.text} size={18} />
                    <span className={`${C.text} font-mono text-sm`}>{value}</span>
                  </div>
                </a>
              ))}

              <div className={`rounded-2xl border ${C.border} ${C.surface} p-5`}>
                <div className={`text-xs font-mono uppercase tracking-widest ${C.accent} mb-3`}>Find me online</div>
                <div className="grid grid-cols-2 gap-2">
                  {SOCIALS.map((s) => (
                    <a key={s.label} href={s.href} className={`flex items-center gap-2 px-3 py-2 rounded-xl border ${C.border} ${C.bg} hover:border-[#E8B547] transition-colors`}>
                      <s.icon className={C.accent} size={14} />
                      <div className="min-w-0">
                        <div className={`text-xs ${C.text} truncate`}>{s.label}</div>
                        <div className={`text-[10px] font-mono ${C.textDim} truncate`}>{s.handle}</div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      <Section className={`${C.surface} border-y ${C.border}`}>
        <div className="max-w-5xl mx-auto">
          <div className={`text-xs font-mono uppercase tracking-widest ${C.accent} mb-3`}>Book directly</div>
          <h2 className={`font-display text-3xl sm:text-4xl ${C.text} mb-2`}>Pick a slot.</h2>
          <p className={`text-sm ${C.textDim} mb-6`}>15-minute intro call, Bangladesh Standard Time (BST).</p>

          <div className={`rounded-2xl border ${C.border} ${C.bg} p-4 sm:p-6 overflow-x-auto`}>
            <div className="grid grid-cols-7 gap-2 min-w-[560px]">
              {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map((d) => (
                <div key={d} className={`text-center text-xs font-mono uppercase tracking-widest ${C.textDim}`}>{d}</div>
              ))}
              {Array.from({ length: 35 }, (_, i) => {
                const avail = [3,4,5,6,10,11,12,13,17,18,19,20,21,24,25,26,27,28].includes(i)
                const slot = i + 1
                return (
                  <button
                    key={i}
                    disabled={!avail}
                    className={`aspect-square rounded-lg text-sm font-mono ${avail ? `${C.text} border ${C.border} hover:bg-[#E8B547] hover:text-[#0A0E1A] hover:border-[#E8B547]` : `${C.textDim} opacity-40`}`}
                  >
                    {slot}
                  </button>
                )
              })}
            </div>
          </div>
          <p className={`mt-4 text-xs ${C.textDim} font-mono inline-flex items-center gap-2`}><Clock size={12} /> Slots refresh weekly · all times BST</p>
        </div>
      </Section>
    </div>
  )
}

/* ============================================================================
   THEME STYLE INJECTION  (CSS variables)
============================================================================ */
function ThemeStyles() {
  return (
    <style>{`
      :root {
        --bg: #0A0E1A;
        --surface: #141929;
        --border: #1F2638;
        --text-primary: #F5F1E8;
        --text-secondary: #9CA3B8;
        --accent: #E8B547;
        --success: #52C41A;
      }
      [data-theme="light"] {
        --bg: #F5F1E8;
        --surface: #FFFFFF;
        --border: #E5DED0;
        --text-primary: #0A0E1A;
        --text-secondary: #4B5366;
        --accent: #B8861F;
        --success: #3D9A14;
      }
    `}</style>
  )
}

/* ============================================================================
   MAIN APP
============================================================================ */
export default function App() {
  const [page, setPage] = useState('home')
  const [currency, setCurrency] = useState('USD')
  const [lang, setLang] = useState('EN')
  const [theme, setTheme] = useState('dark')
  const { msg, show } = useToast()

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [page])

  const goto = useCallback((p) => setPage(p), [])

  const pageEl = useMemo(() => {
    switch (page) {
      case 'home':     return <HomePage     setPage={goto} currency={currency} onToast={show} />
      case 'about':    return <AboutPage />
      case 'career':   return <CareerPage />
      case 'coaching': return <CoachingPage setPage={goto} />
      case 'pricing':  return <PricingPage  currency={currency} setCurrency={setCurrency} setPage={goto} onToast={show} />
      case 'students': return <StudentsPage />
      case 'press':    return <PressPage />
      case 'contact':  return <ContactPage onToast={show} />
      default:         return <HomePage     setPage={goto} currency={currency} onToast={show} />
    }
  }, [page, currency, goto, show])

  return (
    <div className={`min-h-screen ${C.bg} ${C.text} antialiased pb-16 md:pb-0`}>
      <ThemeStyles />
      <NoiseOverlay />
      <TopNav page={page} setPage={goto} currency={currency} setCurrency={setCurrency} lang={lang} setLang={setLang} theme={theme} setTheme={setTheme} />
      <main className="relative z-10">
        <div key={page} className="page-enter">{pageEl}</div>
      </main>
      <Footer setPage={goto} onToast={show} />
      <MobileBottomNav page={page} setPage={goto} />
      <Toast msg={msg} />
    </div>
  )
}
