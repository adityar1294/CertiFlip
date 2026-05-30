'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import Shell from '@/components/Shell';
import { AppNav } from '@/components/TopNav';
import { AppToolbar } from '@/components/Toolbar';

type PaymentMethod = 'card' | 'upi' | 'netbanking';

/* Test card details (visible to user) */
const TEST_CARD = {
  name: 'Test User',
  number: '4111 1111 1111 1111',
  expiry: '12/28',
  cvv: '123',
};

const MODULE_PRICES: Record<string, { title: string; price: number }> = {
  'NISM-VIII': { title: 'Equity Derivatives', price: 999 },
  'NISM-V-A':  { title: 'Mutual Fund Distributors', price: 799 },
  'NISM-X-A':  { title: 'Investment Adviser (Level 1)', price: 899 },
};
const DEFAULT_MODULE = { title: 'CertiFlip Module', price: 999 };

const inputStyle: React.CSSProperties = {
  width: '100%',
  background: 'var(--card-bg)',
  border: '1px solid var(--card-border)',
  borderRadius: 'var(--radius-md)',
  color: 'var(--text-primary)',
  padding: '10px 12px',
  fontSize: '14px',
  fontFamily: 'inherit',
  outline: 'none',
};

/* ── Format card number with spaces ───────────────────────────────────── */
function formatCardNumber(v: string) {
  return v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
}
function formatExpiry(v: string) {
  const digits = v.replace(/\D/g, '').slice(0, 4);
  if (digits.length >= 3) return digits.slice(0, 2) + ' / ' + digits.slice(2);
  return digits;
}

/* ── Success screen ───────────────────────────────────────────────────── */
function SuccessScreen({ moduleTitle, orderId }: { moduleTitle: string; orderId: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-6 text-center animate-fade-in">
      <div className="w-16 h-16 rounded-full flex items-center justify-center text-3xl mb-6"
        style={{ background: 'var(--accent-teal-bg)', border: '2px solid var(--accent-teal)' }}>
        ✓
      </div>
      <h2 className="font-display text-30 mb-2" style={{ color: 'var(--text-primary)', fontFamily: 'Syne, sans-serif' }}>
        Payment successful!
      </h2>
      <p className="text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>
        <strong style={{ color: 'var(--text-primary)' }}>{moduleTitle}</strong> is now unlocked.
      </p>
      <p className="text-xs mb-8" style={{ color: 'var(--text-muted)' }}>
        Order ID: {orderId} · A confirmation email has been sent.
      </p>

      <div
        className="w-full max-w-sm p-5 rounded-2xl mb-8 text-left space-y-2"
        style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)' }}
      >
        <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>What you get</p>
        {['Unlimited practice exams', 'Leitner flashcard deck', 'Step-by-step solutions', 'Progress analytics'].map(item => (
          <div key={item} className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
            <span style={{ color: 'var(--accent-teal)' }}>✓</span> {item}
          </div>
        ))}
      </div>

      <div className="flex gap-3">
        <Link href="/dashboard" className="px-6 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90" style={{ background: 'var(--accent-teal)', color: '#071510' }}>
          Go to dashboard →
        </Link>
        <Link href="/modules" className="px-6 py-2.5 rounded-xl text-sm font-medium transition-all" style={{ background: 'var(--card-raised)', color: 'var(--text-secondary)', border: '1px solid var(--card-border)' }}>
          Browse more modules
        </Link>
      </div>
    </div>
  );
}

/* ── Main checkout (needs searchParams) ───────────────────────────────── */
function CheckoutContent() {
  const searchParams = useSearchParams();
  const moduleCode = searchParams.get('module') ?? '';
  const moduleInfo = MODULE_PRICES[moduleCode] ?? DEFAULT_MODULE;

  const subtotal = moduleInfo.price;
  const gstAmt = Math.round(subtotal * 0.18);
  const total = subtotal + gstAmt;

  const [method, setMethod] = useState<PaymentMethod>('card');
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [upiId, setUpiId] = useState('');
  const [gst, setGst] = useState('');
  const [coupon, setCoupon] = useState('');
  const [paying, setPaying] = useState(false);
  const [success, setSuccess] = useState(false);
  const [orderId] = useState(() => 'CF-' + Math.random().toString(36).slice(2, 10).toUpperCase());

  function fillTestCard() {
    setCardName(TEST_CARD.name);
    setCardNumber(TEST_CARD.number);
    setExpiry(TEST_CARD.expiry);
    setCvv(TEST_CARD.cvv);
  }

  async function handlePay() {
    setPaying(true);
    // Simulate payment processing delay
    await new Promise(r => setTimeout(r, 2000));
    setPaying(false);
    setSuccess(true);
  }

  const canPay = method === 'card'
    ? cardNumber.replace(/\s/g, '').length === 16 && expiry.length >= 4 && cvv.length >= 3
    : method === 'upi'
    ? upiId.includes('@')
    : true;

  if (success) {
    return (
      <Shell nav={<AppNav />} toolbar={<AppToolbar />}>
        <SuccessScreen moduleTitle={moduleInfo.title} orderId={orderId} />
      </Shell>
    );
  }

  return (
    <Shell nav={<AppNav />} toolbar={<AppToolbar />}>
      {/* Step progress */}
      <div className="border-b" style={{ borderColor: 'var(--screen-border)' }}>
        <div className="max-w-4xl mx-auto px-6 py-3 flex items-center gap-2 text-xs" style={{ color: 'var(--text-muted)' }}>
          {[
            { n: '✓', label: 'Cart', done: true },
            { n: '2', label: 'Payment', active: true },
            { n: '3', label: 'Confirm', done: false },
          ].map((step, i) => (
            <React.Fragment key={step.label}>
              {i > 0 && <span style={{ color: 'var(--card-border)' }}>→</span>}
              <span className="flex items-center gap-1" style={{ color: step.active ? 'var(--text-primary)' : 'var(--text-muted)', fontWeight: step.active ? 600 : 400 }}>
                <span className="w-4 h-4 rounded-full flex items-center justify-center text-xs"
                  style={{ background: step.done ? 'var(--success, #4ade80)' : step.active ? 'var(--accent-teal)' : 'transparent', color: (step.done || step.active) ? '#071510' : 'var(--text-muted)', border: step.done || step.active ? 'none' : '1px solid var(--card-border)' }}>
                  {step.n}
                </span>
                {step.label}
              </span>
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-10 pb-28">
        <h1 className="font-display text-26 mb-8" style={{ color: 'var(--text-primary)', fontFamily: 'Syne, sans-serif' }}>
          Complete your order
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-[1fr_320px] gap-8">
          {/* Left — payment form */}
          <div className="space-y-5">

            {/* Demo banner */}
            <div className="flex items-start gap-3 px-4 py-3 rounded-xl text-sm"
              style={{ background: 'var(--accent-amber-bg)', border: '1px solid var(--accent-amber-border)' }}>
              <span>⚠️</span>
              <div style={{ color: 'var(--accent-amber)' }}>
                <strong>Demo mode</strong> — no real payment will be taken.
                <button onClick={fillTestCard} className="ml-2 underline font-medium" style={{ color: 'var(--accent-teal)' }}>
                  Fill test card
                </button>
                <span className="block text-xs mt-0.5 opacity-70">
                  Test card: {TEST_CARD.number} · {TEST_CARD.expiry} · CVV {TEST_CARD.cvv}
                </span>
              </div>
            </div>

            {/* Method selector */}
            <div className="grid grid-cols-3 gap-3">
              {([
                { id: 'card' as PaymentMethod, label: 'Card', icon: '💳' },
                { id: 'upi' as PaymentMethod, label: 'UPI', icon: '📱' },
                { id: 'netbanking' as PaymentMethod, label: 'Net banking', icon: '🏦' },
              ]).map(m => (
                <button key={m.id} onClick={() => setMethod(m.id)}
                  className="flex items-center gap-2 p-3 rounded-xl text-sm font-medium transition-all"
                  style={{ background: method === m.id ? 'var(--accent-teal-bg)' : 'var(--card-bg)', border: `1px solid ${method === m.id ? 'var(--accent-teal)' : 'var(--card-border)'}`, color: method === m.id ? 'var(--accent-teal)' : 'var(--text-secondary)' }}>
                  <span>{m.icon}</span>{m.label}
                </button>
              ))}
            </div>

            {/* Card form */}
            {method === 'card' && (
              <div className="space-y-3">
                <div>
                  <label className="label block mb-1.5" style={{ color: 'var(--text-muted)' }}>Name on card</label>
                  <input value={cardName} onChange={e => setCardName(e.target.value)} placeholder="Rahul Sharma" style={inputStyle} />
                </div>
                <div>
                  <label className="label block mb-1.5" style={{ color: 'var(--text-muted)' }}>Card number</label>
                  <input
                    value={cardNumber}
                    onChange={e => setCardNumber(formatCardNumber(e.target.value))}
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                    style={inputStyle}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="label block mb-1.5" style={{ color: 'var(--text-muted)' }}>Expiry</label>
                    <input value={expiry} onChange={e => setExpiry(formatExpiry(e.target.value))} placeholder="MM / YY" maxLength={7} style={inputStyle} />
                  </div>
                  <div>
                    <label className="label block mb-1.5" style={{ color: 'var(--text-muted)' }}>CVV</label>
                    <input value={cvv} onChange={e => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))} placeholder="•••" maxLength={4} type="password" style={inputStyle} />
                  </div>
                </div>
              </div>
            )}

            {/* UPI form */}
            {method === 'upi' && (
              <div className="space-y-3">
                <label className="label block" style={{ color: 'var(--text-muted)' }}>UPI ID</label>
                <div className="flex gap-2">
                  <input value={upiId} onChange={e => setUpiId(e.target.value)} placeholder="yourname@upi" style={{ ...inputStyle, flex: 1 }} />
                  <button className="px-4 py-2.5 rounded-xl text-sm font-medium" style={{ background: 'var(--card-raised)', color: 'var(--text-secondary)', border: '1px solid var(--card-border)' }}>
                    Verify
                  </button>
                </div>
              </div>
            )}

            {method === 'netbanking' && (
              <div className="py-8 text-center text-sm" style={{ color: 'var(--text-muted)' }}>
                You&apos;ll be redirected to complete net banking via Razorpay (coming soon).
              </div>
            )}

            {/* GST */}
            <div>
              <label className="label block mb-1.5" style={{ color: 'var(--text-muted)' }}>GST number (optional)</label>
              <input value={gst} onChange={e => setGst(e.target.value)} placeholder="22AAAAA0000A1Z5" style={inputStyle} />
            </div>

            <button
              onClick={handlePay}
              disabled={!canPay || paying || method === 'netbanking'}
              className="w-full py-3 rounded-xl text-sm font-semibold transition-all hover:opacity-90 disabled:opacity-60 flex items-center justify-center gap-2"
              style={{ background: 'var(--accent-teal)', color: '#071510' }}
            >
              {paying ? (
                <>
                  <span className="w-4 h-4 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: '#071510' }} />
                  Processing…
                </>
              ) : (
                <>🔒 Pay ₹{total.toLocaleString('en-IN')} securely</>
              )}
            </button>
            <p className="text-center text-xs" style={{ color: 'var(--text-muted)' }}>
              Payments secured by Razorpay · 256-bit SSL (demo mode)
            </p>
          </div>

          {/* Right — summary */}
          <div className="space-y-4">
            <div className="p-4 rounded-2xl" style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)' }}>
              <h3 className="font-display text-15 mb-3" style={{ color: 'var(--text-secondary)', fontFamily: 'Syne, sans-serif' }}>Order summary</h3>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{moduleInfo.title}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                    {moduleCode || 'Module'} · Practice exams · Flashcards
                  </p>
                </div>
                <p className="text-sm font-semibold shrink-0 ml-4" style={{ color: 'var(--text-primary)' }}>₹{subtotal.toLocaleString('en-IN')}</p>
              </div>
            </div>

            {/* Coupon */}
            <div className="flex gap-2">
              <input value={coupon} onChange={e => setCoupon(e.target.value)} placeholder="Coupon or referral code" style={{ ...inputStyle, flex: 1 }} />
              <button className="px-3 py-2 rounded-lg text-sm" style={{ background: 'var(--card-raised)', color: 'var(--text-secondary)', border: '1px solid var(--card-border)' }}>Apply</button>
            </div>

            {/* Price breakdown */}
            <div className="p-4 rounded-2xl space-y-2" style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)' }}>
              {[
                { label: 'Subtotal', value: `₹${subtotal.toLocaleString('en-IN')}` },
                { label: 'GST (18%)', value: `₹${gstAmt.toLocaleString('en-IN')}` },
                { label: 'Discount', value: '—' },
              ].map(row => (
                <div key={row.label} className="flex justify-between text-sm">
                  <span style={{ color: 'var(--text-muted)' }}>{row.label}</span>
                  <span style={{ color: 'var(--text-secondary)' }}>{row.value}</span>
                </div>
              ))}
              <div className="border-t pt-2 flex justify-between text-sm font-semibold" style={{ borderColor: 'var(--card-border)' }}>
                <span style={{ color: 'var(--text-primary)' }}>Total due today</span>
                <span style={{ color: 'var(--accent-teal)' }}>₹{total.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="flex gap-4 flex-wrap">
              {['7-day refund', '🔒 SSL secure', 'GST invoice'].map(b => (
                <span key={b} className="text-xs flex items-center gap-1" style={{ color: 'var(--text-muted)' }}>✓ {b}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Shell>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<Shell nav={<AppNav />} toolbar={<AppToolbar />}><div className="flex items-center justify-center min-h-[60vh]"><div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'var(--accent-teal)' }} /></div></Shell>}>
      <CheckoutContent />
    </Suspense>
  );
}
