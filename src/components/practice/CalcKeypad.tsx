import { useState } from 'react';
import { evaluate } from 'mathjs';

type Props = {
  onSubmit: (normalizedExpr: string, value: number | null) => void;
  disabled?: boolean;
  lang: 'BM' | 'EN';
};

// Display → mathjs mapping
const SYM_MAP: Record<string, string> = { '÷': '/', '×': '*', '−': '-' };

function normalize(expr: string): string {
  return expr.replace(/÷/g, '/').replace(/×/g, '*').replace(/−/g, '-');
}

function evalSafe(expr: string): number | null {
  try {
    const r = evaluate(normalize(expr));
    return typeof r === 'number' ? r : null;
  } catch { return null; }
}

const ROWS = [
  ['7', '8', '9', '÷'],
  ['4', '5', '6', '×'],
  ['1', '2', '3', '−'],
  ['0', '.', 'DEL', '+'],
  ['(', ')', 'C', '='],
];

export default function CalcKeypad({ onSubmit, disabled, lang }: Props) {
  const [expr, setExpr] = useState('');
  const [needsWorking, setNeedsWorking] = useState(false);

  function press(key: string) {
    if (disabled) return;
    setNeedsWorking(false);

    if (key === 'C')   { setExpr(''); return; }
    if (key === 'DEL') { setExpr(e => e.slice(0, -1)); return; }

    if (key === '=') {
      const norm = normalize(expr);
      // Require at least one operator — no bare-number submissions
      if (!/[+\-*/]/.test(norm)) { setNeedsWorking(true); return; }
      onSubmit(norm, evalSafe(norm));
      return;
    }

    setExpr(e => e + (SYM_MAP[key] ? key : key));
  }

  function btnCls(key: string) {
    const base = 'h-12 rounded-xl font-bold text-base transition-all active:scale-95 select-none ';
    if (disabled) return base + 'opacity-40 cursor-not-allowed bg-[#DCCCAC]/20 border border-[#DCCCAC] text-black/50';
    if (key === '=')  return base + 'bg-[#546B41] text-white hover:bg-[#3D5231] cursor-pointer';
    if (key === 'C' || key === 'DEL') return base + 'bg-[#DCCCAC]/30 border border-[#DCCCAC] text-black/50 cursor-pointer';
    if ('÷×−+()'.includes(key)) return base + 'bg-[#FFF8EC] border border-[#DCCCAC] text-black cursor-pointer';
    return base + 'bg-white border border-[#DCCCAC] text-black hover:bg-[#FFF8EC] cursor-pointer';
  }

  return (
    <div className="space-y-2">
      {/* Expression display — not an input, no keyboard */}
      <div className="rounded-xl border-2 border-[#DCCCAC] bg-[#FFF8EC] px-4 py-3 min-h-[52px] flex items-center">
        <span className="text-xl font-mono text-black tracking-wide flex-1 break-all">
          {expr || (
            <span className="text-black/40">
              {lang === 'BM' ? 'Tekan nombor di bawah...' : 'Press numbers below...'}
            </span>
          )}
        </span>
      </div>

      {needsWorking && (
        <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 leading-snug">
          {lang === 'BM'
            ? 'Tunjuk cara kira — jangan masuk jawapan terus. Contoh: 130÷100×80'
            : "Show your working — don't enter the answer directly. E.g. 130÷100×80"}
        </p>
      )}

      <div className="grid grid-cols-4 gap-2">
        {ROWS.flat().map(key => (
          <button key={key} onClick={() => press(key)} disabled={disabled} className={btnCls(key)}>
            {key}
          </button>
        ))}
      </div>
    </div>
  );
}
