import { useState, useEffect } from 'react';
import { createSupabaseClient } from '@/lib/supabaseClient';

export interface ExamAttempt {
  id: string;
  exam_id: string;
  completed_at: string;
  score: number | null;
  total_questions: number | null;
}

export interface ResultsData {
  attempts: ExamAttempt[];
  totalQuestions: number;
  overallAccuracy: number;
  totalXp: number;
}

export function useResults() {
  const [data, setData] = useState<ResultsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createSupabaseClient();

    const fetch = async () => {
      try {
        setLoading(true);
        const { data: attempts, error: err } = await supabase
          .from('exam_attempts')
          .select('*')
          .order('completed_at', { ascending: false })
          .limit(50);

        if (err) throw err;

        const typed = (attempts ?? []) as ExamAttempt[];
        const totalQ = typed.reduce((s, a) => s + (a.total_questions ?? 0), 0);
        const totalCorrect = typed.reduce((s, a) => {
          const pct = a.score ?? 0;
          const t = a.total_questions ?? 0;
          return s + Math.round((pct / 100) * t);
        }, 0);

        setData({
          attempts: typed,
          totalQuestions: totalQ,
          overallAccuracy: totalQ > 0 ? Math.round((totalCorrect / totalQ) * 100) : 0,
          totalXp: typed.length * 50, // placeholder: 50 XP per session
        });
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : 'Failed to load results');
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, []);

  return { data, loading, error };
}
