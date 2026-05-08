import { evaluate } from 'mathjs';
import type { AnswerSpec, CheckResult, CommonWrong } from '@/types';

function evalExpr(expr: string): number | null {
  try {
    const result = evaluate(expr);
    return typeof result === 'number' ? result : null;
  } catch {
    return null;
  }
}

export function checkAnswer(
  studentInput: string,
  spec: AnswerSpec,
  commonWrongs: CommonWrong[],
  markValue: number
): CheckResult {
  const studentVal = evalExpr(studentInput);
  const correctVal = evalExpr(spec.expression);
  const tolerance = spec.tolerance ?? 0.01;

  if (studentVal === null || correctVal === null) {
    return { isCorrect: false, numericValue: studentVal, marksAwarded: 0 };
  }

  if (Math.abs(studentVal - correctVal) <= tolerance) {
    return { isCorrect: true, numericValue: studentVal, marksAwarded: markValue };
  }

  for (const wrong of commonWrongs) {
    const wrongVal = evalExpr(wrong.expression);
    if (wrongVal !== null && Math.abs(studentVal - wrongVal) <= tolerance) {
      return {
        isCorrect: false,
        numericValue: studentVal,
        marksAwarded: wrong.marks_awarded,
        matchedWrong: wrong,
      };
    }
  }

  return { isCorrect: false, numericValue: studentVal, marksAwarded: 0 };
}
