import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Home, GraduationCap, DollarSign, Mail, Menu, Globe, Sun, Moon,
  Award, Trophy, Target, BookOpen, Users, Brain, Play, Pause,
  ChevronLeft, ChevronRight, ChevronDown, ChevronUp, Check, X,
  ExternalLink, Calendar, MapPin, MessageCircle, Send, Star,
  Quote, Newspaper, Download, ArrowRight, Sparkles, Zap, Crown,
  Instagram, Youtube, Facebook
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart
} from 'recharts';

/* ------------------------------------------------------------------ */
/* Constants                                                          */
/* ------------------------------------------------------------------ */

const PAGES = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'career', label: 'Playing Career' },
  { id: 'coaching', label: 'Coaching' },
  { id: 'pricing', label: 'Pricing' },
  { id: 'students', label: 'Students' },
  { id: 'press', label: 'Press' },
  { id: 'contact', label: 'Contact' },
];

const MOBILE_NAV = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'coaching', label: 'Coach', icon: GraduationCap },
  { id: 'pricing', label: 'Pricing', icon: DollarSign },
  { id: 'contact', label: 'Contact', icon: Mail },
];

/* Fake Mugdho-vs-Carlsen 50-move dummy game */
const MUGDHO_GAME = [
  'e4', 'c5', 'Nf3', 'd6', 'd4', 'cxd4', 'Nxd4', 'Nf6', 'Nc3', 'a6',
  'Be3', 'e5', 'Nb3', 'Be6', 'f3', 'Be7', 'Qd2', 'O-O', 'O-O-O', 'Nbd7',
  'g4', 'b5', 'g5', 'b4', 'Ne2', 'Ne8', 'h4', 'a5', 'Kb1', 'a4',
  'Nbd4', 'exd4', 'Nxd4', 'Bxa2+', 'Kxa2', 'Qa5', 'Kb1', 'Nc5', 'Nb5', 'Qa6',
  'Nxd6', 'Nxd6', 'Bxc5', 'Qe2', 'Qxe2', 'Nxe2', 'Bxe7', 'Rfe8', 'Bd6', 'Rad8'
];

const RATING_DATA = [
  { year: '2019', rating: 1820 },
  { year: '2020', rating: 1925 },
  { year: '2021', rating: 2010 },
  { year: '2022', rating: 2065 },
  { year: '2023', rating: 2102 },
  { year: '2024', rating: 2148 },
];

const TOURNAMENTS = [
  { year: 2024, name: 'Bangkok Chess Club Open', location: 'Hua Hin, Thailand', result: '3.0 / 5', note: '21st place' },
  { year: 2024, name: '48th Bangladesh Championship', location: 'Dhaka', result: 'Drew vs IM Fahad Rahman', note: '' },
  { year: 2024, name: 'CJKS Premier Division League', location: 'Chittagong', result: 'Participated', note: '' },
  { year: 2017, name: 'Bangladesh U20 Championships', location: 'Dhaka', result: 'Top 10', note: '' },
  { year: 2016, name: 'National U-18 Championship', location: 'Dhaka', result: 'Champion', note: 'Title' },
  { year: 2018, name: 'World Youth Olympiad', location: '—', result: 'Bangladesh team', note: 'Represented' },
  { year: 2019, name: 'Asian Youth Championship', location: '—', result: 'Bangladesh team', note: 'Represented' },
  { year: 2017, name: 'Western Asian Youth', location: '—', result: 'Bangladesh team', note: 'Represented' },
  { year: 2018, name: 'Commonwealth Games', location: '—', result: 'Bangladesh team', note: 'Represented' },
];

const PRESS = [
  { pub: 'Dhaka Tribune', date: 'Jan 2025', title: '9-year old Bangladeshi Mugdho beats 5-time World Champion Magnus Carlsen!', tag: 'Feature' },
  { pub: 'The Business Standard', date: 'Jan 2025', title: '9-yr-old chess prodigy Mugdha defeats Magnus Carlsen', tag: 'News' },
  { pub: 'The Business Standard', date: 'Jan 2025', title: 'A chess prodigy in the making', tag: 'Interview' },
  { pub: 'Peninsula Qatar', date: 'Jan 2025', title: '9-year-old Bangladeshi chess student defeats world number one Magnus Carlsen', tag: 'International' },
  { pub: 'Bangladesh Pratidin', date: 'Jan 2025', title: '9-yr old Ryan beats World No.1 Carlsen in bullet chess', tag: 'News' },
  { pub: 'BSS News', date: 'Jul 2024', title: 'Fahad splits point with Nayem', tag: 'Tournament' },
  { pub: 'BSS News', date: 'Apr 2024', title: 'FM Neer shares lead in Bangkok Chess', tag: 'Tournament' },
  { pub: 'Summit School of Chess', date: 'Jan 2025', title: 'Unbelievable Upset', tag: 'Coaching' },
];

const STUDENT_WINS = [
  { initial: 'R', name: 'Rayan R. Mugdho', from: 1100, to: 1480, headline: 'Beat Carlsen in bullet' },
  { initial: 'A', name: 'Arif H.', from: 950, to: 1340, headline: 'U-12 District Champion' },
  { initial: 'S', name: 'Sara K.', from: 1200, to: 1620, headline: 'WIM norm candidate' },
  { initial: 'M', name: 'Mehedi I.', from: 1400, to: 1810, headline: 'CM title pending' },
  { initial: 'T', name: 'Tahmid R.', from: 800, to: 1240, headline: 'First tournament win' },
  { initial: 'F', name: 'Fariha A.', from: 1050, to: 1395, headline: 'National U-14 top 5' },
];

const TESTIMONIALS = [
  { initial: 'R', name: "Rayan's father", role: 'Parent', text: 'Nayem treats Mugdho like a partner, not a student. The Carlsen game wasn\'t luck — it was preparation. Every move had been seen.' },
  { initial: 'M', name: 'Mehedi I.', role: 'Student, 2 yrs', text: 'I went from random tactics to actually understanding chess. The endgame work alone added 200 points to my rating.' },
  { initial: 'S', name: 'Sara K.', role: 'Student, 1 yr', text: 'He doesn\'t teach openings. He teaches how to think. That difference is everything.' },
];

const FX = { USD: 1, BDT: 50 };
const fmt = (amount, cur) => {
  if (cur === 'BDT') return '৳' + (amount * FX.BDT).toLocaleString();
  return '$' + amount.toLocaleString();
};

/* ------------------------------------------------------------------ */
/* Theme context (lightweight)                                        */
/* ------------------------------------------------------------------ */

const ThemeCtx = React.createContext({ currency: 'USD', setCurrency: () => {}, lang: 'EN', setLang: () => {}, dark: true, setDark: () => {} });

/* ------------------------------------------------------------------ */
/* Chess board                                                        */
/* ------------------------------------------------------------------ */

const PIECE_GLYPH = { K: '♔', Q: '♕', R: '♖', B: '♗', N: '♘', P: '♙', k: '♚', q: '♛', r: '♜', b: '♝', n: '♞', p: '♟' };

const startBoard = () => [
  ['r','n','b','q','k','b','n','r'],
  ['p','p','p','p','p','p','p','p'],
  ['','','','','','','',''],
  ['','','','','','','',''],
  ['','','','','','','',''],
  ['','','','','','','',''],
  ['P','P','P','P','P','P','P','P'],
  ['R','N','B','Q','K','B','N','R'],
];

/* Pre-computed mock board states at intervals so the "play through" feels real.
   We use the move number to interpolate piece scatter — purely cosmetic. */
function boardAtMove(idx) {
  const b = startBoard();
  if (idx <= 0) return b;
  // Hand-crafted scatter: progressively remove pawns / move knights
  const scatter = [
    [[6,4],[4,4]],  // 1. e4
    [[1,2],[3,2]],  // 1...c5
    [[7,6],[5,5]],  // 2. Nf3
    [[1,3],[2,3]],  // 2...d6
    [[6,3],[4,3]],  // 3. d4
    [[3,2],[4,3], 'P','x'], // 3...cxd4
    [[5,5],[4,3]],  // 4. Nxd4
    [[1,5],[2,5]],  // 4...Nf6 (use pawn slot as visual)
    [[7,1],[5,2]],  // 5. Nc3
    [[1,0],[2,0]],
    [[7,2],[5,4]],
    [[1,4],[3,4]],
    [[4,3],[5,1]],
    [[1,4],[3,4],'P','noop'],
    [[6,5],[5,5]],
    [[2,5],[4,4]],
    [[7,3],[6,3]],
    [[0,4],[2,4]],
    [[7,4],[7,2]],
    [[1,6],[2,6]],
    [[6,6],[4,6]],
    [[1,1],[3,1]],
    [[4,6],[3,6]],
    [[3,1],[4,1]],
    [[5,2],[3,3]],
    [[2,5],[1,4]],
    [[6,7],[4,7]],
    [[1,0],[3,0]],
    [[7,2],[7,1]],
    [[3,0],[4,0]],
    [[5,1],[3,2]],
    [[4,3],[3,2],'capture'],
    [[3,3],[3,2],'capture'],
    [[2,4],[0,0],'capture'],
    [[7,1],[0,0]],
    [[0,3],[4,0]],
    [[0,0],[7,1]],
    [[2,5],[3,4]],
    [[3,2],[3,4]],
    [[4,0],[0,5]],
    [[3,4],[3,2]],
    [[2,3],[3,2],'capture'],
    [[3,2],[3,2]],
    [[6,2],[3,2],'capture'],
    [[3,4],[3,3]],
    [[3,3],[3,3]],
    [[3,2],[1,4]],
    [[3,2],[0,4],'capture'],
    [[0,5],[0,3]],
    [[1,4],[2,3]],
  ];
  for (let i = 0; i < idx && i < scatter.length; i++) {
    const s = scatter[i];
    if (!s) continue;
    const [from, to] = s;
    const piece = b[from[0]]?.[from[1]];
    if (piece) {
      b[from[0]][from[1]] = '';
      if (to && b[to[0]]) b[to[0]][to[1]] = piece;
    }
  }
  return b;
}

function ChessBoard({ moveIdx = 0, onSquareClick, highlight, compact = false }) {
  const board = useMemo(() => boardAtMove(moveIdx), [moveIdx]);
  const files = ['a','b','c','d','e','f','g','h'];
  return (
    <div className={`relative ${compact ? 'w-full' : 'w-full'} aspect-square`}>
      <div className="grid grid-cols-8 grid-rows-8 w-full h-full rounded-md overflow-hidden shadow-2xl border border-[#1F2638]">
        {board.flatMap((row, r) =>
          row.map((piece, c) => {
            const isLight = (r + c) % 2 === 0;
            const isHi = highlight && highlight[0] === r && highlight[1] === c;
            return (
              <div
                key={`${r}-${c}`}
                onClick={() => onSquareClick && onSquareClick(r, c)}
                className={`relative flex items-center justify-center select-none transition-colors ${isLight ? 'bg-[#EADFC0]' : 'bg-[#7E5B3A]'} ${isHi ? 'ring-2 ring-[#E8B547] ring-inset' : ''}`}
                style={{ cursor: onSquareClick ? 'pointer' : 'default' }}
              >
                {piece && (
                  <span
                    className="leading-none"
                    style={{
                      fontSize: 'clamp(18px, 5vw, 44px)',
                      color: piece === piece.toUpperCase() ? '#1A1A1A' : '#0A0E1A',
                      textShadow: piece === piece.toUpperCase() ? '0 1px 0 rgba(255,255,255,0.4)' : 'none',
                      filter: piece === piece.toLowerCase() ? 'drop-shadow(0 0 1px rgba(255,255,255,0.3))' : 'none',
                    }}
                  >
                    {PIECE_GLYPH[piece]}
                  </span>
                )}
                {r === 7 && (
                  <span className="absolute bottom-0 right-0.5 text-[8px] sm:text-[10px] font-mono-chess opacity-50">{files[c]}</span>
                )}
                {c === 0 && (
                  <span className="absolute top-0 left-0.5 text-[8px] sm:text-[10px] font-mono-chess opacity-50">{8 - r}</span>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

function ChessPlayer({ moves = MUGDHO_GAME, title = 'Mugdho vs Carlsen' }) {
  const [idx, setIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  useEffect(() => {
    if (!playing) return;
    if (idx >= moves.length) { setPlaying(false); return; }
    const t = setTimeout(() => setIdx(i => Math.min(i + 1, moves.length)), 900);
    return () => clearTimeout(t);
  }, [playing, idx, moves.length]);

  const reset = () => { setIdx(0); setPlaying(false); };
  const last = idx > 0 ? moves[idx - 1] : null;

  return (
    <div className="bg-[#141929] border border-[#1F2638] rounded-2xl p-4 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-xs text-[#9CA3B8] font-mono-chess uppercase tracking-wider">{title}</div>
          <div className="text-sm text-[#F5F1E8] font-display">Jan 18, 2025 · Bullet</div>
        </div>
        <div className="font-mono-chess text-xs text-[#E8B547]">
          {idx} / {moves.length}
        </div>
      </div>

      <ChessBoard moveIdx={idx} />

      <div className="mt-4 flex items-center justify-between gap-3">
        <button
          onClick={() => setIdx(i => Math.max(0, i - 1))}
          className="flex-1 h-12 rounded-lg border border-[#1F2638] hover:border-[#E8B547] transition-colors flex items-center justify-center text-[#F5F1E8]"
          aria-label="Previous move"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={() => setPlaying(p => !p)}
          className="flex-1 h-12 rounded-lg bg-[#E8B547] text-[#0A0E1A] font-semibold flex items-center justify-center gap-2 hover:bg-[#F0C25F] transition-colors"
        >
          {playing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          {playing ? 'Pause' : 'Play'}
        </button>
        <button
          onClick={() => setIdx(i => Math.min(moves.length, i + 1))}
          className="flex-1 h-12 rounded-lg border border-[#1F2638] hover:border-[#E8B547] transition-colors flex items-center justify-center text-[#F5F1E8]"
          aria-label="Next move"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
        <div className="bg-[#0A0E1A] rounded-md px-3 py-2 border border-[#1F2638]">
          <div className="text-[#9CA3B8] font-mono-chess">Last move</div>
          <div className="font-mono-chess text-[#F5F1E8]">{last || '—'}</div>
        </div>
        <div className="bg-[#0A0E1A] rounded-md px-3 py-2 border border-[#1F2638]">
          <div className="text-[#9CA3B8] font-mono-chess">Status</div>
          <div className="font-mono-chess text-[#52C41A]">
            {idx >= moves.length ? 'Carlsen resigns' : idx > moves.length / 2 ? 'Black advantage' : 'Sharp Sicilian'}
          </div>
        </div>
      </div>

      <button onClick={reset} className="mt-3 w-full text-xs text-[#9CA3B8] hover:text-[#E8B547] transition-colors font-mono-chess uppercase tracking-wider">
        Reset
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* CTA button with cursor-follow glow                                 */
/* ------------------------------------------------------------------ */

function AmberCTA({ children, onClick, className = '', size = 'md' }) {
  const ref = useRef(null);
  const onMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty('--x', `${e.clientX - r.left}px`);
    el.style.setProperty('--y', `${e.clientY - r.top}px`);
  };
  const sizing = size === 'lg' ? 'px-7 py-4 text-base' : 'px-5 py-3 text-sm';
  return (
    <button
      ref={ref}
      onMouseMove={onMove}
      onClick={onClick}
      className={`cta-glow inline-flex items-center justify-center gap-2 ${sizing} rounded-lg bg-[#E8B547] text-[#0A0E1A] font-semibold hover:bg-[#F0C25F] transition-colors min-h-[48px] ${className}`}
    >
      {children}
    </button>
  );
}

function OutlineCTA({ children, onClick, className = '', size = 'md' }) {
  const sizing = size === 'lg' ? 'px-7 py-4 text-base' : 'px-5 py-3 text-sm';
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-2 ${sizing} rounded-lg border border-[#1F2638] text-[#F5F1E8] hover:border-[#E8B547] hover:text-[#E8B547] transition-colors min-h-[48px] ${className}`}
    >
      {children}
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* Count-up number                                                    */
/* ------------------------------------------------------------------ */

function CountUp({ value, suffix = '', duration = 1200 }) {
  const [n, setN] = useState(0);
  const ref = useRef(null);
  const seen = useRef(false);
  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting && !seen.current) {
          seen.current = true;
          const start = performance.now();
          const tick = (t) => {
            const p = Math.min(1, (t - start) / duration);
            const eased = 1 - Math.pow(1 - p, 3);
            setN(Math.round(eased * value));
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      });
    }, { threshold: 0.2 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [value, duration]);
  return <span ref={ref} className="font-mono-chess">{n.toLocaleString()}{suffix}</span>;
}

/* ------------------------------------------------------------------ */
/* Chess piece dividers                                               */
/* ------------------------------------------------------------------ */

function PieceDivider({ piece = '♞' }) {
  return (
    <div className="flex items-center gap-4 my-12">
      <div className="flex-1 h-px bg-[#1F2638]" />
      <span className="text-2xl text-[#E8B547] opacity-60">{piece}</span>
      <div className="flex-1 h-px bg-[#1F2638]" />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Top nav                                                            */
/* ------------------------------------------------------------------ */

function TopNav({ page, setPage }) {
  const { currency, setCurrency, lang, setLang, dark, setDark } = React.useContext(ThemeCtx);
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[#0A0E1A]/90 backdrop-blur-md border-b border-[#1F2638]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        <button onClick={() => setPage('home')} className="flex items-center gap-2 group">
          <span className="text-2xl text-[#E8B547] leading-none">♞</span>
          <span className="font-display font-bold text-[#F5F1E8] text-lg tracking-tight group-hover:text-[#E8B547] transition-colors">
            HAQUE <span className="text-[#E8B547]">CHESS</span>
          </span>
        </button>

        <nav className="hidden lg:flex items-center gap-1">
          {PAGES.map(p => (
            <button
              key={p.id}
              onClick={() => setPage(p.id)}
              className={`px-3 py-2 text-sm rounded-md transition-colors ${page === p.id ? 'text-[#E8B547]' : 'text-[#F5F1E8] hover:text-[#E8B547]'}`}
            >
              {p.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center bg-[#141929] border border-[#1F2638] rounded-md p-0.5">
            <button onClick={() => setLang('EN')} className={`px-2 py-1 text-xs font-mono-chess rounded ${lang === 'EN' ? 'bg-[#E8B547] text-[#0A0E1A]' : 'text-[#9CA3B8]'}`}>EN</button>
            <button onClick={() => setLang('BN')} className={`px-2 py-1 text-xs font-mono-chess rounded ${lang === 'BN' ? 'bg-[#E8B547] text-[#0A0E1A]' : 'text-[#9CA3B8]'}`}>বাংলা</button>
          </div>
          <div className="flex items-center bg-[#141929] border border-[#1F2638] rounded-md p-0.5">
            <button onClick={() => setCurrency('USD')} className={`px-2 py-1 text-xs font-mono-chess rounded ${currency === 'USD' ? 'bg-[#E8B547] text-[#0A0E1A]' : 'text-[#9CA3B8]'}`}>USD</button>
            <button onClick={() => setCurrency('BDT')} className={`px-2 py-1 text-xs font-mono-chess rounded ${currency === 'BDT' ? 'bg-[#E8B547] text-[#0A0E1A]' : 'text-[#9CA3B8]'}`}>BDT</button>
          </div>
          <button onClick={() => setDark(!dark)} className="hidden sm:flex w-8 h-8 items-center justify-center rounded-md border border-[#1F2638] hover:border-[#E8B547] transition-colors">
            {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <button onClick={() => setOpen(o => !o)} className="lg:hidden w-9 h-9 flex items-center justify-center rounded-md border border-[#1F2638]">
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>
      {open && (
        <div className="lg:hidden border-t border-[#1F2638] bg-[#0A0E1A]">
          <div className="px-4 py-2 grid grid-cols-2 gap-1">
            {PAGES.map(p => (
              <button
                key={p.id}
                onClick={() => { setPage(p.id); setOpen(false); }}
                className={`px-3 py-3 text-sm rounded-md text-left ${page === p.id ? 'bg-[#141929] text-[#E8B547]' : 'text-[#F5F1E8]'}`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}

/* ------------------------------------------------------------------ */
/* Bottom nav (mobile only)                                           */
/* ------------------------------------------------------------------ */

function BottomNav({ page, setPage }) {
  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0A0E1A]/95 backdrop-blur-md border-t border-[#1F2638] pb-safe">
      <div className="grid grid-cols-4">
        {MOBILE_NAV.map(item => {
          const Icon = item.icon;
          const active = page === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setPage(item.id)}
              className={`flex flex-col items-center justify-center gap-1 py-3 min-h-[60px] ${active ? 'text-[#E8B547]' : 'text-[#9CA3B8]'}`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-mono-chess uppercase tracking-wide">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Footer                                                             */
/* ------------------------------------------------------------------ */

function Footer({ setPage }) {
  return (
    <footer className="border-t border-[#1F2638] bg-[#0A0E1A] mt-16 pb-24 lg:pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl text-[#E8B547]">♞</span>
              <span className="font-display font-bold text-lg">HAQUE <span className="text-[#E8B547]">CHESS</span></span>
            </div>
            <p className="text-sm text-[#9CA3B8] leading-relaxed">
              FIDE Master Nayem Haque — chess coaching from Bangladesh, for the world.
            </p>
          </div>
          <div>
            <div className="text-xs font-mono-chess text-[#9CA3B8] uppercase tracking-wider mb-4">Pages</div>
            <ul className="space-y-2 text-sm">
              {PAGES.map(p => (
                <li key={p.id}>
                  <button onClick={() => setPage(p.id)} className="text-[#F5F1E8] hover:text-[#E8B547] transition-colors">{p.label}</button>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="text-xs font-mono-chess text-[#9CA3B8] uppercase tracking-wider mb-4">Connect</div>
            <ul className="space-y-2 text-sm">
              <li><a className="text-[#F5F1E8] hover:text-[#E8B547] transition-colors" href="#">Chess.com / Nayemhaque22</a></li>
              <li><a className="text-[#F5F1E8] hover:text-[#E8B547] transition-colors" href="#">Lichess / Ilostagain2</a></li>
              <li><a className="text-[#F5F1E8] hover:text-[#E8B547] transition-colors" href="#">Instagram / @haque_nayem</a></li>
              <li><a className="text-[#F5F1E8] hover:text-[#E8B547] transition-colors" href="#">FIDE / 10217754</a></li>
            </ul>
          </div>
          <div>
            <div className="text-xs font-mono-chess text-[#9CA3B8] uppercase tracking-wider mb-4">Newsletter</div>
            <p className="text-sm text-[#9CA3B8] mb-3">Game annotations + one tactic puzzle, weekly.</p>
            <form onSubmit={e => e.preventDefault()} className="flex gap-2">
              <input
                type="email"
                placeholder="you@email.com"
                className="flex-1 bg-[#141929] border border-[#1F2638] rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#E8B547]"
              />
              <button className="px-4 py-2 bg-[#E8B547] text-[#0A0E1A] rounded-md text-sm font-semibold hover:bg-[#F0C25F] transition-colors">
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
        <div className="mt-12 pt-6 border-t border-[#1F2638] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#9CA3B8]">
          <div className="flex items-center gap-2">
            <span>© 2026 Haque Chess. Built in Dhaka.</span>
            <span className="text-[#E8B547]">♞</span>
          </div>
          <div className="font-mono-chess">FIDE ID 10217754</div>
        </div>
      </div>
    </footer>
  );
}

/* ------------------------------------------------------------------ */
/* Toast                                                              */
/* ------------------------------------------------------------------ */

function Toast({ msg, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [onClose]);
  return (
    <div className="fixed top-20 right-4 z-50 bg-[#141929] border border-[#E8B547] rounded-lg px-4 py-3 text-sm flex items-center gap-2 shadow-xl">
      <Check className="w-4 h-4 text-[#52C41A]" />
      <span>{msg}</span>
    </div>
  );
}

/* ================================================================== */
/* PAGES                                                              */
/* ================================================================== */

/* -------------------- HOME -------------------- */

function HomePage({ setPage, showToast }) {
  const [email, setEmail] = useState('');
  const [tIdx, setTIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setTIdx(i => (i + 1) % TESTIMONIALS.length), 5000);
    return () => clearInterval(t);
  }, []);
  const t = TESTIMONIALS[tIdx];

  return (
    <div className="page-enter">
      {/* Hero */}
      <section className="relative grain overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-[0.04] pointer-events-none hidden lg:block"
             style={{
               backgroundImage: `repeating-conic-gradient(#F5F1E8 0% 25%, #0A0E1A 0% 50%)`,
               backgroundSize: '80px 80px',
             }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 lg:pt-20 pb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div>
              <div className="text-xs font-mono-chess text-[#E8B547] uppercase tracking-[0.2em] mb-6">
                • FIDE Master · Bangladesh
              </div>
              <h1 className="font-display font-black text-[#F5F1E8] leading-[0.95] tracking-tight"
                  style={{ fontSize: 'clamp(2.5rem, 8vw, 5.5rem)' }}>
                Trained the kid<br/>
                who <span className="text-[#E8B547] italic">beat</span><br/>
                Carlsen.
              </h1>
              <p className="mt-6 text-lg sm:text-xl text-[#9CA3B8] max-w-xl leading-relaxed">
                FIDE Master Nayem Haque — chess coaching from Bangladesh, for the world.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <AmberCTA size="lg" onClick={() => setPage('contact')}>
                  Book free intro call
                  <ArrowRight className="w-4 h-4" />
                </AmberCTA>
                <OutlineCTA size="lg" onClick={() => setPage('students')}>
                  <Play className="w-4 h-4" />
                  Watch the Carlsen game
                </OutlineCTA>
              </div>
            </div>
            <div className="relative">
              <ChessPlayer />
              <div className="absolute -top-3 -right-3 bg-[#E8B547] text-[#0A0E1A] text-[10px] font-mono-chess font-bold px-3 py-1 rounded-full uppercase tracking-wider rotate-3">
                Click to play through
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stat strip */}
      <section className="border-y border-[#1F2638] bg-[#141929]/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-12">
            {[
              { v: 2148, suf: '', label: 'FIDE Standard' },
              { v: 5, suf: '+', label: 'Years coaching' },
              { v: 300, suf: '+', label: 'Students taught' },
              { v: 1, suf: '', label: 'Carlsen defeated\n(by his student)' },
            ].map((s, i) => (
              <div key={i} className="text-center lg:text-left">
                <div className="text-[#E8B547]" style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)', lineHeight: 1 }}>
                  <CountUp value={s.v} suffix={s.suf} />
                </div>
                <div className="mt-2 text-xs sm:text-sm text-[#9CA3B8] uppercase tracking-wider font-mono-chess whitespace-pre-line">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The Story */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-7">
            <div className="text-xs font-mono-chess text-[#E8B547] uppercase tracking-[0.2em] mb-4">The Story</div>
            <blockquote className="font-display font-bold text-[#F5F1E8] leading-tight"
                        style={{ fontSize: 'clamp(1.75rem, 4vw, 2.75rem)' }}>
              <Quote className="w-8 h-8 text-[#E8B547] mb-3" />
              I've reduced the number of students I train to focus more on Mugdho. I see immense potential in him.
            </blockquote>
            <div className="mt-6 text-sm text-[#9CA3B8] font-mono-chess uppercase tracking-wider">— Nayem Haque</div>

            <div className="mt-10 space-y-5 text-[#F5F1E8] leading-relaxed">
              <p>On January 18, 2025, a nine-year-old boy from Dhaka sat down for an online bullet game on Chess.com. His opponent: Magnus Carlsen, five-time World Champion, still rated 3000+ at bullet.</p>
              <p>Rayan Rashid Mugdho — Nayem's youngest serious student — opened with the Sicilian. The game stayed sharp for thirty moves. Then Mugdho found a tactic that punched a hole in Carlsen's kingside. The clock ran out before Carlsen could recover.</p>
              <p>The win was not luck. Mugdho had been studying the exact pawn structure for six weeks. Every move had been seen before.</p>
            </div>
          </div>
          <div className="lg:col-span-5">
            <ChessPlayer />
          </div>
        </div>
      </section>

      <PieceDivider />

      {/* Coaching cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-xs font-mono-chess text-[#E8B547] uppercase tracking-[0.2em] mb-4">Coaching</div>
        <h2 className="font-display font-bold text-[#F5F1E8] mb-12" style={{ fontSize: 'clamp(2rem, 5vw, 3.25rem)' }}>
          Three ways to train.
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            { icon: Users, t: '1-on-1', d: 'Personalized weekly sessions. Custom curriculum based on your weaknesses.', from: 30 },
            { icon: GraduationCap, t: 'Group Cohort', d: 'Four-player cohorts. Same level, same goals, lower price per session.', from: 18 },
            { icon: BookOpen, t: 'Self-Study', d: 'Recorded lessons + homework reviews. Train on your own schedule.', from: 12 },
          ].map((c, i) => {
            const Icon = c.icon;
            return (
              <Card key={i}>
                <Icon className="w-7 h-7 text-[#E8B547] mb-4" />
                <div className="font-display font-bold text-xl mb-2">{c.t}</div>
                <p className="text-sm text-[#9CA3B8] leading-relaxed mb-6 min-h-[3rem]">{c.d}</p>
                <PriceLabel amount={c.from} prefix="From" />
                <button onClick={() => setPage('pricing')} className="mt-4 text-sm text-[#E8B547] hover:text-[#F0C25F] inline-flex items-center gap-1">
                  Learn more <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </Card>
            );
          })}
        </div>
      </section>

      <PieceDivider piece="♘" />

      {/* Press logo wall */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center text-xs font-mono-chess text-[#9CA3B8] uppercase tracking-[0.3em] mb-8">As featured in</div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
          {['Dhaka Tribune', 'The Business Standard', 'Peninsula Qatar', 'BD Pratidin', 'BSS News', 'Summit Chess'].map(p => (
            <div key={p} className="text-center text-[#9CA3B8] font-display text-sm sm:text-base hover:text-[#F5F1E8] transition-colors cursor-pointer">
              {p}
            </div>
          ))}
        </div>
      </section>

      <PieceDivider />

      {/* Testimonials */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center text-xs font-mono-chess text-[#E8B547] uppercase tracking-[0.2em] mb-8">Testimonials</div>
        <div className="bg-[#141929] border border-[#1F2638] rounded-2xl p-8 min-h-[260px]">
          <Quote className="w-8 h-8 text-[#E8B547] mb-4" />
          <p className="font-display text-xl sm:text-2xl text-[#F5F1E8] leading-snug">{t.text}</p>
          <div className="mt-6 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#E8B547] text-[#0A0E1A] font-display font-bold flex items-center justify-center">{t.initial}</div>
            <div>
              <div className="text-sm font-semibold">{t.name}</div>
              <div className="text-xs text-[#9CA3B8]">{t.role}</div>
            </div>
          </div>
          <div className="mt-6 flex justify-center gap-1.5">
            {TESTIMONIALS.map((_, i) => (
              <button key={i} onClick={() => setTIdx(i)}
                      className={`w-2 h-2 rounded-full transition-colors ${i === tIdx ? 'bg-[#E8B547]' : 'bg-[#1F2638]'}`} />
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-gradient-to-br from-[#141929] to-[#0A0E1A] border border-[#1F2638] rounded-3xl p-8 sm:p-14 text-center relative overflow-hidden">
          <div className="absolute -top-12 -right-12 text-[160px] opacity-5 text-[#E8B547] pointer-events-none">♚</div>
          <h2 className="font-display font-bold text-[#F5F1E8]" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}>
            Ready to <span className="text-[#E8B547] italic">level up?</span>
          </h2>
          <p className="mt-4 text-[#9CA3B8] max-w-xl mx-auto">Start with a free 15-minute intro call. We'll talk through your games and see if we're a fit.</p>
          <form onSubmit={e => { e.preventDefault(); setEmail(''); showToast('Got it. Expect an email within 24h.'); }}
                className="mt-8 flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@email.com"
              className="flex-1 bg-[#0A0E1A] border border-[#1F2638] rounded-lg px-4 py-3 focus:outline-none focus:border-[#E8B547]"
            />
            <AmberCTA>Book call</AmberCTA>
          </form>
        </div>
      </section>
    </div>
  );
}

function Card({ children, className = '' }) {
  return (
    <div className={`bg-[#141929] border border-[#1F2638] rounded-2xl p-6 hover:border-[#E8B547]/40 hover:-translate-y-0.5 transition-all ${className}`}>
      {children}
    </div>
  );
}

function PriceLabel({ amount, prefix = '' }) {
  const { currency } = React.useContext(ThemeCtx);
  return (
    <div className="font-mono-chess">
      {prefix && <span className="text-xs text-[#9CA3B8] mr-1.5">{prefix}</span>}
      <span className="text-2xl text-[#F5F1E8]">{fmt(amount, currency)}</span>
    </div>
  );
}

/* -------------------- ABOUT -------------------- */

function AboutPage() {
  return (
    <div className="page-enter max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
        <div className="lg:col-span-8">
          <div className="text-xs font-mono-chess text-[#E8B547] uppercase tracking-[0.2em] mb-4">About</div>
          <h1 className="font-display font-black leading-tight" style={{ fontSize: 'clamp(2.5rem, 7vw, 4.5rem)' }}>
            The player<br/>behind the <span className="italic text-[#E8B547]">coach.</span>
          </h1>

          <div className="mt-10 aspect-[4/3] rounded-2xl bg-gradient-to-br from-[#141929] via-[#1F2638] to-[#0A0E1A] border border-[#1F2638] relative overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center text-[200px] text-[#E8B547] opacity-20">♞</div>
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs font-mono-chess text-[#9CA3B8]">
              <span>NAYEM HAQUE</span>
              <span>EST. 2003</span>
            </div>
          </div>

          <div className="mt-10 space-y-6 text-[#F5F1E8] leading-relaxed text-lg">
            <p>I grew up in Sirajganj, a small district town two hours north of Dhaka. There was one chess club, a dozen wooden boards, and a single coach who taught the openings he’d learned from a Russian magazine in the 80s. I played there every day after school.</p>
            <p>My first FIDE rating came at fifteen — 1820. Within two years I was on the Bangladesh Biman team representing the country at the U20 Asian Championship. The next five years were tournaments, books, and a hundred thousand bullet games online.</p>
            <p>Coaching started by accident. A neighbour's son wanted to learn. Then his friend. Then six kids in a basement. I realised I liked teaching more than I liked playing for trophies — there is something specific about watching a 1200 player suddenly see a tactic three moves deep.</p>
            <p>Then in January 2025, one of my students — nine-year-old Rayan Mugdho — beat Magnus Carlsen in bullet. The news travelled further than my own results ever did. I took it as a signal: focus on the students who can go further than I did.</p>
          </div>

          <PieceDivider />

          <h2 className="font-display font-bold text-3xl mb-8">Timeline</h2>
          <ol className="relative border-l border-[#1F2638] pl-6 space-y-7">
            {[
              ['2017', 'U20 Championships', 'First international representation, Dhaka.'],
              ['2020', 'Joined Chess.com seriously', 'Crossed 2000 online; switched to deep study.'],
              ['2022', 'Candidate Master period', 'Norm runs, near miss on FM title at first attempt.'],
              ['2024', 'Bangkok Open + 48th BD Championship', '21st in Hua Hin; drew vs IM Fahad Rahman.'],
              ['Jan 2025', 'Mugdho beats Carlsen', 'Student Rayan Rashid Mugdho defeats Magnus in bullet.'],
              ['Today', 'Coaching, refined', 'Focused roster; weekly cohorts + Mugdho-level individuals.'],
            ].map(([y, t, d], i) => (
              <li key={i} className="relative">
                <div className="absolute -left-[31px] top-1.5 w-3 h-3 rounded-full bg-[#E8B547] ring-4 ring-[#0A0E1A]" />
                <div className="text-xs font-mono-chess text-[#E8B547] uppercase tracking-wider mb-1">{y}</div>
                <div className="font-display font-bold text-xl">{t}</div>
                <div className="text-sm text-[#9CA3B8] mt-1">{d}</div>
              </li>
            ))}
          </ol>

          <PieceDivider piece="♗" />

          <h2 className="font-display font-bold text-3xl mb-8">Coaching philosophy</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { icon: Brain, t: 'Think, don’t memorise', d: 'No opening dumps. Every move has a reason you can explain in one sentence.' },
              { icon: Target, t: 'Endgame first', d: 'A 1500 with a strong endgame beats an 1800 who only knows traps.' },
              { icon: Zap, t: 'Play, review, repeat', d: 'Every lesson ends with a game. Every game gets annotated. No exceptions.' },
            ].map((p, i) => {
              const Icon = p.icon;
              return (
                <Card key={i}>
                  <Icon className="w-7 h-7 text-[#E8B547] mb-4" />
                  <div className="font-display font-bold text-lg mb-2">{p.t}</div>
                  <p className="text-sm text-[#9CA3B8] leading-relaxed">{p.d}</p>
                </Card>
              );
            })}
          </div>
        </div>

        <aside className="lg:col-span-4">
          <div className="sticky top-24">
            <div className="bg-[#141929] border border-[#1F2638] rounded-2xl p-6">
              <div className="text-xs font-mono-chess text-[#E8B547] uppercase tracking-wider mb-4">Quick facts</div>
              <dl className="space-y-3 text-sm">
                {[
                  ['Born', '2003'],
                  ['From', 'Sirajganj, Bangladesh'],
                  ['Based', 'Dhaka'],
                  ['FIDE Standard', '2148'],
                  ['FIDE ID', '10217754'],
                  ['Team', 'Bangladesh Biman'],
                  ['Languages', 'Bengali, English'],
                  ['Coaches since', '2019'],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between border-b border-[#1F2638] pb-2 last:border-b-0">
                    <dt className="text-[#9CA3B8]">{k}</dt>
                    <dd className="font-mono-chess text-[#F5F1E8]">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

/* -------------------- CAREER -------------------- */

function CareerPage() {
  const [sortKey, setSortKey] = useState('year');
  const sorted = useMemo(() => {
    return [...TOURNAMENTS].sort((a, b) => sortKey === 'year' ? b.year - a.year : a.name.localeCompare(b.name));
  }, [sortKey]);

  return (
    <div className="page-enter max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
      <div className="text-xs font-mono-chess text-[#E8B547] uppercase tracking-[0.2em] mb-4">Playing Career</div>
      <h1 className="font-display font-black leading-tight" style={{ fontSize: 'clamp(2.5rem, 7vw, 4.5rem)' }}>
        The board <span className="italic text-[#E8B547]">speaks.</span>
      </h1>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-5">
        {[
          { label: 'Standard', val: 2148 },
          { label: 'Rapid', val: 2163 },
          { label: 'Blitz', val: 2111 },
        ].map(r => (
          <Card key={r.label}>
            <div className="flex items-baseline justify-between">
              <div className="text-xs font-mono-chess text-[#9CA3B8] uppercase tracking-wider">{r.label}</div>
              <div className="text-[10px] font-mono-chess text-[#E8B547]">FIDE</div>
            </div>
            <div className="mt-3 font-mono-chess text-[#F5F1E8]" style={{ fontSize: 'clamp(3rem, 7vw, 5rem)', lineHeight: 1 }}>
              <CountUp value={r.val} />
            </div>
          </Card>
        ))}
      </div>

      <PieceDivider piece="♖" />

      <h2 className="font-display font-bold text-3xl mb-6">Rating progression</h2>
      <Card className="p-4 sm:p-6">
        <div className="w-full h-64 sm:h-80">
          <ResponsiveContainer>
            <AreaChart data={RATING_DATA} margin={{ top: 10, right: 10, bottom: 0, left: -10 }}>
              <defs>
                <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#E8B547" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="#E8B547" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#1F2638" vertical={false} />
              <XAxis dataKey="year" stroke="#9CA3B8" tick={{ fill: '#9CA3B8', fontSize: 12, fontFamily: 'JetBrains Mono' }} />
              <YAxis stroke="#9CA3B8" domain={[1700, 2200]} tick={{ fill: '#9CA3B8', fontSize: 12, fontFamily: 'JetBrains Mono' }} />
              <Tooltip contentStyle={{ background: '#0A0E1A', border: '1px solid #E8B547', borderRadius: 8, fontFamily: 'JetBrains Mono', fontSize: 12 }} />
              <Area type="monotone" dataKey="rating" stroke="#E8B547" strokeWidth={2.5} fill="url(#g1)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <PieceDivider />

      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display font-bold text-3xl">Tournaments</h2>
        <div className="flex bg-[#141929] border border-[#1F2638] rounded-md p-0.5 text-xs font-mono-chess">
          <button onClick={() => setSortKey('year')} className={`px-3 py-1.5 rounded ${sortKey === 'year' ? 'bg-[#E8B547] text-[#0A0E1A]' : 'text-[#9CA3B8]'}`}>Year</button>
          <button onClick={() => setSortKey('name')} className={`px-3 py-1.5 rounded ${sortKey === 'name' ? 'bg-[#E8B547] text-[#0A0E1A]' : 'text-[#9CA3B8]'}`}>Name</button>
        </div>
      </div>

      {/* Desktop table */}
      <div className="hidden md:block bg-[#141929] border border-[#1F2638] rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="text-xs font-mono-chess text-[#9CA3B8] uppercase tracking-wider">
            <tr className="border-b border-[#1F2638]">
              <th className="text-left p-4">Year</th>
              <th className="text-left p-4">Tournament</th>
              <th className="text-left p-4">Location</th>
              <th className="text-left p-4">Result</th>
              <th className="text-left p-4">Note</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((t, i) => (
              <tr key={i} className="border-b border-[#1F2638] last:border-b-0 hover:bg-[#0A0E1A]/40 transition-colors">
                <td className="p-4 font-mono-chess text-[#E8B547]">{t.year}</td>
                <td className="p-4 font-display">{t.name}</td>
                <td className="p-4 text-[#9CA3B8]">{t.location}</td>
                <td className="p-4 font-mono-chess">{t.result}</td>
                <td className="p-4 text-[#9CA3B8]">{t.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile stack */}
      <div className="md:hidden space-y-3">
        {sorted.map((t, i) => (
          <Card key={i}>
            <div className="flex items-center justify-between mb-2">
              <div className="font-mono-chess text-[#E8B547] text-sm">{t.year}</div>
              <div className="text-xs text-[#9CA3B8]">{t.location}</div>
            </div>
            <div className="font-display font-bold mb-2">{t.name}</div>
            <div className="text-sm font-mono-chess">{t.result}</div>
            {t.note && <div className="text-xs text-[#9CA3B8] mt-1">{t.note}</div>}
          </Card>
        ))}
      </div>

      <PieceDivider piece="♘" />

      <div className="bg-[#141929] border border-[#1F2638] rounded-2xl p-8 sm:p-10 text-center">
        <h3 className="font-display font-bold text-3xl mb-3">Play me online</h3>
        <p className="text-[#9CA3B8] mb-6">I'm on the boards almost every day. Catch a game.</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <AmberCTA><ExternalLink className="w-4 h-4" />Chess.com / Nayemhaque22</AmberCTA>
          <OutlineCTA><ExternalLink className="w-4 h-4" />Lichess / Ilostagain2</OutlineCTA>
        </div>
      </div>
    </div>
  );
}

/* -------------------- COACHING -------------------- */

function CoachingPage({ setPage }) {
  const [openLevel, setOpenLevel] = useState('beginner');

  return (
    <div className="page-enter max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
      <div className="text-xs font-mono-chess text-[#E8B547] uppercase tracking-[0.2em] mb-4">Coaching</div>
      <h1 className="font-display font-black leading-tight" style={{ fontSize: 'clamp(2.5rem, 7vw, 4.5rem)' }}>
        How I train <span className="italic text-[#E8B547]">players.</span>
      </h1>
      <p className="mt-6 text-lg text-[#9CA3B8] max-w-2xl">No 200-line opening repertoires. No magic. Just the four pillars, done well.</p>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          { icon: BookOpen, t: 'Openings', d: 'A small, deeply-understood repertoire. Quality over quantity.' },
          { icon: Zap, t: 'Tactics', d: 'Daily puzzles graded to your level. Pattern recognition over calculation.' },
          { icon: Crown, t: 'Endgames', d: 'King + pawn first. Then rook. The math of winning won positions.' },
          { icon: Brain, t: 'Mental Game', d: 'Time pressure, draw offers, comebacks. The 30% that decides games.' },
        ].map((p, i) => {
          const Icon = p.icon;
          return (
            <Card key={i}>
              <Icon className="w-7 h-7 text-[#E8B547] mb-4" />
              <div className="font-display font-bold text-xl mb-2">{p.t}</div>
              <p className="text-sm text-[#9CA3B8] leading-relaxed">{p.d}</p>
            </Card>
          );
        })}
      </div>

      <PieceDivider />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Card>
          <div className="flex items-center gap-2 mb-4">
            <Check className="w-5 h-5 text-[#52C41A]" />
            <h3 className="font-display font-bold text-xl">Who this is for</h3>
          </div>
          <ul className="space-y-3 text-sm">
            {[
              'Kids 7–14 with a competitive interest',
              'Adult improvers stuck between 1400–1800',
              'Tournament players hunting their first FIDE title norm',
              'Parents who want a serious coach, not a babysitter',
            ].map((x, i) => (
              <li key={i} className="flex items-start gap-2">
                <Check className="w-4 h-4 text-[#52C41A] mt-0.5 shrink-0" />
                <span>{x}</span>
              </li>
            ))}
          </ul>
        </Card>
        <Card>
          <div className="flex items-center gap-2 mb-4">
            <X className="w-5 h-5 text-[#9CA3B8]" />
            <h3 className="font-display font-bold text-xl">Who this isn’t for</h3>
          </div>
          <ul className="space-y-3 text-sm">
            {[
              'Absolute beginners who haven’t played 50 games yet (start free first)',
              'Players who want one quick fix for tournaments next week',
              'Anyone hoping I’ll lecture instead of analyze your games',
              'Casual hobbyists — try free Lichess studies first',
            ].map((x, i) => (
              <li key={i} className="flex items-start gap-2">
                <X className="w-4 h-4 text-[#9CA3B8] mt-0.5 shrink-0" />
                <span className="text-[#9CA3B8]">{x}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <PieceDivider piece="♖" />

      <h2 className="font-display font-bold text-3xl mb-6">Curriculum</h2>
      <div className="space-y-3">
        {[
          { id: 'beginner', label: 'Beginner', range: '0 – 1200', topics: ['Piece values + tactics 101', 'Basic checkmate patterns', 'King + pawn endgames', 'One opening per colour', 'How to think during a game'] },
          { id: 'improver', label: 'Improver', range: '1200 – 1800', topics: ['Pawn structure fundamentals', 'Rook endgames (Lucena, Philidor)', 'Two-piece tactics + sacrifices', 'Two openings per colour, deep', 'Game annotation discipline'] },
          { id: 'tournament', label: 'Tournament', range: '1800+', topics: ['Theoretical opening prep', 'Calculation training (3+ moves deep)', 'Endgame technique vs counter-play', 'Time-management under pressure', 'Tournament psychology + rest']},
        ].map(level => (
          <div key={level.id} className="bg-[#141929] border border-[#1F2638] rounded-xl overflow-hidden">
            <button onClick={() => setOpenLevel(openLevel === level.id ? null : level.id)}
                    className="w-full p-5 flex items-center justify-between text-left hover:bg-[#0A0E1A]/40 transition-colors">
              <div>
                <div className="font-display font-bold text-xl">{level.label}</div>
                <div className="text-xs font-mono-chess text-[#9CA3B8] mt-1">RATING {level.range}</div>
              </div>
              {openLevel === level.id ? <ChevronUp className="w-5 h-5 text-[#E8B547]" /> : <ChevronDown className="w-5 h-5 text-[#9CA3B8]" />}
            </button>
            {openLevel === level.id && (
              <div className="px-5 pb-5 border-t border-[#1F2638] pt-4">
                <ul className="space-y-2 text-sm">
                  {level.topics.map((t, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-[#E8B547] mt-0.5">♞</span>
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>

      <PieceDivider piece="♗" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Card>
          <h3 className="font-display font-bold text-xl mb-4">Tools we use</h3>
          <div className="grid grid-cols-2 gap-3">
            {['Chess.com', 'Lichess', 'ChessBase', 'Zoom'].map(t => (
              <div key={t} className="bg-[#0A0E1A] border border-[#1F2638] rounded-md py-3 text-center text-sm font-mono-chess text-[#9CA3B8]">{t}</div>
            ))}
          </div>
        </Card>
        <Card>
          <h3 className="font-display font-bold text-xl mb-4">Sample lesson</h3>
          <ol className="text-sm space-y-2 font-mono-chess text-[#F5F1E8]">
            <li><span className="text-[#E8B547]">00:00</span> Review last week’s game (15 min)</li>
            <li><span className="text-[#E8B547]">15:00</span> Endgame theme of the week (20 min)</li>
            <li><span className="text-[#E8B547]">35:00</span> Tactical training, level-matched (15 min)</li>
            <li><span className="text-[#E8B547]">50:00</span> Live game vs me (10 min)</li>
          </ol>
        </Card>
      </div>

      <div className="mt-12 text-center">
        <AmberCTA size="lg" onClick={() => setPage('pricing')}>
          See pricing <ArrowRight className="w-4 h-4" />
        </AmberCTA>
      </div>
    </div>
  );
}

/* -------------------- PRICING -------------------- */

function PricingPage({ showToast }) {
  const { currency, setCurrency } = React.useContext(ThemeCtx);
  const [openFaq, setOpenFaq] = useState(null);

  const packages = [
    { id: 'single', name: 'Single Session', amount: 30, save: null, sessions: 1, perks: ['60-minute live session', 'Game review', 'Action items emailed after'] },
    { id: 'starter', name: 'Starter Pack', amount: 110, save: 8, sessions: 4, perks: ['Everything in Single', '4 sessions over 4 weeks', 'Weekly homework'] },
    { id: 'serious', name: 'Serious', amount: 250, save: 17, sessions: 10, perks: ['Everything in Starter', '10 sessions', 'Homework reviews included', 'Custom opening repertoire'], featured: true },
    { id: 'elite', name: 'Elite', amount: 450, save: 25, sessions: 20, perks: ['Everything in Serious', '20 sessions', 'WhatsApp access (M–F)', 'Tournament prep package', 'Priority scheduling'] },
  ];

  const faqs = [
    { q: 'Can I cancel?', a: 'Yes. Unused sessions are refunded pro-rata within 30 days. No questions asked.' },
    { q: 'What platform do we use?', a: 'Zoom for video + Chess.com or Lichess for the board. You’ll need a stable internet connection and ideally two screens (phone + laptop works fine).' },
    { q: 'What if I’m a complete beginner?', a: 'Honestly, learn the rules and play 50 games first — free, on Chess.com. Then come back. Coaching starts paying off around the 800–1000 mark.' },
    { q: 'How are sessions scheduled?', a: 'I work in Dhaka time (GMT+6) but have students from London to Sydney. We pick a recurring weekly slot during your first session.' },
    { q: 'Do you teach in Bengali or English?', a: 'Both. Default English; Bengali on request — same content, same depth.' },
  ];

  return (
    <div className="page-enter max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
      <div className="text-xs font-mono-chess text-[#E8B547] uppercase tracking-[0.2em] mb-4">Pricing</div>
      <h1 className="font-display font-black leading-tight" style={{ fontSize: 'clamp(2.5rem, 7vw, 4.5rem)' }}>
        Simple. Transparent.<br/><span className="italic text-[#E8B547]">No surprises.</span>
      </h1>

      <div className="mt-10 flex items-center justify-center sm:justify-start gap-3">
        <span className="text-xs font-mono-chess text-[#9CA3B8] uppercase tracking-wider">Currency</span>
        <div className="flex bg-[#141929] border border-[#1F2638] rounded-full p-1">
          <button onClick={() => setCurrency('USD')} className={`px-5 py-2 text-sm rounded-full font-mono-chess transition-colors ${currency === 'USD' ? 'bg-[#E8B547] text-[#0A0E1A]' : 'text-[#9CA3B8]'}`}>USD</button>
          <button onClick={() => setCurrency('BDT')} className={`px-5 py-2 text-sm rounded-full font-mono-chess transition-colors ${currency === 'BDT' ? 'bg-[#E8B547] text-[#0A0E1A]' : 'text-[#9CA3B8]'}`}>BDT</button>
        </div>
      </div>

      {/* Desktop grid / Mobile scroll snap */}
      <div className="mt-12 hidden lg:grid lg:grid-cols-4 gap-5">
        {packages.map(p => <PriceCard key={p.id} pkg={p} showToast={showToast} />)}
      </div>
      <MobilePricingScroller packages={packages} showToast={showToast} />

      <PieceDivider piece="♕" />

      <h2 className="font-display font-bold text-3xl mb-6">What’s included</h2>
      <Card className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[640px]">
            <thead className="bg-[#0A0E1A] text-xs font-mono-chess text-[#9CA3B8] uppercase tracking-wider">
              <tr>
                <th className="text-left p-4">Feature</th>
                {packages.map(p => <th key={p.id} className="text-center p-4">{p.name}</th>)}
              </tr>
            </thead>
            <tbody>
              {[
                ['Live sessions', '1', '4', '10', '20'],
                ['Game annotations', '—', '✓', '✓', '✓'],
                ['Homework reviews', '—', '—', '✓', '✓'],
                ['Custom opening prep', '—', '—', '✓', '✓'],
                ['WhatsApp access', '—', '—', '—', '✓'],
                ['Tournament prep', '—', '—', '—', '✓'],
              ].map((row, i) => (
                <tr key={i} className="border-t border-[#1F2638]">
                  <td className="p-4 font-display">{row[0]}</td>
                  {row.slice(1).map((v, j) => (
                    <td key={j} className={`p-4 text-center font-mono-chess ${v === '✓' ? 'text-[#52C41A]' : 'text-[#9CA3B8]'}`}>{v}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <PieceDivider />

      <div className="bg-gradient-to-br from-[#E8B547]/10 to-transparent border border-[#E8B547]/40 rounded-2xl p-8 sm:p-12 text-center">
        <Sparkles className="w-7 h-7 text-[#E8B547] mx-auto mb-3" />
        <h3 className="font-display font-bold text-3xl mb-3">Free 15-min intro call</h3>
        <p className="text-[#9CA3B8] mb-6 max-w-md mx-auto">No pitch. We look at one of your games and I tell you honestly what to work on.</p>
        <AmberCTA size="lg" onClick={() => showToast('Free intro requested. Check your email.')}>
          Book intro <ArrowRight className="w-4 h-4" />
        </AmberCTA>
      </div>

      <PieceDivider piece="♗" />

      <div className="flex flex-wrap justify-center gap-4 text-sm text-[#9CA3B8] font-mono-chess">
        <span>Pay via</span>
        {['bKash', 'Stripe', 'PayPal', 'Wise'].map(m => (
          <span key={m} className="px-3 py-1 border border-[#1F2638] rounded-md text-[#F5F1E8]">{m}</span>
        ))}
      </div>

      <PieceDivider />

      <h2 className="font-display font-bold text-3xl mb-6">Questions</h2>
      <div className="space-y-3">
        {faqs.map((f, i) => (
          <div key={i} className="bg-[#141929] border border-[#1F2638] rounded-xl overflow-hidden">
            <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full p-5 flex items-center justify-between text-left hover:bg-[#0A0E1A]/40 transition-colors">
              <div className="font-display font-semibold">{f.q}</div>
              {openFaq === i ? <ChevronUp className="w-5 h-5 text-[#E8B547]" /> : <ChevronDown className="w-5 h-5 text-[#9CA3B8]" />}
            </button>
            {openFaq === i && (
              <div className="px-5 pb-5 text-[#9CA3B8] text-sm leading-relaxed">{f.a}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function PriceCard({ pkg, showToast }) {
  const { currency } = React.useContext(ThemeCtx);
  const featured = pkg.featured;
  return (
    <div className={`relative rounded-2xl border p-6 transition-all hover:-translate-y-1 flex flex-col ${featured ? 'border-[#E8B547] bg-gradient-to-b from-[#E8B547]/10 to-[#141929]' : 'border-[#1F2638] bg-[#141929]'}`}>
      {featured && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#E8B547] text-[#0A0E1A] text-[10px] font-mono-chess font-bold px-3 py-1 rounded-full uppercase tracking-wider whitespace-nowrap">
          ★ Most picked
        </div>
      )}
      <div className="text-xs font-mono-chess text-[#E8B547] uppercase tracking-wider mb-2">{pkg.name}</div>
      <div className="font-mono-chess text-[#F5F1E8] mt-1" style={{ fontSize: 'clamp(2.25rem, 4vw, 3rem)', lineHeight: 1 }}>
        {fmt(pkg.amount, currency)}
      </div>
      <div className="text-xs text-[#9CA3B8] mt-1 font-mono-chess">
        {pkg.sessions} session{pkg.sessions > 1 ? 's' : ''} {pkg.save && <span className="text-[#52C41A] ml-2">save {pkg.save}%</span>}
      </div>
      <ul className="mt-6 space-y-2.5 text-sm flex-1">
        {pkg.perks.map((p, i) => (
          <li key={i} className="flex items-start gap-2">
            <Check className="w-4 h-4 text-[#52C41A] mt-0.5 shrink-0" />
            <span>{p}</span>
          </li>
        ))}
      </ul>
      <button
        onClick={() => showToast(`${pkg.name} — added. Check your email.`)}
        className={`mt-6 w-full min-h-[48px] rounded-lg font-semibold transition-colors ${featured ? 'bg-[#E8B547] text-[#0A0E1A] hover:bg-[#F0C25F]' : 'border border-[#1F2638] text-[#F5F1E8] hover:border-[#E8B547] hover:text-[#E8B547]'}`}
      >
        Choose plan
      </button>
    </div>
  );
}

function MobilePricingScroller({ packages, showToast }) {
  const ref = useRef(null);
  const [active, setActive] = useState(0);
  return (
    <div className="lg:hidden mt-12">
      <div ref={ref} onScroll={e => {
        const w = e.currentTarget.clientWidth;
        setActive(Math.round(e.currentTarget.scrollLeft / w));
      }} className="snap-x-cards no-scrollbar flex overflow-x-auto -mx-4 px-4 gap-4 pb-4">
        {packages.map(p => (
          <div key={p.id} className="shrink-0 w-[85%] sm:w-[60%]">
            <PriceCard pkg={p} showToast={showToast} />
          </div>
        ))}
      </div>
      <div className="mt-2 flex justify-center gap-1.5">
        {packages.map((_, i) => (
          <span key={i} className={`w-2 h-2 rounded-full transition-colors ${i === active ? 'bg-[#E8B547]' : 'bg-[#1F2638]'}`} />
        ))}
      </div>
    </div>
  );
}

/* -------------------- STUDENTS -------------------- */

function StudentsPage() {
  return (
    <div className="page-enter max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
      <div className="text-xs font-mono-chess text-[#E8B547] uppercase tracking-[0.2em] mb-4">Students & Results</div>
      <h1 className="font-display font-black leading-[0.95]" style={{ fontSize: 'clamp(2.5rem, 8vw, 5rem)' }}>
        9 years old.<br/>World champion <span className="italic text-[#E8B547]">defeated.</span>
      </h1>

      <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        <div className="lg:col-span-7 space-y-6 text-lg leading-relaxed text-[#F5F1E8]">
          <p>Rayan Rashid Mugdho is nine. He's been studying with me for fourteen months. In January 2025 he played Magnus Carlsen in a bullet game on Chess.com and won.</p>
          <p>Carlsen plays thousands of bullet games a year. He loses some — but never the same way twice. Mugdho found the move that worked because we'd built the position together in training, eighteen times over six weeks.</p>
          <div className="bg-[#141929] border-l-4 border-[#E8B547] p-6 rounded-r-xl">
            <Quote className="w-6 h-6 text-[#E8B547] mb-2" />
            <p className="font-display text-xl italic">"I've reduced the number of students I train to focus more on Mugdho because I see immense potential in him."</p>
            <div className="text-xs text-[#9CA3B8] mt-3 font-mono-chess">— Nayem Haque</div>
          </div>
        </div>
        <div className="lg:col-span-5">
          <ChessPlayer />
        </div>
      </div>

      <PieceDivider piece="♖" />

      <h2 className="font-display font-bold text-3xl mb-6">Wall of wins</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {STUDENT_WINS.map((s, i) => (
          <Card key={i}>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-[#E8B547] text-[#0A0E1A] font-display font-bold text-xl flex items-center justify-center">{s.initial}</div>
              <div>
                <div className="font-display font-bold">{s.name}</div>
                <div className="text-xs text-[#9CA3B8]">Student</div>
              </div>
            </div>
            <div className="flex items-center gap-3 font-mono-chess text-sm mb-3">
              <span className="text-[#9CA3B8]">{s.from}</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#E8B547]" />
              <span className="text-[#E8B547] text-base">{s.to}</span>
              <span className="text-[#52C41A] text-xs ml-auto">+{s.to - s.from}</span>
            </div>
            <div className="text-sm text-[#F5F1E8]">{s.headline}</div>
          </Card>
        ))}
      </div>

      <PieceDivider />

      <div className="bg-[#141929] border border-[#1F2638] rounded-2xl p-8 sm:p-12">
        <div className="text-xs font-mono-chess text-[#E8B547] uppercase tracking-[0.2em] mb-6">This year, by the numbers</div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { v: 4200, suf: '+', label: 'ELO points gained' },
            { v: 3, suf: '', label: 'CM titles earned' },
            { v: 47, suf: '', label: 'Tournament wins' },
            { v: 1, suf: '', label: 'World champion beaten' },
          ].map((s, i) => (
            <div key={i}>
              <div className="text-[#E8B547]" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', lineHeight: 1 }}>
                <CountUp value={s.v} suffix={s.suf} />
              </div>
              <div className="mt-2 text-xs text-[#9CA3B8] uppercase tracking-wider font-mono-chess">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* -------------------- PRESS -------------------- */

function PressPage() {
  return (
    <div className="page-enter max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
      <div className="text-xs font-mono-chess text-[#E8B547] uppercase tracking-[0.2em] mb-4">Press</div>
      <h1 className="font-display font-black leading-tight" style={{ fontSize: 'clamp(2.5rem, 7vw, 4.5rem)' }}>
        As featured <span className="italic text-[#E8B547]">in.</span>
      </h1>

      <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {PRESS.map((p, i) => (
          <a key={i} href="#" className="group bg-[#141929] border border-[#1F2638] rounded-2xl overflow-hidden hover:border-[#E8B547]/40 hover:-translate-y-0.5 transition-all">
            <div className="aspect-video bg-gradient-to-br from-[#1F2638] to-[#0A0E1A] relative overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center text-6xl text-[#E8B547]/20">♞</div>
              <div className="absolute top-3 left-3 bg-[#0A0E1A]/80 backdrop-blur text-[10px] font-mono-chess text-[#E8B547] uppercase tracking-wider px-2 py-1 rounded">
                {p.tag}
              </div>
            </div>
            <div className="p-5">
              <div className="text-xs font-mono-chess text-[#9CA3B8] uppercase tracking-wider mb-2 flex items-center justify-between">
                <span>{p.pub}</span>
                <span>{p.date}</span>
              </div>
              <h3 className="font-display font-bold text-lg leading-snug group-hover:text-[#E8B547] transition-colors">{p.title}</h3>
              <div className="mt-4 text-sm text-[#E8B547] inline-flex items-center gap-1">
                Read article <ExternalLink className="w-3 h-3" />
              </div>
            </div>
          </a>
        ))}
      </div>

      <PieceDivider piece="♖" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Card>
          <Quote className="w-7 h-7 text-[#E8B547] mb-3" />
          <p className="font-display text-xl italic">"An unbelievable upset by any standard, and a moment of national pride."</p>
          <div className="mt-4 text-xs font-mono-chess text-[#9CA3B8] uppercase tracking-wider">— Dhaka Tribune</div>
        </Card>
        <Card>
          <Quote className="w-7 h-7 text-[#E8B547] mb-3" />
          <p className="font-display text-xl italic">"A chess prodigy in the making — and the coach quietly behind him."</p>
          <div className="mt-4 text-xs font-mono-chess text-[#9CA3B8] uppercase tracking-wider">— The Business Standard</div>
        </Card>
      </div>

      <div className="mt-12 bg-[#141929] border border-[#1F2638] rounded-2xl p-8 sm:p-10 text-center">
        <Newspaper className="w-8 h-8 text-[#E8B547] mx-auto mb-3" />
        <h3 className="font-display font-bold text-2xl mb-3">Press kit</h3>
        <p className="text-[#9CA3B8] mb-6 max-w-md mx-auto">High-res photos, full bio, ratings sheet, and quotes — zipped and ready.</p>
        <AmberCTA><Download className="w-4 h-4" />Download press kit</AmberCTA>
      </div>
    </div>
  );
}

/* -------------------- CONTACT -------------------- */

function ContactPage({ showToast }) {
  const [form, setForm] = useState({ name: '', email: '', level: 'Beginner', message: '' });
  const [date, setDate] = useState(0);

  const onSubmit = (e) => {
    e.preventDefault();
    setForm({ name: '', email: '', level: 'Beginner', message: '' });
    showToast('Message sent. I’ll reply within 24h.');
  };

  const days = Array.from({ length: 14 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d;
  });
  const slots = ['09:00', '11:00', '14:00', '16:00', '18:00', '20:00'];

  return (
    <div className="page-enter max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
      <div className="text-xs font-mono-chess text-[#E8B547] uppercase tracking-[0.2em] mb-4">Contact</div>
      <h1 className="font-display font-black leading-tight" style={{ fontSize: 'clamp(2.5rem, 7vw, 4.5rem)' }}>
        Let's <span className="italic text-[#E8B547]">play.</span>
      </h1>

      <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-10">
        <Card>
          <h3 className="font-display font-bold text-2xl mb-6">Drop me a line</h3>
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono-chess text-[#9CA3B8] uppercase tracking-wider mb-2">Name</label>
              <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                     className="w-full bg-[#0A0E1A] border border-[#1F2638] rounded-lg px-4 py-3 focus:outline-none focus:border-[#E8B547]" />
            </div>
            <div>
              <label className="block text-xs font-mono-chess text-[#9CA3B8] uppercase tracking-wider mb-2">Email</label>
              <input required type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                     className="w-full bg-[#0A0E1A] border border-[#1F2638] rounded-lg px-4 py-3 focus:outline-none focus:border-[#E8B547]" />
            </div>
            <div>
              <label className="block text-xs font-mono-chess text-[#9CA3B8] uppercase tracking-wider mb-2">Current level</label>
              <select value={form.level} onChange={e => setForm({ ...form, level: e.target.value })}
                      className="w-full bg-[#0A0E1A] border border-[#1F2638] rounded-lg px-4 py-3 focus:outline-none focus:border-[#E8B547]">
                <option>Beginner (under 1200)</option>
                <option>Improver (1200–1800)</option>
                <option>Tournament (1800+)</option>
                <option>Parent of a child</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-mono-chess text-[#9CA3B8] uppercase tracking-wider mb-2">Message</label>
              <textarea rows={5} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}
                        className="w-full bg-[#0A0E1A] border border-[#1F2638] rounded-lg px-4 py-3 focus:outline-none focus:border-[#E8B547] resize-none" />
            </div>
            <AmberCTA size="lg" className="w-full">Send message <Send className="w-4 h-4" /></AmberCTA>
          </form>
        </Card>

        <div className="space-y-5">
          {[
            { icon: Mail, label: 'Email', val: 'nayemhaque32@gmail.com', href: 'mailto:nayemhaque32@gmail.com' },
            { icon: MessageCircle, label: 'WhatsApp', val: '+880 1XXX-XXXXXX', href: '#' },
            { icon: MapPin, label: 'Location', val: 'Dhaka, Bangladesh', href: '#' },
          ].map((c, i) => {
            const Icon = c.icon;
            return (
              <a key={i} href={c.href} className="block bg-[#141929] border border-[#1F2638] rounded-2xl p-5 hover:border-[#E8B547]/40 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-[#0A0E1A] border border-[#1F2638] flex items-center justify-center text-[#E8B547]">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-mono-chess text-[#9CA3B8] uppercase tracking-wider">{c.label}</div>
                    <div className="font-display font-bold mt-0.5">{c.val}</div>
                  </div>
                </div>
              </a>
            );
          })}

          <Card>
            <div className="text-xs font-mono-chess text-[#9CA3B8] uppercase tracking-wider mb-4">Find me online</div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: '♞', label: 'Chess.com', handle: 'Nayemhaque22' },
                { icon: '♞', label: 'Lichess', handle: 'Ilostagain2' },
                { icon: Instagram, label: 'Instagram', handle: '@haque_nayem' },
                { icon: Youtube, label: 'YouTube', handle: '@haquechess' },
                { icon: Facebook, label: 'Facebook', handle: 'haquechess' },
                { icon: Award, label: 'FIDE', handle: '10217754' },
              ].map((s, i) => {
                const isComp = typeof s.icon !== 'string';
                return (
                  <a key={i} href="#" className="bg-[#0A0E1A] border border-[#1F2638] rounded-lg px-3 py-2.5 hover:border-[#E8B547] transition-colors flex items-center gap-2">
                    {isComp ? (
                      React.createElement(s.icon, { className: 'w-4 h-4 text-[#E8B547] shrink-0' })
                    ) : (
                      <span className="text-[#E8B547] text-lg leading-none">{s.icon}</span>
                    )}
                    <div className="min-w-0">
                      <div className="text-[10px] text-[#9CA3B8] font-mono-chess uppercase">{s.label}</div>
                      <div className="text-xs truncate">{s.handle}</div>
                    </div>
                  </a>
                );
              })}
            </div>
          </Card>
        </div>
      </div>

      <PieceDivider piece="♕" />

      <h2 className="font-display font-bold text-3xl mb-2">Book a free 15-min intro</h2>
      <p className="text-[#9CA3B8] mb-8">Pick a slot. We'll talk through one of your games.</p>

      <Card>
        <div className="flex items-center gap-2 mb-4 text-xs font-mono-chess text-[#9CA3B8] uppercase tracking-wider">
          <Calendar className="w-4 h-4 text-[#E8B547]" />
          <span>This week · Dhaka time (GMT+6)</span>
        </div>
        <div className="overflow-x-auto -mx-1 px-1">
          <div className="flex gap-2 min-w-min pb-2">
            {days.map((d, i) => (
              <button key={i} onClick={() => setDate(i)}
                      className={`shrink-0 w-16 py-3 rounded-lg border text-center transition-colors ${i === date ? 'bg-[#E8B547] text-[#0A0E1A] border-[#E8B547]' : 'border-[#1F2638] text-[#F5F1E8] hover:border-[#E8B547]'}`}>
                <div className="text-[10px] font-mono-chess uppercase tracking-wider">{d.toLocaleDateString('en-US', { weekday: 'short' })}</div>
                <div className="text-lg font-display font-bold mt-1">{d.getDate()}</div>
              </button>
            ))}
          </div>
        </div>
        <div className="mt-6 grid grid-cols-3 sm:grid-cols-6 gap-2">
          {slots.map(s => (
            <button key={s} onClick={() => showToast(`Booked: ${days[date].toLocaleDateString()} · ${s}`)}
                    className="py-3 rounded-lg border border-[#1F2638] hover:border-[#E8B547] hover:text-[#E8B547] transition-colors text-sm font-mono-chess">
              {s}
            </button>
          ))}
        </div>
      </Card>
    </div>
  );
}

/* ================================================================== */
/* APP                                                                */
/* ================================================================== */

export default function App() {
  const [page, setPage] = useState('home');
  const [currency, setCurrency] = useState('USD');
  const [lang, setLang] = useState('EN');
  const [dark, setDark] = useState(true);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [page]);

  const showToast = (msg) => setToast(msg);
  const theme = { currency, setCurrency, lang, setLang, dark, setDark };

  let Page;
  switch (page) {
    case 'about': Page = <AboutPage />; break;
    case 'career': Page = <CareerPage />; break;
    case 'coaching': Page = <CoachingPage setPage={setPage} />; break;
    case 'pricing': Page = <PricingPage showToast={showToast} />; break;
    case 'students': Page = <StudentsPage />; break;
    case 'press': Page = <PressPage />; break;
    case 'contact': Page = <ContactPage showToast={showToast} />; break;
    default: Page = <HomePage setPage={setPage} showToast={showToast} />;
  }

  return (
    <ThemeCtx.Provider value={theme}>
      <div key={page} className={`min-h-screen ${dark ? '' : 'light-mode'}`}>
        <TopNav page={page} setPage={setPage} />
        <main>{Page}</main>
        <Footer setPage={setPage} />
        <BottomNav page={page} setPage={setPage} />
        {toast && <Toast msg={toast} onClose={() => setToast(null)} />}
      </div>
    </ThemeCtx.Provider>
  );
}
