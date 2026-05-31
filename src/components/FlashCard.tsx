'use client';

import React, { useState, useEffect } from 'react';
import type { ReviewCard } from '@/hooks/useCardReview';

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
  cardKey: string | number;
}

export default function FlashCard({ card, onGotIt, onMissedIt, cardKey }: FlashCardProps) {
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    setSelected(null);
  }, [cardKey]);

  const q = card.question;
  const boxAccent = BOX_ACCENT[card.currentBox] ?? BOX_ACCENT[1];
  const opts = q.dynamic_options as Record<string, string>;

  // Question text lives in dynamic_options.question (always populated)
  const questionText = opts.question ?? q.question_text ?? '';

  const optionKeys = (['A', 'B', 'C', 'D'] as const).filter(k => opts[k]);

  const submitted = selected !== null;
  const isCorrect = selected === q.correct_option;

  const getOptionStyle = (key: string): React.CSSProperties => {
    const isSelected = key === selected;
    const isCorrectKey = key === q.correct_option;

    if (submitted) {
      if (isCorrectKey) return { background: 'var(--accent-teal-bg)', border: '1px solid var(--accent-teal)', color: 'var(--accent-teal)' };
      if (isSelected)  return { background: 'var(--accent-coral-bg)', border: '1px solid var(--accent-coral-border)', color: 'var(--accent-coral)' };
      return { background: 'var(--card-bg)', border: '1px solid var(--card-border)', color: 'var(--text-muted)', opacity: 0.4 };
    }
    if (isSelected) return { background: 'var(--accent-teal-bg)', border: '1px solid var(--accent-teal)', color: 'var(--accent-teal)' };
    return { background: 'var(--card-raised)', border: '1px solid var(--card-border)', color: 'var(--text-secondary)' };
  };

  return (
    <div className="w-full flex flex-col gap-4">

      {/* Badge row */}
      <div className="flex items-center gap-2 flex-wrap">
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
        <div className="ml-auto text-xs font-medium">
          {submitted ? (
            isCorrect
              ? <span style={{ color: 'var(--accent-teal)' }}>✓ Correct</span>
              : <span style={{ color: 'var(--accent-coral)' }}>✗ Incorrect · Answer: {q.correct_option}</span>
          ) : (
            <span style={{ color: 'var(--text-muted)' }}>Select the correct answer</span>
          )}
        </div>
      </div>

      {/* Card body */}
      <div
        className="w-full rounded-3xl p-8 flex flex-col gap-6"
        style={{
          background: 'var(--card-bg)',
          border: `1px solid ${submitted ? (isCorrect ? 'var(--accent-teal-border)' : 'var(--accent-coral-border)') : boxAccent.border}`,
          boxShadow: '0 8px 32px rgba(0,0,0,0.24)',
          transition: 'border-color 0.3s ease',
        }}
      >
        {/* Question */}
        <p className="text-base font-medium leading-relaxed" style={{ color: 'var(--text-primary)', fontSize: '15px' }}>
          {questionText}
        </p>

        {/* Options — 2-col on md+ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {optionKeys.map(key => (
            <button
              key={key}
              disabled={submitted}
              onClick={() => setSelected(key)}
              className="flex items-start gap-3 px-4 py-3.5 rounded-xl text-sm text-left transition-all duration-200 disabled:cursor-default"
              style={{ ...getOptionStyle(key), borderRadius: 'var(--radius-lg)' }}
            >
              <span
                className="w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold shrink-0 mt-0.5"
                style={{ background: 'rgba(255,255,255,0.08)' }}
              >
                {key}
              </span>
              <span className="leading-relaxed">{opts[key]}</span>
            </button>
          ))}
        </div>

        {/* Explanation */}
        {submitted && q.detailed_explanation && (
          <div
            className="px-4 py-3 rounded-xl text-sm leading-relaxed animate-fade-in"
            style={{ background: 'var(--card-raised)', borderLeft: '3px solid var(--accent-teal)', color: 'var(--text-secondary)' }}
          >
            {q.detailed_explanation}
          </div>
        )}

        {/* CTA */}
        {submitted ? (
          <button
            onClick={() => isCorrect ? onGotIt() : onMissedIt()}
            className="w-full py-3.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90"
            style={{
              background: isCorrect ? 'var(--accent-teal)' : 'var(--card-raised)',
              color: isCorrect ? '#071510' : 'var(--text-secondary)',
              border: isCorrect ? 'none' : '1px solid var(--card-border)',
            }}
          >
            Next card →
          </button>
        ) : (
          <p className="text-xs text-center" style={{ color: 'var(--text-muted)' }}>
            Tap an option to answer
          </p>
        )}
      </div>
    </div>
  );
}
