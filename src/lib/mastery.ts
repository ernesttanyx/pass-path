import type { Mastery, KpStep } from '@/types';

const DECAY = 0;    // score gauge only goes up — wrong answers affect spaced-rep schedule, not score display
const GROWTH = 0.35; // first correct gives meaningful visible tick on the gauge

export function updateMastery(
  current: Mastery | null,
  kpStepId: string,
  userId: string,
  isCorrect: boolean,
  timeTakenMs: number
): Omit<Mastery, 'id' | 'created_at'> {
  const now = new Date();
  const prevScore = current?.score_0_to_1 ?? 0;

  // Speed bonus: full credit under 20s, halved over 60s
  const speedBonus = timeTakenMs < 20_000 ? 1.0 : timeTakenMs < 60_000 ? 0.7 : 0.4;

  const newScore = isCorrect
    ? Math.min(1, prevScore + (1 - prevScore) * GROWTH * speedBonus)
    : prevScore; // wrong answers don't drop the score — only reset the spaced-rep schedule

  // SM-2 interval: score drives how far out next review is
  // score < 0.3 → 1 day, 0.3–0.6 → 3 days, 0.6–0.8 → 7 days, > 0.8 → 14 days
  let intervalDays: number;
  if (newScore < 0.3) intervalDays = 1;
  else if (newScore < 0.6) intervalDays = 3;
  else if (newScore < 0.8) intervalDays = 7;
  else intervalDays = 14;

  // Wrong answers always resurface tomorrow
  if (!isCorrect) intervalDays = 1;

  const nextDue = new Date(now.getTime() + intervalDays * 86_400_000);

  return {
    user_id: userId,
    kp_step_id: kpStepId,
    score_0_to_1: parseFloat(newScore.toFixed(4)),
    last_seen_at: now.toISOString(),
    next_due_at: nextDue.toISOString(),
  };
}

// Returns integer K-marks (0–25). A step counts once mastery > 0.3 (first correct).
export function computePredictedScore(
  masteryRows: Pick<Mastery, 'kp_step_id' | 'score_0_to_1'>[],
  steps: KpStep[]
): number {
  const earned = steps.reduce((sum, s) => {
    const m = masteryRows.find(r => r.kp_step_id === s.id);
    return sum + (m && m.score_0_to_1 > 0.3 ? s.mark_value : 0);
  }, 0);
  return Math.min(25, earned);
}
