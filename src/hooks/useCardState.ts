import { useState, useEffect, useCallback } from 'react';
import { createSupabaseClient } from '@/lib/supabaseClient';

export interface CardState {
  id: string;
  question_id: string;
  box: number;
  next_review_at: string;
  last_reviewed_at: string | null;
  correct_streak: number;
}

export function useCardState(questionId?: string) {
  const [state, setState] = useState<CardState | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!questionId) return;
    const supabase = createSupabaseClient();
    setLoading(true);

    supabase
      .from('user_card_state')
      .select('*')
      .eq('question_id', questionId)
      .maybeSingle()
      .then(({ data }) => {
        setState(data as CardState | null);
        setLoading(false);
      });
  }, [questionId]);

  const updateCardState = useCallback(async (qId: string, correct: boolean) => {
    const supabase = createSupabaseClient();
    const now = new Date();

    // Leitner box intervals (days): box1=1, box2=3, box3=7, box4=14, box5=30
    const intervals = [1, 3, 7, 14, 30];

    const { data: existing } = await supabase
      .from('user_card_state')
      .select('*')
      .eq('question_id', qId)
      .maybeSingle();

    const currentBox = (existing as CardState | null)?.box ?? 1;
    const newBox = correct ? Math.min(currentBox + 1, 5) : 1;
    const daysUntilReview = intervals[newBox - 1];
    const nextReview = new Date(now.getTime() + daysUntilReview * 24 * 60 * 60 * 1000);

    await supabase.from('user_card_state').upsert(
      {
        question_id: qId,
        box: newBox,
        next_review_at: nextReview.toISOString(),
        last_reviewed_at: now.toISOString(),
        correct_streak: correct ? ((existing as CardState | null)?.correct_streak ?? 0) + 1 : 0,
      },
      { onConflict: 'user_id,question_id' }
    );
  }, []);

  return { state, loading, updateCardState };
}
