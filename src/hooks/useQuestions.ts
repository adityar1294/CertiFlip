import { useEffect, useState } from 'react';
import { createSupabaseClient } from '@/lib/supabaseClient';

export interface Question {
  id: string;
  exam_id: string;
  dynamic_options: Record<string, string>;
  correct_option: string;
  detailed_explanation: string;
  created_at: string;
}

export const useQuestions = (examId: string) => {
  const [data, setData] = useState<Question[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!examId) {
      setData([]);
      setLoading(false);
      return;
    }

    const supabase = createSupabaseClient();
    let isMounted = true;

    const fetchQuestions = async () => {
      try {
        setLoading(true);
        const { data: questions, error: fetchError } = await supabase
          .from('questions')
          .select('*')
          .eq('exam_id', examId);

        if (fetchError) {
          throw fetchError;
        }

        if (isMounted) {
          const typedQuestions: Question[] = (questions || []).map((q: any) => ({
            id: q.id,
            exam_id: q.exam_id,
            dynamic_options: q.dynamic_options as Record<string, string>,
            correct_option: q.correct_option,
            detailed_explanation: q.detailed_explanation,
            created_at: q.created_at,
          }));
          setData(typedQuestions);
          setError(null);
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err.message || 'An error occurred while fetching questions.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchQuestions();

    return () => {
      isMounted = false;
    };
  }, [examId]);

  return { data, loading, error };
};
