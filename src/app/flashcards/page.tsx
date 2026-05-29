'use client';

import React, { useState } from 'react';
import Shell from '@/components/Shell';
import { AppNav } from '@/components/TopNav';
import { AppToolbar } from '@/components/Toolbar';
import LeitnerBar from '@/components/LeitnerBar';

const mockDecks = [
  { id: '1', examCode: 'NISM-VIII', name: 'Equity Derivatives — Core Concepts', cards: 48, boxes: [12, 10, 14, 8, 4] as [number,number,number,number,number], lastReviewed: '2 days ago', due: 14 },
  { id: '2', examCode: 'NISM-V-A', name: 'Mutual Funds — Scheme Types', cards: 32, boxes: [20, 6, 4, 2, 0] as [number,number,number,number,number], lastReviewed: 'Today', due: 8 },
  { id: '3', examCode: 'NISM-X-A', name: 'Investment Advisory Basics', cards: 20, boxes: [20, 0, 0, 0, 0] as [number,number,number,number,number], lastReviewed: 'Never', due: 20 },
];

export default function FlashcardsPage() {
  const [showLeitner, setShowLeitner] = useState(false);
  const totalDue = mockDecks.reduce((s, d) => s + d.due, 0);

  return (
    <Shell
      nav={<AppNav activePage="Flashcards" streak={7} />}
      toolbar={<AppToolbar activePage="Flashcards" streak={7} />}
    >
      <div className="max-w-5xl mx-auto px-6 py-10 space-y-6 pb-24">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-36" style={{ color: 'var(--text-primary)', fontFamily: 'Syne, sans-serif' }}>
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
        {totalDue > 0 && (
          <div
            className="flex items-center justify-between p-4 rounded-2xl"
            style={{ background: 'var(--accent-amber-bg)', border: '1px solid var(--accent-amber-border)' }}
          >
            <div>
              <p className="text-sm font-semibold" style={{ color: 'var(--accent-amber)' }}>
                You have {totalDue} cards due today
              </p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>Keep your streak alive — review them now.</p>
            </div>
            <button
              className="px-4 py-2 rounded-xl text-sm font-semibold transition-all hover:opacity-90 whitespace-nowrap"
              style={{ background: 'var(--accent-amber)', color: '#100d04' }}
            >
              Start review →
            </button>
          </div>
        )}

        {/* Decks grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {mockDecks.map(deck => (
            <div
              key={deck.id}
              className="p-5 rounded-2xl flex flex-col gap-4"
              style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)' }}
            >
              <div>
                <span
                  className="label inline-block px-2 py-0.5 rounded mb-3"
                  style={{ color: 'var(--accent-teal)', background: 'var(--accent-teal-bg)', border: '1px solid var(--accent-teal-border)' }}
                >
                  {deck.examCode}
                </span>
                <h3 className="font-display text-15 leading-snug" style={{ color: 'var(--text-primary)', fontFamily: 'Syne, sans-serif' }}>
                  {deck.name}
                </h3>
              </div>

              <div className="flex items-center justify-between text-xs" style={{ color: 'var(--text-muted)' }}>
                <span>{deck.cards} cards</span>
                <span>{deck.due > 0 ? <span style={{ color: 'var(--accent-amber)' }}>{deck.due} due</span> : 'All caught up ✓'}</span>
              </div>

              <LeitnerBar boxes={deck.boxes} />

              <div className="flex items-center justify-between text-xs" style={{ color: 'var(--text-muted)' }}>
                <span>Last reviewed: {deck.lastReviewed}</span>
              </div>

              <div className="flex gap-2">
                <button
                  className="flex-1 py-2 rounded-lg text-sm font-medium transition-all hover:opacity-90"
                  style={{ background: 'var(--accent-teal)', color: '#071510' }}
                >
                  Review →
                </button>
                <button
                  className="px-3 py-2 rounded-lg text-sm"
                  style={{ background: 'var(--card-raised)', color: 'var(--text-muted)', border: '1px solid var(--card-border)' }}
                >
                  + Add
                </button>
              </div>
            </div>
          ))}
        </div>

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
            <div className="px-5 pb-5 text-sm space-y-2 animate-fade-in" style={{ color: 'var(--text-secondary)' }}>
              <p>Cards move through 5 boxes based on your answers:</p>
              <div className="flex gap-3 flex-wrap mt-3">
                {[
                  { box: 1, label: 'New / Forgot', color: 'var(--danger)', interval: '1 day' },
                  { box: 2, label: 'Learning', color: 'var(--accent-amber)', interval: '3 days' },
                  { box: 3, label: 'Familiar', color: 'var(--text-muted)', interval: '7 days' },
                  { box: 4, label: 'Confident', color: 'var(--accent-teal)', interval: '14 days' },
                  { box: 5, label: 'Mastered', color: '#7F77DD', interval: '30 days' },
                ].map(b => (
                  <div key={b.box} className="flex items-center gap-2 text-xs">
                    <div className="w-3 h-3 rounded-sm" style={{ background: b.color }} />
                    <span>Box {b.box}: {b.label} ({b.interval})</span>
                  </div>
                ))}
              </div>
              <p className="mt-2 text-xs" style={{ color: 'var(--text-muted)' }}>
                Correct answer → box moves up. Wrong answer → back to box 1.
              </p>
            </div>
          )}
        </div>

      </div>
    </Shell>
  );
}
