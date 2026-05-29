'use client';

import React from 'react';
import Link from 'next/link';

/* ── Logo ─────────────────────────────────────────────────────────────── */
function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2 select-none">
      <span
        className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold"
        style={{ background: 'var(--accent-teal)', color: '#071510' }}
      >
        CF
      </span>
      <span
        className="text-15 font-display font-semibold"
        style={{ color: 'var(--glass-text)', fontFamily: 'Syne, sans-serif' }}
      >
        CertiFlip
      </span>
    </Link>
  );
}

/* ── Public / pre-auth nav ────────────────────────────────────────────── */
export function PublicNav({ activePage }: { activePage?: string }) {
  const links = [
    { href: '/', label: 'Home' },
    { href: '#exams', label: 'Exams' },
    { href: '/pricing', label: 'Pricing' },
    { href: '#about', label: 'About' },
  ];

  return (
    <nav className="flex items-center justify-between px-6 py-3 max-w-[1440px] mx-auto w-full">
      <Logo />

      <div className="hidden md:flex items-center gap-1">
        {links.map(l => (
          <Link
            key={l.href}
            href={l.href}
            className="px-3 py-1.5 rounded-md text-sm transition-colors"
            style={{
              color: activePage === l.label ? 'var(--glass-text)' : 'var(--glass-muted)',
              fontWeight: activePage === l.label ? 500 : 400,
            }}
          >
            {l.label}
          </Link>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <Link
          href="/login"
          className="px-4 py-1.5 rounded-md text-sm font-medium transition-colors"
          style={{ color: 'var(--glass-text)' }}
        >
          Log in
        </Link>
        <Link
          href="/signup"
          className="px-4 py-1.5 rounded-lg text-sm font-semibold transition-all hover:opacity-90"
          style={{
            background: 'var(--glass-text)',
            color: 'var(--glass)',
            borderRadius: 'var(--radius-md)',
          }}
        >
          Get started →
        </Link>
      </div>
    </nav>
  );
}

/* ── App / authenticated nav ──────────────────────────────────────────── */
export function AppNav({
  activePage,
  examCode,
  questionInfo,
  streak,
  xp,
  showExitButton,
  onExit,
}: {
  activePage?: string;
  examCode?: string;
  questionInfo?: string;
  streak?: number;
  xp?: number;
  showExitButton?: boolean;
  onExit?: () => void;
}) {
  const navLinks = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/flashcards', label: 'Flashcards' },
    { href: '/results', label: 'Progress' },
  ];

  return (
    <nav className="flex items-center justify-between px-6 py-3 max-w-[1440px] mx-auto w-full">
      <div className="flex items-center gap-4">
        {showExitButton ? (
          <button
            onClick={onExit}
            className="flex items-center gap-1.5 text-sm font-medium transition-colors"
            style={{ color: 'var(--text-secondary)' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
            Exit
          </button>
        ) : (
          <Logo />
        )}

        {examCode && (
          <span
            className="label px-2 py-0.5 rounded"
            style={{
              color: 'var(--accent-teal)',
              background: 'var(--accent-teal-bg)',
              border: '1px solid var(--accent-teal-border)',
            }}
          >
            {examCode}
          </span>
        )}
      </div>

      {/* Center nav pills */}
      {!showExitButton && (
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map(l => (
            <Link
              key={l.href}
              href={l.href}
              className="px-3 py-1.5 rounded-md text-sm transition-colors"
              style={{
                background: activePage === l.label ? 'var(--card-raised)' : 'transparent',
                color: activePage === l.label ? 'var(--text-primary)' : 'var(--text-secondary)',
                fontWeight: activePage === l.label ? 500 : 400,
                border: activePage === l.label ? '1px solid var(--card-border)' : '1px solid transparent',
              }}
            >
              {l.label}
            </Link>
          ))}
        </div>
      )}

      {/* Right side */}
      <div className="flex items-center gap-3">
        {questionInfo && (
          <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
            {questionInfo}
          </span>
        )}
        {xp !== undefined && (
          <span
            className="label px-2 py-0.5 rounded"
            style={{
              color: 'var(--accent-amber)',
              background: 'var(--accent-amber-bg)',
              border: '1px solid var(--accent-amber-border)',
            }}
          >
            {xp} XP
          </span>
        )}
        {streak !== undefined && (
          <span className="flex items-center gap-1 text-sm font-medium" style={{ color: 'var(--accent-amber)' }}>
            🔥 {streak}
          </span>
        )}
        {/* Avatar placeholder */}
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
          style={{ background: 'var(--card-raised)', color: 'var(--text-secondary)', border: '1px solid var(--card-border)' }}
        >
          U
        </div>
      </div>
    </nav>
  );
}

/* ── Minimal nav (login page) ─────────────────────────────────────────── */
export function MinimalNav() {
  return (
    <nav className="flex items-center justify-between px-6 py-3 max-w-[1440px] mx-auto w-full">
      <Logo />
      <Link
        href="/"
        className="flex items-center gap-1.5 text-sm font-medium transition-colors"
        style={{ color: 'var(--glass-muted)' }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M19 12H5M12 5l-7 7 7 7" />
        </svg>
        Back to home
      </Link>
    </nav>
  );
}
