'use client';

import React, { useState } from 'react';
import Shell from '@/components/Shell';
import { AppNav } from '@/components/TopNav';
import { AppToolbar } from '@/components/Toolbar';

type Tab = 'Profile' | 'Security' | 'Billing' | 'Notifications' | 'Study settings' | 'Appearance' | 'Export data';

function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!on)}
      className="relative w-10 h-5 rounded-full transition-all"
      style={{ background: on ? 'var(--accent-teal)' : 'var(--card-border)' }}
    >
      <span
        className="absolute top-0.5 w-4 h-4 rounded-full transition-all"
        style={{ background: 'white', left: on ? '22px' : '2px' }}
      />
    </button>
  );
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('Profile');
  const [prefs, setPrefs] = useState({
    dailyGoal: '20',
    spacedRep: true,
    dailyQuiz: true,
    timedQuiz: false,
    streakReminders: true,
    leaderboardUpdates: false,
  });

  const sidebarSections = [
    { heading: 'Account', items: ['Profile', 'Security', 'Billing'] as Tab[] },
    { heading: 'Preferences', items: ['Notifications', 'Study settings', 'Appearance'] as Tab[] },
    { heading: 'Data', items: ['Export data'] as Tab[] },
  ];

  return (
    <Shell
      nav={<AppNav activePage="Settings" streak={7} />}
      toolbar={<AppToolbar activePage="Settings" streak={7} />}
    >
      <div className="max-w-5xl mx-auto px-6 py-10 pb-24">
        <h1 className="font-display text-36 mb-8" style={{ color: 'var(--text-primary)', fontFamily: 'Syne, sans-serif' }}>Settings</h1>

        <div className="flex gap-8">
          {/* Sidebar */}
          <aside className="w-48 flex-shrink-0 space-y-6">
            {sidebarSections.map(sec => (
              <div key={sec.heading}>
                <p className="label mb-2" style={{ color: 'var(--text-muted)' }}>{sec.heading}</p>
                <div className="space-y-0.5">
                  {sec.items.map(item => (
                    <button
                      key={item}
                      onClick={() => setActiveTab(item)}
                      className="w-full text-left px-3 py-1.5 rounded-lg text-sm transition-all"
                      style={activeTab === item
                        ? { background: 'var(--card-raised)', color: 'var(--text-primary)', border: '1px solid var(--card-border)', fontWeight: 500 }
                        : { color: 'var(--text-secondary)' }}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            <button className="w-full text-left px-3 py-1.5 rounded-lg text-sm" style={{ color: 'var(--danger)' }}>
              Delete account
            </button>
          </aside>

          {/* Main content */}
          <main className="flex-1 space-y-6">
            {activeTab === 'Profile' && (
              <>
                {/* Profile card */}
                <div className="p-5 rounded-2xl flex items-center gap-4" style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)' }}>
                  <div className="w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold" style={{ background: 'var(--card-raised)', color: 'var(--text-secondary)' }}>
                    U
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-15" style={{ color: 'var(--text-primary)' }}>User Name</p>
                    <p className="text-sm" style={{ color: 'var(--text-muted)' }}>user@example.com</p>
                    <div className="flex gap-2 mt-2">
                      <span className="label px-2 py-0.5 rounded" style={{ color: 'var(--accent-teal)', background: 'var(--accent-teal-bg)', border: '1px solid var(--accent-teal-border)' }}>Free plan</span>
                      <span className="label px-2 py-0.5 rounded" style={{ color: 'var(--accent-amber)', background: 'var(--accent-amber-bg)', border: '1px solid var(--accent-amber-border)' }}>2,140 XP</span>
                    </div>
                  </div>
                  <button className="text-sm px-3 py-1.5 rounded-lg" style={{ color: 'var(--text-secondary)', border: '1px solid var(--card-border)' }}>Edit</button>
                </div>

                {/* Study preferences */}
                <div className="p-5 rounded-2xl space-y-4" style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)' }}>
                  <h3 className="font-display text-15" style={{ color: 'var(--text-secondary)', fontFamily: 'Syne, sans-serif' }}>Study preferences</h3>

                  <div className="flex items-center justify-between">
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
                  ].map(pref => (
                    <div key={pref.key} className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{pref.label}</p>
                        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{pref.desc}</p>
                      </div>
                      <Toggle
                        on={prefs[pref.key as keyof typeof prefs] as boolean}
                        onChange={v => setPrefs(p => ({ ...p, [pref.key]: v }))}
                      />
                    </div>
                  ))}
                </div>

                {/* Notifications */}
                <div className="p-5 rounded-2xl space-y-4" style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)' }}>
                  <h3 className="font-display text-15" style={{ color: 'var(--text-secondary)', fontFamily: 'Syne, sans-serif' }}>Notifications</h3>
                  {[
                    { key: 'streakReminders', label: 'Streak reminders', desc: 'Don\'t let your streak break' },
                    { key: 'leaderboardUpdates', label: 'Leaderboard updates', desc: 'When someone overtakes you' },
                  ].map(pref => (
                    <div key={pref.key} className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{pref.label}</p>
                        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{pref.desc}</p>
                      </div>
                      <Toggle
                        on={prefs[pref.key as keyof typeof prefs] as boolean}
                        onChange={v => setPrefs(p => ({ ...p, [pref.key]: v }))}
                      />
                    </div>
                  ))}
                </div>

                {/* Current plan */}
                <div className="p-5 rounded-2xl" style={{ background: 'var(--accent-teal-deep)', border: '1px solid var(--accent-teal-border)' }}>
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-display text-15 font-semibold" style={{ color: 'var(--accent-teal)', fontFamily: 'Syne, sans-serif' }}>Free plan</p>
                      <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>₹0 forever · 3 practice tests, Leitner, partial analytics</p>
                    </div>
                    <button className="px-3 py-1.5 rounded-lg text-sm font-semibold" style={{ background: 'var(--accent-teal)', color: '#071510' }}>
                      Manage plan →
                    </button>
                  </div>
                </div>
              </>
            )}

            {activeTab !== 'Profile' && (
              <div className="flex items-center justify-center py-20">
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{activeTab} settings — coming soon.</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </Shell>
  );
}
