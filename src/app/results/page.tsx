'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Shell from '@/components/Shell';
import { AppNav } from '@/components/TopNav';
import { AppToolbar } from '@/components/Toolbar';
import StatCard from '@/components/StatCard';
import FlashBorder from '@/components/FlashBorder';

// Placeholder — Free plan user
const USER_PLAN = 'free';

const sessions = [
  { id: '1', type: 'Practice', name: 'NISM-VIII Practice', date: 'Today, 9:41 AM', duration: '32 min', score: 74 },
  { id: '2', type: 'Practice', name: 'NISM-VIII Practice', date: 'Yesterday, 7:12 PM', duration: '28 min', score: 68 },
  { id: '3', type: 'Pop Quiz', name: 'NISM-V-A Pop Quiz', date: 'May 27, 3:00 PM', duration: '4 min', score: 60 },
  { id: '4', type: 'Practice', name: 'NISM-V-A Practice', date: 'May 26, 8:15 AM', duration: '41 min', score: 55 },
];

const weeklyScores = [62, 68, 74, 71, 74, 78, 74];
const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const topicAccuracy = [
  { topic: 'Options Pricing', score: 82, color: 'var(--accent-teal)' },
  { topic: 'Futures Strategies', score: 74, color: 'var(--accent-teal)' },
  { topic: 'Clearing & Settlement', score: 68, color: 'var(--accent-amber)' },
  { topic: 'Regulatory Framework', score: 55, color: 'var(--accent-coral)' },
];

const typeBadge: Record<string, React.CSSProperties> = {
  Practice:  { color: 'var(--accent-teal)',   background: 'var(--accent-teal-bg)',   border: '1px solid var(--accent-teal-border)' },
  'Pop Quiz':{ color: 'var(--accent-amber)',  background: 'var(--accent-amber-bg)',  border: '1px solid var(--accent-amber-border)' },
  Mock:      { color: 'var(--accent-purple)', background: 'var(--accent-purple-bg)', border: '1px solid var(--accent-purple-border)' },
  Flashcards:{ color: '#7F77DD',              background: 'var(--accent-purple-bg)', border: '1px solid var(--accent-purple-border)' },
};

export default function ResultsPage() {
  const [filter, setFilter] = useState<'All time' | 'This week' | 'This month'>('All time');

  return (
    <Shell
      nav={<AppNav activePage="Progress" streak={7} />}
      toolbar={<AppToolbar activePage="Progress" streak={7} />}
    >
      <div className="max-w-5xl mx-auto px-6 py-10 space-y-8 pb-24">

        {/* Header + filter */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <h1 className="font-display text-36" style={{ color: 'var(--text-primary)', fontFamily: 'Syne, sans-serif' }}>
            Your progress
          </h1>
          <div className="flex gap-1 p-1 rounded-lg" style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)' }}>
            {(['All time', 'This week', 'This month'] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className="px-3 py-1.5 rounded-md text-xs font-medium transition-all"
                style={filter === f
                  ? { background: 'var(--card-raised)', color: 'var(--text-primary)', border: '1px solid var(--card-border)' }
                  : { color: 'var(--text-muted)' }}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatCard label="Overall accuracy" value="71%" delta="3% vs last week" accent="var(--accent-teal)" />
          <StatCard label="Sessions" value="12" accent="var(--text-primary)" />
          <StatCard label="Questions answered" value="284" accent="var(--text-primary)" />
          <StatCard label="Total XP" value="2,140" accent="var(--accent-amber)" />
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Weekly accuracy bar chart */}
          <div className="p-5 rounded-2xl" style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)' }}>
            <h3 className="font-display text-15 mb-4" style={{ color: 'var(--text-secondary)', fontFamily: 'Syne, sans-serif' }}>
              Accuracy — last 7 sessions
            </h3>
            <div className="flex items-end gap-2 h-24">
              {weeklyScores.map((score, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className="w-full rounded-sm transition-all"
                    style={{
                      height: `${(score / 100) * 80}px`,
                      background: i === weeklyScores.length - 1 ? 'var(--accent-teal)' : 'var(--card-raised)',
                    }}
                  />
                  <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{days[i]}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Topic accuracy */}
          <div className="p-5 rounded-2xl" style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)' }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-15" style={{ color: 'var(--text-secondary)', fontFamily: 'Syne, sans-serif' }}>
                Topic accuracy
              </h3>
              {USER_PLAN === 'free' && (
                <span className="label px-2 py-0.5 rounded" style={{ color: 'var(--accent-amber)', background: 'var(--accent-amber-bg)', border: '1px solid var(--accent-amber-border)' }}>
                  Pro
                </span>
              )}
            </div>

            <div className={`space-y-3 ${USER_PLAN === 'free' ? 'relative' : ''}`}>
              <div className={USER_PLAN === 'free' ? 'filter blur-sm select-none pointer-events-none' : ''}>
                {topicAccuracy.map(t => (
                  <div key={t.topic} className="flex items-center gap-3">
                    <span className="text-xs w-32 flex-shrink-0" style={{ color: 'var(--text-secondary)' }}>{t.topic}</span>
                    <div className="flex-1 h-1.5 rounded-full" style={{ background: 'var(--card-border)' }}>
                      <div className="h-full rounded-full" style={{ width: `${t.score}%`, background: t.color }} />
                    </div>
                    <span className="text-xs font-medium w-8 text-right" style={{ color: t.color }}>{t.score}%</span>
                  </div>
                ))}
              </div>
              {USER_PLAN === 'free' && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Link href="/pricing" className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold" style={{ background: 'var(--accent-teal)', color: '#071510' }}>
                    🔒 Upgrade to Pro
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Flashcard CTA — animated border */}
        <FlashBorder>
          <div className="p-5 rounded-2xl flex items-center justify-between gap-4" style={{ background: 'var(--card-bg)', border: '1px solid transparent' }}>
            <div>
              <p className="text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>
                Struggling with Regulatory Framework (55%)?
              </p>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                Add these questions to a flashcard deck and let spaced repetition do the work.
              </p>
            </div>
            <Link
              href="/flashcards"
              className="whitespace-nowrap px-4 py-2 rounded-xl text-sm font-semibold transition-all hover:opacity-90"
              style={{ background: 'var(--accent-teal)', color: '#071510' }}
            >
              Create deck →
            </Link>
          </div>
        </FlashBorder>

        {/* Session history */}
        <div>
          <h3 className="font-display text-18 mb-4" style={{ color: 'var(--text-secondary)', fontFamily: 'Syne, sans-serif' }}>
            Session history
          </h3>
          <div className="space-y-2">
            {sessions.map(s => (
              <div
                key={s.id}
                className="flex items-center gap-4 px-4 py-3 rounded-xl"
                style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)' }}
              >
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm flex-shrink-0" style={{ background: 'var(--card-raised)' }}>
                  {s.type === 'Practice' ? '📖' : s.type === 'Pop Quiz' ? '⚡' : '📋'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>{s.name}</p>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{s.date} · {s.duration}</p>
                </div>
                <span className="label px-2 py-0.5 rounded" style={typeBadge[s.type] ?? typeBadge['Practice']}>
                  {s.type}
                </span>
                <span className="text-sm font-semibold w-10 text-right" style={{ color: s.score >= 70 ? 'var(--success)' : s.score >= 55 ? 'var(--warning)' : 'var(--danger)' }}>
                  {s.score}%
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </Shell>
  );
}
