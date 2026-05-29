import { useState, useEffect, useCallback } from 'react';
import { createSupabaseClient } from '@/lib/supabaseClient';

export interface QuestionNote {
  id: string;
  question_id: string;
  note: string;
  updated_at: string;
}

export function useNotes(questionId?: string) {
  const [note, setNote] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!questionId) return;
    const supabase = createSupabaseClient();
    setLoading(true);

    supabase
      .from('question_notes')
      .select('note')
      .eq('question_id', questionId)
      .maybeSingle()
      .then(({ data, error: err }) => {
        if (err) setError(err.message);
        else setNote(data?.note ?? '');
        setLoading(false);
      });
  }, [questionId]);

  const saveNote = useCallback(async (qId: string, text: string) => {
    const supabase = createSupabaseClient();
    const { error: err } = await supabase
      .from('question_notes')
      .upsert(
        { question_id: qId, note: text, updated_at: new Date().toISOString() },
        { onConflict: 'user_id,question_id' }
      );
    if (err) throw new Error(err.message);
  }, []);

  return { note, loading, error, saveNote };
}
