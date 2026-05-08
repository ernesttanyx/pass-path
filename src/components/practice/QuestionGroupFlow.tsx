import { useState, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { BookOpen, ChevronDown, ChevronUp, Check, ChevronLeft } from 'lucide-react';
import StepCard from './StepCard';
import type { KpStep, StepVariant, HintCache, CheckResult, Mastery } from '@/types';

export type PartItem = { step: KpStep; variant: StepVariant; hints: HintCache[] };

type Props = {
  group: PartItem[];
  lang: 'BM' | 'EN';
  correctCount: number;
  masteryRows: Mastery[];
  userId?: string;
  onPartResult: (result: CheckResult, hintTierUsed: number, step: KpStep, variant: StepVariant) => void;
  onGroupDone: () => void;
  onBack?: () => void;
};

function getPartLabel(item: PartItem, fallbackIdx: number): string {
  const doGuide = (item.variant.part_guide_json ?? []).find(g => g.action === 'do');
  return doGuide?.part || `(${String.fromCharCode(97 + fallbackIdx)})`;
}

export default function QuestionGroupFlow({
  group, lang, correctCount, masteryRows, userId, onPartResult, onGroupDone, onBack,
}: Props) {
  const [partIdx, setPartIdx] = useState(0);
  const [partsCorrect, setPartsCorrect] = useState<(boolean | null)[]>(group.map(() => null));
  const [questionExpanded, setQuestionExpanded] = useState(true);

  // Track last result per part so we can record outcome on proceed
  const lastResult = useRef<CheckResult | null>(null);

  const current = group[partIdx];
  const fullQ = (lang === 'BM' ? group[0].variant.full_question_bm : group[0].variant.full_question_en)
    || group[0].variant.full_question_bm;
  const isMultiPart = group.length > 1;

  function handlePartResult(result: CheckResult, hintTierUsed: number) {
    lastResult.current = result;
    onPartResult(result, hintTierUsed, current.step, current.variant);
  }

  function handleProceed() {
    // Record outcome for this part using the last result we saw
    const wasCorrect = lastResult.current?.isCorrect ?? false;
    setPartsCorrect(prev => {
      const next = [...prev];
      next[partIdx] = wasCorrect;
      return next;
    });
    lastResult.current = null;

    if (partIdx + 1 < group.length) {
      setPartIdx(i => i + 1);
    } else {
      onGroupDone();
    }
  }

  return (
    <div className="flex flex-col h-full gap-3">

      {onBack && partIdx === 0 && (
        <button onClick={onBack} className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600 transition-colors w-fit shrink-0">
          <ChevronLeft size={14} />
          {lang === 'BM' ? 'Kembali' : 'Back'}
        </button>
      )}

      {/* Full question — collapsible */}
      {fullQ && (
        <div className="shrink-0 rounded-2xl border border-[#DCCCAC] bg-white overflow-hidden">
          <button
            onClick={() => setQuestionExpanded(e => !e)}
            className="w-full bg-[#546B41] px-5 py-3 flex items-center justify-between"
          >
            <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/60">
              <BookOpen size={13} className="text-black/50" />
              {lang === 'BM' ? 'Soalan SPM penuh' : 'Full SPM question'}
            </span>
            {questionExpanded
              ? <ChevronUp size={14} className="text-black/50" />
              : <ChevronDown size={14} className="text-black/50" />}
          </button>
          {questionExpanded && (
            <div className="px-5 pt-4 pb-4 max-h-48 overflow-y-auto">
              <div className="text-base text-black leading-relaxed prose prose-base max-w-none
                prose-p:mb-4 prose-p:mt-0
                prose-table:text-sm prose-td:py-2 prose-td:px-3 prose-th:py-2 prose-th:px-3
                prose-table:border prose-td:border prose-th:border prose-th:bg-[#FFF8EC]">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{fullQ}</ReactMarkdown>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Part progress tabs */}
      {isMultiPart && (
        <div className="shrink-0 flex items-center gap-2 flex-wrap">
          <span className="text-xs text-black/50 font-medium shrink-0">
            {lang === 'BM' ? 'Bahagian:' : 'Part:'}
          </span>
          {group.map((item, idx) => {
            const label = getPartLabel(item, idx);
            const done = partsCorrect[idx] !== null;
            const correct = partsCorrect[idx] === true;
            const active = idx === partIdx;
            return (
              <div key={idx} className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold transition-all ${
                active ? 'bg-[#546B41] text-white shadow-sm'
                : done && correct ? 'bg-[#546B41]/15 text-black'
                : done && !correct ? 'bg-red-50 text-red-500'
                : 'bg-[#DCCCAC]/30 text-black/50'
              }`}>
                {done && correct && <Check size={10} className="mr-0.5" />}
                {label}
              </div>
            );
          })}
        </div>
      )}

      {/* Current part */}
      <div className="flex-1 min-h-0">
        <StepCard
          key={`${current.variant.id}-${partIdx}`}
          step={current.step}
          variant={current.variant}
          hints={current.hints}
          lang={lang}
          correctCount={correctCount}
          stepMasteryScore={masteryRows.find(m => m.kp_step_id === current.step.id)?.score_0_to_1 ?? 0}
          userId={userId}
          onResult={handlePartResult}
          onProceed={handleProceed}
          hideQuestionReader
        />
      </div>
    </div>
  );
}
