import { useState, useEffect, useCallback } from 'react';
import { createSupabaseClient } from '@/lib/supabaseClient';

export function useBookmarks(examId?: string) {
  const [bookmarked, setBookmarked] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const supabase = createSupabaseClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }

      let query = supabase
        .from('user_bookmarks')
        .select('question_id');

      if (examId) {
        const { data: qids } = await supabase
          .from('questions')
          .select('id')
          .eq('exam_id', examId);
        const ids = (qids ?? []).map((q: { id: string }) => q.id);
        if (ids.length === 0) { setLoading(false); return; }
        query = query.in('question_id', ids);
      }

      const { data } = await query;
      setBookmarked(new Set((data ?? []).map((r: { question_id: string }) => r.question_id)));
      setLoading(false);
    };
    load();
  }, [examId]);

  const toggle = useCallback(async (questionId: string) => {
    const supabase = createSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const isBookmarked = bookmarked.has(questionId);

    if (isBookmarked) {
      await supabase
        .from('user_bookmarks')
        .delete()
        .eq('user_id', user.id)
        .eq('question_id', questionId);
      setBookmarked(prev => {
        const next = new Set(prev);
        next.delete(questionId);
        return next;
      });
    } else {
      await supabase
        .from('user_bookmarks')
        .insert({ user_id: user.id, question_id: questionId });
      setBookmarked(prev => new Set(prev).add(questionId));
    }
  }, [bookmarked]);

  return { bookmarked, loading, toggle };
}
