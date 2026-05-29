'use client';

import React from 'react';

type DotState = 'unanswered' | 'answered' | 'correct' | 'wrong' | 'flagged' | 'active';

interface QuestionMapProps {
  total: number;
  current: number;
  states?: DotState[];
  onNavigate?: (index: number) => void;
  /** When true, correct/wrong colours are hidden (mock exam mode) */
  hideCorrectness?: boolean;
}

const stateStyles: Record<DotState, React.CSSProperties> = {
  unanswered: { background: 'var(--card-border)', border: '1px solid transparent' },
  answered:   { background: 'var(--text-muted)', border: '1px solid transparent' },
  correct:    { background: 'var(--success)', border: '1px solid transparent' },
  wrong:      { background: 'var(--danger)', border: '1px solid transparent' },
  flagged:    { background: 'var(--accent-amber-bg)', border: '1px solid var(--accent-amber-border)' },
  active:     { background: 'var(--accent-teal)', border: '1px solid transparent' },
};

export default function QuestionMap({
  total,
  current,
  states = [],
  onNavigate,
  hideCorrectness = false,
}: QuestionMapProps) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {Array.from({ length: total }).map((_, i) => {
        const rawState = states[i] ?? 'unanswered';
        const state: DotState =
          i === current
            ? 'active'
            : hideCorrectness && (rawState === 'correct' || rawState === 'wrong')
            ? 'answered'
            : rawState;

        return (
          <button
            key={i}
            onClick={() => onNavigate?.(i)}
            disabled={!onNavigate}
            title={`Question ${i + 1}`}
            className="w-5 h-5 rounded transition-all"
            style={stateStyles[state]}
            aria-label={`Question ${i + 1} — ${state}`}
          />
        );
      })}
    </div>
  );
}
