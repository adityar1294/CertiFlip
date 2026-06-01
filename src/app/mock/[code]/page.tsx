'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import Shell from '@/components/Shell';
import { AppNav } from '@/components/TopNav';
import { AppToolbar } from '@/components/Toolbar';
import QuestionMap from '@/components/QuestionMap';
import { useExams } from '@/hooks/useExams';
import { useQuestions } from '@/hooks/useQuestions';
import { useMockSession } from '@/hooks/useMockSession';
import { saveExamAttempt } from '@/lib/examAttempts';

// TODO: Gate behind 'pro' plan once Razorpay payment flow is live.
// For now, all authenticated users can access mock exams.

export default function MockExamPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = use(params);
  const { data: exams } = useExams();
  const activeExam = exams?.find(e => e.code.toLowerCase() === code.toLowerCase());
  const { data: questions } = useQuestions(activeExam?.id ?? '');
  const { startSession, submitSession } = useMockSession();

  const [started, setStarted] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [flagged, setFlagged] = useState<Set<number>>(new Set());
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const q = questions?.[currentIdx];
  const total = questions?.length ?? 0;
  const options = q ? Object.entries(q.dynamic_options).filter(([k]) => k !== 'question') : [];

  const handleSelect = (key: string) => {
    if (submitted) return;
    setAnswers(p => ({ ...p, [currentIdx]: key }));
  };

  const handleFlag = () => {
    setFlagged(p => {
      const n = new Set(p);
      if (n.has(currentIdx)) n.delete(currentIdx); else n.add(currentIdx);
      return n;
    });
  };

  const handleSubmit = async () => {
    if (!window.confirm('Submit the exam? You cannot go back.')) return;
    if (!questions) return;
    setSubmitting(true);
    try {
      // Convert index-based answers → question-id-based answers
      const idAnswers: Record<string, string> = {};
      questions.forEach((q2, i) => {
        if (answers[i]) idAnswers[q2.id] = answers[i];
      });
      const sid = sessionId ?? (activeExam?.id ? await startSession(activeExam.id) : null);
      if (sid) {
        await submitSession(sid, idAnswers, questions.map(q2 => ({ id: q2.id, correct_option: q2.correct_option })));
      }
      // Also log to exam_attempts so Progress / Dashboard pages pick it up
      const correctCount = questions.filter((q2, i) => answers[i] === q2.correct_option).length;
      const pct = questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 0;
      if (activeExam?.id) {
        await saveExamAttempt({ examId: activeExam.id, score: pct, totalQuestions: questions.length });
      }
    } catch {
      // Non-blocking — still show results even if save fails
    } finally {
      setSubmitting(false);
      setSubmitted(true);
    }
  };

  const dotStates = Array.from({ length: total }).map((_, i) => {
    if (flagged.has(i)) return 'flagged' as const;
    if (answers[i]) return 'answered' as const;
    return 'unanswered' as const;
  });

  // Results screen
  if (submitted && questions) {
    const score = questions.filter((q2, i) => answers[i] === q2.correct_option).length;
    const pct = Math.round((score / total) * 100);
    const passed = pct >= 50;

    return (
      <Shell nav={<AppNav activePage="Practice" />} toolbar={<AppToolbar activePage="Practice" />}>
        <div className="max-w-3xl mx-auto px-6 py-12 space-y-8 pb-24">
          <div className="text-center animate-fade-in">
            <h2 className="font-display text-36 mb-2" style={{ color: 'var(--text-primary)', fontFamily: 'Syne, sans-serif' }}>
              Exam submitted
            </h2>
            <p className="text-sm mb-2" style={{ color: 'var(--text-muted)' }}>{score} / {total} correct · {pct}%</p>
            <span
              className="inline-block px-3 py-1 rounded-full text-sm font-semibold"
              style={passed ? { background: 'var(--accent-teal-bg)', color: 'var(--accent-teal)', border: '1px solid var(--accent-teal-border)' }
                : { background: 'var(--accent-coral-bg)', color: 'var(--accent-coral)', border: '1px solid var(--accent-coral-border)' }}
            >
              {passed ? '✓ Pass' : '✗ Fail'} · {pct}% (cutoff: 50%)
            </span>
          </div>

          {/* Full review */}
          <div className="space-y-4">
            <h3 className="font-display text-18" style={{ color: 'var(--text-secondary)', fontFamily: 'Syne, sans-serif' }}>Question review</h3>
            {questions.map((q2, i) => {
              const userAnswer = answers[i];
              const correct = userAnswer === q2.correct_option;
              return (
                <div key={q2.id} className="p-5 rounded-2xl" style={{ background: 'var(--card-bg)', border: `1px solid ${correct ? 'var(--accent-teal-border)' : 'var(--accent-coral-border)'}` }}>
                  <div className="flex items-start gap-3 mb-3">
                    <span className="label" style={{ color: 'var(--text-muted)' }}>Q{i + 1}</span>
                    <p className="text-sm" style={{ color: 'var(--text-primary)' }}>{q2.dynamic_options?.question}</p>
                  </div>
                  <div className="flex gap-4 text-xs mb-3">
                    <span style={{ color: correct ? 'var(--success)' : 'var(--danger)' }}>Your answer: {userAnswer ?? '—'}</span>
                    <span style={{ color: 'var(--accent-teal)' }}>Correct: {q2.correct_option}</span>
                  </div>
                  {q2.detailed_explanation && (
                    <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>{q2.detailed_explanation}</p>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex gap-3">
            <Link href="/dashboard" className="px-5 py-2.5 rounded-xl text-sm font-semibold" style={{ background: 'var(--accent-teal)', color: '#071510' }}>
              Dashboard
            </Link>
          </div>
        </div>
      </Shell>
    );
  }

  if (!started) {
    return (
      <Shell nav={<AppNav activePage="Practice" />} toolbar={<AppToolbar activePage="Practice" />}>
        <div className="flex items-center justify-center min-h-[60vh] px-6">
          <div className="text-center max-w-sm animate-fade-in">
            <span className="label px-2 py-0.5 rounded mb-4 inline-block" style={{ color: 'var(--accent-amber)', background: 'var(--accent-amber-bg)', border: '1px solid var(--accent-amber-border)' }}>
              Mock Exam · Pro
            </span>
            <h2 className="font-display text-36 mb-2" style={{ color: 'var(--text-primary)', fontFamily: 'Syne, sans-serif' }}>
              {activeExam?.title ?? code}
            </h2>
            <p className="text-sm mb-2" style={{ color: 'var(--text-muted)' }}>
              {total} questions · No explanations during exam · Results shown on submission.
            </p>
            <p className="text-xs mb-8 p-3 rounded-lg" style={{ color: 'var(--accent-coral)', background: 'var(--accent-coral-bg)', border: '1px solid var(--accent-coral-border)' }}>
              ⚠ Forward-only navigation. You cannot go back to previous questions.
            </p>
            <button onClick={async () => {
                setStarted(true);
                if (activeExam?.id) {
                  try { const sid = await startSession(activeExam.id); setSessionId(sid); } catch { /* non-blocking */ }
                }
              }} className="px-8 py-3 rounded-xl text-sm font-semibold hover:opacity-90" style={{ background: 'var(--accent-teal)', color: '#071510' }}>
              Begin exam →
            </button>
          </div>
        </div>
      </Shell>
    );
  }

  return (
    <Shell
      nav={<AppNav showExitButton onExit={() => { if (window.confirm('Exit exam? Progress will be lost.')) window.history.back(); }} examCode={activeExam?.code} questionInfo={`Q ${currentIdx + 1} of ${total}`} />}
      toolbar={<AppToolbar activePage="Practice" />}
    >
      <div className="max-w-2xl mx-auto px-6 py-8 space-y-6 pb-24">
        <div>
          <span className="label mb-3 block" style={{ color: 'var(--text-muted)' }}>Question {currentIdx + 1} of {total}</span>
          <p className="text-15 font-medium leading-relaxed" style={{ color: 'var(--text-primary)' }}>
            {q?.dynamic_options?.question}
          </p>
        </div>

        {/* Options — no correctness feedback */}
        <div className="space-y-3">
          {options.map(([key, val]) => {
            const isSelected = answers[currentIdx] === key;
            return (
              <button
                key={key}
                onClick={() => handleSelect(key)}
                className="w-full flex items-start gap-4 p-4 rounded-xl text-left transition-all duration-150"
                style={{
                  background: isSelected ? 'var(--accent-teal-bg)' : 'var(--card-bg)',
                  border: `1px solid ${isSelected ? 'var(--accent-teal)' : 'var(--card-border)'}`,
                  color: isSelected ? 'var(--accent-teal)' : 'var(--text-secondary)',
                  borderRadius: 'var(--radius-lg)',
                }}
              >
                <span className="w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold flex-shrink-0" style={{ background: 'rgba(255,255,255,0.08)' }}>{key}</span>
                <span className="text-sm leading-relaxed">{val}</span>
              </button>
            );
          })}
        </div>

        {/* Question map */}
        <QuestionMap total={total} current={currentIdx} states={dotStates} hideCorrectness />

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <button onClick={handleFlag} className="px-4 py-2 rounded-lg text-sm" style={{ color: 'var(--accent-amber)', border: '1px solid var(--accent-amber-border)', background: 'var(--accent-amber-bg)' }}>
            {flagged.has(currentIdx) ? '🚩 Flagged' : '⚑ Flag for review'}
          </button>

          {currentIdx < total - 1 ? (
            <button onClick={() => setCurrentIdx(p => p + 1)} className="px-5 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90" style={{ background: 'var(--accent-teal)', color: '#071510' }}>
              Next →
            </button>
          ) : (
            <button onClick={handleSubmit} disabled={submitting} className="px-5 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 disabled:opacity-60" style={{ background: 'var(--accent-teal)', color: '#071510' }}>
              {submitting ? 'Submitting…' : 'Submit exam'}
            </button>
          )}
        </div>
      </div>
    </Shell>
  );
}
