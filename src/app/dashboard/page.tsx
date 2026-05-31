'use client';

import React from 'react';
import Link from 'next/link';
import Shell from '@/components/Shell';
import { AppNav } from '@/components/TopNav';
import { AppToolbar } from '@/components/Toolbar';
import StatCard from '@/components/StatCard';
import ProgressBar from '@/components/ProgressBar';
import { useDashboard, timeGreeting, formatSessionTime } from '@/hooks/useDashboard';

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

function xpToLevel(xp: number): { level: number; xpInLevel: number; xpForNext: number } {
  const xpPerLevel = 500;
  const level = Math.floor(xp / xpPerLevel) + 1;
  const xpInLevel = xp % xpPerLevel;
  return { level, xpInLevel, xpForNext: xpPerLevel - xpInLevel };
}

export default function DashboardPage() {
  const { data, loading } = useDashboard();

  const greeting = timeGreeting();
  const totalDue = data?.totalDue ?? 0;
  const totalXp = data?.totalXp ?? 0;
  const streak = data?.streak ?? 0;
  const accuracy = data?.overallAccuracy ?? 0;
  const recentSessions = data?.recentSessions ?? [];
  const examProgress = data?.examProgress ?? [];
  const { level, xpInLevel, xpForNext } = xpToLevel(totalXp);
  const xpPct = Math.round((xpInLevel / 500) * 100);

  return (
    <Shell
      nav={<AppNav activePage="Dashboard" streak={streak} />}
      toolbar={<AppToolbar activePage="Dashboard" streak={streak} />}
    >
      <div className="max-w-6xl mx-auto px-6 py-10 space-y-8 pb-24">

        {/* Greeting */}
        <div>
          <h1 className="font-display text-36 mb-1" style={{ color: 'var(--text-primary)', fontFamily: 'Syne, sans-serif' }}>
            {greeting} {greeting === 'Good morning' ? '☀️' : greeting === 'Good afternoon' ? '🌤️' : '🌙'}
          </h1>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            {loading ? (
              <span style={{ color: 'var(--text-muted)' }}>Loading your stats…</span>
            ) : totalDue > 0 ? (
              <>You have <span style={{ color: 'var(--accent-teal)', fontWeight: 500 }}>{totalDue} flashcard{totalDue !== 1 ? 's' : ''}</span> due for review today.</>
            ) : (
              <span style={{ color: 'var(--accent-teal)' }}>All caught up on flashcards! Keep it up 🎉</span>
            )}
          </p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatCard
            label="Avg accuracy"
            value={accuracy > 0 ? `${accuracy}%` : '—'}
            accent="var(--accent-teal)"
          />
          <StatCard
            label="XP earned"
            value={totalXp > 0 ? totalXp.toLocaleString() : '—'}
            accent="var(--accent-amber)"
          />
          <StatCard
            label="Day streak"
            value={streak > 0 ? `${streak} 🔥` : '0'}
            accent="var(--accent-amber)"
          />
          <StatCard
            label="Sessions"
            value={data ? String(recentSessions.length > 0 ? (data.recentSessions.length < 5 ? data.recentSessions.length : '5+') : '0') : '—'}
            accent="var(--accent-purple)"
          />
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
          ) : examProgress.length === 0 ? (
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
              {examProgress.map((ep, i) => {
                const accentKey = accentForIndex(i);
                const a = accentColors[accentKey];
                const isFirst = i === 0;
                const progress = ep.lastScore ?? 0;

                return (
                  <div
                    key={ep.examId}
                    className={`group relative overflow-hidden flex flex-col p-6 rounded-2xl transition-all duration-300 hover:-translate-y-0.5 ${isFirst ? 'md:col-span-2' : ''}`}
                    style={{ background: 'var(--card-bg)', border: `1px solid ${a.border}` }}
                  >
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                      style={{ background: `radial-gradient(ellipse at top right, ${a.bg} 0%, transparent 70%)` }} />

                    <div className="relative z-10 flex flex-col h-full">
                      <span className="label inline-block px-2 py-0.5 rounded mb-3 self-start" style={{ color: a.color, background: a.bg, border: `1px solid ${a.border}` }}>
                        {ep.examCode}
                      </span>
                      <h3 className="font-display text-18 mb-2" style={{ color: 'var(--text-primary)', fontFamily: 'Syne, sans-serif' }}>
                        {ep.examTitle}
                      </h3>

                      {progress > 0 && (
                        <div className="mb-4">
                          <ProgressBar value={progress} color={accentKey === 'gray' ? 'muted' : accentKey as 'teal' | 'amber' | 'purple' | 'coral' | 'muted'} showLabel label="Last score" />
                        </div>
                      )}

                      <div className="mt-auto">
                        <Link
                          href={`/exam/${ep.examCode}`}
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
                className="flex flex-col p-6 rounded-2xl"
                style={{ background: 'var(--card-bg)', border: '1px solid var(--accent-purple-border)' }}
              >
                <span className="label inline-block px-2 py-0.5 rounded mb-4 self-start" style={{ color: 'var(--accent-purple)', background: 'var(--accent-purple-bg)', border: '1px solid var(--accent-purple-border)' }}>
                  Level {level}
                </span>
                <h3 className="font-display text-18 mb-1" style={{ color: 'var(--text-primary)', fontFamily: 'Syne, sans-serif' }}>Your progress</h3>
                <p className="text-xs mb-6" style={{ color: 'var(--text-muted)' }}>{xpForNext} XP to next level</p>

                <ProgressBar value={xpPct} color="purple" height={6} showLabel label={`XP to Level ${level + 1}`} />

                <div className="mt-6 flex flex-wrap gap-2">
                  {streak >= 7 && (
                    <span className="text-xs px-2 py-1 rounded-md" style={{ background: 'var(--card-raised)', color: 'var(--text-secondary)', border: '1px solid var(--card-border)' }}>
                      🔥 {streak}-day streak
                    </span>
                  )}
                  {streak > 0 && streak < 7 && (
                    <span className="text-xs px-2 py-1 rounded-md" style={{ background: 'var(--card-raised)', color: 'var(--text-secondary)', border: '1px solid var(--card-border)' }}>
                      🔥 {streak}-day streak
                    </span>
                  )}
                  {accuracy >= 100 && (
                    <span className="text-xs px-2 py-1 rounded-md" style={{ background: 'var(--card-raised)', color: 'var(--text-secondary)', border: '1px solid var(--card-border)' }}>
                      ⭐ First 100%
                    </span>
                  )}
                  {accuracy >= 80 && (
                    <span className="text-xs px-2 py-1 rounded-md" style={{ background: 'var(--card-raised)', color: 'var(--text-secondary)', border: '1px solid var(--card-border)' }}>
                      🎯 Sharpshooter
                    </span>
                  )}
                  {recentSessions.length === 0 && streak === 0 && (
                    <span className="text-xs px-2 py-1 rounded-md" style={{ background: 'var(--card-raised)', color: 'var(--text-muted)', border: '1px solid var(--card-border)' }}>
                      Complete sessions to earn badges
                    </span>
                  )}
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
            {loading ? (
              <div className="text-sm py-4 text-center" style={{ color: 'var(--text-muted)' }}>Loading…</div>
            ) : recentSessions.length === 0 ? (
              <div className="text-sm py-4 text-center" style={{ color: 'var(--text-muted)' }}>
                No sessions yet — <Link href="/modules" style={{ color: 'var(--accent-teal)' }}>start studying</Link>
              </div>
            ) : (
              <div className="space-y-3">
                {recentSessions.map(s => (
                  <div key={s.id} className="flex items-center justify-between text-sm">
                    <span style={{ color: 'var(--text-secondary)' }}>{s.examCode} Practice</span>
                    <div className="flex items-center gap-3">
                      <span className="font-medium" style={{ color: s.score >= 70 ? 'var(--success)' : s.score >= 50 ? 'var(--warning)' : 'var(--danger)' }}>
                        {s.score}%
                      </span>
                      <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{formatSessionTime(s.createdAt)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Flashcard due summary */}
          <div className="p-6 rounded-2xl" style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)' }}>
            <h3 className="font-display text-15 mb-4" style={{ color: 'var(--text-secondary)', fontFamily: 'Syne, sans-serif' }}>Flashcards due today</h3>
            {loading ? (
              <div className="text-sm py-4 text-center" style={{ color: 'var(--text-muted)' }}>Loading…</div>
            ) : totalDue === 0 ? (
              <div className="flex flex-col items-center justify-center py-4 gap-3 text-center">
                <span className="text-3xl">🎉</span>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>You're all caught up!</p>
                <Link
                  href="/flashcards"
                  className="text-xs px-3 py-1.5 rounded-lg transition-all hover:opacity-90"
                  style={{ background: 'var(--accent-teal-bg)', color: 'var(--accent-teal)', border: '1px solid var(--accent-teal-border)' }}
                >
                  Browse flashcard decks →
                </Link>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <div className="flex items-baseline gap-2">
                  <span className="font-display text-36" style={{ color: 'var(--accent-teal)', fontFamily: 'Syne, sans-serif' }}>{totalDue}</span>
                  <span className="text-sm" style={{ color: 'var(--text-muted)' }}>card{totalDue !== 1 ? 's' : ''} to review</span>
                </div>
                <Link
                  href="/flashcards"
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90 mt-2"
                  style={{ background: 'var(--accent-teal)', color: '#071510' }}
                >
                  Start review →
                </Link>
              </div>
            )}
          </div>
        </div>

      </div>
    </Shell>
  );
}
