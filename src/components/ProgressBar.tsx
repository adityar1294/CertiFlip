'use client';

import React from 'react';

type BarColor = 'teal' | 'amber' | 'purple' | 'coral' | 'muted';

const colorMap: Record<BarColor, string> = {
  teal:   'var(--accent-teal)',
  amber:  'var(--accent-amber)',
  purple: 'var(--accent-purple)',
  coral:  'var(--accent-coral)',
  muted:  'var(--card-border)',
};

interface ProgressBarProps {
  /** 0–100 */
  value: number;
  color?: BarColor;
  height?: number;
  className?: string;
  showLabel?: boolean;
  label?: string;
}

export default function ProgressBar({
  value,
  color = 'teal',
  height = 4,
  className = '',
  showLabel = false,
  label,
}: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, value));

  return (
    <div className={`w-full ${className}`}>
      {(showLabel || label) && (
        <div className="flex justify-between items-center mb-1.5">
          {label && <span className="label" style={{ color: 'var(--text-muted)' }}>{label}</span>}
          {showLabel && <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>{clamped}%</span>}
        </div>
      )}
      <div
        className="w-full overflow-hidden"
        style={{
          height: `${height}px`,
          background: 'var(--card-border)',
          borderRadius: '999px',
        }}
      >
        <div
          className="h-full transition-all duration-500 ease-out"
          style={{
            width: `${clamped}%`,
            background: colorMap[color],
            borderRadius: '999px',
          }}
        />
      </div>
    </div>
  );
}
