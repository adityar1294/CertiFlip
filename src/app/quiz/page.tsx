'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Shell from '@/components/Shell';
import { AppNav } from '@/components/TopNav';
import { AppToolbar } from '@/components/Toolbar';
import { useExams } from '@/hooks/useExams';
import { useQuestions } from '@/hooks/useQuestions';
import { saveExamAttempt } from '@/lib/examAttempts';

const QUIZ_SIZE = 5;
const SECONDS_PER_QUESTION = 30;

export default function PopQuizPage() {
  const { data: exams } = useExams();
  const firstExam = exams?.[0];
  const { data: allQuestions } = useQuestions(firstExam?.id ?? '');

  const [questions, setQuestions] = useState<typeof allQuestions>([]);
  const [started, setStarted] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState<{ correct: boolean; skipped: boolean }[]>([]);
  const [timeLeft, setTimeLeft] = useState(SECONDS_PER_QUESTION);
  const [xp, setXp] = useState(0);
  const [done, setDone] = useState(false);

  // Pick random questions
  useEffect(() => {
    if (allQuestions && allQuestions.length > 0 && !started) {
      const shuffled = [...allQuestions].sort(() => Math.random() - 0.5).slice(0, QUIZ_SIZE);
      setQuestions(shuffled);
    }
  }, [allQuestions, started]);

  // Timer
  useEffect(() => {
    if (!started || submitted || done) return;
    if (timeLeft <= 0) { handleSkip(); return; }
    const t = setTimeout(() => setTimeLeft(p => p - 1), 1000);
    return () => clearTimeout(t);
  });

  const handleStart = () => { setStarted(true); setTimeLeft(SECONDS_PER_QUESTION); };

  const handleConfirm = () => {
    if (!selected || submitted) return;
    const q = questions?.[currentIdx];
    const correct = selected === q?.correct_option;
    setResults(p => [...p, { correct, skipped: false }]);
    if (correct) setXp(p => p + 15);
    setSubmitted(true);
    setTimeout(() => advance(), 2000);
  };

  const handleSkip = () => {
    setResults(p => [...p, { correct: false, skipped: true }]);
    advance();
  };

  const advance = async () => {
    if (currentIdx + 1 >= (questions?.length ?? 0)) {
      // Save attempt — score is based on results so far + current answer
      const total = questions?.length ?? 0;
      const correct = results.filter(r => r.correct).length;
      const pct = total > 0 ? Math.round((correct / total) * 100) : 0;
      if (firstExam?.id) {
        await saveExamAttempt({ examId: firstExam.id, score: pct, totalQuestions: total });
      }
      setDone(true);
    } else {
      setCurrentIdx(p => p + 1);
      setSelected(null);
      setSubmitted(false);
      setTimeLeft(SECONDS_PER_QUESTION);
    }
  };

  const q = questions?.[currentIdx];
  const options = q ? Object.entries(q.dynamic_options).filter(([k]) => k !== 'question') : [];
  const correctCount = results.filter(r => r.correct).length;
  const skippedCount = results.filter(r => r.skipped).length;
  const wrongCount = results.filter(r => !r.correct && !r.skipped).length;

  const timerPct = (timeLeft / SECONDS_PER_QUESTION) * 100;
  const timerColor = timeLeft <= 10 ? 'var(--danger)' : 'var(--accent-teal)';

  // Done screen
  if (done) {
    return (
      <Shell nav={<AppNav activePage="Dashboard" />} toolbar={<AppToolbar activePage="Practice" />}>
        <div className="flex items-center justify-center min-h-[60vh] px-6">
          <div className="text-center max-w-sm animate-fade-in">
            <h2 className="font-display text-36 mb-2" style={{ color: 'var(--text-primary)', fontFamily: 'Syne, sans-serif' }}>⚡ Quiz done!</h2>
            <p className="text-sm mb-8" style={{ color: 'var(--text-muted)' }}>
              {correctCount} correct · {wrongCount} wrong · {skippedCount} skipped
            </p>
            <div
              className="text-26 font-display font-bold mb-8"
              style={{ color: 'var(--accent-amber)', fontFamily: 'Syne, sans-serif' }}
            >
              +{xp} XP
            </div>
            <div className="flex gap-3 justify-center">
              <button onClick={() => { setStarted(false); setCurrentIdx(0); setSelected(null); setSubmitted(false); setResults([]); setXp(0); setDone(false); }}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold" style={{ background: 'var(--accent-teal)', color: '#071510' }}>
                Play again
              </button>
              <Link href="/dashboard" className="px-5 py-2.5 rounded-xl text-sm font-medium" style={{ background: 'var(--card-raised)', color: 'var(--text-secondary)', border: '1px solid var(--card-border)' }}>
                Dashboard
              </Link>
            </div>
          </div>
        </div>
      </Shell>
    );
  }

  // Start screen
  if (!started || !q) {
    return (
      <Shell nav={<AppNav activePage="Dashboard" />} toolbar={<AppToolbar activePage="Practice" />}>
        <div className="flex items-center justify-center min-h-[60vh] px-6">
          <div className="text-center max-w-sm animate-fade-in">
            <span className="label px-2 py-0.5 rounded mb-4 inline-block" style={{ color: 'var(--accent-amber)', background: 'var(--accent-amber-bg)', border: '1px solid var(--accent-amber-border)' }}>
              ⚡ Pop Quiz
            </span>
            <h2 className="font-display text-36 mb-2" style={{ color: 'var(--text-primary)', fontFamily: 'Syne, sans-serif' }}>Quick fire round</h2>
            <p className="text-sm mb-8" style={{ color: 'var(--text-muted)' }}>
              {QUIZ_SIZE} questions · {SECONDS_PER_QUESTION}s each · no going back
            </p>
            <button
              onClick={handleStart}
              disabled={!questions?.length}
              className="px-8 py-3 rounded-xl text-sm font-semibold transition-all hover:opacity-90 disabled:opacity-40"
              style={{ background: 'var(--accent-teal)', color: '#071510' }}
            >
              Start quiz →
            </button>
          </div>
        </div>
      </Shell>
    );
  }

  return (
    <Shell
      nav={
        <AppNav
          showExitButton
          onExit={() => window.history.back()}
          examCode={firstExam?.code}
        />
      }
      toolbar={<AppToolbar activePage="Practice" />}
    >
      <div className="max-w-xl mx-auto px-6 py-10 space-y-6 pb-24">

        {/* Header: timer + score strip */}
        <div className="flex items-center justify-between">
          <span className="label" style={{ color: 'var(--accent-amber)' }}>⚡ Pop Quiz · {firstExam?.code}</span>

          {/* Countdown ring */}
          <div className="relative w-10 h-10">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
              <path strokeWidth="3" stroke="var(--card-border)" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              <path strokeWidth="3" strokeLinecap="round" fill="none"
                stroke={timerColor}
                strokeDasharray={`${timerPct}, 100`}
                style={{ transition: 'stroke-dasharray 1s linear' }}
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-bold" style={{ color: timerColor }}>{timeLeft}</span>
            </div>
          </div>
        </div>

        {/* Progress segments */}
        <div className="flex gap-1">
          {Array.from({ length: QUIZ_SIZE }).map((_, i) => (
            <div key={i} className="flex-1 h-1 rounded-full" style={{
              background: i < results.length
                ? (results[i].correct ? 'var(--accent-teal)' : results[i].skipped ? 'var(--text-muted)' : 'var(--danger)')
                : i === currentIdx ? 'var(--danger)' : 'var(--card-border)',
            }} />
          ))}
        </div>

        {/* Score strip */}
        <div className="flex gap-4 text-sm">
          <span style={{ color: 'var(--accent-teal)' }}>✓ {correctCount}</span>
          <span style={{ color: 'var(--danger)' }}>✗ {wrongCount}</span>
          <span style={{ color: 'var(--text-muted)' }}>— {skippedCount}</span>
          <span className="ml-auto font-semibold" style={{ color: 'var(--accent-amber)' }}>+{xp} XP</span>
        </div>

        {/* Question */}
        <div>
          <span className="label mb-3 block" style={{ color: 'var(--text-muted)' }}>Question {currentIdx + 1}</span>
          <p className="text-15 font-medium leading-relaxed" style={{ color: 'var(--text-primary)' }}>
            {q.dynamic_options?.question}
          </p>
        </div>

        {/* Options 2×2 grid */}
        <div className="grid grid-cols-2 gap-3">
          {options.map(([key, val]) => {
            let style: React.CSSProperties = { background: 'var(--card-bg)', border: '1px solid var(--card-border)', color: 'var(--text-secondary)' };
            if (submitted) {
              if (key === q.correct_option) style = { background: 'var(--accent-teal-bg)', border: '1px solid var(--accent-teal)', color: 'var(--accent-teal)' };
              else if (key === selected) style = { background: 'var(--accent-coral-bg)', border: '1px solid var(--accent-coral-border)', color: 'var(--accent-coral)' };
            } else if (key === selected) {
              style = { background: 'var(--accent-teal-bg)', border: '1px solid var(--accent-teal)', color: 'var(--accent-teal)' };
            }
            return (
              <button
                key={key}
                disabled={submitted}
                onClick={() => setSelected(key)}
                className="p-4 rounded-xl text-sm text-left transition-all duration-150"
                style={{ ...style, borderRadius: 'var(--radius-lg)' }}
              >
                <span className="font-bold text-xs mr-2">{key}.</span>{val}
              </button>
            );
          })}
        </div>

        {/* Action row */}
        <div className="flex justify-between items-center">
          <button onClick={handleSkip} disabled={submitted} className="text-sm px-4 py-2 rounded-lg" style={{ color: 'var(--text-muted)', border: '1px solid var(--card-border)' }}>
            Skip question
          </button>
          <button
            onClick={handleConfirm}
            disabled={!selected || submitted}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90 disabled:opacity-40"
            style={{ background: 'var(--accent-teal)', color: '#071510' }}
          >
            Confirm answer →
          </button>
        </div>

      </div>
    </Shell>
  );
}
