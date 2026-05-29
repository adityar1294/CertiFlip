'use client';

import React from 'react';

interface XpRewardProps {
  xp: number;
  label?: string;
  note?: string;
  className?: string;
}

export default function XpReward({ xp, label = 'XP earned', note, className = '' }: XpRewardProps) {
  return (
    <div
      className={`flex items-center gap-3 p-4 rounded-xl animate-fade-in ${className}`}
      style={{
        background: 'var(--accent-amber-bg)',
        border: '1px solid var(--accent-amber-border)',
      }}
    >
      <div
        className="w-10 h-10 rounded-lg flex items-center justify-center text-lg font-bold flex-shrink-0"
        style={{ background: 'var(--accent-amber)', color: '#100d04' }}
      >
        ⚡
      </div>
      <div className="flex-1">
        <div className="flex items-baseline gap-1.5">
          <span
            className="text-20 font-display font-bold"
            style={{ color: 'var(--accent-amber)', fontFamily: 'Syne, sans-serif' }}
          >
            +{xp}
          </span>
          <span className="text-sm font-medium" style={{ color: 'var(--accent-amber)' }}>{label}</span>
        </div>
        {note && <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{note}</p>}
      </div>
    </div>
  );
}
