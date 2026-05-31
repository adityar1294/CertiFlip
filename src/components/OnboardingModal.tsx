'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import type { Exam } from '@/hooks/useExams';

const ONBOARDING_KEY = 'certiflip_onboarded';
const FOCUS_EXAM_KEY = 'certiflip_focus_exam';
const TARGET_DATE_KEY = 'certiflip_target_date';

export function isOnboarded(): boolean {
  if (typeof window === 'undefined') return true;
  return localStorage.getItem(ONBOARDING_KEY) === '1';
}

export function getFocusExam(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(FOCUS_EXAM_KEY);
}

export function getTargetDate(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TARGET_DATE_KEY);
}

interface Props {
  exams: Exam[];
  onComplete: () => void;
}

type Step = 1 | 2 | 3;

export default function OnboardingModal({ exams, onComplete }: Props) {
  const [step, setStep] = useState<Step>(1);
  const [selectedExam, setSelectedExam] = useState<Exam | null>(exams[0] ?? null);
  const [targetDate, setTargetDate] = useState('');

  function finish() {
    localStorage.setItem(ONBOARDING_KEY, '1');
    if (selectedExam) localStorage.setItem(FOCUS_EXAM_KEY, selectedExam.code);
    if (targetDate) localStorage.setItem(TARGET_DATE_KEY, targetDate);
    onComplete();
  }

  const today = new Date();
  const minDate = new Date(today.getTime() + 7 * 864e5).toISOString().split('T')[0];
  const maxDate = new Date(today.getTime() + 365 * 864e5).toISOString().split('T')[0];

  const accentColors: [string, string, string][] = [
    ['var(--accent-teal)', 'var(--accent-teal-bg)', 'var(--accent-teal-border)'],
    ['var(--accent-amber)', 'var(--accent-amber-bg)', 'var(--accent-amber-border)'],
    ['var(--accent-purple)', 'var(--accent-purple-bg)', 'var(--accent-purple-border)'],
    ['var(--text-muted)', 'rgba(255,255,255,0.03)', 'var(--card-border)'],
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)' }}
    >
      <div
        className="w-full max-w-lg rounded-3xl p-8 animate-fade-in"
        style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', boxShadow: '0 32px 80px rgba(0,0,0,0.5)' }}
      >
        {/* Step dots */}
        <div className="flex items-center gap-2 mb-8">
          {([1, 2, 3] as Step[]).map(s => (
            <div
              key={s}
              className="h-1 rounded-full transition-all duration-300"
              style={{
                width: s === step ? '24px' : '8px',
                background: s <= step ? 'var(--accent-teal)' : 'var(--card-border)',
              }}
            />
          ))}
          <span className="ml-auto text-xs" style={{ color: 'var(--text-muted)' }}>
            {step} / 3
          </span>
        </div>

        {/* ── Step 1: Pick exam ─────────────────────────────────────────── */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="font-display text-26 mb-2" style={{ color: 'var(--text-primary)', fontFamily: 'Syne, sans-serif' }}>
                Welcome to CertiFlip 👋
              </h2>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                Let&apos;s set you up in 60 seconds. Which exam are you preparing for?
              </p>
            </div>

            <div className="space-y-2">
              {exams.map((exam, i) => {
                const [color, bg, border] = accentColors[i % accentColors.length];
                const isSelected = selectedExam?.id === exam.id;
                return (
                  <button
                    key={exam.id}
                    onClick={() => setSelectedExam(exam)}
                    className="w-full flex items-start gap-4 p-4 rounded-2xl text-left transition-all duration-200"
                    style={{
                      background: isSelected ? bg : 'var(--card-raised)',
                      border: `1px solid ${isSelected ? color : 'var(--card-border)'}`,
                    }}
                  >
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 mt-0.5"
                      style={{ background: bg, color, border: `1px solid ${border}` }}
                    >
                      {exam.code.slice(-2)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{exam.title}</p>
                      {exam.description && (
                        <p className="text-xs mt-0.5 truncate" style={{ color: 'var(--text-muted)' }}>{exam.description}</p>
                      )}
                    </div>
                    {isSelected && (
                      <span className="ml-auto text-sm shrink-0" style={{ color }}>✓</span>
                    )}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setStep(2)}
              disabled={!selectedExam}
              className="w-full py-3 rounded-xl text-sm font-semibold transition-all hover:opacity-90 disabled:opacity-40"
              style={{ background: 'var(--accent-teal)', color: '#071510' }}
            >
              Continue →
            </button>
          </div>
        )}

        {/* ── Step 2: Target date ───────────────────────────────────────── */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="font-display text-26 mb-2" style={{ color: 'var(--text-primary)', fontFamily: 'Syne, sans-serif' }}>
                When do you want to pass? 🎯
              </h2>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                Setting a target date helps you stay on track. You can skip this for now.
              </p>
            </div>

            <div className="space-y-3">
              <label className="label block" style={{ color: 'var(--text-muted)' }}>
                Target exam date
              </label>
              <input
                type="date"
                value={targetDate}
                min={minDate}
                max={maxDate}
                onChange={e => setTargetDate(e.target.value)}
                className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                style={{
                  background: 'var(--card-raised)',
                  border: `1px solid ${targetDate ? 'var(--accent-teal)' : 'var(--card-border)'}`,
                  color: 'var(--text-primary)',
                  colorScheme: 'dark',
                }}
              />

              {targetDate && (
                <div
                  className="px-4 py-3 rounded-xl text-sm animate-fade-in"
                  style={{ background: 'var(--accent-teal-bg)', border: '1px solid var(--accent-teal-border)', color: 'var(--accent-teal)' }}
                >
                  {(() => {
                    const days = Math.round((new Date(targetDate).getTime() - Date.now()) / 864e5);
                    const daily = Math.ceil(30 / days);
                    return `${days} days away · aim for ~${daily} question${daily !== 1 ? 's' : ''}/day`;
                  })()}
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => { setTargetDate(''); setStep(3); }}
                className="flex-1 py-3 rounded-xl text-sm font-medium transition-all"
                style={{ background: 'var(--card-raised)', color: 'var(--text-muted)', border: '1px solid var(--card-border)' }}
              >
                Skip
              </button>
              <button
                onClick={() => setStep(3)}
                className="flex-1 py-3 rounded-xl text-sm font-semibold transition-all hover:opacity-90"
                style={{ background: 'var(--accent-teal)', color: '#071510' }}
              >
                {targetDate ? 'Set target →' : 'Continue →'}
              </button>
            </div>
          </div>
        )}

        {/* ── Step 3: All set ───────────────────────────────────────────── */}
        {step === 3 && (
          <div className="space-y-6 text-center">
            <div className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center text-3xl"
              style={{ background: 'var(--accent-teal-bg)', border: '1px solid var(--accent-teal-border)' }}>
              🎉
            </div>

            <div>
              <h2 className="font-display text-26 mb-2" style={{ color: 'var(--text-primary)', fontFamily: 'Syne, sans-serif' }}>
                You&apos;re all set!
              </h2>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                {selectedExam
                  ? `Ready to crack ${selectedExam.code}. Start with a quick practice session or dive into flashcards.`
                  : 'Ready to start studying. Pick a mode below.'}
              </p>
            </div>

            <div className="space-y-3 text-left">
              <Link
                href={selectedExam ? `/exam/${selectedExam.code}` : '/modules'}
                onClick={finish}
                className="flex items-center gap-4 p-4 rounded-2xl transition-all hover:opacity-90"
                style={{ background: 'var(--accent-teal)', color: '#071510' }}
              >
                <span className="text-2xl">📖</span>
                <div>
                  <p className="text-sm font-semibold">Practice exam</p>
                  <p className="text-xs opacity-70">Answer questions with step-by-step explanations</p>
                </div>
                <span className="ml-auto text-lg">→</span>
              </Link>

              <Link
                href="/flashcards"
                onClick={finish}
                className="flex items-center gap-4 p-4 rounded-2xl transition-all hover:opacity-80"
                style={{ background: 'var(--card-raised)', border: '1px solid var(--card-border)', color: 'var(--text-primary)' }}
              >
                <span className="text-2xl">🃏</span>
                <div>
                  <p className="text-sm font-semibold">Flashcard review</p>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Spaced repetition to lock in key concepts</p>
                </div>
                <span className="ml-auto text-lg" style={{ color: 'var(--text-muted)' }}>→</span>
              </Link>
            </div>

            <button
              onClick={finish}
              className="text-xs"
              style={{ color: 'var(--text-muted)' }}
            >
              Go to dashboard instead
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
