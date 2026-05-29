'use client';

import React from 'react';

interface LeitnerBarProps {
  /** Counts per box [box1, box2, box3, box4, box5] */
  boxes: [number, number, number, number, number];
  height?: number;
}

const BOX_COLORS = [
  'var(--accent-coral)',
  'var(--accent-amber)',
  '#6b7280',
  'var(--accent-teal)',
  '#7F77DD',
];

export default function LeitnerBar({ boxes, height = 8 }: LeitnerBarProps) {
  const total = boxes.reduce((a, b) => a + b, 0) || 1;

  return (
    <div className="flex gap-0.5 w-full overflow-hidden" style={{ height: `${height}px`, borderRadius: '999px' }}>
      {boxes.map((count, i) => (
        <div
          key={i}
          title={`Box ${i + 1}: ${count} cards`}
          className="h-full transition-all duration-500"
          style={{
            width: `${(count / total) * 100}%`,
            background: BOX_COLORS[i],
            minWidth: count > 0 ? '4px' : '0',
          }}
        />
      ))}
    </div>
  );
}
