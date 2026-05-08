import { useState, useEffect, useRef } from 'react';
import { Zap, Timer, Target, ChevronUp, ChevronDown } from 'lucide-react';

type Props = {
  lang: 'BM' | 'EN';
  onDone: () => void;
};

const KEYWORDS_BM = [
  { word: 'indeks harga', hint: 'Ini nama formula utama. Bila nampak ni → topik Nombor Indeks.' },
  { word: 'indeks gubahan', hint: 'Gabungan beberapa indeks dengan wajaran. Selalu keluar bahagian (b).' },
  { word: 'wajaran / pemberat', hint: 'Berat setiap bahan. Kau akan guna ini untuk kira indeks gubahan.' },
];

const KEYWORDS_EN = [
  { word: 'price index', hint: 'The main formula name. Spot this → Index Numbers topic.' },
  { word: 'composite index', hint: 'Combines multiple indices with weightages. Usually in part (b).' },
  { word: 'weightage', hint: 'How much each ingredient matters. Used to calculate composite index.' },
];

const PARTS_BM = [
  { label: '(a)', title: 'Cari nilai — indeks / harga', marks: 3, action: 'do' as const, detail: 'Formula terus. Boleh dapat 1–3 markah dengan 1–2 langkah sahaja.' },
  { label: '(b)', title: 'Kira indeks gubahan / cari nisbah', marks: 5, action: 'try' as const, detail: 'Sederhana. Ada algebra tapi boleh cuba selepas habis (a).' },
  { label: '(c)', title: 'Jangkaan kos / peratus kenaikan', marks: 5, action: 'skip' as const, detail: 'Paling susah. Gabung 3–4 langkah. Skip kalau masa kurang.' },
];

const PARTS_EN = [
  { label: '(a)', title: 'Find index / price values', marks: 3, action: 'do' as const, detail: 'Direct formula. Score 1–3 marks in just 1–2 steps.' },
  { label: '(b)', title: 'Composite index / ratio', marks: 5, action: 'try' as const, detail: 'Moderate. Has algebra but attempt after finishing (a).' },
  { label: '(c)', title: 'Projected cost / percentage increase', marks: 5, action: 'skip' as const, detail: 'Hardest. Chains 3–4 steps. Skip if short on time.' },
];

const ACTION_STYLE = {
  do:   { pill: 'bg-[#546B41]/15 text-black', border: 'border-[#99AD7A]', label_bm: 'Mesti buat', label_en: 'Do this' },
  try:  { pill: 'bg-amber-100 text-amber-700',    border: 'border-amber-200', label_bm: 'Cuba',       label_en: 'Try'      },
  skip: { pill: 'bg-[#DCCCAC]/30 text-black/50', border: 'border-[#DCCCAC]', label_bm: 'Skip dulu',  label_en: 'Skip'     },
};

function useCountUp(target: number, duration: number, active: boolean) {
  const [count, setCount] = useState(0);
  const raf = useRef<number | null>(null);
  const start = useRef<number | null>(null);

  useEffect(() => {
    if (!active) { setCount(0); return; }
    start.current = null;
    function tick(ts: number) {
      if (start.current === null) start.current = ts;
      const elapsed = ts - start.current;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out expo
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setCount(Math.round(eased * target));
      if (progress < 1) raf.current = requestAnimationFrame(tick);
    }
    raf.current = requestAnimationFrame(tick);
    return () => { if (raf.current) cancelAnimationFrame(raf.current); };
  }, [active, target, duration]);

  return count;
}

export default function TopicIntro({ lang, onDone }: Props) {
  const [slide, setSlide] = useState(0);
  const [tapped, setTapped] = useState<Set<number>>(new Set());
  const [expanded, setExpanded] = useState<Set<number>>(new Set());

  const keywords = lang === 'BM' ? KEYWORDS_BM : KEYWORDS_EN;
  const parts = lang === 'BM' ? PARTS_BM : PARTS_EN;
  const allTapped = tapped.size >= keywords.length;

  // Count-up only fires when on goal slide (slide 0)
  const score = useCountUp(40, 1400, slide === 0);

  function tapKeyword(i: number) {
    setTapped(prev => new Set([...prev, i]));
  }

  function togglePart(i: number) {
    setExpanded(prev => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  }

  const SLIDES = [
    // ── Slide 0: Goal screen ─────────────────────────────────────────────────
    <div key="s0-goal" className="space-y-5">
      {/* Hero card */}
      <div className="relative overflow-hidden rounded-3xl bg-[#546B41] px-6 pt-10 pb-8 text-center space-y-4">
        {/* Decorative rings */}
        <div className="absolute -top-8 -right-8 w-36 h-36 rounded-full border border-[#99AD7A]/20" />
        <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full border border-[#99AD7A]/15" />

        <p className="animate-fade-up text-sm font-bold uppercase tracking-[0.18em] text-white/70">
          {lang === 'BM' ? 'Matlamat kau' : 'Your goal'}
        </p>

        <div className="animate-fade-up-d1 flex items-end justify-center gap-1">
          <span className="text-[88px] font-black leading-none text-white tabular-nums">
            {score}
          </span>
          <span className="text-3xl font-black text-white/50 mb-3 leading-none">/100</span>
        </div>

        <p className="animate-fade-up-d2 text-lg font-bold text-white leading-snug">
          {lang === 'BM'
            ? 'Markah lulus SPM Add Maths.'
            : 'Passing marks for SPM Add Maths.'}
        </p>

        {/* Score bar */}
        <div className="animate-fade-up-d3 w-full bg-black/20 rounded-full h-3 overflow-hidden">
          <div className="animate-score-bar h-full bg-white rounded-full" />
        </div>
        <p className="animate-fade-up-d3 text-xs text-white/60">
          {lang === 'BM' ? '40 markah = lulus. Kita target tu dulu.' : '40 marks = pass. Target capai.'}
        </p>
      </div>

      {/* "Here's the plan" cards */}
      <div className="animate-fade-up-d2 space-y-2">
        {[
          {
            Icon: Zap,
            bm: '2 topik. 20 markah. Paling mudah harvest.',
            en: '2 topics. 20 marks. Easiest to harvest.',
          },
          {
            Icon: Timer,
            bm: '5 minit sehari. Kita drill sampai reflex.',
            en: "5 minutes a day. We drill until it's reflex.",
          },
          {
            Icon: Target,
            bm: 'Setiap betul = markah naik. Tengok sendiri.',
            en: 'Every correct answer = score goes up. Watch it happen.',
          },
        ].map(({ Icon, bm, en }) => (
          <div key={bm} className="flex items-center gap-4 rounded-2xl bg-white border border-[#DCCCAC] px-4 py-3.5">
            <Icon size={22} className="text-black shrink-0" />
            <p className="text-base font-semibold text-black leading-snug">
              {lang === 'BM' ? bm : en}
            </p>
          </div>
        ))}
      </div>

      <button
        onClick={() => setSlide(1)}
        className="animate-fade-up-d3 w-full rounded-2xl bg-[#546B41] text-white font-black text-lg py-5 active:scale-[0.98] transition-transform hover:bg-[#3D5231]"
      >
        {lang === 'BM' ? 'Jom mulakan →' : "Let's go →"}
      </button>
    </div>,

    // ── Slide 1: Topic hook ──────────────────────────────────────────────────
    <div key="s1-hook" className="space-y-6">
      <div className="rounded-2xl bg-[#546B41] px-6 py-10 text-center space-y-3">
        <div className="text-xs font-bold uppercase tracking-[0.2em] text-white/60">
          {lang === 'BM' ? 'Paper 2 · Soalan 13–15' : 'Paper 2 · Q13–15'}
        </div>
        <h1 className="text-4xl font-black text-white">
          {lang === 'BM' ? 'Nombor Indeks' : 'Index Numbers'}
        </h1>
        <div className="flex justify-center gap-4 pt-2">
          {[
            { n: '~10', sub: lang === 'BM' ? 'markah' : 'marks' },
            { n: '20 min', sub: lang === 'BM' ? 'masa' : 'time' },
            { n: '2021–2024', sub: lang === 'BM' ? 'setiap tahun' : 'every year' },
          ].map(({ n, sub }) => (
            <div key={n} className="text-center">
              <div className="text-2xl font-black text-white">{n}</div>
              <div className="text-xs text-white/50">{sub}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-[#DCCCAC] bg-[#FFF8EC] px-5 py-4">
        <p className="text-base text-black leading-relaxed font-semibold">
          {lang === 'BM'
            ? 'Pelajar yang tahu pattern soalan ni boleh kutip 6–8 markah dalam masa 20 minit. Kita belajar pattern tu sekarang.'
            : "Students who know this question pattern score 6–8 marks in 20 minutes. We're learning that pattern right now."}
        </p>
      </div>

      <button
        onClick={() => setSlide(2)}
        className="w-full rounded-2xl bg-[#546B41] text-white font-black text-lg py-5 active:scale-[0.98] transition-transform hover:bg-[#3D5231]"
      >
        {lang === 'BM' ? 'Tunjuk saya →' : 'Show me →'}
      </button>
    </div>,

    // ── Slide 2: Keyword tap game ────────────────────────────────────────────
    <div key="s2-keywords" className="space-y-5">
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-black/30">
          {lang === 'BM' ? 'Langkah 1 / 2' : 'Step 1 / 2'}
        </p>
        <h2 className="text-2xl font-black text-black mt-1 leading-tight">
          {lang === 'BM' ? 'Kenal soalan Nombor Indeks' : 'Spot an Index Numbers question'}
        </h2>
        <p className="text-base text-black/50 mt-1">
          {lang === 'BM' ? 'Tap perkataan yang penting dalam soalan SPM ni ↓' : 'Tap the important words in this SPM question ↓'}
        </p>
      </div>

      {/* Sample SPM question snippet */}
      <div className="rounded-xl border border-[#DCCCAC] bg-white px-5 py-4 text-sm text-black leading-loose font-mono">
        {lang === 'BM'
          ? 'Jadual 4 menunjukkan maklumat tentang empat bahan. Lajur ketiga ialah '
          : 'Table 4 shows information about four ingredients. The third column is '}
        {keywords.map((kw, i) => (
          <span key={i}>
            <button
              onClick={() => tapKeyword(i)}
              className={`inline-block rounded px-1.5 py-0.5 font-bold border transition-all duration-200 mx-0.5 ${
                tapped.has(i)
                  ? 'bg-[#546B41]/15 border-[#99AD7A] text-black scale-105'
                  : 'bg-[#DCCCAC]/30 border-[#DCCCAC] text-black/50 hover:bg-[#DCCCAC]/50 animate-pulse'
              }`}
            >
              {kw.word}
            </button>
            {i < keywords.length - 1 && (lang === 'BM' ? ', dan ada lajur ' : ', and a column for ')}
          </span>
        ))}
        {lang === 'BM' ? '.' : '.'}
      </div>

      {/* Tapped keyword hints */}
      <div className="space-y-2">
        {keywords.map((kw, i) => tapped.has(i) && (
          <div key={i} className="flex items-start gap-3 rounded-xl bg-black/5 border border-black/10 px-4 py-3 transition-all duration-200">
            <span className="text-black font-bold shrink-0 mt-0.5 flex">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </span>
            <div>
              <p className="text-xs font-bold text-black uppercase tracking-wide">{kw.word}</p>
              <p className="text-sm text-black mt-0.5">{kw.hint}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Progress dots */}
      <div className="flex gap-2 items-center justify-center">
        {keywords.map((_, i) => (
          <div key={i} className={`h-2 rounded-full transition-all duration-300 ${tapped.has(i) ? 'w-6 bg-[#546B41]' : 'w-2 bg-[#DCCCAC]'}`} />
        ))}
      </div>

      <button
        onClick={() => setSlide(3)}
        disabled={!allTapped}
        className={`w-full rounded-2xl font-black text-lg py-5 transition-all duration-200 ${
          allTapped
            ? 'bg-[#546B41] text-white active:scale-[0.98] hover:bg-[#3D5231]'
            : 'bg-[#DCCCAC]/30 text-white/60 cursor-not-allowed'
        }`}
      >
        {allTapped
          ? (lang === 'BM' ? 'Bagus! Teruskan →' : 'Nice! Continue →')
          : (lang === 'BM' ? `Tap ${keywords.length - tapped.size} perkataan lagi` : `Tap ${keywords.length - tapped.size} more words`)}
      </button>
    </div>,

    // ── Slide 3: Question structure tap-to-reveal ───────────────────────────
    <div key="s3-strategy" className="space-y-5">
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-black/30">
          {lang === 'BM' ? 'Langkah 2 / 2' : 'Step 2 / 2'}
        </p>
        <h2 className="text-2xl font-black text-black mt-1 leading-tight">
          {lang === 'BM' ? 'Strategi kutip markah' : 'Mark harvesting strategy'}
        </h2>
        <p className="text-base text-black/50 mt-1">
          {lang === 'BM' ? 'Tap setiap bahagian untuk tengok apa yang patut kau buat.' : 'Tap each part to see what you should do.'}
        </p>
      </div>

      <div className="space-y-2">
        {parts.map((p, i) => {
          const style = ACTION_STYLE[p.action];
          const open = expanded.has(i);
          return (
            <button
              key={i}
              onClick={() => togglePart(i)}
              className={`w-full text-left rounded-2xl border-2 px-4 py-4 transition-all duration-200 ${
                open ? style.border + ' bg-white shadow-sm' : 'border-[#DCCCAC] bg-white'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-xl font-black text-black w-8">{p.label}</span>
                  <span className="text-base font-semibold text-black">{p.title}</span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${style.pill}`}>
                    {lang === 'BM' ? style.label_bm : style.label_en}
                  </span>
                  {open ? <ChevronUp size={14} className="text-gray-400" /> : <ChevronDown size={14} className="text-gray-400" />}
                </div>
              </div>
              {open && (
                <div className="mt-3 pt-3 border-t border-gray-100 flex items-start gap-2">
                  <span className="text-gray-400 text-xs shrink-0">{p.marks} {p.marks === 1 ? 'mark' : 'marks'}</span>
                  <span className="text-sm text-gray-600 leading-snug">{p.detail}</span>
                </div>
              )}
            </button>
          );
        })}
      </div>

      <div className="rounded-xl bg-[#FFF8EC] border border-[#DCCCAC] px-4 py-3">
        <p className="text-sm text-black/60 leading-relaxed">
          {lang === 'BM'
            ? 'Target: selesaikan (a) dulu → dapat 3 markah. Baru cuba (b). Bahagian (c) — hanya bila dah ready.'
            : 'Target: finish (a) first → get 3 marks. Then try (b). Part (c) — only when ready.'}
        </p>
      </div>

      <button
        onClick={onDone}
        className="w-full rounded-2xl bg-[#546B41] text-white font-black text-lg py-5 active:scale-[0.98] transition-transform hover:bg-[#3D5231]"
      >
        {lang === 'BM' ? 'Tengok soalan SPM sebenar →' : 'See actual SPM question →'}
      </button>
    </div>,
  ];

  return (
    <div className="space-y-4">
      {/* Slide progress indicator */}
      <div className="flex gap-1.5 justify-center">
        {SLIDES.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === slide ? 'w-8 bg-[#546B41]' : i < slide ? 'w-4 bg-[#99AD7A]' : 'w-4 bg-[#DCCCAC]'
            }`}
          />
        ))}
      </div>

      {/* Slide content */}
      <div className="transition-all duration-200">
        {SLIDES[slide]}
      </div>
    </div>
  );
}
