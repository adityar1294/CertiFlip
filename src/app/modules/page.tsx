'use client';

import React from 'react';
import Link from 'next/link';
import Shell from '@/components/Shell';
import { PublicNav } from '@/components/TopNav';
import { AppNav } from '@/components/TopNav';
import { AppToolbar } from '@/components/Toolbar';
import { useExams } from '@/hooks/useExams';
import { useUser } from '@/contexts/authContext';

/* Hardcoded prices (INR) until a price column exists in Supabase */
const MODULE_PRICES: Record<string, number> = {
  'NISM-VIII': 999,
  'NISM-V-A':  799,
  'NISM-X-A':  899,
};
const DEFAULT_PRICE = 999;

const accentForIndex = (i: number) => {
  const accents = ['teal', 'amber', 'purple', 'gray'] as const;
  return accents[i % accents.length];
};
const accentColors: Record<string, { color: string; bg: string; border: string }> = {
  teal:   { color: 'var(--accent-teal)',   bg: 'var(--accent-teal-bg)',   border: 'var(--accent-teal-border)' },
  amber:  { color: 'var(--accent-amber)',  bg: 'var(--accent-amber-bg)',  border: 'var(--accent-amber-border)' },
  purple: { color: 'var(--accent-purple)', bg: 'var(--accent-purple-bg)', border: 'var(--accent-purple-border)' },
  gray:   { color: 'var(--text-muted)',    bg: 'rgba(255,255,255,0.03)',  border: 'var(--card-border)' },
};

function LockIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0110 0v4" />
    </svg>
  );
}

function ModulesContent() {
  const { data: exams, loading, error } = useExams();
  const { user } = useUser();

  /* placeholder — replace with real purchase query when payments land */
  const purchasedCodes = new Set<string>();

  const nav = user
    ? <AppNav activePage="Modules" />
    : <PublicNav activePage="Modules" />;

  const toolbar = user
    ? <AppToolbar activePage="Modules" />
    : undefined;

  return (
    <Shell nav={nav} toolbar={toolbar}>
      <div className="max-w-5xl mx-auto px-6 py-12 pb-24 space-y-10">

        <div>
          <h1
            className="font-display mb-2"
            style={{ fontSize: '36px', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'Syne, sans-serif' }}
          >
            Certification modules
          </h1>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Each module unlocks practice exams, Leitner flashcards, and step-by-step solutions for that certification.
            {!user && (
              <> <Link href="/signup" style={{ color: 'var(--accent-teal)' }}>Create a free account</Link> to track your progress.</>
            )}
          </p>
        </div>

        {loading && (
          <div className="flex items-center gap-3 py-16" style={{ color: 'var(--text-muted)' }}>
            <div
              className="w-5 h-5 rounded-full border-2 border-t-transparent"
              style={{ borderColor: 'var(--accent-teal)', animation: 'spin 0.8s linear infinite' }}
            />
            <span className="text-sm">Loading modules…</span>
          </div>
        )}

        {error && (
          <div className="px-4 py-3 rounded-xl text-sm text-red-400 bg-red-950/30 border border-red-500/20">
            {error}
          </div>
        )}

        {!loading && !error && exams && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {exams.map((exam, i) => {
              const accentKey = accentForIndex(i);
              const a = accentColors[accentKey];
              const price = MODULE_PRICES[exam.code] ?? DEFAULT_PRICE;
              const owned = purchasedCodes.has(exam.code);

              return (
                <div
                  key={exam.id}
                  className="group flex flex-col p-6 rounded-2xl transition-all duration-300 hover:-translate-y-0.5"
                  style={{ background: 'var(--card-bg)', border: `1px solid ${a.border}` }}
                >
                  {/* Code badge + lock/owned */}
                  <div className="flex items-center justify-between mb-4">
                    <span
                      className="label inline-block px-2 py-0.5 rounded"
                      style={{ color: a.color, background: a.bg, border: `1px solid ${a.border}` }}
                    >
                      {exam.code}
                    </span>
                    {user && (
                      owned ? (
                        <span className="flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full" style={{ color: 'var(--accent-teal)', background: 'var(--accent-teal-bg)', border: '1px solid var(--accent-teal-border)' }}>
                          ✓ Purchased
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--text-muted)' }}>
                          <LockIcon /> Locked
                        </span>
                      )
                    )}
                  </div>

                  <h2
                    className="font-display text-20 mb-2"
                    style={{ color: 'var(--text-primary)', fontFamily: 'Syne, sans-serif' }}
                  >
                    {exam.title}
                  </h2>

                  <p className="text-sm leading-relaxed mb-6 flex-1" style={{ color: 'var(--text-muted)' }}>
                    {exam.description || 'Practice questions designed for the certification syllabus.'}
                  </p>

                  {/* What's included */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {['Practice exams', 'Flashcards', 'Solutions'].map(tag => (
                      <span
                        key={tag}
                        className="text-xs px-2 py-0.5 rounded-md"
                        style={{ background: 'var(--card-raised)', color: 'var(--text-secondary)', border: '1px solid var(--card-border)' }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Price + CTA */}
                  <div className="flex items-center justify-between gap-4 pt-4" style={{ borderTop: '1px solid var(--card-border)' }}>
                    <div>
                      <span className="text-22 font-bold" style={{ color: 'var(--text-primary)' }}>
                        ₹{price.toLocaleString('en-IN')}
                      </span>
                      <span className="text-xs ml-1" style={{ color: 'var(--text-muted)' }}>one-time</span>
                    </div>

                    {owned ? (
                      <Link
                        href={`/exam/${exam.code}`}
                        className="px-5 py-2 rounded-xl text-sm font-semibold transition-all hover:opacity-90"
                        style={{ background: a.color, color: '#071510' }}
                      >
                        Start studying →
                      </Link>
                    ) : user ? (
                      <Link
                        href={`/checkout?module=${exam.code}`}
                        className="px-5 py-2 rounded-xl text-sm font-semibold transition-all hover:opacity-90"
                        style={{ background: a.color, color: '#071510' }}
                      >
                        Purchase →
                      </Link>
                    ) : (
                      <Link
                        href={`/signup?next=/modules`}
                        className="px-5 py-2 rounded-xl text-sm font-semibold transition-all hover:opacity-90"
                        style={{ background: a.color, color: '#071510' }}
                      >
                        Get started →
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* FAQ nudge */}
        <div
          className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-5 rounded-2xl"
          style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)' }}
        >
          <div>
            <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>More modules coming soon</p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>NISM Series I, II, X-B and more are on the roadmap.</p>
          </div>
          <Link
            href="/signup"
            className="shrink-0 px-5 py-2 rounded-xl text-sm font-semibold transition-all hover:opacity-90"
            style={{ background: 'var(--accent-teal)', color: '#071510' }}
          >
            Get notified →
          </Link>
        </div>
      </div>
    </Shell>
  );
}

export default function ModulesPage() {
  return <ModulesContent />;
}
