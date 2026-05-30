export const PAYMENT_CONFIG_KEY = 'certiflip_payment_config';
export const DEMO_PURCHASES_KEY = 'certiflip_demo_purchases';

export type PaymentMode = 'demo' | 'live';

export interface PaymentConfig {
  mode: PaymentMode;
  keyId: string;
  keySecret: string;
}

const DEFAULT_CONFIG: PaymentConfig = {
  mode: 'demo',
  keyId: '',
  keySecret: '',
};

export function getPaymentConfig(): PaymentConfig {
  if (typeof window === 'undefined') return DEFAULT_CONFIG;
  try {
    const raw = localStorage.getItem(PAYMENT_CONFIG_KEY);
    if (raw) return { ...DEFAULT_CONFIG, ...JSON.parse(raw) };
  } catch { /* ignore */ }
  return DEFAULT_CONFIG;
}

export function savePaymentConfig(config: PaymentConfig): void {
  localStorage.setItem(PAYMENT_CONFIG_KEY, JSON.stringify(config));
}

export function getDemoPurchases(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(DEMO_PURCHASES_KEY);
    if (raw) return JSON.parse(raw) as string[];
  } catch { /* ignore */ }
  return [];
}

export function addDemoPurchase(examCode: string): void {
  const list = getDemoPurchases();
  if (!list.includes(examCode)) {
    list.push(examCode);
    localStorage.setItem(DEMO_PURCHASES_KEY, JSON.stringify(list));
  }
}

export function clearDemoPurchases(): void {
  localStorage.removeItem(DEMO_PURCHASES_KEY);
}
