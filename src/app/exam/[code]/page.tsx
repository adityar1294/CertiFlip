'use client';

import React, { useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { useExams } from '@/hooks/useExams';
import { useQuestions } from '@/hooks/useQuestions';
import Link from 'next/link';

export default function ExamPage({ params }: { params: Promise<{ code: string }> }) {
  const resolvedParams = use(params);
  const code = resolvedParams?.code || '';
  const router = useRouter();

  const { data: exams, loading: examsLoading, error: examsError } = useExams();
  const activeExam = exams?.find(e => e.code.toLowerCase() === code.toLowerCase());
  const examId = activeExam?.id || '';

  const { data: questions, loading: questionsLoading, error: questionsError } = useQuestions(examId);

  // Quiz States
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [answersHistory, setAnswersHistory] = useState<{ questionId: string; selected: string; correct: boolean }[]>([]);
  const [showSummary, setShowSummary] = useState(false);

  const loading = examsLoading || (examId && questionsLoading);
  const error = examsError || questionsError || (!loading && !activeExam ? 'Exam module not found' : null);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center gap-4 text-white">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 rounded-full border-4 border-teal-500/20" />
          <div className="absolute inset-0 rounded-full border-4 border-t-teal-400 animate-spin" />
        </div>
        <p className="text-slate-400 animate-pulse font-medium">Loading workspace...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-white">
        <div className="p-6 rounded-2xl bg-red-950/30 border border-red-500/30 text-red-200 max-w-md w-full text-center">
          <h3 className="font-bold text-xl mb-2">Error Loading Exam</h3>
          <p className="text-sm text-red-300/80 mb-6">{error}</p>
          <Link href="/" className="inline-block px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-sm font-semibold transition-colors">
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  if (!questions || questions.length === 0) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-white">
        <div className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800 text-slate-300 max-w-md w-full text-center">
          <h3 className="font-bold text-xl mb-2">No Questions Available</h3>
          <p className="text-sm text-slate-400 mb-6">This exam module doesn't contain any questions yet.</p>
          <Link href="/" className="inline-block px-5 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-semibold text-sm transition-colors">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  if (showSummary) {
    const totalQuestions = questions.length;
    const correctCount = answersHistory.filter(ans => ans.correct).length;
    const percentage = Math.round((correctCount / totalQuestions) * 100);

    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6">
        <div className="max-w-xl w-full bg-slate-900/40 border border-slate-800 rounded-3xl p-10 backdrop-blur-md relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 to-transparent pointer-events-none" />
          
          <div className="text-center relative z-10">
            <span className="inline-block px-3 py-1 rounded-md bg-slate-800 border border-slate-700/50 text-slate-400 text-xs font-semibold uppercase tracking-wider mb-6">
              {activeExam?.code}
            </span>
            <h2 className="text-3xl font-extrabold mb-8 bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
              Practice Complete!
            </h2>
            
            <div className="relative w-36 h-36 mx-auto mb-8 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-slate-800"
                  strokeWidth="3"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-teal-400 transition-all duration-1000 ease-out"
                  strokeDasharray={`${percentage}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-4xl font-extrabold tracking-tight text-white">{percentage}%</span>
                <span className="text-xs text-slate-400 font-medium uppercase mt-0.5">Score</span>
              </div>
            </div>

            <p className="text-slate-300 text-lg mb-2 font-medium">
              You answered {correctCount} out of {totalQuestions} questions correctly.
            </p>
            <p className="text-slate-500 text-sm mb-10 max-w-sm mx-auto">
              {percentage >= 60 ? 'Well done! You are showing great progress for this module.' : 'Keep practicing to master this module syllabus.'}
            </p>

            <div className="flex gap-4 justify-center">
              <button
                onClick={() => {
                  setCurrentQuestionIndex(0);
                  setSelectedOption(null);
                  setHasSubmitted(false);
                  setAnswersHistory([]);
                  setShowSummary(false);
                }}
                className="px-6 py-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-sm transition-all duration-200"
              >
                Retake Exam
              </button>
              <Link
                href="/"
                className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm transition-all duration-200 border border-slate-700/50"
              >
                Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;
  const progressPercent = Math.round(((currentQuestionIndex + 1) / totalQuestions) * 100);

  const handleSubmitOption = () => {
    if (!selectedOption || hasSubmitted) return;
    const isCorrect = selectedOption === currentQuestion.correct_option;
    
    setAnswersHistory(prev => [
      ...prev,
      {
        questionId: currentQuestion.id,
        selected: selectedOption,
        correct: isCorrect,
      }
    ]);
    setHasSubmitted(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedOption(null);
      setHasSubmitted(false);
    } else {
      setShowSummary(true);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans flex flex-col relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-teal-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none" />

      <header className="border-b border-slate-900 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-6">
          <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-semibold">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0-7.5-7.5M3 12h18" />
            </svg>
            Exit Workspace
          </Link>
          
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              {activeExam?.code}
            </span>
            <span className="text-xs bg-slate-900 border border-slate-800 px-2 py-0.5 rounded text-slate-400 font-bold">
              {currentQuestionIndex + 1} / {totalQuestions}
            </span>
          </div>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-900">
          <div
            className="h-full bg-teal-500 transition-all duration-300 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-12 flex flex-col justify-center">
        <div className="bg-slate-900/20 border border-slate-900 rounded-3xl p-8 md:p-10 backdrop-blur-sm relative">
          
          <div className="mb-10">
            <span className="text-xs text-teal-400 font-bold uppercase tracking-wider block mb-2">Question {currentQuestionIndex + 1}</span>
            <h2 className="text-xl md:text-2xl font-bold leading-relaxed text-slate-100">
              {currentQuestion.dynamic_options?.question || 'Please review the options below and select the correct answer:'}
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-4 mb-8">
            {Object.entries(currentQuestion.dynamic_options)
              .filter(([key]) => key !== 'question')
              .map(([key, value]) => {
                const isSelected = selectedOption === key;
                const isCorrect = key === currentQuestion.correct_option;
                
                let cardStyle = 'border-slate-800 bg-slate-900/40 hover:border-slate-700/80 hover:bg-slate-900/60';
                let indicatorStyle = 'bg-slate-800 border-slate-700 text-slate-400';
                
                if (hasSubmitted) {
                  if (isCorrect) {
                    cardStyle = 'border-emerald-500 bg-emerald-500/10 text-emerald-200';
                    indicatorStyle = 'bg-emerald-500 text-slate-950 border-emerald-400';
                  } else if (isSelected) {
                    cardStyle = 'border-red-500 bg-red-500/10 text-red-200';
                    indicatorStyle = 'bg-red-500 text-white border-red-400';
                  } else {
                    cardStyle = 'border-slate-900 bg-slate-950/20 opacity-50';
                  }
                } else if (isSelected) {
                  cardStyle = 'border-teal-500 bg-teal-500/10 text-teal-200';
                  indicatorStyle = 'bg-teal-500 text-slate-950 border-teal-400';
                }

                return (
                  <button
                    key={key}
                    disabled={hasSubmitted}
                    onClick={() => setSelectedOption(key)}
                    className={`flex items-center gap-4 p-5 rounded-2xl border text-left transition-all duration-200 group/option ${cardStyle}`}
                  >
                    <span className={`w-8 h-8 rounded-lg border flex items-center justify-center font-bold text-sm transition-all duration-200 ${indicatorStyle}`}>
                      {key}
                    </span>
                    <span className="text-sm font-medium leading-relaxed">{value}</span>
                  </button>
                );
              })}
          </div>

          <div className="flex justify-end items-center gap-4 border-t border-slate-900/60 pt-6">
            {!hasSubmitted ? (
              <button
                disabled={!selectedOption}
                onClick={handleSubmitOption}
                className="px-6 py-3 rounded-xl bg-teal-500 text-slate-950 font-bold text-sm hover:bg-teal-400 hover:shadow-lg hover:shadow-teal-500/20 active:scale-95 disabled:opacity-40 disabled:hover:bg-teal-500 disabled:hover:shadow-none disabled:active:scale-100 transition-all duration-200"
              >
                Submit Answer
              </button>
            ) : (
              <button
                onClick={handleNextQuestion}
                className="px-6 py-3 rounded-xl bg-teal-500 text-slate-950 font-bold text-sm hover:bg-teal-400 hover:shadow-lg hover:shadow-teal-500/20 active:scale-95 transition-all duration-200 flex items-center gap-2"
              >
                {currentQuestionIndex < totalQuestions - 1 ? 'Next Question' : 'Finish Practice'}
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </button>
            )}
          </div>

          {hasSubmitted && (
            <div className="mt-8 p-6 bg-slate-950/60 border border-slate-900 rounded-2xl animate-fadeIn">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-teal-400">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
                </svg>
                Explanation
              </h4>
              <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line">
                {currentQuestion.detailed_explanation || 'No explanation provided for this question.'}
              </p>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
