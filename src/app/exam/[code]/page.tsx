'use client';

import React, { useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Shell from '@/components/Shell';
import { AppNav } from '@/components/TopNav';
import { AppToolbar } from '@/components/Toolbar';
import NoteInput from '@/components/NoteInput';
import QuestionMap from '@/components/QuestionMap';
import XpReward from '@/components/XpReward';
import { useExams } from '@/hooks/useExams';
import { useQuestions } from '@/hooks/useQuestions';
import { useNotes } from '@/hooks/useNotes';

type OptionKey = 'A' | 'B' | 'C' | 'D';

export default function ExamPage({ params }: { params: Promise<{ code: string }> }) {
  const resolvedParams = use(params);
  const code = resolvedParams?.code ?? '';
  const router = useRouter();

  const { data: exams, loading: examsLoading } = useExams();
  const activeExam = exams?.find(e => e.code.toLowerCase() === code.toLowerCase());
  const examId = activeExam?.id ?? '';

  const { data: questions, loading: questionsLoading } = useQuestions(examId);
  const { saveNote } = useNotes();

  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [history, setHistory] = useState<{ questionId: string; selected: string; correct: boolean }[]>([]);
  const [showSummary, setShowSummary] = useState(false);
  const [xpEarned, setXpEarned] = useState(0);

  const loading = examsLoading || (examId && questionsLoading);

  /* ── Loading ──────────────────────────────────────────────────────── */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--screen-bg)' }}>
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-t-transparent" style={{ borderColor: 'var(--accent-teal)', animation: 'spin 0.8s linear infinite' }} />
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Loading workspace…</p>
        </div>
      </div>
    );
  }

  if (!activeExam) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6" style={{ background: 'var(--screen-bg)' }}>
        <div className="text-center">
          <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>Exam module not found.</p>
          <Link href="/dashboard" className="text-sm font-medium" style={{ color: 'var(--accent-teal)' }}>← Back to dashboard</Link>
        </div>
      </div>
    );
  }

  /* ── Summary screen ───────────────────────────────────────────────── */
  if (showSummary) {
    const total = questions?.length ?? 0;
    const correct = history.filter(h => h.correct).length;
    const pct = total > 0 ? Math.round((correct / total) * 100) : 0;

    return (
      <Shell nav={<AppNav activePage="Dashboard" examCode={activeExam.code} />} toolbar={<AppToolbar activePage="Dashboard" />}>
        <div className="flex items-center justify-center min-h-[70vh] px-6 py-12">
          <div className="max-w-md w-full text-center animate-fade-in">
            <span className="label px-2 py-0.5 rounded mb-6 inline-block" style={{ color: 'var(--accent-teal)', background: 'var(--accent-teal-bg)', border: '1px solid var(--accent-teal-border)' }}>
              {activeExam.code}
            </span>
            <h2 className="font-display text-36 mb-2" style={{ color: 'var(--text-primary)', fontFamily: 'Syne, sans-serif' }}>Practice complete!</h2>
            <p className="text-sm mb-10" style={{ color: 'var(--text-muted)' }}>
              {correct} / {total} correct · <span style={{ color: pct >= 60 ? 'var(--success)' : 'var(--danger)' }}>{pct}%</span>
            </p>

            {/* Score ring */}
            <div className="relative w-32 h-32 mx-auto mb-8">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <path strokeWidth="3" stroke="var(--card-border)" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                <path strokeWidth="3.5" strokeLinecap="round" stroke="var(--accent-teal)" fill="none"
                  strokeDasharray={`${pct}, 100`}
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  style={{ transition: 'stroke-dasharray 1s ease-out' }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-display text-26 font-bold" style={{ color: 'var(--text-primary)', fontFamily: 'Syne, sans-serif' }}>{pct}%</span>
              </div>
            </div>

            {xpEarned > 0 && <XpReward xp={xpEarned} className="mb-6" />}

            <div className="flex gap-3 justify-center">
              <button
                onClick={() => { setCurrentIdx(0); setSelected(null); setSubmitted(false); setHistory([]); setShowSummary(false); setXpEarned(0); }}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90"
                style={{ background: 'var(--accent-teal)', color: '#071510' }}
              >
                Retake
              </button>
              <Link href="/dashboard" className="px-5 py-2.5 rounded-xl text-sm font-medium transition-all" style={{ background: 'var(--card-raised)', color: 'var(--text-secondary)', border: '1px solid var(--card-border)' }}>
                Dashboard
              </Link>
            </div>
          </div>
        </div>
      </Shell>
    );
  }

  /* ── Main workspace ───────────────────────────────────────────────── */
  const q = questions?.[currentIdx];
  const total = questions?.length ?? 0;
  const progressPct = total > 0 ? Math.round(((currentIdx + 1) / total) * 100) : 0;

  const dotStates = (questions ?? []).map((_, i) => {
    const h = history.find(h => h.questionId === questions?.[i]?.id);
    if (i === currentIdx) return 'active' as const;
    if (h) return (h.correct ? 'correct' as const : 'wrong' as const);
    return 'unanswered' as const;
  });

  const handleSubmit = () => {
    if (!selected || submitted || !q) return;
    const isCorrect = selected === q.correct_option;
    setHistory(prev => [...prev, { questionId: q.id, selected, correct: isCorrect }]);
    if (isCorrect) setXpEarned(prev => prev + 10);
    setSubmitted(true);
  };

  const handleNext = () => {
    if (currentIdx < total - 1) {
      setCurrentIdx(p => p + 1);
      setSelected(null);
      setSubmitted(false);
    } else {
      setShowSummary(true);
    }
  };

  const getOptionStyle = (key: string): React.CSSProperties => {
    if (!submitted) {
      return selected === key
        ? { background: 'var(--accent-teal-bg)', border: '1px solid var(--accent-teal)', color: 'var(--accent-teal)' }
        : { background: 'var(--card-bg)', border: '1px solid var(--card-border)', color: 'var(--text-secondary)' };
    }
    if (key === q?.correct_option) return { background: 'var(--accent-teal-bg)', border: '1px solid var(--accent-teal)', color: 'var(--accent-teal)' };
    if (key === selected) return { background: 'var(--accent-coral-bg)', border: '1px solid var(--accent-coral-border)', color: 'var(--accent-coral)' };
    return { background: 'var(--card-bg)', border: '1px solid var(--card-border)', color: 'var(--text-muted)', opacity: 0.5 };
  };

  const options = q ? Object.entries(q.dynamic_options).filter(([k]) => k !== 'question') as [OptionKey, string][] : [];

  return (
    <Shell
      nav={
        <AppNav
          showExitButton
          onExit={() => router.push('/dashboard')}
          examCode={activeExam.code}
          questionInfo={`Q ${currentIdx + 1} of ${total}`}
          xp={xpEarned}
        />
      }
      toolbar={<AppToolbar activePage="Practice" />}
    >
      {/* Progress strip */}
      <div className="h-0.5 w-full" style={{ background: 'var(--card-border)' }}>
        <div className="h-full transition-all duration-500" style={{ width: `${progressPct}%`, background: 'var(--accent-teal)' }} />
      </div>

      {/* Split layout */}
      <div className="flex-1 grid md:grid-cols-[1.15fr_0.85fr] gap-0 overflow-hidden">

        {/* Left — question */}
        <div className="flex flex-col p-6 md:p-10 overflow-y-auto" style={{ borderRight: '1px solid var(--screen-border)' }}>
          {/* Question header */}
          <div className="flex items-center justify-between mb-4">
            <span className="label" style={{ color: 'var(--accent-teal)' }}>Question {currentIdx + 1}</span>
            <button className="text-sm" style={{ color: 'var(--text-muted)' }} title="Bookmark">🔖</button>
          </div>

          {/* Question text */}
          <h2 className="text-15 font-medium leading-relaxed mb-8" style={{ color: 'var(--text-primary)' }}>
            {q?.dynamic_options?.question ?? ''}
          </h2>

          {/* Options */}
          <div className="space-y-3 mb-8">
            {options.map(([key, val]) => (
              <button
                key={key}
                disabled={submitted}
                onClick={() => setSelected(key)}
                className="w-full flex items-start gap-4 p-4 rounded-xl text-left transition-all duration-200"
                style={{ ...getOptionStyle(key), borderRadius: 'var(--radius-lg)' }}
              >
                <span className="w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5" style={{ background: 'rgba(255,255,255,0.08)' }}>
                  {key}
                </span>
                <span className="text-sm leading-relaxed">{val}</span>
              </button>
            ))}
          </div>

          {/* Question map + action */}
          <div className="mt-auto space-y-4">
            <QuestionMap total={total} current={currentIdx} states={dotStates} />
            <div className="flex justify-end">
              {!submitted ? (
                <button
                  disabled={!selected}
                  onClick={handleSubmit}
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90 disabled:opacity-40"
                  style={{ background: 'var(--accent-teal)', color: '#071510' }}
                >
                  Submit answer
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90 flex items-center gap-2"
                  style={{ background: 'var(--accent-teal)', color: '#071510' }}
                >
                  {currentIdx < total - 1 ? 'Next' : 'Finish'} →
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right — solution panel */}
        <div className="hidden md:flex flex-col p-8 overflow-y-auto space-y-6">
          <h3 className="font-display text-15" style={{ color: 'var(--text-secondary)', fontFamily: 'Syne, sans-serif' }}>
            Step-by-step solution
          </h3>

          {submitted && q ? (
            <div className="animate-fade-in space-y-4">
              {/* Explanation */}
              <div
                className="p-4 rounded-xl text-sm leading-relaxed whitespace-pre-line"
                style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', color: 'var(--text-secondary)', borderLeft: '3px solid var(--accent-teal)' }}
              >
                {q.detailed_explanation || 'No explanation provided for this question.'}
              </div>

              {/* Result chip */}
              <div
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium"
                style={
                  selected === q.correct_option
                    ? { background: 'var(--accent-teal-bg)', color: 'var(--accent-teal)', border: '1px solid var(--accent-teal-border)' }
                    : { background: 'var(--accent-coral-bg)', color: 'var(--accent-coral)', border: '1px solid var(--accent-coral-border)' }
                }
              >
                {selected === q.correct_option ? '✓ Correct' : '✗ Incorrect'}
                {selected !== q.correct_option && ` · Answer: ${q.correct_option}`}
              </div>

              {/* XP reward */}
              {selected === q.correct_option && <XpReward xp={10} />}

              {/* Related concepts */}
              <div className="p-4 rounded-xl" style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)' }}>
                <p className="label mb-2" style={{ color: 'var(--text-muted)' }}>Related concepts</p>
                <div className="flex flex-wrap gap-1.5">
                  {['Derivatives', 'Options', 'Risk management'].map(tag => (
                    <span key={tag} className="text-xs px-2 py-0.5 rounded-md" style={{ background: 'var(--card-raised)', color: 'var(--text-muted)' }}>{tag}</span>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <NoteInput questionId={q.id} onSave={saveNote} />
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-sm text-center" style={{ color: 'var(--text-muted)' }}>
                Submit your answer to see the explanation.
              </p>
            </div>
          )}
        </div>

      </div>
    </Shell>
  );
}
