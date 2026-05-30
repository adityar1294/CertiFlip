'use client';

import React from 'react';
import Link from 'next/link';
import Shell from '@/components/Shell';
import { PublicNav } from '@/components/TopNav';


const features = [
  { icon: '🧠', title: 'Spaced repetition', desc: 'Leitner system schedules your reviews at optimal intervals, so you never forget what you\'ve learned.' },
  { icon: '⚡', title: 'Pop quizzes', desc: '5-question timed bursts that sharpen recall and keep your streak alive.' },
  { icon: '📊', title: 'Progress analytics', desc: 'Topic-by-topic accuracy breakdowns so you know exactly where to focus.' },
  { icon: '🔢', title: 'Step-by-step solutions', desc: 'Every question has a worked solution with formula breakdowns and LaTeX math.' },
  { icon: '🏆', title: 'Gamification', desc: 'XP, streaks, leaderboard — studying actually feels good.' },
  { icon: '📱', title: 'Study anywhere', desc: 'Fully responsive. Practice on your commute or at your desk.' },
];

const testimonials = [
  { name: 'Rohan K.', role: 'Cleared NISM Series VIII', text: 'Passed on the first attempt after 2 weeks of CertiFlip practice. The step-by-step solutions are gold.' },
  { name: 'Priya S.', role: 'Equity Analyst', text: 'The spaced repetition flashcards stuck complex concepts in a way reading never did. 94% on the mock.' },
  { name: 'Arjun V.', role: 'MBA Finance', text: 'I tried three other platforms. CertiFlip\'s question quality and explanations are on another level.' },
  { name: 'Neha K.', role: 'Cleared NISM Series V-A', text: 'Finished prep in 12 days. The daily pop quizzes kept me sharp without feeling like grinding.' },
];

const exams = [
  {
    code: 'NISM-VIII',
    title: 'Equity Derivatives',
    desc: 'Options pricing, futures strategies, clearing & settlement, regulatory frameworks.',
    accent: { color: 'var(--accent-teal)', bg: 'var(--accent-teal-bg)', border: 'var(--accent-teal-border)' },
    span: 'md:col-span-2',
  },
  {
    code: 'NISM-V-A',
    title: 'Mutual Fund Distributors',
    desc: 'Scheme categories, NAV, exit loads, KYC, ARN, risk-return.',
    accent: { color: 'var(--accent-amber)', bg: 'var(--accent-amber-bg)', border: 'var(--accent-amber-border)' },
    span: '',
  },
  {
    code: 'NISM-X-A',
    title: 'Investment Adviser (Level 1)',
    desc: 'Financial planning, retirement, insurance, client profiling.',
    accent: { color: 'var(--accent-purple)', bg: 'var(--accent-purple-bg)', border: 'var(--accent-purple-border)' },
    span: '',
  },
];

export default function LandingPage() {
  return (
    <Shell nav={<PublicNav activePage="Home" />}>
      <div className="px-6 pb-24 space-y-24">

        {/* Hero */}
        <section className="max-w-4xl mx-auto pt-20 text-center">
          <span
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-6"
            style={{ background: 'var(--accent-teal-bg)', color: 'var(--accent-teal)', border: '1px solid var(--accent-teal-border)' }}
          >
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--accent-teal)', animation: 'pulse 2s infinite' }} />
            Live Practice Exams
          </span>

          <h1
            className="font-display mb-5 leading-tight"
            style={{ fontSize: '48px', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'Syne, sans-serif' }}
          >
            Crack your financial certification.{' '}
            <span style={{ color: 'var(--accent-teal)' }}>First try.</span>
          </h1>

          <p className="text-base max-w-xl mx-auto mb-8" style={{ color: 'var(--text-secondary)' }}>
            High-quality practice questions, Leitner spaced-repetition flashcards, and step-by-step solutions for every NISM module.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
            <Link
              href="/signup"
              className="px-6 py-3 rounded-xl text-sm font-semibold transition-all hover:opacity-90"
              style={{ background: 'var(--accent-teal)', color: '#071510', borderRadius: 'var(--radius-xl)' }}
            >
              Start free — no card needed →
            </Link>
            <Link
              href="/modules"
              className="px-6 py-3 rounded-xl text-sm font-medium transition-all"
              style={{ background: 'var(--card-raised)', color: 'var(--text-secondary)', border: '1px solid var(--card-border)', borderRadius: 'var(--radius-xl)' }}
            >
              Browse modules
            </Link>
          </div>

          <div
            className="inline-flex flex-wrap items-center gap-6 px-6 py-3 rounded-xl"
            style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)' }}
          >
            {[{ value: '12,400+', label: 'Students' }, { value: '94%', label: 'Pass rate' }, { value: '8', label: 'Modules' }].map(s => (
              <div key={s.label} className="flex items-baseline gap-1.5">
                <span className="text-15 font-semibold" style={{ color: 'var(--text-primary)' }}>{s.value}</span>
                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{s.label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Exam catalog */}
        <section className="max-w-5xl mx-auto" id="exams">
          <h2 className="font-display text-20 mb-2" style={{ color: 'var(--text-secondary)', fontFamily: 'Syne, sans-serif' }}>
            Available certifications
          </h2>
          <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>More modules shipping every quarter.</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {exams.map(exam => (
              <div
                key={exam.code}
                className={`group p-6 rounded-2xl transition-all duration-300 hover:-translate-y-1 ${exam.span}`}
                style={{ background: 'var(--card-bg)', border: `1px solid ${exam.accent.border}` }}
              >
                <span className="label inline-block px-2 py-0.5 rounded mb-4" style={{ color: exam.accent.color, background: exam.accent.bg, border: `1px solid ${exam.accent.border}` }}>
                  {exam.code}
                </span>
                <h3 className="text-18 font-display mb-2" style={{ color: 'var(--text-primary)', fontFamily: 'Syne, sans-serif' }}>{exam.title}</h3>
                <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>{exam.desc}</p>
                <Link href="/signup" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all hover:opacity-90" style={{ background: exam.accent.color, color: '#071510' }}>
                  Start practicing →
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* Features */}
        <section className="max-w-5xl mx-auto">
          <h2 className="font-display text-26 mb-8 text-center" style={{ color: 'var(--text-primary)', fontFamily: 'Syne, sans-serif' }}>
            Built for how you actually learn
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {features.map(f => (
              <div key={f.title} className="p-5 rounded-xl" style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)' }}>
                <div className="text-2xl mb-3">{f.icon}</div>
                <h3 className="text-15 font-display mb-1.5" style={{ color: 'var(--text-primary)', fontFamily: 'Syne, sans-serif' }}>{f.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Testimonials */}
        <section className="max-w-5xl mx-auto">
          <h2 className="font-display text-26 mb-8 text-center" style={{ color: 'var(--text-primary)', fontFamily: 'Syne, sans-serif' }}>
            Students who passed with CertiFlip
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {testimonials.map(t => (
              <div key={t.name} className="p-6 rounded-2xl" style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)' }}>
                <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>&quot;{t.text}&quot;</p>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: 'var(--card-raised)', color: 'var(--text-secondary)' }}>
                    {t.name[0]}
                  </div>
                  <div>
                    <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{t.name}</div>
                    <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <section className="max-w-2xl mx-auto text-center">
          <div className="p-10 rounded-3xl" style={{ border: '1px solid var(--accent-teal-border)', background: 'var(--accent-teal-deep)' }}>
            <h2 className="font-display text-26 mb-3" style={{ color: 'var(--text-primary)', fontFamily: 'Syne, sans-serif' }}>
              Ready to pass your certification?
            </h2>
            <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
              Join 12,400+ students. Free plan forever, no credit card required.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/signup" className="px-6 py-3 rounded-xl text-sm font-semibold transition-all hover:opacity-90" style={{ background: 'var(--accent-teal)', color: '#071510' }}>
                Get started free →
              </Link>
              <Link href="/modules" className="px-6 py-3 rounded-xl text-sm font-medium" style={{ color: 'var(--text-secondary)', border: '1px solid var(--card-border)', background: 'var(--card-raised)' }}>
                Browse modules
              </Link>
            </div>
          </div>
        </section>

      </div>
    </Shell>
  );
}
