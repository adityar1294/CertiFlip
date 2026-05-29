'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Shell from '@/components/Shell';
import { MinimalNav } from '@/components/TopNav';
import { PreAuthToolbar } from '@/components/Toolbar';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // TODO: Supabase auth.signUp
    setLoading(false);
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    background: 'var(--card-bg)',
    border: '1px solid var(--card-border)',
    borderRadius: 'var(--radius-md)',
    color: 'var(--text-primary)',
    padding: '10px 12px',
    fontSize: '14px',
    fontFamily: 'inherit',
    outline: 'none',
  };

  return (
    <Shell nav={<MinimalNav />} toolbar={<PreAuthToolbar />} short>
      <div className="flex items-center justify-center min-h-[70vh] px-6 py-16">
        <div
          className="w-full max-w-sm p-8 rounded-2xl animate-fade-in"
          style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)' }}
        >
          <div className="text-center mb-8">
            <h1 className="font-display text-26 mb-1.5" style={{ color: 'var(--text-primary)', fontFamily: 'Syne, sans-serif' }}>
              Create your account
            </h1>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              Free forever — no credit card needed
            </p>
          </div>

          <div className="space-y-2 mb-6">
            {[
              { icon: '🔵', label: 'Sign up with Google' },
              { icon: '⬛', label: 'Sign up with GitHub' },
            ].map(s => (
              <button
                key={s.label}
                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all hover:opacity-80"
                style={{ background: 'var(--card-raised)', border: '1px solid var(--card-border)', color: 'var(--text-secondary)' }}
              >
                <span>{s.icon}</span>
                {s.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px" style={{ background: 'var(--card-border)' }} />
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>or sign up with email</span>
            <div className="flex-1 h-px" style={{ background: 'var(--card-border)' }} />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label block mb-1.5" style={{ color: 'var(--text-muted)' }}>Full name</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Rahul Sharma" required style={inputStyle} />
            </div>
            <div>
              <label className="label block mb-1.5" style={{ color: 'var(--text-muted)' }}>Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required style={inputStyle} />
            </div>
            <div>
              <label className="label block mb-1.5" style={{ color: 'var(--text-muted)' }}>Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Min. 8 characters" required minLength={8} style={inputStyle} />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90 disabled:opacity-60 mt-2"
              style={{ background: 'var(--accent-teal)', color: '#071510' }}
            >
              {loading ? 'Creating account…' : 'Create free account →'}
            </button>
          </form>

          <p className="text-center text-xs mt-6" style={{ color: 'var(--text-muted)' }}>
            Already have an account?{' '}
            <Link href="/login" className="font-medium" style={{ color: 'var(--accent-teal)' }}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </Shell>
  );
}
