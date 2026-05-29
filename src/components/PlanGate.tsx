'use client';

import React from 'react';
import Link from 'next/link';

interface PlanGateProps {
  feature?: string;
  children?: React.ReactNode;
}

export default function PlanGate({ feature = 'this feature', children }: PlanGateProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-6">
      <div
        className="max-w-sm w-full text-center p-8 rounded-2xl"
        style={{ background: 'var(--card-bg)', border: '1px solid var(--accent-teal-border)' }}
      >
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center text-xl mx-auto mb-4"
          style={{ background: 'var(--accent-teal-bg)', border: '1px solid var(--accent-teal-border)' }}
        >
          🔒
        </div>
        <h3
          className="text-18 font-display mb-2"
          style={{ color: 'var(--text-primary)', fontFamily: 'Syne, sans-serif' }}
        >
          Pro feature
        </h3>
        <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>
          {feature} is available on the Pro plan. Upgrade to unlock unlimited practice, mock exams, and more.
        </p>
        <Link
          href="/pricing"
          className="inline-block w-full py-2.5 rounded-xl text-sm font-semibold text-center transition-all hover:opacity-90"
          style={{ background: 'var(--accent-teal)', color: '#071510' }}
        >
          Upgrade to Pro →
        </Link>
        {children}
      </div>
    </div>
  );
}
