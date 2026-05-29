'use client';

import React from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  delta?: string;
  deltaPositive?: boolean;
  accent?: string;
  icon?: React.ReactNode;
}

export default function StatCard({ label, value, delta, deltaPositive = true, accent, icon }: StatCardProps) {
  return (
    <div
      className="flex flex-col gap-3 p-4 rounded-xl"
      style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)' }}
    >
      <div className="flex items-center justify-between">
        <span className="label" style={{ color: 'var(--text-muted)' }}>{label}</span>
        {icon && <span style={{ color: accent || 'var(--text-muted)' }}>{icon}</span>}
      </div>
      <div className="flex items-end gap-2">
        <span
          className="text-26 font-display leading-none"
          style={{ color: accent || 'var(--text-primary)', fontFamily: 'Syne, sans-serif' }}
        >
          {value}
        </span>
        {delta && (
          <span
            className="text-xs font-medium mb-0.5"
            style={{ color: deltaPositive ? 'var(--success)' : 'var(--danger)' }}
          >
            {deltaPositive ? '↑' : '↓'} {delta}
          </span>
        )}
      </div>
    </div>
  );
}
