'use client';

import React from 'react';
import type { ReviewResult } from '@/hooks/useCardReview';

interface ReviewProgressProps {
  current: number;
  total: number;
  results: ReviewResult[];
}

export default function ReviewProgress({ current, total, results }: ReviewProgressProps) {
  const correct = results.filter(r => r.correct).length;
  const wrong = results.filter(r => !r.correct).length;
  const remaining = total - current;
  const pct = total > 0 ? Math.round((current / total) * 100) : 0;

  return (
    <div className="w-full max-w-2xl mx-auto space-y-3">
      {/* Progress bar */}
      <div className="flex items-center gap-3">
        <div
          className="flex-1 h-1.5 rounded-full overflow-hidden"
          style={{ background: 'var(--card-border)' }}
        >
          <div
            className="h-full rounded-full transition-all duration-500 ease-out"
            style={{ width: `${pct}%`, background: 'var(--accent-teal)' }}
          />
        </div>
        <span className="text-xs font-medium tabular-nums" style={{ color: 'var(--text-muted)', minWidth: '52px', textAlign: 'right' }}>
          {current} / {total}
        </span>
      </div>

      {/* Score strip */}
      <div className="flex items-center gap-4 text-xs">
        <span className="flex items-center gap-1.5 font-medium" style={{ color: 'var(--accent-teal)' }}>
          <span
            className="w-5 h-5 rounded-md flex items-center justify-center text-xs font-bold"
            style={{ background: 'var(--accent-teal-bg)', border: '1px solid var(--accent-teal-border)' }}
          >
            ✓
          </span>
          {correct} got it
        </span>

        <span className="flex items-center gap-1.5 font-medium" style={{ color: 'var(--accent-coral)' }}>
          <span
            className="w-5 h-5 rounded-md flex items-center justify-center text-xs font-bold"
            style={{ background: 'var(--accent-coral-bg)', border: '1px solid var(--accent-coral-border)' }}
          >
            ✗
          </span>
          {wrong} missed
        </span>

        <span className="ml-auto" style={{ color: 'var(--text-muted)' }}>
          {remaining} left
        </span>
      </div>
    </div>
  );
}
