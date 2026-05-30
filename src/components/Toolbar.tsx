'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

/* ── Icon helpers ─────────────────────────────────────────────────────── */
function HomeIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}
function ExamsIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M9 11l3 3L22 4" />
      <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
    </svg>
  );
}
function PricingIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v12M9 9h4.5a2.5 2.5 0 010 5H9v3" />
    </svg>
  );
}
function DashboardIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}
function FlashcardsIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="2" y="4" width="20" height="14" rx="2" />
      <path d="M8 4v14M16 4v14M2 12h20" />
    </svg>
  );
}
function ProgressIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  );
}
function TrophyIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M6 9H4a2 2 0 01-2-2V5h4" />
      <path d="M18 9h2a2 2 0 002-2V5h-4" />
      <path d="M12 17c-4.97 0-9-4.03-9-9V5h18v3c0 4.97-4.03 9-9 9z" />
      <path d="M9 21h6M12 17v4" />
    </svg>
  );
}
function SettingsIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
    </svg>
  );
}
function PlusIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}
function LoginIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4M10 17l5-5-5-5M15 12H3" />
    </svg>
  );
}

/* ── Toolbar button ───────────────────────────────────────────────────── */
function ToolbarItem({
  href,
  icon,
  label,
  active,
  accent,
}: {
  href?: string;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  accent?: boolean;
}) {
  const style: React.CSSProperties = active
    ? { background: 'var(--glass-text)', color: 'var(--glass)', borderRadius: 'var(--radius-md)' }
    : accent
    ? { background: 'var(--accent-teal)', color: '#071510', borderRadius: 'var(--radius-md)' }
    : { color: 'var(--glass-muted)', borderRadius: 'var(--radius-md)' };

  const classes = 'flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-all hover:opacity-80';

  const content = (
    <>
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </>
  );

  if (href) {
    return (
      <Link href={href} className={classes} style={style}>
        {content}
      </Link>
    );
  }
  return (
    <button className={classes} style={style}>
      {content}
    </button>
  );
}

/* ── Divider ──────────────────────────────────────────────────────────── */
function Divider() {
  return <div className="w-px h-4 mx-1" style={{ background: 'var(--glass-border)' }} />;
}

/* ── Pre-auth toolbar ─────────────────────────────────────────────────── */
export function PreAuthToolbar() {
  const pathname = usePathname();

  return (
    <div
      className="toolbar flex items-center gap-1 px-2 py-1.5"
      style={{
        background: 'rgba(250,249,245,0.85)',
        border: '1px solid var(--glass-border)',
      }}
    >
      <ToolbarItem href="/" icon={<HomeIcon />} label="Home" active={pathname === '/'} />
      <ToolbarItem href="/modules" icon={<ExamsIcon />} label="Modules" active={pathname === '/modules'} />
      <Divider />
      <ToolbarItem href="/login" icon={<LoginIcon />} label="Log in" active={pathname === '/login'} />
      <ToolbarItem href="/signup" icon={<PlusIcon />} label="Get started" accent />
    </div>
  );
}

/* ── App toolbar ──────────────────────────────────────────────────────── */
export function AppToolbar({ activePage, streak }: { activePage?: string; streak?: number }) {
  return (
    <div
      className="toolbar flex items-center gap-1 px-2 py-1.5"
      style={{
        background: 'rgba(250,249,245,0.85)',
        border: '1px solid var(--glass-border)',
      }}
    >
      <ToolbarItem href="/dashboard" icon={<DashboardIcon />} label="Dashboard" active={activePage === 'Dashboard'} />
      <ToolbarItem href="/modules" icon={<ExamsIcon />} label="Modules" active={activePage === 'Modules'} />
      <ToolbarItem href="/flashcards" icon={<FlashcardsIcon />} label="Flashcards" active={activePage === 'Flashcards'} />
      <ToolbarItem href="/results" icon={<ProgressIcon />} label="Progress" active={activePage === 'Progress'} />
      <Divider />
      {streak !== undefined && (
        <button className="flex items-center gap-1 px-2 py-1.5 text-xs font-medium" style={{ color: 'var(--accent-amber)' }}>
          🔥 {streak}
        </button>
      )}
      <ToolbarItem href="/results" icon={<TrophyIcon />} label="" active={false} />
      <Divider />
      <ToolbarItem href="/settings" icon={<SettingsIcon />} label="Settings" active={activePage === 'Settings'} />
      <ToolbarItem href="/flashcards" icon={<PlusIcon />} label="" accent />
    </div>
  );
}
