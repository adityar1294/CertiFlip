'use client';

import React, { useState, useEffect } from 'react';
import type { ReviewCard } from '@/hooks/useCardReview';

/* ── Box accent colours ────────────────────────────────────────────────── */
const BOX_ACCENT: Record<number, { color: string; bg: string; border: string; label: string }> = {
  1: { color: 'var(--accent-coral)',   bg: 'var(--accent-coral-bg)',   border: 'var(--accent-coral-border)',   label: 'New' },
  2: { color: 'var(--accent-amber)',   bg: 'var(--accent-amber-bg)',   border: 'var(--accent-amber-border)',   label: 'Learning' },
  3: { color: 'var(--text-muted)',     bg: 'rgba(255,255,255,0.04)',   border: 'var(--card-border)',           label: 'Familiar' },
  4: { color: 'var(--accent-teal)',    bg: 'var(--accent-teal-bg)',    border: 'var(--accent-teal-border)',    label: 'Confident' },
  5: { color: 'var(--accent-purple)',  bg: 'var(--accent-purple-bg)', border: 'var(--accent-purple-border)',  label: 'Mastered' },
};

interface FlashCardProps {
  card: ReviewCard;
  onGotIt: () => void;
  onMissedIt: () => void;
  /** Reset flip state when card changes */
  cardKey: string | number;
}

export default function FlashCard({ card, onGotIt, onMissedIt, cardKey }: FlashCardProps) {
  const [flipped, setFlipped] = useState(false);

  // Reset flip state whenever the card changes
  useEffect(() => {
    setFlipped(false);
  }, [cardKey]);

  const q = card.question;
  const boxAccent = BOX_ACCENT[card.currentBox] ?? BOX_ACCENT[1];
  const correctOptionText = q.dynamic_options[q.correct_option] ?? '';

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-2xl mx-auto">

      {/* Box badge */}
      <div className="flex items-center gap-2">
        <span
          className="label px-2.5 py-1 rounded-full"
          style={{ color: boxAccent.color, background: boxAccent.bg, border: `1px solid ${boxAccent.border}` }}
        >
          Box {card.currentBox} · {boxAccent.label}
        </span>
        {card.isNew && (
          <span className="label px-2 py-0.5 rounded-full" style={{ color: 'var(--text-muted)', background: 'var(--card-raised)', border: '1px solid var(--card-border)' }}>
            New card
          </span>
        )}
      </div>

      {/* ── 3D flip card ───────────────────────────────────────────── */}
      <div
        className="w-full cursor-pointer select-none"
        style={{ perspective: '1200px' }}
        onClick={() => !flipped && setFlipped(true)}
        role="button"
        aria-label={flipped ? 'Card showing answer' : 'Click to reveal answer'}
      >
        <div
          style={{
            transformStyle: 'preserve-3d',
            transition: 'transform 0.55s cubic-bezier(0.4, 0, 0.2, 1)',
            transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
            position: 'relative',
            minHeight: '280px',
          }}
        >
          {/* ── FRONT — Question ─────────────────────────────────── */}
          <div
            className="absolute inset-0 flex flex-col justify-between p-8 rounded-3xl"
            style={{
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              background: 'var(--card-bg)',
              border: `1px solid ${boxAccent.border}`,
              boxShadow: '0 8px 32px rgba(0,0,0,0.24)',
            }}
          >
            {/* Front label */}
            <div className="flex items-center justify-between">
              <span className="label" style={{ color: 'var(--accent-teal)' }}>Question</span>
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>tap to reveal →</span>
            </div>

            {/* Question text */}
            <p
              className="text-base font-medium leading-relaxed text-center px-4"
              style={{ color: 'var(--text-primary)' }}
            >
              {q.dynamic_options?.question ?? 'No question text available.'}
            </p>

            {/* Hint */}
            <div className="flex items-center justify-center gap-2">
              <div className="w-8 h-0.5 rounded" style={{ background: 'var(--card-border)' }} />
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>think before revealing</span>
              <div className="w-8 h-0.5 rounded" style={{ background: 'var(--card-border)' }} />
            </div>
          </div>

          {/* ── BACK — Answer ────────────────────────────────────── */}
          <div
            className="absolute inset-0 flex flex-col justify-between p-8 rounded-3xl"
            style={{
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
              background: 'var(--card-raised)',
              border: `1px solid ${boxAccent.border}`,
              boxShadow: '0 8px 32px rgba(0,0,0,0.24)',
            }}
          >
            {/* Back label */}
            <div className="flex items-center justify-between">
              <span className="label" style={{ color: 'var(--text-muted)' }}>Answer</span>
              <span
                className="label px-2 py-0.5 rounded"
                style={{ color: boxAccent.color, background: boxAccent.bg, border: `1px solid ${boxAccent.border}` }}
              >
                {q.correct_option}
              </span>
            </div>

            {/* Correct answer */}
            <div
              className="flex-1 flex flex-col items-center justify-center gap-3 py-4"
            >
              <div
                className="w-full px-5 py-4 rounded-2xl text-center"
                style={{
                  background: 'var(--accent-teal-bg)',
                  border: '1px solid var(--accent-teal-border)',
                }}
              >
                <span className="text-xs font-bold mr-2" style={{ color: 'var(--accent-teal)' }}>
                  {q.correct_option}.
                </span>
                <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                  {correctOptionText}
                </span>
              </div>

              {/* Brief explanation */}
              {q.detailed_explanation && (
                <p
                  className="text-xs leading-relaxed text-center line-clamp-4 px-2"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {q.detailed_explanation}
                </p>
              )}
            </div>

            {/* Spacer to match front layout */}
            <div className="h-4" />
          </div>
        </div>
      </div>

      {/* ── Rating buttons — only visible after flip ─────────────────── */}
      <div
        className="flex gap-4 w-full transition-all duration-300"
        style={{ opacity: flipped ? 1 : 0, pointerEvents: flipped ? 'auto' : 'none', transform: flipped ? 'translateY(0)' : 'translateY(8px)' }}
      >
        <button
          onClick={onMissedIt}
          className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl text-sm font-semibold transition-all hover:opacity-90 active:scale-95"
          style={{
            background: 'var(--accent-coral-bg)',
            border: '1px solid var(--accent-coral-border)',
            color: 'var(--accent-coral)',
          }}
        >
          <span className="text-lg">✗</span>
          Missed it
        </button>

        <button
          onClick={onGotIt}
          className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl text-sm font-semibold transition-all hover:opacity-90 active:scale-95"
          style={{
            background: 'var(--accent-teal-bg)',
            border: '1px solid var(--accent-teal-border)',
            color: 'var(--accent-teal)',
          }}
        >
          <span className="text-lg">✓</span>
          Got it
        </button>
      </div>

      {/* Tap hint when not yet flipped */}
      {!flipped && (
        <p className="text-xs animate-pulse" style={{ color: 'var(--text-muted)' }}>
          Tap the card to reveal the answer
        </p>
      )}
    </div>
  );
}
