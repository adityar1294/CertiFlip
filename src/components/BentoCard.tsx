'use client';

import React from 'react';

type Accent = 'teal' | 'amber' | 'purple' | 'coral' | 'gray';

const accentMap: Record<Accent, { color: string; bg: string; border: string; deep: string }> = {
  teal:   { color: 'var(--accent-teal)',   bg: 'var(--accent-teal-bg)',   border: 'var(--accent-teal-border)',   deep: 'var(--accent-teal-deep)' },
  amber:  { color: 'var(--accent-amber)',  bg: 'var(--accent-amber-bg)',  border: 'var(--accent-amber-border)',  deep: 'var(--accent-amber-deep)' },
  purple: { color: 'var(--accent-purple)', bg: 'var(--accent-purple-bg)', border: 'var(--accent-purple-border)', deep: 'var(--accent-purple-deep)' },
  coral:  { color: 'var(--accent-coral)',  bg: 'var(--accent-coral-bg)',  border: 'var(--accent-coral-border)',  deep: '#1a0a08' },
  gray:   { color: 'var(--text-muted)',    bg: 'rgba(255,255,255,0.03)',  border: 'var(--card-border)',          deep: 'var(--card-bg)' },
};

interface BentoCardProps {
  accent?: Accent;
  /** Tailwind col-span classes, e.g. "md:col-span-2" */
  colSpan?: string;
  /** Tailwind row-span classes */
  rowSpan?: string;
  tag?: string;
  title: string;
  description?: string;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export default function BentoCard({
  accent = 'gray',
  colSpan = '',
  rowSpan = '',
  tag,
  title,
  description,
  children,
  footer,
  className = '',
  onClick,
}: BentoCardProps) {
  const a = accentMap[accent];

  return (
    <div
      className={`group relative overflow-hidden flex flex-col p-6 transition-all duration-300 hover:-translate-y-0.5 cursor-default ${colSpan} ${rowSpan} ${className}`}
      style={{
        background: 'var(--card-bg)',
        border: `1px solid ${a.border}`,
        borderRadius: 'var(--radius-xl)',
      }}
      onClick={onClick}
    >
      {/* Subtle gradient overlay on hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ background: `radial-gradient(ellipse at top right, ${a.bg} 0%, transparent 70%)` }}
      />

      <div className="relative z-10 flex flex-col h-full">
        {tag && (
          <span
            className="label inline-block px-2 py-0.5 rounded mb-4 self-start"
            style={{ color: a.color, background: a.bg, border: `1px solid ${a.border}` }}
          >
            {tag}
          </span>
        )}

        <h3
          className="text-18 font-display mb-2 transition-colors duration-300 group-hover:text-white"
          style={{ color: 'var(--text-primary)', fontFamily: 'Syne, sans-serif' }}
        >
          {title}
        </h3>

        {description && (
          <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-muted)' }}>
            {description}
          </p>
        )}

        {children && <div className="flex-1">{children}</div>}

        {footer && <div className="mt-4">{footer}</div>}
      </div>
    </div>
  );
}
