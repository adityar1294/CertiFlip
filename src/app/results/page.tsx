'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Shell from '@/components/Shell';
import { AppNav } from '@/components/TopNav';
import { AppToolbar } from '@/components/Toolbar';
import StatCard from '@/components/StatCard';
import FlashBorder from '@/components/FlashBorder';
import { useResults } from '@/hooks/useResults';
import { useExams } from '@/hooks/useExams';
import { computeStreak, formatSessionTime } from '@/hooks/useDashboard';

const SESSION_TYPES = ['Practice', 'Mock', 'Pop Quiz'] as const;

const typeBadge: Record<string, React.CSSProperties> = {
  Practice:  { color: 'var(--accent-teal)',   background: 'var(--accent-teal-bg)',   border: '1px solid var(--accent-teal-border)' },
  'Pop Quiz':{ color: 'var(--accent-amber)',  background: 'var(--accent-amber-bg)',  border: '1px solid var(--accent-amber-border)' },
  Mock:      { color: 'var(--accent-purple)', background: 'var(--accent-purple-bg)', border: '1px solid var(--accent-purple-border)' },
};

const DAY_ABBR = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function ResultsPage() {
  const [filter, setFilter] = useState<'All time' | 'This week' | 'This month'>('All time');
  const { data, loading } = useResults();
  const { data: exams } = useExams();

  const examMap = new Map((exams ?? []).map(e => [e.id, e]));

  // Filter attempts by selected time range
  const now = Date.now();
  const filteredAttempts = (data?.attempts ?? []).filter(a => {
    if (filter === 'All time') return true;
    const diff = now - new Date(a.created_at).getTime();
    if (filter === 'This week') return diff < 7 * 864e5;
    if (filter === 'This month') return diff < 30 * 864e5;
    return true;
  });

  // Compute stats for filtered range
  const totalQ = filteredAttempts.reduce((s, a) => s + (a.total_questions ?? 0), 0);
  const totalCorrect = filteredAttempts.reduce((s, a) => {
    const pct = a.score ?? 0;
    const t = a.total_questions ?? 0;
    return s + Math.round((pct / 100) * t);
  }, 0);
  const accuracy = totalQ > 0 ? Math.round((totalCorrect / totalQ) * 100) : 0;
  const xp = filteredAttempts.length * 50;
  const streak = computeStreak((data?.attempts ?? []).map(a => a.created_at));

  // Last 7 sessions for chart
  const chartSessions = [...filteredAttempts].slice(0, 7).reverse();
  const chartMax = Math.max(...chartSessions.map(a => a.score ?? 0), 1);

  // Worst topic proxy: find exam with lowest last score
  const examLastScore = new Map<string, number>();
  for (const a of [...(data?.attempts ?? [])].reverse()) {
    examLastScore.set(a.exam_id, a.score ?? 0);
  }
  const worstExam = [...examLastScore.entries()]
    .sort((a, b) => a[1] - b[1])[0];
  const worstExamTitle = worstExam ? (examMap.get(worstExam[0])?.title ?? 'this exam') : null;

  return (
    <Shell
      nav={<AppNav activePage="Progress" streak={streak} />}
      toolbar={<AppToolbar activePage="Progress" streak={streak} />}
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
          <StatCard label="Overall accuracy" value={accuracy > 0 ? `${accuracy}%` : '—'} accent="var(--accent-teal)" />
          <StatCard label="Sessions" value={filteredAttempts.length || '—'} accent="var(--text-primary)" />
          <StatCard label="Questions answered" value={totalQ > 0 ? totalQ.toLocaleString() : '—'} accent="var(--text-primary)" />
          <StatCard label="Total XP" value={xp > 0 ? xp.toLocaleString() : '—'} accent="var(--accent-amber)" />
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Session accuracy bar chart */}
          <div className="p-5 rounded-2xl" style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)' }}>
            <h3 className="font-display text-15 mb-4" style={{ color: 'var(--text-secondary)', fontFamily: 'Syne, sans-serif' }}>
              Accuracy — last {chartSessions.length > 0 ? Math.min(chartSessions.length, 7) : 7} sessions
            </h3>
            {loading ? (
              <div className="h-24 flex items-center justify-center text-sm" style={{ color: 'var(--text-muted)' }}>Loading…</div>
            ) : chartSessions.length === 0 ? (
              <div className="h-24 flex items-center justify-center text-sm" style={{ color: 'var(--text-muted)' }}>No sessions yet</div>
            ) : (
              <div className="flex items-end gap-2 h-24">
                {chartSessions.map((a, i) => {
                  const score = a.score ?? 0;
                  const heightPct = (score / 100) * 80;
                  const isLast = i === chartSessions.length - 1;
                  const day = DAY_ABBR[new Date(a.created_at).getDay()];
                  return (
                    <div key={a.id} className="flex-1 flex flex-col items-center gap-1" title={`${score}%`}>
                      <div
                        className="w-full rounded-sm transition-all"
                        style={{
                          height: `${heightPct}px`,
                          background: isLast ? 'var(--accent-teal)' : 'var(--card-raised)',
                        }}
                      />
                      <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{day}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Per-exam accuracy */}
          <div className="p-5 rounded-2xl" style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)' }}>
            <h3 className="font-display text-15 mb-4" style={{ color: 'var(--text-secondary)', fontFamily: 'Syne, sans-serif' }}>
              Exam accuracy
            </h3>
            {loading ? (
              <div className="h-24 flex items-center justify-center text-sm" style={{ color: 'var(--text-muted)' }}>Loading…</div>
            ) : examLastScore.size === 0 ? (
              <div className="h-24 flex items-center justify-center text-sm" style={{ color: 'var(--text-muted)' }}>No attempts yet</div>
            ) : (
              <div className="space-y-3">
                {[...examLastScore.entries()].map(([examId, score]) => {
                  const exam = examMap.get(examId);
                  const accentColor = score >= 70 ? 'var(--accent-teal)' : score >= 50 ? 'var(--accent-amber)' : 'var(--accent-coral)';
                  return (
                    <div key={examId} className="flex items-center gap-3">
                      <span className="text-xs w-28 flex-shrink-0 truncate" style={{ color: 'var(--text-secondary)' }}>
                        {exam?.code ?? 'Unknown'}
                      </span>
                      <div className="flex-1 h-1.5 rounded-full" style={{ background: 'var(--card-border)' }}>
                        <div className="h-full rounded-full transition-all" style={{ width: `${score}%`, background: accentColor }} />
                      </div>
                      <span className="text-xs font-medium w-8 text-right" style={{ color: accentColor }}>{score}%</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Flashcard CTA — only shown when there's a weak area */}
        {worstExamTitle && worstExam && worstExam[1] < 70 && (
          <FlashBorder>
            <div className="p-5 rounded-2xl flex items-center justify-between gap-4" style={{ background: 'var(--card-bg)', border: '1px solid transparent' }}>
              <div>
                <p className="text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>
                  Struggling with {examMap.get(worstExam[0])?.code} ({worstExam[1]}%)?
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
        )}

        {/* Session history */}
        <div>
          <h3 className="font-display text-18 mb-4" style={{ color: 'var(--text-secondary)', fontFamily: 'Syne, sans-serif' }}>
            Session history
          </h3>
          {loading ? (
            <div className="text-sm py-8 text-center" style={{ color: 'var(--text-muted)' }}>Loading sessions…</div>
          ) : filteredAttempts.length === 0 ? (
            <div
              className="flex flex-col items-center justify-center py-16 rounded-2xl text-center"
              style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)' }}
            >
              <div className="text-3xl mb-3">📋</div>
              <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>No sessions {filter !== 'All time' ? `in ${filter.toLowerCase()}` : 'yet'}</p>
              <Link href="/modules" className="text-sm px-4 py-2 rounded-xl font-semibold hover:opacity-90 transition-all" style={{ background: 'var(--accent-teal)', color: '#071510' }}>
                Start studying →
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredAttempts.map(a => {
                const exam = examMap.get(a.exam_id);
                const score = a.score ?? 0;
                return (
                  <div
                    key={a.id}
                    className="flex items-center gap-4 px-4 py-3 rounded-xl"
                    style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)' }}
                  >
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm flex-shrink-0" style={{ background: 'var(--card-raised)' }}>
                      📖
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>
                        {exam?.title ?? 'Practice'} Practice
                      </p>
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                        {formatSessionTime(a.created_at)} · {a.total_questions ?? 0} questions
                      </p>
                    </div>
                    <span className="label px-2 py-0.5 rounded" style={typeBadge['Practice']}>
                      Practice
                    </span>
                    <span
                      className="text-sm font-semibold w-10 text-right"
                      style={{ color: score >= 70 ? 'var(--success)' : score >= 50 ? 'var(--warning)' : 'var(--danger)' }}
                    >
                      {score}%
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </Shell>
  );
}
