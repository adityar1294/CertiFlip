'use client';

import React, { use } from 'react';
import Link from 'next/link';
import Shell from '@/components/Shell';
import { AppNav } from '@/components/TopNav';
import { AppToolbar } from '@/components/Toolbar';
import FlashCard from '@/components/FlashCard';
import ReviewProgress from '@/components/ReviewProgress';
import LeitnerBar from '@/components/LeitnerBar';
import { useCardReview, LEITNER_INTERVALS } from '@/hooks/useCardReview';

/* ── Session complete screen ───────────────────────────────────────────── */
function SessionComplete({
  results,
  examCode,
  onRestart,
}: {
  results: ReturnType<typeof useCardReview>['results'];
  examCode: string;
  onRestart: () => void;
}) {
  const correct = results.filter(r => r.correct).length;
  const wrong = results.filter(r => !r.correct).length;
  const total = results.length;
  const pct = total > 0 ? Math.round((correct / total) * 100) : 0;

  // Box movement summary
  const promoted = results.filter(r => r.toBox > r.fromBox).length;
  const demoted = results.filter(r => r.toBox < r.fromBox).length;

  // XP: 10 per correct, 2 per reviewed
  const xp = correct * 10 + total * 2;

  // Next due calculation (soonest review)
  const soonestBox = results.length > 0
    ? Math.min(...results.map(r => r.toBox))
    : 1;
  const nextDueIn = LEITNER_INTERVALS[soonestBox];

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-6 py-10">
      <div className="max-w-md w-full space-y-6 animate-fade-in">

        {/* Header */}
        <div className="text-center">
          <div className="text-4xl mb-3">{pct >= 80 ? '🎉' : pct >= 50 ? '💪' : '📚'}</div>
          <h2
            className="font-display text-36 mb-1"
            style={{ color: 'var(--text-primary)', fontFamily: 'Syne, sans-serif' }}
          >
            Session done!
          </h2>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            {examCode} · {total} cards reviewed
          </p>
        </div>

        {/* Score ring */}
        <div className="relative w-28 h-28 mx-auto">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
            <path strokeWidth="3" stroke="var(--card-border)" fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
            <path strokeWidth="3.5" strokeLinecap="round" fill="none"
              stroke={pct >= 80 ? 'var(--accent-teal)' : pct >= 50 ? 'var(--accent-amber)' : 'var(--accent-coral)'}
              strokeDasharray={`${pct}, 100`}
              style={{ transition: 'stroke-dasharray 1s ease-out' }}
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-display text-26 font-bold" style={{ color: 'var(--text-primary)', fontFamily: 'Syne, sans-serif' }}>
              {pct}%
            </span>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Got it', value: correct, color: 'var(--accent-teal)' },
            { label: 'Missed', value: wrong, color: 'var(--accent-coral)' },
            { label: 'XP earned', value: `+${xp}`, color: 'var(--accent-amber)' },
          ].map(s => (
            <div
              key={s.label}
              className="flex flex-col items-center gap-1 p-3 rounded-xl"
              style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)' }}
            >
              <span className="font-display text-20 font-bold" style={{ color: s.color, fontFamily: 'Syne, sans-serif' }}>
                {s.value}
              </span>
              <span className="label" style={{ color: 'var(--text-muted)' }}>{s.label}</span>
            </div>
          ))}
        </div>

        {/* Box movement */}
        {(promoted > 0 || demoted > 0) && (
          <div
            className="flex items-center justify-between px-4 py-3 rounded-xl text-sm"
            style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)' }}
          >
            <span style={{ color: 'var(--text-muted)' }}>Box movements</span>
            <div className="flex items-center gap-3">
              {promoted > 0 && (
                <span style={{ color: 'var(--accent-teal)' }}>↑ {promoted} promoted</span>
              )}
              {demoted > 0 && (
                <span style={{ color: 'var(--accent-coral)' }}>↓ {demoted} back to box 1</span>
              )}
            </div>
          </div>
        )}

        {/* Next review */}
        <div
          className="flex items-center justify-between px-4 py-3 rounded-xl text-sm"
          style={{ background: 'var(--accent-teal-deep)', border: '1px solid var(--accent-teal-border)' }}
        >
          <span style={{ color: 'var(--text-secondary)' }}>Next review due</span>
          <span className="font-medium" style={{ color: 'var(--accent-teal)' }}>
            in {nextDueIn} {nextDueIn === 1 ? 'day' : 'days'}
          </span>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Link
            href="/flashcards"
            className="flex-1 py-3 rounded-2xl text-sm font-medium text-center transition-all"
            style={{ background: 'var(--card-raised)', color: 'var(--text-secondary)', border: '1px solid var(--card-border)' }}
          >
            ← All decks
          </Link>
          <button
            onClick={onRestart}
            className="flex-1 py-3 rounded-2xl text-sm font-semibold transition-all hover:opacity-90"
            style={{ background: 'var(--accent-teal)', color: '#071510' }}
          >
            Review again
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Main page ─────────────────────────────────────────────────────────── */
export default function ReviewPage({
  params,
}: {
  params: Promise<{ examId: string }>;
}) {
  const { examId } = use(params);

  const {
    queue,
    currentCard,
    currentIndex,
    total,
    results,
    loading,
    error,
    advance,
    sessionComplete,
  } = useCardReview(examId);

  /* ── Loading ──────────────────────────────────────────────────────── */
  if (loading) {
    return (
      <Shell
        nav={<AppNav showExitButton onExit={() => history.back()} />}
        toolbar={<AppToolbar activePage="Flashcards" />}
      >
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <div
            className="w-8 h-8 rounded-full border-2 border-t-transparent"
            style={{ borderColor: 'var(--accent-teal)', animation: 'spin 0.8s linear infinite' }}
          />
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            Loading your cards…
          </p>
        </div>
      </Shell>
    );
  }

  /* ── Error ────────────────────────────────────────────────────────── */
  if (error) {
    return (
      <Shell
        nav={<AppNav showExitButton onExit={() => history.back()} />}
        toolbar={<AppToolbar activePage="Flashcards" />}
      >
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 px-6">
          <p className="text-sm text-center" style={{ color: 'var(--danger)' }}>{error}</p>
          <Link href="/flashcards" className="text-sm font-medium" style={{ color: 'var(--accent-teal)' }}>
            ← Back to decks
          </Link>
        </div>
      </Shell>
    );
  }

  /* ── Empty queue ──────────────────────────────────────────────────── */
  if (!loading && queue.length === 0) {
    return (
      <Shell
        nav={<AppNav showExitButton onExit={() => history.back()} />}
        toolbar={<AppToolbar activePage="Flashcards" />}
      >
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 gap-5 animate-fade-in">
          <div className="text-5xl">🎯</div>
          <h2 className="font-display text-26 text-center" style={{ color: 'var(--text-primary)', fontFamily: 'Syne, sans-serif' }}>
            All caught up!
          </h2>
          <p className="text-sm text-center max-w-xs" style={{ color: 'var(--text-muted)' }}>
            No cards are due for review right now. Come back tomorrow to keep your streak going.
          </p>
          <div
            className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm"
            style={{ background: 'var(--accent-teal-bg)', border: '1px solid var(--accent-teal-border)', color: 'var(--accent-teal)' }}
          >
            ✓ All cards reviewed
          </div>
          <Link
            href="/flashcards"
            className="px-6 py-2.5 rounded-xl text-sm font-semibold"
            style={{ background: 'var(--accent-teal)', color: '#071510' }}
          >
            ← Back to decks
          </Link>
        </div>
      </Shell>
    );
  }

  /* ── Session complete ─────────────────────────────────────────────── */
  if (sessionComplete) {
    return (
      <Shell
        nav={<AppNav showExitButton onExit={() => history.back()} />}
        toolbar={<AppToolbar activePage="Flashcards" />}
      >
        <SessionComplete
          results={results}
          examCode={examId}
          onRestart={() => window.location.reload()}
        />
      </Shell>
    );
  }

  /* ── Active review ────────────────────────────────────────────────── */
  return (
    <Shell
      nav={
        <AppNav
          showExitButton
          onExit={() => {
            if (currentIndex > 0 && !sessionComplete) {
              if (window.confirm('Exit review? Your progress so far has been saved.')) {
                history.back();
              }
            } else {
              history.back();
            }
          }}
          examCode={examId}
          questionInfo={`${currentIndex + 1} / ${total}`}
        />
      }
      toolbar={<AppToolbar activePage="Flashcards" />}
    >
      <div className="max-w-2xl mx-auto px-6 py-8 pb-28 flex flex-col gap-8">

        {/* Progress */}
        <ReviewProgress
          current={currentIndex}
          total={total}
          results={results}
        />

        {/* Leitner box legend — compact */}
        <div className="flex items-center gap-3 flex-wrap">
          {[1, 2, 3, 4, 5].map(box => {
            const count = queue.filter(c => c.currentBox === box).length;
            if (count === 0) return null;
            const colors = ['var(--accent-coral)', 'var(--accent-amber)', 'var(--text-muted)', 'var(--accent-teal)', 'var(--accent-purple)'];
            return (
              <div key={box} className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-muted)' }}>
                <span className="w-2.5 h-2.5 rounded-sm" style={{ background: colors[box - 1] }} />
                Box {box} · {count}
              </div>
            );
          })}
        </div>

        {/* Flash card */}
        {currentCard && (
          <FlashCard
            card={currentCard}
            cardKey={currentCard.question.id}
            onGotIt={() => advance(true)}
            onMissedIt={() => advance(false)}
          />
        )}

        {/* Keyboard hint */}
        <p className="text-center text-xs hidden md:block" style={{ color: 'var(--text-muted)' }}>
          Tap the card to flip · then rate your recall
        </p>

      </div>
    </Shell>
  );
}
