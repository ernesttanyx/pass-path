import { supabase } from './supabase';

const DAILY_CAP = 5;

export interface CostGuardResult {
  allowed: boolean;
  remaining: number;
}

export async function checkAndIncrementTokenUsage(userId: string): Promise<CostGuardResult> {
  const { data, error } = await supabase
    .from('users')
    .select('daily_token_usage, last_token_reset')
    .eq('id', userId)
    .maybeSingle();

  if (error || !data) return { allowed: false, remaining: 0 };

  const today = new Date().toISOString().slice(0, 10);
  const lastReset = data.last_token_reset?.slice(0, 10);
  const usage = lastReset === today ? (data.daily_token_usage ?? 0) : 0;

  if (usage >= DAILY_CAP) return { allowed: false, remaining: 0 };

  // Increment usage (reset if new day)
  await supabase.from('users').update({
    daily_token_usage: usage + 1,
    last_token_reset: lastReset === today ? undefined : today,
  }).eq('id', userId);

  return { allowed: true, remaining: DAILY_CAP - usage - 1 };
}
