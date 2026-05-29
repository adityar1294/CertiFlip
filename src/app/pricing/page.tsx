'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Shell from '@/components/Shell';
import { PublicNav } from '@/components/TopNav';
import { PreAuthToolbar } from '@/components/Toolbar';

const FREE_FEATURES = [
  '3 full practice tests (any module)',
  'Full step-by-step solutions',
  'Leitner spaced repetition engine',
  'Progress analytics (session history)',
];
const FREE_MISSING = ['Mock exam mode', 'Leaderboard', 'Topic breakdown analytics'];

const PRO_FEATURES = [
  'Everything in Free, fully unlocked',
  'Unlimited practice sessions',
  'Full progress analytics (all topics)',
  'Mock exam mode',
  'Daily pop quizzes',
  'Leaderboard access',
  'Priority support',
];

const CERTIPACK_FEATURES = [
  '10 exam slots — distribute however you like',
  'All Pro features per slot',
  'GST invoice + purchase order support',
  'Priority support',
];

const FAQS = [
  { q: 'Can I switch plans anytime?', a: 'Yes. Upgrade or downgrade anytime from your settings. Downgrades take effect at the next billing cycle.' },
  { q: 'Is there a refund policy?', a: '7-day money-back guarantee on all paid plans. No questions asked.' },
  { q: 'What payment methods do you accept?', a: 'UPI, credit/debit cards, net banking, and wallets via Razorpay.' },
  { q: 'Will I receive a GST invoice?', a: 'Yes. GST invoices are auto-generated for every transaction and emailed to you.' },
];

export default function PricingPage() {
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('monthly');

  const proPrice = billing === 'monthly' ? 499 : Math.round(499 * 12 * 0.67 / 12);
  const certipackPrice = billing === 'monthly' ? 3999 : Math.round(3999 * 12 * 0.67 / 12);

  return (
    <Shell nav={<PublicNav activePage="Pricing" />} toolbar={<PreAuthToolbar />}>
      <div className="px-6 pb-24 space-y-16">

        {/* Hero */}
        <section className="max-w-2xl mx-auto pt-16 text-center">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-5" style={{ background: 'var(--accent-teal-bg)', color: 'var(--accent-teal)', border: '1px solid var(--accent-teal-border)' }}>
            Simple pricing
          </span>
          <h1 className="font-display mb-3" style={{ fontSize: '40px', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'Syne, sans-serif' }}>
            Start free. Go Pro when you need it.
          </h1>
          <p className="text-sm mb-8" style={{ color: 'var(--text-secondary)' }}>
            No hidden fees. Cancel anytime.
          </p>

          {/* Monthly / yearly toggle */}
          <div className="inline-flex items-center gap-3">
            <span className="text-sm" style={{ color: billing === 'monthly' ? 'var(--text-primary)' : 'var(--text-muted)' }}>Monthly</span>
            <button
              onClick={() => setBilling(p => p === 'monthly' ? 'yearly' : 'monthly')}
              className="relative w-12 h-6 rounded-full transition-all"
              style={{ background: billing === 'yearly' ? 'var(--accent-teal)' : 'var(--card-border)' }}
            >
              <span className="absolute top-1 w-4 h-4 rounded-full transition-all" style={{ background: 'white', left: billing === 'yearly' ? '26px' : '4px' }} />
            </button>
            <span className="text-sm" style={{ color: billing === 'yearly' ? 'var(--text-primary)' : 'var(--text-muted)' }}>Yearly</span>
            {billing === 'yearly' && (
              <span className="label px-2 py-0.5 rounded-full" style={{ color: 'var(--accent-teal)', background: 'var(--accent-teal-bg)', border: '1px solid var(--accent-teal-border)' }}>
                Save 33%
              </span>
            )}
          </div>
        </section>

        {/* Plans grid */}
        <section className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">

            {/* Free */}
            <div className="p-6 rounded-2xl" style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)' }}>
              <p className="font-display text-20 mb-1" style={{ color: 'var(--text-primary)', fontFamily: 'Syne, sans-serif' }}>Free</p>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="font-display" style={{ fontSize: '32px', color: 'var(--text-primary)', fontFamily: 'Syne, sans-serif' }}>₹0</span>
                <span className="text-sm" style={{ color: 'var(--text-muted)' }}>forever</span>
              </div>

              <Link href="/signup" className="block w-full py-2.5 rounded-xl text-sm font-semibold text-center mb-6 transition-all hover:opacity-80" style={{ background: 'var(--card-raised)', color: 'var(--text-primary)', border: '1px solid var(--card-border)' }}>
                Get started free
              </Link>

              <div className="space-y-2.5">
                {FREE_FEATURES.map(f => (
                  <div key={f} className="flex items-start gap-2 text-sm">
                    <span style={{ color: 'var(--accent-teal)' }}>✓</span>
                    <span style={{ color: 'var(--text-secondary)' }}>{f}</span>
                  </div>
                ))}
                {FREE_MISSING.map(f => (
                  <div key={f} className="flex items-start gap-2 text-sm">
                    <span style={{ color: 'var(--text-muted)' }}>✗</span>
                    <span style={{ color: 'var(--text-muted)' }}>{f}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Pro — featured */}
            <div className="p-6 rounded-2xl relative" style={{ background: 'var(--accent-teal-deep)', border: '2px solid var(--accent-teal-border)' }}>
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="label px-3 py-1 rounded-full" style={{ background: 'var(--accent-teal)', color: '#071510' }}>
                  Most popular
                </span>
              </div>

              <p className="font-display text-20 mb-1 mt-2" style={{ color: 'var(--accent-teal)', fontFamily: 'Syne, sans-serif' }}>Pro</p>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="font-display" style={{ fontSize: '32px', color: 'var(--text-primary)', fontFamily: 'Syne, sans-serif' }}>₹{proPrice}</span>
                <span className="text-sm" style={{ color: 'var(--text-muted)' }}>/ month</span>
              </div>

              <Link href="/checkout" className="block w-full py-2.5 rounded-xl text-sm font-semibold text-center mb-6 transition-all hover:opacity-90" style={{ background: 'var(--accent-teal)', color: '#071510' }}>
                Get Pro now →
              </Link>

              <div className="space-y-2.5">
                {PRO_FEATURES.map(f => (
                  <div key={f} className="flex items-start gap-2 text-sm">
                    <span style={{ color: 'var(--accent-teal)' }}>✓</span>
                    <span style={{ color: 'var(--text-secondary)' }}>{f}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CertiPack */}
            <div className="p-6 rounded-2xl" style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)' }}>
              <p className="font-display text-20 mb-1" style={{ color: 'var(--text-primary)', fontFamily: 'Syne, sans-serif' }}>CertiPack</p>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="font-display" style={{ fontSize: '32px', color: 'var(--text-primary)', fontFamily: 'Syne, sans-serif' }}>₹{certipackPrice}</span>
                <span className="text-sm" style={{ color: 'var(--text-muted)' }}>/ month</span>
              </div>

              <a href="mailto:hello@certiflip.com" className="block w-full py-2.5 rounded-xl text-sm font-semibold text-center mb-6 transition-all hover:opacity-80" style={{ color: 'var(--text-primary)', border: '1px solid var(--card-border)', background: 'var(--card-raised)' }}>
                Contact sales →
              </a>

              <div className="space-y-2.5">
                {CERTIPACK_FEATURES.map(f => (
                  <div key={f} className="flex items-start gap-2 text-sm">
                    <span style={{ color: 'var(--accent-teal)' }}>✓</span>
                    <span style={{ color: 'var(--text-secondary)' }}>{f}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs mt-4" style={{ color: 'var(--text-muted)' }}>
                Team dashboard coming soon. Slot distribution handled manually in v1.
              </p>
            </div>

          </div>
        </section>

        {/* Bottom 2col */}
        <section className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Included with every plan */}
          <div className="p-6 rounded-2xl" style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)' }}>
            <h3 className="font-display text-18 mb-4" style={{ color: 'var(--text-primary)', fontFamily: 'Syne, sans-serif' }}>Included with every plan</h3>
            <div className="space-y-2.5">
              {[
                'SEBI-compliant question bank',
                'Mobile-friendly design',
                'Secure payments via Razorpay',
                'Email support within 24 hours',
              ].map(f => (
                <div key={f} className="flex items-center gap-2 text-sm">
                  <span style={{ color: 'var(--accent-teal)' }}>✓</span>
                  <span style={{ color: 'var(--text-secondary)' }}>{f}</span>
                </div>
              ))}
            </div>
          </div>

          {/* FAQs */}
          <div className="p-6 rounded-2xl" style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)' }}>
            <h3 className="font-display text-18 mb-4" style={{ color: 'var(--text-primary)', fontFamily: 'Syne, sans-serif' }}>Common questions</h3>
            <div className="space-y-4">
              {FAQS.map(faq => (
                <div key={faq.q}>
                  <p className="text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>{faq.q}</p>
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

      </div>
    </Shell>
  );
}
