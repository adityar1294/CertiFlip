'use client';

import React from 'react';

interface ShellProps {
  nav: React.ReactNode;
  toolbar?: React.ReactNode;
  children: React.ReactNode;
  /** When true, screen card gets all-four rounded corners (short pages: login, etc.) */
  short?: boolean;
}

export default function Shell({ nav, toolbar, children, short = false }: ShellProps) {
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: 'var(--glass)' }}
    >
      {/* Outer shell — all four corners always rounded, glass surface */}
      <div
        className="flex-1 flex flex-col mx-auto w-full max-w-[1440px]"
        style={{ borderRadius: 'var(--radius-shell)' }}
      >
        {/* Top nav sits flush on the glass */}
        <div
          className="sticky top-0 z-40"
          style={{
            background: 'var(--glass)',
            borderBottom: '1px solid var(--glass-border)',
          }}
        >
          {nav}
        </div>

        {/* Screen card — the dark content surface */}
        <div
          className="flex-1 flex flex-col relative"
          style={{
            background: 'var(--screen-bg)',
            border: '1px solid var(--screen-border)',
            boxShadow: 'var(--shadow-screen)',
            borderRadius: short
              ? 'var(--radius-xl)'
              : 'var(--radius-xl) var(--radius-xl) 0 0',
          }}
        >
          {children}

          {/* Floating toolbar */}
          <div className="sticky bottom-4 z-50 flex justify-center pb-2 pt-4 pointer-events-none">
            <div className="pointer-events-auto">
              {toolbar}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
