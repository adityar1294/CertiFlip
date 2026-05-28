'use client';

import React from 'react';
import { useExams } from '@/hooks/useExams';
import Link from 'next/link';

export default function Dashboard() {
  const { data: exams, loading, error } = useExams();

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-teal-500 selection:text-slate-950">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-teal-900/20 via-slate-950 to-slate-950 -z-10 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-cyan-900/10 via-slate-950 to-slate-950 -z-10 pointer-events-none" />

      <main className="max-w-7xl mx-auto px-6 py-12">
        <header className="mb-12 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/25 text-teal-400 text-sm font-medium mb-4">
            <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
            Live Practice Exams
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent mb-4">
            CertiFlip Certification Portal
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl">
            Prepare for your NISM exams with our interactive practice platform. Track your progress and master the concepts.
          </p>
        </header>

        {loading && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="relative w-12 h-12">
              <div className="absolute inset-0 rounded-full border-4 border-teal-500/20" />
              <div className="absolute inset-0 rounded-full border-4 border-t-teal-400 animate-spin" />
            </div>
            <p className="text-slate-400 font-medium animate-pulse">Loading exam modules...</p>
          </div>
        )}

        {error && (
          <div className="p-6 rounded-2xl bg-red-950/30 border border-red-500/30 text-red-200 max-w-2xl mx-auto flex gap-4 items-start">
            <div className="p-2 rounded-lg bg-red-500/10 text-red-400">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m0-10.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.75c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.75h-.152c-3.196 0-6.1-1.249-8.25-3.286Zm0 13.036h.008v.008H12v-.008Z" />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-1">Failed to load exams</h3>
              <p className="text-sm text-red-300/80">{error}</p>
            </div>
          </div>
        )}

        {!loading && !error && exams && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {exams.map((exam, index) => {
              const isLarge = index === 0;
              return (
                <div
                  key={exam.id}
                  className={`group relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/40 backdrop-blur-sm p-8 transition-all duration-300 hover:-translate-y-1 hover:border-slate-700/60 hover:bg-slate-900/60 hover:shadow-2xl hover:shadow-teal-500/5 ${
                    isLarge ? 'md:col-span-2 md:row-span-1' : 'col-span-1'
                  }`}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-teal-500/0 via-transparent to-teal-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none group-hover:from-teal-500/[0.02] group-hover:to-teal-500/[0.04]" />
                  
                  <div className="flex flex-col h-full justify-between relative z-10">
                    <div>
                      <span className="inline-block px-3 py-1 rounded-md bg-slate-800 border border-slate-700/50 text-slate-300 text-xs font-semibold uppercase tracking-wider mb-6 group-hover:border-teal-500/30 group-hover:text-teal-400 transition-colors">
                        {exam.code}
                      </span>
                      
                      <h2 className="text-2xl font-bold tracking-tight text-white mb-3 group-hover:text-teal-300 transition-colors duration-300">
                        {exam.title}
                      </h2>
                      
                      <p className="text-slate-400 text-sm leading-relaxed mb-8 max-w-xl">
                        {exam.description || 'Practice questions designed for the certification syllabus.'}
                      </p>
                    </div>

                    <div>
                      <Link
                        href={`/exam/${exam.code}`}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-500 text-slate-950 font-semibold text-sm hover:bg-teal-400 hover:shadow-lg hover:shadow-teal-500/20 active:scale-95 transition-all duration-200"
                      >
                        Start Practice
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 transition-transform group-hover:translate-x-0.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
