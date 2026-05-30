'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Shell from '@/components/Shell';
import { AppNav } from '@/components/TopNav';
import { AppToolbar } from '@/components/Toolbar';
import { useUser } from '@/contexts/authContext';
import { createSupabaseClient } from '@/lib/supabaseClient';

type Tab = 'Profile' | 'Security' | 'Billing' | 'Notifications' | 'Study' | 'Export';

const PREFS_KEY = 'certiflip_prefs';
const defaultPrefs = {
  dailyGoal: '20',
  spacedRep: true,
  dailyQuiz: true,
  timedQuiz: false,
  streakReminders: true,
  leaderboardUpdates: false,
  emailDigest: true,
};

function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!on)}
      className="relative w-10 h-5 rounded-full transition-all shrink-0"
      style={{ background: on ? 'var(--accent-teal)' : 'var(--card-border)' }}
    >
      <span
        className="absolute top-0.5 w-4 h-4 rounded-full transition-all"
        style={{ background: 'white', left: on ? '22px' : '2px' }}
      />
    </button>
  );
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  background: 'var(--card-raised)',
  border: '1px solid var(--card-border)',
  borderRadius: 'var(--radius-md)',
  color: 'var(--text-primary)',
  padding: '10px 12px',
  fontSize: '14px',
  fontFamily: 'inherit',
  outline: 'none',
};

export default function SettingsPage() {
  const router = useRouter();
  const { user, signOut } = useUser();
  const [activeTab, setActiveTab] = useState<Tab>('Profile');

  // ── Profile state ──────────────────────────────────────────────────────
  const [displayName, setDisplayName] = useState('');
  const [nameLoading, setNameLoading] = useState(false);
  const [nameMsg, setNameMsg] = useState<{ ok: boolean; text: string } | null>(null);

  // ── Security state ─────────────────────────────────────────────────────
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pwdLoading, setPwdLoading] = useState(false);
  const [pwdMsg, setPwdMsg] = useState<{ ok: boolean; text: string } | null>(null);

  // ── Prefs state ────────────────────────────────────────────────────────
  const [prefs, setPrefs] = useState(defaultPrefs);
  const [prefsSaved, setPrefsSaved] = useState(false);

  // ── Delete account ─────────────────────────────────────────────────────
  const [deleteConfirm, setDeleteConfirm] = useState('');

  useEffect(() => {
    if (user) {
      setDisplayName((user.user_metadata?.full_name as string) ?? '');
    }
    const stored = localStorage.getItem(PREFS_KEY);
    if (stored) { try { setPrefs(JSON.parse(stored)); } catch { /* ignore */ } }
  }, [user]);

  const name = displayName || user?.email || 'User';
  const initial = name.charAt(0).toUpperCase();
  const email = user?.email ?? '';

  // ── Handlers ──────────────────────────────────────────────────────────
  async function saveName() {
    setNameLoading(true); setNameMsg(null);
    const supabase = createSupabaseClient();
    const { error } = await supabase.auth.updateUser({ data: { full_name: displayName } });
    setNameLoading(false);
    setNameMsg(error ? { ok: false, text: error.message } : { ok: true, text: 'Name updated!' });
  }

  async function changePassword() {
    if (newPassword !== confirmPassword) { setPwdMsg({ ok: false, text: 'Passwords do not match.' }); return; }
    if (newPassword.length < 8) { setPwdMsg({ ok: false, text: 'Password must be at least 8 characters.' }); return; }
    setPwdLoading(true); setPwdMsg(null);
    const supabase = createSupabaseClient();
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setPwdLoading(false);
    if (error) { setPwdMsg({ ok: false, text: error.message }); }
    else { setPwdMsg({ ok: true, text: 'Password updated successfully!' }); setNewPassword(''); setConfirmPassword(''); }
  }

  function savePrefs() {
    localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
    setPrefsSaved(true);
    setTimeout(() => setPrefsSaved(false), 2000);
  }

  function exportData() {
    const data = {
      profile: { name: displayName, email },
      preferences: prefs,
      exported_at: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'certiflip-data.json'; a.click();
    URL.revokeObjectURL(url);
  }

  async function handleSignOut() {
    await signOut();
    router.push('/');
  }

  const sidebarSections = [
    { heading: 'Account', items: [
      { id: 'Profile' as Tab, label: 'Profile', icon: '👤' },
      { id: 'Security' as Tab, label: 'Security', icon: '🔒' },
      { id: 'Billing' as Tab, label: 'Billing', icon: '💳' },
    ]},
    { heading: 'Preferences', items: [
      { id: 'Notifications' as Tab, label: 'Notifications', icon: '🔔' },
      { id: 'Study' as Tab, label: 'Study settings', icon: '📚' },
    ]},
    { heading: 'Data', items: [
      { id: 'Export' as Tab, label: 'Export data', icon: '📦' },
    ]},
  ];

  return (
    <Shell nav={<AppNav activePage="Settings" />} toolbar={<AppToolbar activePage="Settings" />}>
      <div className="max-w-5xl mx-auto px-6 py-10 pb-28">
        <h1 className="font-display text-36 mb-8" style={{ color: 'var(--text-primary)', fontFamily: 'Syne, sans-serif' }}>
          Settings
        </h1>

        <div className="flex gap-8">
          {/* Sidebar */}
          <aside className="w-48 shrink-0 space-y-6">
            {sidebarSections.map(sec => (
              <div key={sec.heading}>
                <p className="label mb-2 px-3" style={{ color: 'var(--text-muted)' }}>{sec.heading}</p>
                <div className="space-y-0.5">
                  {sec.items.map(item => (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className="w-full text-left flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all"
                      style={activeTab === item.id
                        ? { background: 'var(--card-raised)', color: 'var(--text-primary)', border: '1px solid var(--card-border)', fontWeight: 500 }
                        : { color: 'var(--text-secondary)', border: '1px solid transparent' }}
                    >
                      <span>{item.icon}</span>{item.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            <div className="pt-2 border-t space-y-0.5" style={{ borderColor: 'var(--card-border)' }}>
              <button
                onClick={handleSignOut}
                className="w-full text-left flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all hover:bg-white/5"
                style={{ color: 'var(--text-muted)', border: '1px solid transparent' }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/>
                </svg>
                Sign out
              </button>
            </div>
          </aside>

          {/* Main */}
          <main className="flex-1 min-w-0 space-y-5">

            {/* ── PROFILE ──────────────────────────────────────────── */}
            {activeTab === 'Profile' && (
              <>
                {/* Avatar + name */}
                <div className="p-5 rounded-2xl flex items-center gap-4" style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)' }}>
                  <div className="w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold shrink-0"
                    style={{ background: 'var(--accent-teal)', color: '#071510' }}>
                    {initial}
                  </div>
                  <div>
                    <p className="font-semibold text-15" style={{ color: 'var(--text-primary)' }}>{name}</p>
                    <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{email}</p>
                    <div className="flex gap-2 mt-2">
                      <span className="label px-2 py-0.5 rounded" style={{ color: 'var(--accent-teal)', background: 'var(--accent-teal-bg)', border: '1px solid var(--accent-teal-border)' }}>Free plan</span>
                    </div>
                  </div>
                </div>

                {/* Edit name */}
                <div className="p-5 rounded-2xl space-y-4" style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)' }}>
                  <h3 className="font-display text-15" style={{ color: 'var(--text-secondary)', fontFamily: 'Syne, sans-serif' }}>Edit profile</h3>
                  <div>
                    <label className="label block mb-1.5" style={{ color: 'var(--text-muted)' }}>Display name</label>
                    <input value={displayName} onChange={e => setDisplayName(e.target.value)} placeholder="Your name" style={inputStyle} />
                  </div>
                  <div>
                    <label className="label block mb-1.5" style={{ color: 'var(--text-muted)' }}>Email</label>
                    <input value={email} readOnly style={{ ...inputStyle, opacity: 0.6, cursor: 'not-allowed' }} />
                    <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Email changes require re-authentication — contact support.</p>
                  </div>
                  {nameMsg && (
                    <p className="text-sm" style={{ color: nameMsg.ok ? 'var(--accent-teal)' : 'var(--danger, #f87171)' }}>{nameMsg.text}</p>
                  )}
                  <button
                    onClick={saveName}
                    disabled={nameLoading}
                    className="px-5 py-2 rounded-xl text-sm font-semibold transition-all hover:opacity-90 disabled:opacity-60"
                    style={{ background: 'var(--accent-teal)', color: '#071510' }}
                  >
                    {nameLoading ? 'Saving…' : 'Save changes'}
                  </button>
                </div>
              </>
            )}

            {/* ── SECURITY ─────────────────────────────────────────── */}
            {activeTab === 'Security' && (
              <div className="p-5 rounded-2xl space-y-4" style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)' }}>
                <h3 className="font-display text-15" style={{ color: 'var(--text-secondary)', fontFamily: 'Syne, sans-serif' }}>Change password</h3>
                <div>
                  <label className="label block mb-1.5" style={{ color: 'var(--text-muted)' }}>New password</label>
                  <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="Min. 8 characters" style={inputStyle} />
                </div>
                <div>
                  <label className="label block mb-1.5" style={{ color: 'var(--text-muted)' }}>Confirm new password</label>
                  <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Re-enter password" style={inputStyle} />
                </div>
                {pwdMsg && (
                  <p className="text-sm" style={{ color: pwdMsg.ok ? 'var(--accent-teal)' : 'var(--danger, #f87171)' }}>{pwdMsg.text}</p>
                )}
                <button
                  onClick={changePassword}
                  disabled={pwdLoading || !newPassword}
                  className="px-5 py-2 rounded-xl text-sm font-semibold transition-all hover:opacity-90 disabled:opacity-60"
                  style={{ background: 'var(--accent-teal)', color: '#071510' }}
                >
                  {pwdLoading ? 'Updating…' : 'Update password'}
                </button>

                <div className="border-t pt-4" style={{ borderColor: 'var(--card-border)' }}>
                  <h3 className="font-display text-15 mb-3" style={{ color: 'var(--text-secondary)', fontFamily: 'Syne, sans-serif' }}>Danger zone</h3>
                  <p className="text-xs mb-3" style={{ color: 'var(--text-muted)' }}>
                    Type <strong>DELETE</strong> below to permanently delete your account and all data. This cannot be undone.
                  </p>
                  <div className="flex gap-3">
                    <input
                      value={deleteConfirm}
                      onChange={e => setDeleteConfirm(e.target.value)}
                      placeholder="Type DELETE to confirm"
                      style={{ ...inputStyle, flex: 1 }}
                    />
                    <button
                      disabled={deleteConfirm !== 'DELETE'}
                      className="px-4 py-2 rounded-xl text-sm font-semibold transition-all disabled:opacity-30"
                      style={{ background: 'var(--danger, #f87171)', color: 'white' }}
                    >
                      Delete account
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ── BILLING ──────────────────────────────────────────── */}
            {activeTab === 'Billing' && (
              <div className="space-y-4">
                <div className="p-5 rounded-2xl" style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)' }}>
                  <h3 className="font-display text-15 mb-4" style={{ color: 'var(--text-secondary)', fontFamily: 'Syne, sans-serif' }}>Your modules</h3>
                  <div className="flex flex-col items-center py-10 gap-4 text-center">
                    <div className="text-3xl">📦</div>
                    <p className="text-sm" style={{ color: 'var(--text-muted)' }}>You haven&apos;t purchased any modules yet.</p>
                    <Link
                      href="/modules"
                      className="px-5 py-2 rounded-xl text-sm font-semibold transition-all hover:opacity-90"
                      style={{ background: 'var(--accent-teal)', color: '#071510' }}
                    >
                      Browse modules →
                    </Link>
                  </div>
                </div>

                <div className="p-5 rounded-2xl" style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)' }}>
                  <h3 className="font-display text-15 mb-4" style={{ color: 'var(--text-secondary)', fontFamily: 'Syne, sans-serif' }}>Invoices</h3>
                  <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Invoices will appear here after your first purchase.</p>
                </div>
              </div>
            )}

            {/* ── NOTIFICATIONS ────────────────────────────────────── */}
            {activeTab === 'Notifications' && (
              <div className="p-5 rounded-2xl space-y-4" style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)' }}>
                <h3 className="font-display text-15" style={{ color: 'var(--text-secondary)', fontFamily: 'Syne, sans-serif' }}>Notifications</h3>
                {[
                  { key: 'streakReminders', label: 'Streak reminders', desc: "Don't let your streak break" },
                  { key: 'leaderboardUpdates', label: 'Leaderboard updates', desc: 'When someone overtakes you' },
                  { key: 'emailDigest', label: 'Weekly email digest', desc: 'Your progress summary every Sunday' },
                ].map(p => (
                  <div key={p.key} className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{p.label}</p>
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{p.desc}</p>
                    </div>
                    <Toggle on={prefs[p.key as keyof typeof prefs] as boolean} onChange={v => setPrefs(pr => ({ ...pr, [p.key]: v }))} />
                  </div>
                ))}
                <button onClick={savePrefs} className="px-5 py-2 rounded-xl text-sm font-semibold transition-all hover:opacity-90" style={{ background: 'var(--accent-teal)', color: '#071510' }}>
                  {prefsSaved ? '✓ Saved!' : 'Save preferences'}
                </button>
              </div>
            )}

            {/* ── STUDY SETTINGS ───────────────────────────────────── */}
            {activeTab === 'Study' && (
              <div className="p-5 rounded-2xl space-y-4" style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)' }}>
                <h3 className="font-display text-15" style={{ color: 'var(--text-secondary)', fontFamily: 'Syne, sans-serif' }}>Study settings</h3>
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Daily goal</p>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Questions per day</p>
                  </div>
                  <select
                    value={prefs.dailyGoal}
                    onChange={e => setPrefs(p => ({ ...p, dailyGoal: e.target.value }))}
                    className="text-sm px-3 py-1.5 rounded-lg outline-none"
                    style={{ background: 'var(--card-raised)', color: 'var(--text-primary)', border: '1px solid var(--card-border)' }}
                  >
                    {['10', '20', '30', '50'].map(v => <option key={v}>{v} questions</option>)}
                  </select>
                </div>
                {[
                  { key: 'spacedRep', label: 'Spaced repetition', desc: 'Use Leitner algorithm for flashcard scheduling' },
                  { key: 'dailyQuiz', label: 'Daily pop quiz', desc: 'Get a 5-question burst every day' },
                  { key: 'timedQuiz', label: 'Timed quiz mode', desc: 'Add a countdown timer to practice sessions' },
                ].map(p => (
                  <div key={p.key} className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{p.label}</p>
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{p.desc}</p>
                    </div>
                    <Toggle on={prefs[p.key as keyof typeof prefs] as boolean} onChange={v => setPrefs(pr => ({ ...pr, [p.key]: v }))} />
                  </div>
                ))}
                <button onClick={savePrefs} className="px-5 py-2 rounded-xl text-sm font-semibold transition-all hover:opacity-90" style={{ background: 'var(--accent-teal)', color: '#071510' }}>
                  {prefsSaved ? '✓ Saved!' : 'Save preferences'}
                </button>
              </div>
            )}

            {/* ── EXPORT DATA ──────────────────────────────────────── */}
            {activeTab === 'Export' && (
              <div className="space-y-4">
                <div className="p-5 rounded-2xl space-y-4" style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)' }}>
                  <h3 className="font-display text-15" style={{ color: 'var(--text-secondary)', fontFamily: 'Syne, sans-serif' }}>Export your data</h3>
                  <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                    Download a copy of your profile and preferences as a JSON file. Study progress export will be available after your first session.
                  </p>
                  <button
                    onClick={exportData}
                    className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold transition-all hover:opacity-90"
                    style={{ background: 'var(--card-raised)', color: 'var(--text-secondary)', border: '1px solid var(--card-border)' }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/>
                    </svg>
                    Download account data (JSON)
                  </button>
                </div>

                <div className="p-5 rounded-2xl" style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)' }}>
                  <h3 className="font-display text-15 mb-2" style={{ color: 'var(--text-secondary)', fontFamily: 'Syne, sans-serif' }}>Data we store</h3>
                  <ul className="text-sm space-y-1" style={{ color: 'var(--text-muted)' }}>
                    {['Your email address and display name', 'Study preferences (local only)', 'Flashcard review history (box positions)', 'Practice exam answers and scores', 'Notes you have written per question'].map(item => (
                      <li key={item} className="flex items-start gap-2"><span style={{ color: 'var(--accent-teal)' }}>·</span>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

          </main>
        </div>
      </div>
    </Shell>
  );
}
