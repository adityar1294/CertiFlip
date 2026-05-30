'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useUser } from '@/contexts/authContext';

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
    { href: '/modules', label: 'Modules' },
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
    { href: '/modules', label: 'Modules' },
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
        <ProfileDropdown />
      </div>
    </nav>
  );
}

/* ── Profile dropdown ─────────────────────────────────────────────────── */
function ProfileDropdown() {
  const { user, signOut } = useUser();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const name: string = (user?.user_metadata?.full_name as string | undefined) ?? user?.email ?? 'User';
  const initial = name.charAt(0).toUpperCase();
  const email = user?.email ?? '';

  // Close on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(o => !o)}
        className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all hover:ring-2"
        style={{
          background: 'var(--accent-teal)',
          color: '#071510',
        }}
        aria-label="Profile menu"
      >
        {initial}
      </button>

      {open && (
        <div
          className="absolute right-0 top-9 w-52 rounded-2xl shadow-xl z-50 py-1 overflow-hidden animate-fade-in"
          style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)' }}
        >
          {/* User info */}
          <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--card-border)' }}>
            <p className="text-sm font-semibold truncate" style={{ color: 'var(--text-primary)' }}>{name}</p>
            <p className="text-xs truncate mt-0.5" style={{ color: 'var(--text-muted)' }}>{email}</p>
          </div>

          {/* Menu items */}
          <div className="py-1">
            <Link
              href="/settings"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2 text-sm transition-colors hover:bg-white/5"
              style={{ color: 'var(--text-secondary)' }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
              </svg>
              Profile
            </Link>
            <Link
              href="/settings"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2 text-sm transition-colors hover:bg-white/5"
              style={{ color: 'var(--text-secondary)' }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <circle cx="12" cy="12" r="3"/>
                <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06-.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/>
              </svg>
              Settings
            </Link>
            <Link
              href="/modules"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2 text-sm transition-colors hover:bg-white/5"
              style={{ color: 'var(--text-secondary)' }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
                <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
              </svg>
              My modules
            </Link>
          </div>

          <div className="border-t py-1" style={{ borderColor: 'var(--card-border)' }}>
            <button
              onClick={() => { setOpen(false); signOut(); }}
              className="w-full flex items-center gap-2.5 px-4 py-2 text-sm transition-colors hover:bg-white/5"
              style={{ color: 'var(--danger, #f87171)' }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/>
              </svg>
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
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
