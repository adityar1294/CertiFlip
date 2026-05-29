import { useState, useCallback } from 'react';
import { createSupabaseClient } from '@/lib/supabaseClient';

export interface MockSession {
  id: string;
  exam_id: string;
  started_at: string;
  submitted_at: string | null;
  answers: Record<string, string>;
  score: number | null;
  total: number | null;
  passed: boolean | null;
}

export function useMockSession() {
  const [session, setSession] = useState<MockSession | null>(null);
  const [loading, setLoading] = useState(false);

  const startSession = useCallback(async (examId: string): Promise<string> => {
    const supabase = createSupabaseClient();
    setLoading(true);
    const { data, error } = await supabase
      .from('mock_exam_sessions')
      .insert({ exam_id: examId, answers: {} })
      .select()
      .single();
    setLoading(false);
    if (error) throw new Error(error.message);
    setSession(data as MockSession);
    return (data as MockSession).id;
  }, []);

  const recordAnswer = useCallback(async (sessionId: string, questionId: string, option: string) => {
    const supabase = createSupabaseClient();
    const { data: existing } = await supabase
      .from('mock_exam_sessions')
      .select('answers')
      .eq('id', sessionId)
      .single();

    const currentAnswers = (existing as { answers: Record<string, string> } | null)?.answers ?? {};
    await supabase
      .from('mock_exam_sessions')
      .update({ answers: { ...currentAnswers, [questionId]: option } })
      .eq('id', sessionId);
  }, []);

  const submitSession = useCallback(async (
    sessionId: string,
    answers: Record<string, string>,
    questions: Array<{ id: string; correct_option: string }>,
    passMarkPct: number = 50
  ) => {
    const supabase = createSupabaseClient();
    const total = questions.length;
    const score = questions.filter(q => answers[q.id] === q.correct_option).length;
    const passed = score / total >= passMarkPct / 100;

    const { data } = await supabase
      .from('mock_exam_sessions')
      .update({ submitted_at: new Date().toISOString(), score, total, passed })
      .eq('id', sessionId)
      .select()
      .single();

    setSession(data as MockSession);
    return { score, total, passed };
  }, []);

  return { session, loading, startSession, recordAnswer, submitSession };
}
