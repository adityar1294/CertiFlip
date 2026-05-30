'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Shell from '@/components/Shell';
import { MinimalNav } from '@/components/TopNav';
import { PreAuthToolbar } from '@/components/Toolbar';
import { createSupabaseClient } from '@/lib/supabaseClient';

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

export default function UpdatePasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const supabase = createSupabaseClient();
    const { error: err } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (err) { setError(err.message); return; }
    setDone(true);
    setTimeout(() => router.push('/dashboard'), 2000);
  };

  return (
    <Shell nav={<MinimalNav />} toolbar={<PreAuthToolbar />} short>
      <div className="flex items-center justify-center min-h-[70vh] px-6 py-16">
        <div className="w-full max-w-sm p-8 rounded-2xl animate-fade-in" style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)' }}>
          <div className="text-center mb-8">
            <h1 className="font-display text-26 mb-1.5" style={{ color: 'var(--text-primary)', fontFamily: 'Syne, sans-serif' }}>
              Set new password
            </h1>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Choose a strong password</p>
          </div>

          {done ? (
            <div className="text-center py-6" style={{ color: 'var(--accent-teal)' }}>
              Password updated! Redirecting…
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && <p className="text-sm text-red-400">{error}</p>}
              <div>
                <label className="label block mb-1.5" style={{ color: 'var(--text-muted)' }}>New password</label>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Min. 8 characters"
                  required
                  minLength={8}
                  style={inputStyle}
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90 disabled:opacity-60 mt-2"
                style={{ background: 'var(--accent-teal)', color: '#071510' }}
              >
                {loading ? 'Updating…' : 'Update password →'}
              </button>
            </form>
          )}
        </div>
      </div>
    </Shell>
  );
}
