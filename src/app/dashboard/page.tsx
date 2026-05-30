'use client';

import React from 'react';
import Link from 'next/link';
import Shell from '@/components/Shell';
import { AppNav } from '@/components/TopNav';
import { AppToolbar } from '@/components/Toolbar';
import StatCard from '@/components/StatCard';
import ProgressBar from '@/components/ProgressBar';
import { useExams } from '@/hooks/useExams';

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

export default function DashboardPage() {
  const { data: exams, loading } = useExams();

  return (
    <Shell
      nav={<AppNav activePage="Dashboard" streak={7} />}
      toolbar={<AppToolbar activePage="Dashboard" streak={7} />}
    >
      <div className="max-w-6xl mx-auto px-6 py-10 space-y-8 pb-24">

        {/* Greeting */}
        <div>
          <h1 className="font-display text-36 mb-1" style={{ color: 'var(--text-primary)', fontFamily: 'Syne, sans-serif' }}>
            Good morning ☀️
          </h1>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            You have <span style={{ color: 'var(--accent-teal)', fontWeight: 500 }}>12 flashcards</span> due for review today.
          </p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatCard label="Progress (NISM-VIII)" value="68%" delta="4% this week" accent="var(--accent-teal)" />
          <StatCard label="XP earned" value="2,140" delta="120 today" accent="var(--accent-amber)" />
          <StatCard label="Day streak" value="7 🔥" accent="var(--accent-amber)" />
          <StatCard label="Avg accuracy" value="74%" delta="2% vs last week" accent="var(--accent-purple)" />
        </div>

        {/* Bento grid */}
        <div>
          <h2 className="font-display text-18 mb-4" style={{ color: 'var(--text-secondary)', fontFamily: 'Syne, sans-serif' }}>
            Continue studying
          </h2>

          {loading ? (
            <div className="flex items-center gap-3 py-12" style={{ color: 'var(--text-muted)' }}>
              <div className="w-5 h-5 rounded-full border-2 border-t-transparent" style={{ borderColor: 'var(--accent-teal)', animation: 'spin 0.8s linear infinite' }} />
              <span className="text-sm">Loading modules…</span>
            </div>
          ) : !exams || exams.length === 0 ? (
            <div
              className="flex flex-col items-center justify-center py-20 rounded-2xl text-center"
              style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)' }}
            >
              <div className="text-4xl mb-4">📚</div>
              <h3 className="font-display text-20 mb-2" style={{ color: 'var(--text-primary)', fontFamily: 'Syne, sans-serif' }}>
                No modules yet
              </h3>
              <p className="text-sm mb-6 max-w-xs" style={{ color: 'var(--text-muted)' }}>
                Pick a certification module to unlock practice exams, flashcards, and step-by-step solutions.
              </p>
              <Link
                href="/modules"
                className="px-6 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90"
                style={{ background: 'var(--accent-teal)', color: '#071510' }}
              >
                Browse modules →
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {exams?.map((exam, i) => {
                const accentKey = accentForIndex(i);
                const a = accentColors[accentKey];
                const isFirst = i === 0;
                const progress = isFirst ? 68 : i === 1 ? 12 : 0;

                return (
                  <div
                    key={exam.id}
                    className={`group relative overflow-hidden flex flex-col p-6 rounded-2xl transition-all duration-300 hover:-translate-y-0.5 ${isFirst ? 'md:col-span-2' : ''}`}
                    style={{ background: 'var(--card-bg)', border: `1px solid ${a.border}` }}
                  >
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                      style={{ background: `radial-gradient(ellipse at top right, ${a.bg} 0%, transparent 70%)` }} />

                    <div className="relative z-10 flex flex-col h-full">
                      <span className="label inline-block px-2 py-0.5 rounded mb-3 self-start" style={{ color: a.color, background: a.bg, border: `1px solid ${a.border}` }}>
                        {exam.code}
                      </span>
                      <h3 className="font-display text-18 mb-2" style={{ color: 'var(--text-primary)', fontFamily: 'Syne, sans-serif' }}>
                        {exam.title}
                      </h3>
                      {exam.description && (
                        <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>{exam.description}</p>
                      )}

                      {progress > 0 && (
                        <div className="mb-4">
                          <ProgressBar value={progress} color={accentKey === 'gray' ? 'muted' : accentKey as 'teal' | 'amber' | 'purple' | 'coral' | 'muted'} showLabel label="Progress" />
                        </div>
                      )}

                      <div className="mt-auto">
                        <Link
                          href={`/exam/${exam.code}`}
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all hover:opacity-90"
                          style={{ background: a.color, color: progress === 0 ? 'var(--text-primary)' : '#071510' }}
                        >
                          {progress === 0 ? 'Start →' : 'Continue →'}
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Gamification card */}
              <div
                className="flex flex-col p-6 rounded-2xl row-span-2 md:row-auto"
                style={{ background: 'var(--card-bg)', border: '1px solid var(--accent-purple-border)' }}
              >
                <span className="label inline-block px-2 py-0.5 rounded mb-4 self-start" style={{ color: 'var(--accent-purple)', background: 'var(--accent-purple-bg)', border: '1px solid var(--accent-purple-border)' }}>
                  Level 4
                </span>
                <h3 className="font-display text-18 mb-1" style={{ color: 'var(--text-primary)', fontFamily: 'Syne, sans-serif' }}>Your progress</h3>
                <p className="text-xs mb-6" style={{ color: 'var(--text-muted)' }}>360 XP to next level</p>

                {/* XP bar */}
                <ProgressBar value={64} color="purple" height={6} showLabel label="XP to Level 5" />

                <div className="mt-6 flex flex-wrap gap-2">
                  {['🔥 7-day streak', '⭐ First 100%', '🎯 Sharpshooter'].map(badge => (
                    <span key={badge} className="text-xs px-2 py-1 rounded-md" style={{ background: 'var(--card-raised)', color: 'var(--text-secondary)', border: '1px solid var(--card-border)' }}>
                      {badge}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bottom row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Recent sessions */}
          <div className="p-6 rounded-2xl" style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)' }}>
            <h3 className="font-display text-15 mb-4" style={{ color: 'var(--text-secondary)', fontFamily: 'Syne, sans-serif' }}>Recent sessions</h3>
            <div className="space-y-3">
              {[
                { name: 'NISM-VIII Practice', score: 74, time: '2h ago' },
                { name: 'NISM-VIII Practice', score: 68, time: 'Yesterday' },
                { name: 'NISM-V-A Practice', score: 55, time: '3 days ago' },
              ].map((s, i) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <span style={{ color: 'var(--text-secondary)' }}>{s.name}</span>
                  <div className="flex items-center gap-3">
                    <span className="font-medium" style={{ color: s.score >= 70 ? 'var(--success)' : 'var(--warning)' }}>{s.score}%</span>
                    <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{s.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Leaderboard */}
          <div className="p-6 rounded-2xl" style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)' }}>
            <h3 className="font-display text-15 mb-4" style={{ color: 'var(--text-secondary)', fontFamily: 'Syne, sans-serif' }}>Weekly leaderboard</h3>
            <div className="space-y-3">
              {[
                { rank: 1, name: 'Priya S.', xp: 1840 },
                { rank: 2, name: 'You', xp: 1420, isYou: true },
                { rank: 3, name: 'Rohan K.', xp: 1210 },
              ].map(e => (
                <div key={e.rank} className="flex items-center gap-3 text-sm">
                  <span className="w-5 text-xs text-center font-bold" style={{ color: e.rank === 1 ? 'var(--accent-amber)' : 'var(--text-muted)' }}>
                    {e.rank === 1 ? '🥇' : e.rank === 2 ? '🥈' : '🥉'}
                  </span>
                  <span className="flex-1" style={{ color: e.isYou ? 'var(--accent-teal)' : 'var(--text-secondary)', fontWeight: e.isYou ? 500 : 400 }}>
                    {e.name}
                  </span>
                  <span className="font-medium" style={{ color: 'var(--accent-amber)' }}>{e.xp.toLocaleString()} XP</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </Shell>
  );
}
