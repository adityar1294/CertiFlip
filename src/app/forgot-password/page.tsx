'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Shell from '@/components/Shell';
import { MinimalNav } from '@/components/TopNav';
import { PreAuthToolbar } from '@/components/Toolbar';
import { useUser } from '@/contexts/authContext';

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

export default function ForgotPasswordPage() {
  const { sendPasswordReset } = useUser();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error: err } = await sendPasswordReset(email);
    setLoading(false);
    if (err) { setError(err); return; }
    setSent(true);
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
              Reset password
            </h1>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              Enter your email and we&apos;ll send a reset link
            </p>
          </div>

          {sent ? (
            <div className="text-center py-4">
              <div className="text-3xl mb-3">📬</div>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                Reset link sent to <strong style={{ color: 'var(--text-primary)' }}>{email}</strong>. Check your inbox.
              </p>
              <Link
                href="/login"
                className="inline-block mt-6 text-sm font-medium transition-colors"
                style={{ color: 'var(--accent-teal)' }}
              >
                Back to sign in
              </Link>
            </div>
          ) : (
            <>
              {error && (
                <div className="mb-4 px-3 py-2 rounded-lg text-sm text-red-400 bg-red-950/30 border border-red-500/20">
                  {error}
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="label block mb-1.5" style={{ color: 'var(--text-muted)' }}>Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    style={inputStyle}
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90 disabled:opacity-60 mt-2"
                  style={{ background: 'var(--accent-teal)', color: '#071510' }}
                >
                  {loading ? 'Sending…' : 'Send reset link →'}
                </button>
              </form>
              <p className="text-center text-xs mt-6" style={{ color: 'var(--text-muted)' }}>
                Remembered it?{' '}
                <Link href="/login" className="font-medium" style={{ color: 'var(--accent-teal)' }}>
                  Sign in
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </Shell>
  );
}
