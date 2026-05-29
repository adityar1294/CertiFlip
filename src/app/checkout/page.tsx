'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Shell from '@/components/Shell';
import { MinimalNav } from '@/components/TopNav';
import { PreAuthToolbar } from '@/components/Toolbar';

type PaymentMethod = 'upi' | 'card' | 'netbanking' | 'wallet';

const PLAN = { name: 'CertiFlip Pro', price: 499, gstRate: 0.18 };

export default function CheckoutPage() {
  const [method, setMethod] = useState<PaymentMethod>('upi');
  const [upiId, setUpiId] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [gst, setGst] = useState('');
  const [coupon, setCoupon] = useState('');

  const subtotal = PLAN.price;
  const gstAmt = Math.round(subtotal * PLAN.gstRate);
  const total = subtotal + gstAmt;

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

  const methodOptions: { id: PaymentMethod; label: string; icon: string }[] = [
    { id: 'upi', label: 'UPI', icon: '📱' },
    { id: 'card', label: 'Card', icon: '💳' },
    { id: 'netbanking', label: 'Net banking', icon: '🏦' },
    { id: 'wallet', label: 'Wallet', icon: '👜' },
  ];

  return (
    <Shell nav={<MinimalNav />} toolbar={<PreAuthToolbar />}>
      {/* Step progress */}
      <div className="border-b" style={{ borderColor: 'var(--screen-border)' }}>
        <div className="max-w-4xl mx-auto px-6 py-3 flex items-center gap-2 text-xs" style={{ color: 'var(--text-muted)' }}>
          <span className="flex items-center gap-1"><span className="w-4 h-4 rounded-full flex items-center justify-center text-xs" style={{ background: 'var(--success)', color: '#071510' }}>✓</span> Cart</span>
          <span style={{ color: 'var(--card-border)' }}>→</span>
          <span className="flex items-center gap-1 font-semibold" style={{ color: 'var(--text-primary)' }}><span className="w-4 h-4 rounded-full flex items-center justify-center text-xs" style={{ background: 'var(--accent-teal)', color: '#071510' }}>2</span> Payment</span>
          <span style={{ color: 'var(--card-border)' }}>→</span>
          <span className="flex items-center gap-1"><span className="w-4 h-4 rounded-full border text-center" style={{ borderColor: 'var(--card-border)', color: 'var(--text-muted)', lineHeight: '14px' }}>3</span> Confirm</span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-10 pb-24">
        <h1 className="font-display text-26 mb-8" style={{ color: 'var(--text-primary)', fontFamily: 'Syne, sans-serif' }}>Complete your order</h1>

        <div className="grid grid-cols-1 md:grid-cols-[1fr_340px] gap-8">
          {/* Left — form */}
          <div className="space-y-6">
            {/* Payment method selector */}
            <div className="grid grid-cols-2 gap-3">
              {methodOptions.map(m => (
                <button
                  key={m.id}
                  onClick={() => setMethod(m.id)}
                  className="flex items-center gap-3 p-4 rounded-xl text-sm font-medium transition-all"
                  style={{
                    background: method === m.id ? 'var(--accent-teal-bg)' : 'var(--card-bg)',
                    border: `1px solid ${method === m.id ? 'var(--accent-teal)' : 'var(--card-border)'}`,
                    color: method === m.id ? 'var(--accent-teal)' : 'var(--text-secondary)',
                  }}
                >
                  <span>{m.icon}</span> {m.label}
                </button>
              ))}
            </div>

            {/* UPI */}
            {method === 'upi' && (
              <div className="space-y-3">
                <label className="label block" style={{ color: 'var(--text-muted)' }}>UPI ID</label>
                <div className="flex gap-2">
                  <input value={upiId} onChange={e => setUpiId(e.target.value)} placeholder="yourname@upi" style={{ ...inputStyle, flex: 1 }} />
                  <button className="px-4 py-2.5 rounded-xl text-sm font-medium" style={{ background: 'var(--card-raised)', color: 'var(--text-secondary)', border: '1px solid var(--card-border)' }}>
                    Verify
                  </button>
                </div>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Enter your UPI ID and click Verify to confirm before payment.</p>
              </div>
            )}

            {/* Card */}
            {method === 'card' && (
              <div className="space-y-3">
                <div>
                  <label className="label block mb-1.5" style={{ color: 'var(--text-muted)' }}>Name on card</label>
                  <input value={cardName} onChange={e => setCardName(e.target.value)} placeholder="Rahul Sharma" style={inputStyle} />
                </div>
                <div>
                  <label className="label block mb-1.5" style={{ color: 'var(--text-muted)' }}>Card number</label>
                  <input value={cardNumber} onChange={e => setCardNumber(e.target.value)} placeholder="1234 5678 9012 3456" maxLength={19} style={inputStyle} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="label block mb-1.5" style={{ color: 'var(--text-muted)' }}>Expiry</label>
                    <input value={expiry} onChange={e => setExpiry(e.target.value)} placeholder="MM / YY" maxLength={7} style={inputStyle} />
                  </div>
                  <div>
                    <label className="label block mb-1.5" style={{ color: 'var(--text-muted)' }}>CVV</label>
                    <input value={cvv} onChange={e => setCvv(e.target.value)} placeholder="•••" maxLength={4} type="password" style={inputStyle} />
                  </div>
                </div>
              </div>
            )}

            {(method === 'netbanking' || method === 'wallet') && (
              <div className="py-8 text-center text-sm" style={{ color: 'var(--text-muted)' }}>
                You&apos;ll be redirected to complete {method === 'netbanking' ? 'net banking' : 'wallet'} payment via Razorpay.
              </div>
            )}

            {/* GST */}
            <div>
              <label className="label block mb-1.5" style={{ color: 'var(--text-muted)' }}>GST number (optional)</label>
              <input value={gst} onChange={e => setGst(e.target.value)} placeholder="22AAAAA0000A1Z5" style={inputStyle} />
            </div>

            <button
              className="w-full py-3 rounded-xl text-sm font-semibold transition-all hover:opacity-90 flex items-center justify-center gap-2"
              style={{ background: 'var(--accent-teal)', color: '#071510' }}
            >
              🔒 Pay ₹{total} securely
            </button>
            <p className="text-center text-xs" style={{ color: 'var(--text-muted)' }}>
              Payments secured by Razorpay · 256-bit SSL
            </p>
          </div>

          {/* Right — summary */}
          <div className="space-y-4">
            {/* Order item */}
            <div className="p-4 rounded-2xl" style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)' }}>
              <h3 className="font-display text-15 mb-3" style={{ color: 'var(--text-secondary)', fontFamily: 'Syne, sans-serif' }}>Order summary</h3>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{PLAN.name}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>Unlimited · Mock exams · Analytics</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>₹{PLAN.price}</p>
                  <button className="text-xs" style={{ color: 'var(--accent-coral)' }}>Remove</button>
                </div>
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
                { label: 'Subtotal', value: `₹${subtotal}` },
                { label: 'GST (18%)', value: `₹${gstAmt}` },
                { label: 'Discount', value: '—' },
              ].map(row => (
                <div key={row.label} className="flex justify-between text-sm">
                  <span style={{ color: 'var(--text-muted)' }}>{row.label}</span>
                  <span style={{ color: 'var(--text-secondary)' }}>{row.value}</span>
                </div>
              ))}
              <div className="border-t pt-2 flex justify-between text-sm font-semibold" style={{ borderColor: 'var(--card-border)' }}>
                <span style={{ color: 'var(--text-primary)' }}>Total due today</span>
                <span style={{ color: 'var(--accent-teal)' }}>₹{total}</span>
              </div>
            </div>

            {/* Trust badges */}
            <div className="flex gap-4 flex-wrap">
              {['7-day refund', '🔒 SSL secure', 'GST invoice'].map(b => (
                <span key={b} className="text-xs flex items-center gap-1" style={{ color: 'var(--text-muted)' }}>
                  ✓ {b}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Shell>
  );
}
