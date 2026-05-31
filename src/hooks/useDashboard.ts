import { useState, useEffect } from 'react';
import { createSupabaseClient } from '@/lib/supabaseClient';
import type { Exam } from '@/hooks/useExams';

export interface RecentSession {
  id: string;
  examTitle: string;
  examCode: string;
  score: number;
  createdAt: string;
}

export interface ExamProgress {
  examId: string;
  examCode: string;
  examTitle: string;
  lastScore: number | null;
}

export interface DashboardData {
  totalDue: number;
  totalXp: number;
  streak: number;
  overallAccuracy: number;
  recentSessions: RecentSession[];
  examProgress: ExamProgress[];
}

export function computeStreak(dates: string[]): number {
  if (dates.length === 0) return 0;

  // Get unique calendar days (local time) sorted descending
  const days = Array.from(
    new Set(dates.map(d => new Date(d).toLocaleDateString('en-CA'))) // YYYY-MM-DD
  ).sort((a, b) => (a > b ? -1 : 1));

  const today = new Date().toLocaleDateString('en-CA');
  const yesterday = new Date(Date.now() - 864e5).toLocaleDateString('en-CA');

  // Streak must include today or yesterday to be active
  if (days[0] !== today && days[0] !== yesterday) return 0;

  let streak = 1;
  for (let i = 1; i < days.length; i++) {
    const prev = new Date(days[i - 1]);
    const curr = new Date(days[i]);
    const diffDays = Math.round((prev.getTime() - curr.getTime()) / 864e5);
    if (diffDays === 1) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}

export function useDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createSupabaseClient();

    const load = async () => {
      try {
        setLoading(true);

        // Fetch exams, attempts, and card states in parallel
        const [
          { data: exams },
          { data: attempts },
          { data: cardStates },
        ] = await Promise.all([
          supabase.from('exams').select('id, title, code'),
          supabase
            .from('exam_attempts')
            .select('id, exam_id, completed_at, score, total_questions')
            .order('completed_at', { ascending: false })
            .limit(50),
          supabase
            .from('user_card_state')
            .select('next_review_at')
            .lte('next_review_at', new Date().toISOString()),
        ]);

        const examMap = new Map<string, Exam>(
          ((exams ?? []) as Exam[]).map(e => [e.id, e])
        );

        const typedAttempts = (attempts ?? []) as {
          id: string;
          exam_id: string;
          completed_at: string;
          score: number | null;
          total_questions: number | null;
        }[];

        // Stats
        const totalQ = typedAttempts.reduce((s, a) => s + (a.total_questions ?? 0), 0);
        const totalCorrect = typedAttempts.reduce((s, a) => {
          const pct = a.score ?? 0;
          const t = a.total_questions ?? 0;
          return s + Math.round((pct / 100) * t);
        }, 0);

        // Recent sessions (up to 5)
        const recentSessions: RecentSession[] = typedAttempts.slice(0, 5).map(a => {
          const exam = examMap.get(a.exam_id);
          return {
            id: a.id,
            examTitle: exam ? exam.title : 'Practice',
            examCode: exam ? exam.code : '',
            score: a.score ?? 0,
            createdAt: a.completed_at,
          };
        });

        // Per-exam last score
        const examProgressMap = new Map<string, number | null>();
        for (const a of [...typedAttempts].reverse()) {
          examProgressMap.set(a.exam_id, a.score);
        }
        const examProgress: ExamProgress[] = ((exams ?? []) as Exam[]).map(e => ({
          examId: e.id,
          examCode: e.code,
          examTitle: e.title,
          lastScore: examProgressMap.get(e.id) ?? null,
        }));

        setData({
          totalDue: (cardStates ?? []).length,
          totalXp: typedAttempts.length * 50,
          streak: computeStreak(typedAttempts.map(a => a.completed_at)),
          overallAccuracy: totalQ > 0 ? Math.round((totalCorrect / totalQ) * 100) : 0,
          recentSessions,
          examProgress,
        });
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : 'Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  return { data, loading, error };
}

export function timeGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

export function formatSessionTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 60) return `${Math.max(1, mins)}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days} days ago`;
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}
