import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Target, CheckCircle2, ChevronDown, ChevronUp, BookOpen } from 'lucide-react';
import type { KpStep, StepVariant, PartGuide } from '@/types';

type Props = {
  step: KpStep;
  variant: StepVariant;
  lang: 'BM' | 'EN';
  onProceed: () => void;
};

export default function SpmQuestionCard({ step, variant, lang, onProceed }: Props) {
  const [questionExpanded, setQuestionExpanded] = useState(false);

  const fullQ = (lang === 'BM' ? variant.full_question_bm : variant.full_question_en) || variant.full_question_bm;
  const keySentence = (lang === 'BM' ? variant.key_sentence_bm : variant.key_sentence_en) || variant.key_sentence_bm;
  const guides: PartGuide[] = variant.part_guide_json ?? [];

  const topicLabel = lang === 'BM'
    ? (step.topic === 'Index Numbers' ? 'Nombor Indeks' : 'Pengaturcaraan Linear')
    : step.topic;

  const targetGuide = guides.find(g => g.action === 'do');
  const otherGuides = guides.filter(g => g.action !== 'do');

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] min-h-[520px]">

      {/* Topic pills */}
      <div className="flex items-center gap-2 flex-wrap shrink-0 mb-3">
        <span className="rounded-full bg-[#546B41]/15 text-black text-xs font-bold px-3 py-1 uppercase tracking-wide">
          {topicLabel}
        </span>
        <span className="rounded-full bg-[#DCCCAC]/30 text-black/50 text-xs font-semibold px-3 py-1">
          Paper 2 · 3472/2
        </span>
      </div>

      {/* Full SPM question — collapsible */}
      <div className="shrink-0 rounded-2xl border border-[#DCCCAC] bg-white overflow-hidden mb-3">
        <button
          onClick={() => setQuestionExpanded(e => !e)}
          className="w-full bg-[#546B41] px-5 py-3 flex items-center justify-between"
        >
          <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/60">
            <BookOpen size={13} className="text-black/50" />
            {lang === 'BM' ? 'Soalan SPM penuh — klik untuk buka' : 'Full SPM question — tap to expand'}
          </span>
          {questionExpanded
            ? <ChevronUp size={14} className="text-black/50" />
            : <ChevronDown size={14} className="text-black/50" />
          }
        </button>

        {questionExpanded && (
          <div className="px-5 pt-4 pb-4 max-h-52 overflow-y-auto">
            <div className="text-sm text-black leading-relaxed prose prose-sm max-w-none
              prose-table:text-sm prose-td:py-2 prose-td:px-3 prose-th:py-2 prose-th:px-3
              prose-table:border prose-td:border prose-th:border prose-th:bg-[#FFF8EC]
              prose-strong:text-black prose-em:text-black/50">
              {fullQ
                ? <ReactMarkdown remarkPlugins={[remarkGfm]}>{fullQ}</ReactMarkdown>
                : <p className="text-white/60 italic">{lang === 'BM' ? 'Soalan penuh tidak tersedia.' : 'Full question not available.'}</p>
              }
            </div>
          </div>
        )}
      </div>

      {/* Scrollable middle */}
      <div className="flex-1 overflow-y-auto min-h-0 space-y-3">

        {/* ── TODAY'S TARGET — big, unmissable ───────────────────────────── */}
        {targetGuide ? (
          <div className="rounded-2xl border-2 border-[#546B41] bg-[#546B41]/6 overflow-hidden">
            {/* Header stripe */}
            <div className="bg-[#546B41] px-5 py-2.5 flex items-center gap-2">
              <Target size={14} className="text-white/70 shrink-0" />
              <p className="text-xs font-bold uppercase tracking-widest text-white/60">
                {lang === 'BM' ? 'Latihan hari ini' : "Today's drill"}
              </p>
            </div>

            <div className="px-5 py-4 space-y-2">
              {/* Part label + marks */}
              <div className="flex items-baseline gap-3">
                <span className="text-2xl font-black text-black">{targetGuide.part}</span>
                <span className="text-sm text-black/50">
                  {targetGuide.marks} {targetGuide.marks === 1 ? 'mark' : 'marks'}
                </span>
                <span className="flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#546B41]/15 text-black">
                  <CheckCircle2 size={11} />
                  {lang === 'BM' ? 'Mesti buat' : 'Do this first'}
                </span>
              </div>

              {/* Focus sentence */}
              {keySentence && (
                <p className="text-sm font-semibold text-black leading-snug">
                  {keySentence}
                </p>
              )}

              {/* Reason */}
              <p className="text-sm text-black/80 leading-snug">
                {lang === 'BM' ? targetGuide.reason_bm : targetGuide.reason_en}
              </p>
            </div>
          </div>
        ) : (
          /* No guides — just proceed */
          <div className="rounded-2xl border-2 border-[#546B41] bg-[#546B41]/6 px-5 py-4">
            <p className="text-sm font-semibold text-black">
              {lang === 'BM' ? 'Jawab soalan ini.' : 'Answer this question.'}
            </p>
          </div>
        )}

        {/* ── OTHER PARTS — read-only context, no action buttons ─────────── */}
        {otherGuides.length > 0 && (
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-white/60 px-1 mb-2">
              {lang === 'BM' ? 'Bahagian lain — bukan untuk latihan ini' : 'Other parts — not this drill'}
            </p>
            <div className="space-y-1.5">
              {otherGuides.map((guide) => {
                const isSkip = guide.action === 'skip';
                return (
                  <div
                    key={guide.part}
                    className="rounded-xl border border-[#DCCCAC]/50 bg-white/50 px-4 py-3 flex items-center justify-between opacity-60"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold text-black/50">{guide.part}</span>
                      <span className="text-xs text-white/60">· {guide.marks} marks</span>
                    </div>
                    <span className={`text-xs font-medium ${isSkip ? 'text-white/60' : 'text-amber-500'}`}>
                      {isSkip
                        ? (lang === 'BM' ? 'Skip dulu' : 'Skip for now')
                        : (lang === 'BM' ? 'Cuba kalau ada masa' : 'Try if time allows')}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* ── SINGLE CTA — one button, no ambiguity ───────────────────────── */}
      <div className="shrink-0 pt-4 space-y-2">
        <button
          onClick={onProceed}
          className="w-full rounded-2xl bg-[#546B41] text-white font-bold text-base py-4 hover:bg-[#3D5231] active:scale-[0.98] transition-all"
        >
          {targetGuide
            ? (lang === 'BM'
                ? `Jawab bahagian ${targetGuide.part} sekarang →`
                : `Answer ${targetGuide.part} now →`)
            : (lang === 'BM' ? 'Jawab →' : 'Answer →')}
        </button>
        {otherGuides.length > 0 && (
          <p className="text-center text-[11px] text-white/60">
            {lang === 'BM'
              ? 'Bahagian lain tidak perlu dijawab dalam latihan ini'
              : 'Other parts are not required in this drill'}
          </p>
        )}
      </div>
    </div>
  );
}
