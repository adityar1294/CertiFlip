export const FEATURES = {
  MOCK_EXAM: 'pro',
  LEADERBOARD: 'pro',
  UNLIMITED_PRACTICE: 'pro',
  FULL_ANALYTICS: 'pro',
  FREE_TEST_LIMIT: 3,
  PRO_PRICE_MONTHLY: 499,
  CERTIPACK_PRICE_MONTHLY: 3999,
  CERTIPACK_SLOT_COUNT: 10,
} as const;

export type Plan = 'free' | 'pro' | 'certipack';

export function hasFeature(userPlan: Plan, requiredPlan: string): boolean {
  if (requiredPlan === 'free') return true;
  if (requiredPlan === 'pro') return userPlan === 'pro' || userPlan === 'certipack';
  if (requiredPlan === 'certipack') return userPlan === 'certipack';
  return false;
}
