import { useState, useEffect, useRef, useMemo } from 'react';
import { lazy, Suspense } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { evaluate } from 'mathjs';
import { Target, Check, Lightbulb, ChevronLeft } from 'lucide-react';
import { checkAnswer } from '@/lib/mathcheck';
import CalcKeypad from './CalcKeypad';
import type { KpStep, StepVariant, CheckResult, HintCache } from '@/types';

const SpmQuestionCard = lazy(() => import('./SpmQuestionCard'));

const REWARDS_BM = [
  'Macam ni la orang dapat A fikir.',
  'Betul. Ingat cara ni — soalan sama selalu keluar.',
  'Satu mark lagi masuk poket.',
  'Pattern dah tangkap. Teruskan.',
];
const REWARDS_EN = [
  'This is how A students think.',
  'Correct. Remember this — same pattern keeps showing up.',
  'One more mark in the bag.',
  'Pattern locked. Keep going.',
];

function pickReward(count: number, lang: 'BM' | 'EN'): string | null {
  if (Math.random() > 0.6) return null;
  const pool = lang === 'BM' ? REWARDS_BM : REWARDS_EN;
  return pool[count % pool.length];
}

type Props = {
  step: KpStep;
  variant: StepVariant;
  hints: HintCache[];
  lang: 'BM' | 'EN';
  correctCount: number;
  stepMasteryScore: number;
  userId?: string;
  onResult: (result: CheckResult, hintTierUsed: number) => void;
  onProceed: () => void;
  onBack?: () => void;
  hideQuestionReader?: boolean;
};

function evalSafe(expr: string): number | null {
  try {
    const r = evaluate(expr);
    return typeof r === 'number' ? r : null;
  } catch { return null; }
}

function topLevelDivIdx(s: string): number {
  let depth = 0;
  for (let i = 0; i < s.length; i++) {
    if (s[i] === '(') depth++;
    else if (s[i] === ')') depth--;
    else if (s[i] === '/' && depth === 0) return i;
  }
  return -1;
}

function fmtToken(s: string): string {
  const t = s.trim();
  if (t.startsWith('(') && t.endsWith(')')) {
    let depth = 0, wraps = true;
    for (let i = 0; i < t.length - 1; i++) {
      if (t[i] === '(') depth++;
      else if (t[i] === ')') depth--;
      if (depth === 0 && i < t.length - 1) { wraps = false; break; }
    }
    if (wraps) return fmtToken(t.slice(1, -1));
  }
  return t.replace(/\*/g, ' × ');
}

function Frac({ num, den }: { num: string; den: string }) {
  return (
    <span className="inline-flex flex-col items-center leading-none align-middle mx-0.5">
      <span className="border-b-[2.5px] border-current pb-[3px] px-2 text-sm font-bold">{fmtToken(num)}</span>
      <span className="pt-[3px] px-2 text-sm font-bold">{fmtToken(den)}</span>
    </span>
  );
}

function FormulaDisplay({ expr }: { expr: string }) {
  const e = expr.trim();

  const m1 = e.match(/^\((.+)\)\*(.+)$/);
  if (m1) {
    const di = topLevelDivIdx(m1[1]);
    if (di >= 0) return (
      <span className="inline-flex items-center gap-1.5 flex-wrap justify-center">
        <Frac num={m1[1].slice(0, di).trim()} den={m1[1].slice(di + 1).trim()} />
        <span className="opacity-60 font-normal text-base">×</span>
        <span>{m1[2].trim()}</span>
      </span>
    );
  }

  const m2 = e.match(/^(.+)\*\((.+)\)$/);
  if (m2) {
    const di = topLevelDivIdx(m2[2]);
    if (di >= 0) return (
      <span className="inline-flex items-center gap-1.5 flex-wrap justify-center">
        <span>{m2[1].trim()}</span>
        <span className="opacity-60 font-normal text-base">×</span>
        <Frac num={m2[2].slice(0, di).trim()} den={m2[2].slice(di + 1).trim()} />
      </span>
    );
  }

  const di = topLevelDivIdx(e);
  if (di >= 0) return <Frac num={e.slice(0, di).trim()} den={e.slice(di + 1).trim()} />;

  return <span>{fmtToken(e)}</span>;
}

// Renders hint text, converting "ATAS: X\nBAWAH: Y" or "X / Y" patterns to visual fractions
function HintBody({ text }: { text: string }) {
  const parts: React.ReactNode[] = [];
  const lines = text.split('\n');
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    // ATAS:/BAWAH: pattern (from updated hint generator)
    if (line.trim().toUpperCase().startsWith('ATAS:') && lines[i + 1]?.trim().toUpperCase().startsWith('BAWAH:')) {
      const num = line.trim().replace(/^ATAS:/i, '').trim();
      const den = lines[i + 1].trim().replace(/^BAWAH:/i, '').trim();
      parts.push(
        <span key={i} className="inline-flex items-center gap-1">
          <Frac num={num} den={den} />
        </span>
      );
      i += 2;
      continue;
    }
    // Inline A / B pattern — only when surrounded by spaces and looks like a formula fragment
    const fracMatch = line.match(/^(.*?)\b([A-Za-z0-9À-ɏ(). ×+\-*]+)\s*\/\s*([A-Za-z0-9À-ɏ(). ×+\-*]+)\b(.*)$/);
    if (fracMatch && fracMatch[2].trim() && fracMatch[3].trim() && line.includes('/')) {
      const [, before, num, den, after] = fracMatch;
      parts.push(
        <span key={i}>
          {before && <span>{before}</span>}
          <Frac num={num.trim()} den={den.trim()} />
          {after && <span>{after}</span>}
        </span>
      );
      i++;
      continue;
    }
    parts.push(<span key={i}>{line}</span>);
    i++;
  }
  return <>{parts.map((p, idx) => <span key={idx}>{p}{idx < parts.length - 1 && <br />}</span>)}</>;
}

function buildChoices(variant: StepVariant): string[] {
  const correctVal = evalSafe(variant.correct_answer_json.expression);
  if (correctVal === null) return [];

  const exprs = [variant.correct_answer_json.expression];
  for (const w of variant.common_wrongs_json) {
    const v = evalSafe(w.expression);
    if (v !== null && !exprs.some(ex => {
      const ev = evalSafe(ex);
      return ev !== null && Math.abs(ev - v) < 0.01;
    })) exprs.push(w.expression);
  }

  // deterministic shuffle seeded on variant id
  for (let i = exprs.length - 1; i > 0; i--) {
    const j = (i * 7 + variant.id.charCodeAt(0)) % (i + 1);
    [exprs[i], exprs[j]] = [exprs[j], exprs[i]];
  }
  return exprs;
}

export default function StepCard({
  step, variant, hints, lang, correctCount, stepMasteryScore,
  userId, onResult, onProceed, onBack, hideQuestionReader,
}: Props) {
  const hasFullQuestion = !!(variant.full_question_bm || variant.full_question_en);
  const [phase, setPhase] = useState<'question-reader' | 'answer'>(
    hasFullQuestion && !hideQuestionReader ? 'question-reader' : 'answer'
  );

  // Mode: calc unlocks once this step's mastery score > 0.85 (≥5 correct attempts); reverts after 5 wrongs
  const baseMode: 'mcq' | 'calc' = stepMasteryScore > 0.85 ? 'calc' : 'mcq';
  const [forceMcq, setForceMcq] = useState(false);
  const mode = forceMcq ? 'mcq' : baseMode;

  // Attempt state
  const [wrongCount, setWrongCount] = useState(0);
  const [flashWrong, setFlashWrong] = useState<string | null>(null); // expr shown as red briefly
  const [correctResult, setCorrectResult] = useState<CheckResult | null>(null);
  const [reward, setReward] = useState<string | null>(null);

  // Hint state — auto-increments with each wrong
  const [hintTier, setHintTier] = useState<0 | 1 | 2 | 3 | 4>(0);
  const currentHint = hints.find(h => h.hint_tier === hintTier as 1 | 2 | 3 | 4);

  // Reveal state
  const [revealed, setRevealed] = useState(false);
  const [revealCountdown, setRevealCountdown] = useState<number | null>(null);
  const [canProceed, setCanProceed] = useState(false);

  const proceedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const choices = useMemo(() => buildChoices(variant), [variant]);

  const prompt = (lang === 'BM' ? variant.prompt_bm : variant.prompt_en) || variant.prompt_bm;
  const patternCue = (lang === 'BM' ? step.step_description_bm : step.step_description_en) || step.step_description_bm;

  // Cleanup timers on unmount
  useEffect(() => () => { if (proceedTimer.current) clearTimeout(proceedTimer.current); }, []);

  // Countdown for tunjuk jawapan
  useEffect(() => {
    if (revealCountdown === null) return;
    if (revealCountdown <= 0) { setCanProceed(true); return; }
    const t = setTimeout(() => setRevealCountdown(c => (c ?? 1) - 1), 1000);
    return () => clearTimeout(t);
  }, [revealCountdown]);

  const correctVal = evalSafe(variant.correct_answer_json.expression);
  const tolerance = variant.correct_answer_json.tolerance ?? 0.01;
  function isCorrectExpr(expr: string) {
    const v = evalSafe(expr);
    return v !== null && correctVal !== null && Math.abs(v - correctVal) <= tolerance;
  }

  // Show reveal button after 3 wrongs or when hints are exhausted
  const showRevealButton = !revealed && !correctResult && (wrongCount >= 3 || hintTier >= 4);

  function handleAttempt(expr: string, value: number | null) {
    const r = checkAnswer(expr, variant.correct_answer_json, variant.common_wrongs_json, step.mark_value);

    if (r.isCorrect) {
      setCorrectResult(r);
      setReward(pickReward(correctCount, lang));
      onResult(r, hintTier);
      proceedTimer.current = setTimeout(() => onProceed(), 2000);
      return;
    }

    // Wrong attempt
    const newWrong = wrongCount + 1;
    setWrongCount(newWrong);
    onResult(r, hintTier);

    // Advance hint tier
    const nextTier = Math.min(newWrong, 4) as 1 | 2 | 3 | 4;
    setHintTier(nextTier);

    // Revert calc → mcq after 5 wrong in calc mode
    if (baseMode === 'calc' && newWrong >= 5) setForceMcq(true);

    // Flash red on the selected choice briefly
    setFlashWrong(expr);
    setTimeout(() => setFlashWrong(null), 900);
  }

  function handleReveal() {
    setRevealed(true);
    setRevealCountdown(5);
    onResult({ isCorrect: false, numericValue: null, marksAwarded: 0 }, hintTier);
  }

  // ── Question reader phase ──────────────────────────────────────────────────
  if (phase === 'question-reader') {
    return (
      <div className="flex flex-col h-full">
        {onBack && (
          <button onClick={onBack} className="flex items-center gap-1.5 text-xs text-gray-400 mb-3 hover:text-gray-600 transition-colors w-fit">
            <ChevronLeft size={14} />
            {lang === 'BM' ? 'Kembali' : 'Back'}
          </button>
        )}
        <Suspense fallback={<div className="h-48 flex items-center justify-center text-gray-400 text-sm">Memuatkan...</div>}>
          <SpmQuestionCard step={step} variant={variant} lang={lang} onProceed={() => setPhase('answer')} />
        </Suspense>
      </div>
    );
  }

  // ── Answer phase ───────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col rounded-2xl border border-[#DCCCAC] bg-white shadow-sm overflow-hidden min-h-[400px] lg:h-full">

      {/* Header */}
      <div className="bg-[#546B41] px-5 py-3.5 shrink-0">
        <div className="flex items-center gap-1.5 mb-1.5">
          {onBack && (
            <button onClick={onBack} className="mr-1 p-1 rounded-full hover:bg-white/10 transition-colors">
              <ChevronLeft size={14} className="text-black/40" />
            </button>
          )}
          <Target size={12} className="text-white/60" />
          <span className="text-xs font-semibold text-white/60 uppercase tracking-widest">
            {lang === 'BM' ? 'Nampak pattern ni?' : 'Spot this pattern?'}
          </span>
          {baseMode === 'calc' && !forceMcq && (
            <span className="ml-auto text-[10px] font-bold text-white/40 uppercase tracking-wide">
              {lang === 'BM' ? 'Mod Kalkulator' : 'Calc Mode'}
            </span>
          )}
        </div>
        <p className="text-white font-semibold text-base leading-snug">{patternCue}</p>
        <div className="mt-1.5 text-xs text-white/50">
          {step.topic} · {step.mark_value === 1 ? '1 K-mark' : '2 K-marks'}
        </div>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto px-5 pt-4 pb-5 space-y-4 bg-white">
        <div className="text-xs font-semibold text-black/40 uppercase tracking-widest">
          {lang === 'BM' ? 'Soalan' : 'Question'}
        </div>

        <div className="text-base text-black leading-relaxed prose prose-base max-w-none
          prose-p:mb-4 prose-p:mt-0
          prose-table:text-sm prose-td:py-2 prose-td:px-3 prose-th:py-2 prose-th:px-3
          prose-table:border prose-td:border prose-th:border prose-th:bg-[#FFF8EC]">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{prompt}</ReactMarkdown>
        </div>

        {/* Auto-shown hint after wrong attempts */}
        {hintTier > 0 && currentHint && (
          <div className="rounded-lg bg-[#FFF8EC] border border-[#DCCCAC] p-4 text-base text-black animate-fade-up">
            <span className="font-semibold text-black/50 flex items-center gap-1 text-xs uppercase tracking-wide mb-1">
              <Lightbulb size={12} />
              {lang === 'BM' ? `Petunjuk ${hintTier}` : `Hint ${hintTier}`}
            </span>
            <HintBody text={lang === 'BM' ? currentHint.body_bm : currentHint.body_en} />
          </div>
        )}

        {hintTier > 0 && !currentHint && (
          <div className="rounded-lg bg-[#FFF8EC] border border-[#DCCCAC] p-3 text-sm text-black/50">
            <span className="flex items-center gap-1">
              <Lightbulb size={12} />
              {patternCue}
            </span>
          </div>
        )}

        <div className="border-t border-[#DCCCAC]/40 pt-3 space-y-3">

          {/* ── Correct result ─────────────────────────────────────────────── */}
          {correctResult && (
            <div className="rounded-xl bg-black/5 border border-black/10 p-4 space-y-3">
              <div className="flex items-start gap-2">
                <Check size={16} className="text-black mt-0.5 shrink-0" />
                <div>
                  <p className="font-bold text-black text-lg leading-tight">
                    +{correctResult.marksAwarded} {correctResult.marksAwarded === 1 ? 'K-mark' : 'K-marks'}
                  </p>
                  {reward && <p className="text-sm italic text-black/50 mt-0.5">{reward}</p>}
                </div>
              </div>
              <button
                onClick={() => { if (proceedTimer.current) clearTimeout(proceedTimer.current); onProceed(); }}
                className="w-full rounded-xl bg-black text-white font-bold py-3 text-base active:scale-[0.98] transition-transform"
              >
                {lang === 'BM' ? 'Teruskan →' : 'Continue →'}
              </button>
            </div>
          )}

          {/* ── Revealed answer ─────────────────────────────────────────────── */}
          {revealed && (
            <div className="rounded-xl border-2 border-[#99AD7A] bg-[#546B41]/5 p-4 space-y-3">
              <p className="text-xs font-bold text-black uppercase tracking-wide">
                {lang === 'BM' ? 'Cara betul:' : 'Correct method:'}
              </p>
              <div className="text-2xl text-center font-semibold text-black py-2">
                <FormulaDisplay expr={variant.correct_answer_json.expression} />
              </div>
              {canProceed ? (
                <button
                  onClick={onProceed}
                  className="w-full rounded-xl bg-[#546B41] text-white font-bold py-3 text-base active:scale-[0.98] transition-transform"
                >
                  {lang === 'BM' ? 'Soalan seterusnya →' : 'Next question →'}
                </button>
              ) : (
                <div className="text-center text-sm text-black/50">
                  {lang === 'BM' ? `Baca dulu... (${revealCountdown}s)` : `Read this... (${revealCountdown}s)`}
                </div>
              )}
            </div>
          )}

          {/* ── MCQ choices ────────────────────────────────────────────────── */}
          {!correctResult && !revealed && mode === 'mcq' && (
            <>
              <div className="text-xs font-semibold text-black/40 uppercase tracking-widest">
                {lang === 'BM' ? 'Pilih cara yang betul:' : 'Choose the correct setup:'}
              </div>
              <div className="flex flex-col gap-2">
                {choices.map(expr => {
                  const isFlashing = flashWrong === expr;
                  let cls = 'w-full rounded-xl border-2 px-4 py-3.5 text-center transition-all duration-150 ';
                  if (isFlashing) {
                    cls += 'border-red-400 bg-red-50 text-red-900';
                  } else {
                    cls += 'border-[#DCCCAC] bg-white text-black hover:border-[#99AD7A] hover:bg-[#FFF8EC] active:scale-[0.98] cursor-pointer shadow-sm';
                  }
                  return (
                    <button
                      key={expr}
                      className={cls}
                      onClick={() => !flashWrong && handleAttempt(expr, evalSafe(expr))}
                      disabled={!!flashWrong}
                    >
                      <span className="text-lg font-semibold">
                        <FormulaDisplay expr={expr} />
                      </span>
                      {isFlashing && (
                        <span className="block text-xs text-red-500 mt-1 font-normal">
                          {lang === 'BM' ? 'Bukan cara ni' : 'Not this one'}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {/* ── Calculator keypad ───────────────────────────────────────────── */}
          {!correctResult && !revealed && mode === 'calc' && (
            <>
              <div className="text-xs font-semibold text-black/40 uppercase tracking-widest">
                {lang === 'BM' ? 'Tunjuk cara kira:' : 'Show your working:'}
              </div>
              <CalcKeypad
                lang={lang}
                disabled={!!flashWrong}
                onSubmit={(expr, value) => handleAttempt(expr, value)}
              />
              {flashWrong && (
                <div className="rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
                  {lang === 'BM' ? 'Hampir — semak cara kira kau.' : 'Almost — check your working.'}
                </div>
              )}
            </>
          )}

          {/* ── Tunjuk jawapan ──────────────────────────────────────────────── */}
          {showRevealButton && (
            <button
              onClick={handleReveal}
              className="flex items-center gap-1.5 text-xs text-black/50 hover:text-black underline transition-colors mt-1"
            >
              <Lightbulb size={11} />
              {lang === 'BM' ? 'Tunjuk jawapan' : 'Show answer'}
            </button>
          )}

        </div>
      </div>
    </div>
  );
}
