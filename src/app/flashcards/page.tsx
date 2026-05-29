'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Shell from '@/components/Shell';
import { AppNav } from '@/components/TopNav';
import { AppToolbar } from '@/components/Toolbar';
import LeitnerBar from '@/components/LeitnerBar';
import { useDeckStats, formatLastReviewed } from '@/hooks/useDeckStats';

const ACCENT_BY_INDEX = [
  { color: 'var(--accent-teal)',   bg: 'var(--accent-teal-bg)',   border: 'var(--accent-teal-border)' },
  { color: 'var(--accent-amber)',  bg: 'var(--accent-amber-bg)',  border: 'var(--accent-amber-border)' },
  { color: 'var(--accent-purple)', bg: 'var(--accent-purple-bg)', border: 'var(--accent-purple-border)' },
];

export default function FlashcardsPage() {
  const { decks, loading, error } = useDeckStats();
  const [showLeitner, setShowLeitner] = useState(false);

  const totalDue = decks.reduce((s, d) => s + d.dueCount, 0);

  return (
    <Shell
      nav={<AppNav activePage="Flashcards" streak={7} />}
      toolbar={<AppToolbar activePage="Flashcards" streak={7} />}
    >
      <div className="max-w-5xl mx-auto px-6 py-10 space-y-6 pb-24">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1
              className="font-display text-36"
              style={{ color: 'var(--text-primary)', fontFamily: 'Syne, sans-serif' }}
            >
              Flashcard decks
            </h1>
            <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
              Powered by Leitner spaced repetition
            </p>
          </div>
          <button
            className="px-4 py-2 rounded-xl text-sm font-semibold transition-all hover:opacity-90"
            style={{ background: 'var(--accent-teal)', color: '#071510' }}
          >
            + New deck
          </button>
        </div>

        {/* Due today banner */}
        {!loading && totalDue > 0 && (
          <div
            className="flex items-center justify-between p-4 rounded-2xl"
            style={{
              background: 'var(--accent-amber-bg)',
              border: '1px solid var(--accent-amber-border)',
            }}
          >
            <div>
              <p className="text-sm font-semibold" style={{ color: 'var(--accent-amber)' }}>
                You have {totalDue} card{totalDue !== 1 ? 's' : ''} due today
              </p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                Keep your streak alive — review them now.
              </p>
            </div>
            {decks[0] && (
              <Link
                href={`/flashcards/review/${decks.find(d => d.dueCount > 0)?.exam.id ?? ''}`}
                className="px-4 py-2 rounded-xl text-sm font-semibold transition-all hover:opacity-90 whitespace-nowrap"
                style={{ background: 'var(--accent-amber)', color: '#100d04' }}
              >
                Start review →
              </Link>
            )}
          </div>
        )}

        {/* Loading state */}
        {loading && (
          <div className="flex items-center gap-3 py-12" style={{ color: 'var(--text-muted)' }}>
            <div
              className="w-5 h-5 rounded-full border-2 border-t-transparent"
              style={{ borderColor: 'var(--accent-teal)', animation: 'spin 0.8s linear infinite' }}
            />
            <span className="text-sm">Loading decks…</span>
          </div>
        )}

        {/* Error */}
        {error && (
          <p className="text-sm" style={{ color: 'var(--danger)' }}>{error}</p>
        )}

        {/* Decks grid */}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {decks.map((deck, i) => {
              const accent = ACCENT_BY_INDEX[i % ACCENT_BY_INDEX.length];
              const hasDue = deck.dueCount > 0;

              return (
                <div
                  key={deck.exam.id}
                  className="p-5 rounded-2xl flex flex-col gap-4 transition-all hover:-translate-y-0.5 duration-200"
                  style={{ background: 'var(--card-bg)', border: `1px solid ${hasDue ? accent.border : 'var(--card-border)'}` }}
                >
                  {/* Exam tag */}
                  <div>
                    <span
                      className="label inline-block px-2 py-0.5 rounded mb-3"
                      style={{ color: accent.color, background: accent.bg, border: `1px solid ${accent.border}` }}
                    >
                      {deck.exam.code}
                    </span>
                    <h3
                      className="font-display text-15 leading-snug"
                      style={{ color: 'var(--text-primary)', fontFamily: 'Syne, sans-serif' }}
                    >
                      {deck.exam.title}
                    </h3>
                  </div>

                  {/* Card count + due */}
                  <div className="flex items-center justify-between text-xs" style={{ color: 'var(--text-muted)' }}>
                    <span>{deck.totalCards} cards total</span>
                    {hasDue ? (
                      <span className="font-semibold" style={{ color: 'var(--accent-amber)' }}>
                        {deck.dueCount} due
                      </span>
                    ) : (
                      <span style={{ color: 'var(--success)' }}>✓ All caught up</span>
                    )}
                  </div>

                  {/* Leitner box distribution */}
                  <LeitnerBar boxes={deck.boxDistribution} height={6} />

                  {/* Box legend row */}
                  <div className="flex gap-2 flex-wrap">
                    {deck.boxDistribution.map((count, bi) => {
                      if (count === 0) return null;
                      const colors = ['var(--accent-coral)', 'var(--accent-amber)', 'var(--text-muted)', 'var(--accent-teal)', 'var(--accent-purple)'];
                      return (
                        <span
                          key={bi}
                          className="flex items-center gap-1 text-xs"
                          style={{ color: 'var(--text-muted)' }}
                        >
                          <span className="w-2 h-2 rounded-sm" style={{ background: colors[bi] }} />
                          {count}
                        </span>
                      );
                    })}
                    {deck.newCount > 0 && (
                      <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                        · {deck.newCount} new
                      </span>
                    )}
                  </div>

                  {/* Last reviewed */}
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    Last reviewed: {formatLastReviewed(deck.lastReviewedAt)}
                  </p>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Link
                      href={`/flashcards/review/${deck.exam.id}`}
                      className="flex-1 py-2 rounded-lg text-sm font-semibold text-center transition-all hover:opacity-90"
                      style={{
                        background: hasDue ? accent.color : 'var(--card-raised)',
                        color: hasDue ? '#071510' : 'var(--text-muted)',
                        border: hasDue ? 'none' : '1px solid var(--card-border)',
                      }}
                    >
                      {hasDue ? 'Review →' : 'Browse'}
                    </Link>
                    <button
                      className="px-3 py-2 rounded-lg text-sm"
                      style={{ background: 'var(--card-raised)', color: 'var(--text-muted)', border: '1px solid var(--card-border)' }}
                    >
                      + Add
                    </button>
                  </div>
                </div>
              );
            })}

            {/* Empty state */}
            {decks.length === 0 && !loading && (
              <div
                className="md:col-span-3 p-10 rounded-2xl text-center"
                style={{ background: 'var(--card-bg)', border: '1px dashed var(--card-border)' }}
              >
                <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>
                  No exams available yet. Check back soon.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Leitner explanation (collapsible) */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{ background: 'var(--accent-purple-bg)', border: '1px solid var(--accent-purple-border)' }}
        >
          <button
            className="w-full flex items-center justify-between px-5 py-4 text-sm font-medium"
            style={{ color: 'var(--accent-purple)' }}
            onClick={() => setShowLeitner(p => !p)}
          >
            <span>📦 How the Leitner system works</span>
            <span>{showLeitner ? '−' : '+'}</span>
          </button>
          {showLeitner && (
            <div className="px-5 pb-5 text-sm space-y-3 animate-fade-in" style={{ color: 'var(--text-secondary)' }}>
              <p>Cards move through 5 boxes based on your answers. Correct → move up. Wrong → back to Box 1.</p>
              <div className="flex gap-3 flex-wrap mt-3">
                {[
                  { box: 1, label: 'New / Forgot', color: 'var(--danger)',         interval: '1 day' },
                  { box: 2, label: 'Learning',     color: 'var(--accent-amber)',   interval: '3 days' },
                  { box: 3, label: 'Familiar',     color: 'var(--text-muted)',     interval: '7 days' },
                  { box: 4, label: 'Confident',    color: 'var(--accent-teal)',    interval: '14 days' },
                  { box: 5, label: 'Mastered',     color: 'var(--accent-purple)',  interval: '30 days' },
                ].map(b => (
                  <div key={b.box} className="flex items-center gap-2 text-xs">
                    <div className="w-3 h-3 rounded-sm" style={{ background: b.color }} />
                    <span>Box {b.box}: {b.label} ({b.interval})</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

      </div>
    </Shell>
  );
}
